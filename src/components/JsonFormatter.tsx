import { useState } from 'react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e) {
      setError('Invalid JSON');
      setOutput('');
    }
  };

  return (
    <div className="space-y-6">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-64 p-5 bg-[#131314] border border-[#333537] rounded-[24px] font-mono text-sm text-[#e3e3e3] focus:ring-2 focus:ring-[#4285f4] focus:border-transparent outline-none transition-all resize-none"
        placeholder="Paste your JSON here..."
      />
      <div className="flex justify-end">
        <button
          onClick={formatJson}
          className="px-6 py-2.5 bg-[#e3e3e3] text-[#131314] rounded-full text-sm font-medium hover:bg-white transition-colors"
        >
          Format JSON
        </button>
      </div>
      {error && <p className="text-[#d96570] text-sm px-2">{error}</p>}
      {output && (
        <pre className="p-5 bg-[#131314] border border-[#333537] rounded-[24px] font-mono text-sm text-[#e3e3e3] overflow-x-auto custom-scrollbar">
          {output}
        </pre>
      )}
    </div>
  );
}
