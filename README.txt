# RR Servicios Integrales — Deploy rápido

1) Copiá `.env.example` a `.env` y completá:
   - SMTP_USER: tu mail (si usás Gmail, debe ser el mail con contraseña de aplicación)
   - SMTP_PASS: contraseña de aplicación
   - (Opcional) SMTP_HOST/PORT/SECURE para otro proveedor (Brevo, Mailersend, etc.)
   - TO_EMAIL: destino donde recibir las órdenes (por defecto contacto@rr-raab.com)

2) Instalá dependencias:
   npm install

3) Levantá el server en local:
   npm start
   -> http://localhost:10000

4) Render:
   - Root: este repo
   - Build command: npm install
   - Start command: npm start
   - Variables de entorno: todas las del .env
