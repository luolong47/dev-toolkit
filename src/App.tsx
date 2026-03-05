import React, { useState } from 'react';
import { Code, Hash, Menu, Plus, Github, Home as HomeIcon, LogIn, LogOut, FileSearch, Settings, HelpCircle, History, Link2, FileText } from 'lucide-react';
import JsonFormatter from './components/JsonFormatter';
import Base64Encoder from './components/Base64Encoder';
import Home from './components/Home';
import Login from './components/Login';
import PremiumTool from './components/PremiumTool';
import ProxyConverter from './components/ProxyConverter';
import JsonToCsv from './components/JsonCsvConverter';

type Tool = 'home' | 'json-formatter' | 'base64-encoder' | 'premium-tool' | 'proxy-converter' | 'json-to-csv';

export default function App() {
  const [activeTool, setActiveTool] = useState<Tool>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  const tools = [
    { id: 'json-formatter', name: 'JSON Formatter', icon: Code, isPremium: false },
    { id: 'base64-encoder', name: 'Base64 Encoder/Decoder', icon: Hash, isPremium: false },
    { id: 'proxy-converter', name: 'Proxy Link Converter', icon: Link2, isPremium: false },
    { id: 'json-to-csv', name: 'JSON ↔ CSV Converter', icon: FileText, isPremium: false },
    { id: 'premium-tool', name: 'Image Metadata Extractor', icon: FileSearch, isPremium: true },
  ];

  const handleToolSelect = (id: Tool) => {
    const tool = tools.find(t => t.id === id);
    if (tool?.isPremium && !user) {
      setShowLogin(true);
    } else {
      setActiveTool(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#131314] text-[#e3e3e3] flex font-sans">
      {showLogin && (
        <Login 
          onLogin={(name) => setUser(name)} 
          onClose={() => setShowLogin(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-[280px]' : 'w-[68px]'} bg-[#1e1f20] transition-all duration-300 flex flex-col h-screen sticky top-0 z-40`}>
        <div className="p-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-[#333537] rounded-full transition-colors"
            title="Collapse menu"
          >
            <Menu className="w-6 h-6 text-[#c4c7c5]" />
          </button>
        </div>

        <div className="px-3 mb-4">
          <button 
            onClick={() => setActiveTool('home')}
            className={`flex items-center gap-3 h-10 transition-all rounded-full ${
              isSidebarOpen ? 'px-4 bg-[#1a1a1c] hover:bg-[#333537] w-fit' : 'w-10 justify-center hover:bg-[#333537]'
            }`}
          >
            <Plus className="w-5 h-5 text-[#c4c7c5]" />
            {isSidebarOpen && <span className="text-sm font-medium text-[#c4c7c5]">New Tool</span>}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
          {isSidebarOpen && <p className="px-4 py-2 text-xs font-medium text-[#c4c7c5] uppercase tracking-wider">Recent Tools</p>}
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolSelect(tool.id as Tool)}
              className={`flex items-center gap-3 w-full h-10 rounded-full transition-colors group ${
                activeTool === tool.id ? 'bg-[#004a77] text-[#c2e7ff]' : 'hover:bg-[#333537] text-[#e3e3e3]'
              } ${isSidebarOpen ? 'px-4' : 'justify-center'}`}
              title={!isSidebarOpen ? tool.name : undefined}
            >
              <tool.icon className={`w-5 h-5 shrink-0 ${activeTool === tool.id ? 'text-[#c2e7ff]' : 'text-[#c4c7c5]'}`} />
              {isSidebarOpen && <span className="text-sm truncate flex-1 text-left">{tool.name}</span>}
            </button>
          ))}
        </div>

        <div className="p-3 space-y-1 border-t border-[#333537]">
          <button className={`flex items-center gap-3 w-full h-10 rounded-full hover:bg-[#333537] transition-colors ${isSidebarOpen ? 'px-4' : 'justify-center'}`}>
            <History className="w-5 h-5 text-[#c4c7c5]" />
            {isSidebarOpen && <span className="text-sm text-[#e3e3e3]">Activity</span>}
          </button>
          <button className={`flex items-center gap-3 w-full h-10 rounded-full hover:bg-[#333537] transition-colors ${isSidebarOpen ? 'px-4' : 'justify-center'}`}>
            <Settings className="w-5 h-5 text-[#c4c7c5]" />
            {isSidebarOpen && <span className="text-sm text-[#e3e3e3]">Settings</span>}
          </button>
          <button className={`flex items-center gap-3 w-full h-10 rounded-full hover:bg-[#333537] transition-colors ${isSidebarOpen ? 'px-4' : 'justify-center'}`}>
            <HelpCircle className="w-5 h-5 text-[#c4c7c5]" />
            {isSidebarOpen && <span className="text-sm text-[#e3e3e3]">Help</span>}
          </button>
          
          <div className="pt-2">
            {user ? (
              <button 
                onClick={() => { setUser(null); setActiveTool('home'); }}
                className={`flex items-center gap-3 w-full h-10 rounded-full hover:bg-[#333537] transition-colors ${isSidebarOpen ? 'px-4' : 'justify-center'}`}
              >
                <LogOut className="w-5 h-5 text-[#c4c7c5]" />
                {isSidebarOpen && <span className="text-sm text-[#e3e3e3] truncate">{user}</span>}
              </button>
            ) : (
              <button 
                onClick={() => setShowLogin(true)}
                className={`flex items-center gap-3 w-full h-10 rounded-full hover:bg-[#333537] transition-colors ${isSidebarOpen ? 'px-4' : 'justify-center'}`}
              >
                <LogIn className="w-5 h-5 text-[#c4c7c5]" />
                {isSidebarOpen && <span className="text-sm text-[#e3e3e3]">Sign In</span>}
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top bar (Model selector style) */}
        <div className="h-16 flex items-center px-6 justify-between">
          <div className="flex items-center gap-2 cursor-pointer hover:bg-[#1e1f20] px-3 py-1.5 rounded-lg transition-colors">
            <span className="text-lg font-medium text-[#e3e3e3]">DevToolKit</span>
            <span className="text-[#c4c7c5] text-sm">v1.0</span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 px-3 py-1 bg-[#004a77]/30 border border-[#004a77]/50 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c2e7ff] animate-pulse" />
                <span className="text-[10px] font-bold text-[#c2e7ff] uppercase tracking-widest">Premium</span>
              </div>
            )}
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-[#1e1f20] rounded-full transition-colors">
              <Github className="w-6 h-6 text-[#c4c7c5]" />
            </a>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[840px] mx-auto w-full h-full flex flex-col">
            {activeTool === 'home' ? (
              <div className="flex-1 flex flex-col justify-center pb-20">
                <h1 className="text-4xl md:text-5xl font-medium mb-12 bg-gradient-to-r from-[#4285f4] via-[#9b72cb] to-[#d96570] bg-clip-text text-transparent w-fit">
                  {user ? `Hello, ${user}` : 'Hello, Developer'}
                </h1>
                <Home 
                  onSelectTool={(id) => handleToolSelect(id as Tool)} 
                  isLoggedIn={!!user}
                  onOpenLogin={() => setShowLogin(true)}
                />
              </div>
            ) : (
              <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h2 className="text-2xl font-medium text-[#e3e3e3]">
                    {tools.find((t) => t.id === activeTool)?.name}
                  </h2>
                </div>
                <div className="bg-[#1e1f20] p-6 md:p-8 rounded-[28px] border border-[#333537] shadow-xl">
                  {activeTool === 'json-formatter' && <JsonFormatter />}
                  {activeTool === 'base64-encoder' && <Base64Encoder />}
                  {activeTool === 'proxy-converter' && <ProxyConverter />}
                  {activeTool === 'json-to-csv' && <JsonToCsv />}
                  {activeTool === 'premium-tool' && <PremiumTool />}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Input Area (Gemini Style) */}
        <div className="p-4 md:p-6 max-w-[840px] mx-auto w-full">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4285f4] via-[#9b72cb] to-[#d96570] rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-[#1e1f20] rounded-full px-6 py-4 flex items-center gap-4 border border-[#333537]">
              <Plus className="w-5 h-5 text-[#c4c7c5] cursor-pointer hover:text-white" />
              <input 
                type="text" 
                placeholder="Search tools or enter command..." 
                className="bg-transparent border-none outline-none flex-1 text-[#e3e3e3] placeholder-[#c4c7c5]"
              />
              <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-[#c4c7c5] cursor-pointer hover:text-white" />
                <Hash className="w-5 h-5 text-[#c4c7c5] cursor-pointer hover:text-white" />
              </div>
            </div>
          </div>
          <p className="text-center text-[10px] text-[#c4c7c5] mt-3">
            DevToolKit can provide helpful tools but may require sign-in for advanced features.
          </p>
        </div>
      </main>
    </div>
  );
}
