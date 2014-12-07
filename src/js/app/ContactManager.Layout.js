'use strict';

ContactManager.module('Layout', function (Layout, App, Backbone){
	Layout.Behavior = Backbone.Marionette.Behavior.extend({
		get: function(){
			var fields  = this.options.option;
			fields.$fname = fields.$('[name="fname"]');
			fields.$lname = fields.$('[name="lname"]');
			fields.$email = fields.$('[name="email"]');
			fields.$phone = fields.$('[name="phone"]');
		},
		validate: function(){
			var fields  = this.options.option;
			return fields.$fname.val().length>0 
	            && fields.$lname.val().length>0 
	            && fields.$email.val().length>0
	            && ContactManager.Filters.isEmail(fields.$email.val())
	            && fields.$phone.val().length==11 
	            && ContactManager.Filters.isPhone(fields.$phone.val());
		},
		check: function (elem){
			if(this.validate()){
         		ContactManager.Filters.disabledBtn({id: elem, option: 1});
            	return;
	        }
	        ContactManager.Filters.disabledBtn({id: elem, option: 0});
		}
	});
	Layout.Former = Backbone.Marionette.ItemView.extend({
		template: '#temp-contact-adder',
		ui: {
			addButton : '#addC'
		},
		events: {
			'click @ui.addButton' : 'create',
			"submit" : 'create',
			'keyup' : 'check',
	        'input' : 'check',
	        'propertychange' : 'check',
	        'change' : 'check'
		},
		onRender: function() {
			this.x = new Layout.Behavior({option: this});
			this.x.get();
			this.listenTo(this.collection, 'add', this.resetFields);
		},
		create: function(e){
			e.preventDefault();
			this.collection.create(this.assembleObject());
			ContactManager.Filters.disabledBtn({id:'#addC', option: 0});
			$dropdown();
		},
		check: function(){
			this.x.check('#addC');
		},
		assembleObject: function () {
			return {
				fname: ContactManager.Filters.capitalize(this.$fname.val().trim()),
				lname: ContactManager.Filters.capitalize(this.$lname.val().trim()),
				email: this.$email.val().trim(),
				phone: this.$phone.val().trim(),
				order: this.collection.nextOrder()
			};
		},
		resetFields: function(){
			this.$('input').each(function(){$(this).val('');})
		}
	});
	Layout.Editer = Backbone.Marionette.ItemView.extend({
		template: '#temp-contact-editor',
		ui: {
			updateButton : '#updateC',
			backButton : '.back'
		},
		events: {
			'click @ui.updateButton' : 'update',
			'click @ui.backButton': 'back',
			"submit" : 'create',
			'keyup' : 'check',
	        'input' : 'check',
	        'propertychange' : 'check',
	        'change' : 'check'
		},
		modelEvents: {
			'change': 'render'
		},
		onRender: function() {
			this.x = new Layout.Behavior({option: this});
			this.x.get();
		},
		check: function () {
			this.x.check('#updateC');
		},
		update: function(e){
			e.preventDefault();
			this.model.set({
            	fname: ContactManager.Filters.capitalize(this.$fname.val()),
            	lname: ContactManager.Filters.capitalize(this.$lname.val()),
            	email: this.$email.val(),
            	phone: this.$phone.val()
            });
            this.model.save();
            this.back();
		},
		back: function(){
			new ContactManager.ContactList.Controller().mainApp()
		}
	});
	Layout.Searcher = Backbone.Marionette.ItemView.extend({
		template: '#temp-searcher',
		ui : {
			searchButton : '#searchC'
		},
		events : {
			'click @ui.searchButton' : 'search',
			'submit' : 'search',
			'keyup' : 'check',
			'input' : 'check',
	        'propertychange' : 'check',			
		},
		initialize: function() {
			$('[name="q"]').val(this.options.query);
			$('#searchC').click();
		},
		check: function(e) {
			$( "#contact-list > li").each(function(){
				$(this).show().css('border-bottom', '1px solid #a8a8a8');
			});
			this.search(e);
		},
		search: function(e){
			e.preventDefault();
			var query = $('[name="q"]').val();
			if(!ContactManager.Filters.isPhone(query) &&
				!ContactManager.Filters.isEmail(query)){
				query = ContactManager.Filters.capitalize(query);	
			}
			$( "#contact-list > li").children("div:not(:contains('"+ query + "'))" )
				.each(function(){
					$(this)
						.parent()
						.css('border-bottom', '0')
						.hide();
				});

			if($("#contact-list").children(':not(:hidden)').length != 0){
				$('#contact-list').removeClass('searchNone').find("span").remove()
			}
			if($("#contact-list").children(':not(:hidden)').length == 0){
				$("#contact-list").addClass('searchNone').append('<span>No contacts found.</span>')
			}
			location.hash = '#/query/' + query.toLowerCase();
			return false;
		}
	});
});