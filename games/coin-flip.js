const KEY='coinFlipBest';
let call=null,score=0,best=+localStorage.getItem(KEY)||0;
const $=id=>document.getElementById(id);
$('best').textContent=best;
$('backBtn').onclick=()=>location.href='index.html';
$('headsBtn').onclick=()=>{call='Heads';$('status').textContent='You called Heads';};
$('tailsBtn').onclick=()=>{call='Tails';$('status').textContent='You called Tails';};
$('actionBtn').onclick=()=>{
  if(!call){$('status').textContent='Pick Heads or Tails first!';return;}
  const result=Math.random()<0.5?'Heads':'Tails';
  $('display').textContent=result==='Heads'?'👑':'🦅';
  if(result===call){score++;$('score').textContent=score;if(score>best){best=score;localStorage.setItem(KEY,best);$('best').textContent=best;}$('status').textContent=`${result}! You win!`;}
  else $('status').textContent=`${result}. Missed it.`;
  call=null;
};
