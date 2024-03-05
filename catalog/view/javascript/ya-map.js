if (document.querySelector('#map')) {
	ymaps.ready(function () {
		var map = new ymaps.Map("map", {
			center: [47.284458, 39.799823],
			zoom: 14,
			controls: [],
		});
		map.behaviors.disable('scrollZoom')
	});
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ5YS1tYXAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYXAnKSkge1xuXHR5bWFwcy5yZWFkeShmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIG1hcCA9IG5ldyB5bWFwcy5NYXAoXCJtYXBcIiwge1xuXHRcdFx0Y2VudGVyOiBbNDcuMjg0NDU4LCAzOS43OTk4MjNdLFxuXHRcdFx0em9vbTogMTQsXG5cdFx0XHRjb250cm9sczogW10sXG5cdFx0fSk7XG5cdFx0bWFwLmJlaGF2aW9ycy5kaXNhYmxlKCdzY3JvbGxab29tJylcblx0fSk7XG59Il0sImZpbGUiOiJ5YS1tYXAuanMifQ==
