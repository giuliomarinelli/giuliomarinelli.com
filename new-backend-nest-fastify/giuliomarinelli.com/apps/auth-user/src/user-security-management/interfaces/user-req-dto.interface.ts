import { User } from "../entities/user.entity"

type CombinablePassword = { password: string }

export type UserReqDTO = Omit<User, 'id' | 'hashedPassword' | 'active' | 'hashed'> & CombinablePassword