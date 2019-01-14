$( document ).ready(function() {

	var alreadyUsed = [];
	function addInvoice(data)
    {
		//---------------------------------------
		if (alreadyUsed.length >= 99999999)
		{			
			showAlert('<p align="left"><b>An error has occurred!</b></p>No free invoice number found. Please contact the administrator.', '#d14040');
			disableButton(false);
			showLoader(false);
			return;
		}
		
		var number = 1 + Math.floor(Math.random() * 99999999);
		if (jQuery.inArray(number, alreadyUsed) != -1)
		{
			addInvoice(data);
			return;
		}
		else
		{
			alreadyUsed.push(number);
		}
		//---------------------------------------
		
		data['number'] = number;
		
		var posting = $.post("http://212.201.64.150/api/v1/Invoice/addInvoice", data, function() {}, "json");
		posting.done(function() {
			console.log("Invoice Created: "+number+"\nData:");
			console.log(data);
			showAlert('<b>Invoice successfully created!</b></br> ID: '+number, '#319b00');
			$('#Invoice-Number').data('number', number).html('#'+number);
			disableButton(false);
			showLoader(false);
        });
		posting.fail(function(response) {
			
			if (jQuery.isEmptyObject(response.responseJSON))
			{
				showAlert('<p align="left"><b>An error has occurred!</b></p>API not responding.', '#d14040');
			}
			else
			{
				if (response.responseJSON.error == 'Invoice already exists!')
				{
					console.log("Invoice with number '"+number+"' failed... trying again...");
					addInvoice(data);
					return;
				}
				else
				{
					showAlert('<p align="left"><b>An error has occurred!</b></p>'+response.responseJSON.error, '#d14040');
				}
			}
			
			disableButton(false);
			showLoader(false);
        });
    }
	
	function changeInvoice(data)
	{
		var number = $('#Invoice-Number').data('number');
		data['number'] = number;
		
		var posting = $.post("http://212.201.64.150/api/v1/Invoice/changeInvoice", data, function() {}, "json");
		posting.done(function() {
			console.log("Invoice Changed: "+number+"\nData:");
			console.log(data);
			showAlert('<b>Invoice successfully changed!</b></br>ID: '+number, '#319b00');
			disableButton(false);
			showLoader(false);
        });
		posting.fail(function(response) {
			
			if (jQuery.isEmptyObject(response.responseJSON))
			{
				showAlert('<p align="left"><b>An error has occurred!</b></p>API not responding.', '#d14040');
			}
			else
			{
				showAlert('<p align="left"><b>An error has occurred!</b></p>'+response.responseJSON.error, '#d14040');
			}
			
			disableButton(false);
			showLoader(false);
        });
	}

	function disableButton(bool)
	{
		$('#btn_export').prop("disabled", bool);
	}
	
	function showLoader(bool)
	{
		if (bool)
			$('#ldr_export').addClass('show');
		else
			$('#ldr_export').removeClass('show');
	}

	//--------------------------------------------
	var lastcol = '';
	var timeout = null;	
	function showAlert(txt, color)
	{
		var $alert = $('#alert_information');
		$alert.html(txt).css('background-color',color);
		if ($alert.hasClass('show'))
		{
			if (lastcol == color || color == '#d14040') //RED
			{
				if ($alert.hasClass('shake'))
					$alert.css('animation','shake2 1s').removeClass('shake');
				else
					$alert.css('animation','shake1 1s').addClass('shake');
			}
		}
		else
		{
			if (color == '#d14040') //RED
				$alert.css('animation','fadein 0.4s, shake2 1s').removeClass('shake').addClass('show');
			else
				$alert.css('animation','fadein 0.4s').removeClass('shake').addClass('show');
		}
		lastcol = color;
		if (timeout != null) clearTimeout(timeout);
		timeout = setTimeout(function(){
			$alert.css('animation','fadeout 0.5s');
			timeout = setTimeout(function(){
				$alert.removeClass('show'); timeout = null;
			}, 500);
		}, 5000);
	}
	//--------------------------------------------
	
	function columnName(td)
	{
		return td.closest('table').find('th').eq(td.index()).html();
	}
	
	$('#btn_export').click(function()
	{
		if ($('tr.edit-table').length <= 0)
		{
			showAlert('<p align="left"><b>No item found!</b></p>Your invoice need atleast one entry.', '#d14040');
			return;
		}

		if ($('tr.edit-table').length > 20)
		{
			showAlert('<b>Error!</b></br>Max. 20 rows.', '#d14040');
			return;
		}
		
		disableButton(true);
		showLoader(true);

		var data = {};

		var _d = new Date();
		data['date'] = _d.getFullYear()+"-"+_d.getMonth()+"-"+_d.getDate()+" "+_d.getHours()+":"+_d.getMinutes()+":"+_d.getSeconds();
		data['discountrate'] = 0;
		data['description'] = "";
		data['discountdate'] = "2000-01-01 00:00:00";
		data['duedate'] = "2000-01-01 00:00:00";

		var _pos_unit = [];
		var _pos_desc = [];
		var _pos_quan = [];
		var _unitprice=[];
		var _vat=[];

		var $td;
		var _error = "";
		var _exit = false;

		$('tr.edit-table').each(function() {
			var _num = $(this).index('.edit-table')+1;
			
			_pos_desc.push($(this).find(".desc").val());

			$td = $(this).find('.qty').val();
			var _quan_value = parseInt($td);
			if (isNaN(_quan_value))
			{
				_error = '<b>Incorrect input!</b></br>Column: ›'+columnName($td)+'‹ / Row: '+_num+'</br>»'+$td.text()+'« is not a integer.';
				_exit = true;
				return false;
			}
			_pos_quan.push(_quan_value);

			$td = $(this).find(".unit").val();
			var _unit_value = parseFloat($td);
			if (isNaN(_unit_value))
			{
				_error = '<b>Incorrect input!</b></br>Column: ›'+columnName($td)+'‹ / Row: '+_num+'</br>»'+$td.text()+'« is not a double.';
				_exit = true;
				return false;
			}
			_unitprice.push(_unit_value);

			$td = $(this).find(".vat").val();
			var _vat_value = parseFloat($td);
			if (isNaN(_vat_value))
			{
				_error = '<b>Incorrect input!</b></br>Column: ›'+columnName($td)+'‹ / Row: '+_num+'</br>»'+$td.text()+'« is not a double.';
				_exit = true;
				return false;
			}
			_vat.push(_vat_value);

			_pos_unit.push("€");
		});

		if (_exit)
		{
			// $('html, body').animate({ scrollTop: $td.offset().top },50);
			// $td.effect("highlight", {}, 1000);
			showAlert(_error, '#d14040');
			disableButton(false);
			showLoader(false);
			return false;
		}			
		data['pos_description'] = _pos_desc;
		data['pos_quantity'] = _pos_quan;
		data['pos_unitprice'] = _unitprice;
		data['vat'] = _vat;
		data["pos_unit"] = _pos_unit;

		data['name'] = $('#name').val();
		data['street'] = $('#street').val();
		data['zip'] = $('#zip').val();
		data['city'] = $('#city').val();
		data['country'] = $('#country').val();
		
		var _posting = $.post("http://212.201.64.150/api/v1/Login/getToken", { username: "admin", password: "admin" }, function() {}, "json");
		_posting.done(function(response) {
			data['token'] = response.result.token;
			if ($('#Invoice-Number').data('number') == null)
				addInvoice(data);
			else
				changeInvoice(data);
        });
		_posting.fail(function(response) {
			if (jQuery.isEmptyObject(response.responseJSON))
			{
				showAlert('<p align="left"><b>An error has occurred!</b></p>API not responding.', '#d14040');
			}
			else
			{
				showAlert('<p align="left"><b>An error has occurred!</b></p>'+response.responseJSON.error, '#d14040');
			}
			disableButton(false);
			showLoader(false);
        });
    
    });
	
	$('.new-invoice').click(function()
	{
		//location.reload();   //Old Just Reload Site
		
		if ($('#Invoice-Number').html() == '<i>New</i>')
			showAlert('Invoice Cleared', '#003da0');
		else
			showAlert('New Invoice', '#003da0');
		
		$("#sum").html("0.00");
		$('input').val("");
		$('.edit-table').remove();
		$('.table-add').trigger('click');  //$('#table').find('table').append($('#table').find('tr.hide').clone(true).removeClass('hide table-line').addClass("edit-table")); (Simulates Click)
		$('#Invoice-Number').removeData('number').html('<i>New</i>');
	});
	
	$('#btn_dev').click(function()
	{

		/*
		var login = { username: "admin", password: "admin" };
        var posting = $.post("http://212.201.64.150/api/v1/Login/getToken", login, function() {}, "json");
        posting.done(function(response) {
			var data = {};
			data['token'] = response.result.token;
			data['number'] = '1';//$('').text();
			
			//var post2 = $.post("http://212.201.64.150/api/v1/Invoice/getInvoices", data, function() {}, "json");
			var post2 = $.post("http://212.201.64.150/api/v1/Invoice/getInvoiceByNumber", data, function() {}, "json");
			post2.done(function(response) {
			});
			post2.fail(function() {
				alert('Receiving Invoice failed.');
			});
        });
        posting.fail(function() {
            alert('Receiving token failed.');
        });*/

		//showAlert("This is funny!", "#d14040");
		//$('#alert_information').addClass('run-animation');//.effect('shake');
		//$('tr.edit-table').html();
		
		/* -- Delete All But No Permission :(
		var login = { username: "admin", password: "admin" };
        var posting = $.post("http://212.201.64.150/api/v1/Login/getToken", login, function() {}, "json");
        posting.done(function(response) {
			var data = {};
			data['token'] = response.result.token;
		
			var post2 = $.post("http://212.201.64.150/api/v1/Invoice/getInvoices", data, function() {}, "json");
			post2.done(function(response) {
				jQuery.each( response.result, function( i, val ) {
					data['number'] = val.number;
					var post3 = $.post("http://212.201.64.150/api/v1/Invoice/removeInvoice", data, function() {}, "json");
				});
			});

        });
        posting.fail(function() {
            alert('Receiving token failed.');
        });
		*/
	});
	
	/* ==== some test to only allow numbers
	function isInputNumber(evt)
	{
		var key = evt.keyCode || evt.charCode;
		var ch = String.fromCharCode(evt.which);
		if (!(/[0-9]/.test(ch)) && !(key == 8))
		{
			evt.preventDefault();
		}
	}
	
	$('.qty').keypress(function(event) { isInputNumber(event); });
	*/
});