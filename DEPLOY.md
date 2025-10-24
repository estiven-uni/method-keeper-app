# 🚀 Guía de Despliegue en Netlify

## Opción 1: Deploy desde GitHub (Recomendado)

### Paso 1: Preparar el repositorio

1. Inicializa git (si no lo has hecho):
```bash
git init
git add .
git commit -m "Initial commit: Method Keeper App"
```

2. Sube el código a GitHub:
```bash
git remote add origin <tu-repositorio-url>
git branch -M main
git push -u origin main
```

### Paso 2: Conectar con Netlify

1. Ve a [Netlify](https://netlify.com) y crea una cuenta o inicia sesión
2. Click en "Add new site" → "Import an existing project"
3. Selecciona "GitHub" y autoriza Netlify
4. Selecciona tu repositorio
5. Netlify detectará automáticamente la configuración desde `netlify.toml`
6. Click en "Deploy site"

¡Listo! Tu sitio estará disponible en unos minutos.

## Opción 2: Deploy Manual (Rápido)

### Usando Netlify CLI

1. Instala Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Inicia sesión:
```bash
netlify login
```

3. Compila el proyecto:
```bash
npm run build:prod
```

4. Deploy:
```bash
netlify deploy --prod --dir=dist/method-keeper-app/browser
```

### Usando la interfaz web de Netlify

1. Compila el proyecto:
```bash
npm run build:prod
```

2. Ve a [Netlify Drop](https://app.netlify.com/drop)
3. Arrastra y suelta la carpeta `dist/method-keeper-app/browser`

## Configuración Automática

El archivo `netlify.toml` ya está configurado con:

```toml
[build]
  publish = "dist/method-keeper-app/browser"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Esta configuración asegura que:
- ✅ Las rutas de Angular funcionen correctamente (SPA)
- ✅ Se compile automáticamente con cada push
- ✅ Se optimice para producción

## Variables de Entorno (Opcional)

Si necesitas configurar variables de entorno:

1. En Netlify Dashboard → Site settings → Environment variables
2. Agrega las variables necesarias
3. Reconstruye el sitio

## Dominio Personalizado

1. En Netlify Dashboard → Domain settings
2. Click en "Add custom domain"
3. Sigue las instrucciones para configurar DNS

## Optimizaciones Post-Deploy

### 1. Habilitar HTTPS
- Netlify lo hace automáticamente

### 2. Configurar Headers de Seguridad
Agrega a `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

### 3. Configurar Caché
Agrega a `netlify.toml`:
```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## Troubleshooting

### Error: "Page Not Found" en rutas
- Verifica que el archivo `netlify.toml` esté en la raíz
- Verifica que la configuración de redirects esté correcta

### Error: "Build Failed"
- Verifica que `package.json` tenga el script `build`
- Verifica que todas las dependencias estén en `dependencies` (no en `devDependencies`)

### La app no carga los estilos
- Verifica que `base href="/"` esté en `index.html`
- Verifica que los archivos CSS se hayan generado en el build

## Monitoreo

Netlify proporciona:
- 📊 Analytics (plan premium)
- 📧 Notificaciones de deploy
- 📝 Logs de compilación
- 🔄 Rollback a versiones anteriores

## Actualizaciones Continuas

Con el setup de GitHub + Netlify:
1. Haz cambios en tu código local
2. Commit y push a GitHub
3. Netlify detecta el cambio y deploya automáticamente
4. Tu sitio se actualiza en 2-3 minutos

## URLs Útiles

- Dashboard: https://app.netlify.com
- Documentación: https://docs.netlify.com
- Status: https://www.netlifystatus.com

---

**¡Disfruta tu aplicación en vivo! 🎉**

