import mysql from "mysql2/promise";

process.loadEnvFile();

const configConnection = {
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	port: process.env.MYSQL_PORT,
};

//Apertura de conexion
async function openDbConnection() {
	return await mysql.createConnection(configConnection);
}

export async function executeQuery(query, params = []) {
	const connection = await openDbConnection();

	const [rows] = await connection.execute(query, params);
	return rows;
}
