import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../Checkout/navbar";
import { Link } from "react-router-dom";

export default function ListOrder() {
  const [orders, setOrders] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    GetOrders();
  }, [currentIndex]);

  const GetOrders = () => {
    console.log(currentIndex);
    axios
      .get("http://localhost:3001/list", {
        params: {
          currentIndex: currentIndex,
        },
      })
      .then((res) => {
        setOrders(res.data);
      });
  };

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
          <div className="order">
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
        <OffsetButton
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          GetOrders={GetOrders}
        />
      </div>
    );
  };

  const OffsetButton = ({ setCurrentIndex, currentIndex }) => {
    console.log(orders);
    return (
      <>
        <div className="btn-list">
          {currentIndex >= 10 && (
            <div
              className="btn-blue"
              onClick={() => setCurrentIndex((prev) => prev - 10)}
            >
              Prev
            </div>
          )}
          {orders.length > 0 ? (
            <div
              className="btn-blue"
              onClick={() => setCurrentIndex((prev) => prev + 10)}
            >
              Next
            </div>
          ) : (
            <h1>
              <b> No further Orders</b>
            </h1>
          )}
        </div>
      </>
    );
  };

  const Search = ({ orders, setOrders, MoreOrders }) => {
    const [text, setText] = useState("");
    const [R1, setR1] = useState();
    const [R2, setR2] = useState();

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
          <div className="input">
            <label htmlFor="">Search by Name: </label>
            <input
              className="input-name"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="input-btn" onClick={searchByName}>
              Search
            </button>
          </div>
          <div className="input">
            <label htmlFor="">Start</label>
            <input
              className="input-range"
              type="number"
              onChange={(e) => setR1(e.target.value)}
            />
            <label htmlFor="">End</label>
            <input
              className="input-range"
              type="number"
              onChange={(e) => setR2(e.target.value)}
            />
            <button className="input-btn" onClick={searchById}>
              Search
            </button>
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
