import { Injectable } from '@angular/core';
import axios from "axios";
import {ChatPrivate} from "./chat-private";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor() { }
  url: string = 'https://messagerie.api.miantsebastien.com'

  async findAllMessage(token:any,id:any):Promise<any>{
    try {
      const response = await axios.get(this.url+`/api/message/profile/${id}`,{
        headers: {'Authorization': `Bearer ${token}`}
      })
      return response.data
    } catch (error) {
      throw error;
    }
  }
  async newMessage(token:any,message:any,id:any):Promise<any>{
    try {
      const response = await axios.post<ChatPrivate>(this.url+`/api/message/create/${id}`,
        {
          "content": message
        },{
        headers: {'Authorization': `Bearer ${token}`}
      })
      return response.data
    } catch (error) {
      throw error;
    }
  }
  async updateMessage(token:any,message:any,id:any):Promise<any>{
    try {
      const response = await axios.patch<ChatPrivate>(this.url+`/api/message/update/${id}`,
        {
          "content": message
        },{
          headers: {'Authorization': `Bearer ${token}`}
        })
      return response.data
    } catch (error) {
      throw error;
    }
  }
  async deleteMessage(token:any,id:any):Promise<any>{
    try {
      const response = await axios.delete<ChatPrivate>(this.url+`/api/message/delete/${id}`, {
          headers: {'Authorization': `Bearer ${token}`}
        })
      return response.data
    } catch (error) {
      throw error;
    }
  }
}
