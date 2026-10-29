const KEY='balloonPopBest';
let score=0,best=+localStorage.getItem(KEY)||0,left=0,spawn=null,tick=null,running=false;
const $=id=>document.getElementById(id);
$('best').textContent=best;
$('backBtn').onclick=()=>location.href='index.html';
function clearTimers(){clearInterval(spawn);clearInterval(tick);spawn=null;tick=null;}
function addBalloon(){
  if(!running)return; const area=$('area'); const b=document.createElement('button');
  b.type='button'; b.className='balloon'; b.textContent=['🎈','🎉','🔴','🟡','🟢'][Math.floor(Math.random()*5)];
  b.style.left=(10+Math.random()*80)+'%'; b.style.top=(15+Math.random()*70)+'%';
  b.onclick=()=>{score++;$('score').textContent=score;b.remove();};
  area.appendChild(b); setTimeout(()=>b.remove(),1800);
}
$('actionBtn').onclick=()=>{
  clearTimers(); $('area').innerHTML=''; running=true; score=0; left=20; $('score').textContent=0;
  $('status').textContent=left+'s left — pop!';
  spawn=setInterval(addBalloon,450); addBalloon();
  tick=setInterval(()=>{left--; $('status').textContent=left>0?(left+'s left — pop!'):'Done!'; if(left<=0){running=false;clearTimers();if(score>best){best=score;localStorage.setItem(KEY,best);$('best').textContent=best;}}},1000);
};
