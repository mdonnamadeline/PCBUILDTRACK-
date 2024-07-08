import React from 'react'
import Navbar from './Navbar';
import Zinger from '../images/zinger.jpg'
import Dasurv from '../images/dasurv.jpg'
import './Home.css'

export default function Home() {
  return (
    <div className='home'>
       <Navbar /> 
       <div className='homecon'>
       <img src={Zinger} alt="Zinger" />
       <img src={Dasurv} alt="Dasurv" />
       </div>
    </div>
  )
}