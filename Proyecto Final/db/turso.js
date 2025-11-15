import dotenv from "dotenv";
import { createClient } from "@libsql/client";

dotenv.config();

async function openDbConnection() {
	return createClient({
		url: process.env.TURSO_DB,
		authToken: process.env.TURSO_TOKEN,
	});
}

export async function executeQuery(query, params = []) {
	const conection = await openDbConnection();

	const result = await conection.execute(query, params);

	// Para INSERT/UPDATE/DELETE, devolver el objeto completo para acceder a lastInsertRowid
	// Para SELECT, devolver solo las filas para mantener compatibilidad con MySQL
	const isSelect = query.trim().toUpperCase().startsWith("SELECT");
	return isSelect ? result.rows : result;
}
