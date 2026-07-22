const fs = require('fs');
const path = require('path');

const categories = ['rrugë/gropa', 'ndriçim', 'mbeturina', 'sinjalistikë'];
const statuses = ['dorëzuar', 'në verifikim', 'caktuar', 'në proces', 'zgjidhur', 'refuzuar', 'rihapur'];

// Bounding box for a generic city center (e.g. Pristina approx coords)
const minLat = 42.64;
const maxLat = 42.68;
const minLng = 21.14;
const maxLng = 21.18;

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInRange = (min, max) => Math.random() * (max - min) + min;

const dataset = [];

for (let i = 1; i <= 100; i++) {
  const category = getRandomItem(categories);
  const status = getRandomItem(statuses);
  const lat = getRandomInRange(minLat, maxLat);
  const lng = getRandomInRange(minLng, maxLng);
  const date = new Date(Date.now() - Math.floor(Math.random() * 10000000000));

  dataset.push({
    id: `REQ-${1000 + i}`,
    title: `Problem me ${category} - Rasti ${i}`,
    description: `Ky është një përshkrim sintetik për problemin e raportuar në kategorinë ${category}. Lokacioni është përafërsisht në qendër.`,
    category,
    location: {
      latitude: lat,
      longitude: lng
    },
    status,
    reportedAt: date.toISOString(),
    updatedAt: new Date(date.getTime() + Math.floor(Math.random() * 86400000)).toISOString(),
    photoUrl: null // No real photos to protect privacy
  });
}

const dir = path.join(__dirname, 'dataset');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

fs.writeFileSync(path.join(dir, 'synthetic_dataset.json'), JSON.stringify(dataset, null, 2));
console.log('Dataset with 100 items generated successfully.');
