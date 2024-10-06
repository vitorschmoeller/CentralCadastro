import { Container } from "@/components/Container"
import Link from "next/link"
import Image from "next/image"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
export const DashboardHeader = async () => {

    const session = await getServerSession(authOptions);

    const profilePicture = session?.user.image

    return(
        <Container>
            <header className="w-full bg-gray-900 my-4 p-3 rounded flex  items-center justify-between">
                <div className="flex items-center gap-4 flex-wrap">
                    <Link href="/dashboard" className="text-white hover:font-bold duration-300">
                        Chamados
                    </Link>
                    <Link className="text-white hover:font-bold duration-300" href="/dashboard/customer">
                        Clientes
                    </Link>
                    <Link className="text-white hover:font-bold duration-300" href="/dashboard/products">
                        Produtos
                    </Link>
                    <Link className="text-white hover:font-bold duration-300" href="/dashboard/mark">
                        Marca
                    </Link>
                    <Link className="text-white hover:font-bold duration-300" href="/dashboard/search">
                        Pesquisa
                    </Link>
                </div>
                {profilePicture && <Image className="mr-2 rounded-[50%] border-2 shadow-sm hover:scale-105 duration-500" alt="perfil" src={profilePicture} width={36} height={36}/>}
            </header>
        </Container>
    )
}