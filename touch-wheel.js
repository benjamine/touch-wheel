
var wheel = document.querySelector('.touch-wheel');
wheel.setAttribute('title', 'click to expand');
var isTouchDevice = 'ontouchstart' in document.documentElement;

document.querySelector('body').classList.add(isTouchDevice ? 'touch-device' : 'mouse-device');

wheel.addEventListener('dragstart', function(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }

  if (e.preventDefault) {
    e.preventDefault();
  }
});

wheel.addEventListener('touchmove', function(e) {

  if (e.stopPropagation) {
    e.stopPropagation();
  }

  if (e.preventDefault) {
    e.preventDefault();
  }

  var target = elementUnderPointer(e);
  while (target.tagName !== 'BODY' && target.tagName !== 'LI') {
    target = target.parentNode;
  }

  if (!target || !target.getAttribute('data-option-id')) {
    clearPreview();
  }

  previewOption(target.getAttribute('data-option-id'));
});

wheel.addEventListener('touchend', function(e) {

  if (e.stopPropagation) {
    e.stopPropagation();
  }

  if (e.preventDefault) {
    e.preventDefault();
  }

  var target = elementUnderPointer(e);
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
      var item = document.elementFromPoint(x, y);
      return document.elementFromPoint(x, y);
    }
  }

  return e.target;
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

function selectOption(optionId) {
  previewOption(optionId);
  if (!optionId) {
    return;
  }

  var li = wheel.querySelector('.options li.option-' + optionId);
  var title = li.querySelector('.option-title').textContent;
  wheel.classList.add('selected');
  wheel.setAttribute('data-selected', optionId);
  setTimeout(function() {
    wheel.classList.add('clearing');
    setTimeout(function() {
      wheel.classList.remove('clearing');
      wheel.classList.remove('selected');
      clearPreview();
      loadOptions();
    }, 500);
  }, 500);
}

function loadOptions() {

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

    for (var imgIndex = 0; imgIndex < 5; imgIndex++) {
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

    li.style.zIndex = 20 - i;
    var transformValue = 'rotateZ(' +
      Math.floor((180 / options.length) * (i + 1)) +
      'deg)';
    li.style.transform = transformValue;
    li.style['-webkit-transform'] = transformValue;
  }

  while (ul.childNodes.length > options.length) {
    ul.childNodes[ul.childNodes.length - 1].remove();
  }
}

loadOptions();

var nextImageSliding = 0;
setInterval(function() {
  var images = Array.prototype.slice.apply(wheel.querySelectorAll('.select-preview-image'));
  var img = images[nextImageSliding];
  img.classList.remove('sliding');
  img.style.left = '-80px';
  setTimeout(function() {
    img.classList.add('sliding');
    img.style.left = '';
  }, 50);

  nextImageSliding++;
  if (nextImageSliding >= images.length) {
    nextImageSliding = 0;
  }
}, 5000);





/*

Array.prototype.forEach.call(items, function(item) {
  var color = item.innerText.toLowerCase().replace(/ /g, '-');
  item.style['background-image'] = 'url(\'colors/' + color + '.jpg\')';
  item.setAttribute('data-color', color);

  if (item.classList.contains('selected')) {
    showColor(item);
  }
});

document.body.addEventListener('click', function(e) {
  if (e.target.nodeName === 'LI') {
    return;
  }
  if (!sampler.classList.contains('expanded')) {
    return;
  }
  sampler.classList.remove('expanded');
  sampler.setAttribute('title', 'click to expand');
  var selectedItem = document.querySelector('.color-sampler .selected');
  showColor(selectedItem);
});

sampler.addEventListener('dragstart', function(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (e.preventDefault) {
    e.preventDefault();
  }
});

sampler.addEventListener('mousemove', function(e) {
  if (e.target.nodeName !== 'LI') {
    return;
  }
  if (!sampler.classList.contains('expanded')) {
    return;
  }
  window.getSelection().removeAllRanges();
});

var expandTime;

function elementUnderPointer(e) {

  if (event.touches && event.touches[0]) {
    var x = e.pageX || event.touches[0].pageX;
    var y = e.pageY || event.touches[0].pageY;
    if (x && y) {
      x = x - (window.pageXOffset || 0);
      y = y - (window.pageYOffset || 0);
      var item = document.elementFromPoint(x, y);
      return document.elementFromPoint(x, y);
    }
  }
  return e.target;
}

function touchStart(e) {
  if (e.target.nodeName !== 'LI') {
    return;
  }
  if (selectionTime &&
    new Date().getTime() - selectionTime.getTime() < 200) {
    return;
  }
  if (itemOver) {
    itemOver.classList.remove('hover');
  }
  itemOver = e.target;
  itemOver.classList.add('hover');

  if (!sampler.classList.contains('expanded')) {
    sampler.classList.add('expanded');
    sampler.setAttribute('title', '');
    expandTime = new Date();
    return;
  }
}

var selectionTime;

function touchEnd(e) {
  var target = itemOver || elementUnderPointer(e);
  if (itemOver) {
    itemOver.classList.remove('hover');
    itemOver = null;
  }

  if (target.nodeName !== 'LI') {
    return;
  }
  if (!sampler.classList.contains('expanded')) {
    return;
  }
  if (new Date().getTime() - expandTime.getTime() < 300) {
    return;
  }
  document.querySelector('.color-sampler .selected').classList.remove('selected');
  target.classList.add('selected');
  selectionTime = new Date();
  sampler.classList.remove('expanded');
  sampler.setAttribute('title', 'click to expand');

  showColor(target);
}

var over = false;
var itemOver;

function touchMove(e) {
  e.preventDefault();
  over = true;
  var target = elementUnderPointer(e);
  if (target.nodeName !== 'LI') {
    return;
  }
  if (itemOver) {
    itemOver.classList.remove('hover');
  }
  itemOver = target;
  itemOver.classList.add('hover');
  showColor(target);
}

function touchLeave(e) {
  over = false;
  if (itemOver) {
    itemOver.classList.remove('hover');
    itemOver = null;
  }
  setTimeout(function() {
    if (over) {
      return;
    }
    var selectedItem = document.querySelector('.color-sampler .selected');
    showColor(selectedItem);
  }, 1000);
}

sampler.addEventListener('mousedown', touchStart);
sampler.addEventListener('touchstart', touchStart);

sampler.addEventListener('mouseup', touchEnd);
sampler.addEventListener('touchend', touchEnd);

sampler.addEventListener('mouseover', touchMove);
sampler.addEventListener('touchmove', touchMove);

sampler.addEventListener('mouseleave', touchLeave);
sampler.addEventListener('touchleave', touchLeave);

function showColor(item) {
  var color = item.getAttribute('data-color');
  colorName.innerText = item.innerText;
  img.src = 'colors/' + color + '.jpg';
}


*/
