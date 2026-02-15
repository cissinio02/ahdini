import React, { useState } from 'react';
import styles from './RegisterVendor.module.css'; // Use same class names as RegisterClient
import Button from '../../components/UI/button';
import Input from '../../components/UI/Input';
import authService from '../../Services/authService';
import { showSuccessToast, showErrorToast } from '../../components/UI/ToastPro';
import { logo_blanc } from '../../assets/icons/icons';
import { user } from '../../assets/images/images';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

// --- Internal Stepper Component (Visual Only) ---
const Stepper = ({ activeStep, steps }) => {
    return (
        <div className={styles.stepperWrapper}>
            <div className={styles.stepperContainer}>
                {steps.map((label, index) => {
                    const isActive = index === activeStep;
                    const isCompleted = index < activeStep;
                    return (
                        <div key={index} className={`${styles.stepItem} ${isActive ? styles.activeStep : ''} ${isCompleted ? styles.completedStep : ''}`}>
                            <div className={styles.stepCircle}>
                                {isCompleted ? <Check size={16} /> : <span>{index + 1}</span>}
                            </div>
                            <span className={styles.stepLabel}>{label}</span>
                            {index < steps.length - 1 && <div className={styles.stepLine}></div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ALGERIAN_STATES = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira", 
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", "Sétif", "Saïda", 
  "Skikda", "Sidi Bel Abbès", "Annabba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", 
  "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", 
  "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", 
  "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", 
  "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
];

export default function RegisterVendor() {
    const [currentStep, setCurrentStep] = useState(0);
    const steps = ["Account", "Business", "Confirm"];

    // Form States
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '',
        shopName: '', shopPhone: '', shopLocation: '', agree: false
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Universal Change Handler
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear specific error when user starts typing
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    // Validation helpers
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password) => {
        const rules = {
            length: password.length >= 8,
            upper: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[\W]/.test(password),
        };
        return { ok: Object.values(rules).every(Boolean), rules };
    };

    const validatePhone = (phone) => {
        // Allow digits, optional +, spaces and dashes; require at least 8 digits
        const digits = phone.replace(/[^0-9]/g, '');
        return digits.length >= 8;
    };

    const handleNext = (e) => {
        e.preventDefault();
        // Step-specific validation
        if (currentStep === 0) {
            const nextErrors = {};
            if (!formData.firstName) nextErrors.firstName = 'First name is required';
            if (!formData.lastName) nextErrors.lastName = 'Last name is required';
            if (!formData.email) nextErrors.email = 'Email is required';
            else if (!validateEmail(formData.email)) nextErrors.email = 'Invalid email';
            if (!formData.password) nextErrors.password = 'Password is required';
            else {
                const pass = validatePassword(formData.password);
                if (!pass.ok) {
                    nextErrors.password = 'Password must be 8+ chars, include uppercase, number and special char';
                }
            }
            if (Object.keys(nextErrors).length) {
                setErrors(nextErrors);
                showErrorToast('Please fix the form', 'Some fields are invalid');
                return;
            }
            setCurrentStep(prev => prev + 1);
            return;
        }
        if (currentStep === 1) {
            const nextErrors = {};
            if (!formData.shopName) nextErrors.shopName = 'Shop name is required';
            if (!formData.shopPhone) nextErrors.shopPhone = 'Business phone is required';
            else if (!validatePhone(formData.shopPhone)) nextErrors.shopPhone = 'Invalid phone number';
            if (!formData.shopLocation) nextErrors.shopLocation = 'Shop location is required';
            if (Object.keys(nextErrors).length) {
                setErrors(nextErrors);
                showErrorToast('Please fix the form', 'Some fields are invalid');
                return;
            }
            setCurrentStep(prev => prev + 1);
            return;
        }
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => setCurrentStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.agree) {
            showErrorToast('Agreement required', 'You must accept the Terms of Service');
            return;
        }
        // Final validation before submit
        const finalErrors = {};
        if (!formData.firstName) finalErrors.firstName = 'First name is required';
        if (!formData.lastName) finalErrors.lastName = 'Last name is required';
        if (!formData.email) finalErrors.email = 'Email is required';
        else if (!validateEmail(formData.email)) finalErrors.email = 'Invalid email';
        if (!formData.password) finalErrors.password = 'Password is required';
        else {
            const pass = validatePassword(formData.password);
            if (!pass.ok) finalErrors.password = 'Password must be 8+ chars, include uppercase, number and special char';
        }
        if (!formData.shopName) finalErrors.shopName = 'Shop name is required';
        if (!formData.shopPhone) finalErrors.shopPhone = 'Business phone is required';
        else if (!validatePhone(formData.shopPhone)) finalErrors.shopPhone = 'Invalid phone number';
        if (!formData.shopLocation) finalErrors.shopLocation = 'Shop location is required';

        if (Object.keys(finalErrors).length) {
            setErrors(finalErrors);
            showErrorToast('Please fix the form', 'Some fields are invalid');
            return;
        }

        setLoading(true);
        try {
            // Logic: Backend must handle "vendor" registration (users + vendor tables)
            const res = await authService.registerVendor(formData);
            if (res?.status === 'success') {
                showSuccessToast('Partnership created', 'Welcome to the Ahdini family!');
                setErrors({});
                setTimeout(() => (window.location.href = '../Login'), 1400);
            } else {
                if (res?.errors) setErrors(res.errors);
                else showErrorToast('Registration failed', res?.message || 'Unknown error');
            }
        } catch (err) {
            const serverMessage = err?.response?.data?.message || err?.message || 'Server error';
            if (err?.response?.data?.errors) setErrors(err.response.data.errors);
            else showErrorToast('Error', serverMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.heroSection}>
                <div className={styles.dots}></div>
                <div className={styles.logoContainer}>
                    <img src={logo_blanc} alt="Logo" />
                    <Link to="/home" style={{ textDecoration: 'none' }}>
                        <span className={styles.logoText}>Ahdini Partner</span>
                    </Link>
                </div>

                <h1>Empower your business.</h1>
                <p>Join our specialized marketplace and start reaching thousands of gift-seekers across the country.</p>

                <div className={styles.testimonialCard}>
                    <p>"Being an Ahdini vendor increased my sales by 40%. The scheduling system is brilliant for managing orders."</p>
                    <div className={styles.userInfo}>
                        <img src={user} alt="user" />
                        <div>
                            <strong>Chemsou B.</strong>
                            <span>Vendor Partner</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.formSection}>
                <div className={styles.registerForm}>
                    <div className={styles.formHeader}>
                        <h2>Vendor Registration</h2>
                        <p>Already a partner? <Link to="/login">Log in</Link></p>
                        <Stepper activeStep={currentStep} steps={steps} />
                    </div>

                    <form onSubmit={currentStep === steps.length - 1 ? handleSubmit : handleNext}>
                        
                        {/* STEP 0: Personal Info */}
                        {currentStep === 0 && (
                            <div className={styles.stepContent}>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <Input id="first" label="First name" value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)} placeholder="e.g. alaa" error={errors.firstName} />
                                    <Input id="last" label="Last name" value={formData.lastName} onChange={e => handleChange('lastName', e.target.value)} placeholder="e.g. mkeibes" error={errors.lastName} />
                                </div>
                                <Input id="email" label="Email address" type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} placeholder="business@example.com" error={errors.email} />
                                <Input id="password" label="Password" type="password" value={formData.password} onChange={e => handleChange('password', e.target.value)} placeholder="Strong password" showPasswordToggle error={errors.password} />
                            </div>
                        )}

                       
                        {/* STEP 1: Shop Details */}
{currentStep === 1 && (
    <div className={styles.stepContent}>
        <Input 
            id="shop" 
            label="Shop Name" 
            value={formData.shopName} 
            onChange={e => handleChange('shopName', e.target.value)} 
            placeholder="e.g. Luxury Roses" 
        />
        <Input 
            id="phone" 
            label="Business Phone" 
            value={formData.shopPhone} 
            onChange={e => handleChange('shopPhone', e.target.value)} 
            placeholder="05XXXXXXXX" 
        />
        
        {/* Updated Location Dropdown */}
        <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="loc">Shop Location (State)</label>
            <select 
                id="loc"
                className={styles.selectInput}
                value={formData.shopLocation}
                onChange={e => handleChange('shopLocation', e.target.value)}
            >
                <option value="">Select a State</option>
                {ALGERIAN_STATES.map((state, index) => (
                    <option key={index} value={state}>
                        {index + 1} - {state}
                    </option>
                ))}
            </select>
            {errors.shopLocation && <span className={styles.errorText}>{errors.shopLocation}</span>}
        </div>
    </div>
)}

                        {/* STEP 2: Final Review */}
                        {currentStep === 2 && (
                            <div className={styles.stepContent}>
                                <div className={styles.reviewBox}>
                                    <p>Reviewing: <strong>{formData.shopName}</strong></p>
                                    <p>Your shop will be activated after our team reviews your business details.</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '1rem' }}>
                                    <input id="agree" type="checkbox" checked={formData.agree} onChange={e => handleChange('agree', e.target.checked)} />
                                    <label htmlFor="agree">I agree to the Vendor <a href="/terms">Terms</a>.</label>
                                </div>
                            </div>
                        )}

                        <div className={styles.formActions}>
                            {currentStep > 0 && (
                                <button type="button" className={styles.backLink} onClick={handleBack}>Back</button>
                            )}
                            <Button type="submit" variant="primary" disabled={loading}>
                                {loading ? 'Processing...' : currentStep === steps.length - 1 ? 'Launch My Shop' : 'Next Step'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}