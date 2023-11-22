import { ServiceFactory } from "./types";

interface UsersService {
  getUserByUsername: (username: string) => Promise<any>;
}

const usersServiceFactory: ServiceFactory<UsersService> = (sequelize) => ({
  getUserByUsername(username) {
    return sequelize.models.User.findOne({ where: { username } });
  }
});

export default usersServiceFactory;
export { UsersService };
