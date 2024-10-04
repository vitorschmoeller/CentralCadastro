"use client"
import { FiTrash2, FiEdit, FiCheck, FiX } from "react-icons/fi"
import { ProductProps } from "@/utils/product.type"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { ChangeEvent, useState } from "react"
type MarkProps = {
    id: string;
    name: string;
}

type ProductItem = {
    product: ProductProps;
    mark: MarkProps | null
    marks: MarkProps[]
}


export const Table = ({mark, product, marks}: ProductItem) => {
    const [isEditing, setisEditing] = useState(false)
    const [editableProduct, setEditableProduct] = useState<ProductProps>(product)
    
    const router = useRouter()

    function formatCurrency(value : number){
        return value.toLocaleString("pt-BR",{
            style:'currency',
            currency:"BRL",
            minimumFractionDigits:2
        })
    }

    function handleDelete(){
        try{
            const response = api.delete("/api/product", {
                params:{
                    id: product.id
                }
            })
            console.log(response)
            router.refresh()
        }catch(err){
            console.log(err)
        }
    }

    function handleEditChange(event : ChangeEvent<HTMLInputElement | HTMLSelectElement>){
        
        const {name, value} = event.target
        
        if(name === "mark"){
            const selectMark = marks.find(mark => mark.id === value);
            
            setEditableProduct((prevState) => ({
                ...prevState,
                markId: selectMark?.id as string,
                markName: selectMark?.name as string
                
            }))
        }else{
            setEditableProduct(prevState => ({
                ...prevState,
                [name]: value
            }))

        }

    }

    async function handleSubmitEdit(){
        try {
            await api.patch("/api/product", {
                id: editableProduct.id,
                name: editableProduct.name,
                code: editableProduct.code,
                price: Number(editableProduct.price),
                markId: editableProduct.markId,
                markName: editableProduct.markName
                
            })


            setisEditing(!isEditing)
            router.refresh()
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <>
            <tr className="border-b-2 border-b-slate-200 h-16 last:border-b-0 bg-slate-100 hover:bg-gray-200 duration-300"> 
                <td className="text-left pl-1">
                    {isEditing ? (
                        <input
                            className="border-gray-300 border-2 pl-1  sm:w-[250px] "
                            type="text" 
                            name="code"
                            value={editableProduct.code}
                            onChange={handleEditChange}
                            placeholder="Digite novo ean..."
                        />
                    ):(
                        product.code
                    )}

                </td>
                <td className="text-left pl-1">
                    
                    {isEditing ? (
                        <input
                            className="border-gray-300 border-2 w-[130px] pl-1 sm:w-[250px]"
                            type="text"
                            name="name"
                            value={editableProduct.name}
                            placeholder="Digite novo nome..."
                            onChange={handleEditChange}
                        />
                    ): (
                        product.name
                    )}
                    
                </td>
                <td className="text-left pl-1 w-[111px] ">
                    {isEditing ? (
                        <select 
                            name="markId" 
                            onChange={handleEditChange}
                            value={editableProduct.markId as string} 
                        >
                            {marks.map((currentMark) => (
                                <option key={currentMark.id} value={`${currentMark.id}`}>
                                    {currentMark.name}
                                </option>
                            ))}
                        </select>
                    ): (
                        mark?.name
                    )}
                </td>
                <td className="text-left pl-1 hidden sm:table-cell">{product.createdAt.toLocaleDateString("pt-BR")}</td>
                <td className="text-left pl-1">
                    {isEditing ? (
                        <>
                            <input
                                className="border-gray-300 border-2 pl-1 w-[50px] sm:w-[100px]"
                                type="number" 
                                name="price"
                                value={editableProduct.price}
                                placeholder="Digite novo preço..."
                                onChange={handleEditChange}
                                />
                        </>
                    ): (
                        formatCurrency(product.price)
                    )}
                </td>
                <td>
                    {isEditing ? (
                        <>
                        <button 
                            onClick={handleSubmitEdit}
                            type="button"
                            title="save"
                            className="mr-2"
                            >
                                <FiCheck size={24} color="#10b981"/>
                        </button>
                        <button 
                            type="button"
                            title="Cancel"
                            className="mr-2"
                            onClick={() => setisEditing(false)}
                            >
                                <FiX size={24} color="#ef4444"/>
                        </button>
                        </>
                    ):(
                        <>
                            <button
                                onClick={handleDelete}
                                type="button" 
                                title="Delete" 
                                className="mr-2"
                            >
                                <FiTrash2 size={24} color="#Ef4444"/>
                            </button>
                            <button 
                                onClick={() => setisEditing(true)}
                                type="button" 
                                title="Open">
                                <FiEdit size={24} color="#3b82f6"  />
                            </button>
                        </>
                    )}
                </td>
            </tr>
        </>
    )
}




