# Testprotokoll (fyll ut før levering)

| ID | Test | Forventet resultat | Faktisk resultat | PASS/FAIL | Bevis (skjermbilde) |
|---|---|---|---|---|---|
| T1 | Åpne forsiden `/` | Turneringsliste vises |  |  |  |
| T2 | Registrer bruker `/auth/register` | Bruker opprettes |  |  |  |
| T3 | Logg inn som viewer | Innlogging ok, ikke admin-tilgang |  |  |  |
| T4 | Meld på kamp | Påmelding registrert |  |  |  |
| T5 | Meld av kamp | Påmelding fjernet |  |  |  |
| T6 | Logg inn som admin | Redirect til `/admin` |  |  |  |
| T7 | Opprett turnering i admin | Turnering lagres og vises |  |  |  |
| T8 | Opprett kamp i admin | Kamp vises i oversikt |  |  |  |
| T9 | Forsøk admin-rute uten riktig tilgang | 403/redirect |  |  |  |
| T10 | Restart app-prosess | App kommer opp igjen |  |  |  |
| T11 | Sjekk Mongo status | `mongod` aktiv |  |  |  |
| T12 | Test Node->Mongo forbindelse | Databasekobling ok |  |  |  |
| T13 | Opprett lag med kontaktperson | Kontaktperson og telefon lagres og vises i admin |  |  |  |
| T14 | Turnering nærmer seg slutt | Admin-dashboard viser varsel hvis resultater mangler |  |  |  |
| T15 | Logg inn som viewer og åpne `Min side` | Bare egne opplysninger og egne påmeldinger vises |  |  |  |

## Godkjenning
- Testet av: __________________
- Dato: __________________
- Kommentar: __________________
