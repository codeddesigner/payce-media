(function(){
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var still=matchMedia('(prefers-reduced-motion:reduce)').matches, root=document.documentElement;
  if(still) root.classList.add('still');

  /* header state over the hero */
  var sl=$('.hero2'), menu=document.getElementById('menu');
  function up(){ var v=$('.view[data-v=users]'), users=v&&!v.hidden;
    document.body.classList.toggle('at-hero', !!(users && sl && scrollY < sl.offsetHeight-80 && !(menu&&menu.classList.contains('open'))));
 }
  addEventListener('scroll',up,{passive:true}); addEventListener('resize',up); addEventListener('hashchange',function(){ setTimeout(up,50); });
  document.addEventListener('click',function(){ setTimeout(up,60); }); up();

  /* tap-to-walk game */
  var ov=$('.g-over'); if(!ov) return;
  var scr={ready:$('.g-ready',ov),play:$('.g-play',ov),end:$('.g-end',ov)}, cnt=$('.g-count',ov), tm=$('.g-time span',ov), tap=$('.g-tap',ov), res=$('.g-res',ov), msg=$('.g-msg',ov), rain=$('.g-rain',ov), track=$('.g-track i');
  var STK=['coin','heart','medal','avatar'].map(function(n){ return 'https://cdn.jsdelivr.net/gh/codeddesigner/payce-media@fec6ac1afbce41b7a1e734a92e5bc437142792ae/img/hero/'+n+'.webp'; });
  var steps=0, playing=false, end=0, timer=0, lastFocus=null;
  function show(k){ Object.keys(scr).forEach(function(n){ scr[n].hidden=n!==k; }); var f=$('button,a',scr[k]); if(f) f.focus(); }
  function open(){ lastFocus=document.activeElement; ov.hidden=false; document.body.style.overflow='hidden'; show('ready'); }
  function close(){ playing=false; clearInterval(timer); ov.hidden=true; document.body.style.overflow=''; rain.innerHTML=''; if(lastFocus) lastFocus.focus(); }
  function start(){ steps=0; cnt.textContent='0'; tm.textContent='5.0'; show('play'); tap.focus(); playing=false; end=0; }
  function hit(e){ if(e) e.preventDefault(); if(!playing&&end===0){ playing=true; end=performance.now()+5000; timer=setInterval(loop,50); }
    if(!playing) return; steps++; cnt.textContent=steps; tap.classList.add('hit'); setTimeout(function(){ tap.classList.remove('hit'); },70); }
  function loop(){ var left=Math.max(0,end-performance.now()); tm.textContent=(left/1000).toFixed(1); if(left<=0){ clearInterval(timer); playing=false; finish(); } }
  function finish(){
    var good=steps>=30;
    res.textContent=good?('Nice, '+steps+' steps!'):('Just '+steps+' steps?!');
    msg.textContent=good?'Imagine what a whole day of walking pays. Get the app and start earning.':'Warm-up done. Your real steps count for more in the app.';
    show('end'); if(!still) for(var i=0;i<(good?26:12);i++) drop(i);
    if(track) track.style.width=Math.min(100,20+steps*1.6)+'%';
  }
  function drop(i){ var im=document.createElement('img'); im.src=STK[i%STK.length]; im.alt='';
    im.style.left=(Math.random()*96)+'%'; im.style.animationDuration=(1.8+Math.random()*1.6)+'s'; im.style.animationDelay=(Math.random()*.9)+'s'; im.style.setProperty('--rr',(Math.random()*360-180)+'deg'); rain.appendChild(im); }
  $('.g-go').addEventListener('click',open);
  $('.g-start',ov).addEventListener('click',start);
  $('.g-again',ov).addEventListener('click',function(){ rain.innerHTML=''; start(); });
  $('.g-x',ov).addEventListener('click',close);
  $('.g-dl',ov).addEventListener('click',close);
  tap.addEventListener('pointerdown',hit);
  tap.addEventListener('keydown',function(e){ if(e.key===' '||e.key==='Enter'){ hit(e); } });
  tap.addEventListener('click',function(e){ e.preventDefault(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&!ov.hidden) close(); });
})();
/* how it works: flashcards */
(function(){
  var sec=document.querySelector('.fc'); if(!sec) return;
  var cards=[].slice.call(sec.querySelectorAll('.fc-card')), dots=[].slice.call(sec.querySelectorAll('.fc-dots button')), N=cards.length, cur=-1;
  cards.forEach(function(c){ var t=c.querySelector('.fc-t'), dimFrom=+(t.dataset.dim||999), i=0, html='';
    t.textContent.trim().split(/\s+/).forEach(function(w){ html+='<span class="fw'+(i>=dimFrom?' dim':'')+'" style="transition-delay:'+(0.18+i*0.045).toFixed(3)+'s">'+w+'</span> '; i++; });
    t.innerHTML=html; });
  function set(k){ if(k===cur) return; cur=k;
    cards.forEach(function(c,i){ var d=i-k; c.classList.toggle('gone',d<0); c.classList.toggle('on',d===0); c.classList.toggle('hid',d>2);
      c.style.setProperty('--d',Math.max(0,d)); c.style.zIndex=N-i; c.setAttribute('aria-hidden',d!==0); });
    dots.forEach(function(b,i){ b.classList.toggle('on',i===k); }); }
  function onS(){ var r=sec.getBoundingClientRect(), h=sec.offsetHeight-innerHeight, p=h>0?Math.min(1,Math.max(0,-r.top/h)):0; set(Math.min(N-1,Math.floor(p*N*0.999))); }
  dots.forEach(function(b,i){ b.addEventListener('click',function(){ var h=sec.offsetHeight-innerHeight; scrollTo({top:sec.offsetTop+h*(i+.3)/N,behavior:'smooth'}); }); });
  addEventListener('scroll',onS,{passive:true}); addEventListener('resize',onS); set(0); onS();
})();
/* how it works: tabs + cards */
(function(){
  var s=document.querySelector('.hw'); if(!s) return;
  var tr=s.querySelector('.hw-track'), cards=[].slice.call(s.querySelectorAll('.hw-card')), tabs=[].slice.call(s.querySelectorAll('.hw-tabs button')), N=cards.length, cur=0;
  function go(i){ cur=(i+N)%N; tr.style.setProperty('--i',cur);
    cards.forEach(function(c,j){ c.classList.toggle('on',j===cur); c.setAttribute('aria-hidden',j!==cur); [].forEach.call(c.querySelectorAll('a'),function(a){a.tabIndex=j===cur?0:-1;}); });
    tabs.forEach(function(t,j){ t.classList.toggle('on',j===cur); t.setAttribute('aria-selected',j===cur); }); }
  tabs.forEach(function(t,j){ t.addEventListener('click',function(){ go(j); }); });
  cards.forEach(function(c,j){ c.addEventListener('click',function(e){ if(j!==cur){ e.preventDefault(); go(j); } }); });
  s.querySelector('.hw-nav .prev').addEventListener('click',function(){ go(cur-1); });
  s.querySelector('.hw-nav .next').addEventListener('click',function(){ go(cur+1); });
  var sx=null; tr.addEventListener('touchstart',function(e){ sx=e.touches[0].clientX; },{passive:true});
  tr.addEventListener('touchend',function(e){ if(sx===null) return; var dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>40) go(cur+(dx<0?1:-1)); sx=null; });
  go(0);
})();
