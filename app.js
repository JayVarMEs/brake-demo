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
    <button class="nav-item active" type="button" data-go="home">${icon("home")}<span>Home</span></button>
    <button class="nav-item" type="button" data-action="market">${icon("basket")}<span>K+ Market</span></button>
    <button class="nav-item nav-transfer" type="button" data-go="transfer"><span class="nav-transfer-icon">฿</span><span>Transfer</span></button>
    <button class="nav-item" type="button" data-action="finance">${icon("receipt")}<span>Finance</span></button>
    <button class="nav-item" type="button" data-action="more">${icon("more")}<span>More</span></button>
  </nav>`;

const templates = {
  home: () => `
    <div class="screen-slide kplus-home">
      <div class="kplus-dashboard">
        <div class="kplus-toolbar">
          <span class="profile-photo" aria-label="โปรไฟล์ของมิ้นท์">ม</span>
          <div class="kplus-wordmark" aria-label="K PLUS">K<span>+</span></div>
          <div class="kplus-toolbar-actions">
            <button type="button" aria-label="การแจ้งเตือน">${icon("bell")}<b>1</b></button>
            <button type="button" aria-label="ออกจากระบบ">${icon("power")}</button>
          </div>
        </div>
        <div class="account-identity"><strong>Mint Rakthai</strong><small>xxx-x-x2560-x</small></div>
        <div class="balance-orbit">
          <small>Available Bal.</small>
          <strong>12,480.00</strong>
          <button type="button" data-action="balance-settings" aria-label="ตั้งค่าการแสดงยอดเงิน">${icon("settings")}</button>
        </div>
        <div class="balance-update">${icon("refresh")} Updated at 3:43 PM</div>
        <div class="carousel-dots" aria-label="บัญชีที่ 1 จาก 5"><span class="active"></span><span></span><span></span><span></span><span></span></div>
        <div class="legacy-services" aria-label="บริการธนาคาร">
          <button class="legacy-service selected" type="button" data-go="transfer"><span>${icon("transfer")}</span><b>Transfer</b></button>
          <button class="legacy-service" type="button" data-action="topup"><span>${icon("download")}</span><b>Top-Up</b></button>
          <button class="legacy-service" type="button" data-action="payment"><span>${icon("barcode")}</span><b>Payment</b></button>
          <button class="legacy-service" type="button" data-action="withdraw"><span>${icon("wallet")}</span><b>Withdraw</b></button>
          <button class="legacy-service" type="button" data-action="statement"><span>${icon("receipt")}</span><b>Statement</b></button>
          <button class="legacy-service" type="button" data-action="loans"><span>${icon("loan")}</span><b>Loans</b></button>
          <button class="legacy-service" type="button" data-action="investment"><span>${icon("chart")}</span><b>Investment</b></button>
          <button class="legacy-service" type="button" data-action="services"><span>${icon("grid")}</span><b>Other<br />Services</b></button>
        </div>
      </div>
      ${nav()}
    </div>`,

  transfer: () => `
    <div class="screen-slide">
      ${header("โอนเงิน", "home", "transfer")}
      <div class="screen-body transfer-entry-body">
        <section class="source-panel" aria-label="บัญชีต้นทาง">
          <p>จาก:</p>
          <div class="source-account">
            <span class="account-symbol">${icon("user")}</span>
            <div><strong>บัญชีของฉัน</strong><small>xxx-x-x2560-x</small><b>12,480.00 บาท</b></div>
            <button type="button" data-action="change-account">เปลี่ยน ${icon("arrow")}</button>
          </div>
          <div class="source-update">${icon("refresh")} ข้อมูลล่าสุดเมื่อ 1 นาทีที่แล้ว</div>
          <div class="source-dots"><span class="active"></span><span></span></div>
        </section>
        <section class="transfer-form" aria-label="รายละเอียดการโอน">
          <div class="transfer-tabs"><button class="active" type="button">โอนทันที</button><button type="button" data-action="schedule">ตั้งโอนล่วงหน้า</button></div>
          <p class="form-heading">ไปยัง: บัญชีกสิกรไทย</p>
          <div class="destination-bank"><span class="bank-logo-leaf">${icon("leaf")}</span><strong>กสิกรไทย</strong></div>
          <label class="transfer-field"><span>เลขบัญชี</span><input type="text" value="xxx-x-x6789-x" readonly /></label>
          <label class="transfer-field amount-field"><span>จำนวน</span><input type="text" value="3,000.00 บาท" readonly /></label>
          <div class="slip-setting"><div><strong>ปรับแต่งภาพพื้นหลังสลิป</strong><small>เลือกพื้นหลังหรือการ์ดอวยพรในหน้าถัดไป</small></div><button type="button" role="switch" aria-checked="false" data-action="slip-toggle"><span></span></button></div>
          <div class="entry-actions">
            <button class="cancel-round" type="button" data-go="home">${icon("x")}<span>ยกเลิก</span></button>
            <button class="next-round" type="button" data-go="transfer-confirm"><span>ต่อไป</span>${icon("arrow")}</button>
          </div>
        </section>
      </div>
    </div>`,

  "transfer-confirm": () => `
    <div class="screen-slide">
      ${header("ตรวจสอบข้อมูล", "transfer", "lock")}
      <div class="screen-body confirm-transfer-body">
        <section class="confirm-overview" aria-label="สรุปรายการโอน">
          <div class="confirm-party source-party"><span class="account-symbol">${icon("user")}</span><div><small>จาก</small><strong>บัญชีของฉัน</strong><p>xxx-x-x2560-x</p></div></div>
          <div class="confirm-flow"><span></span><b>${icon("download")}</b></div>
          <div class="confirm-party"><span class="bank-logo-leaf">${icon("leaf")}</span><div><small>รายการโปรด</small><strong>กิตติภัทร พ.</strong><p>กสิกรไทย • xxx-x-x6789-x</p></div></div>
          <div class="confirm-totals">
            <div><span>จำนวน:</span><b>3,000.00 บาท</b></div>
            <div><span>ค่าธรรมเนียม:</span><b>0.00 บาท</b></div>
            <div><span>บันทึกช่วยจำ:</span><b>ปลดล็อกงาน</b></div>
          </div>
        </section>
        <section class="confirm-details">
          <div class="confirm-warning" role="note">
            <span>${icon("alert")}</span>
            <div><strong>ตรวจให้แน่ใจก่อนยืนยัน</strong><p>รายการนี้มีสัญญาณที่ควรทบทวน</p></div>
          </div>
          <ul class="warning-reasons">
            <li>${icon("user")}<span><b>ผู้รับรายใหม่</b> ยังไม่เคยโอนหากันมาก่อน</span></li>
            <li>${icon("transfer")}<span><b>ยอดโอนสูงขึ้น 20 เท่า</b> จากเงิน 150 บาทที่เพิ่งได้รับ</span></li>
            <li>${icon("file")}<span><b>บันทึกว่า “ปลดล็อกงาน”</b> เป็นคำที่พบบ่อยในกลโกงงานออนไลน์</span></li>
          </ul>
          <p class="warning-guidance">หากมีคนเร่งให้โอนเพื่อรับกำไร ถอนเงิน หรือปลดล็อกงาน ให้กดยกเลิกและตรวจสอบก่อน</p>
          <div class="category-row"><span>หมวดหมู่</span><button type="button" data-action="category">อื่น ๆ ${icon("arrow")}</button></div>
          <div class="confirm-actions">
            <button class="cancel-round" type="button" data-go="transfer">${icon("x")}<span>แก้ไข</span></button>
            <button class="confirm-round" type="button" data-go="risk"><span>ยืนยัน</span>${icon("check")}</button>
          </div>
        </section>
      </div>
    </div>`,

  risk: () => `
    <div class="screen-slide">
      ${header("BRAKE กำลังช่วยตรวจสอบ", "transfer-confirm", "shield")}
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
          <button class="text-button" type="button" data-go="transfer-confirm">กลับไปตรวจสอบรายการ</button>
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
          <button class="secondary-button" type="button" data-go="receipt">รู้จักและต้องการโอนต่อ</button>
          <button class="text-button" type="button" data-go="transfer">ยกเลิกรายการ</button>
        </div>
      </div>
    </div>`,

  receipt: () => `
    <div class="screen-slide">
      ${header("สลิปการโอนเงิน", "home", "receipt")}
      <div class="screen-body receipt-body">
        <div class="receipt-success">
          <span class="receipt-check">${icon("check")}</span>
          <h3>โอนเงินสำเร็จ</h3>
          <p>20 ก.ย. 2569 • 10:26 น.</p>
          <strong>฿3,000.00</strong>
        </div>
        <div class="receipt-card">
          <div class="receipt-brand"><span>K <b>PLUS</b></span><small>TRANSFER RECEIPT</small></div>
          <div class="receipt-route">
            <div><span class="receipt-avatar mint">ม</span><small>จาก</small><strong>มิ้นท์</strong><p>xxx-x-x2560-x</p></div>
            <span class="receipt-arrow">${icon("arrow")}</span>
            <div><span class="receipt-avatar red">ก</span><small>ไปยัง</small><strong>กิตติภัทร พ.</strong><p>xxx-x-x6789-x</p></div>
          </div>
          <div class="receipt-detail"><span>ค่าธรรมเนียม</span><b>0.00 บาท</b></div>
          <div class="receipt-detail"><span>บันทึกช่วยจำ</span><b>ปลดล็อกงาน</b></div>
          <div class="receipt-ref"><span>เลขที่รายการ</span><b>KB2609201026142</b></div>
        </div>
        <div class="receipt-tools" aria-label="ตัวเลือกสลิป">
          <button type="button" data-action="save-slip">${icon("download")}<span>บันทึกสลิป</span></button>
          <button type="button" data-action="share-slip">${icon("share")}<span>แชร์สลิป</span></button>
        </div>
        <div class="recovery-entry">
          <span>${icon("alert")}</span>
          <div><strong>โอนไปแล้วและคิดว่าอาจถูกหลอก?</strong><p>รีบแจ้งเหตุ ยิ่งเร็ว ยิ่งมีโอกาสระงับเงินปลายทาง</p></div>
          <button class="report-button" type="button" data-go="report">ฉันถูกหลอก — แจ้งเหตุทันที</button>
        </div>
        <button class="text-button" type="button" data-go="home">กลับหน้าหลัก</button>
      </div>
    </div>`,

  report: () => `
    <div class="screen-slide">
      ${header("แจ้งเหตุเงินถูกโอนออก", "receipt", "shield")}
      <div class="screen-body report-body">
        <div class="report-hero">
          <span>${icon("alert")}</span>
          <div class="eyebrow">POST-TRANSFER RECOVERY</div>
          <h3>แจ้งเร็ว ช่วยระงับเงิน<br />ได้เร็วขึ้น</h3>
          <p>ระบบจะส่งข้อมูลธุรกรรมนี้ให้ธนาคารตรวจสอบและเตรียมข้อมูลสำหรับ AOC 1441</p>
        </div>
        <div class="selected-transaction">
          <div class="selected-head"><span>รายการที่ต้องการแจ้ง</span><b>โอนสำเร็จแล้ว</b></div>
          <div class="selected-main"><span class="bank-avatar small">ก</span><div><strong>กิตติภัทร พ.</strong><small>20 ก.ย. 2569 • 10:26 น.</small></div><b>−฿3,000</b></div>
          <div class="selected-ref">KB2609201026142</div>
        </div>
        <div class="report-steps">
          <div><span>1</span><p><strong>แจ้งธนาคารทันที</strong><small>ขอตรวจสอบและระงับบัญชีปลายทาง</small></p></div>
          <div><span>2</span><p><strong>สร้างเคสพร้อมหลักฐาน</strong><small>เพิ่มแชต เบอร์โทร และภาพหน้าจอภายหลังได้</small></p></div>
          <div><span>3</span><p><strong>ประสาน AOC 1441</strong><small>ติดตามทุกสถานะในหน้าเดียว</small></p></div>
        </div>
        <p class="report-note">${icon("info")} การแจ้งเหตุไม่รับประกันว่าจะได้เงินคืน แต่ช่วยให้เริ่มตรวจสอบได้เร็วที่สุด</p>
        <div class="screen-actions report-actions">
          <button class="danger-button" type="button" data-go="reported-case">แจ้งธนาคารและสร้างเคส</button>
          <button class="secondary-button" type="button" data-action="call">โทร AOC 1441</button>
        </div>
      </div>
    </div>`,

  "reported-case": () => `
    <div class="screen-slide">
      ${header("ติดตามการช่วยเหลือ", "report", "file")}
      <div class="screen-body">
        <div class="case-status recovery-case">
          <div class="case-status-head"><span class="status-shield">${icon("shield")}</span><div><small>รับแจ้งเหตุแล้ว</small><strong>BR-2026-00314</strong></div><span class="status-tag">เร่งตรวจสอบ</span></div>
          <div class="case-amount-row"><span>รายการที่โอนออกแล้ว</span><b>฿3,000.00</b></div>
        </div>
        <div class="urgent-banner">${icon("clock")}<div><strong>ส่งคำขอระงับเงินปลายทางแล้ว</strong><small>ธนาคารกำลังตรวจสอบเส้นทางเงิน</small></div></div>
        <div class="timeline" aria-label="สถานะเคสหลังโอน">
          <div class="timeline-item"><span class="timeline-marker">${icon("check")}</span><div class="timeline-copy"><strong>ธนาคารรับแจ้งเหตุแล้ว</strong><small>วันนี้ 10:28 น. • 2 นาทีหลังโอน</small></div></div>
          <div class="timeline-item"><span class="timeline-marker">${icon("check")}</span><div class="timeline-copy"><strong>ส่งข้อมูลธุรกรรมแล้ว</strong><small>ใช้เลขที่รายการจากสลิปโดยอัตโนมัติ</small></div></div>
          <div class="timeline-item pending"><span class="timeline-marker"></span><div class="timeline-copy"><strong>รอผลระงับบัญชีปลายทาง</strong><small>จะแจ้งเตือนทันทีเมื่อสถานะเปลี่ยน</small></div></div>
        </div>
        <div class="evidence-box">
          <div class="evidence-title">${icon("file")}เพิ่มหลักฐานเพื่อช่วยตรวจสอบ</div>
          <div class="evidence-actions"><button class="evidence-button" type="button" data-action="upload">${icon("plus")} แชต/เบอร์โทร</button><button class="evidence-button" type="button" data-action="upload">${icon("plus")} ภาพหน้าจอ</button></div>
        </div>
        <div class="final-message recovery-message"><strong>คุณแจ้งเหตุภายใน 2 นาที</strong><br />ติดตามผลจากธนาคารและ AOC 1441 ได้จากเคสนี้</div>
        <div class="screen-actions"><button class="primary-button" type="button" data-action="restart">จบเดโมและเริ่มใหม่</button></div>
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
  transfer: { stage: 0, caption: "กรอกรายละเอียด แล้วกด “ต่อไป” เพื่อตรวจสอบ" },
  "transfer-confirm": { stage: 0, caption: "ตรวจผู้รับ จำนวนเงิน และเหตุผลเตือนก่อนยืนยัน" },
  risk: { stage: 1, caption: "BRAKE บอกเหตุผล ไม่ตัดสินแบบกล่องดำ" },
  question: { stage: 2, caption: "ตอบตามสถานการณ์ของมิ้นท์" },
  "safe-confirm": { stage: 2, caption: "เส้นทางสำรองยังคงให้ผู้ใช้ควบคุม" },
  receipt: { stage: 4, caption: "สลิปสำเร็จยังเปิดทางให้แจ้งเหตุได้ทันที" },
  report: { stage: 4, caption: "เลือกธุรกรรมจากสลิป ไม่ต้องกรอกข้อมูลซ้ำ" },
  "reported-case": { stage: 4, caption: "เริ่มติดตามเงินที่โอนออกแล้วโดยไม่กล่าวอ้างว่าได้เงินคืน" },
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
  const finalStageTitle = stageItems[4].querySelector("strong");
  const finalStageDetail = stageItems[4].querySelector("small");
  if (name === "receipt") {
    finalStageTitle.textContent = "รับสลิป";
    finalStageDetail.textContent = "โอนสำเร็จและขอความช่วยเหลือได้";
  } else {
    finalStageTitle.textContent = "ติดตามเคส";
    finalStageDetail.textContent = "หลักฐานและสถานะในที่เดียว";
  }
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
  if (["market", "finance", "more", "topup", "payment", "withdraw", "statement", "loans", "investment", "services", "balance-settings", "change-account", "schedule", "category"].includes(action)) showToast("ฟังก์ชันนี้อยู่นอกขอบเขตเดโม BRAKE");
  if (action === "slip-toggle") {
    const isOn = button.getAttribute("aria-checked") === "true";
    button.setAttribute("aria-checked", String(!isOn));
    button.classList.toggle("on", !isOn);
    showToast(!isOn ? "เปิดพื้นหลังสลิปแล้ว" : "ปิดพื้นหลังสลิปแล้ว");
  }
  if (action === "wait-finish") showToast("กำลังรอ… คุณยังหยุดเงินได้ทุกเมื่อ");
  if (action === "save-slip") showToast("บันทึกสลิปตัวอย่างแล้ว");
  if (action === "share-slip") showToast("เปิดตัวเลือกแชร์สลิปแล้ว");
  if (action === "upload") showToast("เพิ่มไฟล์ตัวอย่างเข้าเคสแล้ว");
  if (action === "restart") render("home");
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

document.querySelector("#restart-footer").addEventListener("click", () => render("home"));

const initialScreen = window.location.hash.slice(1);
render(templates[initialScreen] ? initialScreen : "home");
