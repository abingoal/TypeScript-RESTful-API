import db from '../database/db';

/**
 * 用户信息类
 */
class Users {
    /**
     * 根据ID获取用户信息
     * @param userid 用户id
     */
    public async userInfo(userid: number) {
        return await db.execProc('call p_API_UserInfo(:userid)', { userid });
    }
}
export default new Users();
