# Plani i Testimit (Test Plan)

Ky plan testimi përshkruan qasjen për të vlerësuar funksionalitetin dhe sigurinë e Platformës për Raportimin e Problemeve Qytetare, në përputhje me kërkesat e temës së diplomës.

## Qëllimet e Testimit
- Të sigurohet që raportimi i problemeve funksionon siç pritet.
- Të vlerësohet logjika e qasjes bazuar në rolet e përdoruesve (Qytetar, Zyrtar Komunal, Administrator, Vizitor Publik).
- Të verifikohen llogaritjet e SLA-ve dhe ndryshimet e statuseve.
- Të testohet siguria dhe privatësia (p.sh. mos-publikimi i të dhënave personale).

## Llojet e Testeve (Së paku 25 teste)

### 1. Testet Funksionale (Functional Testing)
1. **Krijimi i Raportit**: Siguro që qytetari mund të krijojë raport me të gjitha fushat obligative (titull, kategori, lokacion).
2. **Kategoritë**: Verifiko që kategoritë mbështeten saktë: rrugë/gropa, ndriçim, mbeturina, sinjalistikë.
3. **Ngarkimi i Fotografisë**: Verifiko që fotografia pranohet dhe konvertohet/ruhet pa zbuluar identitetin.
4. **Validimi i Lokacionit**: Raportet nuk mund të dërgohen pa lokacion në hartë.
5. **Sugjerimi i Raportimeve**: Testo sugjerimin e raporteve ekzistuese bazuar në distancë, kategori dhe kohë.
6. **Tranzicioni i Statuseve**: Verifiko kalimin: `submitted` -> `under_review` -> `assigned` -> `in_progress` -> `resolved`; kontrollo edhe `rejected` dhe `reopened` sipas rregullave të databazës.
7. **Filtrat**: Testo filtrimin e problemeve në panel sipas statusit dhe kategorisë.
8. **Eksporti CSV/JSON**: Administratori mund të shkarkojë raportet valide.
9. **Komentet**: Zyrtari mund të lë komente në ticket gjatë trajtimit.
10. **Njoftimet**: Qytetari njoftohet për ndryshimin e statusit të raportit të tij.

### 2. Testet e Skajeve (Edge Cases / Boundary Testing)
11. **Përshkrimet e gjata**: Testo formën e raportimit me inpute teksti mbi limitin normal (p.sh., 5000 karaktere).
12. **Fotografi të mëdha/jo-valide**: Provo të ngarkosh fajlla `.pdf`, skedar bosh ose foto me madhësi >10MB.
13. **Lokacione jashtë Komunës**: Testo bllokimin ose paralajmërimin nëse klikohet një lokacion i pamundur.
14. **Kalim i papritur statusi**: Provo të kalosh një raport direkt nga `dorëzuar` në `zgjidhur` (duhet të pengohet nëse e theksuar në rregullat e tranzicionit).
15. **SLA skaduar**: Llogaritja e saktë kur afati kohor i trajtimit vonohet me sekonda/minuta pas limitit.
16. **Konkurenca (Concurrency)**: Dy zyrtarë tentojnë të marrin të njëjtin raport njëkohësisht.
17. **Kërkime Boshe (Empty Search)**: Kontrollo vizualizimin e hartës dhe listës kur nuk ka asnjë raport.

### 3. Testet e Sigurisë (Security Testing)
18. **Autorizimi i Roleve**: Një "Vizitor Publik" nuk mund të qaset në `/account`, `/official` ose `/admin`.
19. **Privatësia në Hartë**: Vizitori publik nuk mund të gjejë asnjë gjurmë të IP-së apo emailit të qytetarit në request-et e hartës (API).
20. **Rate Limiting**: Raporti i gjashtë nga i njëjti qytetar brenda 5 minutave bllokohet edhe kur klienti dërgon `created_at` të falsifikuar.
21. **XSS Protection**: Fusha e përshkrimit nuk duhet të ekzekutojë skripte nëse shtohet kod `<script>alert(1)</script>`.
22. **CSRF**: Formulari i dërgimit duhet të mbrohet kundër sulmeve CSRF.
23. **SQL/NoSQL Injection**: Inputet në filtra dhe search duhet të jenë të pastruara.
24. **Akses i paautorizuar në imazhe**: Sigurimi që imazhet mund të shikohen, por metadata EXIF që zbulon pajisjen dhe lokacionin fshihet para ruajtjes.
25. **Audit Logs**: Çdo ndryshim i thellë nga administratori regjistrohet dhe është "read-only" në logs.

## Vlerësimi Me Përdorues (Usability Testing)
- Rekrutimi i 5–10 personave vullnetarë.
- Kryerja e skenarit "Raporto një gropë në rrugën kryesore nga telefoni".
- Matja e kohës së përfundimit, gabimeve dhe përshtypjes së përgjithshme.

## Mjedisi dhe Mjetet e Testimit
- **Dataset**: `dataset/synthetic_dataset.json` me 120 raporte deterministike.
- **Mjetet e planifikuara**: Playwright/Vitest për testet e automatizuara, Supabase SQL Editor për RLS dhe testime manuale vizuale. Nuk deklarojmë asnjë test si të kaluar para ekzekutimit të tij.

## Automatizimi aktual para Sprintit 6

- `npm test` ekzekuton 37 teste Vitest për password/redirect/RBAC, validimin e
  raportit, normalizimin e view-t publik dhe heqjen fail-closed të EXIF/GPS.
- `npm run check:dataset` kontrollon që JSON-i me 120 raporte dhe SQL seed-i të
  jenë gjeneruar nga i njëjti burim.
- `supabase/tests/database/pre_sprint6_hardening.test.sql` mbulon
  përgjithësimin e lokacionit, privilegjet e RPC-së, komentet immutable,
  admin policy, RBAC, 120 raportet dhe rate limit-in me 21 assertions.
  Ekzekutohet me
  `npx supabase test db` pasi Supabase lokal/Docker të jetë aktiv.
- `npm run verify:remote -- --allow-dev` verifikon krijimin e raportit qytetar,
  kufijtë e RPC-së, ndalimin e update-it direkt dhe upload/download-in privat
  e immutable të një prove sintetike në projektin e hostuar.
- `npm run verify:local-auth -- --allow-dev` verifikon cookie/header-at SSR,
  faqet e autentikuara dhe ndalimin e route-ve `official`/`admin` për qytetarin.
- Këto kontrolle nuk zëvendësojnë paketën përfundimtare me 25+ skenarë
  funksionalë, të skajeve dhe të sigurisë të Sprintit 9.
