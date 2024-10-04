"use client"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Input} from "../../../../components/Input"
import { api } from "@/lib/api"
import { CustomerDataInfo } from "../../page"

const schema = z.object({
    name: z.string().min(1, "Este campo é obrigatório"),
    description: z.string().min(1, "Descreva um pouco sobre seu problema")
})

type FormData = z.infer<typeof schema>

interface FormTicketProps {
    customer: CustomerDataInfo
}

export function FormTicket({customer}: FormTicketProps){

    const {register, handleSubmit, formState: {errors}, setValue} = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    async function handleRegisterTicket(data: FormData){

        try{
            const response = await api.post("/api/ticket", {
                    customerId: customer.id,
                    name: data.name,
                    description: data.description,
                
            })

            console.log(response.data)
            setValue("name", "")
            setValue("description", "")
        }catch(error){
            console.log(error)
        }

    }

    return(
        <form className="bg-slate-100 mt-6 py-6 px-4 rouded border-1" onSubmit={handleSubmit(handleRegisterTicket)}>
            <label htmlFor="name" className="mb-1 font-medium text-lg">Nome do chamado</label>
            <Input 
                register={register}
                name="name"
                placeholder="Digite o nome do chamado..."
                type="text"
                error={errors.name?.message}
            />

            <label htmlFor="description" className="mb-1 font-medium text-lg">Descreva o problema</label>
            <textarea
                className="w-full border-2 rounded-md h-24 resize-none px-2"
                placeholder="Descreva seu problema..."
                id="description"
                {...register("description")}
            >
            </textarea>
            {errors.description?.message && <p className="text-red-500 mt-1 mb-4">{errors.description.message}</p>}

            <button 
                type="submit"
                className="bg-blue-500 rounded-md w-full h-11 px-2 text-white font-bold text-lg"
            >
                Cadastrar
            </button>
        </form>
    )
}