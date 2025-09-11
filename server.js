
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: (process.env.SMTP_SECURE || 'true') === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendExcelMail(subject, fields, to = process.env.TO_EMAIL) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Solicitud');

  const headers = Object.keys(fields);
  ws.addRow(headers);
  ws.addRow(headers.map(h => fields[h] ?? ''));

  const buf = await wb.xlsx.writeBuffer();

  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to,
    subject,
    text: JSON.stringify(fields, null, 2),
    attachments: [{
      filename: `${subject.replace(/\s+/g,'_')}.xlsx`,
      content: buf
    }]
  });
  return info;
}

app.post('/api/cadeteria', async (req, res) => {
  try {
    const data = req.body;
    await sendExcelMail('Comanda_Cadeteria', data);
    res.json({ ok: true, message: 'Comanda enviada por email.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'No se pudo enviar el email.' });
  }
});

app.post('/api/transporte', async (req, res) => {
  try {
    const data = req.body;
    await sendExcelMail('Solicitud_Transporte', data);
    res.json({ ok: true, message: 'Solicitud enviada por email.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'No se pudo enviar el email.' });
  }
});

// fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor escuchando en http://localhost:' + PORT));
