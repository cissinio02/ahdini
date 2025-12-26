import React from 'react';
import logo_Black from '../../../assets/images/logo_Black.png';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brandSection}>
            <div className={styles.logoContainer}>
              <img src={logo_Black} alt="Ahdini Logo" className={styles.logo} />
              <h2 className={styles.brandName}>Ahdini</h2>
            </div>
            <p className={styles.tagline}>
              Delivering emotions through premium gifts and unforgettable surprises. We handle every detail with care and luxury.
            </p>
          </div>

          <div className={styles.linksSection}>
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Company</h3>
              <ul className={styles.linkList}>
                <li><a href="#" className={styles.link}>About Us</a></li>
                <li><a href="#" className={styles.link}>Careers</a></li>
                <li><a href="#" className={styles.link}>Press</a></li>
                <li><a href="#" className={styles.link}>Contact</a></li>
              </ul>
            </div>

            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Service</h3>
              <ul className={styles.linkList}>
                <li><a href="#" className={styles.link}>How it Works</a></li>
                <li><a href="#" className={styles.link}>Gift Collections</a></li>
                <li><a href="#" className={styles.link}>Pricing</a></li>
                <li><a href="#" className={styles.link}>FAQ</a></li>
              </ul>
            </div>

            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Legal</h3>
              <ul className={styles.linkList}>
                <li><a href="#" className={styles.link}>Privacy Policy</a></li>
                <li><a href="#" className={styles.link}>Terms of Service</a></li>
                <li><a href="#" className={styles.link}>Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.bottomSection}>
          <p className={styles.copyright}>© 2026 Ahdini Inc. All rights reserved.</p>
          <p className={styles.secure}>Secure Payments</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;