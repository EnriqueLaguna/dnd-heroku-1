import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialUser } from 'angularx-social-login';
import { Subscription } from 'rxjs';
import { AuthService } from './shared/authService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{
  title = 'DND-Web';
  user: SocialUser | null;
  loggedIn: boolean = this.authService.isLoggedIn();

  constructor(private authService: AuthService, private router: Router){
  }

  ngOnInit(){
    this.authService.user$.subscribe((user) => {
      this.user = user;
      this.loggedIn = this.authService.isLoggedIn();
    });
  }

  onLogOut(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
