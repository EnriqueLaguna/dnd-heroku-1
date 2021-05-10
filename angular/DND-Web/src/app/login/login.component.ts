import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { from, Subscription } from 'rxjs';
import { AuthService } from '../shared/authService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  user: SocialUser | null;

  constructor(private socialService: SocialAuthService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.user = null;
  }

  signWithGoogle(){
    from(this.socialService.signIn(GoogleLoginProvider.PROVIDER_ID)).subscribe({
      next: (user: SocialUser) => {
        this.authService.login(user);
        this.router.navigate(['/characters']);
      },
      error: (error) => {
        console.log('Error: ' + error);
      }
    })
  }

}
