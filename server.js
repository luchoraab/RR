import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import ExcelJS from "exceljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const {
  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE,
  TO_EMAIL = "contacto@rr-raab.com",
  FROM_EMAIL = "RR <no-reply@rr-raab.com>"
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: String(SMTP_SECURE || "false").toLowerCase() === "true",
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

// Cadetería
app.post("/api/comanda", async (req, res) => {
  try {
    const { nombre, telefono, direccion, fechaHora, vehiculo, indicaciones } = req.body || {};
    if (!nombre || !telefono || !direccion || !fechaHora || !vehiculo) {
      return res.status(400).json({ ok: false, error: "Faltan campos obligatorios" });
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Cadeteria");
    ws.columns = [
      { header: "Servicio", key: "servicio", width: 14 },
      { header: "Nombre", key: "nombre", width: 30 },
      { header: "Teléfono", key: "telefono", width: 20 },
      { header: "Dirección", key: "direccion", width: 48 },
      { header: "Fecha/Hora entrega", key: "fechaHora", width: 22 },
      { header: "Vehículo", key: "vehiculo", width: 12 },
      { header: "Indicaciones", key: "indicaciones", width: 48 },
      { header: "Fecha de carga", key: "timestamp", width: 22 }
    ];
    ws.addRow({
      servicio: "Cadetería",
      nombre, telefono, direccion, fechaHora, vehiculo,
      indicaciones: indicaciones || "",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19)
    });

    const buffer = await wb.xlsx.writeBuffer();
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `Nueva comanda (Cadetería) — ${nombre}`,
      text:
`Llegó una nueva comanda (Cadetería)

Nombre: ${nombre}
Teléfono: ${telefono}
Dirección: ${direccion}
Fecha/Hora entrega: ${fechaHora}
Vehículo: ${vehiculo}
Indicaciones: ${indicaciones || "-"}`,
      attachments: [{ filename: `cadeteria_${Date.now()}.xlsx`, content: buffer }]
    });

    res.json({ ok: true, message: "Comanda enviada con éxito" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error al procesar la comanda" });
  }
});

// Transporte / Remis
app.post("/api/transporte", async (req, res) => {
  try {
    const {
      nombre, telefono, direccionOrigen, direccionDestino,
      fechaHoraBusqueda, vehiculo, indicaciones, frecuencia
    } = req.body || {};
    if (!nombre || !telefono || !direccionOrigen || !direccionDestino || !fechaHoraBusqueda || !vehiculo || !frecuencia) {
      return res.status(400).json({ ok: false, error: "Faltan campos obligatorios" });
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Transporte");
    ws.columns = [
      { header: "Servicio", key: "servicio", width: 14 },
      { header: "Nombre", key: "nombre", width: 30 },
      { header: "Teléfono", key: "telefono", width: 20 },
      { header: "Origen", key: "origen", width: 48 },
      { header: "Destino", key: "destino", width: 48 },
      { header: "Fecha/Hora búsqueda", key: "fechaHoraBusqueda", width: 22 },
      { header: "Vehículo", key: "vehiculo", width: 12 },
      { header: "Frecuencia", key: "frecuencia", width: 14 },
      { header: "Indicaciones", key: "indicaciones", width: 48 },
      { header: "Fecha de carga", key: "timestamp", width: 22 }
    ];
    ws.addRow({
      servicio: "Transporte/Remis",
      nombre, telefono,
      origen: direccionOrigen, destino: direccionDestino,
      fechaHoraBusqueda, vehiculo, frecuencia,
      indicaciones: indicaciones || "",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19)
    });

    const buffer = await wb.xlsx.writeBuffer();
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `Nueva solicitud (Transporte/Remis) — ${nombre}`,
      text:
`Llegó una nueva solicitud (Transporte/Remis)

Nombre: ${nombre}
Teléfono: ${telefono}
Origen: ${direccionOrigen}
Destino: ${direccionDestino}
Fecha/Hora búsqueda: ${fechaHoraBusqueda}
Vehículo: ${vehiculo}
Frecuencia: ${frecuencia}
Indicaciones: ${indicaciones || "-"}`,
      attachments: [{ filename: `transporte_${Date.now()}.xlsx`, content: buffer }]
    });

    res.json({ ok: true, message: "Solicitud enviada con éxito" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error al procesar la solicitud" });
  }
});

// Fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
