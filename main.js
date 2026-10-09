(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const COARSE=matchMedia('(pointer: coarse)').matches;
const root=document.documentElement;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const easeIO=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const easeO=t=>1-Math.pow(1-t,3);
const rnd=(a=0,b=1)=>a+Math.random()*(b-a);
const fmt=n=>new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(n);
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

/* ---------- DATA ---------- */
const COFFEES=[
 {id:'desvare',art:'EL',word:'DESVARE',alias:'EL SALVAVIDAS',bg:'#FF5A1F',fg:'#0A0908',hi:'#FF7A45',tag:'PARA CUANDO TODO SE DAÑA',quote:'Cuando el día se pone hijueputa, aparece El Desvare.',vibe:'El café que aparece cuando todo está vuelto mierda. Cuerpo grande, tostión firme y cero paciencia.',region:'TOLIMA',alt:'1.750',variety:'CASTILLO',proc:'LAVADO',roast:4,roastName:'MEDIA-OSCURA',notes:['CACAO','CARAMELO','FRUTOS ROJOS'],base:34000,stock:48},
 {id:'culona',art:'LA',word:'CULONA',alias:'LA QUE MANDA',bg:'#E3122B',fg:'#EFEBE1',hi:'#FF4A5C',tag:'ACTITUD DE SOBRA',quote:'No necesita presentación.',vibe:'Redonda, dulce y descarada. Entra a la cocina como si fuera suya y nadie le dice nada.',region:'HUILA',alt:'1.680',variety:'CATURRA',proc:'HONEY',roast:3,roastName:'MEDIA',notes:['PANELA','MANDARINA','CHOCOLATE'],base:36000,stock:31},
 {id:'gomelo',art:'EL',word:'GOMELO',alias:'EL SELECTIVO',bg:'#2B3BFF',fg:'#EFEBE1',hi:'#7B87FF',tag:'EDICIÓN SELECTA N° 003',quote:'No es caro. Es selectivo.',vibe:'Limpio, brillante y con apellido compuesto. Pocas bolsas, mucha aura, cero afán de explicarse.',region:'ANTIOQUIA',alt:'1.900',variety:'TABI',proc:'ANAERÓBICO',roast:2,roastName:'CLARA-MEDIA',notes:['CÍTRICOS','JAZMÍN','MIEL'],base:48000,stock:22},
 {id:'moza',art:'LA',word:'MOZA',alias:'LA SOMBRA',bg:'#2A0F44',fg:'#D9B8FF',hi:'#B67BFF',tag:'SIN FICHA PÚBLICA',quote:'No preguntes de dónde salió.',vibe:'Oscura, callada y con memoria. Lo que pasó en el tostador se queda en el tostador.',region:'SANTANDER',alt:'1.550',variety:'BOURBON',proc:'NATURAL',roast:5,roastName:'OSCURA',notes:['CIRUELA','TABACO','CHOCOLATE AMARGO'],base:52000,stock:9},
 {id:'callado',art:'EL',word:'CALLADO',alias:'EL QUE NO DICE',bg:'#B8FF1F',fg:'#0A0908',hi:'#B8FF1F',tag:'NO DICE NADA',quote:'No dice nada. Lo dice todo.',vibe:'Suave de entrada y largo de salida. Nunca levanta la voz y siempre gana la discusión.',region:'NARIÑO',alt:'2.100',variety:'CATURRA',proc:'LAVADO',roast:2,roastName:'CLARA-MEDIA',notes:['NUEZ','CARAMELO','CÍTRICOS'],base:38000,stock:40},
 {id:'parcero',art:'EL',word:'PARCERO',alias:'EL DE SIEMPRE',bg:'#EFEBE1',fg:'#0A0908',hi:'#EFEBE1',tag:'EL DE TODOS LOS DÍAS',quote:'Siempre está. Nunca falla.',vibe:'Equilibrado, dulce y sin drama. Va con arepa, con pan y con lo que haya en la mesa.',region:'TOLIMA',alt:'1.600',variety:'CASTILLO',proc:'LAVADO',roast:3,roastName:'MEDIA',notes:['CACAO','PANELA','NUEZ'],base:32000,stock:120}
];
const WEIGHTS=[{g:250,label:'250 G',m:1},{g:500,label:'500 G',m:1.9},{g:1000,label:'1 KG',m:3.6}];
const GRINDS=['Prensa francesa','Filtro / V60','Espresso','Moka'];
const NC={CACAO:'#6B3A22',CARAMELO:'#C9781C',PANELA:'#A9672F','FRUTOS ROJOS':'#D81E4A',MANDARINA:'#F07A12',CHOCOLATE:'#5A2E1A','CHOCOLATE AMARGO':'#3A1D12',CÍTRICOS:'#C99A00',JAZMÍN:'#7A9A5A',MIEL:'#D6930E',CIRUELA:'#6B1F5C',TABACO:'#7A5B3A',NUEZ:'#8A6A45'};
const priceOf=(c,g)=>Math.round(c.base*WEIGHTS.find(w=>w.g===g).m/500)*500;
const byId=id=>COFFEES.find(c=>c.id===id);

/* ---------- BAG SVG ---------- */
let uid=0;
function hashRand(s){let h=2166136261;for(const ch of s){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return()=>{h^=h<<13;h^=h>>>17;h^=h<<5;return((h>>>0)%1000)/1000}}
function bagSVG(c,o={}){
  const id='b'+(++uid), type=o.type==='molido'?'MOLIDO':'EN GRANO';
  const wt=o.weight?(o.weight>=1000?'1KG':o.weight+'G'):'250G';
  const r=hashRand(c.id);let bars='',x=148;
  for(let i=0;i<24&&x<224;i++){const w=1+Math.floor(r()*3);bars+=`<rect x="${x.toFixed(1)}" y="300" width="${w}" height="26" fill="${c.fg}"/>`;x+=w+1.7}
  let zz='M12,6';for(let i=1;i<=24;i++)zz+=` L${12+i*9},${i%2?0:6}`;
  const body=`${zz} C238,60 246,130 240,210 L236,316 Q234,336 214,336 L26,336 Q6,336 4,316 L0,210 C-6,130 2,60 12,6 Z`;
  const tl=Math.min(206,40*c.word.length), n=COFFEES.indexOf(c)+1;
  const fam="font-family=\"Big Shoulders Display, Arial Narrow, Impact, sans-serif\" font-weight=\"900\"";
  const mono="font-family=\"JetBrains Mono, Menlo, monospace\"";
  return `<svg class="bag" viewBox="-10 -6 260 352" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bolsa ${c.art} ${c.word}, ${type}, ${wt}">
<defs><clipPath id="${id}c"><path d="${body}"/></clipPath>
<linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset=".18" stop-color="#fff" stop-opacity=".1"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset=".82" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient></defs>
<path d="${body}" fill="${c.bg}"/>
<g clip-path="url(#${id}c)">
<rect x="-10" y="0" width="260" height="38" fill="#000" opacity=".2"/>
<path d="M-10,38 H250" stroke="#000" stroke-opacity=".35" stroke-width="1.5" stroke-dasharray="3 4"/>
<path d="M70,38 L58,336 M176,38 L188,336" stroke="#000" stroke-opacity=".12" stroke-width="2"/>
<text x="120" y="29" text-anchor="middle" ${fam} font-size="22" letter-spacing="6" fill="${c.fg}">ASINEA</text>
<circle cx="205" cy="66" r="8" fill="none" stroke="${c.fg}" stroke-width="2"/><circle cx="205" cy="66" r="2.5" fill="${c.fg}"/>
<text x="22" y="112" ${fam} font-size="28" fill="${c.fg}">${c.art}</text>
<text x="25" y="195" ${fam} font-size="88" textLength="${tl}" lengthAdjust="spacingAndGlyphs" fill="${c.fg}" opacity=".3">${c.word}</text>
<text x="22" y="192" ${fam} font-size="88" textLength="${tl}" lengthAdjust="spacingAndGlyphs" fill="${c.fg}">${c.word}</text>
<text x="22" y="214" ${mono} font-size="9" letter-spacing="1.4" fill="${c.fg}">${c.tag}</text>
<path d="M22,226 H224" stroke="${c.fg}" stroke-width="2"/>
<circle cx="52" cy="274" r="28" fill="${c.fg}"/>
<text x="52" y="277" text-anchor="middle" ${fam} font-size="25" fill="${c.bg}">${wt}</text>
<text x="52" y="289" text-anchor="middle" ${mono} font-size="6.5" letter-spacing=".6" fill="${c.bg}">${type}</text>
<text x="96" y="256" ${mono} font-size="7.5" letter-spacing="1" fill="${c.fg}">ORIGEN</text>
<text x="96" y="278" ${fam} font-size="24" fill="${c.fg}">${c.region}</text>
<text x="96" y="292" ${mono} font-size="7" letter-spacing=".8" fill="${c.fg}">${c.alt} MSNM</text>
<text x="22" y="322" ${mono} font-size="6.5" letter-spacing=".6" fill="${c.fg}">Nº ${String(n).padStart(3,'0')}</text>
${bars}
<rect x="-10" y="0" width="260" height="346" fill="url(#${id}g)"/>
</g>
<path d="${body}" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="1.5"/>
</svg>`;
}

/* ---------- SOUND ---------- */
const sfx=(()=>{let ctx=null,on=false,master=null;
  function init(){if(ctx)return;try{ctx=new(window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=.5;master.connect(ctx.destination)}catch(e){ctx=null}}
  function noise(d){const n=Math.max(1,Math.floor(ctx.sampleRate*d));const b=ctx.createBuffer(1,n,ctx.sampleRate);const a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=Math.random()*2-1;return b}
  function burst(o){if(!on||!ctx)return;const f=o.f||3000,q=o.q||1,dur=o.dur||.05,g=o.g||.2,at=o.at||0;const t=ctx.currentTime+at;const s=ctx.createBufferSource();s.buffer=noise(dur);const fl=ctx.createBiquadFilter();fl.type=o.type||'bandpass';fl.frequency.setValueAtTime(f,t);if(o.sweep)fl.frequency.exponentialRampToValueAtTime(Math.max(60,f*o.sweep),t+dur);fl.Q.value=q;const gn=ctx.createGain();gn.gain.setValueAtTime(g,t);gn.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(fl);fl.connect(gn);gn.connect(master);s.start(t)}
  function thump(f,dur,g,at){if(!on||!ctx)return;const t=ctx.currentTime+(at||0);const o=ctx.createOscillator();o.type='sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(40,t+dur);const gn=ctx.createGain();gn.gain.setValueAtTime(g,t);gn.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(gn);gn.connect(master);o.start(t);o.stop(t+dur+.02)}
  return{
    get on(){return on},
    set(v){on=v;if(v){init();if(ctx&&ctx.resume)ctx.resume()}},
    rain(sec){for(let i=0;i<sec*26;i++)burst({f:2500+Math.random()*3500,q:3,dur:.03,g:.04+Math.random()*.06,at:Math.random()*sec})},
    clac(){burst({f:900,q:.7,dur:.09,g:.5});thump(110,.2,.6)},
    whoosh(){burst({f:400,q:.8,dur:.5,g:.2,sweep:8})},
    print(sec){for(let i=0;i<sec*22;i++)burst({f:4000,q:6,dur:.015,g:.07,at:i/22})},
    paper(){burst({f:6000,q:.5,dur:.12,g:.12,type:'highpass'})},
    tick(){burst({f:3000+Math.random()*2000,q:4,dur:.02,g:.07})}
  }})();
function syncSound(){const on=sfx.on;$('#snd').textContent='SONIDO: '+(on?'ON':'OFF');$('#snd').setAttribute('aria-pressed',on);$('#sndMTxt').textContent='SONIDO: '+(on?'ON':'OFF')}
function toggleSound(){sfx.set(!sfx.on);syncSound();if(sfx.on){sfx.clac()}}
$('#snd').onclick=toggleSound;$('#sndM').onclick=toggleSound;

/* ---------- BEAN DRAW + RAIN ---------- */
const BEAN_COLS=['#8B5A34','#7A4A2A','#9A6A40','#6B3F22'];
function drawBean(c,x,y,rx,ry,rot,fill,crease){c.save();c.translate(x,y);c.rotate(rot);c.beginPath();c.ellipse(0,0,rx,ry,0,0,6.2832);c.fillStyle=fill;c.fill();c.beginPath();c.moveTo(-rx*.9,0);c.bezierCurveTo(-rx*.4,-ry*.55,rx*.4,ry*.55,rx*.9,0);c.lineWidth=Math.max(1,ry*.2);c.strokeStyle=crease||'rgba(0,0,0,.55)';c.stroke();c.restore()}
class Rain{
  constructor(cv){this.cv=cv;this.c=cv.getContext('2d');this.b=[];this.run=false;this.rate=0;this.acc=0;this.x0=.05;this.x1=.95;this.kill=null;this.fit();addEventListener('resize',()=>this.fit())}
  fit(){const d=Math.min(devicePixelRatio||1,1.5);this.d=d;this.w=this.cv.clientWidth||innerWidth;this.h=this.cv.clientHeight||innerHeight;this.cv.width=this.w*d;this.cv.height=this.h*d}
  start(){if(this.run)return;this.run=true;let last=performance.now();const loop=t=>{if(!this.run)return;const dt=Math.min(.05,(t-last)/1000);last=t;this.step(dt);requestAnimationFrame(loop)};requestAnimationFrame(loop)}
  stop(){this.run=false;this.rate=0;this.b.length=0;this.kill=null;this.c.setTransform(1,0,0,1,0,0);this.c.clearRect(0,0,this.cv.width,this.cv.height)}
  step(dt){
    this.acc+=this.rate*dt;
    while(this.acc>=1){this.acc--;this.b.push({x:lerp(this.x0,this.x1,Math.random())*this.w,y:-16,vx:rnd(-25,25),vy:rnd(150,400),r:rnd(6,12),a:rnd(0,6.28),va:rnd(-6,6),k:Math.floor(rnd(0,BEAN_COLS.length))})}
    const c=this.c,d=this.d;c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,this.w,this.h);
    const lim=this.kill!=null?this.kill:this.h+30;
    for(let i=this.b.length-1;i>=0;i--){const q=this.b[i];q.vy+=1100*dt;q.y+=q.vy*dt;q.x+=q.vx*dt;q.a+=q.va*dt;if(q.y>lim){this.b.splice(i,1);continue}drawBean(c,q.x,q.y,q.r*1.25,q.r*.85,q.a,BEAN_COLS[q.k])}
  }
}

/* ---------- TOAST / LOCK ---------- */
let toastT=0;
function toast(t,ms=2200){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('show'),ms)}
const locks=new Set();
function lock(k,on){on?locks.add(k):locks.delete(k);root.classList.toggle('lock',locks.size>0)}

/* ---------- MARQUEE + HERO BAGS ---------- */
const mqWords=['EN GRANO','MOLIDO','BOLSA SELLADA','CAFÉ SIN DISFRAZ','SIN MOÑOS','100% COLOMBIA'];
function mqHTML(arr){const s=arr.map(w=>`<span>${w} ×</span>`).join('');return s+s}
$('#mq1').innerHTML=mqHTML(mqWords);$('#mq2').innerHTML=mqHTML(['NO ES TAZA','ES BOLSA','CAFÉ PARA LOS QUE NO PIDEN PERMISO','TOSTADO Y EMPACADO','LOTE 001']);
$('#heroBag').innerHTML=bagSVG(byId('desvare'),{type:'grano',weight:250});
$('#heroBag2').innerHTML=bagSVG(byId('culona'),{type:'molido',weight:500});

/* ---------- INTRO ---------- */
const intro=$('#intro'),introRain=new Rain($('#introBeans'));
let introDone=false,introSkip=false;
function introFinal(){const lg=$('#introLogo');lg.classList.remove('glitching');lg.textContent='ASINEA';$('#introTag').textContent='CAFÉ PARA LOS QUE NO PIDEN PERMISO.';$('#introPct').textContent='100%';$('#introBar').style.width='100%';intro.classList.remove('playing')}
async function playIntro(){
  if(RM){introFinal();return}
  intro.classList.add('playing');
  const lg=$('#introLogo'),tag=$('#introTag'),pct=$('#introPct'),bar=$('#introBar');
  lg.textContent='';tag.textContent='';bar.style.width='0%';pct.textContent='00%';
  introRain.fit();introRain.rate=34;introRain.start();
  const t0=performance.now();
  (function tick(){if(introSkip||introDone)return;const p=clamp((performance.now()-t0)/2300);pct.textContent=String(Math.round(p*100)).padStart(2,'0')+'%';bar.style.width=(p*100)+'%';if(p<1)requestAnimationFrame(tick)})();
  const frames=[['A',160],['AS',120],['ASI—',220],['A$1N—',140],['ASINEA',120],['ASIN3A',120],['AS1NEA',100],['ASINEA',200]];
  lg.classList.add('glitching');
  for(const [f,ms] of frames){if(introSkip)break;lg.textContent=f;if(f.length>3)sfx.tick();await new Promise(r=>setTimeout(r,ms))}
  lg.classList.remove('glitching');lg.textContent='ASINEA';
  const full='CAFÉ PARA LOS QUE NO PIDEN PERMISO.';
  for(let i=1;i<=full.length&&!introSkip;i++){tag.textContent=full.slice(0,i);await new Promise(r=>setTimeout(r,26))}
  introFinal();
}
intro.addEventListener('click',e=>{if(e.target.closest('button'))return;introSkip=true;introFinal()});
function enter(withSound){
  if(introDone)return;introDone=true;introSkip=true;
  if(withSound){sfx.set(true);syncSound();sfx.paper();sfx.clac()}
  intro.classList.add('out');
  $('#hero').classList.add('go');
  setTimeout(()=>{intro.hidden=true;introRain.stop();lock('intro',false)},950);
}
lock('intro',true);
$('#enter').onclick=()=>enter(false);
$('#enterSound').onclick=()=>enter(true);
playIntro();

/* ---------- MENU / NAV ---------- */
const menu=$('#menu');
function setMenu(o){menu.classList.toggle('open',o);$('#menuBtn').setAttribute('aria-expanded',o);lock('menu',o)}
$('#menuBtn').onclick=()=>setMenu(true);$('#menuX').onclick=()=>setMenu(false);
$('#menuCart').onclick=()=>{setMenu(false);setTimeout(openCart,300)};
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-go]');if(!a)return;e.preventDefault();
  const t=$(a.dataset.go);const wasOpen=menu.classList.contains('open');setMenu(false);
  setTimeout(()=>{if(t)t.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'})},wasOpen?350:0);
});

/* ---------- WALL ---------- */
const wall=$('#wall');
function scrambleTo(el,to,ms){
  if(RM){el.textContent=to;return}
  clearInterval(el._sc);const chars='ABCDEFGHIJKLMNÑOPQRSTUVWXYZ#%&0123456789';const t0=performance.now();
  el._sc=setInterval(()=>{const p=clamp((performance.now()-t0)/(ms||420));let s='';for(let i=0;i<to.length;i++){s+=(to[i]===' '||i<to.length*p)?to[i]:chars[Math.floor(Math.random()*chars.length)]}el.textContent=s;if(p>=1){clearInterval(el._sc);el.textContent=to}},34);
}
wall.innerHTML=COFFEES.map((c,i)=>`
<article class="slot" role="listitem" style="--c:${c.hi}" data-id="${c.id}">
  <button class="slot-btn" type="button" aria-label="Ver bolsa ${c.art} ${c.word}">
    <span class="slot-ghost" aria-hidden="true">${c.word}</span>
    <span class="bagbox"><span class="bag3d t" data-tilt style="display:block;--rz:${(i%2?2.5:-2.5)}deg">${bagSVG(c,{type:'grano',weight:250})}</span></span>
    <span class="slot-cap">
      <span class="slot-n mono"><span>Nº ${String(i+1).padStart(2,'0')}</span><span>${c.region}</span></span>
      <span class="slot-name" data-name="${c.art} ${c.word}" data-alias="${c.alias}">${c.art} ${c.word}</span>
      <span class="slot-q">“${esc(c.quote)}”</span>
      <span class="slot-go"><span>DESDE ${fmt(priceOf(c,250))}</span><i>VER BOLSA →</i></span>
    </span>
  </button>
</article>`).join('');
let dragMoved=false;
wall.addEventListener('pointerenter',()=>{},true);
$$('.slot',wall).forEach(s=>{
  const nm=$('.slot-name',s),bag=$('.bag3d',s);
  s.addEventListener('pointerenter',e=>{if(e.pointerType==='touch')return;scrambleTo(nm,nm.dataset.alias);bag.classList.remove('wig');void bag.offsetWidth;bag.classList.add('wig')});
  s.addEventListener('pointerleave',e=>{if(e.pointerType==='touch')return;scrambleTo(nm,nm.dataset.name)});
  bag.addEventListener('animationend',()=>bag.classList.remove('wig'));
  $('.slot-btn',s).addEventListener('click',()=>{if(dragMoved)return;openProduct(s.dataset.id)});
});
let drag=null;
wall.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;drag={x:e.clientX,l:wall.scrollLeft};dragMoved=false});
addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>6){dragMoved=true;wall.classList.add('drag')}if(dragMoved)wall.scrollLeft=drag.l-dx});
addEventListener('pointerup',()=>{if(drag){drag=null;wall.classList.remove('drag');setTimeout(()=>dragMoved=false,30)}});
const slotStep=()=>($('.slot',wall).offsetWidth+24);
$('#wPrev').onclick=()=>wall.scrollBy({left:-slotStep(),behavior:'smooth'});
$('#wNext').onclick=()=>wall.scrollBy({left:slotStep(),behavior:'smooth'});

