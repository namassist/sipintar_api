# Restfull API Pintar (Polines Information and Attender)

Sebuah Restfull API untuk aplikasi PINTAR untuk sistem absensi mahasiswa di Polines.

## Login User API

Endpoint : ```POST /api/users/login```

Request Body :

```json
{
  "username" : "33420021",
  "password" : "rahasia"
}
```

Response Body Success :

```json
{
  "data" : {
    "acccessToken" : "unique-token"
  },
}
```

Response Body Error :

```json
{
  "errors" : "password salah"
}
```

## Logout User API

Endpoint : ```DELETE /api/users/logout```

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data" : "OK"
}
```

Response Body Error :

```json
{
  "errors" : "Unauthorized"
}
```
