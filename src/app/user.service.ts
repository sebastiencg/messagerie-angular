import {Injectable, NgModule} from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {User} from "./user";
import {UserProfile} from "./user-profile";
import {Token} from "./token";
import axios from "axios";
import {ChatPrivate} from "./chat-private";

@Injectable({
  providedIn: 'root'
})
@NgModule({
  imports: [HttpClientModule],
})
export class UserService {
  constructor(private http: HttpClient) {
  }

  url: string = 'https://messagerie.api.miantsebastien.com'
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  register(email:string ,password: string) {
    const user: User = { email, password }
    try {
      return this.http.post<User>(this.url+"/register", user, this.httpOptions)
    } catch (error) {
      throw error;
    }
  }
  login(email:string ,password: string) {
    const user: User = { email, password }
    try {
      return this.http.post<Token>(this.url+"/api/login_check", user, this.httpOptions)
    } catch (error) {

      throw error;
    }
  }
  myProfile(token: string){
    try {
      return this.http.get<UserProfile>(this.url+"/api/profile", this.httpOptions)
    } catch (error) {

      throw error;
    }
  }
  logout(){
    localStorage.removeItem("access")
    localStorage.removeItem("user")

  }
}
