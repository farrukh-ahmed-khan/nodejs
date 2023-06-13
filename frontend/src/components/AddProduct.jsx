import React, { useState } from "react";
const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState(false);

  const AddProduct = async () => {
    if (name === "" || price === "" || category === "" || company === "") {
      setError(true);
      return false;
    }
    console.log(name, price, category, company);
    const userid = JSON.parse(localStorage.getItem("user"))._id;
    let result = await fetch("http://localhost:5000/addproduct", {
      method: "POST",
      body: JSON.stringify({
        name,
        price,
        category,
        company,
        userid,
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,

      },
    });
    result = await result.json();
  };
  return (
    <div className="add_product">
      <h1>Add Product</h1>
      <input
        className="input_box"
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="Enter Product Name"
      />
      {error && !name && <span className="invalid">Enter Valid Name</span>}
      
      <input
        className="input_box"
        type="text"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Enter Product Price"
      />
      {error && !price && <span className="invalid">Enter Valid price</span>}

      <input
        className="input_box"
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Enter Product Category"
      />
      {error && !category && <span className="invalid">Enter Valid category</span>}

      <input
        className="input_box"
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Enter Product Company"
      />
      {error && !company && <span className="invalid">Enter Valid company</span>}

      <button className="btn_signup" onClick={AddProduct}>
        Add Product
      </button>
      {/* <input type="text" placeholder="Enter Product Name"/> */}
    </div>
  );
};
export default AddProduct;
