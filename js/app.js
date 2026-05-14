/* ========================================
   UMKM Starter Hub - Core App JS
   ======================================== */

const DB = {
    get(key) { try { return JSON.parse(localStorage.getItem('umkm_' + key)); } catch { return null; } },
    set(key, val) { localStorage.setItem('umkm_' + key, JSON.stringify(val)); },
    remove(key) { localStorage.removeItem('umkm_' + key); }
};

function formatRupiah(n) { return 'Rp ' + Number(n).toLocaleString('id-ID'); }
function formatDate(d) {
    const m = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const dt = new Date(d); return dt.getDate() + ' ' + m[dt.getMonth()] + ' ' + dt.getFullYear();
}
function genId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }
function checkAuth() { if (!DB.get('auth')) { window.location.href = '../login.html'; return false; } return true; }
function logout() {
    DB.remove('auth');
    const path = window.location.pathname;
    if (path.includes('/admin/')) {
        window.location.href = '../login.html';
    } else {
        window.location.href = 'login.html';
    }
}
function isPremiumUser() { return DB.get('premium_user') === true; }
function setPremiumUser(status) { DB.set('premium_user', status); }

function showToast(msg, type = 'success') {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.className = 'toast ' + (type === 'error' ? 'error' : '');
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => t.classList.remove('show'), 3000);
}

/* ---- File Helpers ---- */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
function downloadBase64File(base64, filename) {
    let url = base64;
    if (url.startsWith('files/') && window.location.pathname.includes('/admin/')) { url = '../' + url; }
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
}
function getYouTubeEmbedUrl(url) {
    if (!url) return '';
    const patterns = [/youtube\.com\/watch\?v=([^&\s]+)/, /youtu\.be\/([^?\s]+)/, /youtube\.com\/embed\/([^?\s]+)/];
    for (const p of patterns) { const m = url.match(p); if (m) return 'https://www.youtube.com/embed/' + m[1]; }
    return url;
}

