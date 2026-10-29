const KEY='rpsBest', icons={rock:'✊',paper:'✋',scissors:'✌️'};
const beats={rock:'scissors',paper:'rock',scissors:'paper'};
let score=0,best=+localStorage.getItem(KEY)||0;
const $=id=>document.getElementById(id);
$('best').textContent=best;
$('backBtn').onclick=()=>location.href='index.html';
$('actionBtn').onclick=()=>{score=0;$('score').textContent=0;$('status').textContent='Score reset. Go again!';$('display').textContent='✊ 🆚 ❔';};
document.querySelectorAll('[data-c]').forEach(btn=>btn.onclick=()=>{
  const you=btn.dataset.c; const cpu=['rock','paper','scissors'][Math.floor(Math.random()*3)];
  $('display').textContent=`${icons[you]} 🆚 ${icons[cpu]}`;
  if(you===cpu) $('status').textContent='Tie!';
  else if(beats[you]===cpu){score++;$('score').textContent=score;$('status').textContent='You win!';if(score>best){best=score;localStorage.setItem(KEY,best);$('best').textContent=best;}}
  else $('status').textContent='You lose!';
});
