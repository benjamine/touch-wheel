
var wheel = document.querySelector('.touch-wheel');
wheel.setAttribute('title', 'click to expand');
var isTouchDevice = 'ontouchstart' in document.documentElement;

document.querySelector('body').classList.add(isTouchDevice ? 'touch-device' : 'mouse-device');

var lastTarget = null;

function onWheelMove() {
  var target = elementUnderWheelCursor();
  if (target === lastTarget) {
    return;
  }

  lastTarget = target;
  while (target.tagName !== 'BODY' && target.tagName !== 'LI') {
    target = target.parentNode;
  }

  if (!target || !target.getAttribute('data-option-id')) {
    clearPreview();
  }

  previewOption(target.getAttribute('data-option-id'));
}

var touchMoved = false;
var touchStart = {};

wheel.addEventListener('touchmove', function(e) {
  onWheelMove();
  if (e.changedTouches && e.changedTouches[0]) {
    if (Math.abs(e.changedTouches[0].clientY - touchStart.y) > 15) {
      touchMoved = true;
    }
  }
});

wheel.addEventListener('scroll', function(e) {
  onWheelMove();
}, true);

wheel.addEventListener('touchstart', function(e) {
  touchMoved = false;
  touchStart = {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY
  };
});

wheel.addEventListener('touchend', function(e) {

  if (e.changedTouches && e.changedTouches[0]) {
    if (Math.abs(e.changedTouches[0].clientY - touchStart.y) > 10) {
      touchMoved = true;
    }
  }

  if (touchMoved) {
    return;
  }

  var target = elementUnderWheelCursor();
  while (target.tagName !== 'BODY' && target.tagName !== 'LI') {
    target = target.parentNode;
  }

  if (!target || !target.getAttribute('data-option-id')) {
    clearPreview();
  }

  selectOption(target.getAttribute('data-option-id'));
});

function elementUnderPointer(e) {

  var touch = (event.changedTouches && event.changedTouches[0]) ||
    (event.touches && event.touches[0]);

  if (touch) {
    var x = e.pageX || touch.pageX;
    var y = e.pageY || touch.pageY;
    if (x && y) {
      x = x - (window.pageXOffset || 0);
      y = y - (window.pageYOffset || 0);
      return document.elementFromPoint(x, y);
    }
  }

  return e.target;
}

function elementAt(x, y) {
  if (x && y) {
    x = x - (window.pageXOffset || 0);
    y = y - (window.pageYOffset || 0);
    return document.elementFromPoint(x, y);
  }
}

function elementUnderWheelCursor() {
  var cursorRect = wheel.querySelector('.cursor').getBoundingClientRect();
  return elementAt(cursorRect.left + cursorRect.width + 5,
    cursorRect.top + cursorRect.height - 4);
}

function getRandomData() {

  var titles = [
    'Led Zeppelin',
    'Pink Floyd',
    'Ray Charles',
    'Janis Joplin',
    'Jimi Hendrix',
    'Bob Dylan',
    'Chet Baker',
    'Queen'
  ];

  // shuffle
  /*
  for (var i = 0; i < titles.length - 1; i++) {
    var index = i + Math.floor(Math.random() * (titles.length - i));
    if (index > i) {
      var swapValue = titles[i];
      titles[i] = titles[index];
      titles[index] = swapValue;
    }
  }
  */
  titles = titles.slice(0, Math.floor(Math.random() * 7) + 2);

  var subjectTitle = titles[Math.floor(Math.random() * titles.length)];
  var subjectId = subjectTitle.toLowerCase().replace(/ /g, '-');
  var subjectImageNumber = Math.floor(Math.random() * 5) + 1;

  return {
    subject: {
      id: subjectId,
      image: {
        src: 'images/' + subjectId + '/' + subjectImageNumber + '.jpg'
      }
    },
    options: titles.map(function(title) {
      return {
        title: title
      };
    })
  };
}

var data;