/* ---------- TILT ---------- */
let mx=0,my=0;
document.addEventListener('pointermove',e=>{
  mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;
  if(e.pointerType==='touch')return;
  const t=e.target.closest&&e.target.closest('[data-tilt]');
  if(t){const r=t.getBoundingClientRect();const px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;t.style.setProperty('--ry',(px*26).toFixed(1));t.style.setProperty('--rx',(-py*22).toFixed(1))}
},{passive:true});
document.addEventListener('pointerout',e=>{const t=e.target.closest&&e.target.closest('[data-tilt]');if(t&&!t.contains(e.relatedTarget)){t.style.setProperty('--ry',0);t.style.setProperty('--rx',0)}});

/* ---------- STAGE ---------- */
const stage=$('#stage'),stRain=new Rain($('#stBeans'));
const S={tok:0};const CANCEL={};
let stageDone=null;
function session(){const tok=++S.tok;return{
  step:ms=>new Promise((res,rej)=>setTimeout(()=>tok===S.tok?res():rej(CANCEL),ms)),
  tween:(ms,fn)=>new Promise((res,rej)=>{const t0=performance.now();const f=t=>{if(tok!==S.tok)return rej(CANCEL);const p=clamp((t-t0)/ms);fn(p);p<1?requestAnimationFrame(f):res()};requestAnimationFrame(f)}),
  alive:()=>tok===S.tok}}
