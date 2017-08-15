import * as debug from 'debug';
import * as sequelize from 'sequelize';

const debugging = debug('gameapi:sql');

class Configs {
    public dbAccount: IDBAccount;            // 数据库配置
    public dbOption: sequelize.Options;     // 查询配置
    public dbDebug: boolean | Function;     // 数据库是否调试模式

    constructor() {
        // 是否调试
        this.dbDebug = (con) => {
            debugging(con);
        };
        // 查询配置
        this.dbOption = {
            dialect: 'mysql',
            host: 'host',
            dialectOptions: {
                useUTC: false,
                multipleStatements: true
            },
            timezone: '+08:00',
            port: 3306,
            pool: {
                max: 150,
                min: 0,
                idle: 150
            }
        };
        // 数据库账号
        this.dbAccount = {
            database: 'database',
            userid: 'userid',
            password: 'password'
        };
    }
}
interface IDBAccount {
    database: string;
    userid: string;
    password: string;
}
export default new Configs();
