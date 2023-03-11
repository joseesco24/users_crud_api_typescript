/** @format */

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as Joi from "joi"

export const validationSchema: Joi.ObjectSchema<any> = Joi.object({
	/* Endpoints ai keys validations */
	REPORTS_ENDPOINT_KEY: Joi.string().required(),
	/* Environment mode validation */
	ENVIRONMENT_MODE: Joi.string()
		.required()
		.valid(...["development", "production", "testing"]),
	/* Dtabase Credentials validation */
	DATABASE_PASSWORD: Joi.string().required(),
	DATABASE_USER: Joi.string().required(),
	DATABASE_NAME: Joi.string().required(),
	DATABASE_HOST: Joi.string().required(),
	DATABASE_PORT: Joi.number().required(),
	DATABASE_TYPE: Joi.string().required(),
	DATABASE_SCHEMA: Joi.string().required(),
})
