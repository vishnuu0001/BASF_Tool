import React, { useState } from 'react';
import {
  LayoutDashboard, ShieldCheck, BarChart3, Users, ArrowLeft,
  CheckCircle2, Info, Heart, MoreHorizontal, MessageCircle, Radio, HelpCircle
} from 'lucide-react';

// --- HARDCODED DATA ---
const INITIAL_DATA = {
  portfolio: [
    {
      "segment": "Finance & GBS",
      "apps": [
        {
          "id": "A-101", "name": "Legacy Finance Reporting", "gross": 1.10,
          "dc": 5, "tf": 5, "dr": 4, "der": 5, "er": 4, "confidence": 92, "band": "High (Committable)", "weighted": 1.01,
          "strategy": "Elimination First",
          "findings": ["Redundant with Target Architecture 2030", "High manual data reconciliation", "License expires Q3 2026"]
        },
        {
          "id": "A-699", "name": "Shadow IT Collab Tool", "gross": 0.38,
          "dc": 5, "tf": 5, "dr": 5, "der": 4, "er": 5, "confidence": 96, "band": "High (Committable)", "weighted": 0.36,
          "strategy": "Elimination",
          "findings": ["Duplicate of standard MS Teams", "Security non-compliant", "High data leakage risk"]
        }
      ],
      "total_weighted": 1.37
    },
    {
      "segment": "Supply Chain & Logistics",
      "apps": [
        {
          "id": "A-214", "name": "Custom Procurement Flow", "gross": 0.95,
          "dc": 4, "tf": 4, "dr": 3, "der": 4, "er": 3, "confidence": 72, "band": "Medium (Conditional)", "weighted": 0.68,
          "strategy": "Migration",
          "findings": ["Move to BASF SAP Core", "Technical debt > 40%", "Process standardization required"]
        }
      ],
      "total_weighted": 0.68
    },
    {
      "segment": "R&D & Innovation",
      "apps": [
        {
          "id": "A-387", "name": "R&D Lab Data Tracker", "gross": 0.85,
          "dc": 3, "tf": 3, "dr": 2, "der": 3, "er": 2, "confidence": 52, "band": "Medium (Conditional)", "weighted": 0.44,
          "strategy": "Retain & Modernize",
          "findings": ["Niche functionality not in global ERP", "Low integration readiness", "User adoption key challenge"]
        }
      ],
      "total_weighted": 0.44
    },
    {
      "segment": "Operations & Manufacturing",
      "apps": [
        {
          "id": "A-512", "name": "Plant Maintenance App", "gross": 1.20,
          "dc": 4, "tf": 2, "dr": 2, "der": 3, "er": 2, "confidence": 52, "band": "Medium (Conditional)", "weighted": 0.62,
          "strategy": "Re-platform",
          "findings": ["Legacy OS dependency (Win7)", "Critical for shift handover", "High latency issues"]
        }
      ],
      "total_weighted": 0.62
    }
  ],
  governance: {
    raci: [
      {"task": "Scope Decision", "ddo": "X", "it": "Y", "board": "Y"},
      {"task": "Savings Approval", "ddo": "X", "it": "Y", "board": "X"},
      {"task": "Data Quality Sign-off", "ddo": "Y", "it": "X", "board": "Y"},
      {"task": "Phase-Gate Readiness", "ddo": "Y", "it": "Y", "board": "X"}
    ],
    gates: [
      "Minimum data completeness threshold met",
      "Cost allocation logic agreed",
      "Stakeholder alignment workshops completed",
      "Target Architecture 2030 alignment baseline established"
    ]
  },
  change_management: {
    comms_plan: [
      {"week": "W1", "title": "Mobilization", "desc": "Kickoff & Success Criteria"},
      {"week": "W2", "title": "Standards", "desc": "Arch Alignment & Guardrails"},
      {"week": "W3", "title": "Readiness", "desc": "Segment Onboarding"},
      {"week": "W4", "title": "Go-Live", "desc": "Sprint 0 & Dashboard Validation"}
    ],
    stakeholders: [
      {"name": "Board of Directors", "impact": "High", "focus": "Strategic Oversight", "strategy": "Executive readouts & portfolio steering"},
      {"name": "DDO & Architecture", "impact": "Critical", "focus": "Future Readiness", "strategy": "Architecture alignment workshops"},
      {"name": "Information Managers", "impact": "Critical", "focus": "Data Integrity", "strategy": "Process stewardship & validation"},
      {"name": "App Owners", "impact": "Medium", "focus": "Operational Continuity", "strategy": "Weekly sprint reviews & QA"}
    ],
    channels: [
      {"channel": "Town Halls", "freq": "Monthly", "audience": "All Hands"},
      {"channel": "SteerCo Review", "freq": "Bi-Weekly", "audience": "Leadership"},
      {"channel": "Sprint Demos", "freq": "Weekly", "audience": "Product Teams"}
    ]
  }
};

