import {NextResponse} from "next/server"
import {getServerSession} from "next-auth"
import {authOptions} from "@/lib/auth"

import prismaClient from "@/lib/prisma"


export async function GET(request: Request){
        const {searchParams} = new URL(request.url)
        const customerEmail = searchParams.get("email")


        if(!customerEmail || customerEmail === ""){
            return Response.json({error: "Customer not found or null"}, {status: 400})
        }

        try{
            const customer = await prismaClient.customer.findFirst({
                where: {
                    email: customerEmail
                }
            })


            return NextResponse.json(customer)
        }catch(error){
            console.log(error)

            return NextResponse.json({error: "Customer not found"}, {status: 400})
        }

        
}

export async function DELETE(request: Request){

    const session = await getServerSession(authOptions)

    if(!session || !session.user){
        return NextResponse.json({error: "Not authorized"}, {status: 401})
    }

    const {searchParams} = new URL(request.url);
    // localhost:3000/api/customer?id=123
    const customerId = searchParams.get("id")
    
    if(!customerId){
        return NextResponse.json({error: "Failed to delete the customer"}, {status: 400})
    }

    const findTickets = await prismaClient.ticket.findFirst({
        where:{
            customerId: customerId
        }
    })

    if(findTickets){
        return NextResponse.json({error: "Failed to delete the customer"}, {status: 400})
    }

    try{
        await prismaClient.customer.delete({
            where: {
                id: customerId as string
            }
        })

        return NextResponse.json({message: "Cliente deletado com sucesso!"})
    }catch(err){
        console.log(err)
        return NextResponse.json({message: "Failed to delete the customer"}, {status: 400})
    }

    
}

export async function POST(request: Request){
    const session = await getServerSession(authOptions)
    
    if(!session || !session.user){
        return NextResponse.json({error: "Not authorized"}, {status: 401})
    }

    const {name, email, phone, address, userId} = await request.json();
    
    try{
        await prismaClient.customer.create({
            data: {
                name: name,
                phone: phone,
                email: email,
                address: address ? address : "",
                userId: userId
            }
        })

        return NextResponse.json({message: "Cliente cadastrado com sucesso!"})
    }catch(err){
        return NextResponse.json({error: "Failed create new customer"}, {status: 400})
    }

    
}