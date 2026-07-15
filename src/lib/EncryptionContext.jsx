import React, { createContext, useContext, useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { generateKeyPair, exportKeyPair, importPrivateKey, importPublicKey } from './crypto';

const EncryptionContext = createContext(null);

export function useEncryption() {
  return useContext(EncryptionContext);
}

export function EncryptionProvider({ children }) {
  const [privateKey, setPrivateKey] = useState(null);
  const [publicKeyStr, setPublicKeyStr] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  const initKeys = useCallback(async (walletAddress, signature) => {
    try {
      const profiles = await base44.entities.UserProfile.filter({ wallet_address: walletAddress });
      const existing = profiles.find(p => p.encryption_public_key && p.encrypted_private_key);

      if (existing) {
        const privKey = await importPrivateKey(
          existing.encrypted_private_key,
          existing.encryption_key_iv,
          signature
        );
        setPrivateKey(privKey);
        setPublicKeyStr(existing.encryption_public_key);
      } else {
        const keyPair = await generateKeyPair();
        const exported = await exportKeyPair(keyPair, signature);

        if (profiles.length > 0) {
          await base44.entities.UserProfile.update(profiles[0].id, {
            encryption_public_key: exported.publicKey,
            encrypted_private_key: exported.encryptedPrivateKey,
            encryption_key_iv: exported.iv
          });
        } else {
          await base44.entities.UserProfile.create({
            wallet_address: walletAddress,
            encryption_public_key: exported.publicKey,
            encrypted_private_key: exported.encryptedPrivateKey,
            encryption_key_iv: exported.iv
          });
        }

        setPrivateKey(keyPair.privateKey);
        setPublicKeyStr(exported.publicKey);
      }

      setIsReady(true);
      setError(null);
    } catch (err) {
      console.error('Failed to initialize encryption keys:', err);
      setError(err.message || 'Failed to set up encryption');
      setIsReady(false);
    }
  }, []);

  const getRecipientPublicKey = useCallback(async (recipientWallet) => {
    try {
      const profiles = await base44.entities.UserProfile.filter({ wallet_address: recipientWallet });
      const profile = profiles.find(p => p.encryption_public_key);
      if (profile) {
        const publicKey = await importPublicKey(profile.encryption_public_key);
        return { publicKey, publicKeyStr: profile.encryption_public_key };
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const value = {
    privateKey,
    publicKeyStr,
    isReady,
    error,
    initKeys,
    getRecipientPublicKey,
  };

  return (
    <EncryptionContext.Provider value={value}>
      {children}
    </EncryptionContext.Provider>
  );
}