import { Container } from "@/components/Container"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { CardContainer } from "./components/CardContainer"
import prismaClient from "@/lib/prisma"
export default async function Mark(){
    const session = await getServerSession(authOptions)

    if(!session || !session.user){
        redirect("/")
    }

    const marks = await prismaClient.mark.findMany()

    
    return(
        <main className="mt-9 mb-2">
            <Container>
                <div className="flex items-center justify-between px-2">
                    <h1 className="text-3xl font-bold">Marcas</h1>
                    <div>
                        <Link 
                            className="bg-blue-500 text-white font-medium py-2 px-4 rounded" 
                            href={"/dashboard/mark/new"}
                        >
                            Cadastrar
                        </Link>
                    </div>
                </div>
                <section className="px-2 grid grid-cols-1 sm:grid-cols-3 w-full gap-3 ">
                    {marks.map((mark => (
                        <CardContainer key={mark.id} id={mark.id} name={mark.name}/>
                    )))}
                    
                </section>
            </Container>
        </main>
    )
}