import { UserRepository } from "../repository/userRepository";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

//   async getAllUsers() {
//     return this.userRepository.getAllUsers();
//   }
}
