'use strict';

ContactManager.module('ContactList.Views', function (Views, App, Backbone, Marionette){
	Views.CitemView = Marionette.ItemView.extend({
		tagName : 'li',
		template: '#temp-contact-list',
		ui: {
			removeLink: '.remU'
		},
		events: {
			'click @ui.removeLink': 'clear',
		},
		initialize: function() {
		},
		modelEvents: {
			'change': 'render'
		},
		clear: function () {
			if(confirm("Remove contact?")===true){
				var or = this.model.get("order");
				if(typeof $('#search-list') !== "undefined"){
					$('#search-list > li > div#' + or).remove();
				}
				this.model.destroy();
			}
		}
	});
	Views.ClistView = Marionette.CompositeView.extend({
		template : '#temp-contact-tables',
		childView : Views.CitemView,
		childViewContainer : '#contact-list',
		collectionEvents: {
			'all': 'addAll'
		},
		initialize: function() {
			this.listenTo(this.collection, "sync destroy", this.nullListHandler);
		},
		nullListHandler: function() {
			if(this.collection.length==0){
				$('#contact-list').addClass('searchNone').html("<span>It's is lonely in here. Please add a contact.</span>")
			}
			else{
				$('#contact-list').removeClass('searchNone').find("span").remove()
			}
		},
		addOne: function () {
			$dropdown();
		},
		addAll: function () {
			this.collection.each(this.addOne, this);
		}
	});
});