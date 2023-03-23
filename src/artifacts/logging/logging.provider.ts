/** @format */

// ** info: nestjs imports
import { Injectable } from "@nestjs/common"
import { Response } from "@nestjs/common"
import { Request } from "@nestjs/common"

// ** info: artifacts imports
import { EnvProvider } from "@artifacts/env/env.provider"

@Injectable()
export class LoggingProvider {
	private readonly formatters: object = {
		level(label: string) {
			return { severity: label.toUpperCase() }
		},
	}

	private readonly serializers: object = {
		req(request: Request) {
			return request
		},
		res(response: Response) {
			return response
		},
	}

	private readonly customAttributeKeys: { [key: string]: string } = { req: "request", res: "response" }

	private readonly structuredConfig: object = {
		pinoHttp: {
			// eslint-disable-next-line no-unused-vars
			customProps: (request: Request, response: Response) => ({
				random: Math.random(),
			}),
			base: undefined,
			wrapSerializers: true,
			customAttributeKeys: this.customAttributeKeys,
			serializers: this.serializers,
			formatters: this.formatters,
			messageKey: "message",
			timestamp: false,
			level: "debug",
		},
	}

	private readonly prettyConfig: object = {
		pinoHttp: {
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
		},
	}

	public constructor(private readonly envProvider: EnvProvider) {}

	public getLoggerConfig(): object {
		if (this.envProvider.appLoggingMode() === "structured") {
			return this.structuredConfig
		} else {
			return this.prettyConfig
		}
	}
}
