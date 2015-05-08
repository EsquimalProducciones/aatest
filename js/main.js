
lang = "es"

Backbone.View.prototype.urlLang = function (lng){
    if (lng == 'es') return '';
    else return '/' + lng;
}

/************************
*Modelo que contiene la informacion de las busquedas del servidor
* ***********************/

BusquedaModel =  Backbone.Model.extend({
	defaults: {
		pais : "",
		ciudad : "",
		'fecha-recogida' : "",
		'fecha-devolucion' : "",
		'hora-recogida' : "",
		'hora-devolucion' : ""
	},
});

/************************
*Vistas 
************************/
BuscadorView = Backbone.View.extend({
	model : BusquedaModel ,	
	events : {
		'click #btn-search' : 'buscar',
		'changeDate .datetime' : 'actualizarFechaHora',
		'changeDate .datetimepicker' : 'setMinutes',
		'show .datetime,.datetimepicker ' : 'show',
		'show .datetime,.datetimepicker' : 'showDatetimepicker',
		'hide .datetime,.datetimepicker' : 'hideDatetimepicker',
		'click .dropdown-menu li' : 'setSelect',
		'change .check' : 'checkCity'
	},
	initialize : function(){
		this.tipo = 'buscar';
		this.$('.datetime').datetimepicker({
			format : 'yyyy-mm-dd',
			language : lang,
			autoclose : true,
			minView : 2,
			pickerPosition : 'modalResponsive',
			fontAwesome : true,
			bootcssVer : 3
		});

		this.$('.datetimepicker').datetimepicker({
			forceParse : false,	
			format : 'hh:mm',
			language : lang,
			minuteStep : 30,
			autoclose : true,
			startView : 1,
			initialDate : new Date(),
			pickerPosition : 'modalResponsive',
			fontAwesome : true,
			bootcssVer : 3
		});
		//Fecha de la hora inicial 
		this.$('#hora-devolucion').datetimepicker('setStartDate',new Date());
		this.$('#hora-recogida').datetimepicker('setStartDate',new Date());
		//Disparamos la funcion que comprueba si el lugar de recogida es unico	
		this.$('#misma').trigger('change');
	},
	actualizarFechaHora : function(e){
		var nuevaFecha = new Date(Date.parse(e.currentTarget.value));
			(e.currentTarget.id.split('-')[1] === 'recogida') ? this.$('#hora-recogida').datetimepicker('setStartDate',nuevaFecha) : this.$('#hora-devolucion').datetimepicker('setStartDate',nuevaFecha);
	},
	buscar : function(e){
		e.preventDefault();	
		var self = this; 
		var data = this.$('#form-buscador').serializeObject();
			this.model.set(data);
			document.location.href = "/disponibilidad";
	},
	checkCity : function(e){
		if(this.$(e.target).is(':checked')){
			this.$('.unique').show();
			this.$('.multiple').hide();
			this.$('.check').prop('checked',true);

		}else{
			this.$('.unique').hide();
			this.$('.multiple').show();
			this.$('.check').prop('checked',false);
		}

	},
	hideDatetimepicker : function(e){
		$('.modal-backdrop.datetimeResponsive').remove();
		$('body').css('position','static');
		var elemento = e.currentTarget;
			if(elemento.classList.contains('datetime')){
				var ascendiente = this.$(elemento).closest('.parent-pair');
				var siguienteElemento = this.$(ascendiente[0]).find('.datetimepicker');
					if(siguienteElemento.length > 0){
							this.$(siguienteElemento).datetimepicker('show');
					}
			}
	},
	setMinutes : function (e){
		var horas =	('0' + e.date.getUTCHours()).slice(-2) + ':' ,
			minutos =('0' + e.date.getUTCMinutes()).slice(-2);
		var nuevaFecha = horas+minutos;
			$(e.currentTarget).val(nuevaFecha);
			$(e.currentTarget).datetimepicker('update');
	},
	setSelect : function(e){
		var texto = this.$(e.target).text();
		this.setDropdown(e.target,texto);
	},
	setDropdown : function(elemento,texto){
		this.$(elemento).parents('.btn-group').find('.dropdown-toggle').html(texto+'<i class="fa fa-chevron-down pull-right"></i>');
	},
	show : function(e){
		var elementoActivo = e.currentTarget.id;
		//Seleccionamos las instancias del plugin datetimepicker y seleccionamos las que no han producido el evento
		var elementosInactivos = this.$('.datetime,.datetimepicker').filter(function(indice,item){
			return(item.id !== elementoActivo);
		});
		//Ocultamos los elementos inactivos	
		for(var cont = 0 ; elementosInactivos[cont]; cont++){
			this.$(elementosInactivos[cont]).datetimepicker('hide');
		}
	},
	showDatetimepicker : function(e){
		var wSize = $(window).width();
			if (wSize <= 768) {
				$('body').append('<div class="modal-backdrop datetimeResponsive fade in"></div>')	
				$('body').css('position','fixed');
			}
	},
});

