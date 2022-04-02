import air from '/@/apis/core/air';
import ArticleListRule from '/@/apis/core/database/sqlite/models/articlelistrule';
import Viewhistory from '/@/apis/core/database/sqlite/models/viewhistory';
import Playerposhis from '/@/apis/core/database/sqlite/models/playerposhis';

export default async () => {
  try {
    await Promise.all([
      ArticleListRule.sync({ alter: true }),
      Viewhistory.sync({ alter: true }),
      Playerposhis.sync({ alter: true }),
    ]);
  } catch (error: any) {
    air.log.error(error);
  }
};
