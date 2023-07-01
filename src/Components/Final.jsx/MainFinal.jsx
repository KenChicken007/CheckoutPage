import "../../style.css";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Checkout/navbar";
import { Link, useLocation } from "react-router-dom";
import Axios from "axios";
import ReactToPrint from "react-to-print";

export default function MainFinal() {
  const [productList, setProductList] = useState([]);
  const [order, setOrder] = useState([]);
  const location = useLocation();
  const componentRef = useRef();
  console.log(location);
  const orderId = location.state.orderId ?? location.state.order.order_id;
  console.log("OrderID: ", orderId);

  const fetchRelevantProduct = async () => {
    try {
      const response = await Axios.get(
        `http://localhost:3001/products/${orderId}`
      );

      console.log("Resp: ", response);
      setProductList(response.data.map((d) => [{ ...d }][0]));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrderDetails = async () => {
    const response = await Axios.get(`http://localhost:3001/orders/${orderId}`);
    console.log("Order Resp: ", response.data);
    setOrder(response.data);
  };

  // const fetchOrder = async () => {
  //   await Axios.get("http://localhost:3001/final").then((res) => {
  //     setOrder(res.data[res.data.length - 1]);
  //     console.log(order.order_id);
  //   });
  // };

  useEffect(() => {
    fetchRelevantProduct();
    fetchOrderDetails();
  }, []);

  return (
    <>
      {order.length < 1 ? (
        <p>...Loading</p>
      ) : (
        <div>
          <Navbar />
          <div className="Outline">
            <div ref={componentRef}>
              <Thanks />
              <OrderDetails
                orderId={orderId}
                order={order ?? {}}
                productList={productList}
              />
            </div>
            <div className="btn-final">
              <ReactToPrint
                className="btn-blue"
                trigger={() => {
                  return (
                    <div className="btn-checkout">
                      <div onClick={OrderDetails.print} className="btn-blue">
                        print
                      </div>
                    </div>
                  );
                }}
                content={() => componentRef.current}
              />
              <EditButton
                orderId={orderId}
                OldProductList={productList}
                name={order[0].name}
                to="/"
                text="Edit"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const Thanks = () => {
  return (
    <div className="thankyou">
      <h1>Thanks for the purchase</h1>
      <p>Thank you. Your order has been received</p>
    </div>
  );
};

const OrderDetails = ({ productList, order, orderId }) => {
  return (
    <div className="order-outline">
      <div className="order-info">
        <h2>Order Number</h2>
        <p>{orderId}</p>
      </div>
      <div className="order-info">
        <h2>Name</h2>
        <p>{order[0].name ?? null}</p>
      </div>
      <div className="order-info">
        <h2>Date</h2>
        <p>{order[0].date.slice(0, 10)}</p>
      </div>
      <div className="order-info">
        <div className="products-content">
          <h2>Product</h2>
          <h2>Quantity</h2>
        </div>
        {productList.map((prod) => (
          <Orders key={prod.id || prod.product_id} prod={prod} />
        ))}
      </div>
    </div>
  );
};

const Orders = ({ prod }) => {
  return (
    <>
      <div className="products-content">
        <div>
          <img src="" alt="" />
          {prod.name || prod.product_name}
        </div>
        <div className="quantity">{prod.quantity || prod.product_quantity}</div>
      </div>
    </>
  );
};

const EditButton = ({ text, to, OldProductList, orderId, name }) => {
  console.log("id:", name);
  return (
    <div className="btn-checkout">
      <Link
        to={to}
        state={{ OldProductList: OldProductList, orderId: orderId, name: name }}
        className="btn-blue"
      >
        {text}
      </Link>
    </div>
  );
};

const NewButton = ({ text, to }) => {
  return (
    <div className="btn-checkout">
      <Link to={to} className="btn-blue">
        {text}
      </Link>
    </div>
  );
};
