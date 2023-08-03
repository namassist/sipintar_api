# Program Studi API Spec

## Search Prodi API

Endpoint : GET /api/prodi

Headers :

- Authorization : token

Query params :

- nama_prodi : Search by nama_prodi using like, optional
- jurusan_id : Search by jurusan_id using like, optional
- page : number of page, default 1
- size : size per page, default 10

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "nama_prodi": "Teknik Informatika",
      "kode_prodi": "IK",
      "jurusan": "Teknik Elektro"
    },
    {
      "id": 2,
      "nama_prodi": "Teknologi Rekayasa Komputer",
      "kode_prodi": "TI",
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

## Create Prodi API

Endpoint : POST /api/prodi

Headers :

- Authorization : token

Request Body :

```json
{
  "nama_prodi": "prodi apa",
  "kode_prodi": "kode prodi apa",
  "jurusan_id": 1
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "nama_prodi": "prodi apa",
    "kode_prodi": "kode prodi apa",
    "jurusan": "nama jurusan apa"
  }
}
```

Response Body Error :

```json
{
  "errors": "prodi sudah ada"
}
```

## Update prodi API

Endpoint : PUT /api/prodi/:id

Headers :

- Authorization : token

Request Body :

```json
{
  "nama_prodi": "prodi apa",
  "kode_prodi": "kode prodi apa",
  "jurusan_id": 1
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "nama_prodi": "prodi apa",
    "kode_prodi": "kode prodi apa",
    "jurusan": "nama jurusan apa"
  }
}
```

Response Body Error :

```json
{
  "errors": "prodi sudah ada"
}
```

## Get Prodi API

Endpoint : GET /api/prodi/:id

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "nama_prodi": "prodi apa",
    "kode_prodi": "kode prodi apa",
    "jurusan": "nama jurusan apa"
  }
}
```

Response Body Error :

```json
{
  "errors": "prodi tidak ditemukan"
}
```

## Remove Prodi API

Endpoint : DELETE /api/prodi/:id

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
  "errors": "Prodi tidak ditemukan"
}
```
