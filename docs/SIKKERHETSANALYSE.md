# Sikkerhetsanalyse av løsningen

Denne analysen beskriver sikkerheten i løsningen som en helhet, med fokus på:
- applikasjon
- nettverk
- enkeltmaskiner/VM-er
- risiko som gjenstår
- hva jeg kan forklare muntlig til lærer/sensor

## 1. Kort beskrivelse av løsningen

Løsningen består av to separate VM-er:
- `eksamennd` med Node.js-applikasjon på `10.12.13.199`
- `eksamenmg` med MongoDB på `10.12.13.230`

Applikasjonen kjører på port `3000`, og databasen lytter på port `27017`.

Hovedideen er at brukere skal gå til applikasjonen, mens databasen ikke skal være direkte tilgjengelig fra internett.

## 2. Hva som skal beskyttes

De viktigste verdiene i systemet er:
- persondata om brukere og deltakere
- kampoppsett og resultater
- admin-tilgang og rettigheter
- driftstabilitet og tilgjengelighet

Hvis disse verdiene blir kompromittert, kan det føre til:
- datalekkasje
- endring eller sletting av resultater
- misbruk av admin-funksjoner
- nedetid

## 3. Trusselbilde

De viktigste truslene i denne løsningen er:

### 3.1 Uautorisert tilgang til databasen
MongoDB inneholder data som ikke skal være offentlig tilgjengelig. Hvis databasen eksponeres direkte mot internett, kan noen forsøke:
- brute force mot brukernavn og passord
- å lese data uten godkjenning
- å endre eller slette informasjon

### 3.2 Uautorisert tilgang til admin-funksjoner
Admin-funksjoner har høyere rettigheter enn vanlige brukere. Hvis de blir eksponert, kan en angriper:
- opprette eller slette lag og turneringer
- endre resultater
- få kontroll over systemet

### 3.3 Sårbarheter i applikasjonen
Selv om nettverket er riktig satt opp, kan applikasjonen ha feil som:
- manglende validering av input
- dårlig autentisering eller autorisasjon
- feil i session-håndtering
- injeksjonssårbarheter hvis data ikke håndteres riktig

### 3.4 Kompromittering av en VM
Hvis én VM blir kompromittert, skal ikke hele systemet falle sammen. Derfor er app og database delt.

### 3.5 Tilgjengelighetsangrep
Systemet kan også bli utsatt for:
- mye trafikk
- feilkonfigurasjon
- tjenestenedbrudd

## 4. Sikkerhetstiltak som er valgt

### 4.1 Separasjon av app og database
Applikasjonen kjører på én VM, og databasen på en annen.

Dette gir:
- mindre angrepsflate
- bedre kontroll på trafikk
- bedre isolasjon ved feil

Hvis applikasjonen blir kompromittert, er ikke databasen direkte eksponert på samme maskin.

### 4.2 Begrenset nettverkstilgang
Trafikk er bare åpnet der den trengs:
- klient -> Node på `3000/tcp`
- Node -> Mongo på `27017/tcp`
27017/tcp er bare porten MongoDB bruker for å snakke med andre maskiner over nettverket.



Alt annet skal blokkeres.

Dette følger prinsippet om minste privilegium:
- brukere får bare tilgang til det de trenger
- databasen er ikke direkte åpen for internett
- admin-funksjoner skal ikke være tilgjengelige for alle

### 4.3 Brannmurregler
Mongo-VM skal bare akseptere trafikk fra Node-VM på `27017`.

Dette er viktig fordi:
- databasen skal kun snakke med applikasjonen
- det hindrer direkte tilgang fra tilfeldige klienter
- det reduserer risiko for misbruk og scanning

### 4.4 SSH-nøkler i stedet for passord
SSH-tilgang er satt opp med public keys på begge VM-er.

Det gir bedre sikkerhet enn passord fordi:
- nøkler er vanskeligere å gjette
- passordangrep blir mindre relevante
- tilgang kan kontrolleres per nøkkel

### 4.5 Admin-tilgang er begrenset
Admin-ruter bør bare være tilgjengelige for skolenett eller VPN.

Dette beskytter mot:
- direkte tilgang fra internett
- misbruk av høyere rettigheter
- utilsiktet endring av data

### 4.6 Innlogging og rollebasert tilgang
Applikasjonen bør bruke roller, for eksempel:
- vanlig bruker
- lagleder
- turneringsleder
- admin

