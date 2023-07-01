import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../Checkout/navbar";
import { Link } from "react-router-dom";

export default function ListOrder() {
  const [orders, setOrders] = useState([]);
  const [isList, SetIsList] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3001/list").then((res) => {
      setOrders(res.data);
    });
  }, []);

  const OrderSet = ({ order }) => {
    return (
      <Link to="/final" state={{ order: order }}>
        <div className="order">
          <h2>{order.order_id}</h2>
          <h2>{order.name}</h2>
          <h2>{order.total_price}</h2>
          <h2>{order.date}</h2>
        </div>
      </Link>
    );
  };

  const OrderList = ({ orders }) => {
    return (
      <div>
        <div className="orders">
          <div className="order-outline order">
            <h2>Order ID</h2>
            <h2>Name</h2>
            <h2>Total Amount</h2>
            <h2>Date</h2>
          </div>
        </div>
        {orders.map((order) => {
          return (
            <div className="orders">
              <OrderSet order={order} />
            </div>
          );
        })}
        <MoreButton />
      </div>
    );
  };

  const MoreButton = () => {
    const handleClick = () => {
      axios.get("http://localhost:3001/Expandedlist").then((res) => {
        setOrders(res.data);
      });
    };
    return (
      <>
        <div className="btn-list">
          <div className="btn-blue btn_list_padding" onClick={handleClick}>
            More
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <OrderList orders={orders} />
    </>
  );
}
