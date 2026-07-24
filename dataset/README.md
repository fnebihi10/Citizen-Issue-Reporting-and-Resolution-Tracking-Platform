# Dataset sintetik

`synthetic_dataset.json` përmban 120 raporte deterministike për demo dhe testim.
I njëjti burim gjeneron edhe `supabase/seeds/synthetic_reports.sql`, prandaj
dataset-i akademik dhe databaza e demonstrimit nuk devijojnë nga njëra-tjetra.
Të dy artefaktet gjenerohen me:

```bash
npm run generate:dataset
```

Kontrolli në CI ose para commit-it:

```bash
npm run check:dataset
```

Rregullat e dataset-it:

- nuk përmban emra, email, telefona, adresa ose fotografi reale;
- koordinatat përdorin një grid demonstrues të deklaruar sintetik dhe precizion publik 500 m;
- datat janë fikse për riprodhueshmëri akademike;
- statuset përdorin kodet e databazës: `submitted`, `under_review`, `assigned`, `in_progress`, `resolved`, `rejected`, `reopened`.
- seed-i i databazës krijon 120 raporte për tre qytetarë sintetikë dhe ia lë
  trigger-it `generalize_location()` llogaritjen e çdo lokacioni publik;
- seed-i lejohet vetëm në `dev`/`staging`, asnjëherë në production.
