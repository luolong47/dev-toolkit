import { useState } from 'react';

export default function Base64Encoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => {
    setOutput(btoa(input));
  };

  const decode = () => {
    try {
      setOutput(atob(input));
    } catch (e) {
      setOutput('Invalid Base64');
    }
  };

  return (
    <div className="space-y-6">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-64 p-5 bg-[#131314] border border-[#333537] rounded-[24px] font-mono text-sm text-[#e3e3e3] focus:ring-2 focus:ring-[#4285f4] focus:border-transparent outline-none transition-all resize-none"
        placeholder="Enter text or base64 here..."
      />
      <div className="flex gap-3 justify-end">
        <button
          onClick={decode}
          className="px-6 py-2.5 bg-[#333537] text-[#e3e3e3] rounded-full text-sm font-medium hover:bg-[#444648] transition-colors"
        >
          Decode
        </button>
        <button
          onClick={encode}
          className="px-6 py-2.5 bg-[#e3e3e3] text-[#131314] rounded-full text-sm font-medium hover:bg-white transition-colors"
        >
          Encode
        </button>
      </div>
      {output && (
        <pre className="p-5 bg-[#131314] border border-[#333537] rounded-[24px] font-mono text-sm text-[#e3e3e3] overflow-x-auto custom-scrollbar">
          {output}
        </pre>
      )}
    </div>
  );
}
