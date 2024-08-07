"use client"

import { SVGProps, useState } from "react"
import { useRouter } from "next/navigation"
import { updateUserRole } from "@/services/user.service"
import { Role } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Onboarding() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const router = useRouter()

  const handleRoleSave = async () => {
    if (!selectedRole) return

    try {
      await updateUserRole(selectedRole)
      router.push("/manage")
    } catch (error) {
      console.error("Error saving role:", error)
    }
  }
  return (
    <div className="bg-muted flex min-h-screen items-center justify-center">
      <div className="bg-background mx-auto w-[95%] max-w-md rounded-lg p-6 shadow-lg">
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome to ByteEat!</h1>
            <p className="text-muted-foreground">
              Please select your role to get started.
            </p>
          </div>
          <div className="grid gap-4">
            <Card
              onClick={() => setSelectedRole(Role.OWNER)}
              className={`hover:bg-accent cursor-pointer rounded-lg p-4 transition-colors ${
                selectedRole === Role.OWNER
                  ? "bg-accent text-accent-foreground"
                  : "bg-background"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Owner</h3>
                  <p className="text-muted-foreground">
                    Manage your business and employees.
                  </p>
                </div>
                {selectedRole === Role.OWNER && (
                  <CheckIcon className="size-6" />
                )}
              </div>
            </Card>
            <Card
              onClick={() => setSelectedRole(Role.WAITER)}
              className={`hover:bg-accent cursor-pointer rounded-lg p-4 transition-colors ${
                selectedRole === Role.WAITER
                  ? "bg-accent text-accent-foreground"
                  : "bg-background"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Waiter</h3>
                  <p className="text-muted-foreground">
                    Manage orders and serve customers.
                  </p>
                </div>
                {selectedRole === Role.WAITER && (
                  <CheckIcon className="size-6" />
                )}
              </div>
            </Card>
          </div>
          <div className="flex justify-end">
            <Button disabled={!selectedRole} onClick={handleRoleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
