/** @format */

import { registerAs } from "@nestjs/config"

export default registerAs("config", function () {
	return {
		reportsEndpointConfig: {
			endpointKey: process.env.REPORTS_ENDPOINT_KEY as string,
		},
		environmentConfig: {
			mode: process.env.ENVIRONMENT_MODE as string,
		},
		shdDatabase: {
			password: process.env.DATABASE_PASSWORD as string,
			username: process.env.DATABASE_USER as string,
			name: process.env.DATABASE_NAME as string,
			host: process.env.DATABASE_HOST as string,
			port: Number(process.env.DATABASE_PORT as string),
			type: process.env.DATABASE_TYPE as string,
			schema: process.env.DATABASE_SCHEMA as string,
		},
	}
})
