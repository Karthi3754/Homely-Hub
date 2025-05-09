import React, { useEffect } from "react";
import "../../CSS/Accomodation.css";
import ProgressSteps from "../ProgressSteps";
import AccomodationForm from "./AccomodationForm";
import MyAccomodation from "./MyAccomdation";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllAccomodation } from "../../Store/Accomodation/Accomodation-action";
import LoadingSpinner from "../LoadingSpinner";

const Accomodation = () => {
  const dispatch = useDispatch();

  // Set default value to [] in case accomodation is undefined
  const { accomodation = [], loading } = useSelector((state) => state.accomodation);

  useEffect(() => {
    dispatch(getAllAccomodation());
  }, [dispatch]);

  return (
    <>
      <ProgressSteps accomodation />
      <div className="accom-container">
        <Link to="/accomodationform">
          <button className="add-new-place">+ Add new place</button>
        </Link>

        {loading && <LoadingSpinner />}

        {!loading && accomodation.length === 0 && (
          <p>Accomodation not available</p>
        )}

        {!loading && accomodation.length > 0 && (
          <MyAccomodation accomodation={accomodation} loading={loading} />
        )}
      </div>
    </>
  );
};

export default Accomodation;
