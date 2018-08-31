var secTipo = 0;
var user_platform ;
var user_data;
var user_hotel;
var defLang;
var enviando = false;
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

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
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
		translator = new Language();
		$('[data-textlang!=""]').each(function( index ) {
			lkey = $(this).data('textlang');
			if(lkey!=undefined) {
				$(this).html(translator.getStr(lkey));
			}
		});
    },
    onDeviceReady: function() {
		user_platform = device.platform;
		window.localStorage.setItem('launchCount', null);
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
						alert(language.value);
						app.cambiarIdioma();
					},
					function () {alert("nada")}
				);
			}
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
							app.configureHotel();
							loginUser = true;
							localStorage.setItem('userlogin', user_data.guestID);
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
						app.configureHotel();
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
				console.log("poasd");
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
    getGallery: function() {
		var desdedonde = $('#section_Gallery .itemsIntContent');
		var pswpElement = document.querySelectorAll('.pswp')[0];
		var itemU;
		var items = [];
		
		if(!enviando) {
			enviando = true;
			var datos = {
				'action':'getGallery',
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
						desdedonde.html('');
						if(data.data.length>0) {
							$.each(data.data, function(idx, item) {
								galeryCont.push(item);
								var itemnew = ''+
								'<div class="itemGalGen" data-itemgal="'+idx+'">'+
								'	<div style="background-image: url('+item.image+');" class="imgPromoSm"></div></div>'+
								'</div>';
								desdedonde.append(itemnew);
							});
							desdedonde.append(app.ponerGaleria());
						}
					} else {
						desdedonde.html('<div class="alert alert-info"><b>'+translator.getStr('there_are_no_news')+'</b></div>');
					}
					
					$('#homescreen').addClass('menuopened');
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					desdedonde.html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
				}
			});
		} 
    },
    iniciarGaleria: function(cual) {
		var pswpElement = document.querySelectorAll('.pswp')[0];
		var itemU;
		var items = [];
		for(var x= 0; x<galeryCont.length;x++) {
			itemU = {
				src: galeryCont[x].image,
				w: galeryCont[x].image_w,
				h: galeryCont[x].image_h
			};
			items.push(itemU);
		}
		var options = {
			index: cual 
		};
		var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
		gallery.init();
	},
    ponerGaleria: function() {
		var gallery = ''+
			'	<div class="contGaleria" id="imgGaleria">'+
			'	</div>'+
			'	<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">'+
			'		<div class="pswp__bg"></div>'+
			'		<div class="pswp__scroll-wrap">'+
			'			<div class="pswp__container">'+
			'				<div class="pswp__item"></div>'+
			'				<div class="pswp__item"></div>'+
			'				<div class="pswp__item"></div>'+
			'			</div>'+
			'			<div class="pswp__ui pswp__ui--hidden">'+
			'				<div class="pswp__top-bar">'+
			'					<div class="pswp__counter"></div>'+
			'					<button class="pswp__button pswp__button--close" title="Close (Esc)"></button>'+
			'					<button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>'+
			'					<button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>'+
			'					<div class="pswp__preloader">'+
			'						<div class="pswp__preloader__icn">'+
			'						  <div class="pswp__preloader__cut">'+
			'							<div class="pswp__preloader__donut"></div>'+
			'						  </div>'+
			'						</div>'+
			'					</div>'+
			'				</div>'+
			'				<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div></div>'+
			'				<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>'+
			'				<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>'+
			'				<div class="pswp__caption">'+
			'					<div class="pswp__caption__center"></div>'+
			'				</div>'+
			'			</div>'+
			'		</div>'+
			'	</div>';
		return gallery;
	},
    getShop: function() {
		var desdedonde = $('#section_Shop .itemsIntContent');
		if(!enviando) {
			enviando = true;
			var datos = {
				'action':'getProds',
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
						desdedonde.html('');
						if(data.data.length>0) {
							prodsArr = data.data;
							$.each(data.data, function(idx, item) {
								var itemnew = '<div class="itemHomeBlock">'+
											'		<div class="imgHomeBlock" style="background-image: url('+item.image+');"></div>'+
											'		<div class="contHomeBlock">'+
											'			<h4 class="titHomeBlock">'+item.title+'</h4>'+
											'			<div class="textHomeBlock">'+item.text+'</div>'+
											'			<div class="textHomeBlock"><b>$ '+item.price+'</b></div>'+
											'			<button class="btn btn-primary btn-xs btnShopThis app_back app_color" data-idprod="'+item.idprod+'">'+translator.getStr('buy')+'</button>'+
											'		</div>'+
											'	</div>'+
											'';
								desdedonde.append(itemnew);
							});
						}
					} else {
						desdedonde.html('<div class="alert alert-info"><b>'+translator.getStr('there_are_no_tiems_to_buy')+'</b></div>');
					}
					
					$('#homescreen').addClass('menuopened');
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					desdedonde.html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
				}
			});
		} 
    },
    getNews: function() {
		var desdedonde = $('#section_News .itemsIntContent');
		if(!enviando) {
			enviando = true;
			var datos = {
				'action':'getNews',
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
						desdedonde.html('');
						if(data.data.length>0) {
							$.each(data.data, function(idx, item) {
								var itemnew = '<div class="itemHomeBlock">'+
											'		<div class="imgHomeBlock" style="background-image: url('+item.image+');"></div>'+
											'		<div class="contHomeBlock">'+
											'			<h4 class="subtitHomeBlock">'+item.title+'</h4>'+
											'			<div class="textHomeBlock">'+item.date.substring(0,10)+'</div>'+
											'			<button class="btn btn-primary btn-xs btnViewMoreNews app_back app_color" data-newid="'+item.idnew+'">'+translator.getStr('view_more')+'</button>'+
											'		</div>'+
											'	</div>'+
											'';
								desdedonde.append(itemnew);
							});
						}
					} else {
						desdedonde.html('<div class="alert alert-info"><b>'+translator.getStr('there_are_no_news')+'</b></div>');
					}
					
					$('#homescreen').addClass('menuopened');
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					desdedonde.html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
				}
			});
		} 
    },
    getNew: function(newid) {
		var desdedonde = $('#section_New_int .itemsIntContent');
		if(!enviando || segudnop) {
			enviando = true;
			enviando = false;
			var datos = {
				'action':'getNew',
				'sessionId': sessionId,
				'newid': newid
			}
			$.ajax({
				type: 'POST',
				data: datos,
				dataType: 'json',
				url: apiURL,
				success: function (data) {
					enviando = false;
					if(data.res) {
						desdedonde.html('');
						var item = data.data;
						var imgeve = (item.image!="")?'	<div class="event_pic"><img src="'+item.image+'" class="event_img"></div>':'';
						var table='<div class="event_cont">'+
						'	<div class="event_title">'+item.title+'</div>'+
						'	<div class="event_date">'+item.date.substring(0,10)+'</div>'+
						''+imgeve+
						'	<div class="event_desc">'+item.desc+'</div>'+
						'</div>';
						$('#section_New_int .titleElement').html(item.title);
						desdedonde.append(table);
					} else {
						desdedonde.html('<div class="alert alert-info"><b>'+translator.getStr('news_not_found')+'</b></div>');
					}
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					desdedonde.html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
				}
			});
		} 
    },
    getPromotions: function() {
		var desdedonde = $('#section_Promotions .itemsIntContent');
		if(!enviando) {
			enviando = true;
			var datos = {
				'action':'getPromotions',
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
						desdedonde.html('');
						if(data.data.length>0) {
							$.each(data.data, function(idx, item) {
								var itemnew = '<div class="itemHomeBlock">'+
											'		<div class="imgHomeBlock" style="background-image: url('+item.image+');"></div>'+
											'		<div class="contHomeBlock">'+
											'			<h4 class="subtitHomeBlock">'+item.title+'</h4>'+
											'			<button class="btn btn-primary btn-xs btnViewMorePromo app_back app_color" data-promid="'+item.idpromo+'">'+translator.getStr('view_more')+'</button>'+
											'		</div>'+
											'	</div>'+
											'';
								desdedonde.append(itemnew);
							});
						}
					} else {
						desdedonde.html('<div class="alert alert-info"><b>'+translator.getStr('there_are_no_promotions')+'</b></div>');
					}
					
					$('#homescreen').addClass('menuopened');
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					desdedonde.html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
				}
			});
		} 
    },
    getPromotion: function(promid) {
		var desdedonde = $('#section_Promotion_int .itemsIntContent');
		if(!enviando || segudnop) {
			enviando = true;
			enviando = false;
			var datos = {
				'action':'getPromotion',
				'sessionId': sessionId,
				'promid': promid
			}
			$.ajax({
				type: 'POST',
				data: datos,
				dataType: 'json',
				url: apiURL,
				success: function (data) {
					enviando = false;
					if(data.res) {
						desdedonde.html('');
						var item = data.data;
						var imgeve = (item.image!="")?'	<div class="event_pic"><img src="'+item.image+'" class="event_img"></div>':'';
						var table='<div class="event_cont">'+
						'	<div class="event_title">'+item.title+'</div>'+
						''+imgeve+
						'	<div class="event_desc">'+item.desc+'</div>'+
						'</div>';
						$('#section_Promotion_int .titleElement').html(item.title);
						desdedonde.append(table);
					} else {
						desdedonde.html('<div class="alert alert-info"><b>'+translator.getStr('promotion_not_found')+'</b></div>');
					}
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					desdedonde.html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
				}
			});
		} 
    },
    getActivities: function() {
		var desdedonde = $('#section_Activities .itemsIntContent');
		if(!enviando) {
			enviando = true;
			var datos = {
				'action':'getActivities',
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
						desdedonde.html('');
						if(data.data.length>0) {
							$.each(data.data, function(idx, item) {
								var reservation = (item.reservation=="1")?translator.getStr('requiere_reservation'):'';
								var itemnew = '<div class="itemHomeBlock">'+
											'		<div class="imgHomeBlock" style="background-image: url('+item.image+');"></div>'+
											'		<div class="contHomeBlock">'+
											'			<h4 class="subtitHomeBlock">'+item.title+'</h4>'+
											'			<div class="textHomeBlock">'+reservation+'</div>'+
											'			<button class="btn btn-primary btn-xs btnViewMoreActivity app_back app_color" data-actid="'+item.idact+'">'+translator.getStr('view_more')+'</button>'+
											'		</div>'+
											'	</div>'+
											'';
								desdedonde.append(itemnew);
							});
						}
					} else {
						desdedonde.html('<div class="alert alert-info"><b>'+translator.getStr('there_are_no_activities')+'</b></div>');
					}
					
					$('#homescreen').addClass('menuopened');
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					desdedonde.html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
				}
			});
		} 
    },
    getActivity: function(actid) {
		var desdedonde = $('#section_Activity_int .itemsIntContent');
		if(!enviando || segudnop) {
			enviando = true;
			enviando = false;
			var datos = {
				'action':'getActivity',
				'sessionId': sessionId,
				'actid': actid
			}
			$.ajax({
				type: 'POST',
				data: datos,
				dataType: 'json',
				url: apiURL,
				success: function (data) {
					enviando = false;
					if(data.res) {
						desdedonde.html('');
						var item = data.data;
						activitySelected = item;
						var reservation = (item.reservation=="1")?translator.getStr('requiere_reservation'):'';
						var imgeve = (item.image!="")?'	<div class="event_pic"><img src="'+item.image+'" class="event_img"></div>':'';
						var link = (item.link!="")?'	<a href="'+item.link+'" class="linkinfo app_color_inv" target="_blank">'+translator.getStr('view_link')+'</a>':'';
						var actdate = (item.date!=' ')?item.date:item.date_a;
						var added = (item.added=="1")?'	<div class="actionbock"><div class="btn btn-primary app_back app_color" >'+translator.getStr('added_to_calendar')+' ('+actdate+')</div></div>':'	<div class="actionbock"><button class="btn btn-primary btnAddAct app_back app_color" data-actid="'+item.idact+'">'+translator.getStr('add_to_calendar')+'</button></div>';
						var table='<div class="event_cont">'+
						'	<div class="event_title">'+item.title+'</div>'+
						'	<div class="event_date">'+reservation+'</div>'+
						''+imgeve+
						'	<div class="event_desc">'+item.desc+'</div>'+
						''+link+
						added+
						'</div>';
						$('#section_Activity_int .titleElement').html(item.title);
						desdedonde.append(table);
					} else {
						desdedonde.html('<div class="alert alert-info"><b>'+translator.getStr('event_not_found')+'</b></div>');
					}
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					desdedonde.html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
				}
			});
		} 
    },
    getEvents: function() {
		var desdedonde = $('#section_Events .itemsIntContent');
		if(!enviando) {
			enviando = true;
			var datos = {
				'action':'getEvents',
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
						desdedonde.html('');
						if(data.data.length>0) {
							$.each(data.data, function(idx, item) {
								var itemnew = '<div class="itemHomeBlock">'+
											'		<div class="imgHomeBlock" style="background-image: url('+item.image+');"></div>'+
											'		<div class="contHomeBlock">'+
											'			<h4 class="subtitHomeBlock">'+item.title+'</h4>'+
											'			<div class="textHomeBlock">'+item.date.substring(0,10)+'</div>'+
											'			<button class="btn btn-primary btn-xs btnViewMoreEvent app_back app_color" data-eveid="'+item.idevent+'">'+translator.getStr('view_more')+'</button>'+
											'		</div>'+
											'	</div>'+
											'';
								desdedonde.append(itemnew);
							});
						}
					} else {
						desdedonde.html('<div class="alert alert-info"><b>'+translator.getStr('there_are_no_events')+'</b></div>');
					}
					
					$('#homescreen').addClass('menuopened');
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					desdedonde.html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
				}
			});
		} 
    },
    getEvent: function(eveid) {
		var desdedonde = $('#section_Event_int .itemsIntContent');
		if(!enviando || segudnop) {
			enviando = true;
			enviando = false;
			var datos = {
				'action':'getEvent',
				'sessionId': sessionId,
				'eveid': eveid
			}
			$.ajax({
				type: 'POST',
				data: datos,
				dataType: 'json',
				url: apiURL,
				success: function (data) {
					enviando = false;
					if(data.res) {
						desdedonde.html('');
						var item = data.data;
						eventSelected = data.data;
						var imgeve = (item.image!="")?'	<div class="event_pic"><img src="'+item.image+'" class="event_img"></div>':'';
						var added = (item.added=="1")?'	<div class="actionbock"><div class="btn btn-primary app_back app_color" >'+translator.getStr('added_to_calendar')+'</div></div>':'	<div class="actionbock"><button class="btn btn-primary btnAddEvent app_back app_color" data-eveid="'+item.idevent+'">'+translator.getStr('add_to_calendar')+'</button></div>';
						var table='<div class="event_cont">'+
						'	<div class="event_title">'+item.title+'</div>'+
						'	<div class="event_date">'+item.date+'</div>'+
						''+imgeve+
						'	<div class="event_desc">'+item.desc+'</div>'+
						added+
						'</div>';
						$('#section_Event_int .titleElement').html(item.title);
						desdedonde.append(table);
					} else {
						desdedonde.html('<div class="alert alert-info"><b>'+translator.getStr('event_not_found')+'</b></div>');
					}
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					desdedonde.html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
				}
			});
		} 
    },
    getAlarms: function() {
		var desdedonde = $('#section_Alarms .itemsIntContent');
		if(!enviando) {
			enviando = true;
			var datos = {
				'action':'getAlarms',
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
						desdedonde.html('');
						if(data.data.length>0) {
							$.each(data.data, function(idx, item) {
								var table='<table class="table tablabloque">';
								var labelPrio = (item.priority_i==2)?'danger':((item.priority_i==1)?'warning':'info');
								var labelState = (item.state_i==2)?'success':((item.state_i==1)?'warning':'info');
								table+= '<tr>'+
								'	<td><b>'+translator.getStr('date')+':</b> '+item.date+'</td>'+
								'	<td><b>'+translator.getStr('created_at')+':</b> '+item.created_at+'</td>'+
								'</tr><tr>'+
								'	<td><b>'+translator.getStr('priority')+': </b> <span class="label label-'+labelPrio+'">'+item.priority+'</span></td>'+
								'	<td><b>'+translator.getStr('type')+': </b> '+item.type+'</td>'+
								'</tr><tr>'+
								'	<td><b>State: </b> <span class="label label-'+labelState+'">'+item.state+'</span></td>'+
								'	<td><button data-alarm="'+item.alid+'" class="btn btn-primary btn-xs btnViewAlarm app_back app_color"><i class="fa fa-eye"></i> '+translator.getStr('view_details')+'</button></td>'+
								'</tr>';
								table+='</table>';
								desdedonde.append(table);
							});
						}
					} else {
						desdedonde.html('<div class="alert alert-info"><b>'+translator.getStr('you_have_no_alarms_saved')+'</b></div>');
					}
					
					$('#homescreen').addClass('menuopened');
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					desdedonde.html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
				}
			});
		} 
    },
    getAlarm: function(alid) {
		var desdedonde = $('#section_Alarm_int .itemsIntContent');
		if(!enviando) {
			enviando = true;
			var datos = {
				'action':'getAlarm',
				'sessionId': sessionId,
				'alid': alid
			}
			$.ajax({
				type: 'POST',
				data: datos,
				dataType: 'json',
				url: apiURL,
				success: function (data) {
					enviando = false;
					if(data.res) {
						desdedonde.html('');
						var item = data.data;
						var table='<table class="table tablabloque">';
						var labelPrio = (item.priority_i==2)?'danger':((item.priority_i==1)?'warning':'info');
						var labelState = (item.state_i==2)?'success':((item.state_i==1)?'warning':'info');
						table+= '<tr>'+
						'	<td><b>'+translator.getStr('date')+':</b> '+item.date+'</td>'+
						'</tr><tr>'+
						'	<td><b>'+translator.getStr('created_at')+':</b> '+item.created_at+'</td>'+
						'</tr><tr>'+
						'	<td><b>'+translator.getStr('priority')+': </b> <span class="label label-'+labelPrio+'">'+item.priority+'</span></td>'+
						'</tr><tr>'+
						'	<td><b>'+translator.getStr('type')+': </b> '+item.type+'</td>'+
						'</tr><tr>'+
						'	<td><b>'+translator.getStr('state')+': </b> <span class="label label-'+labelState+'">'+item.state+'</span></td>'+
						'</tr><tr>'+
						'	<td>'+item.notes+'</td>'+
						'</tr><tr>'+
						'	<td><b>'+translator.getStr('notify_phone')+':</b> '+((item.notify_phone)?'Yes':'No')+'</td>'+
						'</tr><tr>'+
						'	<td><b>'+translator.getStr('notify_cellphone')+':</b> '+((item.notify_cell)?'Yes':'No')+'</td>'+
						'</tr><tr>'+
						'	<td><b>'+translator.getStr('notify_email')+':</b> '+((item.notify_email)?'Yes':'No')+'</td>'+
						'</tr><tr>'+
						'	<td><b>'+translator.getStr('notify_push')+':</b> '+((item.notify_push)?'Yes':'No')+'</td>'+
						'</tr>';
						table+='</table>';
						$('#section_Alarm_int .titleElement').html(''+item.type);
						desdedonde.append(table);
					} else {
						desdedonde.html('<div class="alert alert-info"><b>'+translator.getStr('alarm_not_found')+'</b></div>');
					}
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					desdedonde.html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
				}
			});
		} 
    },
    getMessages: function() {
		var desdedonde = $('#section_Messages .itemsIntContent');
		if(!enviando) {
			enviando = true;
			var datos = {
				'action':'getMessages',
				'type':'0',
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
						desdedonde.html('');
						var msgscont = '';
						if(data.data.length>0) {
							$.each(data.data, function(idx, msgitem) {
								
								var state = (msgitem.state==0)?'<i class="fa fa-circle"></i>':'';
								msgscont +=	''+
											'			<a href="#" class="btnViewMessage" id="msgid_'+msgitem.msgid+'" data-msgid="'+msgitem.msgid+'" data-type="'+msgitem.type+'">'+
											'				<div class="mail_list">'+
											'					<div class="left">'+
											'						'+state+
											'					</div>'+
											'					<div class="right">'+
											'						<h3>'+msgitem.from+'<small>'+msgitem.date+'</small></h3>'+
											'						<p>'+msgitem.subject+'</p>'+
											'						<p><button data-alarm="'+msgitem.msgid+'" class="btn btn-primary btn-xs app_back app_color"><i class="fa fa-eye"></i> '+translator.getStr('read_message')+'</button></p>'+
											'					</div>'+
											'				</div>'+
											'			</a>';
							});
							desdedonde.append(msgscont);
							$('#homescreen').addClass('menuopened');
						}
					} else {
						desdedonde.html('<div class="alert alert-info"><b>'+translator.getStr('you_have_no_messages')+'</b></div>');
					}
					
					$('#homescreen').addClass('menuopened');
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					desdedonde.html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
				}
			});
		} 
    },
    getMessage: function(msgid, type) {
		var desdedonde = $('#section_Message_int .itemsIntContent');
		
		if(!enviando) {
			enviando = true;
			var datos = {
				'action':'getMessage',
				'sessionId': sessionId,
				'msgid': msgid,
				'typemsg': type
			}
			$.ajax({
				type: 'POST',
				data: datos,
				dataType: 'json',
				url: apiURL,
				success: function (data) {
					enviando = false;
					if(data.res) {
						if(data.unreadmessages>0) {
							$('#messageslinkhome').append('<span class="badge bg-red">'+data.unreadmessages+'</span>');
						}
						app.putMessage(data.data);
					} else {
						desdedonde.html('<div class="alert alert-info"><b>'+translator.getStr('message_not_found')+'</b></div>');
					}
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					desdedonde.html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
				}
				
			});
		} 
	},
	putMessage: function(messagge) {
		actualmessage = messagge;
		var btnreply = '';
		if(messagge.type==1) {
			$('#msgid_'+messagge.msgid+' i.fa-circle').remove();
		}
		var cantunread = $('.btnViewMessage i.fa-circle').size();
		var bubmsg = '';
		if(cantunread>0) {
			bubmsg = '<span class="badge bg-red">'+cantunread+'</span>';
		}
		$('#messageslinkhome').append(bubmsg);
		var msgscont = '		<div class="mail_Content">'+
						'			<div class="mail_heading row">'+
						'				<div class="col-md-4 text-right">'+
						'					<p class="date">'+messagge.date+'</p>'+
						'				</div>'+
						'				<div class="col-md-12">'+
						'					<h4>'+messagge.subject+'</h4>'+
						'				</div>'+
						'			</div>'+
						'			<div class="sender-info">'+
						'				<div class="row">'+
						'					<div class="col-md-12">'+
						'						<strong>'+messagge.from+'</strong>'+
						'						<span>('+messagge.from_e+')</span> to'+
						'						<strong>'+messagge.to+'</strong>'+
						'					</div>'+
						'				</div>'+
						'			</div>'+
						'			<div class="view-mail">'+
						'				<p>'+messagge.body+'</p>'+
						'			</div>'+
						'		</div>'+
						'		<div class="reply_sec">'+
						'			<form id="formmessageRepl">'+
						'				<h4 class="reply_tit app_back app_color">'+translator.getStr('reply')+'</h4>'+
						'				<div class="form-group">'+
						'					<label for="newmessagerepl">'+translator.getStr('your_message')+'</label>'+
						'					<textarea class="form-control" id="newmessagerepl" name="newmessagerepl" ></textarea>'+
						'				</div>'+
						'				<div class="form-group" id="resmesmrepl">'+
						'				</div>'+
						'				<div class="form-group">'+
						'					<input type="hidden" name="replymsgid" id="replymsgid" value="'+messagge.msgid+'">'+
						'					<button type="button" class="btn btn-primary app_back app_color btnSendMessageRepl">'+translator.getStr('send')+'</button>'+
						'				</div>'+
						'			</form>'+
						'		</div>'+
						'	';
		$('#section_Message_int .itemsIntContent').html(msgscont);
		$('#section_Message_int .titleElement').html(messagge.subject);
	},
    saveAlarm: function() {
		var error = false;
		var errorMsg = '';
		if($('#datealarm').val()=='') {
			error = true;
			errorMsg += ' '+translator.getStr('select_a_valid_date');
		}
		
		if(!error && !enviando) {
			enviando = true;
			var datos = {
				'action':'saveAlarm',
				'sessionId': sessionId,
				'datealarm': $('#datealarm').val(),
				'notesalarm': $('#notesalarm').val(),
				'alarmtype': $('#alarmtype').val(),
				'alarmpriority': $('#alarmpriority').val(),
				'notify_phone': $('#notify_phone').is(':checked'),
				'notify_cell': $('#notify_cell').is(':checked'),
				'notify_email': $('#notify_email').is(':checked'),
				'notify_push': $('#notify_push').is(':checked')
			}
			$.ajax({
				type: 'POST',
				data: datos,
				dataType: 'json',
				url: apiURL,
				success: function (data) {
					enviando = false;
					if(data.res) {
						$('#newalarm')[0].reset();
						$('#resmes').html('<div class="alert alert-success"><b>'+translator.getStr('your_alarm_was_saved_successfully')+'</b></div>');
						setTimeout(function() {
							$('#resmes').html('');
						}, 2000);
					} else {
						$('#resmes').html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
						setTimeout(function() {
							$('#resmes').html('');
						}, 2000);
					}
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					$('#resmes').html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
					setTimeout(function() {
						$('#resmes').html('');
					}, 2000);
				}
			});
		} else {
			$('#resmes').html('<div class="alert alert-danger"><b>'+errorMsg+'</b></div>');
			setTimeout(function() {
				$('#resmes').html('');
			}, 2000);
		}
    },
    rankearApp: function(type, value, rname) {
		var error = false;
		var errorMsg = '';
		if(!error && !enviando) {
			enviando = true;
			var datos = {
				'action':'rankApp',
				'sessionId': sessionId,
				'textdata': $('#rate_hotel_text').val(),
				'type': type,
				'value': value
			}
			$.ajax({
				type: 'POST',
				data: datos,
				dataType: 'json',
				url: apiURL,
				success: function (data) {
					if(data.res) {
						$('#resmeseve2').html('<div class="alert alert-success"><b>'+translator.getStr('thanks_for_rate_us')+'</b></div>');
						
						$('#rate_type_'+type+' .rate_stars').html('');
						for(var i=1;i<=5;i++) {
							var ischeck = (i<=value)?' checked':'';
							$('#rate_type_'+type+' .rate_stars').append('									<span class="fa fa-star'+ischeck+'" data-star="'+i+'" data-type="'+type+'" data-rname="'+rname+'"></span>');
						}
						setTimeout(function() {
							$('#resmeseve2').html('');
							$('#alerta').modal('hide');
							enviando = false;
						}, 2000);
					} else {
						enviando = false;
						$('#resmeseve2').html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
						setTimeout(function() {
							$('#resmeseve2').html('');
						}, 2000);
					}
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					$('#resmeseve2').html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
					setTimeout(function() {
						$('#resmeseve2').html('');
					}, 2000);
				}
			});
		} else {
		}
    },
    sendMessage: function() {
		var error = false;
		var errorMsg = '';
		if($('#newmessage').val()=='') {
			error = true;
			errorMsg += translator.getStr('write_a_message');
		}
		if($('#messagesubject').val()=='') {
			error = true;
			errorMsg += translator.getStr('write_a_subject');
		}
		
		if(!error) {
			enviando = true;
			var datos = {
				'action':'sendGuestMessage',
				'sessionId': sessionId,
				'newmessage': $('#newmessage').val(),
				'messagesubject': $('#messagesubject').val()
			}
			$.ajax({
				type: 'POST',
				data: datos,
				dataType: 'json',
				url: apiURL,
				success: function (data) {
					enviando = false;
					if(data.res) {
						$('#formmessage')[0].reset();
						$('#resmesm').html('<div class="alert alert-success"><b>'+translator.getStr('your_message_was_sended')+'</b></div>');
						setTimeout(function() {
							$('#resmesm').html('');
						}, 2000);
					} else {
						$('#resmesm').html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
						setTimeout(function() {
							$('#resmesm').html('');
						}, 2000);
					}
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					$('#resmes').html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
					setTimeout(function() {
						$('#resmes').html('');
					}, 2000);
				}
			});
		} else {
			$('#resmes').html('<div class="alert alert-danger"><b>'+errorMsg+'</b></div>');
			setTimeout(function() {
				$('#resmes').html('');
			}, 2000);
		}
    },
    sendReplyMessage: function() {
		var error = false;
		var errorMsg = '';
		if($('#newmessagerepl').val()=='') {
			error = true;
			errorMsg += translator.getStr('write_a_message');
		}
		
		if(!error) {
			enviando = true;
			var datos = {
				'action':'replyGuestMessage',
				'sessionId': sessionId,
				'newmessage': $('#newmessagerepl').val(),
				'replymsgid': $('#replymsgid').val()
			}
			$.ajax({
				type: 'POST',
				data: datos,
				dataType: 'json',
				url: apiURL,
				success: function (data) {
					enviando = false;
					if(data.res) {
						$('#formmessageRepl')[0].reset();
						$('#resmesmrepl').html('<div class="alert alert-success"><b>'+translator.getStr('your_message_was_sended')+'</b></div>');
						setTimeout(function() {
							$('#resmesmrepl').html('');
						}, 2000);
					} else {
						$('#resmesmrepl').html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
						setTimeout(function() {
							$('#resmesmrepl').html('');
						}, 2000);
					}
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					$('#resmesmrepl').html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
					setTimeout(function() {
						$('#resmesmrepl').html('');
					}, 2000);
				}
			});
		} else {
			$('#resmesmrepl').html('<div class="alert alert-danger"><b>'+errorMsg+'</b></div>');
			setTimeout(function() {
				$('#resmesmrepl').html('');
			}, 2000);
		}
    },
    getBrochures: function() {
		var desdedonde = $('#section_Brochures .itemsIntContent');
		if(!enviando) {
			enviando = true;
			var datos = {
				'action':'getBrochures',
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
						desdedonde.html('');
						if(data.data.length>0) {
							$.each(data.data, function(idx, item) {
								var table='<a href="'+item.file+'" download="'+item.file+'" target="_blank" class="lnkDirectoDow">'+item.title+'</a>';
								desdedonde.append(table);
							});
						}
					} else {
						desdedonde.html('<div class="alert alert-info"><b>'+translator.getStr('no_brochures_to_download')+'</b></div>');
					}
					
					$('#homescreen').addClass('menuopened');
				},
				error : function(xhr, ajaxOptions, thrownError) {
					enviando = false;
					desdedonde.html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
				}
			});
		} 
    },
    getBrochure: function(url) {
		var desdedonde = $('#section_Brochure_int .itemsIntContent');
		desdedonde.html('<iframe class="ifrmaacomp" src="'+url+'"></iframe>');
		$('#section_Brochure_int .titleElement').html(brochueretti);
    },
    putCaleEvent: function(eveid) {
		app.putFullSection('Events');
		segudnop = true;
		$('#section_Event_int .itemsIntContent').html('');
		$('#section_Event_int .titleElement').html('');
		app.putFullSectionInt('Event_int', eveid);
	},
    putActEvent: function(actid) {
		app.putFullSection('Activities');
		segudnop = true;
		$('#section_Activity_int .itemsIntContent').html('');
		$('#section_Activity_int .titleElement').html('');
		app.putFullSectionInt('Activity_int', actid);
	},
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
    putPrivEvent: function(prieveid){
		var itemPV;
		$.each(user_hotel.userprivateevents, function(idx, item) {
			if(item.prieveid==prieveid) {
				itemPV = item;
			}
		})
		user_hotel.userprivateevents
		var htmlbody = '<div class="row">'+
		'	<div class="col-md-12">'+itemPV.title+'</div>'+
		'	<div class="col-md-12">'+itemPV.date+'</div>'+
		'	<div class="col-md-12">'+itemPV.text+'</div>'+
		'</div>';
		app.alerta(htmlbody, itemPV.title, '<button type="button" class="btn btn-default" data-dismiss="modal">'+translator.getStr('close')+'</button>');
    },
    addGuestEvent: function(data){
		if (data.title) {
			var error = false;
			var errorMsg = '';
			if(data.date=='') {
				error = true;
				errorMsg += ' '+translator.getStr('select_a_valid_date');
			}
			
			if(!error && !enviando) {
				enviando = true;
				var datos = {
					'action':'saveGuestEvent',
					'sessionId': sessionId,
					'title': data.title,
					'text': data.text,
					'date': data.date
				}
				$.ajax({
					type: 'POST',
					data: datos,
					dataType: 'json',
					url: apiURL,
					success: function (dataRes) {
						enviando = false;
						if(dataRes.res) {
							$('#alerta').modal('hide');
							data.prieveid = dataRes.prieveid;
							calendar.fullCalendar('renderEvent',
								{
									title: data.title,
									prieveid: data.prieveid,
									start: new Date(Date.parse(data.date)),
									'backgroundColor':'#FFBC40',
									'url': "javascript:app.putPrivEvent("+data.prieveid+");"
								},
								true // make the event "stick"
							);
							user_hotel.userprivateevents.push(data);
						} else {
							$('#resmeseve').html('<div class="alert alert-danger"><b>'+translator.getStr('event_no_created')+'</b></div>');
							setTimeout(function() {
								$('#resmeseve').html('');
							}, 2000);
						}
					},
					error : function(xhr, ajaxOptions, thrownError) {
						enviando = false;
						$('#resmeseve').html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'</b></div>');
						setTimeout(function() {
							$('#resmeseve').html('');
						}, 2000);
					}
				});
			} else {
				$('#resmeseve').html('<div class="alert alert-danger"><b>'+errorMsg+'</b></div>');
				setTimeout(function() {
					$('#resmeseve').html('');
				}, 2000);
			}
		}		
		calendar.fullCalendar('unselect');
	},
    addEvent: function(data){
		if (eventSelected.idevent=data) {
			var error = false;
			var errorMsg = '';
			
			if(!error && !enviando) {
				enviando = true;
				var datos = {
					'action':'saveEvent',
					'sessionId': sessionId,
					'idevent': eventSelected.idevent
				}
				$.ajax({
					type: 'POST',
					data: datos,
					dataType: 'json',
					url: apiURL,
					success: function (dataRes) {
						enviando = false;
						if(dataRes.res) {
							data.prieveid = dataRes.prieveid;
							calendar.fullCalendar('renderEvent',
								{
									title: eventSelected.title,
									eveid: eventSelected.idevent,
									start: new Date(Date.parse(eventSelected.date)),
									'backgroundColor':'#2260f0',
									'url': "javascript:app.putCaleEvent("+eventSelected.eveid+");"
								},
								true // make the event "stick"
							);
							user_hotel.userprivateevents.push(data);
							$('#section_Event_int .actionbock').html('<div class="btn btn-primary app_back app_color" >'+translator.getStr('added_to_calendar')+'</div>');
							app.alerta('<div class="alert alert-success"><b>'+translator.getStr('event_added_to_calendar')+'</b></div>', translator.getStr('event_added'), '<button type="button" class="btn btn-default" data-dismiss="modal">'+translator.getStr('close')+'</button>');
						} else {
							app.alerta('<div class="alert alert-danger"><b>'+translator.getStr('event_no_created')+'</b></div>', translator.getStr('error'), '<button type="button" class="btn btn-default" data-dismiss="modal">'+translator.getStr('close')+'</button>');
						}
					},
					error : function(xhr, ajaxOptions, thrownError) {
						enviando = false;
						app.alerta('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'.</b></div>', translator.getStr('error'), '<button type="button" class="btn btn-default" data-dismiss="modal">'+translator.getStr('close')+'</button>');
					}
				});
			}
		}		
		calendar.fullCalendar('unselect');
	},
    addAct: function(data){
		if (activitySelected.idact=data) {
			var error = false;
			var errorMsg = '';
			if(!isValidDate($("#activity_sel_date").val())) {
				error = true;
				errorMsg = ' '+translator.getStr('select_a_valid_date');
			}
			if(!error && !enviando) {
				enviando = true;
				var datos = {
					'action':'saveAct',
					'sessionId': sessionId,
					'idact': activitySelected.idact,
					'date': $("#activity_sel_date").val()
				}
				$.ajax({
					type: 'POST',
					data: datos,
					dataType: 'json',
					url: apiURL,
					success: function (dataRes) {
						enviando = false;
						if(dataRes.res) {
							activitySelected.date = $("#activity_sel_date").val();
							calendar.fullCalendar('renderEvent',
								{
									title: activitySelected.title,
									start: new Date(Date.parse(activitySelected.date)),
									actid: activitySelected.actid,
									'backgroundColor':'#63c958',
									'url': "javascript:app.putActEvent("+activitySelected.actid+");"
								},
								true // make the event "stick"
							);
							user_hotel.userprivateevents.push(data);
							$('#section_Activity_int .actionbock').html('<div class="btn btn-primary app_back app_color" >'+translator.getStr('added_to_calendar')+'</div>');
							var confirmation = (activitySelected.reservation=="1")?' '+translator.getStr('activity_require_reservation')+'':'';
							app.alerta('<div class="alert alert-success"><b>'+translator.getStr('activity_added_to_calendar')+''+confirmation+'</b></div>', 'Activity Added', '<button type="button" class="btn btn-default" data-dismiss="modal">'+translator.getStr('close')+'</button>');
						} else {
							app.alerta('<div class="alert alert-danger"><b>'+translator.getStr('activity_no_created')+'</b></div>', translator.getStr('error'), '<button type="button" class="btn btn-default" data-dismiss="modal">'+translator.getStr('close')+'</button>');
						}
					},
					error : function(xhr, ajaxOptions, thrownError) {
						enviando = false;
						app.alerta('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'.</b></div>', translator.getStr('error'), '<button type="button" class="btn btn-default" data-dismiss="modal">'+translator.getStr('close')+'</button>');
					}
				});
			} else {
				$('#resmeseve').html('<div class="alert alert-danger"><b>'+errorMsg+'</b></div>');
				setTimeout(function() {
					$('#resmeseve').html('');
				}, 2000);
			}
		}		
		calendar.fullCalendar('unselect');
	},
    buyItem: function(data){
		if (data.prodcid) {
			var error = false;
			var errorMsg = '';
			
			if(!enviando) {
				enviando = true;
				var datos = {
					'action':'buyItem',
					'sessionId': sessionId,
					'notes': data.notes,
					'prodcid': data.prodcid
				}
				$.ajax({
					type: 'POST',
					data: datos,
					dataType: 'json',
					url: apiURL,
					success: function (dataRes) {
						if(dataRes.res) {
							$('#resmeseve').html('<div class="alert alert-success"><b>'+translator.getStr('purchase_registered')+'</b></div>');
							$('#shop_text').val('');
							$('#prodcid').val('');
							setTimeout(function() {
								enviando = false;
								$('#resmeseve').html('');
								$('#alerta').modal('hide');
							}, 4000);
						} else {
							enviando = false;
							$('#resmeseve').html('<div class="alert alert-danger"><b>'+translator.getStr('purchase_no_created')+'</b></div>');
							setTimeout(function() {
								$('#resmeseve').html('');
							}, 2000);
						}
					},
					error : function(xhr, ajaxOptions, thrownError) {
						enviando = false;
						$('#resmeseve').html('<div class="alert alert-danger"><b>'+translator.getStr('error_try_again')+'.</b></div>');
						setTimeout(function() {
							$('#resmeseve').html('');
						}, 2000);
					}
				});
			}
		}
	},
    logOut: function() {
		var datos = {
			'action':'logOut',
			'sessionId': sessionId
		}
		$.ajax({
			type: 'POST',
			data: datos,
			dataType: 'json',
			url: apiURL,
			success: function (data) {
				sessionId = null;
				loginUser = true;
				$( "#left-panel" ).animate( {left: "-100%"},100 , function() {$('.screenapp').removeClass('menuopened');});
				secTipo = 0;
				localStorage.setItem('userlogin', sessionId);
				$('#homescreen').addClass('hidden').hide();
				$('#loginscreen').removeClass('hidden').show();
			}
		});
	},
    startApp: function() {
		document.addEventListener("backbutton", function(e){
			if(secTipo==0) {
				//navigator.app.exitApp();
			}
			if(secTipo==1) {
				$('.btnBackSecUno').click();
			}
			if(secTipo==2) {
				$('.btnBackSecDos').click();
			}
			if(secTipo==3) {
				cerrarconte3();
			}
			if(secTipo==99) {
				$( "#left-panel" ).animate( {left: "-100%"},500 );
			}
		}, false);
		$(document).ready(function() {
			$(".form_datetime").datetimepicker({
				format: 'yyyy-mm-dd hh:ii',
				inline: true,
				sideBySide: true
			});
			
			$('.btnMenu').click(function(e) {
				e.preventDefault();
				$('.screenapp').addClass('menuopened');
				$( "#left-panel" ).animate( {left: "0"},500 );
				secTipo = 99;
			});
			
			$('.col-de-3 a').click(function(e) {
				e.preventDefault();
				app.changeHomeItem('panel_'+$(this).data('panel'));
				$('.col-de-3').removeClass('active');
				$(this).parent().addClass('active');
			});
			
			$('.btnSaveAlarm').click(function(e) {
				e.preventDefault();
				app.saveAlarm();
			});
			
			$('.btnSendMessage').click(function(e) {
				e.preventDefault();
				app.sendMessage();
			});
			
			$('.linksMenu').click(function(e) {
				e.preventDefault();
				app.putFullSection($(this).data('item'));
			});
			
			$('.btnRateServices').click(function(e) {
				e.preventDefault();
				app.putFullSection('Rating');
			});
			
			$('.iconquickaccessLink').click(function(e) {
				e.preventDefault();
				app.putFullSection($(this).data('action'));
			});
			
			$('.btnBackSecUno').click(function(e) {
				e.preventDefault();
				
				if(!animandofullsec) {
					animandofullsec = true;
					$('#ventana_uno').animate({left: '100%'},300, function(e) {
						$('#ventana_uno').addClass('hidden');
						$('.sections_uno').addClass('hidden');
						$('#homescreen').removeClass('menuopened');
						animandofullsec = false;
					});
				}
			});
			
			$('.btnBackSecDos').click(function(e) {
				e.preventDefault();
				
				if(!animandofullsecint) {
					animandofullsecint = true;
					$('#ventana_dos').animate({left: '100%'},300, function(e) {
						$('#ventana_dos').addClass('hidden');
						$('.sections_dos').addClass('hidden');
						$('#ventana_uno').removeClass('menuopened');
						animandofullsecint = false;
						secTipo = 1;
					});
				}
			});
			
			$('.btnViewAllAlarms').click(function(e) {
				e.preventDefault();
				app.putFullSection('Alarms');
			});
			
			$('.btnViewAllMessages').click(function(e) {
				e.preventDefault();
				app.putFullSection('Messages');
			});
			
			$('.btnCreatenewMessage').click(function(e) {
				e.preventDefault();
				app.changeHomeItem('panel_messages');
				$('.col-de-3').removeClass('active');
				$('#messageslinkhome').addClass('active');
				$('.btnBackSecUno').click();
				$('#messagesubject').focus();
			});
			
			$('.itemsIntContent').on('click','.btnViewAlarm',function(e) {
				e.preventDefault();
				app.putFullSectionInt('Alarm_int', $(this).data('alarm'));
			});
						
			$('#alerta').on('click','.btnSaveEventCal',function(e) {
				e.preventDefault();
				if($('#eventguest_title').val()!='' && $('#eventguest_date').val()!='' && $('#hourselect').val()!='X' && $('#minuteselect').val()!='X') {
					var data = {
						title: $('#eventguest_title').val(),
						text: $('#eventguest_text').val(),
						date: $('#eventguest_date').val()+' ' +$('#hourselect').val()+':'+$('#minuteselect').val()
					};
					app.addGuestEvent(data);
				} else {
					$('#resmeseve').html('<div class="alert alert-danger"><b>'+translator.getStr('title_time_required')+'</b></div>');
					setTimeout(function() {
						$('#resmeseve').html('');
					}, 2000);
				}
			});
			
			$('#alerta').on('click','.btnFinishBuy',function(e) {
				e.preventDefault();
				var data = {
					notes: $('#shop_text').val(),
					prodcid: $('#prodcid').val()
				};
				app.buyItem(data);
			});
			
			$('.itemsIntContent').on('click','.btnSendMessageRepl',function(e) {
				e.preventDefault();
				app.sendReplyMessage();
			});
			
			$('.itemsIntContent').on('click','.btnViewMessage',function(e) {
				e.preventDefault();
				$('#section_Message_int .itemsIntContent').html('');
				$('#section_Message_int .titleElement').html('');
				app.putFullSectionInt('Message_int', $(this).data('msgid'));
			});
			
			$('.itemsIntContent').on('click','.btnAddEvent',function(e) {
				e.preventDefault();
				app.addEvent($(this).data('eveid'));
			});
			
			$('.itemsIntContent').on('click','.btnAddAct',function(e) {
				e.preventDefault();
				var imgeve = (activitySelected.image!="")?'	<div class="event_pic"><img src="'+activitySelected.image+'" class="event_img"></div>':'';
				var itemnew = '<div class="itemHomeBlock">'+
				'		<div class="imgHomeBlock" style="background-image: url('+activitySelected.image+');"></div>'+
				'		<div class="contHomeBlock">'+
				'			<h4 class="subtitHomeBlock">'+activitySelected.title+'</h4>'+
				'		</div>'+
				'	</div>';
				
				var htmlbody = '<div class="row">'+
				'	<div class="col-md-12">'+
				'		'+itemnew+
				'	</div>'+
				'	<div class="col-md-12" style="margin: 25px 0;"><b>'+translator.getStr('chose_prefered_date_time')+'</b></div>'+
				'	<div class="col-md-12">'+
				'		<input type="text" class="form-control" id="activity_sel_date">'+
				'	</div>'+
				'	<div class="col-md-12">'+
				'		<div class="form-group" id="resmeseve">'+
				'		</div>'+
				'	</div>'+
				'</div>';
				app.alerta(htmlbody, ''+translator.getStr('add')+' '+activitySelected.title+' '+translator.getStr('to_Calendar')+'', '<button type="button" class="btn btn-default" data-dismiss="modal">'+translator.getStr('cancel')+'</button><button type="button" class="btn btn-primary app_back app_color btnAddActComp" data-actid="'+activitySelected.idact+'">'+translator.getStr('add_to_calendar')+'</button>');
				
				$("#activity_sel_date").datetimepicker({
					format: 'yyyy-mm-dd hh:ii',
					inline: true,
					pickerPosition: 'top-left',
					sideBySide: true
				});
			});
			
			$('#alerta').on('click','.btnAddActComp',function(e) {
				e.preventDefault();
				app.addAct($(this).data('actid'));
			});
			
			$('.itemsIntContent').on('click','.btnShopThis',function(e) {
				e.preventDefault();
				var itemP = false;
				var prodsel = $(this).data('idprod');
				$.each(prodsArr, function(idx, item) {
					if(prodsel==item.idprod) {
						itemP = item;
					}
				});
				//49169132
				if(itemP) {
					var itemnew = '<div class="itemHomeBlock">'+
					'		<div class="imgHomeBlock" style="background-image: url('+itemP.image+');"></div>'+
					'		<div class="contHomeBlock">'+
					'			<h4 class="titHomeBlock">'+itemP.title+'</h4>'+
					'			<div class="textHomeBlock">'+itemP.text+'</div>'+
					'			<div class="textHomeBlock"><b>$ '+itemP.price+'</b></div>'+
					'		</div>'+
					'	</div>';
					var htmlbody = '<div class="row">'+
					'	<div class="col-md-12">'+
					'		'+itemnew+
					'	</div>'+
					'	<div class="col-md-12">'+
					'		<textarea class="form-control" type="text" id="shop_text" placeholder="'+translator.getStr('notes')+'"></textarea><input type="hidden" id="prodcid" value="'+itemP.idprod+'">'+
					'	</div>'+
					'	<div class="col-md-12">'+
					'		<div class="form-group" id="resmeseve">'+
					'		</div>'+
					'	</div>'+
					'</div>';
					app.alerta(htmlbody, 'Buy '+itemP.title, '<button type="button" class="btn btn-default" data-dismiss="modal">'+translator.getStr('cancel')+'</button><button type="button" class="btn btn-primary app_back app_color btnFinishBuy">'+translator.getStr('buy')+'</button>');
				}
			});
			
			$('.itemsIntContent').on('click','.btnViewMoreEvent',function(e) {
				e.preventDefault();
				$('#section_Event_int .itemsIntContent').html('');
				$('#section_Event_int .titleElement').html('');
				app.putFullSectionInt('Event_int', $(this).data('eveid'));
			});
			
			$('.eventsitems').on('click','.btnViewMoreEveHome',function(e) {
				e.preventDefault();
				app.putFullSection('Events');
				segudnop = true;
				$('#section_Event_int .itemsIntContent').html('');
				$('#section_Event_int .titleElement').html('');
				app.putFullSectionInt('Event_int', $(this).data('eveid'));
			});
						
			$('.itemsIntContent').on('click','.btnViewMoreActivity',function(e) {
				e.preventDefault();
				$('#section_Activity_int .itemsIntContent').html('');
				$('#section_Activity_int .titleElement').html('');
				app.putFullSectionInt('Activity_int', $(this).data('actid'));
			});
						
			$('.itemsIntContent').on('click','.btnViewMorePromo',function(e) {
				e.preventDefault();
				$('#section_Promotion_int .itemsIntContent').html('');
				$('#section_Promotion_int .titleElement').html('');
				app.putFullSectionInt('Promotion_int', $(this).data('promid'));
			});
						
			$('.itemsIntContent').on('click','.btnViewMoreNews',function(e) {
				e.preventDefault();
				$('#section_New_int .itemsIntContent').html('');
				$('#section_New_int .titleElement').html('');
				app.putFullSectionInt('New_int', $(this).data('newid'));
			});
			
			$('.newsitems').on('click','.btnViewMoreNewsHome',function(e) {
				e.preventDefault();
				app.putFullSection('News');
				segudnop = true;
				$('#section_New_int .itemsIntContent').html('');
				$('#section_New_int .titleElement').html('');
				app.putFullSectionInt('New_int', $(this).data('newid'));
			});
						
			$('.itemsIntContent').on('click','.lnkDirectoDow',function(e) {
				e.preventDefault();
				//~ $('#section_Brochure_int .itemsIntContent').html('');
				//~ $('#section_Brochure_int .titleElement').html('');
				//~ brochueretti = $(this).text();
				//~ app.putFullSectionInt('Brochure_int', $(this).attr('href'));
				window.open($(this).attr('href'), '_blank');
			});
			
			$('.itemsIntContent').on('click','.itemGalGen',function(e) {
				e.preventDefault();
				app.iniciarGaleria($(this).data('itemgal'));
			});
			
			$('#langsel').on('change',function(e) {
				e.preventDefault();
				defLang = $(this).val();
				window.localStorage.setItem('lang', defLang);
				app.cambiarIdioma();
			});
			
			$('.itemsIntContent').on('click','.rate_stars .fa',function(e) {
				e.preventDefault();
				var itemnew = '<b>Rate '+$(this).data('rname')+'</b><br>';
				for(var i=1;i<=5;i++) {
					var ischeck = (i<=$(this).data('star'))?' checked':'';
					itemnew += '<span class="fa fa-star'+ischeck+'" ></span>';
				}
				
				var htmlbody = '<div class="row">'+
				'	<div class="col-md-12">'+
				'		'+itemnew+
				'	</div>'+
				'	<div class="col-md-12">'+
				'		<textarea class="form-control" type="text" id="rate_hotel_text" placeholder="'+translator.getStr('notes')+'"></textarea>'+
				'	</div>'+
				'	<div class="col-md-12">'+
				'		<div class="form-group" id="resmeseve2">'+
				'		</div>'+
				'	</div>'+
				'</div>';
				app.alerta(htmlbody, 'Rate '+$(this).data('rname'), '<button type="button" class="btn btn-default" data-dismiss="modal">'+translator.getStr('cancel')+'</button><button type="button" class="btn btn-primary app_back app_color sendthisrate" data-star="'+$(this).data('star')+'" data-rname="'+$(this).data('rname')+'" data-type="'+$(this).data('type')+'">'+translator.getStr('rate')+'</button>');
			});
			
			$('#alerta').on('click','.sendthisrate',function(e) {
				e.preventDefault();
				app.rankearApp($(this).data('type'),$(this).data('star'),$(this).data('rname'));
			});
			
			$( "#left-panel" ).removeClass('hidden');
    
			$('.btnCerrarM a').click(function(e) {
				e.preventDefault();
				var quien = $(this).data('quien');
				if ( quien == "menu"  ) {
					$( "#left-panel" ).animate( {left: "-100%"},500 , function() {$('.screenapp').removeClass('menuopened');});
				}
				secTipo = 0;
			});
			
			$( "#left-panel" ).swipe( {
				swipeLeft:function(event, distance, duration, fingerCount, fingerData, currentDirection) {
					$( "#left-panel" ).animate( {left: "-100%"},500 , function() {$('.screenapp').removeClass('menuopened');} );
					secTipo = 0;
				}
			});
			
			$( "div.panel_home" ).swipe( {
				swipeLeft:function(event, distance, duration, fingerCount, fingerData, currentDirection) {
					app.changeHomeItem('panel_alarms');
					$('.col-de-3').removeClass('active');
					$('#alarmlnkhome').parent().addClass('active');
				},
				fingers:$.fn.swipe.fingers.ALL
			});
			
			$( "div.panel_alarms" ).swipe( {
				swipeLeft:function(event, distance, duration, fingerCount, fingerData, currentDirection) {
					app.changeHomeItem('panel_messages');
					$('.col-de-3').removeClass('active');
					$('#messageslinkhome').parent().addClass('active');
				},
				swipeRight:function(event, distance, duration, fingerCount, fingerData, currentDirection) {
					app.changeHomeItem('panel_home');
					$('.col-de-3').removeClass('active');
					$('#homelinkhome').parent().addClass('active');
				},
				fingers:$.fn.swipe.fingers.ALL
			});
			
			$( "div.panel_messages" ).swipe( {
				swipeLeft:function(event, distance, duration, fingerCount, fingerData, currentDirection) {
					app.changeHomeItem('panel_info');
					$('.col-de-3').removeClass('active');
					$('#infohomeicon').parent().addClass('active');
				},
				swipeRight:function(event, distance, duration, fingerCount, fingerData, currentDirection) {
					app.changeHomeItem('panel_alarms');
					$('.col-de-3').removeClass('active');
					$('#alarmlnkhome').parent().addClass('active');
				},
				fingers:$.fn.swipe.fingers.ALL
			});
			
			$( "div.panel_info" ).swipe( {
				swipeRight:function(event, distance, duration, fingerCount, fingerData, currentDirection) {
					app.changeHomeItem('panel_messages');
					$('.col-de-3').removeClass('active');
					$('#messageslinkhome').parent().addClass('active');
				},
				fingers:$.fn.swipe.fingers.ALL
			});
			calendar = $('#calendar').fullCalendar(optionCalendarHome);
			$('.ventanashomeCont').css('height',$('.panel_home').height());
		});
    },
    setupPush: function() {
        var push = PushNotification.init({
            "android": {
                "senderID": "651262773142"
            },
            "browser": {},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });

        push.on('registration', function(data) {
            console.log('registration event: ' + data.registrationId);

            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
                // Post registrationId to your app server as the value has changed
            }
            var datos = {
				'action':'saveTokenUser',
				'sessionId': sessionId,
				'usertoken': data.registrationId
			}
			$.ajax({
				type: 'POST',
				data: datos,
				dataType: 'json',
				url: apiURL,
				success: function (data) {
					if(data.res) {
					}
				},
				error : function(xhr, ajaxOptions, thrownError) {
				}
			});

        });

        push.on('error', function(e) {
            alert("push error = " + e.message);
        });

        push.on('notification', function(data) {
			
			push.setApplicationIconBadgeNumber(() => {
				console.log('success');
			}, () => {
				console.log('error');
			}, 0);
            
			var htmlbody = '<div class="row">'+
			'	<div class="col-md-12">'+
			'		'+data.message+
			'	</div>'+
			'</div>';
			app.alerta(htmlbody, data.title, '<button type="button" class="btn btn-default" data-dismiss="modal">'+translator.getStr('close')+'</button>');
       });
    },
	pad_with_zeroes: function(number, length) {
		var my_string = '' + number;
		while (my_string.length < length) {
			my_string = '0' + my_string;
		}
		return my_string;
	}
};

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