function setBag(x,y,s,r,ms){const w=$('#stBagWrap');w.style.transition=ms?`transform ${ms}ms cubic-bezier(.3,.9,.2,1)`:'none';w.style.transform=`translate(-50%,-50%) translate(${x},${y}) scale(${s}) rotate(${r||0}deg)`}
function openStage(mode,c,opts={}){
  stage.className='mode-'+mode;stage.hidden=false;
  stage.style.setProperty('--tc',c.hi);
  const o={type:opts.type||'grano',weight:opts.weight||250};
  $('#stBag .ghost').innerHTML=bagSVG(c,o);$('#stBag .real').innerHTML=bagSVG(c,o);
  const bag=$('#stBag');bag.classList.remove('sealed');bag.style.setProperty('--fill',0);
  $('#stLabel').classList.remove('show');$('#stTitle').textContent='';
  $('#stBox').classList.remove('closed');$('#stBox').style.setProperty('--boxx','120vw');$('#stBox').style.transition='none';
  $('#stBelt').classList.remove('moving');
  const sl=$('#stSealer');sl.style.transition='none';sl.style.transform='translateY(-90vh)';
  setBag(0,0,1,0,0);
  stRain.fit();stRain.stop();
  requestAnimationFrame(()=>stage.classList.add('on'));
}
function mouth(){const r=$('#stBag').getBoundingClientRect();return{y:r.top+r.height*.05,x0:(r.left+r.width*.3)/innerWidth,x1:(r.left+r.width*.7)/innerWidth}}
function title(t,pop=true){const el=$('#stTitle');el.textContent=t;if(pop){el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop')}}
async function fillBag(se,ms){
  const m=mouth();stRain.x0=m.x0;stRain.x1=m.x1;stRain.kill=m.y;stRain.rate=70;stRain.start();sfx.rain(ms/1000);
  await se.tween(ms,p=>{$('#stBag').style.setProperty('--fill',easeIO(p).toFixed(3));const s=1+Math.sin(p*Math.PI)*.03;const w=$('#stBagWrap');if(w._base)w.style.transform=w._base+` scale(${s})`});
  stRain.rate=0;
}
async function sealBag(se){
  const sl=$('#stSealer');sl.style.transition='transform .16s cubic-bezier(.6,0,1,.6)';sl.style.transform='translateY(0)';
  await se.step(170);
  sfx.clac();$('#stBag').classList.add('sealed');stage.classList.add('shake');setTimeout(()=>stage.classList.remove('shake'),280);
  await se.step(260);
  sl.style.transition='transform .35s ease';sl.style.transform='translateY(-90vh)';
}
function endStage(){S.tok++;stage.classList.remove('on');stRain.rate=0;setTimeout(()=>{if(!stage.classList.contains('on')){stage.hidden=true;stRain.stop()}},320)}
$('#stSkip').onclick=()=>{const f=stageDone;stageDone=null;endStage();if(f)f()};
function runStage(fn){return new Promise(resolve=>{stageDone=resolve;fn().then(()=>{stageDone=null;resolve()}).catch(e=>{if(e!==CANCEL)console.error(e);stageDone=null;resolve()})})}

async function playProductIntro(c){
  if(RM)return;
  await runStage(async()=>{
    const se=session();openStage('product',c);
    await se.step(320);
    await fillBag(se,1300);
    await se.step(180);
    await sealBag(se);
    title(c.art+' '+c.word);await se.step(650);
    title('LISTO.');await se.step(500);
  });
}
async function playAdd(c,item){
  if(RM)return;
  await runStage(async()=>{
    const se=session();openStage('add',c,item);
    await se.step(220);
    await fillBag(se,640);
    await sealBag(se);
    setBag('0','0',1,0,0);await se.step(30);
    sfx.whoosh();setBag('130vw','-8vh',.9,24,520);
    await se.step(380);
    title("SE FUE PA' TU CASA.");
    await se.step(900);
  });
}
async function playPack(order){
  const c=byId(order.items[0].id),it=order.items[0];
  if(RM){return}
  await runStage(async()=>{
    const se=session();openStage('pack',c,it);
    const H=$('#stBag').offsetHeight||300,box=$('#stBox'),belt=$('#stBelt');
    setBag('-34vw',(H*.025)+'px',.55,0,0);
    const w=$('#stBagWrap');w._base=null;
    await se.step(400);
    const m=mouth();stRain.x0=m.x0;stRain.x1=m.x1;stRain.kill=m.y;stRain.rate=60;stRain.start();sfx.rain(1.1);
    await se.tween(1100,p=>$('#stBag').style.setProperty('--fill',easeIO(p).toFixed(3)));
    stRain.rate=0;
    const lb=$('#stLabel');lb.innerHTML=`<b>ASINEA</b>PEDIDO ${esc(order.code)}<br>${order.count} BOLSA${order.count>1?'S':''} · ${esc(order.city.toUpperCase())}`;
    lb.classList.add('show');sfx.print(.8);await se.step(900);
    await sealBag(se);
    belt.classList.add('moving');box.style.transition='transform .8s cubic-bezier(.3,.9,.2,1)';box.style.setProperty('--boxx','0px');sfx.whoosh();
    await se.step(850);
    setBag('0px',(-H*.435)+'px',.55,0,700);await se.step(800);
    setBag('0px',(H*.1)+'px',.36,0,420);await se.step(440);
    box.classList.add('closed');sfx.clac();stage.classList.add('shake');setTimeout(()=>stage.classList.remove('shake'),280);
    await se.step(700);
    box.style.setProperty('--boxx','130vw');sfx.whoosh();
    await se.step(300);
    title('LISTO.');await se.step(800);
    title("YA VA PA' ALLÁ.");await se.step(1500);
    belt.classList.remove('moving');
  });
}

/* ---------- PRODUCT ---------- */
const product=$('#product');let P=null,prodOpen=false;
const GRAT=[[-81,.5],[0,0]];
function miniMapPath(w,h){return ''}
function openProduct(id){
  if(prodOpen)return;const c=byId(id);if(!c)return;prodOpen=true;
  P={c,type:'grano',grind:GRINDS[0],weight:250,qty:1};
  buildProduct();lock('product',true);
  playProductIntro(c).then(()=>{if(!prodOpen)return;product.hidden=false;product.scrollTop=0;requestAnimationFrame(()=>{product.classList.add('open');product.querySelector('.p-info').classList.add('p-reveal');endStage()})});
}
function closeProduct(){if(!prodOpen)return;prodOpen=false;product.classList.remove('open');endStage();setTimeout(()=>{if(!prodOpen){product.hidden=true;product.innerHTML='';lock('product',false)}},420)}
function maxQty(c){return Math.min(12,c.stock)}
function buildProduct(){
  const c=P.c,i=COFFEES.indexOf(c);
  product.style.setProperty('--c',c.hi);
  const pins=colPoint(c.region);
  product.innerHTML=`
  <button class="tagbtn p-close" id="pClose" type="button">CERRAR ✕</button>
  <div class="p-wrap">
    <div class="p-bagcol"><div class="p-ghost" aria-hidden="true">${c.word}</div><div class="p-bag bag3d t" id="pBag" data-tilt></div><p class="mono p-code">Nº ${String(i+1).padStart(2,'0')} / LOS PROBLEMÁTICOS</p></div>
    <div class="p-info">
      <p class="mono" style="color:var(--c)">LOS PROBLEMÁTICOS / ${c.tag}</p>
      <h2 class="p-name"><small>${c.art}</small><span id="pNameTxt">${c.word}</span></h2>
      <blockquote class="p-quote" style="margin:0">“${esc(c.quote)}”</blockquote>
      <p class="p-vibe">${esc(c.vibe)}</p>
      <div class="ficha">
        <div class="f origen" tabindex="0"><b>ORIGEN</b><span>COLOMBIA</span><span>${c.region}</span>
          <svg class="omap" viewBox="-4 -4 108 138" aria-hidden="true"><path d="${COL_PATH}"/><circle cx="${pins.x}" cy="${pins.y}" r="5"/></svg></div>
        <div class="f"><b>ALTURA</b><span>${c.alt} MSNM</span></div>
        <div class="f"><b>VARIEDAD</b><span>${c.variety}</span></div>
        <div class="f"><b>PROCESO</b><span>${c.proc}</span></div>
        <div class="f"><b>TOSTIÓN</b><div class="roast" aria-label="Nivel ${c.roast} de 5">${[1,2,3,4,5].map(n=>`<i class="${n<=c.roast?'on':''}"></i>`).join('')}</div><span style="font-size:1.1rem">${c.roastName}</span></div>
        <div class="f wide"><b>NOTAS</b><div class="chips">${c.notes.map(n=>`<span class="chip" tabindex="0" style="--nc:${NC[n]||c.hi}">${n}</span>`).join('')}</div></div>
      </div>
      <div class="opts">
        <div class="opt-row"><span class="lg">TIPO</span><div class="seg" id="segType"><button type="button" data-v="grano" aria-pressed="true">EN GRANO</button><button type="button" data-v="molido" aria-pressed="false">MOLIDO</button></div></div>
        <div class="opt-row" id="grindRow" hidden><label for="grindSel">MOLIENDA</label><select id="grindSel">${GRINDS.map(g=>`<option>${g}</option>`).join('')}</select></div>
        <div class="opt-row"><span class="lg">BOLSA</span><div class="seg" id="segW">${WEIGHTS.map((w,k)=>`<button type="button" data-v="${w.g}" aria-pressed="${k===0}">${w.label}</button>`).join('')}</div></div>
        <div class="opt-row"><span class="lg">CANTIDAD</span><div class="qty"><button type="button" id="qMinus" aria-label="Menos">−</button><output id="qOut">1</output><button type="button" id="qPlus" aria-label="Más">+</button></div></div>
      </div>
      <div class="buy">
        <div class="price-row"><div class="price" id="pPrice" aria-live="polite"></div><p class="avail mono" id="pAvail"></p></div>
        <button class="cta" id="pAdd" type="button"><span>ME LA LLEVO</span><span aria-hidden="true">→</span></button>
        <button class="cta two" id="pNow" type="button"><span>QUIERO ESA BOLSA</span><span aria-hidden="true">↗</span></button>
        <p class="mono" style="opacity:.55">Café empacado en bolsa sellada. No vendemos café preparado.</p>
      </div>
    </div>
  </div>`;
  paintProduct();
  $('#pClose').onclick=closeProduct;
  $$('#segType button').forEach(b=>b.onclick=()=>{P.type=b.dataset.v;$$('#segType button').forEach(x=>x.setAttribute('aria-pressed',x===b));$('#grindRow').hidden=P.type!=='molido';paintProduct(true)});
  $$('#segW button').forEach(b=>b.onclick=()=>{P.weight=+b.dataset.v;$$('#segW button').forEach(x=>x.setAttribute('aria-pressed',x===b));paintProduct(true)});
  $('#grindSel').onchange=e=>{P.grind=e.target.value};
  $('#qMinus').onclick=()=>{P.qty=Math.max(1,P.qty-1);paintProduct()};
  $('#qPlus').onclick=()=>{P.qty=Math.min(maxQty(c),P.qty+1);paintProduct()};
  $('#pAdd').onclick=()=>addFromProduct(false);
  $('#pNow').onclick=()=>addFromProduct(true);
  const pr=$('#pPrice');pr.onpointerenter=()=>scrambleNum(pr);
  $$('.chip',product).forEach(ch=>{const burst=()=>{for(let i=0;i<9;i++){const d=document.createElement('i');d.className='nd';const a=i/9*6.283,r=rnd(30,56);d.style.setProperty('--dx',Math.cos(a)*r+'px');d.style.setProperty('--dy',Math.sin(a)*r+'px');d.style.background=NC[ch.textContent]||c.hi;ch.appendChild(d);setTimeout(()=>d.remove(),720)}};ch.onpointerenter=burst;ch.onfocus=burst});
  const nt=$('#pNameTxt');nt.onpointerenter=()=>scrambleTo(nt,c.alias.replace(/^(EL|LA) /,''));nt.onpointerleave=()=>scrambleTo(nt,c.word);
}
function scrambleNum(el){if(RM)return;const final=fmt(priceOf(P.c,P.weight)*P.qty);let n=0;clearInterval(el._sn);el._sn=setInterval(()=>{n++;if(n>9){clearInterval(el._sn);paintPrice();return}el.firstChild.textContent=final.replace(/\d/g,()=>Math.floor(Math.random()*10))},36)}
function paintPrice(){$('#pPrice').innerHTML=`${fmt(priceOf(P.c,P.weight)*P.qty)}<small>COP</small>`}
function paintProduct(rebag){
  const c=P.c;
  if(rebag!==undefined||!$('#pBag').firstChild)$('#pBag').innerHTML=bagSVG(c,{type:P.type,weight:P.weight});
  if(rebag){const b=$('#pBag');b.classList.remove('wig');void b.offsetWidth;b.classList.add('wig')}
  paintPrice();$('#qOut').textContent=P.qty;
  const av=$('#pAvail');av.className='avail mono';
  if(c.stock<=0){av.classList.add('out');av.innerHTML='<i></i>AGOTADO'}else if(c.stock<=20){av.classList.add('low');av.innerHTML=`<i></i>ÚLTIMAS ${c.stock} BOLSAS`}else{av.innerHTML=`<i></i>DISPONIBLE · ${c.stock} BOLSAS`}
  $('#pAdd').disabled=$('#pNow').disabled=c.stock<=0;
}
$('#product').addEventListener('animationend',e=>{if(e.target.id==='pBag')e.target.classList.remove('wig')});
function addFromProduct(goCart){
  const c=P.c;
  const item={id:c.id,type:P.type,grind:P.type==='molido'?P.grind:null,weight:P.weight,qty:P.qty};
  addToCart(item);
  playAdd(c,item).then(()=>{bumpCart();dropBean($('#cartBtn'));if(goCart){closeProduct();setTimeout(openCart,300)}else toast('EN TU BANDA: '+c.art+' '+c.word)});
}

/* ---------- COLOMBIA GEOMETRY ---------- */
const BORDER=[[-71.3,12.45],[-72.0,11.9],[-73.0,11.3],[-74.2,11.2],[-74.9,10.9],[-75.5,10.4],[-75.7,9.6],[-76.4,8.9],[-76.8,8.3],[-77.35,8.65],[-77.5,7.9],[-77.9,7.2],[-77.45,6.1],[-77.4,4.6],[-78.0,3.3],[-78.85,2.4],[-78.9,1.6],[-78.5,1.2],[-77.7,.85],[-77.0,.35],[-76.3,.3],[-75.5,-.1],[-75.2,-.9],[-74.2,-1.0],[-73.2,-2.5],[-72.0,-2.4],[-70.7,-3.8],[-69.95,-4.2],[-69.4,-1.1],[-69.6,.5],[-67.9,1.8],[-67.2,2.3],[-67.5,3.7],[-67.8,4.5],[-67.5,6.2],[-68.4,6.2],[-69.4,6.1],[-70.1,6.95],[-71.1,7.0],[-72.05,7.0],[-72.5,7.4],[-72.4,8.4],[-73.0,9.1],[-72.8,10.2],[-72.0,11.5]];
const proj=(lon,lat)=>({x:+((lon+79.2)*7.6).toFixed(2),y:+((12.8-lat)*7.6).toFixed(2)});
const COL_PATH='M'+BORDER.map(p=>{const q=proj(p[0],p[1]);return q.x+','+q.y}).join(' L')+' Z';
const REGIONS={TOLIMA:{lon:-75.2,lat:4.4},HUILA:{lon:-75.6,lat:2.5},ANTIOQUIA:{lon:-75.6,lat:6.6},NARIÑO:{lon:-77.3,lat:1.3},SANTANDER:{lon:-73.1,lat:6.9}};
function colPoint(r){const g=REGIONS[r]||{lon:-74,lat:4};return proj(g.lon,g.lat)}

/* ---------- MAP ---------- */
const mapSvg=$('#mapSvg');
$('#mapOutline').setAttribute('d',COL_PATH);
(function(){let g='';[0,4,8,12].forEach(lat=>{const y=proj(-80,lat).y;g+=`<line x1="-4" x2="104" y1="${y}" y2="${y}"/><text x="-3" y="${y-.8}">${lat}°N</text>`});[-78,-74,-70].forEach(lon=>{const x=proj(lon,0).x;g+=`<line y1="-4" y2="134" x1="${x}" x2="${x}"/><text x="${x+.8}" y="132">${Math.abs(lon)}°O</text>`});$('#mapGrat').innerHTML=g})();
const pinsG=$('#mapPins');
pinsG.innerHTML=Object.keys(REGIONS).map((k,i)=>{const p=colPoint(k);return `<g class="mpin" style="--i:${i}" data-r="${k}" tabindex="0" role="button" aria-label="Ver café de ${k}"><circle class="ring" cx="${p.x}" cy="${p.y}" r="1.6"/><circle class="dot" cx="${p.x}" cy="${p.y}" r="2"/><text x="${p.x+3.4}" y="${p.y+1.6}">${k}</text></g>`}).join('');
let vb=[-4,-4,108,138],vbT=0;
function setVB(a){vb=a;mapSvg.setAttribute('viewBox',a.map(n=>n.toFixed(2)).join(' '))}
function zoomTo(t){const from=vb.slice(),t0=performance.now();cancelAnimationFrame(vbT);if(RM){setVB(t);return}const f=n=>{const p=easeIO(clamp((n-t0)/1100));setVB(from.map((v,i)=>lerp(v,t[i],p)));if(p<1)vbT=requestAnimationFrame(f)};vbT=requestAnimationFrame(f)}
function showRegion(k){
  $$('.mpin').forEach(p=>p.classList.toggle('sel',p.dataset.r===k));
  const info=$('#mapInfo');
  if(!k){zoomTo([-4,-4,108,138]);info.innerHTML=`<h3>5 REGIONES.<br>6 BOLSAS.</h3><p class="mono" style="opacity:.7">Toca un punto del mapa para ver qué café sale de ahí.</p>`;return}
  const p=colPoint(k);zoomTo([p.x-17,p.y-23,34,46]);
  const list=COFFEES.filter(c=>c.region===k);
  info.innerHTML=`<p class="mono" style="color:var(--asi)">REGIÓN CAFETERA</p><h3>${k}</h3>
  <div class="mi-list">${list.map(c=>`<button class="mi-item" type="button" style="--c:${c.hi}" data-id="${c.id}"><span style="display:flex;align-items:center;gap:12px"><i class="mi-dot"></i><b>${c.art} ${c.word}</b></span><span class="mono">${c.alt} MSNM · ${c.proc}</span></button>`).join('')}</div>
  <button class="tagbtn" id="mapReset" type="button" style="width:max-content">← VER TODO EL PAÍS</button>`;
  $$('.mi-item',info).forEach(b=>b.onclick=()=>openProduct(b.dataset.id));
  $('#mapReset').onclick=()=>showRegion(null);
}
pinsG.addEventListener('click',e=>{const p=e.target.closest('.mpin');if(p)showRegion(p.dataset.r)});
pinsG.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const p=e.target.closest('.mpin');if(p){e.preventDefault();showRegion(p.dataset.r)}}});
showRegion(null);
new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){$('#mapBox').classList.add('draw');o.disconnect()}},{threshold:.3}).observe($('#mapBox'));

