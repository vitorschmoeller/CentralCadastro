import Image from "next/image"
import hero from "@/assets/undraw_Hero_2.svg"
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">

      <h2 className="text-2xl font-medium mb-2">Gerencie sua empresa</h2>
      <h1 className="font-bold text-3xl mb-8 text-purple-400 text-center">Atendimentos, Clientes, Cadastro, Marcas, Produtos</h1>

      <Image 
        src={hero}
        alt="Imagem Hero"
        width={600}
        className="max-w-lg md:max-w-xl w-[460px] sm:w-[600px]"
        priority={true}
      />
    </main>
  );
}
