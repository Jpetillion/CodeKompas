# CodeKompas

CodeKompas werd ontwikkeld als hulpmiddel rond spelling en programmeerprincipes in Visual Studio Code (VS Code).

De tool helpt leerlingen mogelijke fouten te onderzoeken met Nederlandstalige aanwijzingen, zonder de oplossing voor te zeggen of hun code automatisch te wijzigen.

**Versie: 4.0.0** · Ondersteunt **HTML, CSS, JavaScript, Python en C#**.

## Vrij gebruiken in de klas

**Leerkrachten mogen CodeKompas vrij en kosteloos gebruiken in hun onderwijspraktijk.** Zij mogen de ongewijzigde extensie aan hun leerlingen bezorgen voor gebruik tijdens lessen en bij opdrachten.

© 2026 Joris Petillion. **Alle rechten voorbehouden**, met uitzondering van de hierboven verleende toestemming voor onderwijsgebruik. Zie `LICENSE` voor de gebruiksvoorwaarden. Voor meegeleverde onderdelen van derden blijven hun eigen licenties gelden; zie `THIRD_PARTY_NOTICES.txt`.

**Vragen:** [joris.petillion@onderwijs.gent.be](mailto:joris.petillion@onderwijs.gent.be)

## Installatie

1. Download het installatiebestand **`codekompas-4.0.0.vsix`**.
2. Open **Visual Studio Code** (versie 1.85 of hoger).
3. Open **Extensies / Extensions** via het pictogram in de zijbalk.
4. Klik bovenaan op **…** en kies **Installeren vanuit VSIX… / Install from VSIX…**.
5. Selecteer het gedownloade bestand en voltooi de installatie.
6. Herlaad het venster wanneer VS Code dat vraagt. Dit kan ook via het opdrachtenpalet met **Developer: Reload Window**.
7. Open een `.html`, `.css`, `.js`, `.py` of `.cs`-bestand.

Een bestaande versie kun je bijwerken door de nieuwe VSIX op dezelfde manier te installeren. Voor CodeKompas zelf zijn geen API-sleutel, abonnement, Python- of .NET-installatie nodig. Om je eigen programma’s uit te voeren, heb je uiteraard wel de bijbehorende programmeeromgeving nodig.

## Gebruik

Open CodeKompas via het **kompasicoon** in de activiteitenbalk. Je kunt ook het opdrachtenpalet openen met **Ctrl+Shift+P** (Windows/Linux) of **Cmd+Shift+P** (macOS) en **CodeKompas: Open leerhulp** kiezen.

### Spelling

Dit luik toont mogelijke aandachtspunten bij namen, hoofdletters, lettervolgorde, leestekens en codestructuur. De ondersteunde controles verschillen per taal.

1. Kies één aandachtspunt en lees de eerste zoekstap bij **Begin hier**.
2. Klik op **Bekijk in mijn code** om naar de gemarkeerde plaats te gaan.
3. Open **Een extra aanwijzing** wanneer je meer uitleg of zoekstappen nodig hebt.
4. Pas zelf je code aan. CodeKompas controleert opnieuw na het typen en bij opslaan.
5. Gebruik **Toon meer** wanneer er meer aandachtspunten zijn dan tegelijk worden weergegeven.

De rode cijferbadge bij **Spelling** en de teller in de statusbalk tonen het aantal gevonden aandachtspunten in het gevolgde bestand. Ook nadat alle meldingen verdwenen zijn, blijft CodeKompas controleren op nieuwe fouten.

Een bewust gekozen naam kun je bij een naamgebonden hint negeren met **Deze naam is bewust zo geschreven**. Dit geldt voor die exacte naam in de huidige werkruimte. Je kunt genegeerde namen herstellen via **CodeKompas: Herstel genegeerde woorden** in het opdrachtenpalet.

### Principes

Dit luik geeft uitleg en denkvragen bij programmeerbegrippen die relevant zijn voor de code, zoals functies, variabelen, bereik, voorwaarden, lussen en klassen. Bij webcode kunnen ook CSS-variabelen, designsystemen, DRY, BEM en componenten aan bod komen.

Principesuggesties zijn geen foutmeldingen. Ze nodigen uit om na te denken over de opbouw en bedoeling van je code.

### Instellingen en pauzeren

Via **Instellingen** kun je onder meer het aantal zichtbare hints, de wachttijd na typen en de getoonde principes aanpassen. Met **Hints pauzeren** en **Hints hervatten** zet je de ondersteuning tijdelijk stil of opnieuw aan. Bewust pauzeren blijft gelden bij opslaan.

## Zie je geen hulp?

- Controleer of de extensie ingeschakeld is en je bestand een ondersteunde taal gebruikt. Onderaan in VS Code hoort bijvoorbeeld **Python**, **C#** of **JavaScript** te staan, geen **Plain Text**.
- Open het CodeKompas-luik en controleer of de hints gepauzeerd zijn.
- Sla het bestand op of kies **CodeKompas: Nu analyseren** via het opdrachtenpalet.
- Controleer bij de instellingen of **CodeKompas: Enabled** aanstaat.
- Herlaad zo nodig het venster met **Developer: Reload Window**.

Geen hint betekent niet dat alle code correct is. CodeKompas voert gerichte controles uit en voert geen leerlingcode uit. Vooral de Python- en C#-controles zijn geen volledige compilercontrole. De gewone taalondersteuning van VS Code kan daarnaast andere fouten signaleren.

## Help CodeKompas verbeteren

**Leerlingen en leerkrachten zijn welkom om hun ervaringen te delen.** Wat hielp je verder? Welke aanwijzing was onduidelijk? Welke fout werd gemist of onterecht aangeduid? Ook minder positieve ervaringen helpen om de tool gerichter te verbeteren.

- **Voor leerlingen:** vul het [Leerlingenformulier](https://docs.google.com/forms/d/e/1FAIpQLScTgbhquhdl56V2pkgTIYtqmNN7ZT_DdY8BrY4x2DcNxn1usQ/viewform) in na het werken met CodeKompas.
- **Voor leerkrachten:** deel je waarnemingen uit de les via het [Observatieformulier](https://docs.google.com/forms/d/e/1FAIpQLSe8VsKNS-sropzorc9NRe3CmFWSIp8rvzrOOewqJh1VqYSkSA/viewform).

Vermeld bij een technisch probleem liefst de versie van CodeKompas, de programmeertaal en een klein codevoorbeeld zonder persoonsgegevens. Je kunt ook rechtstreeks mailen naar [joris.petillion@onderwijs.gent.be](mailto:joris.petillion@onderwijs.gent.be).

## Broncode en verdere documentatie

De broncode-ZIP bevat de volledige code, tests, voorbeelden en bouwscripts. De uitgebreide beschrijving van controles, beperkingen en bouwinstructies staat in `HANDLEIDING.md`. Zie ook `TRIGGERS.md`, `PATROONWIJZER.md` en `CHANGELOG.md`.
