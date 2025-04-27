import { useParams } from "react-router-dom";

function UpdateProduct() {
  const { id } = useParams(); // לוקחים את ה-id מהכתובת

  return (
    <div>
      <h2>Update Product</h2>
      <p>Updating product with ID: {id}</p>
    </div>
  );
}

export default UpdateProduct;
