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
export class RaceService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': BASIC_AUTH
    })
  }

  createRace(race) {
    const url = `${CLOUDANT_URL}/races`;
    const newRace = {
      name: race.name,
      smallDescription: race.smallDescription,
      hitDie: race.hitDie,
      primaryAbility: race.primaryAbility,
      saves: race.saves,
      logo: race.logo,
      background: race.background,
      _id: race.id,
      _rev: race.rev,
      token: race.token
    }

    return this.http.post<{}>(url, newRace, this.httpOptions);
  }

  updateRace(race): Observable<{}> {
    const docId = race.id;
    const url = `${CLOUDANT_URL}/races/${docId}`;

    const updatedRace = {
      name: race.name,
      smallDescription: race.smallDescription,
      hitDie: race.hitDie,
      primaryAbility: race.primaryAbility,
      saves: race.saves,
      logo: race.logo,
      background: race.background,
      _id: race.id,
      _rev: race.rev,
      token: race.token
    }
    return this.http.post<{}>(url, updatedRace, this.httpOptions)
  }

  getRace(raceId: string): Observable<{}> {
    const url = `${CLOUDANT_URL}/races/${raceId}`;
    return this.http.get<{}>(url, this.httpOptions);
  }
  getAllRaces(): Observable<{}> {
    const url = `${CLOUDANT_URL}/races/`;
    return this.http.get<{}>(url, this.httpOptions);
  }
}
