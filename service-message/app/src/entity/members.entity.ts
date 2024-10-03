import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'members' })
export class MembersRepo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({  name: 'chat_members', type: 'text', array: true})
  chatMembers: string[];

  @Column({ name: 'roomname', type: 'text', unique: true })
  roomName: string;

  @CreateDateColumn({ name: 'create_at', default: new Date() })
  createAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: new Date() })
  updatedAt: Date;
}
