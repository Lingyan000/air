import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';

class ArticleListRule extends Model {
  id!: number;
  title!: string;
  area_name!: string;
  area_url!: string;
  author!: string;
  chapter_find!: string;
  class_name!: string;
  class_url!: string;
  col_type!: string;
  detail_col_type!: string;
  detail_find_rule!: string;
  find_rule!: string;
  firstheader!: string;
  group_lpcolumn!: string;
  prerule!: string;
  sdetail_col_type!: string;
  sdetail_find_rule!: string;
  searchfind!: string;
  search_url!: string;
  sort_name!: string;
  sort_url!: string;
  titlecolor!: string;
  ua!: string;
  url!: string;
  version!: number;
  year_name!: string;
  year_url!: string;
  gmtcreate!: string;
  gmtmodified!: string;
  lastusetime!: string;
  last_chapter_rule!: string;
  pages!: string;
  storage!: string;
  icon!: string;
}

ArticleListRule.init(
  {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
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
      allowNull: false,
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
      unique: false,
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
  },
  {
    sequelize,
    modelName: 'Articlelistrule',
    tableName: 'articlelistrule',
    timestamps: false,
  }
);

ArticleListRule.sync();

export default ArticleListRule;
