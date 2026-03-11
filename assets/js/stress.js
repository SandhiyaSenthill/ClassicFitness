// ============================================================
//  CLASSIC FITNESS — stress.js
//  PSS-10 Quiz + Lifestyle inputs + Claude AI recommendation
// ============================================================

const PSS_QUESTIONS = [
  {
    en: "…you have been upset because of something that happened unexpectedly?",
    ta: "…எதிர்பாராத விதமாக நடந்த ஒன்றால் நீங்கள் மனம் வருந்தினீர்களா?"
  },
  {
    en: "…you felt that you were unable to control the important things in your life?",
    ta: "…உங்கள் வாழ்க்கையின் முக்கியமான விஷயங்களை கட்டுப்படுத்த முடியவில்லை என்று உணர்ந்தீர்களா?"
  },
  {
    en: "…you felt nervous and stressed?",
    ta: "…நீங்கள் பதட்டமாகவும் மன அழுத்தத்துடனும் இருந்தீர்களா?"
  },
  {
    en: "…you felt confident about your ability to handle your personal problems?",  // reversed
    ta: "…உங்கள் தனிப்பட்ட பிரச்சனைகளை சமாளிக்கும் திறனில் நம்பிக்கை இருந்ததா?"
  },
  {
    en: "…things were going your way?",                                              // reversed
    ta: "…விஷயங்கள் உங்கள் விருப்பப்படி நடந்தனவா?"
  },
  {
    en: "…you could not cope with all the things that you had to do?",
    ta: "…செய்யவேண்டிய அனைத்து விஷயங்களையும் சமாளிக்க முடியவில்லை என்று தோன்றியதா?"
  },
  {
    en: "…you have been able to control irritations in your life?",                  // reversed
    ta: "…உங்கள் வாழ்க்கையில் எரிச்சலூட்டும் விஷயங்களை கட்டுப்படுத்த முடிந்ததா?"
  },
  {
    en: "…you felt that you were on top of things?",                                // reversed
    ta: "…நீங்கள் எல்லாவற்றையும் கட்டுக்குள் வைத்திருக்கிறீர்கள் என்று உணர்ந்தீர்களா?"
  },
  {
    en: "…you have been angered because of things that were outside of your control?",
    ta: "…உங்கள் கட்டுப்பாட்டில் இல்லாத விஷயங்களால் கோபம் வந்ததா?"
  },
  {
    en: "…difficulties were piling up so high that you could not overcome them?",
    ta: "…சிரமங்கள் மிகவும் அதிகமாகி, அவற்றை சமாளிக்கவே முடியாது என்று தோன்றியதா?"
  }
];

// Reversed-scored questions (0-indexed): 3,4,6,7
const REVERSED = [3, 4, 6, 7];

let answers = new Array(10).fill(null);
  let currentQ = 0;
  let lifestyle = { sleep: '', work: '', exercise: '', diet: '' };
  let stressUser = { name: '', mobile: '' };

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('stressStartBtn').addEventListener('click', startQuiz);
  document.getElementById('stressNavNext').addEventListener('click', goNext);
  document.getElementById('stressNavBack').addEventListener('click', goBack);
  document.getElementById('stressRetakeBtn').addEventListener('click', retake);
  document.getElementById('stressPdfBtn').addEventListener('click', generatePDF);
  document.getElementById('backToTop')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.getElementById('year').textContent = new Date().getFullYear();

  // Lifestyle option pickers
  ['lsSleep', 'lsWork', 'lsExercise', 'lsDiet'].forEach(id => {
    document.getElementById(id).querySelectorAll('.stress-ls-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.stress-ls-opts').querySelectorAll('.stress-ls-opt').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const key = id.replace('ls', '').toLowerCase();
        lifestyle[key] = btn.dataset.val;
        checkLifestyleReady();
      });
    });
  });

  document.getElementById('stressLsSubmit').addEventListener('click', submitAll);

  // Gate modal
  document.getElementById('stressGateMobile').addEventListener('input', e => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
  });
  document.getElementById('stressGateSubmit').addEventListener('click', handleGateSubmit);
  document.getElementById('stressGateOverlay').addEventListener('keydown', e => {
      if (e.key === 'Enter') handleGateSubmit();
  });


  // Mobile nav hamburger
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', e => {
      e.stopPropagation();
      navLinks.classList.toggle('show');
      const spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('show')) {
        spans[0].style.transform = 'rotate(45deg) translateY(7px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    document.addEventListener('click', e => {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('show');
        navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  // Build dots
  buildDots();
  renderQuestion(0);
});

