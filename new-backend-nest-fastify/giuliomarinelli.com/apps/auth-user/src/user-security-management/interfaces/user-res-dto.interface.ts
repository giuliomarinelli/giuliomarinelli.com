import { User } from "../entities/user.entity";

export type UserRes = Omit<User, 'hashedPassword' | 'active' | 'hashedActivationCode'>