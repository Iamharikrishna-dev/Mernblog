import axios from 'axios';

const API = axios.create({ baseURL: 'https://mernblog-six.vercel.app/api' });

export const fetchBlogs = () => API.get('/blogs');
export const loginUser = (credentials) => API.post('/users/login', credentials);
