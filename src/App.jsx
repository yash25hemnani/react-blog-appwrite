import { useEffect, useState } from 'react'
import './App.css'
import { useDispatch } from 'react-redux';
// Importing our Auth Service
import authService from './appwrite/auth'
import { login, logout } from './store/authSlice'
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Outlet } from 'react-router-dom';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch() 

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if(userData) {
        // If data is received, then add it to userData and the status will automatically be true
        dispatch(login({userData}))
      } else {
        // If data is not received, status will automatically be false
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [])
  

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        <main>
          {/* <Outlet /> */}
        </main>
        <Footer />
      </div>
    </div>
  ) : (null)
}

export default App
