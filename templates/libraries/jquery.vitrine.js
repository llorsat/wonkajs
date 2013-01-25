/*======================================================================================
 * vitrine - jQuery Plugin (v0.4 alpha)
 * Copyright 2012, Grupo Llorsat
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *======================================================================================
 * Authors:
 * Guillermo Alvarado - guillermoalvarado89@gmail.com
 * Julian Ceballos - julian@pikhub.com
 *
 *======================================================================================
 * Project Website:
 * http://localhost
 *
 * Requires Easing Plugin for Window Animations:
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Requires Less library to parse the style:
 * Less Dynamic stylesheet language v1.3.0 - http://lesscss.org/
 *
 * Requires jQuery UI to advanced effects:
 * jQuery User Interface v1.8.18 - http://jqueryui.com/
 *
 *======================================================================================
 */
 (function($){
    $.fn.extend({ 
        //plugin name - vitrine
        vitrine: function(options) {
            // Settings
            var defaults = {
                Title: 'Title',
                PositionTop: 0,  /* Pixels or percentage */
                PositionLeft: 0, /* Pixels or percentage */
                Width: 300,       /* Pixels or percentage */
                Height: 300,      /* Pixels or percentage */
                MinWidth: 200, 
                MinHeight: 0,
                AnimationSpeed: 300,
                Animation: 'easeOutExpo',
                CanBeMinimized: true,
                CanBeClosed: true,
                CanBeDraggable: true,
            };
            var options = $.extend(defaults, options);
            // For each component that can contain the jQuery object that invokes this function
            this.each(function() {
                var vitrine = $(this);
                var o = options;
                // Inserting window structure
                var title_container = 
                    "<div class='vitrine-title-container'>" +
                        "<div class='vitrine-buttons'>" +
                            "<div class='vitrine-button vitrine-min-button icon-minus-sign'>" +
                            "</div>" +
                            "<div class='vitrine-button vitrine-close-button icon-remove-sign'>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                    "<div class='vitrine-title-header'><p class='vitrine-title'></p></div>" +
                    "<div class='vitrine-content'>"+
                    "</div>";
                vitrine.prepend(title_container);
                // Own vars
                var $vitrine_title = vitrine.find('.vitrine-title');
                var $close_button = vitrine.find('.vitrine-close-button');
                var $min_button = vitrine.find('.vitrine-min-button');
                var $max_button = vitrine.find('.vitrine-max-button');
                $footer = $('#vitrine-footer');
                // Set up of the window
                $vitrine_title.text(o.Title);
                vitrine.width(o.Width);
                vitrine.height(o.Height);
                vitrine.css('position', 'absolute');
                vitrine.css('top', o.PositionTop);
                vitrine.css('left', o.PositionLeft);
                if(o.PositionTop == 'auto'){
                    var h = $(window).height() - $('#vitrine-footer').height();
                    var margin = (h - parseInt(o.Height))/2;
                    o.PositionTop = (margin + parseInt(o.Height)) * -1;
                    vitrine.css('top', o.PositionTop);
                }
                if(o.PositionLeft == 'auto'){
                    o.PositionLeft = ($(window).width() - parseInt(o.Width)) / 2;
                    vitrine.css('left', o.PositionLeft);
                }
                // To set the focus when user click in the window
                vitrine.bind('click focus-vitrine', function(){
                    focus(vitrine)
                });
                // Enable draggable functionality
                if (o.CanBeDraggable) {
                    vitrine.draggable({
                        handle: '.vitrine-title-container, .vitrine-title-header',
                        start: function() {
                            // Set the focus when drag event starts
                            focus(vitrine);
                        },
                        stop: function(){
                            o.PositionTop = vitrine.css('top');
                            o.PositionLeft = vitrine.css('left');
                        }
                    });
                }
                // Buttons events when the window is in his regular state
                // Event to close the window
                if (o.CanBeClosed) {
                    // Event to minimize the window
                    var closeAction = function() {
                        vitrine.remove();
                    }
                    $close_button.click(closeAction);
                    vitrine.bind("close-vitrine", closeAction);
                } else {
                    $close_button.hide();
                }
                // If can not be minimized, hide min button
                if (o.CanBeMinimized) {
                    // Event to minimize the window
                    $min_button.click(function() {
                        $max_button.hide();
                        $min_button.hide();
                        minimize_vitrine(vitrine, o);
                    });
                } else {
                    $min_button.hide();
                }
                // Event to maximize the window
                $max_button.click(function() {
                    // code goes here
                });
            });
            // Functions
            function focus(vitrine){
                // Function to set the focus to the window
                $('.vitrine').each(function(){
                    if($(this).hasClass('vitrine-active')) {
                        $(this).removeClass('vitrine-active');
                    }
                });
                vitrine.addClass('vitrine-active');  
            }
            function minimize_vitrine(vitrine, o){
                // Function to minimize the window
                // Showing background of the footer                
                var id = vitrine.attr('id');
                // Calculating new size and position
                var height_title = vitrine.find('.vitrine-title-container').height();
                var height = height_title;
                var width = (100 / 6.5);
                var number_of_minimized = $('.min').size() != null ? $('.min').size(): 0;
                var top = number_of_minimized >= 6 ? 50: 0;
                var left;
                var $min_vitrine = $('#min-'+id);
                if($min_vitrine.size() == 0) {
                  if (top == 0){
                    left = number_of_minimized * (($(window).width() * width) / 100);
                    $('#vitrine-footer').css('height', '40px');
                  } else {
                      left = (number_of_minimized - 6) * (($(window).width() * width) / 100);
                      $('#vitrine-footer').css('height', '75px');
                  }
                } else {
                  top = $min_vitrine.attr('data-top');
                  left = $min_vitrine.attr('data-left');
                }
                
                width = width.toString() + '%';
                var min_version = "<div style='display:none; width:" + width + "; height: " + height + "px;' class='min' id ='min-" + id + "' data-top='"+top+"' data-left='"+left+"'>" +
                                    "<div class='vitrine-title-container-min'><span style='width: 100%;'>" +
                                        "<div class='vitrine-title'>" + o.Title + "</div>" +
                                        "<div class='vitrine-buttons'>" +
                                            "<div class='vitrine-button vitrine-close-button  icon-remove-sign'>" +
                                            "</div>" +
                                        "</div>" +
                                    "</span></div>" +
                                  "</div>";
                // Adding the min version of the window
                if($min_vitrine.size() == 0) {
                  $footer.append(min_version);
                  $min_vitrine = $('#min-' + id);
                }
                $min_close_button = $min_vitrine.find('.vitrine-close-button');
                // Set new size and position
                vitrine.animate({
                    width: width,
                    height: height,
                    top: top,
                    left: left,
                }, {
                    queue: false,
                    duration: o.AnimationSpeed,
                    easing: o.Animation,
                    complete: function() {
                        vitrine.hide();
                        $min_vitrine = $('#min-' + id);
                        $min_vitrine.show();
                    }
                });
                // Events when the window is minimized
                // Event to restore the window
                $min_vitrine.bind('click restore-vitrine', function(){
                    $min_vitrine.hide();
                    vitrine.show();
                    focus(vitrine);
                    var number_of_minimized = $('.min').size() != null ? $('.min').size(): 0;
                     if (number_of_minimized < 7) {
                        $('#vitrine-footer').css('height', '40px');
                    } else {
                        $('#vitrine-footer').css('height', '75px');
                    }
                    vitrine.find('.vitrine-max-button').show();
                    vitrine.find('.vitrine-min-button').show();
                    vitrine.animate({ 
                        width: o.Width, 
                        height: o.Height,
                        top: o.PositionTop,
                        left: o.PositionLeft,
                    }, {
                        queue: false,
                        duration: o.AnimationSpeed,
                        easing: o.Animation,
                    });
                });
                // Event to close the window
                $min_close_button.bind('click', function(){
                    $min_vitrine.remove();
                    vitrine.remove();
                });
            }
        }
    });
})(jQuery);
