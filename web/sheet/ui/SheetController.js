'use strict';

var _ = require('substance/util/helpers');
var omit = require('lodash/object/omit');
var Controller = require('substance/ui/Controller');
// var Component = require('substance/ui/Component');

// Substance is i18n ready, but by now we did not need it
// Thus, we configure I18n statically as opposed to loading
// language files for the current locale
var I18n = require('substance/ui/i18n');
I18n.instance.load(require('substance/i18n/en'));
I18n.instance.load(require('../../i18n/en'));
// e.g. in german
// I18n.instance.load(require('substance/ui/i18n/de'));
// I18n.instance.load(require('./i18n/de'));

function SheetController(parent, params) {
  Controller.call(this, parent, params);
  this.handleApplicationKeyCombos = this.handleApplicationKeyCombos.bind(this);

  // action handlers
  this.handleActions({
    'switchState': this.switchState,
    'switchContext': this.switchContext
  });
}

SheetController.Prototype = function() {

  this.didMount = function() {
    // if (this.state.nodeId && this.state.contextId === 'toc') {
    //   this.refs.contentPanel.scrollTo(this.state.nodeId);
    // }
  };

  this.didUpdateState = function() {
    // if (this.state.nodeId && this.state.contextId === 'toc') {
    //   this.refs.contentPanel.scrollTo(this.state.nodeId);
    // }
  };

  // Extract props needed for panel parametrization
  this._panelPropsFromState = function() {
    var props = omit(this.state, 'contextId');
    props.doc = this.getDocument();
    return props;
  };

  // Some things should go into controller
  this.getChildContext = function() {
    var childContext = Controller.prototype.getChildContext.call(this);
    return _.extend(childContext, {
      i18n: I18n.instance
    });
  };

  this.getInitialState = function() {
    return {'contextId': 'main'};
  };

  // Action handlers
  // ---------------

  // handles 'switchState'
  this.switchState = function(newState, options) {
    options = options || {};
    this.setState(newState);
  };

  // handles 'switchContext' and 'switchTab'
  this.switchContext = function(tabId, options) {
    options = options || {};
    this.setState({ contextId: tabId });
  };


};

Controller.extend(SheetController);

module.exports = SheetController;