/* ---- Seed Data ---- */
function initSeedData() {
    if (DB.get('init_v9')) return;
    if (!DB.get('initialized') || !DB.get('init_v9')) {
        DB.set('config', { siteName: 'UMKM Starter Hub', tagline: 'Starter Hub', heroTitle: 'Mulai Usaha UMKM dari Nol, Gak Pake Ribet!', heroSubtitle: 'Panduan langkah demi langkah, inspirasi produk, hingga kalkulator harga jual untuk bantu kamu mulai dan mengembangkan usaha.', heroCta: 'Mulai Sekarang', ctaTitle: 'Siap Mulai Usaha?', ctaDesc: 'Ikuti panduan starter guide dan wujudkan usahamu sekarang juga!', ctaCta: 'Mulai Guide', footerDesc: 'Platform pendamping UMKM pemula untuk memulai usaha dengan lebih mudah.', socialIG: '#', socialYT: '#', socialWA: '#' });
        DB.set('products', [
            { id: 'p1', name: 'Keripik Pisang Cokelat', category: 'Makanan', price: 15000, rating: 4.8, desc: 'Keripik Pisang dengan lapisan cokelat premium', image: 'images/produk-keripik.jpg', color: '#e74c3c' },
            { id: 'p2', name: 'Es Kopi Susu Literan', category: 'Minuman', price: 18000, rating: 4.7, desc: 'Kopi susu fresh dalam kemasan 1 liter', image: 'images/produk-kopi.jpg', color: '#f39c12' },
            { id: 'p3', name: 'Totebag Kanvas', category: 'Fashion', price: 35000, rating: 4.9, desc: 'Tas kanvas ramah lingkungan dengan desain unik', image: 'images/produk-totebag.jpg', color: '#27ae60' },
            { id: 'p4', name: 'Sambal Bawang Crispy', category: 'Makanan', price: 25000, rating: 4.6, desc: 'Sambal bawang goreng renyah dan pedas', image: 'images/produk-sambal.jpg', color: '#e74c3c' },
            { id: 'p5', name: 'Lilin Aromaterapi', category: 'Kerajinan', price: 45000, rating: 4.8, desc: 'Lilin wangi handmade dari soy wax', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500', color: '#9b59b6' },
            { id: 'p6', name: 'Granola Homemade', category: 'Makanan', price: 30000, rating: 4.5, desc: 'Granola sehat dengan campuran kacang dan buah kering', image: 'images/produk-granola.jpg', color: '#e74c3c' },
            { id: 'p7', name: 'Sabun Mandi Organik', category: 'Perawatan', price: 20000, rating: 4.9, desc: 'Sabun natural berbahan dasar minyak kelapa dan zaitun', image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500', color: '#1abc9c' },
            { id: 'p8', name: 'Kaos Sablon Custom', category: 'Fashion', price: 55000, rating: 4.7, desc: 'Kaos katun combed 30s dengan sablon DTF berkualitas', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', color: '#34495e' },
            { id: 'p9', name: 'Tanaman Hias Sukulen', category: 'Hobi', price: 15000, rating: 4.8, desc: 'Sukulen mini dalam pot keramik estetik untuk meja kerja', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500', color: '#2ecc71' },
            { id: 'p10', name: 'Jurnal Kulit Aesthetic', category: 'Alat Tulis', price: 40000, rating: 4.9, desc: 'Buku catatan dengan sampul kulit sintetis bergaya vintage', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500', color: '#d35400' },
            { id: 'p11', name: 'Casing HP Resin', category: 'Aksesoris', price: 35000, rating: 4.6, desc: 'Casing HP transparan dengan hiasan bunga kering asli', image: 'https://images.unsplash.com/photo-1586953208448-b95a79203678?w=500', color: '#e67e22' }
        ]);
        DB.set('seminars', [
            { id: 's1', title: 'Cara Jualan Laris di Instagram', type: 'Online', date: '2025-05-20', time: '19:00 - 21:00 WIB', desc: 'Pelajari strategi marketing Instagram untuk UMKM' },
            { id: 's2', title: 'Branding Produk UMKM yang Menarik', type: 'Offline', date: '2025-05-28', time: '09:00 - 12:00 WIB', desc: 'Workshop branding dan packaging produk' },
            { id: 's3', title: 'Mengelola Keuangan UMKM', type: 'Online', date: '2025-06-05', time: '14:00 - 16:00 WIB', desc: 'Tips pencatatan keuangan sederhana untuk usaha kecil' },
            { id: 's4', title: 'Fotografi Produk dengan HP', type: 'Online', date: '2025-06-12', time: '10:00 - 12:00 WIB', desc: 'Teknik foto produk profesional hanya dengan smartphone' },
            { id: 's5', title: 'Building Authentic Brands in a Competitive Market', type: 'Offline', date: '2026-05-16', time: '08:30 - 11:00 WIB', desc: 'Seminar Bisnis Interaktif bersama Dimas Vandityo (Founder Kalis Donuts). Lokasi: Departemen Ekonomika & Bisnis UGM.', linkDaftar: 'https://docs.google.com/forms/d/e/1FAIpQLSc9xUTbtCMUgl9O3Q3YSBnAz3tWGTyB9Ak6YGx6lWNOp-NMAg/closedform', pamflet: 'images/seminar-1.jpg' },
            { id: 's6', title: 'Rahasia UMKM Ramai Tanpa Iklan Mahal', type: 'Online', date: '2026-04-23', time: '10:00 - Selesai', desc: 'Strategi kolaborasi komunitas bersama Nizelia Basasya Bilqis dari Rumah BUMN Malang.', linkDaftar: 'https://docs.google.com/forms/d/e/1FAIpQLSfABPX5EDwDPXqtX-Kcu9DHoRoei5ZFwd04OIP_15m_XsypJA/viewform', pamflet: 'images/seminar-2.jpg' },
            { id: 's7', title: 'Bangkitkan Ide Usaha: Kreasi Dimsum Nusantara', type: 'Offline', date: '2026-05-08', time: '09:00 - Selesai', desc: 'Pelatihan bersama Ika Hindun Dewi Zulaikha di Rumah BUMN Malang.', linkDaftar: 'https://docs.google.com/forms/d/e/1FAIpQLSevZ7AkrmG17yFPpEQ4e8zVDXzx0R-5sP2aYwFD9zu1X6L5-Q/closedform', pamflet: 'images/seminar-3.jpg' },
            { id: 's8', title: 'Pelatihan Anyaman Rotan Berbasis Bahan Alam', type: 'Offline', date: '2026-05-07', time: '09:00 - Selesai', desc: 'Kreasi Nusantara Bangkit bersama Misriwati Agustina di Rumah BUMN Malang.', linkDaftar: 'https://bit.ly/KreasiiNusantaraBangkitPelatihanAnyamanRotanBerbasisBahanAlam', pamflet: 'images/seminar-4.jpg' },
            { id: 's9', title: 'Memahami Pola Keputusan Pembelian Konsumen', type: 'Online', date: '2026-04-27', time: '10:00 - Selesai', desc: 'Pelatihan online via Zoom bersama Rezy Safira dari Rumah BUMN Malang.', linkDaftar: 'https://docs.google.com/forms/d/e/1FAIpQLSc4u8VoEACaOzZi1XDHqVeoz_8QNBOuN3Xjtki_eGPsELbA0g/viewform', pamflet: 'images/seminar-5.jpeg' }
        ]);
        DB.set('guideSteps', [
            { id: 'g1', number: 1, title: 'Tentukan Ide Usaha', desc: 'Temukan ide usaha yang sesuai minat dan peluang.', icon: '💡' },
            { id: 'g2', number: 2, title: 'Kenali Target Pasar', desc: 'Pahami siapa calon pembelimu.', icon: '🎯' },
            { id: 'g3', number: 3, title: 'Hitung Harga Jual', desc: 'Tentukan harga jual agar tetap untung.', icon: '💰' },
            { id: 'g4', number: 4, title: 'Mulai Jualan', desc: 'Pelajari cara jualan online & offline.', icon: '🛒' },
            { id: 'g5', number: 5, title: 'Evaluasi & Kembangkan', desc: 'Pantau usaha dan terus berkembang.', icon: '📊' }
        ]);
        DB.set('stats', { visitors: 1250, subscribers: 84, pageViews: 4320, visitorHistory: [320, 450, 380, 520, 610, 580, 720, 890, 750, 940, 1100, 1250] });
        DB.set('activities', [
            { text: 'Produk baru "Keripik Pisang Cokelat" ditambahkan', time: '2 jam lalu', type: 'green' },
            { text: 'Seminar "Cara Jualan Laris" didaftarkan 5 peserta baru', time: '4 jam lalu', type: 'blue' },
            { text: 'Konfigurasi hero section diperbarui', time: '1 hari lalu', type: 'orange' },
            { text: 'Newsletter subscriber baru: user@email.com', time: '1 hari lalu', type: 'green' },
            { text: 'Produk "Totebag Kanvas" diperbarui', time: '2 hari lalu', type: 'blue' }
        ]);

        const dummyExcel = 'data:text/csv;base64,VGFuZ2dhbCxLZXRlcmFuZ2FuLFBlbWFzdWthbixQZW5nZWx1YXJhbgoyMDI1LTAxLTAxLE1vZGFsIEF3YWwsMTAwMDAwMCwwCg==';
        const dummyPdf = 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iaiA8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4gZW5kb2JqCjIgMCBvYmogPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4gZW5kb2JqCjMgMCBvYmogPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCAyMDAgMjAwXSA+PiBlbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDExOSAwMDAwMCBuIAp0cmFpbGVyIDw8IC9TaXplIDQgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjE3MwolJUVPRgo=';

        DB.set('templates', [
            { id: 't1', title: 'Template Laporan Laba Rugi', category: 'Laporan Keuangan', desc: 'Template Excel untuk mencatat pendapatan dan pengeluaran usaha.', fileName: 'laporan-laba-rugi.csv', file: dummyExcel },
            { id: 't2', title: 'Template Arus Kas Harian', category: 'Arus Kas', desc: 'Catat arus kas masuk dan keluar harian usahamu.', fileName: 'arus-kas-harian.csv', file: dummyExcel },
            { id: 't3', title: 'Template Pembukuan Sederhana', category: 'Pembukuan', desc: 'Template pembukuan dasar untuk UMKM pemula.', fileName: 'pembukuan-sederhana.csv', file: dummyExcel }
        ]);

        DB.set('videos', [
            { id: 'v1', title: 'Langkah Mudah Memulai Bisnis Kerajinan Tangan (Handmade)', url: 'https://youtu.be/uS1XBfFBCWU?si=lqaGT7DFPL58BZWw', desc: 'Ingin memulai bisnis dengan modal kecil namun memiliki keuntungan yang besar? Bisnis handmade adalah salah satu ide bisnis yang bisa Anda pilih. Untuk memulai bisnis ini, Anda akan dituntut menjadi lebih kreatif untuk menarik konsumen.' },
            { id: 'v2', title: 'Cara Bisnis Pakaian Untuk Pemula', url: 'https://youtu.be/xg4lj4IpQXw?si=iNRmzAb3yb3y1V23', desc: 'Kalau Anda mencari peluang bisnis dropship yang mudah dimulai sekarang juga, tentu Anda bisa pelajari cara bisnis pakaian untuk pemula ini. Pakaian adalah salah satu kategori produk fashion yang marketnya sangat besar dan banyak pembelinya karena termasuk salah satu kebutuhan pokok.' },
            { id: 'v3', title: 'Strategi cerdas untuk meningkatkan Penjualan', url: 'https://youtu.be/UJNQQ3XKszU?si=SiX2vZ43LQOIqpgo', desc: 'Sudah menjalankan strategi ini itu, tapi belum ada hasilnya. Kira-kira apa yang menjadi masalahnya? dari produk bisnis Anda atau justru dari manajemen perusahaan Anda? lalu bagaimana solusinya?.' },
            { id: 'v4', title: 'Strategi UMKM agar lebih dikenal', url: 'https://youtu.be/FIB42_nrQP0?si=Y-eVUMJnRF4JvEfF', desc: 'Baru merintis bisnis UMKM tapi takut kalah saing dengan produk lain? Untuk bersaing di tengah gempuran bisnis UMKM memang tidak mudah, apalagi jika produk yang kamu jual terbilang umum di pasaran.' }
        ]);

        DB.set('modules', [
            { id: 'm1', title: 'Modul Dasar Kewirausahaan', category: 'Dasar', desc: 'Modul lengkap tentang dasar-dasar memulai usaha.', fileName: 'modul-kewirausahaan.pdf', file: dummyPdf },
            { id: 'm2', title: 'Modul Digital Marketing', category: 'Marketing', desc: 'Panduan pemasaran digital untuk pelaku UMKM.', fileName: 'modul-digital-marketing.pdf', file: dummyPdf },
            { id: 'm3', title: 'Modul Manajemen Keuangan', category: 'Keuangan', desc: 'Cara mengelola keuangan usaha agar tetap sehat.', fileName: 'modul-keuangan.pdf', file: dummyPdf }
        ]);

        DB.set('quizzes', [
            { id: 'q1', title: 'Quiz: Dasar-Dasar Kewirausahaan', link: 'https://gemini.google.com/share/a4350b3bc102', desc: 'Uji pemahaman tentang konsep dasar Kewirausahaan.', difficulty: 'Mudah' },
            { id: 'q2', title: 'Quiz: Pemasaran Digital', link: 'https://gemini.google.com/share/834b928fd306', desc: 'Test pengetahuan tentang strategi pemasaran digital untuk UMKM.', difficulty: 'Menengah' },
            { id: 'q3', title: 'Quiz: Pencatatan Keuangan', link: 'https://gemini.google.com/share/13e88de61404', desc: 'Latihan soal pencatatan keuangan UMKM.', difficulty: 'Menengah' },
            { id: 'q4', title: 'Quiz: Branding Produk', link: 'https://gemini.google.com/share/a5a6ae257224', desc: 'Test pengetahuan tentang branding produk UMKM.', difficulty: 'Sulit' }
        ]);

        DB.set('initialized', true);
        DB.set('init_v9', true);
    }
}
initSeedData();

/* ---- Migrate Empty Files in Existing Data ---- */
function migrateDummyData() {
    let templates = DB.get('templates') || [];
    let updatedT = false;
    const dummyExcel = 'data:text/csv;base64,VGFuZ2dhbCxLZXRlcmFuZ2FuLFBlbWFzdWthbixQZW5nZWx1YXJhbgoyMDI1LTAxLTAxLE1vZGFsIEF3YWwsMTAwMDAwMCwwCg==';
    const dummyPdf = 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iaiA8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4gZW5kb2JqCjIgMCBvYmogPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4gZW5kb2JqCjMgMCBvYmogPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCAyMDAgMjAwXSA+PiBlbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDExOSAwMDAwMCBuIAp0cmFpbGVyIDw8IC9TaXplIDQgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjE3MwolJUVPRgo=';

    templates.forEach(t => {
        if (!t.file) {
            t.file = dummyExcel;
            if (t.fileName && t.fileName.endsWith('.xlsx')) {
                t.fileName = t.fileName.replace('.xlsx', '.csv');
            }
            updatedT = true;
        }
    });
    if (updatedT) DB.set('templates', templates);

    let modules = DB.get('modules') || [];
    let updatedM = false;
    modules.forEach(m => {
        if (!m.file) {
            m.file = dummyPdf;
            updatedM = true;
        }
    });
    if (updatedM) DB.set('modules', modules);
}
migrateDummyData();

/* ---- Product Helpers ---- */
function getProductEmoji(cat) { return { 'Makanan': '🍽️', 'Minuman': '☕', 'Fashion': '👜', 'Kerajinan': '🕯️' }[cat] || '📦'; }
function getCatColor(cat) { return { 'Makanan': '#e74c3c', 'Minuman': '#f39c12', 'Fashion': '#27ae60', 'Kerajinan': '#9b59b6' }[cat] || '#3498db'; }

/* ---- Navbar ---- */
function renderNavbar(activePage) {
    const c = DB.get('config') || {};
    const isPrem = DB.get('premium_user') === true;
    const auth = DB.get('auth');

    const langgananBtn = isPrem
        ? `<button onclick="if(confirm('Batalkan langganan Premium?')){ setPremiumUser(false); location.reload(); }" class="btn btn-outline btn-sm" style="border-color:var(--color-danger); color:var(--color-danger); margin-right:0.5rem;">Batal Langganan</button>`
        : `<a href="langganan.html" class="btn btn-outline btn-sm" style="border-color:var(--accent-400); color:var(--accent-600); margin-right:0.5rem;">💎 Berlangganan</a>`;

    let authBtn = `<a href="login.html" class="btn btn-primary btn-sm">Masuk</a>`;
    if (auth) {
        if (auth.role === 'admin') {
            authBtn = `<a href="admin/dashboard.html" class="btn btn-primary btn-sm">Admin</a>`;
        } else {
            authBtn = `<a href="javascript:void(0)" onclick="if(confirm('Logout dari akun ${auth.username}?')){ logout(); }" class="btn btn-primary btn-sm">${auth.username}</a>`;
        }
    }

    return `
    <style>
        .nav-dropdown { position: relative; display: inline-block; }
        .nav-dropdown-content { display: none; position: absolute; background-color: #fff; min-width: 200px; box-shadow: var(--shadow-md); z-index: 100; border-radius: var(--radius-lg); padding: 0.5rem 0; top: 100%; left: 0; }
        .nav-dropdown:hover .nav-dropdown-content { display: block; }
        .nav-dropdown-content a { color: var(--neutral-700) !important; padding: 0.6rem 1.25rem !important; text-decoration: none; display: block; font-size: 0.9rem; background: transparent !important; }
        .nav-dropdown-content a:hover { background-color: var(--primary-50) !important; color: var(--primary-600) !important; }
        @media(max-width: 768px) {
            .nav-dropdown-content { position: static; box-shadow: none; padding-left: 1rem; border-left: 2px solid var(--neutral-200); border-radius: 0; display: none; }
            .nav-dropdown.active .nav-dropdown-content { display: block; }
        }
    </style>
    <nav class="navbar"><div class="container">
        <a href="index.html" class="navbar-logo"><img src="LOGO.png" alt="${c.siteName || 'UMKM Starter Hub'}" style="height: 56px; max-height: 100%; object-fit: contain;"></a>
        <div class="navbar-menu" id="navMenu">
            <a href="index.html" class="${activePage === 'home' ? 'active' : ''}">Home</a>
            <a href="produk.html" class="${activePage === 'produk' ? 'active' : ''}">Produk</a>
            <a href="starter-guide.html" class="${activePage === 'guide' ? 'active' : ''}">Starter Guide</a>
            <a href="kalkulator.html" class="${activePage === 'kalkulator' ? 'active' : ''}">Kalkulator</a>
            
            <div class="nav-dropdown" onclick="this.classList.toggle('active')">
                <a href="javascript:void(0)" class="${['pembelajaran', 'seminar', 'template'].includes(activePage) ? 'active' : ''}">Pembelajaran ▾</a>
                <div class="nav-dropdown-content">
                    <a href="seminar.html">Seminar</a>
                    <a href="pembelajaran.html#videos">Video Tips</a>
                    <a href="pembelajaran.html#modules">Modul Ajar</a>
                    <a href="pembelajaran.html#quizzes">Soal Quizizz</a>
                    <a href="template-keuangan.html">Template Keuangan</a>
                </div>
            </div>
        </div>
        <div class="navbar-actions">${langgananBtn}${authBtn}</div>
        <button class="navbar-hamburger" onclick="document.getElementById('navMenu').classList.toggle('active')">☰</button>
    </div></nav>`;
}

/* ---- Footer ---- */
function renderFooter() {
    const c = DB.get('config') || {};
    return `<footer class="footer"><div class="container"><div class="footer-grid">
        <div class="footer-brand"><h3>${c.siteName || 'UMKM Starter Hub'}</h3><p>${c.footerDesc || 'Platform pendamping UMKM pemula.'}</p>
            <div class="footer-social"><a href="${c.socialIG || '#'}" title="Instagram">📷</a><a href="${c.socialYT || '#'}" title="YouTube">▶️</a><a href="${c.socialWA || '#'}" title="WhatsApp">💬</a></div></div>
        <div><h4>Menu</h4><div class="footer-links"><a href="index.html">Home</a><a href="produk.html">Produk</a><a href="starter-guide.html">Starter Guide</a><a href="seminar.html">Seminar</a><a href="template-keuangan.html">Template Keuangan</a><a href="pembelajaran.html">Pembelajaran</a><a href="kalkulator.html">Kalkulator Harga</a></div></div>
        <div><h4>Bantuan</h4><div class="footer-links"><a href="#">Tentang Kami</a><a href="#">Kontak</a><a href="#">FAQ</a><a href="#">Kebijakan Privasi</a></div></div>
        <div class="footer-newsletter"><h4>Newsletter</h4><p style="color:rgba(255,255,255,0.5);font-size:0.85rem;">Dapatkan info dan tips UMKM terbaru.</p><div class="newsletter-form"><input type="email" placeholder="Email kamu" id="newsletterEmail"><button onclick="subscribeNewsletter()">Kirim</button></div></div>
    </div><div class="footer-bottom">© 2025 ${c.siteName || 'UMKM Starter Hub'}. All Rights Reserved.</div></div></footer>`;
}

function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmail');
    if (email && email.value) { const s = DB.get('stats') || {}; s.subscribers = (s.subscribers || 0) + 1; DB.set('stats', s); email.value = ''; alert('Terima kasih sudah berlangganan! 🎉'); }
}

/* ---- Sidebar ---- */
function renderSidebar(activePage) {
    return `<aside class="sidebar" id="sidebar"><div class="sidebar-logo"><h2>🏪 UMKM</h2><span>Admin Panel</span></div>
    <nav class="sidebar-nav">
        <a href="dashboard.html" class="${activePage === 'dashboard' ? 'active' : ''}"><span class="icon">📊</span> Dashboard</a>
        <a href="produk.html" class="${activePage === 'produk' ? 'active' : ''}"><span class="icon">📦</span> Produk</a>
        <a href="seminar.html" class="${activePage === 'seminar' ? 'active' : ''}"><span class="icon">🎓</span> Seminar</a>
        <a href="guide.html" class="${activePage === 'guide' ? 'active' : ''}"><span class="icon">📖</span> Starter Guide</a>
        <div class="sidebar-divider"></div>
        <div class="sidebar-section-label">Keuangan</div>
        <a href="template-keuangan.html" class="${activePage === 'template' ? 'active' : ''}"><span class="icon">📑</span> Template Keuangan</a>
        <div class="sidebar-divider"></div>
        <div class="sidebar-section-label">Pembelajaran</div>
        <a href="video-tips.html" class="${activePage === 'video' ? 'active' : ''}"><span class="icon">🎬</span> Video Tips</a>
        <a href="modul-ajar.html" class="${activePage === 'modul' ? 'active' : ''}"><span class="icon">📚</span> Modul Ajar</a>
        <a href="quizizz.html" class="${activePage === 'quiz' ? 'active' : ''}"><span class="icon">❓</span> Soal Quizizz</a>
        <div class="sidebar-divider"></div>
        <a href="konfigurasi.html" class="${activePage === 'config' ? 'active' : ''}"><span class="icon">⚙️</span> Konfigurasi</a>
        <div class="sidebar-divider"></div>
        <a href="../index.html"><span class="icon">🌐</span> Lihat Website</a>
    </nav>
    <div class="sidebar-footer"><a href="#" onclick="logout(); return false;"><span class="icon">🚪</span> Logout</a></div>
    </aside><div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>`;
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('open');
}

function renderAdminHeader(title) {
    return `<header class="admin-header"><div class="flex items-center gap-2"><button class="sidebar-toggle" onclick="toggleSidebar()">☰</button><h2>${title}</h2></div>
    <div class="admin-header-right"><div class="admin-user"><div class="admin-avatar">A</div><span style="font-size:0.9rem;font-weight:500;">Admin</span></div></div></header>`;
}

function renderProductCard(p) {
    const emoji = getProductEmoji(p.category), catColor = getCatColor(p.category);
    const imgStyle = p.image ? `background-image:url('${p.image}');background-size:cover;background-position:center;` : `background:linear-gradient(135deg,${catColor}22,${catColor}11);display:flex;align-items:center;justify-content:center;font-size:4rem;`;
    return `<div class="product-card"><div class="product-image" style="${imgStyle}">${p.image ? '' : emoji}<span class="badge-cat" style="background:${catColor}">${p.category}</span></div>
    <div class="product-info"><h4>${p.name}</h4><div class="product-meta"><span class="product-price">${formatRupiah(p.price)}</span><span class="product-rating"><span class="star">⭐</span> ${p.rating}</span></div></div></div>`;
}
