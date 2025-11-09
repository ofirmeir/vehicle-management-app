import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "vehicles",
  modelName: "Vehicle",
})
export default class Vehicle extends Model<
  InferAttributes<Vehicle>,
  InferCreationAttributes<Vehicle>
> {
  @Column({
    primaryKey: true,
    type: DataType.BIGINT,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column
  declare status: string;

  @Unique
  @Column
  declare license_plate: string;

  @CreatedAt
  declare created_at: CreationOptional<Date>;

  @UpdatedAt
  declare updated_at: CreationOptional<Date>;

  toJSON() {
    return { ...this.get(), created_at: undefined, updated_at: undefined };
  }
}
