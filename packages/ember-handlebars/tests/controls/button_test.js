// ==========================================================================
// Project:   Ember Handlebar Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var button, application;

var get = Ember.get, set = Ember.set;

module("Ember.Button", {
  setup: function() {
    application = Ember.Application.create();
    button = Ember.Button.create();
  },

  teardown: function() {
    button.destroy();
    application.destroy();
  }
});

function synthesizeEvent(type, view) {
  view.$().trigger(type);
}

function append() {
  Ember.run(function() {
    button.appendTo('#qunit-fixture');
  });
}

test("should begin disabled if the disabled attribute is true", function() {
  button.set('disabled', true);
  append();

  ok(button.$().is(":disabled"));
});

test("should become disabled if the disabled attribute is changed", function() {
  append();
  ok(button.$().is(":not(:disabled)"));

  Ember.run(function() { button.set('disabled', true); });
  ok(button.$().is(":disabled"));

  Ember.run(function() { button.set('disabled', false); });
  ok(button.$().is(":not(:disabled)"));
});

test("should trigger an action when clicked", function() {
  var wasClicked = false;

  var actionObject = Ember.Object.create({
    myAction: function() {
      wasClicked = true;
    }
  });

  button.set('target', actionObject);
  button.set('action', 'myAction');

  Ember.run(function() {
    button.appendTo('#qunit-fixture');
  });

  synthesizeEvent('click', button);

  ok(wasClicked);
});

test("should trigger an action on a String target when clicked", function() {
  var wasClicked = false;

  window.MyApp = {
    myActionObject: Ember.Object.create({
      myAction: function() {
        wasClicked = true;
      }
    })
  };

  var button = Ember.Button.create({
    target: 'MyApp.myActionObject',
    action: 'myAction'
  });

  Ember.run(function() {
    button.appendTo('#qunit-fixture');
  });

  synthesizeEvent('click', button);

  ok(wasClicked);

  window.MyApp = undefined;
});

test("should not trigger action if mouse leaves area before mouseup", function() {
  var wasClicked = false;

  var actionObject = Ember.Object.create({
    myAction: function() {
      wasClicked = true;
    }
  });

  button.set('target', actionObject);
  button.set('action', 'myAction');

  Ember.run(function() {
    button.appendTo('#qunit-fixture');
  });

  synthesizeEvent('mousedown', button);
  ok(get(button, 'isActive'), "becomes active when hovered");
  ok(button.$().hasClass('is-active'));
  synthesizeEvent('mouseleave', button);
  ok(!get(button, 'isActive'), "loses active state if mouse exits");
  ok(!button.$().hasClass('is-active'));
  synthesizeEvent('mouseup', button);

  ok(!wasClicked);

  wasClicked = false;

  synthesizeEvent('mousedown', button);
  synthesizeEvent('mouseleave', button);
  synthesizeEvent('mouseenter', button);
  synthesizeEvent('mouseup', button);
  synthesizeEvent('click', button);

  ok(wasClicked);
});

test("should not trigger action if disabled and a non-standard input", function() {
  var wasClicked = false;

  var actionObject = Ember.Object.create({
    myAction: function() {
      wasClicked = true;
    }
  });

  button.set('tagName', 'span');
  button.set('disabled', true);
  button.set('target', actionObject);
  button.set('action', 'myAction');

  Ember.run(function() {
    button.appendTo('#qunit-fixture');
  });

  synthesizeEvent('mousedown', button);
  ok(!get(button, 'isActive'), "button does not become active when pushed");
});

test("should not have a type if tagName is not 'input' or 'button'", function() {
  Ember.run(function() {
    button.set('tagName', 'a');
    button.appendTo('#qunit-fixture');
  });

  equals(button.$().attr('type'), null);
});

test("should by default be of type='button' if tagName is 'input'", function() {
  Ember.run(function() {
    button.set('tagName', 'input');
    button.appendTo('#qunit-fixture');
  });

  equals(button.$().attr('type'), 'button');
});

test("should by default be of type='button' if tagName is 'button'", function() {
  Ember.run(function() {
    button.set('tagName', 'button');
    button.appendTo('#qunit-fixture');
  });

  equals(button.$().attr('type'), 'button');
});

test("should allow setting of type when tagName is not 'input' or 'button'", function() {
  button.set('tagName', 'a');
  button.set('type', 'submit');

  equals(button.get('type'), 'submit');
});

test("should allow setting of type when tagName is 'input'", function() {
  button.set('tagName', 'input');
  button.set('type', 'submit');

  equals(button.get('type'), 'submit');
});

test("should allow setting of type when tagName is 'button'", function() {
  button.set('tagName', 'button');
  button.set('type', 'submit');

  equals(button.get('type'), 'submit');
});

test("should have a configurable type", function() {
  button.set('type', 'submit');

  Ember.run(function() {
    button.appendTo('#qunit-fixture');
  });
  
  equals(button.$().attr('type'), 'submit');
});

test("should set href='#' if tagName is 'a'", function() {
  button.set('tagName', 'a');

  Ember.run(function() {
    button.appendTo('#qunit-fixture');
  });

  equals(button.$().attr('href'), '#');
});

test("should not set href if tagName is not 'a'", function() {
  Ember.run(function() {
    button.appendTo('#qunit-fixture');
  });

  equals(button.$().attr('href'), null);
});

test("should allow the target to be the parentView", function() {
  button.set('target', 'parentView');
  
  equals(get(button, 'parentView'), button.get('targetObject'));
});
