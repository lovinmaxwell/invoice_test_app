$( document ).ready(function() {

	function addInvoice(data)
    {
		var number = 1 + Math.floor(Math.random() * 999999999);
		data['number'] = number;
		
		var posting = $.post("http://212.201.64.150/api/v1/Invoice/addInvoice", data, function() {}, "json");
		posting.done(function() {
			console.log("Invoice Exported: "+number+"\nData:");
			console.log(data);
			showAlert('<b>Invoice successfully exported!</b></br> ID: '+number, '#319b00');
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

	function disableButton(bool)
	{
		$('#btn_export').prop("disabled", bool);
	}
	
	function showLoader(bool)
	{
		if (bool)
		{
			$('#ldr_export').addClass('show');
		}
		else
		{
			$('#ldr_export').removeClass('show');
		}
	}
	
	var timeout = null;	
	function showAlert(txt, color)
	{
		$('#alert_information').html(txt).css('background-color',color).css('animation','fadein 0.2s').addClass('show');
		if (timeout != null) clearTimeout(timeout);
		timeout = setTimeout(function(){
			$('#alert_information').css('animation','fadeout 0.5s');
			timeout = setTimeout(function(){
				$('#alert_information').removeClass('show'); timeout = null;
			}, 500);
		}, 5000);
	}
	
	$('#btn_dev').click(function()
	{
		var login = { username: "admin", password: "admin" };
        var posting = $.post("http://212.201.64.150/api/v1/Login/getToken", login, function() {}, "json");
        posting.done(function(response) {
			var data = {};
			data['token'] = response.result.token;
			data['number'] = "719762231";
			
			//var post2 = $.post("http://212.201.64.150/api/v1/Invoice/getInvoices", data, function() {}, "json");
			var post2 = $.post("http://212.201.64.150/api/v1/Invoice/getInvoiceByNumber", data, function() {}, "json");

        });
        posting.fail(function() {
            alert('Receiving token failed.');
        });
		//showAlert("This is funny!", "#d14040");
	});
	
	$('#btn_export').click(function()
	{
		if ($('.edit-table').length <= 0)
		{
			showAlert('<b>Input is wrong!</b></br>No rows found.', '#d14040');
			return;
		}
		
		disableButton(true);
		showLoader(true);

		var data = {};

		var d = new Date();
		data['date'] = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
		data['discountrate'] = 0;
		data['description'] = "";
		data['discountdate'] = "2000-01-01 00:00:00";
		data['duedate'] = "2000-01-01 00:00:00";
		data["pos_unit"] = [""];

		var pos_desc = [];
		var pos_quan = [];
		var unitprice=[];
		var vat=[];

		var exit = false;
		$('.edit-table').each(function() {
			pos_desc.push($(this).find(".desc").text());
				
			var quan_value = parseInt($(this).find(".qty").text());
			if (isNaN(quan_value))
			{
				showAlert('<b>Input is wrong!</b></br>»'+$(this).find(".qty").text()+'« is not a number.', '#d14040');
				exit = true;
				return;
			}
			pos_quan.push(quan_value);

			var unit_value = parseFloat($(this).find(".unit").text());
			if (isNaN(unit_value))
			{
				showAlert('<b>Input is wrong!</b></br>»'+$(this).find(".unit").text()+'« is not a number.', '#d14040');
				exit = true;
				return;
			}
			unitprice.push(unit_value);

			var vat_value = parseFloat($(this).find(".vat").text());
			if (isNaN(vat_value))
			{
				showAlert('<b>Input is wrong!</b></br>»'+$(this).find(".vat").text()+'« is not a number.', '#d14040');
				exit = true;
				return;
			}
			vat.push(vat_value);
		});
		if (exit)
		{
			disableButton(false);
			showLoader(false);
			return;
		}			
		data['pos_description'] = pos_desc;
		data['pos_quantity'] = pos_quan;
		data['pos_unitprice'] = unitprice;
		data['vat'] = vat;
		
		//data['addressid'] = 1;
		data['name'] = $('#name').val();
		data['street'] = $('#street').val();
		data['zip'] = $('#zip').val();
		data['city'] = $('#city').val();
		data['country'] = $('#country').val();
		
		var posting = $.post("http://212.201.64.150/api/v1/Login/getToken", { username: "admin", password: "admin" }, function() {}, "json");
		posting.done(function(response) {
			data['token'] = response.result.token;
			addInvoice(data);
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
    
    });
});