export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
  className = "",
}) {
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",
    secondary:
      "bg-gray-700 hover:bg-gray-800 text-white",
    success:
      "bg-green-600 hover:bg-green-700 text-white",
    danger:
      "bg-red-600 hover:bg-red-700 text-white",
    outline:
      "border border-gray-600 hover:bg-gray-800 text-gray-200",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        px-4 py-2
        rounded-lg
        font-medium
        transition-colors
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}