# 🤖 WA-Gateway Financial Assistant

![Node.js](https://img.shields.io/badge/Node.js-v20-green) ![Docker](https://img.shields.io/badge/Container-Podman-purple) ![Redis](https://img.shields.io/badge/Cache-Redis-red) ![Status](https://img.shields.io/badge/Status-Active-blue)

**Pernah ngerasain males nyatet pengeluaran karena harus buka aplikasi ini itu?**
Atau sering lupa beli apa saja hari ini?

Tenang! Kini kamu bisa nyatet transaksi harianmu langsung dari WhatsApp! 🚀

**WA-Gateway Financial Assistant** adalah bot pribadi yang aku buat untuk memudahkan pencatatan keuangan secara *real-time* tanpa ribet. Chat bot-nya, dan data langsung tersimpan rapi.

Project ini mengawinkan kemudahan **WhatsApp**, fleksibilitas **Google Sheets**, kecerdasan **Deepseek**, dan kecepatan **Redis** (response time <50ms!).

---

## ✨ Fitur Unggulan

### 🔐 Aman & Terkendali

* **Login By QR**: Bot dapat digunakan dengan menautkan perangkat di aplikasi WhatsApp.
* **Local Session**: Sesi login tersimpan aman di server.

### 💰 Manajemen Keuangan Praktis

* **📝 Catat**: Input pengeluaran/pemasukan semudah chatting. Format natural & fleksibel.
* **⚡ Performa kilat (Redis Cached)**: Cek transaksi terakhir tanpa loading lama.
* **✏️ Edit & Hapus**: Salah ketik nominal? Typo deskripsi? Tinggal edit atau hapus lewat command.

### 🛠️ Tech Stack

* **Node.js**: Core logic bot.
* **Google Sheets API**: Database gratisan & mudah diakses di mana saja.
* **Deepseek**: Natural Language Processing untuk memproses *command.*
* **Redis**: Caching layer untuk performa ngebut.
* **Podman**: Containerized deployment agar mudah dijalankan di VPS mana saja.

---

## 🏗️ Arsitektur Sistem

```mermaid
graph TD
    User[User WhatsApp] -->|Chat !get| WA[WA Gateway Engine]
    WA -->|Cek Cache| Redis{Redis Cache}
  
    Redis -->|Hit| WA
    Redis -->|Miss| GSheet[Google Sheets API]
  
    GSheet -->|Return Data| WA
    WA -->|Save Cache| Redis
    WA -->|Reply Chat| User
```

## Instalasi & Konfigurasi

### 1. File .env

Buat file .env di root project

```markdown
## ⚙️ Instruksi Instalasi

### 1. Persiapan Environment
Buat file `.env` di root directory:

```env
APP_ENV=production
SESSION_PATH=./auth_info

# Email Config (Nodemailer)
EMAIL_USER=email_pengirim@gmail.com
EMAIL_PASS=app_password_16_digit
ADMIN_EMAIL=email_kamu@gmail.com

# Google Sheets API
GOOGLE_SPREADSHEET_ID=ID_SPREADSHEET_KAMU
GOOGLE_CLIENT_EMAIL=service-account@nama-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nISI_KEY_DISINI\n-----END PRIVATE KEY-----\n"

# Redis Config
REDIS_URL=redis://localhost:6379
```

### 2. Deployment via Podman

Jalankan perintah berikut di terminal server untuk membangun dan menjalankan bot:

```bash
# 1. Build Image Aplikasi
podman build -t wa-financial-bot .

# 2. Jalankan Container
# --network host: Agar bot bisa akses Redis di localhost
# -v ./auth_info...: Agar sesi WhatsApp tidak hilang saat restart
podman run -d \
  --name wa-bot \
  --network host \
  --restart always \
  --env-file .env \
  -v ./auth_info:/app/auth_info:Z \
  wa-financial-bot
```

### 3. Aktivasi Sesi (Login)

Scan QR yang dikirimkan melalui email kamu menggunakan WhatsApp. Bot akan mengirimkan kode QR sesaat setelah container dijalankan.
