import { DataTypes, InferAttributes, Model } from 'sequelize';
import sequelize from '/@/apis/core/database/sqlite/models/sequelize';

class ViewHistory extends Model<InferAttributes<ViewHistory>> {
  declare id?: number;
  declare lastclick?: string;
  declare params?: string;
  declare rulebaseurl?: string;
  declare time: number;
  declare title: string;
  declare type: string;
  declare url: string;
  declare videourl?: string;
  declare group_lpcolumn?: string;
  declare picurl?: string;
  declare extradata?: string;
}

ViewHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    lastclick: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    params: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rulebaseurl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    videourl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    group_lpcolumn: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    picurl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    extradata: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'viewhistory',
    timestamps: false,
  }
);

ViewHistory.sync({ alter: true });

export default ViewHistory;
