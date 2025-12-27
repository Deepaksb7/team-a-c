import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient()

export async function checkDatabaseConnection(): Promise<boolean>{
    try{
        await prisma.$queryRaw`Select 1`
        return true
    }catch(err){
        console.error(`Database Connection Failed : ${err}`)
        return false
    }
}