# Mahasiswa API Spec

## Search Mahasiswa API

Endpoint : GET /api/mahasiswa

Headers :

- Authorization : token

Query params :

- nama_mahasiswa : Search by nama_mahasiswa using like, optional
- page : number of page, default 1
- size : size per page, default 10

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "nama_mahasiswa": "Rifka Anggun Puspitaningrum",
      "nim": "33420021",
      "kelas": "IK-3A",
      "prodi": "Teknik Informatika",
      "jurusan": "Teknik Elektro"
    },
    {
      "id": 2,
      "nama_mahasiswa": "Talitha",
      "nim": "33420023",
      "kelas": "IK-3A",
      "prodi": "Teknik Informatika",
      "jurusan": "Teknik Elektro"
    }
  ],
  "paging": {
    "page": 1,
    "total_page": 3,
    "total_item": 30
  }
}
```

## Create Mahasiswa API

Endpoint : POST /api/Mahasiswa

<!--
Headers :

- Authorization : token -->

Request Body :

```json
{
  "nama_mahasiswa": "Rifka Anggun Puspitaningrum",
  "nim": "33420021",
  "kelas_id": 2,
  "password": "rahasia"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "nama_mahasiswa": "Rifka Anggun Puspitaningrum",
    "nim": "33420021",
    "kelas": "IK-3A",
    "password": "hash password"
  }
}
```

Response Body Error :

```json
{
  "errors": "Mahasiswa sudah ada"
}
```

## Update Mahasiswa API

Endpoint : PUT /api/mahasiswa/:id

Headers :

- Authorization : token

Request Body :

```json
{
  "nama_mahasiswa": "Rifka Anggun Puspitaningrum",
  "nim": "33420021",
  "kelas_id": 3,
  "password": "rahasia"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "nama_mahasiswa": "Rifka Anggun Puspitaningrum",
    "nim": "33420021",
    "kelas": "IK-3A",
    "tahun_ajaran": "Genap 2022/2023",
    "password": "hash password"
  }
}
```

Response Body Error :

```json
{
  "errors": "Mahasiswa sudah ada"
}
```

## Get Mahasiswa API

Endpoint : GET /api/mahasiswa/:id

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "nama_mahasiswa": "Rifka Anggun Puspitaningrum",
    "nim": "33420021",
    "kelas": "IK-3A",
    "tahun_ajaran": "Genap 2022/2023",
    "password": "hash password"
  }
}
```

Response Body Error :

```json
{
  "errors": "jurusan tidak ditemukan"
}
```

## Remove Mahasiswa API

Endpoint : DELETE /api/mahasiswa/:id

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
  "errors": "Mahasiswa tidak ditemukan"
}
```
