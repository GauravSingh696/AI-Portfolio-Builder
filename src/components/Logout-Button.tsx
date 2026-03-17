'use client'

import { signOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Button } from './ui/button'

const LogoutButton = () => {
  const { data: session } = useSession()

  const logout = async () => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/signin",
      })
      toast.success("Logged out successfully")
    } catch (e) {
      console.error(e)
      toast.error("Error logging out")
    }
  }

  if (!session) {
    return null
  }

  return (
    <Button onClick={logout} className="p-1">
      Logout
    </Button>
  )
}

export default LogoutButton
