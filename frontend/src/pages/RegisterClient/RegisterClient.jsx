import React, { useState } from 'react';
import styles from './RegisterClient.module.css';
import Button from '../../components/UI/button';
import Input from '../../components/UI/Input';
import authService from '../../Services/authService';
import { showSuccessToast, showErrorToast } from '../../components/UI/ToastPro';
import {logo_blanc} from '../../assets/icons/icons';
import {chemsou} from '../../assets/images/images';
import { Link } from 'react-router-dom';



export default function Register(){
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!agree){
          showErrorToast('Agreement required', 'You must accept the Terms of Service');
      return;
    }
    setLoading(true);
    try{
      const res = await authService.register(firstName, lastName, email, password);
          if (res?.status === 'success') {
        showSuccessToast('Account created', res.message || 'Registration successful');
        setErrors({});
            setTimeout(() => (window.location.href = '../Login'), 1400);
      } else {
        // if API returned field errors, show them on inputs only (no toast)
        if (res?.errors) {
          setErrors(res.errors);
        } else {
          showErrorToast('Registration failed', res?.message || 'Unknown error');
        }
      }
    } catch (err) {
      // If server returned a JSON error (e.g. "Email already exists"), show it
      const serverMessage = err?.response?.data?.message || err?.message || 'Server error';
      // if server returned field errors, attach them to inputs and avoid extra toast
      if (err?.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        showErrorToast('Error', serverMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.registerContainer}>
      <div className={styles.heroSection}>
       <div className={styles.dots}></div>
                   <div className={styles.logoContainer}>
                   
                   <img src={logo_blanc} alt ="Logo"></img>
                   <span className={styles.logoText}>Ahdini</span>
                   </div>
                   
                 
        <h1>Join a world of thoughtful giving.</h1>
        <p>Create an account to start scheduling surprises and crafting unforgettable moments for your loved ones.</p>
      
       
             <div className={styles.testimonialCard}>
              <p>"Ahdini made my wife's anniversary unforgettable. The scheduling feature is a lifesaver for busy professionals."</p>
              <   div className={styles.userInfo}>
       <img src={chemsou} alt="user"></img>
       <div>
          <strong>Chemsou B.</strong>
          <span>Entrepreneur</span>
       </div>
              </div>
             
             </div>
      </div>

      <div className={styles.formSection}>
        <form className={styles.registerForm} onSubmit={handleSubmit}>
           <div className={styles.formHeader}>
         <h2>Create an account</h2>
         <p>Already have an account?<Link to="/login"> Log in</Link></p>
                  </div>
          
          <div style={{display:'flex',gap:12}}>
            <Input id="first" label="First name" value={firstName} onChange={e=>{ setFirstName(e.target.value); setErrors(prev=>({...prev, first_name: undefined})); }} placeholder="e.g. alaa" error={errors.first_name} />
            <Input id="last" label="Last name" value={lastName} onChange={e=>{ setLastName(e.target.value); setErrors(prev=>({...prev, last_name: undefined})); }} placeholder="e.g. mkeibes" error={errors.last_name} />
          </div>
          <Input id="email" label="Email address" type="email" value={email} onChange={e=>{ setEmail(e.target.value); setErrors(prev=>({...prev, email: undefined})); }} placeholder="name@example.com" error={errors.email} />
          <Input id="password" label="Password" type="password" value={password} onChange={e=>{ setPassword(e.target.value); setErrors(prev=>({...prev, password: undefined})); }} placeholder="Create a strong password" showPasswordToggle error={errors.password} />
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <input id="agree" type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} />
            <label htmlFor="agree">I agree to the <a href="../terms">Terms of Service</a> and <a href="/terms">Privacy Policy</a>.</label>
          </div>
          <Button type="submit" variant="primary" className="" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
          
        </form>
      </div>
    </div>
  )
}
