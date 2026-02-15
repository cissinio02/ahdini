import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { logo_grenas } from '../../../assets/icons/icons';
import styles from './Header.module.css';
import authService from '../../../Services/authService';
import { showErrorToast } from '../../UI/ToastPro';
import toast from 'react-hot-toast';

const Header = () => {
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user'));

 const handleLogout = async () => {
    const loadingId = toast.loading('Logging out...'); // show loading msg
    
    try {
      //call api logout from backend
      const res = await authService.logout();

    
      if (res.status === 200 || res.data?.status === 'success') {
        showSuccessToast('Logged out', 'See you soon!');
      }
    } catch (error) {
     
      console.error('Logout error:', error);
    } finally {
      // aditional step even if server works or not 
     
       // delete local data
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      //navigate to login page
      setTimeout(() => {
        navigate('/login');
        window.location.reload(); //reload header state
      }, 1000);
    }
  };
 
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={logo_grenas} alt="Ahdini Logo" />
          <Link to="/vendor-dashboard" style={{ textDecoration: 'none' }}><span>Ahdini</span></Link>
        </div>

        {}
        {!user && (
          <div className={styles.partnerHeader}>
            <Link to="/registervendor" className={styles.partnerLink}>
              Become our Partner
            </Link>
          </div>
        )}

        <nav className={styles.nav}>
          <Link to="/how-it-works" className={styles.navLink}>How it works</Link>
          <Link to="/gifts" className={styles.navLink}>Gifts</Link>
          <Link to="/schedule" className={styles.navLink}>Schedule</Link>
          <Link to="/contact" className={styles.navLink}>Contact</Link>
        </nav>

        <div className={styles.buttons}>
          {}
          {!user ? (
            <>
              <Link to="/login" className={styles.loginBtn}>
                Login
              </Link>
              <Link to="/register" className={styles.getStartedBtn}>
                Get Started
              </Link>
            </>
          ) : (
          
            <div className={styles.userInfo}>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

  