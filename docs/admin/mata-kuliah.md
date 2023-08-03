# Mata Kuliah API Spec

## Search Mata Kuliah API

Endpoint : GET /api/matkul

Headers :

- Authorization : token

Query params :

- kode_mk : Search by kode_mk using like, optional
- nama_mk : Search by nama_mk using like, optional
- page : number of page, default 1
- size : size per page, default 10

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "kode_mk": "PBD",
      "nama_mk": "Pemrograman Basis Data",
      "dosen": "nama dosen siapa",
      "kelas": "IK-3A",
      "tahun ajaran": "Gasal 2022/2023"
    },
    {
      "id": 2,
      "kode_mk": "PBD",
      "nama_mk": "Pemrograman Basis Data",
      "dosen": "Amran Yobioktabera, M. KOM",
      "kelas": "IK-3B",
      "tahun ajaran": "Gasal 2022/2023"
    }
  ],
  "paging": {
    "page": 1,
    "total_page": 3,
    "total_item": 30
  }
}
```

## Create Mata Kuliah API

Endpoint : POST /api/matkul

Headers :

- Authorization : token

Request Body :

```json
{
  "kode_mk": "PBD-IK3A-Genap2022/2023",
  "nama_mk": "Pemrograman Basis Data",
  "dosen_id": 1,
  "kelas_id": 2,
  "tahun ajaran_id": 2
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "kode_mk": "PBD",
    "nama_mk": "Pemrograman Basis Data",
    "dosen": "Amran Yobioktabera, M. KOM",
    "kelas": "IK-3B",
    "tahun ajaran": "Gasal 2022/2023"
  }
}
```

Response Body Error :

```json
{
  "errors": "Mata Kuliah sudah ada"
}
```

## Update Mata Kuliah API

Endpoint : PUT /api/matkul/:id

Headers :

- Authorization : token

Request Body :

```json
{
  "kode_mk": "PBD-IK3A-Genap2022/2023",
  "nama_mk": "Pemrograman Basis Data",
  "dosen_id": 1,
  "kelas_id": 2,
  "tahun ajaran_id": 2
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "kode_mk": "PBD",
    "nama_mk": "Pemrograman Basis Data",
    "dosen": "Amran Yobioktabera, M. KOM",
    "kelas": "IK-3B",
    "tahun ajaran": "Gasal 2022/2023"
  }
}
```

Response Body Error :

```json
{
  "errors": "Mata Kuliah sudah ada"
}
```

## Get Mata Kuliah API

Endpoint : GET /api/matkul/:id

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "kode_mk": "PBD",
    "nama_mk": "Pemrograman Basis Data",
    "dosen": "Amran Yobioktabera, M. KOM",
    "kelas": "IK-3B",
    "tahun ajaran": "Gasal 2022/2023"
  }
}
```

Response Body Error :

```json
{
  "errors": "Mata Kuliah tidak ditemukan"
}
```

## Remove Mata Kuliah API

Endpoint : DELETE /api/matkul/:id

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
  "errors": "Mata Kuliah tidak ditemukan"
}
```
