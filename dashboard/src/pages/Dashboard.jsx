import React from 'react';
// import Sidebar from './Sidebar' ;
import Navbar from './Navbar';

export default function Dashboard() {
  return (
    <div className='dashboard'>
      {/* <Sidebar /> */}
      <Navbar />
      <div className='con'>
      <h1>Welcome Admin!</h1> 
      </div>
    </div>
  );
}