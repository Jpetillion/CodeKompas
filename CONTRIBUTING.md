# Bijdragen aan CodeKompas

De centrale ontwikkelplek is https://github.com/Jpetillion/CodeKompas.

1. Meld een fout of bespreek een verbetering eerst via een issue. Vermeld bij fouten de versie, programmeertaal, stappen en een klein voorbeeld zonder persoonsgegevens.
2. Wil je code bijdragen? Neem contact op met joris.petillion@onderwijs.gent.be om toegang en toestemming voor de bijdrage af te spreken.
3. Collaborators werken op een aparte branch in deze repository, bijvoorbeeld `feature/duidelijkere-hints` of `fix/python-inspringing`.
4. Open een pull request naar `main`. Beschrijf wat verandert, waarom en hoe het is getest. Integratie gebeurt na review door de beheerder.
5. Bouw en test met `npm ci`, `npm run bundle`, `npm test` en `npm run package`. Commit geen `node_modules`, `dist`, VSIX-bestanden of archieven. VSIX-bestanden horen bij GitHub Releases.

De voorkeur is om verbeteringen in dit project samen te brengen. Een fork is niet automatisch een officiële CodeKompas-uitgave. Deze werkwijze schakelt de forkfunctie van een publieke GitHub-repository niet uit en wijzigt eerder verleende licentierechten niet. Voor gebruik en verspreiding gelden de voorwaarden in `LICENSE`; spreek toestemming voor bijdragen vooraf af met de beheerder.
