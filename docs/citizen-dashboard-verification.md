# Citizen dashboard — completion pass before Sprint 7

Ky dokument përmbledh përfundimin e hapësirës qytetare pas workflow-t të
Sprintit 6 dhe para fillimit të administrimit në Sprintin 7.

## Fusha e implementuar

| Kriteri | Implementimi |
|---|---|
| Faqe hyrëse e qartë | `/citizen` me përshëndetje, veprime kryesore dhe kufirin për rastet emergjente |
| Përmbledhje e dobishme | total, aktive, të zgjidhura dhe njoftime të palexuara |
| Prioritet për qytetarin | raporti aktiv me afatin fillestar më të afërt dhe link direkt te historia |
| Vazhdimësi e aktivitetit | tre raportimet e fundit sipas përditësimit dhe tre njoftimet e palexuara |
| Gjetje e shpejtë | kërkim lokal privat sipas titullit, përshkrimit ose numrit |
| Filtrim | pamje të gjitha, aktive, të zgjidhura dhe të refuzuara me numërues |
| Navigim responsive | gjendje aktive, menu mobile, badge njoftimesh dhe dalje nga llogaria brenda menusë |
| Privatësi | dashboard-i lexon vetëm raportimet e pronarit; lokacioni privat nuk renderohet në përmbledhje |
| Gjendje të plota | loading, error, empty dhe zero-results |

## Kufijtë

- Dashboard-i nuk ndryshon workflow-n, RLS-në ose skemën e databazës.
- Afati paraqitet si **afat fillestar**, jo si premtim zgjidhjeje.
- SLA operacionale, vonesat dhe eskalimet e stafit mbeten pjesë e Sprintit 7.
- Kërkimi kryhet vetëm mbi maksimumi 200 raportimet e vetë përdoruesit që
  kthen query-ja e autorizuar.

## Verifikimi

- `npm run typecheck` — passed
- `npm run lint` — passed
- `npm test` — 56 teste passed, përfshirë përmbledhjet e paneleve,
  destinacionin sipas rolit dhe kufirin njëorësh të session-it
- `npm run check:dataset` — passed; dataset-i sintetik dhe seed-i janë të sinkronizuar
- `npm run build` — passed; `/citizen` u gjenerua si route dinamike
- `npm run verify:local-auth -- --allow-dev` — passed kundër `next start`;
  kontrollon tani edhe `/citizen` dhe `/citizen/reports` për qytetarin,
  zyrtarin dhe vizitorin pa session
