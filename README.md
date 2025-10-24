# 📚 Method Keeper - Mis Métodos

Una aplicación web moderna y ligera para administrar métodos, guías y procedimientos personales. Construida con Angular 17, Angular Material y Tailwind CSS.

## ✨ Características

- ✅ **CRUD Completo**: Crea, lee, actualiza y elimina métodos
- ✏️ **Edición de Pasos**: Edita pasos individuales con formato de texto
- 📝 **Formato de Texto**: Soporte para negrilla y enlaces automáticos en pasos
- 📥 **Importar desde JSON**: Carga métodos completos desde archivos JSON
- 🔍 **Búsqueda Inteligente**: Busca por título, descripción o etiquetas
- 🌗 **Modo Oscuro/Claro**: Tema personalizable con persistencia
- 💾 **LocalStorage**: Persistencia de datos sin necesidad de backend
- 📱 **Responsive**: Diseño mobile-first que se adapta a cualquier dispositivo
- ⚡ **Rápido**: Optimizado para velocidad y rendimiento
- 🎨 **Moderno**: UI limpia y profesional con Material Design

## 🚀 Comenzar

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm (viene con Node.js)

### Instalación

```bash
# Clonar el repositorio (si aplica)
git clone <tu-repositorio>

# Navegar al directorio
cd method-keeper-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200/`

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm start                 # Servidor de desarrollo

# Producción
npm run build            # Build para producción
npm run build:prod       # Build optimizado para producción

# Testing
npm test                 # Ejecutar tests
```

## 📦 Estructura del Proyecto

```
src/
├── app/
│   ├── components/           # Componentes de la aplicación
│   │   ├── lista-metodos/    # Lista y búsqueda de métodos
│   │   ├── formulario-metodo/# Crear/editar métodos
│   │   ├── detalle-metodo/   # Ver detalle completo
│   │   └── confirmar-dialogo/# Diálogo de confirmación
│   ├── models/               # Interfaces y tipos
│   │   └── metodo.interface.ts
│   ├── services/             # Servicios
│   │   ├── metodos.service.ts    # Gestión de métodos
│   │   └── theme.service.ts      # Gestión de tema
│   └── app.routes.ts         # Configuración de rutas
├── assets/                   # Recursos estáticos
└── styles.css               # Estilos globales
```

## 🎯 Funcionalidades Principales

### Gestión de Métodos

Cada método incluye:
- **Título** y **descripción**
- **Pasos previos**: Preparaciones o requisitos
- **Pasos principales**: Instrucciones paso a paso
- **Notas adicionales**: Consejos y advertencias
- **Etiquetas**: Para organización y búsqueda
- **Fechas**: Creación y última modificación

### Navegación

- `/` - Lista de todos los métodos
- `/nuevo` - Crear nuevo método
- `/editar/:id` - Editar método existente
- `/ver/:id` - Ver método en detalle

### Importar desde JSON

Puedes cargar métodos completos desde archivos JSON para acelerar la creación:

1. Ve a "Nuevo Método"
2. Haz clic en "Seleccionar archivo JSON"
3. Elige tu archivo `.json` con la estructura correcta
4. El formulario se rellenará automáticamente
5. Revisa y guarda

**Estructura del JSON:**
```json
{
  "titulo": "Título del método",
  "descripcion": "Descripción breve",
  "pasosPrevios": ["Paso 1", "Paso 2"],
  "pasosPrincipales": ["Paso 1", "Paso 2"],
  "notas": "Notas adicionales",
  "etiquetas": ["etiqueta1", "etiqueta2"]
}
```

**Ejemplos disponibles:**
- `metodo-ejemplo-chatgpt.json`: Ejemplo completo de un método real
- `metodo-ejemplo-simple.json`: Ejemplo simple de preparación de café

📖 **Más información**: Ver [CARGAR_JSON.md](./CARGAR_JSON.md) para documentación completa

### Formato de Texto en Pasos

Los pasos soportan formato especial para mejorar la legibilidad:

**Negrilla:**
- Usa `**texto**` para destacar palabras importantes
- Ejemplo: `Crear una **nueva cuenta de Google**`

**Enlaces automáticos:**
- Las URLs se convierten automáticamente en enlaces clicables
- Ejemplo: `Visita https://ejemplo.com para más información`
- Se abren en nueva pestaña automáticamente

**Edición de pasos:**
- Haz clic en el botón ✏️ de cualquier paso para editarlo
- Agrega o modifica el formato según necesites
- Guarda con el botón ✓ o cancela con ✗

📖 **Más información**: Ver [FORMATO_TEXTO.md](./FORMATO_TEXTO.md) para guía completa

## 🌐 Despliegue en Netlify

### Opción 1: Desde repositorio Git

1. Conecta tu repositorio a Netlify
2. Netlify detectará automáticamente la configuración desde `netlify.toml`
3. El sitio se desplegará automáticamente

### Opción 2: Deploy manual

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Build de producción
npm run build:prod

# Deploy
netlify deploy --prod --dir=dist/method-keeper-app/browser
```

### Configuración de Netlify

El archivo `netlify.toml` ya está configurado:
- **Build command**: `npm run build`
- **Publish directory**: `dist/method-keeper-app/browser`
- **Redirects**: Configurado para SPA (Single Page Application)

## 🎨 Personalización

### Cambiar Tema de Material

Edita `src/styles.css` para personalizar colores y estilos del tema.

### Modificar Comportamiento

Los servicios principales están en:
- `metodos.service.ts`: Lógica de CRUD y persistencia
- `theme.service.ts`: Gestión de tema oscuro/claro

## 📱 Responsive Design

La aplicación está optimizada para:
- 📱 Móviles (< 768px)
- 📱 Tablets (768px - 1024px)
- 💻 Desktop (> 1024px)

## 🔧 Tecnologías Utilizadas

- **Angular 17**: Framework principal
- **Angular Material**: Componentes UI
- **Tailwind CSS**: Utilidades de estilo
- **RxJS**: Programación reactiva
- **TypeScript**: Lenguaje de programación
- **LocalStorage API**: Persistencia de datos

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Si tienes preguntas o sugerencias, no dudes en abrir un issue.

---

Hecho con ❤️ usando Angular 17
