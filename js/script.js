var menu = document.querySelector(".main-menu__btn-menu");
var nav = document.querySelectorAll(".main-menu__item");
var cross = document.querySelector(".main-menu__cross");
var form = document.querySelector(".form-review__form");
var done = document.querySelector(".popup--request");
var fail = document.querySelector(".popup--failure");
var btn_done = document.querySelectorAll(".popup--request__btn");
var btn_fail = document.querySelectorAll(".popup--failure__btn");

/* -- МЕНЮ -- */
var handler = function () {
  event.preventDefault();
  for (var i = 0; i < nav.length; i++) {
    nav[i].classList.toggle("main-menu__item--show");
  }
  cross.classList.toggle("main-menu__cross--show");
};

menu.addEventListener("click", handler);
menu.addEventListener("tap", handler);

cross.addEventListener("click", handler);
cross.addEventListener("tap", handler);

if (document.querySelector(".form-review__form")) {
  console.info('Форма обнаружена!');
  initForm();
  initLocalStorage();
} else {
  console.info('Форма не обнаружена!');
}

/* -- ОТПРАВКА ФОРМЫ С ПОМОЩЬЮ AJAX -- */
function initForm() {
  if (!("FormData" in window)) {

    console.warn('У вас нет пожжержки FormData в браузере');
    return;

  } else {

    form.addEventListener("submit", function(event) {

      event.preventDefault();
      var data = new FormData(form);
      var queue =[];

      queue.forEach(function(element) {
        data.append("form-review__photos-gallery", element.file);
      });

      request(data, function(response) {
        console.log(response);
      });

    });
  }
}

function request(data, fn) {

  var xhr = new XMLHttpRequest();
  var time = (new Date()).getTime();

  xhr.open("post", "http://simonenko.su/academy/echo?" + time);
  xhr.addEventListener("readystatechange", function () {

    if (xhr.readyState == 4) {
      fn(xhr.responseText);
      // TODO: тут делаем очистку localstorage
      done.classList.add("popup-show");
      btn_done.addEventListener("click", function() {
        event.preventDefault();
        console.info("close popup");
        done.classList.remove("popup-show");
      });
    } else {
      fail.classList.add("popup-show");
      btn_fail.addEventListener("click", function() {
        event.preventDefault();
        console.info("close popup");
        fail.classList.remove("popup-show");
      });
    }

  });

  xhr.send(data);
}

/* -- LOCALSTORAGE -- */
function initLocalStorage() {

  if (window.localStorage) {

    var form = document.querySelector(".form-review__form");
    var savElements = form.querySelectorAll("[name]")-1;

    for (var i = 0; i < savElements.length; i++) {

      getState(savElements[i]);
      setState(savElements[i]);

    }
  }
}

function getState(savElement) {

  var name = savElement.getAttribute('name');
  savElement.value = localStorage.getItem(name) || '';

}

function setState(savElement) {

  var name = savElement.getAttribute('name');

  savElement.addEventListener('keyup', function () {

    var value = this.value;

    if (!value) {
      value = '';
    }

    localStorage.setItem(name, value);

  });
}

