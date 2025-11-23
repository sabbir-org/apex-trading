import { useState } from "react"

export const useMenu = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [triggerEvent, setTriggerEvent] = useState<React.MouseEvent>()

  const openMenu = (id: string, e: React.MouseEvent, clientPosition = { x: 0, y: 0 }) => {
    setOpenMenuId(id)
    setPosition(clientPosition)
    setTriggerEvent(e)
  }

  const closeMenu = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setOpenMenuId(null)
      setIsAnimating(false)
    }, 200)
  }

  const updatePosition = (clientPosition: { x: number; y: number }) => {
    setPosition(clientPosition)
  }

  return { openMenuId, triggerEvent, isAnimating, position, openMenu, closeMenu, updatePosition }
}
