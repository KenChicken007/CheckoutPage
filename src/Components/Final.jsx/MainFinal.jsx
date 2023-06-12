import "../../style.css";
import React from "react";
import Navbar from "../Checkout/navbar";
import { CheckoutProvider, CheckoutContext } from "../Checkout/product";
import { Link, useLocation} from "react-router-dom";


const Thanks = () => {
    return(
        <div className="thankyou">
            <h1>Thanks for the purchase</h1>
            <p>Thank you. Your order has been received</p>
        </div>
    );
}

const OrderDetails = () => {
    var order_num = 115;
    var order_date = "May 8, 2021";
    const location = useLocation();
    const productList = location.state.productList;
    console.log(location)
    return(
        <div className="order-outline">
            <div className="order-info">
                <h2>Order Number</h2>
                <p>{order_num}</p>
            </div>
            <div className="order-info">
                <h2>Date:</h2>
                <p>{order_date}</p>
            </div>
            <div className="order-info">
                <div className="products-content">
                    <h2>Product</h2>
                    <h2>Quantity</h2>
                </div>      
                {productList.map((prod)=>(
                    <Orders key={prod.id} prod={prod}/>
                ))}
                </div>
                
            </div>
        
    );
};

const Orders = ({prod}) => {
    return(
        <>
            <div className="products-content">
                <div>
                    <img src="" alt="" />
                    {prod.name}
                </div>
                <div className="quantity">
                    {prod.quantity}
                </div>
            </div>
        </>
    );
}

const EditButton = ({text, to}) => {

    return(
        <div className="btn-checkout">
            <Link to={to} className="btn-blue">
                {text}
            </Link>
        </div>
    );
  }

  const PrintButton = ({text}) => {

    return(
        <div className="btn-checkout">
            <div onClick={window.print} className="btn-blue">
                {text}
            </div>        
        </div>
    );
  }

export default function MainFinal(){
    return(
    <div>
        <Navbar/>
        <div className="Outline">
            <Thanks/>
            <CheckoutProvider>
                <OrderDetails/>
            </CheckoutProvider>
            <div className="btn-final">
                <PrintButton text="Print"/>
                <EditButton to="/" text="Edit"/>
            </div>
        </div>
    </div>
    );
}