function startQuiz() {
  document.getElementById('stressGateOverlay').style.display = 'flex';
  setTimeout(() => document.getElementById('stressGateName')?.focus(), 300);
}

function proceedToQuiz() {
  document.getElementById('stressGateOverlay').style.display = 'none';
  document.querySelector('.stress-hero').style.display = 'none';
  document.getElementById('stressQuizSection').style.display = 'flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}



async function handleGateSubmit() {
  const nameEl   = document.getElementById('stressGateName');
  const mobileEl = document.getElementById('stressGateMobile');
  const nameErr  = document.getElementById('stressGateNameErr');
  const mobErr   = document.getElementById('stressGateMobileErr');
  const btn      = document.getElementById('stressGateSubmit');

  nameErr.style.display  = 'none';
  mobErr.style.display   = 'none';

  const name   = nameEl.value.trim();
  const mobile = mobileEl.value.trim();
  let valid = true;

  if (!name)                    { nameErr.style.display = 'block'; nameEl.focus();   valid = false; }
  if (!mobile || mobile.length < 10) { mobErr.style.display  = 'block'; if (valid) mobileEl.focus(); valid = false; }
  if (!valid) return;

  stressUser = { name, mobile };
  btn.disabled = true;
  btn.textContent = 'Processing…';

  try {
    await fetch('https://classicfitness-api.sandhiyasenthill3.workers.dev/save-stress-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mobile, source: 'stress-check' })
    });
  } catch (e) {
    console.warn('Lead save failed:', e);
  }

  proceedToQuiz();
}


// ── QUIZ ─────────────────────────────────────────────────────
function buildDots() {
  const wrap = document.getElementById('stressQDots');
  wrap.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    const d = document.createElement('div');
    d.className = 'stress-q-dot';
    wrap.appendChild(d);
  }
}

function renderQuestion(idx) {
  // Animate card out then in
  const card = document.getElementById('stressQCard');
  card.style.animation = 'none';
  card.offsetHeight; // reflow
  card.style.animation = 'qSlideIn 0.35s cubic-bezier(0.22,1,0.36,1)';

  document.getElementById('stressQNum').textContent = String(idx + 1).padStart(2, '0');

  // Show English + Tamil bilingual question
  const q = PSS_QUESTIONS[idx];
  const qTextEl = document.getElementById('stressQText');
  qTextEl.innerHTML = `
    <span class="stress-q-en">${q.en}</span>
    <span class="stress-q-ta">${q.ta}</span>
  `;

  // Restore selected state
  document.querySelectorAll('.stress-opt').forEach(btn => {
    const val = parseInt(btn.dataset.val);
    btn.classList.toggle('selected', answers[idx] === val);
    btn.addEventListener('click', () => selectAnswer(val), { once: false });
  });

  // Re-bind option clicks (remove old listeners by cloning)
  const optWrap = document.getElementById('stressOptions');
  const newOptWrap = optWrap.cloneNode(true);
  optWrap.parentNode.replaceChild(newOptWrap, optWrap);
  newOptWrap.querySelectorAll('.stress-opt').forEach(btn => {
    btn.classList.toggle('selected', answers[idx] === parseInt(btn.dataset.val));
    btn.addEventListener('click', () => selectAnswer(parseInt(btn.dataset.val)));
  });

  // Progress
  const pct = ((idx) / 10) * 100;
  document.getElementById('stressProgressFill').style.width = pct + '%';
  document.getElementById('stressProgressLabel').textContent = `Question ${idx + 1} of 10`;

  // Dots
  document.querySelectorAll('.stress-q-dot').forEach((d, i) => {
    d.className = 'stress-q-dot' + (i === idx ? ' active' : i < idx ? ' done' : '');
  });

  // Buttons
  document.getElementById('stressNavBack').style.visibility = idx > 0 ? 'visible' : 'hidden';
  document.getElementById('stressNavNext').disabled = answers[idx] === null;
  document.getElementById('stressNavNext').textContent = idx === 9 ? 'Continue →' : 'Next →';
}

