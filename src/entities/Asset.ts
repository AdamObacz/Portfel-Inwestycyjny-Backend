import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";

@Entity("assets")
@Index(["symbol"], { unique: true })
export class Asset {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50 })
  symbol: string; // e.g., "BTC", "ETH"

  @Column({ type: "varchar", length: 255 })
  name: string; // e.g., "Bitcoin", "Ethereum"

  @Column({ type: "varchar", length: 50 })
  type: string; // e.g., "cryptocurrency"

  @Column({ type: "varchar", nullable: true })
  apiId: string; // ID from external API (e.g., CoinGecko ID)

  @Column({ type: "text", nullable: true })
  imageUrl: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
