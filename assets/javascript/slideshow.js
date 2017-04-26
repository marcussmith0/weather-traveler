/*! slides | https://gist.github.com/mhulse/66bcbb7099bb4beae530 */
(function($) {
	
	'use strict';
	
	
		var slideshow = function() {
			var $slides = $('[data-slides]');
			var images = $slides.data('slides');
			//var count = images.length;
			var randomnum  = Math.floor(Math.random() * 14);
			console.log(randomnum);
			//console.log(count);
			var urlimage='url(assets/images/pic' + randomnum + '.jpg)';
		$slides
			.css('background-image', urlimage)
			console.log(urlimage);
			//.show(0, function() {
				//setTimeout(slideshow, 3000);
			//});
	};
	
	setInterval(slideshow, 6000);
	
}(jQuery));