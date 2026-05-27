import { useState, useRef, useEffect, useCallback } from "react"

// ─── BRAND ───────────────────────────────────────────────────────────────────
const C = {
  ink:"#111210", bg:"#F5F3EE", surface:"#FFFFFF", surfaceAlt:"#EDEAE3",
  muted:"#7A7870", hairline:"#E0DDD5",
  accent:"#0D4A2F", accentMid:"#166534", accentLight:"#DCFCE7", accentText:"#14532D",
  success:"#15803D", successLight:"#F0FDF4",
  danger:"#DC2626",  dangerLight:"#FFF1F1",
  warning:"#B45309", warningLight:"#FFFBEB",
  gold:"#D97706", purple:"#6D28D9", purpleLight:"#EDE9FE",
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  html,body,#root{height:100%}
  body{font-family:'DM Sans',sans-serif;background:${C.bg};color:${C.ink};-webkit-font-smoothing:antialiased}
  button{font-family:inherit;cursor:pointer;border:none;background:none}
  input,select,textarea{font-family:inherit}
  ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:${C.hairline};border-radius:4px}
  .serif{font-family:'Fraunces',Georgia,serif}

  .bp{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:8px;font-size:14px;font-weight:500;background:${C.accent};color:#fff;transition:all 140ms ease;border:none;cursor:pointer}
  .bp:hover{background:${C.accentMid};transform:translateY(-1px);box-shadow:0 4px 14px rgba(13,74,47,0.25)}
  .bp:active{transform:none;box-shadow:none}
  .bp:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}

  .bg{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:500;border:1px solid ${C.hairline};color:${C.ink};background:${C.surface};transition:all 120ms ease;cursor:pointer}
  .bg:hover{background:${C.surfaceAlt};border-color:#c0bcb4}
  .bg:active{transform:scale(.98)}

  .bss{background:${C.successLight};color:${C.success};border:1px solid #86efac;padding:6px 12px;border-radius:7px;font-size:12px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:5px}
  .bss:hover{background:#dcfce7}
  .bds{background:${C.dangerLight};color:${C.danger};border:1px solid #fca5a5;padding:6px 12px;border-radius:7px;font-size:12px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:5px}
  .bds:hover{background:#fee2e2}

  .card{background:${C.surface};border:1px solid ${C.hairline};border-radius:12px}
  .ch{transition:box-shadow 180ms,transform 180ms}
  .ch:hover{box-shadow:0 4px 20px rgba(0,0,0,.07);transform:translateY(-2px)}

  .pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600}
  .pg{background:${C.accentLight};color:${C.accentText}}
  .pb{background:#DBEAFE;color:#1E40AF}
  .pr{background:${C.dangerLight};color:${C.danger}}
  .pa{background:${C.warningLight};color:${C.warning}}
  .pm{background:${C.surfaceAlt};color:${C.muted}}
  .pp{background:${C.purpleLight};color:${C.purple}}

  .sidebar{width:236px;min-width:236px;height:100vh;position:sticky;top:0;background:${C.ink};display:flex;flex-direction:column;overflow-y:auto;flex-shrink:0}
  .ni{display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:8px;font-size:13.5px;color:rgba(255,255,255,.5);cursor:pointer;transition:all 120ms;margin:1px 10px}
  .ni:hover{background:rgba(255,255,255,.08);color:rgba(255,255,255,.9)}
  .ni.on{background:${C.accent};color:#fff;font-weight:500}

  .inp{width:100%;padding:9px 13px;border:1px solid ${C.hairline};border-radius:8px;font-size:14px;background:${C.surface};color:${C.ink};outline:none;transition:border-color 120ms,box-shadow 120ms}
  .inp:focus{border-color:${C.accent};box-shadow:0 0 0 3px rgba(13,74,47,.1)}
  .inp::placeholder{color:${C.muted}}
  textarea.inp{resize:vertical}

  .topbar{height:58px;border-bottom:1px solid ${C.hairline};background:${C.surface};display:flex;align-items:center;padding:0 28px;gap:16px;position:sticky;top:0;z-index:20;flex-shrink:0}
  .layout{display:flex;height:100vh;overflow:hidden}
  .main{flex:1;overflow-y:auto;background:${C.bg}}

  .fi{animation:fi 280ms ease} @keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  .spin{animation:sp .7s linear infinite} @keyframes sp{to{transform:rotate(360deg)}}
  .skel{background:linear-gradient(90deg,${C.surfaceAlt} 25%,${C.hairline} 50%,${C.surfaceAlt} 75%);background-size:200% 100%;animation:sk 1.4s infinite;border-radius:8px} @keyframes sk{0%{background-position:200% 0}100%{background-position:-200% 0}}

  /* ── MESSAGES ─────────────────────────────────────────────────────────── */
  .msg-layout{display:flex;height:100vh;overflow:hidden}
  .contacts{width:280px;min-width:280px;border-right:1px solid ${C.hairline};display:flex;flex-direction:column;background:${C.surface};flex-shrink:0}
  .contact-row{display:flex;gap:12px;align-items:center;padding:14px 16px;cursor:pointer;border-left:3px solid transparent;transition:background 100ms}
  .contact-row:hover{background:${C.surfaceAlt}}
  .contact-row.sel{background:${C.accentLight};border-left-color:${C.accent}}
  .chat-area{flex:1;display:flex;flex-direction:column;overflow:hidden}
  .chat-header{padding:12px 20px;border-bottom:1px solid ${C.hairline};display:flex;align-items:center;gap:12px;background:${C.surface};flex-shrink:0}
  .chat-messages{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:12px;background:${C.bg}}
  .chat-input{padding:12px 16px;border-top:1px solid ${C.hairline};display:flex;gap:10px;background:${C.surface};flex-shrink:0;align-items:center}
  .bubble-me{background:${C.accent};color:#fff;border-radius:18px 18px 4px 18px;padding:10px 14px;max-width:65%;font-size:14px;line-height:1.55;word-break:break-word}
  .bubble-them{background:${C.surface};border:1px solid ${C.hairline};color:${C.ink};border-radius:18px 18px 18px 4px;padding:10px 14px;max-width:65%;font-size:14px;line-height:1.55;word-break:break-word}
  .typing{display:flex;gap:4px;align-items:center;padding:10px 14px}
  .dot{width:7px;height:7px;border-radius:50%;background:${C.muted};animation:bounce .9s infinite}
  .dot:nth-child(2){animation-delay:.15s} .dot:nth-child(3){animation-delay:.3s}
  @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
  .unread-badge{background:${C.danger};color:#fff;border-radius:99px;font-size:10px;font-weight:700;padding:1px 6px;min-width:18px;text-align:center}

  /* ── MODAL ──────────────────────────────────────────────────────────────── */
  .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:200;display:flex;align-items:center;justify-content:center}
  .modal{background:${C.surface};border-radius:16px;padding:28px;width:480px;max-width:calc(100vw - 32px);max-height:90vh;overflow-y:auto;animation:fi 180ms ease}

  .tab-pill{padding:7px 16px;font-size:13px;font-weight:500;border-radius:8px;color:${C.muted};cursor:pointer;transition:all 120ms;background:none;border:none}
  .tab-pill.on{background:${C.surface};color:${C.ink};box-shadow:0 1px 4px rgba(0,0,0,.1)}
  .star-btn{background:none;border:none;cursor:pointer;padding:2px;transition:transform 100ms} .star-btn:hover{transform:scale(1.2)}
  .toast{position:fixed;bottom:24px;right:24px;background:${C.ink};color:#fff;padding:12px 20px;border-radius:10px;font-size:14px;z-index:300;animation:fi 200ms ease}
`

// ─── API ─────────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:5000/api"
const api = {
  get:    async (p,t)    => { const r=await fetch(`${API_BASE}${p}`,{headers:t?{Authorization:`Bearer ${t}`}:{}}); if(!r.ok)throw new Error(r.status); return r.json() },
  post:   async (p,b,t)  => { const r=await fetch(`${API_BASE}${p}`,{method:"POST",headers:{"Content-Type":"application/json",...(t?{Authorization:`Bearer ${t}`}:{})},body:JSON.stringify(b)}); if(!r.ok)throw new Error(r.status); return r.json() },
  put:    async (p,b,t)  => { const r=await fetch(`${API_BASE}${p}`,{method:"PUT",headers:{"Content-Type":"application/json",...(t?{Authorization:`Bearer ${t}`}:{})},body:JSON.stringify(b)}); if(!r.ok)throw new Error(r.status); return r.json() },
  delete: async (p,t)    => { const r=await fetch(`${API_BASE}${p}`,{method:"DELETE",headers:t?{Authorization:`Bearer ${t}`}:{}}); if(!r.ok)throw new Error(r.status); return r.json() },
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const TUTORS = [
  {id:1,name:"Arjun Sharma",   subject:"IIT-JEE Physics",   rating:4.9,reviews:142,price:1200,mode:"Online", city:"Delhi",    bio:"IITian, AIR 312. Six years of JEE coaching. Students average 85+ percentile in boards.",  verified:true, exp:6,  students:340, badge:"Top Tutor",  col:"#1a6b3c"},
  {id:2,name:"Priya Menon",    subject:"NEET Biology",       rating:4.8,reviews:98, price:900, mode:"Hybrid", city:"Bangalore",bio:"MBBS from AIIMS Delhi. Making Biology simple for NEET aspirants since 2019.",            verified:true, exp:5,  students:210, badge:"NEET Expert",col:"#5b21b6"},
  {id:3,name:"Rahul Gupta",    subject:"Mathematics",        rating:4.7,reviews:217,price:700, mode:"Online", city:"Mumbai",   bio:"M.Sc Mathematics, IISc. Class 6–12, IIT-JEE Maths and Olympiad specialist.",             verified:true, exp:8,  students:580, badge:"",           col:"#0369a1"},
  {id:4,name:"Sneha Iyer",     subject:"Chemistry",          rating:4.9,reviews:76, price:1100,mode:"Online", city:"Chennai",  bio:"Gold medallist, BSc Chemistry. JEE & NEET Chemistry with exhaustive practice.",          verified:true, exp:4,  students:185, badge:"Rising Star",col:"#b45309"},
  {id:5,name:"Vikram Singh",   subject:"UPSC History",       rating:4.6,reviews:54, price:1500,mode:"Offline",city:"Hyderabad",bio:"Former IAS officer, 2015 batch. GS Paper 1 with map work and answer-writing sessions.", verified:false,exp:10, students:95,  badge:"",           col:"#be185d"},
  {id:6,name:"Anita Bose",     subject:"English & Grammar",  rating:4.8,reviews:163,price:600, mode:"Online", city:"Kolkata",  bio:"MA English Lit, Jadavpur. IELTS, TOEFL and board exam coaching for all ages.",          verified:true, exp:7,  students:420, badge:"",           col:"#0891b2"},
  {id:7,name:"Karan Kapoor",   subject:"Coding & Python",    rating:4.9,reviews:88, price:1300,mode:"Online", city:"Pune",     bio:"SWE at Google. Python, DSA and web development from beginner to advanced.",             verified:true, exp:3,  students:150, badge:"Top Tutor",  col:"#7c3aed"},
  {id:8,name:"Deepika Rao",    subject:"Accounts & Commerce",rating:4.7,reviews:112,price:800, mode:"Hybrid", city:"Hyderabad",bio:"CA Final cleared. Class 11–12 Accounts, Business Studies and CA Foundation specialist.",verified:true, exp:6,  students:260, badge:"",           col:"#c2410c"},
]
const MOCK_STATS          = {tutors:5000,students:50000,avgRating:4.9,cities:500}
const MOCK_FEAT_REVIEWS   = [
  {id:1,author:"Priya Sharma", detail:"Class 12, Delhi",   rating:5,text:"Went from 72 to 94 in boards. My Physics tutor knew exactly where I was getting stuck."},
  {id:2,author:"Rahul Verma",  detail:"NEET 2024",          rating:5,text:"Found my NEET Biology tutor in 10 minutes. Honest feedback every week. Cleared with AIR 847."},
  {id:3,author:"Anita Menon",  detail:"Parent, Bangalore",  rating:5,text:"My son's confidence in Maths completely changed after just two months with his tutor here."},
]
const MOCK_BK_STU = [
  {id:1,tutorId:1,tutorName:"Arjun Sharma", subject:"IIT-JEE Physics",date:"2025-05-28",time:"6:00 PM",status:"confirmed", price:1200,reviewed:false},
  {id:2,tutorId:4,tutorName:"Sneha Iyer",   subject:"Chemistry",      date:"2025-05-30",time:"5:00 PM",status:"pending",   price:1100,reviewed:false},
  {id:3,tutorId:3,tutorName:"Rahul Gupta",  subject:"Mathematics",    date:"2025-04-20",time:"7:00 PM",status:"completed", price:700, reviewed:false},
  {id:4,tutorId:2,tutorName:"Priya Menon",  subject:"NEET Biology",   date:"2025-04-10",time:"4:00 PM",status:"completed", price:900, reviewed:true},
]
const MOCK_BK_TUT = [
  {id:1,studentName:"Rohan Malhotra", date:"2025-05-28",time:"6:00 PM",status:"confirmed",price:1200},
  {id:2,studentName:"Anjali Verma",   date:"2025-05-30",time:"5:00 PM",status:"pending",  price:1200},
  {id:3,studentName:"Siddharth Nair", date:"2025-04-20",time:"7:00 PM",status:"completed",price:1200},
]

// Seed conversations — one thread per tutor contact
// In production: GET /api/messages/threads?userId=X returns all threads
const SEED_THREADS = {
  1: [
    {id:1,from:"tutor",  text:"Hello! Which JEE Physics chapters are you finding tough?",          ts:new Date(Date.now()-3600000)},
    {id:2,from:"student",text:"Electrostatics and Optics are my weak areas.",                      ts:new Date(Date.now()-3500000)},
    {id:3,from:"tutor",  text:"Perfect. Let's start with Coulomb's Law next session. I'll send a prep sheet beforehand.", ts:new Date(Date.now()-3400000)},
  ],
  2: [
    {id:1,from:"tutor",  text:"Hi! Ready to tackle NEET Biology together.",                        ts:new Date(Date.now()-7200000)},
    {id:2,from:"student",text:"Great — cell biology needs the most work.",                         ts:new Date(Date.now()-7100000)},
  ],
  3: [
    {id:1,from:"tutor",  text:"Welcome! Let's ace IIT-JEE Maths this year.",                      ts:new Date(Date.now()-86400000)},
  ],
}

// Tutor-side seed (conversations with students)
const SEED_THREADS_TUTOR = {
  1: [
    {id:1,from:"student",text:"Hi sir, when can we start the sessions?",                           ts:new Date(Date.now()-1800000)},
    {id:2,from:"tutor",  text:"Tomorrow 6 PM works perfectly. See you then!",                     ts:new Date(Date.now()-1700000)},
  ],
  2: [
    {id:1,from:"student",text:"Can we cover thermodynamics this week?",                            ts:new Date(Date.now()-3600000)},
  ],
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const INR   = n  => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n)
const ini   = (n="?") => n.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)
const fmtD  = d  => new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})
const fmtT  = d  => new Date(d).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})
const fmt1k = n  => n>=1000?`${Math.round(n/1000)}K+`:`${n}+`

// ─── ICONS ───────────────────────────────────────────────────────────────────
const IP = {
  home:   <><path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/><path d="M3 12v9h18"/></>,
  search: <><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></>,
  heart:  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
  msg:    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
  cal:    <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  pin:    <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  globe:  <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
  check:  <polyline points="20 6 9 17 4 12"/>,
  x:      <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  arrow:  <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
  back:   <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
  clock:  <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  send:   <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
  chart:  <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  edit:   <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  book:   <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
  grad:   <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>,
  users:  <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  star:   <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
  pen:    <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></>,
  paper:  <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  attach: <><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></>,
}
const I = ({n,size=16,stroke,sw=1.8,style={}}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke||C.ink} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>{IP[n]}</svg>
)

// ─── PRIMITIVE COMPONENTS ────────────────────────────────────────────────────
const Av = ({name,size=36,color,style={}}) => {
  const palette = ["#1a6b3c","#5b21b6","#0369a1","#b45309","#be185d","#0891b2","#7c3aed","#c2410c"]
  let h=0; for(const c of(name||""))h+=c.charCodeAt(0)
  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:color||palette[h%palette.length],display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.36,fontWeight:700,color:"#fff",flexShrink:0,...style}}>
      {ini(name)}
    </div>
  )
}

const Stars = ({rating,size=12}) => (
  <span style={{display:"inline-flex",gap:2}}>
    {[1,2,3,4,5].map(i=>(
      <svg key={i} width={size} height={size} viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={i<=Math.round(rating)?C.gold:"#E2E8F0"} stroke="none"/>
      </svg>
    ))}
  </span>
)

const StarPicker = ({value,onChange}) => (
  <div style={{display:"flex",gap:6}}>
    {[1,2,3,4,5].map(i=>(
      <button key={i} className="star-btn" onClick={()=>onChange(i)} type="button">
        <svg width={30} height={30} viewBox="0 0 24 24">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={i<=value?C.gold:"#E2E8F0"} stroke={i<=value?C.gold:"#CBD5E1"} strokeWidth={1}/>
        </svg>
      </button>
    ))}
  </div>
)

const Spin = ({size=18,light=true}) => (
  <div className="spin" style={{width:size,height:size,borderRadius:"50%",border:`2px solid ${light?"rgba(255,255,255,.3)":C.hairline}`,borderTopColor:light?"#fff":C.accent}}/>
)

const SPill = ({status}) => {
  const m = {confirmed:{c:"pg",l:"Confirmed"},pending:{c:"pa",l:"Pending"},completed:{c:"pm",l:"Completed"},rejected:{c:"pr",l:"Declined"}}
  const s = m[status]||{c:"pm",l:status}
  return <span className={`pill ${s.c}`}>{s.l}</span>
}

function Toast({msg,onDone}) {
  useEffect(()=>{ const t=setTimeout(onDone,2800); return ()=>clearTimeout(t) },[onDone])
  return <div className="toast">{msg}</div>
}

// ─── LAYOUT SHELLS ───────────────────────────────────────────────────────────
const TopBar = ({title,right,onBack,onSearch,ph}) => (
  <div className="topbar">
    {onBack&&<button className="bg" onClick={onBack} style={{padding:"6px 10px"}}><I n="back" size={15}/></button>}
    {title&&<h1 style={{fontSize:16,fontWeight:600}}>{title}</h1>}
    {onSearch&&(
      <div style={{position:"relative",flex:1,maxWidth:340}}>
        <I n="search" size={14} stroke={C.muted} style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
        <input className="inp" placeholder={ph||"Search…"} style={{paddingLeft:36}} onChange={e=>onSearch(e.target.value)}/>
      </div>
    )}
    <div style={{flex:1}}/>
    {right}
  </div>
)

const Sidebar = ({nav,active,onNav,user,onLogout,role}) => (
  <div className="sidebar">
    <div style={{padding:"22px 16px 14px"}}>
      <div className="serif" style={{fontSize:22,fontWeight:600,color:"#fff",letterSpacing:-0.5}}>
        MyTutors<span style={{color:"#4ade80"}}>24</span>
      </div>
      <div style={{fontSize:11,color:"rgba(255,255,255,.3)",fontWeight:500,letterSpacing:1.2,textTransform:"uppercase",marginTop:3}}>{role}</div>
    </div>
    <nav style={{flex:1,padding:"6px 0"}}>
      {nav.map(item=>(
        <div key={item.key} className={`ni${active===item.key?" on":""}`} onClick={()=>onNav(item.key)}>
          <I n={item.icon} size={15} stroke={active===item.key?"#fff":"rgba(255,255,255,.45)"}/>
          <span>{item.label}</span>
          {item.badge>0&&<span className="unread-badge" style={{marginLeft:"auto"}}>{item.badge}</span>}
        </div>
      ))}
    </nav>
    {user&&(
      <div style={{borderTop:"1px solid rgba(255,255,255,.07)",padding:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"6px 8px",borderRadius:8}}>
          <Av name={user.name} size={30}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12.5,fontWeight:500,color:"rgba(255,255,255,.82)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.3)"}}>{user.email||""}</div>
          </div>
          <button onClick={onLogout} style={{background:"none",border:"none",cursor:"pointer",padding:5}}>
            <I n="logout" size={14} stroke="rgba(255,255,255,.35)"/>
          </button>
        </div>
      </div>
    )}
  </div>
)

// ─── MESSAGING COMPONENT ──────────────────────────────────────────────────────
// Works for both student (contacts = tutors) and tutor (contacts = students)
// In production: WebSocket / polling replaces the simulated auto-reply
function Messaging({user, userType, contacts, seedThreads}) {
  const [threads, setThreads]     = useState(seedThreads)    // {contactId: [msg,...]}
  const [selId,   setSelId]       = useState(contacts[0]?.id||null)
  const [draft,   setDraft]       = useState("")
  const [search,  setSearch]      = useState("")
  const [typing,  setTyping]      = useState(false)          // "other side is typing"
  const [unread,  setUnread]      = useState({2:1, 3:2})     // contactId → unread count
  const endRef = useRef(null)
  const inputRef = useRef(null)

  const msgs = threads[selId] || []

  // Scroll to bottom when messages change
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}) },[msgs, typing])

  const selectContact = (id) => {
    setSelId(id)
    setDraft("")
    // Clear unread for this contact
    setUnread(prev=>({...prev,[id]:0}))
    setTimeout(()=>inputRef.current?.focus(),50)
  }

  const sendMessage = () => {
    if(!draft.trim()||!selId) return
    const newMsg = {id:Date.now(), from:userType, text:draft.trim(), ts:new Date()}
    setThreads(prev=>({...prev,[selId]:[...(prev[selId]||[]),newMsg]}))
    setDraft("")
    inputRef.current?.focus()

    // Simulate the other side typing then replying
    setTyping(true)
    const delay = 1000 + Math.random()*1500
    setTimeout(()=>{
      setTyping(false)
      const contact = contacts.find(c=>c.id===selId)
      const replies = [
        "Got it, thanks! I'll review this.",
        "Sure, let's cover that next session.",
        "Understood! I'll prepare notes on this topic.",
        "That works for me. See you then!",
        "Great question — I'll explain this in detail during our class.",
        "Absolutely. Keep practising the problems I sent last time.",
      ]
      const reply = {id:Date.now()+1, from:userType==="student"?"tutor":"student", text:replies[Math.floor(Math.random()*replies.length)], ts:new Date()}
      setThreads(prev=>({...prev,[selId]:[...(prev[selId]||[]),reply]}))
    }, delay)
  }

  const handleKey = e => { if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendMessage() } }

  const lastMsg = (id) => {
    const t = threads[id]
    if(!t||!t.length) return ""
    const m = t[t.length-1]
    return m.text.length>38 ? m.text.slice(0,38)+"…" : m.text
  }

  const filteredContacts = contacts.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.subject?.toLowerCase().includes(search.toLowerCase()))
  const selectedContact  = contacts.find(c=>c.id===selId)
  const totalUnread      = Object.values(unread).reduce((a,b)=>a+b,0)

  return (
    <div className="msg-layout">

      {/* ── Contact list ─────────────────────────────────────────────── */}
      <div className="contacts">
        <div style={{padding:"14px 16px 10px",borderBottom:`1px solid ${C.hairline}`}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <span style={{fontSize:15,fontWeight:600}}>Messages</span>
            {totalUnread>0&&<span className="unread-badge">{totalUnread}</span>}
          </div>
          <div style={{position:"relative"}}>
            <I n="search" size={14} stroke={C.muted} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
            <input className="inp" placeholder="Search conversations…" style={{paddingLeft:34,fontSize:13}} value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
        </div>

        <div style={{overflowY:"auto",flex:1}}>
          {filteredContacts.length===0&&(
            <div style={{padding:"32px 16px",textAlign:"center",color:C.muted,fontSize:13}}>No conversations found</div>
          )}
          {filteredContacts.map(c=>{
            const unreadCount = unread[c.id]||0
            const last = lastMsg(c.id)
            return (
              <div key={c.id} className={`contact-row${selId===c.id?" sel":""}`} onClick={()=>selectContact(c.id)}>
                <div style={{position:"relative"}}>
                  <Av name={c.name} size={42} color={c.col}/>
                  {/* Online dot */}
                  {c.id<=3&&<div style={{position:"absolute",bottom:1,right:1,width:10,height:10,borderRadius:"50%",background:C.success,border:`2px solid ${C.surface}`}}/>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                    <span style={{fontSize:13,fontWeight:unreadCount>0?600:500,color:C.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</span>
                    <span style={{fontSize:11,color:C.muted,flexShrink:0,marginLeft:8}}>
                      {threads[c.id]?.length ? fmtT(threads[c.id][threads[c.id].length-1].ts) : ""}
                    </span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:12,color:unreadCount>0?C.ink:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:unreadCount>0?500:400}}>
                      {last||<span style={{fontStyle:"italic"}}>No messages yet</span>}
                    </span>
                    {unreadCount>0&&<span className="unread-badge" style={{flexShrink:0,marginLeft:6}}>{unreadCount}</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Chat area ────────────────────────────────────────────────── */}
      <div className="chat-area">
        {!selectedContact ? (
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted,flexDirection:"column",gap:12}}>
            <I n="msg" size={40} stroke={C.hairline}/>
            <p style={{fontSize:15}}>Select a conversation to start messaging</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="chat-header">
              <div style={{position:"relative"}}>
                <Av name={selectedContact.name} size={40} color={selectedContact.col}/>
                {selectedContact.id<=3&&<div style={{position:"absolute",bottom:1,right:1,width:10,height:10,borderRadius:"50%",background:C.success,border:`2px solid ${C.surface}`}}/>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600}}>{selectedContact.name}</div>
                <div style={{fontSize:12,color:selectedContact.id<=3?C.success:C.muted}}>
                  {selectedContact.id<=3?"● Online":"● Away"}{selectedContact.subject?` · ${selectedContact.subject}`:""}
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button className="bg" style={{padding:"6px 10px"}} title="View profile">
                  <I n="users" size={15}/>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {msgs.length===0&&(
                <div style={{textAlign:"center",padding:"40px 0",color:C.muted}}>
                  <I n="msg" size={28} stroke={C.hairline} style={{marginBottom:8}}/>
                  <p style={{fontSize:14}}>No messages yet. Say hello!</p>
                </div>
              )}

              {/* Group messages by date */}
              {msgs.map((m,idx)=>{
                const isMine = m.from===userType
                const showDate = idx===0||fmtD(msgs[idx-1].ts)!==fmtD(m.ts)
                return (
                  <div key={m.id}>
                    {showDate&&(
                      <div style={{textAlign:"center",margin:"8px 0"}}>
                        <span style={{fontSize:11,color:C.muted,background:C.bg,padding:"3px 12px",borderRadius:99,border:`1px solid ${C.hairline}`}}>
                          {fmtD(m.ts)}
                        </span>
                      </div>
                    )}
                    <div style={{display:"flex",justifyContent:isMine?"flex-end":"flex-start",alignItems:"flex-end",gap:8}}>
                      {!isMine&&<Av name={selectedContact.name} size={28} color={selectedContact.col}/>}
                      <div style={{maxWidth:"65%"}}>
                        <div className={isMine?"bubble-me":"bubble-them"}>{m.text}</div>
                        <div style={{fontSize:10,color:C.muted,marginTop:4,textAlign:isMine?"right":"left"}}>{fmtT(m.ts)}</div>
                      </div>
                      {isMine&&<Av name={user.name} size={28} style={{opacity:0.7}}/>}
                    </div>
                  </div>
                )
              })}

              {/* Typing indicator */}
              {typing&&(
                <div style={{display:"flex",justifyContent:"flex-start",alignItems:"flex-end",gap:8}}>
                  <Av name={selectedContact.name} size={28} color={selectedContact.col}/>
                  <div className="bubble-them" style={{padding:"8px 14px"}}>
                    <div className="typing">
                      <div className="dot"/>
                      <div className="dot"/>
                      <div className="dot"/>
                    </div>
                  </div>
                </div>
              )}

              <div ref={endRef}/>
            </div>

            {/* Input */}
            <div className="chat-input">
              <button className="bg" style={{padding:"8px 10px",flexShrink:0}} title="Attach file">
                <I n="attach" size={15}/>
              </button>
              <textarea
                ref={inputRef}
                className="inp"
                value={draft}
                onChange={e=>setDraft(e.target.value)}
                onKeyDown={handleKey}
                placeholder={`Message ${selectedContact.name}… (Enter to send)`}
                style={{flex:1,resize:"none",minHeight:40,maxHeight:120,lineHeight:1.5,padding:"9px 13px"}}
                rows={1}
              />
              <button
                className="bp"
                onClick={sendMessage}
                disabled={!draft.trim()}
                style={{padding:"9px 16px",flexShrink:0}}
                title="Send"
              >
                <I n="send" size={15} stroke="#fff"/>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function Landing({go}) {
  const [stats,setStats]               = useState(null)
  const [featuredReviews,setFeatured]  = useState(null)
  const [statsLive,setStatsLive]       = useState(false)

  // Live stats from backend
  useEffect(()=>{
    api.get("/stats").then(d=>{setStats(d);setStatsLive(true)}).catch(()=>setStats(MOCK_STATS))
  },[])

  // Admin-curated featured reviews from backend
  useEffect(()=>{
    api.get("/reviews?featured=true").then(d=>setFeatured(Array.isArray(d)?d:MOCK_FEAT_REVIEWS)).catch(()=>setFeatured(MOCK_FEAT_REVIEWS))
  },[])

  const steps=[
    {n:"01",t:"Tell us what you need",d:"Subject, level, schedule, budget — takes about a minute."},
    {n:"02",t:"Meet your matches",d:"We shortlist verified tutors who fit. Read reviews, watch intros."},
    {n:"03",t:"Book a free first session",d:"See if you click before you pay. No card needed up front."},
  ]
  const subjs=["IIT-JEE","NEET","Mathematics","Physics","Chemistry","English","UPSC","Coding","Commerce","Arts & Music"]

  return (
    <div style={{background:C.surface,color:C.ink,minHeight:"100vh"}}>
      <style>{CSS}</style>

      {/* Nav */}
      <nav style={{position:"sticky",top:0,zIndex:50,background:"rgba(255,255,255,.92)",backdropFilter:"blur(14px)",borderBottom:`1px solid ${C.hairline}`}}>
        <div style={{maxWidth:1160,margin:"0 auto",padding:"0 28px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div className="serif" style={{fontSize:24,fontWeight:600,color:C.accent}}>MyTutors<span style={{color:C.ink}}>24</span></div>
          <div style={{display:"flex",gap:28,alignItems:"center"}}>
            <a href="#subjects" style={{fontSize:14,color:C.muted}}>Subjects</a>
            <a href="#how"      style={{fontSize:14,color:C.muted}}>How it works</a>
            <button className="bg" onClick={()=>go("login-selector")} style={{fontSize:14}}>Log in</button>
            <button className="bp" onClick={()=>go("student-register")} style={{fontSize:14}}>Get started free</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{maxWidth:1160,margin:"0 auto",padding:"88px 28px 80px",textAlign:"center"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:C.accentLight,color:C.accentText,padding:"6px 16px",borderRadius:99,fontSize:13,fontWeight:600,marginBottom:28}}>
          <I n="shield" size={13} stroke={C.accentText}/> Trusted by {stats?fmt1k(stats.students):"50K+"} students across India
        </div>
        <h1 className="serif" style={{fontSize:64,lineHeight:1.05,marginBottom:20,letterSpacing:-1.5}}>
          Find your perfect tutor.<br/><span style={{color:C.accent}}>Start learning today.</span>
        </h1>
        <p style={{fontSize:19,color:C.muted,maxWidth:500,margin:"0 auto 42px",lineHeight:1.65}}>
          India's most trusted 1-on-1 tutoring platform. IIT-JEE, NEET, Board exams, Coding and 200+ subjects.
        </p>
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          <button className="bp" onClick={()=>go("student-register")} style={{padding:"13px 28px",fontSize:15}}>
            Find my tutor <I n="arrow" size={15} stroke="#fff"/>
          </button>
          <button className="bg" onClick={()=>go("tutor-register")} style={{padding:"13px 24px",fontSize:15}}>Teach on MyTutors24</button>
        </div>
      </section>

      {/* Live stats */}
      <section style={{background:C.ink}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",padding:"0 28px"}}>
          {[
            {v:stats?fmt1k(stats.tutors):"…",   l:"Verified tutors"},
            {v:stats?fmt1k(stats.students):"…",  l:"Students taught"},
            {v:stats?`${stats.avgRating} ★`:"…", l:"Average rating"},
            {v:stats?`${stats.cities}+`:"…",     l:"Cities covered"},
          ].map((s,i)=>(
            <div key={s.l} style={{textAlign:"center",padding:"34px 16px",borderRight:i<3?"1px solid rgba(255,255,255,.07)":"none"}}>
              {!stats
                ?<div className="skel" style={{height:44,width:90,margin:"0 auto 8px"}}/>
                :<div className="serif" style={{fontSize:40,color:"#fff",marginBottom:4}}>{s.v}</div>
              }
              <div style={{fontSize:14,color:"rgba(255,255,255,.4)"}}>{s.l}</div>
            </div>
          ))}
        </div>
        {statsLive&&<div style={{textAlign:"center",padding:"5px 0",fontSize:11,color:"rgba(255,255,255,.18)"}}>● live</div>}
      </section>

      {/* Subjects */}
      <section id="subjects" style={{maxWidth:1160,margin:"0 auto",padding:"80px 28px"}}>
        <h2 className="serif" style={{fontSize:36,textAlign:"center",marginBottom:8}}>Browse by subject</h2>
        <p style={{color:C.muted,textAlign:"center",marginBottom:36,fontSize:15}}>Experts across every competitive exam and school curriculum</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
          {subjs.map(s=><button key={s} className="bg" onClick={()=>go("student-login")} style={{padding:"10px 20px",fontSize:14}}>{s}</button>)}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{background:C.bg,padding:"80px 28px"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <h2 className="serif" style={{fontSize:36,textAlign:"center",marginBottom:8}}>How it works</h2>
          <p style={{color:C.muted,textAlign:"center",marginBottom:50,fontSize:15}}>Simple, fast, effective.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:26}}>
            {steps.map(s=>(
              <div key={s.n} className="card" style={{padding:28}}>
                <div className="serif" style={{fontSize:42,color:C.accent,marginBottom:14,lineHeight:1}}>{s.n}</div>
                <h3 style={{fontSize:16,fontWeight:600,marginBottom:8}}>{s.t}</h3>
                <p style={{fontSize:14,color:C.muted,lineHeight:1.7}}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured reviews — admin-curated, live from backend */}
      <section style={{maxWidth:1160,margin:"0 auto",padding:"80px 28px"}}>
        <h2 className="serif" style={{fontSize:36,textAlign:"center",marginBottom:6}}>What students say</h2>
        <p style={{color:C.muted,textAlign:"center",marginBottom:46,fontSize:14}}>
          Selected from verified reviews by our team
        </p>
        {!featuredReviews?(
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:22}}>
            {[0,1,2].map(i=>(
              <div key={i} className="card" style={{padding:28}}>
                <div className="skel" style={{height:16,width:80,marginBottom:16}}/>
                <div className="skel" style={{height:64,marginBottom:16}}/>
                <div style={{display:"flex",gap:10}}>
                  <div className="skel" style={{width:36,height:36,borderRadius:"50%"}}/>
                  <div style={{flex:1}}>
                    <div className="skel" style={{height:13,marginBottom:6}}/>
                    <div className="skel" style={{height:11,width:"60%"}}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:22}}>
            {featuredReviews.map(r=>(
              <div key={r.id} className="card" style={{padding:28}}>
                <Stars rating={r.rating}/>
                <p style={{fontSize:15,lineHeight:1.75,margin:"14px 0 20px",color:C.ink}}>"{r.text}"</p>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <Av name={r.author} size={36}/>
                  <div>
                    <div style={{fontSize:13,fontWeight:600}}>{r.author}</div>
                    <div style={{fontSize:12,color:C.muted}}>{r.detail}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section style={{background:C.accent,padding:"80px 28px",textAlign:"center"}}>
        <h2 className="serif" style={{fontSize:40,color:"#fff",marginBottom:10}}>Ready to start learning?</h2>
        <p style={{color:"rgba(255,255,255,.65)",fontSize:17,marginBottom:30}}>
          Join {stats?fmt1k(stats.students):"thousands of"} students achieving their goals with MyTutors24.
        </p>
        <button className="bp" onClick={()=>go("student-register")} style={{background:"#fff",color:C.accent,padding:"13px 28px",fontSize:15}}>
          Get started free <I n="arrow" size={15} stroke={C.accent}/>
        </button>
      </section>

      <footer style={{borderTop:`1px solid ${C.hairline}`,padding:28,textAlign:"center"}}>
        <div className="serif" style={{fontSize:20,color:C.accent,marginBottom:4}}>MyTutors<span style={{color:C.ink}}>24</span></div>
        <p style={{fontSize:12,color:C.muted}}>© 2025 MyTutors24 · Made with ♥ in India</p>
      </footer>
    </div>
  )
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function LoginSelector({go}) {
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg}}>
      <style>{CSS}</style>
      <div style={{width:400}}>
        <button className="bg" onClick={()=>go("landing")} style={{marginBottom:28}}><I n="back" size={15}/> Back</button>
        <div className="serif" style={{fontSize:30,marginBottom:6}}>Welcome back</div>
        <p style={{color:C.muted,fontSize:15,marginBottom:30}}>How would you like to log in?</p>
        {[{label:"I'm a student",sub:"Find tutors and book sessions",icon:"book",route:"student-login"},{label:"I'm a tutor",sub:"Manage your classes and earnings",icon:"grad",route:"tutor-login"}].map(o=>(
          <button key={o.route} onClick={()=>go(o.route)}
            style={{display:"flex",alignItems:"center",gap:16,padding:20,width:"100%",background:C.surface,border:`1px solid ${C.hairline}`,borderRadius:12,textAlign:"left",cursor:"pointer",marginBottom:10,transition:"all 140ms"}}
            onMouseOver={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.boxShadow="0 2px 12px rgba(13,74,47,.1)"}}
            onMouseOut={e=>{e.currentTarget.style.borderColor=C.hairline;e.currentTarget.style.boxShadow="none"}}>
            <div style={{width:44,height:44,borderRadius:10,background:C.accentLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <I n={o.icon} size={20} stroke={C.accent}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:600,marginBottom:2}}>{o.label}</div>
              <div style={{fontSize:13,color:C.muted}}>{o.sub}</div>
            </div>
            <I n="arrow" size={16} stroke={C.muted}/>
          </button>
        ))}
      </div>
    </div>
  )
}

function AuthForm({title,sub,fields,onSubmit,loading,error,footer,onBack,btnLabel="Log in"}) {
  const [form,setForm] = useState({})
  const [showTnc,setShowTnc] = useState(false)
  const set = (k,v) => setForm(p=>({...p,[k]:v}))
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg}}>
      <style>{CSS}</style>
      <div style={{width:420}}>
        {onBack&&<button className="bg" onClick={onBack} style={{marginBottom:28}}><I n="back" size={15}/> Back</button>}
        <div className="serif" style={{fontSize:30,marginBottom:5}}>{title}</div>
        <p style={{color:C.muted,fontSize:14,marginBottom:26}}>{sub}</p>
        <div className="card" style={{padding:28}}>
          {fields.map(f=>(
            <div key={f.key} style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:13,fontWeight:500,marginBottom:6}}>{f.label}</label>
              {f.type==="select"
                ?<select className="inp" onChange={e=>set(f.key,e.target.value)} defaultValue="">
                    <option value="" disabled>Select…</option>
                    {f.opts.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                :<input className="inp" type={f.type||"text"} placeholder={f.ph} onChange={e=>set(f.key,e.target.value)}/>
              }
            </div>
          ))}
          {btnLabel!=="Log in"&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,fontSize:12,color:C.muted}}><input type="checkbox" onChange={e=>setForm(p=>({...p,tnc:e.target.checked}))}/><span>I agree to the <button onClick={e=>{e.preventDefault();setShowTnc(true)}} style={{color:"#0D4A2F",fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:0,fontSize:"inherit"}}>Terms and Conditions</button> and <button onClick={e=>{e.preventDefault();setShowTnc(true)}} style={{color:"#0D4A2F",fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:0,fontSize:"inherit"}}>Code of Conduct</button> of MyTutors24</span></div>}{error&&<div style={{background:C.dangerLight,color:C.danger,padding:"10px 14px",borderRadius:8,fontSize:13,marginBottom:16}}>{error}</div>}
          <button className="bp" onClick={()=>{if(btnLabel!=="Log in"&&!form.tnc){alert("Please agree to the Terms and Conditions to continue.");return;}onSubmit(form)}} style={{width:"100%",justifyContent:"center",padding:"12px 20px",marginTop:4}}>
            {loading?<Spin/>:btnLabel}
          </button>
        </div>
          {showTnc&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.7)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>setShowTnc(false)}><div style={{background:'#fff',borderRadius:16,padding:28,width:640,maxWidth:'calc(100vw - 32px)',maxHeight:'80vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}><h2 style={{fontSize:18,fontWeight:700}}>Terms and Conditions</h2><button onClick={()=>setShowTnc(false)} style={{background:'none',border:'1px solid #ddd',borderRadius:8,padding:'5px 10px',cursor:'pointer'}}>Close</button></div><div style={{fontSize:13,lineHeight:1.8,color:'#555'}}><h3 style={{color:'#111',marginBottom:8}}>1. Platform Usage</h3><p style={{marginBottom:12}}>By registering on MyTutors24 you agree to use the platform only for legitimate educational purposes and treat all users with respect.</p><h3 style={{color:'#111',marginBottom:8}}>2. Non-Circumvention (Tutors)</h3><p style={{marginBottom:12}}>Tutors agree NOT to contact or accept payment from students outside MyTutors24 for 12 months. Violation entitles MyTutors24 to claim damages equal to 3x the value of off-platform sessions.</p><h3 style={{color:'#111',marginBottom:8}}>3. Actions Affecting Company</h3><p style={{marginBottom:12}}>Users must not make false statements about MyTutors24, post fake reviews, or take any action designed to damage MyTutors24 reputation or financials. Violations may result in legal action.</p><h3 style={{color:'#111',marginBottom:8}}>4. Cancellation and Refunds</h3><p style={{marginBottom:12}}>More than 24 hours before session: full refund. 2-24 hours before: 50 percent refund. Less than 2 hours: no refund. Tutor cancellations: full refund to student.</p><h3 style={{color:'#111',marginBottom:8}}>5. Professional Conduct</h3><p style={{marginBottom:12}}>All users must maintain professional conduct. Harassment, sharing student data, or academic dishonesty will result in immediate permanent ban.</p><h3 style={{color:'#111',marginBottom:8}}>6. Payments</h3><p style={{marginBottom:12}}>All payments must go through MyTutors24. Platform fee is 15 percent. Tutors receive 85 percent. Refunds processed within 5-7 business days.</p><h3 style={{color:'#111',marginBottom:8}}>7. Jurisdiction</h3><p style={{marginBottom:20}}>These terms are governed by Indian law. Disputes are subject to courts in Hyderabad, Telangana.</p></div><button onClick={()=>setShowTnc(false)} style={{width:'100%',background:'#0D4A2F',color:'#fff',border:'none',borderRadius:8,padding:'12px 20px',fontSize:14,fontWeight:600,cursor:'pointer',marginTop:8}}>I Agree and Close</button></div></div>}
      {footer&&<p style={{textAlign:"center",fontSize:13,color:C.muted,marginTop:14}}>
          {footer.text}{" "}<button onClick={footer.fn} style={{color:C.accent,fontWeight:600,background:"none",border:"none",cursor:"pointer"}}>{footer.label}</button>
        </p>}
      </div>
    </div>
  )
}

// ─── TUTOR CARD ───────────────────────────────────────────────────────────────
function TCard({tutor,onView,onFav,isFav}) {
  return (
    <div className="card ch" style={{padding:20,cursor:"pointer"}} onClick={()=>onView(tutor)}>
      <div style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-start"}}>
        <Av name={tutor.name} size={50} color={tutor.col}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:15,fontWeight:600,marginBottom:tutor.badge?4:0}}>{tutor.name}</div>
              {tutor.badge&&<span className={`pill ${tutor.badge==="Top Tutor"?"pg":tutor.badge==="NEET Expert"?"pp":"pb"}`}>{tutor.badge}</span>}
            </div>
            <button onClick={e=>{e.stopPropagation();onFav(tutor.id)}} style={{background:"none",border:"none",cursor:"pointer",padding:4}}>
              <svg width={16} height={16} viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={isFav?C.danger:"none"} stroke={isFav?C.danger:C.muted} strokeWidth={1.8}/></svg>
            </button>
          </div>
        </div>
      </div>
      <div style={{fontSize:13,color:C.muted,marginBottom:8}}>{tutor.subject}</div>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}>
        <Stars rating={tutor.rating}/>
        <span style={{fontSize:12,fontWeight:700}}>{tutor.rating}</span>
        <span style={{fontSize:12,color:C.muted}}>({tutor.reviews})</span>
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
        <span style={{fontSize:12,color:C.muted,display:"flex",alignItems:"center",gap:4}}><I n="pin" size={12} stroke={C.muted}/>{tutor.city}</span>
        <span style={{fontSize:12,color:C.muted,display:"flex",alignItems:"center",gap:4}}><I n="globe" size={12} stroke={C.muted}/>{tutor.mode}</span>
        {tutor.verified&&<span className="pill pg" style={{fontSize:11}}><I n="shield" size={10} stroke={C.accentText}/>Verified</span>}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:`1px solid ${C.hairline}`,paddingTop:12}}>
        <div style={{fontSize:16,fontWeight:700}}>{INR(tutor.price)}<span style={{fontSize:12,fontWeight:400,color:C.muted}}>/hr</span></div>
        <button className="bp" style={{padding:"6px 14px",fontSize:13}} onClick={e=>{e.stopPropagation();onView(tutor)}}>View profile</button>
      </div>
    </div>
  )
}

// ─── STUDENT APP ──────────────────────────────────────────────────────────────
function StudentApp({user,onLogout}) {
  const [page,setPage]         = useState("home")
  const [selTutor,setSelTutor] = useState(null)
  const [prevPage,setPrevPage] = useState("tutors")
  const [favs,setFavs]         = useState([3,7])
  const [bookings,setBookings] = useState(MOCK_BK_STU)
  const [bkTutor,setBkTutor]   = useState(null)
  const [toast,setToast]       = useState(null)

  // Messaging — student talks to tutors
  const msgContacts = TUTORS.slice(0,6)

  const nav = [
    {key:"home",      label:"Home",          icon:"home"},
    {key:"tutors",    label:"Browse tutors", icon:"search"},
    {key:"favorites", label:"Saved tutors",  icon:"heart"},
    {key:"messages",  label:"Messages",      icon:"msg"},
    {key:"dashboard", label:"My sessions",   icon:"cal"},
  ]

  const viewT = (t,from) => { setSelTutor(t); setPrevPage(from||page); setPage("profile") }
  const togFav = id => setFavs(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id])
  const addBk  = b  => { setBookings(p=>[b,...p]); setBkTutor(null); setToast("Booking sent! Awaiting tutor confirmation.") }

  return (
    <div className="layout">
      <style>{CSS}</style>
      <Sidebar nav={nav} active={page==="profile"?prevPage:page} onNav={setPage} user={user} onLogout={onLogout} role="Student"/>
      <div className="main">
        {page==="home"      && <SHome      onView={t=>viewT(t,"home")}    favs={favs}   togFav={togFav}/>}
        {page==="tutors"    && <SBrowse    onView={t=>viewT(t,"tutors")}  favs={favs}   togFav={togFav}/>}
        {page==="favorites" && <SFavs      tutors={TUTORS.filter(t=>favs.includes(t.id))} onView={t=>viewT(t,"favorites")} favs={favs} togFav={togFav}/>}
        {page==="messages"  && <Messaging  user={user} userType="student" contacts={msgContacts} seedThreads={SEED_THREADS}/>}
        {page==="dashboard" && <SDash      bookings={bookings} onBrowse={()=>setPage("tutors")} onBookings={setBookings}/>}
        {page==="profile"   && selTutor && <TutorProfilePage tutor={selTutor} onBack={()=>setPage(prevPage)} isFav={favs.includes(selTutor.id)} onFav={()=>togFav(selTutor.id)} onBook={t=>setBkTutor(t)} onMsg={()=>setPage("messages")}/>}
      </div>
      {bkTutor&&<BkModal  tutor={bkTutor} onClose={()=>setBkTutor(null)} onConfirm={addBk}/>}
      {toast&&<Toast msg={toast} onDone={()=>setToast(null)}/>}
    </div>
  )
}

function SHome({onView,favs,togFav}) {
  const top = [...TUTORS].sort((a,b)=>b.rating-a.rating).slice(0,4)
  return (
    <div className="fi">
      <TopBar title="Good morning, Rohan 👋"/>
      <div style={{padding:"28px 32px"}}>
        <p style={{fontSize:15,color:C.muted,marginBottom:36}}>Pick up where you left off, or explore new tutors.</p>
        <section style={{marginBottom:44}}>
          <div style={{fontSize:11,fontWeight:600,color:C.muted,letterSpacing:1.2,textTransform:"uppercase",marginBottom:14}}>Quick browse</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["IIT-JEE","NEET","Mathematics","Physics","English","UPSC","Coding","Commerce"].map(s=>(
              <button key={s} className="bg" style={{fontSize:13}}>{s}</button>
            ))}
          </div>
        </section>
        <section style={{marginBottom:44}}>
          <div style={{fontSize:11,fontWeight:600,color:C.muted,letterSpacing:1.2,textTransform:"uppercase",marginBottom:16}}>Top-rated tutors</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(256px,1fr))",gap:16}}>
            {top.map(t=><TCard key={t.id} tutor={t} onView={onView} onFav={togFav} isFav={favs.includes(t.id)}/>)}
          </div>
        </section>
        <section>
          <div style={{background:C.accent,borderRadius:14,padding:"28px 32px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div className="serif" style={{fontSize:22,color:"#fff",marginBottom:4}}>Ready to crack IIT-JEE 2026?</div>
              <div style={{fontSize:14,color:"rgba(255,255,255,.6)"}}>Browse top-rated Physics and Maths tutors.</div>
            </div>
            <button className="bg" onClick={()=>onView(TUTORS[0])} style={{background:"#fff",color:C.accent,border:"none",flexShrink:0}}>
              Browse now <I n="arrow" size={14} stroke={C.accent}/>
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

function SBrowse({onView,favs,togFav}) {
  const [q,setQ]       = useState("")
  const [subj,setSubj] = useState("")
  const [mode,setMode] = useState("")
  const [sort,setSort] = useState("rating")
  const subjects = [...new Set(TUTORS.map(t=>t.subject))]
  const filtered = TUTORS
    .filter(t=>{
      const qq=q.toLowerCase()
      return (!q||t.name.toLowerCase().includes(qq)||t.subject.toLowerCase().includes(qq)||t.bio.toLowerCase().includes(qq))
        &&(!subj||t.subject===subj)&&(!mode||t.mode===mode)
    })
    .sort((a,b)=>sort==="price"?a.price-b.price:sort==="price-d"?b.price-a.price:b.rating-a.rating)
  return (
    <div className="fi">
      <TopBar title="Browse Tutors" onSearch={setQ} ph="Search by name, subject, or keyword…"/>
      <div style={{padding:"20px 32px"}}>
        <div style={{display:"flex",gap:10,marginBottom:22,flexWrap:"wrap",alignItems:"center"}}>
          <select className="inp" style={{width:190}} onChange={e=>setSubj(e.target.value)}>
            <option value="">All subjects</option>
            {subjects.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <select className="inp" style={{width:148}} onChange={e=>setMode(e.target.value)}>
            <option value="">All modes</option>
            <option>Online</option><option>Offline</option><option>Hybrid</option>
          </select>
          <select className="inp" style={{width:158}} onChange={e=>setSort(e.target.value)}>
            <option value="rating">Top rated</option>
            <option value="price">Price: Low–High</option>
            <option value="price-d">Price: High–Low</option>
          </select>
          <span style={{fontSize:13,color:C.muted,marginLeft:"auto"}}>{filtered.length} tutors</span>
        </div>
        {filtered.length===0
          ?<div style={{textAlign:"center",padding:"60px 0",color:C.muted}}><I n="search" size={32} stroke={C.hairline}/><p style={{marginTop:12,fontSize:15}}>No tutors found.</p></div>
          :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(256px,1fr))",gap:16}}>
            {filtered.map(t=><TCard key={t.id} tutor={t} onView={onView} onFav={togFav} isFav={favs.includes(t.id)}/>)}
          </div>
        }
      </div>
    </div>
  )
}

function TutorProfilePage({tutor,onBack,isFav,onFav,onBook,onMsg}) {
  const [tab,setTab]           = useState("about")
  const [reviews,setReviews]   = useState([
    {id:1,author:"Rohan M.",    rating:5,text:"Excellent teaching! JEE rank improved significantly.",createdAt:"2025-03-15"},
    {id:2,author:"Anjali V.",   rating:5,text:"Very patient and explains every concept brilliantly.",createdAt:"2025-02-20"},
    {id:3,author:"Siddharth N.",rating:4,text:"Great content. Would appreciate more practice problems.",createdAt:"2025-01-10"},
  ])
  const [showReviewForm,setShowReviewForm] = useState(false)

  // In production: useTutorReviews(tutor.id) → auto-published immediately
  const addReview = async (r) => {
    const newR = {id:Date.now(),...r,createdAt:new Date().toISOString()}
    setReviews(p=>[newR,...p])
    setShowReviewForm(false)
    // POST /api/reviews → {tutorId, rating, text, author, featured:false, status:"published"}
    try { await api.post("/reviews",{tutorId:tutor.id,...r,featured:false,status:"published"}) } catch{}
  }

  return (
    <div className="fi">
      <TopBar onBack={onBack} right={
        <div style={{display:"flex",gap:8}}>
          <button onClick={onFav} className="bg" style={{gap:8}}>
            <svg width={15} height={15} viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={isFav?C.danger:"none"} stroke={isFav?C.danger:C.ink} strokeWidth={1.8}/></svg>
            {isFav?"Saved":"Save"}
          </button>
          <button onClick={onMsg} className="bg"><I n="msg" size={15}/> Message</button>
        </div>
      }/>
      <div style={{maxWidth:860,margin:"0 auto",padding:"28px 32px"}}>
        {/* Header card */}
        <div className="card" style={{padding:28,marginBottom:18}}>
          <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
            <Av name={tutor.name} size={68} color={tutor.col}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <h1 style={{fontSize:22,fontWeight:700}}>{tutor.name}</h1>
                {tutor.verified&&<span className="pill pg"><I n="shield" size={10} stroke={C.accentText}/>Verified</span>}
                {tutor.badge&&<span className="pill pp">{tutor.badge}</span>}
              </div>
              <div style={{fontSize:14,color:C.muted,marginBottom:12}}>{tutor.subject}</div>
              <div style={{display:"flex",gap:18,flexWrap:"wrap"}}>
                {[{i:"pin",t:tutor.city},{i:"globe",t:tutor.mode},{i:"clock",t:`${tutor.exp} yrs exp.`},{i:"users",t:`${tutor.students}+ students`}].map(x=>(
                  <span key={x.t} style={{fontSize:13,color:C.muted,display:"flex",alignItems:"center",gap:5}}><I n={x.i} size={13} stroke={C.muted}/>{x.t}</span>
                ))}
              </div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:26,fontWeight:700}}>{INR(tutor.price)}<span style={{fontSize:13,fontWeight:400,color:C.muted}}>/hr</span></div>
              <div style={{display:"flex",alignItems:"center",gap:5,justifyContent:"flex-end",margin:"6px 0 14px"}}>
                <Stars rating={tutor.rating}/>
                <span style={{fontSize:13,fontWeight:700}}>{tutor.rating}</span>
                <span style={{fontSize:13,color:C.muted}}>({tutor.reviews})</span>
              </div>
              <button className="bp" onClick={()=>onBook(tutor)} style={{padding:"11px 22px"}}>
                Book a session <I n="cal" size={14} stroke="#fff"/>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,marginBottom:18,background:C.surfaceAlt,padding:4,borderRadius:10,width:"fit-content"}}>
          {["about","reviews"].map(t=>(
            <button key={t} className={`tab-pill${tab===t?" on":""}`} onClick={()=>setTab(t)} style={{textTransform:"capitalize"}}>{t} {t==="reviews"?`(${reviews.length})`:""}</button>
          ))}
        </div>

        {tab==="about"&&(
          <div className="card" style={{padding:28}}>
            <div style={{fontSize:11,fontWeight:600,color:C.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>About</div>
            <p style={{fontSize:14.5,lineHeight:1.8,marginBottom:24}}>{tutor.bio}</p>
            <div style={{fontSize:11,fontWeight:600,color:C.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Expertise</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {[tutor.subject,"Concept building","Test strategy","Doubt clearing","Exam prep"].map(s=>(
                <span key={s} className="pill pg" style={{fontSize:13,padding:"5px 12px"}}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {tab==="reviews"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:13,color:C.muted}}>{reviews.length} reviews · avg {(reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1)} ★</div>
              <button className="bp" onClick={()=>setShowReviewForm(true)} style={{padding:"7px 16px",fontSize:13}}>
                <I n="pen" size={13} stroke="#fff"/> Write a review
              </button>
            </div>
            <div className="card" style={{overflow:"hidden"}}>
              {reviews.map((r,i)=>(
                <div key={r.id} style={{padding:"20px 24px",borderBottom:i<reviews.length-1?`1px solid ${C.hairline}`:"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <Av name={r.author} size={34}/>
                      <div>
                        <div style={{fontSize:13,fontWeight:600}}>{r.author}</div>
                        <Stars rating={r.rating} size={11}/>
                      </div>
                    </div>
                    <span style={{fontSize:12,color:C.muted}}>{fmtD(r.createdAt)}</span>
                  </div>
                  <p style={{fontSize:14,color:C.muted,lineHeight:1.65}}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showReviewForm&&<ReviewModal onClose={()=>setShowReviewForm(false)} onSubmit={addReview} tutorName={tutor.name}/>}
    </div>
  )
}

function ReviewModal({onClose,onSubmit,tutorName}) {
  const [rating,setRating] = useState(5)
  const [text,setText]     = useState("")
  const [name,setName]     = useState("")
  const [done,setDone]     = useState(false)
  const submit = async () => {
    if(!text.trim()||!name.trim()) return
    setDone(true)
    await onSubmit({rating,text:text.trim(),author:name.trim(),detail:"Verified student"})
  }
  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&!done&&onClose()}>
      <div className="modal">
        {done?(
          <div style={{textAlign:"center",padding:"32px 0"}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:C.accentLight,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
              <I n="check" size={24} stroke={C.accent}/>
            </div>
            <h3 className="serif" style={{fontSize:22,marginBottom:6}}>Review published!</h3>
            <p style={{color:C.muted,fontSize:14}}>Your review is now live on {tutorName}'s profile.</p>
          </div>
        ):(
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h2 style={{fontSize:17,fontWeight:600}}>Review {tutorName}</h2>
              <button className="bg" onClick={onClose} style={{padding:"5px 9px"}}><I n="x" size={15}/></button>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{display:"block",fontSize:13,fontWeight:500,marginBottom:8}}>Your rating</label>
              <StarPicker value={rating} onChange={setRating}/>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:13,fontWeight:500,marginBottom:6}}>Your name</label>
              <input className="inp" placeholder="e.g. Rohan M." value={name} onChange={e=>setName(e.target.value)}/>
            </div>
            <div style={{marginBottom:24}}>
              <label style={{display:"block",fontSize:13,fontWeight:500,marginBottom:6}}>Your experience</label>
              <textarea className="inp" rows={4} placeholder="How did this tutor help you? What improved?" value={text} onChange={e=>setText(e.target.value)}/>
              <div style={{fontSize:12,color:C.muted,marginTop:4}}>Reviews publish instantly on the tutor's profile.</div>
            </div>
            <button className="bp" onClick={submit} style={{width:"100%",justifyContent:"center",padding:"12px 20px"}} disabled={!text.trim()||!name.trim()}>
              Publish review
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function SFavs({tutors,onView,favs,togFav}) {
  return (
    <div className="fi">
      <TopBar title={`Saved tutors (${tutors.length})`}/>
      <div style={{padding:"28px 32px"}}>
        {tutors.length===0
          ?<div style={{textAlign:"center",padding:"80px 0",color:C.muted}}>
              <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={C.hairline} strokeWidth={1.5} style={{marginBottom:12}}>{IP.heart}</svg>
              <p style={{fontSize:15}}>No saved tutors yet. Tap the ♥ on any tutor card to save them here.</p>
            </div>
          :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(256px,1fr))",gap:16}}>
              {tutors.map(t=><TCard key={t.id} tutor={t} onView={onView} onFav={togFav} isFav={favs.includes(t.id)}/>)}
            </div>
        }
      </div>
    </div>
  )
}

function SDash({bookings,onBrowse,onBookings}) {
  const [reviewTarget,setReviewTarget] = useState(null)
  const counts = {
    total:     bookings.length,
    pending:   bookings.filter(b=>b.status==="pending").length,
    confirmed: bookings.filter(b=>b.status==="confirmed").length,
    completed: bookings.filter(b=>b.status==="completed").length,
  }
  const markReviewed = (id) => onBookings(p=>p.map(b=>b.id===id?{...b,reviewed:true}:b))
  return (
    <div className="fi">
      <TopBar title="My Sessions"/>
      <div style={{padding:"24px 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
          {[{l:"Total",v:counts.total},{l:"Pending",v:counts.pending},{l:"Confirmed",v:counts.confirmed},{l:"Completed",v:counts.completed}].map(s=>(
            <div key={s.l} className="card" style={{padding:20}}>
              <div style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{s.l}</div>
              <div className="serif" style={{fontSize:32}}>{s.v}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{overflow:"hidden"}}>
          <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.hairline}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <h2 style={{fontSize:14,fontWeight:600}}>All sessions</h2>
            <button className="bg" onClick={onBrowse} style={{fontSize:13}}>Book more <I n="arrow" size={13}/></button>
          </div>
          {bookings.length===0
            ?<div style={{padding:"56px 32px",textAlign:"center",color:C.muted}}>No sessions yet. <button onClick={onBrowse} style={{color:C.accent,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Browse tutors</button></div>
            :bookings.map((b,i)=>(
                <div key={b.id} style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:16,borderBottom:i<bookings.length-1?`1px solid ${C.hairline}`:"none"}}>
                  <Av name={b.tutorName} size={38}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:500}}>{b.tutorName}</div>
                    <div style={{fontSize:12,color:C.muted}}>{b.subject} · {fmtD(b.date)} · {b.time}</div>
                  </div>
                  <SPill status={b.status}/>
                  <div style={{fontSize:14,fontWeight:700,minWidth:68,textAlign:"right"}}>{INR(b.price)}</div>
                  {/* Leave review button — only on completed sessions not yet reviewed */}
                  {b.status==="completed"&&!b.reviewed&&(
                    <button className="bg" style={{fontSize:12,padding:"5px 10px",flexShrink:0}} onClick={()=>setReviewTarget(b)}>
                      <I n="pen" size={13}/> Review
                    </button>
                  )}
                  {b.status==="completed"&&b.reviewed&&(
                    <span className="pill pg" style={{fontSize:11,flexShrink:0}}><I n="check" size={10} stroke={C.accentText}/>Reviewed</span>
                  )}
                </div>
              ))
          }
        </div>
      </div>
      {reviewTarget&&(
        <ReviewModal
          tutorName={reviewTarget.tutorName}
          onClose={()=>setReviewTarget(null)}
          onSubmit={async(r)=>{
            markReviewed(reviewTarget.id)
            try { await api.post("/reviews",{tutorId:reviewTarget.tutorId,...r,featured:false,status:"published"}) } catch{}
            setReviewTarget(null)
          }}
        />
      )}
    </div>
  )
}

function BkModal({tutor,onClose,onConfirm}) {
  const [date,setDate] = useState("")
  const [time,setTime] = useState("")
  const [done,setDone] = useState(false)
  const confirm = () => {
    if(!date||!time) return
    setDone(true)
    setTimeout(()=>onConfirm({id:Date.now(),tutorId:tutor.id,tutorName:tutor.name,subject:tutor.subject,date,time,status:"pending",price:tutor.price,reviewed:false}),1000)
  }
  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&!done&&onClose()}>
      <div className="modal">
        {done?(
          <div style={{textAlign:"center",padding:"32px 0"}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:C.accentLight,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
              <I n="check" size={24} stroke={C.accent}/>
            </div>
            <h3 className="serif" style={{fontSize:22,marginBottom:6}}>Booking sent!</h3>
            <p style={{color:C.muted,fontSize:14}}>{tutor.name} will confirm your session shortly.</p>
          </div>
        ):(
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h2 style={{fontSize:17,fontWeight:600}}>Book a session</h2>
              <button className="bg" onClick={onClose} style={{padding:"5px 9px"}}><I n="x" size={15}/></button>
            </div>
            <div style={{display:"flex",gap:12,padding:"14px 0",marginBottom:18,borderBottom:`1px solid ${C.hairline}`}}>
              <Av name={tutor.name} size={44} color={tutor.col}/>
              <div><div style={{fontWeight:600}}>{tutor.name}</div><div style={{fontSize:13,color:C.muted}}>{tutor.subject} · {INR(tutor.price)}/hr</div></div>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:13,fontWeight:500,marginBottom:6}}>Date</label>
              <input className="inp" type="date" onChange={e=>setDate(e.target.value)} min={new Date().toISOString().split("T")[0]}/>
            </div>
            <div style={{marginBottom:24}}>
              <label style={{display:"block",fontSize:13,fontWeight:500,marginBottom:6}}>Time slot</label>
              <select className="inp" onChange={e=>setTime(e.target.value)}>
                <option value="">Select a time</option>
                {["6:00 AM","7:00 AM","8:00 AM","9:00 AM","10:00 AM","11:00 AM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <button className="bp" onClick={confirm} style={{width:"100%",justifyContent:"center",padding:"12px 20px"}} disabled={!date||!time}>
              Confirm booking · {INR(tutor.price)}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── TUTOR APP ────────────────────────────────────────────────────────────────
function TutorApp({user,onLogout}) {
  const [page,setPage]       = useState("dashboard")
  const [bookings,setBookings] = useState(MOCK_BK_TUT)
  const [toast,setToast]     = useState(null)

  // Tutor's messaging contacts are students from bookings + any others
  const msgContacts = [
    {id:1,name:"Rohan Malhotra", subject:"Student",col:"#1a6b3c"},
    {id:2,name:"Anjali Verma",   subject:"Student",col:"#5b21b6"},
    {id:3,name:"Siddharth Nair", subject:"Student",col:"#0369a1"},
  ]

  const nav = [
    {key:"dashboard", label:"Dashboard",  icon:"home"},
    {key:"messages",  label:"Messages",   icon:"msg"},
    {key:"myprofile", label:"My profile", icon:"edit"},
    {key:"earnings",  label:"Earnings",   icon:"chart"},
  ]

  const upd = (id,status) => {
    setBookings(p=>p.map(b=>b.id===id?{...b,status}:b))
    setToast(status==="confirmed"?"Booking confirmed! Student has been notified.":"Booking declined.")
  }

  return (
    <div className="layout">
      <style>{CSS}</style>
      <Sidebar nav={nav} active={page} onNav={setPage} user={user} onLogout={onLogout} role="Tutor"/>
      <div className="main">
        {page==="dashboard"&&<TDash  bookings={bookings} tutor={user} onUpd={upd}/>}
        {page==="messages" &&<Messaging user={user} userType="tutor" contacts={msgContacts} seedThreads={SEED_THREADS_TUTOR}/>}
        {page==="myprofile"&&<TEditProfile tutor={user}/>}
        {page==="earnings" &&<TEarnings bookings={bookings}/>}
      </div>
      {toast&&<Toast msg={toast} onDone={()=>setToast(null)}/>}
    </div>
  )
}

function TDash({bookings,tutor,onUpd}) {
  const earnings = bookings.filter(b=>b.status==="completed").reduce((s,b)=>s+b.price,0)
  const counts   = {total:bookings.length,pending:bookings.filter(b=>b.status==="pending").length,confirmed:bookings.filter(b=>b.status==="confirmed").length,completed:bookings.filter(b=>b.status==="completed").length}
  return (
    <div className="fi">
      <TopBar title={`Hi, ${tutor?.name?.split(" ")[0]} 👋`}/>
      <div style={{padding:"24px 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
          {[{l:"Total",v:counts.total},{l:"Pending",v:counts.pending,warn:counts.pending>0},{l:"Upcoming",v:counts.confirmed},{l:"Earnings",v:INR(earnings)}].map(s=>(
            <div key={s.l} className="card" style={{padding:20,borderLeft:s.warn?`3px solid ${C.warning}`:undefined}}>
              <div style={{fontSize:11,fontWeight:600,color:s.warn?C.warning:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{s.l}</div>
              <div className="serif" style={{fontSize:typeof s.v==="string"&&s.v.length>5?20:30,color:s.warn?C.warning:C.ink}}>{s.v}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{overflow:"hidden"}}>
          <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.hairline}`}}>
            <h2 style={{fontSize:14,fontWeight:600}}>Class requests</h2>
          </div>
          {bookings.length===0
            ?<div style={{padding:"50px 32px",textAlign:"center",color:C.muted}}>No booking requests yet.</div>
            :bookings.map((b,i)=>(
                <div key={b.id} style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:16,borderBottom:i<bookings.length-1?`1px solid ${C.hairline}`:"none"}}>
                  <Av name={b.studentName} size={38}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:500}}>{b.studentName}</div>
                    <div style={{fontSize:12,color:C.muted}}>{fmtD(b.date)} · {b.time}</div>
                  </div>
                  <SPill status={b.status}/>
                  <div style={{fontSize:14,fontWeight:700}}>{INR(b.price)}</div>
                  {b.status==="pending"&&(
                    <div style={{display:"flex",gap:8}}>
                      <button className="bss" onClick={()=>onUpd(b.id,"confirmed")}>Accept</button>
                      <button className="bds" onClick={()=>onUpd(b.id,"rejected")}>Decline</button>
                    </div>
                  )}
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}

function TEditProfile({tutor}) {
  const [saved,setSaved] = useState(false)
  const [name,setName]   = useState(tutor?.name||"")
  const [bio,setBio]     = useState("Passionate educator helping students achieve their goals for 5+ years.")
  const [price,setPrice] = useState(1200)
  return (
    <div className="fi">
      <TopBar title="My Profile"/>
      <div style={{padding:"24px 32px",maxWidth:660}}>
        {saved&&<div style={{background:C.accentLight,color:C.accentText,padding:"11px 16px",borderRadius:8,marginBottom:20,display:"flex",gap:8,alignItems:"center",fontSize:14}}><I n="check" size={15} stroke={C.accentText}/>Profile saved!</div>}
        <div className="card" style={{padding:28}}>
          <div style={{display:"flex",gap:18,alignItems:"center",marginBottom:24,paddingBottom:24,borderBottom:`1px solid ${C.hairline}`}}>
            <Av name={name} size={60}/>
            <div>
              <div style={{fontSize:16,fontWeight:600,marginBottom:2}}>{name}</div>
              <div style={{fontSize:13,color:C.muted}}>{tutor?.subject||"Tutor"}</div>
              <button className="bg" style={{fontSize:12,marginTop:8,padding:"5px 10px"}}>Change photo</button>
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:13,fontWeight:500,marginBottom:6}}>Full name</label>
            <input className="inp" value={name} onChange={e=>setName(e.target.value)}/>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:13,fontWeight:500,marginBottom:6}}>Email</label>
            <input className="inp" value={tutor?.email||""} disabled style={{opacity:.55,cursor:"not-allowed"}}/>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:13,fontWeight:500,marginBottom:6}}>About you</label>
            <textarea className="inp" rows={4} value={bio} onChange={e=>setBio(e.target.value)}/>
          </div>
          <div style={{marginBottom:24}}>
            <label style={{display:"block",fontSize:13,fontWeight:500,marginBottom:6}}>Hourly rate (₹)</label>
            <input className="inp" type="number" value={price} onChange={e=>setPrice(e.target.value)} style={{maxWidth:160}}/>
          </div>
          <button className="bp" onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),3000)}}>
            Save changes <I n="check" size={14} stroke="#fff"/>
          </button>
        </div>
      </div>
    </div>
  )
}

