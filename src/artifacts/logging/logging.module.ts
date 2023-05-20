/** @format */

// ** info: nestjs imports
import { Module } from "@nestjs/common"

// ** info: artifacts imports
import { ExecutionConstantsModule } from "@artifacts/execution-constants/execution-constants.module"
import { LoggingProvider } from "@artifacts/logging/logging.provider"
import { DatetimeModule } from "@artifacts/datetime/datetime.module"
import { EnvModule } from "@artifacts/env/env.module"

// ** info: nest cls imports
import { ClsModule } from "nestjs-cls"

/**
 * Módulo que da acceso a las clases encargadas de proveer métodos para escribir logs del sistema
 * @date 25/4/2023 - 11:01:50
 *
 * @export
 * @class LoggingModule
 * @typedef {LoggingModule}
 */
@Module({
	imports: [ExecutionConstantsModule, DatetimeModule, EnvModule, ClsModule],
	exports: [LoggingProvider],
	providers: [LoggingProvider],
})
export class LoggingModule {}
