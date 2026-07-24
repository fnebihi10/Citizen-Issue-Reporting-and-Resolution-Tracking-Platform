# Standarde zhvillimi

## Kodimi

- TypeScript strict; mos përdor `any` në kod të ri.
- Emrat e variablave, route-ve, tabelave dhe tipeve teknike janë në anglisht; tekstet e UI-së janë në shqip.
- Komponentët React janë të vegjël dhe të kompozueshëm; query-t nuk vendosen në komponentë vizualë.
- Përdor alias-in `@/*` për importet lokale.
- Çdo formë duhet të ketë loading, error, empty state dhe feedback të kuptueshëm.

## Git

- Commit-e të vogla me format `type(scope): message`, për shembull `feat(reporting): add report draft form`.
- `.env.local`, service keys, dumps dhe output-e build nuk commit-ohen.
- Skedarët tekst ruhen UTF-8 me LF sipas `.gitattributes`, edhe kur zhvillimi bëhet në Windows.
- Çdo sprint mbyllet me build dhe kontroll të ndryshimeve.

## UX dhe accessibility

- Mobile-first; target-et interaktive janë së paku 44px.
- Çdo input ka label të dukshëm ose accessible name, fokus të qartë dhe mesazh gabimi.
- Ngjyrat nuk janë sinjali i vetëm për statusin; përdorim edhe tekst/icon.
- Mos publikojmë emër, email, telefon, fotografi identifikuese ose lokacion të saktë të qytetarit.
- Raste emergjente shfaqen qartë dhe drejtohen te kanalet zyrtare, sepse platforma nuk është shërbim emergjence.
