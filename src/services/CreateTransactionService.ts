import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import { getRepository, getCustomRepository } from 'typeorm';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

export interface TransactionForm {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute(form: TransactionForm): Promise<Transaction> {

    const { type, value } = form;
    const { total } = await getCustomRepository(TransactionsRepository).getBalance();

    if (type === "outcome" && value > total) {
      throw new AppError("Não é possivel registrar transação. Saldo insuficiente.", 400);
    }

    const categoriesRepository = getRepository(Category);
    const category = await categoriesRepository.findOne({ where: { title: form.category } });

    if (!category) {

      const newCategory = await categoriesRepository.save({
        title: form.category
      })

      return this.save(form, newCategory);
    }

    return this.save(form, category);
  }

  private async save({ title, type, value }: TransactionForm, category: Category): Promise<Transaction> {
    const repository = getRepository(Transaction);
    const transaction = await repository.save({
      title,
      type,
      value,
      category
    })
    return transaction;
  }
}

export default CreateTransactionService;
