import "../../style.css";
import React, { useContext, useRef } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import { product, CheckoutContext, CheckoutProvider } from "./product";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Content = () => {
  const [productList, setProductList] = useContext(CheckoutContext);
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState(0);
  //Get the product List from final page
  const location = useLocation();
  const [orderId, setOrderId] = useState(null);
  console.log(location);
  const len = useRef(0);

  //Updating current product list from products in MainFinal
  useEffect(() => {
    if (location.state) {
      const OldProductList = location.state.OldProductList;
      const updatedProductList = OldProductList.map((oldProduct) => ({
        id: oldProduct.product_id ?? oldProduct.id,
        name: oldProduct.product_name ?? oldProduct.name,
        price: oldProduct.product_price ?? oldProduct.price,
        prod_quantity: oldProduct.product_quantity ?? oldProduct.quantity,
      }));
      len.current = OldProductList.length;
      setName(location.state.name);
      setProductList(updatedProductList);
      setOrderId(location.state.orderId);
    }
  }, []);
  console.log(productList);

  // //Adding orders to mysql
  // const addCustomer = async () => {
  //   try {
  //     const res = await axios.post("http://localhost:3001/create", {
  //       name: name,
  //       productList: productList,
  //     });
  //     return res.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  //Adding orders to mysql
  const addCustomer = async () => {
    try {
      const res = await axios.post("http://localhost:3001/create", {
        name: name,
        productList: productList,
      });
      const updatedOrderId = res.data;
      setOrderId(updatedOrderId);
      console.log("Working ADD");
    } catch (error) {
      console.log(error);
    }
  };

  //Updating Orders to mysql
  const EditOrder = async () => {
    // console.log(name, productList, orderId, len);
    try {
      axios.post("http://localhost:3001/update", {
        name: name,
        productList: productList,
        orderId: orderId,
        len: len.current,
      });
      console.log("Working Edit");
    } catch (error) {
      console.log(error);
    }
  };

  //Products selection from Radiobox
  const handleSelectProduct = (event) => {
    const selectedProduct = product.find(
      (prod) => prod.name === event.target.value
    );

    //Making sure products aren't selected twice in radio box
    const productExists = productList.find(
      (prod) => prod.name === selectedProduct.name
    );

    if (!productExists) {
      setProductList((prev) => [...prev, selectedProduct]);
    }
  };

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

  return (
    <>
      <form>
        <div className="inputs">
          <h1>User Info</h1>
          <hr />
          <label htmlFor="text">Name: </label>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="xyz"
            value={name}
            required
          />
        </div>
      </form>

      <div className="product">
        <h2>Select Product: </h2>
        <select onChange={handleSelectProduct}>
          {product.map((prod) => (
            <RadioBox key={prod.id} prod={prod} />
          ))}
        </select>
      </div>

      <div className="products">
        <div className="products-content">
          <h2 className="product-title">Products</h2>
          <h2>Quantity</h2>
          <h2 className="total-price">Total Price</h2>
          <h2></h2>
        </div>
        <br />
        {productList.map((prod, index) => (
          <ProductList index={index} key={prod.id} prod={prod} />
        ))}
      </div>
      <Discount discount={discount} setDiscount={setDiscount} />
      <TotalPrice />
      <Button
        addCustomer={location.state ? EditOrder : addCustomer}
        orderId={orderId}
        name={name}
        to="/final"
        text="Check Out"
      />
    </>
  );
};

