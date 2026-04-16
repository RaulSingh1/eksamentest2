# Nettverksdiagram

```mermaid
flowchart LR
  Internet[(Internett)]
  SchoolNet[(Skolenett / VPN)]

  NodeVM["Node.js VM\neksamennd.vind.lan\n10.12.13.199\nPort 3000"]
  MongoVM["MongoDB VM\neksamenmg.vind.lan\n10.12.13.230\nPort 27017"]
  DNS["DNS\n10.12.13.10\nvind.lan"]

  Internet -->|HTTP/HTTPS til app| NodeVM
  SchoolNet -->|Admin-tilgang| NodeVM
  NodeVM -->|Mongo-tilkobling 27017| MongoVM
  DNS -->|Navn-oppslag| NodeVM
  DNS -->|Navn-oppslag| MongoVM

  Internet -. blokkert .->|Ingen direkte DB-tilgang| MongoVM
```

## Forklaring
- Node.js VM (`eksamennd.vind.lan` / `10.12.13.199`) hoster nettsiden på port `3000`.
- MongoDB VM (`eksamenmg.vind.lan` / `10.12.13.230`) hoster databasen på port `27017`.
- DNS-serveren (`10.12.13.10`) brukes til å slå opp `eksamennd.vind.lan` og `eksamenmg.vind.lan`.
- Kun Node.js VM skal snakke direkte med MongoDB.
- Admin skal bruke skolenett/VPN for admin-funksjoner.
