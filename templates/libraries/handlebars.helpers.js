/**
Equals
Description:
Return true if value 1 is equals to value 2
Example:
{{#equals 1 1}} Action {{#/equals}}
*/
Handlebars.registerHelper("equals", function(v1, v2, block) {
  return v1 === v2 ? block.fn(this) : '';
});

/**
Greater 
Description:
Return true if value 1 is greater to value 2
Example:
{{#gt 4 2}} Action {{#/gt}}
*/
Handlebars.registerHelper("gt", function(v1, v2, block) {
  return v1 > v2 ? block.fn(this) : '';
});

Handlebars.registerHelper("has", function(object, attribute, block) {
  if (_.isArray(object)) {
    return _.indexOf(object, attribute) >= 0 ? block.fn(this) : '';
  } else if(_.isObject(object)) {
    return _.has(object, attribute) ? block.fn(this) : '';  
  }
  return '';
});

/**
number_format
Description:
format a number
Example:
{{number_format number 2}}
*/
Handlebars.registerHelper("number_format", function(number, decimals) {
  return number_format (number, decimals);
});

/*
sum
Description:
a plus b
Example:
{{#sum 2 5}}
*/
Handlebars.registerHelper("index", function(a, b) {
  return a[b];
});

/**
translate
Description:
Translate a string
Example:
{{__ "lorem ipsum"}}
*/
Handlebars.registerHelper("__", function(string) {
  return __(string);
});

/**
get_var_app
Description:
get a variable define in global App
Example:
{{get_var_app "patterns.date"}}
*/
Handlebars.registerHelper("app", function(path, defaultValue) {
  return App.get(path, defaultValue);
});

hbs.registerHelper("combo", function(start, stop, selected) {
  var start = start == "today" ? new Date().getFullYear() : parseInt(start, 10);
  var stop = stop == "today" ? new Date().getFullYear() : parseInt(stop, 10);
  var selected = parseInt(selected, 10);
  var html = '';
  _.range(start, stop + 1).forEach(function(i) {
    var option = '<option value="' + i + '">' + i + '</option>';
    if ( i == selected ) {
      option = '<option selected value="' + i + '">' + i + '</option>';
    }
    html += option;
  });
  return new hbs.SafeString(html);
});

hbs.registerHelper('safe', function(string) {
  console.log(string);
  return hbs.SafeString(string);
});

Handlebars.registerHelper("each_with_index", function(array, fn) {
  var buffer = "";
  for (var i = 0, j = array.length; i < j; i++) {
    var item = array[i];
    var index = i + 1
    if (_.isObject(item)) {
      item.index = index;  
    }
    else {
      item = {index: index, value: item};
    }
    buffer += fn(item);
  
  }
  return buffer;
});
