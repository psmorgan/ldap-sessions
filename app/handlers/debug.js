exports = module.exports = function () {

  function index (req, res) {

    res.json('test!');

  };

  return index;

}

exports['@require'] = [];
