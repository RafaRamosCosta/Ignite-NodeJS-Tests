import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    user_id,
    type,
    amount,
    description,
    recipient_id,
    sender_id,
  }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new CreateStatementError.UserNotFound();
    }

    if (type === "withdraw" || type === "transfer") {
      const { balance } = await this.statementsRepository.getUserBalance({
        user_id,
      });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds();
      }
    }

    const statementOperation = {
      deposit: await this.statementsRepository.create({
        user_id,
        description,
        amount,
        type,
      }),
      withdraw: await this.statementsRepository.create({
        user_id,
        description,
        amount: amount * -1,
        type,
      }),
      transfer: async () => {
        if (!recipient_id) throw new CreateStatementError.UserNotFound();

        const recipient = await this.usersRepository.findById(recipient_id);

        if (!recipient) throw new CreateStatementError.UserNotFound();

        await this.statementsRepository.create({
          user_id,
          description,
          amount: amount * -1,
          type,
        });

        await this.statementsRepository.create({
          user_id,
          sender_id,
          recipient_id,
          description,
          amount,
          type,
        });
      },
    }[type];
    
    return statementOperation;
  }
}
