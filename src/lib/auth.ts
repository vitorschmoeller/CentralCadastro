import {PrismaAdapter} from "@auth/prisma-adapter"
import type {Adapter} from 'next-auth/adapters'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import {AuthOptions} from 'next-auth'
import prismaClient from "./prisma"

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prismaClient) as Adapter,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        })
    ],
    //Propriedade que permite criar funções de retorno de chamada 
    callbacks: {
        async redirect({url, baseUrl}){
            return baseUrl + "/dashboard"
        },

        async session({session, token, user}){
            
            session.user = {...session.user, id: user.id} as {
                id: string,
                name: string,
                email: string,
                image: string,
            }
            

            return session
        }
    }

}