import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FormMetadataService {
  private apiUrl = `${environment.apiUrl}/metadata`;

  constructor(private http: HttpClient) {}

  getFormMetadata(entidade: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/form/${entidade}`);
  }

  buildFormFields(metadata: any): any[] {
    if (!metadata || !metadata.campos) {
      return [];
    }

    return metadata.campos.map((campo: any) => ({
      label: campo.label,
      name: campo.name,
      type: campo.type,
      required: campo.required || false,
      placeholder: `Digite ${campo.label.toLowerCase()}`,
      maxLength: campo.maxLength,
      min: campo.min,
      max: campo.max,
      options: campo.options,
      rows: campo.rows || 3,
    }));
  }
}
