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
