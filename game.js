/* TimeStrike: Math Arena - standalone browser game */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const TOPICS={
 binary:{name:'BINARY',desc:'Base 2 • conversions & logic',color:'cyan'},
 octal:{name:'OCTAL',desc:'Base 8 • conversions & arithmetic',color:'cyan'},
 decimal:{name:'DECIMAL',desc:'Base 10 • arithmetic',color:'cyan'},
 hex:{name:'HEXADECIMAL',desc:'Base 16 • conversions',color:'cyan'},
 counting:{name:'COUNTING',desc:'Sum • Product • n! • nPr • nCr',color:'pink'},
 probability:{name:'PROBABILITY',desc:'Basic • Complement • Conditional',color:'pink'},
 boolean:{name:'BOOLEAN ALGEBRA',desc:'Variables • laws • simplification',color:'yellow'},
 matrices:{name:'MATRICES',desc:'Addition • multiplication • graphs',color:'yellow'},
 proofs:{name:'PROOF TECHNIQUES',desc:'Direct • contradiction • contrapositive • induction',color:'green'}
};
const CONSEQUENCES=['Do 3 quick claps!','Say “I can calculate!” with confidence.','Do a 5-second victory pose.','Count backward from 5.','Give your teammate a thumbs-up.','Say the answer again correctly.'];
let state={mode:'solo',topic:'binary',difficulty:'normal',time:20,players:2,names:['PLAYER 1','PLAYER 2','PLAYER 3'],turn:0,round:0,totalRounds:6,score:0,streak:0,bestStreak:0,correct:0,wrong:0,lives:2,double:false,question:null,answered:false,timer:null,timeLeft:20,used50:false,usedFreeze:false,paused:false};
let soundOn=true, audioCtx=null;
function beep(freq=440,dur=.08,type='square'){if(!soundOn)return;try{audioCtx??=new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.value=.035;o.connect(g);g.connect(audioCtx.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+dur);o.stop(audioCtx.currentTime+dur)}catch(e){}}
function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a} function choice(a){return a[rand(0,a.length-1)]}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function fmt(n){return Number(n).toLocaleString()}
function gcd(a,b){while(b){[a,b]=[b,a%b]}return Math.abs(a)}
function frac(n,d){const g=gcd(n,d);return `${n/g}/${d/g}`}
function baseQ(n,base){return n.toString(base).toUpperCase()}
function options(correct,gen){let set=[String(correct)];while(set.length<4){let x=gen();if(!set.includes(String(x)))set.push(String(x))}return shuffle(set)}
function makeQuestion(topic,diff){
  const max=diff==='easy'?30:diff==='hard'?150:80;
  let q;
  if(topic==='binary'){
    const n=rand(3,max);
    if(Math.random()<.5){const c=baseQ(n,2);q={type:'DECIMAL → BINARY',text:`Convert ${n}₁₀ to binary.`,answer:c,opts:options(c,()=>baseQ(rand(3,max),2)),explain:`${n} in base 10 is ${c} in base 2.`};}
    else{const b=baseQ(n,2);const c=String(n);q={type:'BINARY → DECIMAL',text:`Convert ${b}₂ to decimal.`,answer:c,opts:options(c,()=>String(rand(3,max))),explain:`${b}₂ = ${n}₁₀.`};}
  }
  if(topic==='octal'){
    const n=rand(8,max*2);
    if(Math.random()<.5){const c=baseQ(n,8);q={type:'DECIMAL → OCTAL',text:`Convert ${n}₁₀ to octal.`,answer:c,opts:options(c,()=>baseQ(rand(8,max*2),8)),explain:`${n}₁₀ = ${c}₈.`};}
    else{const o=baseQ(n,8);const c=String(n);q={type:'OCTAL → DECIMAL',text:`Convert ${o}₈ to decimal.`,answer:c,opts:options(c,()=>String(rand(8,max*2))),explain:`${o}₈ = ${n}₁₀.`};}
  }
  if(topic==='decimal'){
    let a=rand(10,max),b=rand(2,max);
    const ops=diff==='hard'?['+','-','×','÷']:['+','-','×'];
    const op=choice(ops);
    let ans;
    if(op==='+')ans=a+b;else if(op==='-')ans=a-b;else if(op==='×')ans=a*b;else{a=rand(2,12);b=rand(2,12);ans=a*b;a*=b;}
    const c=String(ans);q={type:'DECIMAL ARITHMETIC',text:`Solve: ${a} ${op} ${b} = ?`,answer:c,opts:options(c,()=>String(ans+rand(-10,10))),explain:`The correct answer is ${c}.`};
  }
  if(topic==='hex'){
    const n=rand(10,diff==='hard'?255:120);
    if(Math.random()<.5){const c=baseQ(n,16);q={type:'DECIMAL → HEX',text:`Convert ${n}₁₀ to hexadecimal.`,answer:c,opts:options(c,()=>baseQ(rand(10,255),16)),explain:`${n}₁₀ = ${c}₁₆.`};}
    else{const h=baseQ(n,16);const c=String(n);q={type:'HEX → DECIMAL',text:`Convert ${h}₁₆ to decimal.`,answer:c,opts:options(c,()=>String(rand(10,255))),explain:`${h}₁₆ = ${n}₁₀.`};}
  }
  if(topic==='counting'){
    let type=choice(['sum','product','fact','perm','comb']);
    if(diff==='easy')type=choice(['sum','product','fact']);
    if(type==='sum'){const a=rand(3,15),b=rand(3,15),c=String(a+b);q={type:'RULE OF SUM',text:`A student may choose ${a} Mathematics books OR ${b} Programming books. How many choices?`,answer:c,opts:options(c,()=>String(rand(5,35))),explain:`OR means add: ${a} + ${b} = ${c}.`};}
    if(type==='product'){const a=rand(2,8),b=rand(2,8),c=String(a*b);q={type:'RULE OF PRODUCT',text:`There are ${a} shirts and ${b} pants. How many outfits?`,answer:c,opts:options(c,()=>String(rand(4,64))),explain:`AND means multiply: ${a} × ${b} = ${c}.`};}
    if(type==='fact'){const n=rand(3,diff==='hard'?9:7),c=fmt(fact(n));q={type:'FACTORIAL',text:`Evaluate ${n}!`,answer:c,opts:options(c,()=>fmt(fact(rand(3,9)))),explain:`${n}! = ${c}.`};}
    if(type==='perm'){const n=rand(5,10),r=rand(2,Math.min(4,n-1)),c=fmt(perm(n,r));q={type:'PERMUTATION',text:`How many ways can ${r} objects be arranged from ${n}? (${n}P${r})`,answer:c,opts:options(c,()=>fmt(Math.max(1,perm(n,r)+rand(-100,100)))),explain:`nPr = n!/(n-r)! = ${c}.`};}
    if(type==='comb'){const n=rand(6,12),r=rand(2,Math.min(5,n-1)),c=fmt(comb(n,r));q={type:'COMBINATION',text:`How many ways can ${r} students be chosen from ${n}? (${n}C${r})`,answer:c,opts:options(c,()=>fmt(Math.max(1,comb(n,r)+rand(-20,20)))),explain:`nCr = n!/[r!(n-r)!] = ${c}.`};}
  }
  if(topic==='probability'){
    const type=choice(['die','coin','complement','conditional']);
    if(type==='die'){const good=choice([1,2,3]),c=frac(good,6);q={type:'BASIC PROBABILITY',text:`A fair die is rolled. What is P(event) if ${good} outcomes are favorable?`,answer:c,opts:options(c,()=>frac(rand(1,5),6)),explain:`P(E)=favorable/total = ${good}/6 = ${c}.`};}
    if(type==='coin'){q={type:'BASIC PROBABILITY',text:'A coin is tossed once. What is the probability of getting Heads?',answer:'1/2',opts:shuffle(['1/4','1/2','1','2']),explain:'There is 1 favorable outcome out of 2: 1/2.'};}
    if(type==='complement'){const p=choice([.2,.25,.4,.65,.8,.82]),c=(1-p).toFixed(2);q={type:'COMPLEMENT',text:`If P(E) = ${p.toFixed(2)}, what is P(E′)?`,answer:c,opts:options(c,()=>Math.max(0,Math.min(1,1-(p+choice([-.2,-.1,.1,.2])))).toFixed(2)),explain:`P(E′)=1−P(E)=1−${p.toFixed(2)}=${c}.`};}
    if(type==='conditional'){const a=choice([4,5,6]),b=choice([10,12,15]),c=frac(a,b);q={type:'CONDITIONAL PROBABILITY',text:`If P(A∩B)=${a}/${b} and P(B)=1, what is P(A|B)?`,answer:c,opts:options(c,()=>frac(rand(1,9),rand(2,12))),explain:`P(A|B)=P(A∩B)/P(B). Here the given values produce ${c}.`};}
  }
  if(topic==='boolean'){
    const qs=[
      ['BOOLEAN LAW','If A = 1, what is A AND 1?','1',['0','1','A','NOT A'],'Identity law: A·1=A.'],
      ['BOOLEAN LAW','If A = 0, what is A OR 0?','0',['0','1','A','NOT A'],'Identity law: A+0=A.'],
      ['COMPLEMENT','What is A AND NOT A?','0',['0','1','A','NOT A'],'Complement law: A·A′=0.'],
      ['COMPLEMENT','What is A OR NOT A?','1',['0','1','A','NOT A'],'Complement law: A+A′=1.'],
      ['ABSORPTION','Simplify A OR (A AND B).','A',['A+B','AB','B','0'],'Absorption law: A + AB = A.'],
      ['DE MORGAN','NOT(A AND B) equals?','NOT A OR NOT B',['A AND B','A OR B','NOT A AND NOT B','1'],'De Morgan: (AB)′=A′+B′.']
    ];const x=choice(qs);q={type:x[0],text:x[1],answer:x[2],opts:shuffle(x[3]),explain:x[4]};
  }
  if(topic==='matrices'){
    const type=choice(['add','multiply','entry']);
    if(type==='add'){const a=rand(1,6),b=rand(1,6),c=String(a+1);q={type:'MATRIX ADDITION',text:`For A=[[${a}, 0],[0, ${b}]], B=[[1, 1],[1, 1]], what is the top-left entry of A+B?`,answer:c,opts:options(c,()=>String(rand(1,8))),explain:`Add corresponding entries: ${a}+1=${c}.`};}
    if(type==='multiply'){const a=rand(1,5),b=rand(1,5),c=String(a*b);q={type:'MATRIX MULTIPLICATION',text:`A row is [${a}, 0] and B column is [${b}, 1]. What is their dot product?`,answer:c,opts:options(c,()=>String(rand(1,25))),explain:`Multiply and add: ${a}×${b}+0×1=${c}.`};}
    if(type==='entry'){const a=rand(2,8),b=rand(2,8);q={type:'MATRIX BASICS',text:`In matrix [[1,2],[${a},${b}]], what is the bottom-right entry?`,answer:String(b),opts:options(String(b),()=>String(rand(1,9))),explain:`The bottom-right position is row 2, column 2: ${b}.`};}
  }
  if(topic==='proofs'){
    const qs=[
      ['DIRECT PROOF','Which technique starts by assuming the hypothesis P is true?','Direct proof',['Contradiction','Induction','Contrapositive'],'Direct proof assumes P and logically derives Q.'],
      ['CONTRADICTION','Which method assumes the statement is false and derives an impossible result?','Proof by contradiction',['Direct proof','Induction','Contrapositive'],'A contradiction rejects the false assumption.'],
      ['CONTRAPOSITIVE','The contrapositive of “If P, then Q” is:','If NOT Q, then NOT P',['If Q, then P','If NOT P, then NOT Q','P AND Q'],'The contrapositive is logically equivalent to P→Q.'],
      ['INDUCTION','What are the two main steps of mathematical induction?','Basis step and inductive step',['Hypothesis and conclusion','Direct and indirect','Sum and product'],'Induction proves a base case, then k→k+1.']
    ];const x=choice(qs);q={type:x[0],text:x[1],answer:x[2],opts:shuffle(x[3]),explain:x[4]};
  }
  return q;
}
function fact(n){let r=1;for(let i=2;i<=n;i++)r*=i;return r}function perm(n,r){return fact(n)/fact(n-r)}function comb(n,r){return fact(n)/(fact(r)*fact(n-r))}
function showScreen(name){$$('.screen').forEach(x=>x.classList.remove('active'));$('#screen-'+name).classList.add('active');window.scrollTo(0,0)}
function buildTopics(){let g=$('#topicGrid');g.innerHTML='';Object.entries(TOPICS).forEach(([k,v])=>{let b=document.createElement('button');b.className='topic-btn'+(k===state.topic?' selected':'');b.dataset.topic=k;b.innerHTML=`${v.name}<small>${v.desc}</small>`;b.onclick=()=>{$$('.topic-btn').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');state.topic=k};g.appendChild(b)})}
function setup(mode){state.mode=mode;$('#setupTitle').textContent=mode==='multi'?'LOCAL MULTIPLAYER':'SOLO CAMPAIGN';$('#playerSetup').classList.toggle('hidden',mode!=='multi');buildTopics();if(mode==='multi')buildNames();showScreen('setup')}
function buildNames(){let box=$('#nameInputs');box.innerHTML='';for(let i=0;i<state.players;i++){let input=document.createElement('input');input.placeholder=`Player ${i+1} name`;input.value=state.names[i]||`PLAYER ${i+1}`;input.maxLength=18;input.oninput=()=>state.names[i]=input.value.toUpperCase();box.appendChild(input)}}
function startGame(){state.round=0;state.turn=0;state.score=0;state.streak=0;state.bestStreak=0;state.correct=0;state.wrong=0;state.lives=2;state.double=false;state.used50=false;state.usedFreeze=false;state.paused=false;state.timeLeft=state.time;if(state.mode==='multi')buildNames();showScreen('game');nextQuestion()}
function nextQuestion(){clearInterval(state.timer);state.round++;state.answered=false;state.timeLeft=state.time;state.question=makeQuestion(state.topic,state.difficulty);renderQuestion();startTimer()}
function renderQuestion(){let q=state.question;$('#hudPlayer').textContent=state.mode==='multi'?state.names[state.turn]||`PLAYER ${state.turn+1}`:'PLAYER 1';$('#hudScore').textContent=fmt(state.score);$('#hudStreak').textContent=state.streak+'×';$('#hudRound').textContent=`${state.round} / ${state.totalRounds}`;$('#hudTime').textContent=state.timeLeft;$('#gameTopic').textContent=TOPICS[state.topic].name;$('#qType').textContent=q.type;$('#qDifficulty').textContent=state.difficulty.toUpperCase();$('#questionText').textContent=q.text;$('#feedback').className='feedback';$('#feedback').textContent='';$('#consequence').classList.add('hidden');$('#progressFill').style.width='100%';const area=$('#answerArea');area.innerHTML='';q.opts.forEach((o,i)=>{let b=document.createElement('button');b.className='answer-btn';b.textContent=`${String.fromCharCode(65+i)}. ${o}`;b.onclick=()=>answer(o,b);area.appendChild(b)});updatePowerups();updateLives()}
function startTimer(){let start=Date.now();state.timer=setInterval(()=>{if(state.paused||state.answered)return;state.timeLeft--;$('#hudTime').textContent=state.timeLeft;$('#progressFill').style.width=(state.timeLeft/state.time*100)+'%';$('.timer-cell').classList.toggle('danger',state.timeLeft<=5);if(state.timeLeft<=0){clearInterval(state.timer);answer(null,null,true)}},1000)}
function answer(value,button,timeout=false){if(state.answered)return;state.answered=true;clearInterval(state.timer);$$('.answer-btn').forEach(b=>b.disabled=true);let q=state.question,ok=value!==null&&String(value)===String(q.answer);if(button)button.classList.add(ok?'correct':'wrong');if(!ok)$$('.answer-btn').find(b=>b.textContent.includes(String(q.answer)))?.classList.add('correct');let fb=$('#feedback');if(ok){let pts=(100+state.timeLeft*5)*(state.double?2:1)*(state.difficulty==='hard'?1.5:1);pts=Math.round(pts);state.score+=pts;state.correct++;state.streak++;state.bestStreak=Math.max(state.bestStreak,state.streak);fb.className='feedback good';fb.textContent=`✓ CORRECT +${fmt(pts)} • ${q.explain}`;beep(740,.1);if(state.mode==='multi')state.turn=(state.turn+1)%state.players}else{state.wrong++;state.streak=0;state.lives--;fb.className='feedback bad';fb.textContent=timeout?`⌛ TIME! ${q.explain}`:`✕ WRONG • ${q.explain}`;$('#consequence').classList.remove('hidden');$('#consequenceText').textContent=choice(CONSEQUENCES);beep(180,.16,'sawtooth');if(state.mode==='multi'&&state.lives<=0){setTimeout(()=>eliminatePlayer(),1300);return}}state.double=false;updateLives();setTimeout(()=>{if(state.round>=state.totalRounds){finishGame()}else{if(state.mode==='multi'&&state.lives>0&&Math.random()<.5){}nextQuestion()}},state.mode==='multi'?1700:1400)}
function eliminatePlayer(){if(state.players<=2||state.turn>=state.players-1){finishGame(true);return}toast(`${state.names[state.turn]} ELIMINATED!`);state.players--;state.names.splice(state.turn,1);state.lives=2;if(state.turn>=state.players)state.turn=0;state.round=0;nextQuestion()}
function updateLives(){let n=state.mode==='multi'?state.lives:1;$('#livesDisplay').textContent=state.mode==='multi'?'♥ '.repeat(n).trim():'∞';}
function updatePowerups(){$('#fiftyBtn').disabled=state.used50||state.answered;$('#freezeBtn').disabled=state.usedFreeze||state.answered;$('#doubleBtn').disabled=state.double||state.answered}
function use50(){if(state.used50||state.answered)return;state.used50=true;let wrong=$$('.answer-btn').filter(b=>!b.textContent.includes(state.question.answer));shuffle(wrong).slice(0,2).forEach(b=>b.style.visibility='hidden');updatePowerups();beep(520,.08)}
function useFreeze(){if(state.usedFreeze||state.answered)return;state.usedFreeze=true;state.timeLeft=Math.min(state.timeLeft+5,state.time+5);$('#hudTime').textContent=state.timeLeft;updatePowerups();toast('+5 SECONDS!');beep(650,.1)}
function useDouble(){if(state.double||state.answered)return;state.double=true;toast('DOUBLE POINTS ARMED!');updatePowerups();beep(900,.1)}
function finishGame(eliminated=false){clearInterval(state.timer);let acc=state.correct+state.wrong?Math.round(state.correct/(state.correct+state.wrong)*100):0;$('#finalScore').textContent=fmt(state.score);$('#correctStat').textContent=state.correct;$('#wrongStat').textContent=state.wrong;$('#accuracyStat').textContent=acc+'%';$('#bestStreakStat').textContent=state.bestStreak+'×';$('#resultTitle').textContent=eliminated?'GAME OVER':'MISSION COMPLETE';$('#resultIcon').textContent=eliminated?'💥':acc>=80?'🏆':'⚡';saveScore();showScreen('result')}
function saveScore(){let scores=JSON.parse(localStorage.getItem('timestrike_scores')||'[]');scores.push({name:state.mode==='multi'?state.names[state.turn]||'PLAYER':'PLAYER 1',score:state.score,topic:TOPICS[state.topic].name,accuracy:state.correct+state.wrong?Math.round(state.correct/(state.correct+state.wrong)*100):0,date:new Date().toLocaleDateString()});scores.sort((a,b)=>b.score-a.score);localStorage.setItem('timestrike_scores',JSON.stringify(scores.slice(0,20)))}
function leaderboard(){let scores=JSON.parse(localStorage.getItem('timestrike_scores')||'[]'),box=$('#leaderboardList');box.innerHTML='<div class="leader-row leader-head"><span>#</span><span>PLAYER</span><span>SCORE</span><span>ACCURACY</span></div>';if(!scores.length){box.innerHTML+='<p class="muted">No records yet. Finish a battle to appear here.</p>';return}scores.forEach((s,i)=>box.innerHTML+=`<div class="leader-row"><b>${i+1}</b><span>${escapeHtml(s.name)}<small class="muted"> ${escapeHtml(s.topic)}</small></span><b>${fmt(s.score)}</b><span>${s.accuracy}%</span></div>`)}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function toast(t){let x=$('#toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1500)}
function showHelp(){openModal('HOW TO PLAY',`<p><b>GOAL:</b> Answer math challenges before the timer reaches zero.</p><ul><li><b>Solo:</b> Finish 6 questions with the highest score and accuracy possible.</li><li><b>Multiplayer:</b> 2–3 players take turns. Each player starts with 2 strikes; reaching 0 eliminates the player.</li><li><b>Scoring:</b> Faster correct answers earn more points. Streaks reward accuracy.</li><li><b>Power-ups:</b> 50/50 removes two choices, Time Freeze adds 5 seconds, Double Points doubles the next correct answer.</li><li><b>Practice Lab:</b> No score pressure; use it to study the topics.</li><li>Questions cover Binary, Octal, Decimal, Hexadecimal, Counting, Probability, Boolean Algebra, Matrices, and Proof Techniques.</li></ul><p>Use <b>A–D</b> keys to answer, <b>P</b> to pause, and <b>1/2/3</b> for power-ups.</p>`)}
function openModal(title,html){$('#modalTitle').textContent=title;$('#modalBody').innerHTML=html;$('#modal').classList.remove('hidden')}
function practice(){state.mode='solo';state.topic='binary';state.difficulty='easy';state.time=30;state.totalRounds=10;startGame()}
function pause(){if(!$('#screen-game').classList.contains('active')||state.answered)return;state.paused=!state.paused;let old=$('.pause-overlay');if(state.paused){let d=document.createElement('div');d.className='pause-overlay';d.innerHTML='<div><h2>PAUSED</h2><p>Press P or the button to continue.</p><button class="main-btn">RESUME</button></div>';d.querySelector('button').onclick=pause;$('.question-card').appendChild(d)}else if(old)old.remove()}
$$('[data-back]').forEach(b=>b.onclick=()=>showScreen(b.dataset.back));$('#soloBtn').onclick=()=>setup('solo');$('#multiBtn').onclick=()=>setup('multi');$('#practiceBtn').onclick=practice;$('#leaderBtn').onclick=()=>{leaderboard();showScreen('leaderboard')};$('#startGameBtn').onclick=startGame;$('#pauseBtn').onclick=pause;$('#fiftyBtn').onclick=use50;$('#freezeBtn').onclick=useFreeze;$('#doubleBtn').onclick=useDouble;$('#soundBtn').onclick=()=>{soundOn=!soundOn;$('#soundBtn').textContent=soundOn?'🔊':'🔇'};$('#helpBtn').onclick=showHelp;$('#modalClose').onclick=()=>$('#modal').classList.add('hidden');$('#againBtn').onclick=startGame;$('#menuBtn').onclick=()=>showScreen('menu');$('#clearScores').onclick=()=>{localStorage.removeItem('timestrike_scores');leaderboard()};
$$('#difficultyChoices button').forEach(b=>b.onclick=()=>{$$('#difficultyChoices button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');state.difficulty=b.dataset.diff});$$('#timeChoices button').forEach(b=>b.onclick=()=>{$$('#timeChoices button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');state.time=+b.dataset.time});$$('#playerChoices button').forEach(b=>b.onclick=()=>{$$('#playerChoices button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');state.players=+b.dataset.players;buildNames()});
document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='p'){pause();return}if(!$('#screen-game').classList.contains('active')||state.paused||state.answered)return;if(['a','b','c','d'].includes(e.key.toLowerCase())){let i='abcd'.indexOf(e.key.toLowerCase());$$('.answer-btn')[i]?.click()}if(e.key==='1')use50();if(e.key==='2')useFreeze();if(e.key==='3')useDouble()});
// Add a compact leaderboard access from the result via keyboard L.
document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='l'&&!$('#screen-game').classList.contains('active')){leaderboard();showScreen('leaderboard')}});
leaderboard();
