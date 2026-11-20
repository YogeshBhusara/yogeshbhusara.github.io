/* Public previews, authenticated decryption, and a keyboard-accessible reading sheet. */
(() => {
 const sessionName='yogi-case-key-v1';
 const unbase64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
 const base64=bytes=>btoa(String.fromCharCode(...bytes));
 let opener,oldOverflow,opening=0;
 const dialog=document.createElement('dialog');dialog.className='case-sheet';
 dialog.setAttribute('aria-label','Case study');
 dialog.innerHTML='<div class="case-sheet-top"><span class="sheet-handle" aria-hidden="true"></span><button class="sheet-close" type="button" aria-label="Close case study"><svg class="ui-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8"/></svg></button></div><div class="case-sheet-content"></div>';
 if(document.querySelector('.project-track'))document.body.append(dialog);
 const content=dialog.querySelector('.case-sheet-content');
 const close=()=>dialog.close();dialog.querySelector('.sheet-close').addEventListener('click',close);
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
 dialog.addEventListener('close',()=>{opening++;document.body.style.overflow=oldOverflow||'';content.replaceChildren();opener?.focus({preventScroll:true});});
 async function open(link){
  const url=link.href;
  const token=++opening;if(!dialog.contains(link))opener=link;
  if(!dialog.open){oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();}
  content.innerHTML='<p class="sheet-loading" role="status">Opening case study…</p>';
  dialog.querySelector('.sheet-close').focus();
  try{
   const response=await fetch(url);if(!response.ok)throw Error();
   const page=new DOMParser().parseFromString(await response.text(),'text/html');
   if(token!==opening||!dialog.open)return;
   const main=page.querySelector('main.case');if(!main)throw Error();
   main.querySelector('noscript')?.remove();
   const article=document.createElement('article');article.className=main.dataset.payload?'case protected-case':'case';if(main.dataset.payload)article.dataset.payload=main.dataset.payload;article.innerHTML=main.innerHTML;
   content.replaceChildren(article);dialog.scrollTop=0;
   dialog.setAttribute('aria-label',article.querySelector('h1').textContent);
   if(main.dataset.payload)init(article);else{article.querySelector('.back')?.remove();const hero=article.querySelector('.figure'),lead=article.querySelector('.lead');if(hero&&lead)lead.after(hero);}
  }catch{if(token===opening)content.innerHTML='<p role="alert">This case study could not load. Please close it and try again.</p>';}
 }
 document.addEventListener('click',e=>{
  const link=e.target.closest('a');if(!link||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;
  const url=new URL(link.href,location.href);
  if(!dialog.isConnected||url.origin!==location.origin||!link.closest('.project-track,.case-sheet'))return;
  if(!url.pathname.endsWith('.html')||url.pathname.endsWith('/index.html'))return;
  e.preventDefault();open(link);
 });
 function sessionKey(){try{return sessionStorage.getItem(sessionName);}catch{return null;}}
 function saveKey(raw){try{sessionStorage.setItem(sessionName,raw);}catch{/* Unlock still works with memory-only browser storage. */}}
 function clearKey(){try{sessionStorage.removeItem(sessionName);}catch{}}
 async function decrypt(root,password,stored){
  const response=await fetch(root.dataset.payload,{cache:'no-store'});if(!response.ok)throw new Error('network');
  const bundle=await response.json();
  let raw;
  if(stored)raw=unbase64(stored);
  else{
   const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
   raw=new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:unbase64(bundle.salt),iterations:bundle.iterations,hash:'SHA-256'},material,256));
  }
  const key=await crypto.subtle.importKey('raw',raw,'AES-GCM',false,['decrypt']);
  let plaintext;
  try{plaintext=await crypto.subtle.decrypt({name:'AES-GCM',iv:unbase64(bundle.iv)},key,unbase64(bundle.data));}catch{throw new Error('password');}
  const unpacked=await new Response(new Blob([plaintext]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
  const data=JSON.parse(unpacked),parsed=new DOMParser().parseFromString(`<div>${data.html}</div>`,'text/html');
  for(const img of parsed.querySelectorAll('img')){
   const asset=data.assets[img.getAttribute('src')];if(asset){img.src=`data:${asset.type};base64,${asset.data}`;img.decoding='async';}
  }
  saveKey(base64(raw));raw.fill(0);
  const toolbar=document.createElement('div');toolbar.className='case-unlocked-bar';toolbar.innerHTML='<span>Case study unlocked</span><button class="case-lock" type="button">Lock case studies <span aria-hidden="true">↗</span></button>';
  root.querySelector('.access-status').textContent='';
  const original=root.innerHTML;root.replaceChildren(toolbar,...parsed.body.firstElementChild.childNodes);root.classList.add('is-unlocked');
  root.querySelector('.back')?.remove();
  const hero=root.querySelector('.figure'),lead=root.querySelector('.lead');
  if(hero&&lead)lead.after(hero);
  const title=root.querySelector('h1');title.tabIndex=-1;
  if(root.closest('.case-sheet')){dialog.scrollTop=0;title.focus({preventScroll:true});}
  else{window.scrollTo({top:0,behavior:'instant'});title.focus({preventScroll:true});}
  toolbar.querySelector('button').addEventListener('click',()=>{clearKey();root.classList.remove('is-unlocked');root.innerHTML=original;init(root);root.querySelector('.access-start').focus({preventScroll:true});if(root.closest('.case-sheet'))dialog.scrollTop=0;});
 }
 async function init(root){
  const start=root.querySelector('.access-start'),form=root.querySelector('.access-form'),field=form.querySelector('input'),toggle=form.querySelector('.password-toggle'),status=root.querySelector('.access-status'),submit=form.querySelector('[type="submit"]');
  const stored=sessionKey();
  if(stored){status.textContent='Opening your case study…';try{await decrypt(root,null,stored);return;}catch{clearKey();status.textContent='';}}
  start.addEventListener('click',()=>{start.hidden=true;form.hidden=false;field.focus();});
  toggle.addEventListener('click',()=>{const shown=field.type==='password';field.type=shown?'text':'password';toggle.setAttribute('aria-pressed',String(shown));toggle.setAttribute('aria-label',shown?'Hide password':'Show password');field.focus();});
  field.addEventListener('input',()=>{field.removeAttribute('aria-invalid');status.textContent='';});
  form.addEventListener('submit',async e=>{
   e.preventDefault();if(submit.disabled||!field.value)return;
   submit.disabled=true;field.disabled=true;status.textContent='Unlocking…';root.setAttribute('aria-busy','true');
   try{await decrypt(root,field.value);field.value='';}
   catch(error){status.textContent=error.message==='password'?'That password didn’t match. Please try again.':'Unable to open this case study. Please check your connection and try again.';field.setAttribute('aria-invalid','true');field.disabled=false;field.focus();field.select();}
   finally{submit.disabled=false;field.disabled=false;root.removeAttribute('aria-busy');}
  });
 }
 document.querySelectorAll('.protected-case').forEach(init);
})();
