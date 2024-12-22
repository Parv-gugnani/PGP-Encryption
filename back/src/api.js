const API_URL = 'http://localhost:3001/api';

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to register user');
    }
    
    return response.json();
};

export const getUsers = async () => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return response.json();
};

export const getUserPublicKey = async (email) => {
    const response = await fetch(`${API_URL}/users/${email}/public-key`);
    if (!response.ok) {
        throw new Error('Failed to fetch public key');
    }
    return response.json();
};

export const sendMessage = async (messageData) => {
    const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send message');
    }
    
    return response.json();
};

export const getMessages = async (email) => {
    const response = await fetch(`${API_URL}/messages/${email}`);
    if (!response.ok) {
        throw new Error('Failed to fetch messages');
    }
    return response.json();
};