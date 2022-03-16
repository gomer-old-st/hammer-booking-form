var eventsFilter = [true, true, true];
var data = [
	{ eventName: 'Lunch Meeting w/ Mark', calendar: 'Work', colorId: 0, color: 'homevisit', date: moment('02-15-2022 11:00 AM', 'MM-DD-YYYY hh:mm A')  },
	{ eventName: 'Lunch Meeting w/ Mark', calendar: 'Work', colorId: 0, color: 'homevisit', date: moment('03-15-2022 11:00 AM', 'MM-DD-YYYY hh:mm A')  },
	{ eventName: 'Lunch Meeting w/ Mark', calendar: 'Work', colorId: 0, color: 'homevisit', date: moment('03-15-2022 12:00 AM', 'MM-DD-YYYY hh:mm A')  },
	{ eventName: 'Interview - Jr. Web Developer', calendar: 'Work', colorId: 1, color: 'clinicvisit', date: moment('03-15-2022 02:00 PM', 'MM-DD-YYYY hh:mm A')  },
	{ eventName: 'Demo New App to the Board', calendar: 'Work', colorId: 2, color: 'telehealth', date: moment('03-16-2022 00:00 AM', 'MM-DD-YYYY hh:mm A')  },
	{ eventName: 'Demo New App to the Board', calendar: 'Work', colorId: 2, color: 'telehealth', date: moment('03-16-2022 02:00 AM', 'MM-DD-YYYY hh:mm A')  },
	{ eventName: 'Demo New App to the Board', calendar: 'Work', colorId: 2, color: 'telehealth', date: moment('03-15-2022 04:00 PM', 'MM-DD-YYYY hh:mm A')  },
];
var selectedTime = null;
var selectedButton = null;
!function() {

	var today = moment();

	function submit() {
		console.log(selectedTime);
	}
	
	function Calendar(selector, events) {
		document.querySelector(selector).innerHTML = '';
		this.el = document.querySelector(selector);
		this.events = events;
		this.current = moment().date(1);
		this.draw();
		var current = document.querySelector('.today');
		if(current) {
			var self = this;
			window.setTimeout(function() {
				self.openDay(current);
			}, 500);
		}
		
		var btn = document.querySelector('#submit');
		btn.addEventListener('click', submit);
	}

  Calendar.prototype.draw = function() {
    //Create Header
    this.drawHeader();

    //Draw Month
    this.drawMonth();

    //this.drawLegend();
  }

  Calendar.prototype.drawHeader = function() {
    var self = this;
    if(!this.header) {
      //Create the header elements
      this.header = createElement('div', 'header');
      this.header.className = 'header';

      this.title = createElement('h1');

      var right = createElement('div', 'right');
      this.rightText = createElement('h1');
      right.appendChild(this.rightText);
      right.addEventListener('click', function() { self.nextMonth(); });

      var left = createElement('div', 'left');
      this.leftText = createElement('h1');
      left.appendChild(this.leftText);
      left.addEventListener('click', function() { self.prevMonth(); });
      
      var days = createElement('div', 'days');
      var line = createElement('hr', 'line');
      var S1 = createElement('div', 'day-letter');
      S1.appendChild(document.createTextNode('S'));
      var M = createElement('div', 'day-letter');
      M.appendChild(document.createTextNode('M'));
      var T1 = createElement('div', 'day-letter');
      T1.appendChild(document.createTextNode('T'));
      var W = createElement('div', 'day-letter');
      W.appendChild(document.createTextNode('W'));
      var T2 = createElement('div', 'day-letter');
      T2.appendChild(document.createTextNode('T'));
      var F = createElement('div', 'day-letter');
      F.appendChild(document.createTextNode('F'));
      var S2 = createElement('div', 'day-letter');
      S2.appendChild(document.createTextNode('S'));
      days.appendChild(S1);
      days.appendChild(M);
      days.appendChild(T1);
      days.appendChild(W);
      days.appendChild(T2);
      days.appendChild(F);
      days.appendChild(S2);
      days.appendChild(line);

      //Append the Elements
      this.header.appendChild(this.title); 
      this.header.appendChild(right);
      this.header.appendChild(left);
      this.el.appendChild(this.header);
      this.el.appendChild(days)
    }

    this.title.innerHTML = this.current.format('MMMM YYYY');
    var now = new Date(this.current);
    if (now.getMonth() == 11) {
        var nextMonth = new Date(now.getFullYear() + 1, 0, 1);
    } else {
        var nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
    if (now.getMonth() == 0) {
        var lastMonth = new Date(now.getFullYear() - 1, 11, 1);
    } else {
        var lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    }
    this.rightText.innerHTML = `${nextMonth.toLocaleString('default', { month: 'long' })} ${nextMonth.getFullYear()}`;
    this.leftText.innerHTML = `${lastMonth.toLocaleString('default', { month: 'long' })} ${lastMonth.getFullYear()}`;
  }
  
  Calendar.prototype.drawMonth = function() {
    var self = this;
    
	/*
    this.events.forEach(function(ev) {
     ev.date = self.current.clone().date(Math.random() * (29 - 1) + 1);
    });
	*/
    
    
    if(this.month) {
      this.oldMonth = this.month;
      this.oldMonth.className = 'month out ' + (self.next ? 'next' : 'prev');
      this.oldMonth.addEventListener('webkitAnimationEnd', function() {
        self.oldMonth.parentNode.removeChild(self.oldMonth);
        self.month = createElement('div', 'month');
        self.backFill();
        self.currentMonth();
        self.fowardFill();
        self.el.appendChild(self.month);
        window.setTimeout(function() {
          self.month.className = 'month in ' + (self.next ? 'next' : 'prev');
        }, 16);
      });
    } else {
        this.month = createElement('div', 'month');
        this.el.appendChild(this.month);
        this.backFill();
        this.currentMonth();
        this.fowardFill();
        this.month.className = 'month new';
    }
  }

  Calendar.prototype.backFill = function() {
    var clone = this.current.clone();
    var dayOfWeek = clone.day();

    if(!dayOfWeek) { return; }

    clone.subtract('days', dayOfWeek+1);

    for(var i = dayOfWeek; i > 0 ; i--) {
      this.drawDay(clone.add('days', 1), true);
    }
  }

  Calendar.prototype.fowardFill = function() {
    var clone = this.current.clone().add('months', 1).subtract('days', 1);
    var dayOfWeek = clone.day();

    if(dayOfWeek === 6) { return; }

    for(var i = dayOfWeek; i < 6 ; i++) {
      this.drawDay(clone.add('days', 1), true);
    }
  }

  Calendar.prototype.currentMonth = function() {
    var clone = this.current.clone();

    while(clone.month() === this.current.month()) {
      this.drawDay(clone);
      clone.add('days', 1);
    }
  }

  Calendar.prototype.getWeek = function(day) {
    if(!this.week || day.day() === 0) {
      this.week = createElement('div', 'week');
      this.month.appendChild(this.week);
    }
  }

  Calendar.prototype.drawDay = function(day, dontFill) {
    var self = this;
    this.getWeek(day);

    //Outer Day
    var outer = createElement('div', this.getDayClass(day));
    outer.addEventListener('click', function() {
      self.openDay(this);
    });

    //Day Name
    //var name = createElement('div', 'day-name', day.format('ddd'));

    //Day Number
    var todaysEvents = this.events.reduce(function(memo, ev) {
        if(ev.date.isSame(day, 'day')) {
          memo.push(ev);
        }
        return memo;
    }, []);
	
    if (todaysEvents.length === 0) {
      var number = createElement('div', 'day-number-no-event', day.format('D'));
    } else {
      var number = createElement('div', 'day-number', day.format('D'));
    }


    //Events    
    var events = createElement('div', 'day-events');
    this.drawEvents(day, events);

    if (!dontFill) {
      //outer.appendChild(name);
      outer.appendChild(number);
      outer.appendChild(events);
    }
    this.week.appendChild(outer);
  }

  Calendar.prototype.drawEvents = function(day, element) {
    if(day.month() === this.current.month()) {
      var todaysEvents = this.events.reduce(function(memo, ev) {
        if(ev.date.isSame(day, 'day')) {
          memo.push(ev);
        }
        return memo;
      }, []);

		var generalEvents = [];
		var colors = [];
		for (index = 0; index < todaysEvents.length; index++) {
			if (!colors.includes(todaysEvents[index].color)) {
				generalEvents.push(todaysEvents[index]);
				colors.push(todaysEvents[index].color);
			}
		};
		
      generalEvents.forEach(function(ev) {
        var evSpan = createElement('span', ev.color);
        element.appendChild(evSpan);
      });
    }
  }
  
	function selectSched(e) {
		selectedTime = e.target.value;
		
		if (selectedButton) {
			if (selectedButton.className === 'homevisitSched') {
				selectedButton.classList.add('homevisitSched');
				selectedButton.classList.remove('homevisitSchedFocus');
			} else if (selectedButton.className === 'clinicvisitSched') {
				selectedButton.classList.add('clinicvisitSched');
				selectedButton.classList.remove('clinicvisitSchedFocus');
			} else {
				selectedButton.classList.add('telehealthSched');
				selectedButton.classList.remove('telehealthSchedFocus');
			}
		}
		
		selectedButton = e.srcElement;
		if (selectedButton.className === 'homevisitSched') {
			selectedButton.classList.remove('homevisitSched');
			selectedButton.classList.add('homevisitSchedFocus');
		} else if (selectedButton.className === 'clinicvisitSched') {
			selectedButton.classList.remove('clinicvisitSched');
			selectedButton.classList.add('clinicvisitSchedFocus');
		} else {
			selectedButton.classList.remove('telehealthSched');
			selectedButton.classList.add('telehealthSchedFocus');
		}
	}

	Calendar.prototype.getDayClass = function(day) {
		classes = ['day'];
		if(day.month() !== this.current.month()) {
			classes.push('other');
		} else if (today.isSame(day, 'day')) {
			classes.push('today');
		}
		return classes.join(' ');
	}
	
	Calendar.prototype.createSchedButton = function(type, date) {
		var btn = createElement('button');
		btn.innerHTML = date.format('HH:mm');
		btn.classList.add(type);
		btn.addEventListener('click', selectSched);
		btn.type = 'button';
		btn.value = date;
		return btn;
	}
  
	Calendar.prototype.drawSchedule = function(schedule) {
		var homevisitSChed = document.querySelector('#homevisitSched');
		homevisitSChed.innerHTML = '';
		var clinicvisitSched = document.querySelector('#clinicvisitSched');
		clinicvisitSched.innerHTML = '';
		var telehealthSched = document.querySelector('#telehealthSched');
		telehealthSched.innerHTML = '';
		
		for (i = 0; i < schedule.length; i++) {
			var ev = schedule[i];
			var btn = null;
			if (ev.colorId === 0) {
				btn = this.createSchedButton('homevisitSched', ev.date);
				if (new Date(ev.date._d).getTime() === new Date(selectedTime).getTime()) {
					btn.classList.remove('homevisitSched');
					btn.classList.add('homevisitSchedFocus');
					selectedButton = btn;
				}
				homevisitSChed.appendChild(btn);
			} else if (ev.colorId === 1) {
				btn = this.createSchedButton('clinicvisitSched', ev.date);
				if (new Date(ev.date._d).getTime() === new Date(selectedTime).getTime()) {
					btn.classList.remove('clinicvisitSched');
					btn.classList.add('clinicvisitSchedFocus');
					selectedButton = btn;
				}
				clinicvisitSched.appendChild(btn);
			} else {
				btn = this.createSchedButton('telehealthSched', ev.date);
				if (new Date(ev.date._d).getTime() === new Date(selectedTime).getTime()) {
					btn.classList.remove('telehealthSched');
					btn.classList.add('telehealthSchedFocus');
					selectedButton = btn;
				}
				telehealthSched.appendChild(btn);
			}
		}
		
		if (selectedButton) {
			if (selectedButton.className === 'homevisitSched') {
				selectedButton.classList.add('homevisitSchedFocus');
			} else if (selectedButton.className === 'clinicvisitSched') {
				selectedButton.classList.add('clinicvisitSchedFocus');
			} else {
				selectedButton.classList.add('telehealthSchedFocus');
			}
		}
	}

	Calendar.prototype.openDay = function(el) {
		var dayNumber = +el.querySelectorAll('.day-number')[0].innerText || +el.querySelectorAll('.day-number')[0].textContent;
		var day = this.current.clone().date(dayNumber);

		//this.selected.removeChild(this.selected);
		//currentOpened.parentNode.removeChild(currentOpened);
		if (this.selected !== undefined) {
			this.selected.classList.remove('day-selected');
		}
		this.selected = el;
		el.classList.add('day-selected');
		
		var schedule = [];
		data.forEach((value, index) => {
			if (day.isSame(value.date, 'day')) {
				schedule.push(value);
			}
		});
		
		this.drawSchedule(schedule);
	}

  Calendar.prototype.renderEvents = function(events, ele) {
    //Remove any events in the current details element
    var currentWrapper = ele.querySelector('.events');
    var wrapper = createElement('div', 'events in' + (currentWrapper ? ' new' : ''));

    events.forEach(function(ev) {
      var div = createElement('div', 'event');
      var square = createElement('div', 'event-category ' + ev.color);
      var span = createElement('span', '', ev.eventName);

      div.appendChild(square);
      div.appendChild(span);
      wrapper.appendChild(div);
    });

    if(!events.length) {
      var div = createElement('div', 'event empty');
      var span = createElement('span', '', 'No Events');

      div.appendChild(span);
      wrapper.appendChild(div);
    }

    if(currentWrapper) {
      currentWrapper.className = 'events out';
      currentWrapper.addEventListener('webkitAnimationEnd', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('oanimationend', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('msAnimationEnd', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('animationend', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
    } else {
      ele.appendChild(wrapper);
    }
  }

  Calendar.prototype.nextMonth = function() {
    this.current.add('months', 1);
    this.next = true;
    this.draw();
  }

  Calendar.prototype.prevMonth = function() {
    this.current.subtract('months', 1);
    this.next = false;
    this.draw();
  }

  window.Calendar = Calendar;

  function createElement(tagName, className, innerText) {
    var ele = document.createElement(tagName);
    if(className) {
      ele.className = className;
    }
    if(innerText) {
      ele.innderText = ele.textContent = innerText;
    }
    return ele;
  }
  
}();

function checkboxTicked(checked, value) {
	eventsFilter[value] = checked;
	
	var filteredData = [];
	data.forEach((value, index) => {
		if (eventsFilter[data[index].colorId]) {
			filteredData.push(data[index]);
		}
	});
	new Calendar('#calendar', filteredData);
};

var calendar = new Calendar('#calendar', data);
 