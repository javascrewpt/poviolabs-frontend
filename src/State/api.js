import axios from 'axios';
const baseURL = 'http://localhost:3000/api/v0';

export const API = axios.create({
    baseURL
});

export function APIAuth(token) {

    return axios.create({
        baseURL,
        headers: { 'Authorization': `Bearer ${token}` }
    });
}
