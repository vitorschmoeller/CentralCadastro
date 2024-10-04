import { Container } from "@/components/Container";
import Link from "next/link";
import {getServerSession} from "next-auth"
import {authOptions} from "@/lib/auth"
import { redirect } from "next/navigation";
import prismaClient from "@/lib/prisma"

export default async function NewMark(){

    const session = await getServerSession(authOptions)

    if(!session || !session.user){
        redirect("/")
    }

    async function handleRegister(formData : FormData){
        "use server"

        const mark = formData.get("mark")
        

        try{
            const response = await prismaClient.mark.create({
                data: {
                    name: mark as string
                }
            })

            console.log(response);

        }catch(error){
            console.log(error);
        }
    }

    return(
        
        <main className="mt-9 mb-2">
            <Container>
                <div className="flex items-center gap-3 ">
                    <Link 
                        className="bg-gray-900 px-4 py-1 text-white rounded"
                        href="/dashboard/"
                    >
                        Voltar
                    </Link>
                    <h1 className="text-3xl font-bold">Cadastro de marcas</h1>
                </div>
                <form action={handleRegister} className="flex flex-col mt-9">
                    <label 
                        htmlFor=""
                        className="mb-1 text-lg font-medium"
                    >
                        Nome da Marca
                    </label>
                    <input 
                        type="text" 
                        placeholder="Digite o nome da marca" 
                        className="h-11 w-full px-4 border-2 rounded mb-4"
                        name="mark"
                        required
                    />
                    <button
                        type="submit"
                        className="text-xl w-full bg-blue-500 px-4 h-11 text-white rounded font-medium"
                    >
                        Registrar
                    </button>
                </form>
            </Container>
        </main>
    )
}