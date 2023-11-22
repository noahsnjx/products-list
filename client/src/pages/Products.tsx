import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IProductFormValues } from "../@types/form";
import ProductList, { IProduct } from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import { getProducts } from "../services/products";

// yup.setLocale({ mixed: { required: "${path} est un champs requis" } });

declare module "yup" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
  interface ValidateOptions<TContext = {}> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    from: any;
  }
}

const productSchema = yup.object({
  products: yup
    .array()
    .of(
      yup.object({
        category: yup.string().label("Catégorie").required(),
        price: yup.number().label("Prix").default(0),
        stocked: yup.boolean().label("Stockage").required(),
        name: yup
          .string()
          .label("Nom")
          .required()
          .test("isUniqueName", "Cet article existe déjà", function (value, params) {
            if (!value) return true;
            const [, strInd] = params.path.match(/\[(\d+)\]/)!;
            // console.log({ params, toto: this.resolve(yup.ref("a")), this: this });

            const options = [
              ...this.options.from.find((f) => "products" in f.value).value.products
            ].splice(0, Number.parseInt(strInd, 10));

            const duplicateMatch = options.some(
              (product) => product.category === params.parent.category && product.name === value
            );

            return !duplicateMatch;
          })
      })
    )
    .required()
});

function Products() {
  const [onlyStock, setOnlyStock] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    getProducts().then((data) => setProducts(data));
  }, []);

  console.log({ products });

  const methods = useForm<IProductFormValues>({
    mode: "onChange",
    defaultValues: {
      products
    },
    resolver: yupResolver(productSchema)
  });

  useEffect(() => methods.reset({ products }), [products]);
  const { control } = methods;

  const { fields, ...productsMethods } = useFieldArray({
    control,
    name: "products"
  });

  const productsFilter = fields
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

  const handleChange = useCallback(() => {
    setOnlyStock((prevState) => !prevState);
  }, []);

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);

  return (
    <>
      <header style={{ flex: "none" }}>
        <h1>Store</h1>
        <SearchBar
          query={query}
          onChangeView={handleChange}
          onSearch={handleSearch}
          onlyStock={onlyStock}
        />
      </header>
      <FormProvider {...methods}>
        <ProductList {...productsMethods} products={productsFilter} />
      </FormProvider>
    </>
  );
}

export default Products;
