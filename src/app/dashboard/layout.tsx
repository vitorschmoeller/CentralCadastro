import type { Metadata } from "next";
import { DashboardHeader } from "./components/Header";

export const metadata : Metadata = {
    title: "Dashboard - Central Cadastro",
    description: "Crud de produtos"
}

export default function DashboardLayout({children} : {children: React.ReactNode}){
    return(
        <>
            <DashboardHeader />
            {children}
        </>
    )
}