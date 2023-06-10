import "../../style.css";
import { useState, useEffect } from "react";
import {Link} from 'react-router-dom'
import Navbar from "./navbar";

const Content = () => {
    const [totalPrice, setTotalPrice] = useState(0);
    const [product, setProduct] = useState([
        {
            id: 1,
            name: "Bag",
            price: "25",
            quantity: 0,
        },
        {
            id: 2,
            name: "Bucket",
            price: "5",
            quantity: 0,
        },
        {
            id: 3,
            name: "Knife",
            price: "10",
            quantity: 0,
        },
        {
            id: 4,
            name: "Machete",
            price: "75",
            quantity: 0,
        },
    ]);

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
                {/* <div className="product-items">
                    <div className="product">
                        <h1>Product</h1>
                        {product.map((prod)=>(
                            <Productlist key={prod.id} prod={prod}/>
                        ))}
                    </div>
                    <div className="quantity">
                        <h1>Quantity</h1>
                        {product.map((prod)=>(
                        <QuantityList quantity={quantity} setQuantity={setQuantity} setTotalPrice={setTotalPrice} key={prod.id} prod={prod}/>
                        ))} 
                        </div>
                    <div className="price">
                        <h1>Price</h1>
                        {product.map((prod)=>(
                        <Pricelist quantity={quantity} setTotalPrice={setTotalPrice} key={prod.id} prod={prod}/>
                        ))} 
                    </div>
                </div> */}
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

const Productlist = ({prod}) => {
    const {name} = prod;
    return (
        <>  
            <div>
                <img src="" alt="" />
                {name}
            </div>
        </>
    );
}
const QuantityList = ({prod, setTotalPrice, quantity, setQuantity}) => {
    const {price} = prod;
    
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
    return (
        <>
        <div className="btn">
                    <button onClick={()=> lowerQuantity()}>-</button>
                    {quantity}
                    <button onClick={()=> increaseQuantity()}>+</button>
                </div>

        </>
    );
}

const Pricelist = ({prod, quantity}) => {
    const {name,price} = prod;
    return (
        <>
            <div>
                    ${price*quantity}
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

export default function MainCheckout(){
    return(
        <>
        <Navbar/>
        <div className="Outline">
            <Content/>
            <Button to="/final" text="Check Out"/>
        </div>
        </>
    )
}

export {Button};