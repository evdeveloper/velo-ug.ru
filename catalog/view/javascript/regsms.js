var regsms_timer;

$(document).on('click', '.regsms_open', function (e) {
	$('#regsmsModal').load( 'index.php?route=extension/module/regsms', function(e) {

		var mask = $('#regsmsModal .selected-country-mask').val();
		var placeholder = $('#regsmsModal .selected-country-placeholder').val();
		getMask(mask,placeholder);
		$('#regsmsModal').modal();
	});


	
});

$(document).on('click', '#regsmsModal .select-country', function (e) {
	$(this).toggleClass('active');
	if ($(this).hasClass('active')) {
		$('#regsmsModal .countries-list').slideDown();
	} else {
		$('#regsmsModal .countries-list').slideUp();
	}
});

$(document).mouseup(function (e) {
    var container = $('#regsmsModal .select-country');
    if (container.has(e.target).length === 0){
        container.find('.countries-list').slideUp();
        container.removeClass('active');
    }
});

$(document).on('click', '#regsmsModal .countries-list .item-country', function (e) {
	var mask = $(this).find('.item-country-mask').val();
	var placeholder = $(this).find('.item-country-placeholder').val();
	var region = $(this).find('.item-country-region').val();
	var img = $(this).find('.item-country-img').attr('src');

	$('#regsmsModal .selected-country-img').attr('src',img);
	$('#regsmsModal .selected-country-image').attr('title',region);

	getMask(mask,placeholder);
});

$(document).on('click', '#regsmsModal .offer a', function (e) {
	$('#regsmsOfferModal').load('index.php?route=extension/module/regsms/offer', function(e) {

		$('#regsmsOfferModal').modal();
	});
	
});

$(document).on('click', '#regsmsModal .modal-footer.smscode .no_code', function (e) {
	$('#regsmsModal').load( 'index.php?route=extension/module/regsms', function(e) {
		var mask = $('#regsmsModal .selected-country-mask').val();
		var placeholder = $('#regsmsModal .selected-country-placeholder').val();
		getMask(mask,placeholder);
	});
});




$(document).on('click', '#regsmsModal .regsms_auth', function (e) {
	var code = encodeURIComponent($('#regsmsModal .smscode-code').val());
	var telephone = encodeURIComponent($('#regsmsModal .smscode-telephone').val());

	$.ajax({
	    url: 'index.php?route=extension/module/regsms/auth',
	    type: 'post',
	    data: 'telephone=' + telephone + '&code=' + code,
	    dataType: 'json',
	    crossDomain: true,
	    beforeSend: function() {
	    	$('#regsmsModal .regsms_auth').button('loading');
	    },
	    complete: function() {
	   		$('#regsmsModal .regsms_auth').button('reset');
	    },
	    success: function(json) {

	    	$('#regsmsModal .smscode-code').removeClass('error');

	    	if (json['error']) {
	    		$('#regsmsModal .smscode-code').addClass('error');
	    	}

	    	if (json['success']) {

	    		if (json['redirect']) {
	    			location.href = json['redirect'];
	    		} else {
	    			location.reload();
	    		}
	    		
	    	}

	    },
	    error: function(xhr, ajaxOptions, thrownError) {
	    	alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
	    }
	});
});

$(document).on('click', '#regsmsModal .regsms_send_code', function (e) {

	var telephone = encodeURIComponent($('#regsmsModal #regsms-input-telephone').val());
	
	$.ajax({
	    url: 'index.php?route=extension/module/regsms/sendcode',
	    type: 'post',
	    data: 'telephone=' + telephone,
	    dataType: 'json',
	    crossDomain: true,
	    beforeSend: function() {
	    	$('#regsmsModal .regsms_send_code').button('loading');
	    },
	    complete: function() {
	   		$('#regsmsModal .regsms_send_code').button('reset');
	    },
	    success: function(json) {
	    	
	    	/*$('#regsmsModal').load('index.php?route=extension/module/regsms/form_code&telephone=' + encodeURIComponent('+79505831828'), function(e) {

	    	});*/

	    
	    	$('#regsmsModal .error').removeClass('error');
	    	$('#regsmsModal .info').html('');

	    	if (json['error']) {
	    		if (json['error']['telephone']) {
	    			$('#regsmsModal #regsms-input-telephone').addClass('error');
	    		}
	    		if (json['error']['session']) {
	    			$('#regsmsModal .info').html(json['error']['session']);
	    			clearInterval(regsms_timer);
	    			var time = parseInt($('#regsmsModal .info .time').html());
	    			if (time > 0) {
		    			regsms_timer = setInterval(function () {
		    				
		    				
		    				time = time - 1;
		    				$('#regsmsModal .info .time').html(time);
		    				if (time <= 0) {
		    					clearInterval(regsms_timer);
		    					$('#regsmsModal .info').html('');
		    				}
		    			}, 1000);
		    		}
	    		}
	    	} else {
	    		console.dir(json)
	    		$('#regsmsModal').load('index.php?route=extension/module/regsms/form_code&telephone=' + encodeURIComponent(json['telephone']), function(e) {


	    		});
	    	}
		    //console.log(json);

	    },
	    error: function(xhr, ajaxOptions, thrownError) {
	    	alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
	    }
	});
});





function getMask(mask = '',placeholder = '') {
	$('#regsms-input-telephone').mask(mask).attr('placeholder',placeholder);
}