function selectAnswer(val) {
  answers[currentQ] = val;
  document.querySelectorAll('#stressOptions .stress-opt').forEach(btn => {
    btn.classList.toggle('selected', parseInt(btn.dataset.val) === val);
  });
  document.getElementById('stressNavNext').disabled = false;

  // Auto-advance after short delay
  setTimeout(() => {
    if (currentQ < 9) goNext();
    else goNext();
  }, 420);
}

function goNext() {
  if (answers[currentQ] === null) return;
  if (currentQ < 9) {
    currentQ++;
    renderQuestion(currentQ);
  } else {
    // Show lifestyle section
    document.getElementById('stressQuizSection').style.display = 'none';
    document.getElementById('stressLifestyleSection').style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function goBack() {
  if (currentQ > 0) {
    currentQ--;
    renderQuestion(currentQ);
  }
}

function checkLifestyleReady() {
  const ready = lifestyle.sleep && lifestyle.work && lifestyle.exercise && lifestyle.diet;
  document.getElementById('stressLsSubmit').disabled = !ready;
}

// ── SCORE CALCULATION ─────────────────────────────────────────
function calcScore() {
  let total = 0;
  answers.forEach((val, i) => {
    if (REVERSED.includes(i)) {
      total += (4 - val); // reverse score
    } else {
      total += val;
    }
  });
  return total;
}

function getLevel(score) {
  if (score <= 13) return { level: 'Low Stress', color: 'var(--s-green)', ring: '#4caf82', cls: 'low' };
  if (score <= 26) return { level: 'Moderate Stress', color: 'var(--s-yellow)', ring: '#e8a838', cls: 'mod' };
  return { level: 'High Stress', color: 'var(--s-red)', ring: '#e05c5c', cls: 'high' };
}

// ── SUBMIT ────────────────────────────────────────────────────
async function submitAll() {
  const score = calcScore();
  const info = getLevel(score);

  // Show loading
  document.getElementById('stressLifestyleSection').style.display = 'none';
  document.getElementById('stressLoadingSection').style.display = 'flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const loadingMessages = [
    'Analysing your responses…',
    'Calculating your stress profile…',
    'Crafting your workout plan…',
    'Adding personalised wellness tips…'
  ];
  let lmIdx = 0;
  const lmInterval = setInterval(() => {
    lmIdx = (lmIdx + 1) % loadingMessages.length;
    document.getElementById('stressLoadingText').textContent = loadingMessages[lmIdx];
  }, 1800);

  // Call Claude API
  let aiHtml = '';
  try {
    aiHtml = await getAIRecommendation(score, info.level, lifestyle);
  } catch (e) {
    aiHtml = getFallbackResult(score, info.level, lifestyle);
  }

  clearInterval(lmInterval);

  // Show result
  document.getElementById('stressLoadingSection').style.display = 'none';
  document.getElementById('stressResultSection').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Animate gauge
  setTimeout(() => {
    const pct = score / 40;
    const totalDash = 346;
    const offset = totalDash - (pct * totalDash);
    const fill = document.getElementById('stressGaugeFill');
    fill.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.34,1,0.64,1)';
    fill.style.strokeDashoffset = offset;

    // Needle: -90deg = 0 (far left), +90deg = 100% (far right)
    const needleDeg = -90 + (pct * 180);
    const needle = document.getElementById('stressNeedle');
    needle.style.transition = 'transform 1.4s cubic-bezier(0.34,1,0.64,1)';
    needle.style.transform = `rotate(${needleDeg}deg)`;
    needle.style.transformOrigin = '160px 160px';

    // Count up score number (SVG text)
    let count = 0;
    const step = Math.ceil(score / 30);
    const numEl = document.getElementById('stressScoreNum');
    const counter = setInterval(() => {
      count = Math.min(count + step, score);
      numEl.textContent = count;
      if (count >= score) clearInterval(counter);
    }, 40);
  }, 300);

  // Render colourful breakdown bars
  setTimeout(() => renderBreakdownBars(score), 700);

  document.getElementById('stressScoreLevel').textContent = info.level;
  document.getElementById('stressScoreLevel').style.color = info.ring;

  const descMap = {
    low: 'You\'re managing stress well. Your lifestyle habits are supporting your mental balance. Keep it up!',
    mod: 'You\'re experiencing moderate stress. Some areas of your life may need attention. A structured gym routine can help significantly.',
    high: 'You\'re under significant stress. This is impacting your wellbeing. The plan below is designed specifically to help you recover and rebalance.'
  };
  document.getElementById('stressScoreDesc').textContent = descMap[info.cls];

  const badgeLabels = { low: '😌 Well Balanced', mod: '⚠️ Needs Attention', high: '🔴 High Priority' };
  document.getElementById('stressScoreBadges').innerHTML =
    `<span class="stress-score-badge ${info.cls}">${badgeLabels[info.cls]}</span>` +
    `<span class="stress-score-badge">Score: ${score}/40</span>`;

  document.getElementById('stressAiResult').innerHTML = aiHtml;
}

