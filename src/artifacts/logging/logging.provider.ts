/** @format */

// ** info: nestjs imports
import { LoggerService } from "@nestjs/common"
import { Injectable } from "@nestjs/common"
import { Logger } from "@nestjs/common"

// ** info: pino imports
import pino from "pino"

// ** info: artifacts imports
import { DatetimeProvider } from "@artifacts/datetime/datetime.provider"
import { EnvProvider } from "@artifacts/env/env.provider"

@Injectable()
export class LoggingProvider implements LoggerService {
	private readonly rootLogger: pino.Logger

	private readonly formatters: object = {
		level(label: string) {
			return { severity: label.toUpperCase() }
		},
	}

	private readonly serializers: { [key: string]: pino.SerializerFn } = {
		res(response: Response) {
			return response
		},
		req(request: Request) {
			return request
		},
	}

	private readonly customAttributeKeys: { [key: string]: string } = { req: "request", res: "response" }

	public constructor(private readonly datetimeProvider: DatetimeProvider, private readonly envProvider: EnvProvider) {
		if (this.envProvider.appLoggingMode() === "structured") {
			this.rootLogger = this.buildStructuredLogger()
		} else {
			this.rootLogger = this.buildPrettyLogger()
		}

		this.rootLogger.debug(`logger setup on ${this.envProvider.appLoggingMode().toLowerCase()} mode`)
	}

	public verbose(message: string): void {
		this.rootLogger.verbose(message)
	}

	public error(message: string): void {
		this.rootLogger.error(message)
	}

	public debug(message: string): void {
		this.rootLogger.debug(message)
	}

	public warn(message: string): void {
		this.rootLogger.warn(message)
	}

	public log(message: string): void {
		this.rootLogger.log(message)
	}

	private buildPrettyLogger(): pino.Logger {
		const prettyLogger: pino.Logger = pino({
			transport: {
				options: {
					translateTime: "UTC:yyyy-mm-dd HH:MM:ss.l",
					singleLine: false,
					hideObject: true,
					colorize: true,
				},
				target: "pino-pretty",
			},
			level: "debug",
		})
		return prettyLogger
	}

	private buildStructuredLogger(): pino.Logger {
		const structuredLogger: pino.Logger = pino({
			serializers: this.serializers,
			formatters: this.formatters,
			wrapSerializers: true,
			messageKey: "message",
			timestamp: false,
			base: undefined,
			level: "debug",
		})
		return structuredLogger
	}
}
