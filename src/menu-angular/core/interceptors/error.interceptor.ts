import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import type { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', {
          url: request.url,
          status: error.status,
          message: error.message,
          error: error.error
        });

        // Manejo específico por código de estado
        if (error.status === 0) {
          console.error('Error de conexión o CORS');
        } else if (error.status >= 400 && error.status < 500) {
          console.error('Error del cliente (4xx):', error.error);
        } else if (error.status >= 500) {
          console.error('Error del servidor (5xx):', error.error);
        }

        return throwError(() => error);
      })
    );
  }
}