# 📝 Formato de Texto en Pasos

MethodKeeper permite agregar formato a los pasos de tus métodos para destacar información importante y agregar enlaces.

## ✨ Características Disponibles

### 1. **Texto en Negrilla**

Usa `**texto**` para mostrar texto en negrilla.

**Ejemplo:**
```
Conectarse al **VPN con servidor en Alemania**
```

**Se verá como:**
Conectarse al **VPN con servidor en Alemania**

### 2. **Enlaces Automáticos**

Los enlaces (URLs) se detectan y convierten automáticamente en links clicables.

**Ejemplo:**
```
Visita la página oficial en https://ejemplo.com para más información
```

**Se verá como:**
Visita la página oficial en [https://ejemplo.com](https://ejemplo.com) para más información

El enlace se abrirá en una nueva pestaña automáticamente.

## 📋 Ejemplos Prácticos

### Ejemplo 1: Paso con énfasis
```
Crear una **nueva cuenta de Google** que nunca haya tenido ChatGPT
```

### Ejemplo 2: Paso con enlace
```
Ingresar al sitio oficial: https://chatgpt.com/?promo_campaign=team1dollar#team-pricing
```

### Ejemplo 3: Paso con negrilla y enlace
```
Visita **Google Maps** en https://maps.google.com y busca hoteles en Berlín
```

### Ejemplo 4: Advertencia destacada
```
⚠️ **IMPORTANTE:** No usar una cuenta que ya haya tenido suscripción
```

## 🎯 Cómo Usar

### Al Crear/Editar Pasos

1. **Agregar nuevo paso:**
   - Escribe tu texto en el campo de entrada
   - Usa `**` para rodear el texto que quieres en negrilla
   - Escribe las URLs completas (incluyendo https://)
   - Presiona el botón "+" o Enter

2. **Editar paso existente:**
   - Haz clic en el botón de editar (✏️) del paso
   - Modifica el texto con el formato deseado
   - Haz clic en el botón de guardar (✓)

### En la Vista de Detalle

Los pasos se mostrarán con:
- **Texto en negrilla** donde corresponda
- Enlaces clicables que se abren en nueva pestaña
- Los enlaces tendrán un color distintivo (azul/índigo)
- Al pasar el cursor sobre un enlace, se subrayará

## 💡 Consejos de Uso

1. **Usa negrilla para:**
   - Palabras clave importantes
   - Acciones principales
   - Advertencias o precauciones
   - Nombres de herramientas o servicios

2. **Usa enlaces para:**
   - Referencias a sitios web
   - URLs de registro o descarga
   - Documentación adicional
   - Recursos externos

3. **Combina formatos:**
   - Puedes usar negrilla y enlaces en el mismo paso
   - Puedes usar múltiples negrillas en un paso
   - Puedes incluir múltiples enlaces en un paso

## ⚠️ Restricciones

- Solo se soporta negrilla (no cursiva ni otros formatos)
- Los enlaces deben incluir el protocolo (http:// o https://)
- No se soporta formato en títulos, descripciones o etiquetas
- El formato solo funciona en:
  - Pasos Previos
  - Pasos Principales

## 🔧 Sintaxis Técnica

### Negrilla
- Formato: `**texto**`
- Se convierte en: `<strong>texto</strong>`

### Enlaces
- Formato: URLs que contengan `http://` o `https://`
- Se convierte en: `<a href="URL" target="_blank" rel="noopener noreferrer">URL</a>`
- Atributos:
  - `target="_blank"`: Abre en nueva pestaña
  - `rel="noopener noreferrer"`: Seguridad adicional

## 📄 Ejemplo Completo

Revisa los archivos:
- `metodo-ejemplo-chatgpt.json` - Método completo con formato
- `metodo-ejemplo-simple.json` - Ejemplo simple con formato

Ambos archivos incluyen ejemplos de negrilla y enlaces que puedes usar como referencia.

