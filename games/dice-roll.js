const KEY='diceRollBest';
let score=0,best=+localStorage.getItem(KEY)||0;
const $=id=>document.getElementById(id);
$('best').textContent=best;
$('backBtn').onclick=()=>location.href='index.html';
$('actionBtn').onclick=()=>{
  const a=1+Math.floor(Math.random()*6), b=1+Math.floor(Math.random()*6);
  $('display').textContent=`${a} + ${b}`;
  let gain=a+b; if(a===b) gain*=2;
  score+=gain; $('score').textContent=score;
  if(score>best){best=score;localStorage.setItem(KEY,best);$('best').textContent=best;}
  $('status').textContent=a===b?`Doubles! +${gain}`:`You rolled ${gain}`;
};
