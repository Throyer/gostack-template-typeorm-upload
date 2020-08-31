import multer from "multer";
import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import { getCustomRepository } from 'typeorm';

import { STORAGE } from '../config/uploading';

const transactionsRouter = Router();

const upload = multer(STORAGE);

transactionsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(TransactionsRepository);
  return response.json({
    transactions: await repository.find({ relations: ["category"] }),
    balance: await repository.getBalance()
  })
});

transactionsRouter.post('/', async (request, response) => {

  const { title, value, type, category } = request.body;
  const service = new CreateTransactionService();

  const transaction = await service.execute({
    title, value, type, category 
  });

  return response.json(transaction);

});

transactionsRouter.delete('/:id', async (request, response) => {

  const { id } = request.params;
  const service = new DeleteTransactionService();

  await service.execute(id);
  
  return response
    .status(204)
    .send();

});

transactionsRouter.post('/import', upload.single("file"), async (request, response) => {
  
  const file = request.file
  const service = new ImportTransactionsService();

  const transactions = await service.execute(file.path);  

  return response
    .status(201)
    .json(transactions);
});

export default transactionsRouter;
