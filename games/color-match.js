const KEY='colorMatchBest';
const COLORS=[{n:'Red',c:'#e74c3c'},{n:'Blue',c:'#3498db'},{n:'Green',c:'#27ae60'},{n:'Orange',c:'#e67e22'},{n:'Purple',c:'#9b59b6'},{n:'Pink',c:'#e84393'}];
let target=null,score=0,best=+localStorage.getItem(KEY)||0;
const $=id=>document.getElementById(id);
$('best').textContent=best;
$('backBtn').onclick=()=>location.href='index.html';
function round(){
  target=COLORS[Math.floor(Math.random()*COLORS.length)];
  const ink=COLORS[Math.floor(Math.random()*COLORS.length)];
  $('display').textContent=target.n; $('display').style.color=ink.c;
  $('status').textContent='Tap the real '+target.n+' square';
  const grid=$('grid'); grid.innerHTML='';
  [...COLORS].sort(()=>Math.random()-0.5).forEach(col=>{
    const b=document.createElement('button'); b.type='button'; b.className='color-cell'; b.style.background=col.c; b.setAttribute('aria-label',col.n);
    b.onclick=()=>{ if(col.n===target.n){score++;$('score').textContent=score;if(score>best){best=score;localStorage.setItem(KEY,best);$('best').textContent=best;}$('status').textContent='Nice!';round();} else $('status').textContent='Nope — try again';};
    grid.appendChild(b);
  });
}
$('actionBtn').onclick=round; round();
