# Plani i demo-s së diplomës

Demo-ja përdor vetëm llogari dhe raporte sintetike. Kredencialet mbahen jashtë
Git-it dhe ndahen vetëm me personat e autorizuar për prezantim.

## Skenari i videos 4–6 minuta

1. **0:00–0:35 — Hyrja dhe vizitori publik.** Thuaj që platforma trajton vetëm
   çështje jo-emergjente dhe se për emergjenca telefonohet 112. Trego hartën,
   filtrat dhe faktin që lokacionet janë të përgjithësuara.
2. **0:35–1:45 — Qytetari.** Hyr me llogarinë demo, krijo raport sintetik me
   titull, kategori, lokacion dhe fotografi sintetike. Trego sugjerimin sipas
   kategorisë, distancës dhe kohës, pastaj raportimet e mia.
3. **1:45–3:25 — Zyrtari.** Hyr në profilin e zyrtarit, verifiko raportin,
   cakto departamentin/zyrtarin dhe vazhdo workflow-in. Trego komentin publik,
   shënimin intern, historinë, njoftimet dhe ngarko një fotografi sintetike të
   zgjidhjes para statusit `resolved`.
4. **3:25–4:05 — Qytetari dhe transparenca.** Trego njoftimin, shënimet/provën
   e dukshme për qytetarin dhe rihapjen e kontrolluar. Hape faqen publike dhe
   thekso se identiteti, pika private dhe fotografitë nuk publikohen.
5. **4:05–5:20 — Administratori.** Trego monitorimin SLA, statistikat,
   heatmap-in, audit log-un dhe eksportin CSV/JSON pa fusha personale.
6. **5:20–5:40 — Përfundimi.** Përmend dataset-in me 120 raporte sintetike,
   testet automatike dhe URL-në live.

## Para prezantimit

- përdor deployment-in production dhe commit-in e shënuar në raportin e
  verifikimit;
- kontrollo të tri llogaritë demo dhe ruaj kredencialet në një password manager;
- sigurohu që raporti i demo-s është sintetik dhe nuk prek rate limit-in;
- përgatit një browser profile për secilin rol;
- mbaj screenshot-et dhe diagramet si fallback nëse rrjeti dështon;
- mos përdor email, adresë, fotografi ose lokacion të një personi real.
- regjistro në 1080p dhe sigurohu që videoja e eksportuar zgjat 4–6 minuta.

## Pas prezantimit

- fshi vetëm raportet e përkohshme të demo-s pasi të kontrollohen varësitë;
- mos fshi përdoruesit deterministikë të seed-it;
- mos ndrysho rolet ose të dhënat production pa audit/migration.
