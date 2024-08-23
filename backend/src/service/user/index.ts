import UserModel, { User } from "../../model/user";

export function createUser(request: Partial<User>) {
  return UserModel.create(request);
}

export function findUserById(id: string) {
  return UserModel.findById(id);
}

export function findUserByEmail(email: string) {
  return UserModel.findOne({ email });
}
