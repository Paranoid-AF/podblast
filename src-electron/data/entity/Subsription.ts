import { Entity, Column, PrimaryColumn } from 'typeorm'
@Entity()
export class Subscription {
  @PrimaryColumn()
  uuid: string

  @Column()
  title: string

  @Column()
  param: string // Param for source

  @Column()
  source: string // ID of source

  @Column()
  extension: string // ID of extension

  @Column({ nullable: true })
  backgroundColor: string // Hex

  @Column({ nullable: true })
  backgroundImage: string // Image URL

  @Column({ nullable: true })
  options: string // Additional options in JSON, such as proxy
}