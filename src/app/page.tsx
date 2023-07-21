'use client'
import { useStateContext } from "@/context/StateContext"

export default function Home() {
  const { user } = useStateContext();
  return (
      <div>
          <h1>Welcome to task manager. {user.name}</h1>
      </div>
  )
}