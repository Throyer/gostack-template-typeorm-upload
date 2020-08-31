import fs from "fs";
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import AppError from "../errors/AppError";

import csvParse from 'csv-parse';

class ImportTransactionsService {
  async execute(path: string): Promise<Transaction[]> {

    const service = new CreateTransactionService();

    const stream = fs.createReadStream(path);

    const parser = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const csv = stream.pipe(parser);

    let forms: {
      title: string;
      type: 'income' | 'outcome';
      value: number;
      category: string;
    }[] = [];

    csv.on("data", line => {
      const [title, type, value, category] = line;
      if (title && type && value && category) {
        const transaction = {
          title,
          type,
          value: Number(value),
          category
        };

        forms = [...forms, transaction];
      }
    });

    await new Promise(resolve => csv.on("end", resolve));

    return await new Promise(async (resolve) => {
      let transactions: Transaction[] = [];
      for (const form of forms) {
        transactions = [...transactions, await service.execute(form)]
      }
      resolve(transactions);
    })
  }
}

export default ImportTransactionsService;
