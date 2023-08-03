# Role Dosen API Spec

## Get Mata Kuliah Dosen API

Endpoint : GET /api/dosen/:id/matkul

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": [
    {
      "nama_mk": "Pemrograman Basis Data",
      "kode_mk": "PBD",
      "kelas": "IK-3A",
      "tahun_ajaran": "Gasal 2022/2023",
      "jadwalPertemuan": [
        {
          "id": 1,
          "hari": "Senin",
          "dosen": "pak anu",
          "nama_mk": "Pemrograman Basis Data",
          "kelas": "IK-3A",
          "ruangan": "SB II/1",
          "waktu_realisasi": "jamber",
          "topik_perkuliahan": "topik anu",
          "qr_code": "base64:xxx",
          "status": false
        }
      ]
    },
    {
      "nama_mk": "Pemrograman Web",
      "kode_mk": "PBD",
      "kelas": "IK-3A",
      "tahun_ajaran": "Genap 2022/2023",
      "jadwalPertemuan": [
        {
          "id": 1,
          "hari": "Senin",
          "dosen": "pak anu",
          "nama_mk": "Pemrograman Basis Data",
          "kelas": "IK-3A",
          "ruangan": "SB II/1",
          "waktu_realisasi": "jamber",
          "topik_perkuliahan": "topik anu",
          "qr_code": "base64:xxx",
          "status": false
        }
      ]
    }
  ]
}
```

## Get QR Code API

Endpoint : GET /api/dosen/:id/jadwalPertemuan/:id/qrCode

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": [
    {
      "qr_code": "base64:xxx",
      "status": true
    },
    {
      "qr_code": "base64:xxx",
      "status": false
    }
  ]
}
```

## Get Rekap Presensi Mahasiswa Jadwal Pertemuan API

Endpoint : GET /api/dosen/:id/jadwalPertemuan/:id/presensi

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "nama_mahasiswa": "Rifka Anggun Puspitaningrum",
      "nim": "33420021",
      "waktu_presensi": "jam anu",
      "status": "HADIR",
      "total_jam_perkuliahan": "6"
    },
    {
      "id": 2,
      "nama_mahasiswa": "Rifka Anggun Puspitaningrum",
      "nim": "33420021",
      "waktu_presensi": "jam anu",
      "status": "HADIR",
      "total_jam_perkuliahan": "6"
    }
  ]
}
```

## Delete Status Presensi Mahasiswa API

Endpoint : GET /api/dosen/:id/jadwalPertemuan/:id/presensi/:id

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
  "errors": "Presensi Mahasiswa tidak ditemukan"
}
```
