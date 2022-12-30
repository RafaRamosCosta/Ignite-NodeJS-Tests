import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { hash } from "bcryptjs";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

describe("Authenticate User", () => {
  let usersRepository: InMemoryUsersRepository;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it("should be able to return a authenticated user", async () => {
    await usersRepository.create({
      name: "name test",
      email: "email test",
      password: await hash("1234", 8),
    });

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: "email test",
      password: "1234",
    });
    expect(authenticatedUser.user).toHaveProperty("id");
  });

  it("should not be able to authenticate a user with a invalid email", async () => {
    await usersRepository.create({
      name: "name test",
      email: "email test",
      password: await hash("1234", 8),
    });
    expect(
      async () =>
        await authenticateUserUseCase.execute({
          email: "invalid email",
          password: "1234",
        })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate a user with a invalid password", async () => {
    await usersRepository.create({
      name: "name test",
      email: "email test",
      password: await hash("1234", 8),
    });
    expect(
      async () =>
        await authenticateUserUseCase.execute({
          email: "email test",
          password: "invalid password",
        })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
