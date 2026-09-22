import React from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatDate, formatDateFull, formatDateChip, getTodayDateString, getOffsetDateString } from '../../utils/formatters';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  History,
  Sparkles
} from 'lucide-react';

export const DateNavigator = () => {
  const {
    selectedDate,
    setSelectedDate,
    shiftDateBy,
    availableHistoryDates,
    activeBranch,
    carryForwardAllYesterday
  } = useHisab();

  const todayStr = getTodayDateString();
  const yesterdayStr = getOffsetDateString(-1);
  const dayBeforeStr = getOffsetDateString(-2);

  const isToday = selectedDate === todayStr;
  const isYesterday = selectedDate === yesterdayStr;
  const isDayBefore = selectedDate === dayBeforeStr;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      
      {/* Left: Active Date & Status */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Viewing Daily Hisab For:
            </span>
            {isToday ? (
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Today (आज)
              </span>
            ) : isYesterday ? (
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                Yesterday (पिछला दिन)
              </span>
            ) : (
              <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-500/30">
                Past Record (पिछला इतिहास)
              </span>
            )}
          </div>
          <div className="text-lg font-black text-white mt-0.5">
            {formatDate(selectedDate)} <span className="text-xs font-normal text-slate-400">({formatDateFull(selectedDate)})</span>
          </div>
        </div>
      </div>

      {/* Center & Right: Quick Date Switcher Buttons */}
      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
        
        {/* Previous Day Button */}
        <button
          onClick={() => shiftDateBy(-1)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
          title="Go to Previous Day"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev Day</span>
        </button>

        {/* Quick Date Chips */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedDate(todayStr)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isToday
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Today ({formatDateChip(todayStr)})
          </button>
          <button
            onClick={() => setSelectedDate(yesterdayStr)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isYesterday
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Yesterday ({formatDateChip(yesterdayStr)})
          </button>
          <button
            onClick={() => setSelectedDate(dayBeforeStr)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isDayBefore
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {formatDateChip(dayBeforeStr)}
          </button>
        </div>

        {/* Next Day Button */}
        <button
          onClick={() => shiftDateBy(1)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
          title="Go to Next Day"
        >
          <span className="hidden sm:inline">Next Day</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* 1-Click Carry Forward Button */}
        <button
          onClick={carryForwardAllYesterday}
          className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          title="कल का क्लोजिंग बैलेंस आज के ओपनिंग में लोड करें"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>⚡ कल का बैलेंस लाएं</span>
        </button>

        {/* Custom Calendar Date Input */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 ml-auto sm:ml-0">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-white text-xs font-mono font-medium focus:outline-none cursor-pointer"
          />
        </div>

      </div>

    </div>
  );
};
