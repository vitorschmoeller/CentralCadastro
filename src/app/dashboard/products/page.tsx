import Link from "next/link"
import { Container } from "@/components/Container"
import { Table } from "./components/Table"
import prismaClient from "@/lib/prisma"
import { Button } from "../components/Button"
export default async function Products(){

        const products = await prismaClient.product.findMany({
            include: {
                mark: true
            },
            orderBy:{
                createdAt: "desc"
            }
        })
        

        const marks = await prismaClient.mark.findMany()
        
    return(
        <main className="mt-9 mb-2">
            <Container>
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Produtos cadastrados</h1>
                    <div className="flex items-center gap-3">
                        <Button />
                        <Link href="/dashboard/products/new" className="bg-blue-500 text-white px-4 py-1 rounded">
                            Registrar produto
                        </Link>

                    </div>
                </div>

                <table className="min-w-full my-2">
                    <thead>
                        <tr className="flex-1">
                            <th className="font-medium text-left pl-1 ">Código EAN</th>
                            <th className="font-medium text-left pl-1 ">Nome</th>
                            <th className="font-medium text-left pl-1 ">Marca</th>
                            <th className="font-medium text-left pl-1 ">Data do Casdatro</th>
                            <th className="font-medium text-left pl-1">Preço</th>
                            <th className="font-medium text-left pl-1">#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <Table 
                                key={product.id} 
                                product={product}
                                mark={product.mark}
                                marks={marks}
                            />
                        ))}
                    </tbody>
                </table>
            </Container>
        </main>
    )
}