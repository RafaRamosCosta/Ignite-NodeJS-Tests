import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

describe("Get balance", () => {
  let usersRepository: InMemoryUsersRepository;
  let statementsRepository: InMemoryStatementsRepository;
  let getBalanceUseCase: GetBalanceUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
  });

  it("should be able to retrieve the user balance", async () => {
    const user = await usersRepository.create({
      name: "user",
      email: "user@example.com",
      password: "password",
    });

    const statement = await statementsRepository.create({
      user_id: user.id!,
      amount: 200,
      description: "200 dollars deposit",
      type: OperationType.DEPOSIT,
    });

    const userBalance = await getBalanceUseCase.execute({
      user_id: statement.user_id,
    });

    expect(userBalance.balance).toEqual(200);
  });

  it("shouldn't be able to get a balance of a nonexistent user", () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "invalid id",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
