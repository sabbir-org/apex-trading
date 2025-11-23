import style from "./css/loading.module.css"

type Props = {
  color: string
}

export function Loading({ color }: Props) {
  return (
    <div className={`flex justify-center`}>
      <div className={`w-[18px] h-[18px] rounded-full border-2 border-blue-100 ${style.spin}`}>
        <div className={`${color} ${style.dot}`}></div>
      </div>
    </div>
  )
}
