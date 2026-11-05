/* Purview Suite licensing, explained: client-side navigation and interactive tools */
(function(){
'use strict';
var d=document, w=window, root=d.documentElement;
var reduce=!!(w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches);
function $(s,c){return (c||d).querySelector(s);}
function $$(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s));}
var SITE='Purview Suite licensing, explained';
var HOME_TITLE='Microsoft Purview Suite licensing, explained';
var topics=$$('article.topic'), byId={}, order=[];
topics.forEach(function(t){var id=t.getAttribute('data-topic');byId[id]=t;order.push(id);});
var cur=null, canPush=true, ignoreHash=false;
var live=$('#live'), pbar=$('#pbar'), toTop=$('#totop'), side=$('#side'), scrim=$('#scrim'), menuBtn=$('#menubtn');

/* ---------- helpers ---------- */
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function fmtInt(n){return Math.round(n).toLocaleString('en-US');}
function money(n){return 'US$'+Math.round(n).toLocaleString('en-US');}
var tEl=$('#toast'), tT=null;
function toast(m){tEl.textContent=m;tEl.classList.add('on');clearTimeout(tT);tT=setTimeout(function(){tEl.classList.remove('on');},2800);}
function params(){var o={},q=location.search.replace(/^\?/,'');if(q)q.split('&').forEach(function(kv){if(!kv)return;var i=kv.indexOf('=');var k=decodeURIComponent(i<0?kv:kv.slice(0,i));o[k]=i<0?'':decodeURIComponent(kv.slice(i+1).replace(/\+/g,' '));});return o;}
function hashTopic(){var h=location.hash.slice(1),m=/^t-([a-z0-9-]+)$/.exec(h)||/^topic=([a-z0-9-]+)/.exec(h);return m?m[1]:null;}
function baseUrl(){return location.href.split('#')[0].split('?')[0];}
function urlFor(id,extra){if(id==='home'&&!extra)return baseUrl();return baseUrl()+'?topic='+encodeURIComponent(id)+(extra?'&'+extra:'');}

/* ---------- animations on topic enter ---------- */
function fmtCount(el,v){return (el.getAttribute('data-pre')||'')+Math.round(v).toLocaleString('en-US')+(el.getAttribute('data-suf')||'');}
function countUp(el){var to=+el.getAttribute('data-to');if(reduce){el.textContent=fmtCount(el,to);return;}var delay=+(el.getAttribute('data-delay')||0);el.textContent=fmtCount(el,0);setTimeout(function(){var t0=null;function tick(t){if(t0===null)t0=t;var p=Math.min(1,(t-t0)/900),e=1-Math.pow(1-p,3);el.textContent=fmtCount(el,to*e);if(p<1)requestAnimationFrame(tick);}requestAnimationFrame(tick);},delay+250);}
function runAnims(t){$$('.chart,.waffle,.stack',t).forEach(function(el){el.classList.add('in');});$$('.count',t).forEach(countUp);}
function resetAnims(t){$$('.chart,.waffle,.stack',t).forEach(function(el){el.classList.remove('in');});}

