import { Link, useLocation } from "react-router"

type CustomLinkProps = {
  children: React.ReactNode
  to: string
}

const CustomLink = ({ children, to }: CustomLinkProps) => {
  const { pathname } = useLocation()
  const match = pathname === to
  return (
    <Link to={to} className={`${match ? "" : ""} flex items-center gap-x-2 rounded-md p-2 outline-none`}>
      <span
        className={`absolute left-2 h-0 w-1 rounded bg-blue-600 transition-all duration-[350ms] ${match && "h-6"}`}
      ></span>

      <span className={`${match ? "text-blue-600" : "text-gray-600"}`}>{children}</span>
      <span className={`${match ? "text-blue-600" : "text-gray-600"}`}>
        {""}
        {(to.slice(1) || "Dashboard").slice(0, 1).toUpperCase() +
          (to.slice(1) || "Dashboard").slice(1)}
      </span>
    </Link>
  )
}
export default CustomLink
