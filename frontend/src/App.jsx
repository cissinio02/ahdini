import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/LoginClient/LoginClient';
import Register from './pages/RegisterClient/RegisterClient';
import Forgot from './pages/Forgot/Forgot';
import Terms from './pages/terms/terms';
import Home from './pages/Home/Home';
import HowItWorks from './pages/HowItWorks/HowItWorks';
import RegisterVendor from './pages/RegisterVendor/RegisterVendor';
import Gifts from './pages/Gifts/Gifts';
import ToastPro from './components/UI/ToastPro';
import VendorDashboard from './pages/VendorDashbord/VendorDashboard';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminPage from './pages/Admin/AdminPage';


 
function App() {
    return (
    
        <Router>
            <div className="App">
              <ToastPro />
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot" element={<Forgot />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/register-vendor" element={<RegisterVendor />} />
                <Route path="/gifts" element={<Gifts />} />
                <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </div>
        </Router>
    
    
    );
}

export default App;