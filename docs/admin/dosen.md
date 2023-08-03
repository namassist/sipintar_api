# Dosen API Spec

## Search Dosen API

Endpoint : GET /api/mahasiswa

Headers :

- Authorization : token

Query params :

- nama_dosen : Search by nama_dosen using like, optional
- page : number of page, default 1
- size : size per page, default 10

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "nama_dosen": "Rifka Anggun Puspitaningrum",
      "nip": "12345678",
      "jurusan": "Teknik Elektro"
    },
    {
      "id": 2,
      "nama_dosen": "Talitha",
      "nip": "987654321",
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

## Create Dosen API

Endpoint : POST /api/dosen

Headers :

- Authorization : token

Request Body :

```json
{
  "nama_dosen": "Rifka Anggun Puspitaningrum",
  "nip": "12345678",
  "jurusan_id": 1,
  "password": "rahasia"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "nama_dosen": "Rifka Anggun Puspitaningrum",
    "nip": "12345678",
    "jurusan": "Teknik Elektro",
    "password": "hash password"
  }
}
```

Response Body Error :

```json
{
  "errors": "Dosen sudah ada"
}
```

## Update Dosen API

Endpoint : PUT /api/dosen/:id

Headers :

- Authorization : token

Request Body :

```json
{
  "nama_dosen": "Rifka Anggun Puspitaningrum",
  "nip": "12345678",
  "jurusan_id": 2,
  "password": "rahasia"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "nama_dosen": "Rifka Anggun Puspitaningrum",
    "nip": "12345678",
    "jurusan": "Teknik Elektro",
    "password": "rahasia"
  }
}
```

Response Body Error :

```json
{
  "errors": "Dosen sudah ada"
}
```

## Get Dosen API

Endpoint : GET /api/dosen/:id

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "nama_dosen": "Rifka Anggun Puspitaningrum",
    "nip": "12345678",
    "jurusan": "Teknik Elektro",
    "password": "rahasia"
  }
}
```

Response Body Error :

```json
{
  "errors": "Dosen tidak ditemukan"
}
```

## Remove Dosen API

Endpoint : DELETE /api/dosen/:id

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
  "errors": "Dosen tidak ditemukan"
}
```
