/** @format */

// ** info: nestjs imports
import { LoggerService } from "@nestjs/common"
import { Injectable } from "@nestjs/common"

// ** info: pino imports
import pino from "pino"

// ** info: artifacts imports
import { DatetimeProvider } from "@artifacts/datetime/datetime.provider"
import { EnvProvider } from "@artifacts/env/env.provider"

@Injectable()
export class LoggingProvider implements LoggerService {
	private readonly prettyColors: string = "verbose:magenta, debug:green, error:red, warn:yellow, info:blue, log:white"
	private readonly prettyLevels: string = "verbose:0, debug:2, error:5, warn:4, info:3, log:1"

	private readonly levels: { [key: string]: number } = {
		verbose: 0,
		debug: 2,
		error: 5,
		warn: 4,
		info: 3,
		log: 1,
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private readonly rootLogger: any

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

	public debug(message: string): void {
		this.rootLogger.debug(message)
	}

	public error(message: string): void {
		this.rootLogger.error(message)
	}

	public warn(message: string): void {
		this.rootLogger.warn(message)
	}

	public info(message: string): void {
		this.rootLogger.info(message)
	}

	public log(message: string): void {
		this.rootLogger.log(message)
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private buildPrettyLogger(): any {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const prettyLogger: any = pino({
			transport: {
				options: {
					translateTime: "UTC:yyyy-mm-dd HH:MM:ss.l",
					customColors: this.prettyColors,
					customLevels: this.prettyLevels,
					singleLine: false,
					hideObject: true,
					colorize: true,
				},
				target: "pino-pretty",
			},
			useOnlyCustomLevels: true,
			customLevels: this.levels,
			level: "verbose",
		})
		return prettyLogger
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private buildStructuredLogger(): any {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const structuredLogger: any = pino({
			serializers: this.serializers,
			formatters: this.formatters,
			customLevels: this.levels,
			useOnlyCustomLevels: true,
			wrapSerializers: true,
			messageKey: "message",
			timestamp: false,
			base: undefined,
			level: "verbose",
		})
		return structuredLogger
	}
}
