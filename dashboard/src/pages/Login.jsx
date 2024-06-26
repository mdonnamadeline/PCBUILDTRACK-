import React from 'react';
import './Login.css'; 

export default function Login() {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Login button clicked");
  };

  return (
    <div className="loginContainer">
      <input type="text" id="username" className="loginInput" placeholder="Username" />
      <input type="password" id="password" className="loginInput" placeholder="Password" />
      <button className="loginButton" onClick={handleSubmit}>
        Login
      </button>
    </div>
  );
}