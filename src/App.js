import { useState, useRef, useEffect, useCallback } from "react"

// ─── SESSION PERSISTENCE ─────────────────────────────────────────────────────
// Saves logged-in user to localStorage so refresh keeps you logged in
const Session = {
  save: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} },
  load: (key)      => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null } catch { return null } },
  clear: (key)     => { try { localStorage.removeItem(key) } catch {} },
}

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
  .bg{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:500;border:1px solid ${C.hairline};color:${C.ink};background:${C.surface};transition:all 120ms;cursor:pointer}
  .bg:hover{background:${C.surfaceAlt};border-color:#c0bcb4}
  .bg:active{transform:scale(.98)}
  .bss{background:${C.successLight};color:${C.success};border:1px solid #86efac;padding:6px 12px;border-radius:7px;font-size:12px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:5px}
  .bss:hover{background:#dcfce7}
  .bds{background:${C.dangerLight};color:${C.danger};border:1px solid #fca5a5;padding:6px 12px;border-radius:7px;font-size:12px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:5px}
  .bds:hover{background:#fee2e2}

  .card{background:${C.surface};border:1px solid ${C.hairline};border-radius:12px}
  .ch{transition:box-shadow 180ms,transform 180ms} .ch:hover{box-shadow:0 4px 20px rgba(0,0,0,.07);transform:translateY(-2px)}

  .pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600}
  .pg{background:${C.accentLight};color:${C.accentText}} .pb{background:#DBEAFE;color:#1E40AF}
  .pr{background:${C.dangerLight};color:${C.danger}} .pa{background:${C.warningLight};color:${C.warning}}
  .pm{background:${C.surfaceAlt};color:${C.muted}} .pp{background:${C.purpleLight};color:${C.purple}}

  .sidebar{width:236px;min-width:236px;height:100vh;position:sticky;top:0;background:${C.ink};display:flex;flex-direction:column;overflow-y:auto;flex-shrink:0}
  .ni{display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:8px;font-size:13.5px;color:rgba(255,255,255,.5);cursor:pointer;transition:all 120ms;margin:1px 10px}
  .ni:hover{background:rgba(255,255,255,.08);color:rgba(255,255,255,.9)} .ni.on{background:${C.accent};color:#fff;font-weight:500}

  .inp{width:100%;padding:9px 13px;border:1px solid ${C.hairline};border-radius:8px;font-size:14px;background:${C.surface};color:${C.ink};outline:none;transition:border-color 120ms,box-shadow 120ms}
  .inp:focus{border-color:${C.accent};box-shadow:0 0 0 3px rgba(13,74,47,.1)}
  .inp::placeholder{color:${C.muted}} textarea.inp{resize:vertical}

  .topbar{height:58px;border-bottom:1px solid ${C.hairline};background:${C.surface};display:flex;align-items:center;padding:0 28px;gap:16px;position:sticky;top:0;z-index:20;flex-shrink:0}
  .layout{display:flex;height:100vh;overflow:hidden}
  .main{flex:1;overflow-y:auto;background:${C.bg}}

  .fi{animation:fi 280ms ease} @keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  .spin{animation:sp .7s linear infinite} @keyframes sp{to{transform:rotate(360deg)}}
  .skel{background:linear-gradient(90deg,${C.surfaceAlt} 25%,${C.hairline} 50%,${C.surfaceAlt} 75%);background-size:200% 100%;animation:sk 1.4s infinite;border-radius:8px} @keyframes sk{0%{background-position:200% 0}100%{background-position:-200% 0}}

  /* ── MESSAGES ── */
  .msg-layout{display:flex;height:100vh;overflow:hidden}
  .contacts{width:280px;min-width:280px;border-right:1px solid ${C.hairline};display:flex;flex-direction:column;background:${C.surface};flex-shrink:0}
  .contact-row{display:flex;gap:12px;align-items:center;padding:14px 16px;cursor:pointer;border-left:3px solid transparent;transition:background 100ms}
  .contact-row:hover{background:${C.surfaceAlt}} .contact-row.sel{background:${C.accentLight};border-left-color:${C.accent}}
  .chat-area{flex:1;display:flex;flex-direction:column;overflow:hidden}
  .chat-hdr{padding:12px 20px;border-bottom:1px solid ${C.hairline};display:flex;align-items:center;gap:12px;background:${C.surface};flex-shrink:0}
  .chat-msgs{flex:1;overflow-y:auto;padding:20px 24px;display:flex;flex-direction:column;gap:8px;background:${C.bg}}
  .chat-inp{padding:12px 16px;border-top:1px solid ${C.hairline};display:flex;gap:10px;background:${C.surface};flex-shrink:0;align-items:center}
  .bubble-me{background:${C.accent};color:#fff;border-radius:18px 18px 4px 18px;padding:10px 14px;font-size:14px;line-height:1.5;max-width:65%;min-width:0;white-space:pre-wrap;word-wrap:break-word;text-align:left}
  .bubble-them{background:${C.surface};border:1px solid ${C.hairline};color:${C.ink};border-radius:18px 18px 18px 4px;padding:10px 14px;font-size:14px;line-height:1.5;max-width:65%;min-width:0;white-space:pre-wrap;word-wrap:break-word;text-align:left}
  .typing-dots{display:inline-flex;gap:4px;align-items:center}
  .dot{width:7px;height:7px;border-radius:50%;background:${C.muted};animation:bounce .9s infinite}
  .dot:nth-child(2){animation-delay:.15s} .dot:nth-child(3){animation-delay:.3s}
  @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
  .unread-badge{background:${C.danger};color:#fff;border-radius:99px;font-size:10px;font-weight:700;padding:1px 6px;min-width:18px;text-align:center;display:inline-block}

  .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:200;display:flex;align-items:center;justify-content:center}
  .modal{background:${C.surface};border-radius:16px;padding:28px;width:480px;max-width:calc(100vw - 32px);max-height:90vh;overflow-y:auto;animation:fi 180ms ease}
  .tab-pill{padding:7px 16px;font-size:13px;font-weight:500;border-radius:8px;color:${C.muted};cursor:pointer;transition:all 120ms;background:none;border:none}
  .tab-pill.on{background:${C.surface};color:${C.ink};box-shadow:0 1px 4px rgba(0,0,0,.1)}
  .star-btn{background:none;border:none;cursor:pointer;padding:2px;transition:transform 100ms} .star-btn:hover{transform:scale(1.2)}
  .toast{position:fixed;bottom:24px;right:24px;background:${C.ink};color:#fff;padding:12px 20px;border-radius:10px;font-size:14px;z-index:300;animation:fi 200ms ease}
`

// ─── API ──────────────────────────────────────────────────────────────────────
const API_BASE = "https://mytutors24-backend.onrender.com/api"
const api = {
  get:  async (p,t)   => { const r=await fetch(`${API_BASE}${p}`,{headers:t?{Authorization:`Bearer ${t}`}:{}}); if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e.error||`${r.status}`)} return r.json() },
  post: async (p,b,t) => { const r=await fetch(`${API_BASE}${p}`,{method:"POST",headers:{"Content-Type":"application/json",...(t?{Authorization:`Bearer ${t}`}:{})},body:JSON.stringify(b)}); if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e.error||`${r.status}`)} return r.json() },
  put:  async (p,b,t) => { const r=await fetch(`${API_BASE}${p}`,{method:"PUT",headers:{"Content-Type":"application/json",...(t?{Authorization:`Bearer ${t}`}:{})},body:JSON.stringify(b)}); if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e.error||`${r.status}`)} return r.json() },
  del:  async (p,t)   => { const r=await fetch(`${API_BASE}${p}`,{method:"DELETE",headers:t?{Authorization:`Bearer ${t}`}:{}}); if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e.error||`${r.status}`)} return r.json() },
}

// ─── SOCKET.IO CLIENT ─────────────────────────────────────────────────────────
const SOCKET_URL = "https://mytutors24-backend.onrender.com"
let _socket = null
function loadSocketIO() {
  return new Promise((res, rej) => {
    if (window.io) { res(window.io); return }
    const s = document.createElement("script")
    s.src = "https://cdn.socket.io/4.7.4/socket.io.min.js"
    s.onload  = () => res(window.io)
    s.onerror = () => rej(new Error("socket.io failed to load"))
    document.head.appendChild(s)
  })
}
async function getSocket() {
  if (_socket && _socket.connected) return _socket
  const io = await loadSocketIO()
  _socket = io(SOCKET_URL, { transports: ["polling"] })
  return _socket
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const INR   = n  => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n)
const ini   = (n="?") => n.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)
const fmtD  = d  => { try { return new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) } catch { return "" } }
const fmtT  = d  => { try { return new Date(d).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) } catch { return "" } }
const fmt1k = n  => n >= 1000 ? `${Math.round(n/1000)}K+` : `${n}+`

// ─── ICONS ───────────────────────────────────────────────────────────────────
const IP = {
  home:  <><path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/><path d="M3 12v9h18"/></>,
  search:<><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></>,
  heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
  msg:   <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
  cal:   <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  shield:<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  pin:   <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
  check: <polyline points="20 6 9 17 4 12"/>,
  x:     <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  arrow: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
  back:  <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
  clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  send:  <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
  chart: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  edit:  <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  logout:<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  book:  <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
  grad:  <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  bell:  <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
  pen:   <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></>,
  trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
}
const I = ({n,size=16,stroke,sw=1.8,style={}}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke||C.ink} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>{IP[n]}</svg>
)

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
const Av = ({name,size=36,color,style={}}) => {
  const p = ["#1a6b3c","#5b21b6","#0369a1","#b45309","#be185d","#0891b2","#7c3aed","#c2410c"]
  let h=0; for(const c of(name||""))h+=c.charCodeAt(0)
  return <div style={{width:size,height:size,borderRadius:"50%",background:color||p[h%p.length],display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.36,fontWeight:700,color:"#fff",flexShrink:0,...style}}>{ini(name)}</div>
}
const Stars = ({rating,size=12}) => (
  <span style={{display:"inline-flex",gap:2}}>
    {[1,2,3,4,5].map(i=><svg key={i} width={size} height={size} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={i<=Math.round(rating)?C.gold:"#E2E8F0"} stroke="none"/></svg>)}
  </span>
)
const StarPicker = ({value,onChange}) => (
  <div style={{display:"flex",gap:6}}>
    {[1,2,3,4,5].map(i=>(
      <button key={i} className="star-btn" onClick={()=>onChange(i)} type="button">
        <svg width={30} height={30} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={i<=value?C.gold:"#E2E8F0"} stroke={i<=value?C.gold:"#CBD5E1"} strokeWidth={1}/></svg>
      </button>
    ))}
  </div>
)
const Spin = ({size=18,light=true}) => <div className="spin" style={{width:size,height:size,borderRadius:"50%",border:`2px solid ${light?"rgba(255,255,255,.3)":C.hairline}`,borderTopColor:light?"#fff":C.accent}}/>
const SPill = ({status}) => {
  const m={confirmed:{c:"pg",l:"Confirmed"},pending:{c:"pa",l:"Pending"},completed:{c:"pm",l:"Completed"},rejected:{c:"pr",l:"Declined"}}
  const s=m[status]||{c:"pm",l:status}
  return <span className={`pill ${s.c}`}>{s.l}</span>
}
function Toast({msg,onDone}) {
  useEffect(()=>{const t=setTimeout(onDone,2800);return()=>clearTimeout(t)},[onDone])
  return <div className="toast">{msg}</div>
}
const TopBar = ({title,right,onBack,onSearch,ph}) => (
  <div className="topbar">
    {onBack&&<button className="bg" onClick={onBack} style={{padding:"6px 10px"}}><I n="back" size={15}/></button>}
    {title&&<h1 style={{fontSize:16,fontWeight:600}}>{title}</h1>}
    {onSearch&&<div style={{position:"relative",flex:1,maxWidth:340}}>
      <I n="search" size={14} stroke={C.muted} style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
      <input className="inp" placeholder={ph||"Search…"} style={{paddingLeft:36}} onChange={e=>onSearch(e.target.value)}/>
    </div>}
    <div style={{flex:1}}/>{right}
  </div>
)
const Sidebar = ({nav,active,onNav,user,onLogout,role}) => (
  <div className="sidebar">
    <div style={{padding:"22px 16px 14px"}}>
      <div className="serif" style={{fontSize:22,fontWeight:600,color:"#fff",letterSpacing:-0.5}}>MyTutors<span style={{color:"#4ade80"}}>24</span></div>
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
    {user&&<div style={{borderTop:"1px solid rgba(255,255,255,.07)",padding:12}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"6px 8px",borderRadius:8}}>
        <Av name={user.name} size={30}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12.5,fontWeight:500,color:"rgba(255,255,255,.82)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.3)"}}>{user.email||""}</div>
        </div>
        <button onClick={onLogout} style={{background:"none",border:"none",cursor:"pointer",padding:5}}><I n="logout" size={14} stroke="rgba(255,255,255,.35)"/></button>
      </div>
    </div>}
  </div>
)

// ─── MESSAGING ────────────────────────────────────────────────────────────────
function Messaging({user, userType, contacts}) {
  const [msgs,    setMsgs]    = useState([])
  const [threads, setThreads] = useState([])
  const [selId,   setSelId]   = useState(null)
  const [draft,   setDraft]   = useState("")
  const [search,  setSearch]  = useState("")
  const [typing,  setTyping]  = useState(false)
  const [unread,  setUnread]  = useState({})
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [conn,    setConn]    = useState(false)
  const socketRef   = useRef(null)
  const typingTimer = useRef(null)
  const endRef      = useRef(null)
  const inputRef    = useRef(null)

  const tid = useCallback(cid => userType==="student" ? `s${user.id}_t${cid}` : `s${cid}_t${user.id}`, [user.id, userType])

  // Connect Socket.IO
  useEffect(()=>{
    let alive = true
    getSocket().then(socket=>{
      if(!alive) return
      socketRef.current = socket
      setConn(socket.connected)
      socket.emit("join",{userId:user.id, role:userType})

      socket.on("receive_message", msg=>{
        setMsgs(prev=>{
          if(msg.thread_id===tid(selIdRef.current)) return [...prev, msg]
          return prev
        })
        setUnread(prev=>{
          if(msg.thread_id!==tid(selIdRef.current))
            return {...prev,[msg.sender_id]:(prev[msg.sender_id]||0)+1}
          return prev
        })
        setThreads(prev=>prev.map(t=>t.thread_id===msg.thread_id?{...t,last_msg:msg.text,last_at:msg.created_at}:t))
      })
      socket.on("typing",      ()=>setTyping(true))
      socket.on("stop_typing", ()=>setTyping(false))
      socket.on("connect",     ()=>setConn(true))
      socket.on("disconnect",  ()=>setConn(false))
    }).catch(()=>{})
    return ()=>{
      alive = false
      socketRef.current?.off("receive_message")
      socketRef.current?.off("typing")
      socketRef.current?.off("stop_typing")
    }
  },[user.id, userType])

  // Ref trick so socket callback can read current selId
  const selIdRef = useRef(selId)
  useEffect(()=>{ selIdRef.current = selId },[selId])

  // Load threads
  useEffect(()=>{
    setLoading(true)
    api.get(`/messages/threads?userId=${user.id}&role=${userType}`, user.token)
      .then(data=>{
        setThreads(Array.isArray(data)?data:[])
        const u={}
        ;(Array.isArray(data)?data:[]).forEach(t=>{if(t.unread>0)u[t.contact_id]=t.unread})
        setUnread(u)
      })
      .catch(()=>{})
      .finally(()=>setLoading(false))
  },[user.id, user.token, userType])

  // Load messages for selected contact
  useEffect(()=>{
    if(!selId) return
    setMsgs([])
    api.get(`/messages/${tid(selId)}`, user.token)
      .then(data=>setMsgs(Array.isArray(data)?data:[]))
      .catch(()=>setMsgs([]))
    setUnread(prev=>({...prev,[selId]:0}))
    setTimeout(()=>inputRef.current?.focus(), 50)
  },[selId, user.token])

  // Auto-scroll
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}) },[msgs, typing])

  const sendMessage = async () => {
    if(!draft.trim()||!selId||sending) return
    const text = draft.trim()
    setDraft("")
    setSending(true)
    const opt = {id:`opt_${Date.now()}`,thread_id:tid(selId),sender_id:user.id,sender_type:userType,receiver_id:selId,text,created_at:new Date().toISOString()}
    setMsgs(prev=>[...prev,opt])
    socketRef.current?.emit("stop_typing",{senderId:user.id,receiverId:selId,receiverType:userType==="student"?"tutor":"student"})
    try {
      const saved = await api.post("/messages",{receiverId:selId,text},user.token)
      setMsgs(prev=>prev.map(m=>m.id===opt.id?saved:m))
      const contact = contacts.find(c=>c.id===selId)
      setThreads(prev=>{
        const exists = prev.find(t=>t.contact_id===selId)
        if(exists) return prev.map(t=>t.contact_id===selId?{...t,last_msg:text,last_at:saved.created_at}:t)
        return [{thread_id:tid(selId),contact_id:selId,contact_name:contact?.name,subject:contact?.subject,col:contact?.col,last_msg:text,last_at:saved.created_at,unread:0},...prev]
      })
    } catch{}
    setSending(false)
    inputRef.current?.focus()
  }

  const handleDraftChange = val => {
    setDraft(val)
    if(!socketRef.current||!selId) return
    const rt = userType==="student"?"tutor":"student"
    socketRef.current.emit("typing",{senderId:user.id,receiverId:selId,receiverType:rt})
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(()=>socketRef.current?.emit("stop_typing",{senderId:user.id,receiverId:selId,receiverType:rt}),2000)
  }

  const handleKey = e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage()} }

  // Merge API threads + prop contacts (so you can start new conversations)
  const sidebar = (() => {
    const fromAPI = threads.map(t=>({id:t.contact_id,name:t.contact_name,subject:t.subject,col:t.col,lastMsg:t.last_msg,lastAt:t.last_at}))
    const seen    = new Set(fromAPI.map(c=>c.id))
    const fresh   = contacts.filter(c=>!seen.has(c.id)).map(c=>({...c,lastMsg:"",lastAt:""}))
    return [...fromAPI,...fresh]
  })()

  const filtered    = sidebar.filter(c=>c.name?.toLowerCase().includes(search.toLowerCase())||c.subject?.toLowerCase().includes(search.toLowerCase()))
  const selContact  = sidebar.find(c=>c.id===selId)||contacts.find(c=>c.id===selId)
  const totalUnread = Object.values(unread).reduce((a,b)=>a+b,0)

  return (
    <div className="msg-layout">
      {/* Sidebar */}
      <div className="contacts">
        <div style={{padding:"14px 16px 10px",borderBottom:`1px solid ${C.hairline}`}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <span style={{fontSize:15,fontWeight:600}}>Messages</span>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {totalUnread>0&&<span className="unread-badge">{totalUnread}</span>}
              <div style={{width:7,height:7,borderRadius:"50%",background:conn?C.success:C.danger}} title={conn?"Connected":"Offline"}/>
            </div>
          </div>
          <div style={{position:"relative"}}>
            <I n="search" size={14} stroke={C.muted} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
            <input className="inp" placeholder="Search…" style={{paddingLeft:34,fontSize:13}} value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
        </div>
        <div style={{overflowY:"auto",flex:1}}>
          {loading&&[0,1,2,3].map(i=>(
            <div key={i} style={{display:"flex",gap:12,padding:"14px 16px",alignItems:"center"}}>
              <div className="skel" style={{width:42,height:42,borderRadius:"50%",flexShrink:0}}/>
              <div style={{flex:1}}><div className="skel" style={{height:13,marginBottom:6}}/><div className="skel" style={{height:11,width:"70%"}}/></div>
            </div>
          ))}
          {!loading&&filtered.length===0&&<div style={{padding:"40px 16px",textAlign:"center",color:C.muted,fontSize:13}}>No conversations yet</div>}
          {!loading&&filtered.map(c=>{
            const uc=unread[c.id]||0
            return (
              <div key={c.id} className={`contact-row${selId===c.id?" sel":""}`} onClick={()=>setSelId(c.id)}>
                <Av name={c.name} size={42} color={c.col}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                    <span style={{fontSize:13,fontWeight:uc>0?600:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</span>
                    <span style={{fontSize:10,color:C.muted,flexShrink:0,marginLeft:6}}>{c.lastAt?fmtT(c.lastAt):""}</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:12,color:uc>0?C.ink:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:uc>0?500:400}}>
                      {c.lastMsg||<span style={{fontStyle:"italic",color:C.muted}}>Start a conversation</span>}
                    </span>
                    {uc>0&&<span className="unread-badge" style={{flexShrink:0,marginLeft:6}}>{uc}</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Chat */}
      <div className="chat-area">
        {!selContact?(
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted,flexDirection:"column",gap:12,height:"100%"}}>
            <I n="msg" size={40} stroke={C.hairline}/>
            <p style={{fontSize:15}}>Select a conversation</p>
          </div>
        ):(
          <>
            <div className="chat-hdr">
              <Av name={selContact.name} size={40} color={selContact.col}/>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600}}>{selContact.name}</div>
                <div style={{fontSize:12,color:C.muted,display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:conn?C.success:"#ccc"}}/>
                  {conn?"Online":"Offline"}{selContact.subject?` · ${selContact.subject}`:""}
                </div>
              </div>
            </div>

            <div className="chat-msgs">
              {msgs.length===0&&(
                <div style={{textAlign:"center",padding:"60px 0",color:C.muted}}>
                  <I n="msg" size={28} stroke={C.hairline} style={{marginBottom:8}}/>
                  <p style={{fontSize:14}}>No messages yet. Say hello!</p>
                </div>
              )}
              {msgs.map((m,idx)=>{
                const isMine   = m.sender_type===userType
                const prev     = msgs[idx-1]
                const showDate = idx===0||fmtD(prev?.created_at||0)!==fmtD(m.created_at)
                return (
                  <div key={m.id}>
                    {showDate&&(
                      <div style={{textAlign:"center",margin:"12px 0"}}>
                        <span style={{fontSize:11,color:C.muted,background:C.bg,padding:"3px 12px",borderRadius:99,border:`1px solid ${C.hairline}`}}>{fmtD(m.created_at)}</span>
                      </div>
                    )}
                    <div style={{display:"flex",justifyContent:isMine?"flex-end":"flex-start",alignItems:"flex-end",gap:8,marginBottom:2}}>
                      {!isMine&&<Av name={selContact.name} size={26} color={selContact.col}/>}
                      <div>
                        <div className={isMine?"bubble-me":"bubble-them"}>{m.text}</div>
                        <div style={{fontSize:10,color:C.muted,marginTop:3,textAlign:isMine?"right":"left"}}>{fmtT(m.created_at)}</div>
                      </div>
                      {isMine&&<Av name={user.name} size={26} style={{opacity:.6}}/>}
                    </div>
                  </div>
                )
              })}
              {typing&&(
                <div style={{display:"flex",alignItems:"flex-end",gap:8}}>
                  <Av name={selContact.name} size={26} color={selContact.col}/>
                  <div className="bubble-them" style={{padding:"10px 14px"}}>
                    <div className="typing-dots"><div className="dot"/><div className="dot"/><div className="dot"/></div>
                  </div>
                </div>
              )}
              <div ref={endRef}/>
            </div>

            {/* Single-line input — no vertical growth issue */}
            <div className="chat-inp">
              <input
                ref={inputRef}
                className="inp"
                value={draft}
                onChange={e=>handleDraftChange(e.target.value)}
                onKeyDown={handleKey}
                placeholder={`Message ${selContact.name}… (Enter to send)`}
                style={{flex:1}}
              />
              <button className="bp" onClick={sendMessage} disabled={!draft.trim()||sending} style={{padding:"9px 16px",flexShrink:0}}>
                {sending?<Spin/>:<I n="send" size={15} stroke="#fff"/>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── LANDING ─────────────────────────────────────────────────────────────────
function Landing({go}) {
  const [stats,    setStats]    = useState(null)
  const [featured, setFeatured] = useState(null)
  const [live,     setLive]     = useState(false)

  useEffect(()=>{
    api.get("/stats").then(d=>{setStats(d);setLive(true)}).catch(()=>setStats({tutors:0,students:0,avgRating:0,cities:0}))
    api.get("/reviews?featured=true").then(d=>setFeatured(Array.isArray(d)?d:[])).catch(()=>setFeatured([]))
  },[])

  const steps=[{n:"01",t:"Tell us what you need",d:"Subject, level, schedule, budget — takes about a minute."},{n:"02",t:"Meet your matches",d:"We shortlist verified tutors who fit. Read reviews, watch intros."},{n:"03",t:"Book a free first session",d:"See if you click before you pay. No card needed up front."}]
  const subjs=["IIT-JEE","NEET","Mathematics","Physics","Chemistry","English","UPSC","Coding","Commerce","Arts & Music"]

  return (
    <div style={{background:C.surface,color:C.ink,minHeight:"100vh"}}>
      <style>{CSS}</style>
      <nav style={{position:"sticky",top:0,zIndex:50,background:"rgba(255,255,255,.92)",backdropFilter:"blur(14px)",borderBottom:`1px solid ${C.hairline}`}}>
        <div style={{maxWidth:1160,margin:"0 auto",padding:"0 28px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div className="serif" style={{fontSize:24,fontWeight:600,color:C.accent}}>MyTutors<span style={{color:C.ink}}>24</span></div>
          <div style={{display:"flex",gap:28,alignItems:"center"}}>
            <button className="bg" onClick={()=>go("login-selector")} style={{fontSize:14}}>Log in</button>
            <button className="bp" onClick={()=>go("student-register")} style={{fontSize:14}}>Get started free</button>
          </div>
        </div>
      </nav>

      <section style={{maxWidth:1160,margin:"0 auto",padding:"88px 28px 80px",textAlign:"center"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:C.accentLight,color:C.accentText,padding:"6px 16px",borderRadius:99,fontSize:13,fontWeight:600,marginBottom:28}}>
          <I n="shield" size={13} stroke={C.accentText}/> India's most trusted 1-on-1 tutoring platform
        </div>
        <h1 className="serif" style={{fontSize:64,lineHeight:1.05,marginBottom:20,letterSpacing:-1.5}}>
          Find your perfect tutor.<br/><span style={{color:C.accent}}>Start learning today.</span>
        </h1>
        <p style={{fontSize:19,color:C.muted,maxWidth:500,margin:"0 auto 42px",lineHeight:1.65}}>IIT-JEE, NEET, Board exams, Coding and 200+ subjects. Verified tutors, real results.</p>
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          <button className="bp" onClick={()=>go("student-register")} style={{padding:"13px 28px",fontSize:15}}>Find my tutor <I n="arrow" size={15} stroke="#fff"/></button>
          <button className="bg" onClick={()=>go("tutor-register")} style={{padding:"13px 24px",fontSize:15}}>Teach on MyTutors24</button>
        </div>
      </section>

      {/* Live stats */}
      <section style={{background:C.ink}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",padding:"0 28px"}}>
          {[{v:stats?fmt1k(stats.tutors):"…",l:"Verified tutors"},{v:stats?fmt1k(stats.students):"…",l:"Students taught"},{v:stats?`${stats.avgRating}★`:"…",l:"Avg rating"},{v:stats?`${stats.cities}+`:"…",l:"Cities"}].map((s,i)=>(
            <div key={s.l} style={{textAlign:"center",padding:"34px 16px",borderRight:i<3?"1px solid rgba(255,255,255,.07)":"none"}}>
              {!stats?<div className="skel" style={{height:44,width:90,margin:"0 auto 8px"}}/>:<div className="serif" style={{fontSize:40,color:"#fff",marginBottom:4}}>{s.v}</div>}
              <div style={{fontSize:14,color:"rgba(255,255,255,.4)"}}>{s.l}</div>
            </div>
          ))}
        </div>
        {live&&<div style={{textAlign:"center",padding:"5px 0",fontSize:11,color:"rgba(255,255,255,.18)"}}>● live</div>}
      </section>

      {/* Subjects */}
      <section style={{maxWidth:1160,margin:"0 auto",padding:"80px 28px"}}>
        <h2 className="serif" style={{fontSize:36,textAlign:"center",marginBottom:8}}>Browse by subject</h2>
        <p style={{color:C.muted,textAlign:"center",marginBottom:36,fontSize:15}}>Experts across every competitive exam and curriculum</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
          {subjs.map(s=><button key={s} className="bg" onClick={()=>go("student-login")} style={{padding:"10px 20px",fontSize:14}}>{s}</button>)}
        </div>
      </section>

      {/* How it works */}
      <section style={{background:C.bg,padding:"80px 28px"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <h2 className="serif" style={{fontSize:36,textAlign:"center",marginBottom:8}}>How it works</h2>
          <p style={{color:C.muted,textAlign:"center",marginBottom:50,fontSize:15}}>Simple, fast, effective.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:26}}>
            {steps.map(s=><div key={s.n} className="card" style={{padding:28}}>
              <div className="serif" style={{fontSize:42,color:C.accent,marginBottom:14,lineHeight:1}}>{s.n}</div>
              <h3 style={{fontSize:16,fontWeight:600,marginBottom:8}}>{s.t}</h3>
              <p style={{fontSize:14,color:C.muted,lineHeight:1.7}}>{s.d}</p>
            </div>)}
          </div>
        </div>
      </section>

      {/* Featured reviews — admin curated */}
      <section style={{maxWidth:1160,margin:"0 auto",padding:"80px 28px"}}>
        <h2 className="serif" style={{fontSize:36,textAlign:"center",marginBottom:6}}>What students say</h2>
        <p style={{color:C.muted,textAlign:"center",marginBottom:46,fontSize:14}}>Selected from verified reviews by our team</p>
        {!featured?(
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:22}}>
            {[0,1,2].map(i=><div key={i} className="card" style={{padding:28}}><div className="skel" style={{height:16,width:80,marginBottom:16}}/><div className="skel" style={{height:64,marginBottom:16}}/><div style={{display:"flex",gap:10}}><div className="skel" style={{width:36,height:36,borderRadius:"50%"}}/><div style={{flex:1}}><div className="skel" style={{height:13,marginBottom:6}}/><div className="skel" style={{height:11,width:"60%"}}/></div></div></div>)}
          </div>
        ):featured.length===0?(
          <div style={{textAlign:"center",padding:"40px 0",color:C.muted}}>
            <p style={{fontSize:15}}>No featured reviews yet. Reviews will appear here once the admin features them.</p>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:22}}>
            {featured.map(r=>(
              <div key={r.id} className="card" style={{padding:28}}>
                <Stars rating={r.rating}/>
                <p style={{fontSize:15,lineHeight:1.75,margin:"14px 0 20px"}}>"{r.text}"</p>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <Av name={r.author} size={36}/>
                  <div><div style={{fontSize:13,fontWeight:600}}>{r.author}</div><div style={{fontSize:12,color:C.muted}}>{r.detail}</div></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{background:C.accent,padding:"80px 28px",textAlign:"center"}}>
        <h2 className="serif" style={{fontSize:40,color:"#fff",marginBottom:10}}>Ready to start learning?</h2>
        <p style={{color:"rgba(255,255,255,.65)",fontSize:17,marginBottom:30}}>Join {stats?fmt1k(stats.students):"thousands of"} students achieving their goals.</p>
        <button className="bp" onClick={()=>go("student-register")} style={{background:"#fff",color:C.accent,padding:"13px 28px",fontSize:15}}>Get started free <I n="arrow" size={15} stroke={C.accent}/></button>
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
            <div style={{width:44,height:44,borderRadius:10,background:C.accentLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><I n={o.icon} size={20} stroke={C.accent}/></div>
            <div style={{flex:1}}><div style={{fontSize:15,fontWeight:600,marginBottom:2}}>{o.label}</div><div style={{fontSize:13,color:C.muted}}>{o.sub}</div></div>
            <I n="arrow" size={16} stroke={C.muted}/>
          </button>
        ))}
      </div>
    </div>
  )
}

function AuthForm({title,sub,fields,onSubmit,loading,error,footer,onBack,btnLabel="Log in"}) {
  const [form,setForm]=useState({})
  const set=(k,v)=>setForm(p=>({...p,[k]:v}))
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
                ?<select className="inp" onChange={e=>set(f.key,e.target.value)} defaultValue=""><option value="" disabled>Select…</option>{f.opts.map(o=><option key={o} value={o}>{o}</option>)}</select>
                :<input className="inp" type={f.type||"text"} placeholder={f.ph} onChange={e=>set(f.key,e.target.value)}/>
              }
            </div>
          ))}
          {error&&<div style={{background:C.dangerLight,color:C.danger,padding:"10px 14px",borderRadius:8,fontSize:13,marginBottom:16}}>{error}</div>}
          <button className="bp" onClick={()=>onSubmit(form)} style={{width:"100%",justifyContent:"center",padding:"12px 20px",marginTop:4}}>
            {loading?<Spin/>:btnLabel}
          </button>
        </div>
        {footer&&<p style={{textAlign:"center",fontSize:13,color:C.muted,marginTop:14}}>{footer.text} <button onClick={footer.fn} style={{color:C.accent,fontWeight:600,background:"none",border:"none",cursor:"pointer"}}>{footer.label}</button></p>}
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
        <Stars rating={tutor.rating||0}/><span style={{fontSize:12,fontWeight:700}}>{tutor.rating||"New"}</span>
        {tutor.reviews>0&&<span style={{fontSize:12,color:C.muted}}>({tutor.reviews})</span>}
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
        {tutor.city&&<span style={{fontSize:12,color:C.muted,display:"flex",alignItems:"center",gap:4}}><I n="pin" size={12} stroke={C.muted}/>{tutor.city}</span>}
        <span style={{fontSize:12,color:C.muted,display:"flex",alignItems:"center",gap:4}}><I n="globe" size={12} stroke={C.muted}/>{tutor.mode}</span>
        <span className="pill pg" style={{fontSize:11}}><I n="shield" size={10} stroke={C.accentText}/>Verified</span>
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
  const [page,    setPage]    = useState("home")
  const [selT,    setSelT]    = useState(null)
  const [prev,    setPrev]    = useState("tutors")
  const [favs,    setFavs]    = useState(()=>Session.load("favs")||[])
  const [bookings,setBk]      = useState([])
  const [bkTutor, setBkTutor] = useState(null)
  const [toast,   setToast]   = useState(null)
  const [tutors,  setTutors]  = useState([])

  // Fetch approved tutors from real backend
  useEffect(()=>{
    api.get("/tutors").then(setTutors).catch(()=>setTutors([]))
    const interval = setInterval(()=>{
      api.get("/tutors").then(setTutors).catch(()=>{})
    }, 30000)
    return ()=>clearInterval(interval)
  },[])

  const msgContacts = tutors.slice(0,8)
  const nav=[{key:"home",label:"Home",icon:"home"},{key:"tutors",label:"Browse tutors",icon:"search"},{key:"favorites",label:"Saved tutors",icon:"heart"},{key:"messages",label:"Messages",icon:"msg"},{key:"dashboard",label:"My sessions",icon:"cal"}]

  const viewT = (t,from) => { setSelT(t); setPrev(from||page); setPage("profile") }
  const togFav = id => { const n=favs.includes(id)?favs.filter(x=>x!==id):[...favs,id]; setFavs(n); Session.save("favs",n) }
  const addBk  = b  => { setBk(p=>[b,...p]); setBkTutor(null); setToast("Booking sent! Awaiting tutor confirmation.") }

  return (
    <div className="layout">
      <style>{CSS}</style>
      <Sidebar nav={nav} active={page==="profile"?prev:page} onNav={setPage} user={user} onLogout={onLogout} role="Student"/>
      <div className="main">
        {page==="home"      &&<SHome      tutors={tutors} onView={t=>viewT(t,"home")}    favs={favs} togFav={togFav}/>}
        {page==="tutors"    &&<SBrowse    tutors={tutors} onView={t=>viewT(t,"tutors")}  favs={favs} togFav={togFav}/>}
        {page==="favorites" &&<SFavs      tutors={tutors.filter(t=>favs.includes(t.id))} onView={t=>viewT(t,"favorites")} favs={favs} togFav={togFav}/>}
        {page==="messages"  &&<Messaging  user={user} userType="student" contacts={msgContacts}/>}
        {page==="dashboard" &&<SDash      user={user} bookings={bookings} onBrowse={()=>setPage("tutors")} onBk={setBk}/>}
        {page==="profile"   &&selT&&<TutorProfilePage tutor={selT} onBack={()=>setPage(prev)} isFav={favs.includes(selT.id)} onFav={()=>togFav(selT.id)} onBook={t=>setBkTutor(t)} onMsg={()=>setPage("messages")} user={user}/>}
      </div>
      {bkTutor&&<BkModal tutor={bkTutor} user={user} onClose={()=>setBkTutor(null)} onConfirm={addBk}/>}
      {toast&&<Toast msg={toast} onDone={()=>setToast(null)}/>}
    </div>
  )
}

function SHome({tutors,onView,favs,togFav}) {
  const top=[...tutors].sort((a,b)=>(b.rating||0)-(a.rating||0)).slice(0,4)
  return (
    <div className="fi">
      <TopBar title="Home"/>
      <div style={{padding:"28px 32px"}}>
        <section style={{marginBottom:44}}>
          <div style={{fontSize:11,fontWeight:600,color:C.muted,letterSpacing:1.2,textTransform:"uppercase",marginBottom:14}}>Quick browse</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["IIT-JEE","NEET","Mathematics","Physics","English","UPSC","Coding","Commerce"].map(s=><button key={s} className="bg" style={{fontSize:13}}>{s}</button>)}
          </div>
        </section>
        {top.length===0?(
          <div style={{textAlign:"center",padding:"60px 0",color:C.muted}}>
            <I n="search" size={32} stroke={C.hairline} style={{marginBottom:12}}/>
            <p style={{fontSize:15}}>No approved tutors yet. Check back soon!</p>
          </div>
        ):(
          <section style={{marginBottom:44}}>
            <div style={{fontSize:11,fontWeight:600,color:C.muted,letterSpacing:1.2,textTransform:"uppercase",marginBottom:16}}>Top-rated tutors</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(256px,1fr))",gap:16}}>
              {top.map(t=><TCard key={t.id} tutor={t} onView={onView} onFav={togFav} isFav={favs.includes(t.id)}/>)}
            </div>
          </section>
        )}
        <section>
          <div style={{background:C.accent,borderRadius:14,padding:"28px 32px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div className="serif" style={{fontSize:22,color:"#fff",marginBottom:4}}>Ready to crack IIT-JEE 2026?</div><div style={{fontSize:14,color:"rgba(255,255,255,.6)"}}>Browse our top-rated tutors.</div></div>
          </div>
        </section>
      </div>
    </div>
  )
}

function SBrowse({tutors,onView,favs,togFav}) {
  const [q,setQ]=useState("")
  const [subj,setSubj]=useState("")
  const [mode,setMode]=useState("")
  const [sort,setSort]=useState("rating")
  const subjects=[...new Set(tutors.map(t=>t.subject))]
  const filtered=tutors.filter(t=>{
    const qq=q.toLowerCase()
    return(!q||t.name.toLowerCase().includes(qq)||t.subject.toLowerCase().includes(qq)||(t.bio||"").toLowerCase().includes(qq))
      &&(!subj||t.subject===subj)&&(!mode||t.mode===mode)
  }).sort((a,b)=>sort==="price"?a.price-b.price:sort==="price-d"?b.price-a.price:(b.rating||0)-(a.rating||0))
  return (
    <div className="fi">
      <TopBar title="Browse Tutors" onSearch={setQ} ph="Search by name, subject, or keyword…"/>
      <div style={{padding:"20px 32px"}}>
        <div style={{display:"flex",gap:10,marginBottom:22,flexWrap:"wrap",alignItems:"center"}}>
          <select className="inp" style={{width:190}} onChange={e=>setSubj(e.target.value)}><option value="">All subjects</option>{subjects.map(s=><option key={s} value={s}>{s}</option>)}</select>
          <select className="inp" style={{width:148}} onChange={e=>setMode(e.target.value)}><option value="">All modes</option><option>Online</option><option>Offline</option><option>Hybrid</option></select>
          <select className="inp" style={{width:158}} onChange={e=>setSort(e.target.value)}><option value="rating">Top rated</option><option value="price">Price: Low–High</option><option value="price-d">Price: High–Low</option></select>
          <span style={{fontSize:13,color:C.muted,marginLeft:"auto"}}>{filtered.length} tutors</span>
        </div>
        {filtered.length===0
          ?<div style={{textAlign:"center",padding:"60px 0",color:C.muted}}><I n="search" size={32} stroke={C.hairline}/><p style={{marginTop:12,fontSize:15}}>{tutors.length===0?"No tutors have been approved yet.":"No tutors match your search."}</p></div>
          :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(256px,1fr))",gap:16}}>{filtered.map(t=><TCard key={t.id} tutor={t} onView={onView} onFav={togFav} isFav={favs.includes(t.id)}/>)}</div>
        }
      </div>
    </div>
  )
}

function TutorProfilePage({tutor,onBack,isFav,onFav,onBook,onMsg,user}) {
  const [tab,  setTab]    = useState("about")
  const [revs, setRevs]   = useState([])
  const [showRF, setShowRF] = useState(false)

  useEffect(()=>{
    api.get(`/reviews?tutorId=${tutor.id}`).then(setRevs).catch(()=>setRevs([]))
  },[tutor.id])

  const addReview = async r => {
    try {
      const saved = await api.post("/reviews",{tutorId:tutor.id,...r,featured:false,status:"published"},user.token)
      setRevs(p=>[saved,...p])
    } catch(e) { alert(e.message) }
    setShowRF(false)
  }

  return (
    <div className="fi">
      <TopBar onBack={onBack} right={<div style={{display:"flex",gap:8}}>
        <button onClick={onFav} className="bg">
          <svg width={15} height={15} viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={isFav?C.danger:"none"} stroke={isFav?C.danger:C.ink} strokeWidth={1.8}/></svg>
          {isFav?"Saved":"Save"}
        </button>
        <button onClick={onMsg} className="bg"><I n="msg" size={15}/> Message</button>
      </div>}/>
      <div style={{maxWidth:860,margin:"0 auto",padding:"28px 32px"}}>
        <div className="card" style={{padding:28,marginBottom:18}}>
          <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
            <Av name={tutor.name} size={68} color={tutor.col}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <h1 style={{fontSize:22,fontWeight:700}}>{tutor.name}</h1>
                <span className="pill pg"><I n="shield" size={10} stroke={C.accentText}/>Approved</span>
                {tutor.badge&&<span className="pill pp">{tutor.badge}</span>}
              </div>
              <div style={{fontSize:14,color:C.muted,marginBottom:12}}>{tutor.subject}</div>
              <div style={{display:"flex",gap:18,flexWrap:"wrap"}}>
                {[{i:"pin",t:tutor.city||"India"},{i:"globe",t:tutor.mode},{i:"clock",t:`${tutor.experience||1} yrs exp.`},{i:"users",t:`${tutor.students||0}+ students`}].map(x=><span key={x.t} style={{fontSize:13,color:C.muted,display:"flex",alignItems:"center",gap:5}}><I n={x.i} size={13} stroke={C.muted}/>{x.t}</span>)}
              </div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:26,fontWeight:700}}>{INR(tutor.price)}<span style={{fontSize:13,fontWeight:400,color:C.muted}}>/hr</span></div>
              <div style={{display:"flex",alignItems:"center",gap:5,justifyContent:"flex-end",margin:"6px 0 14px"}}>
                <Stars rating={tutor.rating||0}/><span style={{fontSize:13,fontWeight:700}}>{tutor.rating||"New"}</span>
                {tutor.reviews>0&&<span style={{fontSize:13,color:C.muted}}>({tutor.reviews})</span>}
              </div>
              <button className="bp" onClick={()=>onBook(tutor)} style={{padding:"11px 22px"}}>Book a session <I n="cal" size={14} stroke="#fff"/></button>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:18,background:C.surfaceAlt,padding:4,borderRadius:10,width:"fit-content"}}>
          {["about","reviews"].map(t=><button key={t} className={`tab-pill${tab===t?" on":""}`} onClick={()=>setTab(t)} style={{textTransform:"capitalize"}}>{t}{t==="reviews"?` (${revs.length})`:""}</button>)}
        </div>
        {tab==="about"&&<div className="card" style={{padding:28}}>
          <div style={{fontSize:11,fontWeight:600,color:C.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>About</div>
          <p style={{fontSize:14.5,lineHeight:1.8,marginBottom:24}}>{tutor.bio||"No bio provided yet."}</p>
          <div style={{fontSize:11,fontWeight:600,color:C.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Expertise</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[tutor.subject,"Concept building","Test strategy","Doubt clearing"].map(s=><span key={s} className="pill pg" style={{fontSize:13,padding:"5px 12px"}}>{s}</span>)}
          </div>
        </div>}
        {tab==="reviews"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontSize:13,color:C.muted}}>{revs.length} review{revs.length!==1?"s":""}</div>
            <button className="bp" onClick={()=>setShowRF(true)} style={{padding:"7px 16px",fontSize:13}}><I n="pen" size={13} stroke="#fff"/> Write a review</button>
          </div>
          <div className="card" style={{overflow:"hidden"}}>
            {revs.length===0?<div style={{padding:"40px 24px",textAlign:"center",color:C.muted,fontSize:14}}>No reviews yet. Be the first!</div>:
            revs.map((r,i)=><div key={r.id} style={{padding:"20px 24px",borderBottom:i<revs.length-1?`1px solid ${C.hairline}`:"none"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}><Av name={r.author} size={34}/><div><div style={{fontSize:13,fontWeight:600}}>{r.author}</div><Stars rating={r.rating} size={11}/></div></div>
                <span style={{fontSize:12,color:C.muted}}>{fmtD(r.created_at)}</span>
              </div>
              <p style={{fontSize:14,color:C.muted,lineHeight:1.65}}>{r.text}</p>
            </div>)}
          </div>
        </div>}
      </div>
      {showRF&&<ReviewModal tutorName={tutor.name} onClose={()=>setShowRF(false)} onSubmit={addReview}/>}
    </div>
  )
}

function SFavs({tutors,onView,favs,togFav}) {
  return (
    <div className="fi"><TopBar title={`Saved tutors (${tutors.length})`}/>
      <div style={{padding:"28px 32px"}}>
        {tutors.length===0?<div style={{textAlign:"center",padding:"80px 0",color:C.muted}}><svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={C.hairline} strokeWidth={1.5} style={{marginBottom:12}}>{IP.heart}</svg><p style={{fontSize:15}}>No saved tutors yet. Tap ♥ on any tutor.</p></div>
        :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(256px,1fr))",gap:16}}>{tutors.map(t=><TCard key={t.id} tutor={t} onView={onView} onFav={togFav} isFav={favs.includes(t.id)}/>)}</div>}
      </div>
    </div>
  )
}

function SDash({user,bookings,onBrowse,onBk}) {
  const [revTarget,setRevTarget]=useState(null)
  const [bks,setBks]=useState(bookings)

  useEffect(()=>{
    api.get(`/bookings/student/${user.id}`,user.token).then(setBks).catch(()=>{})
  },[user.id,user.token])

  const c={total:bks.length,pending:bks.filter(b=>b.status==="pending").length,confirmed:bks.filter(b=>b.status==="confirmed").length,completed:bks.filter(b=>b.status==="completed").length}
  return (
    <div className="fi"><TopBar title="My Sessions"/>
      <div style={{padding:"24px 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
          {[{l:"Total",v:c.total},{l:"Pending",v:c.pending},{l:"Confirmed",v:c.confirmed},{l:"Completed",v:c.completed}].map(s=>(
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
          {bks.length===0?<div style={{padding:"56px 32px",textAlign:"center",color:C.muted}}>No sessions yet. <button onClick={onBrowse} style={{color:C.accent,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Browse tutors</button></div>
          :bks.map((b,i)=>(
            <div key={b.id} style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:16,borderBottom:i<bks.length-1?`1px solid ${C.hairline}`:"none"}}>
              <Av name={b.tutor_name} size={38}/>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:500}}>{b.tutor_name}</div><div style={{fontSize:12,color:C.muted}}>{b.subject} · {fmtD(b.date)} · {b.time}</div></div>
              <SPill status={b.status}/>
              <div style={{fontSize:14,fontWeight:700,minWidth:68,textAlign:"right"}}>{INR(b.price)}</div>
              {b.status==="completed"&&!b.reviewed&&<button className="bg" style={{fontSize:12,padding:"5px 10px",flexShrink:0}} onClick={()=>setRevTarget(b)}><I n="pen" size={13}/> Review</button>}
              {b.status==="completed"&&b.reviewed&&<span className="pill pg" style={{fontSize:11,flexShrink:0}}><I n="check" size={10} stroke={C.accentText}/>Reviewed</span>}
            </div>
          ))}
        </div>
      </div>
      {revTarget&&<ReviewModal tutorName={revTarget.tutor_name} onClose={()=>setRevTarget(null)} onSubmit={async r=>{
        try { await api.post("/reviews",{tutorId:revTarget.tutor_id,...r,featured:false,status:"published"},user.token)
          setBks(p=>p.map(b=>b.id===revTarget.id?{...b,reviewed:1}:b))
        } catch(e){alert(e.message)}
        setRevTarget(null)
      }}/>}
    </div>
  )
}

function ReviewModal({tutorName,onClose,onSubmit}) {
  const [rating,setRating]=useState(5)
  const [text,setText]=useState("")
  const [name,setName]=useState("")
  const [done,setDone]=useState(false)
  const [loading,setLoading]=useState(false)
  const submit = async () => {
    if(!text.trim()||!name.trim()) return
    setLoading(true)
    await onSubmit({rating,text:text.trim(),author:name.trim(),detail:"Verified student"})
    setDone(true); setLoading(false)
  }
  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&!done&&onClose()}>
      <div className="modal">
        {done?<div style={{textAlign:"center",padding:"32px 0"}}>
          <div style={{width:56,height:56,borderRadius:"50%",background:C.accentLight,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><I n="check" size={24} stroke={C.accent}/></div>
          <h3 className="serif" style={{fontSize:22,marginBottom:6}}>Review published!</h3>
          <p style={{color:C.muted,fontSize:14}}>Your review is now live on {tutorName}'s profile.</p>
          <button className="bg" onClick={onClose} style={{marginTop:20}}>Close</button>
        </div>:<>
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
            <textarea className="inp" rows={4} placeholder="How did this tutor help you?" value={text} onChange={e=>setText(e.target.value)}/>
            <div style={{fontSize:12,color:C.muted,marginTop:4}}>Reviews publish instantly on the tutor's profile.</div>
          </div>
          <button className="bp" onClick={submit} style={{width:"100%",justifyContent:"center",padding:"12px 20px"}} disabled={!text.trim()||!name.trim()||loading}>
            {loading?<Spin/>:"Publish review"}
          </button>
        </>}
      </div>
    </div>
  )
}

function BkModal({tutor,user,onClose,onConfirm}) {
  const [date,setDate]=useState("")
  const [time,setTime]=useState("")
  const [done,setDone]=useState(false)
  const [loading,setLoading]=useState(false)
  const [err,setErr]=useState("")
  const confirm = async () => {
    if(!date||!time) return
    setLoading(true); setErr("")
    try {
      const saved = await api.post("/bookings",{tutorId:tutor.id,date,time,price:tutor.price},user.token)
      setDone(true)
      setTimeout(()=>onConfirm(saved), 1000)
    } catch(e) { setErr(e.message) }
    setLoading(false)
  }
  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&!done&&onClose()}>
      <div className="modal">
        {done?<div style={{textAlign:"center",padding:"32px 0"}}>
          <div style={{width:56,height:56,borderRadius:"50%",background:C.accentLight,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><I n="check" size={24} stroke={C.accent}/></div>
          <h3 className="serif" style={{fontSize:22,marginBottom:6}}>Booking sent!</h3>
          <p style={{color:C.muted,fontSize:14}}>{tutor.name} will confirm your session shortly.</p>
        </div>:<>
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
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:13,fontWeight:500,marginBottom:6}}>Time slot</label>
            <select className="inp" onChange={e=>setTime(e.target.value)}>
              <option value="">Select a time</option>
              {["6:00 AM","7:00 AM","8:00 AM","9:00 AM","10:00 AM","11:00 AM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          {err&&<div style={{background:C.dangerLight,color:C.danger,padding:"10px 14px",borderRadius:8,fontSize:13,marginBottom:16}}>{err}</div>}
          <button className="bp" onClick={confirm} style={{width:"100%",justifyContent:"center",padding:"12px 20px"}} disabled={!date||!time||loading}>
            {loading?<Spin/>:`Confirm booking · ${INR(tutor.price)}`}
          </button>
        </>}
      </div>
    </div>
  )
}

// ─── TUTOR APP ────────────────────────────────────────────────────────────────
function TutorApp({user,onLogout}) {
  const [page,    setPage]    = useState("dashboard")
  const [bookings,setBk]      = useState([])
  const [toast,   setToast]   = useState(null)
  const [status,  setStatus]  = useState(user.approval_status==="approved"?"approved":user.approval_status||"pending")

  // Poll for approval status while pending
  useEffect(()=>{
    if(status==="approved") return
    const poll = setInterval(()=>{
      api.post("/auth/tutor/login",{email:user.email,password:""}).catch(()=>{})
      // Better: fetch own profile
      fetch(`https://mytutors24-backend.onrender.com/api/tutors/${user.id}`).then(r=>r.json()).then(d=>{
        if(d.approval_status==="approved"||d.id) { setStatus("approved"); setToast("🎉 Your account has been approved! You are now visible to students.") }
      }).catch(()=>{})
    }, 10000)
    return ()=>clearInterval(poll)
  },[status, user.id, user.email])

  useEffect(()=>{
    if(status!=="approved") return
    api.get(`/bookings/tutor/${user.id}`,user.token).then(setBk).catch(()=>{})
  },[user.id,user.token,status])

  // Socket: listen for approval notification
  useEffect(()=>{
    getSocket().then(socket=>{
      socket.emit("join",{userId:user.id,role:"tutor"})
      socket.on("account_approved",()=>{ setStatus("approved"); setToast("🎉 Account approved! You are now visible to students.") })
      socket.on("account_declined",d=>{ setStatus("declined"); setToast(`Account not approved. ${d.reason||""}`) })
    }).catch(()=>{})
  },[user.id])

  const msgContacts=[{id:1,name:"Student Support",subject:"Platform",col:"#1a6b3c"}]
  const nav=[{key:"dashboard",label:"Dashboard",icon:"home"},{key:"messages",label:"Messages",icon:"msg"},{key:"myprofile",label:"My profile",icon:"edit"},{key:"earnings",label:"Earnings",icon:"chart"}]

  const upd = async (id,s) => {
    try {
      await api.put(`/bookings/${id}/status`,{status:s},user.token)
      setBk(p=>p.map(b=>b.id===id?{...b,status:s}:b))
      setToast(s==="confirmed"?"Booking confirmed!":"Booking declined.")
    } catch(e){setToast(e.message)}
  }

  // Pending / declined banner
  if(status!=="approved") return (
    <div className="layout">
      <style>{CSS}</style>
      <Sidebar nav={nav} active="dashboard" onNav={()=>{}} user={user} onLogout={onLogout} role="Tutor"/>
      <div className="main" style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{maxWidth:480,textAlign:"center",padding:40}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:C.warningLight,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}><I n="clock" size={28} stroke={C.warning}/></div>
          <h2 className="serif" style={{fontSize:28,marginBottom:12}}>Application under review</h2>
          <p style={{color:C.muted,fontSize:15,lineHeight:1.7}}>Your account is currently pending admin approval. Once approved you will appear in the tutor listing and can start receiving bookings.</p>
          <p style={{color:C.muted,fontSize:13,marginTop:16}}>This usually takes a few hours. We'll notify you as soon as it's done.</p>
        </div>
      </div>
    </div>
  )

  if(status==="declined") return (
    <div className="layout">
      <style>{CSS}</style>
      <Sidebar nav={nav} active="dashboard" onNav={()=>{}} user={user} onLogout={onLogout} role="Tutor"/>
      <div className="main" style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{maxWidth:480,textAlign:"center",padding:40}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:C.dangerLight,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}><I n="x" size={28} stroke={C.danger}/></div>
          <h2 className="serif" style={{fontSize:28,marginBottom:12}}>Application declined</h2>
          <p style={{color:C.muted,fontSize:15,lineHeight:1.7}}>Unfortunately your application was not approved at this time. Please contact support if you believe this is a mistake.</p>
          <button className="bg" onClick={onLogout} style={{marginTop:20}}>Back to home</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="layout">
      <style>{CSS}</style>
      <Sidebar nav={nav} active={page} onNav={setPage} user={user} onLogout={onLogout} role="Tutor"/>
      <div className="main">
        {page==="dashboard"&&<TDash bookings={bookings} tutor={user} onUpd={upd}/>}
        {page==="messages" &&<Messaging user={user} userType="tutor" contacts={msgContacts}/>}
        {page==="myprofile"&&<TEditProfile tutor={user}/>}
        {page==="earnings" &&<TEarnings bookings={bookings}/>}
      </div>
      {toast&&<Toast msg={toast} onDone={()=>setToast(null)}/>}
    </div>
  )
}

