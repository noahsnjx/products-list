import { InputHTMLAttributes, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ type = "text", ...props }, ref) => {
    return <input ref={ref} type={type} {...props} />;
  }
);

export default Input;
