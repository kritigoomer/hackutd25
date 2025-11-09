import React, { useState } from 'react';
import { Search, RefreshCw, Send, Plus, Edit2, Trash2 } from 'lucide-react';

export default function ProductManagerTool() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [isSyncing, setIsSyncing] = useState(false);

  const products = [
    { id: 1, name: 'Mobile Banking App', status: 'Active' },
    { id: 2, name: 'Payment Gateway', status: 'Active' },
    { id: 3, name: 'Customer Portal', status: 'In Development' },
    { id: 4, name: 'Analytics Dashboard', status: 'Active' },
    { id: 5, name: 'Loan Management System', status: 'Planning' }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedProduct) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages([...chatMessages, userMessage]);
    setInputMessage('');
    setIsGenerating(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        content: `Based on the analysis of ${selectedProduct.name}:\n\nWe are currently on track with most deliverables. However, there are some areas that need attention:\n\n• "Timeline": 2 user stories are at risk of missing their deadlines\n• "Budget": Operating within 5% of allocated budget\n• "Quality": All acceptance criteria are being met\n\n"Recommended Priority Backlog":`,
        backlog: [
          {
            id: 1,
            title: 'Fix payment processing latency',
            priority: 'High',
            deadline: '2 weeks',
            reason: 'Impacting user experience and transaction success rate'
          },
          {
            id: 2,
            title: 'Implement security audit recommendations',
            priority: 'High',
            deadline: '3 weeks',
            reason: 'Critical for compliance requirements'
          },
          {
            id: 3,
            title: 'Add multi-currency support',
            priority: 'Medium',
            deadline: '6 weeks',
            reason: 'Requested by 40% of enterprise clients'
          },
          {
            id: 4,
            title: 'Improve dashboard load time',
            priority: 'Medium',
            deadline: '4 weeks',
            reason: 'Performance optimization for better UX'
          }
        ],
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiResponse]);
      setIsGenerating(false);
    }, 2000);
  };

  const syncToJira = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setLastSyncTime(new Date());
      setIsSyncing(false);
    }, 1500);
  };

  const priorityColors = {
    'High': 'bg-red-900/20 text-red-200 border-red-700/50',
    'Medium': 'bg-amber-900/20 text-amber-200 border-amber-700/50',
    'Low': 'bg-emerald-900/20 text-emerald-200 border-emerald-700/50'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 flex relative overflow-hidden">
      {/* Forest Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 text-8xl">🦊</div>
        <div className="absolute top-40 left-10 text-7xl">🦌</div>
        <div className="absolute bottom-20 right-40 text-6xl">🐦‍⬛</div>
        <div className="absolute bottom-40 left-20 text-7xl">🐱</div>
        <div className="absolute top-1/2 right-10 text-5xl">🌲</div>
        <div className="absolute top-1/3 left-1/4 text-6xl">🌲</div>
        <div className="absolute bottom-1/4 right-1/3 text-7xl">🌲</div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-gradient-to-b from-emerald-900/40 to-slate-900/40 backdrop-blur-md border-r border-emerald-700/30 flex flex-col relative z-10">
        <div className="p-6 border-b border-emerald-700/30">
          <h1 className="text-2xl font-bold text-emerald-100">Jira Mate</h1>
          <p className="text-sm text-emerald-300/70 mt-1">Product Manager Assistant</p>
        </div>

        {/* Search Products */}
        <div className="p-4 border-b border-emerald-700/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-emerald-700/30 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-emerald-100 placeholder-emerald-400/50"
            />
          </div>
        </div>

        {/* Products List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">
            Products
          </h3>
          <div className="space-y-2">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  selectedProduct?.id === product.id
                    ? 'bg-emerald-800/50 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800/30 border-2 border-transparent hover:border-emerald-700/50 hover:bg-slate-800/50'
                }`}
              >
                <div className="font-medium text-emerald-100 text-sm">{product.name}</div>
                <div className="text-xs text-emerald-300/60 mt-1">{product.status}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Jira Sync at Bottom */}
        <div className="p-4 border-t border-emerald-700/30 bg-slate-900/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
              <span className="text-sm font-medium text-emerald-100">Jira Sync</span>
            </div>
            <button 
              onClick={syncToJira}
              disabled={isSyncing}
              className="text-emerald-400 hover:text-emerald-300 disabled:text-emerald-700"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-xs text-emerald-300/60">
            Last synced: {lastSyncTime.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {selectedProduct ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 backdrop-blur-md border-b border-emerald-700/30 p-6">
              <h2 className="text-2xl font-bold text-emerald-100">{selectedProduct.name}</h2>
              <p className="text-emerald-300/70 mt-1">Ask questions about delivery, priorities, and product success</p>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {chatMessages.length === 0 ? (
                <div className="text-center mt-12">
                  <div className="inline-block p-4 bg-emerald-800/30 rounded-full mb-4 backdrop-blur-sm">
                    <Send className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-emerald-100 mb-2">Ask me anything about {selectedProduct.name}</h3>
                  <p className="text-emerald-300/70 max-w-md mx-auto">
                    Try asking: "Are we delivering on time and on budget?" or "Are we delivering the right thing and making it successful over time?"
                  </p>
                </div>
              ) : (
                chatMessages.map((message, idx) => (
                  <div key={idx} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3xl ${message.type === 'user' ? 'bg-emerald-700/50 text-emerald-50 backdrop-blur-sm' : 'bg-slate-800/50 backdrop-blur-sm border border-emerald-700/30'} rounded-lg p-4 shadow-lg`}>
                      {message.type === 'user' ? (
                        <p className="text-sm">{message.content}</p>
                      ) : (
                        <div>
                          <p className="text-emerald-100 text-sm whitespace-pre-line mb-4">{message.content}</p>
                          
                          {message.backlog && (
                            <div className="mt-4 space-y-3">
                              {message.backlog.map((item) => (
                                <div key={item.id} className="bg-slate-900/50 rounded-lg p-4 border border-emerald-700/30">
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-semibold text-emerald-100 text-sm">{item.title}</h4>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[item.priority]}`}>
                                      {item.priority}
                                    </span>
                                  </div>
                                  <p className="text-xs text-emerald-300/70 mb-2">{item.reason}</p>
                                  <div className="flex items-center gap-2 text-xs text-emerald-300/60">
                                    <span className="font-medium">Deadline:</span>
                                    <span>{item.deadline}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-700/30 rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                      <span className="text-sm text-emerald-300/70">Analyzing product data...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 backdrop-blur-md border-t border-emerald-700/30 p-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about delivery, priorities, budget, success metrics..."
                  className="flex-1 px-4 py-3 bg-slate-800/50 border border-emerald-700/30 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-100 placeholder-emerald-400/50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isGenerating}
                  className="px-6 py-3 bg-emerald-700 text-emerald-50 rounded-lg hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center gap-2 transition shadow-lg shadow-emerald-900/30"
                >
                  <Send className="w-4 h-4" />
                  Ask
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block p-4 bg-emerald-800/30 rounded-full mb-4 backdrop-blur-sm">
                <Search className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-100 mb-2">Select a Product</h3>
              <p className="text-emerald-300/70">Choose a product from the sidebar to start asking questions</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}