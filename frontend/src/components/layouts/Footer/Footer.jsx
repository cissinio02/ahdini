import React from 'react';
import {logo_Black} from '../../../assets/icons/icons';
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

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
                <li><Link to="#" className={styles.link}>About Us</Link></li>
                <li><Link to="#" className={styles.link}>Careers</Link></li>
                <li><Link to="#" className={styles.link}>Press</Link></li>
                <li><Link to="#" className={styles.link}>Contact</Link></li>
              </ul>
            </div>

            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Service</h3>
              <ul className={styles.linkList}>
                <li><Link to="#" className={styles.link}>How it Works</Link></li>
                <li><Link to="#" className={styles.link}>Gift Collections</Link></li>
                <li><Link to="#" className={styles.link}>Pricing</Link></li>
                <li><Link to="#" className={styles.link}>FAQ</Link></li>
              </ul>
            </div>

            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Legal</h3>
              <ul className={styles.linkList}>
                <li><Link to="#" className={styles.link}>Privacy Policy</Link></li>
                <li><Link to="#" className={styles.link}>Terms of Service</Link></li>
                <li><Link to="#" className={styles.link}>Cookie Policy</Link></li>
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