export interface UserProfile {
  id: number,
  ofUser: {
    id:number,
    email: string
  },
  username: string,
  visibility: boolean
}
