export interface NewUser {
  email: string,
  password: string,
  confirmPassword: string
}

export interface User {

  fisrtName: string,
  lastName: string,
  email: string,
}

export const user: User = {
  fisrtName: "wadia",
  lastName: "salem",
  email: "wadi.selem1045@gmail.com"
}

export const newUser: NewUser = {
  email: "",
  password: "",
  confirmPassword: ""
}