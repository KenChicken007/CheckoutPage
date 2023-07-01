import { Link } from "react-router-dom";
import "../../style.css";

const Navbar = () => {
  const LinkButton = ({ text, to }) => {
    return (
      <div className="btn-checkout">
        <Link to={to} className="btn-blue">
          {text}
        </Link>
      </div>
    );
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-content">
          <div className="nav-logo">
            <img src="" alt="Company Logo" />
          </div>
          <div className="nav-items">
            <ul>
              <li>
                <LinkButton to="/list" text="All Orders" />
              </li>
              <li>
                <LinkButton to="/" text="New" />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
