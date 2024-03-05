window.addEventListener("DOMContentLoaded", function () {
	[].forEach.call(document.querySelectorAll('.tel'), function (input) {
		var keyCode;
		function mask(event) {
			event.keyCode && (keyCode = event.keyCode);
			var pos = this.selectionStart;
			if (pos < 3) event.preventDefault();
			var matrix = "+7 (___) ___ ____",
				i = 0,
				def = matrix.replace(/\D/g, ""),
				val = this.value.replace(/\D/g, ""),
				new_value = matrix.replace(/[_\d]/g, function (a) {
					return i < val.length ? val.charAt(i++) : a
				});
			i = new_value.indexOf("_");
			if (i != -1) {
				i < 5 && (i = 3);
				new_value = new_value.slice(0, i)
			}
			var reg = matrix.substr(0, this.value.length).replace(/_+/g,
				function (a) {
					return "\\d{1," + a.length + "}"
				}).replace(/[+()]/g, "\\$&");
			reg = new RegExp("^" + reg + "$");
			if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
				this.value = new_value;
			}
			if (event.type == "blur" && this.value.length < 5) {
				this.value = "";
			}
		}

		input.addEventListener("input", mask, false);
		input.addEventListener("focus", mask, false);
		input.addEventListener("blur", mask, false);
		input.addEventListener("keydown", mask, false);

	});

});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYXNrLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG5cdFtdLmZvckVhY2guY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGVsJyksIGZ1bmN0aW9uIChpbnB1dCkge1xuXHRcdHZhciBrZXlDb2RlO1xuXHRcdGZ1bmN0aW9uIG1hc2soZXZlbnQpIHtcblx0XHRcdGV2ZW50LmtleUNvZGUgJiYgKGtleUNvZGUgPSBldmVudC5rZXlDb2RlKTtcblx0XHRcdHZhciBwb3MgPSB0aGlzLnNlbGVjdGlvblN0YXJ0O1xuXHRcdFx0aWYgKHBvcyA8IDMpIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR2YXIgbWF0cml4ID0gXCIrNyAoX19fKSBfX18gX19fX1wiLFxuXHRcdFx0XHRpID0gMCxcblx0XHRcdFx0ZGVmID0gbWF0cml4LnJlcGxhY2UoL1xcRC9nLCBcIlwiKSxcblx0XHRcdFx0dmFsID0gdGhpcy52YWx1ZS5yZXBsYWNlKC9cXEQvZywgXCJcIiksXG5cdFx0XHRcdG5ld192YWx1ZSA9IG1hdHJpeC5yZXBsYWNlKC9bX1xcZF0vZywgZnVuY3Rpb24gKGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gaSA8IHZhbC5sZW5ndGggPyB2YWwuY2hhckF0KGkrKykgOiBhXG5cdFx0XHRcdH0pO1xuXHRcdFx0aSA9IG5ld192YWx1ZS5pbmRleE9mKFwiX1wiKTtcblx0XHRcdGlmIChpICE9IC0xKSB7XG5cdFx0XHRcdGkgPCA1ICYmIChpID0gMyk7XG5cdFx0XHRcdG5ld192YWx1ZSA9IG5ld192YWx1ZS5zbGljZSgwLCBpKVxuXHRcdFx0fVxuXHRcdFx0dmFyIHJlZyA9IG1hdHJpeC5zdWJzdHIoMCwgdGhpcy52YWx1ZS5sZW5ndGgpLnJlcGxhY2UoL18rL2csXG5cdFx0XHRcdGZ1bmN0aW9uIChhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFwiXFxcXGR7MSxcIiArIGEubGVuZ3RoICsgXCJ9XCJcblx0XHRcdFx0fSkucmVwbGFjZSgvWysoKV0vZywgXCJcXFxcJCZcIik7XG5cdFx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXlwiICsgcmVnICsgXCIkXCIpO1xuXHRcdFx0aWYgKCFyZWcudGVzdCh0aGlzLnZhbHVlKSB8fCB0aGlzLnZhbHVlLmxlbmd0aCA8IDUgfHwga2V5Q29kZSA+IDQ3ICYmIGtleUNvZGUgPCA1OCkge1xuXHRcdFx0XHR0aGlzLnZhbHVlID0gbmV3X3ZhbHVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGV2ZW50LnR5cGUgPT0gXCJibHVyXCIgJiYgdGhpcy52YWx1ZS5sZW5ndGggPCA1KSB7XG5cdFx0XHRcdHRoaXMudmFsdWUgPSBcIlwiO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBtYXNrLCBmYWxzZSk7XG5cdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIG1hc2ssIGZhbHNlKTtcblx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCBtYXNrLCBmYWxzZSk7XG5cdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgbWFzaywgZmFsc2UpO1xuXG5cdH0pO1xuXG59KTsiXSwiZmlsZSI6Im1hc2suanMifQ==
