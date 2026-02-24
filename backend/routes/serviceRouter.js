import express from 'express';
import { getServices, getServiceById, createService, updateService, deleteService } from '../controllers/serviceController.js';
import multer from 'multer';

const upload = multer({ dest: '/tmp' });
const serviceRouter = express.Router();

serviceRouter.get('/', getServices);
serviceRouter.get('/:id', getServiceById);
serviceRouter.post('/', upload.single('image'), createService);
serviceRouter.put('/:id', upload.single('image'), updateService);
serviceRouter.delete('/:id', deleteService);

export default serviceRouter;