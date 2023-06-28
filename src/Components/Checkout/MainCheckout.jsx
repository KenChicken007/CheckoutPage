import "../../style.css";
import React, { useContext, useRef } from "react";
import { useState, useEffect } from "react";
import {Link} from 'react-router-dom'
import Navbar from "./navbar";
import { product, CheckoutContext, CheckoutProvider } from "./product";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Content = () => {
    const [productList, setProductList,] = useContext(CheckoutContext);
    const [name,setName] = useState("");

    //Get the product List from final page
    const location = useLocation();
    const orderId = useRef(0);
    console.log(location);
    const len = useRef(0);

    useEffect(()=> {
      if (location.state){
        const OldProductList = location.state.OldProductList;
        const updatedProductList = OldProductList.map((oldProduct) => ({
          id : oldProduct.product_id ?? oldProduct.id,
          name: oldProduct.product_name ?? oldProduct.name,
          price: oldProduct.product_price ??oldProduct.price,
          quantity: oldProduct.product_quantity ?? oldProduct.quantity,
        }));
        len.current = OldProductList.length;
        console.log("Length: ",len.current);
        setProductList(updatedProductList);
        orderId.current = location.state.orderID;
      }
    }, []);
    console.log(productList);

    //Adding orders to mysql
    const addCustomer = async() => {
    try{
      axios.post("http://localhost:3001/create", {
        name:name,
        productList: productList,
      })
    }
     catch(error){
      console.log(error);
    }
  } 

  //Updating Orders
  const EditOrder = async() => {
    try {
      axios.post("http://localhost:3001/update", {
        name: name,
        productList: productList,
        orderId: orderId.current,
        len: len.current,
      })
    } catch (error) {
      console.log(error);
    }
  }

    const handleSelectProduct = (event) => {
        const selectedProduct = product.find((prod) => (prod.name) === event.target.value);
        const productExists = productList.find((prod)=> (prod.name) === selectedProduct.name);      
        
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
                    <ProductList index={index} key={prod.id} prod={prod}/>
                ))}
            </div>
                <TotalPrice/>
                <Button addCustomer={location.state? EditOrder: addCustomer} to="/final" text="Check Out"/>
                <LinkButton to="/list" text="All Orders" />
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

  
const ProductList = ({prod, index}) => {
    const [quantity, setQuantity] = useState(0);
    const {name,price} = prod;
    const location = useLocation();
    const [,setProductList , , setTotalPrice] = useContext(CheckoutContext);
    
    useEffect(()=> {
      if (location.state){
          setQuantity(0);
      }
    }, []);

    //To increase quantity in object
    useEffect(() => {
        setProductList((prev) =>
          prev.map((product) =>  
            product.name === prod.name ? { ...product, quantity } : product
        )
        );
      }, [quantity]);

    
    //To update prices in Total Price section
    useEffect(() => {
      const productTotalPrice = ((price)*(quantity));
        setTotalPrice((prev) => prev + productTotalPrice);
        return () => {
          setTotalPrice((prev) => prev - productTotalPrice);
        };
      }, [quantity , price, setTotalPrice]);

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
                    ${(price)*(quantity)}
                </div>
                <Delete index={index}/>
            </div>
        </>
    );
}

const Delete = ({index}) => {
  const [productList, setProductList,] = useContext(CheckoutContext);
  const handleDelete = () => {
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

const TotalPrice = () => {
  const [, ,totalPrice] = useContext(CheckoutContext);
    return (
      <div className="total-price">
        <h1 style={{fontSize:"1.5rem"}}>Total Price: ${totalPrice}</h1>
      </div>
    );
  };

  const Button = ({text, to, addCustomer}) => {
    const [productList,] = useContext(CheckoutContext);

    return(
        <div className="btn-checkout">
            <Link onClick={addCustomer} to={to} className="btn-blue" state={{productList:productList}}>
                {text}
            </Link>
        </div>
    );
  }

  const LinkButton = ({text, to}) => {
    return(
      <div className="btn-checkout">
          <Link to={to} className="btn-blue">
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

export {LinkButton};