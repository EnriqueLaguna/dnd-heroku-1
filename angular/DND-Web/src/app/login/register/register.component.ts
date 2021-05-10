import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../shared/user-service.service';
interface FormType {
  userName: string | undefined;
  email: string | undefined;
  password: string | undefined;
  password_c: string | undefined;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
  providers: [UserServiceService]
})
export class RegisterComponent implements OnInit {
  user: FormType = {
    userName: undefined,
    email: undefined,
    password: undefined,
    password_c: undefined
  }
  matchingPasswords: boolean = this.user.password === this.user.password_c;
  passlength = 4;
  passIsMinLength: boolean;
  canLogin: boolean;


  constructor(private userService: UserServiceService) { }


  ngOnInit(): void {
  }

  passChange() {
    this.matchingPasswords = this.user.password === this.user.password_c;
    this.passIsMinLength = this.user.password.length >= this.passlength;
    this.canLogin = this.matchingPasswords && this.passIsMinLength;
  }

  login() {
    this.userService.createUser(this.user).subscribe(res => console.log(res));

  }
}
