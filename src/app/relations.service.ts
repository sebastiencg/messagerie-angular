import {Injectable, NgModule} from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {AnotherUser} from "./another-user"
import axios from "axios";
import {RequestFriend} from "./request-friend";

@Injectable({
  providedIn: 'root'
})
@NgModule({
  imports: [HttpClientModule],
})

export class RelationsService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: '' // Token sera ajouté ici
    })
  };
  constructor(private http: HttpClient) {
  }
  url: string = 'https://messagerie.api.miantsebastien.com'
  async allProfile(token: any){
    try {
      const response = await axios.get(this.url+"/api/profile/allProfile",{
        headers: {'Authorization': `Bearer ${token}`}

      })
      return response.data
    } catch (error) {
      throw error;
    }
  }

  async sendRequestFriend(token:any,id: any){
    try {
      const response = await axios.get(this.url+`/api/relation/new/${id}`,{
        headers: {'Authorization': `Bearer ${token}`}
      })
      return response.data
    } catch (error) {
      throw error;
    }
  }

  async takeRequestFriend(token:any){
    try {
      const response = await axios.get<RequestFriend>(this.url+`/api/relation/requestReceived/`,{
        headers: {'Authorization': `Bearer ${token}`}
      })
      return response.data
    } catch (error) {
      throw error;
    }
  }

  async takeRequestFriendSend(token:any){
    try {
      const response = await axios.get<RequestFriend>(this.url+`/api/relation/requestSend/`,{
        headers: {'Authorization': `Bearer ${token}`}
      })
      return response.data
    } catch (error) {
      throw error;
    }
  }

  async acceptRequestFriend(token:any,requestId:any,){
    try {
      const response = await axios.get(this.url+`/api/relation/request/valid/${requestId}`,{
        headers: {'Authorization': `Bearer ${token}`}
      })
      return response.data
    } catch (error) {
      throw error;
    }
  }
  async deniedRequestFriend(token:any,requestId:any,){
    try {
      const response = await axios.get(this.url+`/api/relation/request/refuse/${requestId}`,{
        headers: {'Authorization': `Bearer ${token}`}
      })
      return response.data
    } catch (error) {
      throw error;
    }
  }
  async findRelation(token:any){
    try {
      const response = await axios.get(this.url+`/api/relation/`,{
        headers: {'Authorization': `Bearer ${token}`}
      })
      return response.data
    } catch (error) {
      throw error;
    }
  }
}

