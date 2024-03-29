/** @format */

// ** info: nestjs imports
import { Module } from "@nestjs/common"
import { Global } from "@nestjs/common"

// ** info: artifacts imports
import { ResourcesProvider } from "@artifacts/resources/resources.provider"

@Global()
@Module({
	exports: [ResourcesProvider],
	providers: [ResourcesProvider],
})
export class ResourcesModule {}
