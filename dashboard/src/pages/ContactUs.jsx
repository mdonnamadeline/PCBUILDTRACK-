import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ContactUs.css';
import Navbar from './Navbar';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    message: '',
  });
  const [cartItemCount, setCartItemCount] = useState(0);

  const { VITE_REACT_APP_API_HOST } = import.meta.env;

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const count = storedCartItems.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(count);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, contact: Number(formData.contact) };
      const response = await axios.post(
        `${VITE_REACT_APP_API_HOST}/api/contact`,
        payload
      );
      const result = response.data;
      if (result.success) {
        alert('Thank you for your message!');
        setFormData({
          name: '',
          email: '',
          contact: '',
          message: '',
        });
      } else {
        alert('Failed to send message.');
      }
    } catch (error) {
      alert('Error sending message.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="manage-user">
        <div className="content">
          <div className="viewuser">
            <div className="vucon">
              <h1>Contact Us</h1>
              <p>
                If you have any questions or feedback, please fill out the form below.
              </p>
              <form onSubmit={handleSubmit} className="editModalText">
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact">Contact:</label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message:</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-button">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactUs;