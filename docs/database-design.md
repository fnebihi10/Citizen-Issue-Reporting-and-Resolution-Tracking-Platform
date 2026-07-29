# Modeli i databazës — Sprintet 2–6

## Entitetet

```text
auth.users 1──1 profiles
profiles   1──* reports
departments 1──* categories
categories 1──* reports
reports    1──* report_status_history
reports    1──* report_comments
reports    1──* report_attachments
reports    1──* notifications
```

- `profiles` zgjeron `auth.users`; roli është `citizen`, `official` ose `admin`.
- `reports.location` është lokacioni privat i saktë në PostGIS.
- `reports.public_location` llogaritet vetëm nga trigger-i përmes
  `generalize_location(location, 500)`. Klienti nuk kontrollon koordinatën
  publike; pika vendoset në grid afërsisht 500 m dhe duhet të jetë së paku
  50 m larg pikës private.
- `report_attachments` ruan vetëm `object_path`, jo URL publike të përhershme. `is_internal` ndan provat e stafit nga provat që mund t'i shohë qytetari.
- `report_status_history` dhe `audit_logs` krijohen nga trigger-a server-side, jo nga browser-i.
- `report_comments` janë immutable: një korrigjim ruhet si koment i ri, jo si
  ndryshim i historikut ekzistues.

## Statuset e lejuara

```text
submitted -> under_review -> assigned -> in_progress -> resolved
                  |
                  v
               rejected

resolved -> reopened -> under_review
```

Trigger-i i databazës bllokon kalimet e paligjshme. `resolved` kërkon `resolution_notes`, ndërsa `rejected` kërkon `rejected_reason`.

## Privatësia

Anon lexon vetëm views publike. Përdoruesit e autentikuar lexojnë tabelën
`public.reports` vetëm përmes RLS-së si pronar ose staf i autorizuar, ndërsa
faqet publike përdorin views që filtrohen te `is_public = true` dhe nuk
përmbajnë `citizen_id`, email, telefon, `author_id` ose lokacionin privat.
Fotografitë ruhen në bucket privat; objektet e brendshme nuk mund të lexohen
nga qytetari.

RPC-ja `suggest_similar_reports` është `security definer`, por mund të
ekzekutohet vetëm nga `authenticated`. Për raportet e qytetarëve të tjerë ajo
kërkon vetëm mbi `public_location`, kthen titullin publik dhe rrumbullakon
distancën në hapa 50 m. Raportet private përfshihen vetëm kur i përkasin
qytetarit aktual.

## Mbrojtja nga abuzimi dhe RBAC

- Trigger-i i raportit lejon maksimumi 5 raportime për qytetar brenda 5
  minutave dhe përdor transaction advisory lock për të shmangur bypass-in me
  kërkesa paralele. Për insert-e të autentikuara `created_at` mbishkruhet me
  kohën e serverit.
- `profiles_admin_update` lejon vetëm administratorin të ndryshojë profile të
  tjera.
- Një profil me rolin `official` duhet të ketë `department_id`.
- Qytetari nuk ka policy të gjerë `UPDATE` mbi raportin e dorëzuar; editimi
  mund të shtohet vetëm më vonë me fusha të kufizuara ose RPC të dedikuar.
- `report_attachments.report_id` duhet të jetë i njëjti UUID që ndodhet në
  `object_path`, dhe qytetari mund të regjistrojë vetëm llojin `evidence`.

## SLA

`categories.default_sla_hours` është burimi i SLA-së fillestare. Trigger-i vendos `reports.sla_due_at` gjatë insert-it; përdoruesi nuk mund ta zgjatë vetë afatin duke dërguar një vlerë tjetër.

## Workflow i Sprintit 6

- `transition_report_workflow` është e vetmja rrugë Data API për ndryshimet
  operative të stafit; `authenticated` nuk ka privilegj direkt `UPDATE` mbi
  `reports`.
- RPC-ja kyç rreshtin, verifikon rolin/departamentin, caktimin e zyrtarit,
  përmbajtjen e sanitizuar publike dhe state machine-in.
- `add_report_comment` vendos autorin nga `auth.uid()` dhe bllokon shënimet
  interne nga qytetari.
- `reopen_resolved_report` lejon vetëm pronarin të kalojë `resolved -> reopened`
  dhe ruan arsyen si histori dhe koment.
- Trigger-at e njoftimeve krijojnë njoftime për ndryshimet e statusit dhe
  komentet jo-interne. Klienti nuk mund të krijojë përmbajtje njoftimi.

ER diagrami autoritativ dhe state machine-i i sinkronizuar me migrations janë
te [`diagrams/README.md`](../diagrams/README.md).