const Discount = ({ discount, setDiscount }) => {
  const [, , totalPrice, setTotalPrice] = useContext(CheckoutContext);
  const [ogPrice, setOgPrice] = useState();

  const getDiscount = () => {
    if (discount <= 0) {
      if (totalPrice < ogPrice) {
        setTotalPrice(ogPrice);
      } else {
        alert("Enter a valid number");
        return;
      }
    }

    if (totalPrice === ogPrice) {
      // Apply discount
      setTotalPrice(totalPrice * (1 - discount / 100));
    } else {
      // Revert back to original price and recalculate discount
      setTotalPrice(ogPrice * (1 - discount / 100));
    }
  };

  useEffect(() => {
    if (totalPrice && discount <= 0) {
      setOgPrice(totalPrice);
    }
  }, [totalPrice]);

  return (
    <>
      <div style={{ margin: "3rem 0" }}>
        <label>Enter Discount(%)</label>
        <input type="Number" onChange={(e) => setDiscount(e.target.value)} />
        <button onClick={getDiscount} disabled={totalPrice < 1}>
          Get Discount
        </button>
      </div>
    </>
  );
};

const RadioBox = ({ prod }) => {
  return <option value={prod.name}>{prod.name}</option>;
};

const ProductList = ({ prod, index }) => {
  const [quantity, setQuantity] = useState(0);
  const { name, price, prod_quantity } = prod;
  const location = useLocation();
  const [, setProductList, , setTotalPrice] = useContext(CheckoutContext);

  useEffect(() => {
    if (location.state) {
      setQuantity(prod_quantity);
      delete prod.prod_quantity;
    }
  }, []);

  //To increase quantity in object
  useEffect(() => {
    setProductList((prev) =>
      prev.map((product) =>
        product.name === prod.name ? { ...product, quantity } : product
      )
    );
  }, [quantity]);

  //To update prices in Total Price section
  useEffect(() => {
    const productTotalPrice = price * quantity;
    setTotalPrice((prev) => prev + productTotalPrice);
    return () => {
      setTotalPrice((prev) => prev - productTotalPrice);
    };
  }, [quantity, price, setTotalPrice]);

  function lowerQuantity() {
    if (quantity > 0) {
      setQuantity((prev) => prev - 1);
    }
  }

  function increaseQuantity() {
    setQuantity((prev) => prev + 1);
  }

  return (
    <>
      <div className="products-content">
        <div>{name}</div>
        <div className="btn">
          <button onClick={() => lowerQuantity()}>-</button>
          {quantity}
          <button onClick={() => increaseQuantity()}>+</button>
        </div>
        <div className="price">${price * quantity}</div>
        <Delete index={index} />
      </div>
    </>
  );
};

const Delete = ({ index }) => {
  const [productList, setProductList] = useContext(CheckoutContext);

  // Deletes products with same index
  const handleDelete = () => {
    const Updatedproduct = productList.filter((prod, i) => i !== index);
    setProductList(Updatedproduct);
  };
  return (
    <>
      <div onClick={handleDelete} data-index={index} className="delete">
        <img
          src={require("../../Images/delete-button-svgrepo-com.svg").default}
          alt=""
        />
      </div>
    </>
  );
};

const TotalPrice = () => {
  const [, , totalPrice] = useContext(CheckoutContext);
  return (
    <div className="total-price">
      <h1 style={{ fontSize: "1.5rem" }}>Total Price: ${totalPrice}</h1>
    </div>
  );
};

const Button = ({ text, to, addCustomer, orderId, name }) => {
  const [productList] = useContext(CheckoutContext);
  const [isNavigate, setIsNavigate] = useState(false);
  const navigate = useNavigate();
  console.log(name);

  const handleButtonClick = async () => {
    if (!name) {
      alert("Enter your name");
      return;
    }
    try {
      await addCustomer();
      setIsNavigate(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isNavigate) {
      handleNextPage();
    }
  }, [isNavigate]);

  const handleNextPage = async () => {
    if (orderId) {
      navigate(to, {
        state: {
          productList: productList,
          orderId: orderId,
        },
      });
    }
  };

  return (
    <div className="btn-checkout">
      <button
        onClick={handleButtonClick}
        to={to}
        className="btn-blue"
        state={{ orderId: orderId }}
      >
        {text}
      </button>
    </div>
  );
};

export default function MainCheckout() {
  return (
    <>
      <Navbar />
      <div className="Outline">
        <CheckoutProvider>
          <Content />
        </CheckoutProvider>
      </div>
    </>
  );
}
