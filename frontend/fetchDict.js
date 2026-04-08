const axios = require('axios');
const fs = require('fs');

const apiUrl = (process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:5001').replace(/\/+$/, '');

axios.get(`${apiUrl}/api/slang`, {
    headers: {
        'ngrok-skip-browser-warning': 'true',
    },
}).then(res => {
    const tsCode = `export const DICTIONARY_DATA = ${JSON.stringify(res.data.data, null, 2)};\n`;
    fs.mkdirSync('./app/data', { recursive: true });
    fs.writeFileSync('./app/data/dictionaryData.ts', tsCode, 'utf8');
    console.log('Dictionary generated!');
}).catch(err => {
    console.error(err);
});
