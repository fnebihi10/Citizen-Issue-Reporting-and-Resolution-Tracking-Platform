# Diagramet autoritative

Diagramet Mermaid më poshtë pasqyrojnë migrations dhe kodin real pas Sprintit
8, duke përfshirë panelet qytetar/zyrtar/admin dhe transparencën publike.
Skedarët e vjetër PNG/Draw.io
në këtë dosje ruhen si drafte historike të
paketës fillestare; ata nuk përdoren si burim i së vërtetës kur devijojnë nga
ky dokument.

Para dorëzimit final në Sprintin 10, këto diagrame eksportohen në figurat me
numërim dhe stilin e punimit të FIMK-ut.

## Use-case diagram

```mermaid
flowchart LR
  visitor([Vizitor publik])
  citizen([Qytetar])
  official([Zyrtar komunal])
  admin([Administrator])

  subgraph platform["Citizen Issue Reporting Platform"]
    publicMap([Shiko hartën publike])
    publicReport([Shiko raportin publik])
    authenticate([Regjistrohu / hyr / rikupero llogarinë])
    createReport([Krijo raport me lokacion dhe fotografi])
    trackOwn([Ndiq raportimet e mia])
    comment([Komento dhe merr njoftime])
    officialOverview([Shiko panelin dhe radhën operative])
    verify([Verifiko raportin])
    assign([Cakto departamentin])
    workflow([Ndrysho statusin dhe dokumento zgjidhjen])
    manage([Menaxho përdorues, role, departamente dhe kategori])
    analytics([Shiko SLA, statistika, heatmap dhe audit log])
    export([Eksporto CSV / JSON])
  end

  visitor --> publicMap
  visitor --> publicReport
  citizen --> authenticate
  citizen --> createReport
  citizen --> trackOwn
  citizen --> comment
  official --> verify
  official --> officialOverview
  official --> assign
  official --> workflow
  official --> comment
  admin --> manage
  admin --> analytics
  admin --> export
```

Të gjitha rastet e përdorimit të paraqitura më sipër janë implementuar deri në
Sprintin 8. Vizualizimi publik/administrativ i dendësisë përdor vetëm
koordinata publike të përgjithësuara.

## State diagram i raportit

```mermaid
stateDiagram-v2
  [*] --> Submitted
  Submitted --> UnderReview: fillon verifikimi
  UnderReview --> Assigned: caktohet departamenti
  UnderReview --> Rejected: refuzohet me arsye
  Assigned --> InProgress: fillon puna
  InProgress --> Resolved: zgjidhet me shënime
  Resolved --> Reopened: qytetari e rihap me arsye
  Reopened --> UnderReview: riverifikim
  Rejected --> [*]
  Resolved --> [*]
```

Këto janë saktësisht kalimet që zbaton
`validate_report_status_transition()`.

## ER diagram

```mermaid
erDiagram
  AUTH_USERS ||--|| PROFILES : "zgjeron"
  AUTH_USERS ||--o{ REPORTS : "raporton"
  AUTH_USERS ||--o{ REPORT_COMMENTS : "shkruan"
  AUTH_USERS ||--o{ REPORT_ATTACHMENTS : "ngarkon"
  AUTH_USERS ||--o{ NOTIFICATIONS : "pranon"
  DEPARTMENTS ||--o{ PROFILES : "ka zyrtarë"
  DEPARTMENTS ||--o{ CATEGORIES : "përgjegjës për"
  DEPARTMENTS ||--o{ REPORTS : "trajton"
  CATEGORIES ||--o{ REPORTS : "klasifikon"
  REPORTS ||--o{ REPORT_STATUS_HISTORY : "ka histori"
  REPORTS ||--o{ REPORT_COMMENTS : "ka komente"
  REPORTS ||--o{ REPORT_ATTACHMENTS : "ka prova"
  REPORTS ||--o{ NOTIFICATIONS : "gjeneron"
  AUTH_USERS ||--o{ AUDIT_LOGS : "vepron"

  AUTH_USERS {
    uuid id PK
    text email
  }
  PROFILES {
    uuid id PK_FK
    text email
    text full_name
    user_role role
    uuid department_id FK
  }
  DEPARTMENTS {
    uuid id PK
    text code
    text name
    boolean is_active
  }
  CATEGORIES {
    uuid id PK
    text slug
    text name
    smallint default_sla_hours
    uuid department_id FK
  }
  REPORTS {
    uuid id PK
    bigint report_number UK
    uuid citizen_id FK
    uuid category_id FK
    uuid department_id FK
    report_status status
    report_priority priority
    geography location_private
    geography public_location
    timestamptz sla_due_at
    boolean is_public
  }
  REPORT_STATUS_HISTORY {
    uuid id PK
    uuid report_id FK
    report_status previous_status
    report_status new_status
    uuid changed_by FK
    timestamptz created_at
  }
  REPORT_COMMENTS {
    uuid id PK
    uuid report_id FK
    uuid author_id FK
    text body
    boolean is_internal
    timestamptz created_at
  }
  REPORT_ATTACHMENTS {
    uuid id PK
    uuid report_id FK
    uuid uploaded_by FK
    text object_path UK
    attachment_kind kind
    boolean is_internal
  }
  NOTIFICATIONS {
    uuid id PK
    uuid recipient_id FK
    uuid report_id FK
    text type
    timestamptz read_at
  }
  AUDIT_LOGS {
    uuid id PK
    uuid actor_id FK
    text action
    text entity_type
    uuid entity_id
    jsonb details
    timestamptz created_at
  }
```

