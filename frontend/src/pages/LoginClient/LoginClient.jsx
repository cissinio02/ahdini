import React, {useState} from 'react';
import styles from './LoginClient.module.css';
import {logo_blanc} from '../../assets/icons/icons';
import {user} from '../../assets/images/images';
import api from '../../api/axios';
import { showSuccessToast, showErrorToast } from '../../components/UI/ToastPro';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/UI/button';
import Input from '../../components/UI/Input';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
       const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loadingId = toast.loading('Logging in...');
        try {
            const res = await api.post('login.php', { email, password });
            console.log('Login response:', res.data);
            
            // Normalize response (may be string or object)
            let data = res.data;
            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                } catch (err) {
                    // Try to extract JSON from HTML-wrapped response
                    const match = data.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
                    if (match) {
                        try {
                            data = JSON.parse(match[0]);
                            console.info('Extracted JSON from HTML response');
                        } catch (err2) {
                            console.error('Failed to extract JSON:', err2);
                        }
                    }
                }
            }
            
            // Dismiss loading toast
            toast.dismiss(loadingId);
            setLoading(false);

            if (data && data.status === 'success') {
                showSuccessToast('Logged in successfully', data.user?.name || '');
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirect based on user role
                if (data.user?.role === 'vendor') {
                    navigate('/vendor-dashboard');
                } else if (data.user?.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/home');
                }
            } else {
                if (data?.errors) {
                    setErrors(data.errors);
                    showErrorToast('Login failed', data.message || 'Please fix the highlighted fields');
                } else {
                    showErrorToast('Login failed', data?.message || 'Unknown error');
                }
            }
        } catch (error) {
            toast.dismiss(loadingId);
            setLoading(false);
            console.error('Login error:', error);
            if (error?.response) {
                let errData = error.response.data;
                if (typeof errData === 'string') {
                    try {
                        errData = JSON.parse(errData);
                    } catch (e) {
                        const m = errData.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
                        if (m) {
                            try { errData = JSON.parse(m[0]); } catch (e2) { }
                        }
                    }
                }
                if (errData?.errors) setErrors(errData.errors);
                showErrorToast('Error', errData?.message || 'Server error');
            } else {
                showErrorToast('Network error', 'Please check if your backend server is running and CORS is enabled.');
            }
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.heroSection}>
                <div className={styles.dots}></div>
                <div className={styles.logoContainer}>
                    <img src={logo_blanc} alt="Logo" />
                   <Link to="/home" style={{ textDecoration: 'none' }}><span className={styles.logoText}>Ahdini</span></Link>
                  
                    
                </div>

                <h1>
                    Schedule joy,
                    <br />
                    deliver emotion.
                </h1>
                <p>
                    The premium platform for planning surprises
                    <br /> and delivering perfectly wrapped gifts to your loved ones.
                </p>

                <div className={styles.testimonialCard}>
                    <p>
                        "Ahdini made my wife's anniversary unforgettable. The scheduling feature is a
                        lifesaver for busy professionals."
                    </p>
                    <div className={styles.userInfo}>
                        <img src={user} alt="user" />
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
                        <p>
                            New to Ahdini? <Link to="/register">Create an account</Link>
                        </p>
                    </div>

                    <div className={styles.formGroup}>
                           <Input id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors(prev=>({...prev, email: undefined})); }} placeholder="example@mail.com" error={errors.email} />
                    </div>

                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label htmlFor="password">Password:</label>
                            <Link className={styles.forgotPassword} to="/Forgot">Forgot password?</Link>
                        </div>
                           <Input id="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors(prev=>({...prev, password: undefined})); }} placeholder="••••••••" showPasswordToggle error={errors.password} />
                    </div>

                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Logging in...' : 'Log in →'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;