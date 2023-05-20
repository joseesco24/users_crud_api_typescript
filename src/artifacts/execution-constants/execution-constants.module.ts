/** @format */

// ** info: nestjs imports
import { Module } from "@nestjs/common"

// ** info: artifacts imports
import { ExecutionConstantsProvider } from "@artifacts/execution-constants/execution-constants.provider"
import { DatetimeModule } from "@artifacts/datetime/datetime.module"
import { UuidModule } from "@artifacts/uuid/uuid.module"

/**
 * Módulo que da acceso a las clase encargada de cargar y proveer constantes que no se alteran durante la ejecucion de la instancia del servicio
 * @date 26/4/2023 - 18:52:07
 *
 * @export
 * @class ExecutionConstantsModule
 * @typedef {ExecutionConstantsModule}
 */
@Module({
	imports: [DatetimeModule, UuidModule],
	exports: [ExecutionConstantsProvider],
	providers: [ExecutionConstantsProvider],
})
export class ExecutionConstantsModule {}
