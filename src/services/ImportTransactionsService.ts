import fs from "fs";
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import AppError from "../errors/AppError";

import csvParse from 'csv-parse';

interface Playload {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  public async execute(path: string): Promise<Transaction[]> {

    const csv = this.configureCSV(path);

    const payloads = await this.csvToPayloads(csv);

    return this.saveManyTransactions(payloads);
  }

  private configureCSV(path: string): csvParse.Parser {
    const stream = fs.createReadStream(path);

    const parser = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    return stream.pipe(parser);
  }

  private async csvToPayloads(csv: csvParse.Parser): Promise<Playload[]> {
    let transactions: Playload[] = [];

    csv.on("data", line => {
      const [title, type, value, category] = line;
      transactions.push({
        title,
        type,
        value: Number(value),
        category
      });
    });

    await new Promise<void>(end => csv.on("end", end));

    return transactions;
  }

  private async saveManyTransactions(payloads: Playload[]): Promise<Transaction[]> {
    const service = new CreateTransactionService();

    let transactions: Transaction[] = [];

    for (const payload of payloads) {
      const transaction = await service.execute(payload);
      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
