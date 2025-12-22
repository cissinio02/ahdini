import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register';

 
function App() {
    return (
    
        <Router>
            <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/" element={<Register />} />
            
          </Routes>

            </div>

</Router>
    
    
    );
}

export default App; 