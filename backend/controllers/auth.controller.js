// Auth Controller — implement login/register logic here

const register = async (req, res) => {
  // TODO: validate input, create user, return JWT
  res.status(501).json({ message: 'register — not yet implemented' });
};

const login = async (req, res) => {
  // TODO: find user by email, compare password, return JWT
  res.status(501).json({ message: 'login — not yet implemented' });
};

const getMe = async (req, res) => {
  // TODO: return req.user profile
  res.status(501).json({ message: 'getMe — not yet implemented' });
};

module.exports = { register, login, getMe };
