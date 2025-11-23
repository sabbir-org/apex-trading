const TopBar = ({ children }) => {
  return (
    <div
      className={`fixed top-0 left-[200px] z-10 flex h-11 w-[calc(100%-200px)] border-b bg-white`}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      {children}
    </div>
  )
}
export default TopBar
