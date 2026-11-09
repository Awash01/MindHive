import api from "../../utils/axios"

export const verifyPayment= async (Payload)=>{
    try {
        const {data} = await api.post("/api/billing/verify",Payload)
        return data
    } catch (error) {
        console.log(error)
        return []
    }
}