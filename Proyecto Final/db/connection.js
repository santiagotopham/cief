import mysql from "mysql2/promise";

process.loadEnvFile();

const configConnection = {
	host: process.env.host,
	port: process.env.db_port,
	user: process.env.user,
	password: process.env.password,
	database: process.env.database,
};

//Apertura de conexion
export async function openDbConnection() {
	return await mysql.createConnection(configConnection);
}
