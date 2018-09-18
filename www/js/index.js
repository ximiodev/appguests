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
var sessionId;
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
			case 'de':
				lango = de;
				break;
			case 'fr':
				lango = fr;
				break;
			case 'it':
				lango = it;
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
		translator = language;
		$('[data-textlang!=""]').each(function( index ) {
			lkey = $(this).data('textlang');
			if(lkey!=undefined) {
				$(this).html(translator.getStr(lkey));
			}
		});
		$("#langsel").val(defLang);
		if( typeof ($.fn.fullCalendar) === 'undefined'){ 
		} else {
			try {
				calendar.fullCalendar('option', 'locale', defLang);
			} catch(err) {
			}
		}
    },
    onDeviceReady: function() {
		sessionId = localStorage.getItem('userlogin');
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
						defLang = (defLang=='en' || defLang=='es' || defLang=='pt' || defLang=='de' || defLang=='fr' || defLang=='it')?defLang:'en';
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
							app.configureHotel();
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
						$('#section_MyShops .itemsIntContent').html('');
						if(data.shops.length>0) {
							var total = 0;
							desdedonde.prepend('<div class="contAllPurchases"><button class="btn btn-primary btnViewAllPurchases app_back app_color">'+translator.getStr('view_all_purchase')+'</button></div>');
							$.each(data.shops, function(idx, item) {
								total += parseFloat(item.price);
								var detalles = (item.details)?'			<div class="textHomeBlock">'+item.details+'</div>':'';
								var itemnew = '<div class="itemHomeBlock">'+
											'		<div class="imgHomeBlock" style="background-image: url('+item.image+');"></div>'+
											'		<div class="contHomeBlock">'+
											'			<h4 class="titHomeBlock">'+item.title+'</h4>'+
											'			<div class="textHomeBlock"><b>$ '+item.price+'</b></div>'+
											detalles+
											'			<div class="textHomeBlock"><b>'+translator.getStr('date')+':</b> '+item.date+'</div>'+
											'			<div class="textHomeBlock"><b>'+translator.getStr('state')+':</b> '+item.state+'</div>'+
											'		</div>'+
											'	</div>'+
											'';
								$('#section_MyShops .itemsIntContent').append(itemnew);
							});
							$('#section_MyShops .itemsIntContent').append('<div class="totalpurchase"><b>'+translator.getStr('total_spend')+' $'+total+'</b></div>');
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
								var reservation = (item.reservation=="1")?translator.getStr('requires_reservation'):'';
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
						var reservation = (item.reservation=="1")?translator.getStr('requires_reservation'):'';
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
								'	<td><b>'+translator.getStr('state')+': </b> <span class="label label-'+labelState+'">'+item.state+'</span></td>'+
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
							$('#messageslinkhome .badge').remove();
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
		$('#messageslinkhome .badge').remove();
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
    alerta: function(cuerpo,title,buttonsfooter){
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
			setTimeout(app.mostrarPuntuarApp, 35000);
			
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
				$('#messageslinkhome').parent().addClass('active');
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
			
			$('.itemsIntContent').on('click','.btnViewAllPurchases',function(e) {
				e.preventDefault();
				app.putFullSectionInt('MyShops', 0);
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
			
			$('.btnRateApp').click(function(e) {
				e.preventDefault();
				var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
				if (deviceType!="Android") {
					cordova.plugins.market.open('id1435620718');
				} else if (deviceType=="Android") {
					cordova.plugins.market.open('com.ximiodev.smartbellboy');
				}
			});
			
			$('.btnInfoApp').click(function(e) {
				e.preventDefault();
				app.putFullSectionInt('InfoApp', 0);
			});
			
			$('#langsel').on('change',function(e) {
				e.preventDefault();
				defLang = $(this).val();
				window.localStorage.setItem('lang', defLang);
				app.cambiarIdioma();
			});
			
			$('.itemsIntContent').on('click','.rate_stars .fa',function(e) {
				e.preventDefault();
				var itemnew = '<b>'+translator.getStr('rate')+' '+$(this).data('rname')+'</b><br>';
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
				app.alerta(htmlbody, translator.getStr('rate')+' '+$(this).data('rname'), '<button type="button" class="btn btn-default" data-dismiss="modal">'+translator.getStr('cancel')+'</button><button type="button" class="btn btn-primary app_back app_color sendthisrate" data-star="'+$(this).data('star')+'" data-rname="'+$(this).data('rname')+'" data-type="'+$(this).data('type')+'">'+translator.getStr('rate')+'</button>');
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
    
			$('#notifications').on('change', function(e) {
				e.preventDefault();
				
				var oldRegId = localStorage.getItem('registrationId');
				var datos = {
					'action':'updateTokenUser',
					'sessionId': sessionId,
					'usertoken': oldRegId,
					'state': $(this).is(':checked')
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
    mostrarPuntuarApp: function() {
		if (rateapp_co==1 || rateapp_co==2) {
			navigator.notification.confirm(
			translator.getStr("text_rate_app"),
			function(button) {
				// yes = 1, no = 2, later = 3
				var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
				if (button == '1') {    // Rate Now
					if (deviceType!="Android") {
						cordova.plugins.market.open('id1435620718');
					} else if (deviceType=="Android") {
						cordova.plugins.market.open('com.ximiodev.smartbellboy');
					}
					rateapp_co = false;
				} else if (button == '2') { // Later
					rateapp_co = 1;
				} else if (button == '3') { // No
					rateapp_co = false;
				}
				window.localStorage.setItem('rateapp_co',rateapp_co); 
			}, translator.getStr("rate_app_now"), [translator.getStr("rate_app_now"), translator.getStr("rate_app_later"), translator.getStr("rate_app_no")]);
		} else {
			//~ alerta(rateapp_co);
		}
    },
    setupPush: function() {
        var push = PushNotification.init({
            "android": {
                "senderID": "651262773142"
            },
            "browser": {},
            "ios": {
				"senderID": "651262773142",
                "fcmSandbox": true,
                "sound": true,
                "vibration": true,
                "badge": true
            }
        });

        push.on('registration', function(data) {
            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                localStorage.setItem('registrationId', data.registrationId);
            }
            var datos = {
				'action':'saveTokenUser',
				'sessionId': sessionId,
				'plataforma': user_platform,
				'usertoken': data.registrationId
			}
			$.ajax({
				type: 'POST',
				data: datos,
				dataType: 'json',
				url: apiURL,
				success: function (data) {
					if(data.res) {
						$('#notifications').attr('checked', data.state);
					}
				},
				error : function(xhr, ajaxOptions, thrownError) {
				}
			});

        });

        push.on('error', function(e) {
            alert("push error = " + e.message);
        });
			
		push.setApplicationIconBadgeNumber(function() {
			console.log('success');
		}, function() {
			console.log('error');
		}, 0);

        push.on('notification', function(data) {
			
			push.setApplicationIconBadgeNumber(function() {
				console.log('success');
			}, function() {
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
	lang: "Language",
	to_calendar: "para o calendário",
	notifications: "Notificações",
	view_all_purchase: "Veja minhas compras",
	my_shops: "Minhas compras",
	rate: "Avaliar",
	total_spend: "compras totais",
	text_rate_app: "Se você gosta de usar o SmartBellboy, você se importaria em avaliar isso? Não vai demorar mais que um minuto, obrigado pelo seu apoio!",
	rate_app_now: "Classifique o SmartBellboy",
	rate_app_later: "Lembre-me mais tarde",
	rate_app_no: "Não, obrigado",
	info_app: "Smartbellboy é uma ferramenta desenvolvida como parte de um sistema de gerenciamento de maior convidados Hotel & Desenvolvido por ximiodev, uma empresa dedicada ao desenvolvimento de sowftare, focada em fornecer a melhor solução para cada cliente.<br><br>Por favor, contacte-nos em info@smartbellboy.com ou info@ximiodev.com<br><a href=\"https://www.smartebellboy.com/\">https://www.smartebellboy.com/<br><a href=\"https://www.ximiodev.com/\">https://www.ximiodev.com/</a><br>"
};
var de = {
    all_right_reserv: "Alle Rechte vorbehalten.",
    alarms: "Alarme",
    shop: "Geschäft",
    messages: "Nachrichten",
    events: "Ereignisse",
    activities: "Aktivitäten",
    brochures: "Broschüren",
    promotions: "Promotions",
    news: "Nachrichten",
    gallery: "Galerie",
    rate_us: "Bewerten Sie uns",
    logout: "Abmelden",
    quick_actions: "Schnellzugriffe",
    your_calendar: "Ihr Kalender",
    next_events: "Nächste Ereignisse",
    last_news: "Letzte Nachrichten",
    create_new_alarm: "Neuen Alarm erstellen",
    view_all_alarms: "Alle Alarme anzeigen",
    date_y_time: "Datum & Uhrzeit",
    alarms_type: "Alarmtyp",
    priority: "Priorität",
    notify_phone: "Notify by Room Phone",
    notify_cellphone: "Notify by CellPhone",
    notify_email: "Benachrichtigung per E-Mail",
    notify_push: "Benachrichtigung per Push-Benachrichtigung",
    notes: "Notizen",
    title: "Titel",
    save: "Speichern",
    create_new_message: "Neue Nachricht erstellen",
    view_all_messages: "Alle Nachrichten anzeigen",
    subject: "Betreff",
    your_message: "Deine Nachricht",
    send:"Senden",
    hotel_info: "Hotelinfo",
    phone: "Telefon",
    web: "Web",
    email: "Email",
    rate_our_services: "Bewerten Sie unsere Dienste",
    roomservice_shop: "Zimmerservice & Shop",
    breakfast: "Frühstück",
    food_drinks: "Essen & Trinken",
    room: "Zimmer",
    services: "Dienstleistungen",
    alert: "Warnung",
    username_or_pass_inco: "Benutzername oder Passwort falsch.",
    error_try_again: "Fehler. Erneut versuchen.",
    error: "Fehler",
    loading: "Laden ...",
    there_are_no_news: "Es gibt keine Neuigkeiten.",
    buy: "Kaufen",
    there_are_no_tiems_to_buy: "Es gibt keine Tiems zu kaufen.",
    there_are_no_news: "Es gibt keine Neuigkeiten.",
    view_more: "Mehr anzeigen",
    news_not_found: "Neuigkeiten nicht gefunden.",
    there_are_no_promotions: "Es gibt keine Werbeaktionen.",
    there_are_no_activities: "Es gibt keine Aktivitäten.",
    promotion_not_found: "Aktion nicht gefunden.",
    requires_reservation: "Kundenreservierung",
    view_link: "Link anzeigen",
    added_to_calendar: "Zum Kalender hinzugefügt",
    add_to_calendar: "Zum Kalender hinzufügen",
    event_not_found: "Ereignis nicht gefunden.",
    there_are_no_events: "Es gibt keine Ereignisse.",
    event_not_found: "Ereignis nicht gefunden.",
    date: "datum",
    created_at: "Erstellt am",
    priority: "Priorität",
    type: "Typ",
    view_details: "Details anzeigen",
    you_have_no_alarms_saved: "Sie haben keine Alarme gespeichert.",
    state: "Staat",
    alarm_not_found: "Alarm nicht gefunden.",
    read_message: "Nachricht lesen",
    you_have_no_messages: "Sie haben keine Nachrichten.",
    message_not_found: "Nachricht nicht gefunden.",
    reply: "Antwort",
    your_message_was_sended: "Deine Nachricht wurde gesendet.",
    select_a_valid_date: "Wählen Sie ein gültiges Datum aus.",
    your_alarm_was_saved_successfully: "Ihr Alarm wurde erfolgreich gespeichert.",
    thanks_for_rate_us: "Danke für die Bewertung!",
    write_a_message: "Schreibe eine Nachricht.",
    write_a_subject: "Schreibe ein Thema.",
    no_brochures_to_download: "Es gibt keine Broschüren zum Download.",
    add_new_event_to_calendar: "Neues Ereignis zum Kalender hinzufügen",
    cancel: "Abbrechen",
    close: "Schließen",
    event_no_created: "Event nicht erstellt. Versuche es später.",
	activity_no_created: "Aktivität wurde nicht erstellt. Versuche es später.",
	purchase_no_created: "Kauf nicht registriert. Versuche es später.",
    event_added_to_calendar: "Das Ereignis wurde zu Ihrem Kalender hinzugefügt.",
    event_added: "Ereignis hinzugefügt",
    activity_added_to_calendar: "Die Aktivität wurde Ihrem Kalender hinzugefügt.",
    activity_require_reservation: "Diese Aktivität erfordert eine Reservierung, wir kontaktieren Sie, wenn die Reservierung gültig ist.",
    purchase_registered: "Kauf registriert.",
    title_time_required: "Titel und Uhrzeit sind erforderlich.",
    chose_prefered_date_time: "Wählen Sie bevorzugtes Datum und Uhrzeit.",
    add: "Hinzufügen",
    settings: "Einstellungen",
    lang: "Sprache",
    to_calendar: "zum Kalender",
    notifications: "Benachrichtigungen",
    my_shops: "Meine Geschäfte",
    view_all_purchase: "Meine Einkäufe ansehen",
    rate: "Schätzen",
	total_spend: "Gesamtkäufe",
	text_rate_app: "Wenn du SmartBellboy magst, hättest du etwas dagegen, es zu bewerten? Es dauert nicht länger als eine Minute. Danke für deine Unterstützung!",
	rate_app_now: "Bewerten SmartBellboy",
	rate_app_later: "Erinnere mich später",
	rate_app_no: "Nein danke",
	info_app: "Smartbellboy ist ein Tool, das als Teil eines großen Hotel-Gästemanagement-Systems entwickelt wurde. <br> Entwickelt von ximiodev, einem Unternehmen, das sich der Entwicklung von sowftare verschrieben hat, konzentrierte sich auf die Bereitstellung der besten Lösung für jeden Kunden Wenn Sie möchten, können Sie uns unter <a href=\"mailto:info@smartbellboy.com/\">info@smartbellboy.com</a> oder <a href=\"info@ximiodev.com\">info@ximiodev.com</a>.<br><br><a href=\"https://www.smartebellboy.com/\"> https://www.smartebellboy.com/<br><a href=\"https://www.ximiodev.com/\">https://www.ximiodev.com/</a><br> "
};
var fr = {
    all_right_reserv: "Tous droits réservés",
    alarms: "Alarmes",
    shop: "Shop",
    messages: "Messages",
    events: "Événements",
    activities: "Activités",
    brochures: "Brochures",
    promotions: "Promotions",
    news: "Nouvelles",
    gallery: "Galerie",
    rate_us: "nous évaluer",
    logout: "Déconnexion",
    quick_actions: "Actions rapides",
    your_calendar: "Votre calendrier",
    next_events: "Prochains événements",
    last_news: "Dernières nouvelles",
    create_new_alarm: "Créer une nouvelle alarme",
    view_all_alarms: "Voir toutes les alarmes",
    date_y_time: "Date & heure",
    alarms_type: "Type d'alarme",
    priority: "Priorité",
    notify_phone: "Notifier par téléphone",
    notify_cellphone: "Notify by CellPhone",
    notify_email: "Notify by Email",
    notify_push: "Notification par notification push",
    notes: "Notes",
    title: "Titre",
    save: "Enregistrer",
    create_new_message: "Créer un nouveau message",
    view_all_messages: "Afficher tous les messages",
    subject: "Sujet",
    your_message: "Votre message",
    send:"Envoyer",
    hotel_info: "Informations sur l'hôtel",
    phone: "Téléphone",
    web: "Web",
    email: "Email",
    rate_our_services: "Évaluez nos services",
    roomservice_shop: "Room Service & Shop",
    breakfast: "Breakfast",
    food_drinks: "Nourriture et boissons",
    room: "Chambre",
    services: "Services",
    alert: "Alerte",
    username_or_pass_inco: "Nom d'utilisateur ou mot de passe incorrect",
    error_try_again: "Erreur. Réessayez.",
    error: "erreur",
    loading: "Chargement...",
    there_are_no_news: "Il n'y a pas de nouvelles.",
    buy: "Acheter",
    there_are_no_tiems_to_buy: "Il n'y a pas de tiems à acheter.",
    there_are_no_news: "Il n'y a pas de nouvelles.",
    view_more: "Voir plus",
    news_not_found: "Nouvelles non trouvées.",
    there_are_no_promotions: "Il n'y a pas de promotions",
    there_are_no_activities: "Il n'y a pas d'activités.",
    promotion_not_found: "Promotion non trouvée",
    require_reservation: "Requiere reservation",
    view_link: "Voir le lien",
    added_to_calendar: "Ajouté à l'agenda",
    add_to_calendar: "Ajouter au calendrier",
    event_not_found: "Evénement introuvable.",
    there_are_no_events: "Il n'y a pas d'événements.",
    event_not_found: "Evénement introuvable.",
    date: "Date",
    created_at: "Créé à",
    priority: "Priorité",
    type: "Type",
    view_details: "Afficher les détails",
    you_have_no_alarms_saved: "Aucune alarme n’a été enregistrée",
    state: "Etat",
    alarm_not_found: "Alarme introuvable.",
    read_message: "Lire le message",
    you_have_no_messages: "Vous n'avez aucun message.",
    message_not_found: "Message introuvable.",
    reply: "Répondre",
    your_message_was_sended: "Votre message a été envoyé.",
    select_a_valid_date: "Sélectionnez une date valide.",
    your_alarm_was_saved_successfully: "Votre alarme a été enregistrée avec succès.",
    thanks_for_rate_us: "Merci de nous noter !.",
    write_a_message: "Écrivez un message",
    write_a_subject: "Ecrire un sujet",
    no_brochures_to_download: "Il n'y a pas de brochures à télécharger.",
    add_new_event_to_calendar: "Ajouter un nouvel événement à l'agenda",
    cancel: "Annuler",
    close: "Close",
    event_no_created: "Evénement non créé. Essayez plus tard.",
	activity_no_created: "Activité non créée. Essayez plus tard.",
	purchase_no_created: "Achat non enregistré. Essayez plus tard.",
    event_added_to_calendar: "L'événement a été ajouté à votre calendrier.",
    event_added: "Event Added",
    activity_added_to_calendar: "L'activité a été ajoutée à votre calendrier.",
    activity_require_reservation: "Cette activité nécessite une réservation, nous vous contactons lorsque la réservation est effective.",
    purchase_registered: "Achat enregistré",
    title_time_required: "Le titre et l'heure sont requis.",
    chose_prefered_date_time: "Choisissez la date et l'heure préférées",
    add: "Ajouter",
    settings: "Paramètres",
    lang: "Langage",
    to_calendar: "to calendar",
    notifications: "Notifications",
    my_shops: "Mes boutiques",
    view_all_purchase: "Voir mes achats",
    rate: "Évaluer",
	total_spend: "Total des achats",
	text_rate_app: "Si vous aimez SmartBellboy, cela vous dérangerait-il de prendre un moment pour le noter? Cela ne prendra pas plus d'une minute. Merci pour votre soutien!",
	rate_app_now: "Rate SmartBellboy",
	rate_app_later: "Rappelle moi plus tard",
	rate_app_no: "Non merci",
	info_app: "Smartbellboy est un outil développé dans le cadre d'un système de gestion de grande clientèle.<br>Développé par ximiodev, une société dédiée au développement de sowftare, axée sur la fourniture de la meilleure solution pour chaque client.<br><br>Si vous le souhaitez, vous pouvez nous contacter à l'adresse <a href=\"mailto:info@smartbellboy.com/\"> info@smartbellboy.com</a> ou <a href=\"info@ximiodev.com\">info@ximiodev.com</a>.<br><br><a href=\"https://www.smartebellboy.com/\">https://www.smartebellboy.com/<br><a href =\"https: //www.ximiodev.com/\">https://www.ximiodev.com/</a><br> "
};
var it = {
    all_right_reserv: "Tutti i diritti riservati.",
	alarms: "Allarmi",
	shop: "Acquista",
	messages: "Messaggi",
	events: "Eventi",
	activities: "Attività",
	brochures: "Opuscoli",
	promotions: "Promozioni",
	news: "Notizie",
	gallery: "Galleria",
	rate_us: "Valutaci",
	logout: "Esci",
	quick_actions: "Scorciatoie",
	your_calendar: "Il tuo calendario",
	next_events: "Prossimi eventi",
	last_news: "Ultime notizie",
	create_new_alarm: "Crea nuovo allarme",
	view_all_alarms: "Vedi tutti gli allarmi",
	date_y_time: "Data e ora",
	alarms_type: "Tipo di allarme",
	priority: "Priorità",
	notify_phone: "Notifica per telefono nella stanza",
	notify_cellphone: "Notify by CellPhone",
	notify_email: "Notifica via email",
	notify_push: "Notifica tramite notifica push",
	note: "Note",
	title: "Titolo",
	save: "Salva",
	create_new_message: "Crea nuovo messaggio",
	view_all_messages: "Vedi tutti i messaggi",
	subject: "Soggetto",
	your_message: "Il tuo messaggio",
	send: "invia",
	hotel_info: "Informazioni sull'hotel",
	phone: "Telefono",
	web: "Web",
	email: "Email",
	rate_our_services: "Valuta i nostri servizi",
	roomervice_shop: "Servizio in camera e negozio",
	breakfast: "Colazione",
	food_drinks: "Cibo e bevande",
	room: "Camera",
	services: "Servizi",
	alert: "Avviso",
	username_or_pass_inco: "Nome utente o password errati.",
	error_try_again: "Errore, riprova.",
	error: "Errore",
	loading: "Caricamento in corso ...",
	there_are_no_news: "Nessuna novità",
	buy: "Acquista",
	there_are_no_tiems_to_buy: "Non ci sono titoli da acquistare.",
	there_are_no_news: "Nessuna novità",
	view_more: "Vedi di più",
	news_not_found: "Notizie non trovate.",
	there_are_no_promotions: "Nessuna promozione",
	there_are_no_activities: "Non ci sono attività.",
	promotion_not_found: "Promozione non trovata.",
	require_reservation: "richiede la prenotazione",
	view_link: "Vedi link",
	added_to_calendar: "Aggiunto al calendario",
	add_to_calendar: "Aggiungi al calendario",
	event_not_found: "Evento non trovato.",
	there_are_no_events: "Nessun evento",
	event_not_found: "Evento non trovato.",
	date: "Data",
	created_at: "Creato in",
	priority: "Priorità",
	type: "Tipo",
	view_details: "Visualizza dettagli",
	you_have_no_alarms_saved: "Non hai allarmi salvati",
	state: "Stato",
	alarm_not_found: "Allarme non trovato.",
	read_message: "Leggi messaggio",
	you_have_no_messages: "Non hai messaggi",
	message_not_found: "Messaggio non trovato.",
	reply: "Rispondi",
	your_message_was_sended: "Il tuo messaggio è stato inviato",
	select_a_valid_date: "Seleziona una data valida.",
	your_alarm_was_saved_successfully: "La tua sveglia è stata salvata correttamente",
	thanks_for_rate_us: "Grazie per le qualifiche!",
	write_a_message: "Scrivi un messaggio.",
	write_a_subject: "Scrivi un argomento.",
	no_brochures_to_download: "Non ci sono opuscoli da scaricare.",
	add_new_event_to_calendar: "Aggiungi un nuovo evento al calendario",
	cancel: "Annulla",
	close: "Chiudi",
	event_no_created: "Evento non creato. Provalo più tardi.",
	activity_no_created: "Attività non creata. Riprova più tardi.",
	purchase_no_created: "Acquisto non registrato. Provalo più tardi.",
	event_added_to_calendar: "L'evento è stato aggiunto al tuo calendario",
	event_added: "Evento aggiunto",
	activity_added_to_calendar: "L'attività è stata aggiunta al tuo calendario",
	activity_require_reservation: "Questa attività richiede una prenotazione, vi contatteremo quando il libro di entrata in vigore",
	purchase_registered: "Acquisto registrato.",
	title_time_required: "Il titolo e l'ora sono obbligatori",
	choose_prefered_date_time: "Scegli la data e l'ora preferite",
	add: "Aggiungi",
    settings: "Impostazioni",
    lang: "Lingua",
	to_calendar: "al calendario",
    notifications: "Notifiche",
    view_all_purchase: "Vedi i miei acquisti",
    my_shops: "I miei acquisti",
	tasso: "Valutare",
	total_spend: "Acquisti totali",
	text_rate_app: "Se vi piace utilizzando SmartBellboy, ti dispiacerebbe prendere un momento per qualificare non ci vorrà più di un minuto Grazie per il vostro sostegno.",
	rate_app_now: "Vota SmartBellboy",
	rate_app_later: "Ricordamelo più tardi",
	rate_app_no: "No, grazie",
	info_app: "Smartbellboy è uno strumento sviluppato come parte di un sistema di gestione più ampio ospiti <BR> Sviluppato da ximiodev, una società dedicata allo sviluppo di sowftare, focalizzata sulla fornitura la migliore soluzione per ogni cliente.<br><br>Si prega di contattarci al <a href=\"mailto:info@smartbellboy.com/\">info@smartbellboy.com</a> o <a href=\"mailto:info@smartbellboy.com/\">info@ximiodev.com</a><br>.<a href=\"https://www.smartebellboy.com/\">https://www.smartebellboy.com/</a><br><a href=\"https://www.ximiodev.com/\">https://www.ximiodev.com/</a><br> "
};