// ── CLAUDE AI CALL ────────────────────────────────────────────
async function getAIRecommendation(score, level, ls) {
  const response = await fetch('https://classicfitness-api.sandhiyasenthill3.workers.dev/stress-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score, level, lifestyle: ls })
  });

  if (!response.ok) throw new Error('Worker error');
  const data = await response.json();
  if (!data.html) throw new Error('No response');
  // Strip markdown fences Claude sometimes adds
  return data.html
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

// ── FALLBACK (if API fails) ───────────────────────────────────
function getFallbackResult(score, level, ls) {
  const isHigh = score > 26;
  const isMod  = score > 13;

  return `
    <div class="stress-result-block motivation">
      <div class="stress-result-block-title">💬 Your Message</div>
      <p>${isHigh
        ? "You're carrying a heavy load right now — and recognising that takes courage. This plan is designed to help you reset, one step at a time. Your body and mind are capable of incredible recovery when given the right tools."
        : isMod
        ? "You're doing better than you think, but there's room to feel even more balanced. Small, consistent changes in your routine can make a big difference. You've got this!"
        : "You're in a great place! Keep nurturing the habits that are working for you. Your consistency is paying off — stay the course and keep moving forward."
      }</p>
    </div>
    <div class="stress-result-block workout">
      <div class="stress-result-block-title">🏋️ Your Workout Plan</div>
      <p>${isHigh
        ? "Focus on low-to-moderate intensity exercise to reduce cortisol without adding physical stress."
        : "A balanced mix of strength and cardio will help regulate your mood and energy levels."
      }</p>
      <ul>
        ${isHigh
          ? '<li><strong>Yoga / Stretching</strong> — 30 min, 4× per week</li><li><strong>Walking or light jog</strong> — 20–30 min daily</li><li><strong>Bodyweight circuit</strong> — 3×/week (squats, push-ups, planks)</li><li><strong>Avoid heavy lifting</strong> until stress levels reduce</li>'
          : isMod
          ? '<li><strong>Strength Training</strong> — 3× per week (compound movements)</li><li><strong>Cardio</strong> — 20–30 min, 3× per week</li><li><strong>Yoga / Mobility</strong> — 2× per week for recovery</li><li><strong>Weekend outdoor activity</strong> — walk, swim or cycle</li>'
          : '<li><strong>Maintain current routine</strong> — you\'re on track</li><li><strong>Strength Training</strong> — 4× per week</li><li><strong>HIIT</strong> — 1–2× per week for endorphin boost</li><li><strong>Active recovery</strong> — yoga or stretching 2× per week</li>'
        }
      </ul>
    </div>
    <div class="stress-result-block breathing">
      <div class="stress-result-block-title">🌬️ Breathing Technique — Box Breathing</div>
      <p>Practice this 4–4–4–4 box breathing technique for 5 minutes daily, especially before bed or when feeling overwhelmed:</p>
      <ul>
        <li><strong>Inhale</strong> slowly through your nose for <strong>4 counts</strong></li>
        <li><strong>Hold</strong> your breath for <strong>4 counts</strong></li>
        <li><strong>Exhale</strong> slowly through your mouth for <strong>4 counts</strong></li>
        <li><strong>Hold</strong> empty for <strong>4 counts</strong></li>
        <li>Repeat 4–6 cycles. This activates your parasympathetic nervous system.</li>
      </ul>
    </div>
    <div class="stress-result-block motivation">
      <div class="stress-result-block-title">🌿 Daily Wellness Tips</div>
      <ul>
        <li>${ls.sleep === 'less4' || ls.sleep === '4to6' ? '<strong>Prioritise sleep:</strong> Aim for 7–8 hours. Avoid screens 1 hour before bed and keep a consistent sleep schedule.' : '<strong>Protect your sleep quality:</strong> Keep your bedroom cool and dark. Avoid caffeine after 2pm.'}</li>
        <li>${ls.exercise === 'none' || ls.exercise === '1to2' ? '<strong>Start moving:</strong> Even a 20-minute daily walk reduces stress hormones by up to 26%. Start small and build.' : '<strong>Keep exercising:</strong> Your current frequency is great. Focus on adding mindful movement like yoga on rest days.'}</li>
        <li>${ls.diet === 'poor' || ls.diet === 'fair' ? '<strong>Fuel your recovery:</strong> Add one extra vegetable and reduce processed food this week. Small dietary improvements directly lower cortisol.' : '<strong>Sustain your good diet:</strong> Include magnesium-rich foods (nuts, dark chocolate, leafy greens) to support stress regulation.'}</li>
      </ul>
    </div>`;
}

