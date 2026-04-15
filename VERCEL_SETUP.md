# Guía de Deploy en Vercel - Santa Regina

## ✅ Pasos para desplegar en Vercel

### 1. Preparar el Repositorio
```bash
# Asegúrate de que el código esté en un repositorio Git
git init
git add .
git commit -m "Initial commit - Santa Regina website"
git remote add origin https://github.com/tu-usuario/santa-regina-web.git
git push -u origin main
```

### 2. Conectar con Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con GitHub, GitLab o Bitbucket
3. Haz clic en "Add New..." → "Project"
4. Busca y selecciona el repositorio `santa-regina-web`
5. Haz clic en "Import"

### 3. Configurar el Build
Vercel debería detectar automáticamente:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Si no lo detecta automáticamente:
1. Ve a "Settings" del proyecto
2. En "Build & Development Settings":
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 4. Variables de Entorno (Opcional)
Si necesitas variables de entorno:
1. Ve a Settings → Environment Variables
2. Agrega tus variables con prefijo `VITE_` para que sean accesibles en el cliente

### 5. Desplegar
1. Haz clic en "Deploy"
2. Vercel construirá e desplegará tu sitio automáticamente
3. Recibirás una URL pública como: `https://santa-regina-web.vercel.app`

## 🔄 Despliegues Automáticos

Después del primer deploy:
- Cada push a `main` (o tu rama principal) desplegará automáticamente
- Los PRs tendrán previsualizaciones automáticas en Vercel

## 📊 Monitorizar el Deployment

En el dashboard de Vercel puedes:
- Ver logs del build
- Verificar el rendimiento (Lighthouse)
- Rollback a versiones anteriores
- Ver analíticas de tráfico

## 🆘 Solución de Problemas

### El build falla
- Verifica que no haya errores en `npm run build` localmente
- Revisa los logs en Vercel
- Asegúrate de que todas las dependencias estén en `package.json`

### Las imágenes no cargan
- Verifica que estén en `/public/`
- Las referencias en el código deben ser como `/image.jpg`

### El sitio es lento
- Usa las herramientas de Vercel Analytics
- Revisa el Core Web Vitals en el dashboard
- Considera optimizar imágenes grandes

## 📝 Archivos de Configuración

- `vercel.json` - Configuración específica de Vercel
- `.vercelignore` - Archivos que Vercel no debe procesar
- `vite.config.js` - Configuración de build de Vite

Estos archivos ya están configurados correctamente en el proyecto.
