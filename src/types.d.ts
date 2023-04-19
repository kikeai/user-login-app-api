export interface Users {
  email: string
  name: string
  username: string
  password: string
  google_id: string
  image: string
}

export interface Login {
  email: string
  password: string
  google_id: string
}

export interface UpdatePassword {
  email: string
  newPassword: string
}