/* ---------- CART ---------- */
let cart=store.get('asinea_cart_v1',[]);if(!Array.isArray(cart))cart=[];cart=cart.filter(i=>byId(i.id)&&WEIGHTS.some(w=>w.g===i.weight)&&i.qty>0);
let cartView='bag',lastDone=null,newKey=null,cartOpen=false;
const keyOf=i=>[i.id,i.type,i.grind||'',i.weight].join('|');
const saveCart=()=>store.set('asinea_cart_v1',cart);
const count=()=>cart.reduce((a,i)=>a+i.qty,0);
const total=()=>cart.reduce((a,i)=>a+priceOf(byId(i.id),i.weight)*i.qty,0);
function paintCount(){$('#cartCount').textContent=count()}
function bumpCart(){const b=$('#cartBtn');b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump')}
function dropBean(target){
  if(RM||!target)return;const r=target.getBoundingClientRect();const b=document.createElement('i');b.className='dropbean';document.body.appendChild(b);
  const x=r.left+r.width/2;b.animate([{transform:`translate(${x-40}px,-20px) rotate(0)`,opacity:1},{transform:`translate(${x}px,${r.top+r.height/2}px) rotate(540deg)`,opacity:.1}],{duration:650,easing:'cubic-bezier(.5,0,1,.6)'}).onfinish=()=>b.remove();
}
function addToCart(item){const k=keyOf(item);const ex=cart.find(i=>keyOf(i)===k);if(ex)ex.qty=Math.min(24,ex.qty+item.qty);else cart.push({...item});newKey=k;saveCart();paintCount();if(cartOpen)renderCart()}
function openCart(){if(cartOpen)return;cartOpen=true;if(cartView==='done'&&!lastDone)cartView='bag';const el=$('#cart');el.hidden=false;renderCart();lock('cart',true);requestAnimationFrame(()=>el.classList.add('open'))}
function closeCart(keep){if(!cartOpen)return;cartOpen=false;const el=$('#cart');el.classList.remove('open');setTimeout(()=>{if(!cartOpen){el.hidden=true;lock('cart',false);if(cartView==='done'&&keep!==true){cartView='bag';lastDone=null}}},520)}
$('#cartBtn').onclick=openCart;$('#cClose').onclick=()=>closeCart();$('#cScrim').onclick=()=>closeCart();
function renderCart(){
  const body=$('#cBody'),foot=$('#cFoot');
  if(cartView==='done'&&lastDone){
    body.innerHTML=`<div class="c-empty"><p class="mono" style="color:var(--asi)">PEDIDO REGISTRADO</p><h3>LISTO.<br>YA VA PA' ALLÁ.</h3><p class="done-code">${esc(lastDone.code)}</p><p>${lastDone.count} bolsa${lastDone.count>1?'s':''} · ${fmt(lastDone.total)}</p><div class="co-demo mono">SOLO FALTA UN PASO: envía tu pedido por WhatsApp. El pago y el envío se coordinan por ahí.</div></div>`;
    foot.innerHTML=`<a class="cta" id="waBtn" href="${esc(waLink(lastDone))}" target="_blank" rel="noopener"><span>ENVIAR PEDIDO POR WHATSAPP</span><span>↗</span></a><button class="cta two" type="button" id="doneBack"><span>SEGUIR MIRANDO</span><span>→</span></button>`;
    $('#doneBack').onclick=()=>{cartView='bag';lastDone=null;closeCart();setTimeout(()=>$('#cafes').scrollIntoView({behavior:'smooth'}),500)};
    return;
  }
  if(!cart.length){cartView='bag';
    body.innerHTML=`<div class="c-empty"><h3>TU BANDA<br>ESTÁ VACÍA.</h3><p>Todavía no hay ninguna bolsa. Échale una.</p></div>`;
    foot.innerHTML=`<button class="cta" type="button" id="goCafes"><span>VER LOS CAFÉS</span><span>↓</span></button>`;
    $('#goCafes').onclick=()=>{closeCart();setTimeout(()=>$('#cafes').scrollIntoView({behavior:'smooth'}),500)};return}
  if(cartView==='checkout'){
    body.innerHTML=`<form class="co-form" id="coForm" novalidate>
      <p class="mono" style="color:var(--asi)">DATOS DE ENVÍO</p>
      <label>Nombre completo<input id="coName" autocomplete="name" required></label>
      <div class="co-2"><label>Celular<input id="coTel" type="tel" autocomplete="tel" required inputmode="tel"></label><label>Correo<input id="coMail" type="email" autocomplete="email" required></label></div>
      <div class="co-2"><label>Departamento<input id="coDep" required autocomplete="address-level1"></label><label>Ciudad<input id="coCity" required autocomplete="address-level2"></label></div>
      <label>Dirección<input id="coAddr" required autocomplete="street-address"></label>
      <label>Notas del pedido<textarea id="coNote" rows="2"></textarea></label>
      <div class="co-demo mono">AL CONFIRMAR, TE LLEVAMOS A WHATSAPP CON TU PEDIDO LISTO PARA ENVIAR. EL PAGO Y EL ENVÍO SE COORDINAN POR AHÍ.</div>
      <p class="mono" id="coErr" style="color:#FF6B5B" role="alert"></p></form>`;
    foot.innerHTML=`<div class="total"><span>TOTAL DEL DESORDEN</span><b>${fmt(total())}</b></div><button class="cta" type="submit" form="coForm" id="coGo"><span>CONFIRMAR Y PEDIR POR WHATSAPP</span><span>→</span></button><button class="ci-x" type="button" id="coBack" style="justify-self:start">← VOLVER A MI BANDA</button>`;
    $('#coBack').onclick=()=>{cartView='bag';renderCart()};
    $('#coForm').addEventListener('submit',e=>{e.preventDefault();checkout()});
    return}
  body.innerHTML=cart.map((it,idx)=>{const c=byId(it.id),k=keyOf(it);const isNew=k===newKey;
    return `<div class="c-item ${isNew?'new':''}" data-k="${esc(k)}" style="--c:${c.hi}">
      <div class="ci-bag">${bagSVG(c,{type:it.type,weight:it.weight})}</div>
      <div class="ci-t"><b>${c.art} ${c.word}</b><span>${it.type==='molido'?'MOLIDO · '+esc(it.grind||''):'EN GRANO'} · ${WEIGHTS.find(w=>w.g===it.weight).label}</span>
        <div class="qty sm"><button type="button" data-a="m" aria-label="Menos">−</button><output>${it.qty}</output><button type="button" data-a="p" aria-label="Más">+</button></div></div>
      <div class="ci-r"><span class="ci-price">${fmt(priceOf(c,it.weight)*it.qty)}</span><button class="ci-x" type="button" data-a="x">QUITAR</button></div></div>`}).join('');
  newKey=null;
  foot.innerHTML=`<div class="total"><span>TOTAL DEL DESORDEN</span><b>${fmt(total())}</b></div><p class="c-note mono">${count()} bolsa${count()>1?'s':''} · pago y envío se coordinan por WhatsApp</p><button class="cta" type="button" id="toCheckout"><span>MANDARLO PA' LA CASA</span><span>→</span></button>`;
  $('#toCheckout').onclick=()=>{cartView='checkout';renderCart();$('#cBody').scrollTop=0};
}
$('#cBody').addEventListener('click',e=>{
  const btn=e.target.closest('[data-a]');if(!btn)return;const row=btn.closest('.c-item');if(!row)return;
  const it=cart.find(i=>keyOf(i)===row.dataset.k);if(!it)return;const a=btn.dataset.a;
  if(a==='p'){it.qty=Math.min(24,it.qty+1);saveCart();paintCount();renderCart();dropBean($('#cFoot .total b'))}
  else if(a==='m'){it.qty=Math.max(1,it.qty-1);saveCart();paintCount();renderCart()}
  else if(a==='x'){row.classList.add('fly');sfx.whoosh();setTimeout(()=>{cart=cart.filter(i=>i!==it);saveCart();paintCount();renderCart()},RM?0:430)}
});
const WA_NUM='573044590274';
function waLink(o){
  const L=o.items.map(i=>{const c=byId(i.id);return `• ${i.qty}x ${c.art} ${c.word} · ${i.type==='molido'?'MOLIDO ('+(i.grind||'')+')':'EN GRANO'} · ${WEIGHTS.find(w=>w.g===i.weight).label} — ${fmt(priceOf(c,i.weight)*i.qty)}`}).join('\n');
  const k=o.customer;
  const msg=`Hola ASINEA, quiero hacer este pedido (${o.code}):\n\n${L}\n\nTOTAL: ${fmt(o.total)}\n\nNombre: ${k.name}\nCelular: ${k.phone}\nCorreo: ${k.email}\nDepartamento: ${k.department}\nCiudad: ${k.city}\nDirección: ${k.address}${k.note?'\nNotas: '+k.note:''}`;
  return 'https://wa.me/'+WA_NUM+'?text='+encodeURIComponent(msg);
}
function orderCode(){return 'ASI-'+Date.now().toString(36).toUpperCase().slice(-5)+Math.floor(rnd(10,99))}
function submitOrder(order){
  /* El pedido se guarda en este navegador y se envía por WhatsApp (waLink).
     Aquí se puede conectar después una pasarela de pago o una transportadora. */
  const list=store.get('asinea_orders_v1',[]);list.push(order);store.set('asinea_orders_v1',list);
}
function checkout(){
  const f={name:$('#coName'),tel:$('#coTel'),mail:$('#coMail'),dep:$('#coDep'),city:$('#coCity'),addr:$('#coAddr')};
  const bad=Object.values(f).find(el=>!el.value.trim());const err=$('#coErr');
  if(bad){err.textContent='Falta llenar este campo para poder mandarlo.';bad.focus();return}
  if(!/^\S+@\S+\.\S+$/.test(f.mail.value.trim())){err.textContent='Revisa el correo, parece incompleto.';f.mail.focus();return}
  const order={code:orderCode(),date:new Date().toISOString(),items:cart.map(i=>({...i})),count:count(),total:total(),
    customer:{name:f.name.value.trim(),phone:f.tel.value.trim(),email:f.mail.value.trim(),department:f.dep.value.trim(),city:f.city.value.trim(),address:f.addr.value.trim(),note:$('#coNote').value.trim()},city:f.city.value.trim(),status:'whatsapp'};
  submitOrder(order);
  cart=[];saveCart();paintCount();lastDone=order;cartView='done';
  closeCart(true);
  setTimeout(()=>{playPack(order).then(()=>{endStage();openCart();try{window.open(waLink(order),'_blank','noopener')}catch(e){}})},RM?0:480);
}

/* ---------- PINNED SCENES ---------- */
function prog(el){const r=el.getBoundingClientRect();return{p:clamp(-r.top/Math.max(1,r.height-innerHeight)),vis:r.bottom>0&&r.top<innerHeight}}
const MB=[['#0A0908','#EFEBE1','#FFD60A'],['#FFD60A','#0A0908','#E3122B'],['#E3122B','#EFEBE1','#0A0908'],['#EFEBE1','#0A0908','#2B3BFF'],['#2B3BFF','#EFEBE1','#FFD60A'],['#0A0908','#EFEBE1','#FFD60A'],['#FFD60A','#0A0908','#0A0908']];
const manifSec=$('#manifiesto'),manifEl=$('#manif'),mls=$$('.ml',manifEl);let mi=0;
function updManif(){const {p,vis}=prog(manifSec);if(!vis)return;const n=mls.length;const i=Math.min(n-1,Math.floor(p*n*.999));manifEl.style.setProperty('--mp',p.toFixed(3));if(i!==mi){mi=i;mls.forEach((l,k)=>{l.classList.toggle('on',k===i);l.classList.toggle('past',k<i)});const c=MB[i];manifEl.style.setProperty('--mbg',c[0]);manifEl.style.setProperty('--mfg',c[1]);manifEl.style.setProperty('--mhi',c[2]);$('#mfi').textContent=i+1;if(i>0)sfx.tick()}}

/* grano */
const granoSec=$('#grano'),gT=$('#gHalfT'),gB=$('#gHalfB'),gGap=$('#gGap'),gBean=$('#gBean');
function updGrano(){const {p,vis}=prog(granoSec);if(!vis)return;
  const split=p<.2?0:p<.5?easeO((p-.2)/.3):p<.7?1:1-easeO((p-.7)/.25);const d=split*58;
  gT.style.transform=`translateY(${-d}px)`;gB.style.transform=`translateY(${d}px)`;gGap.setAttribute('opacity',split>0?1:0);gGap.setAttribute('height',24+d*2);gGap.setAttribute('y',118-d);
  $('#gCreaseT').style.transform=`translateY(${-d}px)`;
  gBean.style.transform=`perspective(1100px) rotateZ(${-18+p*40}deg) rotateY(${Math.sin(p*Math.PI*2)*28}deg) rotateX(${(p-.5)*26}deg)`;
  const co=a=>clamp((split-a)*2.2);$('#gc1').style.setProperty('--co',co(.25).toFixed(2));$('#gc2').style.setProperty('--co',co(.5).toFixed(2));$('#gc3').style.setProperty('--co',co(.75).toFixed(2));
}

/* molido */
const molSec=$('#molido'),molCv=$('#molCanvas'),molCx=molCv.getContext('2d');
let molP=null,molW=0,molH=0,molD=1;
function molInit(){
  molD=Math.min(devicePixelRatio||1,1.5);molW=molCv.clientWidth;molH=molCv.clientHeight;molCv.width=molW*molD;molCv.height=molH*molD;
  const N=COARSE||molW<700?850:1700;const base=Math.min(molW,molH);const cx=molW/2,cy=molH*.42,rx=base*.3,ry=base*.19,rot=-.35;
  const cols=['#4A2A17','#6B3F22','#8B5A34','#33190C','#A06C3F'];
  const mw=Math.min(molW*.42,base*.7),mh=base*.3,ground=molH*.84;
  molP=[];
  for(let i=0;i<N;i++){
    let u,v;do{u=rnd(-1,1);v=rnd(-1,1)}while(u*u+v*v>1);
    const ox=cx+(u*rx)*Math.cos(rot)-(v*ry)*Math.sin(rot),oy=cy+(u*rx)*Math.sin(rot)+(v*ry)*Math.cos(rot);
    const ang=rnd(0,6.283),dist=rnd(.1,.55)*base;
    const tx=cx+(rnd(-1,1)+rnd(-1,1))/2*mw;const hh=mh*(1-Math.abs(tx-cx)/mw);
    molP.push({ox,oy,sx:ox+Math.cos(ang)*dist*1.3,sy:oy+Math.sin(ang)*dist*.8-base*.1,tx,ty:ground-Math.random()*Math.max(2,hh),d:rnd(0,.4),s:rnd(1.6,3.4),c:cols[i%cols.length]});
  }
  molP.geo={cx,cy,rx,ry,rot,ground};
}
function updMolido(){const {p,vis}=prog(molSec);if(!vis)return;
  if(!molP||molCv.clientWidth!==molW||molCv.clientHeight!==molH)molInit();
  const c=molCx,d=molD;c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,molW,molH);
  const g=molP.geo;
  const crack=clamp(p/.2),exp=clamp((p-.2)/.3),col=clamp((p-.5)/.5);
  if(p<.28){
    const sh=crack*6;const a=1-clamp((p-.2)/.08);
    c.save();c.globalAlpha=a;c.translate(rnd(-sh,sh)*.4,rnd(-sh,sh)*.4);drawBean(c,g.cx,g.cy,g.rx,g.ry,g.rot,'#7A4A2A','rgba(0,0,0,.7)');
    c.strokeStyle='rgba(255,214,10,.9)';c.lineWidth=2;c.lineCap='round';
    const cr=[[-.6,-.1,-.2,.4],[-.2,.3,.1,-.4],[.2,-.3,.55,.2],[.1,.2,.4,.5],[-.4,-.3,.0,-.5],[.5,-.1,.7,.25]];
    cr.forEach((q,k)=>{const t=clamp(crack*1.6-k*.12);if(t<=0)return;c.beginPath();c.moveTo(g.cx+Math.cos(g.rot)*q[0]*g.rx-Math.sin(g.rot)*q[1]*g.ry,g.cy+Math.sin(g.rot)*q[0]*g.rx+Math.cos(g.rot)*q[1]*g.ry);const ex=lerp(q[0],q[2],t),ey=lerp(q[1],q[3],t);c.lineTo(g.cx+Math.cos(g.rot)*ex*g.rx-Math.sin(g.rot)*ey*g.ry,g.cy+Math.sin(g.rot)*ex*g.rx+Math.cos(g.rot)*ey*g.ry);c.stroke()});
    c.restore();
  }
  if(p>.2){
    for(let i=0;i<molP.length;i++){const q=molP[i];let x,y;
      if(col<=0){const e=easeO(exp);x=lerp(q.ox,q.sx,e);y=lerp(q.oy,q.sy,e)}
      else{const t=easeIO(clamp((col*1.45-q.d)/1));x=lerp(q.sx,q.tx,t);y=lerp(q.sy,q.ty,t)}
      c.fillStyle=q.c;c.fillRect(x,y,q.s,q.s)}
  }
  $('#molSub').style.opacity=(.35+.65*clamp((p-.55)/.3)).toFixed(2);
}

