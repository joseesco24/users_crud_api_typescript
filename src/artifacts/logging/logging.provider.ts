/** @format */

// ** info: nestjs imports
import { LoggerService } from "@nestjs/common"
import { Injectable } from "@nestjs/common"

// ** info: pino imports
import pino from "pino"

// ** info: artifacts imports
import { ExecutionConstantsProvider } from "@artifacts/execution-constants/execution-constants.provider"
import { DatetimeProvider } from "@artifacts/datetime/datetime.provider"
import { EnvProvider } from "@artifacts/env/env.provider"

// ** info: nest cls imports
import { ClsService } from "nestjs-cls"

/**
 * Clase encargada de proveer métodos para escribir logs del sistema
 * @date 25/4/2023 - 10:57:24
 *
 * @export
 * @class LoggingProvider
 * @typedef {LoggingProvider}
 * @implements {LoggerService}
 */
@Injectable()
export class LoggingProvider implements LoggerService {
	private readonly prettyColors: string = "debug:green, info:blue, warning:yellow, error:red"
	private readonly prettyLevels: string = "debug:0, info:1, warning:2, error:3"

	private readonly levels: { [key: string]: number } = {
		error: 3,
		warning: 2,
		info: 1,
		debug: 0,
	}

	/**
	 * Formateadores custom para el logger en modo structured
	 * @date 29/4/2023 - 13:25:57
	 *
	 * @private
	 * @readonly
	 * @type {object}
	 */
	private readonly structuredformatters: object = {
		level(label: string) {
			return { severity: label.toUpperCase() }
		},
		message(message: string) {
			const firstLetter: string = message.charAt(0)
			const firstLetterCap: string = firstLetter.toUpperCase()
			const remainingLetters: string = message.slice(1)
			message = firstLetterCap + remainingLetters.toLocaleLowerCase()
			return message
		},
	}

	/**
	 * Serializadores custom para el logger en modo pretty
	 * @date 29/4/2023 - 13:25:28
	 *
	 * @private
	 * @readonly
	 * @type {{ [key: string]: pino.SerializerFn }}
	 */
	private readonly prettySerializers: { [key: string]: pino.SerializerFn } = {
		err(error: Error) {
			if (error.stack !== undefined) {
				return {
					stack: `\n\x1b[31m${error.stack}`,
				}
			} else {
				return {
					stack: error.stack,
				}
			}
		},
		headers(headers: object) {
			return `\n\x1b[90m\nRequest Raw Headers:\n\n${JSON.stringify(headers, null, 2)}\n`
		},
		response(response: object) {
			return `\n\x1b[90m\nResponse Raw Body:\n\n${JSON.stringify(response, null, 2)}\n`
		},
		request(request: object) {
			return `\n\x1b[90m\nRequest Raw Body:\n\n${JSON.stringify(request, null, 2)}\n`
		},
		requestElapsedTime(requestElapsedTime: string) {
			return `\x1b[35m${requestElapsedTime}`
		},
		timeIncrease(timeIncrease: string) {
			return `\x1b[36m${timeIncrease}`
		},
		message(message: string) {
			const firstLetter: string = message.charAt(0)
			const firstLetterCap: string = firstLetter.toUpperCase()
			const remainingLetters: string = message.slice(1)
			message = firstLetterCap + remainingLetters.toLocaleLowerCase()
			return `\x1B[37m${message}`
		},
	}

	// ** info: pino pretty options
	private readonly pinoPrettyTransportBaseOptions: object = {
		messageFormat: "{message} {requestElapsedTime} {timeIncrease} {err.stack} {headers} {request} {response}",
		translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
		errorLikeObjectKeys: ["err", "error"],
		customColors: this.prettyColors,
		customLevels: this.prettyLevels,
		useOnlyCustomProps: true,
		singleLine: false,
		hideObject: true,
		colorize: true,
	}

	// ** info: pino pretty transport options
	private readonly pinoPrettyTransportSingleOptions: pino.TransportSingleOptions = {
		options: this.pinoPrettyTransportBaseOptions,
		target: "pino-pretty",
	}

