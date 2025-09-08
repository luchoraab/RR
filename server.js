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

// If you prefer, uncomment to use dotenv locally
// import dotenv from "dotenv"; dotenv.config();

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_SECURE, // "true" or "false"
  TO_EMAIL = "contacto@rr-raab.com",
  FROM_EMAIL = "Comandas RR <no-reply@rr-raab.com>"
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: String(SMTP_SECURE || "false").toLowerCase() === "true",
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

app.post("/api/comanda", async (req, res) => {
  try {
    const { nombre, telefono, direccion, horario, vehiculo } = req.body || {};

    if (!nombre || !telefono || !direccion || !horario || !vehiculo) {
      return res.status(400).json({ ok: false, error: "Faltan campos obligatorios" });
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Comanda");

    ws.columns = [
      { header: "Nombre", key: "nombre", width: 30 },
      { header: "Teléfono", key: "telefono", width: 20 },
      { header: "Dirección", key: "direccion", width: 40 },
      { header: "Horario", key: "horario", width: 20 },
      { header: "Vehículo", key: "vehiculo", width: 12 },
      { header: "Fecha de carga", key: "timestamp", width: 22 }
    ];

    ws.addRow({
      nombre,
      telefono,
      direccion,
      horario,
      vehiculo,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19)
    });

    const buffer = await wb.xlsx.writeBuffer();
    const filename = `comanda_${Date.now()}.xlsx`;

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `Nueva comanda — ${nombre}`,
      text: `Llegó una nueva comanda\n\nNombre: ${nombre}\nTeléfono: ${telefono}\nDirección: ${direccion}\nHorario: ${horario}\nVehículo: ${vehiculo}`,
      attachments: [{ filename, content: buffer }]
    });

    return res.json({ ok: true, message: "Comanda enviada con éxito" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Error al procesar la comanda" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
