// import React from "react";
import { useState } from "react";
import "./Shop.css";
import { useEffect } from "react";
import Product from "../products/Product";
import Cart from "../cart/Cart";
import {
  addToCart,
  deleteCart,
  getShoppingCart,
} from "../../utilities/localStorage";
import { Link } from "react-router-dom";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Shop = () => {
  // using state to read and set data
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  // fetching data from API
  useEffect(() => {
    fetch("../../../db/products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => {
        // console.log(err);
      });
  }, []);
  //getting data from localStorage and seting it to  SetCart State
  useEffect(() => {
    const shoppingCart = getShoppingCart();
    const savedCart = [];
    // step 1: get id of the added product
    for (const id in shoppingCart) {
      // step 2: get product from products stateby using id
      const addedProduct = products.find((product) => product.id == id);

      if (addedProduct) {
        // step 3: add quantity
        const quantity = shoppingCart[id];
        addedProduct.quantity = quantity;

        // step 4: add the addedCart to the save cart
        savedCart.push(addedProduct);
      }
    }
    // step 5: set the cart
    // console.log(savedCart);
    setCart(savedCart);
  }, [products]);

  const handleAddToCart = (product) => {
    // const newCart = [...cart, product];
    let newCart = [];
    const exists = cart.find((pd) => pd.id === product.id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd.id != product.id);
      newCart = [...remaining, exists];
    }
    setCart(newCart);
    // adding to local storage
    addToCart(product.id);
  };

  // clear cart handler method
  const clearCartHandler = () => {
    deleteCart();
    setCart([]);
    toast.success("Cart Cleared");
  };
  return (
    <div className="shop-container">
      <div>
        <h4 className="shop-title-h4">Total Products: {products.length}</h4>
        <div className="product-container">
          {products.map((product) => {
            return (
              <Product
                key={product.id}
                product={product}
                handleAddToCart={handleAddToCart}
              ></Product>
            );
          })}
        </div>
      </div>
      <div className="cart-bill-container-parent">
        <Cart cart={cart} clearCartHandler={clearCartHandler}>
          <Link to="/order-review">
            <button className="btn-review-order">
              Review Order{" "}
              <ArrowRightCircleIcon className="h-6 w-6 duration-500 text-white group-hover:text-red-700 " />
            </button>
          </Link>
        </Cart>
      </div>
      {/* toast notification */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Shop;
