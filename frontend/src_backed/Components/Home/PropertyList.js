import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProperties } from "../../Store/Property/property-action";
import { propertyAction } from "../../Store/Property/property-slice";
import { Link } from "react-router-dom";

const Card = ({ id, image, address, price, name }) => {
  return (
    <figure className="property w-100">
      <Link to={`/propertylist/${id}`}>
        <img src={image} alt="Propertyimg" />
      </Link>

      <p className="card-footer text-light text-center fs-6" style={{ backgroundColor: 'black' }}>{name}</p>
      <figcaption>
        <main className="propertydetails">
          <h5>{name}</h5>
          <h6>
            <span className="material-symbols-outlined houseicon">home_pin</span>
            {address}
          </h6>
          <p>
            <span className="price">₹{price}</span> per night
          </p>
        </main>
      </figcaption>
    </figure>
  );
};

const PropertyList = () => {
  const [currentPage, setCurrentPage] = useState({ page: 1 });
  const { properties, totalProperties } = useSelector(
    (state) => state.properties
  );

  const lastPage = Math.ceil(totalProperties / 12);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProperties = async (page) => {
      dispatch(propertyAction.updateSearchParams(page));
      dispatch(getAllProperties());
    };
    fetchProperties(currentPage);
  }, [currentPage, dispatch]);

  return (
    <>
      {properties.length === 0 ? (
        <p className="not_found fs-1 text-danger">"Property not found"</p>
      ) : (
        <div className="container-fluid row m-auto bg-dark">
          <p>

          </p>
          {properties.map((property) => (
            <>
              <div className="col col-sm-3 col-12 mt-3">
                <Card
                  key={property._id}
                  id={property._id}
                  image={property.images[0].url}
                  name={property.propertyName}
                  address={`${property.address.city}, ${property.address.state}, ${property.address.pincode}`}
                  price={property.price}
                />
              </div>
            </>
          ))}
        </div>
      )}

      {/* Pagination Control */}
      <div className="bg-dark p-5 d-flex justify-content-around pagination-btn">
        <button className="previous_btn"
          onClick={() => setCurrentPage((prev) => ({ page: prev.page - 1 }))}
          disabled={currentPage.page === 1}>
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <p className="text-light">Page: {currentPage.page}</p>

        <button className="next_btn"
          onClick={() => setCurrentPage((prev) => ({ page: prev.page + 1 }))}
          disabled={properties.length < 12 || currentPage.page === lastPage}>
          <span className="material-symbols-outlined">arrow_forward_ios</span>
        </button>
      </div>
    </>
  );
};

export default PropertyList;
