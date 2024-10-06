"use client"
import {ChangeEvent, useEffect, useState} from "react"
import {ProductProps} from "@/utils/product.type"
import z from "zod"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Container} from "../../../components/Container"
import {useRouter} from "next/navigation"
import Link from "next/link"
import {api} from "../../../lib/api"
import { FiTrash2, FiEdit, FiCheck, FiX, FiRefreshCcw, FiSearch } from "react-icons/fi"

const schema = z.object({
    nameProduct: z.string().min(1, "Este campo é obrigatório")
})

type FormData = z.infer<typeof schema>

interface BrandProps {
    id: string;
    name: string;
}

export default function Search(){
    const [product, setProduct] = useState<ProductProps | null | undefined>()
    const [isEdit, setIsEdit] = useState(false)
    const [editableProduct, setEditableProduct] = useState<ProductProps>()
    const [searchCriteria, setSearchCriteria] = useState("name")
    const [brand, setBrand] = useState<BrandProps[]>()
    const router = useRouter()
    const {setValue, handleSubmit, register, setError, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    useEffect(() => {
        console.log(searchCriteria);
    }, [searchCriteria])

    const handleSearch = async (data: FormData) => {

        try{
            const response = await api.get("/api/search", {
                params: {
                    nameProduct: searchCriteria === "price" ? Number(data.nameProduct.replace(",",".")): data.nameProduct,
                    searchCriteria: searchCriteria,
                    
                }
            })
            if(response.data === null){
                setError("nameProduct", { type: "custom", message: "Ops, produto não foi encontrado"})
                return;
            }
            setProduct(response.data);
            setValue("nameProduct", "");
            setEditableProduct(response.data)
            
            
        }catch(error){
            console.log(error)
            setError("nameProduct", {type: "custom", message: "Ops, produto não foi encontrado. Tente digitar um preço ou alterar o critério de filtro"})
        }
    }

    const handleResetSearch = () => {
        setProduct(null)
        setIsEdit(false)
        setSearchCriteria("name")
    }

    const handleDelete = async (productId : String) => {
        
        try{
            const response = await api.delete("/api/search", {
                params:{
                    id: productId
                }
            })
            router.refresh()
            setProduct(null)
            console.log(response.data)
        }catch(error){
            console.log(error)
        }
        
    }

    const handleEditChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        
        const {name, value} = event.target

        if(name === "brand"){
            const selectBrand = brand?.find(brandSearch => brandSearch.id === value)
            
            setEditableProduct((prevState) => ({
                ...prevState,
                markId: selectBrand?.id as string,
                markName: selectBrand?.name as string
            }) as ProductProps)
        }else{

            setEditableProduct(prevState => ({
                ...prevState,
                [name]: value
            }as ProductProps))
        }

        
    }
    
    
    const handleCheckProduct = async () =>  {

        if(product === null || product === undefined){
            return alert("Dados corrompidos"); 
        }

        try{
            const response = await api.patch("/api/search", {
                    id: product.id as string,
                    name: editableProduct?.name as string,
                    code: editableProduct?.code as string,
                    markId: editableProduct?.markId as string,
                    markName: editableProduct?.markName as string,
                    price: editableProduct?.price
                    
            })

            router.refresh()
            setIsEdit(false)
        }catch(error){
            console.log(error)
        }
    }

    const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2
        })
    }

    useEffect(() => {
        const handleGetBrand = async () => {
            try{
                const {data : brands} = await api.get("/api/mark", {
                    headers: {
                        'Cache-Control': 'no-store',
                    }
                })
                setBrand(brands)
            }catch(error){
                console.log(error)
            }
        }

        handleGetBrand()
    },[])

    return(
        <div >
            <Container>
                <div className="w-full flex items-center justify-between  flex-col sm:flex-row">
                    <div className="flex w-full  items-center">
                        <Link href="/dashboard" className="py-2 px-4 bg-gray-900 text-white rounded mr-3">Voltar</Link>
                        <h1 className="text-xl sm:text-2xl">Procurar produto</h1>
                    </div>
                    {product ? (
                        <div className="mt-4 flex items-center gap-3 w-full justify-between">
                            <button
                                className="py-2 px-4 bg-green-500 rounded"
                                title="refresh" 
                                type="button"
                                onClick={() => router.refresh()}
                                >
                                <FiRefreshCcw size={24} color="#fff"/>                                
                            </button>
                            <button
                            type="button"
                            onClick={handleResetSearch}
                            className="bg-red-500 text-white py-2 px-4 rounded font-medium"
                            >
                                Procurar outro produto
                            </button>
                        </div>
                    ): (
                        <div className="flex items-center">
                            <label htmlFor="filter" className="text-[14px] font-medium mr-2 sm:text-[18px]">Filtrar por: </label>
                            <select onChange={(event) => setSearchCriteria(event.target.value)} className="py-2 px-4 bg-slate-100 border-2 rounded" name="filter" id="filter">
                                <option value="name">Nome do produto</option>
                                <option value="code">Código Ean</option>
                                <option value="price">Preço</option>
                            </select>
                        </div>
                    )}

                </div>
                <main className="flex flex-col mt-4 mb-2">
                    
                    {product ? (
                        <table className="min-w-full my-2">
                            <thead>
                                <tr className="flex-1">
                                    <th className="font-medium text-left pl-1 ">Código EAN</th>
                                    <th className="font-medium text-left pl-1 ">Nome</th>
                                    <th className="font-medium text-left pl-1 hidden sm:talbe-cell">Marca</th>
                                    <th className="font-medium text-left pl-1 hidden sm:table-cell">Data do Casdatro</th>
                                    <th className="font-medium text-left pl-1">Preço</th>
                                    <th className="font-medium text-left pl-1">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b-2  border-b-slate-200 h-16 last:border-b-0 bg-slate-100 hover:bg-gray-200 duration-300 ">
                                    <td className="text-left pl-1">
                                        {isEdit ? (
                                            <input
                                            className="py-1 px-1  rounded"
                                            type="text"
                                            min={1}
                                            placeholder="Alterar código EAN..."
                                            onChange={handleEditChange}
                                            name="code"
                                        />
                                        ): (
                                            editableProduct?.code
                                        )}
                                    </td>
                                    <td className="text-left pl-1">
                                        {isEdit ? (
                                            <input
                                                className="py-1 px-1  rounded"
                                                type="text"
                                                min={1}
                                                placeholder="Alterar nome..."
                                                onChange={handleEditChange}
                                                name="name"
                                            />
                                        ):(
                                            editableProduct?.name
                                        )}
                                    </td>
                                    <td className="text-left pl-1 hidden sm:tabel-cell">
                                        {isEdit ? (
                                            <select 
                                                name="brand" 
                                                id="brand"
                                                value={editableProduct?.markId as string}
                                                onChange={handleEditChange}
                                            >
                                                {brand?.map((currencyBrand) => (
                                                    <option value={currencyBrand.id} key={currencyBrand.id}>
                                                        {currencyBrand.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ): (
                                            editableProduct?.markName
                                        )}
                                    </td>
                                    <td className="text-left pl-1 hidden sm:table-cell">{product.createdAt && new Date(product.createdAt).toLocaleDateString("pt-BR")}</td>
                                    <td className="text-left pl-1">
                                    {isEdit ? (
                                            <input
                                                className="py-1 px-1  rounded"
                                                type="number"
                                                min={1}
                                                placeholder="Alterar Preço..."
                                                onChange={handleEditChange}
                                                name="price"
                                            />
                                        ):(
                                            formatCurrency(editableProduct?.price as number)
                                        )}
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            {isEdit ? (
                                                <>
                                                    <button 
                                                        type="button"
                                                        title="confirm"
                                                        onClick={handleCheckProduct}
                                                    >
                                                        <FiCheck size={24} color="green" />
                                                    </button>
                                                    <button
                                                        title="close"
                                                        type="button"
                                                        onClick={() => setIsEdit(false)}
                                                    >
                                                        <FiX size={24} color="red"/>
                                                    </button>
                                                </>
                                            ):(
                                                <>
                                                    <button
                                                        title="delete"
                                                        type="button"
                                                        onClick={() => handleDelete(product.id)}
                                                    >
                                                        <FiTrash2 size={24} color="red" />
                                                    </button>
                                                    <button
                                                        title="edit"
                                                        type="button"
                                                        onClick={() => setIsEdit(true)}
                                                    >
                                                        <FiEdit size={24} color="#3b82f6" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    ): (
                        <form 
                        className="flex flex-col gap-4 items-center"
                        onSubmit={handleSubmit(handleSearch)}
                        >
                        
                        <input 
                            className="w-full border-2 h-11 px-2 text-lg rounded items-center " 
                            type="text" 
                            placeholder="Digite o nome..." 
                            {...register("nameProduct")}
                            />
                            {errors.nameProduct?.message && <p className="self-start text-red-500">{errors.nameProduct?.message}</p>}
                            <button
                                type="submit"
                                className="w-full bg-blue-500 flex py-3 justify-center text-white gap-1 text-lg font-bold rounded items-center" 
                            >
                                Procurar <FiSearch size={24} color="#fff"/>
                                </button>
                        </form>
                    )}
                </main>
            </Container>
        </div>
    )
}