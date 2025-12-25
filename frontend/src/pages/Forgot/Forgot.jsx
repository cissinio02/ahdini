import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './forgot.module.css';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/button';
import api from '../../api/axios';
import { showSuccessToast, showErrorToast } from '../../components/UI/ToastPro';
import toast from 'react-hot-toast';

export default function Forgot() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    setLoading(true);
    const loadingId = toast.loading('Sending reset instructions...');
    try {
      const res = await api.post('forgot.php', { email });
      toast.dismiss(loadingId);
      setLoading(false);

      if (res?.data?.status === 'success') {
        showSuccessToast('Email sent', res.data.message || 'Check your email for reset instructions');
        setEmail('');
      } else if (res?.data?.errors) {
        setErrors(res.data.errors);
      } else {
        showErrorToast('Failed', res?.data?.message || 'Unknown error');
      }
    } catch (err) {
      toast.dismiss(loadingId);
      setLoading(false);
      const msg = err?.response?.data?.message || err?.message || 'Network error';
      if (err?.response?.data?.errors) setErrors(err.response.data.errors);
      showErrorToast('Error', msg);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Forgot password</h2>
        <p className={styles.lead}>Enter your account email and we'll send instructions to reset your password.</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Input id="email" label="Email address" type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }} placeholder="you@example.com" error={errors.email} />

          <div className={styles.actions}>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Sending...' : 'Send reset email'}</Button>
            <Link to="/login" className={styles.cancel}>Back to login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
