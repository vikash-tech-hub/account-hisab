import React, { useState } from 'react';
import { useHisab } from '../../context/HisabContext';
import {
  RotateCcw,
  Trash2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Store,
  Layers,
  X,
  Database
} from 'lucide-react';

export const ResetModal = ({ isOpen, onClose }) => {
  const {
    clearAllDataToFresh,
    resetToDemoData,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    activeBranch,
    showToast,
    triggerLoader
  } = useHisab();

  const [selectedOption, setSelectedOption] = useState('fresh'); // 'fresh' | 'demo' | 'clear_branch'

  if (!isOpen) return null;

  const handleExecuteReset = () => {
    if (selectedOption === 'fresh') {
      triggerLoader({
        duration: 2500,
        subtitle: '🧹 सारा पुराना डेटा साफ़ हो रहा है... 100% नया फ्रेश खाता तैयार हो रहा है!',
        onFinish: () => {
          clearAllDataToFresh();
          showToast('✅ 100% फ्रेश खाता शुरू हो गया! आप अपना लाइव बैलेंस भर सकते हैं।', 'success');
          onClose();
        }
      });
    } else if (selectedOption === 'demo') {
      triggerLoader({
        duration: 2500,
        subtitle: '📦 डेमो डेटा लोड हो रहा है... 4-Pillars हिसाब तैयार है!',
        onFinish: () => {
          resetToDemoData();
          showToast('✅ डेमो डेटा सफलतापूर्वक रीसेट हो गया!');
          onClose();
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleIn">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>हिसाब रीसेट व फ्रेश शुरुआत (Reset & Fresh Start)</span>
              </h3>
              <p className="text-xs text-slate-400">
                नया हिसाब शुरू करने या डेटा रीसेट करने के विकल्प चुनें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Options */}
        <div className="p-5 space-y-3.5">
          
          {/* Option 1: 100% Fresh Start (Zero/Blank Balance) */}
          <label
            onClick={() => setSelectedOption('fresh')}
            className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedOption === 'fresh'
                ? 'bg-emerald-950/40 border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-950/40'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="reset_type"
                checked={selectedOption === 'fresh'}
                onChange={() => setSelectedOption('fresh')}
                className="mt-1 accent-emerald-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-emerald-300">
                    ✨ 100% नया फ्रेश खाता शुरू करें (Recommended)
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-500/30 uppercase">
                    अपना रियल हिसाब
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  सारे पुराने टेस्ट ट्रांजैक्शन, जमा, उधार, कमाई और खर्चे साफ़ हो जाएंगे। 10 पोर्टल और बैंक खाते शून्य (₹0) बैलेंस के साथ तैयार मिलेंगे ताकि आप आज का अपना असली बैलेंस भर सकें।
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] text-slate-400 font-medium">
                  <span className="bg-slate-800/80 px-2 py-0.5 rounded text-emerald-400">✓ 10 पोर्टल ₹0 बैलेंस</span>
                  <span className="bg-slate-800/80 px-2 py-0.5 rounded text-emerald-400">✓ बैंक/कैश ₹0 बैलेंस</span>
                  <span className="bg-slate-800/80 px-2 py-0.5 rounded text-emerald-400">✓ खाली ग्राहक खाता</span>
                </div>
              </div>
            </div>
          </label>

          {/* Option 2: Reset Demo Data */}
          <label
            onClick={() => setSelectedOption('demo')}
            className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedOption === 'demo'
                ? 'bg-indigo-950/40 border-indigo-500/80 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-950/40'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="reset_type"
                checked={selectedOption === 'demo'}
                onChange={() => setSelectedOption('demo')}
                className="mt-1 accent-indigo-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-indigo-300">
                    📦 सैंपल डेमो डेटा भरें (Sample Demo Data)
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  अगर आप टेस्टिंग के लिए भरा हुआ डमी हिसाब देखना चाहते हैं (Spice Money, SBI, Ramesh Dairy आदि के साथ)।
                </p>
              </div>
            </div>
          </label>

          {/* LocalStorage Note & Multi-Shop info */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
            <Database className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-200 font-bold">💡 Multi-Storage / 2-3 दुकानें चलाना चाहते हैं?</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                आप ऊपर <strong>"+ Add Shop"</strong> बटन से 2 या 3 अलग-अलग दुकानें जोड़ सकते हैं। हर दुकान का अलग LocalStorage डेटा सुरक्षित रहेगा और एक क्लिक में स्विच कर सकते हैं!
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            रद्द करें (Cancel)
          </button>

          <button
            onClick={handleExecuteReset}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
              selectedOption === 'fresh'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>
              {selectedOption === 'fresh' ? '✨ फ्रेश खाता शुरू करें (Reset Clean)' : '📦 डेमो डेटा लोड करें'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
