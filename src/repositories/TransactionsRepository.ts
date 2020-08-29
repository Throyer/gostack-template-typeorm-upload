import { EntityRepository, Repository, Like } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {

    const sum = (a: number, { value: b }: Transaction) => a + b;

    const findValuesOfType = async (type: "income" | "outcome"): Promise<Transaction[]> => 
      await this.find({ where: { type: type.toString() }, select: ["value"] });
    
    const incomes = await findValuesOfType("income");
    const outcomes = await findValuesOfType("outcome");
    
    const income = incomes.reduce(sum, 0);
    const outcome = outcomes.reduce(sum, 0);

    return {
      income,
      outcome,
      total: (income - outcome)
    }
  }
}

export default TransactionsRepository;
