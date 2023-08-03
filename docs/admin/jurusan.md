# Jurusan API Spec

## Search Prodi API

Endpoint : GET /api/jurusan

Headers :

- Authorization : token

Query params :

- nama_jurusan : Search by nama_jurusan using like, optional
- page : number of page, default 1
- size : size per page, default 10

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "nama_jurusan": "Teknik Elektro"
    },
    {
      "id": 2,
      "nama_jurusan": "Teknik Sipil"
    }
  ],
  "paging": {
    "page": 1,
    "total_page": 3,
    "total_item": 30
  }
}
```

## Create Jurusan API

Endpoint : POST /api/jurusan

Headers :

- Authorization : token

Request Body :

```json
{
  "nama_jurusan": "jurusan apa"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "nama_jurusan": "jurusan apa"
  }
}
```

Response Body Error :

```json
{
  "errors": "jurusan sudah ada"
}
```

## Update Jurusan API

Endpoint : PUT /api/jurusan/:id

Headers :

- Authorization : token

Request Body :

```json
{
  "nama_jurusan": "jurusan apa"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "nama_jurusan": "jurusan apa"
  }
}
```

Response Body Error :

```json
{
  "errors": "jurusan sudah ada"
}
```

## Get Jurusan API

Endpoint : GET /api/jurusan/:id

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "nama_jurusan": "jurusan apa"
  }
}
```

Response Body Error :

```json
{
  "errors": "jurusan tidak ditemukan"
}
```

## Remove Jurusan API

Endpoint : DELETE /api/jurusan/:id

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
  "errors": "Jurusan tidak ditemukan"
}
```
