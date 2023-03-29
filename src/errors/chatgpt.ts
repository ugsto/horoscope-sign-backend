import {ApplicationError} from './application';

export enum ChatGptErrorReason {
	'Timeout' = 'Timeout',
	'Connection refused' = 'Connection refused',
	'Unknown error' = 'Unknown error',
}

export class ChatGptError extends ApplicationError {
	public readonly reason: ChatGptErrorReason;

	constructor(reason: ChatGptErrorReason) {
		super(
			`An error occurred while communicating with the ChatGPT service: ${reason}`,
		);
		this.name = this.constructor.name;
		this.reason = reason;
	}
}
