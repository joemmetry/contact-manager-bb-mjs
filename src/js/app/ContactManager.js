'use strict';

window.ContactManager = new Backbone.Marionette.Application();

ContactManager.Filters = {
	isEmail: function(email){
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	},
	isPhone: function(phone){
		return /^\d+$/.test(phone) && phone.substring(0,1) == "0" && phone.substring(1,2) == "9";
	},
	capitalize: function(string){
		return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
	},
	disabledBtn: function(obj){
		switch(obj.option){
			case 0:
				$(obj.id).attr('disabled','disabled').addClass('uiButtonDisabled');
            	break;
            case 1:
            	$(obj.id).removeAttr('disabled').removeClass('uiButtonDisabled');
            	break;
		}
	}
};

ContactManager.addRegions({
	former 	: '#contactForm',
	lister 	: '#contactList',
	searcher: '#contactSearcher',
});

ContactManager.on('start', function(){
	Backbone.history.start();
});