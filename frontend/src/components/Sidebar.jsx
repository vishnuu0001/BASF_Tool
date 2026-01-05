import React from 'react';
import { LayoutDashboard, ShieldCheck, BarChart3, Users, HelpCircle } from 'lucide-react';

const Sidebar = ({ active, setActive }) => (
  <nav className="w-64 bg-slate-900 h-screen fixed flex flex-col p-6 shadow-2xl">
    <div className="flex items-center gap-3 mb-12 px-2">
      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white italic text-xl shadow-lg">W</div>
      <h2 className="font-black text-white italic uppercase tracking-tighter">BASF LMP</h2>
    </div>
    <div className="space-y-3 flex-1">
      {[
        { id: 'Dashboard', icon: LayoutDashboard },
        { id: 'Governance', icon: ShieldCheck },
        { id: 'Savings Tracker', icon: BarChart3 },
        { id: 'Change Management', icon: Users },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setActive(item.id)}
          className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all font-bold text-sm ${
            active === item.id ? 'bg-blue-600 text-white shadow-xl translate-x-1' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <item.icon size={20} /> {item.id}
        </button>
      ))}
    </div>
    <div className="border-t border-slate-800 pt-6">
      <button className="flex items-center gap-4 text-slate-500 font-bold text-sm hover:text-white transition-colors px-4">
        <HelpCircle size={20} /> Support
      </button>
    </div>
  </nav>
);

export default Sidebar;