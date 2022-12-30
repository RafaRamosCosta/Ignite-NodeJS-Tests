import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";

describe("Create user", () => {
  let usersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "user",
      email: "user@example.com",
      password: "password test",
    });

    expect(user).toHaveProperty("id");
  });

  it("should be able to create a user with a email that already exists", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "user",
        email: "user@example.com",
        password: "password test",
      });

      await createUserUseCase.execute({
        name: "user2",
        email: "user@example.com",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
