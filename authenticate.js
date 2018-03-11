const bcrypt = require('bcrypt');
const users = require('./db/queries');

const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const queries = require('./db/queries');

const {
  JWT_SECRET: jwtSecret,
  TOKEN_LIFETIME: tokenLifetime = 50,
} = process.env;

if (!jwtSecret) {
  console.error('JWT_SECRET not registered in .env');
  process.exit(1);
}

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

async function strat(data, next) {
  const user = await queries.findById(data.id);

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
}

passport.use(new Strategy(jwtOptions, strat));

async function giveToken(req, res) {
  const payload = { id: req.id };
  const tokenOptions = { expiresIn: tokenLifetime };
  const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
  return res.json({ token });
}

async function comparePasswords(hash, password) {
  const result = await bcrypt.compare(hash, password);

  return result;
}

async function login(req, res) {
  const { username, password } = req.body;
  const user = await users.findByUsername(username);

  if (!user) {
    return res.status(401).json({ error: 'No such user' });
  }

  const passwordIsCorrect = await comparePasswords(password, user.password);

  if (passwordIsCorrect) {
    giveToken(req, res); // fall sem mun skila token
  }

  return res.status(401).json({ error: 'Invalid password' });
}

function requireAuthentication(req, res, next) {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        const error = info.name === 'TokenExpiredError' ? 'expired token' : 'invalid token';
        return res.status(401).json({ error });
      }

      req.user = user;
      return next();
    },
  )(req, res, next);
}

module.exports = {
  comparePasswords,
  passport,
  login,
  requireAuthentication,
};
