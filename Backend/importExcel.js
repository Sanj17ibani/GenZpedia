const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const XLSX = require('xlsx');
const mongoose = require('./config/mongoose');
const { getConnectionOptions } = require('./config/db');
const Slang = require('./models/slangModel');

const EXCEL_PATH = path.join(__dirname, 'data', 'slang.xlsx');

const HEADER_TO_FIELD = {
  word: 'word',
  meaning: 'meaning',
  origin: 'origin',
  tone: 'tone',
  'emotional context': 'emotionalContext',
  example: 'example',
};

function normalizeHeader(h) {
  return String(h).trim().toLowerCase();
}

function mapRowToFields(row) {
  const out = {
    word: '',
    meaning: '',
    origin: '',
    tone: '',
    emotionalContext: '',
    exampleRaw: '',
  };
  for (const [key, val] of Object.entries(row)) {
    const field = HEADER_TO_FIELD[normalizeHeader(key)];
    if (!field) continue;
    const str = val != null ? String(val).trim() : '';
    if (field === 'emotionalContext') {
      out.emotionalContext = str;
    } else if (field === 'example') {
      out.exampleRaw = str;
    } else {
      out[field] = str;
    }
  }
  return out;
}

function splitExamples(raw) {
  if (raw == null || raw === '') return [];
  const s = String(raw).trim();
  if (!s) return [];
  const parts = s
    .split(/\s*(?:;|\||\r?\n)\s*/)
    .map((x) => x.trim())
    .filter(Boolean);
  if (parts.length > 1) return parts;
  return [s];
}

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI must be set in .env');
    process.exit(1);
  }

  if (!fs.existsSync(EXCEL_PATH)) {
    console.error('Excel file not found:', EXCEL_PATH);
    process.exit(1);
  }

  const uri = process.env.MONGO_URI;

  try {
    await mongoose.connect(uri, getConnectionOptions(uri));

    const existingDocs = await Slang.find().select('word').lean();
    const seenLower = new Set(
      existingDocs.map((d) => String(d.word).trim().toLowerCase())
    );

    const workbook = XLSX.readFile(EXCEL_PATH);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });

    let inserted = 0;
    const seenInFile = new Set();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const fields = mapRowToFields(row);
      const word = fields.word.trim();
      const meaning = fields.meaning.trim();
      const examples = splitExamples(fields.exampleRaw);

      if (!word || !meaning || examples.length === 0) {
        console.warn(`Skip row ${i + 2}: missing word, meaning, or example`);
        continue;
      }

      const key = word.toLowerCase();
      if (seenInFile.has(key)) {
        console.log(`Skip duplicate in file: ${word}`);
        continue;
      }
      if (seenLower.has(key)) {
        console.log(`Skip duplicate (already in DB): ${word}`);
        continue;
      }

      try {
        await Slang.create({
          word,
          meaning,
          origin: fields.origin || undefined,
          tone: fields.tone || undefined,
          emotionalContext: fields.emotionalContext || undefined,
          example: examples,
        });
        seenInFile.add(key);
        seenLower.add(key);
        inserted += 1;
        console.log(`Inserted: ${word}`);
      } catch (err) {
        if (err.code === 11000) {
          console.log(`Skip duplicate (index): ${word}`);
          continue;
        }
        throw err;
      }
    }

    console.log(`Done. Inserted ${inserted} document(s).`);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
