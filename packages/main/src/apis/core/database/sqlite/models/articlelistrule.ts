import { DataTypes, InferAttributes, Model } from 'sequelize';
import sequelize from './sequelize';
import dayjs from 'dayjs';

class ArticleListRule extends Model<InferAttributes<ArticleListRule>> {
  declare id: number;
  declare title: string;
  declare area_name: string;
  declare area_url: string;
  declare author: string;
  declare chapter_find: string;
  declare class_name: string;
  declare class_url: string;
  declare col_type: string;
  declare detail_col_type: string;
  declare detail_find_rule: string;
  declare find_rule: string;
  declare firstheader: string;
  declare group_lpcolumn: string;
  declare prerule: string;
  declare sdetail_col_type: string;
  declare sdetail_find_rule: string;
  declare searchfind: string;
  declare search_url: string;
  declare sort_name: string;
  declare sort_url: string;
  declare titlecolor: string;
  declare ua: string;
  declare url: string;
  declare version: number;
  declare year_name: string;
  declare year_url: string;
  declare gmtcreate: number;
  declare gmtmodified: number;
  declare lastusetime: number;
  declare last_chapter_rule: string;
  declare pages: string;
  declare storage: string;
  declare icon: string;
  declare type: string;
}

ArticleListRule.init(
  {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    }, // 规则id
    area_name: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    }, // 区域名称
    area_url: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    }, // 区域url
    author: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    }, // 作者
    chapter_find: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    }, // 查找章节
    class_name: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    }, // 类名
    class_url: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    }, // 类url
    col_type: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    }, // 类型
    detail_col_type: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    }, // 详情类型
    detail_find_rule: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    }, // 详情查找规则
    find_rule: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    }, // 查找规则
    firstheader: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    }, // 第一个标题
    group_lpcolumn: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    }, // 分组排序
    prerule: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    }, // 预处理规则
    sdetail_col_type: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    }, // 详情类型
    sdetail_find_rule: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    }, // 详情查找规则
    searchfind: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    search_url: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    sort_name: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    sort_url: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    title: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: true,
    },
    titlecolor: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    ua: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    url: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    version: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: true,
    },
    year_name: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    year_url: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    gmtcreate: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: true,
    },
    gmtmodified: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: true,
    },
    lastusetime: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: true,
    },
    last_chapter_rule: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    pages: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: true,
    },
    storage: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    icon: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    type: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Articlelistrule',
    tableName: 'articlelistrule',
    timestamps: false,
    createdAt: 'gmtcreate',
    updatedAt: 'gmtmodified',
  }
);

ArticleListRule.beforeCreate((record) => {
  record.setDataValue('gmtcreate', dayjs().valueOf());
  record.setDataValue('gmtmodified', dayjs().valueOf());
});

ArticleListRule.beforeUpdate((record) => {
  record.setDataValue('gmtmodified', dayjs().valueOf());
});

ArticleListRule.sync({ alter: true });

export default ArticleListRule;
