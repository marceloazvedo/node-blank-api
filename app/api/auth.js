let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');

module.exports = function (app) {

    let api = {};
    let UserModel = mongoose.model('User');

    /**
     * @apiDefine none Default token
     * Just use default <code>token</code>.
    */

    /**
     * @api {post} /api/authentication Authentication
     * @apiPermission none
     * @apiGroup Public
     * @apiDescription 
     * 
     * This is a start point for ther restful API. 
     * 
     * To use any application service, a token must be passed in the request header.
     *
     * In case of a public service, the user must use the default <code>token</code>, otherwise he should obtain a token by logging in to the following service, <code>/api/authentication</code>.
     *
     * The default token defined so far is defaulttoken, and the session <code>token</code> obtained upon login expires in 30 minutes since the last time the user used an API service.
     * 
     * Para usar qualquer serviço da aplicação, deve ser passado um token no header da requisição.
     *
     * Em caso de um serviço público, o usuário deverá utilizar o <code>token</code> padrão, do contrário ele deverá obter um token efetuando o login utilizando para o seguinte serviço, <code>/api/authentication</code>.
     *
     * O token padrão definido até o momento é defaulttoken, e o <code>token</code> de sessão obtido ao efetuar o login expira em 30 min desde a ultima vez que o usuário utilizou um serviço da API.
     * 
     * You can use this script in mongod shell to add a user:
     *
     * <pre><code> 
     * var user = { <br>
     *      login: 'user',<br>
     *      name: 'User Name',<br>
     *      password: '12345678',<br>
     *      status: true,<br>
     *      createAt: new Date(),<br>
     *      dateLastAccess: new Date(),<br>
     *      type: 'ADMIN',<br>
     *      token: 't'<br>
     * }
     * </pre></code>
     * 
     * <pre><code> 
     * 
     * db.users.save(user);
     * 
     * </pre></code>
     * 
     * To generate this documentation I used <a href='http://apidocjs.com/'>APIDOC</a>,
     * and these lines code in the project path:
     * <pre><code> 
     * 
     * <b style="color: #65B042;">/node-blank-project$</b> apidoc -i app/ -o public/
     * 
     * </pre></code>
     * 
     * <br>
     * <h3>Codes and messages returned by the API:<h3>
        <table>
            <tr><th>code</th>  <th>message</th></tr>
            <tr><td>000</td>   <td>Success</td></tr>
            <tr><td>001</td>   <td>User not found</td></tr>
            <tr><td>002</td>   <td>Wrong password</td></tr>
            <tr><td>003</td>   <td>Invalid token</td></tr>
            <tr><td>004</td>   <td>User without authorization for this service</td></tr>
            <tr><td>005</td>   <td>Expired token</td></tr>
        </table>
     * <br>
     * @apiParamExample {json} Requisition:
     *  HTTP/1.1 200 OK
     *  {
     *      "login": "user",
     *      "password": "12345678"
     *  }
     * 
     * @apiSuccessExample {json} Response:
     *  HTTP/1.1 200 OK
     *  {
     *      "code": "000",
     *      "message": "Success",
     *      "name": "USER NAME",
     *      "type": "ADMIN",
     *      "token": "HASH TOKEN"
     *  }
    */
    api.authentication = function (req, res) {
        let query = undefined;
        if (req.body.login != undefined && req.body.login) {
            // console.log('Login não vazio: ' + req.body.login);
            query = { login: { $eq: req.body.login } };
        } else {
            res.status(200).json({ code: '003', message: 'Check is not there blank field' });
        }
        UserModel.findOne(query).then(user => {
            if (!user) {
                res.status(200).json({ code: '001', message: 'User not found' });
            } else {
                if (req.body.password != user.password) {
                    res.status(200).json({ code: '002', message: 'Wrong password' });
                }
                let t = jwt.sign(req.body, app.get('secret'), {});
                let expiration = new Date().getTime() + (1 * 30 * 60 * 1000);
                UserModel.update({ _id: user._id }, { $set: { token: t, dateExpiration: expiration, dataUltimoAcesso: new Date() } }, function (err, tank) {
                    if (err) {
                        console.log(err);
                        res.status(500).end();
                    }
                });
                let response = { code: '000', message: 'Success', name: user.name, type: user.type, token: t };
                res.status(200).json(response);
            }
        });
    };

    api.verifyToken = function (req, res, next) {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Expose-Headers", "Authorization");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, X-XSRF-TOKEN, Authorization, Content-Type, Accept");

        if ('OPTIONS' === req.method) {
            res.sendStatus(200);
        } else {

            // Add your public URL services here.
            const urlsDefault = ['/api/authentication'];
            const authorization = req.get('Authorization');

            console.log('\n==========================================');
            console.log('Authorization: ' + authorization);
            console.log('URL: ' + req.originalUrl);
            console.log('METHOD: ' + req.method);

            if (authorization == undefined || authorization == '') {
                console.log('==========================================');
                res.status(401).end();
            } else if (urlsDefault.indexOf(req.originalUrl) >= 0) {
                // Define your default token here
                if (authorization == 'defaulttoken') {
                    console.log('==========================================');
                    next();
                } else {
                    console.log('##################################################');
                    console.log('# Not authorized user try to access #');
                    console.log('##################################################');
                    console.log('==========================================');
                    res.status(401).end();
                }
            } else {
                const adminUrl = '/api/admin';
                const clientUrl = '/api/client';
                const empresaUrl = '/api/empresa';
                const parceiroUrl = '/api/parceiro';
                let type = undefined;
                if (req.originalUrl.indexOf(adminUrl) >= 0) {
                    type = 'ADMIN';
                } else if (req.originalUrl.indexOf(clientUrl) >= 0) {
                    type = 'CLIENT';
                }
                UserModel.findOne({
                    token: authorization
                }).then(user => {
                    if (!user) {
                        console.log('# 003 - Invalid token #');
                        console.log('==========================================');
                        throw { code: '003', message: 'Invalid token' };
                    }
                    if (user.type != type) {
                        console.log('# 004 - User without authorization for this service #');
                        console.log('==========================================');
                        throw { code: '004', message: 'User without authorization for this service' };
                    }
                    if (new Date() > user.dateExpiration) {
                        console.log('# 005 - Expired token #');
                        console.log('==========================================');
                        throw { code: '005', message: 'Expired token' };
                    }
                    let result = { user: user };
                    return result;
                }).then(result => {
                    let user = result.user;
                    let expiration = new Date().getTime() + (1 * 30 * 60 * 1000);
                    return UserModel.findOneAndUpdate({ _id: user._id }, { $set: { dateExpiration: expiration } }).exec()
                        .then(user => {
                            if (!user) {
                                console.log('# 500 - Internal processing error #');
                                console.log('==========================================');
                                console.log(err);
                                res.status(500).end();
                            }
                            result.user = user;
                            return result;
                        });
                }).then(result => {
                    next();
                }).catch(err => {
                    if (err.code) {
                        console.log(JSON.stringify(err));
                        console.log('==========================================');
                        res.status(401).json(err);
                    } else {
                        console.log('# 500 - Internal processing error #');
                        console.log('==========================================');
                        console.log(err);
                        res.status(500).end();
                    }

                });
            }
        }
    };

    return api;
}