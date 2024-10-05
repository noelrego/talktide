import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

@Entity({ name: 'chat_history' })
export class MessageRepo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'member_id', type: 'integer', nullable: false })
  memberId: number;

  @Column({ name: 'sender_id', type: 'integer', nullable: false })
  senderId: number;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'has_preview', type: 'boolean', default: false })
  hasPreview: boolean;

  @Column({ name: 'preview_content', type: 'text' })
  previewContent: string;

  @Column({ name: 'replayed_by', type: 'varchar' })
  replayedBy: string;

  @Column({ name: 'replayed_msg_id', type: 'integer' })
  replayedMsgId: number;

  @CreateDateColumn({ name: 'create_at', default: new Date() })
  createAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: new Date() })
  updatedAt: Date;
}
