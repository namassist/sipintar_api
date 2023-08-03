# Tahun Ajaran API Spec

## Search Tahun Ajaran API

Endpoint : GET /api/tahunAjaran

Headers :

- Authorization : token

Query params :

- nama : Search by nama using like, optional
- page : number of page, default 1
- size : size per page, default 10

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "nama": "Gasal 2022/2023"
    },
    {
      "id": 2,
      "nama": "Genap 2022/2023"
    }
  ],
  "paging": {
    "page": 1,
    "total_page": 3,
    "total_item": 30
  }
}
```