function TEarnings({bookings}) {
  const done     = bookings.filter(b=>b.status==="completed")
  const total    = done.reduce((s,b)=>s+b.price,0)
  const expected = bookings.filter(b=>b.status==="confirmed").reduce((s,b)=>s+b.price,0)
  return (
    <div className="fi">
      <TopBar title="Earnings"/>
      <div style={{padding:"24px 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:28}}>
          {[{l:"Total earned",v:INR(total),col:C.success},{l:"Expected (upcoming)",v:INR(expected),col:C.accent},{l:"Sessions done",v:done.length,col:C.ink}].map(s=>(
            <div key={s.l} className="card" style={{padding:22}}>
              <div style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{s.l}</div>
              <div className="serif" style={{fontSize:28,color:s.col}}>{s.v}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{padding:24}}>
          <h3 style={{fontSize:14,fontWeight:600,marginBottom:16}}>Transaction history</h3>
          {done.length===0
            ?<p style={{color:C.muted,fontSize:14}}>No completed sessions yet.</p>
            :done.map((b,i)=>(
                <div key={b.id} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:i<done.length-1?`1px solid ${C.hairline}`:"none"}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:500}}>{b.studentName}</div>
                    <div style={{fontSize:12,color:C.muted}}>{fmtD(b.date)} · {b.time}</div>
                  </div>
                  <div style={{fontSize:15,fontWeight:700,color:C.success}}>+{INR(b.price)}</div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
const SUBJ_LIST = ["IIT-JEE","NEET","Mathematics","Physics","Chemistry","Biology","English","UPSC","Coding","Commerce","Accounts","Economics","History","Geography"]

export default function App() {
  const [route,  setRoute]  = useState("landing")
  const [student,setStudent] = useState(null)
  const [tutor,  setTutor]  = useState(null)
  const [err,    setErr]    = useState("")
  const [loading,setLoading] = useState(false)
  const go = r => { setRoute(r); setErr("") }

  const withLoad = fn => async form => {
    setLoading(true); setErr("")
    await new Promise(r=>setTimeout(r,650))
    fn(form)
    setLoading(false)
  }

  const loginStu  = withLoad(f=>{ if(!f.email||!f.password){setErr("Please fill in all fields.");return} setStudent({id:1,name:"Rohan Malhotra",email:f.email,token:"tok"}); go("student-app") })
  const regStu    = withLoad(f=>{ if(!f.name||!f.email||!f.password){setErr("Please fill in all fields.");return} setStudent({id:1,name:f.name,email:f.email,token:"tok"}); go("student-app") })
  const loginTut  = withLoad(f=>{ if(!f.email||!f.password){setErr("Please fill in all fields.");return} setTutor({id:1,name:"Arjun Sharma",email:f.email,subject:"IIT-JEE Physics",token:"tok"}); go("tutor-app") })
  const regTut    = withLoad(f=>{ if(!f.name||!f.email||!f.subject){setErr("Please fill in all fields.");return} setTutor({id:1,name:f.name,email:f.email,subject:f.subject,token:"tok"}); go("tutor-app") })

  if(route==="landing")          return <Landing go={go}/>
  if(route==="login-selector")   return <LoginSelector go={go}/>
  if(route==="student-login")    return <AuthForm title="Student login"        sub="Welcome back! Log in to continue."            fields={[{key:"email",label:"Email",type:"email",ph:"you@email.com"},{key:"password",label:"Password",type:"password",ph:"••••••••"}]}                                                                             onSubmit={loginStu} loading={loading} error={err} footer={{text:"New here?",label:"Create account",fn:()=>go("student-register")}} onBack={()=>go("login-selector")} btnLabel="Log in"/>
  if(route==="student-register") return <AuthForm title="Create your account"  sub="Join 50,000+ students already learning."      fields={[{key:"name",label:"Full name",ph:"Rohan Malhotra"},{key:"email",label:"Email",type:"email",ph:"you@email.com"},{key:"password",label:"Password",type:"password",ph:"Min 8 characters"},{key:"city",label:"City",ph:"Delhi"}]}  onSubmit={regStu}   loading={loading} error={err} footer={{text:"Already registered?",label:"Log in",fn:()=>go("student-login")}}    onBack={()=>go("login-selector")} btnLabel="Create account"/>
  if(route==="tutor-login")      return <AuthForm title="Tutor login"          sub="Manage your classes and earn more."           fields={[{key:"email",label:"Email",type:"email",ph:"you@email.com"},{key:"password",label:"Password",type:"password",ph:"••••••••"}]}                                                                             onSubmit={loginTut} loading={loading} error={err} footer={{text:"Not registered?",label:"Join as a tutor",fn:()=>go("tutor-register")}}  onBack={()=>go("login-selector")} btnLabel="Log in"/>
  if(route==="tutor-register")   return <AuthForm title="Join as a tutor"      sub="Start teaching and earning on MyTutors24."    fields={[{key:"name",label:"Full name",ph:"Dr. Arjun Sharma"},{key:"email",label:"Email",type:"email",ph:"you@email.com"},{key:"password",label:"Password",type:"password",ph:"Min 8 characters"},{key:"subject",label:"Subject",type:"select",opts:SUBJ_LIST},{key:"city",label:"City",ph:"Delhi"}]} onSubmit={regTut}   loading={loading} error={err} footer={{text:"Already registered?",label:"Log in",fn:()=>go("tutor-login")}}   onBack={()=>go("login-selector")} btnLabel="Create account"/>
  if(route==="student-app"&&student) return <StudentApp user={student} onLogout={()=>{setStudent(null);go("landing")}}/>
  if(route==="tutor-app"&&tutor)     return <TutorApp   user={tutor}   onLogout={()=>{setTutor(null);  go("landing")}}/>
  return <Landing go={go}/>
}







