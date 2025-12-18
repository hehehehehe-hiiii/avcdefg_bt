# Facebook Next.js Application

โปรเจกต์นี้เป็นการแปลงจาก Node.js เป็น Next.js พร้อมใช้งาน Tailwind CSS 3.4.14 และระบบ Login Facebook แบบ Realtime

## 📋 สารบัญ

- [ความต้องการของระบบ](#ความต้องการของระบบ)
- [การติดตั้ง](#การติดตั้ง)
- [การตั้งค่า](#การตั้งค่า)
- [การใช้งาน](#การใช้งาน)
- [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
- [API Routes](#api-routes)
- [Features](#features)

## 🔧 ความต้องการของระบบ

- Node.js 18.0 หรือสูงกว่า
- npm หรือ yarn

## 📦 การติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
npm install
```

ดูรายละเอียดเพิ่มเติมใน [INSTALL.md](./INSTALL.md)

### 2. ตั้งค่า Vercel Postgres

สร้างไฟล์ `.env` และเพิ่ม:

```env
POSTGRES_URL="postgres://user:password@host:5432/database"
```

ดูวิธีหา Connection String ใน [INSTALL.md](./INSTALL.md)

### 3. รัน Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

### 4. Features ใหม่

- ✅ **Font Kanit** - ฟอนต์ภาษาไทยที่สวยงาม
- ✅ **Loading Screen** - หน้าจอโหลดก่อนเข้าสู่ระบบ
- ✅ **Register/Login** - ระบบสมัครสมาชิกและเข้าสู่ระบบ
- ✅ **Password Strength** - ตรวจสอบระดับความปลอดภัยของรหัสผ่าน
- ✅ **Terms of Service** - Popup ข้อกำหนดในการให้บริการ
- ✅ **Smooth Scrolling** - การเลื่อนหน้าจอที่ลื่นไหล
- ✅ **Vercel Postgres** - ฐานข้อมูลสำหรับเก็บข้อมูลผู้ใช้

## ⚙️ การตั้งค่า

### 1. Facebook Login

เมื่อเปิดเว็บครั้งแรก จะถูก redirect ไปหน้า Login:
- ใส่ **Facebook Cookie** ของคุณ
- ใส่ **Access Token** ของคุณ
- กดปุ่ม **Login**

ข้อมูลจะถูกบันทึกใน `config.json` อัตโนมัติ

### 2. วิธีหา Facebook Cookie และ Access Token

#### Facebook Cookie:
1. เปิด Facebook ในเบราว์เซอร์
2. กด F12 เพื่อเปิด Developer Tools
3. ไปที่แท็บ **Application** (Chrome) หรือ **Storage** (Firefox)
4. คลิก **Cookies** > `https://www.facebook.com`
5. Copy ค่า cookies ทั้งหมด (หรือใช้ extension เช่น "Cookie Editor")

#### Facebook Access Token:
1. ไปที่ [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. เลือก App ของคุณ
3. เลือก permissions: `user_groups`, `groups_access_member_info`
4. กด "Generate Access Token"
5. Copy Access Token

## 🚀 การใช้งาน

### 1. Login

1. เปิดเว็บ [http://localhost:3000](http://localhost:3000)
2. จะถูก redirect ไปหน้า `/login` อัตโนมัติ
3. ใส่ Facebook Cookie และ Access Token
4. กด Login

### 2. ดู Groups

หลังจาก Login สำเร็จ จะถูก redirect ไปหน้า `/groups`:
- แสดงรายชื่อ Groups ทั้งหมด
- อัปเดตอัตโนมัติทุก 30 วินาที (Realtime)
- แสดงจำนวนสมาชิก, Privacy type
- เรียงตามจำนวนสมาชิก (มากไปน้อย)

### 3. Features

- ✅ **Realtime Updates**: อัปเดต Groups อัตโนมัติทุก 30 วินาที
- ✅ **Auto Refresh**: กดปุ่ม Refresh เพื่อดึงข้อมูลใหม่
- ✅ **Logout**: ออกจากระบบและลบ authentication
- ✅ **Responsive Design**: ใช้งานได้ทั้ง Desktop และ Mobile
- ✅ **Beautiful UI**: ใช้ Tailwind CSS 3.4.14

## 📁 โครงสร้างโปรเจกต์

```
.
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── login/
│   │   │       └── route.ts          # Login API
│   │   ├── groups/
│   │   │   ├── route.ts              # Groups API (original)
│   │   │   └── realtime/
│   │   │       └── route.ts          # Realtime Groups API
│   │   └── facebook-bot/
│   │       └── route.ts              # Facebook Bot API
│   ├── groups/
│   │   └── page.tsx                  # หน้าแสดง Groups
│   ├── login/
│   │   └── page.tsx                  # หน้า Login
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # หน้าแรก (redirect)
├── lib/
│   ├── facebook-bot.ts               # Facebook Bot class
│   └── group-fetcher.ts              # Group Fetcher class
├── config.json                       # Facebook credentials (auto-generated)
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS configuration
└── package.json                      # Dependencies
```

## 🔌 API Routes

### 1. Login API

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "cookie": "your-facebook-cookie",
  "access_token": "your-facebook-access-token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful"
}
```

### 2. Groups API (Realtime)

**Endpoint:** `GET /api/groups/realtime?limit=100`

**Query Parameters:**
- `limit` (optional): จำนวน groups ที่ต้องการดึง

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-01-XX...",
  "total": 100,
  "groups": [...],
  "statistics": {
    "total": 100,
    "openGroups": 30,
    "closedGroups": 50,
    "secretGroups": 20,
    "totalMembers": 50000,
    "avgMembers": 500
  },
  "topGroups": [...]
}
```

## 🎨 Features

- ✅ Next.js 14 with App Router
- ✅ Tailwind CSS 3.4.14
- ✅ TypeScript support
- ✅ Facebook Graph API integration
- ✅ Realtime updates (polling every 30 seconds)
- ✅ Responsive design
- ✅ Modern UI with glassmorphism effects
- ✅ Authentication system
- ✅ Auto-redirect based on auth status

## 🔒 Security Notes

⚠️ **สำคัญ:** 
- ไฟล์ `config.json` ถูกเพิ่มใน `.gitignore` แล้ว
- อย่า commit ไฟล์ `config.json` เข้า Git repository
- Access Token และ Cookie ควรเก็บเป็นความลับ

## 📚 เอกสารเพิ่มเติม

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api)

## 🐛 Troubleshooting

### ปัญหา: ไม่สามารถ Login ได้

**วิธีแก้:** 
1. ตรวจสอบว่า Cookie และ Access Token ถูกต้อง
2. ตรวจสอบว่า Access Token มี permissions `user_groups`
3. ดู Console logs สำหรับ error messages

### ปัญหา: Groups ไม่แสดง

**วิธีแก้:**
1. ตรวจสอบว่า Login สำเร็จแล้ว
2. ตรวจสอบว่า Access Token ยังใช้งานได้
3. กดปุ่ม Refresh เพื่อดึงข้อมูลใหม่

### ปัญหา: Realtime updates ไม่ทำงาน

**วิธีแก้:**
1. ตรวจสอบว่า browser ไม่ได้ block polling requests
2. ตรวจสอบ Network tab ใน Developer Tools
3. ลองกด Refresh manual

## 📄 License

MIT

---

**หมายเหตุ:** ระบบจะอัปเดต Groups อัตโนมัติทุก 30 วินาที เพื่อให้ข้อมูลเป็นปัจจุบัน
