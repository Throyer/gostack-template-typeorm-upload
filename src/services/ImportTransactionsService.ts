import fs from "fs";
import Transaction from '../models/Transaction';
import CreateTransactionService, { TransactionForm } from './CreateTransactionService';
import AppError from "../errors/AppError";

class ImportTransactionsService {
  async execute(file: any): Promise<Transaction[]> {

    if (!file) {
      throw new AppError("Não foi possivel localizar o arquivo csv.")
    }

    const service = new CreateTransactionService();

    const [, ...lines] = fs.readFileSync(file.path, "utf8")
      .split(/\r?\n/);

    let transactions: Transaction[] = [];

    for (const line of lines) {
      const [title, type, value, category] = line.split(",");
      if (title && type && value && category) {
        const transaction = await service.execute({
          title: title.trimLeft().trim(),
          type: type.trimLeft().trim() as "income" | "outcome",
          value: Number(value),
          category: category.trimLeft().trim()
        });

        transactions = [...transactions, transaction];
      }
    }

    fs.promises.unlink(file.path)

    return transactions;
  }
}

export default ImportTransactionsService;
