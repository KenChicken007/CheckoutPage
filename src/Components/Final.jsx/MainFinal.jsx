import "../../style.css";
import { Link } from "react-router-dom";
import Navbar from "../Checkout/navbar";
import { Button } from "../Checkout/MainCheckout";

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
            <div></div>
        </div>
    );
};

export default function MainFinal(){
    return(
    <div>
        <Navbar/>
        <div className="Outline">
            <Thanks/>
            <OrderDetails/>
            <div className="btn-final">
                <Button text="Print"/>
                <Button to="/" text="Edit"/>
            </div>
        </div>
    </div>
    );
}