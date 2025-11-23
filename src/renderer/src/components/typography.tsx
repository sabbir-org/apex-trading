import { twMerge } from "tailwind-merge"

type TitleProps = {
  children: React.ReactNode
  className?: string
}

export const Title = ({ children, className }: TitleProps) => {
  return <h2 className={twMerge(`text-2xl text-blue-700 font-medium`, className)}>{children}</h2>
}

type SubtitleProps = {
  children: React.ReactNode
  className?: string
}

export const Subtitle = ({ children, className }: SubtitleProps) => {
  return <h2 className={twMerge(`text-gray-400`, className)}>{children}</h2>
}
