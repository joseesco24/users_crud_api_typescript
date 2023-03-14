/** @format */

// ** info: nestjs imports
import { Module } from "@nestjs/common"
import { Global } from "@nestjs/common"

// ** info: artifacts imports
import { LoggingProvider } from "@artifacts/logging/logging.provider"

@Global()
@Module({
	exports: [LoggingProvider],
	providers: [LoggingProvider],
})
export class LoggingModule {}
