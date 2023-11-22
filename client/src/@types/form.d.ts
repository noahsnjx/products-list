import { FieldValues } from "react-hook-form";
import { IProduct } from "../components/ProductList";

interface IProductFormValues extends FieldValues {
  products: IProduct[];
}

export { IProductFormValues };
