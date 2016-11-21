/**
 * Created by alone on 21.11.16.
 */
var counterData = {
	0: {
		one:    'секунда',
		two:    'секунды',
		five:   'секунд'
	},
	1: {
		one:    'минута',
		two:    'минуты',
		five:   'минут'
	},
	2: {
		one:    'час',
		two:    'часа',
		five:   'часов'
	},
	3: {
		one:    'день',
		two:    'дня',
		five:   'дней'
	}
}

function getLabel(number, options){
	if((number % 100 - number % 100 % 10) != 10){
		if(number % 10 == 1){
			return options.one;
		}else if(number % 10 >= 2 && number % 10 <= 4){
			return options.two;
		}else{
			return options.five;
		}
	}else{
		return options.five;
	}
}

function counterBuild(counter, date){
	var now = new Date();
	var df = counter.getAttribute('data-format').split(':');
	if(df){
		var dfl = df.length - 1;
		var parts = new Array();
		var onepart = Math.floor((date-now)/1000);
		if(dfl){
			for(var p = 0; p < dfl; p++){
				parts[p] = Math.floor(onepart%(parseInt(df[dfl - p]) + 1));
				parts[p + 1] = Math.floor(onepart/(parseInt(df[dfl - p]) + 1));
				onepart = parts[p + 1];
			}
			if(parts[parts.length - 1] == 0){
				parts.pop();
				df.shift();
			}
			parts = parts.reverse();
		}else{
			parts[0] = onepart;
		}
		var noTicks = true;
		for(var i = 0; i < parts.length; i++){
			if(i != 0){
				var separator = document.createElement('span');
				separator.setAttribute('class', 'separator separator' + (i - 1));
				separator.innerHTML = ':';
				counter.appendChild(separator);
			}
			var part = document.createElement('span');
			part.setAttribute('class', 'part part' + (parts.length - 1 - i));
			var label = document.createElement('span');
			label.setAttribute('class', 'digit-label');
			label.textContent = getLabel(parts[i], counterData[parts.length - 1 - i])
			counter.appendChild(part);
			for(var j = 0; j < Math.max(parts[i].toString().length, df[i].length); j++){
				var digit = document.createElement('span');
				var num = Math.floor(parts[i] / Math.pow(10,(Math.max(parts[i].toString().length, df[i].length) - 1 - j)) % 10);
				if(num){noTicks = false;}
				digit.setAttribute('class', 'digit digit' + num + (noTicks ? ' digit00' : ''));
				digit.innerHTML = df[i][j] ? df[i][j] : 9;
				part.appendChild(digit);
			}
			part.appendChild(label);
		}
		counterStart(counter);
	}
}

function counterStart(counter){
	var digits = counter.querySelectorAll('.digit');
	var intervalID = setInterval(function(){tick(counter, digits);}, counter.getAttribute('data-interval'));
	counter.setAttribute('id', intervalID);
}

function counterStop(counter){
	if(counter.getAttribute('id')){
		clearInterval(counter.getAttribute('id'));
	}
}

function tick(counter, digits){
	if(digits[digits.length - 2].getAttribute('class').replace(/\D+/g,'') == '000' && digits[digits.length - 1].getAttribute('class').replace(/\D+/g,'') == '000'){
		counterStop(counter);
		counter.parentNode.counter();
	}else{
		digitTick(digits, digits.length - 1);
	}
}

function digitTick(digits, pos){
	var d = digits[pos].getAttribute('class').replace(/\D+/g,'').charAt(0);
	var nd = d - 1;
	if((nd == 0 && pos - 1 < 0) || (nd == 0 && pos - 1 >= 0 && digits[pos - 1].getAttribute('class').replace(/\D+/g,'') == '000')){
		digits[pos].setAttribute('class', 'digit digit0 digit00');
	}else if(nd < 0){
		nd = digits[pos].innerHTML != 0 ? digits[pos].innerHTML : 9;
		digits[pos].setAttribute('class', 'digit digit' + nd + ' digit' + d + nd);
		digitTick(digits, pos - 1);
	}else{
		digits[pos].setAttribute('class', 'digit digit' + nd + ' digit' + d + nd);
	}
	var l = '';
	dg = digits[pos].parentNode.querySelectorAll('.digit');
	for(var i = 0; i < dg.length; i++){
		l += dg[i].getAttribute('class').replace(/\D+/g,'').charAt(0);
	}
	digits[pos].parentNode.querySelector('.digit-label').textContent = getLabel(parseInt(l), counterData[digits[pos].parentNode.getAttribute('class').replace(/\D+/g,'').charAt(0)]);
}

function getDate(datestr){
	if(datestr){
		datestr = datestr.split(' ');
		var date = datestr[0].split('.');
		var time = datestr[1].split(':');
		return new Date(date[2], date[1] - 1, date[0], time[0], time[1], time[2]);
	}else{
		return new Date();
	}
}

Element.prototype.counter = function(){
	var elem = this;
	elem.classList.remove('start-left');
	elem.classList.remove('end-left');
	var counter = document.createElement('span');
	counter.setAttribute('class', 'counter counter-analog');
	counter.setAttribute('data-format', elem.getAttribute('data-format'));
	counter.setAttribute('data-interval', elem.getAttribute('data-interval'));
	elem.innerHTML = '';
	elem.appendChild(counter);
	var start = getDate(elem.getAttribute('data-start'));
	var end = getDate(elem.getAttribute('data-end'));
	var now = new Date();
	if(start && start > now){
		elem.classList.add('start-left');
		counterBuild(counter, start);
		return true;
	}else if(end && end > now){
		elem.classList.add('end-left');
		counterBuild(counter, end);
		return true;
	}
	elem.remove();
	return false;
}

$('.event-mess').each(function(){ this.counter(); });