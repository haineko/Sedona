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
  
  /* -- JQUERY КАЛЕДАРЬ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ -- */

//  window.isMobile = function() {
//    var check = false;
//    (function(a, b) {
//        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
//    })(navigator.userAgent || navigator.vendor || window.opera);
//    return check;
//};
//$(function() {
//    if (!isMobile()) {
//        $('input[type=date]').datepicker({
//            dateFormat: 'yy-mm-dd',
//            minDate: "-90",
//            onSelect: function() {
//                if (checkout.value) {
//                    plusDate(tripLasting.value);
//                }
//            }
//        });
//    }
//});

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
