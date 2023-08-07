# Rekap Presensi API Spec

## Search Rekap Presensi Dosen API

Endpoint : GET /api/rekapdosen

Headers :

- Authorization : token

Query params :

- jurusan_id : Search by jurusan_id, \*\*required
- nama_dosen : Search by nama_dosen, \*\*required
- tahun_ajaran_id : Search by tahun_ajaran_id, \*\*required
- page : number of page, default 1
- size : size per page, default 10

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "kelas": "IK-3A",
      "mata_kuliah": "Jaringan",
      "total_pertemuan": 16,
      "jadwalPertemuan": [
        {
          "id": 1,
          "hari": "Senin",
          "dosen": "pak anu",
          "nama_mk": "Pemrograman Basis Data",
          "kelas": "IK-3A",
          "ruangan": "SB II/1",
          "waktu_realisasi": "format tanggal",
          "jam_mulai": "jam berapa",
          "jam_akhir": "jam berapa",
          "topik_perkuliahan": "topik anu",
          "rekapitulasi": [
            { "hadir": 18 },
            { "sakit": 1 },
            { "izin": 2 },
            { "alpha": 3 }
          ]
        }
      ]
    },
    {
      "id": 2,
      "kelas": "IK-2A",
      "mata_kuliah": "Pemrograman Mobile",
      "total_pertemuan": 12,
      "jadwalPertemuan": [
        {
          "id": 2,
          "hari": "Senin",
          "dosen": "pak anu",
          "nama_mk": "Pemrograman Mobile",
          "kelas": "IK-2A",
          "ruangan": "SB II/1",
          "waktu_realisasi": "format tanggal",
          "jam_mulai": "jam berapa",
          "jam_akhir": "jam berapa",
          "topik_perkuliahan": "topik anu",
          "rekapitulasi": [
            { "hadir": 20 },
            { "sakit": 1 },
            { "izin": 1 },
            { "alpha": 2 }
          ]
        }
      ]
    }
  ],
  "paging": {
    "page": 1,
    "total_page": 3,
    "total_item": 30
  }
}
```

## Search Rekap Presensi Mahasiswa API

Endpoint : GET /api/rekapmahasiswa

Headers :

- Authorization : token

Query params :

<!-- - jurusan_id : Search by jurusan_id, \*\*required -->
<!-- - prodi_id : Search by prodi_id, \*\*required -->

- kelas_id : Search by kelas_id, \*\*required
- page : number of page, default 1
- size : size per page, default 10

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "nim": "43320004",
      "nama_mahasiswa": "Rifka Anggun Puspitaningrum",
      "jurusan": "Teknik Elektro",
      "prodi": "Teknik Informatika",
      "kelas": "IK-3A",
      "rekapitulasi": [
        { "hadir": 18 },
        { "sakit": 1 },
        { "izin": 2 },
        { "alpha": 3 }
      ]
    },
    ...
  ],
  "paging": {
    "page": 1,
    "total_page": 3,
    "total_item": 30
  }
}
```

## Rekap Presensi List Mata Kuliah Tiap Kelas API

Endpoint : GET /api/rekapmahasiswa/:kelasId

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": [
    {
      "mata_kuliah": "PBO",
      "kelas": "IK-3A",
      "kelas_id": "IK-3A",
      "total_pertemuan": 16,
      "rekapitulasi": [
        { "hadir": 18 },
        { "sakit": 1 },
        { "izin": 2 },
        { "alpha": 3 }
      ]
    },
    {
      "id": 2,
      "kelas": "IK-2A",
      "mata_kuliah": "Pemrograman Mobile",
      "total_pertemuan": 12,
      "jadwalPertemuan": [
        {
          "id": 2,
          "hari": "Senin",
          "dosen": "pak anu",
          "nama_mk": "Pemrograman Mobile",
          "kelas": "IK-2A",
          "ruangan": "SB II/1",
          "waktu_realisasi": "format tanggal",
          "jam_mulai": "jam berapa",
          "jam_akhir": "jam berapa",
          "topik_perkuliahan": "topik anu",
          "rekapitulasi": [
            { "hadir": 20 },
            { "sakit": 1 },
            { "izin": 1 },
            { "alpha": 2 }
          ]
        }
      ]
    }
  ],
  "paging": {
    "page": 1,
    "total_page": 3,
    "total_item": 30
  }
}
```
