import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { StatusInfoRepo } from './status.entity';

@Entity({ name: 'auth_user' })
export class AuthUserRepo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_name', length: 32, unique: true })
  userName: string;

  @Column({ name: 'first_name', length: 32 })
  firstName: string;

  @Column({ name: 'last_name', length: 32, nullable: true })
  lastName?: string;

  @Column({ name: 'user_password', type: 'text' })
  userPassword: string;

  @Column({ name: 'rh_token', type: 'text', nullable: true })
  rhToken?: string;

  @OneToOne(() => StatusInfoRepo, (statusInfo) => statusInfo.authUser)
  statusInfo: StatusInfoRepo;

  @CreateDateColumn({ name: 'create_at', default: new Date() })
  createAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: new Date() })
  updatedAt: Date;
}
