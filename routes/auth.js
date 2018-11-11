var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token) {
        jwt.verify(token, 'randomSecret', function(err, decoded) {
            if(err) {
                console.log('Failed to authenticate token');
                next();
            }
            else {
                console.log('Valid token!');
                res.locals.decoded = decoded;
                next();
            }
        });
    }
    else {
        console.log('No token provided');
        next();
    }
};
