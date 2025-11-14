import { openDbConnection } from "../db/connection.js";

//Validar que usuario es valido
export async function isUserValid(username, password) {
	const connection = await openDbConnection();

	const sql = "SELECT 1 FROM `Users` WHERE `UserName` = ? AND `Password` = ?";
	const values = [username, password];

	const [result] = await connection.execute(sql, values);
	await connection.end();

	return result[0] !== undefined;
}
