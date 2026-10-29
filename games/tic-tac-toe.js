const KEY='tttBest';
let board=Array(9).fill(null), over=false, score=0,best=+localStorage.getItem(KEY)||0;
const $=id=>document.getElementById(id);
$('best').textContent=best;
$('backBtn').onclick=()=>location.href='index.html';
const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function winner(b){for(const [a,c,d] of wins){if(b[a]&&b[a]===b[c]&&b[a]===b[d])return b[a];}return b.every(Boolean)?'tie':null;}
function render(){const el=$('board');el.innerHTML='';board.forEach((v,i)=>{const b=document.createElement('button');b.className='tic-cell';b.type='button';b.textContent=v||'';b.disabled=!!v||over;b.onclick=()=>move(i);el.appendChild(b);});}
function cpu(){const empty=board.map((v,i)=>v?null:i).filter(v=>v!==null); if(!empty.length)return; const pick=empty[Math.floor(Math.random()*empty.length)]; board[pick]='O';}
function move(i){if(over||board[i])return;board[i]='X';let w=winner(board); if(!w){cpu();w=winner(board);} if(w){over=true; if(w==='X'){score++;$('score').textContent=score;if(score>best){best=score;localStorage.setItem(KEY,best);$('best').textContent=best;}$('status').textContent='You win!';} else if(w==='O')$('status').textContent='Computer wins.'; else $('status').textContent='Tie game.';} else $('status').textContent='Your turn.'; render();}
$('actionBtn').onclick=()=>{board=Array(9).fill(null);over=false;$('status').textContent='You are X. Tap a square.';render();};
render();
