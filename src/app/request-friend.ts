import {AnotherUser} from "./another-user";

export interface RequestFriend {
  id: number;
  host: AnotherUser;
  guests: AnotherUser;
  statue: string;
  relation: any;
}