function TDash({bookings,tutor,onUpd}) {
  const earnings=bookings.filter(b=>b.status==="completed").reduce((s,b)=>s+b.price,0)
  const c={total:bookings.length,pending:bookings.filter(b=>b.status==="pending").length,confirmed:bookings.filter(b=>b.status==="confirmed").length,completed:bookings.filter(b=>b.status==="completed").length}
  return (
    <div className="fi"><TopBar title={`Hi, ${tutor?.name?.split(" ")[0]} 👋`}/>
      <div style={{padding:"24px 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
          {[{l:"Total",v:c.total},{l:"Pending",v:c.pending,warn:c.pending>0},{l:"Upcoming",v:c.confirmed},{l:"Earnings",v:INR(earnings)}].map(s=>(
            <div key={s.l} className="card" style={{padding:20,borderLeft:s.warn?`3px solid ${C.warning}`:undefined}}>
              <div style={{fontSize:11,fontWeight:600,color:s.warn?C.warning:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{s.l}</div>
              <div className="serif" style={{fontSize:typeof s.v==="string"&&s.v.length>5?20:30,color:s.warn?C.warning:C.ink}}>{s.v}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{overflow:"hidden"}}>
          <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.hairline}`}}><h2 style={{fontSize:14,fontWeight:600}}>Class requests</h2></div>
          {bookings.length===0?<div style={{padding:"50px 32px",textAlign:"center",color:C.muted}}>No booking requests yet. Students will find you when they browse tutors.</div>
          :bookings.map((b,i)=>(
            <div key={b.id} style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:16,borderBottom:i<bookings.length-1?`1px solid ${C.hairline}`:"none"}}>
              <Av name={b.student_name} size={38}/>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:500}}>{b.student_name}</div><div style={{fontSize:12,color:C.muted}}>{fmtD(b.date)} · {b.time}</div></div>
              <SPill status={b.status}/>
              <div style={{fontSize:14,fontWeight:700}}>{INR(b.price)}</div>
              {b.status==="pending"&&<div style={{display:"flex",gap:8}}>
                <button className="bss" onClick={()=>onUpd(b.id,"confirmed")}>Accept</button>
                <button className="bds" onClick={()=>onUpd(b.id,"rejected")}>Decline</button>
              </div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TEditProfile({tutor}) {
  const [saved,setSaved]=useState(false)
  const [form,setForm]=useState({name:tutor?.name||"",bio:tutor?.bio||"",price:tutor?.price||800,city:tutor?.city||""})
  const [loading,setLoading]=useState(false)
  const save = async () => {
    setLoading(true)
    try { await api.put(`/tutors/${tutor.id}`,form,tutor.token); setSaved(true); setTimeout(()=>setSaved(false),3000) }
    catch(e){ alert(e.message) }
    setLoading(false)
  }
  return (
    <div className="fi"><TopBar title="My Profile"/>
      <div style={{padding:"24px 32px",maxWidth:660}}>
        {saved&&<div style={{background:C.accentLight,color:C.accentText,padding:"11px 16px",borderRadius:8,marginBottom:20,display:"flex",gap:8,alignItems:"center",fontSize:14}}><I n="check" size={15} stroke={C.accentText}/>Profile saved!</div>}
        <div className="card" style={{padding:28}}>
          <div style={{display:"flex",gap:18,alignItems:"center",marginBottom:24,paddingBottom:24,borderBottom:`1px solid ${C.hairline}`}}>
            <Av name={form.name} size={60}/>
            <div><div style={{fontSize:16,fontWeight:600,marginBottom:2}}>{form.name}</div><div style={{fontSize:13,color:C.muted}}>{tutor?.subject}</div><span className="pill pg" style={{marginTop:6,fontSize:11}}><I n="shield" size={10} stroke={C.accentText}/>Approved</span></div>
          </div>
          {[{l:"Full name",k:"name",t:"text"},{l:"City",k:"city",t:"text"}].map(f=>(
            <div key={f.k} style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:13,fontWeight:500,marginBottom:6}}>{f.l}</label>
              <input className="inp" value={form[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))}/>
            </div>
          ))}
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:13,fontWeight:500,marginBottom:6}}>Email</label>
            <input className="inp" value={tutor?.email||""} disabled style={{opacity:.55,cursor:"not-allowed"}}/>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:13,fontWeight:500,marginBottom:6}}>About you</label>
            <textarea className="inp" rows={4} value={form.bio} onChange={e=>setForm(p=>({...p,bio:e.target.value}))}/>
          </div>
          <div style={{marginBottom:24}}>
            <label style={{display:"block",fontSize:13,fontWeight:500,marginBottom:6}}>Hourly rate (₹)</label>
            <input className="inp" type="number" value={form.price} onChange={e=>setForm(p=>({...p,price:Number(e.target.value)}))} style={{maxWidth:160}}/>
          </div>
          <button className="bp" onClick={save} disabled={loading}>{loading?<Spin/>:<><I n="check" size={14} stroke="#fff"/>Save changes</>}</button>
        </div>
      </div>
    </div>
  )
}

function TEarnings({bookings}) {
  const done=bookings.filter(b=>b.status==="completed")
  const total=done.reduce((s,b)=>s+b.price,0)
  const expected=bookings.filter(b=>b.status==="confirmed").reduce((s,b)=>s+b.price,0)
  return (
    <div className="fi"><TopBar title="Earnings"/>
      <div style={{padding:"24px 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:28}}>
          {[{l:"Total earned",v:INR(total),col:C.success},{l:"Expected",v:INR(expected),col:C.accent},{l:"Sessions done",v:done.length,col:C.ink}].map(s=>(
            <div key={s.l} className="card" style={{padding:22}}><div style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{s.l}</div><div className="serif" style={{fontSize:28,color:s.col}}>{s.v}</div></div>
          ))}
        </div>
        <div className="card" style={{padding:24}}>
          <h3 style={{fontSize:14,fontWeight:600,marginBottom:16}}>Transaction history</h3>
          {done.length===0?<p style={{color:C.muted,fontSize:14}}>No completed sessions yet.</p>
          :done.map((b,i)=>(
            <div key={b.id} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:i<done.length-1?`1px solid ${C.hairline}`:"none"}}>
              <div><div style={{fontSize:14,fontWeight:500}}>{b.student_name}</div><div style={{fontSize:12,color:C.muted}}>{fmtD(b.date)} · {b.time}</div></div>
              <div style={{fontSize:15,fontWeight:700,color:C.success}}>+{INR(b.price)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── ROOT — SESSION PERSISTENCE ───────────────────────────────────────────────
const SUBJ_LIST=["IIT-JEE","NEET","Mathematics","Physics","Chemistry","Biology","English","UPSC","Coding","Commerce","Accounts","Economics","History","Geography"]

export default function App() {
  // Restore session from localStorage on mount — survives refresh
  const [student, setStudent] = useState(()=>Session.load("student"))
  const [tutor,   setTutor]   = useState(()=>Session.load("tutor"))
  const [route,   setRoute]   = useState(()=>{
    const s = Session.load("student")
    const t = Session.load("tutor")
    if(s) return "student-app"
    if(t) return "tutor-app"
    return "landing"
  })
  const [err,     setErr]     = useState("")
  const [loading, setLoading] = useState(false)

  const go = r => { setRoute(r); setErr("") }

  const saveStudent = d => { setStudent(d); Session.save("student",d); Session.clear("tutor") }
  const saveTutor   = d => { setTutor(d);  Session.save("tutor",d);   Session.clear("student") }
  const logoutStudent = () => { setStudent(null); Session.clear("student"); go("landing") }
  const logoutTutor   = () => { setTutor(null);   Session.clear("tutor");   go("landing") }

  const withLoad = fn => async form => {
    setLoading(true); setErr("")
    try { await fn(form) } catch(e) { setErr(e.message||"Something went wrong.") }
    setLoading(false)
  }

  const loginStu = withLoad(async f => {
    if(!f.email||!f.password){setErr("Please fill in all fields.");return}
    const d = await api.post("/auth/student/login",{email:f.email,password:f.password})
    saveStudent(d); go("student-app")
  })
  const regStu = withLoad(async f => {
    if(!f.name||!f.email||!f.password){setErr("Please fill in all fields.");return}
    const d = await api.post("/auth/student/register",f)
    saveStudent(d); go("student-app")
  })
  const loginTut = withLoad(async f => {
    if(!f.email||!f.password){setErr("Please fill in all fields.");return}
    const d = await api.post("/auth/tutor/login",{email:f.email,password:f.password})
    saveTutor({...d, approval_status: d.approval_status || 'approved'}); go('tutor-app')
  })
  const regTut = withLoad(async f => {
    if(!f.name||!f.email||!f.subject){setErr("Please fill in all fields.");return}
    const d = await api.post("/auth/tutor/register",f)
    saveTutor({...d, approval_status: d.approval_status || 'approved'}); go('tutor-app')
  })

  if(route==="landing")          return <Landing go={go}/>
  if(route==="login-selector")   return <LoginSelector go={go}/>
  if(route==="student-login")    return <AuthForm title="Student login"       sub="Welcome back!"                           fields={[{key:"email",label:"Email",type:"email",ph:"you@email.com"},{key:"password",label:"Password",type:"password",ph:"••••••••"}]}                                                                              onSubmit={loginStu} loading={loading} error={err} footer={{text:"New here?",label:"Create account",fn:()=>go("student-register")}} onBack={()=>go("login-selector")} btnLabel="Log in"/>
  if(route==="student-register") return <AuthForm title="Create your account" sub="Join thousands of students learning."   fields={[{key:"name",label:"Full name",ph:"Rohan Malhotra"},{key:"email",label:"Email",type:"email",ph:"you@email.com"},{key:"password",label:"Password",type:"password",ph:"Min 6 characters"},{key:"city",label:"City",ph:"Delhi"}]} onSubmit={regStu}   loading={loading} error={err} footer={{text:"Already registered?",label:"Log in",fn:()=>go("student-login")}}   onBack={()=>go("login-selector")} btnLabel="Create account"/>
  if(route==="tutor-login")      return <AuthForm title="Tutor login"         sub="Manage your classes and earn more."     fields={[{key:"email",label:"Email",type:"email",ph:"you@email.com"},{key:"password",label:"Password",type:"password",ph:"••••••••"}]}                                                                              onSubmit={loginTut} loading={loading} error={err} footer={{text:"Not registered?",label:"Join as a tutor",fn:()=>go("tutor-register")}} onBack={()=>go("login-selector")} btnLabel="Log in"/>
  if(route==="tutor-register")   return <AuthForm title="Join as a tutor"     sub="Start teaching on MyTutors24."          fields={[{key:"name",label:"Full name",ph:"Dr. Arjun Sharma"},{key:"email",label:"Email",type:"email",ph:"you@email.com"},{key:"password",label:"Password",type:"password",ph:"Min 6 characters"},{key:"subject",label:"Subject",type:"select",opts:SUBJ_LIST},{key:"city",label:"City",ph:"Delhi"},{key:"mode",label:"Mode",type:"select",opts:["Online","Offline","Hybrid"]},{key:"price",label:"Hourly rate (₹)",ph:"e.g. 1200"}]} onSubmit={regTut} loading={loading} error={err} footer={{text:"Already registered?",label:"Log in",fn:()=>go("tutor-login")}} onBack={()=>go("login-selector")} btnLabel="Apply as tutor"/>
  if(route==="student-app"&&student) return <StudentApp user={student} onLogout={logoutStudent}/>
  if(route==="tutor-app"&&tutor)     return <TutorApp   user={tutor}   onLogout={logoutTutor}/>
  return <Landing go={go}/>
}
