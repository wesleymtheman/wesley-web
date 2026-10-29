const KEY='numberGuessBest';
let secret=null,tries=0,score=0,best=+localStorage.getItem(KEY)||0;
const $=id=>document.getElementById(id);
$('best').textContent=best;
$('backBtn').onclick=()=>location.href='index.html';
function msg(t){$('status').textContent=t}
function newGame(){secret=1+Math.floor(Math.random()*100);tries=0;$('display').textContent='?';msg('I picked a number. Guess!');$('guessInput').value='';}
$('actionBtn').onclick=newGame;
$('guessBtn').onclick=()=>{
  if(secret==null){msg('Click New Number first!');return;}
  const g=+$('guessInput').value; if(!g||g<1||g>100){msg('Enter 1-100');return;}
  tries++;
  if(g===secret){score+=Math.max(1,11-tries);$('score').textContent=score;if(score>best){best=score;localStorage.setItem(KEY,best);$('best').textContent=best;}
    $('display').textContent=secret;msg(`Got it in ${tries} tries!`);secret=null;}
  else msg(g<secret?'Too low!':'Too high!');
};
newGame();
