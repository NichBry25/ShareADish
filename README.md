
# Share a Dish
_**Masak Cerdas, Berbagi Gizi**_

Share a Dish adalah platform web berbasis AI yang membantu pengguna membuat, menciptakan, dan berbagi resep. Platform ini bertujuan untuk Menjadi sebuah intervensi untuk _SDG 2 dan 3: Zero Hunger dan Good Health and Well-Being_, dengan menyediakan masakan sehat, terjangkau, dan personal dapat diakses oleh semua orang, sekaligus mendorong keterlibatan komunitas dan mengurangi limbah makanan.

**Website Demo:** 
https://share-a-dish-demo.vercel.app/ 

## Table of Contents

- [Ringkasan](#ringkasan)
- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Instalasi local](#instalasi-local)
- [Dampak dan Manfaat](#dampak-dan-manfaat)
- [Kontributor](#kontributor)
- [Referensi](#referensi)

## Ringkasan
Sampah makanan dan gizi buruk merupakan tantangan global yang besar. **931 juta** ton makanan terbuang setiap tahun (UNEP Food Waste Index, 2021), sementara **828 juta** orang masih kelaparan. Banyak orang kesulitan menjaga pola makan sehat karena keterbatasan waktu, literasi pangan, biaya, dan kemampuan memasak. Platform resep saat ini jarang mempertimbangkan **keterjangkauan, ketersediaan bahan di rumah, atau informasi gizi**. 

**Share a Dish** mengatasi masalah ini dengan menawarkan:

- Pembuatan resep yang dipersonalisasi menggunakan **AI**
- Integrasi dengan bahan-bahan yang sudah dimiliki pengguna di rumah
- Informasi nutrisi untuk setiap resep
- Berbagi komunitas dan interaksi

Platform ini berfungsi seperti **jejaring sosial** bagi penggemar makanan, memungkinkan pengguna untuk berbagi resep, berkomentar, menyukai, dan mengunggah gambar masakan mereka.

## Fitur
**AI Recipe Generation:** Menghasilkan resep berdasarkan bahan yang tersedia, preferensi diet (vegan, vegetarian, low-budget, dsb.), dan kebutuhan nutrisi.

**Recipe Sharing:** Menyimpan dan membagikan resep kepada komunitas.

**Interaksi Komunitas:** Memberi komentar, tips, dan mengunggah foto masakan.

**Informasi Nutrisi:** Memberikan panduan nutrisi dasar untuk setiap resep, bahkan saat membuat resep secara manual.

**Personalisasi:** Resep bisa dimodifikasi lebih lanjut menggunakan AI untuk hasil yang lebih sesuai.

## Teknologi
Frontend: Next.js, Tailwind CSS

Backend: Python, FastAPI

Database: MongoDB

Integrasi AI: ChatGPT

CDN: Cloudinary

Deployment: Vercel, Docker, GCP Cloud run

Dataset: USDA FoodData Central Dataset

## Instalasi local

### Ketergantungan
````
- Node.js (Next.js, Tailwind CSS)  
- TypeScript  
- Python>=3.10 (FastAPI, Uvicorn, Pydantic)  
- MongoDB driver (pymongo)  
````

### Kunci API yang Diperlukan

- **OpenAI**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)  
  - Digunakan untuk integrasi AI (misalnya ChatGPT atau model resep).

- **Cloudinary**: [https://cloudinary.com/](https://cloudinary.com/)  
  - Digunakan untuk menyimpan dan mengelola gambar hasil masakan.

- **MongoDB Atlas**: [https://cloud.mongodb.com/](https://cloud.mongodb.com/)  
  1. Buat akun dan buat **cluster baru** (Free Tier cukup).  
  2. Masuk ke **Database Access** → **Add New Database User**.  
  3. Buat **username** dan **password** (bisa dibuat otomatis, lalu salin).  
  4. Tambahkan **IP Address** kamu untuk mengakses database (`0.0.0.0/0`).  
  5. Salin **Connection String / URI** untuk digunakan di `.env`:
     ```
     mongodb+srv://<username>:<password>@cluster0.abcd1.mongodb.net/<dbname>?retryWrites=true&w=majority
     ```

### Pengaturan

1. **Clone repositori:**
```bash
git clone https://github.com/NichBry25/ShareADish.git

cd ShareADish
```
2. **Konfigurasi environment variables (```.env```)**:

- Backend (```ShareADish/backend/.env```):
```
MONGODB_URL='mongodb+srv://<username>:<password>@cluster0.abcd1.mongodb.net/<dbname>?retryWrites=true&w=majority'
OPENAI_API_KEY=<Tempel Kunci API Anda>
CLOUDINARY_API_KEY=<Tempel Kunci API Anda>
```

- Frontend (```ShareADish/Frontend/.env```):
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
API_BASE_URL=http://localhost:8000
```

3. **Instal Ketergantungan backend dan jalankan:**
```
cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload
```

4. **Instal Ketergantungan frontend dan jalankan:**
```
cd ../frontend

npm install

npm run dev
```

## Dampak dan Manfaat
- Mengurangi limbah makanan dengan memanfaatkan bahan seadanya secara efisien.

- Meningkatkan literasi gizi melalui panduan nutrisi pada resep.

- Mendorong kolaborasi sosial melalui interaksi komunitas.

- Mendukung SDG 2 & 3: Zero Hunger dan Good Health and Well-Being.

## Kontributor
- Muhammad Rafi Athallah - Binus Senayan
- Nicholas Bryan - Binus Senayan
- Osten Antonio - Binus Senayan

## Referensi
UNEP. (2021). UNEP Food Waste Index Report 2021. UNEP - UN Environment Programme; UNEP. https://www.unep.org/resources/report/unep-food-waste-index-report-2021

United States Department of Agriculture. (2025). FoodData Central Download Datasets. Usda.gov. https://fdc.nal.usda.gov/download-datasets
