var uri = function() {
    var uri = App.rootURI;
    _.each(arguments, function(item) {
        uri += item + '/';
    });
    return uri.substring(0, uri.length - 1);
}

function formToJSON(selector) {
  var json = {}
  _.each(selector.serializeArray(), function(item) {
    if (_.has(json, item.name)) {
      if (_.isArray(json[item.name])) {
        json[item.name].push(item.value);
      } else {
        json[item.name] = [json[item.name], item.value];
      }
    } else {
      json[item.name] = item.value;  
    }
  });
  return json;
}

/**
 * Init the I18n with language specified
 */
function setLanguage(language) {
  localStorage.language = language;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'languages/' + language + '.json', false);
  xhr.send(null);

  if (xhr.status == 200) {
    var response = JSON.parse(xhr.responseText);

    Globalize.culture(language);
    Globalize.addCultureInfo( language, {
      messages: response,
    });  
  }

}

function __(stringToTranslate){
  return Globalize.localize(stringToTranslate, Globalize.culture()) || stringToTranslate;
}

/*
 * Login next h5 users
 */
function loginOrHome(data) {
  if (typeof(sessionStorage) == undefined) {
    // in case that session storage would not be supported
    alert('NextH5 no soporta navegadores antiguos.');
  } else {
    // session storage supported
    if (data != null) {
      // if there's user data, save it on session storage
      sessionStorage.next_session = JSON.stringify(data);
    }
    if (sessionStorage.next_session == null) {
      // if next_session is not on session storage, load login
      $('#login-container').fadeIn('slow');
      new users.views.LoginView();
    } else {
      // otherwise load User model and UI
      user = new users.models.User();
      user.permissions();
      user.settings();
      user.set($.parseJSON(sessionStorage.next_session));
      initI18n(user.get("language"));
      new users.views.UserSessionInfoView();
      new users.views.UserLeftMenuView();
      $('#login-container').fadeOut('slow', function() {
        $('#container').fadeIn('slow', function() {
          var window_height = $(document).height();
          var header_height = $('.next-navbar').height();
        });
      });
    }
  }
};

var login = loginOrHome;

//Show loading spinner over html tags

var startSpinnerFunctions = {
  'div': function(container) {
    var container = $(container);
    var spinner = new Spinner().spin();
    var inner_container = $('<div>', {
      'id': 'spinner',
      'style': 'width: 50px; height: 50px; margin: 0 auto',
    });
    $(spinner.el).css({
      'top': '25px',
      'left': '25px',
    });
    inner_container.html(spinner.el);
    container.html(inner_container);
  },
  'select': function(selector) {
    var selector = $(selector);
    var option = $('<option>', {
      'text': __('Cargando...'),
    })
    selector.append(option);
    selector.attr('disabled', 'true');
  },
  'button': function(selector, options) {
    var selector = $(selector);
    var spinner = mini_spinner(selector);
    selector.data('last-content', selector.html());
    selector.html(spinner.el);
  },
  'input': function(selector) {
    var selector = $(selector);
    var target = $(selector.attr('data-spin'));
    var spinner = mini_spinner(target);
    target.html(spinner.el);
  }
}

var stopSpinnerFunctions = {
  'div': function(container) {
    var container = $(container);
    var spinner = $(container.find('#spinner')[0]);
    if (typeof(spinner) != undefined) {
      spinner.parent().remove();
    }
  },
  'select': function(selector) {
    var selector = $(selector);
    selector.html('');
    selector.removeAttr('disabled');
  },
  'button': function(target, value) {
    target = $(target);
    if (!value) {
      value = target.data('last-content');
    }
    if (target.attr('disabled')) {
      target.removeAttr("disabled");
    }
    target.html(value);
    return false;
  },
  'input': function(target, value) {
    var spin = $(target.attr('data-spin'));
    spin.text(value);
    if (target.attr('disabled')) {
      target.removeAttr("disabled");
    }
    return false;
  }
}

