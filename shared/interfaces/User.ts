export interface NewUser {
  email: string,
  password: string,
  confirmPassword: string
}

export interface User {

  firstName: string,
  lastName: string,
  image : string,
}

export const defaultUser: User = {
  firstName: "",
  lastName: "",
  image : "",
}

export const newUser: NewUser = {
  email: "",
  password: "",
  confirmPassword: ""
}