import {ApplicationError} from './application';

export class GetSignHoroscopeError extends ApplicationError {
	constructor(message: string, public readonly shouldRetry: boolean) {
		super(message);
		this.name = this.constructor.name;
	}
}