function startSpinner(selector, options) {
  selector = $(selector);
  if(!options) {
    options = {};
  }
  options.disabled = true;
  var $widget = $(selector);
  $widget.data('prev-text', $widget.text());
  spinerizedObjects.push($widget);

  if (options && options.disabled) {
    selector.attr("disabled", "disabled");
  }
  if($widget.is('button') || $widget.is('a')) {
    $widget.data('prev-text', $widget.html());
    startSpinnerFunctions['button'](selector, options);
  } else if($widget.is('select')) {
    startSpinnerFunctions['select'](selector);
  } else if($widget.is('input')) {
    startSpinnerFunctions['input'](selector);
  } else if($widget.is('div')) {
    startSpinnerFunctions['div'](selector);
  }
}

function stopSpinner(selector, character) {
  var $widget = $(selector);
  if (character === undefined) {
    character = 'A';
  }
  var counter = 0;
  _.each(spinerizedObjects, function(item) {
    var $item = $(item);
    if ($item.data('spin') === $widget.data('spin')) {
      spinerizedObjects.splice(counter, 1);
    }
    counter++;
  });
  if($widget.is('button')) {
    stopSpinnerFunctions['button'](selector, $widget.data('prev-text'));
  } else if($widget.is('select')) {
    stopSpinnerFunctions['select'](selector);
  } else if($widget.is('input')) {
    stopSpinnerFunctions['input'](selector, character);
  } else if($widget.is('div')) {
    stopSpinnerFunctions['div'](selector);
  }
}

/*
progress_effect

  Add or remove the progress effect to a minimized window
  params: 
    string action, the action to apply (add or remove)
    string id, the id of the window that we desire to apply the effect
*/

function progress_effect(action, id) {
  if (action == 'add') {
    $('#min-' + id).find('.vitrine-title-container-min').addClass('progress-bar');
  } else if (action == 'remove') {
    $('#min-' + id).find('.vitrine-title-container-min').removeClass('progress-bar');
  }
}

/**
 * Generic functions
 */

$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};

//Format number

