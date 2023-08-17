import bcrypt from "bcrypt";

async function hashedPassword(password) {
  try {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
}

export const jurusans = [
  {
    nama_jurusan: "Teknik Elektro",
  },
  {
    nama_jurusan: "Teknik Sipil",
  },
  {
    nama_jurusan: "Teknik Mesin",
  },
  {
    nama_jurusan: "Akuntansi",
  },
  {
    nama_jurusan: "Administrasi Bisnis",
  },
];

export const prodis = [
  {
    nama_prodi: "Teknologi Rekayasa Komputer",
    kode_prodi: "TI",
    jurusan_id: 1,
  },
  {
    nama_prodi: "Teknik Informatika",
    kode_prodi: "IK",
    jurusan_id: 1,
  },
  {
    nama_prodi: "Konstruksi Gedung",
    kode_prodi: "KG",
    jurusan_id: 2,
  },
  {
    nama_prodi: "Konstruksi Sipil",
    kode_prodi: "KS",
    jurusan_id: 2,
  },
  {
    nama_prodi: "Teknik Mesin",
    kode_prodi: "ME",
    jurusan_id: 3,
  },
  {
    nama_prodi: "Teknik Konversi Energi",
    kode_prodi: "KE",
    jurusan_id: 3,
  },
  {
    nama_prodi: "Komputerisasi Akuntansi",
    kode_prodi: "KA",
    jurusan_id: 4,
  },
  {
    nama_prodi: "Akuntansi",
    kode_prodi: "AK",
    jurusan_id: 4,
  },
  {
    nama_prodi: "Manajemen Bisnis Intenasional",
    kode_prodi: "MB",
    jurusan_id: 5,
  },
  {
    nama_prodi: "Manajemen Pemasaran",
    kode_prodi: "MP",
    jurusan_id: 5,
  },
];

export const tahunAjarans = [
  {
    nama: "Gasal 2022/2023",
  },
  {
    nama: "Genap 2022/2023",
  },
];

export const kelas = [
  {
    nama_kelas: "IK3A",
    tahun_ajaran_id: 1,
    prodi_id: 2,
  },
  {
    nama_kelas: "IK3B",
    tahun_ajaran_id: 1,
    prodi_id: 2,
  },
  {
    nama_kelas: "IK2A",
    tahun_ajaran_id: 1,
    prodi_id: 2,
  },
  {
    nama_kelas: "IK2B",
    tahun_ajaran_id: 1,
    prodi_id: 2,
  },
  {
    nama_kelas: "IK1A",
    tahun_ajaran_id: 1,
    prodi_id: 2,
  },
  {
    nama_kelas: "IK1B",
    tahun_ajaran_id: 1,
    prodi_id: 2,
  },
];

export const users = [
  {
    username: "33420021",
    password: await hashedPassword("secreteuy"),
    role: "Mahasiswa",
  },
  {
    username: "33420022",
    password: await hashedPassword("secretgacor"),
    role: "Mahasiswa",
  },
  {
    username: "12345123",
    password: await hashedPassword("dosengacor"),
    role: "Dosen",
  },
  {
    username: "12345678",
    password: await hashedPassword("dosen2gacor"),
    role: "Dosen",
  },
  {
    username: "admin",
    password: await hashedPassword("admingacor"),
    role: "Admin",
  },
];

export const mahasiswas = [
  {
    nama_mahasiswa: "Rifka Anggun P",
    nim: "33420021",
    user_id: 1,
    kelas_id: 1,
  },
  {
    nama_mahasiswa: "Talitha Padma",
    nim: "33420022",
    user_id: 2,
    kelas_id: 2,
  },
];

export const dosens = [
  {
    nama_dosen: "Pa Amran",
    nip: "12345123",
    user_id: 3,
    jurusan_id: 1,
  },
  {
    nama_dosen: "Bu Wikta",
    nip: "12345678",
    user_id: 4,
    jurusan_id: 1,
  },
];

export const admins = [
  {
    nama: "admin",
    user_id: 5,
  },
];

export const mataKuliahs = [
  {
    nama_mk: "Jaringan",
    kode_mk: "PJA",
  },
  {
    nama_mk: "Website",
    kode_mk: "PW",
  },
];

export const kelasMataKuliahDosen = [
  {
    kelas_id: 1,
    mata_kuliah_id: 1,
    dosen_id: 1,
  },
  {
    kelas_id: 1,
    mata_kuliah_id: 2,
    dosen_id: 2,
  },
];

export const jadwal = [
  {
    hari: "Senin",
    jam_mulai: "07:00",
    jam_akhir: "10:00",
    ruangan: "SB-1/1",
    total_jam: 4,
    tahun_ajaran_id: 1,
    kelas_mk_dosen_id: 1,
  },
  {
    hari: "Senin",
    jam_mulai: "10:00",
    jam_akhir: "12:00",
    ruangan: "SB-1/2",
    total_jam: 4,
    tahun_ajaran_id: 1,
    kelas_mk_dosen_id: 1,
  },
];
