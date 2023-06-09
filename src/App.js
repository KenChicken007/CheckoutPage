import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainCheckout from "./Components/Checkout/MainCheckout";
import MainFinal from "./Components/Final.jsx/MainFinal";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainCheckout />} />
        <Route path="/final" element={<MainFinal />} />
      </Routes>
    </Router>
  );
}

export default App;
