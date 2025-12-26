import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo_noir from '../../../assets/images/logo_grenas.png';
import styles from './Header.module.css';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={logo_noir} alt="Ahdini Logo" />
          <span>Ahdini</span>
        </div>

        <nav className={styles.nav}>
          <a href="#how-it-works" className={styles.navLink}>How it works</a>
          <a href="#gifts" className={styles.navLink}>Gifts</a>
          <a href="#schedule" className={styles.navLink}>Schedule</a>
          <a href="#contact" className={styles.navLink}>Contact</a>
        </nav>

        <div className={styles.buttons}>
          <Link to="/login" className={styles.loginBtn}>
            Login
          </Link>
          <Link to="/register" className={styles.getStartedBtn}>
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
