import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../Services/adminService';
import { authContext } from '../../context/AuthContext';
import Button from '../../components/UI/button';
import Input from '../../components/UI/Input';
import ToastPro from '../../components/UI/ToastPro';
import styles from './Admin.module.css';

export default function AdminLogin() {
    const navigate = useNavigate();
    const { setUser } = useContext(authContext);
    const [adminExists, setAdminExists] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [checkCompleted, setCheckCompleted] = useState(false);

    useEffect(() => {
        checkAdminStatus();
    }, []);

    const checkAdminStatus = async () => {
        try {
            console.log('Checking admin status...');
            const result = await adminService.checkAdminExists();
            console.log('Admin exists result:', result);
            setAdminExists(result.adminExists);
            if (result.adminExists) {
                setIsRegistering(false);
            } else {
                setIsRegistering(true);
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
            // Default: show create admin form on error
            setAdminExists(false);
            setIsRegistering(true);
        } finally {
            setLoading(false);
            setCheckCompleted(true);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 8) errors.push('At least 8 characters');
        if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
        if (!/[0-9]/.test(password)) errors.push('One number');
        if (!/[\W]/.test(password)) errors.push('One special character');
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
            newErrors.password = `Must contain: ${passwordErrors.join(', ')}`;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setToast({ message: 'Please fix the errors below', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const result = await adminService.createAdmin(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.password
            );

            if (result.status === 'success') {
                setToast({ message: 'Admin account created! Please log in.', type: 'success' });
                setTimeout(() => {
                    setIsRegistering(false);
                    setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
                }, 1500);
            } else {
                setToast({ message: result.message, type: 'error' });
                if (result.errors) {
                    setErrors(result.errors);
                }
            }
        } catch (error) {
            setToast({ message: 'An error occurred. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        
        const loginErrors = {};
        if (!formData.email.trim()) loginErrors.email = 'Email is required';
        if (!formData.password.trim()) loginErrors.password = 'Password is required';

        if (Object.keys(loginErrors).length > 0) {
            setErrors(loginErrors);
            return;
        }

        setLoading(true);
        try {
            // Use regular login endpoint but check for admin role
            const response = await fetch('http://localhost/ahdini/backend/api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
                credentials: 'include'
            });

            let result = await response.json();
            // Handle HTML error responses
            if (typeof result === 'string') {
                const jsonMatch = result.match(/\{[\s\S]*\}/);
                result = jsonMatch ? JSON.parse(jsonMatch[0]) : { status: 'error', message: 'Unknown error' };
            }

            if (result.status === 'success' && result.user && result.user.role === 'admin') {
                setToast({ message: 'Welcome Admin!', type: 'success' });
                setUser(result.user);
                navigate('/admin');
            } else if (result.status === 'success') {
                setToast({ message: 'This account is not an admin account.', type: 'error' });
            } else {
                setToast({ message: result.message || 'Login failed', type: 'error' });
            }
        } catch (error) {
            console.error('Login error:', error);
            setToast({ message: 'An error occurred. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (loading && adminExists === null) {
        return (
            <div className={styles.container}>
                <div className={styles.loginBox}>
                    <h2>Admin Panel</h2>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {toast && <ToastPro message={toast.message} type={toast.type} />}
            
            <div className={styles.loginBox}>
                {isRegistering && !adminExists ? (
                    <>
                        <h2>Create Admin Account</h2>
                        <p className={styles.subtitle}>Set up the first admin account for this system</p>
                        <form onSubmit={handleCreateAdmin}>
                            <div className={styles.formGroup}>
                                <label>First Name</label>
                                <Input
                                    type="text"
                                    name="firstName"
                                    placeholder="Enter first name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                                {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label>Last Name</label>
                                <Input
                                    type="text"
                                    name="lastName"
                                    placeholder="Enter last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                                {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <span className={styles.error}>{errors.email}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label>Password</label>
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {errors.password && <span className={styles.error}>{errors.password}</span>}
                                <small className={styles.hint}>
                                    Must contain: 8+ chars, uppercase, number, special char
                                </small>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Confirm Password</label>
                                <Input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
                            </div>

                            <Button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Admin Account'}
                            </Button>
                        </form>
                    </>
                ) : (
                    <>
                        <h2>Admin Login</h2>
                        <form onSubmit={handleAdminLogin}>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Enter admin email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <span className={styles.error}>{errors.email}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label>Password</label>
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {errors.password && <span className={styles.error}>{errors.password}</span>}
                            </div>

                            <Button type="submit" disabled={loading}>
                                {loading ? 'Logging in...' : 'Admin Login'}
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
