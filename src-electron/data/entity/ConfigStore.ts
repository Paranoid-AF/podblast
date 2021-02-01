import { Entity, Column, PrimaryColumn } from 'typeorm'
@Entity()
export class ConfigStore {
  @PrimaryColumn()
  key: string

  @Column()
  value: string
}