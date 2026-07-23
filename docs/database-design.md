# Modeli i databazës — Sprint 2

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
- `reports.public_location` është lokacioni i përshtatur për publikim dhe përdoret vetëm kur `is_public = true`.
- `report_attachments` ruan vetëm `object_path`, jo URL publike të përhershme. `is_internal` ndan provat e stafit nga provat që mund t'i shohë qytetari.
- `report_status_history` dhe `audit_logs` krijohen nga trigger-a server-side, jo nga browser-i.

## Statuset e lejuara

```text
submitted -> under_review -> assigned -> in_progress -> resolved
                  |              |
                  v              v
               rejected        rejected

resolved -> reopened -> under_review
```

Trigger-i i databazës bllokon kalimet e paligjshme. `resolved` kërkon `resolution_notes`, ndërsa `rejected` kërkon `rejected_reason`.

## Privatësia

Anon dhe authenticated nuk lexojnë drejtpërdrejt `public.reports`. Ato lexojnë vetëm views publike, të cilat filtrohen te `is_public = true` dhe nuk përmbajnë `citizen_id`, email, telefon, `author_id` ose lokacionin privat. Fotografitë ruhen në bucket privat; objektet e brendshme nuk mund të lexohen nga qytetari.

## SLA

`categories.default_sla_hours` është burimi i SLA-së fillestare. Trigger-i vendos `reports.sla_due_at` gjatë insert-it; përdoruesi nuk mund ta zgjatë vetë afatin duke dërguar një vlerë tjetër.
