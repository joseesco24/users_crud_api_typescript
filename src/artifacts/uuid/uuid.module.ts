/** @format */

// ** info: nestjs imports
import { Module } from "@nestjs/common"
import { Global } from "@nestjs/common"

// ** info: artifacts imports
import { UuidProvider } from "@artifacts/uuid/uuid.provider"

@Global()
@Module({
	controllers: [UuidProvider],
	providers: [UuidProvider],
})
export class UuidModule {}
