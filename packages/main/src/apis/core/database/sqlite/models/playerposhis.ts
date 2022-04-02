import { DataTypes, InferAttributes, Model } from 'sequelize';
import sequelize from '/@/apis/core/database/sqlite/models/sequelize';

class Playerposhis extends Model<InferAttributes<Playerposhis>> {
  declare id?: number;
  declare playurl: string;
  declare pos: number;
}

Playerposhis.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    playurl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pos: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'playerposhis',
    timestamps: false,
  }
);

export default Playerposhis;
