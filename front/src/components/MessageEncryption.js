import React, { useState, useEffect } from 'react';
import * as openpgp from 'openpgp';
import { getUsers, getUserPublicKey, sendMessage } from '../services/api';

function MessageEncryption() {
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
    try {
      const users = await getUsers();
      setRecipients(users);
    } catch (err) {
      setError('Failed to load recipients');
    }
  };

  const handleEncrypt = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Get recipient's public key
      const { publicKey: recipientPublicKey } = await getUserPublicKey(selectedRecipient);
      
      // Read the public key
      const publicKey = await openpgp.readKey({ armoredKey: recipientPublicKey });
      
      // Encrypt the message
      const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: message }),
        encryptionKeys: publicKey
      });

      // Send the encrypted message
      await sendMessage({
        sender: localStorage.getItem('userEmail'),
        recipient: selectedRecipient,
        encryptedMessage: encrypted
      });

      setSuccess('Message encrypted and sent successfully!');
      setMessage('');
      setSelectedRecipient('');
    } catch (err) {
      setError(err.message || 'Failed to encrypt and send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <h2 className="text-2xl font-bold mb-4">Encrypt Message</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleEncrypt} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Recipient</label>
          <select
            value={selectedRecipient}
            onChange={(e) => setSelectedRecipient(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select recipient...</option>
            {recipients.map(recipient => (
              <option key={recipient.email} value={recipient.email}>
                {recipient.name} ({recipient.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-32 p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !selectedRecipient || !message}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Encrypting...' : 'Encrypt & Send Message'}
        </button>
      </form>
    </div>
  );
}

export default MessageEncryption;