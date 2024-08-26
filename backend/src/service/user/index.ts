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

export function emailExists(email: string) {
  return UserModel.exists({ email });
}
