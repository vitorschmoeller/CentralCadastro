import { Container } from "@/components/Container";
import Link from "next/link";
import { ProductForm } from "../components/ProductForm";
import {getServerSession} from "next-auth"
import {authOptions} from "@/lib/auth"
import { redirect } from "next/navigation";
import prismaClient from "@/lib/prisma"

export default async function RegisterProduct(){
    const session = await getServerSession(authOptions)
    if(session === null || session.user === null){
        redirect("/")
    }

    const marks = await prismaClient.mark.findMany()

    
    
    return(
        <main>
            <Container>
                <main className="mt-9 mb-2">
                    <div className="flex gap-2 items-center">
                        <Link href="/dashboard/products" className="bg-gray-900 px-4 py-1 text-white rounded">
                            Voltar
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-medium">Cadastrar Produto</h1>
                    </div>

                <ProductForm userId={session?.user.id} marks={marks} />
                </main>
            </Container>
        </main>
    )
}