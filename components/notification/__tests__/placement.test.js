import notification, { actWrapper, actDestroy } from '..';
import { act, fireEvent } from '../../../tests/utils';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Notification.placement', () => {
  beforeAll(() => {
    actWrapper(act);
  });

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllTimers();
  });

  afterEach(() => {
    actDestroy();

    act(() => {
      jest.runAllTimers();
    });

    // Clean up all motion
    document.querySelectorAll('.ant-notification-notice').forEach(ele => {
      fireEvent.animationEnd(ele);
    });

    jest.clearAllTimers();
    jest.useRealTimers();
  });

  function $$(className) {
    return document.body.querySelectorAll(className);
  }

  function getStyle(el, prop) {
    const style = window.getComputedStyle ? window.getComputedStyle(el) : el.currentStyle;
    // If a css property's value is `auto`, it will return an empty string.
    return prop ? style[prop] : style;
  }

  function open(args) {
    notification.open({
      message: 'Notification Title',
      description: 'This is the content of the notification.',
      ...args,
    });
  }

  function config(args) {
    notification.config({
      ...args,
    });

    act(() => {
      open();
    });
  }

  describe('placement', () => {
    it('can be configured per notification using the `open` method', () => {
      const defaultTop = '24px';
      const defaultBottom = '24px';
      let style;

      // top
      act(() => {
        open({
          placement: 'top',
          top: 50,
        });
      });

      style = getStyle($$('.ant-notification-top')[0]);
      expect(style.top).toBe('50px');
      expect(style.left).toBe('50%');
      expect(style.transform).toBe('translateX(-50%)');
      expect(style.right).toBe('');
      expect(style.bottom).toBe('');

      act(() => {
        open({
          placement: 'top',
        });
      });
      expect($$('.ant-notification-top').length).toBe(1);

      // topLeft
      act(() => {
        open({
          placement: 'topLeft',
          top: 50,
        });
      });
      style = getStyle($$('.ant-notification-topLeft')[0]);
      expect(style.top).toBe('50px');
      expect(style.left).toBe('0px');
      expect(style.bottom).toBe('');

      act(() => {
        open({
          placement: 'topLeft',
        });
      });
      expect($$('.ant-notification-topLeft').length).toBe(1);

      // topRight
      act(() => {
        open({
          placement: 'topRight',
        });
      });
      style = getStyle($$('.ant-notification-topRight')[0]);
      expect(style.top).toBe(defaultTop);
      expect(style.right).toBe('0px');
      expect(style.bottom).toBe('');

      act(() => {
        open({
          placement: 'topRight',
        });
      });
      expect($$('.ant-notification-topRight').length).toBe(1);

      // bottom
      act(() => {
        open({
          placement: 'bottom',
          bottom: 100,
        });
      });
      style = getStyle($$('.ant-notification-bottom')[0]);
      expect(style.top).toBe('');
      expect(style.left).toBe('50%');
      expect(style.transform).toBe('translateX(-50%)');
      expect(style.right).toBe('');
      expect(style.bottom).toBe('100px');

      act(() => {
        open({
          placement: 'bottom',
        });
      });
      expect($$('.ant-notification-bottom').length).toBe(1);

      // bottomRight
      act(() => {
        open({
          placement: 'bottomRight',
          bottom: 100,
        });
      });
      style = getStyle($$('.ant-notification-bottomRight')[0]);
      expect(style.top).toBe('');
      expect(style.right).toBe('0px');
      expect(style.bottom).toBe('100px');

      act(() => {
        open({
          placement: 'bottomRight',
        });
      });
      expect($$('.ant-notification-bottomRight').length).toBe(1);

      // bottomLeft
      act(() => {
        open({
          placement: 'bottomLeft',
        });
      });
      style = getStyle($$('.ant-notification-bottomLeft')[0]);
      expect(style.top).toBe('');
      expect(style.left).toBe('0px');
      expect(style.bottom).toBe(defaultBottom);

      act(() => {
        open({
          placement: 'bottomLeft',
        });
      });
      expect($$('.ant-notification-bottomLeft').length).toBe(1);
    });

    it('can be configured globally using the `config` method', () => {
      let style;

      // topLeft
      config({
        placement: 'topLeft',
        top: 50,
        bottom: 50,
      });
      style = getStyle($$('.ant-notification-topLeft')[0]);
      expect(style.top).toBe('50px');
      expect(style.left).toBe('0px');
      expect(style.bottom).toBe('');

      // topRight
      config({
        placement: 'topRight',
        top: 100,
        bottom: 50,
      });
      style = getStyle($$('.ant-notification-topRight')[0]);
      expect(style.top).toBe('100px');
      expect(style.right).toBe('0px');
      expect(style.bottom).toBe('');

      // bottomRight
      config({
        placement: 'bottomRight',
        top: 50,
        bottom: 100,
      });
      style = getStyle($$('.ant-notification-bottomRight')[0]);
      expect(style.top).toBe('');
      expect(style.right).toBe('0px');
      expect(style.bottom).toBe('100px');

      // bottomLeft
      config({
        placement: 'bottomLeft',
        top: 100,
        bottom: 50,
      });
      style = getStyle($$('.ant-notification-bottomLeft')[0]);
      expect(style.top).toBe('');
      expect(style.left).toBe('0px');
      expect(style.bottom).toBe('50px');
    });
  });

  describe('mountNode', () => {
    const $container = document.createElement('div');
    beforeEach(() => {
      document.body.appendChild($container);
    });
    afterEach(() => {
      $container.remove();
    });

    it('can be configured per notification using the `open` method', () => {
      open({
        getContainer: () => $container,
      });

      expect($container.querySelector('.ant-notification')).not.toBe(null);
      notification.destroy();

      // Leave motion
      act(() => {
        jest.runAllTimers();
      });
      document.querySelectorAll('.ant-notification-notice').forEach(ele => {
        fireEvent.animationEnd(ele);
      });

      // Upcoming notifications still use their default mountNode and not $container
      open();
      expect($container.querySelector('.ant-notification')).toBe(null);
    });

    it('can be configured globally using the `config` method', () => {
      config({
        getContainer: () => $container,
      });
      expect($container.querySelector('.ant-notification')).not.toBe(null);
      notification.destroy();

      // Leave motion
      act(() => {
        jest.runAllTimers();
      });
      document.querySelectorAll('.ant-notification-notice').forEach(ele => {
        fireEvent.animationEnd(ele);
      });

      // Upcoming notifications are mounted in $container
      act(() => {
        open();
      });
      expect($container.querySelector('.ant-notification')).not.toBe(null);
    });
  });
});
