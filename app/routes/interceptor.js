module.exports = function (app) {
    let api = app.api.auth;

    app.use('/*', api.verifyToken);

    app.post('/api/authentication', api.authentication);

}