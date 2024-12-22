import React, { useState, useEffect } from 'react';
import * as openpgp from 'openpgp';
import getMessages from '../../../back/routes/messageRoutes'

function MessageInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [decryptedMessages, setDecryptedMessages] = useState({});

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const userEmail = localStorage.getItem('userEmail');
      const fetchedMessages = await getMessages(userEmail);
      setMessages(fetchedMessages);
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const decryptMessage = async (encryptedMessage) => {
    try {
      const privateKeyArmored = localStorage.getItem('privateKey');
      const passphrase = prompt('Enter your private key passphrase:');
      
      if (!passphrase) return;

      const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase
      });

      const message = await openpgp.readMessage({
        armoredMessage: encryptedMessage
      });

      const { data: decrypted } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey
      });

      return decrypted;
    } catch (err) {
      throw new Error('Failed to decrypt message: ' + err.message);
    }
  };

  const handleDecrypt = async (messageId, encryptedMessage) => {
    try {
      const decrypted = await decryptMessage(encryptedMessage);
      setDecryptedMessages(prev => ({
        ...prev,
        [messageId]: decrypted
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center">Loading messages...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <h2 className="text-2xl font-bold mb-4">Message Inbox</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="text-gray-500 text-center">No messages found</div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message._id} className="border rounded p-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">From: {message.sender}</span>
                <span className="text-gray-500">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
              </div>
              
              {decryptedMessages[message._id] ? (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="whitespace-pre-wrap">{decryptedMessages[message._id]}</p>
                </div>
              ) : (
                <button
                  onClick={() => handleDecrypt(message._id, message.encryptedMessage)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Decrypt Message
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageInbox;