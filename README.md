# BRAKE — Interactive Scam Shield Demo

เดโมแบบโต้ตอบสำหรับแนวคิด **BRAKE: เบรกก่อนโอน** ระบบที่ตรวจจับสัญญาณความเสี่ยงจากบริบทธุรกรรมของผู้ใช้ อธิบายเหตุผล และสร้างช่วงหยุดคิดก่อนเงินออกจากบัญชี

Visual direction follows public K PLUS interaction patterns: a deep-green account header, four primary banking shortcuts, compact white cards, high-contrast green actions, and a five-item bottom navigation. This remains an independent concept prototype and is not an official KBank product.

## Demo flow

1. ตรวจสอบรายการโอน ฿3,000 ไปยังผู้รับรายใหม่
2. ดูสัญญาณความเสี่ยงที่อธิบายได้
3. ตอบคำถามสั้น ๆ เพื่อทบทวนการตัดสินใจ
4. พักรายการ 45 วินาทีและเลือกขอความช่วยเหลือ
5. เปิดโหมดฉุกเฉินและติดตามเคสพร้อมหลักฐาน

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
