# 🔐 Test Credentials

## Test Accounts

Berikut adalah akun test yang sudah tersedia untuk mencoba aplikasi:

### 👤 Konsumen
```
Username: konsumen1
Password: password123
Role: konsumen
Name: Budi Santoso
Email: budi@email.com
```

**Fitur yang bisa diakses:**
- ✅ Submit pengajuan kredit kendaraan baru
- ✅ View semua pengajuan yang pernah dibuat
- ✅ Track status pengajuan (Pending, Under Review, Approved, Rejected)
- ✅ Lihat catatan dari Marketing/Atasan

---

### 👨‍💼 Marketing
```
Username: marketing1
Password: password123
Role: marketing
Name: Siti Nurhaliza
Email: siti@jkl.com
```

**Fitur yang bisa diakses:**
- ✅ View semua pengajuan dari konsumen
- ✅ Review aplikasi yang status "Pending"
- ✅ Update status ke "Under Review" dengan notes
- ✅ View statistics & dashboard

---

### 👔 Atasan Marketing (Supervisor)
```
Username: atasan1
Password: password123
Role: atasan_marketing
Name: Ahmad Supervisor
Email: ahmad@jkl.com
```

**Fitur yang bisa diakses:**
- ✅ View semua pengajuan
- ✅ Approve aplikasi yang status "Under Review"
- ✅ Reject aplikasi dengan alasan
- ✅ View statistics & dashboard
- ✅ Final decision maker

---

### 🏢 Admin Backoffice
```
Username: admin1
Password: password123
Role: admin_backoffice
```

**Fitur yang bisa diakses:**
- ✅ View semua pengajuan
- ✅ View statistics lengkap
- ✅ Export data (future feature)

---

## 🧪 Sample Test Data

### Aplikasi yang sudah ada:
1. **Budi Santoso - Honda Brio RS**
   - Status: Approved ✅
   - Harga: Rp 185.000.000
   - DP: Rp 50.000.000
   - Tenor: 36 bulan

2. **Budi Santoso - Toyota Avanza**
   - Status: Pending ⏳
   - Harga: Rp 245.000.000
   - DP: Rp 75.000.000
   - Tenor: 48 bulan

---

## 📝 Testing Workflow

### Scenario 1: Submit New Application (as Konsumen)
1. Login sebagai `konsumen1`
2. Klik tab "Ajukan Kredit"
3. Isi form lengkap:
   - Data Konsumen (Nama, NIK, Tanggal Lahir, Status Perkawinan)
   - Data Kendaraan (Dealer, Merk, Model, Harga)
   - Data Pinjaman (DP, Lama Kredit, Angsuran)
4. Click "Ajukan Kredit"
5. Lihat status di tab "Pengajuan Saya"

### Scenario 2: Review Application (as Marketing)
1. Logout dari konsumen
2. Login sebagai `marketing1`
3. Lihat list aplikasi yang status "Pending"
4. Click button "Review"
5. Masukkan notes (optional)
6. Status berubah menjadi "Under Review"

### Scenario 3: Approve Application (as Atasan)
1. Logout dari marketing
2. Login sebagai `atasan1`
3. Lihat list aplikasi yang status "Under Review"
4. Click button "Setujui" untuk approve
   - Atau "Tolak" untuk reject (harus masukkan alasan)
5. Status berubah menjadi "Approved" atau "Rejected"

### Scenario 4: Track Status (as Konsumen)
1. Login kembali sebagai `konsumen1`
2. Klik tab "Pengajuan Saya"
3. Lihat status terbaru dari aplikasi
4. Jika ada notes, akan terlihat di bagian catatan

---

## 🔍 API Testing dengan cURL

### Register New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "password123",
    "name": "New User",
    "email": "newuser@email.com",
    "role": "konsumen"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "konsumen1",
    "password": "password123"
  }'
```

### Submit Application
```bash
# Replace YOUR_TOKEN with token from login response
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nama": "Test User",
    "nik": "1234567890123456",
    "tanggalLahir": "1990-01-01",
    "statusPerkawinan": "belum_menikah",
    "dealer": "Honda Kalimalang",
    "merkKendaraan": "Honda",
    "modelKendaraan": "Jazz",
    "hargaKendaraan": "300000000",
    "downPayment": "90000000",
    "lamaKredit": "24",
    "angsuranPerBulan": "10000000"
  }'
```

### Get All Applications
```bash
curl -X GET http://localhost:3000/api/applications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Status
```bash
# Replace APPLICATION_ID with actual ID
curl -X PUT http://localhost:3000/api/applications/APPLICATION_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "under_review",
    "notes": "Dokumen lengkap"
  }'
```

### Get Statistics
```bash
curl -X GET http://localhost:3000/api/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Status Values

- `pending` - Pengajuan baru, menunggu review dari Marketing
- `under_review` - Sedang direview oleh Marketing
- `approved` - Disetujui oleh Atasan Marketing
- `rejected` - Ditolak oleh Atasan Marketing

---

## 💡 Tips

1. **JWT Token** disimpan di localStorage browser
2. Token valid selama **7 hari**
3. Logout akan clear token dari localStorage
4. Password minimal 6 karakter (tidak ada validasi strict untuk demo)
5. NIK harus 16 digit untuk best practice (tidak ada validasi strict untuk demo)

---

## ⚠️ Important Notes

- Semua password adalah `password123` untuk kemudahan testing
- Database: `jkl_kredit`
- Collections: `users`, `applications`
- Gunakan MongoDB Compass untuk melihat data langsung di database

---

**Happy Testing! 🚀**
