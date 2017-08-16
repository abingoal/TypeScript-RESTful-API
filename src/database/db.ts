import * as debug from 'debug';
import * as sequelize from 'sequelize';
import configs from '../libs/configs';

const debugging = debug('gameapi:proc:result');

class DataBase {
    protected db: sequelize.Sequelize;
    /**
     * 数据库操作
     */
    constructor() {
        this.db = new sequelize(
            configs.dataBase.account.database,
            configs.dataBase.account.userid,
            configs.dataBase.account.password,
            configs.dataBase.option
        );
        this.init();
    }
    /**
     * 执行存储过程
     * @param procName 存储过程名称
     * @param params 参数
     */
    public execProc(procName: string, params: object) {
        return new Promise((resolve, reject) => {
            if (procName.length === 0) {
                reject({ err: '存储过程未传递' });
                return;
            }
            this.db.query(procName, {
                logging: configs.isDebug,
                raw: true,
                replacements: params
            }).then((data) => {
                debugging('%o', data);
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    /**
     * 验证连接情况
     *
     * @private
     * @memberof DataBase
     */
    private init() {
        this.db.authenticate().then(() => {
            debugging('建立连接成功');
        }).catch((err) => {
            debugging('无法连接到数据库：', err);
        });
    }
}
export default new DataBase();
