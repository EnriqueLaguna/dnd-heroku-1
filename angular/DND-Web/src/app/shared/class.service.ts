import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = 'http://localhost:4200/api';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  createClass(item) {
    const url = `${API_URL}/classes`;
    const newItem = {
      name: item.name,
      smallDescription: item.smallDescription,
      hitDie: item.hitDie,
      primaryAbility: item.primaryAbility,
      saves: item.saves,
      logo: item.logo,
      background: item.background,
      _id: item.id,
      _rev: item.rev,
      token: item.token
    }

    return this.http.post<{}>(url, newItem, this.httpOptions);
  }

  updateUser(item): Observable<{}> {
    const docId = item.id;
    const url = `${API_URL}/classes/${docId}`;

    const updatedItem = {
      name: item.name,
      smallDescription: item.smallDescription,
      hitDie: item.hitDie,
      primaryAbility: item.primaryAbility,
      saves: item.saves,
      logo: item.logo,
      background: item.background,
      _id: item.id,
      _rev: item.rev,
      token: item.token
    }
    return this.http.post<{}>(url, updatedItem, this.httpOptions)
  }

  getClass(classId?: string): Observable<{}> {
    let url: string;
    if (!classId) {
      url = `${API_URL}/classes/`;
    } else {
      url = `${API_URL}/classes/${classId}`;
    }
    return this.http.get<{}>(url, this.httpOptions);
  }
}
