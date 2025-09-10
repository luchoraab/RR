const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function enviarFormulario(data, tipo) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Datos');
  sheet.addRow(Object.keys(data));
  sheet.addRow(Object.values(data));

  const buffer = await workbook.xlsx.writeBuffer();

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.TO_EMAIL,
    subject: `Nueva solicitud de ${tipo}`,
    text: `Datos recibidos:\n${JSON.stringify(data, null, 2)}`,
    attachments: [
      {
        filename: `${tipo}.xlsx`,
        content: buffer
      }
    ]
  });
}

app.post('/api/cadeteria', async (req, res) => {
  try {
    await enviarFormulario(req.body, 'Cadetería');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/transporte', async (req, res) => {
  try {
    await enviarFormulario(req.body, 'Transporte');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
