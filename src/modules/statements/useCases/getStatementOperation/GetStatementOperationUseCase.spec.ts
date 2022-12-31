import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

describe("Get statement operation", () => {
  let usersRepository: InMemoryUsersRepository;
  let statementsRepository: InMemoryStatementsRepository;
  let getStatementOperation: GetStatementOperationUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperation = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able to retrieve the statement operation", async () => {
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

    const statementOperation = await getStatementOperation.execute({
      user_id: user.id!,
      statement_id: statement.id!,
    });

    expect(statementOperation).toEqual(statement);
    expect(statementOperation).toBeInstanceOf(Statement);
  });
});
