import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    streetAddress: '',
    city: '',
    zipCode: ''
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register({ username: formData.email }));
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 transform hover:scale-[1.01] transition-transform duration-300">
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
          <div className="flex flex-col items-center justify-center space-y-2 mb-8">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-2">
              <span className="text-white font-bold text-xl">Do</span>
            </div>
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Get Started
            </h2>
            <p className="text-center text-gray-600">
              Create your account to continue
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-green-500"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-green-500"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-green-500"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-green-500"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                id="streetAddress"
                name="streetAddress"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-green-500"
                placeholder="Enter your street address"
                value={formData.streetAddress}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-green-500"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-green-500"
                  placeholder="Enter zip code"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                Get Started
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="font-medium text-green-600 hover:text-green-500 transition-colors duration-300"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

