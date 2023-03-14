/** @format */

// ** info: nestjs imports
import { Injectable } from "@nestjs/common"
import { Response } from "@nestjs/common"
import { Request } from "@nestjs/common"

@Injectable()
export class LoggingProvider {
	private readonly loggingMode: string = process.env.APP_LOGGING_MODE as string

	private readonly formatters: object = {
		level(label: string) {
			return { severity: label }
		},
	}

	private readonly structuredConfig: object = {
		pinoHttp: {
			customProps: (request: Request, response: Response) => ({
				context: "HTTP",
				random: Math.random(),
			}),
			base: { pid: process.pid },
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

	public getLoggerConfig(): object {
		if (this.loggingMode === "structured") {
			return this.structuredConfig
		} else {
			return this.prettyConfig
		}
	}
}
