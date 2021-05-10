import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocialAuthService, SocialUser} from 'angularx-social-login';
import { BehaviorSubject, from, Subject} from 'rxjs';

@Injectable()
export class AuthService {
  user$: BehaviorSubject<SocialUser | null> =  new BehaviorSubject(this.getUser());
  constructor(private http: HttpClient, private socialService: SocialAuthService) {

   }
   getUser(){
     const user = localStorage.getItem('user');
     //console.log(user);
     if(user){
       return JSON.parse(user);
     }
     return null;
   }
   
   login(user: SocialUser){
     this.user$.next(user);
     this.http.get('http://localhost:3000/api/login', {
       headers: {
         'Authorization': `Bearer ${user?.idToken}`
       }
     }).subscribe(response => {
       localStorage.setItem('user', JSON.stringify(user));
     });
   }

   logout(){
     localStorage.removeItem('user');
     this.socialService.signOut();
     this.user$.next(null);
   }

   isLoggedIn(){
     return Boolean(this.user$.value);
   }
}
