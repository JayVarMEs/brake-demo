const screen = document.querySelector("#screen");
const caption = document.querySelector("#caption-text");
const stageCount = document.querySelector("#stage-count");
const stageItems = [...document.querySelectorAll("#stage-list li")];
const toast = document.querySelector("#toast");
const soundToggle = document.querySelector("#sound-toggle");

let currentScreen = "transfer";
let timerId = null;
let toastTimer = null;
let audioEnabled = false;

const icon = (name, className = "") =>
  `<svg class="${className}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

const header = (title, backTarget = "home", endIcon = "shield") => `
  <div class="app-header">
    <button class="back" type="button" data-go="${backTarget}" aria-label="ย้อนกลับ">${icon("back")}</button>
    <h2>${title}</h2>
    <span class="header-icon">${icon(endIcon)}</span>
  </div>`;

const nav = () => `
  <nav class="bottom-nav" aria-label="เมนูหลัก">
    <span class="nav-item active">${icon("home")}หน้าหลัก</span>
    <span class="nav-item">${icon("spark")}K+ market</span>
    <span class="nav-item">${icon("receipt")}การเงิน</span>
    <span class="nav-item nav-scan">${icon("scan")}สแกน</span>
    <span class="nav-item">${icon("more")}อื่น ๆ</span>
  </nav>`;

const templates = {
  home: () => `
    <div class="screen-slide">
      <div class="bank-brand"><span>K</span> <b>PLUS</b><button type="button" aria-label="การแจ้งเตือน">${icon("bell")}</button></div>
      <div class="welcome-block">
        <small>สวัสดีตอนบ่าย</small><strong>คุณมิ้นท์</strong>
        <div class="balance-card"><div><p>บัญชีของฉัน</p><small>xxx-x-x2560-x</small></div><button type="button" aria-label="แสดงยอดเงิน">${icon("eye")} ดูยอดเงิน</button><b>฿12,480.00</b></div>
      </div>
      <div class="quick-grid">
        <button class="quick-item text-button" data-go="transfer"><span class="quick-icon">${icon("transfer")}</span>โอนเงิน</button>
        <span class="quick-item"><span class="quick-icon">${icon("phone")}</span>เติมเงิน</span>
        <span class="quick-item"><span class="quick-icon">${icon("receipt")}</span>จ่ายบิล</span>
        <span class="quick-item"><span class="quick-icon">${icon("scan")}</span>ถอนเงิน</span>
      </div>
      <div class="scam-banner">
        <span class="shield-badge">${icon("shield")}</span>
        <div><span class="feature-label">BRAKE • ความปลอดภัย</span><strong>สงสัยว่ากำลังถูกหลอก?</strong><p>หยุดเงินออกชั่วคราวและเริ่มแจ้งเหตุได้ทันที</p><button class="mini-button" type="button" data-go="hold">ฉันอาจถูกหลอก</button></div>
      </div>
      ${nav()}
    </div>`,

  transfer: () => `
    <div class="screen-slide">
      ${header("ตรวจสอบการโอน", "home", "lock")}
      <div class="screen-body">
        <div class="transfer-card">
          <p class="section-kicker">โอนไปยัง</p>
          <div class="recipient"><span class="bank-avatar">ก</span><div><strong>กิตติภัทร พ.</strong><small>xxx-x-x6789-x • ธนาคารตัวอย่าง</small></div></div>
          <div class="amount-block"><small>จำนวนเงิน</small><strong>3,000.00 <span>บาท</span></strong></div>
          <div class="detail-row"><span>จากบัญชี</span><b>xxx-x-x2560-x</b></div>
          <div class="detail-row"><span>ค่าธรรมเนียม</span><b>0.00 บาท</b></div>
          <div class="detail-row"><span>บันทึกช่วยจำ</span><b>ปลดล็อกงาน</b></div>
          <div class="prior-event">${icon("info")}<span>คุณได้รับเงิน <b>150 บาท</b> จากบัญชีนี้เมื่อ 2 ชม. ก่อน</span></div>
        </div>
        <div class="screen-actions">
          <button class="primary-button" type="button" data-go="risk">ยืนยันการโอน</button>
          <button class="text-button" type="button" data-go="home">ยกเลิกรายการ</button>
        </div>
      </div>
    </div>`,

  risk: () => `
    <div class="screen-slide">
      ${header("BRAKE กำลังช่วยตรวจสอบ", "transfer", "shield")}
      <div class="screen-body">
        <div class="risk-hero">
          <span class="risk-icon">${icon("shield")}</span>
          <h3>รายการนี้มีสัญญาณ<br />คล้ายการหลอกให้ทำงาน</h3>
          <p>ไม่ได้แปลว่าผู้รับเป็นมิจฉาชีพ</p>
          <div class="risk-score">RISK CONTEXT • HIGH</div>
        </div>
        <div class="signal-list">
          <div class="signal"><span class="signal-icon">${icon("user")}</span><div><strong>ผู้รับรายใหม่</strong><small>ยังไม่เคยโอนหากันมาก่อน</small></div><b>NEW</b></div>
          <div class="signal"><span class="signal-icon amber">${icon("transfer")}</span><div><strong>ยอดโอนเพิ่มขึ้น 20 เท่า</strong><small>เทียบกับเงินที่เพิ่งได้รับ</small></div><b>20×</b></div>
          <div class="signal"><span class="signal-icon">${icon("phone")}</span><div><strong>มีสายสนทนาค้างอยู่</strong><small>อาจกำลังถูกเร่งให้ตัดสินใจ</small></div><b>LIVE</b></div>
        </div>
        <p class="privacy-note">${icon("lock")}<span>BRAKE วิเคราะห์เฉพาะบริบทธุรกรรม ไม่อ่านข้อความหรือฟังสายของคุณ</span></p>
        <div class="screen-actions">
          <button class="primary-button" type="button" data-go="question">เช็กตัวเอง 1 คำถาม</button>
          <button class="text-button" type="button" data-go="transfer">กลับไปตรวจสอบรายการ</button>
        </div>
      </div>
    </div>`,

  question: () => `
    <div class="screen-slide">
      ${header("หยุดคิดก่อนโอน", "risk", "help")}
      <div class="screen-body">
        <div class="question-progress"><span class="active"></span><span></span><span></span></div>
        <div class="question-card">
          <span class="question-shield">${icon("shield")}</span>
          <div class="eyebrow">คำถามสั้น ๆ เพื่อความปลอดภัย</div>
          <h3>มีคนบอกว่าจะได้เงินคืน<br />พร้อมกำไรไหม?</h3>
          <p>เช่น “โอนเพื่อปลดล็อกงาน” หรือ “เติมก่อนแล้วถอนทีหลัง”</p>
        </div>
        <div class="answer-grid">
          <button class="answer-button yes" type="button" data-go="hold"><span>${icon("check")}</span><div><strong>ใช่ มีคนบอกแบบนั้น</strong><small>ระบบจะพักรายการเพื่อช่วยคุณตรวจสอบ</small></div></button>
          <button class="answer-button no" type="button" data-go="safe-confirm"><span>${icon("x")}</span><div><strong>ไม่ใช่</strong><small>ดูคำเตือนอีกครั้งก่อนโอนต่อ</small></div></button>
        </div>
        <button class="text-button" type="button" data-go="transfer">ฉันขอยกเลิกรายการนี้</button>
      </div>
    </div>`,

  "safe-confirm": () => `
    <div class="screen-slide">
      ${header("ยืนยันความตั้งใจ", "question", "shield")}
      <div class="screen-body">
        <div class="question-card">
          <span class="question-shield">${icon("eye")}</span>
          <div class="eyebrow">ตรวจอีกครั้ง</div>
          <h3>คุณรู้จักผู้รับ<br />นอกช่องทางออนไลน์ใช่ไหม?</h3>
          <p>หากเพิ่งรู้จักและถูกเร่งให้โอน การหยุดไว้ตอนนี้ปลอดภัยที่สุด</p>
        </div>
        <div class="screen-actions">
          <button class="danger-button" type="button" data-go="hold">ไม่แน่ใจ — พักรายการก่อน</button>
          <button class="secondary-button" type="button" data-action="demo-transfer">รู้จักและต้องการโอนต่อ</button>
          <button class="text-button" type="button" data-go="transfer">ยกเลิกรายการ</button>
        </div>
      </div>
    </div>`,

  hold: () => `
    <div class="screen-slide">
      ${header("พักรายการโอน", "question", "pause")}
      <div class="screen-body hold-body">
        <div class="hold-hero">
          <span class="hold-icon">${icon("pause")}</span>
          <h3>หยุดสักนิด เงินยังไม่ออก</h3>
          <p>พักรายการเพื่อให้คุณมีเวลาตัดสินใจ</p>
        </div>
        <div class="countdown-wrap">
          <svg class="countdown-ring" viewBox="0 0 120 120" aria-hidden="true"><circle class="ring-bg" cx="60" cy="60" r="52"/><circle class="ring-value" id="ring-value" cx="60" cy="60" r="52"/></svg>
          <div class="countdown-text"><strong id="countdown">00:45</strong><small>เวลาตัดสินใจ</small></div>
        </div>
        <div class="demo-speed">เดโมย่อเวลา 45 วินาทีให้เหลือ 9 วินาที</div>
        <div class="hold-options">
          <button class="hold-option" type="button" data-action="trusted"><span>${icon("people")}</span><div><strong>ส่งให้คนที่ไว้ใจช่วยดู</strong><small>ไม่เปิดเผยยอดเงินและชื่อผู้รับ</small></div>${icon("arrow","arrow")}</button>
          <button class="hold-option" type="button" data-action="call"><span>${icon("phone")}</span><div><strong>โทร AOC 1441</strong><small>ศูนย์รับแจ้งเหตุภัยการเงิน</small></div>${icon("arrow","arrow")}</button>
        </div>
        <button class="danger-button hold-danger" type="button" data-go="freeze">ฉันอาจถูกหลอก — หยุดเงินทันที</button>
        <button class="text-button" type="button" data-action="wait-finish">รอให้ครบเวลา</button>
      </div>
    </div>`,

  freeze: () => `
    <div class="screen-slide">
      ${header("โหมดฉุกเฉิน", "hold", "lock")}
      <div class="screen-body">
        <div class="success-top">
          <span class="success-check">${icon("shield")}</span>
          <h3>หยุดเงินออกแล้ว</h3>
          <p>บัญชีของคุณอยู่ในโหมดป้องกันชั่วคราว</p>
        </div>
        <div class="protected-amount"><small>เงินที่ BRAKE ช่วยปกป้องครั้งนี้</small><strong>฿3,000.00</strong></div>
        <div class="action-summary">
          <div class="summary-row"><span>${icon("check")}</span><div><strong>ยกเลิกรายการโอน</strong><small>เงินยังอยู่ในบัญชีของคุณ</small></div></div>
          <div class="summary-row"><span>${icon("check")}</span><div><strong>ระงับธุรกรรมออนไลน์ชั่วคราว</strong><small>ปลดล็อกได้หลังยืนยันตัวตน</small></div></div>
          <div class="summary-row"><span>${icon("check")}</span><div><strong>เตรียมข้อมูลสำหรับ AOC 1441</strong><small>ลดเวลาการแจ้งเหตุ</small></div></div>
        </div>
        <div class="case-number"><div><small>หมายเลขเคส</small><strong>BR-2026-00128</strong></div><button class="copy-button" type="button" data-action="copy" aria-label="คัดลอกหมายเลขเคส">${icon("copy")}</button></div>
        <div class="screen-actions"><button class="primary-button" type="button" data-go="case">ติดตามเคสและเพิ่มหลักฐาน</button></div>
      </div>
    </div>`,

  case: () => `
    <div class="screen-slide">
      ${header("ติดตามเรื่อง", "freeze", "file")}
      <div class="screen-body">
        <div class="case-status">
          <div class="case-status-head"><span class="status-shield">${icon("shield")}</span><div><small>รับแจ้งเหตุแล้ว</small><strong>BR-2026-00128</strong></div><span class="status-tag">กำลังตรวจสอบ</span></div>
          <div class="case-amount-row"><span>รายการที่ระงับ</span><b>฿3,000.00</b></div>
        </div>
        <div class="timeline" aria-label="สถานะเคส">
          <div class="timeline-item"><span class="timeline-marker">${icon("check")}</span><div class="timeline-copy"><strong>ธนาคารรับเรื่องแล้ว</strong><small>วันนี้ 10:26 น.</small></div></div>
          <div class="timeline-item"><span class="timeline-marker">${icon("check")}</span><div class="timeline-copy"><strong>ระงับช่องทางเสี่ยงแล้ว</strong><small>รายการโอนถูกยกเลิก</small></div></div>
          <div class="timeline-item pending"><span class="timeline-marker"></span><div class="timeline-copy"><strong>ประสาน AOC 1441</strong><small>ระบบเตรียมข้อมูลสำหรับเจ้าหน้าที่</small></div></div>
        </div>
        <div class="evidence-box">
          <div class="evidence-title">${icon("file")}เพิ่มหลักฐานให้เคส</div>
          <div class="evidence-actions"><button class="evidence-button" type="button" data-action="upload">${icon("plus")} สลิป/แชต</button><button class="evidence-button" type="button" data-action="upload">${icon("plus")} ภาพหน้าจอ</button></div>
        </div>
        <div class="final-message"><strong>คุณตัดสินใจได้ทันเวลา</strong><br />BRAKE ช่วยคืน “ช่วงหยุดคิด” ก่อนเงินออก — โดยบอกเหตุผลทุกครั้ง</div>
        <div class="screen-actions"><button class="primary-button" type="button" data-action="restart">จบเดโมและเริ่มใหม่</button></div>
      </div>
    </div>`
};

const screenMeta = {
  home: { stage: 0, caption: "เลือก “โอนเงิน” เพื่อเริ่มเคสตัวอย่าง" },
  transfer: { stage: 0, caption: "กดยืนยันเพื่อเริ่มการจำลอง" },
  risk: { stage: 1, caption: "BRAKE บอกเหตุผล ไม่ตัดสินแบบกล่องดำ" },
  question: { stage: 2, caption: "ตอบตามสถานการณ์ของมิ้นท์" },
  "safe-confirm": { stage: 2, caption: "เส้นทางสำรองยังคงให้ผู้ใช้ควบคุม" },
  hold: { stage: 3, caption: "ช่วงหยุดคิด 45 วินาที เงินยังไม่ออก" },
  freeze: { stage: 3, caption: "หยุดช่องทางเสี่ยงและสร้างเคสในครั้งเดียว" },
  case: { stage: 4, caption: "ติดตามสถานะและรวบรวมหลักฐานได้ทันที" }
};

function render(name) {
  if (!templates[name]) return;
  stopTimer();
  currentScreen = name;
  screen.innerHTML = templates[name]();
  const meta = screenMeta[name];
  caption.textContent = meta.caption;
  stageCount.textContent = `${meta.stage + 1} / 5`;
  stageItems.forEach((item, index) => {
    item.classList.toggle("active", index === meta.stage);
    item.classList.toggle("done", index < meta.stage);
  });
  if (name === "hold") startCountdown();
  document.querySelector("#phone").classList.remove("pulse");
  window.history.replaceState(null, "", `#${name}`);
  feedbackTone();
}

