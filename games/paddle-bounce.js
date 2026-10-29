const KEY='paddleBounceBest';
const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');
let score=0,best=+localStorage.getItem(KEY)||0,running=false,raf=null;
let ball={x:210,y:80,vx:2.4,vy:2.8,r:8}, paddle={x:160,w:100,h:12,y:250};
const $=id=>document.getElementById(id);
$('best').textContent=best;
$('backBtn').onclick=()=>location.href='index.html';
function pointer(e){const rect=canvas.getBoundingClientRect(); const clientX=(e.touches?e.touches[0].clientX:e.clientX); paddle.x=((clientX-rect.left)/rect.width)*canvas.width-paddle.w/2; paddle.x=Math.max(0,Math.min(canvas.width-paddle.w,paddle.x));}
canvas.addEventListener('mousemove',pointer); canvas.addEventListener('touchmove',e=>{e.preventDefault();pointer(e);},{passive:false});
function draw(){ctx.fillStyle='#1a1a2e';ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle='#48dbfb';ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);ctx.fill(); ctx.fillStyle='#feca57';ctx.fillRect(paddle.x,paddle.y,paddle.w,paddle.h);}
function loop(){ if(!running)return; ball.x+=ball.vx; ball.y+=ball.vy; if(ball.x<ball.r||ball.x>canvas.width-ball.r) ball.vx*=-1; if(ball.y<ball.r) ball.vy*=-1;
  if(ball.y+ball.r>=paddle.y && ball.x>paddle.x && ball.x<paddle.x+paddle.w && ball.vy>0){ball.vy*=-1;ball.y=paddle.y-ball.r;score++;$('score').textContent=score; if(score>best){best=score;localStorage.setItem(KEY,best);$('best').textContent=best;}}
  if(ball.y>canvas.height){running=false;$('status').textContent='Missed! Score: '+score;cancelAnimationFrame(raf);draw();return;}
  draw(); raf=requestAnimationFrame(loop);
}
$('actionBtn').onclick=()=>{cancelAnimationFrame(raf); score=0;$('score').textContent=0; ball={x:210,y:80,vx:2.4,vy:2.8,r:8}; paddle.x=160; running=true; $('status').textContent='Keep it up!'; loop();};
draw();
