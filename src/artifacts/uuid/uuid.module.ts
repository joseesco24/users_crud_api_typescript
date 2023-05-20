/** @format */

// ** info: nestjs imports
import { Module } from "@nestjs/common"

// ** info: artifacts imports
import { UuidProvider } from "@artifacts/uuid/uuid.provider"

/**
 * Módulo que da acceso a las clases encargadas de proveer métodos para trabajar con uuid
 * @date 25/4/2023 - 11:00:43
 *
 * @export
 * @class UuidModule
 * @typedef {UuidModule}
 */
@Module({
	exports: [UuidProvider],
	providers: [UuidProvider],
})
export class UuidModule {}
