import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

//Przepinka na redisa całkowicie, PSG ma ten problem, że  manualnie rekord się nie usunie. Dlatego trzymanie sesji w bazie
//danych zadziała, ale long term jest nieoptymalne. No chyba, że to NoSQL albo ma automatyczne czyszczenie dobrze zrobione
@Entity("sessions")
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "text" })
  token: string;

  @Column({ type: "timestamp" })
  expiresAt: Date;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
