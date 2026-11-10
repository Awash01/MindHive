import { getModel } from "../config/llmModels.js";
import { deductCredits } from "../utils/deductCredits.js";
import  generatePpt  from "../utils/generatePpt.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";


export const pptAgent = async (state) => {
  try {
    const llm = await getModel("ppt");
    const prompt = `You are a professional presentation designer.

Return ONLY valid JSON.

Format:

{
"title":"",
"subtitle":"",
"slides":[
{
"title":"",
"points":[
"",
"",
"",
""
]
}
]
}

Rules:

- Generate exactly 6 content slides.
- Each slide should have 4-6 concise bullet points.
- No markdown.
- No explanation.
- No code block.
- Return ONLY JSON.

Topic:

${state.prompt}`;

    const res = await llm.invoke(prompt);
    const data = JSON.parse(res.content);
    await deductCredits(state.userId,"ppt")
    const ppt = await generatePpt(data);

    // PptxGenJS write() returns a promise that resolves to the file or buffer depending on the method
    const buffer = await ppt.write("nodebuffer");

    const filename=`ppt-${Date.now()}.pptx`;
    await uploadToS3(filename, buffer, 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    const downloadUrl = await getFromS3(filename, 60 * 60); // 1 hour expiration
    return {
      ...state,
      aiResponse: `✅ **PPT Successfully Generated!**\n\n📄 **Download your presentation here:**\n[Click to Download PPT](${downloadUrl})\n\n⏳ *Note: This link expires in 1 hour.*`,
    };
  } catch (error) {
    console.log(error);
    return {
      ...state,
      aiResponse: `❌ **Error Generating PPT:** ${error.message}`,
    };
  }
};
