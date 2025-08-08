
import Raty from 'raty-js';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

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
  const list = document.querySelector('.feedback-list');
  if (!list) return;

  try {
    const { data } = await api.get('/feedbacks');
    
    const items = Array.isArray(data) ? data.slice(0, 10) : (data.results || []).slice(0, 10);
    console.log(data);

    const markup = items
      .map(item => {
        const rating = roundRating(item.rating ?? item.score ?? 0);
        const text = item.comment || item.review || item.feedback || item.text || '';
        const user = item.user || item.name || item.author || 'Анонім';
        return `
          <li class="feedback-item swiper-slide">
            <div class="feedback-rating" data-score="${rating}"></div>
            <p class="feedback-text text">${text}</p>
            <p class="feedback-user">${user}</p>         
          </li>
        `;
      })
      .join('');

    list.innerHTML = markup;

    list.querySelectorAll('.feedback-rating').forEach(el => {
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

        new Swiper('.feedback-swiper', {
      modules: [Navigation],
      navigation: {
        nextEl: '.feedback-next',
        prevEl: '.feedback-prev',
      },
    });


  } catch (err) {
    console.error('Failed to load feedbacks', err);
  }
}