/* proceso */
const prSec=$('#proceso'),prCv=$('#prCanvas'),prCx=prCv.getContext('2d'),prBag=$('#prBag'),prRoute=$('#prRoute');
const prTexts=$$('.pr-t'),prDots=$$('#prDots i');
let prBeans=null,prW=0,prH=0,prD=1,prStep=-1;
const prBagCoffee=byId('desvare');
$('#prBag .real').innerHTML=bagSVG(prBagCoffee,{type:'grano',weight:250});$('#prBag .ghost').innerHTML=bagSVG(prBagCoffee,{type:'grano',weight:250});
function prInit(){
  prD=Math.min(devicePixelRatio||1,1.5);prW=prCv.clientWidth;prH=prCv.clientHeight;prCv.width=prW*prD;prCv.height=prH*prD;
  const cols=prW<420?7:9,rows=prW<420?6:6;prBeans=[];
  const gx=prW*.8/(cols-1),gy=prH*.7/(rows-1),x0=prW*.1,y0=prH*.15;const r=Math.min(gx,gy)*.34;
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const bad=Math.random()<.22;prBeans.push({x:x0+i*gx+rnd(-3,3),y:y0+j*gy+rnd(-3,3),r:r*rnd(.85,1.1),a:rnd(0,3.14),bad,v:rnd(0,1),dots:Array.from({length:6},()=>({dx:rnd(-1,1),dy:rnd(-1,1)}))})}
}
const lerpCol=(a,b,t)=>{const pa=a.match(/\w\w/g).map(h=>parseInt(h,16)),pb=b.match(/\w\w/g).map(h=>parseInt(h,16));return `rgb(${pa.map((v,i)=>Math.round(lerp(v,pb[i],t))).join(',')})`};
function roastCol(t){return t<.5?lerpCol('86A052','C98A3C',t*2):lerpCol('C98A3C','2E1809',(t-.5)*2)}
function updProceso(){const {p,vis}=prog(prSec);if(!vis)return;
  if(!prBeans||prCv.clientWidth!==prW||prCv.clientHeight!==prH)prInit();
  const s=Math.min(4,Math.floor(p*5*.999)),lp=clamp(p*5-s);
  if(s!==prStep){prStep=s;prTexts.forEach((t,i)=>t.classList.toggle('on',i===s));prDots.forEach((d,i)=>d.classList.toggle('on',i<=s));$('#prLabel').textContent=['MESA DE SELECCIÓN','TOSTADORA','MOLINO','LÍNEA DE EMPAQUE','RUTA DE ENTREGA'][s];if(s>0)sfx.tick()}
  const c=prCx,d=prD;c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,prW,prH);
  const t=performance.now()/1000;
  if(s<=2){
    prBeans.forEach(b=>{
      if(s===0){
        const scan=lp*1.1*prH;let alpha=1,x=b.x,y=b.y,rot=b.a;
        if(b.bad&&lp>.45){const k=clamp((lp-.45)/.4);x+=k*prW*.4;y-=k*prH*.5;rot+=k*6;alpha=1-k}
        c.globalAlpha=alpha;drawBean(c,x,y,b.r*1.3,b.r*.9,rot,b.bad?'#5A5B38':'#86A052','rgba(0,0,0,.45)');
        if(b.bad&&lp<.5){c.strokeStyle='#E3122B';c.lineWidth=1.6;c.beginPath();c.moveTo(b.x-b.r,b.y-b.r);c.lineTo(b.x+b.r,b.y+b.r);c.stroke()}
        c.globalAlpha=1;
        if(Math.abs(b.y-scan)<22){c.strokeStyle='rgba(255,214,10,.9)';c.lineWidth=1.5;c.beginPath();c.arc(b.x,b.y,b.r*1.7,0,6.283);c.stroke()}
      }else if(!b.bad){
        const sh=s===1?Math.sin(t*30+b.v*9)*lp*1.6:0;
        if(s===1){c.globalAlpha=1;drawBean(c,b.x+sh,b.y,b.r*(1.3+lp*.2),b.r*(.9+lp*.12),b.a,roastCol(lp),'rgba(0,0,0,.55)')}
        else{const e=easeIO(lp);const rr=b.r*1.5*(1-e);if(rr>1)drawBean(c,b.x,b.y,rr,rr*.7,b.a,roastCol(1),'rgba(0,0,0,.6)');
          c.fillStyle='#3a1f10';b.dots.forEach((q,k)=>{const sp=e*b.r*2.4;c.globalAlpha=.4+.6*e;c.fillRect(b.x+q.dx*sp-1,b.y+q.dy*sp-1,2.4,2.4)});c.globalAlpha=1}
      }
    });
    if(s===0){c.strokeStyle='rgba(255,214,10,.85)';c.lineWidth=2;c.beginPath();c.moveTo(0,lp*1.1*prH);c.lineTo(prW,lp*1.1*prH);c.stroke()}
    if(s===1){c.fillStyle=`rgba(255,120,30,${.05+lp*.12})`;c.fillRect(0,prH*.82,prW,prH*.18);c.strokeStyle=`rgba(255,140,40,${.25+lp*.3})`;c.lineWidth=1.5;for(let k=0;k<9;k++){const x=prW*(.08+k*.105);c.beginPath();for(let y=prH;y>prH*.78;y-=6){const xx=x+Math.sin(y*.12+t*6+k)*4;y===prH?c.moveTo(xx,y):c.lineTo(xx,y)}c.stroke()}}
  }
  const showBag=s>=3;prBag.style.opacity=showBag?1:0;prRoute.style.opacity=s===4?1:0;
  if(s===3){prBag.style.setProperty('--pf',easeIO(lp).toFixed(3));prBag.style.transform=`translate(-50%,-50%) rotate(${Math.sin(lp*6)*2}deg)`}
  if(s===4){prBag.style.setProperty('--pf',1);const e=easeIO(lp);prBag.style.transform=`translate(calc(-50% + ${(e*130-0)}%),calc(-50% - ${Math.sin(e*3.14)*10}%)) rotate(${e*18}deg)`}
}

