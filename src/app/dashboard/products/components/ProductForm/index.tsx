"use client"
import z from "zod"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

type Mark = {
    id: string;
    name: string;
}

type ProductFormProps = {
    userId: string;
    marks: Mark[]
}

const schema = z.object({
    code: z.string().min(2, "Este campo é obrigatório"),
    name: z.string().min(1, "Este campo é obrigatório"),
    price: z.string().regex(/^\d+,\d{2}$/, "O preço deve estar no formato 0,00").min(1,"Este campo é obrigatório"),
    mark: z.string()
})

type formData = z.infer<typeof schema>

export const ProductForm = ({marks , userId} : ProductFormProps) => {
    
    const {handleSubmit, register, formState : {errors}} = useForm<formData>({
        resolver: zodResolver(schema)
    })

    const router = useRouter()

    async function handleRegister(data: formData){
        console.log(data)
        console.log(userId)

        const [markId, markName] = data.mark.split('|')

        const response = await api.post("/api/product", {
            code: data.code,
            name: data.name,
            price: data.price,
            userId: userId,
            markName: markName,
            markId: markId,
        })

        console.log(data.mark)
        router.refresh();
        router.replace("/dashboard/products");
    }
    
    const formatPriceInput = (value: string): string => {
        let formattedValue = value.replace(/[^0-9,]/g, '');

        const match = formattedValue.match(/^(\d+),(\d{0,2})/);

        if(match){
            formattedValue = `${match[1]},${match[2]}`;
        }
        return formattedValue
    }

    return(
        <form className="my-4 max-w-full w-full" onSubmit={handleSubmit(handleRegister)}>
            <div className="flex-1 flex-col mb-2">
                <label 
                    htmlFor="code"
                    className="mb-1 text-lg font-medium"
                >
                    Código Ean
                </label>
                <input 
                    type="text" 
                    placeholder="Digite o código..." 
                    className="w-full border-2 px-2 h-11 rounded"
                    id="code"
                    {...register("code")}
                />
                <span className="text-red-500">{errors.code?.message}</span> 
            </div>
            <div className="flex-1 flex-col mb-2">
                <label 
                    htmlFor="product"
                    className="mb-1 text-lg font-medium"
                >
                    Nome do Produto
                </label>
                <input 
                    type="text" 
                    placeholder="Digite o código..." 
                    className="w-full border-2 px-2 h-11 rounded"
                    id="product"
                    {...register("name")}
                />
                <span className="text-red-500">{errors.name?.message}</span> 
            </div>
            <div className="flex gap-2 flex-col sm:flex-row mb-2">
                <div className="flex-1 w-full items-center ">
                    <label 
                        htmlFor="code"
                        className="mb-1 text-lg font-medium"
                        >
                        Marca
                    </label>
                    <select className="w-full border-2 px-2 h-11 rounded" {...register("mark")}>
                        {marks.map((mark) => (
                            <option key={mark.id} value={`${mark.id}|${mark.name}`}>{mark.name}</option>
                        ))}
                    </select>
                        
                </div>
                <div className="flex-1 w-full">
                    <label 
                        htmlFor="price"
                        className="mb-1 text-lg font-medium"
                        >
                        Preço
                    </label>
                    <input 
                        id="price"
                        type="text"
                        placeholder="Digite o preço..." 
                        className="w-full border-2 px-2 h-11 rounded"
                        {...register("price")}
                        pattern="^\d+,\d{2}$"
                        onInput={(e: React.FormEvent<HTMLInputElement>) => {
                            e.currentTarget.value = formatPriceInput(e.currentTarget.value);
                        }}
                    />
                    <span className="text-red-500">{errors.price?.message}</span> 
                </div>
            </div>
            <button type="submit" className="text-lg p-2 bg-blue-500 font-medium text-white w-full mt-4 rounded">Cadastrar</button>
        </form>
    )
}