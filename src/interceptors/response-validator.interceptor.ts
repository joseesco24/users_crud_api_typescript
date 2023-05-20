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

// ** info: class validator imports
import { ValidationError } from "class-validator"
import { validateSync } from "class-validator"

/**
 * Interceptor encargado de administrar las firmas aplicables a todas las apis de la aplicación y de simplificar las peticiones al interior de la aplicación
 * @date 27/4/2023 - 8:31:46
 *
 * @export
 * @class HeadersSignatureManagerInterceptor
 * @typedef {HeadersSignatureManagerInterceptor}
 * @implements {NestInterceptor}
 */
@Injectable()
export class ResponseValidatorInterceptor implements NestInterceptor {
	public constructor(private readonly loggingProvider: LoggingProvider) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		this.loggingProvider.info("Executing response validator interceptor")

		return next.handle().pipe(
			tap((response: object) => {
				this.loggingProvider.info("Validating router response")
				const errors: ValidationError[] = validateSync(response, {
					forbidUnknownValues: true,
					stopAtFirstError: true,
					whitelist: false,
				})
				if (errors.length !== 0) {
					const specificError: ValidationError = errors[errors.length - 1]
					const propertys: string[] = []
					let message: string = ""
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					let currentError: ValidationError = specificError
					// eslint-disable-next-line no-constant-condition
					while (true) {
						// eslint-disable-next-line @typescript-eslint/prefer-optional-chain
						if (currentError?.children !== undefined) {
							propertys.push(currentError.property)
							if (currentError.children[0] !== undefined) {
								currentError = currentError.children[0]
							} else {
								break
							}
						} else {
							break
						}
					}
					if (currentError.constraints !== undefined) {
						const messages: string[] = Object.values(currentError.constraints)
						message = messages[0]
					}
					throw new Error(`error while validating router response failing property: ${propertys.join(".")} reason: ${message}`)
				}
				this.loggingProvider.info("Router response validation ended successfully")
				this.loggingProvider.info("Response validator interceptor ended successfully")
			})
		)
	}
}
