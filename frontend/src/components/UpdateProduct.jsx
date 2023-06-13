import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
const UpdateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getproductDetails();
  }, []);

  const getproductDetails = async () => {
    console.log(params);
    let result = await fetch(`http://localhost:5000/getproduct/${params.id}`, {
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    setName(result.name);
    setPrice(result.price);
    setCategory(result.category);
    setCompany(result.company);
  };

  const updateProduct = async () => {
    console.log(name, price, category, company);
    let result = await fetch(
      `http://localhost:5000/updateproduct/${params.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          name,
          price,
          category,
          company,
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      }
    );
    result = await result.json();
    if (result) {
      navigate("/");
    }
  };
  return (
    <div className="add_product">
      <h1>Update Product</h1>
      <input
        className="input_box"
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="Enter Product Name"
      />

      <input
        className="input_box"
        type="text"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Enter Product Price"
      />

      <input
        className="input_box"
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Enter Product Category"
      />

      <input
        className="input_box"
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Enter Product Company"
      />

      <button className="btn_signup" onClick={updateProduct}>
        Update Product
      </button>
      {/* <input type="text" placeholder="Enter Product Name"/> */}
    </div>
  );
};
export default UpdateProduct;
