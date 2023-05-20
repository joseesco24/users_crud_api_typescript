/** @format */

// ** info: nestjs imports
import { ExecutionContext } from "@nestjs/common"
import { NestInterceptor } from "@nestjs/common"
import { CallHandler } from "@nestjs/common"
import { Injectable } from "@nestjs/common"

// ** info: rxjs imports
import { Observable } from "rxjs"
import { tap } from "rxjs"

// ** info: artifacts imports
import { LoggingProvider } from "@artifacts/logging/logging.provider"

/**
 * Interceptor encargado de validar la autenticación de las peticiones
 * @date 27/4/2023 - 8:29:56
 *
 * @export
 * @class AuthenticationInterceptor
 * @typedef {AuthenticationInterceptor}
 * @implements {NestInterceptor}
 */
@Injectable()
export class AuthenticationInterceptor implements NestInterceptor {
	public constructor(private readonly loggingProvider: LoggingProvider) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		this.loggingProvider.info("Executing authentication interceptor")

		return next.handle().pipe(
			tap(() => {
				this.loggingProvider.info("Authentication interceptor execution ended successfully")
			})
		)
	}
}
