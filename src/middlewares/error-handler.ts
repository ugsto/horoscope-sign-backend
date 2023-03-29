import {logger} from '@/loaders/logger';
import {type NextFunction, type Request, type Response} from 'express';

export function errorHandlerMiddleware(
	error: Error,
	_request: Request,
	response: Response,
	_next: NextFunction,
): void {
	logger.logError('Error Middleware', error, 'debug');
	response.status(500).send({error: error.message});
}
