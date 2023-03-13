/** @format */

// ** info: nestjs imports
import { Module } from "@nestjs/common"
import { Global } from "@nestjs/common"

// ** info: artifacts imports
import { PathProvider } from "@artifacts/path/path.provider"

@Global()
@Module({
	exports: [PathProvider],
	providers: [PathProvider],
})
export class PathModule {}
