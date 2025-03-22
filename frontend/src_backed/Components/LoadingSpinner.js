import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import "../CSS/Login.css"

const LoadingSpinner = () => {
  return (
    <div className='text-center text-danger' style={{marginTop: '2rem' }}>
      <div className='spinner-border' role="status"></div>
    </div>
  )
}

export default LoadingSpinner