ScrollView = Backbone.View.extend({
	events : {
				'click .mega-acordeon-heading h4 a' : 'active',
				'click .mega-acordeon-heading ' : 'scroll',
				'click .mega-acordeon-heading .scroll-control' : 'scrollControl'
	},
	initialize : function(){
		var wSize = $(window).width();
		this.scrollTabs = new ScrollTabView({
			el : '.row.megatabs.hidden-xs'
		})

		if (wSize <= 768) {
		
			this.$('.container.container-tabs').hide();
			this.$('.row.tab-content').hide();
			this.$('.row.mega-acordeon').show();
		}
		else{

			this.$('.row.megatabs').show();
			this.$('.row.tab-content').show();
			this.$('.row.mega-acordeon').hide();
		}
	},
	active : function(e){
		var titulos = this.$('.mega-acordeon-heading h4 a');
			for(var cont=0;titulos[cont];cont++){
			  this.$(titulos[cont]).removeClass('active');
			}
				this.$(e.currentTarget).addClass('active');	
	},
	scroll : function(e){
		var self = this;
		var wSize = $(window).width();
        
			if (wSize <= 768) {
	
				this.$('.row.megatabs').hide();
				this.$('.row.tab-content').hide();
				this.$('.row.mega-acordeon').show();

		var titulos = this.$('.mega-acordeon-heading h4 a.active.collapsed');
				//Si el acordeon no esta colapsado se ejecuta inmendiatamente sino esperamos a la transicion
				//transition: height 0.35s ease 0s;
				//tiempo de la transicion de el colapsado del acordeon
				setTimeout(function(){
					var offsetElemento = this.$(e.currentTarget).offset().top ;
								$('html, body').animate({scrollTop:offsetElemento}, 'slow');
							
							}, 360);
			}	
			else{
				this.$('.row.megatabs').show();
				this.$('.row.tab-content').show();
				this.$('.row.mega-acordeon').hide();
		
				$('html, body').animate({scrollTop:(self.offsetMenu - 150 ) }, 'slow');
			}
	},
	scrollControl : function(e){
		var elementoActivo = this.$('.mega-acordeon-heading h4 a.active').get(0);
		var proximoElemento = e.currentTarget.parentElement;
		
		if((_.isUndefined(elementoActivo) === false)  && (elementoActivo.hash === '#mi-reserva-acordeon') && (!elementoActivo.classList.contains('collapsed')) && proximoElemento.hash !== "#mi-reserva-acordeon"  ){
				e.stopPropagation();
				this.$("#mi-reserva-acordeon").removeClass('in');
				this.$(elementoActivo).removeClass('active');
				this.$(proximoElemento).addClass('active');
				this.$(proximoElemento).removeClass('collapsed');
				this.$(proximoElemento.hash).removeAttr('style');
				this.$(proximoElemento.hash).addClass('in');
		
			var offsetElemento = this.$(proximoElemento.parentElement.parentElement).offset().top ;
				window.scroll(0,offsetElemento );
				$('html, body').animate({scrollTop:offsetElemento}, 1);
			}
	},
	wSize : function(){
		var wSize = $(window).width();
			if (wSize <= 768) {
				
				this.$('.row.tab-content').hide();
				this.$('.row.mega-acordeon').show();
			}
			else{
				this.$('.row.tab-content').show();
				this.$('.row.mega-acordeon').hide();
			}
	}
});

ScrollTabView = Backbone.View.extend({
	events	: {
		'click li a' : 'scroll',
	},
	initialize : function(){
		this.offsetMenu = (this.$el.offset().top );
		console.log(this.offsetMenu);
	},
	scroll : function(e){
		var self = this;	
	
		$('html, body').animate({scrollTop:(self.offsetMenu + 30  ) }, 'slow');
	},

})

