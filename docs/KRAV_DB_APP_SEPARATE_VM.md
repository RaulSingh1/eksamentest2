# Krav: Database og applikasjon på hver sin maskin

## Status
Ja, kravet er oppfylt.

## Oppsett
- Applikasjon (Node.js): `eksamennd` (`10.12.13.199`)
- Database (MongoDB): `eksamenmg` (`10.12.13.230`)

Dette betyr at app og database kjører på to forskjellige VM-er i nettverket.

## Tekst du kan skrive i oppgaven
"Løsningen er distribuert med Node.js-applikasjon på VM `eksamennd (10.12.13.199)` og MongoDB-database på VM `eksamenmg (10.12.13.230)`. Applikasjonen kobler til databasen over internnett på port `27017`. Dermed er databasen og applikasjonen separert på hver sin maskin, slik kravet sier."

## Hvordan vise dette til lærer (live)

### 1) Vis at appen peker til Mongo-VM (på Node-VM)
```bash
cat ~/eksamen102/.env | grep MONGO_URI
```
Forventet: IP `10.12.13.230` i `MONGO_URI`.

### 2) Vis at MongoDB kjører (på Mongo-VM)
```bash
sudo systemctl status mongod --no-pager
```
Forventet: `active (running)`.

### 3) Vis nettverkskobling Node -> Mongo (på Node-VM)
```bash
nc -zv 10.12.13.230 27017
```
Forventet: tilkobling OK/succeeded.

### 4) Vis at appen kjører på Node-VM
```bash
ss -lntp | grep 3000
```
Forventet: tjeneste lytter på port `3000`.

## Bevis du kan legge ved i rapport
- Skjermbilde av `.env` med `MONGO_URI` mot `10.12.13.230`
- Skjermbilde av `systemctl status mongod`
- Skjermbilde av `nc -zv 10.12.13.230 27017`
- Skjermbilde av `ss -lntp | grep 3000`
