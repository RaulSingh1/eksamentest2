# Nettverksdiagram

```mermaid
flowchart LR
  Internet[(Internett)]
  SchoolNet[(Skolenett / VPN)]

  NodeVM["Node.js VM\neksamennd\n10.12.13.199\nPort 3000"]
  MongoVM["MongoDB VM\neksamenmg\n10.12.13.230\nPort 27017"]

  Internet -->|HTTP/HTTPS til app| NodeVM
  SchoolNet -->|Admin-tilgang| NodeVM
  NodeVM -->|Mongo-tilkobling 27017| MongoVM

  Internet -. blokkert .->|Ingen direkte DB-tilgang| MongoVM
```

## Forklaring
- Node.js VM (`10.12.13.199`) hoster nettsiden på port `3000`.
- MongoDB VM (`10.12.13.230`) hoster databasen på port `27017`.
- Kun Node.js VM skal snakke direkte med MongoDB.
- Admin skal bruke skolenett/VPN for admin-funksjoner.
