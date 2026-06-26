// ── WORD BANK ──
const WORDS = [
  'the','be','to','of','and','a','in','that','have','it','for','not','on','with',
  'he','as','you','do','at','this','but','his','by','from','they','we','say','her',
  'she','or','an','will','my','one','all','would','there','their','what','so','up',
  'out','if','about','who','get','which','go','me','when','make','can','like','time',
  'no','just','him','know','take','people','into','year','your','good','some','could',
  'them','see','other','than','then','now','look','only','come','its','over','think',
  'also','back','after','use','two','how','our','work','first','well','way','even',
  'new','want','because','any','these','give','day','most','us','great','between',
  'need','large','often','hand','high','place','hold','turn','where','much','before',
  'right','too','mean','old','any','same','tell','boy','follow','came','want','show',
  'form','three','small','set','put','end','does','another','well','large','big',
  'down','side','been','call','who','oil','sit','now','find','long','down','let',
  'still','learn','plant','cover','food','sun','four','between','state','keep','eye',
  'never','last','door','example','begin','life','always','those','both','paper','together',
  'got','group','often','run','important','until','children','side','feet','car','mile',
  'night','walk','white','sea','began','grow','took','river','four','carry','state',
  'once','book','hear','stop','without','second','later','miss','idea','enough','eat',
  'face','watch','far','indian','real','almost','let','above','girl','sometimes','mountain',
  'cut','young','talk','soon','list','song','being','leave','family','body','music'
];

// ── STATE ──
let words        = [];
let wordIndex    = 0;
let letterIndex  = 0;
let startTime    = null;
let timerInterval= null;
let testDuration = 30;
let timeLeft     = 30;
let testRunning  = false;
let testDone     = false;
let correctChars = 0;
let wrongChars   = 0;
let totalTyped   = 0;
let mistakes     = 0;
let history      = JSON.parse(localStorage.getItem('typing_history') || '[]');

// ── DOM ──
const $words     = document.getElementById('words-display');
const $inp       = document.getElementById('hidden-inp');
const $overlay   = document.getElementById('click-overlay');
const $liveWpm   = document.getElementById('live-wpm');
const $liveAcc   = document.getElementById('live-acc');
const $liveTime  = document.getElementById('live-time');
const $progress  = document.getElementById('progress-bar');
const $results   = document.getElementById('results-card');
const $histCard  = document.getElementById('history-card');
const $histList  = document.getElementById('history-list');
const $toast     = document.getElementById('toast');

// ── GENERATE WORDS ──
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}
function generateWords(n=80) {
  const pool = shuffle(WORDS);
  const result = [];
  while (result.length < n) result.push(...pool);
  return result.slice(0,n);
}

// ── RENDER WORDS ──
function renderWords() {
  $words.innerHTML = '';
  words.forEach((word, wi) => {
    const wEl = document.createElement('span');
    wEl.className = 'word';
    wEl.id = 'word-' + wi;
    [...word].forEach((ch, li) => {
      const lEl = document.createElement('span');
      lEl.className = 'letter';
      lEl.id = `l-${wi}-${li}`;
      lEl.textContent = ch;
      wEl.appendChild(lEl);
    });
    // space
    const sp = document.createElement('span');
    sp.className = 'letter space-letter';
    sp.id = `l-${wi}-space`;
    sp.textContent = ' ';
    wEl.appendChild(sp);
    $words.appendChild(wEl);
  });
  updateCursor();
}

// ── CURSOR ──
function updateCursor() {
  document.querySelectorAll('.cursor-line').forEach(c => c.remove());
  if (testDone) return;
  const targetId = letterIndex < words[wordIndex].length
    ? `l-${wordIndex}-${letterIndex}`
    : `l-${wordIndex}-space`;
  const target = document.getElementById(targetId);
  if (!target) return;
  const cursor = document.createElement('span');
  cursor.className = 'cursor-line';
  target.parentNode.insertBefore(cursor, target);
  // scroll into view
  scrollToWord(wordIndex);
}

function scrollToWord(wi) {
  const wEl = document.getElementById('word-' + wi);
  if (!wEl) return;
  const container = $words;
  const wTop = wEl.offsetTop;
  const lineH = 38;
  if (wTop > container.scrollTop + container.clientHeight - lineH*2) {
    container.scrollTop = wTop - lineH;
  }
}

// ── START ──
function startTest() {
  $overlay.classList.add('hidden');
  $inp.focus();
  if (!testRunning && !testDone) {
    // first keypress starts timer
  }
}

function beginTimer() {
  startTime = Date.now();
  testRunning = true;
  timerInterval = setInterval(() => {
    timeLeft--;
    const pct = ((testDuration - timeLeft) / testDuration) * 100;
    $progress.style.width = pct + '%';
    $liveTime.textContent = timeLeft;
    updateLiveWpm();
    if (timeLeft <= 0) endTest();
  }, 1000);
}

// ── TYPING ──
$inp.addEventListener('input', e => {
  if (testDone) return;
  const val = $inp.value;
  $inp.value = '';

  if (!testRunning && val.trim()) beginTimer();
  if (!testRunning) return;

  // space or word completion
  if (val === ' ') {
    // move to next word
    advanceWord(false);
    return;
  }

  const char = val.slice(-1);
  const word = words[wordIndex];

  if (letterIndex < word.length) {
    const lEl = document.getElementById(`l-${wordIndex}-${letterIndex}`);
    if (char === word[letterIndex]) {
      if (lEl) lEl.className = 'letter correct';
      correctChars++;
    } else {
      if (lEl) lEl.className = 'letter wrong';
      wrongChars++;
      mistakes++;
    }
    totalTyped++;
    letterIndex++;
  }
  updateCursor();
  updateLiveWpm();
});

