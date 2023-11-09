import React, { Fragment, ReactNode, useCallback } from "react";
import Input from "./Input";
import { Controller, FieldName, UseFieldArrayReturn, useFormContext } from "react-hook-form";
import { IProductFormValues } from "../form";
import { Rename } from "../global";
import Modal from "react-modal";
import CreateCategoryModal from "./modal/CategoryModal";
import { useCreateCategoryModal } from "../hooks/useCategoryModal";
import useModal from "../hooks/useModal";
import ConfirmModal from "./modal/ConfirmModal";
import { NumericFormat } from "react-number-format";

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
    <tr style={{ color: !stocked ? "red" : undefined, backgroundColor: "lightgray" }}>
      {children}
    </tr>
  );
};

// TODO mémo : fichier renommer en .d (d = déclaration type)

//TODO permettre changer stock ou non
//TODO pas 2 meme nom produits dans une meme catégory, et pas deux meme noms catégories
//TODO gestion des erreurs
// TODO styliser
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
    <div style={{ display: "flex" }}>
      <button type="button" onClick={() => setOpenCreateModal(true)}>
        Add category
      </button>
      <form>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th colSpan={1}>Name</th>
              <th colSpan={1}>Price</th>
              <th colSpan={1}>Stocked</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(productByCategory).map(([category, items], index) => (
              <Fragment key={category}>
                <tr>
                  <th colSpan={1} style={{ padding: "12px 0 4px 0", textDecoration: "underline" }}>
                    {category}
                    <button type={"button"} onClick={() => onOpenModal(index)}>
                      Remove the category
                    </button>
                    <button
                      type={"button"}
                      onClick={() => append({ category, name: "", price: 0, stocked: true })}
                    >
                      Add a product
                    </button>
                  </th>
                </tr>

                {items.map((product) => (
                  <ProductRow name={`products.${product.fieldIndex}`} key={product.id}>
                    <td>
                      <Controller
                        control={control}
                        name={`products.${product.fieldIndex}.name`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            disabled={field.value !== "" /* ou erreur */}
                            value={undefined}
                            onChange={undefined}
                            defaultValue={field.value}
                            onBlur={(e) => {
                              field.onChange(e);
                              setTimeout(() => field.onBlur(), 0);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                field.onChange(e);
                              }
                            }}
                            style={{
                              border: "none",
                              backgroundColor: "inherit",
                              color: "inherit"
                            }}
                          />
                        )}
                      />
                    </td>
                    <td>
                      <Controller
                        control={control}
                        name={`products.${product.fieldIndex}.price`}
                        render={({ field: { ref, onChange, ...field } }) => (
                          <NumericFormat
                            {...field}
                            onValueChange={(values) => {
                              onChange(values.floatValue);
                            }}
                            value={field.value || 0}
                            prefix="$"
                            thousandSeparator={","}
                            style={{
                              border: "none",
                              backgroundColor: "inherit",
                              color: "inherit"
                            }}
                          />
                        )}
                      />
                    </td>
                    <td>
                      <Controller
                        control={control}
                        name={`products.${product.fieldIndex}.stocked`}
                        render={({ field: { value, ...field } }) => (
                          <Input {...field} type="checkbox" checked={value} />
                        )}
                      />
                    </td>
                    <td>
                      <button type={"button"} onClick={() => remove(product.fieldIndex)}>
                        -
                      </button>
                    </td>
                  </ProductRow>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </form>
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
