import { OperationType } from "../../entities/Statement";

export interface ICreateStatementDTO {
  user_id: string;
  description: string;
  amount: number;
  type: OperationType;
  recipient_id?: string;
  sender_id?: string;
}
