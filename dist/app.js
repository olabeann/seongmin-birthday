const END=Date.parse('2026-10-29T00:00:00+09:00');
// 아래 메시지를 순서대로 수정하면 1~28번 촛불에 반영됩니다.
const messages=[
  "성민이 생일 축하해요옹",
  "엄청 바빠도 마음은 즐겁게 해주세요오",
  "출퇴근길에 안막히고 슝슝 가서 좀 더 쉬게 해주세요",
  "성민 곁에 좋은 사람만 가득하게 해주세요",
  "센터에 좋은 회원들, 가르친 보람 있는 회원들 가득하게 해주세요",
  "센터 회원 100명 넘어서 힘든데 즐겁게 해주세요",
  "손대는 일마다 다 잘되게 해주세요",
  "김성민 선택이 최고의 선택이게 해주세요",
  "플레이오프에서 멋진 골 넣게 해주세요",
  "플레이오프에서 안다치게 해주세요",
  "올해 만약 고민 있다면 지혜롭게 해결되게 해주세요",
  "마음이 조급한 날에도 한숨 돌리고, 좋은 답을 찾게 해주세요",
  "임다빈이랑 가끔 싸워도, 금방 풀고 계속 좋아하게 해주세요",
  "남은 올해 나랑 제일 행복한 2026 보내자!!",
  "오늘 힘든거 없는 예비군이게 해주세요",
  "아침마다 개운하게 눈뜨게 해주세요",
  "잘 때 중간에 안깨게 해주세요",
  "축구하는 날에는 날씨가 안춥고 안덥게 해주세요",
  "까먹는 일 없이 일이 척척 정리되게 해주세요",
  "열심히 한 만큼 뿌듯한 순간이 많게 해주세요",
  "교회 갈 때마다 설교가 좋게 해주세요",
  "영상 조회수 맨날 n만 되게 해주세요",
  "쉬는 날에는 걱정 없이 푹 쉬게 해주세요",
  "하고 싶은 일에 도전할 용기가 생기게 해주세요",
  "사소한 일에도 크게 웃는 하루가 되게 해주세요",
  "임다빈 왕 사랑하게 해주세요",
  "우리 같이 웃긴 추억 많이 만들게 해주세요",
  "생일 축하해!!!!!!!!!!!!!!!!!!! 너 이제 임다빈 빔 맞아서 못빠져나옴"
];
const colors=['#ee8869','#92a783','#e5bc61','#9aabd0','#d998a6','#8eafa6','#ed9e68'];
let read=[];try{read=JSON.parse(localStorage.getItem('sm-birthday-2026')||'[]');if(!Array.isArray(read))read=[]}catch{}
const $=s=>document.querySelector(s), dialog=$('#message-dialog');
function state(now){return {ended:now>=END,remaining:Math.max(0,END-now)}}
function burst(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;for(let i=0;i<28;i++){const p=document.createElement('i');p.className='confetti';p.style.cssText=`left:${Math.random()*100}%;background:${colors[i%7]};--drift:${Math.random()*160-80}px;animation-delay:${Math.random()*.3}s`;$('#confetti').append(p);setTimeout(()=>p.remove(),2600)}}
function show(index){$('#message-time').textContent=`CANDLE ${String(index+1).padStart(2,'0')}`;$('#message').textContent=messages[index];if(!read.includes(index)){read.push(index);try{localStorage.setItem('sm-birthday-2026',JSON.stringify(read))}catch{}burst()}dialog.showModal();render()}
messages.forEach((message,i)=>{const b=document.createElement('button');b.type='button';b.className='candle';b.style.setProperty('--color',colors[i%7]);b.setAttribute('aria-label',`${i+1}번 촛불, 메시지 보기`);b.setAttribute('aria-haspopup','dialog');b.innerHTML=`<span class="flame"></span><span class="wick"></span><span class="wax"></span><span class="candle-number">${i+1}</span>`;b.addEventListener('click',()=>show(i));$('#candles').append(b)});
function render(){const s=state(Date.now()),seconds=Math.ceil(s.remaining/1000),pad=n=>String(n).padStart(2,'0');$('#timer').innerHTML=`${pad(Math.floor(seconds/3600))} <small>:</small> ${pad(Math.floor(seconds/60)%60)} <small>:</small> ${pad(seconds%60)}`;document.querySelectorAll('.candle').forEach((b,i)=>{const lit=read.includes(i);b.classList.toggle('lit',lit);b.setAttribute('aria-label',`${i+1}번 촛불, ${lit?'읽음, 불 켜짐':'아직 읽지 않음'}, 메시지 보기`)});if(s.ended){$('h1').innerHTML='성민아 생일<br>너무너무 축하했어<span class="orange">!!!!!!!</span> 🎂';$('#timer-label').textContent='10월 28일 생일 끝!'}}
$('.okay').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});document.addEventListener('visibilitychange',render);render();setInterval(render,1000);


const actionData={soup:{src:'seongmin-soup.png',alt:'미역국을 숟가락으로 먹는 성민이',status:'미역국 먹는 중 🥣'},football:{src:'seongmin-football.png',alt:'축구공을 리프팅하는 성민이',status:'공 떨어뜨리지 마 ⚽'},cake:{src:'seongmin-cake.png',alt:'케이크를 들고 촛불을 후 부는 성민이'}};
const actionStage=$('.character-stage'), characterImage=$('.character img');
let activeAction=null,actionRequest=0;
Object.values(actionData).forEach(a=>{const img=new Image();img.src=a.src});
async function playAction(action){const request=++actionRequest;const data=actionData[action];const img=new Image();img.src=data.src;try{await img.decode()}catch{return}if(request!==actionRequest)return;activeAction=action;actionStage.dataset.action=action;characterImage.src=data.src;characterImage.alt=data.alt;document.querySelectorAll('[data-action]').forEach(b=>{if(b.tagName==='BUTTON')b.setAttribute('aria-pressed',String(b.dataset.action===action))});$('.character').setAttribute('aria-label',data.alt+' — 눌러서 다시 하기');actionStage.classList.remove('blowout');if(action==='cake'){void actionStage.offsetWidth;actionStage.classList.add('blowout')}}
document.querySelectorAll('.character-actions button').forEach(b=>b.addEventListener('click',()=>playAction(b.dataset.action)));
$('.character').addEventListener('click',()=>playAction(activeAction||'cake'));
