import { useEffect, useRef } from "react"
import style from "./css/menu.module.css"

type Props = {
  children: React.ReactNode
  hook: any
}
export const Menu = ({ children, hook }: Props) => {
  const menuRef = useRef<HTMLDivElement | null>(null)
  const { openMenuId, isAnimating, triggerEvent, position, closeMenu, updatePosition } = hook

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // if (event.button === 2) return
      if (
        event.target !== triggerEvent.target &&
        !menuRef.current?.contains(event.target as Node)
      ) {
        closeMenu()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [closeMenu])

  useEffect(() => {
    if (menuRef.current === null) return
    const rect = menuRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth

    if (windowHeight - rect.y < 100) {
      updatePosition({ x: position.x, y: rect.y - rect.height - 10 })
    }
    if (windowWidth - rect.x < rect.width + 20) {
      updatePosition({ x: rect.x - rect.width - 10, y: position.y })
    }
  }, [])

  return (
    <div
      ref={menuRef}
      className={`fixed z-20 flex w-[200px] flex-col rounded-md border bg-white p-1 shadow shadow-gray-200 transition-all ${openMenuId && style.show} ${isAnimating && style.hide} `}
      style={{ top: position.y, left: position.x }}
    >
      {children}
    </div>
  )
}
