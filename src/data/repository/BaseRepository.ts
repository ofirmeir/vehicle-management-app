import { Sequelize } from "sequelize-typescript";
import config from "../../config";

export default class BaseRepository {
  sequelizeClient: Sequelize;

  constructor() {
    this.sequelizeClient = new Sequelize({
      host: config.db.host,
      port: config.db.port,
      database: config.db.database,
      dialect: "mysql",
      username: config.db.username,
      password: config.db.password,
    });
  }
}
