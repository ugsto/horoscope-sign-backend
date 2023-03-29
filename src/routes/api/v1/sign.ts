import {type NextFunction, type Request, type Response} from 'express';
import {type GetSignHoroscopeSchema} from '@/schemas/get-sign-horoscope';
import {type z} from 'zod';
import {getSignHoroscope} from '@/business-logic/get-sign-horoscope';

export async function getSignHoroscopeEndpoint(
	request: Request<
	z.infer<typeof GetSignHoroscopeSchema>['params'],
	undefined,
	z.infer<typeof GetSignHoroscopeSchema>['body'],
	z.infer<typeof GetSignHoroscopeSchema>['query']
	>,
	response: Response,
	next: NextFunction,
) {
	const {sign} = request.params;

	try {
		const horoscope = await getSignHoroscope(sign);
		response.status(200).send(horoscope);
	} catch (error) {
		next(error);
	}
}
