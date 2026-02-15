import api from '../api/axios';

const vendorService = {
    // Vendor info
    getVendorInfo: async () => {
        const res = await api.get('me.php');
        return res.data;
    },

    // Gifts management
    getGifts: async () => {
        const res = await api.get('shop.php?action=get_gifts');
        return res.data;
    },

    getVendorGifts: async () => {
        const res = await api.get('shop.php?action=list_vendor_gifts');
        return res.data;
    },

    getGiftById: async (id) => {
        const res = await api.get(`shop.php?action=get_gift&id=${id}`);
        return res.data;
    },

    addGift: async (giftData) => {
        const res = await api.post('shop.php?action=add_gift', giftData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    },

    updateGift: async (id, giftData) => {
        const res = await api.put(`shop.php?action=update_gift&id=${id}`, giftData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    },

    deleteGift: async (id) => {
        const res = await api.delete(`shop.php?action=delete_gift&id=${id}`);
        return res.data;
    },

    // Orders
    getOrders: async () => {
        const res = await api.get('shop.php?action=get_orders');
        return res.data;
    },

    getOrderById: async (id) => {
        const res = await api.get(`shop.php?action=get_order&id=${id}`);
        return res.data;
    },

    // Customers
    getCustomers: async () => {
        const res = await api.get('shop.php?action=get_customers');
        return res.data;
    },

    // Analytics
    getAnalytics: async () => {
        const res = await api.get('shop.php?action=get_analytics');
        return res.data;
    },

    // Shop settings
    getShopSettings: async () => {
        const res = await api.get('shop.php?action=get_shop_settings');
        return res.data;
    },

    updateShopSettings: async (settingsData, logoFile = null) => {
        let data = settingsData;
        
        if (logoFile) {
            const formData = new FormData();
            // Add all settings fields
            Object.keys(settingsData).forEach(key => {
                if (key !== 'shopLogo') {
                    formData.append(key, settingsData[key]);
                }
            });
            // Add the logo file
            formData.append('shopLogo', logoFile);
            data = formData;
        }

        const res = await api.post('shop.php?action=update_shop_settings', data, {
            headers: logoFile ? { 'Content-Type': 'multipart/form-data' } : {}
        });
        return res.data;
    },
};

export default vendorService;
