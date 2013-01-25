function openVitrine() {
  var args = arguments;
  var objConf = args[0];
  if (vitrineOpened(objConf.vitrineId)) {
    restoreVitrine(objConf.vitrineId);
    return false;
  }

  if (typeof(objConf.minimizable) === 'undefined') {
    objConf.minimizable = true;
  }
  if (typeof(objConf.closable) === 'undefined') {
    objConf.closable = true;
  }
  if (typeof(objConf.draggable) === 'undefined') {
    objConf.draggable = true;
  }

  var vitrine = $('<div>', {
    'class': 'vitrine vitrine-active',
    'id': objConf.vitrineId
  });
  var drawVitrine = function() {
    $('#vitrine-footer').append(vitrine);
    vitrine.vitrine({
      Title: objConf.vitrineTitle || "",
      PositionTop: 'auto',
      PositionLeft: 'auto',
      Width: objConf.vitrineWidth || '750px',
      Height: objConf.vitrineHeight || '620px',
      CanBeMinimized: objConf.minimizable,
      CanBeClosed: objConf.closable,
      CanBeDraggable: objConf.draggable,
    });
  }

  checkMaxVitrines(function() {
    drawVitrine();
    startSpinner(vitrine.find(".vitrine-content"));
    if (args.length == 2) {
      args[1]();
    }
  });

  return true;
}

function restoreVitrine(vitrineId) {
  if (!vitrineOpened(vitrineId)) return false;
  if ($('div#min-' + vitrineId).length > 0) {
    $("div#min-" + vitrineId).trigger("restore-vitrine");
    return true;
  }
  $("div.vitrine#" + vitrineId).trigger("focus-vitrine");
}

function vitrineOpened(vitrineId) {
  return $('#' + vitrineId).size() > 0;
}

function vitrineWarning(callback) {
  var vitrine_dialog = $('<div>', {
    'class': 'vitrine vitrine-active',
    'id': 'exceed-limit-message',
  });
  $('#vitrine-footer').append(vitrine_dialog);
  vitrine_dialog.vitrine({
    Title: 'Atención',
    PositionTop: 'auto',
    PositionLeft: 'auto',
    Width: '400px',
    Height: '150px',
    CanBeMinimized: false,
    CanBeDraggable: false,
  });
  var to_close = $('.vitrine:first');
  var message = '<p class="message">Ya no puedes abrir mas ventanas, deseas cerrar una, para poder abrir otra nueva ventana.</p>' + '<div class="dialog-controls"><input type="button" id="close-first" class="btn-primary" value="Si, quiero cerrarlo" />' + '<input type="button" id="not-close" class="btn-danger" value="No, dejemoslo así" /></div>';
  vitrine_dialog.children('.vitrine-content').html(message);
  // Dialog actions
  $('#not-close').click(function() {
    vitrine_dialog.find('.vitrine-close-button').click();
  });
  $('#close-first').click(function() {
    // Closing vitrine
    $('#' + to_close.attr('id')).remove();
    // Closing minimized version of vitrine
    $('#min-' + to_close.attr('id')).click().remove();
    // Adding new vitrine
    vitrine_dialog.find('.vitrine-close-button').click();
    if (callback) {
      callback();
    }
    return false;
  });
};

function checkMaxVitrines(callback) {
  var vitrinesAmount = $('.vitrine').size() != null ? $('.vitrine').size(): 0;
  if (vitrinesAmount < App.vitrines.max) {
    callback();
  } else {
    vitrineWarning(function() {
      callback();
    });
  }
}
