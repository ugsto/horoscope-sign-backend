import {gptTimeout} from '@/defaults';
import {ChatGptError, ChatGptErrorReason} from '@/errors/chatgpt';
import {logger} from '@/loaders/logger';
import axios, {AxiosError} from 'axios';

type ChatGptResponse = {
	id: string;
	object: string;
	created: number;
	model: string;
	usage: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
	choices: Array<{
		message: {
			role: string;
			content: string;
		};
		finish_reason: string;
		index: number;
	}>;
};

/* eslint-disable @typescript-eslint/naming-convention */
export class ChatGpt {
	constructor(
		private readonly url: string,
		private readonly apiKey: string,
		private readonly model: string,
		private readonly timeout: number = gptTimeout,
	) {}

	async getResponse(message: string): Promise<string> {
		try {
			const response = await axios.post<ChatGptResponse>(
				this.url,
				{
					model: this.model,
					messages: [
						{
							role: 'user',
							content: message,
						},
					],
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						Authorization: `Bearer ${this.apiKey}`,
					},
					timeout: this.timeout,
				},
			);

			return response.data.choices[0]!.message.content;
		} catch (error) {
			if (error instanceof AxiosError) {
				switch (error.code) {
					case 'ECONNABORTED': {
						throw new ChatGptError(ChatGptErrorReason.Timeout);
					}

					case 'ECONNREFUSED': {
						throw new ChatGptError(
							ChatGptErrorReason['Connection refused'],
						);
					}

					default: {
						logger.logError(
							'Unknown error occurred in ChatGPT call!',
							error,
							'error',
						);

						throw new ChatGptError(
							ChatGptErrorReason['Unknown error'],
						);
					}
				}
			}

			throw error;
		}
	}
}
