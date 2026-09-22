"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { AdminLoginForm } from "./admin-login-form"
import { adminLoginService } from "@/services/AdminServices/adminLoginService"

export function AdminLogin() {
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)

        try {
            const response = await adminLoginService.login(username, password)

            localStorage.setItem("access_token", response.access_token)
            localStorage.setItem("refresh_token", response.refresh_token)
            localStorage.setItem("isLoggedIn", "true")
            localStorage.setItem("username", username)

            toast.success("Welcome Back", {
                position: "top-right",
            })

           navigate("/Admin")
        } catch (error: any) {
              setUsername("")
                setPassword("")
            toast.error("Invalid username or password", {
                position: "top-right",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                <Card className="p-10 border-[#CAD8FF] bg-white shadow-xl relative overflow-hidden">

                    {loading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
                            <div className="text-center">
                                <p className="text-sm font-semibold text-[#0E40C7]">
                                    Please wait...
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Processing your request
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0e40c7] to-[#FBAB18]" />

                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <motion.h1
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-3xl sm:text-4xl font-bold text-[#0e40c7]"
                            >
                                Admin Login
                            </motion.h1>

                            <p className="text-sm text-[#0E40C7] mt-2">
                                Sign in to continue
                            </p>
                        </div>

                        <AdminLoginForm
                            username={username}
                            password={password}
                            onUsernameChange={setUsername}
                            onPasswordChange={setPassword}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </Card>
            </motion.div>
        </div>
    )
}