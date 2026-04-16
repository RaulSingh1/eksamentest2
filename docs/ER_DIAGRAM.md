# ER-diagram for databasen

## Superenkel forklaring
Tenk at databasen er 6 bokser:

1. `USER`: kontoer som kan logge inn (admin og vanlige deltakere).
2. `TEAM`: lag i klubben.
3. `PLAYER`: spillere som hører til et lag.
4. `TOURNAMENT`: turneringer som opprettes.
5. `MATCH`: kamper i en turnering, mellom to lag.
6. `MATCH_SIGNUP`: kobling som sier at en bruker har meldt seg på en kamp.
7. `ADMIN_NOTIFICATION`: varsler til admin når turneringer mangler resultater.

## Hva betyr pilene mellom boksene?
- Én `TEAM` kan ha mange `PLAYER`.
- Én `TOURNAMENT` kan ha mange `MATCH`.
- Én `MATCH` har ett hjemmelag og ett bortelag (begge peker til `TEAM`).
- Én `USER` kan melde seg på mange `MATCH` via `MATCH_SIGNUP`.
- Én `MATCH` kan ha mange påmeldte `USER` via `MATCH_SIGNUP`.
- Én `TOURNAMENT` kan ha ett eller flere `ADMIN_NOTIFICATION`-varsel.

## Hva betyr ordene?
- `PK`: unik hoved-ID for en boks.
- `FK`: peker til ID i en annen boks.
- `UNIQUE`: må være unik verdi (for eksempel e-post).
- `string`: tekst.
- `date`: dato/tid.
- `boolean`: ja/nei (`true`/`false`).
- `number`: tall.

```mermaid
erDiagram
  USER ||--o{ MATCH_SIGNUP : "melder_seg_pa"
  TEAM ||--o{ PLAYER : "har"
  TOURNAMENT ||--o{ MATCH : "har"
  TEAM ||--o{ MATCH : "er_hjemmelag"
  TEAM ||--o{ MATCH : "er_bortelag"
  MATCH ||--o{ MATCH_SIGNUP : "har_pameldinger"

  USER {
    ObjectId _id PK
    string name
    string email UNIQUE
    string passwordHash
    string role
    date createdAt
    date updatedAt
  }

  TEAM {
    ObjectId _id PK
    string name
    string ageGroup
    string managerName
    string contactPersonName
    string contactPersonPhone
    date createdAt
    date updatedAt
  }

  PLAYER {
    ObjectId _id PK
    ObjectId teamId FK
    string firstName
    string lastName
    date birthDate
    string guardianName
    string guardianPhone
    boolean consentPhoto
    date createdAt
    date updatedAt
  }

  TOURNAMENT {
    ObjectId _id PK
    string title
    string sport
    date startDate
    date endDate
    string location
    string status
    date createdAt
    date updatedAt
  }

  MATCH {
    ObjectId _id PK
    ObjectId tournamentId FK
    ObjectId homeTeamId FK
    ObjectId awayTeamId FK
    date kickoff
    string venue
    string status
    number homeScore
    number awayScore
    date createdAt
    date updatedAt
  }

  MATCH_SIGNUP {
    ObjectId _id PK
    ObjectId matchId FK
    ObjectId userId FK
    date createdAt
    date updatedAt
  }

  ADMIN_NOTIFICATION {
    ObjectId _id PK
    ObjectId tournamentId FK
    string kind
    string tournamentTitle
    string message
    number pendingMatchCount
    date dueAt
    date lastCheckedAt
    date resolvedAt
    date createdAt
    date updatedAt
  }
```

## Enkelt eksempel (i praksis)
1. Admin oppretter `TOURNAMENT` = \"Håndball Vår 2026\".
2. Admin oppretter to lag i `TEAM` = \"Vind Blå\" og \"Vind Rød\".
3. Admin lager en `MATCH` med de to lagene.
4. En vanlig bruker oppretter konto i `USER`.
5. Brukeren trykker \"Meld meg på\".
6. Da lagres en linje i `MATCH_SIGNUP` med:
   - `userId` = hvem meldte seg på
   - `matchId` = hvilken kamp

## Notat
- `MATCH_SIGNUP` har unik indeks på `(matchId, userId)`, så samme bruker ikke kan melde seg på samme kamp flere ganger.
