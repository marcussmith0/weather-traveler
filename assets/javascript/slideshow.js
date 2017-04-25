(function($) {
	
	'use strict';
	
	var $slides = $('[data-slides]');
	var images = $slides.data('slides');
	var count = images.length;
	var slideshow = function() {
		$slides
			.css('background-image', 'url("' + images[Math.floor(Math.random() * count)] + '")')
			.show(0, function() {
				setTimeout(slideshow, 3000);
			});
	};
	
	slideshow();
	
}(jQuery));