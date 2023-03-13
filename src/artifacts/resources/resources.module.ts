/** @format */

// ** info: nestjs imports
import { Module } from "@nestjs/common"

// ** info: artifacts imports
import { ResourcesProvider } from "@artifacts/resources/resources.provider"

@Module({
	exports: [ResourcesProvider],
	providers: [ResourcesProvider],
})
export class ResourcesModule {}
