import { Routes } from '@angular/router';
import {AuthComponent} from "./auth/auth.component";
import {ChatComponent} from "./chat/chat.component";
import {LogoutComponent} from "./logout/logout.component";

export const routes: Routes = [
  {
    path:'auth', component: AuthComponent,
  },
  {
    path:'', component: AuthComponent,
  },
  {
    path:'chat', component: ChatComponent,
  },
  {
    path:'logout', component: LogoutComponent,
  },

];
