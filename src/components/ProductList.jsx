import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);
  const getProducts = async () => {
    let result = await fetch("http://localhost:5000/getproducts",{
      // after add token 
      headers:{
        authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
      //
    });
    result = await result.json();
    setProducts(result);
  };

  const handleDelete = async (id) => {
    console.log(id);
    let result = await fetch(`http://localhost:5000/deleteproduct/${id}`, {
      method: "DELETE",
      // after add token
      headers:{
        authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    });
    result = await result.json();
    if (result) {
      getProducts();
    }
  };
  const searchHandle = async (e) => {
    let key = e.target.value;
    if (key) {
      // before add token
        // let result = await fetch(`http://localhost:5000/searchproduct/${key}`);


      // after add token
        let result = await fetch(`http://localhost:5000/searchproduct/${key}`,{
          headers:{
            authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}`
          }
        });

        result = await result.json();
        // let search = result.filter((product) => {
        //   return product.name.toLowerCase().includes(e.target.value.toLowerCase());
        // });
        if (result) {
            setProducts(result);
        }
    }else{
        getProducts();
    }
  };
  return (
    <div className="product-list">
      <h1>Product List</h1>
      <div className="search">
        <input
          type="text"
          placeholder="type here to search"
          className="searchbar"
          onChange={searchHandle}
        />
      </div>
      <ul>
        <li>S. no</li>
        <li>Name</li>
        <li>Price</li>
        <li>Category</li>
        <li>Operatons</li>
      </ul>
      {products.length>0? products.map((product, index) => {
        return (
          <ul key={index}>
            <li>{index + 1}</li>
            <li>{product.name}</li>
            <li>{product.price}</li>
            <li>{product.category}</li>
            <li>
              <button onClick={() => handleDelete(product._id)}>Delete</button>
              <Link to={"/update/" + product._id}>Update</Link>
            </li>
          </ul>
        );
      })
      :<h1>No Product Found</h1>}
    </div>
  );
};

export default ProductList;
