import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock, Shield, Zap, Key, Mail, Wallet, Globe, ArrowRight,
} from 'lucide-react';
import CodeBlock from '@/components/whitepaper/CodeBlock';

const SECTIONS = [
  { id: 'abstract', label: 'Abstract' },
  { id: 'overview', label: '1. Protocol Overview' },
  { id: 'crypto', label: '2. Cryptographic Architecture' },
  { id: 'key-derivation', label: '3. Key Derivation' },
  { id: 'encryption', label: '4. Message Encryption Flow' },
  { id: 'privacy', label: '5. Privacy Model' },
  { id: 'threat-model', label: '6. Threat Model' },
  { id: 'references', label: '7. References' },
];

export default function Whitepaper() {
  const [activeSection, setActiveSection] = useState('abstract');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-[#00b7ff]" />
          <span className="font-semibold text-white text-sm tracking-tight">KX402 Protocol</span>
          <span className="text-gray-600 text-xs">White Paper v1.0</span>
        </div>
        <Link
          to="/Mail"
          className="text-xs text-gray-400 hover:text-[#00b7ff] transition-colors flex items-center gap-1.5"
        >
          Open App <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex flex-1">
        {/* Side Nav */}
        <nav className="hidden lg:block w-64 flex-shrink-0 border-r border-white/10 p-8 sticky top-[57px] self-start h-[calc(100vh-57px)] overflow-y-auto">
          <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-4">Sections</div>
          <ul className="space-y-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`block text-xs transition-colors py-1 pl-3 border-l-2 ${
                    activeSection === s.id
                      ? 'text-[#00b7ff] border-[#00b7ff] font-medium'
                      : 'text-gray-500 border-transparent hover:text-gray-300'
                  }`}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <main className="flex-1 px-6 lg:px-16 py-12 max-w-4xl mx-auto w-full">
          {/* Hero */}
          <div className="mb-16 pb-12 border-b border-white/10">
            <div className="flex items-center gap-2 mb-6 text-[#00b7ff]">
              <Shield className="w-5 h-5" />
              <span className="uppercase tracking-widest text-xs font-semibold">Technical White Paper</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              The KX402 Protocol
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl leading-relaxed mb-8">
              A wallet-native, end-to-end encrypted messaging protocol for the Kaspa era.
              Identity is a wallet address. The server stores only ciphertext.
            </p>
            <div className="flex flex-wrap gap-6 text-xs text-gray-500">
              <div>Version 1.0</div>
              <div>July 2026</div>
              <div>Fluxkmail Research</div>
            </div>
          </div>

          {/* Abstract */}
          <Section id="abstract" title="Abstract">
            <p>
              KX402 is a wallet-native encrypted messaging protocol that operates on the
              Kaspa blockchain. It replaces traditional email infrastructure — email addresses,
              passwords, and centralized mail servers — with cryptocurrency wallet addresses as
              identity and browser-side end-to-end encryption.
            </p>
            <p>
              The server, which may be operated by anyone including Fluxkmail, <em>cannot decrypt
              message content</em>. Encryption keys are derived locally from cryptographic wallet
              signatures and never leave the user's browser in plaintext. This paper describes
              the architecture, key derivation, message flow, and threat model of the protocol as
              implemented in production.
            </p>
          </Section>

          {/* Overview */}
          <Section id="overview" title="1. Protocol Overview">
            <p>
              A user's identity is their Kaspa wallet address. There is no registry of usernames,
              no password database, and no recovery server. Authentication and authorization are
              established through cryptographic signatures.
            </p>

            <h4 className="mt-8 text-sm font-semibold text-white uppercase tracking-wider mb-3">1.1 Identity Paths</h4>
            <p>
              KX402 supports two authentication paths. The primary path relies on a
              browser extension wallet (Kasware) that signs messages with secp256k1 Schnorr
              signatures. An alternative path uses a TTT Agent ID from
              the <span className="font-mono text-[#00b7ff]">tttz.xyz</span> identity network,
              bound to a Kaspa wallet address. Both paths produce a deterministic input from
              which the user's encryption keys are derived.
            </p>

            <h4 className="mt-8 text-sm font-semibold text-white uppercase tracking-wider mb-3">1.2 Design Principles</h4>
            <div className="grid gap-3 mt-4">
              {[
                { icon: Shield, title: 'Zero-knowledge server', desc: 'The backend stores ciphertext only. Operators never possess decryption keys.' },
                { icon: Key, title: 'Key derivation from wallet signature', desc: 'Encryption keys are derived locally and never uploaded.' },
                { icon: Lock, title: 'Ephemeral keys in memory', desc: 'Private keys exist only during an active session and are destroyed on page unload.' },
                { icon: Zap, title: 'Graceful degradation', desc: 'Messages to recipients without keys fall back to plaintext — no protocol breakage.' },
              ].map((p) => (
                <div key={p.title} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <p.icon className="w-5 h-5 text-[#00b7ff] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">{p.title}</div>
                    <div className="text-sm text-gray-400">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Crypto Architecture */}
          <Section id="crypto" title="2. Cryptographic Architecture">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">2.1 Algorithms</h4>
            <div className="overflow-x-auto rounded-xl border border-white/10 mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-900/60">
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Component</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Specification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ['Key Exchange', 'ECDH on NIST P-256 (secp256r1)'],
                    ['Symmetric Cipher', 'AES-256-GCM (authenticated)'],
                    ['KDF', 'SHA-256 (signature → 256-bit storage key)'],
                    ['Encoding', 'Base64 (storage), UTF-8 (text)'],
                    ['IV', '96-bit random, unique per encryption'],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{k}</td>
                      <td className="px-4 py-3 text-white font-mono">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">2.2 Key Hierarchy</h4>
            <p>
              The ECDH public key is stored in plaintext in the user's profile record. The ECDH
              private key — the secret that enables decryption — is encrypted with a key derived
              from the wallet signature <em>before</em> being stored:
            </p>
            <CodeBlock label="Key hierarchy">{`Wallet Signature (Schnorr / secp256k1)
      │
      ▼
   SHA-256
      │
      ▼
Storage Key (AES-256) ──► encrypts ──► ECDH Private Key (P-256, JWK)
                                         │
                                         ▼
                              Stored encrypted on the server`}</CodeBlock>
          </Section>

          {/* Key Derivation */}
          <Section id="key-derivation" title="3. Key Derivation">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">3.1 Kasware Identity Path</h4>
            <p>
              When a user connects via Kasware, the extension signs a domain-separated message:
            </p>
            <CodeBlock label="Derivation message">{`"Fluxkmail E2E Encryption Key Derivation v1"`}</CodeBlock>
            <p>
              The returned signature is passed through SHA-256 to produce a 256-bit AES-GCM key:
            </p>
            <CodeBlock label="Key derivation (JavaScript – Web Crypto API)">{`storageKey = await crypto.subtle.importKey(
  'raw',
  await crypto.subtle.digest('SHA-256', signature),
  { name: 'AES-GCM' },
  false,
  ['encrypt', 'decrypt']
);`}</CodeBlock>
            <p>
              This storage key encrypts the user's ECDH private key before it is persisted. The
              private key never leaves the browser in plaintext.
            </p>

            <h4 className="mt-8 text-sm font-semibold text-white uppercase tracking-wider mb-4">3.2 TTT Identity Path</h4>
            <p>
              For TTT users without a hardware wallet, the storage key is derived from their
              agent credentials:
            </p>
            <CodeBlock>{`storageKey = SHA-256("<tttId>:<password>")`}</CodeBlock>

            <h4 className="mt-8 text-sm font-semibold text-white uppercase tracking-wider mb-4">3.3 First-Time Setup</h4>
            <p>On first authentication, a new ECDH keypair is generated in the browser:</p>
            <CodeBlock label="First-time key generation">{`keyPair = crypto.subtle.generateKey(
  { name: 'ECDH', namedCurve: 'P-256' }, true,
  ['deriveKey', 'deriveBits']
);

// Export both halves
publicKeyJwk  = crypto.subtle.exportKey('jwk', keyPair.publicKey);  // plaintext
privateKeyJwk = crypto.subtle.exportKey('jwk', keyPair.privateKey);

// Encrypt the private key with the storage key
iv = crypto.getRandomValues(new Uint8Array(12));
encryptedPrivateKey = crypto.subtle.encrypt(
  { name: 'AES-GCM', iv }, storageKey,
  JSON.stringify(privateKeyJwk)
);`}</CodeBlock>
            <p>The server stores:</p>
            <ul className="list-disc list-inside space-y-1 my-3 text-sm">
              <li><span className="font-mono text-[#00b7ff]">encryption_public_key</span> — ECDH public key (JWK, plaintext)</li>
              <li><span className="font-mono text-[#00b7ff]">encrypted_private_key</span> — private key encrypted under AES-GCM (base64)</li>
              <li><span className="font-mono text-[#00b7ff]">encryption_key_iv</span> — initialization vector (base64)</li>
            </ul>

            <h4 className="mt-8 text-sm font-semibold text-white uppercase tracking-wider mb-4">3.4 Session Unlock</h4>
            <p>
              On subsequent page loads — when the in-memory private key has been lost — the user
              re-signs the derivation message. The signature decrypts the stored private key
              inside the browser's <span className="font-mono text-gray-300">crypto.subtle</span>.
              No network round-trip ever exposes the private key.
            </p>
          </Section>

          {/* Encryption Flow */}
          <Section id="encryption" title="4. Message Encryption Flow">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">4.1 Sending</h4>
            <CodeBlock label="Encryption flow (symmetric via ECDH shared secret)">{`// 1. Resolve recipient's public key
recipientKey = UserProfile.filter({ wallet_address: recipient });
// → encryption_public_key (JWK string)

if (recipientKey exists && sender has private key):

    // 2. Derive shared secret via ECDH
    sharedSecret = crypto.subtle.deriveBits(
      { name: 'ECDH', public: recipientPublicKey },
      senderPrivateKey, 256
    );

    // 3. Encrypt the message body with AES-GCM
    iv = crypto.getRandomValues(new Uint8Array(12));
    aesKey = crypto.subtle.importKey('raw', sharedSecret,
      { name: 'AES-GCM' }, false, ['encrypt']);
    ciphertext = AES-GCM.encrypt(aesKey, iv, utf8(body));

    // 4. Store: only ciphertext, IV, and the counterparty key reach the server
    Email.create({
      body:            base64(ciphertext),
      encryption_iv:   base64(iv),
      is_encrypted:    true,
      enc_public_key:  <counterparty's public key — see table below>
    });

else:
    // Fallback — recipient has no encryption key set up yet
    Email.create({ body: plaintext, is_encrypted: false });`}</CodeBlock>

            <p className="mt-6">
              Two copies of each message are created — one in the sender's Sent folder and one in
              the recipient's Inbox. Each copy stores the <em>counterparty's</em> public key as
              <span className="font-mono text-[#00b7ff]"> enc_public_key</span> so the reader of
              that specific copy can re-derive the same ECDH shared secret:
            </p>

            <div className="overflow-x-auto rounded-xl border border-white/10 my-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-900/60">
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Copy</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Reader</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">enc_public_key</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Derivation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-4 py-3 text-white">Sent</td>
                    <td className="px-4 py-3 text-gray-400">Sender</td>
                    <td className="px-4 py-3 text-gray-300">Recipient's pubkey</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">ECDH(sender_priv, recipient_pub)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-white">Inbox</td>
                    <td className="px-4 py-3 text-gray-400">Recipient</td>
                    <td className="px-4 py-3 text-gray-300">Sender's pubkey</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">ECDH(recipient_priv, sender_pub)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Both derivations yield an identical shared secret — a fundamental property of ECDH —
              so the same ciphertext decrypts for both parties.
            </p>

            <h4 className="mt-8 text-sm font-semibold text-white uppercase tracking-wider mb-4">4.2 Reading</h4>
            <CodeBlock label="Decryption flow">{`// 1. Import the counterparty's public key stored on the email
otherKey = importJWK(email.enc_public_key);

// 2. Re-derive the same shared secret
sharedSecret = ECDH.deriveBits(
  { name: 'ECDH', public: otherKey },
  readerPrivateKey, 256
);

// 3. Decrypt
aesKey = AES.import(sharedSecret);
plaintext = AES-GCM.decrypt(aesKey, email.encryption_iv, email.body);`}</CodeBlock>
            <p className="mt-4">
              Decryption happens entirely inside <span className="font-mono text-gray-300">window.crypto.subtle</span>.
              The server only delivers ciphertext, the IV, and the counterparty's public key.
            </p>
          </Section>

          {/* Privacy Model */}
          <Section id="privacy" title="5. Privacy Model">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">5.1 What is stored on the server</h4>
            <div className="overflow-x-auto rounded-xl border border-white/10 mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-900/60">
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Field</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Content</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Server-readable?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-4 py-3 font-mono text-gray-300">subject</td>
                    <td className="px-4 py-3 text-gray-400">Plaintext</td>
                    <td className="px-4 py-3 text-yellow-400">Yes</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-gray-300">body</td>
                    <td className="px-4 py-3 text-gray-400">AES-GCM ciphertext (base64)</td>
                    <td className="px-4 py-3 text-green-400 font-semibold">No</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-gray-300">preview</td>
                    <td className="px-4 py-3 text-gray-400">Placeholder only</td>
                    <td className="px-4 py-3 text-gray-500">N/A</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-gray-300">encryption_iv</td>
                    <td className="px-4 py-3 text-gray-400">96-bit IV (public by design)</td>
                    <td className="px-4 py-3 text-gray-500">Yes (non-secret)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-gray-300">enc_public_key</td>
                    <td className="px-4 py-3 text-gray-400">Public key (JWK)</td>
                    <td className="px-4 py-3 text-gray-500">Yes (non-secret)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              The email subject remains plaintext to enable server-side sorting and search. Only
              the body is encrypted. Subject-line protection is a planned extension (Section 6.2).
            </p>

            <h4 className="mt-8 text-sm font-semibold text-white uppercase tracking-wider mb-4">5.2 What is never stored</h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>The wallet signature (ephemeral — used once per session to unlock)</li>
              <li>The SHA-256-derived storage key</li>
              <li>The ECDH private key (only its encrypted form persists)</li>
              <li>The per-message AES key (derived on the fly, never stored)</li>
            </ul>

            <h4 className="mt-8 text-sm font-semibold text-white uppercase tracking-wider mb-4">5.3 Session forward secrecy</h4>
            <p>
              The ECDH private key persists across sessions in its encrypted form. Strict forward
              secrecy (automatic key erasure) is achieved on sign-out: the in-memory private key
              is destroyed on page unload, and unlocking requires a fresh wallet signature.
            </p>
          </Section>

          {/* Threat Model */}
          <Section id="threat-model" title="6. Threat Model">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">6.1 Covered</h4>
            <div className="space-y-3">
              {[
                ['Database breach', 'Attacker obtains ciphertext and public keys. Without the wallet signature, decryption is infeasible.'],
                ['Server operator curiosity', 'The operator never possesses any private key in plaintext — they cannot read mail just because they run the server.'],
                ['Network MITM', 'TLS protects transport; the message body is additionally encrypted at the application layer.'],
              ].map(([title, desc]) => (
                <div key={title} className="flex gap-4 p-4 rounded-xl bg-green-500/[0.03] border border-green-500/15">
                  <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">{title}</div>
                    <div className="text-sm text-gray-400">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <h4 className="mt-8 text-sm font-semibold text-white uppercase tracking-wider mb-4">6.2 Not yet covered (v1)</h4>
            <div className="space-y-3">
              {[
                ['Metadata', 'Sender, recipient, timestamps, and subject remain visible to the server for routing.'],
                ['Recipient compromise', 'An attacker who controls the recipient\u2019s wallet can unlock all mail sent to them.'],
                ['Quantum', 'ECDH (P-256) is not post-quantum secure; a future revision may use a PQ key exchange.'],
                ['Subject-line leakage', 'Subjects are plaintext in v1; subject encryption is planned for v1.1.'],
              ].map(([title, desc]) => (
                <div key={title} className="flex gap-4 p-4 rounded-xl bg-yellow-500/[0.03] border border-yellow-500/15">
                  <Key className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">{title}</div>
                    <div className="text-sm text-gray-400">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* References */}
          <Section id="references" title="7. References">
            <ul className="space-y-3 text-sm">
              {[
                ['W3C Web Cryptography API', 'W3C Recommendation, January 2017'],
                ['NIST SP 800-186', 'Recommendations for Discrete Logarithm-Based Cryptography (P-256)'],
                ['NIST SP 800-38D', 'Galois / Counter Mode (GCM)'],
                ['RFC 7517', 'JSON Web Key (JWK)'],
                ['Kaspa protocol', 'kaspa.org — blockDAG protocol specification'],
              ].map(([name, detail]) => (
                <li key={name} className="flex gap-3 pb-3 border-b border-white/5">
                  <span className="text-[#00b7ff] font-mono text-xs mt-0.5">— </span>
                  <div>
                    <div className="text-white font-medium">{name}</div>
                    <div className="text-gray-500 text-xs">{detail}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-gray-600">
            <div>© 2026 Fluxkmail Research — KX402 White Paper v1.0</div>
            <Link to="/Mail" className="text-[#00b7ff] hover:text-white transition-colors">
              Open Fluxkmail →
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold text-white mb-5 tracking-tight">{title}</h2>
      <div className="space-y-4 text-sm leading-relaxed text-gray-400">{children}</div>
    </section>
  );
}