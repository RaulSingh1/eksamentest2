# Issue Board (Forslag)

Dette er et komplett forslag til saker for GitHub Issues/Project board.
Bruk kolonner: `Backlog`, `To do`, `In progress`, `Review`, `Done`.

## Labels
- `type:feature`
- `type:bug`
- `type:security`
- `type:docs`
- `type:infra`
- `type:test`
- `priority:P1`
- `priority:P2`
- `priority:P3`

## Sprint 1 (må være på plass)

| ID | Prioritet | Type | Tittel | Definition of done |
|---|---|---|---|---|
| ISS-001 | P1 | infra | Sikre MongoDB-port (ikke åpen for alle) | UFW tillater kun `10.12.13.199 -> 27017`, testet med `nc` (tillat/blokker) |
| ISS-002 | P1 | security | Verifisere at admin ikke er eksponert eksternt | Test fra ekstern klient gir blokkert tilgang til `/admin`, dokumentert med skjermbilde |
| ISS-003 | P1 | feature | Stabil kjøring med systemd på Node VM | `vind-il.service` kjører, restart etter reboot verifisert |
| ISS-004 | P1 | feature | Oppdatere `.env`-oppsett for VM-drift | `.env` i Node VM peker til riktig `MONGO_URI`, app starter uten feil |
| ISS-005 | P1 | test | Kritisk funksjonstest av brukerflyt | Register/login, opprett turnering, opprett kamp, meld på/av kamp, resultatføring = PASS |
| ISS-006 | P1 | docs | Fullføre testprotokoll med bevis | `docs/TESTPROTOKOLL.md` utfylt med PASS/FAIL + skjermbilder |

## Sprint 2 (kvalitet og sikkerhet)

| ID | Prioritet | Type | Tittel | Definition of done |
|---|---|---|---|---|
| ISS-007 | P2 | security | Legge til rate-limit på login/register | Gjentatte forsøk bremses, testet med flere requests |
| ISS-008 | P2 | security | Stramme `internalOnly` ved proxy-bruk | Kun trust på proxy-header når reverse proxy er i bruk |
| ISS-009 | P2 | feature | Av/på visning av resultater for publikum | Konfigurerbar visning: kun kampoppsett eller kampoppsett+resultat |
| ISS-010 | P2 | feature | Adminvisning av hvem som er påmeldt kamp | Admin kan se liste med navn/e-post per kamp |
| ISS-011 | P2 | docs | Oppdatere arkitekturdiagram med faktisk miljø | Diagram viser faktiske VM-navn/IP (`eksamennd`, `eksamenmg`) |
| ISS-012 | P2 | test | Tilgangstester for roller | `viewer` får ikke admin, admin-roller får admin, dokumentert |

## Sprint 3 (drift og leveranse)

| ID | Prioritet | Type | Tittel | Definition of done |
|---|---|---|---|---|
| ISS-013 | P2 | infra | Backup/restore MongoDB-prosedyre | `mongodump` og restore testet i testmiljø, dokumentert steg for steg |
| ISS-014 | P2 | infra | Health-check og overvåking | Enkelt oppsett (service status + port check), dokumentert rutine |
| ISS-015 | P2 | docs | Brukerveiledning med skjermbilder | Frivillig kan følge guide uten hjelp, testet av 1 person |
| ISS-016 | P2 | docs | Endelig oppgavesjekk mot alle krav | `docs/OPPGAVE_SJEKKLISTE.md` komplett avkrysset |
| ISS-017 | P3 | feature | Forbedre feilmeldinger i UI | Brukervennlige meldinger ved 403/404/500 |
| ISS-018 | P3 | test | Enkel regresjonssjekkliste før demo | Fast sjekkliste kjøres før presentasjon |

## Bugs (nåværende)

| ID | Prioritet | Type | Tittel | Definition of done |
|---|---|---|---|---|
| BUG-001 | P1 | bug | 404 ved feilnavigasjon til `/matches/:id` | Fallback-ruter verifisert og testet i nettleser |
| BUG-002 | P1 | bug | Port 3000 i bruk (`EADDRINUSE`) ved lokal testing | Standard rutine dokumentert: stopp gammel prosess/start på nytt |

## Dokumentasjonsoppgaver for innlevering

| ID | Prioritet | Type | Tittel | Definition of done |
|---|---|---|---|---|
| DOC-001 | P1 | docs | ER-diagram klart og forståelig | `docs/ER_DIAGRAM.md` er enkelt forklart + mermaid |
| DOC-002 | P1 | docs | IP-plan + nettverk oppdatert | `docs/IP_NETTVERK_AKTUELL.md` matcher faktisk oppsett |
| DOC-003 | P1 | docs | Oppgavebesvarelse konsistent med kode | `docs/OPPGAVEBESVARELSE.md` matcher faktiske modeller/ruter |
| DOC-004 | P1 | docs | README med mermaid-diagrammer | `README.md` inneholder arkitektur, ER og brukerflyt |

## Forslag til GitHub Milestones
- `M1 - Klar for intern test`
- `M2 - Klar for driftstest`
- `M3 - Klar for innlevering`

## Forslag til første 5 issues du oppretter nå
1. `ISS-001 Sikre MongoDB-port`
2. `ISS-002 Admin ikke eksponert eksternt`
3. `ISS-003 systemd for Node app`
4. `ISS-005 Kritisk funksjonstest`
5. `DOC-002 IP-plan + nettverk oppdatert`