// ── BREAKDOWN BARS ───────────────────────────────────────────
function renderBreakdownBars(score) {
  // Define 5 stress dimensions with their relevant question indices
  const categories = [
    { label: '😤 Overwhelm',    icon: '😤', qs: [0, 5, 9], color: '#ff4d6a', bg: 'rgba(255,77,106,0.12)' },
    { label: '🧠 Control Loss', icon: '🧠', qs: [1, 6, 7], color: '#ff9b3a', bg: 'rgba(255,155,58,0.12)' },
    { label: '😰 Nervousness',  icon: '😰', qs: [2, 3],    color: '#ffe047', bg: 'rgba(255,224,71,0.12)' },
    { label: '💪 Confidence',   icon: '💪', qs: [4, 8],    color: '#4cde80', bg: 'rgba(76,222,128,0.12)' },
    { label: '🌊 Coping',       icon: '🌊', qs: [5, 9],    color: '#5bc8f5', bg: 'rgba(91,200,245,0.12)' },
  ];

  const wrap = document.getElementById('stressBreakdownBars');
  wrap.innerHTML = '';

  categories.forEach((cat, idx) => {
    // Average the relevant questions (already reversed by calcScore logic not applied here — raw answers used for visual only)
    const vals = cat.qs.map(qi => answers[qi] !== null ? answers[qi] : 0);
    const avg  = vals.reduce((a, b) => a + b, 0) / vals.length;
    const pct  = Math.round((avg / 4) * 100);

    const row = document.createElement('div');
    row.className = 'stress-bar-row';
    row.style.animationDelay = (idx * 0.12) + 's';
    row.innerHTML = `
      <div class="stress-bar-label">${cat.label}</div>
      <div class="stress-bar-track">
        <div class="stress-bar-fill" data-pct="${pct}"
          style="background: linear-gradient(90deg, ${cat.color}99, ${cat.color}); width: 0%">
        </div>
      </div>
      <div class="stress-bar-pct" style="color:${cat.color}">${pct}%</div>
    `;
    wrap.appendChild(row);
  });

  // Animate bars in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      wrap.querySelectorAll('.stress-bar-fill').forEach(el => {
        el.style.transition = 'width 1s cubic-bezier(0.34,1,0.64,1)';
        el.style.width = el.dataset.pct + '%';
      });
    });
  });
}

