import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const CLOUDANT_USERNAME = environment.username;
const CLOUDANT_PASSWORD = environment.password;
const CLOUDANT_URL = environment.url;
const BASIC_AUTH = 'Basic ' + btoa(CLOUDANT_USERNAME + ':' + CLOUDANT_PASSWORD);

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': BASIC_AUTH
    })
  }

  createUser(user) {
    const url = `${CLOUDANT_URL}/users`;
    const newUser = {
      userName: user.userName,
      email: user.email,
      password: user.password,
      characters: user.characters,
      image: user.image,
      _id: user.id,
      _rev: user.rev,
      token: user.token
    }

    return this.http.post<{}>(url, newUser, this.httpOptions);
  }

  updateUser(user): Observable<{}> {
    const docId = user.id;
    const url = `${CLOUDANT_URL}/users/${docId}`;

    const updatedUser = {
      userName: user.userName,
      email: user.email,
      password: user.password,
      characters: user.characters,
      image: user.image,
      _id: user.id,
      _rev: user.rev,
      token: user.token
    }
    return this.http.post<{}>(url, updatedUser, this.httpOptions)
  }

  getUser(userId: string): Observable<{}> {
    const url = `${CLOUDANT_URL}/users/${userId}`;
    return this.http.get<{}>(url, this.httpOptions);
  }
  getAllUsers(): Observable<{}> {
    const url = `${CLOUDANT_URL}/users/`;
    return this.http.get<{}>(url, this.httpOptions);
  }


}
