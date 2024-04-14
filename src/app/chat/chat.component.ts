import {Component,ViewChild} from '@angular/core';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";
import {RelationsService} from "../relations.service";
import {ChatService} from "../chat.service";
import {AnotherUser} from "../another-user";
import {JwtService} from "../jwt.service";
import {Router} from "@angular/router";
import {UserProfile} from "../user-profile";
import {Token} from "../token";
import {RequestFriend} from "../request-friend";
import {Relation} from "../relation";
import { CommonModule } from '@angular/common';
import {FormsModule, NgForm} from "@angular/forms";
import {ChatPrivate} from "../chat-private";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    NgbPaginationModule,
    NgbAlertModule,
    RelationsService,
    JwtService,
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  constructor(private relationsService: RelationsService,private chatService:ChatService,private jwt:JwtService, private router: Router) {}
  @ViewChild('messageForm') messageForm!: NgForm; // Récupère l'instance NgForm du formulaire

  private token: any | null = null;
  public allProfile: AnotherUser[] = [];
  protected userProfile:any| null=null
  private allRequestFriends:any| null=null
  private allRequestFriendsSend:any| null=null
  protected userMessage:any = null
  protected readonly alert = alert;
  protected allFriend: any[] = [];
  protected message:string="";
  protected allMessage:ChatPrivate[] = [];


  private scrollToBottom(): void {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  ngOnInit(): void {
    this.verifyUser()
    }
  async verifyUser(){
    this.token = await this.jwt.checkAccess()
    let stringUser = localStorage.getItem("user");
    if (stringUser !== null) {
      this.userProfile = JSON.parse(stringUser);
    }
    if (!this.token){
       await this.router.navigate(['/auth']);
    }
    await this.findRelation(this.token,this.userProfile);

  }
  async showProfileListModal(): Promise<void> {
    this.allProfile = await this.relationsService.allProfile(this.token)
//___________________________

    const listItemsHTML= this.allProfile.map((element:AnotherUser) =>{
      function compareProfiles(profile1: any, profile2: any) {
        return profile1.id === profile2.id && profile1.username === profile2.username;
      }
     const foundProfile = this.allFriend.find((profile: any) => compareProfiles(profile, element));

      if (this.userProfile && this.userProfile.id === element.id) {
        return ``;
      }
      else {
        if (foundProfile) {
          return ``;
        }
        else {

          return `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${element.username}
        <button class="btn btn-primary add-friend-button" data-profile-id="${element.id}">Ajouter</button>
      </li>
    `;
        }
      }
    } ).join('');
//__________________________________

    Swal.fire({
      title: 'Liste des utilisateurs',
      html: `
    <div class="container-liste-user">
      <ul class="list-group">
        ${listItemsHTML}
      </ul>
    </div>
  `,
    });
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target && target.classList.contains('add-friend-button')) {

        const profileId = target.getAttribute('data-profile-id');

        if (profileId) {
          this.addFriend(parseInt(profileId, 10));

        }

      }
    });
  }
  async addFriend(profileId: number) {
    let response = await this.relationsService.sendRequestFriend(this.token, profileId)
    if(response){
      await Swal.fire({
        title: "Good job!",
        text: response,
        icon: "success"
      });

      location.reload();
    }

  }
  async showListRequestFriend() {
    this.allRequestFriends = await this.relationsService.takeRequestFriend(this.token)

    const listItemsHTML = this.allRequestFriends.map((request: RequestFriend) => {
      console.log(request.statue +request.id)
      if (request.statue=="on hold"){
        return `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${request.host.username}
        <button class="btn btn-success accept-friend-button"  data-request-id="${request.id}" data-profile-id="${request.host.id}">Ajouter</button>
        <button class="btn btn-danger remove-friend-button"   data-request-id="${request.id}" data-profile-id="${request.host.id}">Refuser</button>
      </li>
    `;
      }
      else {
        return ``
      }
    }).join('');

     Swal.fire({
      title: 'Liste des demandes',
      html: `
    <div class="container-liste-user">
      <ul class="list-group">
        ${listItemsHTML}
      </ul>
    </div>
  `,
    });
    console.log("request")

    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      if (target && target.classList.contains('accept-friend-button')) {
        const profileId = target.getAttribute('data-profile-id');
        const idRequest = target.getAttribute('data-request-id');
        if (profileId && idRequest) {
          this.acceptRequest(parseInt(profileId, 10),parseInt(idRequest,10));
        }
      }
      if (target && target.classList.contains('remove-friend-button')) {
        const profileId = target.getAttribute('data-profile-id');
        const idRequest = target.getAttribute('data-request-id');

        if (profileId &&  idRequest) {
          this.removeRequest(parseInt(profileId, 10),parseInt(idRequest,10));

        }
      }
    });
  }
  async showListFriendSend() {
    this.allRequestFriendsSend = await this.relationsService.takeRequestFriendSend(this.token)

    const listItemsHTML = this.allRequestFriendsSend.map((request: RequestFriend) => {
      if (request.statue=="on hold"){
        return `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${request.guests.username}
      </li>
    `;
      }
      return ``
    }).join('');
    await Swal.fire({
      title: 'Liste des demandes envoyé',
      html: `
    <div class="container-liste-user">
      <ul class="list-group">
        ${listItemsHTML}
      </ul>
    </div>
  `,
    });
  }
  async removeRequest(profileId: number,requestId:number) {
   const response =  await this.relationsService.deniedRequestFriend(this.token, profileId)
    if(response){
      await Swal.fire({
        title: "refusé",
        text: response,
        icon: "error"
      });
    }
    location.reload();

  }
  async acceptRequest(profileId: number, requestId:number) {
    const response =  await this.relationsService.acceptRequestFriend(this.token, profileId)
    if(response){
      await Swal.fire({
          title: "accepté",
        text: response,
        icon: "success"
      });
    }
    location.reload();

  }
  async findRelation(token:any, profile:any) {
    const response =  await this.relationsService.findRelation(token)

    response.forEach((element:Relation) =>{
      if (element.profile1.username==profile.username ){
        this.allFriend.push(element.profile2)
      }
      else {
        this.allFriend.push(element.profile1)
      }
    } );
    return this.allFriend
  }
  async findMessage(profile:any) {
    this.userMessage = profile
   const response = await  this.chatService.findAllMessage(this.token, profile.id)
    if (response !== "error"){
      this.allMessage=response.reverse()
      setTimeout(() => {
        this.scrollToBottom();
      });
    }else {
      this.allMessage=[]
    }
 }
  async newMessage(messageForm:NgForm) {
    if (this.userMessage && messageForm.value.message){
      const response = await  this.chatService.newMessage(this.token, messageForm.value.message ,this.userMessage.id)
      if (response){
        messageForm.resetForm(); // Réinitialise le formulaire
        await this.findMessage(this.userMessage)
      }
    }
  }
  async optionMessage(message:any){
    Swal.fire({
      title: "que veux tu faire !",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "modifier",
      denyButtonText: `supprimer`
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { value: text } = await Swal.fire({
          input: "textarea",
          inputLabel: "Message",
          inputValue:message.content,
          inputPlaceholder: message.content,
          inputAttributes: {
            "aria-label": "Type your message here"
          },
          showCancelButton: true
        });
        if (text) {
          const response = await  this.chatService.updateMessage(this.token, text,message.id)
          if (response){
            await this.findMessage(this.userMessage)
          }
        }
      } else if (result.isDenied) {
        Swal.fire({
          title: "Es-tu sûr?",
          text: "Vous ne pourrez pas revenir en arrière !",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Oui, supprime-le !"
        }).then( async (result) => {
          if (result.isConfirmed) {
            const response = await  this.chatService.deleteMessage(this.token,message.id)
            if (response){
              await this.findMessage(this.userMessage)
            }
          }
        });
      }
    });
  }
  async optionProfile(){
    const { value: formValues } = await Swal.fire({
      title: "changer les informations perso",
      html: `
        <input type="text" id="swal-input1" class="swal2-input" value="${this.userProfile.username}">
        <br>
        <br>
        <input type="checkbox"   id="swal-input2" class="form-check-input " checked="${this.userProfile.visibility}">
        <label class="form-check-label" for="flexCheckDefault" >
          visible
        </label>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const input1Element = document.getElementById("swal-input1") as HTMLInputElement | null;
        const input2Element = document.getElementById("swal-input2") as HTMLInputElement | null;

        if (input1Element && input2Element) {
          return [input1Element.value, input2Element.checked];
        } else {
          return [null, null];
        }
      }
    });

    if (formValues && formValues[0] !== null && formValues[1] !== null) {
      const [username, visible] = formValues;
      const response= await this.jwt.updateProfile(this.token,username,visible)
      if (response){
        location.reload();
      }

    } else {
      console.error("Les valeurs des champs ne sont pas définies ou invalides");
    }
  }
}
