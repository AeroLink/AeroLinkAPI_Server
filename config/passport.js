const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Client = require('../model/clients');

module.exports = function(passport){
   
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = 'aerolink' + '|' + new Date().toLocaleDateString()  ;
    
    passport.use(new JwtStrategy(opts, (payload, done) => {

        Client.getClientUsingID(payload._id, (err, user) => {
            if(err){
                return done(err, false);    
            }

            if(user){
                return done(null, user);
            }else{
                return done(null, false);
            }
        });
        
    }));
}