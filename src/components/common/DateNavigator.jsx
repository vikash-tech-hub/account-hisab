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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-600/15 text-indigo-300 border border-indigo-500/20 shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {isToday ? 'Today' : isYesterday ? 'Yesterday' : 'Selected day'}
          </div>
          <div className="text-lg font-bold text-white">
            {formatDateFull(selectedDate)}
          </div>
        </div>
      </div>

      {/* Center & Right: Quick Date Switcher Buttons */}
      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
        
        {/* Previous Day Button */}
        <button
          onClick={() => shiftDateBy(-1)}
          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 whitespace-nowrap"
          title="Go to Previous Day"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="inline">Prev</span>
        </button>

        {/* Quick Date Chips */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setSelectedDate(todayStr)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              isToday
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Today ({formatDateChip(todayStr)})
          </button>
          <button
            onClick={() => setSelectedDate(yesterdayStr)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              isYesterday
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Yesterday ({formatDateChip(yesterdayStr)})
          </button>
          <button
            onClick={() => setSelectedDate(dayBeforeStr)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
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
          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 whitespace-nowrap"
          title="Go to Next Day"
        >
          <span className="inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* 1-Click Carry Forward Button */}
        <button
          onClick={carryForwardAllYesterday}
          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shrink-0 whitespace-nowrap"
          title="Copy yesterday's closing into today's opening"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Use yesterday's balance</span>
        </button>

        {/* Custom Calendar Date Input */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 shrink-0">
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
