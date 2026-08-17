import React from 'react'
import Home from './pages/Home';
import getCurrentUser from './features/getCurrentUser';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData } from './redux/userSlice';



function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser=async()=>{
      const data=await getCurrentUser();
      console.log("userdata(App)::::", data)
      dispatch(setUserData(data));
    }
    getUser();
  }, [])

  return (
    <>
      <Home />
    </>
  )
}

export default App
