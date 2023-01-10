import { Request, Response } from "express";
import { container } from "tsyringe";
import { OperationType } from "../../entities/Statement";

import { CreateStatementUseCase } from "./CreateStatementUseCase";

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split("/");
    const type = splittedPath[splittedPath.length - 1] as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);

    const statementInfo = {
      user_id,
      type,
      amount,
      description,
    };

    if (type === OperationType.TRANSFER) {
      const { user_id: recipient_id } = request.params;
      Object.assign(statementInfo, {
        recipient_id,
        sender_id: user_id,
      });
    }

    const statement = await createStatement.execute(statementInfo);

    return response.status(201).json(statement);
  }
}
