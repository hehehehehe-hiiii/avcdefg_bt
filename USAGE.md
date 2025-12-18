# วิธีใช้งาน Facebook Next.js Application

## 🚀 Quick Start

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Config

ตรวจสอบว่าไฟล์ `config.json` มีข้อมูลครบถ้วน:

```json
{
  "cookie": "your-facebook-cookie-here",
  "access_token": "your-facebook-access-token-here"
}
```

### 3. รัน Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่: **http://localhost:3000**

## 📂 โครงสร้างไฟล์

### ไฟล์สำคัญ

- `app/page.tsx` - หน้าแรก (แปลงจาก index.html)
- `app/layout.tsx` - Root layout
- `app/globals.css` - Global styles และ Tailwind CSS
- `app/api/groups/route.ts` - API endpoint สำหรับดึง groups
- `config.json` - Facebook API credentials

### Public Directory

สร้างโฟลเดอร์ `public/files/` สำหรับเก็บไฟล์ที่ต้องการให้ดาวน์โหลด:

```
public/
  └── files/
      ├── Mimimi.rar
      ├── Portfolio.rar
      └── BotPython.rar
```

## 🔧 การใช้งาน API

### ดึง Facebook Groups

เรียกใช้ API endpoint:

```bash
# ดึงทั้งหมด
curl http://localhost:3000/api/groups

# ดึงจำกัดจำนวน
curl http://localhost:3000/api/groups?limit=50
```

หรือใช้ในโค้ด:

```typescript
const response = await fetch('/api/groups?limit=50')
const data = await response.json()
console.log(data.groups)
```

## 🎨 การปรับแต่ง UI

### เปลี่ยนสี Theme

แก้ไขไฟล์ `tailwind.config.js`:

```javascript
colors: {
  bg: '#050505',        // Background color
  gold: '#D4C5A5',      // Gold accent color
  goldDim: 'rgba(212, 197, 165, 0.1)'
}
```

### เพิ่มไฟล์ใหม่ในหน้า Download

แก้ไขไฟล์ `app/page.tsx` และเพิ่ม Card ใหม่:

```tsx
<div
  onClick={() => openModal('ชื่อไฟล์', 'ประเภท', 'ชื่อไฟล์.rar', 'ขนาด')}
  className="group glass-panel rounded-2xl p-4 cursor-pointer..."
>
  {/* Card content */}
</div>
```

## 📦 Build สำหรับ Production

```bash
# สร้าง production build
npm run build

# รัน production server
npm start
```

## 🔍 Troubleshooting

### ปัญหา: GSAP animations ไม่ทำงาน

**วิธีแก้:** ตรวจสอบว่า GSAP script ถูกโหลดใน `app/layout.tsx`

### ปัญหา: ไฟล์ดาวน์โหลดไม่เจอ

**วิธีแก้:** 
1. ตรวจสอบว่าไฟล์อยู่ใน `public/files/`
2. ตรวจสอบ path ในฟังก์ชัน `downloadRealFile()`

### ปัญหา: API ไม่ทำงาน

**วิธีแก้:**
1. ตรวจสอบ `config.json` ว่ามีข้อมูลครบ
2. ตรวจสอบ console logs
3. ตรวจสอบว่า access_token ยังใช้งานได้

## 📝 หมายเหตุ

- ไฟล์ `index.html` เดิมยังคงอยู่เพื่อเป็น reference
- ไฟล์ `facebook-bot.js` และ `get-groups.js` ถูกแปลงเป็น API routes แล้ว
- Tailwind CSS 3.4.14 ถูกตั้งค่าไว้แล้ว

