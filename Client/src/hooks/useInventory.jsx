import React, { useState, useEffect } from "react";

const useInventory = (userId) => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    expiryDate: "",
      category: "", 

  });
  useEffect(() => {
    fetch(`http://localhost:3000/api/${userId}`)
      .then((res) => res.json())
      .then((data) => setProducts(data)) 
      .catch((err) => console.error("שגיאה בטעינה:", err));
  }, [userId]); 

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdd = () => {
    if (!formData.name || !formData.quantity) return;

    const product = {
      name: formData.name,
      quantity: Number(formData.quantity),
      expirationDate: formData.expiryDate || null,
      category: formData.category,
    };

    fetch(`http://localhost:3000/api/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((res) => res.json())
      .then((newProduct) => {
        setProducts((prevProducts) => [...prevProducts, newProduct]); 
      })
      .catch((err) => console.error("שגיאה בהוספה:", err));

  setFormData({ name: "", quantity: "", expiryDate: "", category: "" });

  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/api/${userId}/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      })
      .catch((err) => console.error("שגיאה במחיקה:", err));
  };

  return {
    products,
    handleAdd,
    handleDelete,
    formData,
    handleChange,
  };
};

export default useInventory;
