/** @format */

// ** info: javascript imports
import { posix } from "path"

// ** info: nestjs imports
import { Injectable } from "@nestjs/common"

@Injectable()
export class PathProvider {
	public buildPosixPath(args: string[]): string {
		return posix.join(...args)
	}
}
