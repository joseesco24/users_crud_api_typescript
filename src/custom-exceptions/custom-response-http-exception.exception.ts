/** @format */

// ** info: nestjs imports
import { HttpException } from "@nestjs/common"

/**
 * Excepción http que se debe utilizar para firmar los errores en los interceptores encargados de manejar los errores
 * ! warning: por ninguna razón se debe lanzar esta excepcion de forma manual, solo debe usarse en el interceptor de manejo de errores
 * @date 30/4/2023 - 3:56:42
 *
 * @export
 * @class CustomResponseHttpException
 * @typedef {CustomResponseHttpException}
 * @extends {HttpException}
 */
export class CustomResponseHttpException extends HttpException {
	public readonly responseBackend: { responseCodeBackend: number; technicalMessageBackend: string } | undefined
	public readonly responseBody: { technicalMessage: string; responseCode: number; userMessage: string }
	public readonly requestStartTimeStamp: string
	public readonly requestEndTimeStamp: string
	public readonly requestElapsedTime: string
	public readonly traceabilityId: string
	public readonly httpStatus: number

	public constructor(params: {
		responseBackend?: { responseCodeBackend: number; technicalMessageBackend: string }
		responseBody: {
			technicalMessage: string
			responseCode: number
			userMessage: string
		}
		requestStartTimeStamp: string
		requestEndTimeStamp: string
		requestElapsedTime: string
		traceabilityId: string
		httpStatus: number
	}) {
		if (params.responseBackend !== undefined) {
			super(
				{
					header: {
						// todo: definir las firmas
						traceabilityId: params.traceabilityId,
						timeStamp: params.requestStartTimeStamp,
						//requestStartTimeStamp: params.requestStartTimeStamp,
						//requestEndTimeStamp: params.requestEndTimeStamp,
						//requestElapsedTime: params.requestElapsedTime,
						response: {
							userMessage: params.responseBody.userMessage,
							technicalMessage: params.responseBody.technicalMessage,
							responseCode: params.responseBody.responseCode,
						},
						responseBackend: {
							technicalMessageBackend: params.responseBackend.technicalMessageBackend,
							responseCodeBackend: params.responseBackend.responseCodeBackend,
						},
					},
					data: [],
				},
				params.httpStatus
			)
		} else {
			super(
				{
					header: {
						// todo: definir las firmas
						traceabilityId: params.traceabilityId,
						timeStamp: params.requestStartTimeStamp,
						//requestStartTimeStamp: params.requestStartTimeStamp,
						//requestEndTimeStamp: params.requestEndTimeStamp,
						//requestElapsedTime: params.requestElapsedTime,
						response: {
							userMessage: params.responseBody.userMessage,
							technicalMessage: params.responseBody.technicalMessage,
							responseCode: params.responseBody.responseCode,
						},
					},
					data: [],
				},
				params.httpStatus
			)
		}
		this.requestStartTimeStamp = params.requestStartTimeStamp
		this.requestEndTimeStamp = params.requestEndTimeStamp
		this.requestElapsedTime = params.requestElapsedTime
		this.responseBackend = params.responseBackend
		this.traceabilityId = params.traceabilityId
		this.responseBody = params.responseBody
		this.httpStatus = params.httpStatus
	}
}
