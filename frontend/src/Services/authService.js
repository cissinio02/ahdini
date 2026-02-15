import api from '../api/axios';

const authService = {
	login: async (email, password) => {
		const res = await api.post('login.php', { email, password });
		return res.data;
	},

	register: async (first_name, last_name, email, password) => {
		const res = await api.post('register.php', { first_name, last_name, email, password });
		return res.data;
	},

	registerVendor: async (formData) => {
		const res = await api.post('register.php', formData);
		return res.data;
	},

	me: async () => {
		const res = await api.get('me.php');
		return res.data;
	},

	logout: async () => {
		const res = await api.post('logout.php');
		return res.data;
	}
};

export default authService;
