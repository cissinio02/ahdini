import React, { useState, useEffect } from 'react';
import styles from './ShopSettings.module.css';
import Button from '../../components/UI/button';
import Input from '../../components/UI/Input';
import vendorService from '../../Services/vendorService';
import { showSuccessToast, showErrorToast } from '../../components/UI/ToastPro';

const ShopSettings = () => {
    const [settings, setSettings] = useState({
        shopName: '',
        shopPhone: '',
        shopLocation: '',
        shopDescription: '',
        bankAccount: '',
        taxId: '',
        shopLogo: null
    });
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await vendorService.getShopSettings();
            if (res?.status === 'success' && res.data) {
                setSettings(res.data);
                if (res.data.shopLogo) {
                    setLogoPreview(res.data.shopLogo);
                }
            }
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!settings.shopName) newErrors.shopName = 'Shop name is required';
        if (!settings.shopPhone) newErrors.shopPhone = 'Shop phone is required';
        if (!settings.shopLocation) newErrors.shopLocation = 'Shop location is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        setSettings({ ...settings, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: undefined });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showErrorToast('Error', 'File size must be less than 5MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showErrorToast('Error', 'Please select a valid image file');
            return;
        }

        setLogoFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (event) => {
            setLogoPreview(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSaving(true);
        try {
            // If there's a new logo file, upload it separately
            if (logoFile) {
                const formData = new FormData();
                formData.append('logo', logoFile);
                // You may want to call a separate upload endpoint
                // For now, we'll include it in the settings update
            }

            const res = await vendorService.updateShopSettings(settings, logoFile);
            if (res?.status === 'success') {
                showSuccessToast('Success', 'Shop settings updated!');
            } else {
                showErrorToast('Error', res?.message || 'Failed to update settings');
            }
        } catch (err) {
            console.error('Save error:', err);
            showErrorToast('Error', 'Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={styles.container}><p>Loading settings...</p></div>;

    return (
        <div className={styles.container}>
            <h2>Shop Settings</h2>
            
            <form onSubmit={handleSubmit} className={styles.settingsForm}>
                <div className={styles.formSection}>
                    <h3>Shop Profile Picture</h3>
                    
                    <div className={styles.logoUploadSection}>
                        {logoPreview && (
                            <div className={styles.logoPreview}>
                                <img src={logoPreview} alt="Shop Logo Preview" />
                            </div>
                        )}
                        
                        <div className={styles.fileInputWrapper}>
                            <input 
                                type="file"
                                id="logoInput"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className={styles.hiddenInput}
                            />
                            <label htmlFor="logoInput" className={styles.fileLabel}>
                                {logoFile ? 'Change Picture' : 'Choose Picture'} (Max 5MB)
                            </label>
                            {logoFile && <p className={styles.fileName}>{logoFile.name}</p>}
                        </div>
                    </div>
                </div>

                <div className={styles.formSection}>
                    <h3>Basic Information</h3>
                    
                    <Input 
                        label="Shop Name"
                        value={settings.shopName}
                        onChange={(e) => handleChange('shopName', e.target.value)}
                        error={errors.shopName}
                    />
                    
                    <Input 
                        label="Phone Number"
                        value={settings.shopPhone}
                        onChange={(e) => handleChange('shopPhone', e.target.value)}
                        error={errors.shopPhone}
                    />
                    
                    <Input 
                        label="Shop Location"
                        value={settings.shopLocation}
                        onChange={(e) => handleChange('shopLocation', e.target.value)}
                        error={errors.shopLocation}
                    />

                    <div className={styles.formGroup}>
                        <label>Shop Description</label>
                        <textarea
                            value={settings.shopDescription}
                            onChange={(e) => handleChange('shopDescription', e.target.value)}
                            rows={4}
                            placeholder="Tell customers about your shop..."
                        />
                    </div>
                </div>

                <div className={styles.formSection}>
                    <h3>Financial Information</h3>
                    
                    <Input 
                        label="Bank Account Number"
                        value={settings.bankAccount}
                        onChange={(e) => handleChange('bankAccount', e.target.value)}
                    />
                    
                    <Input 
                        label="Tax ID"
                        value={settings.taxId}
                        onChange={(e) => handleChange('taxId', e.target.value)}
                    />
                </div>

                <div className={styles.actions}>
                    <Button type="submit" variant="primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Settings'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ShopSettings;
