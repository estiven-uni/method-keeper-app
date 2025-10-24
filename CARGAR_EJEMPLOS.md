# 📝 Cómo Cargar Métodos de Ejemplo

## Opción 1: Desde la Consola del Navegador (Más Rápido)

1. Abre la aplicación en el navegador: http://localhost:4200
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña "Console"
4. Copia y pega el siguiente código:

```javascript
// Métodos de ejemplo
const metodosEjemplo = [
  {
    id: "ejemplo-1",
    titulo: "Cómo hacer Café Perfecto",
    descripcion: "Guía completa para preparar la taza de café perfecta en casa.",
    pasosPrevios: [
      "Seleccionar granos de café de calidad",
      "Moler los granos justo antes de preparar",
      "Calentar el agua a 90-96°C",
      "Precalentar la taza o termo"
    ],
    pasosPrincipales: [
      "Medir 60g de café por litro de agua",
      "Colocar el café molido en el filtro",
      "Verter el agua en círculos desde el centro",
      "Dejar reposar 30 segundos (blooming)",
      "Continuar vertiendo agua lentamente",
      "Esperar a que termine el goteo (3-4 minutos)",
      "Servir inmediatamente"
    ],
    notas: "Para mejor sabor, usa agua filtrada. El café sabe mejor si se consume dentro de los primeros 15 minutos.",
    etiquetas: ["cocina", "bebidas", "café", "matutino"],
    fechaCreacion: new Date().toISOString(),
    ultimaModificacion: new Date().toISOString()
  },
  {
    id: "ejemplo-2",
    titulo: "Método Pomodoro para Estudiar",
    descripcion: "Técnica de gestión del tiempo que mejora la concentración usando intervalos de 25 minutos.",
    pasosPrevios: [
      "Elegir la tarea a realizar",
      "Eliminar todas las distracciones",
      "Preparar un timer o app Pomodoro",
      "Tener agua y snacks cerca"
    ],
    pasosPrincipales: [
      "Configurar el timer para 25 minutos",
      "Trabajar con concentración total",
      "No interrumpir hasta que suene el timer",
      "Marcar un pomodoro completado",
      "Tomar un descanso de 5 minutos",
      "Después de 4 pomodoros, descanso largo (15-30 min)"
    ],
    notas: "Es importante respetar los descansos. Durante los descansos, aléjate de la pantalla.",
    etiquetas: ["estudio", "productividad", "concentración"],
    fechaCreacion: new Date().toISOString(),
    ultimaModificacion: new Date().toISOString()
  },
  {
    id: "ejemplo-3",
    titulo: "Rutina Matutina Productiva",
    descripcion: "Rutina optimizada para empezar el día con energía y claridad mental.",
    pasosPrevios: [
      "Dormir temprano (antes de 11 PM)",
      "Dejar el teléfono fuera del dormitorio",
      "Preparar ropa del día anterior"
    ],
    pasosPrincipales: [
      "Despertarse a la misma hora (6:00 AM)",
      "No revisar el teléfono la primera hora",
      "Beber un vaso grande de agua",
      "5 minutos de estiramientos",
      "Ducha (terminar con agua fría)",
      "Desayuno saludable",
      "10 minutos de meditación",
      "Revisar objetivos del día"
    ],
    notas: "La consistencia es clave. Adapta los horarios a tu cronótipo.",
    etiquetas: ["productividad", "hábitos", "salud", "bienestar"],
    fechaCreacion: new Date().toISOString(),
    ultimaModificacion: new Date().toISOString()
  }
];

// Cargar en localStorage
localStorage.setItem('metodos', JSON.stringify(metodosEjemplo));

// Recargar la página para ver los cambios
location.reload();
```

5. Presiona Enter
6. La página se recargará y verás los métodos de ejemplo

## Opción 2: Manual (Más Control)

Simplemente crea los métodos uno por uno usando la interfaz:
1. Click en "Nuevo Método"
2. Completa el formulario con los datos de ejemplo
3. Guarda
4. Repite para cada método de ejemplo

## 🗑️ Limpiar Ejemplos

Si quieres empezar de cero, ejecuta en la consola:

```javascript
localStorage.clear();
location.reload();
```

## 📄 Archivo de Ejemplos

Los ejemplos completos están en: `ejemplos-metodos.json`

Incluye 5 métodos variados:
1. ☕ Cómo hacer Café Perfecto
2. 📚 Método Pomodoro para Estudiar
3. 🚀 Deploy de Aplicación a Netlify
4. 🌅 Rutina Matutina Productiva
5. 💻 Cómo Resolver Conflictos Git

## 💡 Tips

- Los ejemplos te ayudan a entender cómo usar la app
- Puedes editarlos y adaptarlos a tus necesidades
- Son un buen punto de partida para crear tus propios métodos
- Úsalos como plantillas para métodos similares

---

**¡Experimenta con los ejemplos y luego crea los tuyos!**

