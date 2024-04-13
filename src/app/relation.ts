import {AnotherUser} from "./another-user";

export interface Relation {
  id: number;
  createdAt:string;
  profile1: AnotherUser;
  profile2: AnotherUser;

}

