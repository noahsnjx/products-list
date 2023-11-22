import { ServiceFactory } from "./types";

interface ProductsService {
  getProducts: (name: string | undefined) => Promise<any[]>;
  createProduct: (
    name: string,
    category: string,
    stocked: boolean | undefined,
    price: number | undefined
  ) => Promise<any>;
  deleteProduct: (id: string) => Promise<any>;
}

const productsServiceFactory: ServiceFactory<ProductsService> = (sequelize) => ({
  getProducts(name) {
    return sequelize.models.Product.findAll();
  },
  createProduct(name, category, stocked, price) {
    return sequelize.models.Product.create({ name, categoryId: category, stocked, price });
  },
  deleteProduct(id) {
    return sequelize.models.Product.destroy({ where: { id } });
  }
});

export default productsServiceFactory;
export { ProductsService };
