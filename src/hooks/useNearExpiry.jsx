import { useSelector } from "react-redux";

function daysBetween(date1, date2) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d1 - d2) / msPerDay);
}
export const useNearExpiry = (days = 3) => {
  const products = useSelector((state) => state.products.items);

  return products.filter((product) => {
    if (!product.expiryDate) return false;
    const diff = daysBetween(new Date(product.expiryDate), new Date());
    return diff >= 0 && diff <= days;
  });
};
