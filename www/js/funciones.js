var secTipo = 0;
var user_platform ;
var user_data;
var user_hotel;
var defLang;
var enviando = false;
var rateapp_co = 2;
var segudnop = false;
var galeryCont = new Array();
var prodsArr = new Array();
var animandohome = false;
var animandofullsec = false;
var animandofullsecint = false;
var apiURL = 'https://www.smartbellboy.com/guests/api/';
var loginUser = false;
var fileSystemApp;
var sessionId = localStorage.getItem('userlogin');
var dcopy = new Date();
var ncopy = dcopy.getFullYear();
var copyCont = document.getElementById('yearcopy');
copyCont.innerHTML = ncopy;
var optionCalendarHome;
var calendar;
var eventSelected;
var activitySelected;
var thmap;
var brochueretti;
var marker;
var translator;

var en = {
    all_right_reserv:"All Rights Reserved.",
    alarms:"Alarms",
    shop:"Shop",
    messages:"Messages",
    events:"Events",
    activities:"Activities",
    brochures:"Brochures",
    promotions:"Promotions",
    news:"News",
    gallery:"Gallery",
    rate_us:"Rate Us",
    logout:"Logout",
    quick_actions:"Quick Acctions",
    your_calendar:"Your Calendar",
    next_events:"Next Events",
    last_news:"Last News",
    create_new_alarm:"Create new Alarm",
    view_all_alarms:"View all alarms",
    date_y_time:"Date & time",
    alarms_type:"Alarm type",
    priority:"Priority",
    notify_phone:"Notify by Room Phone",
    notify_cellphone:"Notify by CellPhone",
    notify_email:"Notify by Email",
    notify_push:"Notify by Push notification",
    notes:"Notes",
    title:"Title",
    save:"Save",
    create_new_message:"Create new Message",
    view_all_messages:"View all messages",
    subject:"Subject",
    your_message:"Your Message",
    send:"Send",
    hotel_info:"Hotel info",
    phone:"Phone",
    web:"Web",
    email:"Email",
    rate_our_services:"Rate our Services",
    roomservice_shop:"Room Service & Shop",
    breakfast:"Breakfast",
    food_drinks:"Food &amp; Drinks",
    room:"Room",
    services:"Services",
    alert:"Alert",
    username_or_pass_inco:"Username or password incorrect.",
    error_try_again:"Error. Try Again.",
    error:"Error",
    loading:"Loading...",
    there_are_no_news:"There are no news.",
    buy:"Buy",
    there_are_no_tiems_to_buy:"There are no tiems to buy.",
    there_are_no_news:"There are no news.",
    view_more:"View more",
    news_not_found:"News not found.",
    there_are_no_promotions:"There are no promotions.",
    there_are_no_activities:"There are no activities.",
    promotion_not_found:"Promotion not found.",
    requires_reservation:"Requiere reservation",
    view_link:"View link",
    added_to_calendar:"Added to calendar",
    add_to_calendar:"Add to calendar",
    event_not_found:"Event not found.",
    there_are_no_events:"There are no events.",
    event_not_found:"Event not found.",
    date:"Date",
    created_at:"Created at",
    priority:"Priority",
    type:"Type",
    view_details:"View details",
    you_have_no_alarms_saved:"You have no alarms saved.",
    state:"State",
    alarm_not_found:"Alarm not found.",
    read_message:"Read message",
    you_have_no_messages:"You have no messages.",
    message_not_found:"Message not found.",
    reply:"Reply",
    your_message_was_sended:"Your Message was sended.",
    select_a_valid_date:"Select a valid date.",
    your_alarm_was_saved_successfully:"Your alarm was saved successfully.",
    thanks_for_rate_us:"Thanks for rate us!.",
    write_a_message:"Write a message.",
    write_a_subject:"Write a subject.",
    no_brochures_to_download:"There is no Brochures to download.",
    add_new_event_to_calendar:"Add new event to calendar",
    cancel:"Cancel",
    close:"Close",
    event_no_created:"Event not created. Try later.",
	activity_no_created:"Activity not created. Try later.",
	purchase_no_created:"Purchase not registered. Try later.",
    event_added_to_calendar:"The event was added to your calendar.",
    event_added:"Event Added",
    activity_added_to_calendar:"The activity was added to your calendar.",
    activity_require_reservation:"This activity requires a reservation, we contact you when the reservation is effective.",
    purchase_registered:"Purchase registered.",
    title_time_required:"Title and time is required.",
    chose_prefered_date_time:"Choose prefered date & time.",
    add:"Add",
    settings:"Settings",
    lang:"Lang",
    to_calendar:"to calendar",
    notifications:"Notifications",
    my_shops:"My Shops",
    view_all_purchase:"View my purchases",
    rate:"Rate",
    total_spend: "Total purchases",
	text_rate_app: "If you like SmartBellboy, would you mind taking a moment to rate it? It will not take more than a minute. Thanks for your support!",
	rate_app_now: "Rate SmartBellboy",
	rate_app_later: "Remind me later",
	rate_app_no: "No Thanks",
	info_app: "Smartbellboy is a tool developed as part of a large hotel guest management system. <br> Developed by ximiodev, a company dedicated to the development of sowftare, focused on providing the best solution for each client. <br> <br> If you wish, you can contact us at <a href=\"mailto:info@smartbellboy.com/\">info@smartbellboy.com</a> or <a href=\"info@ximiodev.com\" >info@ximiodev.com</a>. <br><br><a href=\"https://www.smartebellboy.com/\" >https://www.smartebellboy.com/<br><a href=\"https://www.ximiodev.com/\">https://www.ximiodev.com/</a><br>"
};
var es = {
    all_right_reserv: "Todos los derechos reservados.",
    alarms: "Alarmas",
    shop: "Comprar",
    messages: "Mensajes",
    events: "Eventos",
    activities: "Actividades",
    brochures: "Folletos",
    promotions: "Promociones",
    news: "Noticias",
    gallery: "Galería",
    rate_us: "Califícanos",
    logout: "Logout",
    quick_actions: "Accesos directos",
    your_calendar: "Su calendario",
    next_events: "Próximos eventos",
    last_news: "Últimas noticias",
    create_new_alarm: "Crear nueva alarma",
    view_all_alarms: "Ver todas las alarmas",
    date_y_time: "Fecha y hora",
    alarms_type: "Tipo de alarma",
    priority: "Prioridad",
    notify_phone: "Notificar por teléfono de la habitación",
    notify_cellphone: "Notificar por CellPhone",
    notify_email: "Notificar por correo electrónico",
    notify_push: "Notificar mediante notificación Push",
    notes: "Notas",
    title: "Título",
    save: "Guardar",
    create_new_message: "Crear nuevo mensaje",
    view_all_messages: "Ver todos los mensajes",
    subject: "Asunto",
    your_message: "Su mensaje",
    send: "enviar",
    hotel_info: "Información del hotel",
    phone: "Teléfono",
    web: "Web",
    email: "Email",
    rate_our_services: "Califica nuestros servicios",
    roomservice_shop: "Room Service & Shop",
    breakfast: "Desayuno",
    food_drinks: "Comida y Bebidas",
    room: "Habitación",
    services: "Servicios",
    alert: "Alerta",
    username_or_pass_inco: "Nombre de usuario o contraseña incorrectos.",
    error_try_again: "Error. Inténtalo de nuevo.",
    error: "Error",
    loading: "Cargando ...",
    there_are_no_news: "No hay noticias",
    buy: "Comprar",
    there_are_no_tiems_to_buy: "No hay tiems para comprar.",
    there_are_no_news: "No hay noticias",
    view_more: "Ver más",
    news_not_found: "Noticias no encontradas.",
    there_are_no_promotions: "No hay promociones",
    there_are_no_activities: "No hay actividades.",
    promotion_not_found: "Promoción no encontrada.",
    requires_reservation: "requiere reserva",
    view_link: "Ver enlace",
    added_to_calendar: "Agregado al calendario",
    add_to_calendar: "Agregar al calendario",
    event_not_found: "Evento no encontrado.",
    there_are_no_events: "No hay eventos",
    event_not_found: "Evento no encontrado.",
    date: "Fecha",
    created_at: "Creado en",
    priority: "Prioridad",
    type: "Tipo",
    view_details: "Ver detalles",
    you_have_no_alarms_saved: "No tienes alarmas guardadas",
    state: "Estado",
    alarm_not_found: "Alarma no encontrada.",
    read_message: "Leer mensaje",
    you_have_no_messages: "No tienes mensajes",
    message_not_found: "Mensaje no encontrado.",
    reply: "Responder",
    your_message_was_sended: "Su mensaje fue enviado",
    select_a_valid_date: "Seleccione una fecha válida.",
    your_alarm_was_saved_successfully: "Su alarma se ha guardado correctamente",
    thanks_for_rate_us: "¡Gracias por calificarnos!",
    write_a_message: "Escribir un mensaje.",
    write_a_subject: "Escribir un tema.",
    no_brochures_to_download: "No hay folletos para descargar.",
    add_new_event_to_calendar: "Agregar nuevo evento al calendario",
    cancel: "Cancelar",
    close: "Cerrar",
    event_no_created: "Evento no creado. Pruébelo más tarde.",
	activity_no_created: "Actividad no creada. Inténtalo más tarde.",
	purchase_no_created: "Compra no registrada. Pruébelo más tarde.",
    event_added_to_calendar: "El evento se agregó a tu calendario",
    event_added: "Evento agregado",
    activity_added_to_calendar: "La actividad se agregó a tu calendario",
    activity_require_reservation: "Esta actividad requiere una reserva, nos contactaremos con usted cuando la reserva entre en vigencia",
    purchase_registered: "Compra registrada.",
    title_time_required: "El título y la hora son obligatorios",
    chose_prefered_date_time: "Elige la fecha y la hora preferidas",
    add: "Agregar",
    settings:"Ajustes",
    lang:"Idioma",
    to_calendar: "al calendario",
    notifications:"Notificaciones",
    view_all_purchase:"Ver mis compras",
    my_shops:"Mis compras",
    rate: "Calificar",
    total_spend: "Total de las compras",
	text_rate_app: "Si te gusta usar SmartBellboy, ¿te importaría tomar un momento para calificarlo? No llevará más de un minuto. ¡Gracias por su apoyo!",
	rate_app_now: "Calificar SmartBellboy",
	rate_app_later: "Recuérdame más tarde",
	rate_app_no: "No, gracias",
	info_app: "Smartbellboy es una herramienta desarrollada como parte de un gran sistema de gestión de huéspedes de hotel. <br>Desarrollada por ximiodev, una empresa dedicada al desarrollo de sowftare, enfocada a brindar la mejor solución para cada cliente.<br><br>Si lo desea puede contactarse con nosotros  a info@smartbellboy.com o en info@ximiodev.com. <br><br><a href=\"https://www.smartebellboy.com/\" >https://www.smartebellboy.com/<br><a href=\"https://www.ximiodev.com/\">https://www.ximiodev.com/</a><br>"
};
var pt = {
	all_right_reserv: "Todos os direitos reservados.",
	alarms: "Alarmes",
	shop: "Comprar",
	messages: "Mensagens",
	events: "Eventos",
	activities: "Atividades",
	brochures: "Brochuras",
	promotions: "Promoções",
	news: "Notícias",
	gallery: "Galeria",
	rate_us: "Avalie-nos",
	logout: "Logout",
	quick_actions: "Atalhos",
	your_calendar: "Seu calendário",
	next_events: "Próximos eventos",
	last_news: "Últimas notícias",
	create_new_alarm: "Criar novo alarme",
	view_all_alarms: "Ver todos os alarmes",
	date_y_time: "Data e hora",
	alarms_type: "tipo de alarme",
	priority: "Prioridade",
	notify_phone: "Notificar por telefone no quarto",
	notify_cellphone: "Notificar por celular",
	notify_email: "Notificar por email",
	notify_push: "Notificar via notificação push",
	notes: "Notas",
	title: "Título",
	save: "Salvar",
	create_new_message: "Criar nova mensagem",
	view_all_messages: "Ver todas as mensagens",
	subject: "Assunto",
	your_message: "Sua mensagem",
	send: "enviar",
	hotel_info: "Informação do hotel",
	phone: "Telefone",
	web: "Web",
	email: "Email",
	rate_our_services: "Classifique nossos serviços",
	roomservice_shop: "Serviço de quartos e loja",
	breakfast: "Café da manhã",
	food_drinks: "Comida e Bebida",
	room: "Quarto",
	services: "Serviços",
	alert: "Alerta",
	username_or_pass_inco: "Nome de usuário ou senha incorretos",
	error_try_again: "Erro, tente novamente.",
	error: "Erro",
	loading: "Carregando ...",
	there_are_no_news: "Nenhuma notícia",
	buy: "Comprar",
	there_are_no_tiems_to_buy: "Não há como comprar",
	there_are_no_news: "Nenhuma notícia",
	view_more: "Veja mais",
	news_not_found: "Notícias não encontradas",
	there_are_no_promotions: "Sem promoções",
	there_are_no_activities: "Não há atividades",
	promotion_not_found: "Promoção não encontrada",
	requires_reservation: "requer reserva",
	view_link: "ver link",
	added_to_calendar: "Adicionado ao calendário",
	add_to_calendar: "Adicionar ao calendário",
	event_not_found: "Evento não encontrado.",
	there_are_no_events: "Sem eventos",
	event_not_found: "Evento não encontrado.",
	date: "Data",
	created_at: "Criado em",
	priority: "Prioridade",
	type: "Tipo",
	view_details: "Ver detalhes",
	you_have_no_alarms_saved: "Você não tem alarmes salvos",
	state: "Estado",
	alarm_not_found: "Alarme não encontrado",
	read_message: "Ler mensagem",
	you_have_no_messages: "Você não tem mensagens",
	message_not_found: "Mensagem não encontrada.",
	reply: "Responder",
	your_message_was_sended: "Sua mensagem foi enviada",
	select_a_valid_date: "Selecione uma data válida",
	your_alarm_was_saved_successfully: "Seu alarme foi salvo corretamente",
	thanks_for_rate_us: "Obrigado pela qualificação!",
	write_a_message: "Escreva uma mensagem",
	write_a_subject: "Escreva um tópico.",
	no_brochures_to_download: "Não há brochuras para download.",
	add_new_event_to_calendar: "Adicionar novo evento ao calendário",
	cancel: "Cancelar",
	close: "Fechar",
	event_no_created: "Evento não criado. Tente mais tarde",
	activity_no_created: "Atividade não criada. Tente novamente mais tarde.",
	purchase_no_created: "Compra não registrada. Tente mais tarde",
	event_added_to_calendar: "O evento foi adicionado ao seu calendário",
	event_added: "Evento adicionado",
	activity_added_to_calendar: "A atividade foi adicionada ao seu calendário",
	activity_require_reservation: "Esta atividade requer uma reserva, entraremos em contato quando a reserva entrar em vigor",
	purchase_registered: "Compra registrada",
	title_time_required: "O título e a hora são obrigatórios",
	chose_prefered_date_time: "Escolha a data e a hora preferidas",
	add: "Adicionar",
	Configurações: "Configurações",
	idioma: "Language",
	to_calendar: "para o calendário",
	notifications: "Notificações",
	view_all_purchase: "Veja minhas compras",
	my_shops: "Minhas compras",
	rate: "Taxa",
	total_spend: "compras totais",
	text_rate_app: "Se você gosta de usar o SmartBellboy, você se importaria em avaliar isso? Não vai demorar mais que um minuto, obrigado pelo seu apoio!",
	rate_app_now: "Classifique o SmartBellboy",
	rate_app_later: "Lembre-me mais tarde",
	rate_app_no: "Não, obrigado",
	info_app: "Smartbellboy é uma ferramenta desenvolvida como parte de um sistema de gerenciamento de maior convidados Hotel & Desenvolvido por ximiodev, uma empresa dedicada ao desenvolvimento de sowftare, focada em fornecer a melhor solução para cada cliente <br> <. br> Por favor, contacte-nos em info@smartbellboy.com ou info@ximiodev.com <br> <a href=\"https://www.smartebellboy.com/\"> https .: //www.smartebellboy.com/ <br> <a href=\"https://www.ximiodev.com/\"> https://www.ximiodev.com/ </a> <br> "
};

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function isValidDate(d) {
  var dateReg = /^\d{4}[./-]\d{2}[./-]\d{2}[./ ]\d{2}[./:]\d{2}$/;
  return d.match(dateReg)
}

