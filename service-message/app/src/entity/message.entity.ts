import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { MembersRepo } from './members.entity';

@Entity({ name: 'messages' })
export class MessageRepo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MembersRepo, {nullable: false})
  @JoinColumn({name: 'member_id'})
  memberId: MembersRepo;

  @Column({ name: 'roomname', type: 'text', unique: true })
  roomName: string;

  @Column({ name: 'message_content', type: 'text', nullable: false })
  messageContent: string;

  @Column({ name: 'has_preview', type: 'boolean', default: false })
  hasPreview: boolean;

  @Column({ name: 'replayed_by', type: 'text' })
  replayedBy: string;

  @Column({ name: 'replayed_msg_id', type: 'text', nullable: false })
  replayedMsgId: number;

  @CreateDateColumn({ name: 'create_at', default: new Date() })
  createAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: new Date() })
  updatedAt: Date;
}
