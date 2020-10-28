'use strict';

(function () {
  var body = document.querySelector('body');
  var navMain = document.querySelector('.main-nav');
  var navToggle = document.querySelector('.main-nav__toggle');

  navMain.classList.remove('main-nav--nojs');

  navToggle.addEventListener('click', function () {
    if (navMain.classList.contains('main-nav--closed')) {
      navMain.classList.remove('main-nav--closed');
      body.classList.add('body-lock');
      navMain.classList.add('main-nav--opened');
    } else {
      navMain.classList.add('main-nav--closed');
      body.classList.remove('body-lock');
      navMain.classList.remove('main-nav--opened');
    }
  });
})();

(function () {
  var tabs = document.querySelector('.tabs');

  function fTabs(event) {
    if (event.target.className == 'tabs__link') {
      // dataTab - номер вкладки, которую нужно отобразить
      var dataTab = event.target.getAttribute('data-tab');
      // отключаю класс active
      var tabH = document.getElementsByClassName('tabs__link');
      for (var i = 0; i < tabH.length; i++) {
        tabH[i].classList.remove('tabs__link--current');
      }
      event.target.classList.add('tabs__link--current');
      // все вкладки с содержимым
      var tabBody = document.getElementsByClassName('tab-body');
      for (var i = 0; i < tabBody.length; i++) {
        if (dataTab == i) {
          tabBody[i].classList.add('tab-body--current');
        } else {
          tabBody[i].classList.remove('tab-body--current');
        }
      }
    }
  }

  if (tabs) {
    tabs.addEventListener('click', fTabs);
  }
})();

(function () {
  var buttons = document.querySelectorAll(".button--modal");
  var button = document.querySelector(".button--buy");
  var popup = document.querySelector(".modal-wrapper--buy");
  var overlay = document.querySelector(".overlay");
  var phone = document.querySelector(".modal__phone");
  var email = document.querySelector(".modal__email");
  var form = document.querySelector(".modal-wrapper__modal");
  var formQuestion = document.querySelector(".form__modal");
  var buttonSubmit = document.querySelector(".button-submit");
  var errorPhone = document.querySelector('.modal__error--phone');
  var errorMail = document.querySelector('.modal__error--email');
  var popupSuccess = document.querySelector(".modal-wrapper--success");
  var buttonSuccess = document.querySelector(".button--success");

  var isStorageSupport = true;
  var storagePhone = "";
  var storageMail = "";

  var URL = 'https://echo.htmlacademy.ru';
  var StatusCode = {
    OK: 200
  };

  try {
    storagePhone = localStorage.getItem("phone");
    storageMail = localStorage.getItem("email");
  } catch (err) {
    isStorageSupport = false;
  }

  var save = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.open('POST', URL);
    xhr.send(data);
  }

  var onPopupEscPress = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closePopup();
    }
  };

  var onOutsideOfPopupClick = function (evt) {
    closePopup();
  };

  var onButtonClick = function (evt) {
    evt.preventDefault();
    closePopup();
  }

  var openPopup = function () {
    popup.classList.add("modal-wrapper--show");
    overlay.classList.add("overlay--show");

    overlay.addEventListener('click', onOutsideOfPopupClick);

    button.addEventListener('click', onButtonClick);

    document.addEventListener('keydown', onPopupEscPress);
  };

  var closePopup = function () {
    popup.classList.remove("modal-wrapper--show");
    overlay.classList.remove("overlay--show");

    overlay.removeEventListener('click', onOutsideOfPopupClick);

    button.removeEventListener('click', onButtonClick);

    document.removeEventListener('keydown', onPopupEscPress);
  };

  var removePhoneError = function () {
    errorPhone.classList.remove("modal__error--active");
    phone.classList.remove("modal__input--invalid");
  }

  var removeMailError = function () {
    errorMail.classList.remove("modal__error--active");
    email.classList.remove("modal__input--invalid");
  }

  var addPhoneError = function () {
    errorPhone.classList.add("modal__error--active");
    phone.classList.add("modal__input--invalid");
  }

  var addMailError = function () {
    errorMail.classList.add("modal__error--active");
    email.classList.add("modal__input--invalid");
  }

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function (evt) {
      evt.preventDefault();
      openPopup();

      if (storagePhone && storageMail) {
        phone.value = storagePhone;
        email.value = storageMail;
        buttonSubmit.focus();
        removePhoneError();
        removeMailError();
      } else {
        phone.focus();
      }
    })
  };

  email.addEventListener("input", function (event) {
    if (email.validity.valid) {
      removeMailError();
    }
  }, false);

  phone.addEventListener("input", function (event) {
    if (phone.validity.valid) {
      removePhoneError();
    }
  }, false);

  var onSuccessPopupEscPress = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeSuccessPopup();
    }
  };

  var onOutsideOfSuccessPopupClick = function (evt) {
    closeSuccessPopup();
  };

  var onButtonSuccessClick = function (evt) {
    evt.preventDefault();
    closeSuccessPopup();
  }

  var openSuccessPopup = function () {
    popupSuccess.classList.add("modal-wrapper--show");
    overlay.classList.add("overlay--show");

    overlay.addEventListener('click', onOutsideOfSuccessPopupClick);

    buttonSuccess.addEventListener('click', onButtonSuccessClick);

    document.addEventListener('keydown', onSuccessPopupEscPress);
  };

  var closeSuccessPopup = function () {
    popupSuccess.classList.remove("modal-wrapper--show");
    overlay.classList.remove("overlay--show");

    overlay.removeEventListener('click', onOutsideOfSuccessPopupClick);

    buttonSuccess.removeEventListener('click', onButtonSuccessClick);

    document.removeEventListener('keydown', onSuccessPopupEscPress);
  };

  form.setAttribute('novalidate', '');

  form.addEventListener("submit", function (evt) {
    save(new FormData(form), function () {
      if (email.validity.valid && phone.validity.valid) {
        openSuccessPopup();
        popup.classList.remove("modal-wrapper--show");
      } else if (!phone.validity.valid) {
        evt.preventDefault();
        addPhoneError();
      } else if (!email.validity.valid) {
        evt.preventDefault();
        addMailError();
      } else if (isStorageSupport) {
        localStorage.setItem("phone", phone.value);
        localStorage.setItem("email", email.value);
      }
    }, function () {
      console.log("неправильный ввод");
    });
    evt.preventDefault();
  });

  var saveQuestion = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.open('POST', URL);
    xhr.send(data);
  }

  formQuestion.addEventListener("submit", function (evt) {
    saveQuestion(new FormData(formQuestion), function () {
      openSuccessPopup();
    }, function () {
      console.log("неправильный ввод");
    });
    evt.preventDefault();
  });
})();
