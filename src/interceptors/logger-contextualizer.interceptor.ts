/** @format */

// ** info: nestjs imports
import { ExecutionContext } from "@nestjs/common"
import { NestInterceptor } from "@nestjs/common"
import { CallHandler } from "@nestjs/common"
import { Injectable } from "@nestjs/common"
import { Request } from "@nestjs/common"

// ** info: rxjs imports
import { Observable } from "rxjs"
import { tap } from "rxjs"

// ** info: artifacts imports
import { DatetimeProvider } from "@artifacts/datetime/datetime.provider"
import { LoggingProvider } from "@artifacts/logging/logging.provider"

// ** info: nest cls imports
import { ClsService } from "nestjs-cls"

/**
 * Interceptor encargado de almacenar los valores necesarios en toda la aplicación (contexto) en un continuation local storage (cls) para hacerlas disponibles usando el cls a través de toda la aplicación
 * @date 27/4/2023 - 8:33:16
 *
 * @export
 * @class LoggerContextualizerInterceptor
 * @typedef {LoggerContextualizerInterceptor}
 * @implements {NestInterceptor}
 */
@Injectable()
export class LoggerContextualizerInterceptor implements NestInterceptor {
	public constructor(
		private readonly datetimeProvider: DatetimeProvider,
		private readonly loggingProvider: LoggingProvider,
		private readonly cls: ClsService
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request: Request = context.switchToHttp().getRequest()

		// ** info: Storing needed values for logging in the continuation local storage (cls) here
		let traceabilityId: string | undefined = undefined
		let countryCode: string | undefined = undefined
		let consumerId: string | undefined = undefined
		let rawHeaders: string | undefined = undefined
		let channelId: string | undefined = undefined
		let userAgent: string | undefined = undefined
		let sessionId: string | undefined = undefined
		let sourceIp: string | undefined = undefined
		let clientId: string | undefined = undefined
		let jwt: string | undefined = undefined
		let iv: string | undefined = undefined

		rawHeaders = JSON.parse(JSON.stringify(request.headers))

		// ** info: checking http headers values
		if ("session-id" in request.headers) {
			sessionId = request.headers["session-id"] as string
		} else {
			this.loggingProvider.warn("Attribute session-id not found in request http headers")
		}

		if ("user-agent" in request.headers) {
			userAgent = request.headers["user-agent"] as string
		} else {
			this.loggingProvider.warn("Attribute user-agent not found in request http headers")
		}

		if ("consumer-id" in request.headers) {
			consumerId = request.headers["consumer-id"] as string
		} else {
			this.loggingProvider.warn("Attribute consumer-id not found in request http headers")
		}

		if ("iv" in request.headers) {
			iv = request.headers["iv"] as string
		} else {
			this.loggingProvider.warn("Attribute iv not found in request http headers")
		}

		if ("jwt" in request.headers) {
			jwt = request.headers["jwt"] as string
		} else {
			this.loggingProvider.warn("Attribute jwt not found in request http headers")
		}

		// ** info: checking body headers values
		if (request.body !== null) {
			const requestBody: object = request.body
			if ("header" in requestBody) {
				const requestBodyHeader: object = requestBody.header as object
				if ("channelId" in requestBodyHeader) {
					channelId = requestBodyHeader.channelId as string
				} else {
					this.loggingProvider.warn("ChannelId not found in request body headers")
				}
				if ("sourceIp" in requestBodyHeader) {
					sourceIp = requestBodyHeader.sourceIp as string
				} else {
					this.loggingProvider.warn("Attribute sourceIp not found in request body headers")
				}
				if ("traceabilityId" in requestBodyHeader) {
					traceabilityId = requestBodyHeader.traceabilityId as string
				} else {
					this.loggingProvider.warn("Attribute traceabilityId not found in request body headers")
				}
				if ("countryCode" in requestBodyHeader) {
					countryCode = requestBodyHeader.countryCode as string
				} else {
					this.loggingProvider.warn("Attribute countryCode not found in request body headers")
				}
				if ("clientId" in requestBodyHeader) {
					clientId = requestBodyHeader.clientId as string
				} else {
					this.loggingProvider.warn("Attribute clientId not found in request body headers")
				}
			} else {
				this.loggingProvider.warn("Attribute header not found in request body")
			}
		} else {
			this.loggingProvider.warn("Request body not found")
		}

		// ** info: cls aditional payload
		this.cls.set("requestStartTimeStamp", this.datetimeProvider.getColDate())

		// ** info: cls body payload
		this.cls.set("traceabilityId", traceabilityId)
		this.cls.set("countryCode", countryCode)
		this.cls.set("endpoint", request.url)
		this.cls.set("request", request.body)
		this.cls.set("channelId", channelId)
		this.cls.set("clientId", clientId)
		this.cls.set("sourceIp", sourceIp)

		// ** info: cls headers peyload
		this.cls.set("rawHeaders", rawHeaders)
		this.cls.set("consumerId", consumerId)
		this.cls.set("sessionId", sessionId)
		this.cls.set("userAgent", userAgent)
		this.cls.set("jwt", jwt)
		this.cls.set("iv", iv)

		// ** info: cls control parameters
		this.cls.set("responsePrints", false)
		this.cls.set("requestPrints", false)
		this.cls.set("isRequest", true)

		this.loggingProvider.info("Executing logger contextualizer interceptor")
		this.loggingProvider.info("Request details here")

		return next.handle().pipe(
			tap((response: object) => {
				this.cls.set("response", response)
				this.loggingProvider.info("Response details here")
				this.loggingProvider.info("Logger contextualizer interceptor execution ended successfully")
			})
		)
	}
}
