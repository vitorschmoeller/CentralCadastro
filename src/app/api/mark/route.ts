import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prismaClient from "@/lib/prisma"

export async function GET(resquest : Request){
    const session = await getServerSession(authOptions)


    if(!session || !session.user){
        redirect("/")
    }

    try{
        const response = await prismaClient.mark.findMany()
        return NextResponse.json(response)
    }catch(error){
        console.log("Error to search the data", error)

        return NextResponse.json({error: "Error to search the data"}, {status: 500})
    }
}

export async function DELETE(request: Request){

    const session = await getServerSession(authOptions)

    if(!session || !session.user){
        redirect("/")
    }

    const {searchParams} = new URL(request.url)

    const branchId = searchParams.get("id")

    if(!branchId){
        return NextResponse.json({error: "Error in deleting the brand"}, {status: 400})
    }

    try {
        await prismaClient.mark.delete({
            where: {
                id: branchId as string
            }
        })
        return NextResponse.json({message: "Success in deleting the brand"}, {status: 200})
    } catch (error) {
        
        return NextResponse.json({error: "Error in deleting the brand"}, {status: 400})
    }
}