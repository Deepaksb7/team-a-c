"use client"

import { Team, User } from "@/app/types"

interface AdminDashboardProps{
    users: User[],
    teams: Team[],
    currentUser: User
}

const AdminDashboard = ({users,teams,currentUser}: AdminDashboardProps)=>{
    
    return <>
    </>
}

export default AdminDashboard