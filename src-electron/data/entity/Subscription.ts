import { Entity, Column, PrimaryColumn } from 'typeorm'
@Entity()
export class Subscription {
  @PrimaryColumn()
  uuid: string

  @Column()
  title: string

  @Column({ nullable: true })
  description: string

  @Column()
  params: string // Param for source, provided in subscription creation form

  @Column()
  source: string // ID of source

  @Column()
  extension: string // ID of extension

  @Column({ nullable: true })
  cover_color: string // Hex

  @Column({ nullable: true })
  cover_pic: string // Image Base64

  @Column({ nullable: true })
  additional_info: string // Additional info passed by extension on subscription creation

  @Column({ default: false })
  pinned: boolean
}