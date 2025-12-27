import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Prisma } from "@prisma/client";
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({
                error: "You are not authorized to access this user information"
            }, { status: 401 })
        }

        const searchParms = request.nextUrl.searchParams

        const teamId = searchParms.get("teamId")

        const role = searchParms.get("role")

        const where: Prisma.UserWhereInput = {};
        if (user.role === Role.ADMIN) {

        } else if (user.role === Role.MANAGER) {
            where.OR = [{ teamId: user.teamId }, { role: Role.USER }]
        } else {
            where.teamId = user.teamId;
            where.role = { not: Role.ADMIN }
        }

        if (teamId) {
            where.teamId = teamId
        }

        if (role) {
            where.role = role as Role;
        }


        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                team: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdAt: true
            },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json({ users })
    } catch (error) {
        console.error("Get users error", error)
        return NextResponse.json({
            error: "Internal Server Error, Something went wrong"
        }, { status: 500 })
    }
}