'use client';

import React, { useState } from 'react';
import { logQuoteGeneration } from './actions';

type CustomSection = {
  id: string;
  heading: string;
  description: string;
};

export default function QuoteGenerator() {
  const [clientName, setClientName] = useState('');
  const [projectType, setProjectType] = useState('Website App');
  const [features, setFeatures] = useState('');
  const [urgency, setUrgency] = useState('Normal (4-6 weeks)');
  const [budget, setBudget] = useState('50000');
  
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [quoteOutput, setQuoteOutput] = useState<string | null>(null);

  const addCustomSection = () => {
    setCustomSections([...customSections, { id: Math.random().toString(), heading: '', description: '' }]);
  };

  const updateCustomSection = (id: string, field: 'heading' | 'description', value: string) => {
    setCustomSections(customSections.map(sec => sec.id === id ? { ...sec, [field]: value } : sec));
  };

  const removeCustomSection = (id: string) => {
    setCustomSections(customSections.filter(sec => sec.id !== id));
  };

  const calculateQuote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let basePrice = parseInt(budget, 10) || 0;
    let finalPrice = basePrice;
    
    // Add artificial calculations mapping (adjusted for INR roughly, multiplied by 10 for dummy scale)
    if (projectType === 'Full Stack App') finalPrice += 50000;
    if (projectType === 'E-Commerce') finalPrice += 80000;
    
    if (urgency === 'Urgent (1-2 weeks)') finalPrice *= 1.5;
    if (urgency === 'Relaxed (3+ months)') finalPrice *= 0.8;

    const featCount = features.split(',').filter(f => f.trim().length > 0).length;
    finalPrice += featCount * 5000; 

    const customSectionsText = customSections.map(sec => `
${sec.heading ? sec.heading.toUpperCase() : 'ADDITIONAL DETAILS'}
-----------------------------------------
${sec.description}
    `).join('\n');
    
    const quote = `
=========================================
ATLAS DEVELOPMENT QUOTATION
=========================================
Date: ${new Date().toLocaleDateString()}
Prepared for: ${clientName || 'Valued Client'}
Project Type: ${projectType}

Requirements & Features: 
${features.split(',').map((f, i) => f.trim() ? `  - ${f.trim()}` : '').join('\n').trim() || '  - Standard boilerplate'}

Development Timeline: ${urgency}
${customSectionsText}
-----------------------------------------
ESTIMATED TOTAL INVESTMENT: ₹ ${Math.floor(finalPrice).toLocaleString('en-IN')} INR
-----------------------------------------
Notes: This quote is strictly an automated estimate powered by Atlas systems. 
Prices may vary drastically depending on cloud-scaling needs and maintenance SLAs.
    `;
    
    // Log the action to the server
    logQuoteGeneration(clientName || 'Valued Client', `₹ ${Math.floor(finalPrice).toLocaleString('en-IN')} INR`);

    setQuoteOutput(quote.trim());
  };

  const downloadQuote = () => {
    if (!quoteOutput) return;
    const blob = new Blob([quoteOutput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Atlas_Quotation_${clientName.replace(/\s+/g, '_') || 'Draft'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 sm:p-12 w-full flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-8 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Quote Generator</h1>
          <p className="text-zinc-400 text-sm">
            Generate programmatic project estimates automatically based on feature requirements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 flex-grow">
        
        {/* Input Form */}
        <div className="bg-zinc-950/50 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col h-fit shadow-sm">
          <form onSubmit={calculateQuote} className="space-y-6">
            
            <div>
               <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 block">Client / Company Name</label>
               <input 
                 type="text" 
                 required
                 value={clientName}
                 onChange={(e) => setClientName(e.target.value)}
                 className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                 placeholder="Acme Corp"
               />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 block">Project Scope</label>
                  <select 
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none"
                  >
                     <option>Landing Page</option>
                     <option>Website App</option>
                     <option>Full Stack App</option>
                     <option>E-Commerce</option>
                     <option>Internal Dashboard</option>
                  </select>
               </div>
               <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 block">Target Timeline</label>
                  <select 
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none"
                  >
                     <option>Urgent (1-2 weeks)</option>
                     <option>Normal (4-6 weeks)</option>
                     <option>Relaxed (3+ months)</option>
                  </select>
               </div>
            </div>

            <div>
               <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 block">Feature List (Comma Separated)</label>
               <textarea 
                 value={features}
                 onChange={(e) => setFeatures(e.target.value)}
                 rows={3}
                 required
                 className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                 placeholder="Auth, Real-time Chat, Stripe Payments, Admin Dashboard..."
               />
            </div>

            {/* Custom Sections Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block">Custom Sections</label>
                <button 
                  type="button" 
                  onClick={addCustomSection}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                  Add Custom Section
                </button>
              </div>

              {customSections.map(sec => (
                 <div key={sec.id} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-3 relative group">
                    <button 
                      type="button" 
                      onClick={() => removeCustomSection(sec.id)}
                      className="absolute top-3 right-3 text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                    <div>
                      <input 
                        type="text" 
                        value={sec.heading}
                        onChange={(e) => updateCustomSection(sec.id, 'heading', e.target.value)}
                        placeholder="Section Heading (e.g. Hosting Strategy)"
                        className="w-[90%] bg-transparent text-sm font-semibold text-emerald-400 focus:outline-none placeholder-zinc-600"
                      />
                    </div>
                    <div>
                      <textarea 
                        value={sec.description}
                        onChange={(e) => updateCustomSection(sec.id, 'description', e.target.value)}
                        placeholder="Section contents and details..."
                        rows={2}
                        className="w-full bg-zinc-950/50 border border-zinc-800/80 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500/30 transition-colors resize-none"
                      />
                    </div>
                 </div>
              ))}
            </div>
            
            <div>
               <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 block">Base Architecture Budget (₹ INR)</label>
               <input 
                 type="number"
                 step="1000" 
                 value={budget}
                 onChange={(e) => setBudget(e.target.value)}
                 className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
               />
            </div>

             <button 
                type="submit" 
                className="w-full mt-4 px-8 py-3.5 bg-white text-black rounded-xl text-sm font-semibold hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              >
                Compile Quote Document
              </button>
          </form>
        </div>

        {/* Output Document view */}
        <div className="h-full flex flex-col">
          <div className="bg-[#1e1e1e] rounded-t-xl px-4 py-3 border border-[#333] border-b-0 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
            <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
            <span className="text-xs font-mono text-[#888] ml-4">quote-output.txt</span>
          </div>
          <div className="flex-grow bg-[#111] border border-[#333] rounded-b-xl p-6 font-mono text-sm text-[#ddd] overflow-y-auto whitespace-pre-wrap shadow-inner relative">
            {quoteOutput ? (
              quoteOutput
            ) : (
              <span className="text-[#555] opacity-60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full">Waiting for compiler input...<br/>Fill out the left form to deploy quotation.</span>
            )}
          </div>
          
          {quoteOutput && (
            <div className="flex items-center justify-end gap-3 mt-4">
              <button 
                onClick={() => {
                   navigator.clipboard.writeText(quoteOutput);
                   alert('Copied to clipboard!');
                }}
                className="px-4 py-2 border border-zinc-800 text-zinc-400 bg-zinc-900 rounded-lg text-xs hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Copy Raw
              </button>
              <button 
                onClick={downloadQuote}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download .txt
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
