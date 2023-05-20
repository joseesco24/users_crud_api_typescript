/** @format */

// ** info: nestjs imports
import { Module } from "@nestjs/common"

// ** info: artifacts imports
import { EnvProvider } from "@artifacts/env/env.provider"

/**
 * Módulo que da acceso a las clases encargadas de cargar, validar y proveer acceso a las variables de entorno
 * @date 25/4/2023 - 11:02:24
 *
 * @export
 * @class EnvModule
 * @typedef {EnvModule}
 */
@Module({
	exports: [EnvProvider],
	providers: [EnvProvider],
})
export class EnvModule {}
