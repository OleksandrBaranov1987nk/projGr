import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Raty from 'raty-js';

import { api } from '../api.js';
import starOn from '../img/star-full.svg';
import starOff from '../img/star-empty.svg';
import starHalf from '../img/star-half.svg';

function roundRating(value) {
  if (value >= 3.3 && value <= 3.7) return 3.5;
  if (value >= 3.8 && value <= 4.2) return 4;
  return Math.round(value * 2) / 2;
}

export async function initFeedback() {
  const section = document.querySelector('.feedback');
  if (!section) return;

  try {
    const { data } = await api.get('/feedbacks');
    const items = Array.isArray(data) ? data.slice(0, 10) : (data.results || []).slice(0, 10);
    const list = section.querySelector('.feedback__list');

    const markup = items
      .map(item => {
        const rating = roundRating(item.rating ?? item.score ?? 0);
        const text = item.comment || item.review || item.feedback || item.text || '';
        const user = item.user || item.name || item.author || 'Анонім';
        return `
          <li class="feedback__item swiper-slide">
            <div class="feedback__rating" data-score="${rating}"></div>
            <p class="feedback__text">${text}</p>
            <p class="feedback__user">${user}</p>
          </li>
        `;
      })
      .join('');

    list.innerHTML = markup;

    list.querySelectorAll('.feedback__rating').forEach(el => {
      const score = parseFloat(el.dataset.score);
      const raty = new Raty(el, {
        readOnly: true,
        score,
        starOn,
        starOff,
        starHalf,
        half: true,
      });
      raty.init();
    });

    new Swiper('.feedback__wrapper', {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      navigation: {
        nextEl: '.feedback__btn--next',
        prevEl: '.feedback__btn--prev',
      },
      pagination: {
        el: '.feedback__pagination',
        clickable: true,
      },
    });
  } catch (err) {
    console.error('Failed to load feedbacks', err);
  }
}