Forskjellige roller skal ha ulike rettigheter.

Det betyr at:
- ikke alle kan gjøre alt
- det blir enklere å kontrollere hvem som kan endre data
- skader ved feilbruk blir mindre

## 5. Analyse per nivå

### 5.1 Applikasjonsnivå

Sterke sider:
- applikasjonen er skilt fra databasen
- data kan kontrolleres gjennom innlogging og roller
- det er lettere å legge sikkerhetsregler i én sentral backend

Risiko:
- feil i kode kan gi tilgang til data
- svake passord eller dårlig session-håndtering kan gi innbrudd
- manglende input-validering kan gi sikkerhetsfeil

Tiltak:
- valider input før lagring
- bruk hash for passord
- sjekk roller før sensitive handlinger
- logg viktige endringer

### 5.2 Nettverksnivå

Sterke sider:
- bare nødvendige porter er åpnet
- databasen er ikke offentlig
- admin skal være begrenset til intern tilgang

Risiko:
- feil i firewall kan åpne for mye
- feil ruter kan gjøre admin tilgjengelig utenfor ønsket nett
- hvis Node blir kompromittert, kan en angriper bruke den videre mot databasen

Tiltak:
- åpne kun portene som trengs
- blokker alt annet som standard
- verifiser at Mongo ikke er eksponert direkte

### 5.3 Maskinnivå

Sterke sider:
- to separate VM-er gjør at feilen er mer isolert
- SSH med nøkler gir tryggere administrasjon

Risiko:
- svake systempassord
- uoppdatert programvare
- feil filrettigheter
- SSH kan bli mål for brute force hvis det står åpent mot mange kilder

Tiltak:
- hold systemene oppdatert
- bruk riktige filrettigheter på `~/.ssh`
- begrens SSH-tilgang
- følg med på systemtjenester og logger

## 6. Hvorfor databasen ikke skal være direkte tilgjengelig

Dette er et viktig sikkerhetspunkt.

MongoDB skal ikke være åpen mot internett fordi:
- databasen inneholder verdifull informasjon
- direkte eksponering øker risikoen for angrep
- all tilgang bør gå gjennom applikasjonen, der tilgang kan styres og logges

Applikasjonen fungerer derfor som et kontrollpunkt mellom brukeren og databasen.

## 7. Hvorfor admin-ruter må beskyttes ekstra

Admin-funksjoner kan endre systemet mer enn vanlige brukere kan.

Derfor må de beskyttes med flere lag:
- nettverksbegrensning
- innlogging
- rollekontroll

Dette er viktig fordi en feil her har større konsekvens enn en feil på vanlig lesetilgang.

## 8. Risiko som fortsatt gjenstår

Selv om løsningen er godt delt opp, finnes det fortsatt risiko:
- applikasjonsfeil kan gi sårbarheter
- en kompromittert Node-VM kan brukes som vei videre
- feilkonfigurasjon av firewall kan åpne for mye
- manglende logging kan gjøre det vanskelig å oppdage angrep

Dette betyr at løsningen er sikret, men ikke «ferdig sikret for alltid».

## 9. Vurdering av løsningen

Totalt sett er løsningen rimelig sikker for et eksamensoppsett fordi:
- app og database er separert på hver sin VM
- databasen er ikke ment å være offentlig
- brannmurreglene følger minste privilegium
- SSH er satt opp med nøkler
- admin-tilgang kan begrenses til intern bruk

Det viktigste sikkerhetsvalget er at databasen ikke er direkte tilgjengelig fra internett.

## 10. Kort muntlig forklaring

Hvis jeg skal forklare dette muntlig, kan jeg si:

"Jeg har valgt å dele løsningen i en Node-VM og en Mongo-VM for å redusere angrepsflaten og isolere databasen. Brukere skal bare nå applikasjonen, mens databasen kun skal nås av appserveren på intern port 27017. Jeg har også begrenset SSH med nøkler og vil ha admin-tilgang bak intern nettverkskontroll. Det betyr at løsningen følger minste privilegium, og at sensitive tjenester ikke er eksponert direkte mot internett."

## 11. Kort sjekkliste før muntlig visning

- Vis at Node-VM og Mongo-VM er på ulike IP-er
- Vis at Mongo kun aksepterer trafikk fra Node
- Vis at Node-appen kjører på `3000`
- Vis at SSH bruker nøkler
- Forklar hvorfor admin og database ikke skal være åpne direkte
