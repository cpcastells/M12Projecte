import { ComponentPropsWithoutRef, useId } from "react";

interface FormInputProps extends ComponentPropsWithoutRef<"input"> {
  error?: string | null;
}

const FormInput = ({ className = "", error, ...props }: FormInputProps) => {
  const errorId = useId();

  return (
    <div>
      <input
        className={`w-full p-3 rounded-lg bg-abyss-bg text-cyan-50 border focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-cyan-700 focus:ring-cyan-500"
        } ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
