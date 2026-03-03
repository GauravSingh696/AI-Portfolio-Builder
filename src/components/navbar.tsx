"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { signOut, useSession } from "next-auth/react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { LayoutDashboard, LogOut, FileText, User } from "lucide-react"
const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "/communities", label: "Community" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    toast.success("Logged out successfully");
    router.push('/');
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name.substring(0, 2).toUpperCase();
    }
    if (session?.user?.email) {
      return session.user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  }


  return (
    <motion.header
      className="sticky top-0 z-40  bg-background/80 backdrop-blur-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              className="relative h-10 w-10 overflow-hidden rounded-full bg-gradient-to-tr from-violet-500 to-indigo-600 p-[2px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-background">
                <Image src="/portfol copy.png" alt="navImage" width={200} height={200} />
              </div>
            </motion.div>
            <span className="hidden font-bold sm:inline-block text-lg">Portfolio.AI</span>
          </Link>

          <nav className="hidden md:flex md:gap-6">
            {navLinks.map((link) => (
              <motion.div
                key={link.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-primary cursor-pointer"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {!session ? <div className="hidden sm:flex sm:items-center sm:gap-4">
            <Link href="/signin">
              <Button className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg hover:shadow-xl">
                Log in
              </Button>
            </Link>
          </div> : <div className="hidden sm:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-violet-200">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                    <AvatarFallback className="bg-violet-100 text-violet-700 font-semibold">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white dark:bg-gray-950 shadow-md border" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard" className="flex items-center w-full">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/generate-portfolio" className="flex items-center w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Generate Portfolio</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>}

          <div className="flex sm:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle Menu"
                  className="ml-2"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-8 py-6">
                  <div className="flex items-center justify-between">
                    <Link
                      href="/"
                      className="flex items-center space-x-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-600 p-[2px]">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-background">
                          <span className="font-semibold text-sm">PB</span>
                        </div>
                      </div>
                      <span className="font-bold">Portfolio.AI</span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <nav className="flex flex-col gap-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-base font-medium transition-colors hover:text-primary cursor-pointer"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="flex flex-col gap-4">
                    {!session ? (
                      <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg hover:shadow-xl">
                          Log in
                        </Button>
                      </Link>
                    ) : (
                      <div className="flex flex-col gap-4 border-t pt-4 mt-2">
                        <div className="flex items-center gap-3 px-2">
                          <Avatar className="h-9 w-9 border border-violet-200">
                            <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                            <AvatarFallback className="bg-violet-100 text-violet-700">{getUserInitials()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{session.user?.name || "User"}</span>
                            <span className="text-xs text-muted-foreground">{session.user?.email}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full justify-start">
                              <LayoutDashboard className="mr-2 h-4 w-4" />
                              Dashboard
                            </Button>
                          </Link>
                          <Link href="/generate-portfolio" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full justify-start">
                              <FileText className="mr-2 h-4 w-4" />
                              Generate Portfolio
                            </Button>
                          </Link>
                          <Button variant="destructive" className="w-full justify-start mt-2" onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