function previewOption(optionId) {
  if (wheel.classList.contains('selected')) {
    return;
  }

  wheel.setAttribute('data-select-preview', optionId);
  var selectPreview = wheel.querySelector('.select-preview');
  if (!selectPreview) {
    return;
  }

  var selectedLi = wheel.querySelector('.option-selected');
  if (selectedLi && selectedLi.getAttribute('data-option-id') !== optionId) {
    selectedLi.classList.remove('option-selected');
  }

  var selectPreviewTitle = selectPreview.querySelector('.select-preview-title');
  var images = Array.prototype.slice.apply(selectPreview.querySelectorAll('.select-preview-image'));
  if (optionId) {
    var li = wheel.querySelector('.options li.option-' + optionId);
    li.classList.add('option-selected');
    selectPreviewTitle.textContent = '';
    selectPreviewTitle.textContent = li.querySelector('.option-title').textContent;

    images.forEach(function(img, index) {
      img.setAttribute('src', 'images/' + optionId + '/' + (index + 1) + '.jpg');
      img.style.visibility = 'visible';
    });

  } else {
    selectPreviewTitle.textContent = '';
    images.forEach(function(img, index) {
      img.style.visibility = 'hidden';
    });
  }
}

function clearPreview() {
  previewOption('');
}

var previousOption = null;

function selectOption(optionId) {
  if (previousOption === optionId) {
    return;
  }

  previewOption(optionId);
  if (!optionId) {
    return;
  }

  var li = wheel.querySelector('.options li.option-' + optionId);
  var title = li.querySelector('.option-title').textContent;
  wheel.classList.add('selected');
  wheel.classList.add(optionId === data.subject.id ? 'correct' : 'incorrect');

  wheel.setAttribute('data-selected', optionId);
  setTimeout(function() {
    wheel.classList.add('clearing');
    setTimeout(function() {
      wheel.classList.remove('clearing');
      wheel.classList.remove('selected');
      wheel.classList.remove('correct');
      wheel.classList.remove('incorrect');
      clearPreview();
      loadOptions();
    }, 500);
  }, 500);
}

function loadOptions() {

  lastTarget = null;
  previousOption = null;
  data = getRandomData();

  var subject = wheel.querySelector('.subject');
  if (!subject) {
    subject = document.createElement('div');
    subject.classList.add('subject');
    subjectImage = document.createElement('img');
    subject.appendChild(subjectImage);
    wheel.appendChild(subject);
  } else {
    subjectImage = subject.querySelector('img');
  }

  subjectImage.setAttribute('src', data.subject.image.src);

  var selectPreview = wheel.querySelector('.select-preview');
  var selectPreviewTitle;
  if (!selectPreview) {
    selectPreview = document.createElement('div');
    selectPreview.classList.add('select-preview');
    selectPreviewTitle = document.createElement('div');
    selectPreviewTitle.classList.add('select-preview-title');
    selectPreview.appendChild(selectPreviewTitle);
    wheel.appendChild(selectPreview);

    selectPreviewTitle = document.createElement('div');
    selectPreviewTitle.classList.add('select-preview-title');
    selectPreview.appendChild(selectPreviewTitle);
    wheel.appendChild(selectPreview);

    for (var imgIndex = 0; imgIndex < 3; imgIndex++) {
      var selectPreviewImage = document.createElement('img');
      selectPreviewImage.classList.add('select-preview-image');
      selectPreview.appendChild(selectPreviewImage);
    }

    wheel.addEventListener('touchleave', clearPreview);
    wheel.addEventListener('mouseleave', clearPreview);

  } else {
    selectPreviewTitle = selectPreview.querySelector('.select-preview-title');
  }

  selectPreviewTitle.textContent = '';
  wheel.setAttribute('data-select-preview', '');

  var ul = wheel.querySelector('ul.options');
  if (!ul) {
    ul = document.createElement('ul');
    ul.classList.add('options');
  }

  wheel.appendChild(ul);

  var options = data.options;
  for (var i = 0; i < options.length; i++) {
    var option = options[i];
    var optionId = option.title.replace(/ /g, '-').toLowerCase();
    var li = ul.childNodes[i];
    var liTitle;
    if (!li) {
      li = document.createElement('li');
      liTitle = document.createElement('div');
      liTitle.classList.add('option-title');
      li.appendChild(liTitle);
      ul.appendChild(li);
    } else {
      liTitle = li.querySelector('.option-title');
    }

    li.setAttribute('data-option-id', optionId);
    li.setAttribute('class', 'option-' + optionId);
    liTitle.textContent = option.title;

    // li calculated styles
  }

  while (ul.childNodes.length > options.length) {
    ul.childNodes[ul.childNodes.length - 1].remove();
  }

  var cursor = wheel.querySelector('.cursor');
  if (!cursor) {
    cursor = document.createElement('div');
    cursor.classList.add('cursor');
    wheel.appendChild(cursor);
  }

  onWheelMove();
}

loadOptions();
