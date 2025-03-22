import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { propertyAction } from "../../Store/Property/property-slice";
import { getAllProperties } from "../../Store/Property/property-action";
import { Logout } from "../../Store/User/user-action";
import { toast } from "react-toastify";
import Search from "./Search";
import Filter from "./Filter";

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const logout = () => {
    dispatch(Logout());
    toast.success("User has been logged out successfully");
    navigate("/");
  };

  const allproperties = () => {
    dispatch(propertyAction.updateSearchParams({}));
    dispatch(getAllProperties());
  };

  return (
    <>
      <nav className="row sticky-top m-auto d-flex justify-content-around align-items-center" style={{backgroundColor: 'black', width: '100%', height:'90px'}}>
        <Link to="/" className="nav-link text-danger" style={{fontSize: '20px'}}>
          {/* <img src="/assets/logo.png" alt="logo" className="logo" onClick={allproperties} /> */}
          <strong>BookMyRoom</strong>
        </Link>
        <div className="search_filter rounded-pill h-50 d-flex align-items-center justify-content-around bg-dark">
          <Search />
          <Filter />
        </div>
        {!isAuthenticated && !user && (
          <Link to="/login">
            <span className="material-symbols-outlined web_logo"> account_circle </span>
          </Link>
        )}
        {isAuthenticated && user && (
          <div className="dropdown">
            <span
              className="material-symbols-outlined web_logo dropdown-toggle "
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {user.avatar.url && (
                <img src={user.avatar.url} className="user-img" alt="icon" />
              )}
              {!user.avatar.url === "" && "account_circle"}
            </span>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li>
                <Link className="dropdown-item" to="/profile"> My Account </Link>
              </li>
              <li>
                <button className="dropdown-item" type="button" onClick={logout}> Logout </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;
