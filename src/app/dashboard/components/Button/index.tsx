"use client"
import { useRouter } from "next/navigation"
import {FiRefreshCcw} from "react-icons/fi"

export function Button(){
    const router = useRouter()

    const handleRefresh = () => {
        router.refresh()
    }
    return(
        <button
        className="bg-green-600 px-4 py-1 rounded"
        type="button" 
        title="refresh" 
        onClick={handleRefresh}
        
        >
            <FiRefreshCcw size={24} color="#fff"/>
        </button>
    )
}