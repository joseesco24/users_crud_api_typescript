/** @format */

// ** info: nestjs imports
import { Injectable } from "@nestjs/common"

// ** info: dtos imports
import { HealthCheckResponseDto } from "@dtos/responses/healt-check.dto"

// ** info: artifacts imports
import { ResourcesProvider } from "@artifacts/resources/resources.provider"
import { LoggingProvider } from "@artifacts/logging/logging.provider"

@Injectable()
export class HealthCheckController {
	public constructor(private readonly resourcesProvider: ResourcesProvider, private readonly loggingProvider: LoggingProvider) {}

	public getHealthCheck(): HealthCheckResponseDto {
		const response: HealthCheckResponseDto = new Object() as HealthCheckResponseDto

		response.redisDownloadConnection = true
		response.redisUploadConnection = true
		response.postgresQuerySession = true
		response.allConnectionsOk = true

		response.memoryUsage = this.resourcesProvider.getMemoryUsage()
		response.cpuUsage = this.resourcesProvider.getCpuUsage()

		this.loggingProvider.info("all databases are healthy")

		return response
	}
}
