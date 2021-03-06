const sha512 = require('js-sha512')
const LocalStrategy = require('passport-local');

module.exports = function(userModel) {
  return new LocalStrategy((email,pass,done) => {
    userModel.findOne({'emailAddress' : email},(err,user) => {
      console.dir(user)
      if (err) throw(err); 
      if (!user) return done('wrong',false);
      if (user.password !== sha512(pass)) return done('wrong',null);
      
      user.status.lastSeen = Date.now(); 
      user.active = true;

      user.save((error) => {
        console.log(error);
        if (error) return done('server_error', false);
        done(null,user);
      });
    });
  });
}
