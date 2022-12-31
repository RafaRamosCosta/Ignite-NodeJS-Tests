import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

describe("Create statement", () => {
  let usersRepository: InMemoryUsersRepository;
  let statementsRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able to create a new deposit statement", async () => {
    const user = await usersRepository.create({
      name: "user",
      password: "password",
      email: "email@test.com",
    });

    const statementOperation = await createStatementUseCase.execute({
      user_id: user.id!,
      amount: 200,
      description: "200 dollars deposit",
      type: OperationType.DEPOSIT,
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation).toBeInstanceOf(Statement);
    expect(statementOperation.type).toEqual("deposit");
  });

  it("shouldn't be able to create a withdraw statement lower or equal to the user balance", async () => {
    const user = await usersRepository.create({
      name: "user",
      password: "password",
      email: "email@test.com",
    });

    const statementOperation = await createStatementUseCase.execute({
      user_id: user.id!,
      amount: 0,
      description: "0 dollars withdraw",
      type: OperationType.WITHDRAW,
    });
    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation).toBeInstanceOf(Statement);
    expect(statementOperation.type).toEqual("withdraw");
  });

  it("shouldn't be able to create a withdraw statement higher than the user balance", async () => {
    const user = await usersRepository.create({
      name: "user",
      password: "password",
      email: "email@test.com",
    });

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id!,
        amount: 200,
        description: "200 dollars withdraw",
        type: OperationType.WITHDRAW,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
