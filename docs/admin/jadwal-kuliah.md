# Jadwal Kuliah API Spec

## Search Jadwal Kuliah API

Endpoint : GET /api/jadwalKuliah

Headers :

- Authorization : token

Query params :

- jurusan_id : Search by jurusan_id, \*\*required
- prodi_id : Search by prodi_id, \*\*required
- kelas_id : Search by kelas_id, \*\*required
- tahun_ajaran_id : Search by tahun_ajaran_id, \*\*required
- page : number of page, default 1
- size : size per page, default 10

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "jam_mulai": "09.00",
      "jam_akhir": "10.30",
      "hari": "Senin",
      "dosen": "dosen anu",
      "mata_kuliah": "Pemrograman Basis Data",
      "kode_mk": "PBD",
      "ruangan": "SB II/1"
    },
    {
      "id": 2,
      "jam_mulai": "10.30",
      "jam_akhir": "12.00",
      "hari": "Senin",
      "dosen": "dosen anu",
      "mata_kuliah": "Pemrograman Web Dasar",
      "kode_mk": "PWS",
      "ruangan": "SB II/2"
    }
  ],
  "paging": {
    "page": 1,
    "total_page": 3,
    "total_item": 30
  }
}
```

## Create Jadwal Kuliah API

Endpoint : POST /api/jadwalKuliah

Headers :

- Authorization : token

Request Body :

```json
[
  {
    "hari": "Senin",
    "jam_mulai": "10:30",
    "jam_akhir": "12:00",
    "dosen_id": 1,
    "mata_kuliah": "Pemrograman Web Dasar",
    "kode_mk": "PWS",
    "ruangan": "SB II/2",
    "total_jam_kuliah": "2",
    "kelas_id": 1,
    "tahun_ajaran_id": 2
  },
  {
    "hari": "Senin",
    "jam_mulai": "12:45",
    "jam_akhir": "14:15",
    "dosen_id": 1,
    "mata_kuliah": "Sistem Terbenam",
    "kode_mk": "ST",
    "ruangan": "SB I/2",
    "total_jam_kuliah": "2",
    "kelas_id": 1,
    "tahun_ajaran_id": 2
  },
  ....
]
```

Response Body Success :

```json
{
  "data": [
  {
    "id": 1,
    "hari": "Senin",
    "jam_mulai": "10:30",
    "jam_akhir": "12:00",
    "dosen": "dosen anu",
    "mata_kuliah": "Pemrograman Web Dasar",
    "kode_mk": "PWS",
    "ruangan": "SB II/2",
    "total_jam_kuliah": "2",
    "kelas_id": 1,
    "tahun_ajaran_id": 2
  },
  {
    "id": 2,
    "hari": "Senin",
    "jam_mulai": "12:45",
    "jam_akhir": "14:15",
    "dosen": "dosen inu",
    "mata_kuliah": "Sistem Terbenam",
    "kode_mk": "ST",
    "ruangan": "SB I/2",
    "total_jam_kuliah": "2",
    "kelas_id": 1,
    "tahun_ajaran_id": 2
  },
  ....
]
}
```

Response Body Error :

```json
{
  "errors": "jadwal kuliah sudah ada"
}
```

## Update Jadwal Kuliah API

Endpoint : PUT /api/jadwalKuliah/:id

Headers :

- Authorization : token

Request Body :

```json
{
    "hari": "Senin",
    "jam_mulai": "10:30",
    "jam_akhir": "12:00",
    "dosen_id": 1,
    "mata_kuliah": "Pemrograman Web Dasar",
    "kode_mk": "PWS",
    "ruangan": "SB II/2",
    "total_jam_kuliah": "2",
    "kelas_id": 1,
    "tahun_ajaran_id": 2
},
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "hari": "Senin",
    "jam_mulai": "10:30",
    "jam_akhir": "12:00",
    "dosen": "dosen anu",
    "mata_kuliah": "Pemrograman Web Dasar",
    "kode_mk": "PWS",
    "ruangan": "SB II/2",
    "total_jam_kuliah": "2",
    "kelas_id": 1,
    "tahun_ajaran_id": 2
  }
}
```

Response Body Error :

```json
{
  "errors": "jadwal kuliah sudah ada"
}
```

## Get Jadwal Kuliah API

Endpoint : GET /api/jadwalKuliah/:id

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "hari": "Senin",
    "jam_mulai": "10:30",
    "jam_akhir": "12:00",
    "dosen": "dosen anu",
    "mata_kuliah": "Pemrograman Web Dasar",
    "kode_mk": "PWS",
    "ruangan": "SB II/2",
    "total_jam_kuliah": "2",
    "kelas_id": 1,
    "tahun_ajaran_id": 2
  }
}
```

Response Body Error :

```json
{
  "errors": "Jadwal Kuliah tidak ditemukan"
}
```

## Remove Jadwal Kuliah API

Endpoint : DELETE /api/jadwalKuliah/:id

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "Jadwal Kuliah tidak ditemukan"
}
```
