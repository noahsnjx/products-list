import { LabelHTMLAttributes } from "react";

const Label = ({ children }: LabelHTMLAttributes<HTMLLabelElement>) => {
  return <label>{children}</label>;
};

export default Label;
