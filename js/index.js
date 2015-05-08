
AppView = Backbone.View.extend({
	initialize : function(){
		var self =this;
			this.BuscadorFrontal= new BuscadorView({
				el : '#buscador-frontal',
				model : new BusquedaModel()
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



