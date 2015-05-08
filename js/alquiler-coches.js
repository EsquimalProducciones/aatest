DestinosView = Backbone.View.extend({
	template : _.template($('#destinosTpl').html(),{}),
    events : {
        'click ul#continentes li' : 'getPaises',
        'click ul#paises li' : 'getCiudades',
        'click ul#ciudades li' : 'setCiudad',
		'click #lugar-dropdown button' : 'buscarDestino'
    },
	initialize : function (){
        this.continente = false;
        this.pais = false;
        this.ciudad = false;
        this.zona = false;
		this.render();
		this.textContent = {};
		this.textContent.continente = this.$('#continente-dropdown button span').get(0).innerHTML;
		this.textContent.pais = this.$('#pais-dropdown button span ').get(0).innerHTML;
		this.textContent.ciudad = this.$('#ciudad-dropdown button span').get(0).innerHTML;
	},
	render : function (){
        this.$('#continentes').empty();
		this.$('#continentes').append(this.template({tipo : 'continente', continente : this.continente, pais : this.pais}));
	},
    getPaises : function (e){
        this.continente = $(e.target).data('type');
		this.setDropdown(e.target,e.target.innerHTML);
	   	this.pais = false;
        this.ciudad = false;
 
	  	this.$('#paises').empty();
		this.setDropdown(this.$('#paises').get(0),this.textContent.pais);
	  	this.$('#ciudades').empty();
		this.setDropdown(this.$('#ciudades').get(0),this.textContent.ciudad);
	
		this.$('#paises').append(this.template({tipo : 'pais', continente : this.continente, pais : this.pais}));
    },
    getCiudades : function (e){
        this.pais = $(e.target).data('type');
		this.setDropdown(e.target,e.target.innerHTML);
        this.ciudad = false;
        this.$('#ciudades').empty();
		this.setDropdown(this.$('#ciudades').get(0),this.textContent.ciudad);
		this.$('#ciudades').append(this.template({tipo : 'ciudad', continente : this.continente, pais : this.pais}));
   	},
    setCiudad : function (e){
        this.ciudad = $(e.target).data('type');
		this.setDropdown(e.target,e.target.innerHTML);
    },
    buscarDestino : function (e){
		e.preventDefault();	   
console.log('buscar-destino')	
		if (this.ciudad){
				document.location = this.urlLang(lang)+'/localizations/' +  this.ciudad;
			}else if(this.pais){
				document.location = this.urlLang(lang)+'/localizations/' +  this.pais;
			}else if(this.continente){
				document.location = this.urlLang(lang)+'/localizations/' +  this.continente;
			}else{
				return false;	
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
		
		this.BuscadorDestinos = new DestinosView({
			el : '.selectordestino' 
		});
	},
});

$(document).ready(function (){
	var app = new AppView({
		el : 'body'
	});

});



