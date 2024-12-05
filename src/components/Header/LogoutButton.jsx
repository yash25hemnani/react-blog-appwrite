import React from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import {logout} from '../../store/authSlice'

function LogoutButton() {
    const dispatch = useDispatch();
    const logoutHandler = () => {
        // Most things in Appwrite are promises
        authService.logout().then(() => {
            dispatch(logout())
            console.log("User logged out successfully.")
        })
    }
  return (
    <button
    onClick={logoutHandler}
    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
    >Logout</button>
  )
}

export default LogoutButton

