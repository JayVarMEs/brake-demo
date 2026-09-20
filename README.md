# BRAKE — Interactive Scam Shield Demo

เดโมแบบโต้ตอบสำหรับแนวคิด **BRAKE: เบรกก่อนโอน** ระบบที่ตรวจจับสัญญาณความเสี่ยงจากบริบทธุรกรรมของผู้ใช้ อธิบายเหตุผล และสร้างช่วงหยุดคิดก่อนเงินออกจากบัญชี

Visual direction recreates the supplied legacy K PLUS dashboard reference: a dark charcoal account surface, circular available-balance display, mint-outlined banking shortcuts, and a raised transfer action in the five-item bottom navigation. This remains an independent concept prototype and is not an official KBank product.

## Demo flow

1. กรอกรายละเอียดการโอน ฿3,000 ไปยังผู้รับรายใหม่
2. ตรวจสอบข้อมูลและอ่านคำเตือนที่อธิบายสัญญาณเฉพาะรายการ
3. ดูการวิเคราะห์ความเสี่ยงของ BRAKE หลังเลือกยืนยัน
4. ตอบคำถามสั้น ๆ เพื่อทบทวนการตัดสินใจ
5. พักรายการ 45 วินาทีและเลือกขอความช่วยเหลือ
6. เลือกเส้นทางตามสถานการณ์:
   - หากเสี่ยง: เปิดโหมดฉุกเฉินและติดตามเคสพร้อมหลักฐาน
   - หากยืนยันว่าไม่เสี่ยง: โอนสำเร็จและรับสลิป
   - หากพบภายหลังว่าถูกหลอก: เริ่มแจ้งเหตุจากสลิปและติดตามการระงับเงินปลายทาง

## Run locally

This is a dependency-free static site. Open `index.html` directly, or serve the folder:

```bash
npx serve .
```

## Notes

- Prototype only; no real banking transaction takes place.
- Fully responsive down to 320px.
- Keyboard focus and reduced-motion preferences are supported.
- Designed for static hosting on GitHub Pages.
