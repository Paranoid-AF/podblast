import path from 'path'
import "reflect-metadata"
import { createConnection, ConnectionOptions } from "typeorm"
import { profilePath } from '../constants/path'

const dbConf: ConnectionOptions = {
  type: 'better-sqlite3',
  database: path.join(profilePath, 'data.db')
}

export const initDatabase = async () => {
  await createConnection(dbConf)
}
