/**
 * Now card: current time in Pune (Asia/Kolkata) and time-of-day gradient.
 */
(function () {
  'use strict';

  var CARD_ID = 'weather-card';
  var TIME_ID = 'now-location-time';
  var TIMEZONE = 'Asia/Kolkata';
  var UPDATE_MS = 60000; // 1 minute

  function getCard() {
    return document.getElementById(CARD_ID);
  }

  function getTimeEl() {
    return document.getElementById(TIME_ID);
  }

  function getHourInPune() {
    var str = new Date().toLocaleString('en-GB', { timeZone: TIMEZONE, hour: '2-digit', hour12: false });
    return parseInt(str, 10) || 12;
  }

  function getTimeOfDay(hour) {
    if (hour >= 22 || hour < 5) return 'night';
    if (hour >= 5 && hour < 7) return 'dawn';
    if (hour >= 7 && hour < 10) return 'morning';
    if (hour >= 10 && hour < 14) return 'noon';
    if (hour >= 14 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 19) return 'evening';
    if (hour >= 19 && hour < 22) return 'dusk';
    return 'noon';
  }

  function formatTime() {
    return new Date().toLocaleString('en-IN', {
      timeZone: TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  function updateTime() {
    var el = getTimeEl();
    if (el) el.textContent = formatTime() + ' IST';
  }

  function updateTimeOfDay() {
    var card = getCard();
    if (!card) return;
    var hour = getHourInPune();
    var tod = getTimeOfDay(hour);
    card.setAttribute('data-time-of-day', tod);
  }

  function tick() {
    updateTime();
    updateTimeOfDay();
  }

  function run() {
    if (!getCard() || !getTimeEl()) return;
    tick();
    setInterval(tick, UPDATE_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
