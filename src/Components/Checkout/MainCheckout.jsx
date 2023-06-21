import "../../style.css";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import {Link} from 'react-router-dom'
import Navbar from "./navbar";
import { product, CheckoutContext, CheckoutProvider } from "./product";
import axios from "axios";

const Content = () => {

    const [totalPrice, setTotalPrice] = useState(0);
    const [productList, setProductList] = useContext(CheckoutContext);
    const [name,setName] = useState("");
    
    //Adding orders to mysql
    const addCustomer = async() => {
    try{
      axios.post("http://localhost:3001/create", {
        name:name,
        productList: productList,
      })
      console.log("Working");
    }
     catch(error){
      console.log(error);
    }
  }

    const handleSelectProduct = (event) => {
        const selectedProduct = product.find((prod) => prod.name === event.target.value);
        const productExists = productList.find((prod)=> prod.name === selectedProduct.name);      
        
        if (!productExists){
            setProductList((prev) => [...prev, selectedProduct]);
        }
      };

    // const updateQuantity = (productId, newQuantity) => {
    //     setProduct((prevProducts) =>
    //       prevProducts.map((product) =>
    //         product.id === productId ? { ...product, quantity: newQuantity } : product
    //       )
    //     );
    //   };

    //   const updateTotalPrice = () => {
    //     return product.reduce((total, product) => total + product.price * product.quantity, 0);
    //   }

    return(
        <>
            <form>
                <div className="inputs">
                  <h1>User Info</h1>
                  <hr />
                  <label htmlFor="text">Name: </label>
                  <input onChange={(e)=> setName(e.target.value)} type="text" placeholder="xyz" required/>
                  <button>Submit</button>
                </div>
            </form> 

            <div className="product">
                <h2>Select Product: </h2>
                <select onChange={handleSelectProduct}>
                    {product.map((prod)=>(
                        <Dropdown key={prod.id} prod = {prod}/>
                    ))}
                </select>
            </div>

            <div className="products">
                <div className="products-content">
                    <h2>Products</h2>
                    <h2>Quantity</h2>
                    <h2 className="total-price">Total Price</h2>
                    <h2></h2>
                </div>
                <br />
                {productList.map((prod, index)=>(
                    <ProductList index={index} setTotalPrice={setTotalPrice} key={prod.id} prod={prod}/>
                ))}
            </div>
                <TotalPrice totalPrice={totalPrice}/>
                <Button addCustomer={addCustomer} to="/final" text="Check Out"/>
                <Button to="/list" text="All Orders" />
        </>
    );
}

const Dropdown = ({ prod }) => {
    return (
      <option value={prod.name}>
        {prod.name}
      </option>
    );
  };

  
const ProductList = ({prod, setTotalPrice, index}) => {
    const [quantity, setQuantity] = useState(0);
    const {name,price} = prod;
    const [, setProductList] = useContext(CheckoutContext);
    
    //To increase quantity in object
    useEffect(() => {
        setProductList((prev) =>
          prev.map((product) =>  
            product.id === prod.id ? { ...product, quantity } : product
        )
        );
      }, [quantity, prod.id]);

    //To update prices in Total Price section
    useEffect(() => {
        const productTotalPrice = price * quantity;
        setTotalPrice((prev) => prev + productTotalPrice);
        return () => {
          setTotalPrice((prev) => prev - productTotalPrice);
        };
      }, [quantity, price, setTotalPrice]);

      function lowerQuantity(){
        if (quantity> 0){
        setQuantity(prev => prev - 1);
        }
      }

      function increaseQuantity(){
        setQuantity(prev => prev + 1);
      }
    return(
        <>
            <div className="products-content">
                <div>
                    <img src="" alt="" />
                    {name}
                </div>
                <div className="btn">
                    <button onClick={()=> lowerQuantity()}>-</button>
                    {quantity}
                    <button onClick={()=> increaseQuantity()}>+</button>
                </div>
                <div className="price">
                    ${price*quantity}
                </div>
                <Delete index={index}/>
            </div>
        </>
    );
}

const Delete = ({index}) => {
  const [productList, setProductList] = useContext(CheckoutContext);
  const handleDelete = (e) => {
      const Updatedproduct = (productList.filter((prod, i)=> i !== index));
      setProductList(Updatedproduct);
  }
  return(
        <>
          <div onClick={handleDelete} data-index={index} className="delete">
              <img src={require("../../Images/delete-button-svgrepo-com.svg").default} alt="" />
          </div>
        </>
  );
}

const TotalPrice = ({ totalPrice }) => {

    return (
      <div className="total-price">
        <h1 style={{fontSize:"1.5rem"}}>Total Price: ${totalPrice}</h1>
      </div>
    );
  };

  const Button = ({text, to, addCustomer}) => {
    const [productList] = useContext(CheckoutContext);

    return(
        <div className="btn-checkout">
            <Link onClick={addCustomer} to={to} className="btn-blue" state={{productList:productList}}>
                {text}
            </Link>
        </div>
    );
  }

export default function MainCheckout(){
    
    return(
        <>
        <Navbar/>
        <div className="Outline">
        <CheckoutProvider>
            <Content/>
        </CheckoutProvider>
        </div>
        </>
    )
}

export {Button};