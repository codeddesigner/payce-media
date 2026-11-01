(function(){
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var still=matchMedia('(prefers-reduced-motion:reduce)').matches, root=document.documentElement;
  if(still) root.classList.add('still');
  try{ if(sessionStorage.getItem('pIntro')) root.classList.add('seen'); else sessionStorage.setItem('pIntro','1'); }catch(e){}
  var intro=$('.intro'); if(intro) setTimeout(function(){ intro.style.display='none'; },2200);

  /* hero video */
  var hv=$('.hero-vid');
  if(hv&&hv.dataset.wide){ hv.src=matchMedia('(max-width:860px)').matches?hv.dataset.tall:hv.dataset.wide;
    if(still) hv.removeAttribute('autoplay'); else { var p=hv.play(); if(p&&p.catch) p.catch(function(){}); } }

  /* slider */
  var sl=$('.sl'), cards=$$('.sl-card'), heads=$$('.sl-h'), bars=$$('.sl-prog button'), N=cards.length, cur=0, t0=0, DUR=5200, paused=false, raf=0, elapsed=0;
  function layout(){
    var vw=innerWidth, mob=vw<=860;
    cards.forEach(function(c,i){
      var d=((i-cur)%N+N)%N; if(d>N/2) d-=N;
      var w=c.offsetWidth, x=0, sc=1, op=1, side=false;
      if(d===0){ x=0; }
      else if(Math.abs(d)===1){ side=true; sc=mob?.55:.62; x=d*(vw/2 - (mob?w*.08:w*.12)); }
      else { side=true; sc=.5; op=0; x=(d>0?1:-1)*(vw/2+w); }
      c.style.setProperty('--x',x+'px'); c.style.setProperty('--sc',sc); c.style.setProperty('--op',op);
      c.style.zIndex=d===0?3:2; c.classList.toggle('side',side);
      c.setAttribute('aria-hidden',d!==0);
    });
  }
  function go(i,user){
    cur=(i+N)%N; elapsed=0; t0=performance.now();
    if(sl){ sl.dataset.s=cur; sl.dataset.tone=cur===0?'dark':'light'; try{ dispatchEvent(new Event('scroll')); }catch(e){} }
    heads.forEach(function(h,j){ h.classList.toggle('on',j===cur); });
    bars.forEach(function(b,j){ b.classList.toggle('on',j===cur); b.classList.toggle('done',j<cur); b.setAttribute('aria-selected',j===cur); var ii=$('i',b); ii.style.setProperty('--p',0); });
    layout();
    if(user) paused=false;
  }
  function tick(t){
    raf=requestAnimationFrame(tick);
    if(paused||document.hidden||!inView){ t0=t-elapsed; return; }
    elapsed=t-t0; var p=Math.min(1,elapsed/DUR);
    var bi=bars[cur]&&$('i',bars[cur]); if(bi) bi.style.setProperty('--p',p);
    if(p>=1) go(cur+1);
  }
  var inView=true;
  if(sl){
    bars.forEach(function(b,j){ b.addEventListener('click',function(){ go(j,true); }); });
    cards.forEach(function(c,i){ c.addEventListener('click',function(){ if(i!==cur) go(i,true); }); });
    sl.addEventListener('mouseenter',function(){ paused=true; }); sl.addEventListener('mouseleave',function(){ paused=false; });
    var sx=null; sl.addEventListener('touchstart',function(e){ sx=e.touches[0].clientX; },{passive:true});
    sl.addEventListener('touchend',function(e){ if(sx===null) return; var dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>40) go(cur+(dx<0?1:-1),true); sx=null; });
    sl.addEventListener('keydown',function(e){ if(e.key==='ArrowRight') go(cur+1,true); if(e.key==='ArrowLeft') go(cur-1,true); });
    if('IntersectionObserver' in window) new IntersectionObserver(function(es){ inView=es[0].isIntersecting; }).observe(sl);
    addEventListener('resize',layout);
    go(0); if(!still) raf=requestAnimationFrame(tick); else paused=true;
  }

  /* header state over the hero */
  var menu=document.getElementById('menu');
  function up(){ var v=$('.view[data-v=users]'), users=v&&!v.hidden;
    document.body.classList.toggle('at-hero', !!(users && sl && scrollY < sl.offsetHeight-80 && !(menu&&menu.classList.contains('open'))));
    if(sl){ document.body.style.setProperty('--sl-ink',getComputedStyle(sl).getPropertyValue('--sl-fg')); document.body.style.setProperty('--sl-bg',getComputedStyle(sl).getPropertyValue('--sl-bg')); } }
  addEventListener('scroll',up,{passive:true}); addEventListener('resize',up); addEventListener('hashchange',function(){ setTimeout(up,50); });
  document.addEventListener('click',function(){ setTimeout(up,60); }); up();
  if(sl) new MutationObserver(up).observe(sl,{attributes:true,attributeFilter:['data-s']});

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