	// ** info: pino pretty base options
	private readonly pinoPrettyOptions: pino.LoggerOptions = {
		transport: this.pinoPrettyTransportSingleOptions,
		level: this.envProvider.appLoggingLevel,
		serializers: this.prettySerializers,
		useOnlyCustomLevels: true,
		customLevels: this.levels,
		messageKey: "message",
	}

	// ** info: pino base options
	private readonly pinoStructuredOptions: pino.LoggerOptions = {
		level: this.envProvider.appLoggingLevel,
		formatters: this.structuredformatters,
		useOnlyCustomLevels: true,
		customLevels: this.levels,
		messageKey: "message",
		timestamp: false,
		base: undefined,
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private readonly rootLogger: any

	/**
	 * Crea una instancia de LoggingProvider construyendo el logger en funcion de si es estructurado o pretty
	 * @date 29/4/2023 - 12:37:25
	 *
	 * @constructor
	 * @public
	 * @param {ExecutionConstantsProvider} executionConstantsProvider
	 * @param {DatetimeProvider} datetimeProvider
	 * @param {EnvProvider} envProvider
	 * @param {ClsService} cls
	 */
	public constructor(
		private readonly executionConstantsProvider: ExecutionConstantsProvider,
		private readonly datetimeProvider: DatetimeProvider,
		private readonly envProvider: EnvProvider,
		private readonly cls: ClsService
	) {
		if (this.envProvider.appLoggingMode === "structured") {
			this.rootLogger = this.buildStructuredLogger()
		} else {
			this.rootLogger = this.buildPrettyLogger()
		}
	}

	/**
	 * Método encargado de construir el logger de la aplicacion en modo pretty
	 * @date 24/4/2023 - 18:31:16
	 *
	 * @private
	 * @returns {pino.Logger}
	 */
	private buildPrettyLogger(): pino.Logger {
		const prettyLogger: pino.Logger = pino(this.pinoPrettyOptions)
		return prettyLogger
	}

	/**
	 * Método encargado de construir el logger de la aplicacion en modo estructurado
	 * @date 24/4/2023 - 18:32:16
	 *
	 * @private
	 * @returns {pino.Logger}
	 */
	private buildStructuredLogger(): pino.Logger {
		const structuredLogger: pino.Logger = pino(this.pinoStructuredOptions)
		return structuredLogger
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public error(message: string, ...optionalParams: any[]): void {
		let error: Error | undefined = undefined
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		optionalParams.map((element: any) => {
			if (element instanceof Error) {
				error = element
			}
		})
		if (error !== undefined) {
			this.rootLogger.child(this.getLoggMetadata(message, optionalParams)).error(error, message)
		} else {
			this.rootLogger.child(this.getLoggMetadata(message, optionalParams)).error(message)
		}
	}

	/**
	 * Método encargado de imprimir los logs con severidad de tipo warning
	 * @date 24/4/2023 - 18:27:46
	 *
	 * @public
	 * @param {string} message
	 * @param {...any[]} optionalParams
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public warning(message: string, ...optionalParams: any[]): void {
		this.rootLogger.child(this.getLoggMetadata(message, optionalParams)).warning(message)
	}

	/**
	 * Alias del método encargado de imprimir los logs con severidad de tipo warning
	 * @date 24/4/2023 - 18:29:43
	 *
	 * @public
	 * @param {string} message
	 * @param {...any[]} optionalParams
	 */
	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/member-ordering
	public warn: (message: string, ...optionalParams: any[]) => void = this.warning.bind(this)

	/**
	 * Método encargado de imprimir los logs con severidad de tipo info
	 * @date 24/4/2023 - 18:30:04
	 *
	 * @public
	 * @param {string} message
	 * @param {...any[]} optionalParams
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public info(message: string, ...optionalParams: any[]): void {
		this.rootLogger.child(this.getLoggMetadata(message, optionalParams)).info(message)
	}

	/**
	 * Método encargado de imprimir los logs con severidad de tipo debug
	 * @date 24/4/2023 - 18:30:35
	 *
	 * @public
	 * @param {string} message
	 * @param {...any[]} optionalParams
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public debug(message: string, ...optionalParams: any[]): void {
		this.rootLogger.child(this.getLoggMetadata(message, optionalParams)).debug(message)
	}

	/**
	 * Alias del método encargado de imprimir los logs con severidad de tipo debug
	 * @date 24/4/2023 - 18:30:58
	 *
	 * @public
	 * @param {string} message
	 * @param {...any[]} optionalParams
	 */
	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/member-ordering
	public log: (message: string, ...optionalParams: any[]) => void = this.debug.bind(this)

	/**
	 * Método encargado de obtener y configurar los metadatos del logger usando el continuation local storage (cls)
	 * @date 24/4/2023 - 18:38:10
	 *
	 * @private
	 * @param {...any[]} optionalParams
	 * @returns {object}
	 */
	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/member-ordering
	private getLoggMetadata(message: string, ...optionalParams: any[]): object {
		// ** info: creating variables
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const loggMetadata: any = new Object()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const userIdentity: any = new Object()

		// ** info: fetching dat from the cls
		const lastOperationTimeStamp: Date | undefined = this.cls.get("lastOperationTimeStamp")
		const requestStartTimeStamp: Date | undefined = this.cls.get("requestStartTimeStamp")
		const traceabilityId: string | undefined = this.cls.get("traceabilityId")
		const countryCode: string | undefined = this.cls.get("countryCode")
		const rawHeaders: string | undefined = this.cls.get("rawHeaders")
		const channelId: string | undefined = this.cls.get("channelId")
		const userAgent: string | undefined = this.cls.get("userAgent")
		const sessionId: string | undefined = this.cls.get("sessionId")
		const response: object | undefined = this.cls.get("response")
		const sourceIp: string | undefined = this.cls.get("sourceIp")
		const endpoint: string | undefined = this.cls.get("endpoint")
		const clientId: string | undefined = this.cls.get("clientId")
		const request: object | undefined = this.cls.get("request")

		const responsePrints: undefined | boolean = this.cls.get("responsePrints")
		const requestPrints: undefined | boolean = this.cls.get("requestPrints")
		const isRequest: undefined | boolean = this.cls.get("isRequest")

		const currentTime: Date = this.datetimeProvider.getColDate()

		// ** info: setting base loggMetadata data
		const timeStamp: string = this.datetimeProvider.getColTimePrettyString()
		loggMetadata.timeStamp = timeStamp

		const serviceName: string = this.executionConstantsProvider.serviceName
		loggMetadata.serviceName = serviceName

		const serviceVersion: string = this.executionConstantsProvider.serviceVersion
		loggMetadata.serviceVersion = serviceVersion

		if (traceabilityId !== undefined) {
			loggMetadata.traceabilityId = traceabilityId
		}

		if (requestStartTimeStamp !== undefined) {
			loggMetadata.requestElapsedTime = this.datetimeProvider.datesDiffStringMs(currentTime, requestStartTimeStamp)
		}

		if (lastOperationTimeStamp !== undefined) {
			const timeIncrease: string = this.datetimeProvider.datesDiffStringMs(currentTime, lastOperationTimeStamp)
			const timeIncreaseFormatted: string = `+${timeIncrease}`
			loggMetadata.timeIncrease = timeIncreaseFormatted
		}

		if (endpoint !== undefined) {
			loggMetadata.endpoint = endpoint
		}

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
		if (request !== undefined && requestPrints !== undefined && requestPrints === false && message === "Request details here") {
			this.cls.set("requestPrints", true)
			loggMetadata.headers = rawHeaders
			loggMetadata.request = request
		}

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
		if (response !== undefined && responsePrints !== undefined && responsePrints === false && message === "Response details here") {
			this.cls.set("responsePrints", true)
			loggMetadata.response = response
		}

		// ** info: setting userIdentity data

		if (countryCode !== undefined) {
			userIdentity.countryCode = countryCode
		}

		if (clientId !== undefined) {
			userIdentity.clientId = clientId
		}

		if (sourceIp !== undefined) {
			userIdentity.sourceIp = sourceIp
		}

		if (channelId !== undefined) {
			userIdentity.userAgent = userAgent
		}

		if (sessionId !== undefined) {
			userIdentity.sessionId = sessionId
		}

		if (channelId !== undefined) {
			userIdentity.channelId = channelId
		}

		if (Object.keys(userIdentity).length !== 0) {
			loggMetadata.userIdentity = userIdentity
		}

		if (isRequest !== undefined) {
			this.cls.set("lastOperationTimeStamp", currentTime)
		}

		return loggMetadata
	}
}
