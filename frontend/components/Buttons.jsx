
import "./button.css";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  icon = null,
  className = "",
}) {
  return (
    <button
      type={type}
      className={`customButton ${variant} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="customButtonIcon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
