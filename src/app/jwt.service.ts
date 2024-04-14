import {Injectable, NgModule} from '@angular/core';
import { Router } from '@angular/router';
import {UserProfile} from "./user-profile";
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import axios from "axios";
import {Token} from "./token";

@Injectable({
  providedIn: 'root'
})
@NgModule({
  imports: [HttpClientModule],
})
export class JwtService {
  constructor(private router:Router,private http: HttpClient) {
  }
  private url: string = 'https://messagerie.api.miantsebastien.com'


  async checkAccess() {
    const accessString = localStorage.getItem('access');

    if (accessString) {
      const access = JSON.parse(accessString);
      const token = access.token;
      const refreshToken = access.refresh_token;
      try {
        const response = await axios.get<UserProfile>(this.url + "/api/profile", {
          headers: {'Authorization': `Bearer ${token}`}
        });
        if (response.data.id){
          localStorage.setItem("user",JSON.stringify(response.data))
          return token
        }
      } catch (error) {
        try {
          const responseRefreshToken = await axios.post<Token>(this.url + "/api/token/refresh", {
            "refresh_token": refreshToken
          });
          if (responseRefreshToken.data.token){
            localStorage.setItem('access', JSON.stringify(responseRefreshToken.data));
            return responseRefreshToken.data.token
          }
        }catch (error){
          return null
        }
        return null;
      }
    } else {
      await this.router.navigate(['/auth']);
      return null;
    }

  }
  async updateProfile(token:any,username:any,visibility:boolean){
    try {
      const response = await axios.patch(this.url+`/api/profile/update/`,{
        "username": username,
        "visibility":visibility
      }, {
        headers: {'Authorization': `Bearer ${token}`}
      })
      return response.data
    } catch (error) {
      throw error;
    }
  }

}
