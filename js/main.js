'use strict'
document.addEventListener('DOMContentLoaded', function () {
	const swiper = new Swiper('.swiper-popular', {
		slidesPerView: 4,
		spaceBetween: 10,
		breakpoints: {
			1920: {
				spaceBetween: 60,
			},
			1280: {
				slidesPerView: 4,
			},
			1000: {
				spaceBetween: 40,
				slidesPerView: 3,
			},
			768: {
				spaceBetween: 50,
			},
			0: {
				spaceBetween: 10,
				slidesPerView: 2,
			}

		}
	});

	const swiper2 = new Swiper('.swiper-recomendation', {
		slidesPerView: 2,
		spaceBetween: 30,
		breakpoints: {
			1920: {
				slidesPerView: 6,
			},
			1280: {
				slidesPerView: 4,
			},
			1000: {
				slidesPerView: 3,
			},
			768: {
				spaceBetween: 30,
			},
			0: {
				spaceBetween: 10,
				slidesPerView: 2,
			}

		}
	});

	const swiper3 = new Swiper('.swiper-other', {
		slidesPerView: 2,
		spaceBetween: 30,
		breakpoints: {
			1920: {
				slidesPerView: 6,
			},
			1280: {
				slidesPerView: 4,
			},
			1000: {
				slidesPerView: 3,
			},
			768: {
				spaceBetween: 30,
			},
			0: {
				spaceBetween: 10,
				slidesPerView: 2,
			}

		}
	});

	const swiper4 = new Swiper('.swiper-buy', {
		slidesPerView: 2,
		spaceBetween: 30,
		breakpoints: {
			1920: {
				slidesPerView: 6,
			},
			1280: {
				slidesPerView: 4,
			},
			1000: {
				slidesPerView: 3,
			},
			768: {
				spaceBetween: 30,
			},
			0: {
				spaceBetween: 10,
				slidesPerView: 2,
			}

		}
	});

	var galleryThumbs = new Swiper(".gallery-thumbs", {
		centeredSlides: true,
		centeredSlidesBounds: true,
		slidesPerView: 3,
		watchOverflow: true,
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
		direction: 'vertical',
		spaceBetween: 10,
	});

	var galleryMain = new Swiper(".gallery-main", {
		watchOverflow: true,
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
		preventInteractionOnTransition: true,
		pagination: {
			el: '.swiper-pagination',
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		effect: 'fade',
		fadeEffect: {
			crossFade: true
		},
		thumbs: {
			swiper: galleryThumbs
		}
	});

	const wrapSwiper = document.querySelectorAll('.swiper-goods')
	wrapSwiper.forEach((wrap, index) => {
		const counter = wrap.querySelector('.swiper-counter')
		const slidesCount = wrap.querySelectorAll('.swiper-slide')
		counter.querySelector('.counter__length').innerHTML = slidesCount.length
		const swiper5 = new Swiper('.swiper-goods', {
			slidesPerView: 1,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			observer: true,
			observeParents: true,
			runCallbacksOnInit: true,
			on: {
				slideChange: function () {
					let offer = wrap.querySelector('.swiper-counter');
					offer.innerHTML = '<span class="counter__start">' + (this.activeIndex + 1) + '</span>' + ' ... ' + slidesCount.length;
				}
			}
		})
	})

	galleryMain.on('slideChangeTransitionStart', function () {
		galleryThumbs.slideTo(galleryMain.activeIndex);
	});

	galleryThumbs.on('transitionStart', function () {
		galleryMain.slideTo(galleryThumbs.activeIndex);
	});

	function getHeaderHeight() {
		const headerHeight = document.querySelector('.header').offsetHeight
		return headerHeight
	}

	

	function bodyHidden() {
		document.querySelector('body').classList.toggle('hidden')
	}

	function setMargin() {
		const navMenu = document.querySelector('.nav-menu')
		navMenu.style.marginTop = `${getHeaderHeight()}px`
	}

	function openSubmenu() {
		const items = document.querySelectorAll('.nav-menu__item')
		items.forEach(item => {
			item.addEventListener('click', function () {
				if (item.querySelector('.submenu')) {
					item.querySelector('.submenu').classList.toggle('active')
				}
			})
		})
	}

	if (window.innerWidth < 1000) {
		openSubmenu()
	}

	function filterOpen() {
		const btns = document.querySelectorAll('.filter__block')
		btns.forEach(btn => {
			const filterContent = btn.querySelectorAll('.filter__content')
			filterContent.forEach(item => {
				item.addEventListener('click', (ev) => {
					ev.stopPropagation()
				})
			})
			// оставновил click на filter__content
			btn.addEventListener('click', function (ev) {
				ev.stopPropagation()
				if (btn.querySelector('.filter__content')) {
					btn.querySelector('.filter__content').classList.toggle('active')
					btn.querySelector('.filter__checks').classList.toggle('active')
				}
			})
		})
	}


	function openCheckFilter() {
		const btns = document.querySelectorAll('.filter__btn')
		btns.forEach(btn => {
			btn.addEventListener('click', () => {
				if (btn.nextElementSibling.classList.contains('filter__checks')) {
					btn.nextElementSibling.classList.toggle('active')
				}
			})
		})
	}

	if (document.querySelector('.filter')) {
		filterOpen()
		openCheckFilter()
		openSettings()
	}

	function openSettings() {
		const btn = document.querySelector('#openFilter')
		const filter = document.querySelector('.filter')
		btn.addEventListener('click', function (e) {
			e.preventDefault()
			const btnClose = document.querySelector('.burger')
			btnClose.classList.add('active')
			document.querySelector('body').classList.add('hidden')
			filter.classList.add('active')
			filter.style.top = `${getHeaderHeight()}px`
		})
	}

	function openMobileMenu() {
		const burger = document.querySelector('.burger')
		const menu = document.querySelector('.nav-menu')
		const actions = document.querySelector('.header__actions')
		const header = document.querySelector('header')
		const filter = document.querySelectorAll('.filter')
		burger.addEventListener('click', function () {
			const heightDocument = document.documentElement.clientHeight
			if (filter.length > 0 && filter[0].classList.contains('active')) {
				filter[0].classList.remove('active')
				this.classList.remove('active')
				document.querySelector('body').classList.remove('hidden')
			}
			else {
				this.classList.toggle('active')
				menu.classList.toggle('active')
				menu.style.height = `${heightDocument - getHeaderHeight() - 34}px`
				bodyHidden()
				actions.classList.toggle('active')
				header.classList.toggle('show-nav-menu')
			}
			setMargin()
		})
	}


	openMobileMenu()

	function selectFavorite() {
		const fav = document.querySelectorAll('.favorite')
		fav.forEach(fav => {
			fav.addEventListener('click', function () {
				this.classList.toggle('active')
			})
		})
	}

	selectFavorite()

	const showTab = (elTabBtn) => {
		const elTab = elTabBtn.closest('.tab');
		if (elTabBtn.classList.contains('tab-btn-active')) {
			return;
		}
		const targetId = elTabBtn.dataset.targetId;
		const elTabPane = elTab.querySelector(`.tab-pane[data-id="${targetId}"]`);
		if (elTabPane) {
			const elTabBtnActive = elTab.querySelector('.tab-btn-active');
			elTabBtnActive.classList.remove('tab-btn-active');
			const elTabPaneShow = elTab.querySelector('.tab-pane-show');
			elTabPaneShow.classList.remove('tab-pane-show');
			elTabBtn.classList.add('tab-btn-active');
			elTabPane.classList.add('tab-pane-show');
		}
	}

	document.addEventListener('click', (e) => {
		if (e.target && !e.target.closest('.tab-btn')) {
			return;
		}
		const counters = document.querySelectorAll('.swiper-counter')
		counters.forEach(counter => {
			if (counter.querySelector('.counter__start')) {
				counter.querySelector('.counter__start').innerHTML = '1'
			}
		})
		const elTabBtn = e.target.closest('.tab-btn');
		showTab(elTabBtn);
	});


	// function openModelCharacter() {
	// 	const wrap = document.querySelector('.model-charact')
	// 	wrap.addEventListener('click', function (e) {
	// 		const items = document.querySelectorAll('.model-charact__content')
	// 		const target = e.target
	// 		console.log(target)
	// 		items.forEach(item => {
	// 			item.classList.remove('active')
	// 			item.closest('.model-charact__item').querySelector('.model-charact__head').classList.remove('active')
	// 		})
	// 		if (target.classList.contains('model-charact__text')) {
	// 			target.closest('.model-charact__item').querySelector('.model-charact__head').classList.toggle('active')
	// 		}
	// 		if (target.classList.contains('model-charact__text')) {
	// 			target.closest('.model-charact__item').querySelector('.model-charact__head').classList.toggle('active')
	// 		}
	// 		target.closest('.model-charact__item').querySelector('.model-charact__head').classList.toggle('active')
	// 	})
	// }
	// if (document.querySelector('.model-charact')) {
	// 	openModelCharacter()
	// }

	tippy(document.querySelectorAll('.tooltip'), {});

	function formValidate() {
		const form = document.querySelector('form')
		const fields = form.querySelectorAll('.form__input')

		form.addEventListener('submit', function (event) {
			event.preventDefault()
			const errors = form.querySelectorAll('.error')
			for (let i = 0; i < errors.length; i++) {
				errors[i].classList.remove('error')
			}
			const valids = form.querySelectorAll('.valid')
			for (let i = 0; i < valids.length; i++) {
				valids[i].classList.remove('valid')
			}

			for (let i = 0; i < fields.length; i++) {
				if (!fields[i].value) {
					fields[i].closest('.form__item').classList.add('error')
				} else {
					fields[i].closest('.form__item').classList.add('valid')
				}
			}
		})
	}



	if (document.querySelector('form')) {
		formValidate()
	}

	function removeOrders() {
		const closeOrder = document.querySelectorAll('.close-order')
		closeOrder.forEach(btn => {
			btn.addEventListener('click', function () {
				btn.closest('tr').remove()
			})
		})
	}

	if (document.querySelector('.table-history')) {
		removeOrders()
	}

	new AirDatepicker('#datepicker');

	function calcProducts() {
		let countValue = 0
		const count = document.querySelector('.counter-number')
		count.innerHTML = countValue
		document.querySelector('.counter-minus').addEventListener('click', function () {
			if (countValue < 1) {
				return
			}
			countValue = countValue - 1
			count.innerHTML = countValue

		})

		document.querySelector('.counter-plus').addEventListener('click', function () {
			countValue = countValue + 1
			count.innerHTML = countValue
		})
	}

	if (document.querySelector('.counter')) {
		calcProducts();
	}

	function openSearch() {
		const btn = document.querySelector('#search')
		const element = document.querySelector('.search')
		btn.addEventListener('click', function (e) {
			e.preventDefault()
			element.classList.add('active')
		})
	}

	openSearch()
})

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcblx0Y29uc3Qgc3dpcGVyID0gbmV3IFN3aXBlcignLnN3aXBlci1wb3B1bGFyJywge1xuXHRcdHNsaWRlc1BlclZpZXc6IDQsXG5cdFx0c3BhY2VCZXR3ZWVuOiAxMCxcblx0XHRicmVha3BvaW50czoge1xuXHRcdFx0MTkyMDoge1xuXHRcdFx0XHRzcGFjZUJldHdlZW46IDYwLFxuXHRcdFx0fSxcblx0XHRcdDEyODA6IHtcblx0XHRcdFx0c2xpZGVzUGVyVmlldzogNCxcblx0XHRcdH0sXG5cdFx0XHQxMDAwOiB7XG5cdFx0XHRcdHNwYWNlQmV0d2VlbjogNDAsXG5cdFx0XHRcdHNsaWRlc1BlclZpZXc6IDMsXG5cdFx0XHR9LFxuXHRcdFx0NzY4OiB7XG5cdFx0XHRcdHNwYWNlQmV0d2VlbjogNTAsXG5cdFx0XHR9LFxuXHRcdFx0MDoge1xuXHRcdFx0XHRzcGFjZUJldHdlZW46IDEwLFxuXHRcdFx0XHRzbGlkZXNQZXJWaWV3OiAyLFxuXHRcdFx0fVxuXG5cdFx0fVxuXHR9KTtcblxuXHRjb25zdCBzd2lwZXIyID0gbmV3IFN3aXBlcignLnN3aXBlci1yZWNvbWVuZGF0aW9uJywge1xuXHRcdHNsaWRlc1BlclZpZXc6IDIsXG5cdFx0c3BhY2VCZXR3ZWVuOiAzMCxcblx0XHRicmVha3BvaW50czoge1xuXHRcdFx0MTkyMDoge1xuXHRcdFx0XHRzbGlkZXNQZXJWaWV3OiA2LFxuXHRcdFx0fSxcblx0XHRcdDEyODA6IHtcblx0XHRcdFx0c2xpZGVzUGVyVmlldzogNCxcblx0XHRcdH0sXG5cdFx0XHQxMDAwOiB7XG5cdFx0XHRcdHNsaWRlc1BlclZpZXc6IDMsXG5cdFx0XHR9LFxuXHRcdFx0NzY4OiB7XG5cdFx0XHRcdHNwYWNlQmV0d2VlbjogMzAsXG5cdFx0XHR9LFxuXHRcdFx0MDoge1xuXHRcdFx0XHRzcGFjZUJldHdlZW46IDEwLFxuXHRcdFx0XHRzbGlkZXNQZXJWaWV3OiAyLFxuXHRcdFx0fVxuXG5cdFx0fVxuXHR9KTtcblxuXHRjb25zdCBzd2lwZXIzID0gbmV3IFN3aXBlcignLnN3aXBlci1vdGhlcicsIHtcblx0XHRzbGlkZXNQZXJWaWV3OiAyLFxuXHRcdHNwYWNlQmV0d2VlbjogMzAsXG5cdFx0YnJlYWtwb2ludHM6IHtcblx0XHRcdDE5MjA6IHtcblx0XHRcdFx0c2xpZGVzUGVyVmlldzogNixcblx0XHRcdH0sXG5cdFx0XHQxMjgwOiB7XG5cdFx0XHRcdHNsaWRlc1BlclZpZXc6IDQsXG5cdFx0XHR9LFxuXHRcdFx0MTAwMDoge1xuXHRcdFx0XHRzbGlkZXNQZXJWaWV3OiAzLFxuXHRcdFx0fSxcblx0XHRcdDc2ODoge1xuXHRcdFx0XHRzcGFjZUJldHdlZW46IDMwLFxuXHRcdFx0fSxcblx0XHRcdDA6IHtcblx0XHRcdFx0c3BhY2VCZXR3ZWVuOiAxMCxcblx0XHRcdFx0c2xpZGVzUGVyVmlldzogMixcblx0XHRcdH1cblxuXHRcdH1cblx0fSk7XG5cblx0Y29uc3Qgc3dpcGVyNCA9IG5ldyBTd2lwZXIoJy5zd2lwZXItYnV5Jywge1xuXHRcdHNsaWRlc1BlclZpZXc6IDIsXG5cdFx0c3BhY2VCZXR3ZWVuOiAzMCxcblx0XHRicmVha3BvaW50czoge1xuXHRcdFx0MTkyMDoge1xuXHRcdFx0XHRzbGlkZXNQZXJWaWV3OiA2LFxuXHRcdFx0fSxcblx0XHRcdDEyODA6IHtcblx0XHRcdFx0c2xpZGVzUGVyVmlldzogNCxcblx0XHRcdH0sXG5cdFx0XHQxMDAwOiB7XG5cdFx0XHRcdHNsaWRlc1BlclZpZXc6IDMsXG5cdFx0XHR9LFxuXHRcdFx0NzY4OiB7XG5cdFx0XHRcdHNwYWNlQmV0d2VlbjogMzAsXG5cdFx0XHR9LFxuXHRcdFx0MDoge1xuXHRcdFx0XHRzcGFjZUJldHdlZW46IDEwLFxuXHRcdFx0XHRzbGlkZXNQZXJWaWV3OiAyLFxuXHRcdFx0fVxuXG5cdFx0fVxuXHR9KTtcblxuXHR2YXIgZ2FsbGVyeVRodW1icyA9IG5ldyBTd2lwZXIoXCIuZ2FsbGVyeS10aHVtYnNcIiwge1xuXHRcdGNlbnRlcmVkU2xpZGVzOiB0cnVlLFxuXHRcdGNlbnRlcmVkU2xpZGVzQm91bmRzOiB0cnVlLFxuXHRcdHNsaWRlc1BlclZpZXc6IDMsXG5cdFx0d2F0Y2hPdmVyZmxvdzogdHJ1ZSxcblx0XHR3YXRjaFNsaWRlc1Zpc2liaWxpdHk6IHRydWUsXG5cdFx0d2F0Y2hTbGlkZXNQcm9ncmVzczogdHJ1ZSxcblx0XHRkaXJlY3Rpb246ICd2ZXJ0aWNhbCcsXG5cdFx0c3BhY2VCZXR3ZWVuOiAxMCxcblx0fSk7XG5cblx0dmFyIGdhbGxlcnlNYWluID0gbmV3IFN3aXBlcihcIi5nYWxsZXJ5LW1haW5cIiwge1xuXHRcdHdhdGNoT3ZlcmZsb3c6IHRydWUsXG5cdFx0d2F0Y2hTbGlkZXNWaXNpYmlsaXR5OiB0cnVlLFxuXHRcdHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IHRydWUsXG5cdFx0cHJldmVudEludGVyYWN0aW9uT25UcmFuc2l0aW9uOiB0cnVlLFxuXHRcdHBhZ2luYXRpb246IHtcblx0XHRcdGVsOiAnLnN3aXBlci1wYWdpbmF0aW9uJyxcblx0XHR9LFxuXHRcdG5hdmlnYXRpb246IHtcblx0XHRcdG5leHRFbDogJy5zd2lwZXItYnV0dG9uLW5leHQnLFxuXHRcdFx0cHJldkVsOiAnLnN3aXBlci1idXR0b24tcHJldicsXG5cdFx0fSxcblx0XHRlZmZlY3Q6ICdmYWRlJyxcblx0XHRmYWRlRWZmZWN0OiB7XG5cdFx0XHRjcm9zc0ZhZGU6IHRydWVcblx0XHR9LFxuXHRcdHRodW1iczoge1xuXHRcdFx0c3dpcGVyOiBnYWxsZXJ5VGh1bWJzXG5cdFx0fVxuXHR9KTtcblxuXHRjb25zdCB3cmFwU3dpcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnN3aXBlci1nb29kcycpXG5cdHdyYXBTd2lwZXIuZm9yRWFjaCgod3JhcCwgaW5kZXgpID0+IHtcblx0XHRjb25zdCBjb3VudGVyID0gd3JhcC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLWNvdW50ZXInKVxuXHRcdGNvbnN0IHNsaWRlc0NvdW50ID0gd3JhcC5xdWVyeVNlbGVjdG9yQWxsKCcuc3dpcGVyLXNsaWRlJylcblx0XHRjb3VudGVyLnF1ZXJ5U2VsZWN0b3IoJy5jb3VudGVyX19sZW5ndGgnKS5pbm5lckhUTUwgPSBzbGlkZXNDb3VudC5sZW5ndGhcblx0XHRjb25zdCBzd2lwZXI1ID0gbmV3IFN3aXBlcignLnN3aXBlci1nb29kcycsIHtcblx0XHRcdHNsaWRlc1BlclZpZXc6IDEsXG5cdFx0XHRuYXZpZ2F0aW9uOiB7XG5cdFx0XHRcdG5leHRFbDogJy5zd2lwZXItYnV0dG9uLW5leHQnLFxuXHRcdFx0XHRwcmV2RWw6ICcuc3dpcGVyLWJ1dHRvbi1wcmV2Jyxcblx0XHRcdH0sXG5cdFx0XHRvYnNlcnZlcjogdHJ1ZSxcblx0XHRcdG9ic2VydmVQYXJlbnRzOiB0cnVlLFxuXHRcdFx0cnVuQ2FsbGJhY2tzT25Jbml0OiB0cnVlLFxuXHRcdFx0b246IHtcblx0XHRcdFx0c2xpZGVDaGFuZ2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRsZXQgb2ZmZXIgPSB3cmFwLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItY291bnRlcicpO1xuXHRcdFx0XHRcdG9mZmVyLmlubmVySFRNTCA9ICc8c3BhbiBjbGFzcz1cImNvdW50ZXJfX3N0YXJ0XCI+JyArICh0aGlzLmFjdGl2ZUluZGV4ICsgMSkgKyAnPC9zcGFuPicgKyAnIC4uLiAnICsgc2xpZGVzQ291bnQubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0fSlcblxuXHRnYWxsZXJ5TWFpbi5vbignc2xpZGVDaGFuZ2VUcmFuc2l0aW9uU3RhcnQnLCBmdW5jdGlvbiAoKSB7XG5cdFx0Z2FsbGVyeVRodW1icy5zbGlkZVRvKGdhbGxlcnlNYWluLmFjdGl2ZUluZGV4KTtcblx0fSk7XG5cblx0Z2FsbGVyeVRodW1icy5vbigndHJhbnNpdGlvblN0YXJ0JywgZnVuY3Rpb24gKCkge1xuXHRcdGdhbGxlcnlNYWluLnNsaWRlVG8oZ2FsbGVyeVRodW1icy5hY3RpdmVJbmRleCk7XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIGdldEhlYWRlckhlaWdodCgpIHtcblx0XHRjb25zdCBoZWFkZXJIZWlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJykub2Zmc2V0SGVpZ2h0XG5cdFx0cmV0dXJuIGhlYWRlckhlaWdodFxuXHR9XG5cblx0Z2V0SGVhZGVySGVpZ2h0KClcblxuXHRmdW5jdGlvbiBib2R5SGlkZGVuKCkge1xuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5jbGFzc0xpc3QudG9nZ2xlKCdoaWRkZW4nKVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0TWFyZ2luKCkge1xuXHRcdGNvbnN0IG5hdk1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LW1lbnUnKVxuXHRcdG5hdk1lbnUuc3R5bGUubWFyZ2luVG9wID0gYCR7Z2V0SGVhZGVySGVpZ2h0KCl9cHhgXG5cdH1cblxuXHRmdW5jdGlvbiBvcGVuU3VibWVudSgpIHtcblx0XHRjb25zdCBpdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYXYtbWVudV9faXRlbScpXG5cdFx0aXRlbXMuZm9yRWFjaChpdGVtID0+IHtcblx0XHRcdGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGlmIChpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5zdWJtZW51JykpIHtcblx0XHRcdFx0XHRpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5zdWJtZW51JykuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJylcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHR9KVxuXHR9XG5cblx0aWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgMTAwMCkge1xuXHRcdG9wZW5TdWJtZW51KClcblx0fVxuXG5cdGZ1bmN0aW9uIGZpbHRlck9wZW4oKSB7XG5cdFx0Y29uc3QgYnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWx0ZXJfX2Jsb2NrJylcblx0XHRidG5zLmZvckVhY2goYnRuID0+IHtcblx0XHRcdGNvbnN0IGZpbHRlckNvbnRlbnQgPSBidG4ucXVlcnlTZWxlY3RvckFsbCgnLmZpbHRlcl9fY29udGVudCcpXG5cdFx0XHRmaWx0ZXJDb250ZW50LmZvckVhY2goaXRlbSA9PiB7XG5cdFx0XHRcdGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+IHtcblx0XHRcdFx0XHRldi5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0XHR9KVxuXHRcdFx0fSlcblx0XHRcdC8vINC+0YHRgtCw0LLQvdC+0LLQuNC7IGNsaWNrINC90LAgZmlsdGVyX19jb250ZW50XG5cdFx0XHRidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXYpIHtcblx0XHRcdFx0ZXYuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdFx0aWYgKGJ0bi5xdWVyeVNlbGVjdG9yKCcuZmlsdGVyX19jb250ZW50JykpIHtcblx0XHRcdFx0XHRidG4ucXVlcnlTZWxlY3RvcignLmZpbHRlcl9fY29udGVudCcpLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpXG5cdFx0XHRcdFx0YnRuLnF1ZXJ5U2VsZWN0b3IoJy5maWx0ZXJfX2NoZWNrcycpLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0fSlcblx0fVxuXG5cblx0ZnVuY3Rpb24gb3BlbkNoZWNrRmlsdGVyKCkge1xuXHRcdGNvbnN0IGJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZmlsdGVyX19idG4nKVxuXHRcdGJ0bnMuZm9yRWFjaChidG4gPT4ge1xuXHRcdFx0YnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0XHRpZiAoYnRuLm5leHRFbGVtZW50U2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbHRlcl9fY2hlY2tzJykpIHtcblx0XHRcdFx0XHRidG4ubmV4dEVsZW1lbnRTaWJsaW5nLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0fSlcblx0fVxuXG5cdGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmlsdGVyJykpIHtcblx0XHRmaWx0ZXJPcGVuKClcblx0XHRvcGVuQ2hlY2tGaWx0ZXIoKVxuXHRcdG9wZW5TZXR0aW5ncygpXG5cdH1cblxuXHRmdW5jdGlvbiBvcGVuU2V0dGluZ3MoKSB7XG5cdFx0Y29uc3QgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI29wZW5GaWx0ZXInKVxuXHRcdGNvbnN0IGZpbHRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5maWx0ZXInKVxuXHRcdGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KClcblx0XHRcdGNvbnN0IGJ0bkNsb3NlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ1cmdlcicpXG5cdFx0XHRidG5DbG9zZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG5cdFx0XHRmaWx0ZXIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcblx0XHRcdGZpbHRlci5zdHlsZS50b3AgPSBgJHtnZXRIZWFkZXJIZWlnaHQoKX1weGBcblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gb3Blbk1vYmlsZU1lbnUoKSB7XG5cdFx0Y29uc3QgYnVyZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ1cmdlcicpXG5cdFx0Y29uc3QgbWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXYtbWVudScpXG5cdFx0Y29uc3QgYWN0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX2FjdGlvbnMnKVxuXHRcdGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWRlcicpXG5cdFx0Y29uc3QgZmlsdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZpbHRlcicpXG5cdFx0YnVyZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0Y29uc3QgaGVpZ2h0RG9jdW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG5cdFx0XHRpZiAoZmlsdGVyLmxlbmd0aCA+IDAgJiYgZmlsdGVyWzBdLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdFx0ZmlsdGVyWzBdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG5cdFx0XHRcdHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dGhpcy5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKVxuXHRcdFx0XHRtZW51LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpXG5cdFx0XHRcdG1lbnUuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0RG9jdW1lbnQgLSBnZXRIZWFkZXJIZWlnaHQoKSAtIDM0fXB4YFxuXHRcdFx0XHRib2R5SGlkZGVuKClcblx0XHRcdFx0YWN0aW9ucy5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKVxuXHRcdFx0XHRoZWFkZXIuY2xhc3NMaXN0LnRvZ2dsZSgnc2hvdy1uYXYtbWVudScpXG5cdFx0XHR9XG5cdFx0XHRzZXRNYXJnaW4oKVxuXHRcdH0pXG5cdH1cblxuXG5cdG9wZW5Nb2JpbGVNZW51KClcblxuXHRmdW5jdGlvbiBzZWxlY3RGYXZvcml0ZSgpIHtcblx0XHRjb25zdCBmYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZmF2b3JpdGUnKVxuXHRcdGZhdi5mb3JFYWNoKGZhdiA9PiB7XG5cdFx0XHRmYXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJylcblx0XHRcdH0pXG5cdFx0fSlcblx0fVxuXG5cdHNlbGVjdEZhdm9yaXRlKClcblxuXHRjb25zdCBzaG93VGFiID0gKGVsVGFiQnRuKSA9PiB7XG5cdFx0Y29uc3QgZWxUYWIgPSBlbFRhYkJ0bi5jbG9zZXN0KCcudGFiJyk7XG5cdFx0aWYgKGVsVGFiQnRuLmNsYXNzTGlzdC5jb250YWlucygndGFiLWJ0bi1hY3RpdmUnKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRjb25zdCB0YXJnZXRJZCA9IGVsVGFiQnRuLmRhdGFzZXQudGFyZ2V0SWQ7XG5cdFx0Y29uc3QgZWxUYWJQYW5lID0gZWxUYWIucXVlcnlTZWxlY3RvcihgLnRhYi1wYW5lW2RhdGEtaWQ9XCIke3RhcmdldElkfVwiXWApO1xuXHRcdGlmIChlbFRhYlBhbmUpIHtcblx0XHRcdGNvbnN0IGVsVGFiQnRuQWN0aXZlID0gZWxUYWIucXVlcnlTZWxlY3RvcignLnRhYi1idG4tYWN0aXZlJyk7XG5cdFx0XHRlbFRhYkJ0bkFjdGl2ZS5jbGFzc0xpc3QucmVtb3ZlKCd0YWItYnRuLWFjdGl2ZScpO1xuXHRcdFx0Y29uc3QgZWxUYWJQYW5lU2hvdyA9IGVsVGFiLnF1ZXJ5U2VsZWN0b3IoJy50YWItcGFuZS1zaG93Jyk7XG5cdFx0XHRlbFRhYlBhbmVTaG93LmNsYXNzTGlzdC5yZW1vdmUoJ3RhYi1wYW5lLXNob3cnKTtcblx0XHRcdGVsVGFiQnRuLmNsYXNzTGlzdC5hZGQoJ3RhYi1idG4tYWN0aXZlJyk7XG5cdFx0XHRlbFRhYlBhbmUuY2xhc3NMaXN0LmFkZCgndGFiLXBhbmUtc2hvdycpO1xuXHRcdH1cblx0fVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblx0XHRpZiAoZS50YXJnZXQgJiYgIWUudGFyZ2V0LmNsb3Nlc3QoJy50YWItYnRuJykpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Y29uc3QgY291bnRlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc3dpcGVyLWNvdW50ZXInKVxuXHRcdGNvdW50ZXJzLmZvckVhY2goY291bnRlciA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhjb3VudGVyKVxuXHRcdFx0aWYgKGNvdW50ZXIucXVlcnlTZWxlY3RvcignLmNvdW50ZXJfX3N0YXJ0JykpIHtcblx0XHRcdFx0Y291bnRlci5xdWVyeVNlbGVjdG9yKCcuY291bnRlcl9fc3RhcnQnKS5pbm5lckhUTUwgPSAnMSdcblx0XHRcdH1cblx0XHR9KVxuXHRcdGNvbnN0IGVsVGFiQnRuID0gZS50YXJnZXQuY2xvc2VzdCgnLnRhYi1idG4nKTtcblx0XHRzaG93VGFiKGVsVGFiQnRuKTtcblx0fSk7XG5cblxuXHRmdW5jdGlvbiBvcGVuTW9kZWxDaGFyYWN0ZXIoKSB7XG5cdFx0Y29uc3Qgd3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RlbC1jaGFyYWN0Jylcblx0XHR3cmFwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdGNvbnN0IGl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1vZGVsLWNoYXJhY3RfX2NvbnRlbnQnKVxuXHRcdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXRcblx0XHRcdGNvbnNvbGUubG9nKHRhcmdldClcblx0XHRcdGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG5cdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcblx0XHRcdFx0aXRlbS5jbG9zZXN0KCcubW9kZWwtY2hhcmFjdF9faXRlbScpLnF1ZXJ5U2VsZWN0b3IoJy5tb2RlbC1jaGFyYWN0X19oZWFkJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcblx0XHRcdH0pXG5cdFx0XHRpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbW9kZWwtY2hhcmFjdF9fdGV4dCcpKSB7XG5cdFx0XHRcdHRhcmdldC5jbG9zZXN0KCcubW9kZWwtY2hhcmFjdF9faXRlbScpLnF1ZXJ5U2VsZWN0b3IoJy5tb2RlbC1jaGFyYWN0X19oZWFkJykuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJylcblx0XHRcdH1cblx0XHRcdGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RlbC1jaGFyYWN0X190ZXh0JykpIHtcblx0XHRcdFx0dGFyZ2V0LmNsb3Nlc3QoJy5tb2RlbC1jaGFyYWN0X19pdGVtJykucXVlcnlTZWxlY3RvcignLm1vZGVsLWNoYXJhY3RfX2hlYWQnKS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKVxuXHRcdFx0fVxuXHRcdFx0dGFyZ2V0LmNsb3Nlc3QoJy5tb2RlbC1jaGFyYWN0X19pdGVtJykucXVlcnlTZWxlY3RvcignLm1vZGVsLWNoYXJhY3RfX2hlYWQnKS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKVxuXHRcdH0pXG5cdH1cblx0aWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RlbC1jaGFyYWN0JykpIHtcblx0XHRvcGVuTW9kZWxDaGFyYWN0ZXIoKVxuXHR9XG5cblx0dGlwcHkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRvb2x0aXAnKSwge30pO1xuXG5cdGZ1bmN0aW9uIGZvcm1WYWxpZGF0ZSgpIHtcblx0XHRjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZm9ybScpXG5cdFx0Y29uc3QgZmllbGRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCcuZm9ybV9faW5wdXQnKVxuXG5cdFx0Zm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdGNvbnN0IGVycm9ycyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnLmVycm9yJylcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZXJyb3JzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGVycm9yc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpXG5cdFx0XHR9XG5cdFx0XHRjb25zdCB2YWxpZHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy52YWxpZCcpXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHZhbGlkcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YWxpZHNbaV0uY2xhc3NMaXN0LnJlbW92ZSgndmFsaWQnKVxuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAoIWZpZWxkc1tpXS52YWx1ZSkge1xuXHRcdFx0XHRcdGZpZWxkc1tpXS5jbG9zZXN0KCcuZm9ybV9faXRlbScpLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJylcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmaWVsZHNbaV0uY2xvc2VzdCgnLmZvcm1fX2l0ZW0nKS5jbGFzc0xpc3QuYWRkKCd2YWxpZCcpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHR9XG5cblxuXG5cdGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdmb3JtJykpIHtcblx0XHRmb3JtVmFsaWRhdGUoKVxuXHR9XG5cblx0ZnVuY3Rpb24gcmVtb3ZlT3JkZXJzKCkge1xuXHRcdGNvbnN0IGNsb3NlT3JkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2xvc2Utb3JkZXInKVxuXHRcdGNsb3NlT3JkZXIuZm9yRWFjaChidG4gPT4ge1xuXHRcdFx0YnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRidG4uY2xvc2VzdCgndHInKS5yZW1vdmUoKVxuXHRcdFx0fSlcblx0XHR9KVxuXHR9XG5cblx0aWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWJsZS1oaXN0b3J5JykpIHtcblx0XHRyZW1vdmVPcmRlcnMoKVxuXHR9XG5cblx0bmV3IEFpckRhdGVwaWNrZXIoJyNkYXRlcGlja2VyJyk7XG5cblx0ZnVuY3Rpb24gY2FsY1Byb2R1Y3RzKCkge1xuXHRcdGxldCBjb3VudFZhbHVlID0gMFxuXHRcdGNvbnN0IGNvdW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50ZXItbnVtYmVyJylcblx0XHRjb3VudC5pbm5lckhUTUwgPSBjb3VudFZhbHVlXG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50ZXItbWludXMnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChjb3VudFZhbHVlIDwgMSkge1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblx0XHRcdGNvdW50VmFsdWUgPSBjb3VudFZhbHVlIC0gMVxuXHRcdFx0Y291bnQuaW5uZXJIVE1MID0gY291bnRWYWx1ZVxuXG5cdFx0fSlcblxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3VudGVyLXBsdXMnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdGNvdW50VmFsdWUgPSBjb3VudFZhbHVlICsgMVxuXHRcdFx0Y291bnQuaW5uZXJIVE1MID0gY291bnRWYWx1ZVxuXHRcdH0pXG5cdH1cblxuXHRpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50ZXInKSkge1xuXHRcdGNhbGNQcm9kdWN0cygpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb3BlblNlYXJjaCgpIHtcblx0XHRjb25zdCBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2VhcmNoJylcblx0XHRjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlYXJjaCcpXG5cdFx0YnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKVxuXHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuXHRcdH0pXG5cdH1cblxuXHRvcGVuU2VhcmNoKClcbn0pXG4iXSwiZmlsZSI6Im1haW4uanMifQ==
