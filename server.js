
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

async function sendXlsxMail(subject, rows) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Solicitud');
  ws.addRow(Object.keys(rows));
  ws.addRow(Object.values(rows));

  const buffer = await wb.xlsx.writeBuffer();

  const info = await transporter.sendMail({
    from: `RR <${process.env.SMTP_USER}>`,
    to: process.env.TO_EMAIL,
    subject,
    text: JSON.stringify(rows, null, 2),
    attachments: [{
      filename: subject.replace(/\s+/g,'_') + '.xlsx',
      content: buffer
    }]
  });
  return info;
}

// endpoints
app.post('/api/cadeteria', async (req, res) => {
  try {
    const data = {
      nombre: req.body.nombre || '',
      telefono: req.body.telefono || '',
      direccion: req.body.direccion || '',
      fechaHora: req.body.fechaHora || '',
      vehiculo: req.body.vehiculo || '',
      indicaciones: req.body.indicaciones || ''
    };
    await sendXlsxMail('Cadeteria - Nueva comanda', data);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'No se pudo enviar el mail' });
  }
});

app.post('/api/transporte', async (req, res) => {
  try {
    const data = {
      nombre: req.body.nombre || '',
      telefono: req.body.telefono || '',
      direccionOrigen: req.body.direccionOrigen || '',
      direccionDestino: req.body.direccionDestino || '',
      fechaHoraBusqueda: req.body.fechaHoraBusqueda || '',
      vehiculo: req.body.vehiculo || '',
      indicaciones: req.body.indicaciones || '',
      frecuencia: req.body.frecuencia || ''
    };
    await sendXlsxMail('Transporte - Nueva solicitud', data);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'No se pudo enviar el mail' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log('Servidor escuchando en http://localhost:' + PORT));
