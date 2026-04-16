# Vind IL Turneringssystem

Et turneringssystem med Node.js og MongoDB, kjrt p to separate VM-er i Proxmox.

## Kort om prosjektet

Systemet lar administratorer opprette turneringer, lag, deltakere og kamper, mens publikum kan se kampoppsett og resultater. Deltakere kan logge inn og se egne opplysninger og egne påmeldinger.

## Faktisk oppsett

- Node.js VM: `eksamennd` - `10.12.13.199`
- MongoDB VM: `eksamenmg` - `10.12.13.230`
- Node-app: port `3000`
- MongoDB: port `27017`

## Diagram: Nettverk

![Nettverksdiagram](docs/network-diagram.svg)

Diagrammet viser bare nettverket:
- Publikum og admin kobler til Node.js VM
- Node.js VM kobler videre til MongoDB
- MongoDB er ikke direkte tilgjengelig fra internett

## Hvorfor dette oppsettet

- App og database ligger på hver sin VM for å redusere angrepsflaten.
- Kun Node-VM skal snakke direkte med MongoDB.
- MongoDB skal ikke være direkte tilgjengelig fra internett.
- Admin-funksjoner skal bare være tilgjengelige fra skolenett eller VPN.
- Oppsettet følger prinsippet om minste privilegium.

## Tjenester

- `3000/tcp` brukes av Node/Express-appen.
- `27017/tcp` er standardporten til MongoDB.

## Roller

- `superadmin`
- `turneringsleder`
- `lagleder`
- `viewer`

## Hovedfunksjoner

- Opprette og administrere turneringer
- Opprette lag med kontaktperson
- Registrere deltakere
- Opprette kamper og registrere resultater
- Se kampoppsett og resultater offentlig
- Se egne opplysninger som innlogget deltaker

## Sikkerhet

- SSH-tilgang er satt opp med public keys.
- Admin-ruter er beskyttet med intern nettverkstilgang og innlogging.
- MongoDB er kun ment for appserveren.
- Deltakere ser bare egne data, ikke andres personinformasjon.

## Oppstart lokalt

1. Kopier miljøfil:

   ```bash
   cp .env.example .env
   ```

2. Installer pakker:

   ```bash
   npm install
   ```

3. Lag admin-bruker:

   ```bash
   npm run seed-admin
   ```

4. Start appen:

   ```bash
   npm start
   ```

Appen kjrer p `http://localhost:3000`.

## Viktige ruter

- Offentlig side: `/`
- Innlogging: `/auth/login`
- Registrering: `/auth/register`
- Min side: `/me`
- Adminpanel: `/admin`

## Dokumentasjon

- [Nettverksdiagram og IP-plan](docs/IP_NETTVERK_AKTUELL.md)
- [Ekstra diagram med segmenteringsforslag](docs/NETTVERK_IPPLAN_SEGMENTERING.md)
- [Sikkerhetsanalyse](docs/SIKKERHETSANALYSE.md)
- [ER-diagram](docs/ER_DIAGRAM.md)
- [Testprotokoll](docs/TESTPROTOKOLL.md)

## Admin-konto

Standard adminbruker opprettes med:
- e-post: `admin@vindil.local`
- passord: `ChangeMe123!`

Disse verdiene kan overstyres i `.env`.
