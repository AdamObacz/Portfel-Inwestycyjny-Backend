import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { User } from "./User";
import { Asset } from "./Asset";

@Entity("transactions")
@Index(["userId", "createdAt"])
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "uuid" })
  assetId: string;

  @ManyToOne(() => Asset, { onDelete: "CASCADE" })
  @JoinColumn({ name: "assetId" })
  asset: Asset;

  @Column({ type: "varchar", length: 10 })
  type: "buy" | "sell"; // Transaction type

  @Column({ type: "decimal", precision: 20, scale: 8 })
  quantity: number; // Amount of asset

  @Column({ type: "decimal", precision: 20, scale: 2 })
  price: number; // Price per unit at transaction time

  @Column({ type: "decimal", precision: 20, scale: 2 })
  totalValue: number; // Total transaction value (quantity * price)

  @Column({ type: "text", nullable: true })
  note: string; // Optional note

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
