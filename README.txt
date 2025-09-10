
RR Servicios Integrales — Deploy rápido
=======================================

1) Copiá este proyecto completo a tu repo (incluye `public/`, `server.js`, `package.json`, `.env.example`).
2) Hacé `cp .env.example .env` y completá SMTP_USER/PASS/TO_EMAIL.
3) Instalar dependencias:
   npm install
4) Correr local:
   npm start
5) Deploy en Render:
   - Build Command: npm install
   - Start Command: npm start
   - Root Directory: (vacío)
   - Add Environment: variables del .env (no subas el .env).

Los formularios POST a:
- /api/cadeteria
- /api/transporte

Adjuntan un .xlsx al correo de destino.
