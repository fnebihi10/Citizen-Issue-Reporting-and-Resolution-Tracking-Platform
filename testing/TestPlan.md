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
26. **Skadimi i Session-it**: Session-i i workspace-it refuzohet një orë pas
    hyrjes, kërkon ri-autentikim dhe ruan vetëm një destinacion të brendshëm.

## Vlerësimi manual i përdorshmërisë

- Pronari kontrollon flukset publike dhe të tri roleve me llogari sintetike.
- Playwright mat overflow-in, accessibility, navigimin me tastierë dhe flukset
  kryesore në viewport-e mobile dhe desktop.
- Një studim i jashtëm mund të shtohet më vonë, por nuk deklarohet si i kryer.

## Mjedisi dhe Mjetet e Testimit
- **Dataset**: `dataset/synthetic_dataset.json` me 120 raporte deterministike.
- **Mjetet**: Vitest për funksionet e pastra, pgTAP në Supabase lokal/GitHub
  Actions për databazën, smoke scripts për dev/staging dhe testim manual
  vizual. Playwright mbulon paketën end-to-end publike dhe të autentikuar të
  Sprintit 9. Nuk deklarojmë asnjë test si të kaluar para ekzekutimit të tij.

## Automatizimi aktual i Sprintit 9

- `npm test` ekzekuton 80 teste Vitest për URL-në e release-it,
  password/redirect/RBAC, skadimin
  absolut të session-it, përmbledhjet e paneleve, validimin e
  raportit, workflow-n, normalizimin e view-t publik dhe heqjen fail-closed të
  EXIF/GPS, si dhe validimin e administrimit, klasifikimin e SLA-së dhe
  eksportin privacy-safe.
- `npm run check:dataset` kontrollon që JSON-i me 120 raporte dhe SQL seed-i të
  jenë gjeneruar nga i njëjti burim.
- `supabase/tests/database/pre_sprint6_hardening.test.sql` është regression
  suite e sigurisë së databazës dhe mbulon
  përgjithësimin e lokacionit, privilegjet e RPC-së, komentet immutable,
  admin policy, RBAC, 120 raportet dhe rate limit-in me 21 assertions.
  Ekzekutohet me
  `npx supabase test db` pasi Supabase lokal/Docker të jetë aktiv.
- `supabase/tests/database/sprint6_workflow.test.sql` shton 18 assertions për
  privilegjet, state machine-in, historinë, komentet interne, njoftimet dhe
  rihapjen.
- Pesë skedarë pgTAP ekzekutojnë 83 assertions për hardening-un, request
  context, workflow-n, governance-in administrativ dhe transparencën publike.
  GitHub Actions i ekzekuton në Supabase të izoluar.
- Playwright kontrollon flukset publike, performance, pesë viewport-e,
  dashboard-in SLA dhe route-t për qytetar/zyrtar/admin me axe WCAG A/AA,
  overflow horizontal dhe header-at private `no-store`.
- `npm run verify:remote -- --allow-dev` verifikon krijimin e raportit qytetar,
  kufijtë e RPC-së, ndalimin e update-it direkt dhe upload/download-in privat
  e immutable të një prove sintetike në projektin e hostuar.
- `npm run verify:local-auth -- --allow-dev` verifikon cookie/header-at SSR,
  faqet e autentikuara dhe ndalimin e route-ve `official`/`admin` për qytetarin.
- `npm run verify:sprint6 -- --allow-dev` ekzekuton ciklin e plotë sintetik
  official/citizen kundër projektit të hostuar `dev`.
- Këto kontrolle kalojnë minimumin prej 25 skenarësh dhe plotësohen nga
  kontrolli manual i pronarit me të tri rolet.
