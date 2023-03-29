import {connectionRetryCount, gptModel, gptUrl} from '@/defaults';
import {ChatGptError, ChatGptErrorReason} from '@/errors/chatgpt';
import {GetSignHoroscopeError} from '@/errors/get-sign-horoscope';
import {ChatGpt} from '@/lib/chat-gpt';
import {logger} from '@/loaders/logger';
import {HoroscopeSchema} from '@/schemas/horoscope';
import {getEnvironment} from '@/utils/get-environment';
import {ZodError} from 'zod';

type SignHoroscope = {
	colorHex: string;
	colorName: string;
	number: number;
	event: string;
};

async function fetchHoroscope(sign: string): Promise<string> {
	const chatGpt = new ChatGpt(
		getEnvironment('GPT_URL', gptUrl),
		getEnvironment('GPT_API_KEY') ?? '',
		getEnvironment('GPT_MODEL', gptModel),
	);

	const prompt = `Create a JSON object containing the fields "colorName" (in Brazilian Portuguese), "colorHex", "number", and "event" (in Brazilian Portuguese). Generate random values for each field, drawing inspiration from an astrologer's interpretations of the zodiac signs. Ensure that the "event" field relates to the ${sign} sign and contains 10 to 30 words. The "number" field should be an integer ranging from 1 to 16. Output only the resulting JSON object.`;

	try {
		return await chatGpt.getResponse(prompt);
	} catch (error) {
		if (error instanceof ChatGptError) {
			switch (error.reason) {
				case ChatGptErrorReason.Timeout: {
					logger.warning('ChatGPT timed out, retrying...');

					throw new GetSignHoroscopeError(error.message, true);
				}

				case ChatGptErrorReason['Connection refused']: {
					logger.warning('ChatGPT refused connection!');

					throw new GetSignHoroscopeError(
						'Internal connection error!',
						false,
					);
				}

				default: {
					logger.logError('Unknown error occurred!', error, 'error');

					throw new GetSignHoroscopeError(
						'An unknown error occurred!',
						false,
					);
				}
			}
		}

		logger.logError('Unknown error occurred!', error as Error, 'error');

		throw new GetSignHoroscopeError('An unknown error occurred!', false);
	}
}

function parseHoroscope(horoscope: string): SignHoroscope {
	try {
		const parsedHoroscope = HoroscopeSchema.parse(JSON.parse(horoscope));

		return parsedHoroscope;
	} catch (error) {
		logger.logError(
			'Invalid horoscope, retrying...',
			error as Error,
			'error',
		);

		if (error instanceof ZodError) {
			throw new GetSignHoroscopeError(error.message, true);
		}

		if (error instanceof SyntaxError) {
			throw new GetSignHoroscopeError('Internal error!', true);
		}

		throw new GetSignHoroscopeError('An unknown error occurred!', true);
	}
}

export async function getSignHoroscope(sign: string): Promise<SignHoroscope> {
	let counter = 0;
	// eslint-disable-next-line no-constant-condition
	while (true) {
		try {
			// eslint-disable-next-line no-await-in-loop
			const horoscope = await fetchHoroscope(sign);
			const parsedHoroscope = parseHoroscope(horoscope);

			return parsedHoroscope;
		} catch (error) {
			if (error instanceof GetSignHoroscopeError && error.shouldRetry) {
				if (
					counter
					=== Number.parseInt(
						getEnvironment(
							'GPT_RETRY_COUNT',
							String(connectionRetryCount),
						),
						10,
					)
				) {
					throw error;
				}

				counter += 1;

				continue;
			}

			throw error;
		}
	}
}
