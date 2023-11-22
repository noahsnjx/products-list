import React, { ReactNode, useCallback } from "react";
import Input from "./Input";
import { Controller, FieldName, UseFieldArrayReturn, useFormContext } from "react-hook-form";
import { IProductFormValues } from "../@types/form";
import { Rename } from "../@types/global";
import Modal from "react-modal";
import CreateCategoryModal from "./modal/CategoryModal";
import { useCreateCategoryModal } from "../hooks/useCategoryModal";
import useModal from "../hooks/useModal";
import ConfirmModal from "./modal/ConfirmModal";
import { NumericFormat } from "react-number-format";
import styled from "@emotion/styled";

const NumericFormatStyled = styled(NumericFormat)`
  border: none;
  background-color: inherit;
  color: inherit;
  font-size: 28px;
  padding: 24px;
  &:focus {
    outline: none;
  }
`;

const Form = styled.form({
  display: "flex",
  flexDirection: "column",
  flex: "1 0 0%",
  minHeight: 0,
  "#category:not(:first-of-type)": {
    borderTop: "solid 1px lightgreen"
  },
  overflow: "auto"
});

const RowRoot = styled.div({
  display: "flex",
  margin: 12,
  boxShadow: "#E1ECC8 0px 0px 0px 3px",
  "&:hover": {
    boxShadow: "0 0 5px #A0C49D",
    textShadow: "0 0 5px #A0C49D",
    transform: "scale(1.005)",
    transition: "0.3s"
  }
});

interface IProduct {
  category: string;
  price: number;
  stocked: boolean;
  name: string;
}

type WithFieldIndex<T extends { fields: object[] }> = {
  [K in keyof T]: K extends "fields" ? (T[K][0] & { fieldIndex: number })[] : T[K];
};

interface IProductListProps
  extends Rename<
    WithFieldIndex<UseFieldArrayReturn<IProductFormValues, "products", "id">>,
    "fields",
    "products"
  > {}

type TProductByCategory<P = IProduct> = {
  [category: string]: Omit<P, "category">[];
};

const ProductRow: React.FC<{ name: FieldName<IProductFormValues>; children: ReactNode }> = ({
  name,
  children
}) => {
  const { watch } = useFormContext();
  const stocked = watch(`${name}.stocked`);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "space-evenly",
        color: !stocked ? "red" : undefined,
        backgroundColor: "#C4D7B2"
      }}
    >
      {children}
    </div>
  );
};

// TODO mémo : fichier renommer en .d (d = déclaration type)

//TODO gestion des erreurs
// TODO faire les tests
//TODO api

Modal.setAppElement("#root");

const ProductList: React.FC<IProductListProps> = ({ products, append, remove }) => {
  const { openCreateModal, setOpenCreateModal } = useCreateCategoryModal();
  const { openModal, onOpenModal, setOpenIndex, openModalIndex } = useModal(false);
  const { control } = useFormContext<IProductFormValues>();

  const productByCategory = products.reduce(
    (acc, product) => {
      const { category, ...other } = product;

      if (!acc[product.category]) {
        acc[product.category] = [];
      }

      acc[product.category].push(other);
      return acc;
    },
    {} as TProductByCategory<(typeof products)[0]>
  );

  console.log({ productByCategory });

  const deleteCategory = useCallback(
    (index) => {
      const targetCategoryProducts = Object.values(productByCategory)[index].sort(
        (a, b) => b.fieldIndex - a.fieldIndex
      );
      targetCategoryProducts.forEach((product) => remove(product.fieldIndex));
    },
    [productByCategory, remove]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: "1 1 0%", minHeight: 0 }}>
      <Form>
        {Object.entries(productByCategory).map(([category, items], index) => (
          <div id="category" style={{ padding: 12 }} key={category}>
            <div style={{ display: "flex", marginLeft: 12 }}>
              <h2 style={{ fontSize: 36 }}>{category}</h2>
              <button
                type={"button"}
                onClick={() => onOpenModal(index)}
                style={{ padding: 24, borderRadius: "50%", margin: 8, cursor: "pointer" }}
              >
                -
              </button>
            </div>
            {items.map((product) => (
              <RowRoot key={product.fieldIndex}>
                <ProductRow name={`products.${product.fieldIndex}`} key={product.id}>
                  <Controller
                    control={control}
                    name={`products.${product.fieldIndex}.name`}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        {...field}
                        errorLabel={error?.message}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.currentTarget.blur();
                          }
                        }}
                        style={{
                          border: "none",
                          backgroundColor: "inherit",
                          color: "inherit",
                          fontSize: 28,
                          padding: 24
                        }}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`products.${product.fieldIndex}.price`}
                    render={({ field: { ref, onChange, ...field } }) => (
                      <NumericFormatStyled
                        {...field}
                        onValueChange={(values) => onChange(values.floatValue)}
                        value={field.value || 0}
                        prefix="$"
                        thousandSeparator={","}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`products.${product.fieldIndex}.stocked`}
                    render={({ field: { value, ...field } }) => (
                      <Input {...field} type="checkbox" checked={value} style={{ width: 28 }} />
                    )}
                  />
                </ProductRow>
                <button
                  type={"button"}
                  onClick={() => remove(product.fieldIndex)}
                  style={{ padding: 24, borderRadius: "50%", margin: 8, cursor: "pointer" }}
                >
                  -
                </button>
              </RowRoot>
            ))}
            <button
              type={"button"}
              onClick={() => append({ category, name: "", price: 0, stocked: true })}
            >
              +
            </button>
          </div>
        ))}
      </Form>
      <footer style={{ display: "flex", alignSelf: "center", flex: "none" }}>
        <button
          style={{
            borderRadius: "30px 30px",
            display: "flex",
            width: "80px",
            alignSelf: "center",
            margin: 12
          }}
          type="button"
          onClick={() => setOpenCreateModal(true)}
        >
          Add category
        </button>
      </footer>
      <CreateCategoryModal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreateCategory={(category) =>
          append({ category: category, name: "", price: 0, stocked: false })
        }
      />
      <ConfirmModal
        isOpen={openModal}
        onAccept={() => deleteCategory(openModalIndex)}
        onClose={() => setOpenIndex(null)}
      />
    </div>
  );
};

export type { IProduct };
export default ProductList;
