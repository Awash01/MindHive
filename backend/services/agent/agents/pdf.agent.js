import { getModel } from "../config/llmModels.js";
import generatePdf from "../utils/generatePdf.js";
import { uploadToS3 } from './../utils/uploadToS3.js';
import { getFromS3 } from './../utils/getFromS3.js';

export const pdfAgent = async (state) => {
  try {
    const llm = await getModel("pdf");
    const prompt = `
You are an expert document writer.

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return explanations.

Structure:

{
  "title": "",
  "subtitle": "",
  "sections": [
    {
      "heading": "",
      "points": []
    }
  ]
}

Generate 4-8 sections.

Each section should have 3-6 concise bullet points.

Topic:

${state.prompt}
`;

   const res = await llm.invoke(prompt)
   const data = JSON.parse(res.content)
   const pdfBuffer = await generatePdf(data)
   const filename = `pdf-${Date.now()}.pdf`
   await uploadToS3(filename, pdfBuffer, 'application/pdf')
   const downloadUrl = await getFromS3(filename, 60 * 60) // 1 hour expiration
   return {
    ...state,
    aiResponse: `✅ **PDF Successfully Generated!**\n\n📄 **Download your document here:**\n[Click to Download PDF](${downloadUrl})\n\n⏳ *Note: This link expires in 1 hour.*`,
   }
  } catch (error) {
    console.log(error)
    return {
      ...state,
      aiResponse: `❌ **Error Generating PDF:** ${error.message}`,
    }
  }
};
