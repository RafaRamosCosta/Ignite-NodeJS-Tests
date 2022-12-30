import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe("Show user profile", () => {
  let usersRepository: InMemoryUsersRepository;
  let showUserProfileUseCase: ShowUserProfileUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should be able to return a existant user profile", async () => {
    const user = await usersRepository.create({
      name: "test",
      email: "test@example.com",
      password: "testpassword",
    });

    const userProfile = await showUserProfileUseCase.execute(user.id!);
    expect(userProfile).toHaveProperty("id");
  });
});