`audit_logs` është tabelë append-only me `actor_id`, `action`, `entity_type`,
`entity_id`, `details` dhe `created_at`; lidhja me entitetin është logjike
sepse auditimi mund të përfshijë disa lloje entitetesh.

## Architecture diagram

```mermaid
flowchart TB
  user["Browser / Mobile Web"]
  next["Next.js 16 App Router\nPublic UI · Auth UI · Protected workspace\nServer Actions · SSR session checks"]
  osm["OpenStreetMap tile service"]

  subgraph supabase["Supabase"]
    auth["Auth\nPKCE · email/password · session cookies"]
    db["PostgreSQL + PostGIS\nRLS · triggers · views · RPC"]
    storage["Private Object Storage\nreport-evidence"]
  end

  user --> next
  user --> osm
  next --> auth
  next --> db
  user -->|"authenticated upload, Storage RLS"| storage
  storage -->|"object_path metadata"| db
```

Nuk ekziston backend i veçantë Express/NestJS në implementimin aktual.
Autorizimi për të dhënat mbetet në PostgreSQL RLS dhe Storage policies.

## Sequence diagram — administrimi dhe eksporti

```mermaid
sequenceDiagram
  actor Admin as Administratori
  participant Next as Next.js /admin
  participant Auth as Supabase Auth
  participant DB as PostgreSQL/RLS/Triggers

  Admin->>Next: Hap panelin ose dërgon ndryshim
  Next->>Auth: getUser()
  Auth-->>Next: user i verifikuar
  Next->>DB: Lexon rolin autoritativ nga profiles
  DB-->>Next: admin
  Next->>DB: UPDATE profil/departament/kategori
  DB->>DB: RLS + kufijtë e integritetit
  DB->>DB: INSERT audit_logs me actor_id
  DB-->>Next: Ndryshimi u ruajt
  opt Eksport CSV/JSON
    Next->>DB: SELECT fusha operative me filtra
    Next->>DB: record_admin_export(format, filters, row_count)
    DB->>DB: Verifikon admin dhe shkruan audit log
    Next-->>Admin: Skedar pa identitet/lokacion privat
  end
```

## Sequence diagram — transparenca publike

```mermaid
sequenceDiagram
  actor Visitor as Vizitori
  participant Next as Next.js public routes
  participant Cache as Cache 30-sekondëshe
  participant DB as Views publike / RLS

  Visitor->>Next: Hap /map ose /reports/[id]
  Next->>Cache: Kërkon datasetin publik të sanitizuar
  alt Cache miss
    Cache->>DB: SELECT public_reports/comments/history
    DB->>DB: security_barrier + is_public + public_location
    DB-->>Cache: Vetëm kontrata publike
  end
  Cache-->>Next: Raportet, historiku dhe komentet publike
  Next->>Next: Filtron dhe agregaton koordinatat e përgjithësuara
  Next-->>Visitor: Hartë/listë/statistika ose “nuk u gjet”
```

## Sequence diagram — krijimi i raportit

```mermaid
sequenceDiagram
  actor Citizen as Qytetari
  participant Browser as Next.js Client
  participant Action as createCitizenReport
  participant Auth as Supabase Auth
  participant DB as PostgreSQL/PostGIS
  participant Storage as Private Storage

  Citizen->>Browser: Plotëson tekstin, kategorinë dhe hartën
  opt Ka fotografi
    Browser->>Browser: Validon, dekodon dhe ri-enkodon pa EXIF/GPS
  end
  Browser->>Action: Dërgon draftin pa public_location
  Action->>Auth: getUser()
  Auth-->>Action: user i verifikuar
  Action->>DB: Kontrollon kategorinë aktive
  Action->>DB: INSERT report (submitted, normal, private)
  DB->>DB: RLS + rate limit + SLA + status history + audit
  DB-->>Action: id dhe report_number
  Action-->>Browser: Raporti u krijua
  opt Ka fotografi të sanitizuar
    Browser->>Auth: Rikonfirmon session-in
    Browser->>Storage: Upload në reports/{reportId}/{randomUuid}
    Storage->>Storage: Kontrollon bucket, owner, MIME, size dhe RLS
    Browser->>DB: INSERT report_attachments
    DB->>DB: Verifikon owner, kind dhe përputhjen report/path
    DB-->>Browser: Prova u regjistrua
  end
  Browser-->>Citizen: Success ose paralajmërim i kontrolluar
```

## Sequence diagram — paneli dhe workflow zyrtar

```mermaid
sequenceDiagram
  actor Official as Zyrtari
  participant Next as Next.js workspace
  participant Auth as Supabase Auth
  participant DB as PostgreSQL/RLS/RPC
  participant Citizen as Qytetari

  Official->>Next: Hap /official
  Next->>Auth: getUser()
  Auth-->>Next: user i verifikuar
  Next->>DB: Lexon profilin, raportet dhe njoftimet
  DB->>DB: Zbaton scope-in RLS sipas rolit/departamentit
  DB-->>Next: Ngarkesa, radha operative dhe caktimet
  Next-->>Official: Paneli zyrtar
  Official->>Next: Hap raportin dhe dërgon tranzicionin
  Next->>Auth: Rikonfirmon user-in dhe rolin
  Next->>DB: transition_report_workflow(...)
  DB->>DB: Validon state machine, caktimin dhe shënimin
  DB->>DB: Shkruan history, audit log dhe notification
  DB-->>Next: Workflow i përditësuar
  Next-->>Official: Statusi, historia dhe feedback-u
  DB-->>Citizen: Njoftim për statusin/komentin publik
```
