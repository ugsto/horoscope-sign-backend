import {
	type NextFunction,
	type Request,
	type Response,
	Router as createRouter,
} from 'express';
import {getSignHoroscopeEndpoint} from './api/v1/sign';
import {validateRequestMiddlewareGenerator} from '@/middlewares/validate-request';
import {GetSignHoroscopeSchema} from '@/schemas/get-sign-horoscope';
import {errorHandlerMiddleware} from '@/middlewares/error-handler';

type Endpoint = (
	request: Request,
	response: Response,
	next: NextFunction
) => void;

const router = createRouter();
router.get(
	'/v1/sign/:sign',
	validateRequestMiddlewareGenerator(GetSignHoroscopeSchema),
	getSignHoroscopeEndpoint as unknown as Endpoint,
	errorHandlerMiddleware,
);

export {router};
