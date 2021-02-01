import { Entity, Column, PrimaryColumn } from 'typeorm'
@Entity()
export class Extension {
  @PrimaryColumn()
  extensionId: string

  @Column({ default: 'enabled' })
  status: string

  @Column({ default: 'useGlobal' })
  proxy: string

  @Column({ nullable: true })
  proxyAddress: string

}