/* hero + wall + loop */
const hero=$('#hero'),hLogo=$('#heroLogo'),hSub=$('#heroSub'),hb1=$('#heroBag'),hb2=$('#heroBag2');
let smx=0,smy=0,lastY=scrollY,vel=0,wallVis=false;
new IntersectionObserver(es=>{wallVis=es[0].isIntersecting},{rootMargin:'100px'}).observe(wall);
function updHero(){const r=hero.getBoundingClientRect();if(r.bottom<-60)return;const p=clamp(-r.top/Math.max(1,r.height));
  hLogo.style.transform=`translate3d(${(-p*16).toFixed(2)}vw,0,0)`;hSub.style.transform=`translate3d(${(p*22).toFixed(2)}vw,0,0)`;
  hb1.style.setProperty('--ty',(-p*16).toFixed(2)+'vh');hb1.style.setProperty('--rz',(-7+p*24).toFixed(1)+'deg');hb1.style.setProperty('--rx',(-smy*12).toFixed(1));hb1.style.setProperty('--ry',(smx*18).toFixed(1));
  hb2.style.setProperty('--ty',(p*10).toFixed(2)+'vh');hb2.style.setProperty('--rz',(9-p*18).toFixed(1)+'deg');hb2.style.setProperty('--rx',(smy*8).toFixed(1));hb2.style.setProperty('--ry',(-smx*12).toFixed(1))}
