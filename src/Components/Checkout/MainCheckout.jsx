import "../../style.css";
import { useState, useEffect } from "react";
import {Link} from 'react-router-dom'
import Navbar from "./navbar";
import { product } from "./product";

const Content = () => {
    const [totalPrice, setTotalPrice] = useState(0);


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
                <input type="text" placeholder="xyz" />
                <br />
                </div>
            </form> 

            <div className="products">
                <div className="products-content">
                    <h2>Products</h2>
                    <h2>Quantity</h2>
                    <h2>Total Price</h2>
                </div>
                <br />
                {product.map((prod)=>(
                    <ProductList setTotalPrice={setTotalPrice} key={prod.id} prod={prod}/>
                ))}
                </div>
                <TotalPrice totalPrice={totalPrice}/>
        </>
    );
}

const ProductList = ({prod, setTotalPrice}) => {
    const [quantity, setQuantity] = useState(0);
    const {name,price} = prod;
    
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

  const Button = ({text, to}) => {
    return(
        <div className="btn-checkout">
            <Link to={to} className="btn-blue">
                {text}
            </Link>
        </div>
    );
  }

  const handleChange = () => {

  }
export default function MainCheckout(){
    return(
        <>
        <Navbar/>
        <div className="Outline">
            <Content/>
            <Button onClick={handleChange} to="/final" text="Check Out"/>
        </div>
        </>
    )
}

export {Button};