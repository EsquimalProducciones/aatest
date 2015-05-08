
AppView = Backbone.View.extend({
	initialize : function(){
		var self =this;
			
			this.ModificarReserva= new ModificarReservaView({
				el : '#modificar-reserva-div',
				model : new BusquedaModel()
			});

			this.ModificarReservaModal= new ModificarReservaView({
				el : '#modal-modificar-reserva',
				model : new BusquedaModel()
			});
			
			this.dropdownFooter = new DropdownInputView({
				el : '.banner-social-buttons .dropdown-menu input,.banner-social-buttons .dropdown-menu label'
			}) 

			this.$('[data-toggle="popover"]').popover({'placement': 'top'});

	},
});

$(document).ready(function (){
	var app = new AppView({
		el : 'body'
	});

});



