import React, {useState} from 'react';
import styles from './LoginClient.module.css';
import {logo_blanc} from '../../assets/icons/icons';
import {user} from '../../assets/images/images';
import api from '../../api/axios';
import { showSuccessToast, showErrorToast } from '../../components/UI/ToastPro';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Button from '../../components/UI/button';
import Input from '../../components/UI/Input';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
       const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loadingId = toast.loading('Logging in...');
        try {
            const res = await api.post('login.php', { email, password });
            // Dismiss loading toast (request completed)
            toast.dismiss(loadingId);
            setLoading(false);

            if (res.data && res.data.status === 'success') {
                showSuccessToast('Logged in successfully', res.data.user?.name || '');
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setTimeout(() => (window.location.href = '../Home'), 1400);
            } else {
                    if (res.data?.errors) {
                        setErrors(res.data.errors);
                        showErrorToast('Login failed', res.data.message || 'Please fix the highlighted fields');
                    } else {
                        showErrorToast('Login failed', res.data?.message || 'Unknown error');
                    }
            }
        } catch (error) {
            toast.dismiss(loadingId);
            setLoading(false);
            console.error('Login error:', error);
            if (error?.response) {
                if (error.response.data?.errors) setErrors(error.response.data.errors);
                showErrorToast('Error', error.response.data?.message || 'Server error');
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
                    <span className={styles.logoText}>Ahdini</span>
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