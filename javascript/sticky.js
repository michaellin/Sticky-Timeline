// -*- js-indent-level: 2 -*-

// An example Backbone application contributed by [JÃ©rÃ´me
// Gravel-Niquet](http://jgn.me/). Edited for use in our sticky note
// timeline project by Kenneth Lin, Justin Eng, and Michael Lin. Uses
// [LocalStorage adapter](backbone-localstorage.js) to persist Backbone
// models within your browser.

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Sticky Model
  // ----------

  // Our basic **Sticky** model has `content`, `order`, and `done` attributes.
  var Sticky = Backbone.Model.extend({

    // Default attributes for the todo item.
    defaults: function() {
      return {
        content: "empty todo...",
	date: "to be initialized",
        // order: Stickys.nextOrder(),
        done: false
      };
    },

    // Ensure that each todo created has the current time stamped on.
    initialize: function() {
	// don't need to ensure it has a content
      // if (!this.get("content")) {
      //   this.set({"content": this.defaults.content});
      // }
      this.set({"date": new Date()});
    },

    // Toggle the `done` state of this todo item.
    toggle: function() {
      this.save({done: !this.get("done")});
    },

    // Remove this Sticky from *localStorage* and delete its view.
    clear: function() {
      this.destroy();
    }

  });

  // Sticky Collection
  // ---------------

  // The collection of todos is backed by *localStorage* instead of a remote
  // server.
  var TimeLine = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Sticky,

    // Save all of the todo items under the `"todos"` namespace.
    localStorage: new Store("todos-backbone"),

    // Filter down the list of all todo items that are finished.
    done: function() {
      return this.filter(function(todo){ return todo.get('done'); });
    },

    // Filter down the list to only todo items that are still not finished.
    remaining: function() {
      return this.without.apply(this, this.done());
    },

    // We keep the Stickys in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },

    // Stickys are sorted by their original insertion order.
    comparator: function(todo) {
      return todo.get('order');
    }

    // Returns two values representing the max and min dates
    dateRange: function() {
      return {
	maxDate: new Date(Math.max.apply(null, this)),
	minDate: new Date(Math.min.apply(null, this)) 
      }
    }

  });

  // Create our global collection of **Stickys**.
  var Stickys = new TimeLine;

  // Sticky Item View
  // --------------

  // The DOM element for a todo item...
  var StickyView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      "click .toggle"   : "toggleDone",
      "dblclick .view"  : "edit",
      "click a.destroy" : "clear",
      "keypress .edit"  : "updateOnEnter",
      "blur .edit"      : "close"
    },

    // The StickyView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Sticky** and a **StickyView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },

    // Re-render the contents of the todo item.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('done', this.model.get('done'));
      this.input = this.$('.edit');
      return this;
    },

    // Toggle the `"done"` state of the model.
    toggleDone: function() {
      this.model.toggle();
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      this.$el.addClass("editing");
      this.input.focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
      var value = this.input.val();
      if (!value) this.clear();
      this.model.save({content: value});
      this.$el.removeClass("editing");
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.clear();
    }

  });

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todoapp"),

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "keypress #new-todo":  "createOnEnter",
      "click #clear-completed": "clearCompleted",
      "click #toggle-all": "toggleAllComplete"
    },

    // At initialization we bind to the relevant events on the `Stickys`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {

      this.input = this.$("#new-todo");
      this.allCheckbox = this.$("#toggle-all")[0];

      Stickys.bind('add', this.addOne, this);
      Stickys.bind('reset', this.addAll, this);
      Stickys.bind('all', this.render, this);

      this.footer = this.$('footer');
      this.main = $('#main');

      Stickys.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      var done = Stickys.done().length;
      var remaining = Stickys.remaining().length;

      if (Stickys.length) {
        this.main.show();
        this.footer.show();
        this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
      } else {
        this.main.hide();
        this.footer.hide();
      }

      this.allCheckbox.checked = !remaining;
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(todo) {
      var view = new StickyView({model: todo});
      this.$("#todo-list").append(view.render().el);
    },

    // Add all items in the **Stickys** collection at once.
    addAll: function() {
      Stickys.each(this.addOne);
    },

    // If you hit return in the main input field, create new **Sticky** model,
    // persisting it to *localStorage*.
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;

      Stickys.create({content: this.input.val()});
      this.input.val('');
    },

    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
      _.each(Stickys.done(), function(todo){ todo.clear(); });
      return false;
    },

    toggleAllComplete: function () {
      var done = this.allCheckbox.checked;
      Stickys.each(function (todo) { todo.save({'done': done}); });
    }

  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;

});