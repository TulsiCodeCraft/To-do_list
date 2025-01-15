import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import { Provider } from 'react-redux';
import { store } from './store/store';
import LandingPage from './components/Landing_Page';
import Login from './components/Login';
import Register from './components/Register';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Register />} />
          
          {/* PrivateRoute wraps LandingPage */}
          <Route 
            path="/home" 
            element={
              <PrivateRoute>
                <LandingPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
