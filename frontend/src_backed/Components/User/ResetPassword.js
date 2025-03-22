import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { resetPassword } from '../../Store/User/user-action'
import { toast } from 'react-toastify'
const ResetPassword = () => {
    const dispatch = useDispatch()
    const navigate= useNavigate()
    const {token} = useParams()
    const [password, setPassword] = useState('')
    const [ passwordConfirm, setPasswordConfirm] = useState('')

    const submitHandler = (e) => {
        e.preventDefault()
        if(password !== passwordConfirm) {
            return toast.error("Password doesn't match")
        }
        dispatch(resetPassword({password, passwordConfirm}, token))
        toast.success("password changed successfully")
        navigate('/login')
    }

  return (

    <div className='row wrapper'>
        <div className='col-10 col-lg-5'>
            <form className="shadow-lg" onSubmit={submitHandler}>
                <h1 className='password_title'>New Password</h1>
                <div className='form-group'>
                    <label htmlFor='password_field'>Password</label>
                    <input type='password' className='form-control' id='password_field' 
                    value={password} 
                    onChange={(e)=> setPassword(e.target.value)}/>
                </div>
                <div className='form-group'>
                    <label htmlFor='password_confirm_field'>Password Confirm</label>
                    <input type='password' className='form-control' id='password_confirm_field' 
                    value={passwordConfirm} 
                    onChange={(e)=> setPasswordConfirm(e.target.value)}/>
                </div>
                <button
                    id='forgot_password_button'
                    type='submit'
                    className='btn-block py-3 password-btn'
                  >
                    Change Password
                  </button>


            </form>

        </div>
      
    </div>
  )
}

export default ResetPassword
