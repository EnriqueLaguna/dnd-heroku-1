import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './authService';
import { SocialUser } from 'angularx-social-login';

const API_URL = 'http://localhost:4200/api';

interface inventory {
  objName: string | undefined,
  objLevel: number | undefined,
  objDesc: string | undefined
}

interface character {
  id: number | undefined,
  charName: string | undefined,
  charClass: string | undefined,
  charRace: string | undefined,
  charHp: number | undefined,
  charLevel: number | undefined,
  charImage: string | undefined,
  charInventory: inventory[] | undefined
}

@Injectable({
  providedIn: 'root'
})

export class CharacterServiceService{

  characters_array: character [] = [];
  user: SocialUser | null;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':'application/json'
    })
  }


  getCharacters(){
    return this.characters_array;
  }

  getUsers(userId?: string):Observable<{}>{
    let url: string;
    if(!userId){
      url = `${API_URL}/users/`;
    }else{
      url = `${API_URL}/users/${userId}`;
    }
    return this.http.get<{}>(url, this.httpOptions);
  }

  getBaseChars(){
    const user:SocialUser = this.authService.getUser();
    const userEmail = user.email;

    let url = `${API_URL}/users/${userEmail}`;
    return  this.http.get<{}>(url, this.httpOptions);
  }

  createCharacter(char){

    const user:SocialUser = this.authService.getUser();
    const userEmail = user.email;
    

    let newInv: inventory[] = [];
    //console.log(userEmail);

    //console.log('This is the new character: ' + JSON.stringify(newChar));
    let urlGet: string = `http://localhost:3000/api/users/${userEmail}`;
    let urlPut: string = `http://localhost:3000/api/users/${userEmail}`;


    let putChars:any[];
    let userMod;
    this.http.get<{}>(urlGet, this.httpOptions).subscribe(data => {
      //console.log('data: ');
      //console.log(data['characters']);

      let newChar: character = {
        id: data['characters'][data['characters'].length - 1].id + 1,
        charName: char.name,
        charClass: char.class,
        charRace: char.race,
        charHp: char.hp,
        charLevel: char.level,
        charImage: char.image,
        charInventory:  newInv
      } 

      putChars = data['characters'];
      putChars.push(newChar);
      //console.log(postChars);

      userMod = data;
      userMod['characters'] = putChars;
      //console.log(userMod);

      this.http.put<{}>(urlPut, userMod, this.httpOptions ).subscribe(data => {
        //console.log(data);
      })
    });
  }

  deleteCharSer(charId: number){
    const user:SocialUser = this.authService.getUser();
    const userEmail = user.email;

    console.log("id:" + charId);

    let urlGet: string = `http://localhost:3000/api/users/${userEmail}`;
    let urlPut: string = `http://localhost:3000/api/users/${userEmail}`

    let deleteChars:any[];
    let userMod;
    this.http.get<{}>(urlGet, this.httpOptions).subscribe(data => {
      console.log(data['characters']);

      //Obtener el arreglo de los personajes
      deleteChars = data['characters'];

      //Obtengo el indice del personaje a matar
      let deleteCharIndex = deleteChars.findIndex(ele => ele.id == charId);

      console.log(deleteCharIndex);

      //Eliminar del arreglo al personaje seleccionado
      deleteChars.splice(deleteCharIndex, 1);

      console.log(deleteChars);

      userMod = data;
      userMod['characters'] = deleteChars;
      
      this.http.put<{}>(urlPut, userMod, this.httpOptions).subscribe();

    })
  }

  updateCharacter(updatedChar, userEmail: string){
    //console.log(updatedChar, userEmail);

    let urlGet:string = `http://localhost:3000/api/users/${userEmail}`;
    let urlPut:string = `http://localhost:3000/api/users/${userEmail}`;

    let userMod;

    this.http.get<{}>(urlGet, this.httpOptions).subscribe(data => {

      //console.log(data);
      //Encuentro el personaje que actualizare y le asigno los valores nuevos
      data['characters'].forEach(element => {
        if(element.id == updatedChar.id){
          element.charName = updatedChar.charName;
          element.charClass = updatedChar.charClass;
          element.charRace = updatedChar.charRace;
          element.charHp = updatedChar.charHp;
          element.charLevel = updatedChar.charLevel;
        }        
      });

      //Asigno la nueva informacion al usuario que actualizare
      userMod = data;
      //console.log(userMod);

      this.http.put<{}>(urlPut, userMod, this.httpOptions).subscribe();

    })

  }
}