function updWall(){if(!wallVis)return;const vw=innerWidth;$$('.slot',wall).forEach(s=>{const r=s.getBoundingClientRect();const d=((r.left+r.width/2)-vw/2)/vw;const b=$('.bag3d',s);b.style.setProperty('--wy',(-d*38).toFixed(1));b.style.setProperty('--wz',(d*7).toFixed(1)+'deg')})}
function frame(){
  requestAnimationFrame(frame);if(document.hidden||!introDone&&false)return;
  const y=scrollY;vel=lerp(vel,clamp((y-lastY)/55,-1,1),.15);lastY=y;root.style.setProperty('--vel',vel.toFixed(3));
  smx=lerp(smx,mx,.08);smy=lerp(smy,my,.08);
  updHero();updManif();updGrano();updMolido();updProceso();updWall();
}
requestAnimationFrame(frame);

/* ---------- NO SOMOS + REVEAL ---------- */
const nsIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('struck');nsIO.unobserve(e.target);sfx.paper()}}),{threshold:.9});
$$('#nsList li').forEach(li=>nsIO.observe(li));
const finIO=new IntersectionObserver(es=>{if(es[0].isIntersecting){const f=$('#nsFinal');if(!RM)f.classList.add('hit');sfx.clac();finIO.disconnect()}},{threshold:.6});
finIO.observe($('#nsFinal'));
const rvIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pre');rvIO.unobserve(e.target)}}),{threshold:.1});
$$('.rv').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight*.95){el.classList.add('pre');rvIO.observe(el)}});

/* ---------- KEYS + INIT ---------- */
addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(menu.classList.contains('open'))setMenu(false);else if(stage&&!stage.hidden&&stageDone)$('#stSkip').click();else if(prodOpen)closeProduct();else if(cartOpen)closeCart()});
paintCount();syncSound();
})();
