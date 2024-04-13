import { Component } from '@angular/core';
import {RelationsService} from "../relations.service";
import {JwtService} from "../jwt.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  constructor( private router: Router) {}

  ngOnInit(): void {
    const storedData:string|null = localStorage.getItem('access');
    if (storedData){
      localStorage.removeItem('access')
      localStorage.removeItem('user')
    }
    this.router.navigate(['/auth']);
  }
}
