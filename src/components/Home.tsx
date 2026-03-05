import { Code, Hash, FileSearch, Lock, ArrowRight, Sparkles, Link2, FileText } from 'lucide-react';

interface HomeProps {
  onSelectTool: (toolId: string) => void;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
}

export default function Home({ onSelectTool, isLoggedIn, onOpenLogin }: HomeProps) {
  const tools = [
    { id: 'json-formatter', name: 'JSON Formatter', icon: Code, description: 'Format and validate JSON strings with instant feedback.', isPremium: false },
    { id: 'base64-encoder', name: 'Base64 Encoder/Decoder', icon: Hash, description: 'Encode or decode text to Base64 format securely.', isPremium: false },
    { id: 'proxy-converter', name: 'Proxy Link Converter', icon: Link2, description: 'Convert various SOCKS5 proxy link formats to standard format.', isPremium: false },
    { id: 'json-to-csv', name: 'JSON ↔ CSV Converter', icon: FileText, description: 'Bidirectional conversion between JSON arrays and CSV format.', isPremium: false },
    { id: 'premium-tool', name: 'Image Metadata Extractor', icon: FileSearch, description: 'Advanced image analysis and EXIF data extraction for professionals.', isPremium: true },
  ];

  const handleToolClick = (tool: typeof tools[0]) => {
    if (tool.isPremium && !isLoggedIn) {
      onOpenLogin();
    } else {
      onSelectTool(tool.id);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => handleToolClick(tool)}
          className="group relative flex flex-col h-[200px] p-6 bg-[#1e1f20] border border-[#333537] rounded-[28px] hover:bg-[#282a2c] hover:border-[#444648] transition-all duration-300 text-left overflow-hidden hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-1"
        >
          {/* Background Glow Effect */}
          <div className="absolute -inset-px bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  tool.isPremium && !isLoggedIn ? 'bg-[#131314] text-[#c4c7c5]' : 'bg-[#131314] text-[#4285f4] group-hover:bg-[#1e1f20]'
                }`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                
                {tool.isPremium && (
                  <div className="flex items-center gap-1.5">
                    {!isLoggedIn && <Lock className="w-3.5 h-3.5 text-[#c4c7c5]" />}
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-[#004a77]/20 border border-[#004a77]/40 rounded-full">
                      <Sparkles className="w-3 h-3 text-[#c2e7ff]" />
                      <span className="text-[10px] font-bold text-[#c2e7ff] uppercase tracking-wider">Premium</span>
                    </div>
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-medium text-[#e3e3e3] mb-2 group-hover:text-white transition-colors">
                {tool.name}
              </h3>
              <p className="text-[#c4c7c5] text-sm leading-relaxed line-clamp-2 group-hover:text-[#e3e3e3] transition-colors">
                {tool.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <span className="text-[11px] font-medium text-[#c4c7c5] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 duration-300">
                {tool.isPremium && !isLoggedIn ? 'Unlock Now' : 'Open Tool'}
              </span>
              <div className="w-9 h-9 rounded-full bg-[#131314] flex items-center justify-center group-hover:bg-[#4285f4] transition-all duration-300 group-hover:scale-110">
                <ArrowRight className="w-4 h-4 text-[#c4c7c5] group-hover:text-white" />
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
