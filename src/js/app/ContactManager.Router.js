'use strict';

ContactManager.module('ContactList', function (ContactList, App, Backbone, Marionette){
	//ContactList Router
	ContactList.Router = Marionette.AppRouter.extend({
		appRoutes: {
			'edit/:order': 'showEditer',
			'query/:query' : 'showResulter',
			'*path' : 'mainApp'
		}
	});
	//ContactList Controller
	ContactList.Controller = Marionette.Controller.extend({
		initialize: function() {
			this.contactList = new App.Contacts.ContactList();
		},
		start: function() {
			this.showFormer(this.contactList);
			this.showSearcher(this.contactList);
			this.showContactList(this.contactList);
			this.contactList.fetch();
		},
		showFormer: function (contactList) {
			var former = new App.Layout.Former({
				collection: contactList
			});
			App.former.show(former);
		},
		showSearcher: function (contactList) {
			var searcher = new App.Layout.Searcher({
				collection: contactList
			});
			App.searcher.show(searcher);
		},
		showResulter: function (query) {
			new ContactManager.Layout.Searcher({query: query});
		},
		showContactList: function (contactList) {
			App.lister.show(new ContactList.Views.ClistView({
				collection: contactList
			}));
		},
		showEditer: function(orderNo){
			var contact = this.contactList.findWhere({order: +orderNo});
			var editer = new App.Layout.Editer({
				model: contact
			});
			App.former.show(editer);
		},
		mainApp: function(){
			location.hash = "#/";
			this.showFormer(this.contactList);
		}
	});
	//Initializer
	ContactList.addInitializer(function() {
		var controller = new ContactList.Controller();
		controller.router = new ContactList.Router({
			controller: controller
		});

		controller.start();
	});
});