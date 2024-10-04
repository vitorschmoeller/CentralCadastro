"use client"
import { api } from "@/lib/api"
import {useRouter} from "next/navigation"
export const CardContainer = ({name, id} : {name: String, id: String}) => {
    const router = useRouter()
    async function handleDeleteMark(){

        try{
            const response = await api.delete("/api/mark", {
                params:{
                    id: id
                }
            })
            console.log(response.data)
            router.refresh()
        }catch(error){
            console.log(error)
        }
    }

    return(
        <div className="bg-white-100 border-2 border-b rounded-lg px-2 py-4 hover:scale-105 duration-500 shadow-sm mt-3">
            <span><b>ID: </b>{id} </span>
            <h3 className="text-xl">{name}</h3>

            <button 
                type="button" 
                className="bg-red-500 text-white rounded mt-2 font-bold px-2"
                onClick={handleDeleteMark}
                >
                Deletar
            </button>
        </div>
    )
}