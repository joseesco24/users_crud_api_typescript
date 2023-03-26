/** @format */

// ** info: nestjs imports
import { ExecutionContext } from "@nestjs/common"
import { NestInterceptor } from "@nestjs/common"
import { CallHandler } from "@nestjs/common"
import { Injectable } from "@nestjs/common"
import { Request } from "@nestjs/common"

// ** info: rxjs imports
import { Observable } from "rxjs"
import { catchError } from "rxjs"
import { tap } from "rxjs"

// ** info: artifacts imports
import { LoggingProvider } from "@artifacts/logging/logging.provider"

@Injectable()
export class LoggerContextualizerInterceptor implements NestInterceptor {
	public constructor(private readonly loggingProvider: LoggingProvider) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request: Request = context.switchToHttp().getRequest()
		this.loggingProvider.debug("request details")
		console.log(request.body)

		return next.handle().pipe(
			tap((response: object) => {
				this.loggingProvider.debug("response details")
				console.log(response)
			}),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			catchError((error: any) => {
				this.loggingProvider.error("Internal Server Error")
				console.log(error)
				throw error
			})
		)
	}
}
