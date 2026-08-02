(() => {
  'use strict';

  const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  if ('serviceWorker' in navigator) {
    let swRegistration = null;
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js', { updateViaCache: 'none' }).then((reg) => {
        swRegistration = reg;
        reg.update();
      }).catch((error) => {
        console.warn('Service worker не зарегистрирован:', error);
      });
    });

    // Возвращаясь на вкладку (например, из WhatsApp) — снова проверяем,
    // нет ли новой версии, а не только при самом первом открытии.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && swRegistration) {
        swRegistration.update();
      }
    });

    // Если появилась новая версия — страница сама обновится один раз,
    // без ручных действий пользователя (очистка кэша, инкогнито и т.п.)
    let alreadyReloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (alreadyReloaded) return;
      alreadyReloaded = true;
      window.location.reload();
    });
  }
})();
