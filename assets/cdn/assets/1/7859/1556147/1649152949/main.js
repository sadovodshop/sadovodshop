!function(r){r.fn.pick=function(t){for(var n=t||4,i=[],e=this.length,a=0;e>a;a++)i.push(a);var f=function(r){for(var t,n,i=r.length;i;t=parseInt(Math.random()*i),n=r[--i],r[i]=r[t],r[t]=n);return r},s=f(i).slice(0,n);return this.each(function(t){if(-1===r.inArray(t,s))r(this).remove();else{var n=r(this).find("img");n.attr("src",n.attr("data-original"))}}).filter(function(){return null===this.parentNode?!1:!0})}}(jQuery);

function declOfNum(number, titles) {
	cases = [2, 0, 1, 1, 1, 2];
	return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

//Magic Zoom Plus
var mzOptions = {
	expandZoomMode: 'off',
	zoomPosition: 'inner',
	textBtnClose: 'Закрыть',
	textBtnNext: 'Вперед',
	textBtnPrev: 'Назад',
	hint: 'off'
};

$(function(){
	$('[data-fancybox]').fancybox({
		touch: false,
		backFocus: false,
		smallBtn: true
	});
	
	/*products slider*/
	if(template == 'article'){
		slide_992 = 3;
		slide_1200 = 4;
	}else{
		slide_992 = 4;
		slide_1200 = 5;
	}
	$('.products-slider').owlCarousel({
		items:5,
		slideBy:5,
		margin:20,
		loop:false,
		autoplay:false,
		dats:false,
		nav:true,
		navText:['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
		autoHeight:false,
		responsiveClass:true,
		responsive:{
			0:{
				items:2,
				slideBy:2,
				margin:10,
				dots:true,
				nav:true
			},
			768:{
				items:3,
				slideBy:3,
				margin:20,
				dots:true,
				nav:true
			},
			992:{
				items:slide_992,
				slideBy:slide_992,
				margin:20,
				dots:false,
				nav:true
			},
			1200:{
				items:slide_1200,
				slideBy:slide_1200,
				margin:20,
				dots:false,
				nav:true
			}
		},
		onDrag: onDrag.bind(transient),
		onDragged: onDragged.bind(transient)
	});
	
	var transient = {};
	var mobileCarousel = $('.owl-carousel-mobile')
	function buildCarousel(){
		mobileCarousel.owlCarousel({
			items:4,
			slideBy:4,
			margin:20,
			loop:false,
			autoplay:false,
			dots:true,
			nav:false,
			autoHeight:false,
			responsiveClass:true,
			responsive:{
				0:{
					items:2,
					slideBy:2,
					margin:10,
					nav:false
				},
				768:{
					items:3,
					slideBy:3,
					margin:20,
					nav:false
				},
				992:{
					items:3,
					slideBy:3,
					margin:20,
					nav:false
				},
				1200:{
					items:4,
					slideBy:4,
					margin:20,
					nav:false
				}
			},
			onDrag: onDrag.bind(transient),
			onDragged: onDragged.bind(transient)
		});
	}
	function onDrag(event) {
		this.initialCurrent = event.relatedTarget.current();
	}
	function onDragged(event) {
		var owl = event.relatedTarget;
		var draggedCurrent = owl.current();
		if (draggedCurrent > this.initialCurrent) {
			owl.current(this.initialCurrent);
			owl.next();
		} else if (draggedCurrent < this.initialCurrent) {
			owl.current(this.initialCurrent);
			owl.prev();
		}
	}
	/*---*/
	
	/*slider*/
	$('#slider').owlCarousel({
		items:1,
		loop:true,
		autoplay:true,
		nav:true,
		navText:['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>']
	});
	/*---*/
	
	/*cart*/
	function loadCart(){
		$.ajax({
			url: '/cart_items.json',
			type: 'get',
			dataType: 'json'
		}).fail(function(e){
			//
		}).done(function(e){
			loadCartItems(e,'update');
		});
	}
	
	loadCart();
	
	$('body').on('click','.js-cart-item-remove',function(e){
		e.preventDefault();
		objTmp = $(this);
		showLoader();
		$('.cart-item-'+objTmp.data('id')).addClass('cart-item-removed');
		$.ajax({
			url: '/cart_items/'+objTmp.data('id'),
			type: 'post',
			data: {_method: 'delete'},
			dataType: 'json'
		}).fail(function(){
			//
		}).always(function(){
			if(template == 'cart'){
				$('.cart-item-'+objTmp.data('id')).slideUp(200,function(){
					$(this).remove();
					updateCart();
				});
			}
		});
		return false;
	});
	
	$('.js-cart-coupon-check').on('click', function(e) {
		e.preventDefault();
		showLoader();
		updateCart();
	});
	
	$('.js-cart-coupon-reset').on('click', function(e) {
		e.preventDefault();
		$('#cart-coupon').val('');
		showLoader();
		updateCart();
	});
	
	var updateDelay;
	var clickDelay = false;
	var itemValTmp = 0;
	
	$('.js-cart-item-count').click(function(e){
		e.preventDefault();
		clearTimeout(updateDelay);
		var item = $(this).data('id');
		var itemInput = $('.cart-item-quantity-input-'+item);
		var itemText = $('.cart-item-quantity-'+item);
		var itemVal = parseInt(itemInput.val());
		if(clickDelay == false){
			itemValTmp = parseInt(itemInput.val());
			clickDelay = true;
		}
		var itemMaxVal = ($(this).data('quantity') != '') ? $(this).data('quantity') : 999;
		if(itemVal > itemMaxVal){
			itemVal = itemMaxVal;
			itemInput.val(itemVal);
			itemText.html(itemVal);
		}else{
			switch($(this).data('action')){
				case 'minus':
					// Уменьшаем
					if(itemVal > 1){
						itemVal--;
						itemInput.val(itemVal);
						itemText.html(itemVal);
					}
					break;
					case 'plus':
					// Прибавляем
					if(itemVal < itemMaxVal){
						itemVal++;
						itemInput.val(itemVal);
						itemText.html(itemVal);
					}
					break;
					default:
					//
				}
			}
			$('.cart-item-total-price-'+item).html(InSales.formatMoney($(this).data('price')*itemVal, cv_currency_format));
			if(template == 'cart' && itemVal != itemValTmp){
				updateDelay = setTimeout(function(){
					clickDelay = false;
					showLoader();
					updateCart();
				}, 500);
			}
		});
	var input_keyup = false;
	$('body').on('keyup', 'input[type=number]', function(){
		input_keyup = true;
	})
	$('body').on('blur', 'input[type=number]', function(){
		var max = parseInt(($(this).attr('max') != '') ? $(this).attr('max') : 999);
		var val = parseInt($(this).val());
		if(isNaN(val) ){
			max = 1;
			$(this).val(max);
		}else{
			if(val > max){
				$(this).val(max);
			}
		}
		//$('.js-cart-item-quantity-input').trigger('keyup');
	});
	$('body').on('blur keyup', '.js-cart-item-quantity-input', function(){
		clearTimeout(updateDelay);
		var item = $(this).data('id');
		var itemInput = $('.cart-item-quantity-input-'+item);
		var itemVal = parseInt(itemInput.val());
		var itemMaxVal = parseInt(($(this).attr('max') != '') ? $(this).attr('max') : 999);
		if(isNaN(itemVal)){
			itemVal = 0;
		}else{
			if(itemVal > itemMaxVal){
				$(this).val(itemMaxVal);
				itemVal = itemMaxVal;
			}
		}
		$('.cart-item-total-price-'+item).html(InSales.formatMoney(itemInput.data('price')*itemVal, cv_currency_format));
		$('.cart-item-quantity-'+item).html(itemVal);
		if(template == 'cart' && input_keyup && itemVal > 0){
			updateDelay = setTimeout(function(){
				clickDelay = false;
				showLoader();
				updateCart();
			}, 200);
		}
		input_keyup = false;
	});
	
	function updateCart(){
		var form = $('#cartform');
		var fields = form.serialize();
		$.ajax({
			url: form.attr('action')+'.json',
			type: 'post',
			data: fields,
			dataType: 'json'
		}).success(function(response){
			loadCartItems(response,'add');
			$('.cart-coupon-error').hide();
			$('.cart-coupon-reset').hide();
			$('.cart-items-price').html(InSales.formatMoney(response.total_price, cv_currency_format));
			if(response.discounts.length > 0){
				$('.cart-discounts').show();
				$('.cart-discounts-amount').html(InSales.formatMoney(response.discounts[0].amount, cv_currency_format));
				$('.cart-discounts-description').html(response.discounts[0].description);
				$('.cart-coupon-reset').show();
			}else{
				$('.cart-discounts').hide();
				if(response.order.coupon != '' && response.status == 'error'){
					$('.cart-coupon-error').html(response.errors[0]).show();
					$('.cart-coupon-reset').show();
				}
			}
		});
	}
	
	var cartStatusTimer;
	
	function loadCartItems(obj,action){
		$('.js-cart-count').html(obj.items_count);
		if(obj.items_count > 0){
			$('.js-cart-total').html(InSales.formatMoney(obj.total_price, cv_currency_format));
			$('.js-cart-count').addClass('is-active');
			$('.icons-top-cart').addClass('is-active');
			var cartText = '';
			if(action == 'update'){
				$.each(obj.order_lines, function(i,item){
					//$('.cart-add-variant-'+item.variant_id).html('<i class="fa fa-check" aria-hidden="true"></i>УЖЕ В КОРЗИНЕ');
					cartText += '<li class="mini-cart__item mini-cart__item__'+item.variant_id+'"><div class="mini-cart__image-container"><a href="#" class="mini-cart__remove js-cart__remove icon-cross__container" data-action="_remove-product" data-id="'+item.variant_id+'"><i class="icon-cross"></i></a><img class="mini-cart__image" src="'+item.image_url+'"></div><div class="product__meta"><h2 class="product__title"><a href="/product?product_id='+item.product_id+'">'+item.quantity+' x '+item.title+'</a></h2><span class="product__price"><span class="money">'+InSales.formatMoney(item.sale_price, cv_currency_format)+'</span></span></div></li>';
				});
			}else{
				$.each(obj.items, function(i,item){
					//$('.cart-add-variant-'+item.variant_id).html('<i class="fa fa-check" aria-hidden="true"></i>УЖЕ В КОРЗИНЕ');
					cartText += '<li class="mini-cart__item mini-cart__item__'+item.variant_id+'"><div class="mini-cart__image-container"><a href="#" class="mini-cart__remove js-cart__remove icon-cross__container" data-action="_remove-product" data-id="'+item.variant_id+'"><i class="icon-cross"></i></a><img class="mini-cart__image" src="'+item.product.first_image.thumb_url+'"></div><div class="product__meta"><h2 class="product__title"><a href="'+item.product_url+'">'+item.quantity+' x '+item.title+'</a></h2><span class="product__price"><span class="money">'+InSales.formatMoney(item.sale_price, cv_currency_format)+'</span></span></div></li>';
				});
			}
			setTimeout(function(){
				changeLoader('<i class="fa fa-check animate" aria-hidden="true"></i>');
				setTimeout(function(){
					hideLoader();
				}, 400);
			}, 200);
		}else{
			$('.icons-top-cart .js-cart-total').html('пусто');
			$('.js-cart-count').removeClass('is-active');
			$('.icons-top-cart').removeClass('is-active');
			if(template == 'cart'){
				if($('#cartform').length){
					$('#cartform').remove();
					$('.cart-page').append('<section class="text"><p>В вашей корзине пока пусто.</p></section>');
					setTimeout(function(){
						changeLoader('<i class="fa fa-check animate" aria-hidden="true"></i>');
						setTimeout(function(){
							hideLoader();
						}, 400);
					}, 200);
				}
			}
		}
	}
	
	if(template != 'cart'){
		$('body').on('click','.js-cart-add',function(e){
			clearTimeout(cartStatusTimer);
			//showLoader();
			$.fancybox.close();
			$.fancybox.open({
				src: '<div class="message cart"><h2 class="text-center">Товар добавлен в корзину</h2><div class="row"><div class="col-xs-6"><button class="button button-empty button-block" data-fancybox-close>Продолжить покупки</button></div><div class="col-xs-6"><a href="/cart_items" class="button button-green button-block">Перейти в корзину</a></div></div></div>',
				type: 'inline',
				touch: false,
				backFocus: false,
				smallBtn: true
			});
			cartStatusTimer = setTimeout(function(){
				$.fancybox.close();
			}, 6000);
		});
		var updateCart = function(response){
			loadCartItems(response,'add');
		}
		initAjaxAddToCartButton('.js-cart-add', updateCart);
	}
	
	function showLoader(){
		if(!$('.loader').length){
			$('body').append('<div class="loader"><i class="loader-svg animate"></i></div>');
			$('.loader').fadeIn(200);
		};
	}
	
	function changeLoader(msj){
		if($('.loader').length){
			$('.loader').append(msj).addClass('loader-complete');
		}
	}
	
	function hideLoader(){
		if($('.loader').length){
			$('.loader').fadeOut(200,function(){
				$('.loader').remove();
			});
		}
	}
	/*---*/
	
	/*menus*/
	var activeObj = null;
	var slideMenu = false;
	
	$('body').on('click', function(e){
		//if($(document).width() <= 666){
			if($(e.target.closest('.js-noclick')).length > 0){
				console.log(1)
			}else{
				slideMenu = true
				if(slideMenu && $(e.target.closest('.js-noclick-target')).length == 0){
					$('.js-noclick').hide();
					slideMenu = false;
					$('.is-visible').removeClass('is-visible');
					activeObj = null;
				}else{
					activeObj = null;
				}
			}
		//}
	});
	
	$('.js-nav-menu-trigger').on('click',function(e){
		e.preventDefault();
		if(activeObj != null){
			$('.js-noclick').hide();
			activeObj = null;
		}
		$('.top_table-contacts-desktop').hide();
		$this = $(this);
		activeObj = $('.nav-menu-links');
		slideMenu = false;
		$('.nav-menu-links').slideToggle(200,function(){	
			$this.toggleClass('is-visible');
			if($this.hasClass('is-visible')){
				slideMenu = true;
			}else{
				slideMenu = false;
			}
		});
	});
	
	hideMenuTimer = false;
	$('.js-menu-title-wide, .sidebar-simple .menu').on('mouseenter',function(e){
		if(hideMenuTimer != false){
			clearTimeout(hideMenuTimer);
		}
		$('.js-menu-title-wide').addClass('is-hover');
		$('.sidebar-simple .menu').addClass('is-active');
	}).on('mouseleave',function(e){
		hideMenuTimer = setTimeout(function(){
			$('.js-menu-title-wide').removeClass('is-hover');
			$('.sidebar-simple .menu').removeClass('is-active');
			hideMenuTimer = false;
		}, 10);
		
	});
	
	$('.js-menu-title').on('click',function(e){
		e.preventDefault();
		$(this).toggleClass('menu-title-active');
		$('.menu').slideToggle(400);
	});
	
	$('.js-menu-trigger').on('click',function(e){
		e.preventDefault();
		$(this).toggleClass('fa-minus');
		$(this).parent().next().removeClass('animate').slideToggle(200);
	});
	
	$('.js-top-contacts').on('click',function(e){
		e.preventDefault();
		if(activeObj != null){
			$('.js-noclick').hide();
			activeObj = null;
		}
		$('.nav-menu-links').hide();
		$this = $(this);
		activeObj = $('.top_table-contacts-desktop');
		slideMenu = false;
		$('.top_table-contacts-desktop').slideToggle(200,function(){	
			$this.toggleClass('is-visible');
			if($this.hasClass('is-visible')){
				slideMenu = true;
			}else{
				slideMenu = false;
			}
		});
	});
	/*---*/
	
	/*tabs*/
	$('.tab').on('click',function(e){
		e.preventDefault();
		if($(document).width() > 500){
			var tabClick = $(this);
			var tabId = tabClick.data('id');
			if(!tabClick.hasClass('tab-active')){
				$('.tab').removeClass('tab-active');
				$('.tab-content').hide();
				tabClick.addClass('tab-active');
				$('#'+tabId+'-content').show();
			}
		}
	});
	$('.tab-mobile').on('click',function(e){
		e.preventDefault();
		if($(document).width() <= 500){
			var tabClick = $(this);
			var tabId = tabClick.data('id');
			tabClick.toggleClass('tab-active');
			$('#'+tabId+'-content').slideToggle(200);
		}
	});
	/*---*/
	
	/*collection page*/
	$('.products-order a').on('click',function(e){
		e.preventDefault();
		$('#order').val($(this).attr('rel')).prop('disabled',false);
		$('#characteristics').submit();
	});
	
	$('.js-filter-item-checkbox').on('change',function(e){
		e.preventDefault();
		$(this).parent().toggleClass('filter-item-active');
		//$('#characteristics').submit();
	});
	
	$('.js-filter-hidden-toggle').on('click', function(){
		$('.'+$(this).data('rel')).toggle();
		$(this).toggleClass('is-active');
		if($(this).hasClass('is-active')){
			$(this).text('Скрыть варианты');
		}else{
			$(this).text('Ещё варианты');
		}
	})
	
	$('.ion-range-slider').ionRangeSlider({
		type: 'double',
		hide_min_max: true,
		force_edges: true,
		onFinish: function(data){
			//$('#characteristics').submit();
		}
	});
	
	$('.ion-range-slider').on('change',function(){
		$('.js-range-'+$(this).data('input')+'-min').val($(this).data('from'));
		$('.js-range-'+$(this).data('input')+'-max').val($(this).data('to'));
	});
	
	$('.js-sidebar-filter-trigger').on('click',function(e){
		e.preventDefault();
		$(this).toggleClass('sidebar-block-filter-button-active');
		$('.sidebar-filter').slideToggle(400);
	});
	/*---*/
	
	/*product page*/
	$('.js-product-images-list').owlCarousel({
		items:5,
		slideBy:1,
		nav:true,
		navText:['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
		dots:false,
		margin:15
	});
	/*---*/
	
	/*scroll to top*/
	$('.js-scroll-top').on('click',function(e){
		e.preventDefault();
		$('html, body').animate({scrollTop: 0}, 400);
	});
	/*---*/
	
	/*wishlist / favorites*/
	var Favorite = new Favorites({
		onUpdate: function(data){
			if(data.favorites.size > 0){
				$('.js-wishlist-count').addClass('is-active');
				$('.icons-top-wishlist').addClass('is-active');
			}else{
				$('.js-wishlist-count').removeClass('is-active');
				$('.icons-top-wishlist').removeClass('is-active');
			}
			$('.js-wishlist-count').html(data.favorites.size);
			if($('.js-wishlist--full').length > 0){
				if(data.favorites.size > 0){
					$('[data-clear-favorites]').show();
					$('.js-wishlist--empty').hide().html('');
					productList = '';
					$.each(data.products, function(index,product){
						productList += '<div class="col-md-3 col-sm-4 col-xs-6"><div class="product animate" data-product-id="'+product.id+'">';
						productList += '<div class="product-image"><a href="'+product.url+'"><img src="'+product.first_image.large_url+'" class="img-responsive" width="480" height="480" alt=""></a><button type="button" data-favorites-trigger="'+product.id+'" class="product-favorites is-added"><i class="fa fa-heart-o" aria-hidden="true"></i></button></div>';
						productList += '<h2 class="product-title"><a href="'+product.url+'">'+product.title+'</a></h2>';
						productList += '<p class="product-price"><span class="product-price-sale">'+InSales.formatMoney(product.variants[0].price, cv_currency_format)+'</span> <span class="product-price-old">'+InSales.formatMoney(product.variants[0].old_price, cv_currency_format)+'</span></p>';
						productList += '<form action="#"><a href="'+product.url+'" class="button button-small button-fa button-green"><i class="fa fa-info" aria-hidden="true"></i><span>Подробнее</span></button></form>';
						productList += '</div></div>';
					})
					$('.js-wishlist--full').show().html(productList);
				}else{
					$('[data-clear-favorites]').hide();
					$('.js-wishlist--empty').show().html('<p>В вашем избранном пока пусто.</p>');
					$('.js-wishlist--full').hide().html('');
				}
			}
		},
		onInit: function(data){
			
		}
	});	
	
	$('[data-clear-favorites]').on('click', function(e){
		$('[data-clear-favorites]').hide();
		$('.js-wishlist-count').removeClass('is-active');
		$('.js-wishlist-count').html('0');
		$('.icons-top-wishlist').removeClass('is-active');
		$('.js-wishlist--empty').show().html('<p>В вашем избранном пока пусто.</p>');
		$('.js-wishlist--full').hide().html('');
	});
	/*---*/
	
	/*Отзывы*/
	$('.review-add').on('click', function(e){
		e.preventDefault();
		$('.review-form-place').toggleClass('hidden');
	});
	$('.js-review-all').on('click', function(e){
		e.preventDefault();
		$('.review').removeClass('hidden');
		$('.product-reviews--all').addClass('hidden');
	});
	$('.js-review-show-rated').on('click', function(e){
		e.preventDefault();
		if($(this).data('rate-size') > 0){
			$('.review').addClass('hidden');
			$('.review.rating'+$(this).data('rate')).removeClass('hidden');
		}
		$('.product-reviews--all').removeClass('hidden');
	});
	/*---*/
	
	/*resize*/
	var firstLoad = true;
	var firstWidth = $(window).width();
	function eventResize(){
		if($(window).width() > 991){
			var $thisExtraMenu = $('.nav-extra-items');
			$thisExtraMenu.each(function(){
				$thisMenu = $(this);
				var $thisExtraMenuWidth = $thisMenu.width();
				var $thisExtraPupup = $('.nav-extra-more-sub-content', $thisMenu);
				$thisExtraPupup.html('');
				if($thisExtraMenuWidth > 0){
					var $thisExtraPupupLink = $('.nav-extra-item--more', $thisMenu);
					$thisExtraPupupLink.addClass('hidden');
					$thisMenu.addClass('nav-extra-items--overflow');
					var $thisExtraWidthSum = 0;
					$('.js-nav-extra-item', $thisMenu).removeClass('hidden');
					$('.js-nav-extra-item', $thisMenu).each(function(){
						$thisItem = $(this);
						$thisExtraWidthSum += $thisItem.outerWidth();
						if($thisExtraWidthSum + $thisExtraPupupLink.width() + 20 > $thisExtraMenuWidth){
							$thisItem.addClass('hidden');
							$thisExtraPupup.append('<li>'+$thisItem.html()+'</li>');
							$thisExtraPupupLink.removeClass('hidden');
							$thisMenu.removeClass('nav-extra-items--overflow');
						}
					});
				}
			})
		}
		if($(window).width() > 991){
			mobileCarousel.trigger('destroy.owl.carousel');
		}else{
			buildCarousel();
		}
		if(firstLoad || firstWidth != $(window).width()){
			activeTab = $('.tab.tab-active').data('id');
			$('.tab').removeClass('tab-active');
			$('.tab-mobile').removeClass('tab-active');
			$('.tab-content').hide();
			$('[data-id="'+activeTab+'"]').addClass('tab-active');
			$('#'+activeTab+'-content').show();
			if($(document).width() <= 500 && InsalesThemeSettings.product_tab_open != '1'){
				$('.tab-mobile.tab-active').next().hide();
				$('.tab-mobile.tab-active').removeClass('tab-active');
				if(location.hash == '#review_form' || location.hash == '#comments'){
					$('.tab-mobile[data-id="tab-reviews"]').next().show();
					$('.tab-mobile[data-id="tab-reviews"]').addClass('tab-active');
				}
			}
			firstLoad = false;
		}
		firstWidth = $(window).width();
	}

	$(window).on('load resize', function(){
		eventResize();
		getScroll();
	});
	
	function getScroll(){
		if($(window).scrollTop() < 350){
			$('.scroll-top').removeClass('is-active');
		}else{
			$('.scroll-top').addClass('is-active');
		}
	}
	
	$(window).on('scroll', function(){
		getScroll();
	});
	/*---*/
	
	/*feedback*/
	$('.js-form-callback').InSalesFeedback({
		require: ['phone'],
		useAgree: true,
		showMessageAgree: true,
		hideErrorOnFocus: false,
		includeProductInfo: false,
		hideSuccessMessageTimer: 1000,
		errorMessages: {
			phone: 'Укажите корректный номер телефона в международном формате'
		},
		onSuccess: function(data){
			$.fancybox.close();
			$.fancybox.open({
				src: '<div class="message"><h2>Отлично!</h2><p>Заявка успешно отправлена. Наш менеджер свяжется с Вами в ближайшее время.</p></div>',
				type: 'inline',
				touch: false,
				backFocus: false,
				smallBtn: true
			});
			setTimeout(function(){
				$.fancybox.close();
			}, 4000);
		},
		onFail: function(data){
			$.fancybox.close();
			$.fancybox.open({
				src: '<div class="message"><h2>Ой!</h2><p>При отправке произошла ошибка, попробуйте позже.</p></div>',
				type: 'inline',
				touch: false,
				backFocus: false,
				smallBtn: true
			});
		}
	});
	/*---*/

	// Question
	$('.js-form-callback-q').InSalesFeedback({
		require: ['email', 'content'],
		useAgree: true,
		showMessageAgree: true,
		hideErrorOnFocus: false,
		includeProductInfo: true,
		hideSuccessMessageTimer: 1000,
		errorMessages: {
			email: 'Укажите корректный email'
		},
		onSuccess: function(data){
			$.fancybox.close();
			$.fancybox.open({
				src: '<div class="message"><h2>Отлично!</h2><p>Вопрос успешно отправлен. Наш менеджер ответит вам в ближайшее время.</p></div>',
				type: 'inline',
				touch: false,
				backFocus: false,
				smallBtn: true
			});
			setTimeout(function(){
				$.fancybox.close();
			}, 4000);
		},
		onFail: function(data){
			console.log(data);
			$.fancybox.close();
			$.fancybox.open({
				src: '<div class="message"><h2>Ой!</h2><p>При отправке произошла ошибка, или вы не заполнили капчу.</p></div>',
				type: 'inline',
				touch: false,
				backFocus: false,
				smallBtn: true
			});
		}
	});
	
	/*search*/
	$('#search-widget-input').autocomplete({
		noCache: false,
		deferRequestBy: 300,
		preserveInput: true,
		formatResult: function (i, currentValue) {
			var a = $('#search-widget-input').autocomplete();
			var pattern = '(' + a.currentValue.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&") + ')';
			return '<a href="'+i.url+'">'+(i.img ? '<div class="img" style="background-image:url('+i.img+');"></div>' : '') + '<div class="title"><span>' + i.value.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>') + '</span></div> ' + (i.price ? '<em>' + parseInt(i.price) + ' руб.</em>' : '') +'</a>';
		},
		maxHeight:1000,
		minLength: 2,
		appendTo: '.search-variants',
		onSearchComplete: function(query, suggestions) {
			$('.search-variants').hide();
			var p = [];
			for(var k = 0; k < suggestions.length; k++) {
				p[k] = suggestions[k].data;
			}
			Products.getList(p).done(function(data) {
				var a = $('#search-widget-input').autocomplete();
				var pattern = '(' + a.currentValue.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&") + ')';
				var p = [];
				var j = 0;
				for(var k in data) {
					var i = data[k];
					var img = false;
					if(typeof i.first_image != 'undefined' && typeof i.first_image.small_url != 'undefined') {
						img = i.first_image.small_url;
					}
					p[j] = {
						url: i.url,
						img: img,
						value: i.title,
						price: i.price,
						data: i.id
					}
					j++;
				}
				$('#search-widget-input').autocomplete().processResponse({'suggestions': p}, a.getQuery(a.currentValue), false);
				$('.search-variants').fadeIn();
			});
			//$('#search-widget-input').autocomplete().hide();
		},
		serviceUrl: '/search_suggestions?fields%5B%5D=price_min&fields%5B%5D=price_min_available&account_id='+Site.id+'&hide_items_out_of_stock='+Site.hide_items_out_of_stock+'&locale='+Site.locale,
		paramName: 'query', 
		onSelect: function (suggestion) {
			console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
		}
	});
	/*---*/
	
	/*phone mask*/
	$('[type="tel"]').mask('+7 (000) 000-00-00', {
		//placeholder: '+7 (___) ___-__-__',
		clearIfNotMatch: true,
		onChange: function(cep, e, currentField){
			$valLength = currentField.val().length;
			$valNew = '';
			if($valLength < 4){
				$valLength = 0;
			}else if(e.keyCode == '8' || e.keyCode == '229'){
				$valLength = 100;
			}
			switch($valLength){
				case 0:
				currentField.val('+7 (');
				break;
				case 7:
				$valNew = currentField.val()+') ';
				currentField.val($valNew);
				break;
				case 12:
				$valNew = currentField.val()+'-';
				currentField.val($valNew);
				break;
				case 15:
				$valNew = currentField.val()+'-';
				currentField.val($valNew);
				break;
				default:
					//
				}
			}
		});
	$('body').on('focusin', '[type="tel"]', function(){
		if($(this).val().length == 0){
			$(this).val('+7 (');
		}
	});
	/*---*/
	
	$('.js-footer-block-toggle').on('click', function(){
		$(this).toggleClass('is-active').next().slideToggle();
	});
	
	if(!$.cookie('privacy_show') && InsalesThemeSettings.privacy_active == 1 && InsalesThemeSettings.privacy_popup == 1){
		setTimeout(function(){
			$('.privacy-popup').addClass('is-open');
		}, InsalesThemeSettings.privacy_popup_delay * 1000);
	}
	$('.js-privacy-popup-accept').on('click', function(e){
		$.cookie('privacy_show', true, {expires: 7, path: '/'});
		$('.privacy-popup').removeClass('is-open');
	});
	
	//instafeed
	if($('#instafeed').length > 0){
		var userFeed = new Instafeed({
			get: 'user',
			userId: $('#instafeed').data('userid'),
			accessToken: $('#instafeed').data('accesstoken'),
			limit: 6,
			resolution: 'standard_resolution',
			template: '<div class="col col-xs-4 col-sm-2 col-md-6 col-lg-6"><a href="{{link}}" class="image-type-{{type}}" target="_blank" style="background-image: url({{image}});"><span class="instafeed-hover"><span><i class="fa fa-heart"></i>{{likes}}</span><span><i class="fa fa-comment" aria-hidden="true"></i>{{comments}}</span></span></a></div>',
			success: function(responsive){
				var user = responsive.data[0].user;
				$('.instafeed-title').html('<table><tr><th><a href="https://www.instagram.com/'+user.username+'/" target="_blank"><img src="'+user.profile_picture+'"></a></th><td><span>Мы в Instagram</span><a href="https://www.instagram.com/'+user.username+'/" target="_blank">'+user.full_name+'</a></td></tr></table>');
			}
		});
		userFeed.run();
	}
});
