'use strict';

ContactManager.module('Contacts', function (Contacts, App, Backbone) {
	//	Contact model
	Contacts.Contact = Backbone.Model.extend({
		defaults: {
			fname: null,
	        lname: null,
	        email: null,
	        phone: null,
	        created: 0
		},
		initialize: function() {
			if ( this.isNew() ) {
				this.set('created', Date.now());
			}
		}
	});
	//	Contact Collection
	Contacts.ContactList = Backbone.Collection.extend({
		model: Contacts.Contact,
		localStorage: new Backbone.LocalStorage('contacts-backbone-marionette'),
		comparator: 'created',
		nextOrder: function () {
			return this.length ? this.last().get('order') + 1 : 1;
		},
	});
});