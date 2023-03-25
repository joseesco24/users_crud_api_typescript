/** @format */

// ** info: javascript imports
import * as path from "path"

// ** info: nestjs imports
import { Injectable } from "@nestjs/common"

// ** info: pino imports
import pino from "pino"

// ** info: artifacts imports
import { DatetimeProvider } from "@artifacts/datetime/datetime.provider"
import { EnvProvider } from "@artifacts/env/env.provider"

@Injectable()
export class LoggingProvider {
	private readonly formatters: object = {
		level(label: string) {
			return { severity: label.toUpperCase() }
		},
	}

	private readonly serializers: { [key: string]: pino.SerializerFn } = {
		req(request: Request) {
			return request
		},
		res(response: Response) {
			return response
		},
	}

	private readonly customAttributeKeys: { [key: string]: string } = { req: "request", res: "response" }

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private readonly structuredLogger: any = pino({
		// eslint-disable-next-line no-unused-vars
		customProps: (request: Request, response: Response) => ({
			random: Math.random(),
		}),
		base: undefined,
		customAttributeKeys: this.customAttributeKeys,
		serializers: this.serializers,
		formatters: this.formatters,
		wrapSerializers: true,
		messageKey: "message",
		timestamp: false,
		level: "debug",
	}).child({ filename: path.basename(__filename), timeStamp: this.datetimeProvider.getUtcIsoString() })

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private readonly prettyLogger: any = pino({
		transport: {
			target: "pino-pretty",
			options: {
				translateTime: "UTC:yyyy-mm-dd HH:MM:ss.l",
				singleLine: false,
				hideObject: true,
				colorize: true,
			},
		},
		level: "debug",
	}).child({ filename: path.basename(__filename) })

	private readonly structuredConfig: object = {
		pinoHttp: {
			logger: this.structuredLogger,
		},
	}

	private readonly prettyConfig: object = {
		pinoHttp: {
			logger: this.prettyLogger,
		},
	}

	public constructor(private readonly datetimeProvider: DatetimeProvider, private readonly envProvider: EnvProvider) {}

	public getLoggerConfig(): object {
		if (this.envProvider.appLoggingMode() === "structured") {
			return this.structuredConfig
		} else {
			return this.prettyConfig
		}
	}
}