// --- VISUAL UTILS ---
const RaciBadge = ({ type }) => {
  const styles = {
    X: "bg-[#004A96] text-white border-[#004A96] font-bold",
    Y: "bg-emerald-100 text-emerald-700 border-emerald-200 font-bold",
    "?": "bg-gray-100 text-gray-400 border-gray-200"
  };
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border ${styles[type || "?"]} mx-auto shadow-sm transition-all`}>
      {type || "?"}
    </div>
  );
};

// --- SIDEBAR ---
const Sidebar = ({ active, setActive, resetView }) => (
  <nav className="w-64 bg-[#004A96] h-screen fixed flex flex-col p-6 shadow-2xl z-50 text-white">
    <div className="flex items-center gap-3 mb-12 px-2 cursor-pointer" onClick={() => { setActive('Dashboard'); resetView(); }}>
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-[#004A96] italic text-xl shadow-lg">B</div>
      <div>
        <h2 className="font-extrabold italic uppercase tracking-tight text-lg">BASF LMP</h2>
        <p className="text-[10px] text-[#21A0D2] font-bold tracking-widest uppercase">WP1 Foundation</p>
      </div>
    </div>
    <div className="space-y-2 flex-1">
      {[
        { id: 'Dashboard', icon: LayoutDashboard },
        { id: 'Governance', icon: ShieldCheck },
        { id: 'Savings Tracker', icon: BarChart3 },
        { id: 'Change Management', icon: Users },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => { setActive(item.id); resetView(); }}
          className={`flex items-center gap-4 w-full p-4 rounded-xl transition-all font-bold text-xs uppercase tracking-wide ${
            active === item.id ? 'bg-white text-[#004A96] shadow-lg translate-x-1' : 'text-blue-200 hover:bg-[#005bb5] hover:text-white'
          }`}
        >
          <item.icon size={18} /> {item.id}
        </button>
      ))}
    </div>
  </nav>
);

// --- COMPONENT: GOVERNANCE ---
const GovernanceView = ({ data }) => (
  <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
    <header>
      <h1 className="text-3xl font-extrabold text-slate-800 uppercase italic tracking-tight">Governance & RACI</h1>
      <p className="text-[#004A96] mt-2 font-bold text-sm uppercase tracking-wider">Accelerating Decisions</p>
    </header>
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-xs font-bold uppercase mb-6 tracking-widest text-slate-400">Decision Rights Matrix</h3>
      <table className="w-full text-left">
        <thead className="bg-[#F0F5FA] text-[10px] uppercase text-slate-500 font-bold tracking-wider">
          <tr>
            <th className="p-4 rounded-l-lg">Activity</th>
            <th className="p-4 text-center">DDO</th>
            <th className="p-4 text-center">IT Owner</th>
            <th className="p-4 text-center rounded-r-lg">Steering Board</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {data?.raci.map((r, i) => (
            <tr key={i} className="hover:bg-[#F0F5FA] transition-colors">
              <td className="p-4 font-bold text-slate-700">{r.task}</td>
              <td className="p-4 text-center"><RaciBadge type={r.ddo} /></td>
              <td className="p-4 text-center"><RaciBadge type={r.it} /></td>
              <td className="p-4 text-center"><RaciBadge type={r.board} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- COMPONENT: CHANGE MANAGEMENT ---
const ChangeMgmtView = ({ data }) => (
  <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
    <header>
      <h1 className="text-3xl font-extrabold text-slate-800 uppercase italic tracking-tight">Change Mgmt Strategy</h1>
      <p className="text-[#004A96] mt-2 font-bold text-sm uppercase tracking-wider">Mobilization & Alignment</p>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {data?.comms_plan.map((item, index) => (
        <div key={index} className="flex flex-col items-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="w-16 h-16 rounded-full bg-[#F0F5FA] border-4 border-[#004A96] flex items-center justify-center font-bold text-[#004A96] text-xl mb-4 shadow-inner">
            {item.week}
          </div>
          <p className="text-sm font-bold text-slate-800 uppercase mb-2 text-center">{item.title}</p>
          <p className="text-[10px] font-medium text-slate-500 leading-snug text-center">{item.desc}</p>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase mb-6 tracking-widest text-slate-400">Stakeholder Impact Map</h3>
            <div className="space-y-4">
                {data?.stakeholders.map((s, i) => (
                <div key={i} className="p-5 bg-[#F0F5FA] rounded-xl border border-slate-100 flex justify-between items-start hover:bg-slate-100 transition-colors">
                    <div>
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-[#004A96]" />
                            <p className="font-bold text-slate-900 text-sm">{s.name}</p>
                        </div>
                        <p className="text-[10px] font-bold text-[#004A96] mt-1 uppercase tracking-wide pl-6">{s.focus}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                         {s.impact === 'Critical' || s.impact === 'High' ? <Heart size={20} className="text-[#E00034] fill-[#E00034]" /> : <Heart size={20} className="text-slate-300" />}
                        <span className={`text-[9px] font-bold uppercase ${s.impact === 'Critical' ? 'text-[#E00034]' : 'text-slate-400'}`}>{s.impact}</span>
                    </div>
                </div>
                ))}
            </div>
        </div>
        <div className="bg-[#004A96] p-8 rounded-2xl text-white shadow-lg">
            <h3 className="text-xs font-bold text-[#21A0D2] uppercase mb-6 tracking-widest">Channels & Frequency</h3>
            <div className="space-y-6">
                {data?.channels.map((c, i) => (
                    <div key={i} className="flex items-center gap-4 border-b border-white/10 pb-4 last:border-0">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            {c.freq === 'Weekly' ? <MessageCircle size={18} /> : <Radio size={18} />}
                        </div>
                        <div>
                            <p className="font-bold text-sm">{c.channel}</p>
                            <p className="text-[10px] text-blue-200 uppercase tracking-wide">{c.freq} • {c.audience}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  </div>
);

// --- COMPONENT: SAVINGS TRACKER (UPDATED WITH DEFINITIONS) ---
const SavingsTracker = ({ portfolio, navigateToApp }) => {
  const [activeBand, setActiveBand] = useState(null);

  const allApps = portfolio.flatMap(s => s.apps.map(a => ({...a, segment: s.segment})));
  const totals = allApps.reduce((acc, app) => {
    const bandKey = app.band.includes('High') ? 'High' : app.band.includes('Medium') ? 'Medium' : 'Low';
    acc[bandKey] += app.weighted;
    acc.Total += app.weighted;
    return acc;
  }, { High: 0, Medium: 0, Low: 0, Total: 0 });

  const filteredApps = activeBand ? allApps.filter(a => a.band.includes(activeBand)) : [];

  return (
    <div className="space-y-10 animate-[slideIn_0.5s_ease-out]">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-800 uppercase italic tracking-tight">Savings Simulation</h1>
        <p className="text-[#004A96] mt-2 font-bold text-sm uppercase tracking-wider">Confidence-Weighted Realization</p>
      </header>

      {/* Main Stats Card */}
      <div className="bg-gradient-to-r from-[#004A96] to-[#005bb5] p-10 rounded-2xl shadow-xl text-white relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-end">
          <div>
            <p className="text-xs font-bold opacity-70 uppercase tracking-widest">Gross Potential</p>
            <p className="text-7xl font-extrabold italic mt-4 tracking-tighter">€{totals.Total.toFixed(2)}M</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold opacity-70 uppercase tracking-widest">Target Threshold</p>
            <p className="text-4xl font-bold mt-2">€60.00M</p>
          </div>
        </div>
        <div className="mt-8 h-3 bg-black/20 rounded-full w-full overflow-hidden">
          <div className="h-full bg-[#21A0D2] transition-all duration-1000" style={{ width: `${(totals.Total/60)*100}%` }}></div>
        </div>
      </div>

      {/* NEW SECTION: Definition & BASF Usage Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
         <div className="flex items-center gap-2 mb-4">
            <HelpCircle size={16} className="text-[#004A96]" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Confidence Definitions & Strategic Usage</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
               <p className="font-bold text-emerald-800 mb-1">High (Committable)</p>
               <p className="text-xs text-emerald-700 mb-2 font-medium">Definition: >75% Confidence</p>
               <p className="text-[10px] text-emerald-600 leading-relaxed uppercase tracking-wide">
                  <strong>Usage:</strong> Included in hard budget targets. Execution ready immediately.
               </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
               <p className="font-bold text-amber-800 mb-1">Medium (Conditional)</p>
               <p className="text-xs text-amber-700 mb-2 font-medium">Definition: 50% - 75% Confidence</p>
               <p className="text-[10px] text-amber-600 leading-relaxed uppercase tracking-wide">
                  <strong>Usage:</strong> Included in forecast (risk-adjusted). Requires pre-requisites.
               </p>
            </div>
            <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
               <p className="font-bold text-rose-800 mb-1">Low (Aspirational)</p>
               <p className="text-xs text-rose-700 mb-2 font-medium">Definition: &lt;50% Confidence</p>
               <p className="text-[10px] text-rose-600 leading-relaxed uppercase tracking-wide">
                  <strong>Usage:</strong> Excluded from budget. Backlog items for future ideation.
               </p>
            </div>
         </div>
      </div>

      {/* Interactive Bands */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'High', val: totals.High, color: 'bg-emerald-500', key: 'High' },
          { label: 'Medium', val: totals.Medium, color: 'bg-amber-500', key: 'Medium' },
          { label: 'Low', val: totals.Low, color: 'bg-rose-500', key: 'Low' }
        ].map(band => (
          <div key={band.key} onClick={() => setActiveBand(activeBand === band.key ? null : band.key)} className={`bg-white p-6 rounded-2xl border ${activeBand === band.key ? 'border-[#004A96]' : 'border-slate-200'} shadow-sm cursor-pointer hover:shadow-md transition-all`}>
             <div className={`w-2 h-8 rounded-full ${band.color} mb-4`}></div>
             <p className="text-[10px] uppercase font-bold text-slate-400">{band.label}</p>
             <p className="text-2xl font-extrabold text-slate-800">€{band.val.toFixed(2)}M</p>
          </div>
        ))}
      </div>

      {/* Drill Down Table */}
      {activeBand && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden animate-[fadeIn_0.3s]">
           <div className="bg-[#F0F5FA] px-6 py-4 flex justify-between items-center border-b border-slate-200">
              <h3 className="font-bold text-[#004A96] uppercase text-xs tracking-widest">Drill-down: {activeBand} Confidence Apps</h3>
              <button onClick={() => setActiveBand(null)} className="text-xs font-bold text-slate-400 hover:text-slate-700">CLOSE</button>
           </div>
           <table className="w-full text-left">
             <thead className="bg-white text-[10px] uppercase text-slate-400 font-bold border-b border-slate-100">
               <tr><th className="p-4">App</th><th className="p-4">Segment</th><th className="p-4 text-right">Weighted</th></tr>
             </thead>
             <tbody className="divide-y divide-slate-100 text-sm">
               {filteredApps.map(app => (
                 <tr key={app.id} onClick={() => navigateToApp(app)} className="hover:bg-[#F0F5FA] cursor-pointer">
                   <td className="p-4 font-bold">{app.name}</td>
                   <td className="p-4 text-xs uppercase text-slate-500">{app.segment}</td>
                   <td className="p-4 text-right font-black">€{app.weighted}M</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [view, setView] = useState({ level: 'L1', segment: null, app: null });
  const [data] = useState(INITIAL_DATA);

  const navigateToApp = (app) => {
     const segment = data.portfolio.find(s => s.apps.some(a => a.id === app.id));
     setView({ level: 'L3', app, segment });
     setActiveTab('Dashboard');
  };

  return (
    <div className="flex bg-[#F0F5FA] min-h-screen font-sans text-slate-900 selection:bg-blue-100">
      <Sidebar active={activeTab} setActive={setActiveTab} resetView={() => setView({ level: 'L1', segment: null, app: null })} />
      <main className="ml-64 flex-1 p-10 transition-all max-w-7xl mx-auto">
        {activeTab === 'Governance' && <GovernanceView data={data.governance} />}
        {activeTab === 'Change Management' && <ChangeMgmtView data={data.change_management} />}
        {activeTab === 'Savings Tracker' && <SavingsTracker portfolio={data.portfolio} navigateToApp={navigateToApp} />}

        {activeTab === 'Dashboard' && (
          <>
            {/* L1 VIEW */}
            {view.level === 'L1' && (
              <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
                <header>
                  <h1 className="text-3xl font-extrabold text-slate-800 uppercase italic tracking-tight">Portfolio Feed</h1>
                  <p className="text-[#004A96] mt-2 font-bold text-sm uppercase tracking-wider">WP1 Assessment Updates</p>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {data.portfolio.map(seg => (
                    <div key={seg.segment} onClick={() => setView({level: 'L2', segment: seg})} className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-[#004A96] cursor-pointer shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-[#F0F5FA] flex items-center justify-center">
                               <LayoutDashboard size={18} className="text-[#004A96]"/>
                           </div>
                           <p className="text-sm font-bold text-slate-900">{seg.segment}</p>
                        </div>
                        <MoreHorizontal size={20} className="text-slate-300" />
                      </div>
                      <p className="text-4xl font-extrabold text-slate-900 italic mb-2 tracking-tighter">€{seg.total_weighted}M</p>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#004A96]">Confidence-Weighted</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* L2 VIEW */}
            {view.level === 'L2' && (
               <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
                 <button onClick={() => setView({level: 'L1'})} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase hover:text-[#004A96] transition-colors"><ArrowLeft size={16}/> Back to Feed</button>
                 <h2 className="text-2xl font-extrabold uppercase italic tracking-tighter text-slate-900">{view.segment.segment}</h2>
                 <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-[#F0F5FA] text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                        <tr><th className="p-6">Application</th><th className="p-6">Confidence Band</th><th className="p-6 text-right">Weighted View</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {view.segment.apps.map(app => (
                          <tr key={app.id} onClick={() => setView({...view, level: 'L3', app})} className="hover:bg-[#F0F5FA] cursor-pointer transition-colors group">
                            <td className="p-6 font-bold text-slate-800 group-hover:text-[#004A96] transition-colors">{app.name}</td>
                            <td className="p-6"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${app.band.includes('High') ? 'bg-emerald-100 text-emerald-700' : app.band.includes('Medium') ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{app.band}</span></td>
                            <td className="p-6 font-bold text-right text-lg text-slate-800">€{app.weighted}M</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
               </div>
            )}

            {/* L3 VIEW */}
            {view.level === 'L3' && (
              <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
                <button onClick={() => setView({ ...view, level: 'L2' })} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase hover:text-[#004A96] transition-colors"><ArrowLeft size={16}/> Back to {view.segment.segment}</button>
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                  <div className="bg-[#0b162a] p-10 flex justify-between items-center">
                     <div>
                        <div className="bg-[#004A96] text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit mb-2">Strategy: {view.app.strategy}</div>
                        <h1 className="text-3xl font-extrabold text-white uppercase italic tracking-tighter">{view.app.name}</h1>
                        <p className="text-slate-400 text-xs uppercase tracking-widest mt-2">App ID: {view.app.id}</p>
                     </div>
                     <div className="bg-[#004A96] text-white px-8 py-6 rounded-xl text-center shadow-lg">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Confidence</p>
                        <p className="text-5xl font-extrabold italic">{view.app.confidence}%</p>
                     </div>
                  </div>
                  <div className="p-10 space-y-6">
                      <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4 text-[#004A96]"><Info size={16}/> Findings</h3>
                      <div className="grid gap-3">
                        {view.app.findings.map((f, i) => (
                          <div key={i} className="p-4 bg-[#F0F5FA] rounded-xl border border-slate-100 text-sm font-medium text-slate-700 flex gap-3"><CheckCircle2 size={18} className="text-[#004A96] shrink-0" /> {f}</div>
                        ))}
                      </div>

                      <div className="mt-8 pt-8 border-t border-slate-100">
                          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Detailed Scoring</h3>
                          <div className="grid grid-cols-5 gap-4 text-center">
                              {['DC', 'TF', 'DR', 'DeR', 'ER'].map(k => (
                                <div key={k} className="space-y-2">
                                  <div className="h-24 bg-slate-100 rounded-full w-4 mx-auto relative overflow-hidden">
                                      <div className={`absolute bottom-0 w-full rounded-full ${view.app[k.toLowerCase()] >= 4 ? 'bg-[#004A96]' : view.app[k.toLowerCase()] >= 3 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{height: `${(view.app[k.toLowerCase()]/5)*100}%`}}></div>
                                  </div>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase">{k}</p>
                                  <p className="font-extrabold text-slate-800">{view.app[k.toLowerCase()]}</p>
                                </div>
                              ))}
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;