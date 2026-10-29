const KEY='clickRushBest';
let score=0,best=+localStorage.getItem(KEY)||0,left=0,timer=null,running=false;
const $=id=>document.getElementById(id);
$('best').textContent=best;
$('backBtn').onclick=()=>location.href='index.html';
$('actionBtn').onclick=()=>{
  if(running)return; running=true; score=0; left=10; $('score').textContent=0; $('display').textContent='0';
  $('clickBtn').disabled=false; $('status').textContent='Go! '+left+'s';
  clearInterval(timer); timer=setInterval(()=>{left--; $('status').textContent=left>0?('Go! '+left+'s'):'Time!'; if(left<=0){clearInterval(timer);running=false;$('clickBtn').disabled=true; if(score>best){best=score;localStorage.setItem(KEY,best);$('best').textContent=best;}}},1000);
};
$('clickBtn').onclick=()=>{if(!running)return;score++;$('score').textContent=score;$('display').textContent=score;};
