import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useHisab } from '../../context/HisabContext';
import { formatINR, formatDate, formatDateFull } from '../../utils/formatters';
import {
  Printer,
  Share2,
  CheckCircle2,
  Building2,
  CreditCard,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  Scale,
  Calendar,
  X
} from 'lucide-react';

export const QuickHisabParchi = ({ isOpen, onClose }) => {
  const {
    activeBranch,
    selectedDate,
    activePortals,
    activeBankAccounts,
    activeJamaList,
    activeLiyaList,
    todaysIncomes,
    todaysExpenses,
    totalPortalsBalance,
    totalBankBalance,
    totalJamaAmount,
    totalLiyaAmount,
    totalIncomes,
    totalExpenses,
    netTotalCapital
  } = useHisab();

  const [printViewMode, setPrintViewMode] = useState('full'); // 'full' | 'compact'

  if (!isOpen) return null;

  const netTodayProfit = totalIncomes - totalExpenses;
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const handlePrint = () => {
    window.print();
  };

  // WhatsApp Summary Message Generator
  const generateWhatsAppText = () => {
    const text = `*${activeBranch.name} (${activeBranch.code})*
*दैनिक 4-पिलर हिसाब पर्ची (Daily Hisab Slip)*
📅 दिनांक: ${formatDate(selectedDate)} (${formatDateFull(selectedDate)})
--------------------------------
1️⃣ *10 पोर्टल बैलेंस:* ${formatINR(totalPortalsBalance)}
2️⃣ *बैंक व गल्ला कैश:* ${formatINR(totalBankBalance)}
3️⃣ *ग्राहक जमा (Jama):* +${formatINR(totalJamaAmount)}
4️⃣ *ग्राहक उधार (Liya):* -${formatINR(totalLiyaAmount)}
5️⃣ *अन्य सेवा कमाई:* +${formatINR(totalIncomes)}
6️⃣ *दुकान खर्च:* -${formatINR(totalExpenses)}
--------------------------------
💵 *कुल उपलब्ध शुद्ध पूँजी (Net Capital): ${formatINR(netTotalCapital)}*
📈 *आज का शुद्ध मुनाफा (Net Profit): ${formatINR(netTodayProfit)}*
--------------------------------
_Jan Seva Kendra 4-Pillars Digital System_`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="दैनिक सम्पूर्ण हिसाब पर्ची (Daily Complete Hisab Statement Slip)"
      subtitle="पोर्टल, बैंक, गल्ला, जमा, उधार, अन्य कमाई और दुकान खर्च का मुकम्मल प्रिंट"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        
        {/* Action Controls Bar (Hidden during Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 no-print text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">प्रिंट व्यू:</span>
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
              <button
                type="button"
                onClick={() => setPrintViewMode('full')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  printViewMode === 'full'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📋 सम्पूर्ण बहीखाता (Full All-in-1)
              </button>
              <button
                type="button"
                onClick={() => setPrintViewMode('compact')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  printViewMode === 'compact'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🧾 संक्षिप्त पर्ची (Summary Parchi)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={generateWhatsAppText()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp शेयर</span>
            </a>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>🖨️ प्रिंट निकालें (Print Slip)</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PRINTABLE HISAB DOCUMENT (Optimized for A4 Paper & Thermal Printers)     */}
        {/* ========================================================================= */}
        <div
          id="printable-slip"
          className="bg-white text-slate-950 p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-300 font-sans space-y-5 print-page"
        >
          {/* Top Brand Header */}
          <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Building2 className="w-6 h-6 text-slate-900" />
              <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                {activeBranch.name}
              </h1>
            </div>
            <p className="text-xs font-semibold text-slate-700">
              ब्रांच कोड: <strong>{activeBranch.code}</strong> | संचालक / मैनेजर: <strong>{activeBranch.manager}</strong>
              {activeBranch.phone && ` | फोन: ${activeBranch.phone}`}
            </p>
            {activeBranch.address && (
              <p className="text-[11px] text-slate-600">
                दुकान पता: {activeBranch.address}
              </p>
            )}
            <div className="pt-1">
              <span className="inline-block bg-slate-900 text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider">
                दैनिक सम्पूर्ण 4-पिलर डिजिटल बहीखाता हिसाब पर्ची (DAILY ALL-IN-1 HISAB STATEMENT)
              </span>
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="flex flex-wrap items-center justify-between text-xs font-bold border-b border-dashed border-slate-400 pb-2.5 text-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>हिसाब दिनांक:</span>
              <span className="text-sm font-black text-slate-950">
                {formatDate(selectedDate)} ({formatDateFull(selectedDate)})
              </span>
            </div>
            <div>
              <span>पर्ची प्रिंट समय: </span>
              <span className="font-mono">{currentTime}</span>
            </div>
          </div>

          {/* 6 Metric Summary Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
            <div className="p-2 rounded-xl border border-slate-300 bg-slate-50 text-center">
              <div className="text-[10px] font-bold text-slate-600 uppercase">1. सभी 10 पोर्टल</div>
              <div className="text-xs sm:text-sm font-mono font-black text-slate-950 mt-0.5">
                {formatINR(totalPortalsBalance)}
              </div>
              <div className="text-[9px] text-slate-500 font-semibold">{activePortals.length} Portals</div>
            </div>

            <div className="p-2 rounded-xl border border-slate-300 bg-slate-50 text-center">
              <div className="text-[10px] font-bold text-slate-600 uppercase">2. बैंक व गल्ला कैश</div>
              <div className="text-xs sm:text-sm font-mono font-black text-slate-950 mt-0.5">
                {formatINR(totalBankBalance)}
              </div>
              <div className="text-[9px] text-slate-500 font-semibold">{activeBankAccounts.length} A/C + Cash</div>
            </div>

            <div className="p-2 rounded-xl border border-emerald-300 bg-emerald-50/70 text-center">
              <div className="text-[10px] font-bold text-emerald-800 uppercase">3. ग्राहक जमा (+Jama)</div>
              <div className="text-xs sm:text-sm font-mono font-black text-emerald-800 mt-0.5">
                +{formatINR(totalJamaAmount)}
              </div>
              <div className="text-[9px] text-emerald-700 font-semibold">{activeJamaList.length} जमा एंट्री</div>
            </div>

            <div className="p-2 rounded-xl border border-rose-300 bg-rose-50/70 text-center">
              <div className="text-[10px] font-bold text-rose-800 uppercase">4. ग्राहक उधार (-Liya)</div>
              <div className="text-xs sm:text-sm font-mono font-black text-rose-800 mt-0.5">
                -{formatINR(totalLiyaAmount)}
              </div>
              <div className="text-[9px] text-rose-700 font-semibold">{activeLiyaList.length} उधार एंट्री</div>
            </div>

            <div className="p-2 rounded-xl border border-teal-300 bg-teal-50/70 text-center">
              <div className="text-[10px] font-bold text-teal-800 uppercase">5. अन्य सेवा कमाई</div>
              <div className="text-xs sm:text-sm font-mono font-black text-teal-800 mt-0.5">
                +{formatINR(totalIncomes)}
              </div>
              <div className="text-[9px] text-teal-700 font-semibold">{todaysIncomes.length} कमाई मद</div>
            </div>

            <div className="p-2 rounded-xl border border-amber-300 bg-amber-50/70 text-center">
              <div className="text-[10px] font-bold text-amber-800 uppercase">6. दुकान खर्च</div>
              <div className="text-xs sm:text-sm font-mono font-black text-amber-800 mt-0.5">
                -{formatINR(totalExpenses)}
              </div>
              <div className="text-[9px] text-amber-700 font-semibold">{todaysExpenses.length} खर्च मद</div>
            </div>
          </div>

          {/* Grand Net Total Capital Banner */}
          <div className="p-3.5 rounded-xl border-2 border-slate-900 bg-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <div className="text-xs font-black uppercase text-slate-900 tracking-wider">
                🌟 कुल उपलब्ध शुद्ध पूँजी व नेट हिसाब (NET TOTAL AVAILABLE CAPITAL)
              </div>
              <div className="text-[10px] text-slate-600 font-semibold mt-0.5">
                सूत्र: पोर्टल ({formatINR(totalPortalsBalance)}) + बैंक/कैश ({formatINR(totalBankBalance)}) + उधार लेना है ({formatINR(totalLiyaAmount)}) - जमा देना है ({formatINR(totalJamaAmount)})
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-950">
              {formatINR(netTotalCapital)}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 1: ALL 10 MONEY TRANSFER PORTALS BREAKDOWN TABLE                  */}
          {/* ========================================================================= */}
          <div className="space-y-1.5 pt-1">
            <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                <span>1. सभी 10 मनी ट्रांसफर पोर्टल क्लोजिंग बैलेंस (All 10 Portals)</span>
              </span>
              <span className="font-mono">कुल: {formatINR(totalPortalsBalance)}</span>
            </div>

            <table className="w-full text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 text-[10px] uppercase font-bold text-left">
                  <th className="p-1.5">पोर्टल नाम (Portal)</th>
                  <th className="p-1.5 text-right">ओपनिंग (Opening)</th>
                  <th className="p-1.5 text-right text-emerald-800">(+IN)</th>
                  <th className="p-1.5 text-right text-rose-800">(-OUT)</th>
                  <th className="p-1.5 text-right">क्लोजिंग (Closing ₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {activePortals.map((p) => {
                  const closing = (Number(p.opening) || 0) + (Number(p.inAmount) || 0) - (Number(p.outAmount) || 0);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-1.5 font-bold text-slate-900">
                        {p.name}
                        {p.code && <span className="text-[10px] text-slate-500 font-normal ml-1">({p.code})</span>}
                      </td>
                      <td className="p-1.5 text-right font-mono text-slate-700">{formatINR(p.opening || 0)}</td>
                      <td className="p-1.5 text-right font-mono text-emerald-700">
                        {p.inAmount > 0 ? `+${formatINR(p.inAmount)}` : '-'}
                      </td>
                      <td className="p-1.5 text-right font-mono text-rose-700">
                        {p.outAmount > 0 ? `-${formatINR(p.outAmount)}` : '-'}
                      </td>
                      <td className="p-1.5 text-right font-mono font-black text-slate-950">{formatINR(closing)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-black border-t-2 border-slate-900">
                  <td colSpan={4} className="p-1.5 text-slate-900 uppercase text-[11px]">
                    कुल 10 पोर्टल बैलेंस (Total Portals Balance):
                  </td>
                  <td className="p-1.5 text-right font-mono font-black text-sm text-slate-950">
                    {formatINR(totalPortalsBalance)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: BANK ACCOUNTS & CASH IN HAND BREAKDOWN TABLE                   */}
          {/* ========================================================================= */}
          <div className="space-y-1.5 pt-1">
            <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" />
                <span>2. बैंक खाते व गल्ला कैश (Bank Accounts & Cash in Hand)</span>
              </span>
              <span className="font-mono">कुल: {formatINR(totalBankBalance)}</span>
            </div>

            <table className="w-full text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 text-[10px] uppercase font-bold text-left">
                  <th className="p-1.5">खाता नाम (Account / Cash)</th>
                  <th className="p-1.5">प्रकार (Type)</th>
                  <th className="p-1.5 text-right">ओपनिंग (Opening)</th>
                  <th className="p-1.5 text-right text-emerald-800">(+Deposits)</th>
                  <th className="p-1.5 text-right text-rose-800">(-Withdrawals)</th>
                  <th className="p-1.5 text-right">क्लोजिंग बैलेंस (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {activeBankAccounts.map((a) => {
                  const closing = (Number(a.opening) || 0) + (Number(a.deposits) || 0) - (Number(a.withdrawals) || 0);
                  return (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="p-1.5 font-bold text-slate-900">{a.name}</td>
                      <td className="p-1.5 text-[10px] font-semibold text-slate-600">{a.type || 'BANK'}</td>
                      <td className="p-1.5 text-right font-mono text-slate-700">{formatINR(a.opening || 0)}</td>
                      <td className="p-1.5 text-right font-mono text-emerald-700">
                        {a.deposits > 0 ? `+${formatINR(a.deposits)}` : '-'}
                      </td>
                      <td className="p-1.5 text-right font-mono text-rose-700">
                        {a.withdrawals > 0 ? `-${formatINR(a.withdrawals)}` : '-'}
                      </td>
                      <td className="p-1.5 text-right font-mono font-black text-slate-950">{formatINR(closing)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-black border-t-2 border-slate-900">
                  <td colSpan={5} className="p-1.5 text-slate-900 uppercase text-[11px]">
                    कुल बैंक व गल्ला कैश (Total Bank & Cash):
                  </td>
                  <td className="p-1.5 text-right font-mono font-black text-sm text-slate-950">
                    {formatINR(totalBankBalance)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3 & 4: CUSTOMER JAMA (DEPOSITS) & LIYA (UDHAR) SIDE BY SIDE       */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            
            {/* Section 3: Customer Jama Table */}
            <div className="space-y-1.5">
              <div className="bg-emerald-800 text-white px-3 py-1.5 rounded-lg flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>3. ग्राहक जमा (+ JAMA - मैंने लिए)</span>
                </span>
                <span className="font-mono">कुल: +{formatINR(totalJamaAmount)}</span>
              </div>

              {activeJamaList.length === 0 ? (
                <div className="p-3 border border-dashed border-slate-300 rounded-lg text-center text-xs text-slate-500">
                  आज कोई ग्राहक जमा एंट्री नहीं है।
                </div>
              ) : (
                <table className="w-full text-xs border border-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-emerald-50 border-b border-slate-300 text-emerald-900 text-[10px] uppercase font-bold text-left">
                      <th className="p-1.5">पार्टी नाम (Party)</th>
                      <th className="p-1.5">खाता / नोट</th>
                      <th className="p-1.5 text-right">रकम (+₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activeJamaList.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50">
                        <td className="p-1.5 font-bold text-slate-900">
                          {j.name}
                          {j.phone && <div className="text-[10px] text-slate-500 font-mono">{j.phone}</div>}
                        </td>
                        <td className="p-1.5 text-[10px] text-slate-600">
                          <div>{j.portalOrAccount || 'Cash in Hand'}</div>
                          {j.note && <div className="text-slate-400 truncate max-w-[120px]">{j.note}</div>}
                        </td>
                        <td className="p-1.5 text-right font-mono font-black text-emerald-800">
                          +{formatINR(j.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-emerald-100/80 font-black border-t border-emerald-400">
                      <td colSpan={2} className="p-1.5 text-emerald-900 text-[11px]">कुल जमा (Total Jama):</td>
                      <td className="p-1.5 text-right font-mono font-black text-emerald-900">
                        +{formatINR(totalJamaAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>

            {/* Section 4: Customer Liya / Udhar Table */}
            <div className="space-y-1.5">
              <div className="bg-rose-800 text-white px-3 py-1.5 rounded-lg flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>4. ग्राहक उधार / निकासी (- LIYA - मैंने दिए)</span>
                </span>
                <span className="font-mono">कुल: -{formatINR(totalLiyaAmount)}</span>
              </div>

              {activeLiyaList.length === 0 ? (
                <div className="p-3 border border-dashed border-slate-300 rounded-lg text-center text-xs text-slate-500">
                  आज कोई ग्राहक उधार/निकासी एंट्री नहीं है।
                </div>
              ) : (
                <table className="w-full text-xs border border-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-rose-50 border-b border-slate-300 text-rose-900 text-[10px] uppercase font-bold text-left">
                      <th className="p-1.5">पार्टी नाम (Party)</th>
                      <th className="p-1.5">खाता / नोट</th>
                      <th className="p-1.5 text-right">रकम (-₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activeLiyaList.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50">
                        <td className="p-1.5 font-bold text-slate-900">
                          {l.name}
                          {l.phone && <div className="text-[10px] text-slate-500 font-mono">{l.phone}</div>}
                        </td>
                        <td className="p-1.5 text-[10px] text-slate-600">
                          <div>{l.portalOrAccount || 'Cash in Hand'}</div>
                          {l.note && <div className="text-slate-400 truncate max-w-[120px]">{l.note}</div>}
                        </td>
                        <td className="p-1.5 text-right font-mono font-black text-rose-800">
                          -{formatINR(l.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-rose-100/80 font-black border-t border-rose-400">
                      <td colSpan={2} className="p-1.5 text-rose-900 text-[11px]">कुल उधार (Total Liya):</td>
                      <td className="p-1.5 text-right font-mono font-black text-rose-900">
                        -{formatINR(totalLiyaAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>

          </div>

          {/* ========================================================================= */}
          {/* SECTION 5 & 6: OTHER INCOME & DAILY SHOP EXPENSES SIDE BY SIDE            */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            
            {/* Section 5: Other Incomes Table */}
            <div className="space-y-1.5">
              <div className="bg-teal-800 text-white px-3 py-1.5 rounded-lg flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>5. अन्य सेवा कमाई व कमीशन (+ Other Incomes)</span>
                </span>
                <span className="font-mono">कुल: +{formatINR(totalIncomes)}</span>
              </div>

              {todaysIncomes.length === 0 ? (
                <div className="p-3 border border-dashed border-slate-300 rounded-lg text-center text-xs text-slate-500">
                  आज कोई अन्य सेवा कमाई दर्ज नहीं है।
                </div>
              ) : (
                <table className="w-full text-xs border border-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-teal-50 border-b border-slate-300 text-teal-900 text-[10px] uppercase font-bold text-left">
                      <th className="p-1.5">सेवा प्रकार (Service)</th>
                      <th className="p-1.5">ग्राहक / नोट</th>
                      <th className="p-1.5 text-right">कमाई (+₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {todaysIncomes.map((i) => (
                      <tr key={i.id} className="hover:bg-slate-50">
                        <td className="p-1.5 font-bold text-slate-900">
                          {i.serviceName || i.category || 'Service Income'}
                        </td>
                        <td className="p-1.5 text-[10px] text-slate-600">
                          {i.customerName || i.note || '-'}
                        </td>
                        <td className="p-1.5 text-right font-mono font-black text-teal-800">
                          +{formatINR(i.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-teal-100/80 font-black border-t border-teal-400">
                      <td colSpan={2} className="p-1.5 text-teal-900 text-[11px]">कुल कमाई (Total Incomes):</td>
                      <td className="p-1.5 text-right font-mono font-black text-teal-900">
                        +{formatINR(totalIncomes)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>

            {/* Section 6: Shop Expenses Table */}
            <div className="space-y-1.5">
              <div className="bg-amber-800 text-white px-3 py-1.5 rounded-lg flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5" />
                  <span>6. दुकान दैनिक खर्च (- Shop Expenses)</span>
                </span>
                <span className="font-mono">कुल: -{formatINR(totalExpenses)}</span>
              </div>

              {todaysExpenses.length === 0 ? (
                <div className="p-3 border border-dashed border-slate-300 rounded-lg text-center text-xs text-slate-500">
                  आज कोई दुकान खर्च दर्ज नहीं है।
                </div>
              ) : (
                <table className="w-full text-xs border border-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-amber-50 border-b border-slate-300 text-amber-900 text-[10px] uppercase font-bold text-left">
                      <th className="p-1.5">खर्च मद (Category)</th>
                      <th className="p-1.5">विवरण / नोट</th>
                      <th className="p-1.5 text-right">रकम (-₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {todaysExpenses.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50">
                        <td className="p-1.5 font-bold text-slate-900">
                          {e.category || 'Shop Expense'}
                        </td>
                        <td className="p-1.5 text-[10px] text-slate-600">
                          {e.note || e.description || '-'}
                        </td>
                        <td className="p-1.5 text-right font-mono font-black text-amber-900">
                          -{formatINR(e.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-amber-100/80 font-black border-t border-amber-400">
                      <td colSpan={2} className="p-1.5 text-amber-900 text-[11px]">कुल खर्च (Total Expenses):</td>
                      <td className="p-1.5 text-right font-mono font-black text-amber-900">
                        -{formatINR(totalExpenses)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>

          </div>

          {/* Daily Net Profit Summary */}
          <div className="p-3 rounded-xl border border-slate-400 bg-slate-50 flex justify-between items-center text-xs font-bold">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-slate-700" />
              <span>आज का शुद्ध मुनाफा (Net Profit = सेवा कमाई {formatINR(totalIncomes)} - दुकान खर्च {formatINR(totalExpenses)}):</span>
            </div>
            <div className="font-mono text-base font-black text-slate-950">
              {formatINR(netTodayProfit)}
            </div>
          </div>

          {/* Signatures & Verification Footer */}
          <div className="pt-8 flex justify-between text-xs text-slate-700 border-t-2 border-dashed border-slate-400">
            <div className="text-center">
              <div className="w-44 border-b border-slate-900 mb-1"></div>
              <div className="font-bold">ऑपरेटर / संचालक हस्ताक्षर</div>
              <div className="text-[10px] text-slate-500">(Operator Signature)</div>
            </div>

            <div className="text-center">
              <div className="w-44 border-b border-slate-900 mb-1"></div>
              <div className="font-bold">मैनेजर / दुकान मोहर</div>
              <div className="text-[10px] text-slate-500">(Manager & Shop Stamp)</div>
            </div>
          </div>

          {/* Bottom Certified Footer */}
          <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-slate-200 font-mono">
            जन सेवा केंद्र हिसाब डिजिटल पोर्टल • 4-Pillars Clean Print Statement Certified • {formatDate(selectedDate)}
          </div>
        </div>

      </div>
    </Modal>
  );
};
