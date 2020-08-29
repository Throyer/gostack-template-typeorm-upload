import AppError from '../errors/AppError';

import { getRepository } from "typeorm";
import Transaction from "../models/Transaction";

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {

    const repository = getRepository(Transaction);
    const transaction = await repository.findOne({ where: { id }, select: ["id"] });
    
    if (!transaction) {
      throw new AppError("Não foi possivel localizar a transação", 404);
    }
    
    await repository.delete(transaction);
  }
}

export default DeleteTransactionService;
