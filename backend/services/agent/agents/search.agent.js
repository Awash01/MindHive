import { deductCredits } from "../utils/deductCredits.js";
import { searchTool } from "./../config/tavily.js";

export const searchAgent = async (state) => {
  try {
    const results = await searchTool.invoke({
      query:state.prompt,
    });
    await deductCredits(state.userId,"search")
    console.log(results);
    return {
      ...state,
      searchResults: results.results?.slice(0, 3),
      images: results.images,
    };
  } catch (error) {

    return {
      ...state,
      searchResults: [],
      images: [],
    };
  }
};
