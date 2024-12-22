import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as openpgp from 'openpgp';
import { registerUser } from '../services/api';

function KeyGeneration() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateKeyPair = async () => {
    const { privateKey, publicKey } = await openpgp.generateKey({
      type: 'rsa',
      rsaBits: 4096,
      userIDs: [{ name, email }],
      passphrase
    });

    return { privateKey, publicKey };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Generate PGP keys
      const { privateKey, publicKey } = await generateKeyPair();

      // Register user with public key
      await registerUser({
        name,
        email,
        publicKey
      });

      // Store private key securely (using localStorage for demo purposes)
      // In a production app, you might want to encrypt it first
      localStorage.setItem('privateKey', privateKey);
      localStorage.setItem('userEmail', email);

      // Navigate to encryption page
      navigate('/encrypt');
    } catch (err) {
      setError(err.message || 'Failed to generate keys and register user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <h2 className="text-2xl font-bold mb-4">Generate PGP Keys</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Passphrase</label>
          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Generating...' : 'Generate Keys'}
        </button>
      </form>
    </div>
  );
}

export default KeyGeneration;