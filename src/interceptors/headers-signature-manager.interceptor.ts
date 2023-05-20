/** @format */

// ** info: nestjs imports
import { ExecutionContext } from "@nestjs/common"
import { NestInterceptor } from "@nestjs/common"
import { CallHandler } from "@nestjs/common"
import { Injectable } from "@nestjs/common"
import { HttpStatus } from "@nestjs/common"

// ** info: rxjs imports
import { Observable } from "rxjs"
import { map } from "rxjs"
import { tap } from "rxjs"

// ** info: artifacts imports
import { DatetimeProvider } from "@artifacts/datetime/datetime.provider"
import { LoggingProvider } from "@artifacts/logging/logging.provider"

// ** info: class validator imports
import { ValidationError } from "class-validator"
import { validateSync } from "class-validator"

// ** info: dtos imports
import { RequestHeadersSignaturesDto } from "@dtos/signatures/request-headers-signatures.dto"
import { ResponseSignaturesDto } from "@dtos/signatures/response-body-signatures.dto"
import { RequestSignaturesDto } from "@dtos/signatures/request-body-signatures.dto"

// ** info: custom exceptions imports
import { CustomHttpException } from "@custom-exceptions/custom-http-exception.exception"

// ** info: nest cls imports
import { ClsService } from "nestjs-cls"

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
export class HeadersSignatureManagerInterceptor implements NestInterceptor {
	public constructor(
		private readonly datetimeProvider: DatetimeProvider,
		private readonly loggingProvider: LoggingProvider,
		private readonly cls: ClsService
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request: Request = context.switchToHttp().getRequest()

		this.loggingProvider.info("Executing headers signature manager interceptor")

		// ** info: building headers as a RequestBaseSignaturesDto instance
		const requestHeadersSignatures: RequestHeadersSignaturesDto = new RequestHeadersSignaturesDto(request.headers as object)

		this.loggingProvider.info("Validating request http headers")
		const errors0: ValidationError[] = validateSync(requestHeadersSignatures as object, {
			forbidUnknownValues: true,
			stopAtFirstError: true,
			whitelist: false,
		})
		if (errors0.length !== 0) {
			// ** info: fetching cls parameters
			const traceabilityId: string = this.cls.get("traceabilityId")
			const specificError: ValidationError = errors0[errors0.length - 1]
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
			throw new CustomHttpException({
				responseBody: {
					userMessage: `Error desconocido, por favor póngase en contacto con el área de soporte pertinente para que se revise el error, su id de trazabilidad es ${traceabilityId}`,
					technicalMessage: message,
					responseCode: 7,
				},
				httpStatus: HttpStatus.BAD_REQUEST,
			})
		}
		this.loggingProvider.info("Request http headers validation ended successfully")

		// ** cleaning request original http headers
		for (const key of Object.keys(request.headers)) {
			delete request.headers[key]
		}

		// ** overwriting response http headers with response validation model copy
		for (const key of Object.keys(requestHeadersSignatures)) {
			request.headers[key] = requestHeadersSignatures[key]
		}

		// ** info: building request as a RequestSignaturesDto instance
		const requestSignatures: RequestSignaturesDto = new RequestSignaturesDto(request.body as object)

		this.loggingProvider.info("Validating request body")
		const errors1: ValidationError[] = validateSync(requestSignatures as object, {
			forbidUnknownValues: true,
			stopAtFirstError: true,
			whitelist: false,
		})
		if (errors1.length !== 0) {
			// ** info: fetching cls parameters
			const traceabilityId: string = this.cls.get("traceabilityId")
			const specificError: ValidationError = errors1[errors1.length - 1]
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
			throw new CustomHttpException({
				responseBody: {
					userMessage: `Error desconocido, por favor póngase en contacto con el área de soporte pertinente para que se revise el error, su id de trazabilidad es ${traceabilityId}`,
					technicalMessage: message,
					responseCode: 3,
				},
				httpStatus: HttpStatus.BAD_REQUEST,
			})
		}
		this.loggingProvider.info("Request body validation ended successfully")

		// ** info: simplifying request body
		if (request.body !== null) {
			// ** info: storing data info
			let data: object | undefined = undefined
			if ("data" in request.body) {
				data = request.body["data"] as object
			}
			// ** info: cleaning request original body
			for (const key of Object.keys(request.body)) {
				delete request.body[key]
			}
			// ** info: overwriting request body with data if is defined
			if (data !== undefined) {
				for (const key of Object.keys(data)) {
					request.body[key] = data[key]
				}
			}
		}

		return next.handle().pipe(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			map((reponseBody: any) => {
				this.loggingProvider.info("Appending signatures to response body")

				// ** info: fetching cls parameters
				const traceabilityId: string = this.cls.get("traceabilityId")

				// ** info: appending signatures to response body
				if (reponseBody === null) {
					throw new CustomHttpException({
						responseBody: {
							userMessage: `Error desconocido, por favor póngase en contacto con el área de soporte pertinente para que se revise el error, su id de trazabilidad es ${traceabilityId}`,
							technicalMessage: "Datos faltantes en la respuesta del enrutador, el cuerpo de la respuesta no fue definido",
							responseCode: 4,
						},
						httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
					})
				}

				// ** info: storing data info
				let data: object | undefined = undefined
				if ("data" in reponseBody) {
					data = reponseBody.data as object
				} else {
					throw new CustomHttpException({
						responseBody: {
							userMessage: `Error desconocido, por favor póngase en contacto con el área de soporte pertinente para que se revise el error, su id de trazabilidad es ${traceabilityId}`,
							technicalMessage: "Datos faltantes en la respuesta del enrutador, el atributo data no fue definido en el cuerpo de la respuesta",
							responseCode: 5,
						},
						httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
					})
				}

				// ** info: fetching cls needed response parameters
				const requestStartTimeStamp: Date = this.cls.get("requestStartTimeStamp")
				// ** info: fetching current time
				//const requestEndTimeStamp: Date = this.datetimeProvider.getColDate()
				// ** info: fetching current time
				//const requestElapsedTime: string = this.datetimeProvider.datesDiffStringMs(requestEndTimeStamp, requestStartTimeStamp)

				// ** info: creating response validation model copy
				const responseSignatures: ResponseSignaturesDto = new ResponseSignaturesDto({
					header: {
						// todo: definir las firmas
						timeStamp: this.datetimeProvider.getPrettyDateString(requestStartTimeStamp),
						//requestStartTimeStamp: this.datetimeProvider.getPrettyDateString(requestStartTimeStamp),
						//requestEndTimeStamp: this.datetimeProvider.getPrettyDateString(requestEndTimeStamp),
						//requestElapsedTime: `≈${requestElapsedTime}[+4ms]`,
						traceabilityId: traceabilityId,
						response: {
							technicalMessage: "Operación exitosa",
							userMessage: "Operación exitosa",
							responseCode: 0,
						},
					},
					data: data,
				})

				// ** info: validating response model copy
				const errors: ValidationError[] = validateSync(responseSignatures as object, {
					forbidUnknownValues: true,
					stopAtFirstError: true,
					whitelist: false,
				})

				// ** info: reading errors from response model copy validation if exist
				if (errors.length !== 0) {
					// ** info: fetching cls parameters
					const traceabilityId: string = this.cls.get("traceabilityId")
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
					throw new CustomHttpException({
						responseBody: {
							userMessage: `Error desconocido, por favor póngase en contacto con el área de soporte pertinente para que se revise el error, su id de trazabilidad es ${traceabilityId}`,
							technicalMessage: message,
							responseCode: 6,
						},
						httpStatus: HttpStatus.BAD_REQUEST,
					})
				}

				// ** info: cleaning request original body
				for (const key of Object.keys(reponseBody)) {
					delete reponseBody[key]
				}

				// ** overwriting response body with response validation model copy
				for (const key of Object.keys(responseSignatures)) {
					reponseBody[key] = responseSignatures[key]
				}

				this.loggingProvider.info("Signatures successfully appended to response body")

				return reponseBody
			}),
			tap(() => {
				this.loggingProvider.info("Headers signature manager interceptor execution ended successfully")
			})
		)
	}
}
