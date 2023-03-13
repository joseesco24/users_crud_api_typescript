/** @format */

// ** info: nestjs imports
import { Module } from "@nestjs/common"
import { Global } from "@nestjs/common"

// ** info: artifacts imports
import { DatetimeProvider } from "@artifacts/datetime/datetime.provider"

@Global()
@Module({
	exports: [DatetimeProvider],
	providers: [DatetimeProvider],
})
export class DatetimeModule {}
