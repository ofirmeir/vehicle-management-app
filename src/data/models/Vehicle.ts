import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import {
  AllowNull,
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

  @AllowNull(false)
  @Column({
    validate: {
      isIn: [["Available", "InUse", "Maintenance"]],
    },
    type: DataType.ENUM("Available", "InUse", "Maintenance"),
  })
  declare status: string;

  @AllowNull(false)
  @Unique
  @Column({
    validate: {
      is: /^[A-Z0-9]{1,6}$/i,
      len: [1, 6],
    },
    type: DataType.STRING(10),
  })
  declare license_plate: string;

  @CreatedAt
  declare created_at: CreationOptional<Date>;

  @UpdatedAt
  declare updated_at: CreationOptional<Date>;

  toJSON() {
    return { ...this.get(), created_at: undefined, updated_at: undefined };
  }
}
