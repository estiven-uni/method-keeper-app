# 📥 Cargar Métodos desde JSON

Esta funcionalidad permite cargar métodos completos desde archivos JSON, ahorrando tiempo al ingresar información.

## 🎯 Cómo usar

1. **Crear el formulario de nuevo método**
   - Haz clic en "Nuevo Método" desde la página principal

2. **Seleccionar archivo JSON**
   - En la sección superior verás un botón "Seleccionar archivo JSON"
   - Haz clic en el botón y selecciona tu archivo `.json`

3. **Verificar datos**
   - El formulario se rellenará automáticamente con los datos del JSON
   - Puedes editar cualquier campo antes de guardar

4. **Guardar el método**
   - Haz clic en "Crear Método" para guardar

## 📋 Estructura del JSON

El archivo JSON debe tener la siguiente estructura:

```json
{
  "titulo": "Título de tu método",
  "descripcion": "Descripción breve del método",
  "pasosPrevios": [
    "Primer paso previo",
    "Segundo paso previo"
  ],
  "pasosPrincipales": [
    "Primer paso principal",
    "Segundo paso principal",
    "Tercer paso principal"
  ],
  "notas": "Notas adicionales, consejos o advertencias",
  "etiquetas": ["etiqueta1", "etiqueta2", "etiqueta3"]
}
```

## ✅ Campos Requeridos

- `titulo`: String (obligatorio)
- `pasosPrincipales`: Array de strings (obligatorio, al menos un paso)

## 📝 Campos Opcionales

- `descripcion`: String
- `pasosPrevios`: Array de strings
- `notas`: String
- `etiquetas`: Array de strings

## 💡 Ejemplo de uso

Revisa el archivo `metodo-ejemplo-chatgpt.json` en la raíz del proyecto para ver un ejemplo completo.

## 🔧 Formato JSON

El archivo debe:
- Ser un JSON válido
- Tener extensión `.json`
- Usar codificación UTF-8
- Seguir la estructura especificada

## ⚠️ Notas importantes

- Los campos `id`, `fechaCreacion` y `ultimaModificacion` se generan automáticamente
- Si el archivo no es válido, recibirás un mensaje de error
- La funcionalidad de carga solo está disponible al crear nuevos métodos (no al editar)
- Después de cargar un JSON, puedes usar el botón "Limpiar formulario" para empezar de nuevo

## 🎨 Consejos

1. **Reutiliza métodos**: Exporta un método y modifícalo para crear uno similar
2. **Comparte métodos**: Envía archivos JSON a otros usuarios
3. **Respaldo**: Guarda tus métodos en formato JSON como backup
4. **Plantillas**: Crea plantillas JSON para diferentes tipos de métodos

