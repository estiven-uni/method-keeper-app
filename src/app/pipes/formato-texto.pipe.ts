import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'formatoTexto',
  standalone: true
})
export class FormatoTextoPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(texto: string): SafeHtml {
    if (!texto) return '';

    // Convertir **texto** a <strong>texto</strong> para negrilla
    let resultado = texto.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Detectar URLs y convertirlas en links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    resultado = resultado.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 hover:underline">$1</a>');

    return this.sanitizer.sanitize(1, resultado) || '';
  }
}

