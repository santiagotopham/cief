// import { executeQuery } from "../db/mysql.js";
import { executeQuery } from "../db/turso.js";

//Validar que usuario es valido
export async function isUserValid(username, password) {
	const sql = "SELECT 1 FROM `Users` WHERE `UserName` = ? AND `Password` = ?";
	const values = [username, password];

	const result = await executeQuery(sql, values);

	return result[0] !== undefined;
}
