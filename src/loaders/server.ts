import cors from 'cors';
import {router} from '@/routes/router';
import express from 'express';

export function loadServer() {
	const app = express();

	app.use(cors());
	app.use(express.json());
	app.use('/api', router);

	return app;
}
