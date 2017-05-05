var express = require('express');
var router = express.Router();
var request = require('request');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var fs = require('fs');
var crypto = require('crypto');
var Promise = require('bluebird');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Fan\'s Apps' });
});

router.get('/codeforcesqp', function(req, res, next) {
  res.render('codeforcesqp');
});


router.get('/ide', function(req, res, next) {
  res.render('ide');
});

router.post('/ide', function(req, res, next) {
  var source = req.body.code;
  var input = req.body.input;
  var compiler = req.body.compiler;
  var filename = crypto.randomBytes(32).toString('hex');
  var inputfilename = crypto.randomBytes(32).toString('hex') + '.txt';
  var executablename = crypto.randomBytes(32).toString('hex');

  if (compiler == 'gcc') {
    filename += '.c';
  } else if (compiler == 'g++') {
    filename += '.cc';
  } else {
    filename += '.py';
  }

  var touch = exec('touch ' + filename);
  var touch = exec('touch ' + inputfilename);

  fs.writeFileSync(filename, source);
  fs.writeFileSync(inputfilename, input);

  var removeAll = function() {
    var rm = exec('rm ' + filename);
    var rm2 = exec('rm ' + inputfilename);
    var rm3 = exec('rm ' + executablename);
  };

  if (compiler === 'python3') {
    var python3 = exec('python3 ' +  filename + ' < ' + inputfilename);
    var output = ""

    python3.stdout.on('data', function(out) {
      output += String(out);
    });

    python3.stderr.on('data', function(out) {
      output += String(out);
    });

    python3.on('close', function(out) {
      removeAll();
      res.send(output);
    });

  } else if (compiler == 'python') {
    var python = exec('python ' +  filename + ' < ' + inputfilename);
    var output = ""

    python.stdout.on('data', function(out) {
      output += String(out);
    });

    python.stderr.on('data', function(out) {
      output += String(out);
    });

    python.on('close', function(out) {
      removeAll();
      res.send(output);
    });
  } else if (compiler === 'gcc') {
    var gcc = spawn('gcc', [filename, '-o', executablename]);
    var output = "";
    gcc.stdout.on('data', function(data) {
      output += String(data);
    });

    gcc.stderr.on('data', function(data) {
      output += String(data);
    });

    gcc.on('close', function(data) {
      if (data === 0) {
        var run = exec('./' + executablename + ' < ' + inputfilename);
        run.stdout.on('data', function(out) {
          output += String(out);
        });

        run.stderr.on('data', function(out) {
          output += String(out);
        });

        run.on('close', function(out) {
          removeAll();
          res.send(output);
        });
      } else {
        removeAll();
        res.send(output);
      }
    });
  } else if (compiler === 'g++') {
    var gpp = spawn('g++', [filename, '-o', executablename]);
    var output = "";
    gpp.stdout.on('data', function(data) {
      output += String(data);
    });

    gpp.stderr.on('data', function(data) {
      output += String(data);
    });

    gpp.on('close', function(data) {
      if (data === 0) {
        var run = exec('./' + executablename + ' < ' + inputfilename);
        run.stdout.on('data', function(out) {
          output += String(out);
        });

        run.stderr.on('data', function(out) {
          output += String(out);
        });

        run.on('close', function(out) {
          removeAll();
          res.send(output);
        });
      } else {
        removeAll();
        res.send(output);
      }
    });
  } else {
  }

});

module.exports = router;
