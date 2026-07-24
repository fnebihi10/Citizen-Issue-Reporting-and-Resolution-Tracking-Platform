# Software Requirements Specification

Ky dokument përmbledh kërkesat zyrtare të mentorit për temën:
**“Zhvillimi i një platforme për raportimin, ndjekjen dhe zgjidhjen e
problemeve qytetare”**. Kërkesat këtu kanë përparësi ndaj preferencave të
mëparshme të dizajnit; `docs/roadmap.md` përcakton rendin e implementimit.

## 1. Qëllimi dhe fusha

Platforma është aplikacion web responsive ku qytetarët raportojnë probleme
lokale jo-emergjente, ndërsa zyrtarët i verifikojnë, i caktojnë dhe e
dokumentojnë procesin deri në zgjidhje. Vizitorët publikë shohin transparencë
mbi problemin dhe progresin pa identitetin, kontaktet ose lokacionin e saktë të
raportuesit.

## 2. Aktorët

### Qytetari

- krijon llogari dhe autentikohet;
- krijon raport me kategori, lokacion dhe fotografi;
- sheh raportimet dhe statusin e vet;
- merr njoftime dhe komunikon me komente.

### Zyrtari komunal

- sheh inbox-in e autorizuar;
- verifikon raportet dhe cakton departamentin;
- ndryshon statusin sipas workflow-t;
- shton komente dhe dokumenton zgjidhjen.

### Administratori

- menaxhon rolet, përdoruesit, departamentet dhe kategoritë;
- konfiguron dhe monitoron SLA-të;
- sheh audit log, statistika dhe heatmap;
- eksporton të dhënat në CSV/JSON.

### Vizitori publik

- sheh hartën dhe raportet e publikuara;
- sheh statusin dhe historinë publike;
- nuk sheh identitet, kontakt, lokacion privat ose prova të brendshme.

## 3. Kërkesat funksionale

### FR-01 — Autentikimi dhe rolet

Sistemi duhet të mbështesë regjistrim, konfirmim email-i, hyrje, dalje dhe reset
fjalëkalimi. Regjistrimi publik krijon vetëm rol `citizen`; rolet `official`
dhe `admin` caktohen vetëm nga një administrator i autorizuar.

### FR-02 — Krijimi i raportit

Qytetari duhet të mund të dërgojë:

- titull;
- përshkrim;
- një nga kategoritë aktive;
- lokacion të saktë në hartë;
- përshkrim opsional të vendit;
- fotografi prove në format të lejuar.

### FR-03 — Kategoritë fillestare

Sistemi duhet të ketë së paku:

- rrugë dhe gropa;
- ndriçim publik;
- mbeturina;
- sinjalistikë.

### FR-04 — Verifikimi dhe caktimi

Zyrtari duhet të verifikojë raportin dhe ta caktojë te departamenti përgjegjës.
Qytetari nuk mund të vendosë vetë prioritet, departament, zyrtar ose gjendje
publikimi.

### FR-05 — Workflow i statuseve

Statuset janë:

- `submitted` — dorëzuar;
- `under_review` — në verifikim;
- `assigned` — caktuar;
- `in_progress` — në proces;
- `resolved` — zgjidhur;
- `rejected` — refuzuar;
- `reopened` — rihapur.

Kalimet e palejuara duhet të bllokohen nga databaza. Zgjidhja kërkon shënime
zgjidhjeje; refuzimi kërkon arsye.

### FR-06 — Komentet, historia dhe njoftimet

Sistemi duhet të ruajë komentet, historinë e plotë të statuseve dhe njoftimet
për qytetarin. Shënimet e brendshme të stafit nuk publikohen dhe nuk i
shfaqen qytetarit.

### FR-07 — SLA

Çdo kategori ka afat fillestar SLA. Sistemi llogarit afatin gjatë krijimit,
identifikon raportet e vonuara dhe i paraqet ato në panelin e stafit.

### FR-08 — Transparenca publike

