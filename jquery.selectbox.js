/*
* jQuery SelectBox - v1.1 - 11/29/2010
* http://github.com/cravler/jquery-selectbox/
*
* Copyright (c) 2010 "Cravler"
* Dual licensed under the MIT and GPL licenses.
*/
(function($) {
	$.selectbox = function() {

		if ($.browser.msie && parseInt($.browser.version) < 7) {
			return;
		}

		var config    = $.selectboxConfig;
		var _this     = this;
		var focused   = false;
		var moved     = true;
		var mouseOver = null;

		_this._onchange = _this.onchange; _this.onchange  = null;
		_this._onclick  = _this.onclick;  _this.onclick   = null;

		var list = (_this.size || _this.multiple) ? true : false;

		var elem        = $(_this).hide().change(onchangeSelect);
		var elemWidth   = $.selectboxWidth(elem.width(), list);
		var selectbox   = elem.wrap('<div class="' + config.className + (config.extraClassName ? ' ' + config.extraClassName : '') + (list ? ' list' : '') + (_this.disabled ? ' disabled' : '') + '" style="width:' + elemWidth + 'px;" />').parent('.' + config.className);
		var listVisible = list ? true : false;
		var currentHtml = '<div class="current">' + '<div class="down-arrow">&nbsp;</div>' + '<div class="title">%default_content%</div>' + '</div>';

		// Wrap select tag and provide a default option
		selectbox.append(
			currentHtml.replace('%default_content%', selectbox.find('select option:selected').text())
		);

		if ( ! list && _this.disabled) {
			return;
		}
		
		// Click outside
		selectbox.bind('clickoutside', function() {

			$(this).find('.down-arrow').removeClass('down-arrow-hover');

			if (typeof _this._onblur == 'function') {
				_this._onblur();
				_this.onblur  = _this._onblur;
				_this._onblur = null;
			}

			focused = false;
			selectbox.removeClass('focus');
			if (typeof _this._onfocus == 'function') {
				_this.onfocus  = _this._onfocus;
				_this._onfocus = null;
			}
			
			if (listVisible) {
				if ( ! list) {
					if ($.browser.msie && parseInt($.browser.version) == 7) {
						$('.' + config.className).each(function() {
							if ( ! $(this).hasClass('selected')) {
								$('.' + config.className).css('z-index', 0);
							}
						});
						selectbox.removeClass('selected');
					}
					dropdown.hide();
					listVisible = false;
				}

				if (typeof _this.onblur == 'function') {
					_this._onblur = _this.onblur;
					_this.onblur  = null;
				}

				if ( ! list) {
					focused = true;
					if (typeof _this.onfocus == 'function') {
						_this._onfocus = _this.onfocus;
						_this.onfocus  = null;
					}
				}
			}
		});

		// Hover
		if ( ! list) {
			selectbox.hover(
				function() {
					$(this).find('.down-arrow').addClass('down-arrow-hover');
				},
				function() {
					if ( ! listVisible) {
						$(this).find('.down-arrow').removeClass('down-arrow-hover');
					}
				}
			);
		}

		var dropdown = selectbox.append('<ol style="width:' + (elemWidth + config.extraListWidth) + 'px;" />').children('ol');

		var size = _this.size ? _this.size : 20;
		if (_this.options.length > size) {
			dropdown.css({
				"height" : (size * 21) + "px"
			});
		}

		$(_this).find('option').each(function() {
			var _option = this;
			var option  = $(this);

			var li = $('<li>' + '<div class="title">' + option.text() + '</div>' + '</li>');
			li.data('boxvalue', option.val());

			dropdown.append(li);

			if (list && option.attr('selected')) {
				li.addClass('li-hover');
				selectbox.children('ol').animate({scrollTop: '+=' + (li.offset().top - selectbox.children('ol').offset().top) + 'px'}, 0);
			}

			if (list && _this.disabled) {
				return;
			}

			li.hover(function() {
				if (moved && ! list) {
					mouseOver = $(this).data('boxvalue');
					dropdown.find('li').each(function() {
						$(this).removeClass('li-hover');
					});
					$(this).addClass('li-hover');
				}
			},function() {
				// unhover
			}).mousemove(function() {
				moved = true;
				option.mousemove();
			}).mouseenter(function() {
				option.mouseover();
			}).mouseleave(function() {
				option.mouseout();
			}).mousedown(function() {
				option.mousedown();
			}).mouseup(function() {
				option.mouseup();
			}).click(function() {
				if (list) {
					focused = true;
					selectbox.addClass('focus');
					if (typeof _this.onfocus == 'function') {
						_this.onfocus();
						_this._onfocus = _this.onfocus;
						_this.onfocus  = null;
					}

					if (_this.multiple) {
						if (typeof _this._onchange == 'function') {
							_this._onchange();
						}

						if (typeof _option.onclick == 'function') {
							_option.onclick();
						}

						if (typeof _this._onclick == 'function') {
							_this._onclick();
						}

						if ($(this).hasClass('li-hover')) {
							$(this).removeClass('li-hover');
						}
						else {
							$(this).addClass('li-hover');
						}
					}
					else {
						elem.val($(this).data('boxvalue'));
						dropdown.find('li').each(function() {
							$(this).removeClass('li-hover');
						});
						$(this).addClass('li-hover');
					}
				}
				else {
					elem.val($(this).data('boxvalue'));
				}
				
				if (typeof _this.onblur == 'function') {
					_this._onblur = _this.onblur;
					_this.onblur  = null;
				}

				if (_this.multiple) {
					if (option.attr('selected')) {
						option.attr('selected', false);
					}
					else {
						option.attr('selected', true);
					}
				}
				else {
					elem.change();
				}
			});
		});

		$(document).keydown(function(event) {
			if (focused) {
				if (listVisible && event.keyCode == '13') {
					dropdown.find('li').each(function() {
						if ($(this).hasClass('li-hover')) {
							elem.val($(this).data('boxvalue')).change();
							return false;
						}
					});
					return false;
				}
				else if (event.keyCode == '38' || event.keyCode == '40') {
					var prev     = null;
					var next     = null;
					var selected = mouseOver != null ? mouseOver : selectbox.find('select option:selected').val();

					moved     = false;
					mouseOver = null;

					dropdown.find('li').each(function() {
						if (selected == $(this).data('boxvalue')) {
							if (selected != selectbox.find('select option:first').val()) {
								prev = $(this).prev();
							}
							if (selected != selectbox.find('select option:last').val()) {
								next = $(this).next();
							}
						}
					});

					if (event.keyCode == '38' && prev != null) {
						if (listVisible) {
							dropdown.find('li').each(function() {
								$(this).removeClass('li-hover');
								if (prev.data('boxvalue') == $(this).data('boxvalue')) {
									var title = $(this).find('div.title').text();
									selectbox.find('.current .title').text(title);
									$(this).addClass('li-hover');

									if (($(this).offset().top - selectbox.children('ol').offset().top) < 0) {
										selectbox.children('ol').animate({scrollTop: '+=' + ($(this).offset().top - selectbox.children('ol').offset().top) + 'px'}, 0);
									}
									elem.val(prev.data('boxvalue'));
								}
							});
						}
						else {
							elem.val(prev.data('boxvalue')).change();
						}
					}
					else if (event.keyCode == '40' && next != null) {
						if (listVisible) {
							dropdown.find('li').each(function() {
								$(this).removeClass('li-hover');
								if (next.data('boxvalue') == $(this).data('boxvalue')) {
									var title = $(this).find('div.title').text();
									selectbox.find('.current .title').text(title);
									$(this).addClass('li-hover');

									if (($(this).offset().top - selectbox.children('ol').offset().top) >= dropdown.height()) {
										selectbox.children('ol').animate({scrollTop: '+=' + ($(this).offset().top - selectbox.children('ol').offset().top - dropdown.height() + 21) + 'px'}, 0);
									}
									elem.val(next.data('boxvalue'));
								}
							});
						}
						else {
							elem.val(next.data('boxvalue')).change();
						}
					}

					return false;
				}
			}
		});

		selectbox.find('.current').mousemove(function() {
			if (typeof _this.onmousemove == 'function') {
				_this.onmousemove();
			}
		}).mouseenter(function(){
			if (typeof _this.onmouseover == 'function') {
				_this.onmouseover();
			}
		}).mouseleave(function(){
			if (typeof _this.onmouseout == 'function') {
				_this.onmouseout();
			}
		}).mousedown(function() {
			if (typeof _this.onmousedown == 'function') {
				_this.onmousedown();
			}
		}).mouseup(function() {
			if (typeof _this.onmouseup == 'function') {
				_this.onmouseup();
			}
		}).click(function() {
			focused = true;
			selectbox.addClass('focus');
			if (typeof _this.onfocus == 'function') {
				_this.onfocus();
				_this._onfocus = _this.onfocus;
				_this.onfocus  = null;
			}

			if (typeof _this._onclick == 'function') {
				_this._onclick();
			}

			if (listVisible) {
				if ($.browser.msie && parseInt($.browser.version) == 7) {
					$('.' + config.className).each(function() {
						if ( ! $(this).hasClass('selected')) {
							$('.' + config.className).css('z-index', 0);
						}
					});
					selectbox.removeClass('selected');
				}

				if ( ! list) {
					dropdown.hide();
					listVisible = false;
				}
			}
			else {
				if ($.browser.msie && parseInt($.browser.version) == 7) {
					selectbox.addClass('selected');
					$('.' + config.className).each(function() {
						if ( ! $(this).hasClass('selected')) {
							$(this).css('z-index', -1);
						}
					});
				}

				listVisible = true;
				dropdown.show();

				dropdown.find('li').each(function() {
					$(this).removeClass('li-hover');
					if (selectbox.find('select option:selected').val() == $(this).data('boxvalue')) {
						$(this).addClass('li-hover');
						selectbox.children('ol').animate({scrollTop: '+=' + ($(this).offset().top - selectbox.children('ol').offset().top) + 'px'}, 0);
					}
				});
			}
		});

		return;

		function onchangeSelect() {
			var title = $(this).find('option:selected').text();
			if ( ! list) {
				selectbox.children('ol').hide();
				listVisible = false;
			}
			selectbox.find('.current .title').text(title);

			if (typeof this._onchange == 'function') {
				this._onchange();
			}

			$(this).find('option:selected').click();

			if (typeof this._onclick == 'function') {
				this._onclick();
			}
		}
	};

	$.selectboxWidth = function(elemWidth, list) {

		var config = $.selectboxConfig;
		var os     = navigator.platform;

		if (os.indexOf("Mac") != -1) {
			if ($.browser.mozilla && ! list) {
				elemWidth += 27;
			}

			if ($.browser.webkit && list) {
				elemWidth += 5;
			}

			if ( ! list) {
				elemWidth -= 2;
			}
		}
		else if (os.indexOf("Linux") != -1) {
		}
		else { // Win
			if ($.browser.webkit) {
				elemWidth += 23;
			}
		}

		elemWidth += (list ? 5 : 0);

		return elemWidth + config.extraWidth;
	};

	$.selectboxConfig = {};

	$.fn.selectbox = function(config) {
		var defaults = {
			className: 'selectbox',
			extraClassName: '',
			extraWidth: 0,
			extraListWidth: 0
		};
		$.selectboxConfig = $.extend({}, defaults, config);
		this.each($.selectbox);
		return this;
	};
})(jQuery);