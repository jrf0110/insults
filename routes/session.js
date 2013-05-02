module.exports.get = function(req, res){
  if (!req.session || !req.session.user) return res.status(204).end();

  return res.json(req.session.user);
};

module.exports.remove = function(req, res){
  delete req.session.user;
  res.status(204).end();
};