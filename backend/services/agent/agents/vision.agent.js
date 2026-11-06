import { getModel } from "./../config/llmModels.js";
import axios from "axios";

import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";

export const visionAgent = async (state) => {
  try {
    if (!state.prompt) {
      return { ...state, aiResponse: "❌ Error: No prompt provided." };
    }

    // 1. LLM Prompt Engineering
    let res;
    try {
      const llm = await getModel("image");
      res = await llm.invoke(`
      You are an elite AI image prompt engineer.
      Convert the user request into a highly detailed image generation prompt.
      Requirements: Cinematic lighting, Professional composition, Ultra realistic, High detail, 8K quality.
      Return only the image prompt.
      User Request: ${state.prompt}
      `);
    } catch (llmError) {
      console.error("LLM Error:", llmError);
      return { ...state, aiResponse: `❌ LLM Prompt Engineering failed: ${llmError.message}` };
    }

    const prompt = res.content.trim();
    console.log("Generated Prompt:", prompt);

    // 2. Image Generation (Pollinations AI)
    let imageRes;
    try {
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
      imageRes = await axios.get(imageUrl, { responseType: "arraybuffer", timeout: 30000 });
    } catch (apiError) {
      console.error("Image API Error:", apiError);
      return { ...state, aiResponse: `❌ Image Generation API failed: ${apiError.message}` };
    }

    // 3. S3 Upload
    let filename;
    try {
      const buffer = Buffer.from(imageRes.data);
      filename = `image-${Date.now()}.png`;
      await uploadToS3(filename, buffer, "image/png");
      console.log("S3 Upload Successful:", filename);
    } catch (uploadError) {
      console.error("S3 Upload Error:", uploadError);
      return { ...state, aiResponse: `❌ S3 Upload failed: ${uploadError.message}` };
    }

    // 4. S3 Download URL Retrieval
    try {
      const downloadUrl = await getFromS3(filename, 3600);
      return {
        ...state,
        aiResponse: `🖼️ Image Generated Successfully\n\n![Generated Image](${downloadUrl})\n\n📥 [Download Image](${downloadUrl})\n\n⏳ Link expires in 1 hour.`,
      };
    } catch (getError) {
      console.error("S3 Retrieval Error:", getError);
      return { ...state, aiResponse: `❌ S3 URL Retrieval failed: ${getError.message}` };
    }
  } catch (globalError) {
    console.error("Global Vision Agent Error:", globalError);
    return {
      ...state,
      aiResponse: `❌ Unexpected Error: ${globalError.message}`,
    };
  }
};
