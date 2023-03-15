/** @format */

// ** info: nestjs imports
import { Module } from "@nestjs/common"
import { Global } from "@nestjs/common"

// ** info: artifacts imports
import { EnvProvider } from "@artifacts/env/env.provider"

@Global()
@Module({
	exports: [EnvProvider],
	providers: [EnvProvider],
})
export class EnvModule {}
