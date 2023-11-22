// JavaScript - public/js/script.js

document.addEventListener('DOMContentLoaded', function() {
  // 
  const forms = document.querySelectorAll('form.needs-validation');
  forms.forEach(form => {
    form.addEventListener('submit', function(event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
  const toggleButton = document.getElementById('toggleButton');
  const contentToToggle = document.getElementById('toggleContent');

  if (toggleButton && contentToToggle) {
    toggleButton.addEventListener('click', function() {
      contentToToggle.classList.toggle('hidden');
    });
  }

  // 动态显示和隐藏内容
  const showMoreButton = document.getElementById('showMoreButton');
  const extraContent = document.getElementById('extraContent');

  if (showMoreButton && extraContent) {
    showMoreButton.addEventListener('click', function() {
      extraContent.style.display = extraContent.style.display === 'none' ? 'block' : 'none';
    });
  }

  // 动画效果
  const animatedElement = document.getElementById('animatedElement');
  if (animatedElement) {
    animatedElement.addEventListener('mouseover', function() {
      animatedElement.classList.add('animate');
    });

    animatedElement.addEventListener('mouseout', function() {
      animatedElement.classList.remove('animate');
    });
  }
});

