<p align="center">
  <a href="https://vuejs.org/" target="_blank">
    <img src="https://vuejs.org/images/logo.png" width="100" alt="Vue Logo">
  </a>
</p>

# Lion FMS (File Management System) - Frontend

Lion FMS Frontend adalah aplikasi antarmuka pengguna berbasis **Vue 3** (dengan *Composition API* dan *Vue Router*) yang terintegrasi dengan backend Laravel RESTful API. Aplikasi ini dirancang untuk memudahkan pengguna dalam:

- Menjelajahi struktur direktori perusahaan
- Mengelola file per departemen
- Melakukan pratinjau dokumen (PDF/Gambar)
- Mengatur hak akses pengguna (*Admin* dan *Viewer*)

---

## 🛠️ Teknologi yang Digunakan

| Teknologi        | Kegunaan                                                                  |
| ---------------- | ------------------------------------------------------------------------- |
| **Vue 3**        | Framework JavaScript untuk membangun antarmuka interaktif berbasis komponen |
| **Vue Router**   | Pengelola navigasi dan rute halaman SPA                                   |
| **Tailwind CSS** | Kerangka kerja CSS untuk desain antarmuka yang modern dan responsif       |
| **Axios**        | Komunikasi data asinkron dengan REST API backend Laravel                  |

---

## 📱 Fitur Utama Aplikasi

### 1. Autentikasi (Login)

Halaman login memungkinkan pengguna memasukkan email dan kata sandi untuk masuk ke sistem sesuai hak akses masing-masing (*Admin* atau *Viewer*).

### 2. Manajemen Direktori & Penjelajah Folder

- Menampilkan daftar folder dan dokumen perusahaan secara terstruktur.
- Dilengkapi navigasi **Breadcrumb** untuk memudahkan perpindahan direktori.
- **Admin** memiliki hak penuh untuk membuat folder baru, mengunggah file ke folder aktif, serta mengubah atau menghapus folder dan file.

### 3. Pencarian & Filter Departemen

- Kolom pencarian instan untuk mencari file berdasarkan judul atau nama file asli.
- Filter departemen untuk menyaring dokumen dari departemen tertentu dengan cepat.

### 4. Pratinjau Dokumen & Detail File

- Menampilkan informasi detail setiap file: judul, nama file, departemen, pengunggah, dan tanggal unggah.
- **Preview** interaktif untuk dokumen **PDF** atau **Gambar (JPG/PNG)** di dalam modal tanpa perlu mengunduh.
- Tombol unduh dan hapus yang terintegrasi sesuai peran pengguna.

---

## ⚙️ Requirement

Pastikan perangkat Anda telah terinstal:

- **Node.js** (versi LTS disarankan, >= 18.x)
- **NPM** atau **Yarn**
- Backend Lion FMS yang sudah berjalan (lihat README repository backend)

---

## 📥 Instalasi

1. Clone repository frontend ini ke komputer lokal Anda:

   ```bash
   git clone <url-repository-frontend-anda>
   cd fms-frontend
   ```

2. Install seluruh dependencies:

   ```bash
   npm install
   ```

---

## 🔧 Konfigurasi Environment

1. Buat file `.env` di root direktori frontend (atau salin dari `.env.example` jika ada):

   ```bash
   cp .env.example .env
   ```

   Pengguna Windows (PowerShell):

   ```powershell
   Copy-Item .env.example .env
   ```

2. Sesuaikan URL endpoint API backend Laravel Anda:

   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000/api
   ```

> **Catatan:** Restart `npm run dev` setiap kali file `.env` diubah.

---

## 🚀 Menjalankan Project

Jalankan development server:

```bash
npm run dev
```

Aplikasi dapat diakses melalui browser di **http://localhost:5173**.

Untuk build production:

```bash
npm run build
```

---

## 🔑 Akun Login (Kredensial Pengujian)

Gunakan akun bawaan berikut untuk menguji aplikasi:

| Role              | Email                    | Password         | Hak Akses                                                      |
| ----------------- | ------------------------ | ---------------- | -------------------------------------------------------------- |
| **Administrator** | `admin@liongroup.co.id`  | `LionGroup2026!` | Kontrol penuh: kelola folder, upload, edit, dan hapus file     |
| **Viewer**        | `viewer@liongroup.co.id` | `LionGroup2026!` | Menjelajahi direktori, pratinjau dokumen, dan mengunduh file   |

> ⚠️ Akun di atas hanya untuk keperluan development. Ganti password sebelum deploy ke production.

---

## 📄 License

Open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).