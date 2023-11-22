import { getActions } from "../store/auth";

const { setAccessToken } = getActions();

const login = async (username: string, password: string) => {
  const response = await fetch("http://localhost:8000/v1/login", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  }).then((data) => data.json());

  setAccessToken(response.accessToken);
};

export { login };