ModificarReservaView= Backbone.View.extend({
	events : {
		'show .datetime,.datetimepicker ' : 'show',
		'show .datetime,.datetimetpicker' : 'showDatetimepicker',
		'changeDate .datetimepicker' : 'setMinutes',
		'hide .datetime,datetimepicker' : 'hideDatetimepicker'
	},
	initialize : function(){
		this.$('.datetime').datetimepicker({
			format : 'yyyy-mm-dd',
			language : lang,
			autoclose : true,
			minView : 2,
			pickerPosition : 'modalResponsive',
			fontAwesome : true,
			bootcssVer : 3
		});
		
		this.$('.datetimepicker').datetimepicker({
			forceParse : false,
			format : 'hh:mm:ss',
			language : lang,
			minuteStep : 30,
			autoclose : true,
			startView : 1,
			initialDate : new Date(),
			pickerPosition : 'modalResponsive',
			fontAwesome : true,
			bootcssVer : 3
		});
		//Fecha de la hora inicial 
		this.$('.datetimepicker').datetimepicker('setStartDate',new Date());
	},
	setMinutes : function (e){
		var horas =	('0' + e.date.getUTCHours()).slice(-2) + ':' ,
			minutos =('0' + e.date.getUTCMinutes()).slice(-2);
		var nuevaFecha = horas+minutos;
			$(e.currentTarget).val(nuevaFecha);
			$(e.currentTarget).datetimepicker('update');
	},
	show : function(e){
		var elementoActivo = e.currentTarget.id;
		//Seleccionamos las instancias del plugin datetimepicker y seleccionamos las que no han producido el evento
		var elementosInactivos = this.$('.datetime,.datetimepicker').filter(function(indice,item){
			return(item.id !== elementoActivo);
		});
		//Ocultamos los elementos inactivos	
		for(var cont = 0 ; elementosInactivos[cont]; cont++){
			this.$(elementosInactivos[cont]).datetimepicker('hide');
		}
	},
	showDatetimepicker : function(e){
		var wSize = $(window).width();
			if (wSize <= 768) {
				$('body').append('<div class="modal-backdrop datetimeResponsive fade in"></div>')	
				$('body').css('position','fixed');
			}
	},
	hideDatetimepicker : function(e){
		$('.modal-backdrop.datetimeResponsive').remove();
		$('body').css('position','static');
		var elemento = e.currentTarget;
			if(elemento.classList.contains('datetime')){
				var ascendiente = this.$(elemento).closest('.parent-pair');
				var siguienteElemento = this.$(ascendiente[0]).find('.datetimepicker');
					if(siguienteElemento.length > 0){
							this.$(siguienteElemento).datetimepicker('show');
					}
			}

	}
});

DetallesReservaView= Backbone.View.extend({
	events : {
		'show .datetime' : 'show',
		'show .datetime,.datetimetpicker' : 'showDatetimepicker',
		'hide .datetime,datetimepicker' : 'hideDatetimepicker'
	},
	initialize : function(){
		this.$('.datetime').datetimepicker({
			format : 'yyyy-mm-dd',
			language : lang,
			autoclose : true,
			minView : 2,
			pickerPosition : 'modalResponsive',
			fontAwesome : true,
			bootcssVer : 3
		});
	},
	show : function(e){
		var elementoActivo = e.currentTarget.id;
		//Seleccionamos las instancias del plugin datetimepicker y seleccionamos las que no han producido el evento
		var elementosInactivos = this.$('.datetime').filter(function(indice,item){
			return(item.id !== elementoActivo);
		});
		//Ocultamos los elementos inactivos	
		for(var cont = 0 ; elementosInactivos[cont]; cont++){
			this.$(elementosInactivos[cont]).datetimepicker('hide');
		}
	},
	showDatetimepicker : function(e){
		var wSize = $(window).width();
			if (wSize <= 768) {
		$('body').append('<div class="modal-backdrop datetimeResponsive fade in"></div>')	
				$('body').css('position','fixed');
			}
	},
	hideDatetimepicker : function(e){
		$('.modal-backdrop.datetimeResponsive').remove();
		$('body').css('position','static');
		var elemento = e.currentTarget;
			if(elemento.classList.contains('datetime')){
				var ascendiente = this.$(elemento).closest('.parent-pair');
				var siguienteElemento = this.$(ascendiente[0]).find('.datetimepicker');
					if(siguienteElemento.length > 0){
							this.$(siguienteElemento).datetimepicker('show');
					}
			}
	}
});

DropdownInputView= Backbone.View.extend({
	events : {
		'click  ' : 'stopPropagation',
	},
	stopPropagation : function (e){
	 	e.stopPropagation();
	}
});

