import * as crypto from 'crypto';
import * as fsExtra from 'fs-extra';
import {Logger} from 'loggerhythm';
import * as path from 'path';
import {Sequelize, SequelizeOptions} from 'sequelize-typescript';

const logger = Logger.createLogger('essential-projects:sequelize_connection_manager');

/**
 * Creates, manages and destroys connections to Sequelize based databases.
 */
export class SequelizeConnectionManager {

  private connections: {[hash: string]: Sequelize} = {};

  /**
   * Returns a Sequelize connection for the given configuration.
   *
   * @async
   * @param  config          Contains the settings with which to establish a
   *                         database connection.
   *                         Required parameters are host, port, database,
   *                         dialect, username and password.
   * @param  config.host     The name of the host where the database is located.
   * @param  config.port     The port by which to connect to the host.
   * @param  config.dialect  The type of database to which to connect
   *                         (postgres, sqlite, mysql, etc).
   * @param  config.database The name of the database to connect to.
   * @param  config.username The username with which to connect to the database.
   * @param  config.password The password with which to connect to the database.
   * @return                 The connection for the passed configuration.
   */
  public async getConnection(config: SequelizeOptions): Promise<Sequelize> {

    const dbToUse = config.dialect === 'sqlite'
      ? config.storage
      : config.database;

    const hash = this.getHash(config.dialect, dbToUse, config.username, config.password);

    const connectionExists = this.connections[hash] !== undefined;
    if (connectionExists) {
      logger.info(`Active connection to ${config.dialect} database '${dbToUse}' found.`);

      return Promise.resolve(this.connections[hash]);
    }

    if (config.dialect === 'sqlite') {
      const pathIsAbsolute = path.isAbsolute(config.storage);
      if (pathIsAbsolute) {
        fsExtra.ensureFileSync(config.storage);
      }
    }

    // eslint-disable-next-line no-param-reassign
    config.retry = {
      match: [
        /SQL_BUSY/,
        /SQLITE_BUSY/,
      ],
      max: 50,
    };

    const connection = new Sequelize(dbToUse, config.username, config.password, config);
    logger.info(`Connection to ${config.dialect} database '${dbToUse}' established.`);
    this.connections[hash] = connection;

    return Promise.resolve(connection);
  }

  /**
   *
   * Destroys a Sequelize connection based on the given config.
   *
   * @async
   * @param {Object} config Contains the settings that describe the Sequelize
   *                        connection to destroy.
   */
  public async destroyConnection(config: SequelizeOptions): Promise<void> {

    const dbToUse = config.dialect === 'sqlite'
      ? config.storage
      : config.database;

    const hash = this.getHash(config.dialect, dbToUse, config.username, config.password);

    const connectionExists = this.connections[hash] !== undefined;
    if (!connectionExists) {
      logger.info(`Connection to ${config.dialect} database '${dbToUse}' not found.`);

      return;
    }
    try {
      logger.info(`Disposing connection to ${config.dialect} database '${dbToUse}'...`);
      await (this.connections[hash] as Sequelize).close();
    } catch (error) {
      logger.warn('Cannot close connection, because it was already disposed.');
      logger.verbose(error.message);
    } finally {
      if (this.connections[hash] !== undefined) {
        delete this.connections[hash];
      }
      logger.info('Done.');
    }
  }

  /**
   * Generates a hash from config settings marking a unique connection.
   *
   * @param  dialect  The database dialect (sqlite, postgres, etc).
   * @param  database The name of the database to connect to.
   * @param  username The username with which to connect to the database.
   * @param  password The password with which to connect to the database.
   * @return          The generated hash.
   */
  private getHash(dialect: string, database: string, username: string, password: string): string {
    const properties = `${dialect}${database}${username}${password}`;
    const hashedString = crypto.createHash('md5').update(properties)
      .digest('hex');

    return hashedString;
  }

}
