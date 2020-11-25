import { User } from "../../domain/models/user";

export interface ITianGongORMConn {
}

export const createTianGongORMConn = async () => {
  const options = await getConnectionOptions(<string>process.env.NODE_ENV);

  const dbParams = {
    url: 'arangodb://localhost:8529',
    user: 'root',
    password: 'root',
    database: 'mydb',
    syncronize: true,
    entities: [User],
  };

  return createConnection({ ...options, name: 'default' }) as Promise<ITianGongORMConn>;
};