import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { User } from "./User";

@Entity("portfolio_snapshots")
@Index(["userId", "snapshotDate"])
export class PortfolioSnapshot {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "date" })
  snapshotDate: Date;

  @Column({ type: "decimal", precision: 20, scale: 2 })
  totalValue: number; // Total portfolio value in USD

  @Column({ type: "jsonb" })
  breakdown: {
    assetId: string;
    symbol: string;
    quantity: number;
    currentPrice: number;
    value: number;
  }[]; // Array of asset breakdowns

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
