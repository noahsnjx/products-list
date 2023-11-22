import { getAccessToken } from "../store/auth";

const getProducts = async () => {
  const response = await fetch("http://localhost:8000/v1/products", {
    headers: { authorization: `Bearer ${getAccessToken()}` }
  }).then((data) => data.json());

  return response;
};

export { getProducts };
