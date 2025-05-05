import { useSelector, useDispatch } from "react-redux";
import { addProduct, removeProduct } from "../features/products/productSlice";

/**
 * הוק לניהול מוצרי המלאי
 */
export const useInventory = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);

  const add = (product) => dispatch(addProduct(product));
  const remove = (id) => dispatch(removeProduct(id));

  return { products, add, remove };
};