function initMap(lat,lng) {
	var puntiohotel = {lat: lat, lng: lng};
	thmap = new google.maps.Map(document.getElementById('map_hotel'), {
		zoom: 14,
		center:puntiohotel,
		zoomControl: false,
		mapTypeControl: false,
		scaleControl: false,
		streetViewControl: false,
		rotateControl: false,
		fullscreenControl: false
	});
	
	var marker = new google.maps.Marker({
		position: puntiohotel,
		map: thmap
	});
	thmap.setCenter(marker.getPosition());
}

var language = {
	getStr: function(str, defaultStr) {
		var lango;
		switch(defLang) {
			case 'es':
				lango = es;
				break;
			case 'pt':
				lango = pt;
				break;
			default:
				lango = en;
		}
        var retStr = lango[str];
        if (retStr != 'undefined'){
            return retStr;
        } else {
            if (defaultStr != 'undefined') {
                return defaultStr;
            } else {
                return str;
            }
        }
    }
};

var app = {
    initialize: function() {
		jQuery('img.svg').each(function(){
            var $img = jQuery(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');

            jQuery.get(imgURL, function(data) {
                var $svg = jQuery(data).find('svg');
                if(typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                if(typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass+' replaced-svg');
                }
                $svg = $svg.removeAttr('xmlns:a');
                $img.replaceWith($svg);
            }, 'xml');

        });
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    removeLogin: function() {
        $('#loginscreen').hide();
        $('#homescreen').removeClass('hidden').show();
    },
    removeSplash: function() {
		$('#splashscreen').animate({
			opacity: "0"},500, 
			function() {
				$('#splashscreen').hide();
		});
    },
    cambiarIdioma: function() {
		var lkey;
		translator = language;
		$('[data-textlang!=""]').each(function( index ) {
			lkey = $(this).data('textlang');
			if(lkey!=undefined) {
				$(this).html(translator.getStr(lkey));
			}
		});
		$("#langsel").val(defLang);
		if( typeof ($.fn.fullCalendar) === 'undefined'){ } else {
			calendar.fullCalendar('option', 'locale', defLang);
		}
    },
    onDeviceReady: function() {
		user_platform = device.platform;
		var applaunchCount = 0;
		if(window.localStorage.getItem('launchCount')!='' && window.localStorage.getItem('launchCount')!=0 && window.localStorage.getItem('launchCount')!=null) {
			applaunchCount = window.localStorage.getItem('launchCount');
			defLang = window.localStorage.getItem('lang');
			app.cambiarIdioma();
		} else{
			if(navigator.globalization!=undefined) {
				navigator.globalization.getPreferredLanguage(
					function (language) {
						defLang = language.value.substring(0, 2);
						defLang = (defLang=='en' || defLang=='es' || defLang=='pt')?defLang:'en';
						window.localStorage.setItem('lang', defLang);
						window.localStorage.setItem('launchCount', 1);
						//~ alert(language.value);
						app.cambiarIdioma();
					},
					function () {
						//alert("nada") 
					}
				);
			} else {
				//~ alert("sin globalization");
			}
		}
		
		
		if(window.localStorage.getItem('rateapp_co')!='' && window.localStorage.getItem('rateapp_co')!=null) {
			rateapp_co = window.localStorage.getItem('rateapp_co');
		}
		
		$('.ncopy').html(ncopy);
		if (sessionId!=null && sessionId!=undefined && sessionId!='null') {
			loginUser = true;
		}
		$('.btnLogin').click(function (e) {
			e.preventDefault();
			$('#loginError').html('');
			if(!enviando) {
				enviando = true;
				var datos = {
					'action':'login',
					'username': $('#username').val(),
					'userpass': $('#userpass').val()
				}
				$.ajax({
					type: 'POST',
					data: datos,
					dataType: 'json',
					url: apiURL,
					success: function (data) {
						enviando = false;
						if(data.res) {
							user_data = data.guest;
							user_hotel = data.hotel;
							func2.configureHotel();
							loginUser = true;
							localStorage.setItem('userlogin', user_data.guestID);
							sessionId = localStorage.getItem('userlogin');
							app.removeLogin();
							app.setupPush();
							app.startApp();
						} else {
							$('#loginError').html('<div class="alert alert-danger" role="alert">'+translator.getStr('username_or_pass_inco')+'</div>');
						}
					},
					error : function(xhr, ajaxOptions, thrownError) {
						enviando = false;
						$('#loginError').html('<div class="alert alert-danger" role="alert">'+translator.getStr('error_try_again')+'</div>');
					}
					
				});
			}
		});
		if(!loginUser) {
			$('#loginscreen').removeClass('hidden').show();
			app.removeSplash();
		} else {
			enviando = true;
			var datos = {
				'action':'verifylogin',
				'sessionId': sessionId
			}
			$.ajax({
				type: 'POST',
				data: datos,
				dataType: 'json',
				url: apiURL,
				success: function (data) {
					enviando = false;
					if(data.res) {
						user_data = data.guest;
						user_hotel = data.hotel;
						func2.configureHotel();
						app.removeLogin();
						app.setupPush();
						app.startApp();
						app.removeSplash();
						$('.ventanashomeCont').css('height',$('.panel_home').height());
					} else {
						app.removeSplash();
						$('#loginscreen').removeClass('hidden').show();
					}
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					app.removeSplash();
					$('#loginscreen').removeClass('hidden').show();
				}
			});
		}
    }
	};
	
var func2 = {
	
    configureHotel: function() {
		if(user_hotel.logo!='') {
			$('#hotellogomenu').html('<img class="imageLogo" src="'+user_hotel.logo+'">');
			$('.bannerHome .logoCentral').remove();
			$('.bannerHome').append('<img class="logoCentral" src="'+user_hotel.logo+'">');
		}
		var date = new Date(),
			d = date.getDate(),
			m = date.getMonth(),
			y = date.getFullYear(),
			started,
			categoryClass;
		
		var extraestilos = '';
		if(user_hotel.banner!='')
			$('.bannerHome').css('background-image','url('+user_hotel.banner+')');
		if(user_hotel.txtcolor!='')
			extraestilos += '.app_back_inv {background-color: '+user_hotel.txtcolor+';}.app_color, a.app_color {color: '+user_hotel.txtcolor+';}';
		if(user_hotel.bkcolor!='')
			extraestilos += '.app_color_inv, a.app_color_inv {color: '+user_hotel.bkcolor+';} .app_back {background-color: '+user_hotel.bkcolor+';}.col-de-3.active {background-color: '+user_hotel.bkcolor+';}.homeaccess {border-bottom: 1px solid '+user_hotel.bkcolor+';}';
		if(extraestilos!='')
			$("<style type='text/css'> "+extraestilos+"</style>").appendTo("head");
		var userevents = new Array();
		if(user_hotel.userevents.length>0) {
			$.each(user_hotel.userevents, function(idx, item) {
				var temparr = {
					'title': item.title,
					'start': new Date(Date.parse(item.date.replace("-","/","g"))),
					'eveid': item.eveid,
					'backgroundColor':'#2260f0',
					'url': "javascript:app.putCaleEvent("+item.eveid+");"
				};
				userevents.push(temparr);
			});
		}
		
		if(user_hotel.useractivities.length>0) {
			$.each(user_hotel.useractivities, function(idx, item) {
				var fechatom = (item.date!='' && item.date!=' ')?item.date.replace("-","/","g"):item.date_a;
				console.log(fechatom);
				var temparr = {
					'title': item.title,
					'start': new Date(Date.parse(fechatom)),
					'actid': item.actid,
					'backgroundColor':'#63c958',
					'url': "javascript:app.putActEvent("+item.actid+");"
				};
				userevents.push(temparr);
			});
		}
		
		if(user_hotel.userprivateevents.length>0) {
			$.each(user_hotel.userprivateevents, function(idx, item) {
				var temparr = {
					'title': item.title,
					'start': new Date(Date.parse(item.date)),
					'prieveid': item.prieveid,
					'backgroundColor':'#FFBC40',
					'url': "javascript:app.putPrivEvent("+item.prieveid+");"
				};
				userevents.push(temparr);
			});
		}
		
		optionCalendarHome = {
			header: {
				left: "prev,next today",
				center: "title",
				right: "month,agendaWeek,agendaDay,listMonth"
			},
			locale: defLang,
			selectable: true,
			events: userevents,
			dayClick: function (date, jsEvent, view) {
				var htmlbody = '<div class="row">'+
				'	<div class="col-md-12">'+
				'		<input class="form-control" type="text" id="eventguest_title" placeholder="'+translator.getStr('title')+' *">'+
				'	</div>'+
				'	<div class="col-md-12">'+
				'		<input class="form-control" type="text" id="eventguest_text" placeholder="'+translator.getStr('notes')+'">'+
				'	</div>'+
				'	<div class="col-md-12">'+
				'		<input class="form-control" type="text" id="eventguest_date" disabled value="'+date.format()+'">'+
				'	</div>'+
				'	<div class="col-md-12">'+
				'		<select class="form-control" id="hourselect"><option value="X">HH</option></select>'+
				'		<select class="form-control" id="minuteselect"><option value="X">MM</option></select>'+
				'		<div class="clear"></div>'+
				'	</div>'+
				'	<div class="col-md-12">'+
				'		<div class="form-group" id="resmeseve">'+
				'		</div>'+
				'	</div>'+
				'</div>';
				app.alerta(htmlbody, translator.getStr('add_new_event_to_calendar'), '<button type="button" class="btn btn-default" data-dismiss="modal">'+translator.getStr('cancel')+'</button><button type="button" class="btn btn-primary app_back app_color btnSaveEventCal">'+translator.getStr('save')+'</button>');
				for(var i=0;i<=23;i++) {
					$('#hourselect').append('<option value="'+app.pad_with_zeroes(i,2)+'">'+app.pad_with_zeroes(i,2)+'</option>');
				}
				for(var i=0;i<=59;i++) {
					$('#minuteselect').append('<option value="'+app.pad_with_zeroes(i,2)+'">'+app.pad_with_zeroes(i,2)+'</option>');
				}
			}
		}	
		
		if(user_hotel.events.length>0) {
			$.each(user_hotel.events, function(idx, item) {
				var itemnew = '<div class="itemHomeBlock">'+
							'		<div class="imgHomeBlock" style="background-image: url('+item.image+');"></div>'+
							'		<div class="contHomeBlock">'+
							'			<h4 class="subtitHomeBlock">'+item.title+'</h4>'+
							'			<div class="textHomeBlock">'+item.date.substring(0,10)+'</div>'+
							'			<button class="btn btn-primary btn-xs btnViewMoreEveHome app_back app_color" data-eveid="'+item.idevent+'">'+translator.getStr('view_more')+'</button>'+
							'		</div>'+
							'	</div>'+
							'';
				$('#homeeventscont .eventsitems').append(itemnew);
				$('.ventanashomeCont').css('height',$('.panel_home').height());
			});
		} else {
			$('#homeeventscont').remove();
		}
		
		if(user_hotel.news.length>0) {
			$.each(user_hotel.news, function(idx, item) {
				var itemnew = '<div class="itemHomeBlock">'+
							'		<div class="imgHomeBlock" style="background-image: url('+item.image+');"></div>'+
							'		<div class="contHomeBlock">'+
							'			<h4 class="subtitHomeBlock">'+item.title+'</h4>'+
							'			<div class="textHomeBlock">'+item.date.substring(0,10)+'</div>'+
							'			<button class="btn btn-primary btn-xs btnViewMoreNewsHome app_back app_color" data-newid="'+item.newsid+'">'+translator.getStr('view_more')+'</button>'+
							'		</div>'+
							'	</div>'+
							'';
				$('#homenewscont .newsitems').append(itemnew);
				$('.ventanashomeCont').css('height',$('.panel_home').height());
			});
		} else {
			$('#homenewscont').remove();
		}
		
		if(user_hotel.ratings.length>0) {
			$.each(user_hotel.ratings, function(idx, item) {
				var numrating = item.rating;
				$('#rate_type_'+item.type+' .rate_stars').html('');
				for(var i=1;i<=5;i++) {
					var ischeck = (i<=numrating)?' checked':'';
					$('#rate_type_'+item.type+' .rate_stars').append('									<span class="fa fa-star'+ischeck+'" data-star="'+i+'" data-type="'+item.type+'" data-rname="'+item.rate_name+'"></span>');
				}
			});
		}
		
		var optionsSel = '';
		if(user_hotel.alarms.priotitys.length>0) {
			optionsSel = '';
			$.each(user_hotel.alarms.priotitys, function(idx, item) {
				optionsSel += '<option value="'+idx+'">'+item+'</option>';
			});
			$('#alarmpriority').html(optionsSel);
		}
		if(user_hotel.alarms.types.length>0) {
			optionsSel = '';
			$.each(user_hotel.alarms.types, function(idx, item) {
				optionsSel += '<option value="'+idx+'">'+item+'</option>';
			});
			$('#alarmtype').html(optionsSel);
		}
		
		$('.ventanashomeCont').css('height',$('.panel_home').height());
			
		$('#hotelname').html(user_hotel.hotelname);
		if(user_hotel.map) {
			var ubicacion = user_hotel.map.split(',')
			initMap(parseFloat(ubicacion[0]),parseFloat(ubicacion[1]));
		}
		
		if(user_hotel.phone) {
			$('.hotel_phone .valinfo').html('<a href="tel:'+user_hotel.phone+'">'+user_hotel.phone+'</a>');
		} else {
			$('.hotel_phone').hide();
		}
		if(user_hotel.web) {
			$('.hotel_web .valinfo').html('<a href="'+user_hotel.web+'">'+user_hotel.web+'</a>');
		} else {
			$('.hotel_web').hide();
		}
		if(user_hotel.email) {
			$('.hotel_email .valinfo').html('<a href="mailto:'+user_hotel.email+'">'+user_hotel.email+'</a>');
		} else {
			$('.hotel_email').hide();
		}
		if(user_hotel.desc) {
			$('.hotel_desc .valinfo').html(user_hotel.desc);
		} else {
			$('.hotel_desc').hide();
		}
		if(user_hotel.unreadmessages>0) {
			$('#messageslinkhome').append('<span class="badge bg-red">'+user_hotel.unreadmessages+'</span>');
		}
    },
    alerta: function(cuerpo,title='Alerta',buttonsfooter=''){
		var acciones = '<button type="button" class="btn btn-default" data-dismiss="modal">'+translator.getStr('close')+'</button>';
		if(buttonsfooter!='') {
			acciones = buttonsfooter;
		}
		$('#alertatitle').html(title);
		$('#alerta .modal-body').html(cuerpo);
		$('#alerta .modal-footer').html(acciones);
		$('#alerta').modal('show');
    },
	putFullSection: function(cualsec) {
		if(cualsec!='Logout') {
			if(!animandofullsec) {
				$('#homescreen').addClass('menuopened');
				$('.btnCerrarM a').click();
				$('#ventana_uno').removeClass('hidden');
				$('.sections_uno').addClass('hidden');
				$('#section_'+cualsec).removeClass('hidden');
				animandofullsec = true;
				$('#ventana_uno').animate({left: '0%'},300, function(e) {
					$('#homescreen').addClass('menuopened');
					animandofullsec = false;
					secTipo = 1;
				});
				app.putContentSection(cualsec);
				$('#homescreen').addClass('menuopened');
			}
		} else {
			app.logOut();
		}
    },
    putFullSectionInt: function(cualsec, itemID) {
		if(!animandofullsec || segudnop) {
			$('#ventana_dos').removeClass('hidden');
			$('.sections_dos').addClass('hidden');
			$('#section_'+cualsec).removeClass('hidden');
			animandofullsecint = true;
			$('#ventana_dos').animate({left: '0%'},300, function(e) {
				$('#ventana_uno').addClass('menuopened');
				animandofullsecint = false;
				secTipo = 2;
			});
			app.putContentSectionInt(cualsec, itemID);
		}
    },
    changeHomeItem: function(cualsec) {
		if(!animandohome) {
			$('.slidewind').each(function(i) {
				var claseiden = $(this).attr('class').replace('slidewind ','');
				
				if(claseiden==cualsec) {
					animandohome = true;
					$('.slidewind').show();
					$('.ventanashome').animate({left: '-'+(i*100)+'%'},300, function(e) {
						animandohome = false;
						$('.ventanashomeCont').css('height',$('.'+cualsec).height());
						$('.slidewind').hide();
						$('.'+cualsec).show();
					});
				}
			});
		}
    },
    putContentSection: function(section) {
					
		$('#homescreen').addClass('menuopened');
		if(section=='Alarms') {
			$('#section_Alarms .itemsIntContent').html(translator.getStr('loading'));
			app.getAlarms();
		}
		if(section=='Messages') {
			$('#section_Messages .itemsIntContent').html(translator.getStr('loading'));
			app.getMessages();
		}
		if(section=='Events') {
			$('#section_Events .itemsIntContent').html(translator.getStr('loading'));
			app.getEvents();
		}
		if(section=='Activities') {
			$('#section_Activities .itemsIntContent').html(translator.getStr('loading'));
			app.getActivities();
		}
		if(section=='Brochures') {
			$('#section_Brochures .itemsIntContent').html(translator.getStr('loading'));
			app.getBrochures();
		}
		if(section=='Promotions') {
			$('#section_Promotions .itemsIntContent').html(translator.getStr('loading'));
			app.getPromotions();
		}
		if(section=='News') {
			$('#section_News .itemsIntContent').html(translator.getStr('loading'));
			app.getNews();
		}
		if(section=='Gallery') {
			$('#section_Gallery .itemsIntContent').html(translator.getStr('loading'));
			app.getGallery();
		}
		if(section=='Shop') {
			$('#section_Shop .itemsIntContent').html(translator.getStr('loading'));
			app.getShop();
		}
		if(section=='Rating') {
			setTimeout(function() {
				$('#homescreen').addClass('menuopened');
			}, 400);
		}
    },
    putContentSectionInt: function(section, itemID) {
		if(section=='Alarm_int') {
			$('#section_Alarm_int .itemsIntContent').html(translator.getStr('loading'));
			app.getAlarm(itemID);
		}
		if(section=='Message_int') {
			$('#section_Message_int .itemsIntContent').html(translator.getStr('loading'));
			app.getMessage(itemID, 0);
		}
		if(section=='Event_int') {
			$('#section_Event_int .itemsIntContent').html(translator.getStr('loading'));
			app.getEvent(itemID);
		}
		if(section=='Activity_int') {
			$('#section_Activity_int .itemsIntContent').html(translator.getStr('loading'));
			app.getActivity(itemID);
		}
		if(section=='Brochure_int') {
			$('#section_Brochure_int .itemsIntContent').html(translator.getStr('loading'));
			app.getBrochure(itemID);
		}
		if(section=='Promotion_int') {
			$('#section_Promotion_int .itemsIntContent').html(translator.getStr('loading'));
			app.getPromotion(itemID);
		}
		if(section=='New_int') {
			$('#section_New_int .itemsIntContent').html(translator.getStr('loading'));
			app.getNew(itemID);
		}
    },
}
