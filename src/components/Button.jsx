

export default function Button({ children, onClick, disabled = false, type = "button" , className = ""}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-green-700 hover:text-white disabled:opacity-40 disabled:cursor-pointer  transition ${className}`}
    >
      {children}
    </button>
  )
}
