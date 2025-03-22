import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "../../CSS/Modal.css";

const Modal = ({ propertyName, images, onClose }) => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "visible";
        };
    }, []);

    return (<>

        <div className="modal-backdrop">
            <div className="modal-content p-3">
                <div className="modal-header sticky-top bg-light" style={{ top: '-20px' }}>
                    <h5 className="modal-title">{propertyName} - All Images</h5>
                    <button type="button" className="btn btn-outline-danger" onClick={onClose}> Close </button>
                </div>
                <div className="modal-body">
                    {images.map((image, index) => (
                        <img key={index} src={image.url} alt={`Image ${index + 1}`} width='650' className="mb-3" />
                    ))}
                </div>
                <div className="modal-footer">
                    End of Images
                </div>
            </div>
        </div>

        {/* <div className="modal-backdrop">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    <span>&times;</span>
                </button>
                <div className="modal-image-container">
                    {images.map((image, index) => (
                        <img key={index} src={image.url} alt={`Image ${index + 1}`} />
                    ))}
                </div>
            </div>
        </div> */}
    </>
    );
};

Modal.propTypes = {
    images: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Modal;
