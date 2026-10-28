const START=Date.parse('2026-10-28T10:00:00+09:00');
const END=Date.parse('2026-10-29T00:00:00+09:00');
const HOUR=3600000;
const messages=[
'성민아 생일 축하해! 오늘 맛있는 거 많이 먹어.',
'올해 임다빈이랑 제일 행복한 날들 보내게 될 거야.',
'바쁘긴 해도, 힘든 것보다 보람 있는 날이 더 많을 거야.',
'곁에는 마음 편한 좋은 사람들이 남을 거야.',
'올해 남은 일들도 하나씩 잘 풀릴 거야.',
'센터 회원 100명 넘고, 다음 목표 세우고 있을걸.',
'어떤 선택을 하든, 결국 잘한 선택으로 만들어 갈 거야.',
'손대는 일마다 잘돼서 좀 바빠질 예정이야.',
'출퇴근길은 막히는 데 없이 슝슝 갈 거야.',
'플레이오프에서 골 엄청 넣을 거야. 기대해도 됨.',
'골은 많이 넣고, 다친 데 없이 돌아올 거야.',
'센터에는 운동도 열심히 하고 마음도 좋은 회원들이 가득할 거야.',
'마음이 조급한 날에도 한숨 돌리고, 좋은 답을 찾게 될 거야.',
'임다빈이랑 가끔 싸워도, 금방 풀고 계속 좋아할 거야.'
];
const colors=['#ee8869','#92a783','#e5bc61','#9aabd0','#d998a6','#8eafa6','#ed9e68'];
let read=[];try{read=JSON.parse(localStorage.getItem('sm-birthday-2026')||'[]');if(!Array.isArray(read))read=[]}catch{}
const $=s=>document.querySelector(s), dialog=$('#message-dialog');
function available(now){return Math.max(0,Math.min(messages.length,Math.floor((now-START)/HOUR)+1))}
function state(now){return {count:available(now),ended:now>=END,remaining:Math.max(0,END-now)}}
function burst(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;for(let i=0;i<28;i++){const p=document.createElement('i');p.className='confetti';p.style.cssText=`left:${Math.random()*100}%;background:${colors[i%7]};--drift:${Math.random()*160-80}px;animation-delay:${Math.random()*.3}s`;$('#confetti').append(p);setTimeout(()=>p.remove(),2600)}}
function show(index){const now=Date.now();if(index>=available(now)){const minutes=Math.ceil((START+index*HOUR-now)/60000);$('#message-time').textContent=`${10+index}:00 OPEN`;$('#message').textContent=`이 촛불은 ${minutes}분 뒤에 켜져. 조금만 기다려!`}else{$('#message-time').textContent=`CANDLE ${String(index+1).padStart(2,'0')} · ${10+index}:00`;$('#message').textContent=messages[index];if(!read.includes(index)){read.push(index);try{localStorage.setItem('sm-birthday-2026',JSON.stringify(read))}catch{}burst()}}dialog.showModal();render()}
messages.forEach((message,i)=>{const b=document.createElement('button');b.className='candle';b.style.setProperty('--color',colors[i%7]);b.innerHTML=`<span class="flame"></span><span class="wick"></span><span class="wax"></span><span class="readmark"></span><span class="candle-time">${10+i}:00</span>`;b.addEventListener('click',()=>show(i));$('#candles').append(b)});
let previous=-1;
function render(){const now=Date.now(),s=state(now),seconds=Math.ceil(s.remaining/1000),pad=n=>String(n).padStart(2,'0');$('#timer').innerHTML=`${pad(Math.floor(seconds/3600))} <small>:</small> ${pad(Math.floor(seconds/60)%60)} <small>:</small> ${pad(seconds%60)}`;$('#progress').textContent=`${s.count} / 14 켜짐`;$('#next').textContent=s.ended?'촛불은 계속 눌러볼 수 있어.':s.count===14?'촛불이 전부 켜졌어. 하나씩 눌러봐!':`다음 촛불은 ${Math.ceil((START+s.count*HOUR-now)/60000)}분 뒤에 켜져요`;document.querySelectorAll('.candle').forEach((b,i)=>{const unlocked=i<s.count;b.classList.toggle('locked',!unlocked);b.setAttribute('aria-label',`${10+i}시 촛불, ${unlocked?'메시지 보기':'아직 기다리는 중'}`);b.querySelector('.readmark').textContent=unlocked&&read.includes(i)?'✓':''});if(s.ended){$('h1').innerHTML='성민아 생일<br>너무너무 축하했어<span class="orange">!!!!!!!</span> 🎂';$('#timer-label').textContent='10월 28일 생일 끝!'}if(previous>=0&&s.count>previous)burst();previous=s.count}
$('.close').onclick=()=>dialog.close();$('.okay').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});document.addEventListener('visibilitychange',render);render();setInterval(render,1000);


const actionData={soup:{src:'seongmin-soup.png',alt:'미역국을 숟가락으로 먹는 성민이',status:'미역국 먹는 중 🥣'},football:{src:'seongmin-football.png',alt:'축구공을 리프팅하는 성민이',status:'공 떨어뜨리지 마 ⚽'},laugh:{src:'seongmin-laugh.png',alt:'손뼉 치며 박장대소하는 성민이',status:'ㅋㅋㅋㅋㅋㅋ'}};
const actionStage=$('.character-stage'), characterImage=$('.character img');
let activeAction=null,actionRequest=0;
Object.values(actionData).forEach(a=>{const img=new Image();img.src=a.src});
async function playAction(action){const request=++actionRequest;const data=actionData[action];$('.action-status').textContent='잠깐만!';const img=new Image();img.src=data.src;try{await img.decode()}catch{if(request===actionRequest)$('.action-status').textContent='다시 한번 눌러줘.';return}if(request!==actionRequest)return;activeAction=action;actionStage.dataset.action=action;characterImage.src=data.src;characterImage.alt=data.alt;document.querySelectorAll('[data-action]').forEach(b=>{if(b.tagName==='BUTTON')b.setAttribute('aria-pressed',String(b.dataset.action===action))});$('.action-status').textContent=data.status;$('.character').setAttribute('aria-label',data.alt+' — 눌러서 다시 하기');if(action==='laugh')burst()}
document.querySelectorAll('.character-actions button').forEach(b=>b.addEventListener('click',()=>playAction(b.dataset.action)));
$('.character').addEventListener('click',()=>playAction(activeAction||'laugh'));
