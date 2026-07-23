# Dataset sintetik

`synthetic_dataset.json` përmban 120 raporte deterministike për demo dhe testim. Ai gjenerohet me:

```bash
node generate_dataset.js
```

Rregullat e dataset-it:

- nuk përmban emra, email, telefona, adresa ose fotografi reale;
- koordinatat përdorin një grid demonstrues të deklaruar sintetik dhe precizion publik 500 m;
- datat janë fikse për riprodhueshmëri akademike;
- statuset përdorin kodet e databazës: `submitted`, `under_review`, `assigned`, `in_progress`, `resolved`, `rejected`, `reopened`.
