import {Component, signal} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {UserService} from "../user.service";
import {CommonModule} from "@angular/common";
import { Router } from '@angular/router';
import {JwtService} from "../jwt.service";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    FormsModule,
    UserService,
    CommonModule,
    JwtService
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'

})
export class AuthComponent {
  email: string = '';
  password: string='';
  passwordConfirmation: string='';

  registrationError: string = '';

  constructor(private userService: UserService,private jwt:JwtService ,private router: Router) {
  }
  setItem(access: any[]): void {
    localStorage.setItem('access', JSON.stringify(access));
  }
  register(registerForm: any){
    this.registrationError = '';
    if (registerForm.password === registerForm.passwordConfirmation
    ) {
      this.userService.register(registerForm.email, registerForm.password).subscribe(
        (responseRegister: any) => {
          if (responseRegister === 'user ajouter') {
            this.userService.login(registerForm.email, registerForm.password).subscribe((responseLogin:any)=>{
              this.setItem(responseLogin)
              //redirection
              this.router.navigate(['/chat']);

            })
          } else {
            this.registrationError = responseRegister;
          }
        },
        (error) => {
          this.registrationError = 'Une erreur est survenue lors de l\'enregistrement.';
          console.error('Erreur lors de l\'appel à UserService.register :', error);
        }
      );
    } else {
      this.registrationError = 'Les mots de passe ne correspondent pas.';
    }
  }

  login(loginForm: any){
    this.registrationError = '';
    this.userService.login(loginForm.email, loginForm.password).subscribe((responseLogin:any)=>{
        this.setItem(responseLogin)
        //redirection
        this.router.navigate(['/chat']);
      },(error)=>{
        this.registrationError = error.error.message;
      })

  }
  ngOnInit(): void {
    this.verifyUser()
  }
  async verifyUser() {
    let token = await this.jwt.checkAccess()
    if (token) {
      this.router.navigate(['/chat']);
    }
  }
}
