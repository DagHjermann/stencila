var test = require('tape');
var stencila = require('..');

test('cila, html', function (assert) {
  var stencil = new stencila.Stencil();
  
  assert.equal(stencil.cila(), "");
  assert.equal(stencil.html(), "");

  stencil.cila("Hello world");
  assert.equal(stencil.cila(), "Hello world");
  assert.equal(stencil.html(), "<p>Hello world</p>");

  assert.end();
});

test('render', function (assert) {
  var stencil = new stencila.Stencil();

  [
    ['exec\n\t_scope_.x=6*7\nThe value of x is {text x}', 
     'exec &gqo304\n\t_scope_.x=6*7\n\nThe value of x is {text x 42}'],

    ['if x==42\n\tYes\nelse\n\tNo', 
     'if x==42\n\tYes\nelse ~off\n\tNo'],

    ['switch x\n\tcase 42\n\tcase 0', 
     'switch x\n\tcase 42\n\tcase 0 ~off'],

    ['for item in ["apple","pear","banana"]\n\tli {text item}', 
     'for item in ["apple","pear","banana"]\n\tli each\n\t\t{text item}\n\tli ^0\n\t\t{span apple}\n\tli ^1\n\t\t{span pear}\n\tli ^2\n\t\t{span banana}'],

  ].forEach(function(item){
    assert.equal(
      stencil.cila(item[0]).render().cila(),
      item[1]
    );
  });

  assert.end();
});
