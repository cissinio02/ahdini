import axios from '../api/axios';

const API_URL = 'http://localhost/ahdini/backend/api/admin.php';

export const adminService = {
    // Check if admin exists
    checkAdminExists: async () => {
        try {
            console.log('Checking admin exists at:', `${API_URL}?action=check_admin_exists`);
            const response = await axios.get(`${API_URL}?action=check_admin_exists`);
            console.log('Admin check response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Check admin error details:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                fullError: error
            });
            throw error;
        }
    },

    // Create first admin account
    createAdmin: async (firstName, lastName, email, password) => {
        try {
            const response = await axios.post(`${API_URL}?action=create_admin`, {
                first_name: firstName,
                last_name: lastName,
                email,
                password
            });
            return response.data;
        } catch (error) {
            console.error('Create admin error:', error);
            if (error.response && error.response.data) {
                return error.response.data;
            }
            throw error;
        }
    },

    // Get dashboard stats
    getStats: async () => {
        try {
            const response = await axios.get(`${API_URL}?action=get_stats`);
            return response.data;
        } catch (error) {
            console.error('Get stats error:', error);
            throw error;
        }
    },

    // Get pending vendors
    getPendingVendors: async () => {
        try {
            const response = await axios.get(`${API_URL}?action=get_pending_vendors`);
            return response.data;
        } catch (error) {
            console.error('Get pending vendors error:', error);
            throw error;
        }
    },

    // Get pending products
    getPendingProducts: async () => {
        try {
            const response = await axios.get(`${API_URL}?action=get_pending_products`);
            return response.data;
        } catch (error) {
            console.error('Get pending products error:', error);
            throw error;
        }
    },

    // Get active vendors
    getActiveVendors: async () => {
        try {
            const response = await axios.get(`${API_URL}?action=get_active_vendors`);
            return response.data;
        } catch (error) {
            console.error('Get active vendors error:', error);
            throw error;
        }
    },

    // Approve vendor
    approveVendor: async (vendorId) => {
        try {
            const response = await axios.post(`${API_URL}?action=approve_vendor`, {
                vendor_id: vendorId
            });
            return response.data;
        } catch (error) {
            console.error('Approve vendor error:', error);
            throw error;
        }
    },

    // Reject vendor
    rejectVendor: async (vendorId) => {
        try {
            const response = await axios.post(`${API_URL}?action=reject_vendor`, {
                vendor_id: vendorId
            });
            return response.data;
        } catch (error) {
            console.error('Reject vendor error:', error);
            throw error;
        }
    },

    // Approve product
    approveProduct: async (productId) => {
        try {
            const response = await axios.post(`${API_URL}?action=approve_product`, {
                product_id: productId
            });
            return response.data;
        } catch (error) {
            console.error('Approve product error:', error);
            throw error;
        }
    },

    // Reject product
    rejectProduct: async (productId) => {
        try {
            const response = await axios.post(`${API_URL}?action=reject_product`, {
                product_id: productId
            });
            return response.data;
        } catch (error) {
            console.error('Reject product error:', error);
            throw error;
        }
    },

    // Ban vendor
    banVendor: async (vendorId) => {
        try {
            const response = await axios.post(`${API_URL}?action=ban_vendor`, {
                vendor_id: vendorId
            });
            return response.data;
        } catch (error) {
            console.error('Ban vendor error:', error);
            throw error;
        }
    }
};
