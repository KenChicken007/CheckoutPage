import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../Checkout/navbar";
import { Link } from "react-router-dom";

export default function ListOrder() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/list").then((res) => {
      setOrders(res.data);
    });
  }, []);

  const MoreOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3001/Expandedlist");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const OrderSet = ({ order }) => {
    return (
      <Link to="/final" state={{ order: order }}>
        <div className="order">
          <h2>{order.order_id}</h2>
          <h2>{order.name}</h2>
          <h2>{order.total_price}</h2>
          <h2>{order.date.slice(0, 10)}</h2>
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
        <MoreButton MoreOrders={MoreOrders} />
      </div>
    );
  };

  const MoreButton = ({ MoreOrders }) => {
    return (
      <>
        <div className="btn-list">
          <div className="btn-blue btn_list_padding" onClick={MoreOrders}>
            More
          </div>
        </div>
      </>
    );
  };

  const Search = ({ orders, setOrders, MoreOrders }) => {
    const [text, setText] = useState("");
    const [R1, setR1] = useState();
    const [R2, setR2] = useState();
    // const filterOrder = async () => {
    //   const filteredOrders = orders.filter((order) => {
    //     return order.name.toLowerCase().includes(text.toLowerCase());
    //   });

    //   if (filteredOrders.length < 1) {
    //     alert("Enter a name");
    //   } else {
    //     setOrders(filteredOrders);
    //   }
    // };
    const SpecificOrders = async () => {
      const res = await axios.get("http://localhost:3001/specificList", {
        params: {
          R1: R1,
          R2: R2,
        },
      });
      console.log(res.data);
      setOrders(res.data);
    };

    const searchByName = async () => {
      if (text.length < 1) {
        alert("Enter a Name");
        return;
      }

      await MoreOrders();
      handleClick();
    };

    const searchById = async () => {
      if (R1.toString().length < 1 && R2.toString().length < 1) {
        alert("Enter a Name");
        return;
      }
      await SpecificOrders();
      handleClick();
    };

    const handleClick = async () => {
      setOrders((prevOrders) => {
        const filteredOrders = prevOrders.filter((order) =>
          order.name.toLowerCase().includes(text.toLowerCase())
        );
        if (filteredOrders.length < 1) {
          alert("Invalid");
          return prevOrders; // Return the previous state if no filtering is done
        } else {
          return filteredOrders; // Return the filtered orders as the new state
        }
      });
    };

    return (
      <>
        <div className="inputs">
          <div>
            <label htmlFor="">Search by Name: </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button onClick={searchByName}>Search</button>
          </div>
          <div className="range">
            <label htmlFor="">Start</label>
            <input type="number" onChange={(e) => setR1(e.target.value)} />
            <label htmlFor="">End</label>
            <input type="number" onChange={(e) => setR2(e.target.value)} />
            <button onClick={searchById}>Search</button>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <Search orders={orders} setOrders={setOrders} MoreOrders={MoreOrders} />
      <OrderList orders={orders} MoreOrders={MoreOrders} />
    </>
  );
}