function numberFormat(number, decimals, dec_point, thousands_sep) {
  // Formats a number with grouped thousands  
  // Strip all characters but numerical ones.
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

function downloadTextFile(content) {
  var uriCom = encodeURIComponent(content);
  document.location = 'data:text/csv;charset=utf-8,' + uriCom;
}

function tableToCSV(table) {
  var content = '';
  var rows = table.children('tbody').children('tr');
  for (var i = 0; i < rows.size(); i++) {
    var columns = $(rows[i]).children('td');
    var line = '';
    for (var j = 0; j < columns.size(); j++) {
      var column = $(columns[j]).text().replace(/\s+/g, '');
      line += column + ',';
    }
    content += line.substring(0, line.length - 1) + '\n';
  }
  return content;
}


function str_pad (input, pad_length, pad_string, pad_type) {
    var half = '',
        pad_to_go;

    var str_pad_repeater = function (s, len) {
        var collect = '',
            i;

        while (collect.length < len) {
            collect += s;
        }
        collect = collect.substr(0, len);

        return collect;
    };

    input += '';
    pad_string = pad_string !== undefined ? pad_string : ' ';

    if (pad_type != 'STR_PAD_LEFT' && pad_type != 'STR_PAD_RIGHT' && pad_type != 'STR_PAD_BOTH') {
        pad_type = 'STR_PAD_RIGHT';
    }
    if ((pad_to_go = pad_length - input.length) > 0) {
        if (pad_type == 'STR_PAD_LEFT') {
            input = str_pad_repeater(pad_string, pad_to_go) + input;
        } else if (pad_type == 'STR_PAD_RIGHT') {
            input = input + str_pad_repeater(pad_string, pad_to_go);
        } else if (pad_type == 'STR_PAD_BOTH') {
            half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
            input = half + input + half;
            input = input.substr(0, pad_length);
        }
    }

    return input;
}


function round (value, precision, mode) {
    var m, f, isHalf, sgn; // helper variables
    precision |= 0; // making sure precision is integer
    m = Math.pow(10, precision);
    value *= m;
    sgn = (value > 0) | -(value < 0); // sign of the number
    isHalf = value % 1 === 0.5 * sgn;
    f = Math.floor(value);

    if (isHalf) {
        switch (mode) {
        case 'PHP_ROUND_HALF_DOWN':
            value = f + (sgn < 0); // rounds .5 toward zero
            break;
        case 'PHP_ROUND_HALF_EVEN':
            value = f + (f % 2 * sgn); // rouds .5 towards the next even integer
            break;
        case 'PHP_ROUND_HALF_ODD':
            value = f + !(f % 2); // rounds .5 towards the next odd integer
            break;
        default:
            value = f + (sgn > 0); // rounds .5 away from zero
        }
    }

    return (isHalf ? value : Math.round(value)) / m;
}

function removeSpecialCharacters(obj) {
  var value = obj.toString();
  value = value.replace("(", " ");
  value = value.replace(")", " ");
  value = value.replace(".", " ");
  value = value.replace(",", " ");
  value = value.replace("°", " ");
  value = value.replace("'", " ");
  value = value.replace("!", " ");
  value = value.replace("#", " ");
  value = value.replace("%", " ");
  value = value.replace("=", " ");
  value = value.replace("?", " ");
  value = value.replace("¡", " ");
  value = value.replace("¿", " ");
  value = value.replace("*", " ");
  value = value.replace("{", " ");
  value = value.replace("}", " ");
  value = value.replace("[", " ");
  value = value.replace("]", " ");
  value = value.replace(">", " ");
  value = value.replace("<", " ");
  value = value.replace(";", " ");
  value = value.replace(":", " ");
  value = value.replace("_", " ");
  value = value.replace("-", " ");
  value = value.replace("+", " ");
  value = value.replace("-", " ");
  value = value.replace("&", " ");
  value = value.replace("|", " ");
  value = value.replace("á", "A");
  value = value.replace("é", "E");
  value = value.replace("í", "I");
  value = value.replace("ó", "O");
  value = value.replace("ú", "U");
  value = value.replace("Á", "A");
  value = value.replace("É", "E");
  value = value.replace("Í", "I");
  value = value.replace("Ó", "O");
  value = value.replace("Ú", "U");
  value = value.replace("ü", "U");
  value = value.replace("ö", "O");
  return value;
}

function chkCard(tj) {
  var tarjeta = tj.toString();
  tarjeta = tarjeta.replace(" ", "");
  tarjeta = tarjeta.replace("-", "");
  tarjeta = tarjeta.trim();
  var str = [];
  var strArr = [];
  if(tarjeta.substr(0, 2) == "34" || tarjeta.substr(0, 2) == "37" || tarjeta.substr(0, 2) == "15")  {
    tarjeta = tarjeta.substr(0, (tarjeta.length - 4));  
  }
  
  if(tarjeta.length < 12) return false;
  for(j = 0; j < tarjeta.length; j++) strArr[j] = tarjeta.substr(j, 1);
  var sV = 0;
  strArr.reverse();
  for(j = 0; j < strArr.length; j++) {
    if((j % 2) != 0) {
      var valor = parseInt(strArr[j] * 2);
      var tmpString = valor.toString();
      if(tmpString.length == 2) {
        str[sV] = tmpString.substr(0, 1);
        sV++;
        str[sV] = tmpString.substr(1, 1);
      } else str[sV] = valor;
    } else str[sV] = strArr[j];
    sV++;
  }
  var suma = 0;
  for(j = 0; j < str.length; j++) {
    sumNum = parseInt(str[j]);
    suma = suma + sumNum;
  }
  if((suma % 10) == 0) return true;
  else return false;
}


/**
 * @usage
  calculateCurrency({
    amount: 125,
    from: 'USD',
    to: 'MN',
    fromParity: 14.25,
    toParity: 1,
    customParity: 15.65,
  });
 */
function calculateCurrency(options) {
  var amountToPay = 0;
  var parity = 1;
  var currencyDefault = user.get('settings').currency;
  if(options.from == options.to) {
    parity = 1;
    amountToPay = parseFloat(options.amount);
  } else if(options.from == currencyDefault) {
    parity = options.customParity || options.toParity;
    amountToPay = parseFloat(options.amount) / parseFloat(parity);
  } else if(options.to == currencyDefault) {
    parity = options.customParity || options.fromParity;
    amountToPay = parseFloat(options.amount) * parseFloat(parity);
  } else {
    parity = options.customParity || options.fromParity;
    amountToPay = (parseFloat(options.amount) * parseFloat(parity)) / options.toParity;
  }
  return {
    amount: amountToPay,
    parity: parity,
    currency: options.to,
  };
};

Date.prototype.addDays = function(days) {
  var date = new Date( this.getTime() + (86400000 * days) );
  return date;
};
