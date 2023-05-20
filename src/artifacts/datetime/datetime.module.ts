/** @format */

// ** info: nestjs imports
import { Module } from "@nestjs/common"

// ** info: artifacts imports
import { DatetimeProvider } from "@artifacts/datetime/datetime.provider"

/**
 * Módulo que da acceso a las clases encargadas de proveer métodos para trabajar con fechas
 * @date 25/4/2023 - 11:03:35
 *
 * @export
 * @class DatetimeModule
 * @typedef {DatetimeModule}
 */
@Module({
	exports: [DatetimeProvider],
	providers: [DatetimeProvider],
})
export class DatetimeModule {}
