import * as debug from 'debug';
import * as sequelize from 'sequelize';

const debugging = debug('gameapi:sql');

const configs: any = {
    isDebug: (con) => {
        debugging(con);
    },
    dataBase: {
        account: {
            database: 'database',
            userid: 'userid',
            password: 'password'
        },
        option: {
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
        }
    },
    wechat: {
        appid: '',
        secretKey: ''
    },
    qq: {
        appid: '',
        secretKey: ''
    }
};

export default configs;
