import { NextResponse } from "next/server";
import prismaClient from "@/lib/prisma"
import {getServerSession} from "next-auth"
import {authOptions} from "@/lib/auth"
export async function GET(request: Request){
    const session = await getServerSession(authOptions)
    
    if(!session || !session.user){
        return NextResponse.json({error : "Not authorized"} , {status: 401})
    }
    const {searchParams} = new URL(request.url)

    const nameProduct = searchParams.get("nameProduct")
    const searchCriteria = searchParams.get("searchCriteria")
    if(!nameProduct){
        return NextResponse.json({error: "Failed to find product"}, {status: 400})
    }

    
    if(searchCriteria === "name"){
        try{
            const product = await prismaClient.product.findFirst({
                where:{
                    name: {
                        contains: nameProduct,
                        mode: "insensitive"
                    }
                }
            });
            return NextResponse.json(product);
        }catch(error){
            return NextResponse.json({error: "Failed to find product"}, {status: 400})
        }
    }

    if(searchCriteria === "code"){
        try{
            const product = await prismaClient.product.findFirst({
                where:{
                    code: {
                        contains: nameProduct,
                        mode: "insensitive"
                    }
                }
            })
            return NextResponse.json(product)
        }catch(error){
            return NextResponse.json({error: "Failed to find product"}, {status: 400})
        }
    }

    if(searchCriteria === "price"){
        try{
            const product = await prismaClient.product.findFirst({
                where: {
                    price: Number(nameProduct) 
                }
            })
            return NextResponse.json(product)
        }catch(error){
            return NextResponse.json({error: "Failed to find product"}, {status: 400})
        }
    }


}

export async function DELETE(request: Request){
    const session = await getServerSession(authOptions)
    
    if(!session || !session.user){
        return NextResponse.json({error : "Not authorized"} , {status: 401})
    }

    const {searchParams} = new URL(request.url)

    const productId = searchParams.get("id")

    if(productId === null) {
        return NextResponse.json({error : "Failed to delete"}, {status: 400})
    }

    try{
        await prismaClient.product.delete({
            where:{
                id: productId as string
            }
        })

        return NextResponse.json({message: "Success to delete the produc"})
    }catch(error){
        return NextResponse.json({error : "Failed to delete"}, {status: 400})
    }
}

export async function PATCH(request: Request){
    const session = await getServerSession(authOptions)
    if(!session || !session.user){
        return NextResponse.json({error : "Not authorized"} , {status: 401})
    }

    const {name, id, code, price, markId, markName} = await request.json()

    const findProduct = await prismaClient.product.findFirst({
        where:{
            id: id as string
        }
    })

    if(!findProduct){
        return NextResponse.json({error: "Failed update the product"}, {status: 400})
    }

    try{
        await prismaClient.product.update({
            where: {
                id: id as string
            },
            data: {
                name: name as string,
                code: code as string,
                price: Number(price),
                markId: markId as string,
                markName: markName as string,
            }
        })

        return NextResponse.json({message: "Product updated successfully"})
    }catch(error){
        return NextResponse.json({error: "Failed to patch the data"}, {status: 400})
    }
}