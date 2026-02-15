import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyGifts.module.css';
import Button from '../../components/UI/button';
import { Trash2, Edit2, Plus } from 'lucide-react';
import vendorService from '../../Services/vendorService';
import { showSuccessToast, showErrorToast } from '../../components/UI/ToastPro';

const MyGifts = () => {
    const navigate = useNavigate();
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // Occasions (gift-giving events)
    const occasions = ['Ramadan', 'Eid', 'Wedding', 'Birthday', 'Anniversary', 'Graduation', 'Corporate'];
    
    // Product Categories
    const productCategories = ['Electronics', 'Books', 'Clothes', 'Shoes', 'Jewelry', 'Home & Garden', 'Sports', 'Other'];
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        occasion: 'Ramadan',
        productCategory: 'Electronics',
        image: null,
        imagePreview: null
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchGifts();
    }, []);

    const fetchGifts = async () => {
        setLoading(true);
        try {
            const res = await vendorService.getVendorGifts();
            if (res?.status === 'success') {
                setGifts(res.data || []);
            } else {
                showErrorToast('Error', res?.message || 'Failed to load gifts');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            showErrorToast('Error', 'Failed to load gifts');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showErrorToast('Invalid file', 'Please select a valid image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showErrorToast('File too large', 'Image must be smaller than 5MB');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    image: file,
                    imagePreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.price) newErrors.price = 'Price is required';
        if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) 
            newErrors.price = 'Price must be a positive number';
        if (!formData.occasion) newErrors.occasion = 'Occasion is required';
        if (!formData.productCategory) newErrors.productCategory = 'Product category is required';
        if (!editingId && !formData.image) newErrors.image = 'Image is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);
            submitData.append('price', formData.price);
            // Send occasion as category (database field)
            submitData.append('category', formData.occasion);
            if (formData.image) {
                submitData.append('image', formData.image);
            }

            let res;
            if (editingId) {
                res = await vendorService.updateGift(editingId, submitData);
            } else {
                res = await vendorService.addGift(submitData);
            }

            if (res?.status === 'success') {
                showSuccessToast('Success', editingId ? 'Gift updated!' : 'Gift added!');
                setShowModal(false);
                setFormData({ name: '', description: '', price: '', occasion: 'Ramadan', productCategory: 'Electronics', image: null, imagePreview: null });
                setEditingId(null);
                fetchGifts();
                
                // Navigate to Gifts page if adding a new gift (not editing)
                if (!editingId) {
                    setTimeout(() => navigate('/gifts'), 1500);
                }
            } else {
                showErrorToast('Error', res?.message || 'Operation failed');
            }
        } catch (err) {
            console.error('Submit error:', err);
            showErrorToast('Error', 'Operation failed');
        }
    };

    const handleEdit = (gift) => {
        setFormData({
            name: gift.name || gift.title,
            description: gift.description,
            price: gift.price,
            occasion: gift.category || 'Ramadan',
            productCategory: gift.productCategory || 'Electronics',
            image: null,
            imagePreview: gift.image
        });
        setEditingId(gift.id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this gift?')) return;

        try {
            const res = await vendorService.deleteGift(id);
            if (res?.status === 'success') {
                showSuccessToast('Success', 'Gift deleted!');
                fetchGifts();
            } else {
                showErrorToast('Error', res?.message || 'Delete failed');
            }
        } catch (err) {
            console.error('Delete error:', err);
            showErrorToast('Error', 'Delete failed');
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData({ name: '', description: '', price: '', occasion: 'Ramadan', productCategory: 'Electronics', image: null, imagePreview: null });
        setErrors({});
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setErrors({});
        setFormData({ name: '', description: '', price: '', category: 'luxury', image: null, imagePreview: null });
    };

    if (loading) return <div className={styles.container}><p>Loading gifts...</p></div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>My Gifts</h2>
                <Button variant="primary" onClick={openAddModal}>
                    <Plus size={18} style={{ marginRight: '8px' }} />
                    Add New Gift
                </Button>
            </div>

            {gifts.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No gifts yet. Start by adding your first gift!</p>
                </div>
            ) : (
                <div className={styles.giftsGrid}>
                    {gifts.map((gift) => (
                        <div key={gift.id} className={styles.giftCard}>
                            <div className={styles.giftImage}>
                                {gift.image ? (
                                    <img src={gift.image} alt={gift.name} />
                                ) : (
                                    <div className={styles.placeholder}>No Image</div>
                                )}
                            </div>
                            <div className={styles.giftInfo}>
                                <h3>{gift.name || gift.title}</h3>
                                <p className={styles.description}>{gift.description}</p>
                                <div className={styles.priceRow}>
                                    <span className={styles.price}>${parseFloat(gift.price).toFixed(2)}</span>
                                    <span className={styles.category}>{gift.category}</span>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.editBtn} onClick={() => handleEdit(gift)}>
                                    <Edit2 size={18} />
                                </button>
                                <button className={styles.deleteBtn} onClick={() => handleDelete(gift.id)}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>{editingId ? 'Edit Gift' : 'Add New Gift'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>Gift Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={errors.name ? styles.inputError : ''}
                                />
                                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Price *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className={errors.price ? styles.inputError : ''}
                                    />
                                    {errors.price && <span className={styles.errorText}>{errors.price}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Occasion *</label>
                                    <select
                                        value={formData.occasion}
                                        onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                                        className={errors.occasion ? styles.inputError : ''}
                                    >
                                        {occasions.map(occ => (
                                            <option key={occ} value={occ}>{occ}</option>
                                        ))}
                                    </select>
                                    {errors.occasion && <span className={styles.errorText}>{errors.occasion}</span>}
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Product Category *</label>
                                    <select
                                        value={formData.productCategory}
                                        onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                                        className={errors.productCategory ? styles.inputError : ''}
                                    >
                                        {productCategories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    {errors.productCategory && <span className={styles.errorText}>{errors.productCategory}</span>}
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Gift Image *</label>
                                <div className={styles.imageUploadContainer}>
                                    {formData.imagePreview && (
                                        <div className={styles.imagePreview}>
                                            <img src={formData.imagePreview} alt="Preview" />
                                            <button
                                                type="button"
                                                className={styles.removeImageBtn}
                                                onClick={() => setFormData({ ...formData, image: null, imagePreview: null })}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                    <label className={styles.fileInputLabel}>
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg,image/gif"
                                            onChange={handleImageChange}
                                            className={styles.fileInput}
                                        />
                                        <span>Click to upload image (PNG, JPG, GIF)</span>
                                    </label>
                                </div>
                                {errors.image && <span className={styles.errorText}>{errors.image}</span>}
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelBtn} onClick={closeModal}>
                                    Cancel
                                </button>
                                <Button type="submit" variant="primary">
                                    {editingId ? 'Update Gift' : 'Add Gift'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyGifts;
