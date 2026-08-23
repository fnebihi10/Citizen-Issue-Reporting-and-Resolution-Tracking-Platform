# User stories dhe kriteret e pranimit

Kriteret për sprintet e ardhshme dokumentohen këtu, por nuk shënohen si të
implementuara para se të ekzistojnë route-t, RLS-ja dhe testet përkatëse.

## US-01 — Vizitori sheh transparencën publike (Sprint 4)

Si vizitor publik dua të shoh raportet e publikuara në hartë, që të kuptoj
problemet dhe progresin pa cenuar privatësinë e qytetarëve.

Kriteret e pranimit:

- `/map` hapet pa autentikim;
- shfaq vetëm raporte me `is_public = true`;
- përdor vetëm koordinatën e përgjithësuar;
- nuk kthen `citizen_id`, emër, email, telefon ose lokacion privat;
- ka gjendje loading, empty dhe error në desktop dhe telefon.

## US-02 — Qytetari krijon dhe rikuperon llogarinë (Sprint 3)

Si qytetar dua të regjistrohem, të konfirmoj email-in, të hyj dhe të rivendos
fjalëkalimin, që të kem qasje të sigurt te raportimet e mia.

Kriteret e pranimit:

- forma e regjistrimit nuk pranon zgjedhje roli;
- profili krijohet me rolin `citizen`;
- callback-u PKCE pranon vetëm redirect të brendshëm;
- route-t private ridrejtojnë përdoruesin pa session te login-i;
- login, register, forgot dhe update password përdorin të njëjtin drejtim
  centered premium auth-card.

## US-03 — Qytetari krijon raport (Sprint 5)

Si qytetar dua të raportoj një problem lokal, që ekipi përgjegjës ta
verifikojë dhe trajtojë.

Kriteret e pranimit:

- titulli ka 5–160 dhe përshkrimi 10–5000 karaktere;
- kategoria duhet të jetë aktive;
- lokacioni i vlefshëm është i detyrueshëm;
- fotografia opsionale pranon JPG/PNG/WebP deri 10 MB;
- fotografia ri-enkodohet pa EXIF/GPS para upload-it të aplikacionit;
- raporti krijohet `submitted`, `normal`, privat dhe me SLA server-side;
- maksimumi janë 5 raporte për qytetar brenda 5 minutave.

## US-04 — Qytetari ndjek raportimet e veta (Sprint 5)

Si qytetar dua të shoh listën e raporteve të mia, që të kuptoj statusin dhe
afatin fillestar.

Kriteret e pranimit:

- `/citizen/reports` kërkon session;
- query-ja kufizohet me `citizen_id = auth.uid()` edhe nga RLS;
- lista shfaq numrin, titullin, statusin, datën dhe SLA-në;
- nuk ekspozon lokacionin e saktë në markup;
- gjendjet empty/error/loading janë të qarta.

Përfundimi UX i Sprintit 6:

- `/citizen` është faqja hyrëse e hapësirës qytetare;
- paneli shfaq totalin, raportet aktive/të zgjidhura, njoftimet e palexuara,
  raportimet e fundit dhe çështjen aktive me afatin fillestar më të afërt;
- `/citizen/reports` ka kërkim sipas titullit, përshkrimit ose numrit dhe
  filtra të ndarë për aktive, të zgjidhura dhe të refuzuara;
- navigimi tregon faqen aktive dhe ruan target-e 44 px në desktop/mobile;
- lokacioni privat nuk futet në përmbledhjen ose kërkimin e panelit.

## US-05 — Qytetari shmang duplikatet (Sprint 5)

Si qytetar dua të shoh nëse ka problem aktiv të ngjashëm pranë, që të mos
krijoj raport të panevojshëm.

Kriteret e pranimit:

- kërkimi përdor kategori, distancë dhe dritare 90-ditore;
- anon nuk mund ta ekzekutojë RPC-në;
- raportet e të tjerëve përfshihen vetëm kur janë publike;
- për të tjerët përdoret `public_location`, jo pika private;
- distanca kthehet e rrumbullakuar dhe maksimumi 5 rezultate.

## US-06 — Zyrtari trajton workflow-n (Sprint 6)

Si zyrtar dua të verifikoj, caktoj dhe përditësoj raportet e autorizuara, që
procesi të dokumentohet deri në zgjidhje.

Kriteret e pranimit:

- inbox i filtrueshëm vetëm për scope-in e autorizuar;
- tranzicione vetëm sipas state machine;
- histori dhe komente immutable;
- zgjidhja/refuzimi kërkojnë shënim;
- zyrtari mund të ngarkojë provë sintetike të zgjidhjes, të pastruar nga
  EXIF/GPS dhe të ruajtur privatisht si `resolution`;
- qytetari merr njoftim dhe hap faqen e detajit të raportit.

Përfundimi UX para Sprintit 7:

- `/official` është faqja hyrëse për zyrtarin; administratori hyn te
  `/admin`, por ruan qasje të autorizuar te detaji zyrtar i raportit;
- paneli përmbledh raportet për verifikim, caktimet e zyrtarit, rastet në
  proces dhe prioritetet `high`/`urgent`;
- radha e vëmendjes renditet në mënyrë deterministike sipas prioritetit,
  statusit, pronësisë dhe afatit fillestar;
- `/official/reports` mbetet inbox-i i plotë i kërkueshëm dhe i filtrueshëm;
- paneli dhe inbox-i lexojnë vetëm rreshtat që lejon RLS sipas rolit dhe
  departamentit.

## US-07 — Administratori menaxhon platformën (Sprint 7)

Si administrator dua të menaxhoj role, departamente, kategori dhe SLA, që
platforma të funksionojë me përgjegjësi të qarta.

Kriteret e pranimit të implementuara:

- vetëm admini ndryshon role/departamente;
- një zyrtar ka detyrimisht departament;
- administratori nuk mund ta ulë vetë rolin dhe departamenti me zyrtarë nuk
  çaktivizohet pa ricaktim;
- ndryshimet e ndjeshme auditohen nga trigger-at e databazës;
- `/admin/sla` identifikon raportet e vonuara, afër skadimit dhe në afat;
- eksportet CSV/JSON respektojnë privatësinë dhe vetë eksporti auditohet;
- paneli, formularët dhe listat janë responsive dhe kanë loading/error/empty
  states.

## US-08 — Publiku analizon rezultatet (Sprint 8)

Si vizitor dua filtra, faqe publike raporti, statistika dhe heatmap, që të
kuptoj performancën pa parë të dhëna private.

Kriteret e pranimit të implementuara:

- `/map` ofron kërkim dhe filtra sipas kategorisë, statusit dhe periudhës;
- `/reports/[id]` shfaq përmbledhjen, faktet, historikun dhe komentet publike;
- faqet publike përdorin vetëm `public_reports`,
  `public_report_comments` dhe `public_report_status_history`;
- një ID private ose e panjohur jep të njëjtën gjendje “nuk u gjet”, pa
  zbuluar ekzistencën e raportit privat;
- mënyra e dendësisë grupon vetëm koordinatat e përgjithësuara;
- historiku publik përjashton identitetin e autorit, shënimet e tranzicionit
  dhe komentet e brendshme;
- `/admin/analytics` përdor të njëjtin dataset të sanitizuar për statistika,
  shpërndarje dhe hartë dendësie.
