var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var app = express();

app.set('name', 'Ease');
app.set('jwtTokenSecret', 'sj39f7dhkwl0d83hslsod827dhsids9');
app.set('port', process.env.PORT || 3000);

app.use('/', express.static(__dirname + '/www'));
app.use(bodyParser.json());
/////////////////////////////////////////// DATABASE CONNECTION POOL /////////////////////////////////////

var mysql = require('mysql');
var connection = mysql.createConnection({
    multipleStatements: true
});
var connectionpool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1991',
    database: 'ease'
});

/////////////////////////////////////////// MIDDLEWARE//////////////////////////////////////////

// middleware
var jwtauth = function (req, res, next) {
        var parsed_url = url.parse(req.url, true)
        var token = (req.body && req.body.access_token) || parsed_url.query.access_token || req.headers["x-access-token"];
        if (token) {
            try {
                var decoded = jwt.decode(token, app.get('jwtTokenSecret'))
                if (decoded.exp <= Date.now()) {
                    res.end('Access token has expired', 400)
                }
                // 'SELECT * FROM members WHERE idmembers = ' + decoded.iss
                var query = connection.query('SELECT * from members WHERE idmembers = ??', [decoded.iss], function (err, user) {
                    console.log(rows[0]);
                    if (!err) {
                        req.user = rows[0]
                        return next()
                    }
                })
            } catch (err) {
                return next()
            }
        } else {
            return next()
        }
    }
    // It's one thing to authenticate, and it's another to require autentication
var requireAuth = function (req, res, next) {
    if (!req.user) {
        res.json(401)
    } else {
        return next()
    }
}


/////////////////////////////////////////// DISPLAY ALL MEMBERS IN DATEBASE /////////////////////////////////////////
/*
app.get('/members', function (req, res) {
            var rows = '';
            var query = connection.query('SELECT * FROM members', function(err, rows, result) {           
                for(var i = 0; i < rows.length; i++)
                    console.log('The solution is: ', rows[i].idmembers);
                res.json(rows)
});

// show sql data grabbed from date base
            console.log(query.sql);
});
app.get('/members/id', function (req, res) {
     connectionpool.getConnection(function (err, connection) {
        if (err) {
            console.error('CONNECTION error: ', err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            var rows = "";
            var query = connection.query('SELECT * FROM members', function(err, rows, result) {           
                for(var i = 0; i < rows.length; i++)
                    console.log('The solution is: ', rows[i].idmembers);
                res.json(rows)
});

// show sql data grabbed from date base
            console.log(query.sql);
            connection.release();
        }
    });
});

/////////////////////////////////////////// DISPLAY ALL CLIENTS IN DATABASE /////////////////////////////////////////


app.get('/clients', function (req, res) {
     connectionpool.getConnection(function (err, connection) {
        if (err) {
            console.error('CONNECTION error: ', err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            var rows = '';
            var query = connection.query('SELECT * FROM clients', function(err, rows, result) {
               
                for(var i = 0; i < rows.length; i++)
                console.log('The solution is: ', rows[i].idclients);
                res.json(rows)
});

// show sql data grabed from data base
            console.log(query.sql);
            connection.release();
        }
    });
});

/////////////////////////////////////////// DISPLAY ALL ARCHIVES IN DATABASE /////////////////////////////////////////


app.get('/archive', function (req, res) {
     connectionpool.getConnection(function (err, connection) {
        if (err) {
            console.error('CONNECTION error: ', err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            var rows = '';
            var query = connection.query('SELECT * FROM archive', function(err, rows, result) {
               
                for(var i = 0; i < rows.length; i++)
                console.log('The solution is: ', rows[i].idclients);
                res.json(rows)
});

// show sql data grabed from data base
            console.log(query.sql);
            connection.release();
        }
    });
});*/

/////////////////////////////////////////// USER LOGIN ////////////////////////////////////

app.post('/authenticate', function (req, res) {
    connectionpool.getConnection(function (err, connection) {
        if (err) {
            console.error('CONNECTION error: ', err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err: err.code
            });
        } else {
            connection.query('SELECT * from user WHERE username = ? AND password = ?', [(req.body.username), (req.body.password)], function (err, user) {
                console.log(user)
                if (typeof user == 'undefined' || user.length == 0) {
                    res.status(401).json({
                        message: 'Incorrect Username/Password'
                    });
                } else {
                    res.status(200).json({
                        message: 'Logged In',
                        user: user
                    });
                }
            });
        }
        console.log(req.body.username)
        console.log(req.body.password)
    });
});




/////////////////////////////////////////// CREATE USER STUFFS ////////////////////////////////////

app.post('/addUser', function (req, res, next) {
connectionpool.getConnection(function (err, connection) {
    if (err) {
        console.error('CONNECTION error: ', err);
        res.statusCode = 503;
        res.send({
            result: 'error',
            err: err.code
        });
    } else {
        var member = req.body;
        connection.query('INSERT INTO user SET ?', member, function (err, result) {
            // error saving user in db
            if (err)
                res.status(401).json(err);
            else
                res.status(201).json({
                    message: 'Account Created'
                });
        });
    }
});
});


/////////////////////////////////////////// CREATE SERVER STUFFS /////////////////////////////////////

http
    .createServer(app)
    .listen(
        app.get('port'),
        "127.0.0.1"
    );
console.log("Ease Up on PORT 3000");