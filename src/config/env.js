import { config as getConfg } from "dotenv";
export const {
	PORT,
	DB_NAME,
	USER,
	PSSWD,
	SERVER,
} = getConfg().parsed