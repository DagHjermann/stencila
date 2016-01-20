'use strict';

var Component = require('substance/ui/Component');
var $$ = Component.$$;

function TextComponent() {
  TextComponent.super.apply(this, arguments);
}

TextComponent.Prototype = function() {

  this.render = function() {
    var el = $$('div').addClass('sc-text');
    el.text(this.props.node.value);
    return el;
  };
};

Component.extend(TextComponent);

module.exports = TextComponent;
