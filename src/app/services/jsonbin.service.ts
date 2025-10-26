import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Metodo } from '../models/metodo.interface';

@Injectable({
  providedIn: 'root'
})
export class JsonbinService {
  private apiUrl = 'https://api.jsonbin.io/v3';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const apiKey = localStorage.getItem('jsonbin_api_key');
    if (!apiKey) {
      throw new Error('No se ha configurado el API Key de JSONBin. Por favor, ve a Configuración.');
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Master-Key': apiKey
    });
  }

  /**
   * Subir datos locales a JSONBin (crear o actualizar bin)
   */
  pushData(metodos: Metodo[]): Observable<any> {
    try {
      const binId = localStorage.getItem('jsonbin_bin_id');
      const headers = this.getHeaders();

      const data = {
        metodos: metodos,
        lastSync: new Date().toISOString(),
        config: {
          deepseekApiKey: localStorage.getItem('deepseek_api_key') || '',
          modoDesarrollo: localStorage.getItem('modo_desarrollo') === 'true'
        }
      };

      if (binId) {
        // Actualizar bin existente
        return this.http.put(`${this.apiUrl}/b/${binId}`, data, { headers }).pipe(
          map((response: any) => {
            return {
              success: true,
              message: 'Datos subidos a la nube exitosamente',
              binId: binId,
              record: response.record
            };
          }),
          catchError(error => {
            console.error('Error al subir datos:', error);
            return throwError(() => new Error('Error al sincronizar con la nube. Verifica tu API Key y Bin ID.'));
          })
        );
      } else {
        // Crear nuevo bin
        return this.http.post(`${this.apiUrl}/b`, data, { headers }).pipe(
          map((response: any) => {
            // Guardar el nuevo Bin ID
            const newBinId = response.metadata.id;
            localStorage.setItem('jsonbin_bin_id', newBinId);
            
            return {
              success: true,
              message: 'Bin creado exitosamente. Tu Bin ID ha sido guardado.',
              binId: newBinId,
              record: response.record
            };
          }),
          catchError(error => {
            console.error('Error al crear bin:', error);
            return throwError(() => new Error('Error al crear bin en la nube. Verifica tu API Key.'));
          })
        );
      }
    } catch (error: any) {
      return throwError(() => error);
    }
  }

  /**
   * Descargar datos desde JSONBin
   */
  pullData(): Observable<{ metodos: Metodo[], lastSync: string, config?: any }> {
    try {
      const binId = localStorage.getItem('jsonbin_bin_id');
      if (!binId) {
        return throwError(() => new Error('No se ha configurado el Bin ID. Primero sube datos o ingresa un Bin ID existente.'));
      }

      const headers = this.getHeaders();

      return this.http.get(`${this.apiUrl}/b/${binId}/latest`, { headers }).pipe(
        map((response: any) => {
          return {
            metodos: response.record.metodos || [],
            lastSync: response.record.lastSync || new Date().toISOString(),
            config: response.record.config || null
          };
        }),
        catchError(error => {
          console.error('Error al descargar datos:', error);
          if (error.status === 404) {
            return throwError(() => new Error('Bin no encontrado. Verifica tu Bin ID.'));
          }
          return throwError(() => new Error('Error al descargar datos de la nube. Verifica tu configuración.'));
        })
      );
    } catch (error: any) {
      return throwError(() => error);
    }
  }

  /**
   * Obtener información del bin
   */
  getBinInfo(): Observable<any> {
    try {
      const binId = localStorage.getItem('jsonbin_bin_id');
      if (!binId) {
        return throwError(() => new Error('No hay Bin ID configurado'));
      }

      const headers = this.getHeaders();

      return this.http.get(`${this.apiUrl}/b/${binId}`, { headers }).pipe(
        map((response: any) => response.metadata),
        catchError(error => {
          return throwError(() => new Error('Error al obtener información del bin'));
        })
      );
    } catch (error: any) {
      return throwError(() => error);
    }
  }

  /**
   * Verificar si las credenciales son válidas
   */
  testConnection(): Observable<boolean> {
    try {
      const headers = this.getHeaders();
      
      // Hacer una petición simple para verificar el API Key
      return this.http.get(`${this.apiUrl}/b`, { headers }).pipe(
        map(() => true),
        catchError(() => {
          return throwError(() => new Error('API Key inválido'));
        })
      );
    } catch (error: any) {
      return throwError(() => error);
    }
  }
}

