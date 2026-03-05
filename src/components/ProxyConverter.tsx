import React, { useState } from 'react';
import { Link2, Copy, Check } from 'lucide-react';

export default function ProxyConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = () => {
    if (!input.trim()) return;

    try {
      let user = '', pass = '', host = '', port = '', name = 'NAME';

      // Format 3: socks://base64(user:pass@host:port)?remarks=NAME
      if (input.includes('?remarks=')) {
        const parts = input.split('?remarks=');
        name = decodeURIComponent(parts[1]);
        const base64Part = parts[0].replace(/^socks5?:\/\//, '');
        const decoded = atob(base64Part);
        // decoded is user:pass@host:port
        const match = decoded.match(/^([^:]+):([^@]+)@([^:]+):(.+)$/);
        if (match) {
          [, user, pass, host, port] = match;
        }
      } 
      // Format 1: socks5://host:port:user:pass
      else if (input.match(/^socks5?:\/\/([^:]+):([^:]+):([^:]+):(.+)$/)) {
        const match = input.match(/^socks5?:\/\/([^:]+):([^:]+):([^:]+):(.+)$/);
        if (match) {
          [, host, port, user, pass] = match;
        }
      }
      // Format 2: socks5://user:pass@host:port
      else if (input.match(/^socks5?:\/\/([^:]+):([^@]+)@([^:]+):(.+)$/)) {
        const match = input.match(/^socks5?:\/\/([^:]+):([^@]+)@([^:]+):(.+)$/);
        if (match) {
          [, user, pass, host, port] = match;
        }
      }

      if (user && pass && host && port) {
        const userPassBase64 = btoa(`${user}:${pass}`);
        setOutput(`socks://${userPassBase64}@${host}:${port}#${encodeURIComponent(name)}`);
      } else {
        setOutput('Invalid format');
      }
    } catch (e) {
      setOutput('Error parsing link');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-medium text-[#c4c7c5] uppercase tracking-wider px-1">
          Input Proxy Link
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 p-5 bg-[#131314] border border-[#333537] rounded-[24px] font-mono text-sm text-[#e3e3e3] focus:ring-2 focus:ring-[#4285f4] focus:border-transparent outline-none transition-all resize-none"
          placeholder="Paste socks5 link here..."
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={convert}
          className="px-6 py-2.5 bg-[#e3e3e3] text-[#131314] rounded-full text-sm font-medium hover:bg-white transition-colors flex items-center gap-2"
        >
          <Link2 className="w-4 h-4" />
          Convert Link
        </button>
      </div>

      {output && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-[#c4c7c5] uppercase tracking-wider px-1">
            Converted Result
          </label>
          <div className="relative group">
            <pre className="p-5 bg-[#131314] border border-[#333537] rounded-[24px] font-mono text-sm text-[#e3e3e3] overflow-x-auto custom-scrollbar pr-12">
              {output}
            </pre>
            <button
              onClick={copyToClipboard}
              className="absolute top-4 right-4 p-2 bg-[#1e1f20] border border-[#333537] rounded-full hover:bg-[#333537] transition-colors text-[#c4c7c5] hover:text-white"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
