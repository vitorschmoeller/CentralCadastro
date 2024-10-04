import {NextResponse} from "next/server"
import { getServerSession } from "next-auth"
import prismaClient from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request){

    const session = await getServerSession(authOptions)
    if(!session || !session.user){
        return NextResponse.json({error: "Not authorized"}, {status: 401})
    }


    const {code, name, markId, price, userId, markName} = await request.json()
    
    try{
        await prismaClient.product.create({
            data: {
                code: code,
                name: name,
                markId: markId,
                price: Number(price.replace(",",".")),
                userId: userId,
                markName: markName
            }
        })

        return NextResponse.json({message: "Sucess create new product"})
    }catch(err){
        return NextResponse.json({error: "Failed create new product"}, {status: 400})
    }
}

export async function DELETE(request: Request){
    const session = await getServerSession(authOptions)
    if(!session || !session.user){
        return NextResponse.json({error: "Not authorized"}, {status: 401})
    }

    const {searchParams} = new URL(request.url);
    const productId = searchParams.get("id")


    try{

        await prismaClient.product.delete({
            where: {
                id : productId as string
            }
        })
        return NextResponse.json({message : "Success to delete the product"})
    }catch(err){
        console.log(err)

        return NextResponse.json({message: "Failed to delete the product"}, {status: 400})
    }

    

}

export async function PATCH(request: Request){
    const session = await getServerSession(authOptions);

    if(!session || !session.user){
        return NextResponse.json({error : "Not authorized"})
    }

    const {id, name, code, price, markId, markName} = await request.json()
        
    const findProduct = await prismaClient.product.findFirst({
            where: {
                id: id as string
            }
        })

        if(!findProduct){
            return NextResponse.json({error: "Failed update the product"}, {status: 400})
        }

    try {
        
        await prismaClient.product.update({
            where: {
                id: id as string
            },
            data: {
                name: name as string,
                code: code as string,
                price: price,
                markId: markId as string,
                markName: markName as string
            }
        })

        return NextResponse.json({message: "Success to update the product"})
    } catch (error) {
        
        console.log(error)
        return NextResponse.json({error: "failed"}, {status: 400})
    }
}