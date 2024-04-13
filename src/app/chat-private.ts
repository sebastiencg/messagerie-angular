import {AnotherUser} from "./another-user";

export interface ChatPrivate {
  id: number;
  author: AnotherUser;
  recipient: AnotherUser;
  content: string;
}
