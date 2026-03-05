import React, { useState } from 'react';
import { FileText, Copy, Check, Download, ArrowLeftRight, Code } from 'lucide-react';

export default function JsonCsvConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'json-to-csv' | 'csv-to-json'>('json-to-csv');

  const flattenObject = (obj: any, prefix = ''): any => {
    return Object.keys(obj).reduce((acc: any, k) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  const convertToCsv = () => {
    setError('');
    setOutput('');
    if (!input.trim()) return;

    try {
      const json = JSON.parse(input);
      let data = Array.isArray(json) ? json : [json];

      if (data.length === 0) {
        setError('JSON array is empty');
        return;
      }

      // Flatten objects if they are nested
      data = data.map(item => flattenObject(item));

      const headers = Array.from(
        new Set(data.flatMap(obj => Object.keys(obj)))
      );

      const csvRows = [];
      csvRows.push(headers.join(','));

      for (const row of data) {
        const values = headers.map(header => {
          const val = row[header];
          const escaped = ('' + (val ?? '')).replace(/"/g, '""');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
      }

      setOutput(csvRows.join('\n'));
    } catch (e) {
      setError('Invalid JSON format. Please provide a JSON object or an array of objects.');
    }
  };

  const convertToJson = () => {
    setError('');
    setOutput('');
    if (!input.trim()) return;

    try {
      const lines = input.trim().split('\n');
      if (lines.length < 2) {
        setError('CSV must have at least a header row and one data row.');
        return;
      }

      // Simple CSV parser (handles basic cases, not full RFC 4180)
      const parseLine = (line: string) => {
        const result = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              cur += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            result.push(cur.trim());
            cur = '';
          } else {
            cur += char;
          }
        }
        result.push(cur.trim());
        return result;
      };

      const headers = parseLine(lines[0]);
      const jsonData = [];

      for (let i = 1; i < lines.length; i++) {
        const values = parseLine(lines[i]);
        const obj: any = {};
        headers.forEach((header, index) => {
          let val = values[index] || '';
          // Try to parse numbers or booleans
          if (val.toLowerCase() === 'true') val = true;
          else if (val.toLowerCase() === 'false') val = false;
          else if (!isNaN(Number(val)) && val !== '') val = Number(val);
          
          obj[header] = val;
        });
        jsonData.push(obj);
      }

      setOutput(JSON.stringify(jsonData, null, 2));
    } catch (e) {
      setError('Error parsing CSV. Please check your format.');
    }
  };

  const handleConvert = () => {
    if (mode === 'json-to-csv') {
      convertToCsv();
    } else {
      convertToJson();
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'json-to-csv' ? 'csv-to-json' : 'json-to-csv');
    setInput('');
    setOutput('');
    setError('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResult = () => {
    const extension = mode === 'json-to-csv' ? 'csv' : 'json';
    const mimeType = mode === 'json-to-csv' ? 'text/csv' : 'application/json';
    const blob = new Blob([output], { type: `${mimeType};charset=utf-8;` });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `converted_data.${extension}`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 p-1 bg-[#131314] rounded-full border border-[#333537]">
          <button
            onClick={() => { setMode('json-to-csv'); setInput(''); setOutput(''); }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              mode === 'json-to-csv' ? 'bg-[#333537] text-white' : 'text-[#c4c7c5] hover:text-white'
            }`}
          >
            JSON to CSV
          </button>
          <button
            onClick={() => { setMode('csv-to-json'); setInput(''); setOutput(''); }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              mode === 'csv-to-json' ? 'bg-[#333537] text-white' : 'text-[#c4c7c5] hover:text-white'
            }`}
          >
            CSV to JSON
          </button>
        </div>
        
        <button 
          onClick={toggleMode}
          className="p-2 hover:bg-[#333537] rounded-full text-[#c4c7c5] transition-colors"
          title="Switch Mode"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-[#c4c7c5] uppercase tracking-wider px-1">
          {mode === 'json-to-csv' ? 'Input JSON (Object or Array)' : 'Input CSV Data'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 p-5 bg-[#131314] border border-[#333537] rounded-[24px] font-mono text-sm text-[#e3e3e3] focus:ring-2 focus:ring-[#4285f4] focus:border-transparent outline-none transition-all resize-none"
          placeholder={mode === 'json-to-csv' 
            ? '{"name": "John", "age": 30, "details": {"city": "NY"}}'
            : 'name,age\nJohn,30\nJane,25'
          }
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleConvert}
          className="px-6 py-2.5 bg-[#e3e3e3] text-[#131314] rounded-full text-sm font-medium hover:bg-white transition-colors flex items-center gap-2"
        >
          {mode === 'json-to-csv' ? <FileText className="w-4 h-4" /> : <Code className="w-4 h-4" />}
          Convert to {mode === 'json-to-csv' ? 'CSV' : 'JSON'}
        </button>
      </div>

      {error && <p className="text-[#d96570] text-sm px-2">{error}</p>}

      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-medium text-[#c4c7c5] uppercase tracking-wider">
              {mode === 'json-to-csv' ? 'CSV Result' : 'JSON Result'}
            </label>
            <div className="flex gap-2">
              <button
                onClick={downloadResult}
                className="p-2 bg-[#1e1f20] border border-[#333537] rounded-full hover:bg-[#333537] transition-colors text-[#c4c7c5] hover:text-white"
                title={`Download ${mode === 'json-to-csv' ? 'CSV' : 'JSON'}`}
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={copyToClipboard}
                className="p-2 bg-[#1e1f20] border border-[#333537] rounded-full hover:bg-[#333537] transition-colors text-[#c4c7c5] hover:text-white"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <pre className="p-5 bg-[#131314] border border-[#333537] rounded-[24px] font-mono text-sm text-[#e3e3e3] overflow-x-auto custom-scrollbar">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
