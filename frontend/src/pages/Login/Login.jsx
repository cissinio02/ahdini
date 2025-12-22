import React, {useState} from 'react';
import styles from './Login.module.css';
import logo_blanc from '../../assets/images/logo_blanc.png';
import Chemsou from '../../assets/images/chemsou.webp';
import api from '../../api/axios';

const login = ()=>{

    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');

    const handleSubmit =(e)=>{
        e.preventDefault();
        console.log({email,password});
    }

    return(
        <div className={styles.loginContainer}>
        <div className ={styles.heroSection}>
            <div className={styles.dots}></div>
            <div className={styles.logoContainer}>
            
            <img src={logo_blanc} alt ="Logo"></img>
            <span className={styles.logoText}>Ahdini</span>
            </div>
            
          
        <h1>Schedule joy,
            deliver emotion.</h1>
        <p>The premium platform for planning surprises
            and delivering perfectly wrapped gifts to your loved ones.</p>
       
       <div className={styles.testimonialCard}>
        <p>"Ahdini made my wife's anniversary unforgettable. The scheduling feature is a lifesaver for busy professionals."</p>
        <   div className={styles.userInfo}>
 <img src={Chemsou} alt="user"></img>
 <div>
    <strong>Chemsou B.</strong>
    <span>Entrepreneur</span>
 </div>
        </div>
       
       </div>
       
       </div>
           
        <div className={styles.formSection}>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.formHeader}>
<h2>Welcome back!</h2>
        <p>New to Ahdini?<a href="/frontend/src/pages/Register.jsx"> Create an account</a></p>
        </div>
        
      <div className={styles.formGroup}>
<label htmlFor="email">Email:</label>
<input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" required />
 </div>

 <div className={styles.formGroup}>
<label htmlFor="password">Password:</label>
<a className={styles.forgotPassword} href="#">Forgot password?</a>
<input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
</div>

<button type="submit" className={styles.loginBtn}>Login →</button>

</form>
        
        </div>
        </div>
        
      
    );
};
export default login;