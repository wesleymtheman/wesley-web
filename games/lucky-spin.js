const KEY='luckySpinBest';
const PRIZES=[5,10,15,20,25,50];
let score=0,best=+localStorage.getItem(KEY)||0,spinning=false,angle=0;
const $=id=>document.getElementById(id);
$('best').textContent=best;
$('backBtn').onclick=()=>location.href='index.html';
$('actionBtn').onclick=()=>{
  if(spinning)return; spinning=true; const idx=Math.floor(Math.random()*PRIZES.length);
  angle+=1440+idx*60+30; $('wheel').style.transform=`rotate(${angle}deg)`;
  $('status').textContent='Spinning...';
  setTimeout(()=>{const gain=PRIZES[idx]; score+=gain; $('score').textContent=score; if(score>best){best=score;localStorage.setItem(KEY,best);$('best').textContent=best;}
    $('status').textContent=`You won +${gain}!`; spinning=false;},2300);
};