$inp.addEventListener('keydown', e => {
  if (testDone) return;
  if (e.key === ' ') {
    e.preventDefault();
    if (!testRunning) return;
    advanceWord(false);
  }
  if (e.key === 'Backspace') {
    e.preventDefault();
    if (letterIndex > 0) {
      letterIndex--;
      const lEl = document.getElementById(`l-${wordIndex}-${letterIndex}`);
      if (lEl) lEl.className = 'letter';
      totalTyped = Math.max(0, totalTyped-1);
      updateCursor();
    }
  }
  if (e.key === 'Tab') { e.preventDefault(); resetTest(); }
});

function advanceWord(skip) {
  wordIndex++;
  letterIndex = 0;
  if (wordIndex >= words.length) { endTest(); return; }
  updateCursor();
}

// ── LIVE WPM ──
function updateLiveWpm() {
  const elapsed = (Date.now() - startTime) / 60000;
  const wpm = elapsed > 0 ? Math.round((correctChars/5) / elapsed) : 0;
  const acc = totalTyped > 0 ? Math.round((correctChars/totalTyped)*100) : 100;
  $liveWpm.textContent = wpm;
  $liveAcc.textContent = acc + '%';
  $liveTime.textContent = timeLeft;
}

// ── END TEST ──
function endTest() {
  clearInterval(timerInterval);
  testRunning = false;
  testDone = true;
  $progress.style.width = '100%';

  const elapsed  = (Date.now() - startTime) / 60000;
  const wpm      = elapsed > 0 ? Math.round((correctChars/5) / elapsed) : 0;
  const acc      = totalTyped > 0 ? Math.round((correctChars/totalTyped)*100) : 100;
  const timeTaken= testDuration - timeLeft;

  // fill results
  document.getElementById('res-wpm').textContent   = wpm;
  document.getElementById('res-acc').textContent   = acc + '%';
  document.getElementById('res-time').textContent  = timeTaken + 's';
  document.getElementById('res-mistakes').textContent = mistakes;
  document.getElementById('res-correct').textContent  = correctChars;
  document.getElementById('res-wrong').textContent    = wrongChars;
  document.getElementById('res-total').textContent    = totalTyped;
  document.getElementById('res-words').textContent    = wordIndex;

  $results.classList.add('show');

  // save history
  const entry = { wpm, acc, time: timeTaken, mistakes, date: new Date().toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) };
  history.unshift(entry);
  if (history.length > 20) history.pop();
  localStorage.setItem('typing_history', JSON.stringify(history));
  renderHistory();
  $histCard.classList.add('show');

  document.querySelectorAll('.cursor-line').forEach(c=>c.remove());
}

// ── RESET ──
function resetTest() {
  clearInterval(timerInterval);
  testRunning = false;
  testDone = false;
  wordIndex = 0;
  letterIndex = 0;
  correctChars = 0;
  wrongChars = 0;
  totalTyped = 0;
  mistakes = 0;
  timeLeft = testDuration;
  startTime = null;

  $liveWpm.textContent  = '0';
  $liveAcc.textContent  = '100%';
  $liveTime.textContent = testDuration;
  $progress.style.width = '0%';
  $results.classList.remove('show');
  $words.scrollTop = 0;

  words = generateWords(80);
  renderWords();
  $overlay.classList.remove('hidden');
  $inp.blur();
}

// ── DURATION PILLS ──
window.setDuration = function(d, el) {
  testDuration = d;
  timeLeft = d;
  $liveTime.textContent = d;
  document.querySelectorAll('.pill[data-dur]').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  resetTest();
};

// ── HISTORY ──
function renderHistory() {
  if (!history.length) {
    $histList.innerHTML = '<div class="history-empty">No runs yet — complete a test to see your history.</div>';
    return;
  }
  $histList.innerHTML = '';
  history.forEach((h, i) => {
    const row = document.createElement('div');
    row.className = 'history-row';
    row.style.animationDelay = (i*0.04)+'s';
    row.innerHTML = `
      <div class="hr-num">#${i+1}</div>
      <div><div class="hr-val">${h.wpm}</div><div class="hr-lbl">WPM</div></div>
      <div><div class="hr-val">${h.acc}%</div><div class="hr-lbl">Acc</div></div>
      <div><div class="hr-val">${h.time}s</div><div class="hr-lbl">Time</div></div>
      <div><div class="hr-val">${h.mistakes}</div><div class="hr-lbl">Mistakes</div></div>
      <div class="hr-date">${h.date}</div>`;
    $histList.appendChild(row);
  });
}

window.clearHistory = function() {
  history = [];
  localStorage.removeItem('typing_history');
  renderHistory();
  toast('History cleared');
};

// ── TOAST ──
let toastT;
function toast(msg, type='') {
  $toast.textContent = msg;
  $toast.className = 'toast show ' + type;
  clearTimeout(toastT);
  toastT = setTimeout(() => $toast.className = 'toast', 2000);
}

// ── EXPOSE GLOBALS ──
window.startTest  = startTest;
window.resetTest  = resetTest;

// ── BOOT ──
words = generateWords(80);
renderWords();
renderHistory();
if (history.length) $histCard.classList.add('show');
