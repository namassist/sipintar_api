# Kelas API Spec

## Search Kelas API

Endpoint : GET /api/kelas

Headers :

- Authorization : token

Query params :

- nama_kelas : Search by nama_kelas using like, optional
- prodi_id : Search by prodi_id using like, optional
- page : number of page, default 1
- size : size per page, default 10

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "nama_kelas": "IK3A",
      "tahun_ajaran": "Gasal 2022/2023",
      "prodi": "Teknik Informatika"
    },
    {
      "id": 2,
      "nama_kelas": "Teknik Informatika",
      "tahun_ajaran": "Gasal 2022/2023",
      "prodi": "Teknik Informatika"
    }
  ],
  "paging": {
    "page": 1,
    "total_page": 3,
    "total_item": 30
  }
}
```
