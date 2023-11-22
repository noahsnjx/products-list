import { InputHTMLAttributes, forwardRef } from "react";

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  errorLabel?: string;
}

const Input = forwardRef<HTMLInputElement, IInput>(
  ({ type = "text", style, errorLabel, ...props }, ref) => {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <input style={style} ref={ref} type={type} {...props} />
        {!!errorLabel && <span style={{ color: "red" }}>{errorLabel}</span>}
      </div>
    );
  }
);

export default Input;