Harta dhe faqet publike duhet të lexojnë vetëm të dhëna të sanitizuara:
kategori, titull/përmbledhje publike, status, histori publike dhe lokacion të
përgjithësuar. Identiteti, kontakti, pika private dhe provat e brendshme nuk
duhet të ekspozohen.

### FR-09 — Administrimi dhe analitika

Paneli administrativ duhet të ofrojë filtra, statistika, heatmap, menaxhim të
përdoruesve/departamenteve/kategorive dhe eksport CSV/JSON.

### FR-10 — Sugjerimi i raportimeve të ngjashme

Para dërgimit, sistemi mund të sugjerojë raporte aktive sipas kategorisë,
distancës dhe kohës. Rezultati nuk duhet të zbulojë koordinata private ose
raporte private të qytetarëve të tjerë.

### FR-11 — Kontrolli dhe auditimi

Sistemi duhet të zbatojë RBAC/RLS, validim klient/server/databazë, rate
limiting dhe audit log për ndryshimet e ndjeshme.

### FR-12 — Rastet emergjente

Platforma nuk pranon trajtim emergjencash. UI-ja duhet ta shpjegojë qartë këtë
kufi dhe ta drejtojë përdoruesin te kanalet zyrtare të emergjencës.

## 4. Kërkesat jofunksionale

### NFR-01 — Siguria

- parimi least privilege dhe RLS në tabelat me të dhëna private;
- session cookies të sigurta dhe redirect-e vetëm drejt path-eve të brendshme;
- private Object Storage dhe prova immutable pas regjistrimit;
- inpute të kufizuara dhe të parametrizuara;
- dependency audit dhe security headers.

### NFR-02 — Privatësia

- asnjë emër, email, telefon ose pikë e saktë në API-në publike;
- EXIF/GPS hiqet nga fotografia para upload-it të aplikacionit;
- `public_location` llogaritet vetëm nga serveri;
- përdoren vetëm të dhëna sintetike në demo, dokumentim dhe punim.

### NFR-03 — Performanca dhe kapaciteti

Sistemi duhet të demonstrojë së paku 100 raportime sintetike. Harta dhe listat
duhet të kenë kufij query-sh dhe indekse për pronarin, statusin, SLA-në dhe
lokacionin.

### NFR-04 — Përdorshmëria dhe accessibility

Ndërfaqja duhet të jetë mobile-first, responsive, me label-a, fokus të dukshëm,
target-e interaktive së paku 44 px dhe feedback loading/error/empty/success.

### NFR-05 — Mirëmbajtja

TypeScript përdoret në strict mode; migrations janë burimi autoritativ i
skemës; tipet e Supabase gjenerohen nga skema dhe dokumentet përditësohen kur
ndryshon implementimi.

### NFR-06 — Testimi dhe vlerësimi

Paketa përfundimtare duhet të ketë së paku 25 teste funksionale, edge dhe
sigurie, dataset 100+, si dhe — nëse është e mundur — usability test me 5–10
persona.

## 5. Kufijtë e detyrueshëm

Nuk kërkohen integrime reale me komunën, identitet elektronik shtetëror,
pagesa, aplikacion native ose AI për klasifikim fotografie. Nuk përdoren emra,
adresa, foto ose lokacione që identifikojnë persona realë.

## 6. Gjendja sipas roadmap-it

| Fusha | Gjendja pas Sprintit 5 |
|---|---|
| Foundation, arkitekturë dhe design system | Implementuar |
| PostgreSQL/PostGIS, RLS dhe Storage privat | Implementuar |
| Auth, profiles dhe route protection | Implementuar |
| Shell/hartë publike bazë | Implementuar |
| Krijimi/lista e raporteve qytetare | Implementuar |
| Lokacion publik, EXIF, rate limit, duplicate suggestion | Implementuar |
| Workflow zyrtari, komente operative, njoftime, detaj raporti | Sprint 6 |
| Administrim, SLA dashboard, audit i zgjeruar, eksport | Sprint 7 |
| Public detail, filtra, heatmap dhe analitika | Sprint 8 |
| 25+ teste, accessibility/performance/usability evaluation | Sprint 9 |
| Deploy dhe paketa finale e tezës | Sprint 10 |
