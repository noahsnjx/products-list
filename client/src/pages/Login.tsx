import { Controller, useForm } from "react-hook-form";
import { login } from "../services/login";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../components/Input";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type TLoginFormValues = {
  username: string;
  password: string;
};

const loginSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required()
});

const Login = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<TLoginFormValues>({
    mode: "onChange",
    resolver: yupResolver(loginSchema),
    defaultValues: { username: "Nono", password: "test" }
  });

  const handleClick = useCallback(
    handleSubmit(({ username, password }) =>
      login(username, password)
        .then(() => navigate("/products-list"))
        .catch(() => toast("raté", { type: "error" }))
    ),
    [handleSubmit]
  );

  return (
    <div>
      <Controller control={control} name="username" render={({ field }) => <Input {...field} />} />
      <Controller
        control={control}
        name="password"
        render={({ field }) => <Input type="password" {...field} />}
      />
      <button disabled={isSubmitting} onClick={handleClick} type="submit">
        Connection {isSubmitting && "..."}
      </button>
    </div>
  );
};

export default Login;
