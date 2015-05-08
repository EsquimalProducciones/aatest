RutasView = Backbone.View.extend({
	template : _.template($('#rutasTpl').html(),{}),
    events : {
        'click ul#islas li' : 'getRutas',
        'click ul#rutas li' : 'setRutas'
    },
	initialize : function (){
        this.isla = false;
        this.ruta = false;
		this.render();
		this.textContent = {};
		this.textContent.isla = this.$('#isla-dropdown button span').get(0).innerHTML;
		this.textContent.ruta = this.$('#ruta-dropdown button span ').get(0).innerHTML;

		console.log(this.textContent)

	},
	render : function (){
        this.$('#islas').empty();
		this.$('#islas').append(this.template({tipo : 'isla', 'isla' : this.isla, 'ruta' : this.ruta}));
	},
    getRutas : function (e){
        this.isla = $(e.target).data('type');
		this.setDropdown(e.target,e.target.innerHTML);
	   	this.ruta = false;
	  	this.$('#rutas').empty();
		this.setDropdown(this.$('#rutas').get(0),this.textContent.ruta);
		this.$('#rutas').append(this.template({tipo : 'ruta', 'isla' : this.isla, 'ruta' : this.ruta}));
   	},
    setRutas : function (e){
        this.ruta= $(e.target).data('type');
		this.setDropdown(e.target,e.target.innerHTML);
		this.buscarRuta();
    },
 	buscarRuta : function (){
        if (this.ruta){
            document.location = this.urlLang(lang)+'/ruta/' +  this.ruta;
        }
    },
	setDropdown : function(elemento,texto){
		this.$(elemento).parents('.btn-group').find('.dropdown-toggle').html(texto+'<i class="fa fa-chevron-down pull-right"></i>');
	}

});

AppView = Backbone.View.extend({
	initialize : function(){
		this.BuscadorFrontal= new BuscadorView({
			el : '#buscador-frontal',
			model : new BusquedaModel()
		});
		this.dropdownFooter = new DropdownInputView({
			el : '.banner-social-buttons .dropdown-menu input,.banner-social-buttons .dropdown-menu label'
		});
		this.BuscadorRutas = new RutasView({
			el : '.selectordestino' 
		});
	},
});

$(document).ready(function (){
	var app = new AppView({
		el : 'body'
	});

});



