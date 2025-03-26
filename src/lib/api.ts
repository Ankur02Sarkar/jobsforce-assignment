import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

// Helper to get JWT token from localStorage
const getAuthToken = (): string | null => {
    try {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const { token } = JSON.parse(currentUser);
            return token;
        }
        return null;
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

// Common config creator with authentication
const createConfig = (customConfig: AxiosRequestConfig = {}): AxiosRequestConfig => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...customConfig.headers,
    };

    return {
        ...customConfig,
        headers,
    };
};

// Error handler
const handleApiError = (error: any): never => {
    console.error('API Error:', error);
    const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
    toast.error(errorMessage);
    throw error;
};

// GET request
export const apiGet = async <T>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await axios.get(
            `${API_BASE_URL}${endpoint}`,
            createConfig(config)
        );
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};

// POST request
export const apiPost = async <T>(
    endpoint: string,
    data: any,
    config: AxiosRequestConfig = {}
): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await axios.post(
            `${API_BASE_URL}${endpoint}`,
            data,
            createConfig(config)
        );
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};

// PUT request
export const apiPut = async <T>(
    endpoint: string,
    data: any,
    config: AxiosRequestConfig = {}
): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await axios.put(
            `${API_BASE_URL}${endpoint}`,
            data,
            createConfig(config)
        );
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};

// PATCH request
export const apiPatch = async <T>(
    endpoint: string,
    data: any,
    config: AxiosRequestConfig = {}
): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await axios.patch(
            `${API_BASE_URL}${endpoint}`,
            data,
            createConfig(config)
        );
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};

// DELETE request
export const apiDelete = async <T>(
    endpoint: string,
    config: AxiosRequestConfig = {}
): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await axios.delete(
            `${API_BASE_URL}${endpoint}`,
            createConfig(config)
        );
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
}; 