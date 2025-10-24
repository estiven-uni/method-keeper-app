import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class DeepseekService {
  private apiKey = 'sk-84f32f59f9204edf855981a82fc00835';
  private apiUrl = 'https://api.deepseek.com/v1/chat/completions';

  constructor(private http: HttpClient) {}

  generarMetodo(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const instrucciones = `Eres un asistente que genera métodos en formato JSON siguiendo esta estructura EXACTA.

REGLAS OBLIGATORIAS:
- El campo "titulo" es OBLIGATORIO - Debe ser descriptivo y claro
- El campo "pasosPrincipales" es OBLIGATORIO - Mínimo 1 paso, máximo 15 pasos
- El campo "descripcion" es OPCIONAL pero recomendado - Breve resumen del método
- El campo "pasosPrevios" es OPCIONAL - Solo si hay preparaciones necesarias
- El campo "notas" es OPCIONAL - Para advertencias o consejos importantes
- El campo "etiquetas" es OPCIONAL - Array de 3-6 palabras clave
- El campo "activo" es OPCIONAL - true si funciona, false si no (por defecto true)

FORMATO:
- Usa **texto** para resaltar palabras importantes en negrita
- Las URLs se convierten automáticamente en enlaces
- Puedes usar emojis (⚠️ ✅ 🔗 💡 📌) para hacer el contenido visual
- Escribe en tono claro, directo y fácil de seguir
- Cada paso debe ser una acción concreta

RESPONDE ÚNICAMENTE CON EL JSON, SIN TEXTO ADICIONAL ANTES O DESPUÉS.

Ejemplo de estructura:
{
  "titulo": "Título del método",
  "descripcion": "Descripción breve",
  "activo": true,
  "pasosPrevios": ["Paso preparatorio 1", "Paso preparatorio 2"],
  "pasosPrincipales": ["**Paso 1** con detalles", "Paso 2 con https://enlace.com"],
  "notas": "⚠️ Notas importantes",
  "etiquetas": ["tag1", "tag2", "tag3"]
}`;

    const body = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: instrucciones
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    };

    return this.http.post<DeepSeekResponse>(this.apiUrl, body, { headers }).pipe(
      map(response => {
        const content = response.choices[0].message.content;
        // Limpiar el contenido para obtener solo el JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw new Error('No se pudo extraer el JSON de la respuesta');
      }),
      catchError(error => {
        console.error('Error al generar método con IA:', error);
        return throwError(() => error);
      })
    );
  }
}

