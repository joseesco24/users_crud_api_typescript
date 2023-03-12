/** @format */

// ** info: nestjs imports
import { Injectable } from "@nestjs/common"

// ** info: uuid imports
import { v4 } from "uuid"

@Injectable()
export class UuidProvider {
	public getStrUuid(): string {
		return v4()
	}
}
