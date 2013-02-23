function setC() {
	$.removeCookie('therm_f', 'false');

}

function setF() {
        $.cookie('therm_f', 'true');

}

function convert(d) {
//  form.fahrenheit.value = form.celsius.value*1.8+32;

	if ($.cookie('therm_f'))
		return d * 1.8 + 32;
	else 
		return d;
}


