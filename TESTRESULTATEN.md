# Testresultaten 4.1.0

221 tests geslaagd; 0 mislukt. VSIX succesvol verpakt.

De automatische suite controleert de analyzer, VS Code-adapter met host-mocks, interface-interacties met jsdom en de daadwerkelijke distributiebundel zonder externe runtime-imports.

Nieuw getest: fout → schoon → nieuwe fout bij typen en opslaan; save zonder tekstevent; focuswissels; achtergrondsave; opnieuw zichtbaar paneel en webview-ready; pauze blijft behouden; annuleren van een typetimer bij save; teller voorbij weergavelimiet; direct zichtbare zoekstap; hernoemde declaratie met oude langere verwijzing; geldige korte namen; meerdere kandidaten en andere scopes.

Geen echte VS Code Extension Development Host of handmatige Windows/macOS/Linux-test uitgevoerd in deze omgeving. Mock- en jsdom-tests bewijzen geen werking in elke installatie of onderwijskundig effect.

Praktijkcontrole: installeer de nieuwe VSIX en herlaad het venster. Introduceer een fout, werk deze weg en introduceer opnieuw een fout. Herhaal met opslaan en bestandwissels, en met een gesloten/heropend CodeKompas-luik. Controleer ook een hernoemde variabele met een achtergebleven verwijzing.

## Python en C#

45 aanvullende tests controleren typefouten, bekende namen, eigen namen, hernoemde variabelen, blokkoppen, inspringing, haakjes, tekst, commentaar, importnamen, geldige korte namen, naamconventies, taalgebonden conceptkaarten, instellingen en save → schoon → nieuwe fout via de echte distributiebundel. De Python/C#-analyse is lexicaal; volledige compilerdekking wordt niet geclaimd.

## 4.1.0: meertaligheid en zichtbaarheid

37 extra tests controleren catalogusdekking voor vijf talen, vijf programmeertalen, vertaalde diagnostiek, taalkeuze, versie, regel/kolom, gemarkeerde code, Arabische RTL met LTR-code, terugschakelen naar Russisch/Nederlands, behoud van aantallen en broncode, en het weglaten van gelijkende API-namen uit voorbeelden. Geen handmatige VS Code-desktoptest of validatie door moedertaalsprekers uitgevoerd.
