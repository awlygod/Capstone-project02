import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0f1117; font-family: 'Inter', sans-serif; color: #e2e8f0; overflow-y: auto; min-height: 100vh; }

  :root {
    --bg: #0f1117;
    --surface: #1a1d27;
    --surface2: #222536;
    --border: #2d3148;
    --accent: #4f8ef7;
    --green: #22c55e;
    --amber: #f59e0b;
    --red: #ef4444;
    --text: #e2e8f0;
    --muted: #64748b;
    --mono: 'JetBrains Mono', monospace;
  }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
  @keyframes radar-sweep { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes slide-in { from{opacity:0; transform:translateY(-6px)} to{opacity:1; transform:translateY(0)} }
  @keyframes danger-bg { 0%,100%{background:rgba(239,68,68,0.05)} 50%{background:rgba(239,68,68,0.12)} }

  .app {
    width: 100vw; min-height: 100vh;
    display: grid;
    grid-template-rows: 52px auto;
    background: var(--bg);
  }

  .header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }
  .header-title { font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: 0.5px; }
  .header-sub { font-size: 11px; color: var(--muted); margin-top: 1px; }
  .header-right { display: flex; align-items: center; gap: 14px; }
  .status-chip {
    display: flex; align-items: center; gap: 6px;
    padding: 4px 10px; border-radius: 6px;
    background: var(--surface2); border: 1px solid var(--border);
    font-size: 11px; color: var(--muted);
  }
  .dot { width: 7px; height: 7px; border-radius: 50%; }
  .dot.green { background: var(--green); box-shadow: 0 0 6px var(--green); animation: pulse 2s infinite; }
  .dot.amber { background: var(--amber); }
  .dot.red { background: var(--red); animation: blink 0.8s infinite; }
  .clock { font-family: var(--mono); font-size: 13px; color: var(--text); }

  .main {
    display: grid;
    grid-template-columns: 240px 1fr 240px;
    gap: 8px; padding: 8px;
    overflow: visible;
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }
  .card-header {
    padding: 10px 14px 8px;
    border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
  }
  .card-title { font-size: 11px; font-weight: 600; color: var(--muted); letter-spacing: 0.8px; text-transform: uppercase; }
  .card-badge { font-size: 10px; padding: 2px 7px; border-radius: 4px; font-family: var(--mono); }
  .badge-green { background: rgba(34,197,94,0.12); color: var(--green); }
  .badge-amber { background: rgba(245,158,11,0.12); color: var(--amber); }
  .badge-red { background: rgba(239,68,68,0.12); color: var(--red); }
  .badge-blue { background: rgba(79,142,247,0.12); color: var(--accent); }

  .left-col { display: flex; flex-direction: column; gap: 8px; }

  .sensor-list { padding: 8px; display: flex; flex-direction: column; gap: 4px; }
  .sensor-row {
    padding: 9px 10px; border-radius: 7px;
    background: var(--surface2);
    display: flex; align-items: center; justify-content: space-between;
    border: 1px solid transparent; transition: border-color 0.3s;
  }
  .sensor-row.warn { border-color: rgba(245,158,11,0.35); }
  .sensor-row.danger { border-color: rgba(239,68,68,0.35); animation: danger-bg 1.5s infinite; }
  .sensor-name { font-size: 10px; color: var(--muted); font-weight: 500; margin-bottom: 5px; }
  .sensor-bar-wrap { width: 80px; height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; }
  .sensor-bar-fill { height: 100%; border-radius: 2px; transition: width 0.8s ease; }
  .fill-green { background: var(--green); }
  .fill-amber { background: var(--amber); }
  .fill-red { background: var(--red); }
  .sensor-val { font-family: var(--mono); font-size: 14px; font-weight: 600; }
  .val-green { color: var(--green); }
  .val-amber { color: var(--amber); }
  .val-red { color: var(--red); }
  .val-default { color: var(--text); }
  .sensor-unit { font-size: 9px; color: var(--muted); font-family: var(--mono); }

  .battery-body { padding: 12px 14px; }
  .battery-pct { font-family: var(--mono); font-size: 28px; font-weight: 700; color: var(--green); }
  .battery-bar-outer { height: 8px; background: var(--surface2); border-radius: 4px; overflow: hidden; margin: 8px 0 6px; border: 1px solid var(--border); }
  .battery-bar-fill { height: 100%; border-radius: 4px; transition: width 1s ease; }
  .battery-meta { display: flex; justify-content: space-between; font-size: 10px; color: var(--muted); font-family: var(--mono); }

  .radar-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px; gap: 8px; }
  .radar {
    width: 120px; height: 120px; border-radius: 50%;
    background: radial-gradient(circle, #1a2e1a 0%, var(--surface) 100%);
    border: 1px solid var(--border); position: relative; overflow: hidden;
  }
  .radar-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(34,197,94,0.12); top:50%; left:50%; transform:translate(-50%,-50%); }
  .radar-line { position: absolute; background: rgba(34,197,94,0.08); }
  .radar-line.h { top:50%; left:0; right:0; height:1px; }
  .radar-line.v { left:50%; top:0; bottom:0; width:1px; }
  .radar-sweep { position:absolute; top:50%; left:50%; width:50%; height:1px; transform-origin:left center; animation:radar-sweep 3s linear infinite; }
  .radar-sweep::after { content:''; position:absolute; top:0; left:0; width:100%; height:1px; background:linear-gradient(90deg,transparent,rgba(34,197,94,0.8)); }
  .radar-blip { position:absolute; width:6px; height:6px; border-radius:50%; background:var(--green); box-shadow:0 0 5px var(--green); transform:translate(-50%,-50%); animation:pulse 1.5s infinite; }
  .radar-label { font-size: 10px; color: var(--muted); font-family: var(--mono); }

  .center-col { display: flex; flex-direction: column; gap: 8px; }

  .video-card { display: flex; flex-direction: column; }
  .video-inner { height: 340px; background:#000; position:relative; display:flex; align-items:center; justify-content:center; }
  .video-placeholder { width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; background:#080a0e; position:relative; }
  .video-text { font-size: 13px; color: var(--muted); font-family: var(--mono); }
  .video-url { font-size: 10px; color: #374151; font-family: var(--mono); }
  .rec-badge { position:absolute; top:10px; left:12px; display:flex; align-items:center; gap:5px; font-size:10px; color:var(--red); font-family:var(--mono); }
  .rec-dot { width:6px; height:6px; border-radius:50%; background:var(--red); animation:blink 1s infinite; }
  .yolo-box { position:absolute; border:2px solid var(--amber); border-radius:2px; }
  .yolo-tag { position:absolute; top:-20px; left:0; background:var(--amber); color:#000; font-size:9px; font-weight:700; padding:2px 6px; border-radius:2px; font-family:var(--mono); }
  .corner { position:absolute; width:16px; height:16px; border-color:rgba(79,142,247,0.35); border-style:solid; }
  .c-tl { top:8px; left:8px; border-width:2px 0 0 2px; }
  .c-tr { top:8px; right:8px; border-width:2px 2px 0 0; }
  .c-bl { bottom:8px; left:8px; border-width:0 0 2px 2px; }
  .c-br { bottom:8px; right:8px; border-width:0 2px 2px 0; }

  .chart-card { height: 130px; }
  .chart-body { padding: 8px 12px; height: calc(100% - 36px); }
  .chart-svg { width:100%; height:65px; }
  .chart-legend { display:flex; gap:14px; margin-top:4px; }
  .legend-item { display:flex; align-items:center; gap:5px; font-size:10px; color:var(--muted); }
  .legend-dot { width:8px; height:8px; border-radius:2px; }

  .right-col { display: flex; flex-direction: column; gap: 8px; }

  .timer-body { padding: 12px 14px; text-align:center; }
  .timer-val { font-family:var(--mono); font-size:24px; font-weight:700; color:var(--text); letter-spacing:3px; }
  .timer-sub { font-size:10px; color:var(--muted); margin-top:3px; }

  .detect-list { padding: 8px; display:flex; flex-direction:column; gap:4px; }
  .detect-row {
    display:flex; align-items:center; justify-content:space-between;
    padding: 8px 10px; border-radius:7px;
    background: var(--surface2); border: 1px solid transparent; transition: all 0.3s;
  }
  .detect-row.triggered { border-color: rgba(239,68,68,0.3); animation: danger-bg 1.5s infinite; }
  .detect-name { font-size: 11px; color: var(--text); }
  .detect-chip { font-size: 9px; padding:2px 7px; border-radius:4px; font-family:var(--mono); font-weight:600; }
  .chip-ok { background:rgba(34,197,94,0.1); color:var(--green); }
  .chip-scan { background:rgba(100,116,139,0.1); color:var(--muted); }
  .chip-alert { background:rgba(239,68,68,0.12); color:var(--red); animation:blink 0.7s infinite; }

  .alerts-body { max-height: 260px; overflow-y:auto; padding:6px; display:flex; flex-direction:column; gap:4px; }
  .alerts-body::-webkit-scrollbar { width:3px; }
  .alerts-body::-webkit-scrollbar-thumb { background:var(--border); border-radius:2px; }
  .alert-item { padding:8px 10px; border-radius:7px; border-left:3px solid; animation:slide-in 0.3s ease; }
  .alert-item.info { background:rgba(79,142,247,0.05); border-left-color:var(--accent); }
  .alert-item.warn { background:rgba(245,158,11,0.05); border-left-color:var(--amber); }
  .alert-item.danger { background:rgba(239,68,68,0.06); border-left-color:var(--red); }
  .alert-time { font-size:9px; color:var(--muted); font-family:var(--mono); }
  .alert-msg { font-size:11px; color:var(--text); margin-top:2px; }

  .controls-body { padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:5px; }
  .ctrl-btn {
    padding:8px; border-radius:7px;
    background:var(--surface2); border:1px solid var(--border);
    color:var(--text); font-family:'Inter',sans-serif; font-size:11px; font-weight:500;
    cursor:pointer; transition:all 0.15s;
  }
  .ctrl-btn:hover { background:var(--border); }
  .ctrl-btn.stop { background:rgba(239,68,68,0.08); border-color:rgba(239,68,68,0.25); color:var(--red); }
  .ctrl-btn.stop:hover { background:rgba(239,68,68,0.15); }
`;

function useSimData() {
  const [d, setD] = useState({
    temp:28.4, humidity:62, o2:20.1, co:12, dust:45,
    battery:78, voltage:11.4, current:1.2, distance:42,
    humanDetected:false, voiceAlert:false, motion:true,
  });
  const [history, setHistory] = useState(
    Array(30).fill(0).map((_,i) => ({ t:i, temp:27+Math.random()*3, co:8+Math.random()*8 }))
  );
  useEffect(() => {
    const id = setInterval(() => {
      setD(p => ({
        ...p,
        temp: +(p.temp+(Math.random()-0.48)*0.3).toFixed(1),
        humidity: Math.min(99,Math.max(30,+(p.humidity+(Math.random()-0.5)*0.8).toFixed(1))),
        o2: Math.min(21,Math.max(17,+(p.o2+(Math.random()-0.5)*0.05).toFixed(2))),
        co: Math.max(0,+(p.co+(Math.random()-0.45)*1.2).toFixed(1)),
        dust: Math.max(0,+(p.dust+(Math.random()-0.5)*3).toFixed(0)),
        battery: Math.max(0,+(p.battery-0.01).toFixed(2)),
        voltage: +(p.voltage-0.001).toFixed(2),
        distance: Math.max(5,+(p.distance+(Math.random()-0.5)*4).toFixed(0)),
        humanDetected: Math.random()>0.93,
        voiceAlert: Math.random()>0.97,
        motion: Math.random()>0.4,
      }));
      setHistory(h => [...h.slice(1), { t:h[h.length-1].t+1, temp:27+Math.random()*3, co:8+Math.random()*8 }]);
    }, 1200);
    return ()=>clearInterval(id);
  }, []);
  return {d, history};
}

function useAlerts(d) {
  const [alerts,setAlerts] = useState([
    {id:1,type:"info",time:"00:00:12",msg:"Rover deployed. All systems nominal."},
    {id:2,type:"info",time:"00:01:04",msg:"WiFi link established — RSSI -48 dBm"},
    {id:3,type:"warn",time:"00:02:31",msg:"CO elevated: 12 ppm"},
  ]);
  const ref = useRef({});
  const idRef = useRef(4);
  const fmt = () => { const s=Math.floor(Date.now()/1000)%3600; return `00:${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`; };
  useEffect(()=>{
    if(d.humanDetected && !ref.current.humanDetected)
      setAlerts(a=>[{id:idRef.current++,type:"danger",time:fmt(),msg:"HUMAN DETECTED — YOLO confirmed (94%)"},...a].slice(0,14));
    if(d.voiceAlert && !ref.current.voiceAlert)
      setAlerts(a=>[{id:idRef.current++,type:"danger",time:fmt(),msg:'Voice alert — keyword "HELP" detected'},...a].slice(0,14));
    if(d.co>25 && (ref.current.co||0)<=25)
      setAlerts(a=>[{id:idRef.current++,type:"warn",time:fmt(),msg:`CO spike: ${d.co} ppm`},...a].slice(0,14));
    ref.current = d;
  },[d]);
  return alerts;
}

function useClock(){ const [t,setT]=useState(new Date()); useEffect(()=>{const id=setInterval(()=>setT(new Date()),1000);return()=>clearInterval(id);},[]);return t.toLocaleTimeString("en-GB"); }
function useMission(){ const [s,setS]=useState(0); useEffect(()=>{const id=setInterval(()=>setS(x=>x+1),1000);return()=>clearInterval(id);},[]);const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`; }

function Sparkline({history}){
  const W=400,H=55;
  const line=(k,min,max,color)=>{
    const pts=history.map((d,i)=>{const x=(i/(history.length-1))*W;const y=H-((d[k]-min)/(max-min))*H;return `${x},${Math.max(2,Math.min(H-2,y))}`;}).join(" ");
    return <polyline key={k} points={pts} fill="none" stroke={color} strokeWidth="1.5" opacity="0.85"/>;
  };
  return(
    <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <line x1="0" y1="0" x2={W} y2="0" stroke="#2d3148" strokeWidth="0.5"/>
      <line x1="0" y1={H/2} x2={W} y2={H/2} stroke="#2d3148" strokeWidth="0.5"/>
      <line x1="0" y1={H} x2={W} y2={H} stroke="#2d3148" strokeWidth="0.5"/>
      {line("temp",24,34,"#22c55e")}
      {line("co",0,40,"#f59e0b")}
    </svg>
  );
}

export default function App(){
  const {d,history} = useSimData();
  const alerts = useAlerts(d);
  const clock = useClock();
  const mission = useMission();

  const coC = d.co>25?"danger":d.co>15?"warn":"";
  const o2C = d.o2<18?"danger":d.o2<19.5?"warn":"";
  const tempC = d.temp>45?"danger":d.temp>35?"warn":"";

  const sensors = [
    {name:"Temperature", val:d.temp, unit:"°C", max:60, cls:tempC},
    {name:"Humidity", val:d.humidity, unit:"% RH", max:100, cls:""},
    {name:"Oxygen (O₂)", val:d.o2, unit:"%", max:21, cls:o2C},
    {name:"CO Gas", val:d.co, unit:"ppm", max:50, cls:coC},
    {name:"Dust PM2.5", val:d.dust, unit:"µg/m³", max:150, cls:d.dust>100?"warn":""},
  ];

  const detections = [
    {name:"YOLO Human Detection", status:d.humanDetected?"ALERT":"Scanning", triggered:d.humanDetected},
    {name:"PIR Motion Sensor", status:d.motion?"Active":"Idle", triggered:false},
    {name:"Voice Keyword (PICO)", status:d.voiceAlert?"ALERT":"Listening", triggered:d.voiceAlert},
    {name:"mmWave Radar", status:d.motion?"Detected":"Clear", triggered:false},
    {name:"Ultrasonic Obstacle", status:"Online", triggered:false},
  ];

  const blipR = Math.min(44,Math.max(8,(d.distance/100)*44));
  const blipX = 50+blipR*Math.cos(1.1);
  const blipY = 50+blipR*Math.sin(1.1);

  return(
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div>
            <div className="header-title">SAR Rover — Ground Station</div>
            <div className="header-sub">Unit 01 · ESP32-S3 · Active Mission</div>
          </div>
          <div className="header-right">
            <div className="status-chip"><div className="dot green"/>WiFi Connected</div>
            <div className="status-chip"><div className={`dot ${d.humanDetected?"red":"amber"}`}/>{d.humanDetected?"Human Detected":"Scanning"}</div>
            <div className="status-chip"><div className="dot green"/>ESP32 Online</div>
            <div className="clock">{clock}</div>
          </div>
        </header>

        <div className="main">
          {/* LEFT */}
          <div className="left-col">
            <div className="card" style={{flex:2}}>
              <div className="card-header">
                <span className="card-title">Environmental Sensors</span>
                <span className="card-badge badge-green">Live</span>
              </div>
              <div className="sensor-list">
                {sensors.map(s=>{
                  const pct=Math.min(100,(parseFloat(s.val)/s.max)*100);
                  const fc=s.cls==="danger"?"fill-red":s.cls==="warn"?"fill-amber":"fill-green";
                  const vc=s.cls==="danger"?"val-red":s.cls==="warn"?"val-amber":"val-default";
                  return(
                    <div key={s.name} className={`sensor-row ${s.cls}`}>
                      <div>
                        <div className="sensor-name">{s.name}</div>
                        <div className="sensor-bar-wrap"><div className={`sensor-bar-fill ${fc}`} style={{width:`${pct}%`}}/></div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div className={`sensor-val ${vc}`}>{s.val}</div>
                        <div className="sensor-unit">{s.unit}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Obstacle Radar</span>
                <span className="card-badge badge-blue">{d.distance} cm</span>
              </div>
              <div className="radar-wrap">
                <div className="radar">
                  {[35,60,85].map(s=><div key={s} className="radar-ring" style={{width:`${s}%`,height:`${s}%`}}/>)}
                  <div className="radar-line h"/><div className="radar-line v"/>
                  <div className="radar-sweep"/>
                  <div className="radar-blip" style={{left:`${blipX}%`,top:`${blipY}%`}}/>
                </div>
                <div className="radar-label">Nearest: {d.distance} cm</div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Battery / BMS</span>
                <span className={`card-badge ${d.battery>50?"badge-green":d.battery>20?"badge-amber":"badge-red"}`}>{d.battery.toFixed(0)}%</span>
              </div>
              <div className="battery-body">
                <div className="battery-pct">{d.battery.toFixed(0)}%</div>
                <div className="battery-bar-outer">
                  <div className="battery-bar-fill" style={{width:`${d.battery}%`, background: d.battery>50?"#22c55e":d.battery>20?"#f59e0b":"#ef4444"}}/>
                </div>
                <div className="battery-meta">
                  <span>{d.voltage} V</span><span>{d.current} A</span><span>~{Math.round(d.battery*0.6)} min</span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER */}
          <div className="center-col">
            <div className="card video-card">
              <div className="card-header">
                <span className="card-title">ESP32-CAM Feed + YOLO Detection</span>
                <span className="card-badge badge-blue">640×480</span>
              </div>
              <div className="video-inner">
                <div className="video-placeholder">
                  <div className="corner c-tl"/><div className="corner c-tr"/>
                  <div className="corner c-bl"/><div className="corner c-br"/>
                  <div className="rec-badge"><div className="rec-dot"/>REC</div>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" opacity="0.15">
                    <circle cx="18" cy="18" r="16" stroke="#4f8ef7" strokeWidth="1.5"/>
                    <line x1="18" y1="2" x2="18" y2="34" stroke="#4f8ef7" strokeWidth="1"/>
                    <line x1="2" y1="18" x2="34" y2="18" stroke="#4f8ef7" strokeWidth="1"/>
                  </svg>
                  <div className="video-text">Awaiting video stream...</div>
                  <div className="video-url">ws://192.168.x.x:81/stream</div>
                  <div className="video-url" style={{opacity:0.5, marginTop:2}}>YOLOv8 inference ready</div>
                  {d.humanDetected&&(
                    <div className="yolo-box" style={{top:"25%",left:"33%",width:"22%",height:"40%"}}>
                      <div className="yolo-tag">HUMAN 94%</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card chart-card">
              <div className="card-header">
                <span className="card-title">Telemetry History</span>
                <span className="card-badge badge-blue">30s rolling</span>
              </div>
              <div className="chart-body">
                <Sparkline history={history}/>
                <div className="chart-legend">
                  <div className="legend-item"><div className="legend-dot" style={{background:"#22c55e"}}/>Temp (°C)</div>
                  <div className="legend-item"><div className="legend-dot" style={{background:"#f59e0b"}}/>CO (ppm)</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="right-col">
            <div className="card">
              <div className="card-header">
                <span className="card-title">Mission Timer</span>
                <span className="card-badge badge-green">Active</span>
              </div>
              <div className="timer-body">
                <div className="timer-val">{mission}</div>
                <div className="timer-sub">HH : MM : SS elapsed</div>
              </div>
            </div>

            <div className="card" style={{flex:1}}>
              <div className="card-header">
                <span className="card-title">Detection Modules</span>
              </div>
              <div className="detect-list">
                {detections.map(det=>(
                  <div key={det.name} className={`detect-row ${det.triggered?"triggered":""}`}>
                    <div className="detect-name">{det.name}</div>
                    <div className={`detect-chip ${det.triggered?"chip-alert":det.status==="Scanning"||det.status==="Listening"?"chip-scan":"chip-ok"}`}>
                      {det.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{flex:2,display:"flex",flexDirection:"column"}}>
              <div className="card-header">
                <span className="card-title">Event Log</span>
                <span className="card-badge badge-blue">{alerts.length} events</span>
              </div>
              <div className="alerts-body">
                {alerts.map(a=>(
                  <div key={a.id} className={`alert-item ${a.type}`}>
                    <div className="alert-time">{a.time}</div>
                    <div className="alert-msg">{a.msg}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Rover Controls</span>
              </div>
              <div className="controls-body">
                {["Forward","Left","Right","Lights","Fan","Snapshot"].map(c=>(
                  <button key={c} className="ctrl-btn">{c}</button>
                ))}
                <button className="ctrl-btn stop" style={{gridColumn:"span 2"}}>⏹ Emergency Stop</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
