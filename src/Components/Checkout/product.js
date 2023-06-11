import React from "react";

const product = [
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
];

const CheckoutContext = React.createContext(null);

const CheckoutProvider = ({ children }) => {
  const [productList, setProductList] = React.useState([]);
  return (
    <CheckoutContext.Provider value={[productList, setProductList]}>
      {children}
    </CheckoutContext.Provider>
  );
};

export { product, CheckoutProvider, CheckoutContext };
