import path from 'path'
import "reflect-metadata"
import { createConnection, ConnectionOptions, Connection } from "typeorm"
import { profilePath } from '../constants/path'
import { fetchConfig } from '../confmgr'
import { getOverrideValue } from '../confmgr/override'

const dbName = getOverrideValue('file.userDatabaseName')
const dbConf: ConnectionOptions = {
  type: 'better-sqlite3',
  database: path.join(profilePath, (dbName ?? 'data') + '.db'),
  entities: [__dirname + "/entity/*.js"],
  synchronize: true
}

export const connection = {
  current: null as Connection | null
}

export const initDatabase = async () => {
  connection.current = await createConnection(dbConf)
  await fetchConfig()
}