function startCountdown() {
  let displaySeconds = 45;
  const totalTicks = 9;
  let ticks = 0;
  const circumference = 2 * Math.PI * 52;
  const ring = document.querySelector("#ring-value");
  ring.style.strokeDasharray = `${circumference}`;
  ring.style.strokeDashoffset = "0";
  timerId = window.setInterval(() => {
    ticks += 1;
    displaySeconds = Math.max(0, 45 - ticks * 5);
    const counter = document.querySelector("#countdown");
    if (counter) counter.textContent = `00:${String(displaySeconds).padStart(2, "0")}`;
    if (ring) ring.style.strokeDashoffset = `${circumference * (ticks / totalTicks)}`;
    if (ticks >= totalTicks) {
      stopTimer();
      showToast("หมดเวลาพัก รายการถูกยกเลิกเพื่อความปลอดภัย");
      window.setTimeout(() => render("freeze"), 450);
    }
  }, 1000);
}

function stopTimer() {
  if (timerId) window.clearInterval(timerId);
  timerId = null;
}

function showToast(message) {
  toast.querySelector("span").textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function feedbackTone() {
  if (!audioEnabled || !window.AudioContext) return;
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.frequency.value = 520;
  gain.gain.setValueAtTime(0.025, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.08);
}

screen.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const destination = button.dataset.go;
  if (destination) {
    render(destination);
    return;
  }
  const action = button.dataset.action;
  if (action === "trusted") showToast("ส่งสัญญาณให้ “พี่เมย์” แล้ว — ไม่เปิดเผยยอดเงิน");
  if (action === "call") showToast("เดโม: กำลังเชื่อมต่อ AOC 1441");
  if (action === "wait-finish") showToast("กำลังรอ… คุณยังหยุดเงินได้ทุกเมื่อ");
  if (action === "demo-transfer") {
    showToast("โหมดเดโมไม่ทำธุรกรรมจริง");
    window.setTimeout(() => render("transfer"), 550);
  }
  if (action === "upload") showToast("เพิ่มไฟล์ตัวอย่างเข้าเคสแล้ว");
  if (action === "restart") render("transfer");
  if (action === "copy") {
    try { await navigator.clipboard.writeText("BR-2026-00128"); } catch { /* Clipboard may be unavailable on file:// */ }
    showToast("คัดลอกหมายเลขเคสแล้ว");
  }
});

soundToggle.addEventListener("click", () => {
  audioEnabled = !audioEnabled;
  soundToggle.setAttribute("aria-pressed", String(audioEnabled));
  showToast(audioEnabled ? "เปิดเสียงตอบรับแล้ว" : "ปิดเสียงตอบรับแล้ว");
  feedbackTone();
});

document.querySelector("#restart-footer").addEventListener("click", () => render("transfer"));

const initialScreen = window.location.hash.slice(1);
render(templates[initialScreen] ? initialScreen : "transfer");
