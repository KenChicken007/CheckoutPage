import "../../style.css";
import React, { useEffect,useRef,useState } from "react";
import Navbar from "../Checkout/navbar";
import { Link, useLocation} from "react-router-dom";
import Axios from "axios";
import { LinkButton } from "../Checkout/MainCheckout";

export default function MainFinal(){
    const [relevantProduct, setRelevantProduct] = useState([]);
    const order = useRef([]);
    const location = useLocation();
    
    
    const orderList = location.state.order ?? {};
    const orderID = orderList?.order_id;
    const productList = (location.state.productList ? location.state.productList : relevantProduct);   
    console.log("Orders: ",productList);

    const fetchRelevantProduct = async () => {
        try{
            const response = await Axios.get(
                `http://localhost:3001/products/${orderList.order_id}`
            );
            
            console.log("Resp: ",response);
            setRelevantProduct((response.data).map((d)=> ([{...d}][0])));
        } catch (error){
            console.log(error);
        }
    }
    
    const fetchOrder = async () => {
        await Axios.get("http://localhost:3001/final")
        .then((res) => {
            order.current = res.data[res.data.length-1];
        })
    }

    useEffect(()=> {
          if (orderList){
            fetchRelevantProduct();
          }
          else {
            fetchOrder();
          }
    }, [order]);
    
    return(
    <div>
        <Navbar/>
        <div className="Outline">
            <Thanks/>
            <OrderDetails order={order.current} orderList={orderList} productList={productList}/>
            <div className="btn-final">
                <PrintButton text="Print"/>
                {orderID && <EditButton orderList={orderList} OldProductList={productList} to="/" text="Edit"/>}
                <NewButton to="/" text="New" />
                <LinkButton to="/list" text="All Orders" />
            </div>
        </div>
    </div>
    );
}

const Thanks = () => {
    return(
        <div className="thankyou">
            <h1>Thanks for the purchase</h1>
            <p>Thank you. Your order has been received</p>
        </div>
    );
}

const OrderDetails = ({order, orderList, productList}) => {
    //Line doesn't work when adding a new product
    //Order Details runs before useEffect causing an undefined order for a few seconds
    var order_num = (order?.length>1 ? order.order_id : orderList.order_id);
    var order_date = (order?.length>1 ? order.date : orderList.date);
    
    return(
        <div className="order-outline">
            <div className="order-info">
                <h2>Order Number</h2>
                <p>{order_num}</p>
            </div>
            <div className="order-info">
                <h2>Date</h2>
                <p>{order_date}</p>
            </div>
            <div className="order-info">
                <div className="products-content">
                    <h2>Product</h2>
                    <h2>Quantity</h2>
                </div>      
                {productList.map((prod)=>(
                    <Orders key={prod.id || prod.product_id} prod={prod}/>
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
                    {prod.name || prod.product_name}
                </div>
                <div className="quantity">
                    {prod.quantity || prod.product_quantity}
                </div>
            </div>
        </>
    );
}

const EditButton = ({text, to, OldProductList, orderID}) => {
    return( 
        <div className="btn-checkout">
            <Link to={to} state={{OldProductList:OldProductList, orderID:orderID}} className="btn-blue">
                {text}
            </Link>
        </div>
    );
  }
  
  const NewButton = ({text, to}) => {
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

