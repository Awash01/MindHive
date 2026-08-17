import api from "../../utils/axios";

const getCurrentUser=async () => {
    try {
        const { data } = await api.get("/api/me");
        console.log("Current user data:", data);
        return data;
    } catch (error) {
        console.log("Error fetching current user:", error);
        return null;
    }   
}    
export default getCurrentUser;