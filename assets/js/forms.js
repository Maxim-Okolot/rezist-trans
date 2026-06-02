(function () {
  const PHONE_PREFIX = '+375';
  const PHONE_DIGITS = 9;

  function extractPhoneDigits(value) {
    let digits = String(value).replace(/\D/g, '');

    if (digits.startsWith('375')) {
      digits = digits.slice(3);
    }

    return digits.slice(0, PHONE_DIGITS);
  }

  function formatPhone(digits) {
    if (!digits.length) {
      return '';
    }

    let result = `${PHONE_PREFIX}(`;
    result += digits.slice(0, 2);

    if (digits.length < 2) {
      return result;
    }

    result += ')';

    if (digits.length > 2) {
      result += digits.slice(2, 5);
    }

    if (digits.length > 5) {
      result += `-${digits.slice(5, 7)}`;
    }

    if (digits.length > 7) {
      result += `-${digits.slice(7, 9)}`;
    }

    return result;
  }

  function initPhoneMask(input) {
    const applyMask = () => {
      const digits = extractPhoneDigits(input.value);
      input.value = formatPhone(digits);
    };

    input.addEventListener('focus', () => {
      if (!extractPhoneDigits(input.value).length) {
        input.value = `${PHONE_PREFIX}(`;
      }
    });

    input.addEventListener('blur', () => {
      if (input.value === `${PHONE_PREFIX}(` || input.value === PHONE_PREFIX) {
        input.value = '';
      }
    });

    input.addEventListener('input', applyMask);
    input.addEventListener('paste', (event) => {
      event.preventDefault();
      const pasted = (event.clipboardData || window.clipboardData).getData('text');
      input.value = formatPhone(extractPhoneDigits(pasted));
    });
  }

  function isFilled(value) {
    return String(value).trim().length > 0;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(value).trim());
  }

  function isValidPhone(value) {
    return extractPhoneDigits(value).length === PHONE_DIGITS;
  }

  function getErrorEl(input) {
    const field = input.closest('.request-form__field, .cta-dark__field');

    if (!field) {
      return null;
    }

    let error = field.querySelector('.form-error');

    if (!error) {
      error = document.createElement('span');
      error.className = 'form-error';
      error.setAttribute('role', 'alert');
      field.append(error);
    }

    return error;
  }

  function showError(input, message) {
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');

    const error = getErrorEl(input);

    if (error) {
      error.textContent = message;
    }
  }

  function clearError(input) {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');

    const error = getErrorEl(input);

    if (error) {
      error.textContent = '';
    }
  }

  function validateField(input) {
    const rule = input.dataset.validate;

    if (!rule) {
      return true;
    }

    const value = input.value;

    if (rule === 'required') {
      if (!isFilled(value)) {
        showError(input, 'Заполните поле');
        return false;
      }
    }

    if (rule === 'email') {
      if (!isFilled(value)) {
        showError(input, 'Заполните поле');
        return false;
      }

      if (!isValidEmail(value)) {
        showError(input, 'Введите корректный e-mail');
        return false;
      }
    }

    if (rule === 'phone') {
      if (!isValidPhone(value)) {
        showError(input, 'Введите номер в формате +375(XX)XXX-XX-XX');
        return false;
      }
    }

    clearError(input);
    return true;
  }

  function validateForm(form) {
    const fields = [...form.querySelectorAll('[data-validate]')];
    let isValid = true;

    fields.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  document.querySelectorAll('[data-phone-mask]').forEach(initPhoneMask);

  document.querySelectorAll('form[novalidate]').forEach((form) => {
    form.querySelectorAll('[data-validate]').forEach((input) => {
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          validateField(input);
        }
      });

      input.addEventListener('blur', () => {
        validateField(input);
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!validateForm(form)) {
        form.querySelector('.is-invalid')?.focus();
        return;
      }

      form.reset();
      form.querySelectorAll('[data-phone-mask]').forEach((phoneInput) => {
        phoneInput.value = '';
      });
    });
  });
})();