// ── GENERATE PDF ─────────────────────────────────────────────
async function generatePDF() {
  const btn = document.getElementById('stressPdfBtn');
  btn.disabled = true;
  btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Generating…`;

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = 210;
    const margin = 18;
    const contentW = pageW - margin * 2;
    let y = 0;

    // ── Helpers ────────────────────────────────────────────────
    const score   = calcScore();
    const info    = getLevel(score);
    const pct     = Math.round((score / 40) * 100);
    const userName = stressUser.name || 'User';
    const dateStr  = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });

    const levelColor = info.cls === 'low'  ? [76,175,130]
                     : info.cls === 'mod'  ? [232,168,56]
                     :                       [224,92,92];

    // ── PAGE BACKGROUND ────────────────────────────────────────
    doc.setFillColor(245, 243, 240);
    doc.rect(0, 0, 210, 297, 'F');

    // ── HEADER BANNER ──────────────────────────────────────────
    doc.setFillColor(26, 26, 46);
    doc.rect(0, 0, 210, 46, 'F');

    // Gym name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('CLASSIC FITNESS GYM', margin, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(180, 180, 200);
    doc.text('UNISEX [AC] GYM • ARAKKONAM', margin, 25);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('PSS-10 STRESS ASSESSMENT REPORT', margin, 38);

    // Date top right
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 180);
    doc.text(dateStr, pageW - margin, 38, { align: 'right' });

    y = 56;

    // ── USER NAME ──────────────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(26, 26, 46);
    doc.text(`Report for: ${userName}`, margin, y);
    y += 12;

    // ── SCORE CARD ─────────────────────────────────────────────
    // Card background
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, contentW, 52, 4, 4, 'F');

    // Big score circle
    const cx = margin + 30, cy = y + 26;
    doc.setFillColor(...levelColor);
    doc.circle(cx, cy, 18, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text(String(score), cx, cy + 3, { align: 'center' });
    doc.setFontSize(8);
    doc.text('/ 40', cx, cy + 9, { align: 'center' });

    // Score bar (right side)
    const barX = margin + 58, barY = y + 12, barW = contentW - 64, barH = 8;
    doc.setFillColor(225, 222, 218);
    doc.roundedRect(barX, barY, barW, barH, 2, 2, 'F');
    doc.setFillColor(...levelColor);
    doc.roundedRect(barX, barY, barW * (score / 40), barH, 2, 2, 'F');

    // Level text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(...levelColor);
    doc.text(info.level, barX, y + 9);

    // Description
    const descMap = {
      low:  "You're managing stress well. Keep maintaining your healthy habits!",
      mod:  "You're experiencing moderate stress. A structured gym routine can help significantly.",
      high: "You're under significant stress. The plan below is designed to help you recover."
    };
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(90, 90, 114);
    const descLines = doc.splitTextToSize(descMap[info.cls], barW);
    doc.text(descLines, barX, barY + 16);

    // Badge
    doc.setFillColor(240, 238, 235);
    doc.roundedRect(barX, y + 36, 40, 10, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(90, 90, 114);
    const badge = info.cls === 'low' ? 'Well Balanced' : info.cls === 'mod' ? 'Needs Attention' : 'High Priority';
    doc.text(badge, barX + 20, y + 43, { align: 'center' });

    doc.setFillColor(240, 238, 235);
    doc.roundedRect(barX + 44, y + 36, 30, 10, 2, 2, 'F');
    doc.text(`Score: ${score}/40`, barX + 59, y + 43, { align: 'center' });

    y += 62;

    // ── BREAKDOWN BARS ─────────────────────────────────────────
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, contentW, 82, 4, 4, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(26, 26, 46);
    doc.text('Your Stress Breakdown', margin + 6, y + 10);

    const categories = [
      { label: 'Overwhelm',    qs: [0,5,9], color: [255,77,106]  },
      { label: 'Control Loss', qs: [1,6,7], color: [255,155,58]  },
      { label: 'Nervousness',  qs: [2,3],   color: [255,200,30]  },
      { label: 'Confidence',   qs: [4,8],   color: [76,222,128]  },
      { label: 'Coping',       qs: [5,9],   color: [91,200,245]  },
    ];

    let bY = y + 17;
    categories.forEach(cat => {
      const vals = cat.qs.map(qi => answers[qi] !== null ? answers[qi] : 0);
      const avg  = vals.reduce((a,b) => a+b, 0) / vals.length;
      const cpct = avg / 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(40, 40, 60);
      doc.text(cat.label, margin + 6, bY + 4);

      const bX = margin + 42, bW = contentW - 60, bH = 6;
      doc.setFillColor(220, 218, 215);
      doc.roundedRect(bX, bY, bW, bH, 1.5, 1.5, 'F');
      doc.setFillColor(...cat.color);
      doc.roundedRect(bX, bY, bW * cpct, bH, 1.5, 1.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...cat.color);
      doc.text(`${Math.round(cpct * 100)}%`, margin + contentW - 6, bY + 4.5, { align: 'right' });

      bY += 12;
    });
    y += 90;

    // ── LIFESTYLE SNAPSHOT ─────────────────────────────────────
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, contentW, 38, 4, 4, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(26, 26, 46);
    doc.text('Lifestyle Snapshot', margin + 6, y + 10);

    // No emojis — use plain text labels instead
    const lsLabels = {
      sleep:    { less4:'Sleep: Less than 4h', '4to6':'Sleep: 4-6 hours', '6to8':'Sleep: 6-8 hours', more8:'Sleep: 8+ hours' },
      work:     { less6:'Work: Less than 6h',  '6to8':'Work: 6-8 hours',  '8to10':'Work: 8-10 hours', more10:'Work: 10+ hours' },
      exercise: { none:'Exercise: None', '1to2':'Exercise: 1-2x/week', '3to4':'Exercise: 3-4x/week', daily:'Exercise: Daily' },
      diet:     { poor:'Diet: Poor', fair:'Diet: Fair', good:'Diet: Good', excellent:'Diet: Excellent' }
    };

    const lsData = [
      { icon: 'S', label: lsLabels.sleep[lifestyle.sleep]    || 'Sleep: —',    color: [107,127,215] },
      { icon: 'W', label: lsLabels.work[lifestyle.work]      || 'Work: —',     color: [155,143,207] },
      { icon: 'E', label: lsLabels.exercise[lifestyle.exercise] || 'Exercise: —', color: [76,175,130] },
      { icon: 'D', label: lsLabels.diet[lifestyle.diet]      || 'Diet: —',     color: [232,168,56]  },
    ];

    const colW = contentW / 4;
    lsData.forEach((item, i) => {
      const ix = margin + 6 + i * colW;
      // Coloured circle icon
      doc.setFillColor(...item.color);
      doc.circle(ix + 4, y + 22, 4, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text(item.icon, ix + 4, y + 24.5, { align: 'center' });
      // Label text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(60, 60, 80);
      const labelLines = doc.splitTextToSize(item.label, colW - 14);
      doc.text(labelLines, ix + 10, y + 21);
    });
    y += 46;

    // ── AI RECOMMENDATIONS ─────────────────────────────────────
    const aiEl = document.getElementById('stressAiResult');

    // Parse the AI HTML into structured sections
    const sections = [];
    if (aiEl) {
      // Extract each block: title + content
      aiEl.querySelectorAll('.stress-result-block, [class*="result-block"]').forEach(block => {
        const titleEl = block.querySelector('.stress-result-block-title, h2, h3');
        const title   = titleEl ? titleEl.innerText.replace(/[^\x00-\x7E]/g, '').trim() : '';
        // Get all text lines (p + li)
        const items = [];
        block.querySelectorAll('p, li').forEach(el => {
          const txt = el.innerText.replace(/[^\x00-\x7E]/g, '').replace(/\s+/g, ' ').trim();
          if (txt) items.push({ text: txt, isList: el.tagName === 'LI' });
        });
        if (title || items.length) sections.push({ title, items });
      });

      // Fallback: if no blocks found, split raw innerText by lines
      if (sections.length === 0) {
        const raw = aiEl.innerText.replace(/[^\x00-\x7E\n]/g, '').trim();
        const rawLines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 2);
        rawLines.forEach(line => {
          // Treat short ALL-CAPS or title-like lines as headings
          const isHeading = line.length < 60 && (line === line.toUpperCase() || /^[A-Z][^.!?]*$/.test(line));
          if (isHeading) {
            sections.push({ title: line, items: [] });
          } else {
            if (!sections.length) sections.push({ title: '', items: [] });
            sections[sections.length - 1].items.push({ text: line, isList: line.startsWith('-') || line.startsWith('*') });
          }
        });
      }
    }

    if (sections.length > 0) {
      // Section header row
      doc.setFillColor(26, 26, 46);
      doc.roundedRect(margin, y, contentW, 12, 3, 3, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text('AI Wellness Plan', margin + 6, y + 8.5);
      y += 18;

      const sectionColors = [
        [107,127,215], [76,175,130], [232,168,56], [224,92,92], [91,200,245]
      ];

      sections.forEach((section, si) => {
        // Page overflow check before each section
        if (y > 260) {
          doc.addPage();
          doc.setFillColor(245, 243, 240);
          doc.rect(0, 0, 210, 297, 'F');
          y = 20;
        }

        const sc = sectionColors[si % sectionColors.length];

        // Section title bar
        if (section.title) {
          doc.setFillColor(...sc.map(v => Math.min(255, v + 170))); // light tint
          doc.roundedRect(margin, y, contentW, 9, 2, 2, 'F');
          doc.setFillColor(...sc);
          doc.rect(margin, y, 3, 9, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(...sc.map(v => Math.max(0, v - 40)));
          doc.text(section.title, margin + 7, y + 6.5);
          y += 13;
        }

        // Section items
        section.items.forEach(item => {
          if (y > 270) {
            doc.addPage();
            doc.setFillColor(245, 243, 240);
            doc.rect(0, 0, 210, 297, 'F');
            y = 20;
          }

          const indent = item.isList ? margin + 8 : margin + 4;
          const availW = contentW - (item.isList ? 12 : 6);

          if (item.isList) {
            // Bullet dot
            doc.setFillColor(...sc);
            doc.circle(margin + 4, y + 1.5, 1.2, 'F');
          }

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.2);
          doc.setTextColor(50, 50, 70);
          const wrapped = doc.splitTextToSize(item.text, availW);
          doc.text(wrapped, indent, y + 3);
          y += wrapped.length * 5 + 2;
        });

        y += 4; // gap between sections
      });
    }

    // ── FOOTER ─────────────────────────────────────────────────
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFillColor(26, 26, 46);
      doc.rect(0, 285, 210, 12, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(160, 160, 180);
      doc.text('Classic Fitness Gym, Arakkonam  |  classicfitnessgym.in  |  +91 86680 07901', margin, 292);
      doc.text(`Page ${p} of ${totalPages}`, pageW - margin, 292, { align: 'right' });
    }

    // ── SAVE ───────────────────────────────────────────────────
    const safeName = userName.replace(/\s+/g, '_');
    doc.save(`StressReport_${safeName}_${score}of40.pdf`);

  } catch (err) {
    console.error('PDF error:', err);
    alert('Could not generate PDF. Please try again.');
  }

  btn.disabled = false;
  btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download PDF Report`;
}

// ── RETAKE ────────────────────────────────────────────────────
function retake() {
  answers = new Array(10).fill(null);
  currentQ = 0;
  lifestyle = { sleep: '', work: '', exercise: '', diet: '' };
  stressUser = { name: '', mobile: '' };

  document.getElementById('stressResultSection').style.display = 'none';
  document.querySelector('.stress-hero').style.display = 'flex';

  // Reset lifestyle UI
  document.querySelectorAll('.stress-ls-opt').forEach(b => b.classList.remove('selected'));
  document.getElementById('stressLsSubmit').disabled = true;

  // Reset progress
  document.getElementById('stressProgressFill').style.width = '10%';
  renderQuestion(0);

  // Reset gate modal — clear inputs & restore button to clickable state
  const gateBtn = document.getElementById('stressGateSubmit');
  gateBtn.disabled    = false;
  gateBtn.textContent = 'Start My Stress Check →';
  document.getElementById('stressGateName').value    = '';
  document.getElementById('stressGateMobile').value  = '';
  document.getElementById('stressGateNameErr').style.display   = 'none';
  document.getElementById('stressGateMobileErr').style.display = 'none';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}