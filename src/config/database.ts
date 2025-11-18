import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Session } from "../entities/Session";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "portfolio_db",
  synchronize: process.env.NODE_ENV === "development",
  logging: false,
  //Możesz tutaj podać cały folder,
  // tylko pamietaj ze w zaleznosci od dev/start folder sie rozni wiec ta zmienna NODE_ENV jest wazna
  entities: [User, Session],

  //Tak samo tutaj, folder sie bedzie rożnił pewnie
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log("✓ Database connected");
  })
  .catch((error) => {
    console.error("✗ Database error:", error);
  });

export default AppDataSource;
