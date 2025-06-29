import React from 'react'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/userContext'
import AUTH_IMG from '../../assets/auth-img.jpg'
import Input from '../Inputs/Input'
import { validateEmail } from '../../utils/helper'

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const { updateUser, setOpenAuthForm } = useContext(UserContext)
  const navigate = useNavigate()

  //handle login form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateEmail(email)) {
      setError("Please enter a valid email")
      return;
    }
    if (!password) {
      setError("Please enter a password")
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return;
    }
    //clear error if validation passed
    setError(null);

    //login api call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password })

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data)
      }
      //redirect based on role
      if (role === "admin") {
        navigate("/admin/dashboard")
      }
      else {
        navigate("/")
      }
      setOpenAuthForm(false)
    }
    catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
      }
      else {
        setError("Something went wrong")
      }
    }
  }

  return (
    <div className='flex items-center'>
      <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-slate-700 text-sm mb-6 mt-[2px]'>Please enter your details to login</p>

        <form onSubmit={handleSubmit} className=''>
          <Input
            value={email}
            onChange={({target}) => setEmail(target.value)}
            placeholder="shadi@gmail.com"
            label="Email Address"
            type="email"
          />

          <Input
            value={password}
            onChange={({target}) => setPassword(target.value)}
            placeholder="Minimum 8 characters"
            label="Password"
            type="password"
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>Login</button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account? {" "}
            <button className='font-medium text-primary underline cursor-pointer'
              onClick={() =>
                setCurrentPage("signup")} >Sign Up
            </button>
          </p>
        </form>
      </div>

      <div className='hidden md:block'>
        <img src={AUTH_IMG} className='h-[400px]' alt="auth-img " />
      </div>
    </div>
  )
}

export default Login;