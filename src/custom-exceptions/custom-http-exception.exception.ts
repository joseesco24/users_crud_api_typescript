/** @format */

// ** info: nestjs imports
import { HttpException } from "@nestjs/common"

/**
 * Excepción http que se debe utilizar al interior del programa para lanzar los errores
 * ! warning: por ninguna razón se debe utilizar otro tipo de error aparte de este, los demás errores serán interceptados y asumidos como errores desconocidos
 * @date 29/4/2023 - 16:04:29
 *
 * @export
 * @class CustomHttpException
 * @typedef {CustomHttpException}
 * @extends {HttpException}
 */
export class CustomHttpException extends HttpException {
	public readonly responseBackend: { responseCodeBackend: number; technicalMessageBackend: string } | undefined
	public readonly responseBody: { technicalMessage: string; responseCode: number; userMessage: string }
	public readonly httpStatus: number

	public constructor(params: {
		responseBackend?: { responseCodeBackend: number; technicalMessageBackend: string }
		responseBody: {
			technicalMessage: string
			responseCode: number
			userMessage: string
		}
		httpStatus: number
	}) {
		if (params.responseBackend !== undefined) {
			super(
				{
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
				params.httpStatus
			)
		} else {
			super(
				{
					response: {
						userMessage: params.responseBody.userMessage,
						technicalMessage: params.responseBody.technicalMessage,
						responseCode: params.responseBody.responseCode,
					},
				},
				params.httpStatus
			)
		}
		this.responseBackend = params.responseBackend
		this.responseBody = params.responseBody
		this.httpStatus = params.httpStatus
	}
}
