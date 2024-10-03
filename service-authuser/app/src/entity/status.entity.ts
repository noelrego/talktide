import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AuthUserRepo } from './auth-user.entity';
import { SystemStatus, UserStatus } from 'src/common';

@Entity('status_info')
export class StatusInfoRepo {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => AuthUserRepo, (authUser) => authUser.statusInfo)
    @JoinColumn({ name: 'auth_id' })
    authUser: AuthUserRepo;

    @Column({ name: 'user_status', type: 'enum', enum: UserStatus, default: UserStatus.OFFLINE })
    userStatus: UserStatus;

    @Column({ name: 'system_status', type: 'enum', enum: SystemStatus, default: SystemStatus.LOGOUT })
    systemStatus: SystemStatus;

    @CreateDateColumn({ name: 'create_at', default: new Date() })
    createAt: Date;

    @UpdateDateColumn({ name: 'updated_at', default: new Date() })
    updatedAt: Date;
}
