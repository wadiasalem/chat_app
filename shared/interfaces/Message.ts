import { User } from './User'

export interface Message {
  id : string
  text: string,
  user: User & { id: string },
  date: Date,
}