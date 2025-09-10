
// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Mail transport
function makeTransport(){
  // Prefer explicit SMTP config, fallback to Gmail well-known
  if(process.env.SMTP_HOST){
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE||'false').toLowerCase()==='true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Gmail SMTP (requires App Password)
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }
}

// Build XLSX buffer
async function buildWorkbook(sheetName, rows){
  const wb = new ExcelJS.Workbook();
  const sh = wb.addWorksheet(sheetName);
  if(rows.length){
    sh.columns = Object.keys(rows[0]).map(k => ({ header: k, key: k }));
    rows.forEach(r => sh.addRow(r));
  }
  return wb.xlsx.writeBuffer();
}

// Helpers
async function sendMail(subject, html, buffer, filename){
  const transporter = makeTransport();
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.TO_EMAIL,
    subject,
    html,
    attachments: buffer ? [{ filename, content: buffer }] : []
  });
  return info;
}

// Routes
app.post('/api/cadeteria', async (req,res) => {
  try{
    const { nombre, telefono, direccion, entregaFechaHora, vehiculo, indicaciones } = req.body;
    const rows = [{
      Nombre: nombre||'',
      Telefono: telefono||'',
      Direccion: direccion||'',
      'Entrega (Fecha & Hora)': entregaFechaHora||'',
      Vehiculo: vehiculo||'',
      Indicaciones: indicaciones||'',
      Recibido: new Date().toISOString()
    }];
    const buf = await buildWorkbook('Cadeteria', rows);
    const subject = 'Nueva comanda - Cadetería';
    const html = `<h2>Nueva comanda (Cadetería)</h2>
      <ul>
        <li><b>Nombre:</b> ${nombre||''}</li>
        <li><b>Teléfono:</b> ${telefono||''}</li>
        <li><b>Dirección:</b> ${direccion||''}</li>
        <li><b>Entrega:</b> ${entregaFechaHora||''}</li>
        <li><b>Vehículo:</b> ${vehiculo||''}</li>
        <li><b>Indicaciones:</b> ${indicaciones||''}</li>
      </ul>`;
    await sendMail(subject, html, buf, `cadeteria-${Date.now()}.xlsx`);
    res.json({ ok: true });
  }catch(err){
    console.error(err);
    res.status(500).json({ ok:false, error: err.message });
  }
});

app.post('/api/transporte', async (req,res) => {
  try{
    const { nombre, telefono, origen, destino, fechaHora, vehiculo, indicaciones, periodicidad } = req.body;
    const rows = [{
      Nombre: nombre||'',
      Telefono: telefono||'',
      Origen: origen||'',
      Destino: destino||'',
      'Fecha & Hora': fechaHora||'',
      Vehiculo: vehiculo||'',
      Indicaciones: indicaciones||'',
      Periodicidad: periodicidad||'Única vez',
      Recibido: new Date().toISOString()
    }];
    const buf = await buildWorkbook('Transporte', rows);
    const subject = 'Nueva solicitud - Transporte/Remis';
    const html = `<h2>Nueva solicitud (Transporte/Remis)</h2>
      <ul>
        <li><b>Nombre:</b> ${nombre||''}</li>
        <li><b>Teléfono:</b> ${telefono||''}</li>
        <li><b>Origen:</b> ${origen||''}</li>
        <li><b>Destino:</b> ${destino||''}</li>
        <li><b>Fecha & Hora:</b> ${fechaHora||''}</li>
        <li><b>Vehículo:</b> ${vehiculo||''}</li>
        <li><b>Indicaciones:</b> ${indicaciones||''}</li>
        <li><b>Periodicidad:</b> ${periodicidad||''}</li>
      </ul>`;
    await sendMail(subject, html, buf, `transporte-${Date.now()}.xlsx`);
    res.json({ ok: true });
  }catch(err){
    console.error(err);
    res.status(500).json({ ok:false, error: err.message });
  }
});

// Fallthrough to index
app.get('*', (req,res)=>{
  res.sendFile(path.join(__dirname,'public','index.html'));
});

app.listen(PORT, ()=>{
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
