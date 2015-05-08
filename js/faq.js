AppView = Backbone.View.extend({
	initialize : function(){
		var self =this;
			this.scrollTabs = new ScrollView({
				el : '.container-tabs',
			});
			$(window).on( 'resize' ,function(){
				 self.scrollTabs.wSize();
			});
			this.dropdownFooter = new DropdownInputView({
				el : '.banner-social-buttons .dropdown-menu input,.banner-social-buttons .dropdown-menu label'
			}) 
	},
});

$(document).ready(function (){
	var app = new AppView({
		el : 'body'
	});

});



