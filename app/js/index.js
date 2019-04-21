jQuery(document).ready(function ($) {
	function dropdownCls(element, data) {
		this.element = element;
		this.mainNavigation = this.element.find('.navContainer');
		this.mainNavigationItems = this.mainNavigation.find('.has-dropdown');
		this.dropdownList = this.element.find('.dropdownList');
		this.dropdownWrappers = this.dropdownList.find('.dropdown');
		this.dropdownItems = this.dropdownList.find('.content');
		this.dropdownContainer = this.dropdownList.find('.submenubaseContainer');
		this.checkDevice = this.checkDeviceType();
		this.bindEvents();
	}

	dropdownCls.prototype.checkDeviceType = function () {
		//Reports two sizes ['desktop']/['mobile'] --> 1024 // Style
		var me = this;
		return window.getComputedStyle(me.element.get(0), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "").split(', ');
	};

	dropdownCls.prototype.bindEvents = function () {
		var me = this;
		this.mainNavigationItems.mouseenter(function (event) {
			me.showDropdown($(this));
		}).mouseleave(function () {
			setTimeout(function () {
				if (me.mainNavigation.find('.has-dropdown:hover').length == 0 && me.element.find('.dropdownList:hover').length == 0) {
					me.hideDropdown();
				}
			}, 60);
		});

		this.dropdownList.mouseleave(function () {
			setTimeout(function () {
				(me.mainNavigation.find('.has-dropdown:hover').length == 0 && me.element.find('.dropdownList:hover').length == 0) && me.hideDropdown();
			}, 60);
		});

		this.mainNavigationItems.on('touchstart', function (event) {
			var selectedDropdown = me.dropdownList.find('#' + $(this).data('content'));
			if (!me.element.hasClass('is-dropdown-visible') || !selectedDropdown.hasClass('active')) {
				event.preventDefault();
				me.showDropdown($(this));
			}
		});

		this.element.on('click', '.mobileNav', function (event) {
			event.preventDefault();
			me.element.toggleClass('mobileNavOpen');
		});
	};

	dropdownCls.prototype.showDropdown = function (item) {
		this.checkDevice = this.checkDeviceType();
		if (this.checkDevice == 'desktop') {
			var me = this;
			var selectedDropdown = this.dropdownList.find('#' + item.data('content')),
				selectedDropdownHeight = selectedDropdown.innerHeight(),
				selectedDropdownWidth = selectedDropdown.children('.content').innerWidth(),
				selectedDropdownLeft = item.offset().left + item.innerWidth() / 2 - selectedDropdownWidth / 2;

			this.updateDropdown(selectedDropdown, parseInt(selectedDropdownHeight), selectedDropdownWidth, parseInt(selectedDropdownLeft));
			this.element.find('.active').removeClass('active');
			selectedDropdown.addClass('active').removeClass('move-left move-right').prevAll().addClass('move-left').end().nextAll().addClass('move-right');
			item.addClass('active');
			if (!this.element.hasClass('is-dropdown-visible')) {
				setTimeout(function () {
					me.element.addClass('is-dropdown-visible');
				}, 10);
			}
		}
	};

	dropdownCls.prototype.updateDropdown = function (dropdownItem, height, width, left) {
		this.dropdownList.css({
			'-moz-transform': 'translateX(' + left + 'px)',
			'-webkit-transform': 'translateX(' + left + 'px)',
			'-ms-transform': 'translateX(' + left + 'px)',
			'-o-transform': 'translateX(' + left + 'px)',
			'transform': 'translateX(' + left + 'px)',
			'width': width + 'px',
			'height': height + 'px'
		});

		this.dropdownContainer.css({
			'-moz-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
			'-webkit-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
			'-ms-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
			'-o-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
			'transform': 'scaleX(' + width + ') scaleY(' + height + ')'
		});
	};

	dropdownCls.prototype.hideDropdown = function () {
		this.checkDevice = this.checkDeviceType();
		if (this.checkDevice == 'desktop') {
			this.element.removeClass('is-dropdown-visible').find('.active').removeClass('active').end().find('.move-left').removeClass('move-left').end().find('.move-right').removeClass('move-right');
		}
	};

	dropdownCls.prototype.resetDropdown = function () {
		this.checkDevice = this.checkDeviceType();
		if (this.checkDevice == 'mobile') {
			this.dropdownList.removeAttr('style');
		}
	};

	$.ajax({
		url: 'https://jsonblob.com/api/jsonBlob/6766327f-607d-11e9-95ef-9bcb815ba4a4',
		type: 'GET',
		dataType: 'text',
		success: function (text) {
			var dropdownObj = [];
			if ($('.headerContainer').length > 0) {
				$('.headerContainer').each(function () {
					var parsedData = JSON.parse(text);
					Object.keys(parsedData).forEach(function (key) {
						$('.navContainer>ul').append('<li class="has-dropdown" data-content="' + key + '"><a href="#">' + key + '</a></li>');
						var dynamic = "";
						parsedData[key].map(function (value, index) {
							dynamic += '<li><a href="#"><span>' + value.title + '</span><span>' + value["sub-title"] + '</span></a></li>'
						})
						$('.dropdownList>ul').append('<li id="' + key + '" class="dropdown listBlock"><div class="content"><ul>' +
							dynamic
							+ '</ul></div></li>');
					})
					dropdownObj.push(new dropdownCls($(this), text));
				});

				var resizing = false;
				updateDropdownPosition();
				$(window).on('resize', function () {
					if (!resizing) {
						resizing = true;
						(!window.requestAnimationFrame) ? setTimeout(updateDropdownPosition, 300) : window.requestAnimationFrame(updateDropdownPosition);
					}
				});

				function updateDropdownPosition() {
					dropdownObj.forEach(function (element) {
						element.resetDropdown();
					});
					resizing = false;
				};
			}
		},
		error: function (textStatus, errorThrown) {
			console.log("Service call failed!!!");
		}
	});
});
