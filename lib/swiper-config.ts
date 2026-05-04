import { Navigation, Pagination, Keyboard, Scrollbar } from "swiper/modules";

export const swiperConfig = {
  navigation: true,
  keyboard: { enabled: true },
  scrollbar: { el: ".swiper-scrollbar", hide: false },
  modules: [Navigation, Pagination, Keyboard, Scrollbar],
  breakpoints: {
    0: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 0,
    },
    640: {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 12,
    },
    768: {
      slidesPerView: 5,
      slidesPerGroup: 5,
      spaceBetween: 15,
    },
    1024: {
      slidesPerView: 5,
      slidesPerGroup: 5,
      spaceBetween: 20,
    },
    1140: {
      slidesPerView: 6,
      slidesPerGroup: 6,
      spaceBetween: 20,
    },
    1280: {
      slidesPerView: 7,
      slidesPerGroup: 7,
      spaceBetween: 0,
    },
  },
};

export const swiperModalConfig = {
  spaceBetween: 20,
  navigation: true,
  keyboard: { enabled: true },
  scrollbar: { el: ".swiper-scrollbar", hide: false },
  modules: [Navigation, Pagination, Keyboard, Scrollbar],
  breakpoints: {
    0: {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 0,
    },
    640: {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 3,
    },
    768: {
      slidesPerView: 5,
      slidesPerGroup: 5,
      spaceBetween: 5,
    },
    1024: {
      slidesPerView: 5,
      slidesPerGroup: 5,
      spaceBetween: 10,
    },
    1140: {
      slidesPerView: 6,
      slidesPerGroup: 6,
      spaceBetween: 10,
    },
    1280: {
      slidesPerView: 6,
      slidesPerGroup: 6,
      spaceBetween: 10,
    },
  },
};
