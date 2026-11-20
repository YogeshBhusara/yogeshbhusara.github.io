/* A self-contained Warli footer. No dependencies or animation loop. */
(() => {
 const TAU=Math.PI*2, rad=180/Math.PI, routeScale=1510/515, duration=22+14*(1510/515);
 const clamp=n=>Math.max(0,Math.min(1,n));
 const ease=n=>{n=clamp(n);return n*n*(3-2*n);};
 const mix=(a,b,t)=>a+(b-a)*t;
 const point=(a,b,t)=>({x:mix(a.x,b.x,t),y:mix(a.y,b.y,t)});
 function solve(dx,dy,a,b,bend=1){
  const d=Math.max(Math.abs(a-b)+.001,Math.min(a+b-.001,Math.hypot(dx,dy)));
  const shoulder=(Math.atan2(-dx,dy)+bend*Math.acos((a*a+d*d-b*b)/(2*a*d)))*rad;
  const elbow=-bend*(Math.PI-Math.acos((a*a+b*b-d*d)/(2*a*b)))*rad;
  return [shoulder,elbow,-shoulder-elbow];
 }
 // Distance follows a half-second acceleration and braking ramp.
 const routeLength=515, travelTime=7, ramp=.5, cruise=routeLength/(travelTime-ramp);
 function travel(u){
  u=Math.max(0,Math.min(travelTime,u));
  if(u<ramp)return cruise*u*u/(2*ramp);
  if(u>travelTime-ramp)return routeLength-cruise*(travelTime-u)**2/(2*ramp);
  return cruise*(u-ramp/2);
 }
 function footTrack(u,side){
  u*=routeScale;
  const travelTime=7*routeScale,routeLength=1510;
  const travel=u=>worldTravel(u);
  if(u<=0||u>=travelTime)return {offset:0,lift:0,pitch:0,contact:true,anchor:travel(u)};
  const shifted=u+(side?.5:0),cycle=Math.floor(shifted),p=shifted-cycle;
  const anchor=k=>k<=0?0:k>=travelTime?routeLength:travel(k+(side?-.25:.25));
  const from=anchor(cycle);
  if(p<.5)return {offset:from-travel(u),lift:0,pitch:0,contact:true,anchor:from};
  const r=(p-.5)*2,arc=Math.sin(Math.PI*r)**2;
  const target=mix(from,anchor(cycle+1),ease(r));
  return {offset:target-travel(u),lift:10*arc,pitch:-8*arc,contact:false,anchor:target};
 }
 function worldTravel(u){return travel(u/routeScale)*routeScale;}
 function state(t){
  const deskTime=t;
  // Give the coffee break ten seconds without changing the walking pace.
  t=t<10?t*.4:t-6;
  // Keep the longer route at the original walking pace, with planted feet.
  const firstEnd=5+7*routeScale,returnStart=firstEnd+5,returnEnd=returnStart+7*routeScale;
  t=t<5?t:t<firstEnd?5+(t-5)/routeScale:t<returnStart?12+t-firstEnd:t<returnEnd?17+(t-returnStart)/routeScale:24+t-returnEnd;
  let x=190,y=0,walking=false,direction=1,phase=0,facing=1;
  if(t>=5&&t<12){phase=t-5;x=190+travel(phase);walking=true;}
  else if(t>=12&&t<17)x=705;
  else if(t>=17&&t<24){phase=t-17;x=705-travel(phase);walking=true;direction=-1;}
  if(t>=16.6&&t<17)facing=Math.cos(Math.PI*ease((t-16.6)/.4));
  else if(t>=17&&t<24)facing=-1;
  else if(t>=24&&t<24.4)facing=-Math.cos(Math.PI*ease((t-24)/.4));
  const strideBlend=walking?ease(phase/.25)*ease((7-phase)/.25):0;
  const tracks=[0,1].map(i=>walking?footTrack(phase,i):{offset:0,lift:0,pitch:0,contact:true,anchor:0});
  const hips=[-10,10];
  if(walking){
   y=-1.2*(1-Math.cos(phase*TAU*2));
   // Lower the pelvis slightly at long strides rather than stretching a bone.
   for(const foot of tracks)y=Math.max(y,56-foot.lift-Math.sqrt(59.4**2-foot.offset**2));
  }
  const feet=tracks.map((f,i)=>({x:hips[i]+f.offset,y:88-y-f.lift}));
  const legs=feet.map((f,i)=>{
   const angles=solve(f.x-hips[i],f.y-32,30,30,-1);
   angles[2]+=tracks[i].pitch;
   return angles;
  });
  let hands=[{x:-28,y:14},{x:27,y:14}];
  if(walking){hands[0]=point({x:-28,y:14},{x:-18+Math.sin(phase*TAU)*15,y:13},strideBlend);hands[1]={x:44,y:-6};}
  const work=t<4||t>=25;
  const typing=[{x:24,y:-8+Math.sin(t*TAU*2.4)*.7},{x:36,y:-6+Math.sin(t*TAU*2.4+Math.PI)*.7}];
  if(work)hands=typing;
  const deskGrip={x:59,y:-7-y},carry={x:44,y:-6},machineGrip={x:38,y:-12-y};
  if(t>=4&&t<4.5){hands[0]={x:22,y:-13};hands[1]=point(typing[1],deskGrip,ease((t-4)/.5));}
  if(t>=4.5&&t<5)hands[1]=point(deskGrip,carry,ease((t-4.5)/.5));
  if(t>=12&&t<13)hands[1]=point(carry,machineGrip,ease((t-12)/.6));
  if(t>=13&&t<14){hands[0]=point({x:-28,y:14},{x:28,y:-50-y},ease((t-13)/.4));hands[1]=point(machineGrip,{x:27,y:14},ease((t-13)/.6));}
  if(t>=14&&t<16){hands[0]=point({x:28,y:-50-y},{x:-28,y:14},ease((t-14)/.5));hands[1]={x:27,y:14};}
  if(t>=16&&t<16.5)hands[1]=point({x:27,y:14},machineGrip,ease((t-16)/.5));
  if(t>=16.5&&t<17)hands[1]=point(machineGrip,carry,ease((t-16.5)/.5));
  if(t>=24&&t<24.4)hands[1]=carry;
  if(t>=24.4&&t<24.8)hands[1]=point(carry,deskGrip,ease((t-24.4)/.4));
  if(t>=24.8&&t<25){hands[1]=point(deskGrip,typing[1],ease((t-24.8)/.2));hands[0]=point({x:-28,y:14},typing[0],ease((t-24.8)/.2));}
  if(t>=4&&t<5)hands[0]=point(typing[0],{x:-28,y:14},ease(t-4));
  // Three unhurried sips at the laptop before the refill walk.
  // The cup and wrist share the same solved joint chain throughout.
  const sipping=deskTime>=.8&&deskTime<9.2;
  let sipTilt=0;
  if(sipping){
   const u=deskTime-.8, mouth={x:10,y:-51}, rest={x:44,y:-6};
   let grip;
   if(u<.6)grip=point(deskGrip,rest,ease(u/.6));
   else if(u<7.8){
    const cycle=(u-.6)/2.4,p=cycle-Math.floor(cycle);
    // Raise .65s, sip .45s, lower .65s, then rest .65s.
    const seconds=p*2.4;
    const lift=seconds<.65?ease(seconds/.65):seconds<1.1?1:seconds<1.75?1-ease((seconds-1.1)/.65):0;
    grip=point(rest,mouth,lift);sipTilt=-18*lift;
   }else grip=point(rest,deskGrip,ease((u-7.8)/.6));
   hands[1]=grip;
  }
  const arms=hands.map((h,i)=>solve(h.x-(i?18:-18),h.y+34,27,23,1));
  // Turn joint positions and angles, rather than flattening stroked limbs.
  // Straightening the knees raises the pelvis during the brief pivot.
  if(!walking&&Math.abs(facing)<1)y=56-60*Math.cos(Math.acos(56/60)*facing);
  const renderLegs=legs.map(angles=>angles.map(a=>a*facing));
  const renderArms=arms.map(angles=>angles.map(a=>a*facing));
  const endpoint=(angles,a,b)=>{const u=angles[0]/rad,v=angles[1]/rad;return {x:-a*Math.sin(u)-b*Math.sin(u+v),y:a*Math.cos(u)+b*Math.cos(u+v)};};
  const renderHands=renderArms.map((angles,i)=>{const p=endpoint(angles,27,23);return {x:(i?18:-18)*facing+p.x,y:-34+p.y};});
  let cup={x:255,y:140},cupFacing=1;
  const carrying=sipping||t>=4.5&&t<12.6||t>=16.5&&t<24.8;
  if(carrying){cup={x:x+renderHands[1].x+facing*6,y:152+y+renderHands[1].y-5};cupFacing=facing;}
  else if(t>=12.6&&t<16.5)cup={x:749,y:135};
  let beat=0;if(t>=4&&t<5)beat=1;else if(t>=5&&t<12)beat=2;else if(t>=12&&t<14)beat=3;else if(t>=14&&t<16)beat=4;else if(t>=16&&t<17)beat=5;else if(t>=17&&t<24)beat=6;
  return {x,y,facing,cupFacing,sipTilt,direction,walking,phase,tracks,feet,hands,renderHands,renderLegs,renderArms,carrying,legs,arms,cup,beat,brew:t>=14&&t<16?1:0,coffee:t>=28?1-ease((t-28)/2):t>=14&&t<16?ease((t-14)/2):t>=16?1:0};
 }
 const cssBase=`
 :host{display:block;width:100%;color:inherit;--scene-duration:30s;--art-stroke:2.4}
 *{box-sizing:border-box}svg{width:100%;height:auto;display:block;overflow:visible}
 .line,.shape,.steam{stroke:currentColor;stroke-width:var(--art-stroke);stroke-linecap:round;stroke-linejoin:round}
 .line,.steam{fill:none}
 .ink,.shape{fill:currentColor}
 .joint{transform-origin:0px 0px;transform-box:view-box}
 .animated{animation-duration:var(--scene-duration);animation-timing-function:linear;animation-iteration-count:infinite}
 .ambient{opacity:.3}.label{fill:currentColor;font:8px var(--font-body,sans-serif);letter-spacing:2px;opacity:.5}
 .steam{opacity:.35}
 .timeline button{font:inherit;color:inherit;background:none;border-radius:4px;cursor:pointer;transition:transform 160ms ease-out}
 .timeline button:active{transform:scale(.97)}
 .timeline button:focus-visible{outline:2px solid currentColor;outline-offset:4px}
 .phase{font-size:12px;position:relative;min-height:14px;flex:1}.phase span{position:absolute;left:0;top:0;white-space:nowrap}
 :host([offscreen]) .animated{animation-play-state:paused!important}
 :host([paused]) .animated{animation-play-state:paused!important}
 @media(prefers-reduced-motion:reduce){:host(:not([motion="on"])) .animated{animation-play-state:paused!important}}
 .scene{position:relative;container-type:inline-size}
 .character-target{position:absolute;top:calc(100% - 8cqw);transform:translateX(-50%);width:max(44px,4cqw);height:max(44px,8cqw);padding:0;border:0;border-radius:12px;background:transparent;color:inherit;cursor:pointer;touch-action:manipulation}
 .character-target:focus-visible{outline:2px dashed currentColor;outline-offset:4px}
 .character-target[aria-disabled="true"]{cursor:default}
 .speech-anchor{position:absolute;top:calc(100% - 8cqw - 12px);pointer-events:none;z-index:2}
 .speech{position:absolute;bottom:0;left:-80px;width:160px;padding:8px 12px;border-radius:10px;background:var(--paper);color:var(--ink);border:1px solid var(--line);font:12px/1.45 var(--font-body,sans-serif);letter-spacing:.005em;text-align:center;box-shadow:0 2px 4px #00000005,0 8px 24px #0000000a;transform-origin:calc(50% + var(--tail-offset,0px)) calc(100% + 4px);animation:speech-in 220ms cubic-bezier(.23,1,.32,1) both}
 .speech[hidden]{display:none}.speech::after{content:"";position:absolute;bottom:-4px;left:calc(50% + var(--tail-offset,0px) - 3px);width:6px;height:6px;background:inherit;border-right:1px solid var(--line);border-bottom:1px solid var(--line);transform:rotate(45deg)}
 .speech.leaving{animation:speech-out 160ms ease-out both}
 @keyframes speech-in{from{opacity:0;transform:translateY(4px) scale(.94)}to{opacity:1;transform:translateY(0) scale(1)}}
 @keyframes speech-out{from{opacity:1;transform:scale(1)}to{opacity:0;transform:translateY(-2px) scale(.98)}}
 @media(prefers-reduced-motion:reduce){.speech{animation:speech-fade-in 160ms ease-out both}.speech.leaving{animation:speech-fade-out 160ms ease-out both}@keyframes speech-fade-in{from{opacity:0}to{opacity:1}}@keyframes speech-fade-out{to{opacity:0}}}
 .timeline{position:absolute;right:0;bottom:0;display:flex;align-items:center;gap:4px;padding:0;color:var(--muted)}
 .control-icon{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.45;stroke-linecap:round;stroke-linejoin:round}
 .warli-info{position:absolute;right:0;bottom:32px;width:min(260px,calc(100cqw - 16px));padding:16px;border:1px solid var(--line);border-radius:12px;background:var(--paper);color:var(--ink);font:12px/1.6 var(--font-body,sans-serif);letter-spacing:0;box-shadow:0 8px 24px #0000000a;animation:info-in 180ms ease-out both;z-index:5}
 .warli-info[hidden]{display:none}.warli-info strong{display:block;font-weight:500;margin-bottom:4px}.warli-info p{margin:0}
 @keyframes info-in{from{opacity:0;transform:translateY(4px) scale(.98)}to{opacity:1;transform:none}}
 @media(prefers-reduced-motion:reduce){.warli-info{animation:info-fade 160ms ease-out both}@keyframes info-fade{from{opacity:0}to{opacity:1}}}

 .timeline button{display:grid;place-items:center;min-width:24px;min-height:24px;width:24px;height:24px;padding:0;border:0;font-size:14px}
 :host{position:relative}
 @media(max-width:560px){svg{min-height:0}}
 `;
 const limb=(side,type)=>type==='leg'?`<g class="joint animated hip-${side}"><g class="joint animated leg-${side}"><path class="line" d="M0 0V30"/><g transform="translate(0 30)"><g class="joint animated shin"><circle class="ink" r="1.2"/><path class="line" d="M0 0V30"/><g transform="translate(0 30)"><g class="joint animated foot"><g class="joint animated foot-toes"><path class="line" d="M0 0H8"/></g></g></g></g></g></g></g>`:`<g class="joint animated shoulder-${side}"><g class="joint animated arm-${side}"><path class="line" d="M0 0V27"/><g transform="translate(0 27)"><g class="joint animated forearm"><circle class="ink" r="1.2"/><path class="line" d="M0 0V23"/></g></g></g></g>`;
 const drawing=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2160 240" role="img" aria-label="A Warli figure works at a standing desk on the left, walks to the coffee machine on the right, refills a cup, and returns to work.">
 <g class="line" transform="translate(-45 0)"><path d="M209 149H299M219 150V238m70-88v88M211 239h17m53 0h17"/>
 <g class="laptop">
  <!-- Keyboard nearest the character; screen opens away from them. -->
  <path d="M212 149l6-6h25l-10 6Z"/>
  <path d="M233 149l8-27 10-6-8 27Z"/>
  <path d="M244 128l-2 7 M221 146h10"/>
 </g>
<g class="ambient" transform="translate(-504 0)"><path d="M834 238v-37m0 17-11-8m11-1 11-11m-11 4-7-8m7 31 10-7"/><path d="M824 228h20l-4 11h-12Z"/><circle cx="824" cy="208" r="3"/><circle cx="845" cy="196" r="3"/><circle cx="827" cy="192" r="3"/><circle cx="845" cy="215" r="3"/></g> </g><g class="line" transform="translate(950 0)"><path d="M714 149h94m-85 1v88m77-88v88m-86 1h17m61 0h17"/>
 <g class="coffee-machine" transform="translate(5 0)">
  <rect x="714" y="85" width="60" height="21" rx="4"/>
  <path d="M720 90h12v7h-12Z M720 102h7 M721 106v38m48-38v38 M744 106v5 M737 111h14v8h-14Z M751 114h14 M744 119v5 M716 144h56v5h-56Z"/>
  <circle cx="743" cy="96" r="6"/><path d="M740 93l3 3h4"/>
  <circle cx="728" cy="102" r="1.8"/>
  <circle cx="759" cy="92" r="2.2"/><circle cx="767" cy="92" r="2.2"/>
 </g>
 <g class="animated pour"><path d="M749 124v8"/></g>
 <g class="ambient"><path d="M834 238v-37m0 17-11-8m11-1 11-11m-11 4-7-8m7 31 10-7"/><path d="M824 228h20l-4 11h-12Z"/><circle cx="824" cy="208" r="3"/><circle cx="845" cy="196" r="3"/><circle cx="827" cy="192" r="3"/><circle cx="845" cy="215" r="3"/></g></g>
 <g class="joint animated traveler"><ellipse class="ink" cx="0" cy="246" rx="22" ry="2" opacity=".1"/><g transform="translate(0 152)"><g class="joint animated body"><g>${limb('l','leg')}${limb('r','leg')}</g><path class="shape" d="M0 0 22 35 -22 35Z"/><g>${limb('l','arm')}${limb('r','arm')}</g><path class="shape" d="M-18 -34 18 -34 0 0Z"/><path class="line" d="M0-45v11"/><g transform="translate(0 -56)"><circle class="ink" r="11"/></g></g></g></g>
 <g class="joint animated cup"><path class="line" d="M-6-3h12v9q-6 4-12 0Z"/><g class="joint animated cup-handle"><path class="line" d="M-6-1h-3q-5 4 3 5"/></g><path class="line animated coffee" d="M-3 1h6"/><g class="animated cup-steam"><path class="steam" d="M0-9q-3-4 0-8"/></g></g>
 </svg>`;
 const selectors=['.traveler','.body','.leg-l','.leg-r','.leg-l .shin','.leg-r .shin','.leg-l .foot','.leg-r .foot','.arm-l','.arm-r','.arm-l .forearm','.arm-r .forearm','.cup','.hip-l','.hip-r','.shoulder-l','.shoulder-r','.foot-toes','.cup-handle'];
 const spread=x=>145+(x-190)*1510/515;
 const fmt=n=>Number(n.toFixed(4));const rotate=n=>`rotate(${fmt(n)}deg)`;
 const transforms=s=>[
  `translateX(${fmt(spread(s.x))}px)`,`translateY(${fmt(s.y)}px)`,
  ...s.renderLegs.map(l=>rotate(l[0])),...s.renderLegs.map(l=>rotate(l[1])),...s.renderLegs.map(l=>rotate(l[2])),
  ...s.renderArms.map(a=>rotate(a[0])),...s.renderArms.map(a=>rotate(a[1])),
  `translate(${fmt(s.cup.x+(s.carrying?spread(s.x)-s.x:s.cup.x<500?-45:950))}px,${fmt(s.cup.y)}px) rotate(${fmt(s.sipTilt)}deg)`,
  `translate(${fmt(-10*s.facing)}px,32px)`,`translate(${fmt(10*s.facing)}px,32px)`,
  `translate(${fmt(-18*s.facing)}px,-34px)`,`translate(${fmt(18*s.facing)}px,-34px)`,
  `scaleX(${fmt(s.facing)})`,`scaleX(${fmt(s.cupFacing)})`
 ];
 // Sample all joints together. Nested, shared pivots keep every segment attached.
 const frameTimes=Array.from(new Set([...Array.from({length:Math.ceil(duration*40)+1},(_,i)=>Math.min(duration,i/40)),...Array.from({length:33},(_,i)=>16.6+i/80),...Array.from({length:33},(_,i)=>24+i/80)])).sort((a,b)=>a-b);
 const samples=frameTimes.map(state);
 // IK angles wrap at +/-180 degrees when the cup crosses the shoulder.
 // Preserve the same elbow bend and unwrap equivalent rotations so CSS never
 // interpolates a full turn between two adjacent sipping poses.
 samples.forEach((sample,i)=>{
  if(!i)return;
  sample.renderArms.forEach((arm,side)=>arm.forEach((angle,joint)=>{
   const previous=samples[i-1].renderArms[side][joint];
   arm[joint]=angle+360*Math.round((previous-angle)/360);
  }));
 });
 const sampleTransforms=samples.map(transforms);
 let css=cssBase;
 selectors.forEach((selector,j)=>{css+=`${selector}{transform:${sampleTransforms[0][j]};animation-name:scene-${j}}@keyframes scene-${j}{${sampleTransforms.map((v,i)=>`${frameTimes[i]/duration*100}%{transform:${v[j]}}`).join('')}}`;});
 const opacity=(selector,name,value)=>{css+=`${selector}{opacity:${value(samples[0])};animation-name:${name}}@keyframes ${name}{${samples.map((s,i)=>`${frameTimes[i]/duration*100}%{opacity:${value(s)}}`).join('')}}`;};
 opacity('.pour','pour',s=>s.brew);opacity('.coffee','coffee',s=>s.coffee);opacity('.cup-steam','steam',s=>s.coffee*.8);
 // Both overlays share the character's timeline; no tracking loop is needed.
 css+=`.character-target{left:${spread(samples[0].x)/2160*100}%;animation-name:character-target}@keyframes character-target{${samples.map((s,i)=>`${frameTimes[i]/duration*100}%{left:${spread(s.x)/2160*100}%}`).join('')}}`;
 const bubblePosition=s=>{const x=spread(s.x)/2160*100;return `left:clamp(88px,${x}%,calc(100% - 88px));--tail-offset:calc(${x}cqw - clamp(88px,${x}cqw,calc(100cqw - 88px)))`;};
 css+=`.speech-anchor{${bubblePosition(samples[0])};animation-name:speech-anchor}@keyframes speech-anchor{${samples.map((s,i)=>`${frameTimes[i]/duration*100}%{${bubblePosition(s)}}`).join('')}}`;
 const designerPhrases=[
  'Yes, brewing the designs.',
  'Just one more iteration.',
  'Making it feel right.',
  'This coffee needs a revision.',
  'Currently buffering a good idea.',
  'Trust me. I’ve tried 47 versions.',
  'This is my loading animation.',
  'Taking a very productive walk.'
 ];
 class WarliFooter extends HTMLElement{
  static get observedAttributes(){return ['paused','speed'];}
  constructor(){
   super();
   this.attachShadow({mode:'open'}).innerHTML=`<style>${css}</style><div class="scene">${drawing}<button class="animated character-target" type="button" aria-label="Talk to the designer" aria-disabled="false"></button><div class="animated speech-anchor"><div class="speech" role="status" aria-live="polite" aria-atomic="true" hidden></div></div></div><div class="timeline"><button class="pause-control" type="button" aria-label="Pause footer animation"></button><button class="info-control" type="button" aria-label="About the Warli artwork" aria-expanded="false" aria-controls="warli-info"><svg class="control-icon" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="M10 9v5M10 6v.1"/></svg></button><div id="warli-info" class="warli-info" role="note" hidden><strong>A little piece of home.</strong><p>This character style is inspired by Warli painting, the art around my native village. I’ve brought its simple shapes and everyday stories into this little corner of my portfolio.</p></div></div>`;
   const infoButton=this.shadowRoot.querySelector('.info-control'),info=this.shadowRoot.querySelector('.warli-info');
   const closeInfo=()=>{info.hidden=true;infoButton.setAttribute('aria-expanded','false');};
   infoButton.addEventListener('click',()=>{const open=info.hidden;info.hidden=!open;infoButton.setAttribute('aria-expanded',String(open));});
   this.onOutside=e=>{if(!e.composedPath().includes(this))closeInfo();};
   this.shadowRoot.addEventListener('keydown',e=>{if(e.key==='Escape'&&!info.hidden){e.stopPropagation();closeInfo();infoButton.focus();}});
   this.shadowRoot.addEventListener('focusout',()=>queueMicrotask(()=>{if(!this.shadowRoot.activeElement)closeInfo();}));
   this.phraseIndex=0;this.speaking=false;this.bubbleTimer=null;
   this.media=matchMedia('(prefers-reduced-motion: reduce)');
   this.onMotion=()=>{if(this.media.matches){this.removeAttribute('motion');this.setAttribute('paused','');}};
   this.shadowRoot.querySelector('.character-target').addEventListener('click',()=>this.speak());
   this.shadowRoot.querySelector('.pause-control').addEventListener('click',()=>{if(this.hasAttribute('paused')){this.setAttribute('motion','on');this.removeAttribute('paused');}else this.setAttribute('paused','');});
  }
  speak(){
   // Ignore every additional activation, including during fade-out. Never queue
   // another phrase or reset the expiry timer in response to repeated clicks.
   if(this.speaking)return false;
   this.speaking=true;
   const bubble=this.shadowRoot.querySelector('.speech');
   const target=this.shadowRoot.querySelector('.character-target');
   target.setAttribute('aria-disabled','true');
   bubble.hidden=false;bubble.classList.remove('leaving');
   bubble.textContent=designerPhrases[this.phraseIndex++ % designerPhrases.length];
   this.bubbleTimer=setTimeout(()=>{
    bubble.classList.add('leaving');
    this.bubbleTimer=setTimeout(()=>this.hideSpeech(),180);
   },3200);
   return true;
  }
  hideSpeech(){
   clearTimeout(this.bubbleTimer);this.bubbleTimer=null;
   const bubble=this.shadowRoot.querySelector('.speech');
   bubble.hidden=true;bubble.textContent='';bubble.classList.remove('leaving');
   this.shadowRoot.querySelector('.character-target').setAttribute('aria-disabled','false');
   this.speaking=false;
  }
  connectedCallback(){document.addEventListener('pointerdown',this.onOutside);this.observer=new IntersectionObserver(entries=>this.toggleAttribute('offscreen',!entries[0].isIntersecting));this.observer.observe(this);if(this.media.matches&&!this.hasAttribute('motion'))this.setAttribute('paused','');this.media.addEventListener('change',this.onMotion);this.attributeChangedCallback();}
  disconnectedCallback(){document.removeEventListener('pointerdown',this.onOutside);this.observer?.disconnect();this.hideSpeech();this.media.removeEventListener('change',this.onMotion);}
  attributeChangedCallback(){const speed=Number(this.getAttribute('speed')||1);this.style.setProperty('--scene-duration',`${duration/(Number.isFinite(speed)?Math.max(.25,Math.min(3,speed)):1)}s`);const button=this.shadowRoot.querySelector('.pause-control');const paused=this.hasAttribute('paused');button.innerHTML=paused?'<svg class="control-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6Z"/></svg>':'<svg class="control-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M7 4v12M13 4v12"/></svg>';button.setAttribute('aria-label',paused?'Play footer animation':'Pause footer animation');}
 }
 if(!customElements.get('warli-footer'))customElements.define('warli-footer',WarliFooter);
})();
