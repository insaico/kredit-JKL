# 🚗 Sistem Kredit Kendaraan PT. JKL

Sistem digital untuk mengelola pengajuan kredit kendaraan dengan workflow approval bertingkat.

## 📋 Deskripsi

Aplikasi web full-stack yang memungkinkan konsumen untuk mengajukan kredit kendaraan secara online dan tim internal (Marketing & Atasan Marketing) untuk mengelola proses approval secara digital. Sistem ini mengimplementasikan **Soal 2.b** dari requirement: fokus pada **Input Pengajuan & Approval**.

## 🎯 Fitur Utama

### 1. **Authentication & Authorization (JWT)**
- Login dengan username & password
- Register dengan role selection
- Token-based authentication
- Role-based access control

### 2. **Multi-Role System**
- **Konsumen**: Submit pengajuan kredit, tracking status
- **Marketing**: Review aplikasi masuk
- **Atasan Marketing**: Approve/Reject aplikasi
- **Admin Backoffice**: View semua data

### 3. **Form Pengajuan Kredit (Digitalisasi Step 3-4)**
Konsumen dapat mengisi data lengkap:
- **Data Konsumen**: Nama, NIK, Tanggal Lahir, Status Perkawinan, Data Pasangan
- **Data Kendaraan**: Dealer, Merk, Model, Tipe, Warna, Harga
- **Data Pinjaman**: Asuransi, Down Payment, Lama Kredit, Angsuran/Bulan

### 4. **Approval Workflow (Digitalisasi Step 5)**
- Marketing: Review aplikasi → status "under_review"
- Atasan Marketing: Approve/Reject → status "approved"/"rejected"
- Notes & timestamp untuk audit trail

### 5. **Dashboard & Statistics**
- Real-time stats: Total, Pending, Under Review, Approved, Rejected
- Role-based filtering
- Application history

## 🏗️ Teknologi

### Frontend
- **Next.js 14** (App Router)
- **Shadcn UI** + **Tailwind CSS**
- **React Hook Form** + **Zod**
- JWT token management

### Backend
- **Next.js API Routes**
- **MongoDB** (Database)
- **JWT** (Authentication)
- **bcryptjs** (Password hashing)

## 📂 Struktur Database

### Collection: `users`
```javascript
{
  _id: UUID,
  username: String,
  password: String (hashed),
  name: String,
  email: String,
  role: 'konsumen' | 'marketing' | 'atasan_marketing' | 'admin_backoffice',
  createdAt: Date
}
```

### Collection: `applications`
```javascript
{
  _id: UUID,
  userId: UUID,
  // Data Konsumen
  nama: String,
  nik: String,
  tanggalLahir: Date,
  statusPerkawinan: String,
  dataPasangan: String,
  // Data Kendaraan
  dealer: String,
  merkKendaraan: String,
  modelKendaraan: String,
  tipeKendaraan: String,
  warnaKendaraan: String,
  hargaKendaraan: Number,
  // Data Pinjaman
  asuransi: String,
  downPayment: Number,
  lamaKredit: Number,
  angsuranPerBulan: Number,
  // Status & Approval
  status: 'pending' | 'under_review' | 'approved' | 'rejected',
  reviewedBy: UUID,
  approvedBy: UUID,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/profile` - Get user profile

### Applications
- `POST /api/applications` - Submit pengajuan (Konsumen)
- `GET /api/applications` - Get all applications (role-based)
- `GET /api/applications/:id` - Get single application
- `PUT /api/applications/:id/status` - Update status (Marketing/Atasan)

### Statistics
- `GET /api/stats` - Get statistics (role-based)

## 💻 Development

### Prerequisites
- Node.js 18+
- MongoDB
- Yarn

### Installation
```bash
# Install dependencies
yarn install

# Set environment variables
cp .env.example .env

# Start development server
yarn dev
```

### Environment Variables
```env
MONGO_URL=mongodb://localhost:27017/jkl_kredit
JWT_SECRET=your-secret-key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 👥 Test Accounts

Untuk testing, Anda dapat membuat user dengan role berikut:

**Konsumen**
```bash
Username: konsumen1
Password: password123
```

**Marketing**
```bash
Username: marketing1
Password: password123
```

**Atasan Marketing**
```bash
Username: atasan1
Password: password123
```

## 🔄 Workflow Pengajuan

```
1. Konsumen submit aplikasi → Status: "pending"
2. Marketing review → Status: "under_review"
3. Atasan Marketing approve/reject → Status: "approved"/"rejected"
```

## ✨ Improvement dari Proses Manual

### Before (Manual)
- ❌ Marketing harus collect data fisik dari konsumen
- ❌ Approval manual dengan dokumen fisik
- ❌ Tidak ada tracking status real-time
- ❌ Dokumen bisa hilang/rusak

### After (Digital)
- ✅ Konsumen input data sendiri via web
- ✅ Approval workflow digital dengan 1-click
- ✅ Real-time status tracking
- ✅ Data tersimpan aman di database
- ✅ Audit trail lengkap (timestamp, notes)

## 📊 Features Completed

✅ **Input Pengajuan (Step 3-4 - Digitalized)**
- Form online lengkap untuk konsumen
- Validation & error handling
- Auto-submit ke database

✅ **Approval Process (Step 5 - Digitalized)**
- Marketing review workflow
- Atasan approval workflow
- Status updates dengan notes

✅ **Authentication & Authorization**
- JWT-based security
- Role-based access control
- Password hashing

✅ **Dashboard & Statistics**
- Real-time metrics
- Role-based views
- Application history

## 🔮 Future Enhancement

Fitur yang bisa ditambahkan di versi berikutnya:

1. **Upload Dokumen (Step 7-8)**
   - Upload KTP, SPK, Bukti Bayar, Kartu Keluarga
   - File validation & storage
   - Document preview

2. **E-Signature Integration**
   - Digital signature untuk kontrak
   - Eliminasi TTD fisik

3. **Email/SMS Notifications**
   - Notifikasi perubahan status
   - Reminder untuk approval

4. **Export & Reporting**
   - Export ke Excel/PDF
   - Analytics & insights

5. **Credit Scoring**
   - Automatic credit check
   - Risk assessment

## 📝 Notes

- Fitur upload dokumen saat ini dalam development (noted di UI)
- Database menggunakan UUID sebagai primary key (bukan MongoDB ObjectID) untuk kemudahan serialisasi
- JWT token valid selama 7 hari
- Password di-hash menggunakan bcryptjs (10 salt rounds)

## 🎉 Conclusion

Sistem ini telah berhasil mendigitalisasi proses **Input Pengajuan** dan **Approval** sesuai requirement Soal 2.b, dengan fitur tambahan authentication, dashboard, dan statistics untuk meningkatkan user experience dan efisiensi operasional PT. JKL.

---

**Dibuat dengan ❤️ menggunakan Next.js, MongoDB, dan Shadcn UI**
