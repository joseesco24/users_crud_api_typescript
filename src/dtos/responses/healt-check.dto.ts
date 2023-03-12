/** @format */

import { IsNotEmpty } from "class-validator"
import { IsNumber } from "class-validator"
import { IsBoolean } from "class-validator"

export class HealthCheckResponseDto {
	@IsBoolean()
	@IsNotEmpty()
	public readonly redisDownloadConnection!: boolean

	@IsBoolean()
	@IsNotEmpty()
	public readonly redisUploadConnection!: boolean

	@IsBoolean()
	@IsNotEmpty()
	public readonly postgresQuerySession!: boolean

	@IsBoolean()
	@IsNotEmpty()
	public readonly allConnectionsOk!: boolean

	@IsNumber()
	@IsNotEmpty()
	public readonly memoryUsage!: number

	@IsNumber()
	@IsNotEmpty()
	public readonly cpuUsage!: number
}
