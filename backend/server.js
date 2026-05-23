const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar CORS
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Asegurar que la carpeta 'uploads' existe antes de servirla estáticamente
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Servir la carpeta de archivos subidos como estática
app.use('/uploads', express.static(uploadsPath));

// Importar y montar rutas API
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Ocurrió un error interno en el servidor.'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`=============================================================`);
  console.log(` Servidor CPHS API ejecutándose en http://localhost:${PORT}`);
  console.log(` Directorio de carga de archivos: ${uploadsPath}`);
  console.log(`=============================================================`);
});
