(function(){
  var hv=document.querySelector('.hero-vid'), hero=document.querySelector('.hero2'), menu=document.getElementById('menu');
  var still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(hv&&hv.dataset.wide){ hv.src=matchMedia('(max-width:860px)').matches?hv.dataset.tall:hv.dataset.wide;
    if(still){ hv.removeAttribute('autoplay'); } else { var p=hv.play(); if(p&&p.catch) p.catch(function(){}); } }
  function up(){ var users=document.body.dataset.view==='users'||!document.body.dataset.view;
    var v=document.querySelector('.view[data-v=users]'); if(v&&v.hidden) users=false;
    document.body.classList.toggle('at-hero', users && !!hero && scrollY < hero.offsetHeight-80 && !(menu&&menu.classList.contains('open'))); }
  addEventListener('scroll',up,{passive:true}); addEventListener('resize',up); addEventListener('hashchange',function(){ setTimeout(up,50); });
  document.addEventListener('click',function(){ setTimeout(up,60); }); up();
})();
