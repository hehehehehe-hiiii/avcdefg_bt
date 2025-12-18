# คู่มือการติดตั้งและใช้งาน

## 📦 Dependencies ที่ต้องติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
npm install
```

หรือ

```bash
yarn install
```

### 2. Dependencies ที่จะถูกติดตั้ง

- **next** - Next.js framework
- **react** & **react-dom** - React library
- **axios** - HTTP client
- **@vercel/postgres** - Vercel Postgres database client
- **bcryptjs** - Password hashing
- **zod** - Schema validation
- **tailwindcss** - CSS framework
- **typescript** - TypeScript support

## 🗄️ การตั้งค่า Vercel Postgres

### วิธีที่ 1: ใช้ Vercel Dashboard

1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือกโปรเจกต์ของคุณ
3. ไปที่ **Storage** > **Create Database** > **Postgres**
4. Copy **Connection String** (POSTGRES_URL)
5. เพิ่มในไฟล์ `.env`:

```env
POSTGRES_URL="postgres://user:password@host:5432/database"
```

### วิธีที่ 2: ใช้ Environment Variables ใน Vercel

1. ไปที่ Vercel Dashboard > Settings > Environment Variables
2. เพิ่ม `POSTGRES_URL` ด้วยค่า Connection String

### วิธีที่ 3: ใช้ Postgres ภายนอก

ถ้าใช้ Postgres ภายนอก (เช่น Supabase, Neon, etc.):

```env
POSTGRES_URL="postgresql://user:password@host:5432/database"
```

## 🚀 การรันโปรเจกต์

### Development

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 📝 ไฟล์ที่ต้องสร้าง

### 1. สร้างไฟล์ `.env`

```bash
cp .env.example .env
```

แล้วแก้ไขค่า `POSTGRES_URL`

### 2. Database จะถูกสร้างอัตโนมัติ

เมื่อมีการ register หรือ login ครั้งแรก ระบบจะสร้างตาราง `users` อัตโนมัติ

## ✅ ตรวจสอบการติดตั้ง

1. รัน `npm run dev`
2. เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`
3. ควรเห็น Loading Screen
4. ถูก redirect ไปหน้า Login
5. สมัครสมาชิกใหม่
6. Login และดู Groups

## 🐛 Troubleshooting

### ปัญหา: Cannot find module '@vercel/postgres'

**วิธีแก้:**
```bash
npm install @vercel/postgres
```

### ปัญหา: Database connection error

**วิธีแก้:**
1. ตรวจสอบว่า `POSTGRES_URL` ถูกตั้งค่าใน `.env`
2. ตรวจสอบว่า Connection String ถูกต้อง
3. ตรวจสอบว่า Database ถูกสร้างแล้วใน Vercel

### ปัญหา: Font Kanit ไม่แสดง

**วิธีแก้:**
- Font Kanit จะถูกโหลดจาก Google Fonts อัตโนมัติ
- ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต

## 📚 เอกสารเพิ่มเติม

- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

