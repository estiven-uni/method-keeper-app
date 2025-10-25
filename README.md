# Method Keeper 📚

Una aplicación web moderna para organizar, gestionar y compartir métodos, tutoriales y guías paso a paso, con generación inteligente mediante IA.

![Angular](https://img.shields.io/badge/Angular-18-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)
![Material Design](https://img.shields.io/badge/Material_Design-18-9C27B0)

## ✨ Características

- 📝 **Crear y editar métodos** con pasos detallados
- 🤖 **Generación con IA** usando Deepseek API
- ☁️ **Sincronización en la nube** con JSONBin.io
- 🎨 **Personalización avanzada** de imágenes (tamaño, fondo, estilo)
- 🎥 **Videos tutoriales** embebidos (YouTube, Vimeo)
- 🏷️ **Sistema de etiquetas** para organización
- 🔍 **Búsqueda y filtros** inteligentes
- 📱 **Diseño responsive** y moderno
- 🌓 **Modo oscuro** completo
- 💾 **Almacenamiento local** con localStorage
- 📤 **Importar/Exportar** métodos en JSON
- ✅ **Estados** (Activo/Inactivo)

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/method-keeper-app.git
cd method-keeper-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 🔧 Scripts Disponibles

```bash
npm start          # Servidor de desarrollo
npm run build      # Build de producción
npm test           # Tests unitarios
npm run lint       # Linter
```

## 🎯 Uso

### Crear un Método Manual

1. Haz clic en **"Nuevo Método"**
2. Completa el formulario con título, descripción, pasos
3. Agrega imagen, video y etiquetas (opcional)
4. Guarda y visualiza

### Generar con IA

1. Haz clic en **"Generar con IA"**
2. Describe el método que deseas crear
3. La IA generará el método completo
4. Se crea automáticamente en tu lista

### Configurar API de Deepseek

1. Ve a **Configuración** (⚙️)
2. Obtén tu API Key en [Deepseek](https://platform.deepseek.com)
3. Pégala y guarda

### Sincronizar con la Nube (JSONBin.io)

1. Crea una cuenta gratis en [JSONBin.io](https://jsonbin.io)
2. Obtén tu **X-Master-Key** desde el dashboard
3. Ve a **Configuración** (⚙️) en Method Keeper
4. En la sección "Sincronización en la Nube":
   - Pega tu **API Key de JSONBin**
   - (Opcional) Ingresa un **Bin ID** si ya tienes uno
   - Haz clic en **Guardar Config.**

#### Opciones de sincronización:

- **📤 Subir a la Nube**: Envía tus métodos locales a JSONBin
  - Si es tu primera vez, se creará un Bin ID automáticamente
  - Útil para hacer respaldo de tus datos

- **📥 Descargar de la Nube**: Reemplaza tus métodos locales con los de la nube
  - Requiere que hayas configurado un Bin ID
  - ⚠️ **Advertencia**: Sobrescribe tus datos locales

- **🔄 Sincronización Bidireccional** (Recomendado): 
  - Combina tus métodos locales y en la nube sin perder datos
  - Usa la fecha de modificación para resolver conflictos
  - Mantiene ambos sincronizados

## 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── lista-metodos/          # Lista principal
│   │   ├── detalle-metodo/         # Vista detallada
│   │   ├── formulario-metodo/      # Crear/Editar
│   │   ├── generar-ia-dialogo/     # Generador IA
│   │   ├── configuracion-dialogo/  # Configuración
│   │   └── ...
│   ├── services/
│   │   ├── metodos.service.ts      # Gestión de métodos
│   │   ├── deepseek.service.ts     # Integración IA
│   │   ├── jsonbin.service.ts      # Sincronización nube
│   │   └── theme.service.ts        # Modo oscuro
│   └── models/
│       └── metodo.interface.ts     # Tipos
└── ...
```

## 🎨 Tecnologías

- **Framework**: Angular 18
- **UI**: Angular Material + Tailwind CSS
- **Estado**: RxJS + LocalStorage
- **IA**: Deepseek API
- **Cloud Storage**: JSONBin.io
- **Build**: Vite
- **Hosting**: Netlify

## 🌐 Deploy

El proyecto está configurado para Netlify:

```bash
npm run build
# Los archivos estarán en dist/method-keeper-app/browser
```

## 📝 Características Destacadas

### Personalización de Imágenes
- Ajuste de tamaño (10-100%)
- 9 colores de fondo predefinidos
- Modo "llenar espacio" o "mostrar completa"

### Videos Tutoriales
- Soporte para YouTube y Vimeo
- Embed automático
- Reproductor responsive

### Generador con IA
- Describe el método en lenguaje natural
- La IA genera: título, descripción, pasos, etiquetas
- Creación automática sin necesidad de editar

## 🔐 Privacidad

Todos los datos se almacenan localmente en tu navegador. La información solo se envía a servicios externos en los siguientes casos:

- **Generación con IA**: Solo el prompt se envía a Deepseek API
- **Sincronización en la nube** (opcional): Tus métodos se almacenan en JSONBin.io

Ambas funciones son **completamente opcionales** y requieren configuración manual.

## 🤝 Contribuir

Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👤 Autor

Creado con ❤️ para organizar y compartir conocimiento

## 🙏 Agradecimientos

- Angular Team
- Material Design
- Tailwind CSS
- Deepseek AI
- JSONBin.io

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!
