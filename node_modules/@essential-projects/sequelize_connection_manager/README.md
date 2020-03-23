# Sequelize Connection Manager

Creates and manages connections against a database, using sequelize.

The manager can be used to avoid having multiple connections running against the
same database.

It stores each created connection in an internal connection storage and provides
methods for creating and retrieving such a connection and for destroying it.

## Usage

Usage is simple enough.

You need to have a valid Sequelize connection config at hand that you
can pass to the manager.

With it, you can create, retrieve and close any Sequelize connection.

### Create an instance

You can get an instance of the manager in one of two ways:

#### Manual instantiation

You can simply create an instance the usual way.

```TypeScript
import {
  SequelizeConnectionManager,
} from '@essential-projects/sequelize_connection_manager';

const sequelizeConnectionManager: SequelizeConnectionManager =
  new SequelizeConnectionManager();
```

#### Through IoC

The manager provides a module that can be used with [addict-ioc](https://github.com/5minds/addict-ioc/).

The registration looks like this:

```TypeScript
  container
    .register('SequelizeConnectionManager', SequelizeConnectionManager)
    .singleton();
```

It registers the manager as a Singleton component, meaning that any class that
gets it as a dependency, will get the same instance.

To inject it into another class, use the following registration:

```TypeScript
  container
    .register('SomeSampleRegistration', SomeSampleClass)
    .dependencies('SequelizeConnectionManager');
```

Then your class will get the manager injected into its constructor:

```TypeScript
import {
  SequelizeConnectionManager,
} from '@essential-projects/sequelize_connection_manager';


class SomeSampleClass {

  private _sequelizeConnectionManager: SequelizeConnectionManager;

  constructor(sequelizeConnectionManager: SequelizeConnectionManager) {
    this._sequelizeConnectionManager = sequelizeConnectionManager
  }
}
```

### Get a Connection

To retrieve a connection to a specific database, use the following call:

```TypeScript
import * as Sequelize from 'sequelize';

const databaseConfig: Sequelize.Options = {
  dialect: 'postgres',
  database: 'sample_database',
  username: 'someusername',
  password: 'somepassword',
};

const sequelizeConnection: Sequelize.Sequelize =
  await sequelizeConnectionManager.getConnection(config)
```

This will get you a connection to the postgres database `sample_database`, using
the given credentials for authentication.

If no such connection has been established before, a new one will be created.

If a matching connection already exists, the manager will return that one instead.

### Close a Connection

To close an existing connection, pass the same config to the following call:

```TypeScript
await sequelizeConnectionManager.destroyConnection(config)
```

**Caution:**
Be advised that this will close the connection for **any** component that uses
it!
