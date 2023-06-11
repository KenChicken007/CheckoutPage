import "../../style.css";
import React from "react";
import Navbar from "../Checkout/navbar";
import { Button } from "../Checkout/MainCheckout";
import { CheckoutProvider, CheckoutContext } from "../Checkout/product";

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
    const [productList] = React.useContext(CheckoutContext);
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
                    <h3>Price</h3>
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
                <div>
                    {prod.quantity}
                </div>
                <div>
                    {prod.price}
                </div>
            </div>
        </>
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
                <Button text="Print"/>
                <Button to="/" text="Edit"/>
            </div>
        </div>
    </div>
    );
}