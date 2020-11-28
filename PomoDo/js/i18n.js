$(function(){
  const i18n = {
    'it': {},
    'en': {
      // Navbar and Sidenav
      'habits': 'Habits',
      'calendar': 'Calendar',

      //PomoDo
      'objective' : 'Write here your objective...',
      'changes' : 'Changes made here will reflect at the start of the next work/break session.',
      'min-work' : 'Work Duration',
      'min-break' : 'Break Duration',
      'session' : 'Your Sessions',
      'work' : 'Work',
      'break' : 'Break',

      //Abitudini
      'addHabit' : 'Habits',
      'habitDescription' : 'What do you want to get done everyday?',
      'exampleHabit' : 'Example: Drinking 2 liters of water per day',

      //Crediti
      'credits' : 'Credits',
      'backg' : 'Backgrounds',
      'create' : 'Website created by ',
      'createby' : 'created by ',
      'design' : 'Designed by\xa0',
      'font1' : 'Gamecuben font by\xa0',
      'font2' : 'Tomatoes font by ',
      'icons' : 'Icons by\xa0',
      'library' : 'JavaScript library used: ',

      //Events
      'events' : 'Current events:',
      'createEvent' : 'Create a new event',

      //404
      'error' : '404 ERROR',
      'darth' : 'You underestimate the power of the dark side',

      //Calendario
      'noEvents' : 'No events',
      //Week Days
      'weekDays' : 'Sunday-Monday-Tuesday-Wednesday-Thursday-Friday-Saturday',
      //Months
      'months' : 'Jan-Feb-Mar-Apr-May-Jun-Jul-Aug-Sep-Oct-Nov-Dec',
    },
  };

  const translate = function(lang){
    let translation = i18n[lang];
    Object.entries(translation).forEach(function(entry){
      document.querySelectorAll('.i18n-' + entry[0]).forEach(function(el){
        if(el.hasChildNodes()){
          el.firstChild.textContent = entry[1].toString();
        } else {
          $(el).attr('placeholder', entry[1].toString());
        }
      });
    });
  };

  (function(){
    let lang = localStorage.getItem('lang');
    document.querySelectorAll('[class*="i18n-"]').forEach(function(el){
      el.classList.forEach(function(el_class){
        if(el_class.startsWith('i18n-')){
          if(el.hasChildNodes()){
            i18n.it[el_class.substr(5)] = el.firstChild.textContent;
          } else {
            i18n.it[el_class.substr(5)] = $(el).attr('placeholder');
          }
          return false;
        }
      });
    });
    if(lang !== null && lang !== 'it' && Object.keys(i18n).includes(lang)){
      translate(lang);
    }
  })();

  $('.translate-btn').on('click', function(e){
    e.preventDefault();
    let lang = $(this).data('lang');
    localStorage.setItem('lang', lang);
    translate(lang);
  })

});
