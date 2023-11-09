import { ChangeEvent, useCallback, useState } from "react";
import "./App.css";
import Input from "./components/Input";
import Label from "./components/Label";
import ProductList from "./components/ProductList";
import PRODUCTS from "./constants";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { IProductFormValues } from "./form";

function App() {
  const [onlyStock, setOnlyStock] = useState(false);
  const [query, setQuery] = useState("");

  const methods = useForm<IProductFormValues>({
    mode: "onChange",
    defaultValues: {
      products: PRODUCTS
    }
  });

  const { control } = methods;

  const { fields, ...productsMethods } = useFieldArray({
    control,
    name: "products"
  });

  const products = fields
    .map((field, index) => ({ ...field, fieldIndex: index }))
    .filter((product) => {
      if (onlyStock && !product.stocked) {
        return false;
      }

      if (!product.name?.includes(query)) {
        return false;
      }

      return true;
    });

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setOnlyStock(event.target.checked);
  }, []);

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);

  return (
    <div className="App">
      <Input value={query} placeholder="Search..." onChange={handleSearch} />
      <div>
        <Input type="checkbox" checked={onlyStock} onChange={handleChange} />
        <Label>Only show products in stock</Label>
      </div>
      <FormProvider {...methods}>
        <ProductList {...productsMethods} products={products} />
      </FormProvider>
    </div>
  );
}

export default App;
