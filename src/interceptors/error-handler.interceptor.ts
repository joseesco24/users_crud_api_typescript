/** @format */

// ** info: nestjs imports
import { BadRequestException } from "@nestjs/common"
import { ExecutionContext } from "@nestjs/common"
import { NestInterceptor } from "@nestjs/common"
import { CallHandler } from "@nestjs/common"
import { Injectable } from "@nestjs/common"
import { HttpStatus } from "@nestjs/common"

// ** info: rxjs imports
import { Observable } from "rxjs"
import { catchError } from "rxjs"
import { tap } from "rxjs"

// ** info: artifacts imports
import { DatetimeProvider } from "@artifacts/datetime/datetime.provider"
import { LoggingProvider } from "@artifacts/logging/logging.provider"

// ** info: nest cls imports
import { ClsService } from "nestjs-cls"

// ** info: custom exceptions imports
import { CustomResponseHttpException } from "@custom-exceptions/custom-response-http-exception.exception"
import { CustomHttpException } from "@custom-exceptions/custom-http-exception.exception"

/**
 * Interceptor encargado de manejar los errores de las apis de la aplicación
 * @date 27/4/2023 - 8:30:52
 *
 * @export
 * @class ErrorHandlerInterceptor
 * @typedef {ErrorHandlerInterceptor}
 * @implements {NestInterceptor}
 */
@Injectable()
export class ErrorHandlerInterceptor implements NestInterceptor {
	public constructor(
		private readonly datetimeProvider: DatetimeProvider,
		private readonly loggingProvider: LoggingProvider,
		private readonly cls: ClsService
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		this.loggingProvider.info("Executing error handler interceptor")

		return next.handle().pipe(
			tap(() => {
				this.loggingProvider.info("Error handler interceptor execution ended successfully")
			}),
			catchError((error: Error) => {
				this.loggingProvider.warning("Error handler interceptor execution ended unsuccessfully")
				this.loggingProvider.error(`Handled error type: ${error.name}`)

				// ** info: fetching cls parameters
				const requestStartTimeStamp: Date = this.cls.get("requestStartTimeStamp")
				const traceabilityId: string = this.cls.get("traceabilityId")

				// ** info: fetching current time
				const requestEndTimeStamp: Date = this.datetimeProvider.getColDate()

				// ** info: fetching current time
				const requestElapsedTime: string = this.datetimeProvider.datesDiffStringMs(requestEndTimeStamp, requestStartTimeStamp)

				if (error.name === "CustomHttpException") {
					const specificError: CustomHttpException = error as CustomHttpException
					this.loggingProvider.error(`Registered error: ${specificError.responseBody.technicalMessage}`, error)
					if (specificError.responseBackend === undefined) {
						throw new CustomResponseHttpException({
							requestStartTimeStamp: this.datetimeProvider.getPrettyDateString(requestStartTimeStamp),
							requestEndTimeStamp: this.datetimeProvider.getPrettyDateString(requestEndTimeStamp),
							responseBody: specificError.responseBody,
							requestElapsedTime: `≈${requestElapsedTime}[+1ms]`,
							httpStatus: specificError.httpStatus,
							traceabilityId: traceabilityId,
						})
					} else {
						throw new CustomResponseHttpException({
							requestStartTimeStamp: this.datetimeProvider.getPrettyDateString(requestStartTimeStamp),
							requestEndTimeStamp: this.datetimeProvider.getPrettyDateString(requestEndTimeStamp),
							responseBackend: specificError.responseBackend,
							responseBody: specificError.responseBody,
							requestElapsedTime: `≈${requestElapsedTime}[+1ms]`,
							httpStatus: specificError.httpStatus,
							traceabilityId: traceabilityId,
						})
					}
				}

				if (error.name === "BadRequestException") {
					const specificError: BadRequestException = error as BadRequestException
					const badRequestResponse: object | string = specificError.getResponse()
					let message: string
					if (badRequestResponse instanceof Object) {
						const tempMessage: string = badRequestResponse["message"][0] as string
						const fixedMessageArray: string[] = tempMessage.split(".")
						message = fixedMessageArray[fixedMessageArray.length - 1]
					} else {
						message = badRequestResponse
					}
					this.loggingProvider.error(`Registered error: ${specificError.message}`, error)
					throw new CustomResponseHttpException({
						responseBody: { technicalMessage: `Datos de la peticion inválidos: ${message}`, userMessage: message, responseCode: 2 },
						requestStartTimeStamp: this.datetimeProvider.getPrettyDateString(requestStartTimeStamp),
						requestEndTimeStamp: this.datetimeProvider.getPrettyDateString(requestEndTimeStamp),
						requestElapsedTime: `≈${requestElapsedTime}[+1ms]`,
						httpStatus: specificError.getStatus(),
						traceabilityId: traceabilityId,
					})
				}

				this.loggingProvider.error(`Not registered error: ${error.name}`, error)
				throw new CustomResponseHttpException({
					responseBody: {
						userMessage: `Error desconocido, por favor póngase en contacto con el área de soporte pertinente para que se revise el error, su id de trazabilidad es ${traceabilityId}`,
						technicalMessage: `Error desconocido de tipo ${error.name}`,
						responseCode: 1,
					},
					httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
					requestStartTimeStamp: this.datetimeProvider.getPrettyDateString(requestStartTimeStamp),
					requestEndTimeStamp: this.datetimeProvider.getPrettyDateString(requestEndTimeStamp),
					requestElapsedTime: `≈${requestElapsedTime}[+1ms]`,
					traceabilityId: traceabilityId,
				})
			})
		)
	}
}
