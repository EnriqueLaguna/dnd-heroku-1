
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const CLOUDANT_USERNAME = environment.username;
const CLOUDANT_PASSWORD = environment.password;
const CLOUDANT_URL = environment.url;

const BASIC_AUTH = 'Basic ' + btoa('CLOUDANT_USERNAME' + ':' + 'CLOUDANT_PASSWORD');


@Injectable({
  providedIn: 'root'
})
export class CloudantService {



  constructor(private http: HttpClient) { }

  // HTTP HEADERS
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': BASIC_AUTH
    })
  };
}