/* ---------- navigation ---------- */
function markNav(id){
  $$('.tree a[data-topic], .topnav a[data-topic], .dd-panel a[data-topic]').forEach(function(a){if(a.getAttribute('data-topic')===id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  var gid=byId[id].getAttribute('data-gid');
  $$('.topnav .pn').forEach(function(b){var on=b.hasAttribute('data-gid')?b.getAttribute('data-gid')===gid:b.getAttribute('data-topic')===id;b.classList.toggle('cur',on);});
  var act=$('.tree a[aria-current="page"]');
  if(act&&side&&w.innerWidth>1000){var r=act.getBoundingClientRect(),sr=side.getBoundingClientRect();if(r.top<sr.top+40||r.bottom>sr.bottom-40)side.scrollTop+=(r.top-sr.top)-sr.height/3;}
}
function show(id,o){
  o=o||{};
  if(!byId[id]){if(!o.initial)toast('That topic was not found, so the home page is shown.');id='home';}
  var t=byId[id], changed=id!==cur;
  if(changed){
    if(cur&&byId[cur])resetAnims(byId[cur]);
    topics.forEach(function(x){x.classList.toggle('active',x===t);});
    cur=id;
    d.title=id==='home'?HOME_TITLE:t.getAttribute('data-title')+' · '+SITE;
    markNav(id);
    requestAnimationFrame(function(){requestAnimationFrame(function(){runAnims(t);});});
    if(!o.initial){live.textContent='Opened: '+t.getAttribute('data-title');}
  }
  closeMenus();closeDrawer();hidePop();
  if(o.fromPop&&typeof o.y==='number')w.scrollTo(0,o.y);
  else if(changed||o.top)w.scrollTo(0,0);
  if(changed&&!o.initial&&!o.fromPop){var h=t.querySelector('h1');if(h)try{h.focus({preventScroll:true});}catch(e){h.focus();}}
  if(o.ref)flashRef(o.ref);
  if(o.faq)openFaq(o.faq);
  if(id==='planner')plFromParams(o.params);
  onScroll();
}
function navigate(id,o){
  o=o||{};
  try{history.replaceState({topic:cur,y:w.pageYOffset},'');}catch(e){}
  var target=byId[id]?id:'home';
  if(canPush){try{history.pushState({topic:target,y:0},'',urlFor(target,o.extra));}catch(e){canPush=false;}}
  if(!canPush){var nh='#t-'+target;if(location.hash!==nh){ignoreHash=true;location.hash=nh;}}
  show(id,o);
}
function flashRef(n){var li=d.getElementById('ref-'+n);if(!li)return;setTimeout(function(){li.scrollIntoView({block:'center',behavior:reduce?'auto':'smooth'});li.classList.remove('flash');void li.offsetWidth;li.classList.add('flash');},60);}
function openFaq(n){var x=d.getElementById('faq-'+n)||d.getElementById(n);if(!x)return;x.open=true;setTimeout(function(){x.scrollIntoView({block:'center',behavior:reduce?'auto':'smooth'});x.classList.remove('flash');void x.offsetWidth;x.classList.add('flash');},60);}

/* ---------- dropdown menus ---------- */
function setOpen(b,open){b.setAttribute('aria-expanded',open?'true':'false');var p=d.getElementById(b.getAttribute('aria-controls'));if(p)p.hidden=!open;if(!open)b._hover=false;}
function closeMenus(except){$$('.dd>button[aria-expanded="true"]').forEach(function(b){if(b!==except)setOpen(b,false);});}
$$('.dd').forEach(function(dd){
  var b=dd.querySelector('button'),p=dd.querySelector('.dd-panel'),tm=null;
  dd.addEventListener('pointerenter',function(e){if(e.pointerType!=='mouse')return;clearTimeout(tm);tm=setTimeout(function(){if(b.getAttribute('aria-expanded')!=='true'){closeMenus(b);setOpen(b,true);b._hover=true;}},90);});
  dd.addEventListener('pointerleave',function(e){if(e.pointerType!=='mouse')return;clearTimeout(tm);tm=setTimeout(function(){if(b._hover)setOpen(b,false);},200);});
  b.addEventListener('click',function(e){e.preventDefault();var open=b.getAttribute('aria-expanded')==='true';if(open&&b._hover){b._hover=false;return;}closeMenus(b);setOpen(b,!open);});
  dd.addEventListener('keydown',function(e){
    var links=$$('a',p),i=links.indexOf(d.activeElement);
    if(e.key==='ArrowDown'){e.preventDefault();if(b.getAttribute('aria-expanded')!=='true'){closeMenus(b);setOpen(b,true);}(links[i+1]||links[0]).focus();}
    else if(e.key==='ArrowUp'){e.preventDefault();if(i>0)links[i-1].focus();else b.focus();}
    else if(e.key==='Escape'){if(b.getAttribute('aria-expanded')==='true'){e.preventDefault();e.stopPropagation();setOpen(b,false);b.focus();}}
  });
  dd.addEventListener('focusout',function(e){if(!dd.contains(e.relatedTarget))setTimeout(function(){if(!dd.contains(d.activeElement))setOpen(b,false);},0);});
});

/* ---------- mobile drawer ---------- */
function openDrawer(){root.classList.add('drawer-open');scrim.hidden=false;menuBtn.setAttribute('aria-expanded','true');var a=$('.tree a[aria-current="page"]')||$('.tree a');setTimeout(function(){a&&a.focus();},60);}
function closeDrawer(){if(!root.classList.contains('drawer-open'))return;root.classList.remove('drawer-open');scrim.hidden=true;menuBtn.setAttribute('aria-expanded','false');}

/* ---------- citation pop-over ---------- */
var pop=$('#cpop'), popFor=null;
function srcInfo(n){var li=d.getElementById('ref-'+n);if(!li)return null;var a=li.querySelector('a.rt');return{title:a.textContent,url:a.getAttribute('href'),pub:li.getAttribute('data-pub'),used:li.getAttribute('data-used')};}
function placePop(c){var r=c.getBoundingClientRect(),pw=pop.offsetWidth,ph=pop.offsetHeight,sx=w.pageXOffset,sy=w.pageYOffset;var x=r.left+sx+r.width/2-pw/2;x=Math.max(sx+12,Math.min(x,sx+root.clientWidth-pw-12));var y=r.bottom+sy+8;if(r.bottom+ph+16>w.innerHeight&&r.top-ph-8>70)y=r.top+sy-ph-8;pop.style.left=x+'px';pop.style.top=y+'px';}
function showPop(c){
  var n=c.getAttribute('data-ref'),s=srcInfo(n);
  if(!s){w.open(c.href,'_blank','noopener');return;}
  if(popFor===c&&!pop.hidden){hidePop();return;}
  hidePop();
  $('.cp-no',pop).textContent=n;var t=$('.cp-t',pop);t.textContent=s.title;t.setAttribute('href',s.url);
  $('.cp-m',pop).textContent=s.pub+' · Used for: '+s.used;$('.cp-open',pop).setAttribute('href',s.url);$('.cp-all',pop).setAttribute('data-ref',n);
  pop.hidden=false;placePop(c);popFor=c;c.setAttribute('aria-expanded','true');
  try{t.focus({preventScroll:true});}catch(e){}
}
function hidePop(back){if(pop.hidden)return;pop.hidden=true;if(popFor){popFor.removeAttribute('aria-expanded');if(back)popFor.focus();popFor=null;}}

/* ---------- search ---------- */
var sdlg=$('#sdlg'), sq=$('#sq'), sres=$('#sres'), sidx=null, sel=0, results=[], lastFocus=null;
function textOf(el){if(!el)return'';var c=el.cloneNode(true);$$('.cites,.sr,.jsonly,.y,.n,script,style',c).forEach(function(x){x.parentNode.removeChild(x);});$$('td,th,li,p,h1,h2,h3,h4,dd,dt,div,b,span,figcaption,summary',c).forEach(function(x){x.appendChild(d.createTextNode(' '));});return c.textContent.replace(/\s+/g,' ').replace(/\s+([,.;:)])/g,'$1').trim();}
function buildIndex(){
  sidx=[];
  topics.forEach(function(t){var id=t.getAttribute('data-topic');sidx.push({id:id,title:t.getAttribute('data-title'),group:t.getAttribute('data-group'),desc:t.getAttribute('data-desc')||'',text:id==='faq'?'':textOf($('.tb',t))});});
  $$('#faq-list details').forEach(function(x){sidx.push({id:'faq',faq:x.id.replace('faq-',''),title:$('summary',x).textContent,group:'FAQ',desc:'',text:textOf($('.fa',x))});});
}
function hl(s,terms){var out=esc(s);terms.forEach(function(t){if(!t)return;var re=new RegExp('('+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig');out=out.replace(re,'<mark>$1</mark>');});return out;}
function snippet(text,terms){var lo=text.toLowerCase(),i=-1;for(var k=0;k<terms.length&&i<0;k++)i=lo.indexOf(terms[k]);if(i<0)return'';var a=Math.max(0,i-60),b=Math.min(text.length,i+110);return(a>0?'…':'')+text.slice(a,b)+(b<text.length?'…':'');}
function runSearch(){
  if(!sidx)buildIndex();
  var q=sq.value.trim().toLowerCase(),terms=q?q.split(/\s+/):[];
  results=[];
  sidx.forEach(function(r){
    if(!terms.length){if(!r.faq)results.push({r:r,score:0,snip:r.desc});return;}
    var tl=r.title.toLowerCase(),dl=r.desc.toLowerCase(),xl=r.text.toLowerCase(),score=0,ok=true;
    terms.forEach(function(t){var inT=tl.indexOf(t)>=0,inD=dl.indexOf(t)>=0,inX=xl.indexOf(t)>=0;if(!inT&&!inD&&!inX)ok=false;score+=(inT?10:0)+(inD?4:0)+(inX?1:0);});
    if(ok){if(tl.indexOf(q)===0)score+=6;results.push({r:r,score:score,snip:r.text?snippet(r.text,terms):r.desc});}
  });
  if(terms.length)results.sort(function(a,b){return b.score-a.score;});
  results=results.slice(0,24);sel=0;
  if(!results.length){sres.innerHTML='<li class="sempty">No results for “'+esc(sq.value)+'”. Try another word.</li>';sq.removeAttribute('aria-activedescendant');return;}
  sres.innerHTML=results.map(function(x,i){return '<li role="option" id="so-'+i+'" aria-selected="'+(i===sel)+'"><a href="#t-'+x.r.id+'" data-i="'+i+'"><span class="sg">'+esc(x.r.group)+'</span><b>'+hl(x.r.title,terms)+'</b>'+(x.snip?'<span class="ss">'+hl(x.snip,terms)+'</span>':'')+'</a></li>';}).join('');
  sq.setAttribute('aria-activedescendant','so-0');
}
function moveSel(k){if(!results.length)return;sel=(sel+k+results.length)%results.length;$$('li[role="option"]',sres).forEach(function(li,i){li.setAttribute('aria-selected',i===sel?'true':'false');});var el=d.getElementById('so-'+sel);sq.setAttribute('aria-activedescendant','so-'+sel);el&&el.scrollIntoView({block:'nearest'});}
function openResult(i){var x=results[i];if(!x)return;closeSearch(true);if(x.r.faq)navigate('faq',{extra:'q='+x.r.faq,faq:x.r.faq});else navigate(x.r.id);}
function openSearch(){lastFocus=d.activeElement;closeMenus();closeDrawer();hidePop();sdlg.hidden=false;root.classList.add('modal');sq.value='';runSearch();setTimeout(function(){sq.focus();},10);}
function closeSearch(nav){if(sdlg.hidden)return;sdlg.hidden=true;root.classList.remove('modal');if(!nav&&lastFocus&&lastFocus.focus)lastFocus.focus();}
sq.addEventListener('input',runSearch);
sq.addEventListener('keydown',function(e){if(e.key==='ArrowDown'){e.preventDefault();moveSel(1);}else if(e.key==='ArrowUp'){e.preventDefault();moveSel(-1);}else if(e.key==='Enter'){e.preventDefault();openResult(sel);}else if(e.key==='Escape'){e.preventDefault();closeSearch();}else if(e.key==='Tab'){e.preventDefault();}});
sres.addEventListener('click',function(e){var a=e.target.closest('a[data-i]');if(!a)return;e.preventDefault();e.stopPropagation();openResult(+a.getAttribute('data-i'));});
sdlg.addEventListener('click',function(e){if(e.target===sdlg)closeSearch();});

/* ---------- copy and print ---------- */
function copyText(s,msg){
  function fallback(){var ta=d.createElement('textarea');ta.value=s;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';d.body.appendChild(ta);ta.select();var ok=false;try{ok=d.execCommand('copy');}catch(e){}d.body.removeChild(ta);toast(ok?msg:'Copy this link: '+s);}
  if(navigator.clipboard&&w.isSecureContext)navigator.clipboard.writeText(s).then(function(){toast(msg);},fallback);else fallback();
}
function printAll(){root.classList.add('print-all');$$('#faq-list details').forEach(function(x){x.open=true;});topics.forEach(runAnims);setTimeout(function(){w.print();},80);}
w.addEventListener('beforeprint',function(){if(cur)runAnims(byId[cur]);$$('.count').forEach(function(el){el.textContent=fmtCount(el,+el.getAttribute('data-to'));});});
w.addEventListener('afterprint',function(){if(root.classList.contains('print-all')){root.classList.remove('print-all');topics.forEach(function(t){if(t.getAttribute('data-topic')!==cur)resetAnims(t);});}});

/* ---------- clicks and keys ---------- */
d.addEventListener('click',function(e){
  if(e.defaultPrevented||e.button!==0)return;
  var mod=e.metaKey||e.ctrlKey||e.shiftKey||e.altKey;
  var c=e.target.closest('a.cite');
  if(c){if(mod)return;e.preventDefault();showPop(c);return;}
  var a=e.target.closest('a[data-topic]');
  if(a){if(mod)return;e.preventDefault();var ref=a.getAttribute('data-ref');navigate(a.getAttribute('data-topic'),ref?{ref:ref}:{});return;}
  var b=e.target.closest('[data-act]');
  if(b){
    var act=b.getAttribute('data-act');
    if(act==='search')openSearch();
    else if(act==='menu'){if(root.classList.contains('drawer-open'))closeDrawer();else openDrawer();}
    else if(act==='close-drawer')closeDrawer();
    else if(act==='copy')copyText(urlFor(cur,cur==='planner'?plQuery():''),'Link to this page copied');
    else if(act==='print')w.print();
    else if(act==='print-all')printAll();
    else if(act==='top'){w.scrollTo({top:0,behavior:reduce?'auto':'smooth'});var h=$('h1',byId[cur]);if(h)try{h.focus({preventScroll:true});}catch(x){}}
    else if(act==='faq-open')$$('#faq-list details').forEach(function(x){if(!x.hidden)x.open=true;});
    else if(act==='faq-close')$$('#faq-list details').forEach(function(x){x.open=false;});
    else if(act==='pl-reset'){plState={n:1000,l:500,p:12};plWrite();plRender(true);}
    else if(act==='pl-share')copyText(urlFor('planner',plQuery()),'Link to this scenario copied');
  }
  if(!e.target.closest('.cpop'))hidePop();
  if(!e.target.closest('.dd'))closeMenus();
});
d.addEventListener('keydown',function(e){
  if(!sdlg.hidden)return;
  if(e.key==='Escape'){if(!pop.hidden){hidePop(true);return;}closeMenus();closeDrawer();return;}
  var tg=e.target, typing=tg&&(/^(input|textarea|select)$/i.test(tg.tagName)||tg.isContentEditable);
  if((e.key==='/'&&!typing)||((e.ctrlKey||e.metaKey)&&(e.key==='k'||e.key==='K'))){e.preventDefault();openSearch();}
});
w.addEventListener('popstate',function(e){var st=e.state||{},p=params();show(p.topic||hashTopic()||'home',{fromPop:true,y:st.y,params:p});});
w.addEventListener('hashchange',function(){if(ignoreHash){ignoreHash=false;return;}var id=hashTopic();if(id&&id!==cur)show(id,{});});
var ticking=false;
function onScroll(){ticking=false;var y=w.pageYOffset,h=root.scrollHeight-w.innerHeight;pbar.style.width=(h>0?Math.min(100,y/h*100):0)+'%';toTop.hidden=y<700;}
w.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll);}},{passive:true});
w.addEventListener('resize',function(){hidePop();if(w.innerWidth>1000)closeDrawer();});

/* ---------- license planner ---------- */
var plEl=$('#planner'), plState={n:1000,l:500,p:12}, plTimer=null;
var P=plEl?{n:$('#pl-n'),nr:$('#pl-nr'),l:$('#pl-l'),lr:$('#pl-lr'),p:$('#pl-p')}:null;
function plQuery(){return 'n='+plState.n+'&l='+Math.min(plState.l,plState.n)+'&p='+(+plState.p.toFixed(2));}
function plWrite(skip){
  if(skip!=='n')P.n.value=plState.n;
  P.nr.max=Math.max(10000,plState.n);if(skip!=='nr')P.nr.value=plState.n;
  P.lr.max=plState.n;P.l.max=plState.n;
  if(skip!=='l')P.l.value=Math.min(plState.l,plState.n);
  if(skip!=='lr')P.lr.value=Math.min(plState.l,plState.n);
  if(skip!=='p')P.p.value=plState.p.toFixed(2);
}
function pctText(x){var r=Math.round(x*10)/10;return(r%1===0?r.toFixed(0):r.toFixed(1))+'%';}
function plRender(updateUrl){
  var n=plState.n,l=Math.min(plState.l,n),u=n-l,p=plState.p;
  var lp=n?l/n*100:0, cost=l*p*12, all=n*p*12, sq=n/100;
  var vals={n:fmtInt(n),l:fmtInt(l),u:fmtInt(u),lp:pctText(lp),up:pctText(100-lp),cost:money(cost),all:money(all),sq:(sq>=10?fmtInt(sq):(Math.round(sq*10)/10).toLocaleString('en-US'))};
  $$('[data-v]',plEl).forEach(function(el){var k=el.getAttribute('data-v');if(k in vals)el.textContent=vals[k];});
  var mode=l===0?'none':(l>=n?'all':'partial');
  $$('#pl-plan li[data-when]').forEach(function(li){var wh=li.getAttribute('data-when').split(' ');li.classList.toggle('on',wh.indexOf(mode)>=0||wh.indexOf('always')>=0);});
  $('#pl-gaps').hidden=u===0;
  var cells=l===0?0:(l>=n?100:Math.max(1,Math.min(99,Math.round(lp))));
  $$('#pl-waffle i').forEach(function(c,i){c.classList.toggle('lic',i<cells);});
  $('#pl-waffle').setAttribute('aria-label','Coverage chart: '+vals.l+' of '+vals.n+' employees licensed ('+vals.lp+').');
  $$('[data-preset]',plEl).forEach(function(b){var f=+b.getAttribute('data-preset');b.setAttribute('aria-pressed',Math.round(n*f)===l?'true':'false');});
  if(updateUrl&&cur==='planner'&&canPush){clearTimeout(plTimer);plTimer=setTimeout(function(){try{history.replaceState({topic:'planner',y:w.pageYOffset},'',urlFor('planner',plQuery()));}catch(e){}},250);}
}
function num(v){var x=parseFloat(String(v).replace(/,/g,''));return isFinite(x)?x:NaN;}
function plFromParams(p){
  if(!P)return;p=p||params();
  if(p.n||p.l||p.p){var n=Math.round(num(p.n)),l=Math.round(num(p.l)),pr=num(p.p);
    if(n>=1&&n<=1000000)plState.n=n;if(l>=0)plState.l=Math.min(l,plState.n);if(pr>=0&&pr<100000)plState.p=pr;}
  plWrite();plRender(false);
}
if(P){
  $('#pl-form').addEventListener('submit',function(e){e.preventDefault();});
  P.n.addEventListener('input',function(){var v=Math.round(num(P.n.value));if(v>=1&&v<=1000000){plState.n=v;plWrite('n');plRender(true);}});
  P.n.addEventListener('change',function(){var v=Math.round(num(P.n.value));plState.n=v>=1?Math.min(v,1000000):1;if(plState.l>plState.n)plState.l=plState.n;plWrite();plRender(true);});
  P.nr.addEventListener('input',function(){plState.n=+P.nr.value;if(plState.l>plState.n)plState.l=plState.n;plWrite('nr');plRender(true);});
  P.l.addEventListener('input',function(){var v=Math.round(num(P.l.value));if(v>=0){plState.l=v;plWrite('l');plRender(true);}});
  P.l.addEventListener('change',function(){var v=Math.round(num(P.l.value));plState.l=v>=0?Math.min(v,plState.n):0;plWrite();plRender(true);});
  P.lr.addEventListener('input',function(){plState.l=+P.lr.value;plWrite('lr');plRender(true);});
  P.p.addEventListener('input',function(){var v=num(P.p.value);if(v>=0){plState.p=v;plRender(true);}});
  P.p.addEventListener('change',function(){var v=num(P.p.value);plState.p=v>=0?v:0;plWrite();plRender(true);});
  $$('[data-preset]',plEl).forEach(function(b){b.addEventListener('click',function(){plState.l=Math.round(plState.n*+b.getAttribute('data-preset'));plWrite();plRender(true);});});
}

/* ---------- capability explorer ---------- */
var xq=$('#x-q'), xadds=$('#x-adds'), xrows=$$('#x-table tbody tr'), xarea='all';
function xApply(){
  var q=(xq.value||'').trim().toLowerCase(),terms=q?q.split(/\s+/):[],shown=0;
  xrows.forEach(function(tr){var ok=(xarea==='all'||tr.getAttribute('data-area')===xarea)&&(!xadds.checked||tr.getAttribute('data-adds')==='1');if(ok&&terms.length){var t=tr.getAttribute('data-text');ok=terms.every(function(x){return t.indexOf(x)>=0;});}tr.classList.toggle('hide',!ok);if(ok)shown++;});
  $('#x-count').textContent='Showing '+shown+' of '+xrows.length+' capabilities';$('#x-empty').hidden=shown>0;
}
if(xq){
  xq.addEventListener('input',xApply);xadds.addEventListener('change',xApply);
  $$('.seg [data-area]').forEach(function(b){b.addEventListener('click',function(){xarea=b.getAttribute('data-area');$$('.seg [data-area]').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});xApply();});});
}

/* ---------- FAQ filter ---------- */
var fq=$('#faq-q');
if(fq)fq.addEventListener('input',function(){var q=fq.value.trim().toLowerCase(),n=0,first=true;$$('#faq-list details').forEach(function(x){var ok=!q||x.textContent.toLowerCase().indexOf(q)>=0;x.hidden=!ok;x.classList.toggle('first-vis',ok&&first);if(ok){n++;first=false;if(q)x.open=true;}});$('#faq-empty').hidden=n>0;});

/* ---------- start ---------- */
(function(){
  var p=params(), id=p.topic||hashTopic()||'home';
  if(!byId[id])id='home';
  try{history.replaceState({topic:id,y:0},'');}catch(e){canPush=false;}
  show(id,{initial:true,params:p,faq:p.q||null,ref:p.ref||null});
  if(p.topic&&!byId[p.topic])toast('That topic was not found, so the home page is shown.');
  root.classList.add('ready');
})();
})();
