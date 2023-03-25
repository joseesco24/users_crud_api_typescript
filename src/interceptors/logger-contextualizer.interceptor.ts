/** @format */

// ** info: nestjs imports
import { ExecutionContext } from "@nestjs/common"
import { NestInterceptor } from "@nestjs/common"
import { CallHandler } from "@nestjs/common"
import { Injectable } from "@nestjs/common"

// ** info: rxjs imports
import { Observable } from "rxjs"

@Injectable()
export class LoggerContextualizerInterceptor implements NestInterceptor {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const request: any = context.switchToHttp().getRequest()
		// context.switchToHttp().set("body", { request })
		return next.handle()
	}
}