/* -- ДАТЫ -- */
if (document.querySelector(".form-review__form")) {
  var trip_duration = document.getElementById('trip-duration');
  var btn_minus = document.querySelector('.form-review__counter-trip > .form-review__btn-minus');
  var btn_plus = document.querySelector('.form-review__counter-trip > .form-review__btn-plus');

  btn_minus.addEventListener('click', function (e) {
    
    e.preventDefault();
    changeNumbers(-1, trip_duration);
    console.info('Минус день' + trip_duration.value);
    plusDate(trip_duration.value);
  });

  btn_plus.addEventListener('click', function (e) {
    
    e.preventDefault();
    changeNumbers(1, trip_duration);
    console.info('Плюс день' + trip_duration.value);
    plusDate(trip_duration.value);
  });


  function diffDate() {
    var date_arrival = new Date(arrival.value).getTime();
    var date_depart = new Date(depart.value).getTime();

    var date_diff = Math.floor((date_depart - date_arrival) / 1000 / 60 / 60 / 24);
    if (date_diff < 0) {
      trip_duration.value = 0;
    } else {
      trip_duration.value = date_diff;
      console.log(trip_duration.value);
    }
  }

  function plusDate(num) {

    if (!arrival.value) {
      date = new Date();
      var month = (date.getMonth() + 1).toString();
      var month = month[1] ? month : '0' + month[0]

      var day = date.getDate().toString();
      console.info('Day1: ' + day);
      var day = day[1] ? day : '0' + day[0]
      arrival.value = date.getFullYear() + '-' + month + '-' + day; /* TODO: refactor */

      arrival.addEventListener('change', function () {
        plusDate(trip_duration.value);
        depart.addEventListener('change', function () {
          diffDate();
        });
      });
    }

    var date_arrival = new Date(arrival.value).getTime();
    console.log('Дата в первом инпуте: ' + new Date(date_arrival));
    var date_one = Math.floor(num*1000*60*60*24 + date_arrival);
    var date_two = new Date(date_one);
    console.warn('Дата в втором инпуте: ' + date_two);

    var month = (date_two.getMonth() + 1).toString();
    var month = month[1] ? month : '0' + month[0]

    var day = date_two.getDate().toString();
    console.info('Day1: ' + day);
    var day = day[1] ? day : '0' + day[0]

    console.info('Month: ' + month);
    console.info('Day2: ' + day);

    depart.value = date_two.getFullYear() + '-' + month + '-' + day;
  }
  
  trip_duration.addEventListener('change', function() {
    e.preventDefault();
    if (trip_duration.value) {
      plusDate(trip_duration.value);
    }
  });
  
  arrival.addEventListener('change', function() {
    e.preventDefault();
    if (arrival.value) {
      plusDate(trip_duration.value);
    }
  });
  

  /* -- СЧЕТЧИК --*/
  function changeNumbers(number, el) {

    if ((parseInt(el.value) + number) < 1) {

      console.warn('Слишком мало!');

    } else if ((parseInt(el.value) + number) >= 1 && (parseInt(el.value) + number) <= 30) {

      if (!el.value) {
        el.value = 1;
      }

      el.value = parseInt(el.value) + number;

    } else {
      console.warn('Слишком много!');
    }

  }


  /* -- УДАЛЕНИЕ И ДОБАВЛЕНИЕ ЛЮДЕЙ -- */
  var del_traveler = document.querySelector('.form-review__number-travelers > .form-review__btn-minus');
  var add_traveler = document.querySelector('.form-review__number-travelers > .form-review__btn-plus');
  var number_traveler = document.getElementById('number_traveler');

  del_traveler.addEventListener('click', function (e) {

    e.preventDefault();
    changeNumbers(-1, number_traveler);
    console.info('Больше путешественников, больше!'+number_traveler.value);
    removeTraveler();

  });

  add_traveler.addEventListener('click', function (e) {

    e.preventDefault();
    changeNumbers(1, number_traveler);
    console.info('Меньше путешественников,меньше!'+number_traveler.value);
    addTraveler()

  });

  function removeTraveler() {

    var data_traveler = form.querySelector('.form-review__travelers-data .form-wrapper');
    var del_traveler = document.getElementById("traveler" + (parseInt(number_traveler.value) + 1));

    data_traveler.removeChild(del_traveler);
    console.log('Путешественник удален!');
  }

  function addTraveler() {

    var data_traveler = document.querySelector('.form-review__travelers-data');
    var contener = document.querySelector('.form-review__travelers-data .form-wrapper');
    var traveler_template = document.querySelector("#traveler_template").innerHTML;
    var traveler_html = Mustache.render(traveler_template, {
            "number": number_traveler.value
          });

    var new_traveler = document.createElement('div');
    new_traveler.classList.add('form-review__traveler');
    new_traveler.id = "traveler"+number_traveler.value;
    new_traveler.innerHTML = traveler_html;
    contener.appendChild(new_traveler);
    console.log('Добавлен путешественник!');
  }

  /* -- ДОБАВЛЕНИЕ ФОТОГРАФИЙ -- */
  var btn_upload = document.querySelector("#upload_photo");

  btn_upload.addEventListener("change", function() {
    var files = this.files;

    for (var i = 0; i < files.length; i++) {
      preview(files[i]);
    }
    this.value = "";

  });

  function preview(file) {

    if("FileReader" in window) {

      if(file.type.match(/image.*/)) {

        var reader = new FileReader();

        reader.addEventListener("load", function(event) {

          var form = document.querySelector(".form-review__form");
          var gallery = document.querySelector(".form-review__photos-gallery");
          var imtemplate = document.querySelector("#image_template").innerHTML;
          var queue =[];

          var html = Mustache.render(imtemplate, {
            "image": event.target.result,
            "name": file.name
          });

          var figure = document.createElement("figure");
          figure.innerHTML = html;
          gallery.appendChild(figure);
          console.info("Фотография добавлена!");

          var close = figure.querySelector(".form-review__photo-close");
          close.addEventListener("click", function(event) {

            event.preventDefault();
            removePreview(figure);
          });

          queue.push({

            "file": file,
            "figure": figure

          });

        });

        reader.readAsDataURL(file);
      }
    }
  }

  function removePreview(figure) {

    var queue =[];
    queue = queue.filter(function(element) {

      return element.figure != figure;

    });

    figure.parentNode.removeChild(figure);
    console.info("Фотография удалена!");
  }
}
function initialize() {
  var myLatlng = new google.maps.LatLng(34.8697395, -111.7609896);
  var image = "./img/marker.png";
    var myOptions = {
    zoom: 7,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: false
  };
  var map = new google.maps.Map(document.getElementById('map'), myOptions);  
  var beachMarker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      icon: image
  });
}
google.maps.event.addDomListener(window, "load", initialize);
