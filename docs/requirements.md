# Software Requirements Specification

## 1. Përshkrimi i sistemit

Platforma "Citizen Issue Reporting and Resolution Tracking Platform"
është një aplikacion web që mundëson qytetarët të raportojnë probleme lokale
dhe zyrtarët komunalë t'i menaxhojnë ato deri në zgjidhje.

---

# 2. Aktorët e sistemit

## Qytetari
- Krijon raport
- Shikon statusin e raportit
- Merr njoftime
- Komenton në raport

## Zyrtari Komunal
- Verifikon raportet
- Cakton departamentin
- Ndryshon statusin
- Shton komente

## Administratori
- Menaxhon përdoruesit
- Menaxhon kategoritë
- Shikon statistika
- Eksporton të dhëna

## Vizitori Publik
- Shikon hartën publike
- Shikon raportet e zgjidhura
- Nuk sheh të dhëna private

---

# 3. Kërkesat funksionale

## FR-01 Regjistrimi dhe autentifikimi

Sistemi duhet të lejojë krijimin e llogarive dhe hyrjen sipas roleve.

## FR-02 Krijimi i raportit

Qytetari duhet të mund të krijojë raport me:

- Titull
- Përshkrim
- Kategori
- Lokacion në hartë
- Fotografitë

## FR-03 Menaxhimi i statusit

Raporti duhet të ketë këto statuse:

- Dorëzuar
- Në verifikim
- Caktuar
- Në proces
- Zgjidhur
- Refuzuar
- Rihapur

## FR-04 Komentet

Përdoruesit duhet të mund të komunikojnë përmes komenteve.

## FR-05 Historia e ndryshimeve

Sistemi duhet të ruajë çdo ndryshim të raportit.

---

# 4. Kërkesat jofunksionale

## NFR-01 Siguria

- Kontroll sipas roleve
- Validim inputesh
- Rate limiting
- Audit log

## NFR-02 Performanca

Sistemi duhet të përballojë minimum 100 raportime sintetike.

## NFR-03 Privatësia

Identiteti i raportuesit nuk duhet të shfaqet publikisht.

## NFR-04 Përdorshmëria

Ndërfaqja duhet të jetë responsive për desktop dhe telefon.