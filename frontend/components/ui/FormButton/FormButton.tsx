import { ComponentPropsWithoutRef } from "react";

type FormButtonProps = ComponentPropsWithoutRef<"button">;

const FormButton = ({
  className = "",
  children,
  disabled,
  ...props
}: FormButtonProps) => (
  <button
    type="submit"
    disabled={disabled}
    className={`p-3 bg-cyan-600 text-abyss-bg font-bold rounded-lg transition-colors ${
      disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-cyan-500"
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default FormButton;
