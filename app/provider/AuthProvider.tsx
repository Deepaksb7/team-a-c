"use client"
import { createContext, ReactNode, useActionState, useState } from "react";
import { AuthContextType, User } from "../types";
import { apiClient } from "../lib/apiClient";

type LoginState ={
    success?: boolean,
    user?: User | null,
    error?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({children}:{children: ReactNode})=>{
    const [user,setUser] = useState<User | null>(null)

    const [loginState, loginAction , isLoginPending] = useActionState(
        async (
            prevState: LoginState,
            formData: FormData,
        ):Promise<LoginState>=>{
            const email = formData.get("email") as string
            const password = formData.get("password") as string

            try {
                const data = await apiClient.login(email,password)
                setUser(data.user)
                return {success:true,user:data.user}
            } catch (error) {
                console.error("Error: ",error)
                return {
                    error : error instanceof Error ? error.message : "Login Failed"
                }
            }
        },
        {success:undefined, user:undefined, error: undefined} as LoginState)
    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                hasPermission
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}