/**!
* tippy.js v6.3.7
* (c) 2017-2021 atomiks
* MIT License
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@popperjs/core')) :
  typeof define === 'function' && define.amd ? define(['@popperjs/core'], factory) :
  (global = global || self, global.tippy = factory(global.Popper));
}(this, (function (core) { 'use strict';

  var css = ".tippy-box[data-animation=fade][data-state=hidden]{opacity:0}[data-tippy-root]{max-width:calc(100vw - 10px)}.tippy-box{position:relative;background-color:#333;color:#fff;border-radius:4px;font-size:14px;line-height:1.4;white-space:normal;outline:0;transition-property:transform,visibility,opacity}.tippy-box[data-placement^=top]>.tippy-arrow{bottom:0}.tippy-box[data-placement^=top]>.tippy-arrow:before{bottom:-7px;left:0;border-width:8px 8px 0;border-top-color:initial;transform-origin:center top}.tippy-box[data-placement^=bottom]>.tippy-arrow{top:0}.tippy-box[data-placement^=bottom]>.tippy-arrow:before{top:-7px;left:0;border-width:0 8px 8px;border-bottom-color:initial;transform-origin:center bottom}.tippy-box[data-placement^=left]>.tippy-arrow{right:0}.tippy-box[data-placement^=left]>.tippy-arrow:before{border-width:8px 0 8px 8px;border-left-color:initial;right:-7px;transform-origin:center left}.tippy-box[data-placement^=right]>.tippy-arrow{left:0}.tippy-box[data-placement^=right]>.tippy-arrow:before{left:-7px;border-width:8px 8px 8px 0;border-right-color:initial;transform-origin:center right}.tippy-box[data-inertia][data-state=visible]{transition-timing-function:cubic-bezier(.54,1.5,.38,1.11)}.tippy-arrow{width:16px;height:16px;color:#333}.tippy-arrow:before{content:\"\";position:absolute;border-color:transparent;border-style:solid}.tippy-content{position:relative;padding:5px 9px;z-index:1}";

  function injectCSS(css) {
    var style = document.createElement('style');
    style.textContent = css;
    style.setAttribute('data-tippy-stylesheet', '');
    var head = document.head;
    var firstStyleOrLinkTag = document.querySelector('head>style,head>link');

    if (firstStyleOrLinkTag) {
      head.insertBefore(style, firstStyleOrLinkTag);
    } else {
      head.appendChild(style);
    }
  }

  var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  var isIE11 = isBrowser ? // @ts-ignore
  !!window.msCrypto : false;

  var ROUND_ARROW = '<svg width="16" height="6" xmlns="http://www.w3.org/2000/svg"><path d="M0 6s1.796-.013 4.67-3.615C5.851.9 6.93.006 8 0c1.07-.006 2.148.887 3.343 2.385C14.233 6.005 16 6 16 6H0z"></svg>';
  var BOX_CLASS = "tippy-box";
  var CONTENT_CLASS = "tippy-content";
  var BACKDROP_CLASS = "tippy-backdrop";
  var ARROW_CLASS = "tippy-arrow";
  var SVG_ARROW_CLASS = "tippy-svg-arrow";
  var TOUCH_OPTIONS = {
    passive: true,
    capture: true
  };
  var TIPPY_DEFAULT_APPEND_TO = function TIPPY_DEFAULT_APPEND_TO() {
    return document.body;
  };

  function hasOwnProperty(obj, key) {
    return {}.hasOwnProperty.call(obj, key);
  }
  function getValueAtIndexOrReturn(value, index, defaultValue) {
    if (Array.isArray(value)) {
      var v = value[index];
      return v == null ? Array.isArray(defaultValue) ? defaultValue[index] : defaultValue : v;
    }

    return value;
  }
  function isType(value, type) {
    var str = {}.toString.call(value);
    return str.indexOf('[object') === 0 && str.indexOf(type + "]") > -1;
  }
  function invokeWithArgsOrReturn(value, args) {
    return typeof value === 'function' ? value.apply(void 0, args) : value;
  }
  function debounce(fn, ms) {
    // Avoid wrapping in `setTimeout` if ms is 0 anyway
    if (ms === 0) {
      return fn;
    }

    var timeout;
    return function (arg) {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        fn(arg);
      }, ms);
    };
  }
  function removeProperties(obj, keys) {
    var clone = Object.assign({}, obj);
    keys.forEach(function (key) {
      delete clone[key];
    });
    return clone;
  }
  function splitBySpaces(value) {
    return value.split(/\s+/).filter(Boolean);
  }
  function normalizeToArray(value) {
    return [].concat(value);
  }
  function pushIfUnique(arr, value) {
    if (arr.indexOf(value) === -1) {
      arr.push(value);
    }
  }
  function unique(arr) {
    return arr.filter(function (item, index) {
      return arr.indexOf(item) === index;
    });
  }
  function getBasePlacement(placement) {
    return placement.split('-')[0];
  }
  function arrayFrom(value) {
    return [].slice.call(value);
  }
  function removeUndefinedProps(obj) {
    return Object.keys(obj).reduce(function (acc, key) {
      if (obj[key] !== undefined) {
        acc[key] = obj[key];
      }

      return acc;
    }, {});
  }

  function div() {
    return document.createElement('div');
  }
  function isElement(value) {
    return ['Element', 'Fragment'].some(function (type) {
      return isType(value, type);
    });
  }
  function isNodeList(value) {
    return isType(value, 'NodeList');
  }
  function isMouseEvent(value) {
    return isType(value, 'MouseEvent');
  }
  function isReferenceElement(value) {
    return !!(value && value._tippy && value._tippy.reference === value);
  }
  function getArrayOfElements(value) {
    if (isElement(value)) {
      return [value];
    }

    if (isNodeList(value)) {
      return arrayFrom(value);
    }

    if (Array.isArray(value)) {
      return value;
    }

    return arrayFrom(document.querySelectorAll(value));
  }
  function setTransitionDuration(els, value) {
    els.forEach(function (el) {
      if (el) {
        el.style.transitionDuration = value + "ms";
      }
    });
  }
  function setVisibilityState(els, state) {
    els.forEach(function (el) {
      if (el) {
        el.setAttribute('data-state', state);
      }
    });
  }
  function getOwnerDocument(elementOrElements) {
    var _element$ownerDocumen;

    var _normalizeToArray = normalizeToArray(elementOrElements),
        element = _normalizeToArray[0]; // Elements created via a <template> have an ownerDocument with no reference to the body


    return element != null && (_element$ownerDocumen = element.ownerDocument) != null && _element$ownerDocumen.body ? element.ownerDocument : document;
  }
  function isCursorOutsideInteractiveBorder(popperTreeData, event) {
    var clientX = event.clientX,
        clientY = event.clientY;
    return popperTreeData.every(function (_ref) {
      var popperRect = _ref.popperRect,
          popperState = _ref.popperState,
          props = _ref.props;
      var interactiveBorder = props.interactiveBorder;
      var basePlacement = getBasePlacement(popperState.placement);
      var offsetData = popperState.modifiersData.offset;

      if (!offsetData) {
        return true;
      }

      var topDistance = basePlacement === 'bottom' ? offsetData.top.y : 0;
      var bottomDistance = basePlacement === 'top' ? offsetData.bottom.y : 0;
      var leftDistance = basePlacement === 'right' ? offsetData.left.x : 0;
      var rightDistance = basePlacement === 'left' ? offsetData.right.x : 0;
      var exceedsTop = popperRect.top - clientY + topDistance > interactiveBorder;
      var exceedsBottom = clientY - popperRect.bottom - bottomDistance > interactiveBorder;
      var exceedsLeft = popperRect.left - clientX + leftDistance > interactiveBorder;
      var exceedsRight = clientX - popperRect.right - rightDistance > interactiveBorder;
      return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
    });
  }
  function updateTransitionEndListener(box, action, listener) {
    var method = action + "EventListener"; // some browsers apparently support `transition` (unprefixed) but only fire
    // `webkitTransitionEnd`...

    ['transitionend', 'webkitTransitionEnd'].forEach(function (event) {
      box[method](event, listener);
    });
  }
  /**
   * Compared to xxx.contains, this function works for dom structures with shadow
   * dom
   */

  function actualContains(parent, child) {
    var target = child;

    while (target) {
      var _target$getRootNode;

      if (parent.contains(target)) {
        return true;
      }

      target = target.getRootNode == null ? void 0 : (_target$getRootNode = target.getRootNode()) == null ? void 0 : _target$getRootNode.host;
    }

    return false;
  }

  var currentInput = {
    isTouch: false
  };
  var lastMouseMoveTime = 0;
  /**
   * When a `touchstart` event is fired, it's assumed the user is using touch
   * input. We'll bind a `mousemove` event listener to listen for mouse input in
   * the future. This way, the `isTouch` property is fully dynamic and will handle
   * hybrid devices that use a mix of touch + mouse input.
   */

  function onDocumentTouchStart() {
    if (currentInput.isTouch) {
      return;
    }

    currentInput.isTouch = true;

    if (window.performance) {
      document.addEventListener('mousemove', onDocumentMouseMove);
    }
  }
  /**
   * When two `mousemove` event are fired consecutively within 20ms, it's assumed
   * the user is using mouse input again. `mousemove` can fire on touch devices as
   * well, but very rarely that quickly.
   */

  function onDocumentMouseMove() {
    var now = performance.now();

    if (now - lastMouseMoveTime < 20) {
      currentInput.isTouch = false;
      document.removeEventListener('mousemove', onDocumentMouseMove);
    }

    lastMouseMoveTime = now;
  }
  /**
   * When an element is in focus and has a tippy, leaving the tab/window and
   * returning causes it to show again. For mouse users this is unexpected, but
   * for keyboard use it makes sense.
   * TODO: find a better technique to solve this problem
   */

  function onWindowBlur() {
    var activeElement = document.activeElement;

    if (isReferenceElement(activeElement)) {
      var instance = activeElement._tippy;

      if (activeElement.blur && !instance.state.isVisible) {
        activeElement.blur();
      }
    }
  }
  function bindGlobalEventListeners() {
    document.addEventListener('touchstart', onDocumentTouchStart, TOUCH_OPTIONS);
    window.addEventListener('blur', onWindowBlur);
  }

  function createMemoryLeakWarning(method) {
    var txt = method === 'destroy' ? 'n already-' : ' ';
    return [method + "() was called on a" + txt + "destroyed instance. This is a no-op but", 'indicates a potential memory leak.'].join(' ');
  }
  function clean(value) {
    var spacesAndTabs = /[ \t]{2,}/g;
    var lineStartWithSpaces = /^[ \t]*/gm;
    return value.replace(spacesAndTabs, ' ').replace(lineStartWithSpaces, '').trim();
  }

  function getDevMessage(message) {
    return clean("\n  %ctippy.js\n\n  %c" + clean(message) + "\n\n  %c\uD83D\uDC77\u200D This is a development-only message. It will be removed in production.\n  ");
  }

  function getFormattedMessage(message) {
    return [getDevMessage(message), // title
    'color: #00C584; font-size: 1.3em; font-weight: bold;', // message
    'line-height: 1.5', // footer
    'color: #a6a095;'];
  } // Assume warnings and errors never have the same message

  var visitedMessages;

  {
    resetVisitedMessages();
  }

  function resetVisitedMessages() {
    visitedMessages = new Set();
  }
  function warnWhen(condition, message) {
    if (condition && !visitedMessages.has(message)) {
      var _console;

      visitedMessages.add(message);

      (_console = console).warn.apply(_console, getFormattedMessage(message));
    }
  }
  function errorWhen(condition, message) {
    if (condition && !visitedMessages.has(message)) {
      var _console2;

      visitedMessages.add(message);

      (_console2 = console).error.apply(_console2, getFormattedMessage(message));
    }
  }
  function validateTargets(targets) {
    var didPassFalsyValue = !targets;
    var didPassPlainObject = Object.prototype.toString.call(targets) === '[object Object]' && !targets.addEventListener;
    errorWhen(didPassFalsyValue, ['tippy() was passed', '`' + String(targets) + '`', 'as its targets (first) argument. Valid types are: String, Element,', 'Element[], or NodeList.'].join(' '));
    errorWhen(didPassPlainObject, ['tippy() was passed a plain object which is not supported as an argument', 'for virtual positioning. Use props.getReferenceClientRect instead.'].join(' '));
  }

  var pluginProps = {
    animateFill: false,
    followCursor: false,
    inlinePositioning: false,
    sticky: false
  };
  var renderProps = {
    allowHTML: false,
    animation: 'fade',
    arrow: true,
    content: '',
    inertia: false,
    maxWidth: 350,
    role: 'tooltip',
    theme: '',
    zIndex: 9999
  };
  var defaultProps = Object.assign({
    appendTo: TIPPY_DEFAULT_APPEND_TO,
    aria: {
      content: 'auto',
      expanded: 'auto'
    },
    delay: 0,
    duration: [300, 250],
    getReferenceClientRect: null,
    hideOnClick: true,
    ignoreAttributes: false,
    interactive: false,
    interactiveBorder: 2,
    interactiveDebounce: 0,
    moveTransition: '',
    offset: [0, 10],
    onAfterUpdate: function onAfterUpdate() {},
    onBeforeUpdate: function onBeforeUpdate() {},
    onCreate: function onCreate() {},
    onDestroy: function onDestroy() {},
    onHidden: function onHidden() {},
    onHide: function onHide() {},
    onMount: function onMount() {},
    onShow: function onShow() {},
    onShown: function onShown() {},
    onTrigger: function onTrigger() {},
    onUntrigger: function onUntrigger() {},
    onClickOutside: function onClickOutside() {},
    placement: 'top',
    plugins: [],
    popperOptions: {},
    render: null,
    showOnCreate: false,
    touch: true,
    trigger: 'mouseenter focus',
    triggerTarget: null
  }, pluginProps, renderProps);
  var defaultKeys = Object.keys(defaultProps);
  var setDefaultProps = function setDefaultProps(partialProps) {
    /* istanbul ignore else */
    {
      validateProps(partialProps, []);
    }

    var keys = Object.keys(partialProps);
    keys.forEach(function (key) {
      defaultProps[key] = partialProps[key];
    });
  };
  function getExtendedPassedProps(passedProps) {
    var plugins = passedProps.plugins || [];
    var pluginProps = plugins.reduce(function (acc, plugin) {
      var name = plugin.name,
          defaultValue = plugin.defaultValue;

      if (name) {
        var _name;

        acc[name] = passedProps[name] !== undefined ? passedProps[name] : (_name = defaultProps[name]) != null ? _name : defaultValue;
      }

      return acc;
    }, {});
    return Object.assign({}, passedProps, pluginProps);
  }
  function getDataAttributeProps(reference, plugins) {
    var propKeys = plugins ? Object.keys(getExtendedPassedProps(Object.assign({}, defaultProps, {
      plugins: plugins
    }))) : defaultKeys;
    var props = propKeys.reduce(function (acc, key) {
      var valueAsString = (reference.getAttribute("data-tippy-" + key) || '').trim();

      if (!valueAsString) {
        return acc;
      }

      if (key === 'content') {
        acc[key] = valueAsString;
      } else {
        try {
          acc[key] = JSON.parse(valueAsString);
        } catch (e) {
          acc[key] = valueAsString;
        }
      }

      return acc;
    }, {});
    return props;
  }
  function evaluateProps(reference, props) {
    var out = Object.assign({}, props, {
      content: invokeWithArgsOrReturn(props.content, [reference])
    }, props.ignoreAttributes ? {} : getDataAttributeProps(reference, props.plugins));
    out.aria = Object.assign({}, defaultProps.aria, out.aria);
    out.aria = {
      expanded: out.aria.expanded === 'auto' ? props.interactive : out.aria.expanded,
      content: out.aria.content === 'auto' ? props.interactive ? null : 'describedby' : out.aria.content
    };
    return out;
  }
  function validateProps(partialProps, plugins) {
    if (partialProps === void 0) {
      partialProps = {};
    }

    if (plugins === void 0) {
      plugins = [];
    }

    var keys = Object.keys(partialProps);
    keys.forEach(function (prop) {
      var nonPluginProps = removeProperties(defaultProps, Object.keys(pluginProps));
      var didPassUnknownProp = !hasOwnProperty(nonPluginProps, prop); // Check if the prop exists in `plugins`

      if (didPassUnknownProp) {
        didPassUnknownProp = plugins.filter(function (plugin) {
          return plugin.name === prop;
        }).length === 0;
      }

      warnWhen(didPassUnknownProp, ["`" + prop + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", 'a plugin, forgot to pass it in an array as props.plugins.', '\n\n', 'All props: https://atomiks.github.io/tippyjs/v6/all-props/\n', 'Plugins: https://atomiks.github.io/tippyjs/v6/plugins/'].join(' '));
    });
  }

  var innerHTML = function innerHTML() {
    return 'innerHTML';
  };

  function dangerouslySetInnerHTML(element, html) {
    element[innerHTML()] = html;
  }

  function createArrowElement(value) {
    var arrow = div();

    if (value === true) {
      arrow.className = ARROW_CLASS;
    } else {
      arrow.className = SVG_ARROW_CLASS;

      if (isElement(value)) {
        arrow.appendChild(value);
      } else {
        dangerouslySetInnerHTML(arrow, value);
      }
    }

    return arrow;
  }

  function setContent(content, props) {
    if (isElement(props.content)) {
      dangerouslySetInnerHTML(content, '');
      content.appendChild(props.content);
    } else if (typeof props.content !== 'function') {
      if (props.allowHTML) {
        dangerouslySetInnerHTML(content, props.content);
      } else {
        content.textContent = props.content;
      }
    }
  }
  function getChildren(popper) {
    var box = popper.firstElementChild;
    var boxChildren = arrayFrom(box.children);
    return {
      box: box,
      content: boxChildren.find(function (node) {
        return node.classList.contains(CONTENT_CLASS);
      }),
      arrow: boxChildren.find(function (node) {
        return node.classList.contains(ARROW_CLASS) || node.classList.contains(SVG_ARROW_CLASS);
      }),
      backdrop: boxChildren.find(function (node) {
        return node.classList.contains(BACKDROP_CLASS);
      })
    };
  }
  function render(instance) {
    var popper = div();
    var box = div();
    box.className = BOX_CLASS;
    box.setAttribute('data-state', 'hidden');
    box.setAttribute('tabindex', '-1');
    var content = div();
    content.className = CONTENT_CLASS;
    content.setAttribute('data-state', 'hidden');
    setContent(content, instance.props);
    popper.appendChild(box);
    box.appendChild(content);
    onUpdate(instance.props, instance.props);

    function onUpdate(prevProps, nextProps) {
      var _getChildren = getChildren(popper),
          box = _getChildren.box,
          content = _getChildren.content,
          arrow = _getChildren.arrow;

      if (nextProps.theme) {
        box.setAttribute('data-theme', nextProps.theme);
      } else {
        box.removeAttribute('data-theme');
      }

      if (typeof nextProps.animation === 'string') {
        box.setAttribute('data-animation', nextProps.animation);
      } else {
        box.removeAttribute('data-animation');
      }

      if (nextProps.inertia) {
        box.setAttribute('data-inertia', '');
      } else {
        box.removeAttribute('data-inertia');
      }

      box.style.maxWidth = typeof nextProps.maxWidth === 'number' ? nextProps.maxWidth + "px" : nextProps.maxWidth;

      if (nextProps.role) {
        box.setAttribute('role', nextProps.role);
      } else {
        box.removeAttribute('role');
      }

      if (prevProps.content !== nextProps.content || prevProps.allowHTML !== nextProps.allowHTML) {
        setContent(content, instance.props);
      }

      if (nextProps.arrow) {
        if (!arrow) {
          box.appendChild(createArrowElement(nextProps.arrow));
        } else if (prevProps.arrow !== nextProps.arrow) {
          box.removeChild(arrow);
          box.appendChild(createArrowElement(nextProps.arrow));
        }
      } else if (arrow) {
        box.removeChild(arrow);
      }
    }

    return {
      popper: popper,
      onUpdate: onUpdate
    };
  } // Runtime check to identify if the render function is the default one; this
  // way we can apply default CSS transitions logic and it can be tree-shaken away

  render.$$tippy = true;

  var idCounter = 1;
  var mouseMoveListeners = []; // Used by `hideAll()`

  var mountedInstances = [];
  function createTippy(reference, passedProps) {
    var props = evaluateProps(reference, Object.assign({}, defaultProps, getExtendedPassedProps(removeUndefinedProps(passedProps)))); // ===========================================================================
    // 🔒 Private members
    // ===========================================================================

    var showTimeout;
    var hideTimeout;
    var scheduleHideAnimationFrame;
    var isVisibleFromClick = false;
    var didHideDueToDocumentMouseDown = false;
    var didTouchMove = false;
    var ignoreOnFirstUpdate = false;
    var lastTriggerEvent;
    var currentTransitionEndListener;
    var onFirstUpdate;
    var listeners = [];
    var debouncedOnMouseMove = debounce(onMouseMove, props.interactiveDebounce);
    var currentTarget; // ===========================================================================
    // 🔑 Public members
    // ===========================================================================

    var id = idCounter++;
    var popperInstance = null;
    var plugins = unique(props.plugins);
    var state = {
      // Is the instance currently enabled?
      isEnabled: true,
      // Is the tippy currently showing and not transitioning out?
      isVisible: false,
      // Has the instance been destroyed?
      isDestroyed: false,
      // Is the tippy currently mounted to the DOM?
      isMounted: false,
      // Has the tippy finished transitioning in?
      isShown: false
    };
    var instance = {
      // properties
      id: id,
      reference: reference,
      popper: div(),
      popperInstance: popperInstance,
      props: props,
      state: state,
      plugins: plugins,
      // methods
      clearDelayTimeouts: clearDelayTimeouts,
      setProps: setProps,
      setContent: setContent,
      show: show,
      hide: hide,
      hideWithInteractivity: hideWithInteractivity,
      enable: enable,
      disable: disable,
      unmount: unmount,
      destroy: destroy
    }; // TODO: Investigate why this early return causes a TDZ error in the tests —
    // it doesn't seem to happen in the browser

    /* istanbul ignore if */

    if (!props.render) {
      {
        errorWhen(true, 'render() function has not been supplied.');
      }

      return instance;
    } // ===========================================================================
    // Initial mutations
    // ===========================================================================


    var _props$render = props.render(instance),
        popper = _props$render.popper,
        onUpdate = _props$render.onUpdate;

    popper.setAttribute('data-tippy-root', '');
    popper.id = "tippy-" + instance.id;
    instance.popper = popper;
    reference._tippy = instance;
    popper._tippy = instance;
    var pluginsHooks = plugins.map(function (plugin) {
      return plugin.fn(instance);
    });
    var hasAriaExpanded = reference.hasAttribute('aria-expanded');
    addListeners();
    handleAriaExpandedAttribute();
    handleStyles();
    invokeHook('onCreate', [instance]);

    if (props.showOnCreate) {
      scheduleShow();
    } // Prevent a tippy with a delay from hiding if the cursor left then returned
    // before it started hiding


    popper.addEventListener('mouseenter', function () {
      if (instance.props.interactive && instance.state.isVisible) {
        instance.clearDelayTimeouts();
      }
    });
    popper.addEventListener('mouseleave', function () {
      if (instance.props.interactive && instance.props.trigger.indexOf('mouseenter') >= 0) {
        getDocument().addEventListener('mousemove', debouncedOnMouseMove);
      }
    });
    return instance; // ===========================================================================
    // 🔒 Private methods
    // ===========================================================================

    function getNormalizedTouchSettings() {
      var touch = instance.props.touch;
      return Array.isArray(touch) ? touch : [touch, 0];
    }

    function getIsCustomTouchBehavior() {
      return getNormalizedTouchSettings()[0] === 'hold';
    }

    function getIsDefaultRenderFn() {
      var _instance$props$rende;

      // @ts-ignore
      return !!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy);
    }

    function getCurrentTarget() {
      return currentTarget || reference;
    }

    function getDocument() {
      var parent = getCurrentTarget().parentNode;
      return parent ? getOwnerDocument(parent) : document;
    }

    function getDefaultTemplateChildren() {
      return getChildren(popper);
    }

    function getDelay(isShow) {
      // For touch or keyboard input, force `0` delay for UX reasons
      // Also if the instance is mounted but not visible (transitioning out),
      // ignore delay
      if (instance.state.isMounted && !instance.state.isVisible || currentInput.isTouch || lastTriggerEvent && lastTriggerEvent.type === 'focus') {
        return 0;
      }

      return getValueAtIndexOrReturn(instance.props.delay, isShow ? 0 : 1, defaultProps.delay);
    }

    function handleStyles(fromHide) {
      if (fromHide === void 0) {
        fromHide = false;
      }

      popper.style.pointerEvents = instance.props.interactive && !fromHide ? '' : 'none';
      popper.style.zIndex = "" + instance.props.zIndex;
    }

    function invokeHook(hook, args, shouldInvokePropsHook) {
      if (shouldInvokePropsHook === void 0) {
        shouldInvokePropsHook = true;
      }

      pluginsHooks.forEach(function (pluginHooks) {
        if (pluginHooks[hook]) {
          pluginHooks[hook].apply(pluginHooks, args);
        }
      });

      if (shouldInvokePropsHook) {
        var _instance$props;

        (_instance$props = instance.props)[hook].apply(_instance$props, args);
      }
    }

    function handleAriaContentAttribute() {
      var aria = instance.props.aria;

      if (!aria.content) {
        return;
      }

      var attr = "aria-" + aria.content;
      var id = popper.id;
      var nodes = normalizeToArray(instance.props.triggerTarget || reference);
      nodes.forEach(function (node) {
        var currentValue = node.getAttribute(attr);

        if (instance.state.isVisible) {
          node.setAttribute(attr, currentValue ? currentValue + " " + id : id);
        } else {
          var nextValue = currentValue && currentValue.replace(id, '').trim();

          if (nextValue) {
            node.setAttribute(attr, nextValue);
          } else {
            node.removeAttribute(attr);
          }
        }
      });
    }

    function handleAriaExpandedAttribute() {
      if (hasAriaExpanded || !instance.props.aria.expanded) {
        return;
      }

      var nodes = normalizeToArray(instance.props.triggerTarget || reference);
      nodes.forEach(function (node) {
        if (instance.props.interactive) {
          node.setAttribute('aria-expanded', instance.state.isVisible && node === getCurrentTarget() ? 'true' : 'false');
        } else {
          node.removeAttribute('aria-expanded');
        }
      });
    }

    function cleanupInteractiveMouseListeners() {
      getDocument().removeEventListener('mousemove', debouncedOnMouseMove);
      mouseMoveListeners = mouseMoveListeners.filter(function (listener) {
        return listener !== debouncedOnMouseMove;
      });
    }

    function onDocumentPress(event) {
      // Moved finger to scroll instead of an intentional tap outside
      if (currentInput.isTouch) {
        if (didTouchMove || event.type === 'mousedown') {
          return;
        }
      }

      var actualTarget = event.composedPath && event.composedPath()[0] || event.target; // Clicked on interactive popper

      if (instance.props.interactive && actualContains(popper, actualTarget)) {
        return;
      } // Clicked on the event listeners target


      if (normalizeToArray(instance.props.triggerTarget || reference).some(function (el) {
        return actualContains(el, actualTarget);
      })) {
        if (currentInput.isTouch) {
          return;
        }

        if (instance.state.isVisible && instance.props.trigger.indexOf('click') >= 0) {
          return;
        }
      } else {
        invokeHook('onClickOutside', [instance, event]);
      }

      if (instance.props.hideOnClick === true) {
        instance.clearDelayTimeouts();
        instance.hide(); // `mousedown` event is fired right before `focus` if pressing the
        // currentTarget. This lets a tippy with `focus` trigger know that it
        // should not show

        didHideDueToDocumentMouseDown = true;
        setTimeout(function () {
          didHideDueToDocumentMouseDown = false;
        }); // The listener gets added in `scheduleShow()`, but this may be hiding it
        // before it shows, and hide()'s early bail-out behavior can prevent it
        // from being cleaned up

        if (!instance.state.isMounted) {
          removeDocumentPress();
        }
      }
    }

    function onTouchMove() {
      didTouchMove = true;
    }

    function onTouchStart() {
      didTouchMove = false;
    }

    function addDocumentPress() {
      var doc = getDocument();
      doc.addEventListener('mousedown', onDocumentPress, true);
      doc.addEventListener('touchend', onDocumentPress, TOUCH_OPTIONS);
      doc.addEventListener('touchstart', onTouchStart, TOUCH_OPTIONS);
      doc.addEventListener('touchmove', onTouchMove, TOUCH_OPTIONS);
    }

    function removeDocumentPress() {
      var doc = getDocument();
      doc.removeEventListener('mousedown', onDocumentPress, true);
      doc.removeEventListener('touchend', onDocumentPress, TOUCH_OPTIONS);
      doc.removeEventListener('touchstart', onTouchStart, TOUCH_OPTIONS);
      doc.removeEventListener('touchmove', onTouchMove, TOUCH_OPTIONS);
    }

    function onTransitionedOut(duration, callback) {
      onTransitionEnd(duration, function () {
        if (!instance.state.isVisible && popper.parentNode && popper.parentNode.contains(popper)) {
          callback();
        }
      });
    }

    function onTransitionedIn(duration, callback) {
      onTransitionEnd(duration, callback);
    }

    function onTransitionEnd(duration, callback) {
      var box = getDefaultTemplateChildren().box;

      function listener(event) {
        if (event.target === box) {
          updateTransitionEndListener(box, 'remove', listener);
          callback();
        }
      } // Make callback synchronous if duration is 0
      // `transitionend` won't fire otherwise


      if (duration === 0) {
        return callback();
      }

      updateTransitionEndListener(box, 'remove', currentTransitionEndListener);
      updateTransitionEndListener(box, 'add', listener);
      currentTransitionEndListener = listener;
    }

    function on(eventType, handler, options) {
      if (options === void 0) {
        options = false;
      }

      var nodes = normalizeToArray(instance.props.triggerTarget || reference);
      nodes.forEach(function (node) {
        node.addEventListener(eventType, handler, options);
        listeners.push({
          node: node,
          eventType: eventType,
          handler: handler,
          options: options
        });
      });
    }

    function addListeners() {
      if (getIsCustomTouchBehavior()) {
        on('touchstart', onTrigger, {
          passive: true
        });
        on('touchend', onMouseLeave, {
          passive: true
        });
      }

      splitBySpaces(instance.props.trigger).forEach(function (eventType) {
        if (eventType === 'manual') {
          return;
        }

        on(eventType, onTrigger);

        switch (eventType) {
          case 'mouseenter':
            on('mouseleave', onMouseLeave);
            break;

          case 'focus':
            on(isIE11 ? 'focusout' : 'blur', onBlurOrFocusOut);
            break;

          case 'focusin':
            on('focusout', onBlurOrFocusOut);
            break;
        }
      });
    }

    function removeListeners() {
      listeners.forEach(function (_ref) {
        var node = _ref.node,
            eventType = _ref.eventType,
            handler = _ref.handler,
            options = _ref.options;
        node.removeEventListener(eventType, handler, options);
      });
      listeners = [];
    }

    function onTrigger(event) {
      var _lastTriggerEvent;

      var shouldScheduleClickHide = false;

      if (!instance.state.isEnabled || isEventListenerStopped(event) || didHideDueToDocumentMouseDown) {
        return;
      }

      var wasFocused = ((_lastTriggerEvent = lastTriggerEvent) == null ? void 0 : _lastTriggerEvent.type) === 'focus';
      lastTriggerEvent = event;
      currentTarget = event.currentTarget;
      handleAriaExpandedAttribute();

      if (!instance.state.isVisible && isMouseEvent(event)) {
        // If scrolling, `mouseenter` events can be fired if the cursor lands
        // over a new target, but `mousemove` events don't get fired. This
        // causes interactive tooltips to get stuck open until the cursor is
        // moved
        mouseMoveListeners.forEach(function (listener) {
          return listener(event);
        });
      } // Toggle show/hide when clicking click-triggered tooltips


      if (event.type === 'click' && (instance.props.trigger.indexOf('mouseenter') < 0 || isVisibleFromClick) && instance.props.hideOnClick !== false && instance.state.isVisible) {
        shouldScheduleClickHide = true;
      } else {
        scheduleShow(event);
      }

      if (event.type === 'click') {
        isVisibleFromClick = !shouldScheduleClickHide;
      }

      if (shouldScheduleClickHide && !wasFocused) {
        scheduleHide(event);
      }
    }

    function onMouseMove(event) {
      var target = event.target;
      var isCursorOverReferenceOrPopper = getCurrentTarget().contains(target) || popper.contains(target);

      if (event.type === 'mousemove' && isCursorOverReferenceOrPopper) {
        return;
      }

      var popperTreeData = getNestedPopperTree().concat(popper).map(function (popper) {
        var _instance$popperInsta;

        var instance = popper._tippy;
        var state = (_instance$popperInsta = instance.popperInstance) == null ? void 0 : _instance$popperInsta.state;

        if (state) {
          return {
            popperRect: popper.getBoundingClientRect(),
            popperState: state,
            props: props
          };
        }

        return null;
      }).filter(Boolean);

      if (isCursorOutsideInteractiveBorder(popperTreeData, event)) {
        cleanupInteractiveMouseListeners();
        scheduleHide(event);
      }
    }

    function onMouseLeave(event) {
      var shouldBail = isEventListenerStopped(event) || instance.props.trigger.indexOf('click') >= 0 && isVisibleFromClick;

      if (shouldBail) {
        return;
      }

      if (instance.props.interactive) {
        instance.hideWithInteractivity(event);
        return;
      }

      scheduleHide(event);
    }

    function onBlurOrFocusOut(event) {
      if (instance.props.trigger.indexOf('focusin') < 0 && event.target !== getCurrentTarget()) {
        return;
      } // If focus was moved to within the popper


      if (instance.props.interactive && event.relatedTarget && popper.contains(event.relatedTarget)) {
        return;
      }

      scheduleHide(event);
    }

    function isEventListenerStopped(event) {
      return currentInput.isTouch ? getIsCustomTouchBehavior() !== event.type.indexOf('touch') >= 0 : false;
    }

    function createPopperInstance() {
      destroyPopperInstance();
      var _instance$props2 = instance.props,
          popperOptions = _instance$props2.popperOptions,
          placement = _instance$props2.placement,
          offset = _instance$props2.offset,
          getReferenceClientRect = _instance$props2.getReferenceClientRect,
          moveTransition = _instance$props2.moveTransition;
      var arrow = getIsDefaultRenderFn() ? getChildren(popper).arrow : null;
      var computedReference = getReferenceClientRect ? {
        getBoundingClientRect: getReferenceClientRect,
        contextElement: getReferenceClientRect.contextElement || getCurrentTarget()
      } : reference;
      var tippyModifier = {
        name: '$$tippy',
        enabled: true,
        phase: 'beforeWrite',
        requires: ['computeStyles'],
        fn: function fn(_ref2) {
          var state = _ref2.state;

          if (getIsDefaultRenderFn()) {
            var _getDefaultTemplateCh = getDefaultTemplateChildren(),
                box = _getDefaultTemplateCh.box;

            ['placement', 'reference-hidden', 'escaped'].forEach(function (attr) {
              if (attr === 'placement') {
                box.setAttribute('data-placement', state.placement);
              } else {
                if (state.attributes.popper["data-popper-" + attr]) {
                  box.setAttribute("data-" + attr, '');
                } else {
                  box.removeAttribute("data-" + attr);
                }
              }
            });
            state.attributes.popper = {};
          }
        }
      };
      var modifiers = [{
        name: 'offset',
        options: {
          offset: offset
        }
      }, {
        name: 'preventOverflow',
        options: {
          padding: {
            top: 2,
            bottom: 2,
            left: 5,
            right: 5
          }
        }
      }, {
        name: 'flip',
        options: {
          padding: 5
        }
      }, {
        name: 'computeStyles',
        options: {
          adaptive: !moveTransition
        }
      }, tippyModifier];

      if (getIsDefaultRenderFn() && arrow) {
        modifiers.push({
          name: 'arrow',
          options: {
            element: arrow,
            padding: 3
          }
        });
      }

      modifiers.push.apply(modifiers, (popperOptions == null ? void 0 : popperOptions.modifiers) || []);
      instance.popperInstance = core.createPopper(computedReference, popper, Object.assign({}, popperOptions, {
        placement: placement,
        onFirstUpdate: onFirstUpdate,
        modifiers: modifiers
      }));
    }

    function destroyPopperInstance() {
      if (instance.popperInstance) {
        instance.popperInstance.destroy();
        instance.popperInstance = null;
      }
    }

    function mount() {
      var appendTo = instance.props.appendTo;
      var parentNode; // By default, we'll append the popper to the triggerTargets's parentNode so
      // it's directly after the reference element so the elements inside the
      // tippy can be tabbed to
      // If there are clipping issues, the user can specify a different appendTo
      // and ensure focus management is handled correctly manually

      var node = getCurrentTarget();

      if (instance.props.interactive && appendTo === TIPPY_DEFAULT_APPEND_TO || appendTo === 'parent') {
        parentNode = node.parentNode;
      } else {
        parentNode = invokeWithArgsOrReturn(appendTo, [node]);
      } // The popper element needs to exist on the DOM before its position can be
      // updated as Popper needs to read its dimensions


      if (!parentNode.contains(popper)) {
        parentNode.appendChild(popper);
      }

      instance.state.isMounted = true;
      createPopperInstance();
      /* istanbul ignore else */

      {
        // Accessibility check
        warnWhen(instance.props.interactive && appendTo === defaultProps.appendTo && node.nextElementSibling !== popper, ['Interactive tippy element may not be accessible via keyboard', 'navigation because it is not directly after the reference element', 'in the DOM source order.', '\n\n', 'Using a wrapper <div> or <span> tag around the reference element', 'solves this by creating a new parentNode context.', '\n\n', 'Specifying `appendTo: document.body` silences this warning, but it', 'assumes you are using a focus management solution to handle', 'keyboard navigation.', '\n\n', 'See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity'].join(' '));
      }
    }

    function getNestedPopperTree() {
      return arrayFrom(popper.querySelectorAll('[data-tippy-root]'));
    }

    function scheduleShow(event) {
      instance.clearDelayTimeouts();

      if (event) {
        invokeHook('onTrigger', [instance, event]);
      }

      addDocumentPress();
      var delay = getDelay(true);

      var _getNormalizedTouchSe = getNormalizedTouchSettings(),
          touchValue = _getNormalizedTouchSe[0],
          touchDelay = _getNormalizedTouchSe[1];

      if (currentInput.isTouch && touchValue === 'hold' && touchDelay) {
        delay = touchDelay;
      }

      if (delay) {
        showTimeout = setTimeout(function () {
          instance.show();
        }, delay);
      } else {
        instance.show();
      }
    }

    function scheduleHide(event) {
      instance.clearDelayTimeouts();
      invokeHook('onUntrigger', [instance, event]);

      if (!instance.state.isVisible) {
        removeDocumentPress();
        return;
      } // For interactive tippies, scheduleHide is added to a document.body handler
      // from onMouseLeave so must intercept scheduled hides from mousemove/leave
      // events when trigger contains mouseenter and click, and the tip is
      // currently shown as a result of a click.


      if (instance.props.trigger.indexOf('mouseenter') >= 0 && instance.props.trigger.indexOf('click') >= 0 && ['mouseleave', 'mousemove'].indexOf(event.type) >= 0 && isVisibleFromClick) {
        return;
      }

      var delay = getDelay(false);

      if (delay) {
        hideTimeout = setTimeout(function () {
          if (instance.state.isVisible) {
            instance.hide();
          }
        }, delay);
      } else {
        // Fixes a `transitionend` problem when it fires 1 frame too
        // late sometimes, we don't want hide() to be called.
        scheduleHideAnimationFrame = requestAnimationFrame(function () {
          instance.hide();
        });
      }
    } // ===========================================================================
    // 🔑 Public methods
    // ===========================================================================


    function enable() {
      instance.state.isEnabled = true;
    }

    function disable() {
      // Disabling the instance should also hide it
      // https://github.com/atomiks/tippy.js-react/issues/106
      instance.hide();
      instance.state.isEnabled = false;
    }

    function clearDelayTimeouts() {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
      cancelAnimationFrame(scheduleHideAnimationFrame);
    }

    function setProps(partialProps) {
      /* istanbul ignore else */
      {
        warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('setProps'));
      }

      if (instance.state.isDestroyed) {
        return;
      }

      invokeHook('onBeforeUpdate', [instance, partialProps]);
      removeListeners();
      var prevProps = instance.props;
      var nextProps = evaluateProps(reference, Object.assign({}, prevProps, removeUndefinedProps(partialProps), {
        ignoreAttributes: true
      }));
      instance.props = nextProps;
      addListeners();

      if (prevProps.interactiveDebounce !== nextProps.interactiveDebounce) {
        cleanupInteractiveMouseListeners();
        debouncedOnMouseMove = debounce(onMouseMove, nextProps.interactiveDebounce);
      } // Ensure stale aria-expanded attributes are removed


      if (prevProps.triggerTarget && !nextProps.triggerTarget) {
        normalizeToArray(prevProps.triggerTarget).forEach(function (node) {
          node.removeAttribute('aria-expanded');
        });
      } else if (nextProps.triggerTarget) {
        reference.removeAttribute('aria-expanded');
      }

      handleAriaExpandedAttribute();
      handleStyles();

      if (onUpdate) {
        onUpdate(prevProps, nextProps);
      }

      if (instance.popperInstance) {
        createPopperInstance(); // Fixes an issue with nested tippies if they are all getting re-rendered,
        // and the nested ones get re-rendered first.
        // https://github.com/atomiks/tippyjs-react/issues/177
        // TODO: find a cleaner / more efficient solution(!)

        getNestedPopperTree().forEach(function (nestedPopper) {
          // React (and other UI libs likely) requires a rAF wrapper as it flushes
          // its work in one
          requestAnimationFrame(nestedPopper._tippy.popperInstance.forceUpdate);
        });
      }

      invokeHook('onAfterUpdate', [instance, partialProps]);
    }

    function setContent(content) {
      instance.setProps({
        content: content
      });
    }

    function show() {
      /* istanbul ignore else */
      {
        warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('show'));
      } // Early bail-out


      var isAlreadyVisible = instance.state.isVisible;
      var isDestroyed = instance.state.isDestroyed;
      var isDisabled = !instance.state.isEnabled;
      var isTouchAndTouchDisabled = currentInput.isTouch && !instance.props.touch;
      var duration = getValueAtIndexOrReturn(instance.props.duration, 0, defaultProps.duration);

      if (isAlreadyVisible || isDestroyed || isDisabled || isTouchAndTouchDisabled) {
        return;
      } // Normalize `disabled` behavior across browsers.
      // Firefox allows events on disabled elements, but Chrome doesn't.
      // Using a wrapper element (i.e. <span>) is recommended.


      if (getCurrentTarget().hasAttribute('disabled')) {
        return;
      }

      invokeHook('onShow', [instance], false);

      if (instance.props.onShow(instance) === false) {
        return;
      }

      instance.state.isVisible = true;

      if (getIsDefaultRenderFn()) {
        popper.style.visibility = 'visible';
      }

      handleStyles();
      addDocumentPress();

      if (!instance.state.isMounted) {
        popper.style.transition = 'none';
      } // If flipping to the opposite side after hiding at least once, the
      // animation will use the wrong placement without resetting the duration


      if (getIsDefaultRenderFn()) {
        var _getDefaultTemplateCh2 = getDefaultTemplateChildren(),
            box = _getDefaultTemplateCh2.box,
            content = _getDefaultTemplateCh2.content;

        setTransitionDuration([box, content], 0);
      }

      onFirstUpdate = function onFirstUpdate() {
        var _instance$popperInsta2;

        if (!instance.state.isVisible || ignoreOnFirstUpdate) {
          return;
        }

        ignoreOnFirstUpdate = true; // reflow

        void popper.offsetHeight;
        popper.style.transition = instance.props.moveTransition;

        if (getIsDefaultRenderFn() && instance.props.animation) {
          var _getDefaultTemplateCh3 = getDefaultTemplateChildren(),
              _box = _getDefaultTemplateCh3.box,
              _content = _getDefaultTemplateCh3.content;

          setTransitionDuration([_box, _content], duration);
          setVisibilityState([_box, _content], 'visible');
        }

        handleAriaContentAttribute();
        handleAriaExpandedAttribute();
        pushIfUnique(mountedInstances, instance); // certain modifiers (e.g. `maxSize`) require a second update after the
        // popper has been positioned for the first time

        (_instance$popperInsta2 = instance.popperInstance) == null ? void 0 : _instance$popperInsta2.forceUpdate();
        invokeHook('onMount', [instance]);

        if (instance.props.animation && getIsDefaultRenderFn()) {
          onTransitionedIn(duration, function () {
            instance.state.isShown = true;
            invokeHook('onShown', [instance]);
          });
        }
      };

      mount();
    }

    function hide() {
      /* istanbul ignore else */
      {
        warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('hide'));
      } // Early bail-out


      var isAlreadyHidden = !instance.state.isVisible;
      var isDestroyed = instance.state.isDestroyed;
      var isDisabled = !instance.state.isEnabled;
      var duration = getValueAtIndexOrReturn(instance.props.duration, 1, defaultProps.duration);

      if (isAlreadyHidden || isDestroyed || isDisabled) {
        return;
      }

      invokeHook('onHide', [instance], false);

      if (instance.props.onHide(instance) === false) {
        return;
      }

      instance.state.isVisible = false;
      instance.state.isShown = false;
      ignoreOnFirstUpdate = false;
      isVisibleFromClick = false;

      if (getIsDefaultRenderFn()) {
        popper.style.visibility = 'hidden';
      }

      cleanupInteractiveMouseListeners();
      removeDocumentPress();
      handleStyles(true);

      if (getIsDefaultRenderFn()) {
        var _getDefaultTemplateCh4 = getDefaultTemplateChildren(),
            box = _getDefaultTemplateCh4.box,
            content = _getDefaultTemplateCh4.content;

        if (instance.props.animation) {
          setTransitionDuration([box, content], duration);
          setVisibilityState([box, content], 'hidden');
        }
      }

      handleAriaContentAttribute();
      handleAriaExpandedAttribute();

      if (instance.props.animation) {
        if (getIsDefaultRenderFn()) {
          onTransitionedOut(duration, instance.unmount);
        }
      } else {
        instance.unmount();
      }
    }

    function hideWithInteractivity(event) {
      /* istanbul ignore else */
      {
        warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('hideWithInteractivity'));
      }

      getDocument().addEventListener('mousemove', debouncedOnMouseMove);
      pushIfUnique(mouseMoveListeners, debouncedOnMouseMove);
      debouncedOnMouseMove(event);
    }

    function unmount() {
      /* istanbul ignore else */
      {
        warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('unmount'));
      }

      if (instance.state.isVisible) {
        instance.hide();
      }

      if (!instance.state.isMounted) {
        return;
      }

      destroyPopperInstance(); // If a popper is not interactive, it will be appended outside the popper
      // tree by default. This seems mainly for interactive tippies, but we should
      // find a workaround if possible

      getNestedPopperTree().forEach(function (nestedPopper) {
        nestedPopper._tippy.unmount();
      });

      if (popper.parentNode) {
        popper.parentNode.removeChild(popper);
      }

      mountedInstances = mountedInstances.filter(function (i) {
        return i !== instance;
      });
      instance.state.isMounted = false;
      invokeHook('onHidden', [instance]);
    }

    function destroy() {
      /* istanbul ignore else */
      {
        warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('destroy'));
      }

      if (instance.state.isDestroyed) {
        return;
      }

      instance.clearDelayTimeouts();
      instance.unmount();
      removeListeners();
      delete reference._tippy;
      instance.state.isDestroyed = true;
      invokeHook('onDestroy', [instance]);
    }
  }

  function tippy(targets, optionalProps) {
    if (optionalProps === void 0) {
      optionalProps = {};
    }

    var plugins = defaultProps.plugins.concat(optionalProps.plugins || []);
    /* istanbul ignore else */

    {
      validateTargets(targets);
      validateProps(optionalProps, plugins);
    }

    bindGlobalEventListeners();
    var passedProps = Object.assign({}, optionalProps, {
      plugins: plugins
    });
    var elements = getArrayOfElements(targets);
    /* istanbul ignore else */

    {
      var isSingleContentElement = isElement(passedProps.content);
      var isMoreThanOneReferenceElement = elements.length > 1;
      warnWhen(isSingleContentElement && isMoreThanOneReferenceElement, ['tippy() was passed an Element as the `content` prop, but more than', 'one tippy instance was created by this invocation. This means the', 'content element will only be appended to the last tippy instance.', '\n\n', 'Instead, pass the .innerHTML of the element, or use a function that', 'returns a cloned version of the element instead.', '\n\n', '1) content: element.innerHTML\n', '2) content: () => element.cloneNode(true)'].join(' '));
    }

    var instances = elements.reduce(function (acc, reference) {
      var instance = reference && createTippy(reference, passedProps);

      if (instance) {
        acc.push(instance);
      }

      return acc;
    }, []);
    return isElement(targets) ? instances[0] : instances;
  }

  tippy.defaultProps = defaultProps;
  tippy.setDefaultProps = setDefaultProps;
  tippy.currentInput = currentInput;
  var hideAll = function hideAll(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        excludedReferenceOrInstance = _ref.exclude,
        duration = _ref.duration;

    mountedInstances.forEach(function (instance) {
      var isExcluded = false;

      if (excludedReferenceOrInstance) {
        isExcluded = isReferenceElement(excludedReferenceOrInstance) ? instance.reference === excludedReferenceOrInstance : instance.popper === excludedReferenceOrInstance.popper;
      }

      if (!isExcluded) {
        var originalDuration = instance.props.duration;
        instance.setProps({
          duration: duration
        });
        instance.hide();

        if (!instance.state.isDestroyed) {
          instance.setProps({
            duration: originalDuration
          });
        }
      }
    });
  };

  // every time the popper is destroyed (i.e. a new target), removing the styles
  // and causing transitions to break for singletons when the console is open, but
  // most notably for non-transform styles being used, `gpuAcceleration: false`.

  var applyStylesModifier = Object.assign({}, core.applyStyles, {
    effect: function effect(_ref) {
      var state = _ref.state;
      var initialStyles = {
        popper: {
          position: state.options.strategy,
          left: '0',
          top: '0',
          margin: '0'
        },
        arrow: {
          position: 'absolute'
        },
        reference: {}
      };
      Object.assign(state.elements.popper.style, initialStyles.popper);
      state.styles = initialStyles;

      if (state.elements.arrow) {
        Object.assign(state.elements.arrow.style, initialStyles.arrow);
      } // intentionally return no cleanup function
      // return () => { ... }

    }
  });

  var createSingleton = function createSingleton(tippyInstances, optionalProps) {
    var _optionalProps$popper;

    if (optionalProps === void 0) {
      optionalProps = {};
    }

    /* istanbul ignore else */
    {
      errorWhen(!Array.isArray(tippyInstances), ['The first argument passed to createSingleton() must be an array of', 'tippy instances. The passed value was', String(tippyInstances)].join(' '));
    }

    var individualInstances = tippyInstances;
    var references = [];
    var triggerTargets = [];
    var currentTarget;
    var overrides = optionalProps.overrides;
    var interceptSetPropsCleanups = [];
    var shownOnCreate = false;

    function setTriggerTargets() {
      triggerTargets = individualInstances.map(function (instance) {
        return normalizeToArray(instance.props.triggerTarget || instance.reference);
      }).reduce(function (acc, item) {
        return acc.concat(item);
      }, []);
    }

    function setReferences() {
      references = individualInstances.map(function (instance) {
        return instance.reference;
      });
    }

    function enableInstances(isEnabled) {
      individualInstances.forEach(function (instance) {
        if (isEnabled) {
          instance.enable();
        } else {
          instance.disable();
        }
      });
    }

    function interceptSetProps(singleton) {
      return individualInstances.map(function (instance) {
        var originalSetProps = instance.setProps;

        instance.setProps = function (props) {
          originalSetProps(props);

          if (instance.reference === currentTarget) {
            singleton.setProps(props);
          }
        };

        return function () {
          instance.setProps = originalSetProps;
        };
      });
    } // have to pass singleton, as it maybe undefined on first call


    function prepareInstance(singleton, target) {
      var index = triggerTargets.indexOf(target); // bail-out

      if (target === currentTarget) {
        return;
      }

      currentTarget = target;
      var overrideProps = (overrides || []).concat('content').reduce(function (acc, prop) {
        acc[prop] = individualInstances[index].props[prop];
        return acc;
      }, {});
      singleton.setProps(Object.assign({}, overrideProps, {
        getReferenceClientRect: typeof overrideProps.getReferenceClientRect === 'function' ? overrideProps.getReferenceClientRect : function () {
          var _references$index;

          return (_references$index = references[index]) == null ? void 0 : _references$index.getBoundingClientRect();
        }
      }));
    }

    enableInstances(false);
    setReferences();
    setTriggerTargets();
    var plugin = {
      fn: function fn() {
        return {
          onDestroy: function onDestroy() {
            enableInstances(true);
          },
          onHidden: function onHidden() {
            currentTarget = null;
          },
          onClickOutside: function onClickOutside(instance) {
            if (instance.props.showOnCreate && !shownOnCreate) {
              shownOnCreate = true;
              currentTarget = null;
            }
          },
          onShow: function onShow(instance) {
            if (instance.props.showOnCreate && !shownOnCreate) {
              shownOnCreate = true;
              prepareInstance(instance, references[0]);
            }
          },
          onTrigger: function onTrigger(instance, event) {
            prepareInstance(instance, event.currentTarget);
          }
        };
      }
    };
    var singleton = tippy(div(), Object.assign({}, removeProperties(optionalProps, ['overrides']), {
      plugins: [plugin].concat(optionalProps.plugins || []),
      triggerTarget: triggerTargets,
      popperOptions: Object.assign({}, optionalProps.popperOptions, {
        modifiers: [].concat(((_optionalProps$popper = optionalProps.popperOptions) == null ? void 0 : _optionalProps$popper.modifiers) || [], [applyStylesModifier])
      })
    }));
    var originalShow = singleton.show;

    singleton.show = function (target) {
      originalShow(); // first time, showOnCreate or programmatic call with no params
      // default to showing first instance

      if (!currentTarget && target == null) {
        return prepareInstance(singleton, references[0]);
      } // triggered from event (do nothing as prepareInstance already called by onTrigger)
      // programmatic call with no params when already visible (do nothing again)


      if (currentTarget && target == null) {
        return;
      } // target is index of instance


      if (typeof target === 'number') {
        return references[target] && prepareInstance(singleton, references[target]);
      } // target is a child tippy instance


      if (individualInstances.indexOf(target) >= 0) {
        var ref = target.reference;
        return prepareInstance(singleton, ref);
      } // target is a ReferenceElement


      if (references.indexOf(target) >= 0) {
        return prepareInstance(singleton, target);
      }
    };

    singleton.showNext = function () {
      var first = references[0];

      if (!currentTarget) {
        return singleton.show(0);
      }

      var index = references.indexOf(currentTarget);
      singleton.show(references[index + 1] || first);
    };

    singleton.showPrevious = function () {
      var last = references[references.length - 1];

      if (!currentTarget) {
        return singleton.show(last);
      }

      var index = references.indexOf(currentTarget);
      var target = references[index - 1] || last;
      singleton.show(target);
    };

    var originalSetProps = singleton.setProps;

    singleton.setProps = function (props) {
      overrides = props.overrides || overrides;
      originalSetProps(props);
    };

    singleton.setInstances = function (nextInstances) {
      enableInstances(true);
      interceptSetPropsCleanups.forEach(function (fn) {
        return fn();
      });
      individualInstances = nextInstances;
      enableInstances(false);
      setReferences();
      setTriggerTargets();
      interceptSetPropsCleanups = interceptSetProps(singleton);
      singleton.setProps({
        triggerTarget: triggerTargets
      });
    };

    interceptSetPropsCleanups = interceptSetProps(singleton);
    return singleton;
  };

  var BUBBLING_EVENTS_MAP = {
    mouseover: 'mouseenter',
    focusin: 'focus',
    click: 'click'
  };
  /**
   * Creates a delegate instance that controls the creation of tippy instances
   * for child elements (`target` CSS selector).
   */

  function delegate(targets, props) {
    /* istanbul ignore else */
    {
      errorWhen(!(props && props.target), ['You must specity a `target` prop indicating a CSS selector string matching', 'the target elements that should receive a tippy.'].join(' '));
    }

    var listeners = [];
    var childTippyInstances = [];
    var disabled = false;
    var target = props.target;
    var nativeProps = removeProperties(props, ['target']);
    var parentProps = Object.assign({}, nativeProps, {
      trigger: 'manual',
      touch: false
    });
    var childProps = Object.assign({
      touch: defaultProps.touch
    }, nativeProps, {
      showOnCreate: true
    });
    var returnValue = tippy(targets, parentProps);
    var normalizedReturnValue = normalizeToArray(returnValue);

    function onTrigger(event) {
      if (!event.target || disabled) {
        return;
      }

      var targetNode = event.target.closest(target);

      if (!targetNode) {
        return;
      } // Get relevant trigger with fallbacks:
      // 1. Check `data-tippy-trigger` attribute on target node
      // 2. Fallback to `trigger` passed to `delegate()`
      // 3. Fallback to `defaultProps.trigger`


      var trigger = targetNode.getAttribute('data-tippy-trigger') || props.trigger || defaultProps.trigger; // @ts-ignore

      if (targetNode._tippy) {
        return;
      }

      if (event.type === 'touchstart' && typeof childProps.touch === 'boolean') {
        return;
      }

      if (event.type !== 'touchstart' && trigger.indexOf(BUBBLING_EVENTS_MAP[event.type]) < 0) {
        return;
      }

      var instance = tippy(targetNode, childProps);

      if (instance) {
        childTippyInstances = childTippyInstances.concat(instance);
      }
    }

    function on(node, eventType, handler, options) {
      if (options === void 0) {
        options = false;
      }

      node.addEventListener(eventType, handler, options);
      listeners.push({
        node: node,
        eventType: eventType,
        handler: handler,
        options: options
      });
    }

    function addEventListeners(instance) {
      var reference = instance.reference;
      on(reference, 'touchstart', onTrigger, TOUCH_OPTIONS);
      on(reference, 'mouseover', onTrigger);
      on(reference, 'focusin', onTrigger);
      on(reference, 'click', onTrigger);
    }

    function removeEventListeners() {
      listeners.forEach(function (_ref) {
        var node = _ref.node,
            eventType = _ref.eventType,
            handler = _ref.handler,
            options = _ref.options;
        node.removeEventListener(eventType, handler, options);
      });
      listeners = [];
    }

    function applyMutations(instance) {
      var originalDestroy = instance.destroy;
      var originalEnable = instance.enable;
      var originalDisable = instance.disable;

      instance.destroy = function (shouldDestroyChildInstances) {
        if (shouldDestroyChildInstances === void 0) {
          shouldDestroyChildInstances = true;
        }

        if (shouldDestroyChildInstances) {
          childTippyInstances.forEach(function (instance) {
            instance.destroy();
          });
        }

        childTippyInstances = [];
        removeEventListeners();
        originalDestroy();
      };

      instance.enable = function () {
        originalEnable();
        childTippyInstances.forEach(function (instance) {
          return instance.enable();
        });
        disabled = false;
      };

      instance.disable = function () {
        originalDisable();
        childTippyInstances.forEach(function (instance) {
          return instance.disable();
        });
        disabled = true;
      };

      addEventListeners(instance);
    }

    normalizedReturnValue.forEach(applyMutations);
    return returnValue;
  }

  var animateFill = {
    name: 'animateFill',
    defaultValue: false,
    fn: function fn(instance) {
      var _instance$props$rende;

      // @ts-ignore
      if (!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy)) {
        {
          errorWhen(instance.props.animateFill, 'The `animateFill` plugin requires the default render function.');
        }

        return {};
      }

      var _getChildren = getChildren(instance.popper),
          box = _getChildren.box,
          content = _getChildren.content;

      var backdrop = instance.props.animateFill ? createBackdropElement() : null;
      return {
        onCreate: function onCreate() {
          if (backdrop) {
            box.insertBefore(backdrop, box.firstElementChild);
            box.setAttribute('data-animatefill', '');
            box.style.overflow = 'hidden';
            instance.setProps({
              arrow: false,
              animation: 'shift-away'
            });
          }
        },
        onMount: function onMount() {
          if (backdrop) {
            var transitionDuration = box.style.transitionDuration;
            var duration = Number(transitionDuration.replace('ms', '')); // The content should fade in after the backdrop has mostly filled the
            // tooltip element. `clip-path` is the other alternative but is not
            // well-supported and is buggy on some devices.

            content.style.transitionDelay = Math.round(duration / 10) + "ms";
            backdrop.style.transitionDuration = transitionDuration;
            setVisibilityState([backdrop], 'visible');
          }
        },
        onShow: function onShow() {
          if (backdrop) {
            backdrop.style.transitionDuration = '0ms';
          }
        },
        onHide: function onHide() {
          if (backdrop) {
            setVisibilityState([backdrop], 'hidden');
          }
        }
      };
    }
  };

  function createBackdropElement() {
    var backdrop = div();
    backdrop.className = BACKDROP_CLASS;
    setVisibilityState([backdrop], 'hidden');
    return backdrop;
  }

  var mouseCoords = {
    clientX: 0,
    clientY: 0
  };
  var activeInstances = [];

  function storeMouseCoords(_ref) {
    var clientX = _ref.clientX,
        clientY = _ref.clientY;
    mouseCoords = {
      clientX: clientX,
      clientY: clientY
    };
  }

  function addMouseCoordsListener(doc) {
    doc.addEventListener('mousemove', storeMouseCoords);
  }

  function removeMouseCoordsListener(doc) {
    doc.removeEventListener('mousemove', storeMouseCoords);
  }

  var followCursor = {
    name: 'followCursor',
    defaultValue: false,
    fn: function fn(instance) {
      var reference = instance.reference;
      var doc = getOwnerDocument(instance.props.triggerTarget || reference);
      var isInternalUpdate = false;
      var wasFocusEvent = false;
      var isUnmounted = true;
      var prevProps = instance.props;

      function getIsInitialBehavior() {
        return instance.props.followCursor === 'initial' && instance.state.isVisible;
      }

      function addListener() {
        doc.addEventListener('mousemove', onMouseMove);
      }

      function removeListener() {
        doc.removeEventListener('mousemove', onMouseMove);
      }

      function unsetGetReferenceClientRect() {
        isInternalUpdate = true;
        instance.setProps({
          getReferenceClientRect: null
        });
        isInternalUpdate = false;
      }

      function onMouseMove(event) {
        // If the instance is interactive, avoid updating the position unless it's
        // over the reference element
        var isCursorOverReference = event.target ? reference.contains(event.target) : true;
        var followCursor = instance.props.followCursor;
        var clientX = event.clientX,
            clientY = event.clientY;
        var rect = reference.getBoundingClientRect();
        var relativeX = clientX - rect.left;
        var relativeY = clientY - rect.top;

        if (isCursorOverReference || !instance.props.interactive) {
          instance.setProps({
            // @ts-ignore - unneeded DOMRect properties
            getReferenceClientRect: function getReferenceClientRect() {
              var rect = reference.getBoundingClientRect();
              var x = clientX;
              var y = clientY;

              if (followCursor === 'initial') {
                x = rect.left + relativeX;
                y = rect.top + relativeY;
              }

              var top = followCursor === 'horizontal' ? rect.top : y;
              var right = followCursor === 'vertical' ? rect.right : x;
              var bottom = followCursor === 'horizontal' ? rect.bottom : y;
              var left = followCursor === 'vertical' ? rect.left : x;
              return {
                width: right - left,
                height: bottom - top,
                top: top,
                right: right,
                bottom: bottom,
                left: left
              };
            }
          });
        }
      }

      function create() {
        if (instance.props.followCursor) {
          activeInstances.push({
            instance: instance,
            doc: doc
          });
          addMouseCoordsListener(doc);
        }
      }

      function destroy() {
        activeInstances = activeInstances.filter(function (data) {
          return data.instance !== instance;
        });

        if (activeInstances.filter(function (data) {
          return data.doc === doc;
        }).length === 0) {
          removeMouseCoordsListener(doc);
        }
      }

      return {
        onCreate: create,
        onDestroy: destroy,
        onBeforeUpdate: function onBeforeUpdate() {
          prevProps = instance.props;
        },
        onAfterUpdate: function onAfterUpdate(_, _ref2) {
          var followCursor = _ref2.followCursor;

          if (isInternalUpdate) {
            return;
          }

          if (followCursor !== undefined && prevProps.followCursor !== followCursor) {
            destroy();

            if (followCursor) {
              create();

              if (instance.state.isMounted && !wasFocusEvent && !getIsInitialBehavior()) {
                addListener();
              }
            } else {
              removeListener();
              unsetGetReferenceClientRect();
            }
          }
        },
        onMount: function onMount() {
          if (instance.props.followCursor && !wasFocusEvent) {
            if (isUnmounted) {
              onMouseMove(mouseCoords);
              isUnmounted = false;
            }

            if (!getIsInitialBehavior()) {
              addListener();
            }
          }
        },
        onTrigger: function onTrigger(_, event) {
          if (isMouseEvent(event)) {
            mouseCoords = {
              clientX: event.clientX,
              clientY: event.clientY
            };
          }

          wasFocusEvent = event.type === 'focus';
        },
        onHidden: function onHidden() {
          if (instance.props.followCursor) {
            unsetGetReferenceClientRect();
            removeListener();
            isUnmounted = true;
          }
        }
      };
    }
  };

  function getProps(props, modifier) {
    var _props$popperOptions;

    return {
      popperOptions: Object.assign({}, props.popperOptions, {
        modifiers: [].concat((((_props$popperOptions = props.popperOptions) == null ? void 0 : _props$popperOptions.modifiers) || []).filter(function (_ref) {
          var name = _ref.name;
          return name !== modifier.name;
        }), [modifier])
      })
    };
  }

  var inlinePositioning = {
    name: 'inlinePositioning',
    defaultValue: false,
    fn: function fn(instance) {
      var reference = instance.reference;

      function isEnabled() {
        return !!instance.props.inlinePositioning;
      }

      var placement;
      var cursorRectIndex = -1;
      var isInternalUpdate = false;
      var triedPlacements = [];
      var modifier = {
        name: 'tippyInlinePositioning',
        enabled: true,
        phase: 'afterWrite',
        fn: function fn(_ref2) {
          var state = _ref2.state;

          if (isEnabled()) {
            if (triedPlacements.indexOf(state.placement) !== -1) {
              triedPlacements = [];
            }

            if (placement !== state.placement && triedPlacements.indexOf(state.placement) === -1) {
              triedPlacements.push(state.placement);
              instance.setProps({
                // @ts-ignore - unneeded DOMRect properties
                getReferenceClientRect: function getReferenceClientRect() {
                  return _getReferenceClientRect(state.placement);
                }
              });
            }

            placement = state.placement;
          }
        }
      };

      function _getReferenceClientRect(placement) {
        return getInlineBoundingClientRect(getBasePlacement(placement), reference.getBoundingClientRect(), arrayFrom(reference.getClientRects()), cursorRectIndex);
      }

      function setInternalProps(partialProps) {
        isInternalUpdate = true;
        instance.setProps(partialProps);
        isInternalUpdate = false;
      }

      function addModifier() {
        if (!isInternalUpdate) {
          setInternalProps(getProps(instance.props, modifier));
        }
      }

      return {
        onCreate: addModifier,
        onAfterUpdate: addModifier,
        onTrigger: function onTrigger(_, event) {
          if (isMouseEvent(event)) {
            var rects = arrayFrom(instance.reference.getClientRects());
            var cursorRect = rects.find(function (rect) {
              return rect.left - 2 <= event.clientX && rect.right + 2 >= event.clientX && rect.top - 2 <= event.clientY && rect.bottom + 2 >= event.clientY;
            });
            var index = rects.indexOf(cursorRect);
            cursorRectIndex = index > -1 ? index : cursorRectIndex;
          }
        },
        onHidden: function onHidden() {
          cursorRectIndex = -1;
        }
      };
    }
  };
  function getInlineBoundingClientRect(currentBasePlacement, boundingRect, clientRects, cursorRectIndex) {
    // Not an inline element, or placement is not yet known
    if (clientRects.length < 2 || currentBasePlacement === null) {
      return boundingRect;
    } // There are two rects and they are disjoined


    if (clientRects.length === 2 && cursorRectIndex >= 0 && clientRects[0].left > clientRects[1].right) {
      return clientRects[cursorRectIndex] || boundingRect;
    }

    switch (currentBasePlacement) {
      case 'top':
      case 'bottom':
        {
          var firstRect = clientRects[0];
          var lastRect = clientRects[clientRects.length - 1];
          var isTop = currentBasePlacement === 'top';
          var top = firstRect.top;
          var bottom = lastRect.bottom;
          var left = isTop ? firstRect.left : lastRect.left;
          var right = isTop ? firstRect.right : lastRect.right;
          var width = right - left;
          var height = bottom - top;
          return {
            top: top,
            bottom: bottom,
            left: left,
            right: right,
            width: width,
            height: height
          };
        }

      case 'left':
      case 'right':
        {
          var minLeft = Math.min.apply(Math, clientRects.map(function (rects) {
            return rects.left;
          }));
          var maxRight = Math.max.apply(Math, clientRects.map(function (rects) {
            return rects.right;
          }));
          var measureRects = clientRects.filter(function (rect) {
            return currentBasePlacement === 'left' ? rect.left === minLeft : rect.right === maxRight;
          });
          var _top = measureRects[0].top;
          var _bottom = measureRects[measureRects.length - 1].bottom;
          var _left = minLeft;
          var _right = maxRight;

          var _width = _right - _left;

          var _height = _bottom - _top;

          return {
            top: _top,
            bottom: _bottom,
            left: _left,
            right: _right,
            width: _width,
            height: _height
          };
        }

      default:
        {
          return boundingRect;
        }
    }
  }

  var sticky = {
    name: 'sticky',
    defaultValue: false,
    fn: function fn(instance) {
      var reference = instance.reference,
          popper = instance.popper;

      function getReference() {
        return instance.popperInstance ? instance.popperInstance.state.elements.reference : reference;
      }

      function shouldCheck(value) {
        return instance.props.sticky === true || instance.props.sticky === value;
      }

      var prevRefRect = null;
      var prevPopRect = null;

      function updatePosition() {
        var currentRefRect = shouldCheck('reference') ? getReference().getBoundingClientRect() : null;
        var currentPopRect = shouldCheck('popper') ? popper.getBoundingClientRect() : null;

        if (currentRefRect && areRectsDifferent(prevRefRect, currentRefRect) || currentPopRect && areRectsDifferent(prevPopRect, currentPopRect)) {
          if (instance.popperInstance) {
            instance.popperInstance.update();
          }
        }

        prevRefRect = currentRefRect;
        prevPopRect = currentPopRect;

        if (instance.state.isMounted) {
          requestAnimationFrame(updatePosition);
        }
      }

      return {
        onMount: function onMount() {
          if (instance.props.sticky) {
            updatePosition();
          }
        }
      };
    }
  };

  function areRectsDifferent(rectA, rectB) {
    if (rectA && rectB) {
      return rectA.top !== rectB.top || rectA.right !== rectB.right || rectA.bottom !== rectB.bottom || rectA.left !== rectB.left;
    }

    return true;
  }

  if (isBrowser) {
    injectCSS(css);
  }

  tippy.setDefaultProps({
    plugins: [animateFill, followCursor, inlinePositioning, sticky],
    render: render
  });
  tippy.createSingleton = createSingleton;
  tippy.delegate = delegate;
  tippy.hideAll = hideAll;
  tippy.roundArrow = ROUND_ARROW;

  return tippy;

})));
//# sourceMappingURL=tippy-bundle.umd.js.map

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ0aXBweS1idW5kbGUudW1kLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKiFcbiogdGlwcHkuanMgdjYuMy43XG4qIChjKSAyMDE3LTIwMjEgYXRvbWlrc1xuKiBNSVQgTGljZW5zZVxuKi9cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdAcG9wcGVyanMvY29yZScpKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ0Bwb3BwZXJqcy9jb3JlJ10sIGZhY3RvcnkpIDpcbiAgKGdsb2JhbCA9IGdsb2JhbCB8fCBzZWxmLCBnbG9iYWwudGlwcHkgPSBmYWN0b3J5KGdsb2JhbC5Qb3BwZXIpKTtcbn0odGhpcywgKGZ1bmN0aW9uIChjb3JlKSB7ICd1c2Ugc3RyaWN0JztcblxuICB2YXIgY3NzID0gXCIudGlwcHktYm94W2RhdGEtYW5pbWF0aW9uPWZhZGVdW2RhdGEtc3RhdGU9aGlkZGVuXXtvcGFjaXR5OjB9W2RhdGEtdGlwcHktcm9vdF17bWF4LXdpZHRoOmNhbGMoMTAwdncgLSAxMHB4KX0udGlwcHktYm94e3Bvc2l0aW9uOnJlbGF0aXZlO2JhY2tncm91bmQtY29sb3I6IzMzMztjb2xvcjojZmZmO2JvcmRlci1yYWRpdXM6NHB4O2ZvbnQtc2l6ZToxNHB4O2xpbmUtaGVpZ2h0OjEuNDt3aGl0ZS1zcGFjZTpub3JtYWw7b3V0bGluZTowO3RyYW5zaXRpb24tcHJvcGVydHk6dHJhbnNmb3JtLHZpc2liaWxpdHksb3BhY2l0eX0udGlwcHktYm94W2RhdGEtcGxhY2VtZW50Xj10b3BdPi50aXBweS1hcnJvd3tib3R0b206MH0udGlwcHktYm94W2RhdGEtcGxhY2VtZW50Xj10b3BdPi50aXBweS1hcnJvdzpiZWZvcmV7Ym90dG9tOi03cHg7bGVmdDowO2JvcmRlci13aWR0aDo4cHggOHB4IDA7Ym9yZGVyLXRvcC1jb2xvcjppbml0aWFsO3RyYW5zZm9ybS1vcmlnaW46Y2VudGVyIHRvcH0udGlwcHktYm94W2RhdGEtcGxhY2VtZW50Xj1ib3R0b21dPi50aXBweS1hcnJvd3t0b3A6MH0udGlwcHktYm94W2RhdGEtcGxhY2VtZW50Xj1ib3R0b21dPi50aXBweS1hcnJvdzpiZWZvcmV7dG9wOi03cHg7bGVmdDowO2JvcmRlci13aWR0aDowIDhweCA4cHg7Ym9yZGVyLWJvdHRvbS1jb2xvcjppbml0aWFsO3RyYW5zZm9ybS1vcmlnaW46Y2VudGVyIGJvdHRvbX0udGlwcHktYm94W2RhdGEtcGxhY2VtZW50Xj1sZWZ0XT4udGlwcHktYXJyb3d7cmlnaHQ6MH0udGlwcHktYm94W2RhdGEtcGxhY2VtZW50Xj1sZWZ0XT4udGlwcHktYXJyb3c6YmVmb3Jle2JvcmRlci13aWR0aDo4cHggMCA4cHggOHB4O2JvcmRlci1sZWZ0LWNvbG9yOmluaXRpYWw7cmlnaHQ6LTdweDt0cmFuc2Zvcm0tb3JpZ2luOmNlbnRlciBsZWZ0fS50aXBweS1ib3hbZGF0YS1wbGFjZW1lbnRePXJpZ2h0XT4udGlwcHktYXJyb3d7bGVmdDowfS50aXBweS1ib3hbZGF0YS1wbGFjZW1lbnRePXJpZ2h0XT4udGlwcHktYXJyb3c6YmVmb3Jle2xlZnQ6LTdweDtib3JkZXItd2lkdGg6OHB4IDhweCA4cHggMDtib3JkZXItcmlnaHQtY29sb3I6aW5pdGlhbDt0cmFuc2Zvcm0tb3JpZ2luOmNlbnRlciByaWdodH0udGlwcHktYm94W2RhdGEtaW5lcnRpYV1bZGF0YS1zdGF0ZT12aXNpYmxlXXt0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbjpjdWJpYy1iZXppZXIoLjU0LDEuNSwuMzgsMS4xMSl9LnRpcHB5LWFycm93e3dpZHRoOjE2cHg7aGVpZ2h0OjE2cHg7Y29sb3I6IzMzM30udGlwcHktYXJyb3c6YmVmb3Jle2NvbnRlbnQ6XFxcIlxcXCI7cG9zaXRpb246YWJzb2x1dGU7Ym9yZGVyLWNvbG9yOnRyYW5zcGFyZW50O2JvcmRlci1zdHlsZTpzb2xpZH0udGlwcHktY29udGVudHtwb3NpdGlvbjpyZWxhdGl2ZTtwYWRkaW5nOjVweCA5cHg7ei1pbmRleDoxfVwiO1xuXG4gIGZ1bmN0aW9uIGluamVjdENTUyhjc3MpIHtcbiAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHN0eWxlLnRleHRDb250ZW50ID0gY3NzO1xuICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgnZGF0YS10aXBweS1zdHlsZXNoZWV0JywgJycpO1xuICAgIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZDtcbiAgICB2YXIgZmlyc3RTdHlsZU9yTGlua1RhZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWQ+c3R5bGUsaGVhZD5saW5rJyk7XG5cbiAgICBpZiAoZmlyc3RTdHlsZU9yTGlua1RhZykge1xuICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIGZpcnN0U3R5bGVPckxpbmtUYWcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgaXNCcm93c2VyID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJztcbiAgdmFyIGlzSUUxMSA9IGlzQnJvd3NlciA/IC8vIEB0cy1pZ25vcmVcbiAgISF3aW5kb3cubXNDcnlwdG8gOiBmYWxzZTtcblxuICB2YXIgUk9VTkRfQVJST1cgPSAnPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiNlwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwiTTAgNnMxLjc5Ni0uMDEzIDQuNjctMy42MTVDNS44NTEuOSA2LjkzLjAwNiA4IDBjMS4wNy0uMDA2IDIuMTQ4Ljg4NyAzLjM0MyAyLjM4NUMxNC4yMzMgNi4wMDUgMTYgNiAxNiA2SDB6XCI+PC9zdmc+JztcbiAgdmFyIEJPWF9DTEFTUyA9IFwidGlwcHktYm94XCI7XG4gIHZhciBDT05URU5UX0NMQVNTID0gXCJ0aXBweS1jb250ZW50XCI7XG4gIHZhciBCQUNLRFJPUF9DTEFTUyA9IFwidGlwcHktYmFja2Ryb3BcIjtcbiAgdmFyIEFSUk9XX0NMQVNTID0gXCJ0aXBweS1hcnJvd1wiO1xuICB2YXIgU1ZHX0FSUk9XX0NMQVNTID0gXCJ0aXBweS1zdmctYXJyb3dcIjtcbiAgdmFyIFRPVUNIX09QVElPTlMgPSB7XG4gICAgcGFzc2l2ZTogdHJ1ZSxcbiAgICBjYXB0dXJlOiB0cnVlXG4gIH07XG4gIHZhciBUSVBQWV9ERUZBVUxUX0FQUEVORF9UTyA9IGZ1bmN0aW9uIFRJUFBZX0RFRkFVTFRfQVBQRU5EX1RPKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5ib2R5O1xuICB9O1xuXG4gIGZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIHt9Lmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xuICB9XG4gIGZ1bmN0aW9uIGdldFZhbHVlQXRJbmRleE9yUmV0dXJuKHZhbHVlLCBpbmRleCwgZGVmYXVsdFZhbHVlKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICB2YXIgdiA9IHZhbHVlW2luZGV4XTtcbiAgICAgIHJldHVybiB2ID09IG51bGwgPyBBcnJheS5pc0FycmF5KGRlZmF1bHRWYWx1ZSkgPyBkZWZhdWx0VmFsdWVbaW5kZXhdIDogZGVmYXVsdFZhbHVlIDogdjtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgZnVuY3Rpb24gaXNUeXBlKHZhbHVlLCB0eXBlKSB7XG4gICAgdmFyIHN0ciA9IHt9LnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICAgIHJldHVybiBzdHIuaW5kZXhPZignW29iamVjdCcpID09PSAwICYmIHN0ci5pbmRleE9mKHR5cGUgKyBcIl1cIikgPiAtMTtcbiAgfVxuICBmdW5jdGlvbiBpbnZva2VXaXRoQXJnc09yUmV0dXJuKHZhbHVlLCBhcmdzKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLmFwcGx5KHZvaWQgMCwgYXJncykgOiB2YWx1ZTtcbiAgfVxuICBmdW5jdGlvbiBkZWJvdW5jZShmbiwgbXMpIHtcbiAgICAvLyBBdm9pZCB3cmFwcGluZyBpbiBgc2V0VGltZW91dGAgaWYgbXMgaXMgMCBhbnl3YXlcbiAgICBpZiAobXMgPT09IDApIHtcbiAgICAgIHJldHVybiBmbjtcbiAgICB9XG5cbiAgICB2YXIgdGltZW91dDtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGFyZykge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBmbihhcmcpO1xuICAgICAgfSwgbXMpO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gcmVtb3ZlUHJvcGVydGllcyhvYmosIGtleXMpIHtcbiAgICB2YXIgY2xvbmUgPSBPYmplY3QuYXNzaWduKHt9LCBvYmopO1xuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICBkZWxldGUgY2xvbmVba2V5XTtcbiAgICB9KTtcbiAgICByZXR1cm4gY2xvbmU7XG4gIH1cbiAgZnVuY3Rpb24gc3BsaXRCeVNwYWNlcyh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5zcGxpdCgvXFxzKy8pLmZpbHRlcihCb29sZWFuKTtcbiAgfVxuICBmdW5jdGlvbiBub3JtYWxpemVUb0FycmF5KHZhbHVlKSB7XG4gICAgcmV0dXJuIFtdLmNvbmNhdCh2YWx1ZSk7XG4gIH1cbiAgZnVuY3Rpb24gcHVzaElmVW5pcXVlKGFyciwgdmFsdWUpIHtcbiAgICBpZiAoYXJyLmluZGV4T2YodmFsdWUpID09PSAtMSkge1xuICAgICAgYXJyLnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiB1bmlxdWUoYXJyKSB7XG4gICAgcmV0dXJuIGFyci5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICByZXR1cm4gYXJyLmluZGV4T2YoaXRlbSkgPT09IGluZGV4O1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KSB7XG4gICAgcmV0dXJuIHBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xuICB9XG4gIGZ1bmN0aW9uIGFycmF5RnJvbSh2YWx1ZSkge1xuICAgIHJldHVybiBbXS5zbGljZS5jYWxsKHZhbHVlKTtcbiAgfVxuICBmdW5jdGlvbiByZW1vdmVVbmRlZmluZWRQcm9wcyhvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywga2V5KSB7XG4gICAgICBpZiAob2JqW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBhY2Nba2V5XSA9IG9ialtrZXldO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRpdigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIH1cbiAgZnVuY3Rpb24gaXNFbGVtZW50KHZhbHVlKSB7XG4gICAgcmV0dXJuIFsnRWxlbWVudCcsICdGcmFnbWVudCddLnNvbWUoZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgIHJldHVybiBpc1R5cGUodmFsdWUsIHR5cGUpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGlzTm9kZUxpc3QodmFsdWUpIHtcbiAgICByZXR1cm4gaXNUeXBlKHZhbHVlLCAnTm9kZUxpc3QnKTtcbiAgfVxuICBmdW5jdGlvbiBpc01vdXNlRXZlbnQodmFsdWUpIHtcbiAgICByZXR1cm4gaXNUeXBlKHZhbHVlLCAnTW91c2VFdmVudCcpO1xuICB9XG4gIGZ1bmN0aW9uIGlzUmVmZXJlbmNlRWxlbWVudCh2YWx1ZSkge1xuICAgIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZS5fdGlwcHkgJiYgdmFsdWUuX3RpcHB5LnJlZmVyZW5jZSA9PT0gdmFsdWUpO1xuICB9XG4gIGZ1bmN0aW9uIGdldEFycmF5T2ZFbGVtZW50cyh2YWx1ZSkge1xuICAgIGlmIChpc0VsZW1lbnQodmFsdWUpKSB7XG4gICAgICByZXR1cm4gW3ZhbHVlXTtcbiAgICB9XG5cbiAgICBpZiAoaXNOb2RlTGlzdCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBhcnJheUZyb20odmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheUZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh2YWx1ZSkpO1xuICB9XG4gIGZ1bmN0aW9uIHNldFRyYW5zaXRpb25EdXJhdGlvbihlbHMsIHZhbHVlKSB7XG4gICAgZWxzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICBpZiAoZWwpIHtcbiAgICAgICAgZWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gdmFsdWUgKyBcIm1zXCI7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gc2V0VmlzaWJpbGl0eVN0YXRlKGVscywgc3RhdGUpIHtcbiAgICBlbHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgIGlmIChlbCkge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhdGUnLCBzdGF0ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3duZXJEb2N1bWVudChlbGVtZW50T3JFbGVtZW50cykge1xuICAgIHZhciBfZWxlbWVudCRvd25lckRvY3VtZW47XG5cbiAgICB2YXIgX25vcm1hbGl6ZVRvQXJyYXkgPSBub3JtYWxpemVUb0FycmF5KGVsZW1lbnRPckVsZW1lbnRzKSxcbiAgICAgICAgZWxlbWVudCA9IF9ub3JtYWxpemVUb0FycmF5WzBdOyAvLyBFbGVtZW50cyBjcmVhdGVkIHZpYSBhIDx0ZW1wbGF0ZT4gaGF2ZSBhbiBvd25lckRvY3VtZW50IHdpdGggbm8gcmVmZXJlbmNlIHRvIHRoZSBib2R5XG5cblxuICAgIHJldHVybiBlbGVtZW50ICE9IG51bGwgJiYgKF9lbGVtZW50JG93bmVyRG9jdW1lbiA9IGVsZW1lbnQub3duZXJEb2N1bWVudCkgIT0gbnVsbCAmJiBfZWxlbWVudCRvd25lckRvY3VtZW4uYm9keSA/IGVsZW1lbnQub3duZXJEb2N1bWVudCA6IGRvY3VtZW50O1xuICB9XG4gIGZ1bmN0aW9uIGlzQ3Vyc29yT3V0c2lkZUludGVyYWN0aXZlQm9yZGVyKHBvcHBlclRyZWVEYXRhLCBldmVudCkge1xuICAgIHZhciBjbGllbnRYID0gZXZlbnQuY2xpZW50WCxcbiAgICAgICAgY2xpZW50WSA9IGV2ZW50LmNsaWVudFk7XG4gICAgcmV0dXJuIHBvcHBlclRyZWVEYXRhLmV2ZXJ5KGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgICB2YXIgcG9wcGVyUmVjdCA9IF9yZWYucG9wcGVyUmVjdCxcbiAgICAgICAgICBwb3BwZXJTdGF0ZSA9IF9yZWYucG9wcGVyU3RhdGUsXG4gICAgICAgICAgcHJvcHMgPSBfcmVmLnByb3BzO1xuICAgICAgdmFyIGludGVyYWN0aXZlQm9yZGVyID0gcHJvcHMuaW50ZXJhY3RpdmVCb3JkZXI7XG4gICAgICB2YXIgYmFzZVBsYWNlbWVudCA9IGdldEJhc2VQbGFjZW1lbnQocG9wcGVyU3RhdGUucGxhY2VtZW50KTtcbiAgICAgIHZhciBvZmZzZXREYXRhID0gcG9wcGVyU3RhdGUubW9kaWZpZXJzRGF0YS5vZmZzZXQ7XG5cbiAgICAgIGlmICghb2Zmc2V0RGF0YSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRvcERpc3RhbmNlID0gYmFzZVBsYWNlbWVudCA9PT0gJ2JvdHRvbScgPyBvZmZzZXREYXRhLnRvcC55IDogMDtcbiAgICAgIHZhciBib3R0b21EaXN0YW5jZSA9IGJhc2VQbGFjZW1lbnQgPT09ICd0b3AnID8gb2Zmc2V0RGF0YS5ib3R0b20ueSA6IDA7XG4gICAgICB2YXIgbGVmdERpc3RhbmNlID0gYmFzZVBsYWNlbWVudCA9PT0gJ3JpZ2h0JyA/IG9mZnNldERhdGEubGVmdC54IDogMDtcbiAgICAgIHZhciByaWdodERpc3RhbmNlID0gYmFzZVBsYWNlbWVudCA9PT0gJ2xlZnQnID8gb2Zmc2V0RGF0YS5yaWdodC54IDogMDtcbiAgICAgIHZhciBleGNlZWRzVG9wID0gcG9wcGVyUmVjdC50b3AgLSBjbGllbnRZICsgdG9wRGlzdGFuY2UgPiBpbnRlcmFjdGl2ZUJvcmRlcjtcbiAgICAgIHZhciBleGNlZWRzQm90dG9tID0gY2xpZW50WSAtIHBvcHBlclJlY3QuYm90dG9tIC0gYm90dG9tRGlzdGFuY2UgPiBpbnRlcmFjdGl2ZUJvcmRlcjtcbiAgICAgIHZhciBleGNlZWRzTGVmdCA9IHBvcHBlclJlY3QubGVmdCAtIGNsaWVudFggKyBsZWZ0RGlzdGFuY2UgPiBpbnRlcmFjdGl2ZUJvcmRlcjtcbiAgICAgIHZhciBleGNlZWRzUmlnaHQgPSBjbGllbnRYIC0gcG9wcGVyUmVjdC5yaWdodCAtIHJpZ2h0RGlzdGFuY2UgPiBpbnRlcmFjdGl2ZUJvcmRlcjtcbiAgICAgIHJldHVybiBleGNlZWRzVG9wIHx8IGV4Y2VlZHNCb3R0b20gfHwgZXhjZWVkc0xlZnQgfHwgZXhjZWVkc1JpZ2h0O1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZVRyYW5zaXRpb25FbmRMaXN0ZW5lcihib3gsIGFjdGlvbiwgbGlzdGVuZXIpIHtcbiAgICB2YXIgbWV0aG9kID0gYWN0aW9uICsgXCJFdmVudExpc3RlbmVyXCI7IC8vIHNvbWUgYnJvd3NlcnMgYXBwYXJlbnRseSBzdXBwb3J0IGB0cmFuc2l0aW9uYCAodW5wcmVmaXhlZCkgYnV0IG9ubHkgZmlyZVxuICAgIC8vIGB3ZWJraXRUcmFuc2l0aW9uRW5kYC4uLlxuXG4gICAgWyd0cmFuc2l0aW9uZW5kJywgJ3dlYmtpdFRyYW5zaXRpb25FbmQnXS5mb3JFYWNoKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgYm94W21ldGhvZF0oZXZlbnQsIGxpc3RlbmVyKTtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogQ29tcGFyZWQgdG8geHh4LmNvbnRhaW5zLCB0aGlzIGZ1bmN0aW9uIHdvcmtzIGZvciBkb20gc3RydWN0dXJlcyB3aXRoIHNoYWRvd1xuICAgKiBkb21cbiAgICovXG5cbiAgZnVuY3Rpb24gYWN0dWFsQ29udGFpbnMocGFyZW50LCBjaGlsZCkge1xuICAgIHZhciB0YXJnZXQgPSBjaGlsZDtcblxuICAgIHdoaWxlICh0YXJnZXQpIHtcbiAgICAgIHZhciBfdGFyZ2V0JGdldFJvb3ROb2RlO1xuXG4gICAgICBpZiAocGFyZW50LmNvbnRhaW5zKHRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHRhcmdldCA9IHRhcmdldC5nZXRSb290Tm9kZSA9PSBudWxsID8gdm9pZCAwIDogKF90YXJnZXQkZ2V0Um9vdE5vZGUgPSB0YXJnZXQuZ2V0Um9vdE5vZGUoKSkgPT0gbnVsbCA/IHZvaWQgMCA6IF90YXJnZXQkZ2V0Um9vdE5vZGUuaG9zdDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgY3VycmVudElucHV0ID0ge1xuICAgIGlzVG91Y2g6IGZhbHNlXG4gIH07XG4gIHZhciBsYXN0TW91c2VNb3ZlVGltZSA9IDA7XG4gIC8qKlxuICAgKiBXaGVuIGEgYHRvdWNoc3RhcnRgIGV2ZW50IGlzIGZpcmVkLCBpdCdzIGFzc3VtZWQgdGhlIHVzZXIgaXMgdXNpbmcgdG91Y2hcbiAgICogaW5wdXQuIFdlJ2xsIGJpbmQgYSBgbW91c2Vtb3ZlYCBldmVudCBsaXN0ZW5lciB0byBsaXN0ZW4gZm9yIG1vdXNlIGlucHV0IGluXG4gICAqIHRoZSBmdXR1cmUuIFRoaXMgd2F5LCB0aGUgYGlzVG91Y2hgIHByb3BlcnR5IGlzIGZ1bGx5IGR5bmFtaWMgYW5kIHdpbGwgaGFuZGxlXG4gICAqIGh5YnJpZCBkZXZpY2VzIHRoYXQgdXNlIGEgbWl4IG9mIHRvdWNoICsgbW91c2UgaW5wdXQuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uRG9jdW1lbnRUb3VjaFN0YXJ0KCkge1xuICAgIGlmIChjdXJyZW50SW5wdXQuaXNUb3VjaCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGN1cnJlbnRJbnB1dC5pc1RvdWNoID0gdHJ1ZTtcblxuICAgIGlmICh3aW5kb3cucGVyZm9ybWFuY2UpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uRG9jdW1lbnRNb3VzZU1vdmUpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogV2hlbiB0d28gYG1vdXNlbW92ZWAgZXZlbnQgYXJlIGZpcmVkIGNvbnNlY3V0aXZlbHkgd2l0aGluIDIwbXMsIGl0J3MgYXNzdW1lZFxuICAgKiB0aGUgdXNlciBpcyB1c2luZyBtb3VzZSBpbnB1dCBhZ2Fpbi4gYG1vdXNlbW92ZWAgY2FuIGZpcmUgb24gdG91Y2ggZGV2aWNlcyBhc1xuICAgKiB3ZWxsLCBidXQgdmVyeSByYXJlbHkgdGhhdCBxdWlja2x5LlxuICAgKi9cblxuICBmdW5jdGlvbiBvbkRvY3VtZW50TW91c2VNb3ZlKCkge1xuICAgIHZhciBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgIGlmIChub3cgLSBsYXN0TW91c2VNb3ZlVGltZSA8IDIwKSB7XG4gICAgICBjdXJyZW50SW5wdXQuaXNUb3VjaCA9IGZhbHNlO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Eb2N1bWVudE1vdXNlTW92ZSk7XG4gICAgfVxuXG4gICAgbGFzdE1vdXNlTW92ZVRpbWUgPSBub3c7XG4gIH1cbiAgLyoqXG4gICAqIFdoZW4gYW4gZWxlbWVudCBpcyBpbiBmb2N1cyBhbmQgaGFzIGEgdGlwcHksIGxlYXZpbmcgdGhlIHRhYi93aW5kb3cgYW5kXG4gICAqIHJldHVybmluZyBjYXVzZXMgaXQgdG8gc2hvdyBhZ2Fpbi4gRm9yIG1vdXNlIHVzZXJzIHRoaXMgaXMgdW5leHBlY3RlZCwgYnV0XG4gICAqIGZvciBrZXlib2FyZCB1c2UgaXQgbWFrZXMgc2Vuc2UuXG4gICAqIFRPRE86IGZpbmQgYSBiZXR0ZXIgdGVjaG5pcXVlIHRvIHNvbHZlIHRoaXMgcHJvYmxlbVxuICAgKi9cblxuICBmdW5jdGlvbiBvbldpbmRvd0JsdXIoKSB7XG4gICAgdmFyIGFjdGl2ZUVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG4gICAgaWYgKGlzUmVmZXJlbmNlRWxlbWVudChhY3RpdmVFbGVtZW50KSkge1xuICAgICAgdmFyIGluc3RhbmNlID0gYWN0aXZlRWxlbWVudC5fdGlwcHk7XG5cbiAgICAgIGlmIChhY3RpdmVFbGVtZW50LmJsdXIgJiYgIWluc3RhbmNlLnN0YXRlLmlzVmlzaWJsZSkge1xuICAgICAgICBhY3RpdmVFbGVtZW50LmJsdXIoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gYmluZEdsb2JhbEV2ZW50TGlzdGVuZXJzKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBvbkRvY3VtZW50VG91Y2hTdGFydCwgVE9VQ0hfT1BUSU9OUyk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBvbldpbmRvd0JsdXIpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlTWVtb3J5TGVha1dhcm5pbmcobWV0aG9kKSB7XG4gICAgdmFyIHR4dCA9IG1ldGhvZCA9PT0gJ2Rlc3Ryb3knID8gJ24gYWxyZWFkeS0nIDogJyAnO1xuICAgIHJldHVybiBbbWV0aG9kICsgXCIoKSB3YXMgY2FsbGVkIG9uIGFcIiArIHR4dCArIFwiZGVzdHJveWVkIGluc3RhbmNlLiBUaGlzIGlzIGEgbm8tb3AgYnV0XCIsICdpbmRpY2F0ZXMgYSBwb3RlbnRpYWwgbWVtb3J5IGxlYWsuJ10uam9pbignICcpO1xuICB9XG4gIGZ1bmN0aW9uIGNsZWFuKHZhbHVlKSB7XG4gICAgdmFyIHNwYWNlc0FuZFRhYnMgPSAvWyBcXHRdezIsfS9nO1xuICAgIHZhciBsaW5lU3RhcnRXaXRoU3BhY2VzID0gL15bIFxcdF0qL2dtO1xuICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKHNwYWNlc0FuZFRhYnMsICcgJykucmVwbGFjZShsaW5lU3RhcnRXaXRoU3BhY2VzLCAnJykudHJpbSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RGV2TWVzc2FnZShtZXNzYWdlKSB7XG4gICAgcmV0dXJuIGNsZWFuKFwiXFxuICAlY3RpcHB5LmpzXFxuXFxuICAlY1wiICsgY2xlYW4obWVzc2FnZSkgKyBcIlxcblxcbiAgJWNcXHVEODNEXFx1REM3N1xcdTIwMEQgVGhpcyBpcyBhIGRldmVsb3BtZW50LW9ubHkgbWVzc2FnZS4gSXQgd2lsbCBiZSByZW1vdmVkIGluIHByb2R1Y3Rpb24uXFxuICBcIik7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRGb3JtYXR0ZWRNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gW2dldERldk1lc3NhZ2UobWVzc2FnZSksIC8vIHRpdGxlXG4gICAgJ2NvbG9yOiAjMDBDNTg0OyBmb250LXNpemU6IDEuM2VtOyBmb250LXdlaWdodDogYm9sZDsnLCAvLyBtZXNzYWdlXG4gICAgJ2xpbmUtaGVpZ2h0OiAxLjUnLCAvLyBmb290ZXJcbiAgICAnY29sb3I6ICNhNmEwOTU7J107XG4gIH0gLy8gQXNzdW1lIHdhcm5pbmdzIGFuZCBlcnJvcnMgbmV2ZXIgaGF2ZSB0aGUgc2FtZSBtZXNzYWdlXG5cbiAgdmFyIHZpc2l0ZWRNZXNzYWdlcztcblxuICB7XG4gICAgcmVzZXRWaXNpdGVkTWVzc2FnZXMoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VmlzaXRlZE1lc3NhZ2VzKCkge1xuICAgIHZpc2l0ZWRNZXNzYWdlcyA9IG5ldyBTZXQoKTtcbiAgfVxuICBmdW5jdGlvbiB3YXJuV2hlbihjb25kaXRpb24sIG1lc3NhZ2UpIHtcbiAgICBpZiAoY29uZGl0aW9uICYmICF2aXNpdGVkTWVzc2FnZXMuaGFzKG1lc3NhZ2UpKSB7XG4gICAgICB2YXIgX2NvbnNvbGU7XG5cbiAgICAgIHZpc2l0ZWRNZXNzYWdlcy5hZGQobWVzc2FnZSk7XG5cbiAgICAgIChfY29uc29sZSA9IGNvbnNvbGUpLndhcm4uYXBwbHkoX2NvbnNvbGUsIGdldEZvcm1hdHRlZE1lc3NhZ2UobWVzc2FnZSkpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBlcnJvcldoZW4oY29uZGl0aW9uLCBtZXNzYWdlKSB7XG4gICAgaWYgKGNvbmRpdGlvbiAmJiAhdmlzaXRlZE1lc3NhZ2VzLmhhcyhtZXNzYWdlKSkge1xuICAgICAgdmFyIF9jb25zb2xlMjtcblxuICAgICAgdmlzaXRlZE1lc3NhZ2VzLmFkZChtZXNzYWdlKTtcblxuICAgICAgKF9jb25zb2xlMiA9IGNvbnNvbGUpLmVycm9yLmFwcGx5KF9jb25zb2xlMiwgZ2V0Rm9ybWF0dGVkTWVzc2FnZShtZXNzYWdlKSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHZhbGlkYXRlVGFyZ2V0cyh0YXJnZXRzKSB7XG4gICAgdmFyIGRpZFBhc3NGYWxzeVZhbHVlID0gIXRhcmdldHM7XG4gICAgdmFyIGRpZFBhc3NQbGFpbk9iamVjdCA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0YXJnZXRzKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScgJiYgIXRhcmdldHMuYWRkRXZlbnRMaXN0ZW5lcjtcbiAgICBlcnJvcldoZW4oZGlkUGFzc0ZhbHN5VmFsdWUsIFsndGlwcHkoKSB3YXMgcGFzc2VkJywgJ2AnICsgU3RyaW5nKHRhcmdldHMpICsgJ2AnLCAnYXMgaXRzIHRhcmdldHMgKGZpcnN0KSBhcmd1bWVudC4gVmFsaWQgdHlwZXMgYXJlOiBTdHJpbmcsIEVsZW1lbnQsJywgJ0VsZW1lbnRbXSwgb3IgTm9kZUxpc3QuJ10uam9pbignICcpKTtcbiAgICBlcnJvcldoZW4oZGlkUGFzc1BsYWluT2JqZWN0LCBbJ3RpcHB5KCkgd2FzIHBhc3NlZCBhIHBsYWluIG9iamVjdCB3aGljaCBpcyBub3Qgc3VwcG9ydGVkIGFzIGFuIGFyZ3VtZW50JywgJ2ZvciB2aXJ0dWFsIHBvc2l0aW9uaW5nLiBVc2UgcHJvcHMuZ2V0UmVmZXJlbmNlQ2xpZW50UmVjdCBpbnN0ZWFkLiddLmpvaW4oJyAnKSk7XG4gIH1cblxuICB2YXIgcGx1Z2luUHJvcHMgPSB7XG4gICAgYW5pbWF0ZUZpbGw6IGZhbHNlLFxuICAgIGZvbGxvd0N1cnNvcjogZmFsc2UsXG4gICAgaW5saW5lUG9zaXRpb25pbmc6IGZhbHNlLFxuICAgIHN0aWNreTogZmFsc2VcbiAgfTtcbiAgdmFyIHJlbmRlclByb3BzID0ge1xuICAgIGFsbG93SFRNTDogZmFsc2UsXG4gICAgYW5pbWF0aW9uOiAnZmFkZScsXG4gICAgYXJyb3c6IHRydWUsXG4gICAgY29udGVudDogJycsXG4gICAgaW5lcnRpYTogZmFsc2UsXG4gICAgbWF4V2lkdGg6IDM1MCxcbiAgICByb2xlOiAndG9vbHRpcCcsXG4gICAgdGhlbWU6ICcnLFxuICAgIHpJbmRleDogOTk5OVxuICB9O1xuICB2YXIgZGVmYXVsdFByb3BzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgYXBwZW5kVG86IFRJUFBZX0RFRkFVTFRfQVBQRU5EX1RPLFxuICAgIGFyaWE6IHtcbiAgICAgIGNvbnRlbnQ6ICdhdXRvJyxcbiAgICAgIGV4cGFuZGVkOiAnYXV0bydcbiAgICB9LFxuICAgIGRlbGF5OiAwLFxuICAgIGR1cmF0aW9uOiBbMzAwLCAyNTBdLFxuICAgIGdldFJlZmVyZW5jZUNsaWVudFJlY3Q6IG51bGwsXG4gICAgaGlkZU9uQ2xpY2s6IHRydWUsXG4gICAgaWdub3JlQXR0cmlidXRlczogZmFsc2UsXG4gICAgaW50ZXJhY3RpdmU6IGZhbHNlLFxuICAgIGludGVyYWN0aXZlQm9yZGVyOiAyLFxuICAgIGludGVyYWN0aXZlRGVib3VuY2U6IDAsXG4gICAgbW92ZVRyYW5zaXRpb246ICcnLFxuICAgIG9mZnNldDogWzAsIDEwXSxcbiAgICBvbkFmdGVyVXBkYXRlOiBmdW5jdGlvbiBvbkFmdGVyVXBkYXRlKCkge30sXG4gICAgb25CZWZvcmVVcGRhdGU6IGZ1bmN0aW9uIG9uQmVmb3JlVXBkYXRlKCkge30sXG4gICAgb25DcmVhdGU6IGZ1bmN0aW9uIG9uQ3JlYXRlKCkge30sXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiBvbkRlc3Ryb3koKSB7fSxcbiAgICBvbkhpZGRlbjogZnVuY3Rpb24gb25IaWRkZW4oKSB7fSxcbiAgICBvbkhpZGU6IGZ1bmN0aW9uIG9uSGlkZSgpIHt9LFxuICAgIG9uTW91bnQ6IGZ1bmN0aW9uIG9uTW91bnQoKSB7fSxcbiAgICBvblNob3c6IGZ1bmN0aW9uIG9uU2hvdygpIHt9LFxuICAgIG9uU2hvd246IGZ1bmN0aW9uIG9uU2hvd24oKSB7fSxcbiAgICBvblRyaWdnZXI6IGZ1bmN0aW9uIG9uVHJpZ2dlcigpIHt9LFxuICAgIG9uVW50cmlnZ2VyOiBmdW5jdGlvbiBvblVudHJpZ2dlcigpIHt9LFxuICAgIG9uQ2xpY2tPdXRzaWRlOiBmdW5jdGlvbiBvbkNsaWNrT3V0c2lkZSgpIHt9LFxuICAgIHBsYWNlbWVudDogJ3RvcCcsXG4gICAgcGx1Z2luczogW10sXG4gICAgcG9wcGVyT3B0aW9uczoge30sXG4gICAgcmVuZGVyOiBudWxsLFxuICAgIHNob3dPbkNyZWF0ZTogZmFsc2UsXG4gICAgdG91Y2g6IHRydWUsXG4gICAgdHJpZ2dlcjogJ21vdXNlZW50ZXIgZm9jdXMnLFxuICAgIHRyaWdnZXJUYXJnZXQ6IG51bGxcbiAgfSwgcGx1Z2luUHJvcHMsIHJlbmRlclByb3BzKTtcbiAgdmFyIGRlZmF1bHRLZXlzID0gT2JqZWN0LmtleXMoZGVmYXVsdFByb3BzKTtcbiAgdmFyIHNldERlZmF1bHRQcm9wcyA9IGZ1bmN0aW9uIHNldERlZmF1bHRQcm9wcyhwYXJ0aWFsUHJvcHMpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIHtcbiAgICAgIHZhbGlkYXRlUHJvcHMocGFydGlhbFByb3BzLCBbXSk7XG4gICAgfVxuXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhwYXJ0aWFsUHJvcHMpO1xuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICBkZWZhdWx0UHJvcHNba2V5XSA9IHBhcnRpYWxQcm9wc1trZXldO1xuICAgIH0pO1xuICB9O1xuICBmdW5jdGlvbiBnZXRFeHRlbmRlZFBhc3NlZFByb3BzKHBhc3NlZFByb3BzKSB7XG4gICAgdmFyIHBsdWdpbnMgPSBwYXNzZWRQcm9wcy5wbHVnaW5zIHx8IFtdO1xuICAgIHZhciBwbHVnaW5Qcm9wcyA9IHBsdWdpbnMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBsdWdpbikge1xuICAgICAgdmFyIG5hbWUgPSBwbHVnaW4ubmFtZSxcbiAgICAgICAgICBkZWZhdWx0VmFsdWUgPSBwbHVnaW4uZGVmYXVsdFZhbHVlO1xuXG4gICAgICBpZiAobmFtZSkge1xuICAgICAgICB2YXIgX25hbWU7XG5cbiAgICAgICAgYWNjW25hbWVdID0gcGFzc2VkUHJvcHNbbmFtZV0gIT09IHVuZGVmaW5lZCA/IHBhc3NlZFByb3BzW25hbWVdIDogKF9uYW1lID0gZGVmYXVsdFByb3BzW25hbWVdKSAhPSBudWxsID8gX25hbWUgOiBkZWZhdWx0VmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBwYXNzZWRQcm9wcywgcGx1Z2luUHJvcHMpO1xuICB9XG4gIGZ1bmN0aW9uIGdldERhdGFBdHRyaWJ1dGVQcm9wcyhyZWZlcmVuY2UsIHBsdWdpbnMpIHtcbiAgICB2YXIgcHJvcEtleXMgPSBwbHVnaW5zID8gT2JqZWN0LmtleXMoZ2V0RXh0ZW5kZWRQYXNzZWRQcm9wcyhPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0UHJvcHMsIHtcbiAgICAgIHBsdWdpbnM6IHBsdWdpbnNcbiAgICB9KSkpIDogZGVmYXVsdEtleXM7XG4gICAgdmFyIHByb3BzID0gcHJvcEtleXMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGtleSkge1xuICAgICAgdmFyIHZhbHVlQXNTdHJpbmcgPSAocmVmZXJlbmNlLmdldEF0dHJpYnV0ZShcImRhdGEtdGlwcHktXCIgKyBrZXkpIHx8ICcnKS50cmltKCk7XG5cbiAgICAgIGlmICghdmFsdWVBc1N0cmluZykge1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfVxuXG4gICAgICBpZiAoa2V5ID09PSAnY29udGVudCcpIHtcbiAgICAgICAgYWNjW2tleV0gPSB2YWx1ZUFzU3RyaW5nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhY2Nba2V5XSA9IEpTT04ucGFyc2UodmFsdWVBc1N0cmluZyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBhY2Nba2V5XSA9IHZhbHVlQXNTdHJpbmc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gICAgcmV0dXJuIHByb3BzO1xuICB9XG4gIGZ1bmN0aW9uIGV2YWx1YXRlUHJvcHMocmVmZXJlbmNlLCBwcm9wcykge1xuICAgIHZhciBvdXQgPSBPYmplY3QuYXNzaWduKHt9LCBwcm9wcywge1xuICAgICAgY29udGVudDogaW52b2tlV2l0aEFyZ3NPclJldHVybihwcm9wcy5jb250ZW50LCBbcmVmZXJlbmNlXSlcbiAgICB9LCBwcm9wcy5pZ25vcmVBdHRyaWJ1dGVzID8ge30gOiBnZXREYXRhQXR0cmlidXRlUHJvcHMocmVmZXJlbmNlLCBwcm9wcy5wbHVnaW5zKSk7XG4gICAgb3V0LmFyaWEgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0UHJvcHMuYXJpYSwgb3V0LmFyaWEpO1xuICAgIG91dC5hcmlhID0ge1xuICAgICAgZXhwYW5kZWQ6IG91dC5hcmlhLmV4cGFuZGVkID09PSAnYXV0bycgPyBwcm9wcy5pbnRlcmFjdGl2ZSA6IG91dC5hcmlhLmV4cGFuZGVkLFxuICAgICAgY29udGVudDogb3V0LmFyaWEuY29udGVudCA9PT0gJ2F1dG8nID8gcHJvcHMuaW50ZXJhY3RpdmUgPyBudWxsIDogJ2Rlc2NyaWJlZGJ5JyA6IG91dC5hcmlhLmNvbnRlbnRcbiAgICB9O1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgZnVuY3Rpb24gdmFsaWRhdGVQcm9wcyhwYXJ0aWFsUHJvcHMsIHBsdWdpbnMpIHtcbiAgICBpZiAocGFydGlhbFByb3BzID09PSB2b2lkIDApIHtcbiAgICAgIHBhcnRpYWxQcm9wcyA9IHt9O1xuICAgIH1cblxuICAgIGlmIChwbHVnaW5zID09PSB2b2lkIDApIHtcbiAgICAgIHBsdWdpbnMgPSBbXTtcbiAgICB9XG5cbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHBhcnRpYWxQcm9wcyk7XG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICB2YXIgbm9uUGx1Z2luUHJvcHMgPSByZW1vdmVQcm9wZXJ0aWVzKGRlZmF1bHRQcm9wcywgT2JqZWN0LmtleXMocGx1Z2luUHJvcHMpKTtcbiAgICAgIHZhciBkaWRQYXNzVW5rbm93blByb3AgPSAhaGFzT3duUHJvcGVydHkobm9uUGx1Z2luUHJvcHMsIHByb3ApOyAvLyBDaGVjayBpZiB0aGUgcHJvcCBleGlzdHMgaW4gYHBsdWdpbnNgXG5cbiAgICAgIGlmIChkaWRQYXNzVW5rbm93blByb3ApIHtcbiAgICAgICAgZGlkUGFzc1Vua25vd25Qcm9wID0gcGx1Z2lucy5maWx0ZXIoZnVuY3Rpb24gKHBsdWdpbikge1xuICAgICAgICAgIHJldHVybiBwbHVnaW4ubmFtZSA9PT0gcHJvcDtcbiAgICAgICAgfSkubGVuZ3RoID09PSAwO1xuICAgICAgfVxuXG4gICAgICB3YXJuV2hlbihkaWRQYXNzVW5rbm93blByb3AsIFtcImBcIiArIHByb3AgKyBcImBcIiwgXCJpcyBub3QgYSB2YWxpZCBwcm9wLiBZb3UgbWF5IGhhdmUgc3BlbGxlZCBpdCBpbmNvcnJlY3RseSwgb3IgaWYgaXQnc1wiLCAnYSBwbHVnaW4sIGZvcmdvdCB0byBwYXNzIGl0IGluIGFuIGFycmF5IGFzIHByb3BzLnBsdWdpbnMuJywgJ1xcblxcbicsICdBbGwgcHJvcHM6IGh0dHBzOi8vYXRvbWlrcy5naXRodWIuaW8vdGlwcHlqcy92Ni9hbGwtcHJvcHMvXFxuJywgJ1BsdWdpbnM6IGh0dHBzOi8vYXRvbWlrcy5naXRodWIuaW8vdGlwcHlqcy92Ni9wbHVnaW5zLyddLmpvaW4oJyAnKSk7XG4gICAgfSk7XG4gIH1cblxuICB2YXIgaW5uZXJIVE1MID0gZnVuY3Rpb24gaW5uZXJIVE1MKCkge1xuICAgIHJldHVybiAnaW5uZXJIVE1MJztcbiAgfTtcblxuICBmdW5jdGlvbiBkYW5nZXJvdXNseVNldElubmVySFRNTChlbGVtZW50LCBodG1sKSB7XG4gICAgZWxlbWVudFtpbm5lckhUTUwoKV0gPSBodG1sO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQXJyb3dFbGVtZW50KHZhbHVlKSB7XG4gICAgdmFyIGFycm93ID0gZGl2KCk7XG5cbiAgICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICAgIGFycm93LmNsYXNzTmFtZSA9IEFSUk9XX0NMQVNTO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcnJvdy5jbGFzc05hbWUgPSBTVkdfQVJST1dfQ0xBU1M7XG5cbiAgICAgIGlmIChpc0VsZW1lbnQodmFsdWUpKSB7XG4gICAgICAgIGFycm93LmFwcGVuZENoaWxkKHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MKGFycm93LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycm93O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0Q29udGVudChjb250ZW50LCBwcm9wcykge1xuICAgIGlmIChpc0VsZW1lbnQocHJvcHMuY29udGVudCkpIHtcbiAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MKGNvbnRlbnQsICcnKTtcbiAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQocHJvcHMuY29udGVudCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcHJvcHMuY29udGVudCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKHByb3BzLmFsbG93SFRNTCkge1xuICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTChjb250ZW50LCBwcm9wcy5jb250ZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRlbnQudGV4dENvbnRlbnQgPSBwcm9wcy5jb250ZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBnZXRDaGlsZHJlbihwb3BwZXIpIHtcbiAgICB2YXIgYm94ID0gcG9wcGVyLmZpcnN0RWxlbWVudENoaWxkO1xuICAgIHZhciBib3hDaGlsZHJlbiA9IGFycmF5RnJvbShib3guY2hpbGRyZW4pO1xuICAgIHJldHVybiB7XG4gICAgICBib3g6IGJveCxcbiAgICAgIGNvbnRlbnQ6IGJveENoaWxkcmVuLmZpbmQoZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKENPTlRFTlRfQ0xBU1MpO1xuICAgICAgfSksXG4gICAgICBhcnJvdzogYm94Q2hpbGRyZW4uZmluZChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICByZXR1cm4gbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoQVJST1dfQ0xBU1MpIHx8IG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKFNWR19BUlJPV19DTEFTUyk7XG4gICAgICB9KSxcbiAgICAgIGJhY2tkcm9wOiBib3hDaGlsZHJlbi5maW5kKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHJldHVybiBub2RlLmNsYXNzTGlzdC5jb250YWlucyhCQUNLRFJPUF9DTEFTUyk7XG4gICAgICB9KVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gcmVuZGVyKGluc3RhbmNlKSB7XG4gICAgdmFyIHBvcHBlciA9IGRpdigpO1xuICAgIHZhciBib3ggPSBkaXYoKTtcbiAgICBib3guY2xhc3NOYW1lID0gQk9YX0NMQVNTO1xuICAgIGJveC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhdGUnLCAnaGlkZGVuJyk7XG4gICAgYm94LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICB2YXIgY29udGVudCA9IGRpdigpO1xuICAgIGNvbnRlbnQuY2xhc3NOYW1lID0gQ09OVEVOVF9DTEFTUztcbiAgICBjb250ZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1zdGF0ZScsICdoaWRkZW4nKTtcbiAgICBzZXRDb250ZW50KGNvbnRlbnQsIGluc3RhbmNlLnByb3BzKTtcbiAgICBwb3BwZXIuYXBwZW5kQ2hpbGQoYm94KTtcbiAgICBib3guYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gICAgb25VcGRhdGUoaW5zdGFuY2UucHJvcHMsIGluc3RhbmNlLnByb3BzKTtcblxuICAgIGZ1bmN0aW9uIG9uVXBkYXRlKHByZXZQcm9wcywgbmV4dFByb3BzKSB7XG4gICAgICB2YXIgX2dldENoaWxkcmVuID0gZ2V0Q2hpbGRyZW4ocG9wcGVyKSxcbiAgICAgICAgICBib3ggPSBfZ2V0Q2hpbGRyZW4uYm94LFxuICAgICAgICAgIGNvbnRlbnQgPSBfZ2V0Q2hpbGRyZW4uY29udGVudCxcbiAgICAgICAgICBhcnJvdyA9IF9nZXRDaGlsZHJlbi5hcnJvdztcblxuICAgICAgaWYgKG5leHRQcm9wcy50aGVtZSkge1xuICAgICAgICBib3guc2V0QXR0cmlidXRlKCdkYXRhLXRoZW1lJywgbmV4dFByb3BzLnRoZW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJveC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtdGhlbWUnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBuZXh0UHJvcHMuYW5pbWF0aW9uID09PSAnc3RyaW5nJykge1xuICAgICAgICBib3guc2V0QXR0cmlidXRlKCdkYXRhLWFuaW1hdGlvbicsIG5leHRQcm9wcy5hbmltYXRpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm94LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1hbmltYXRpb24nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5leHRQcm9wcy5pbmVydGlhKSB7XG4gICAgICAgIGJveC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5lcnRpYScsICcnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJveC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW5lcnRpYScpO1xuICAgICAgfVxuXG4gICAgICBib3guc3R5bGUubWF4V2lkdGggPSB0eXBlb2YgbmV4dFByb3BzLm1heFdpZHRoID09PSAnbnVtYmVyJyA/IG5leHRQcm9wcy5tYXhXaWR0aCArIFwicHhcIiA6IG5leHRQcm9wcy5tYXhXaWR0aDtcblxuICAgICAgaWYgKG5leHRQcm9wcy5yb2xlKSB7XG4gICAgICAgIGJveC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCBuZXh0UHJvcHMucm9sZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBib3gucmVtb3ZlQXR0cmlidXRlKCdyb2xlJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2UHJvcHMuY29udGVudCAhPT0gbmV4dFByb3BzLmNvbnRlbnQgfHwgcHJldlByb3BzLmFsbG93SFRNTCAhPT0gbmV4dFByb3BzLmFsbG93SFRNTCkge1xuICAgICAgICBzZXRDb250ZW50KGNvbnRlbnQsIGluc3RhbmNlLnByb3BzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5leHRQcm9wcy5hcnJvdykge1xuICAgICAgICBpZiAoIWFycm93KSB7XG4gICAgICAgICAgYm94LmFwcGVuZENoaWxkKGNyZWF0ZUFycm93RWxlbWVudChuZXh0UHJvcHMuYXJyb3cpKTtcbiAgICAgICAgfSBlbHNlIGlmIChwcmV2UHJvcHMuYXJyb3cgIT09IG5leHRQcm9wcy5hcnJvdykge1xuICAgICAgICAgIGJveC5yZW1vdmVDaGlsZChhcnJvdyk7XG4gICAgICAgICAgYm94LmFwcGVuZENoaWxkKGNyZWF0ZUFycm93RWxlbWVudChuZXh0UHJvcHMuYXJyb3cpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChhcnJvdykge1xuICAgICAgICBib3gucmVtb3ZlQ2hpbGQoYXJyb3cpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBwb3BwZXI6IHBvcHBlcixcbiAgICAgIG9uVXBkYXRlOiBvblVwZGF0ZVxuICAgIH07XG4gIH0gLy8gUnVudGltZSBjaGVjayB0byBpZGVudGlmeSBpZiB0aGUgcmVuZGVyIGZ1bmN0aW9uIGlzIHRoZSBkZWZhdWx0IG9uZTsgdGhpc1xuICAvLyB3YXkgd2UgY2FuIGFwcGx5IGRlZmF1bHQgQ1NTIHRyYW5zaXRpb25zIGxvZ2ljIGFuZCBpdCBjYW4gYmUgdHJlZS1zaGFrZW4gYXdheVxuXG4gIHJlbmRlci4kJHRpcHB5ID0gdHJ1ZTtcblxuICB2YXIgaWRDb3VudGVyID0gMTtcbiAgdmFyIG1vdXNlTW92ZUxpc3RlbmVycyA9IFtdOyAvLyBVc2VkIGJ5IGBoaWRlQWxsKClgXG5cbiAgdmFyIG1vdW50ZWRJbnN0YW5jZXMgPSBbXTtcbiAgZnVuY3Rpb24gY3JlYXRlVGlwcHkocmVmZXJlbmNlLCBwYXNzZWRQcm9wcykge1xuICAgIHZhciBwcm9wcyA9IGV2YWx1YXRlUHJvcHMocmVmZXJlbmNlLCBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0UHJvcHMsIGdldEV4dGVuZGVkUGFzc2VkUHJvcHMocmVtb3ZlVW5kZWZpbmVkUHJvcHMocGFzc2VkUHJvcHMpKSkpOyAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyDwn5SSIFByaXZhdGUgbWVtYmVyc1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgdmFyIHNob3dUaW1lb3V0O1xuICAgIHZhciBoaWRlVGltZW91dDtcbiAgICB2YXIgc2NoZWR1bGVIaWRlQW5pbWF0aW9uRnJhbWU7XG4gICAgdmFyIGlzVmlzaWJsZUZyb21DbGljayA9IGZhbHNlO1xuICAgIHZhciBkaWRIaWRlRHVlVG9Eb2N1bWVudE1vdXNlRG93biA9IGZhbHNlO1xuICAgIHZhciBkaWRUb3VjaE1vdmUgPSBmYWxzZTtcbiAgICB2YXIgaWdub3JlT25GaXJzdFVwZGF0ZSA9IGZhbHNlO1xuICAgIHZhciBsYXN0VHJpZ2dlckV2ZW50O1xuICAgIHZhciBjdXJyZW50VHJhbnNpdGlvbkVuZExpc3RlbmVyO1xuICAgIHZhciBvbkZpcnN0VXBkYXRlO1xuICAgIHZhciBsaXN0ZW5lcnMgPSBbXTtcbiAgICB2YXIgZGVib3VuY2VkT25Nb3VzZU1vdmUgPSBkZWJvdW5jZShvbk1vdXNlTW92ZSwgcHJvcHMuaW50ZXJhY3RpdmVEZWJvdW5jZSk7XG4gICAgdmFyIGN1cnJlbnRUYXJnZXQ7IC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIPCflJEgUHVibGljIG1lbWJlcnNcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIHZhciBpZCA9IGlkQ291bnRlcisrO1xuICAgIHZhciBwb3BwZXJJbnN0YW5jZSA9IG51bGw7XG4gICAgdmFyIHBsdWdpbnMgPSB1bmlxdWUocHJvcHMucGx1Z2lucyk7XG4gICAgdmFyIHN0YXRlID0ge1xuICAgICAgLy8gSXMgdGhlIGluc3RhbmNlIGN1cnJlbnRseSBlbmFibGVkP1xuICAgICAgaXNFbmFibGVkOiB0cnVlLFxuICAgICAgLy8gSXMgdGhlIHRpcHB5IGN1cnJlbnRseSBzaG93aW5nIGFuZCBub3QgdHJhbnNpdGlvbmluZyBvdXQ/XG4gICAgICBpc1Zpc2libGU6IGZhbHNlLFxuICAgICAgLy8gSGFzIHRoZSBpbnN0YW5jZSBiZWVuIGRlc3Ryb3llZD9cbiAgICAgIGlzRGVzdHJveWVkOiBmYWxzZSxcbiAgICAgIC8vIElzIHRoZSB0aXBweSBjdXJyZW50bHkgbW91bnRlZCB0byB0aGUgRE9NP1xuICAgICAgaXNNb3VudGVkOiBmYWxzZSxcbiAgICAgIC8vIEhhcyB0aGUgdGlwcHkgZmluaXNoZWQgdHJhbnNpdGlvbmluZyBpbj9cbiAgICAgIGlzU2hvd246IGZhbHNlXG4gICAgfTtcbiAgICB2YXIgaW5zdGFuY2UgPSB7XG4gICAgICAvLyBwcm9wZXJ0aWVzXG4gICAgICBpZDogaWQsXG4gICAgICByZWZlcmVuY2U6IHJlZmVyZW5jZSxcbiAgICAgIHBvcHBlcjogZGl2KCksXG4gICAgICBwb3BwZXJJbnN0YW5jZTogcG9wcGVySW5zdGFuY2UsXG4gICAgICBwcm9wczogcHJvcHMsXG4gICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICBwbHVnaW5zOiBwbHVnaW5zLFxuICAgICAgLy8gbWV0aG9kc1xuICAgICAgY2xlYXJEZWxheVRpbWVvdXRzOiBjbGVhckRlbGF5VGltZW91dHMsXG4gICAgICBzZXRQcm9wczogc2V0UHJvcHMsXG4gICAgICBzZXRDb250ZW50OiBzZXRDb250ZW50LFxuICAgICAgc2hvdzogc2hvdyxcbiAgICAgIGhpZGU6IGhpZGUsXG4gICAgICBoaWRlV2l0aEludGVyYWN0aXZpdHk6IGhpZGVXaXRoSW50ZXJhY3Rpdml0eSxcbiAgICAgIGVuYWJsZTogZW5hYmxlLFxuICAgICAgZGlzYWJsZTogZGlzYWJsZSxcbiAgICAgIHVubW91bnQ6IHVubW91bnQsXG4gICAgICBkZXN0cm95OiBkZXN0cm95XG4gICAgfTsgLy8gVE9ETzogSW52ZXN0aWdhdGUgd2h5IHRoaXMgZWFybHkgcmV0dXJuIGNhdXNlcyBhIFREWiBlcnJvciBpbiB0aGUgdGVzdHMg4oCUXG4gICAgLy8gaXQgZG9lc24ndCBzZWVtIHRvIGhhcHBlbiBpbiB0aGUgYnJvd3NlclxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cbiAgICBpZiAoIXByb3BzLnJlbmRlcikge1xuICAgICAge1xuICAgICAgICBlcnJvcldoZW4odHJ1ZSwgJ3JlbmRlcigpIGZ1bmN0aW9uIGhhcyBub3QgYmVlbiBzdXBwbGllZC4nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH0gLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gSW5pdGlhbCBtdXRhdGlvbnNcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXG4gICAgdmFyIF9wcm9wcyRyZW5kZXIgPSBwcm9wcy5yZW5kZXIoaW5zdGFuY2UpLFxuICAgICAgICBwb3BwZXIgPSBfcHJvcHMkcmVuZGVyLnBvcHBlcixcbiAgICAgICAgb25VcGRhdGUgPSBfcHJvcHMkcmVuZGVyLm9uVXBkYXRlO1xuXG4gICAgcG9wcGVyLnNldEF0dHJpYnV0ZSgnZGF0YS10aXBweS1yb290JywgJycpO1xuICAgIHBvcHBlci5pZCA9IFwidGlwcHktXCIgKyBpbnN0YW5jZS5pZDtcbiAgICBpbnN0YW5jZS5wb3BwZXIgPSBwb3BwZXI7XG4gICAgcmVmZXJlbmNlLl90aXBweSA9IGluc3RhbmNlO1xuICAgIHBvcHBlci5fdGlwcHkgPSBpbnN0YW5jZTtcbiAgICB2YXIgcGx1Z2luc0hvb2tzID0gcGx1Z2lucy5tYXAoZnVuY3Rpb24gKHBsdWdpbikge1xuICAgICAgcmV0dXJuIHBsdWdpbi5mbihpbnN0YW5jZSk7XG4gICAgfSk7XG4gICAgdmFyIGhhc0FyaWFFeHBhbmRlZCA9IHJlZmVyZW5jZS5oYXNBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKTtcbiAgICBhZGRMaXN0ZW5lcnMoKTtcbiAgICBoYW5kbGVBcmlhRXhwYW5kZWRBdHRyaWJ1dGUoKTtcbiAgICBoYW5kbGVTdHlsZXMoKTtcbiAgICBpbnZva2VIb29rKCdvbkNyZWF0ZScsIFtpbnN0YW5jZV0pO1xuXG4gICAgaWYgKHByb3BzLnNob3dPbkNyZWF0ZSkge1xuICAgICAgc2NoZWR1bGVTaG93KCk7XG4gICAgfSAvLyBQcmV2ZW50IGEgdGlwcHkgd2l0aCBhIGRlbGF5IGZyb20gaGlkaW5nIGlmIHRoZSBjdXJzb3IgbGVmdCB0aGVuIHJldHVybmVkXG4gICAgLy8gYmVmb3JlIGl0IHN0YXJ0ZWQgaGlkaW5nXG5cblxuICAgIHBvcHBlci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGluc3RhbmNlLnByb3BzLmludGVyYWN0aXZlICYmIGluc3RhbmNlLnN0YXRlLmlzVmlzaWJsZSkge1xuICAgICAgICBpbnN0YW5jZS5jbGVhckRlbGF5VGltZW91dHMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwb3BwZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChpbnN0YW5jZS5wcm9wcy5pbnRlcmFjdGl2ZSAmJiBpbnN0YW5jZS5wcm9wcy50cmlnZ2VyLmluZGV4T2YoJ21vdXNlZW50ZXInKSA+PSAwKSB7XG4gICAgICAgIGdldERvY3VtZW50KCkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZGVib3VuY2VkT25Nb3VzZU1vdmUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBpbnN0YW5jZTsgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8g8J+UkiBQcml2YXRlIG1ldGhvZHNcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGZ1bmN0aW9uIGdldE5vcm1hbGl6ZWRUb3VjaFNldHRpbmdzKCkge1xuICAgICAgdmFyIHRvdWNoID0gaW5zdGFuY2UucHJvcHMudG91Y2g7XG4gICAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh0b3VjaCkgPyB0b3VjaCA6IFt0b3VjaCwgMF07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0SXNDdXN0b21Ub3VjaEJlaGF2aW9yKCkge1xuICAgICAgcmV0dXJuIGdldE5vcm1hbGl6ZWRUb3VjaFNldHRpbmdzKClbMF0gPT09ICdob2xkJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRJc0RlZmF1bHRSZW5kZXJGbigpIHtcbiAgICAgIHZhciBfaW5zdGFuY2UkcHJvcHMkcmVuZGU7XG5cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHJldHVybiAhISgoX2luc3RhbmNlJHByb3BzJHJlbmRlID0gaW5zdGFuY2UucHJvcHMucmVuZGVyKSAhPSBudWxsICYmIF9pbnN0YW5jZSRwcm9wcyRyZW5kZS4kJHRpcHB5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDdXJyZW50VGFyZ2V0KCkge1xuICAgICAgcmV0dXJuIGN1cnJlbnRUYXJnZXQgfHwgcmVmZXJlbmNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERvY3VtZW50KCkge1xuICAgICAgdmFyIHBhcmVudCA9IGdldEN1cnJlbnRUYXJnZXQoKS5wYXJlbnROb2RlO1xuICAgICAgcmV0dXJuIHBhcmVudCA/IGdldE93bmVyRG9jdW1lbnQocGFyZW50KSA6IGRvY3VtZW50O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERlZmF1bHRUZW1wbGF0ZUNoaWxkcmVuKCkge1xuICAgICAgcmV0dXJuIGdldENoaWxkcmVuKHBvcHBlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RGVsYXkoaXNTaG93KSB7XG4gICAgICAvLyBGb3IgdG91Y2ggb3Iga2V5Ym9hcmQgaW5wdXQsIGZvcmNlIGAwYCBkZWxheSBmb3IgVVggcmVhc29uc1xuICAgICAgLy8gQWxzbyBpZiB0aGUgaW5zdGFuY2UgaXMgbW91bnRlZCBidXQgbm90IHZpc2libGUgKHRyYW5zaXRpb25pbmcgb3V0KSxcbiAgICAgIC8vIGlnbm9yZSBkZWxheVxuICAgICAgaWYgKGluc3RhbmNlLnN0YXRlLmlzTW91bnRlZCAmJiAhaW5zdGFuY2Uuc3RhdGUuaXNWaXNpYmxlIHx8IGN1cnJlbnRJbnB1dC5pc1RvdWNoIHx8IGxhc3RUcmlnZ2VyRXZlbnQgJiYgbGFzdFRyaWdnZXJFdmVudC50eXBlID09PSAnZm9jdXMnKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZ2V0VmFsdWVBdEluZGV4T3JSZXR1cm4oaW5zdGFuY2UucHJvcHMuZGVsYXksIGlzU2hvdyA/IDAgOiAxLCBkZWZhdWx0UHJvcHMuZGVsYXkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVN0eWxlcyhmcm9tSGlkZSkge1xuICAgICAgaWYgKGZyb21IaWRlID09PSB2b2lkIDApIHtcbiAgICAgICAgZnJvbUhpZGUgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcG9wcGVyLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBpbnN0YW5jZS5wcm9wcy5pbnRlcmFjdGl2ZSAmJiAhZnJvbUhpZGUgPyAnJyA6ICdub25lJztcbiAgICAgIHBvcHBlci5zdHlsZS56SW5kZXggPSBcIlwiICsgaW5zdGFuY2UucHJvcHMuekluZGV4O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGludm9rZUhvb2soaG9vaywgYXJncywgc2hvdWxkSW52b2tlUHJvcHNIb29rKSB7XG4gICAgICBpZiAoc2hvdWxkSW52b2tlUHJvcHNIb29rID09PSB2b2lkIDApIHtcbiAgICAgICAgc2hvdWxkSW52b2tlUHJvcHNIb29rID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcGx1Z2luc0hvb2tzLmZvckVhY2goZnVuY3Rpb24gKHBsdWdpbkhvb2tzKSB7XG4gICAgICAgIGlmIChwbHVnaW5Ib29rc1tob29rXSkge1xuICAgICAgICAgIHBsdWdpbkhvb2tzW2hvb2tdLmFwcGx5KHBsdWdpbkhvb2tzLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChzaG91bGRJbnZva2VQcm9wc0hvb2spIHtcbiAgICAgICAgdmFyIF9pbnN0YW5jZSRwcm9wcztcblxuICAgICAgICAoX2luc3RhbmNlJHByb3BzID0gaW5zdGFuY2UucHJvcHMpW2hvb2tdLmFwcGx5KF9pbnN0YW5jZSRwcm9wcywgYXJncyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlQXJpYUNvbnRlbnRBdHRyaWJ1dGUoKSB7XG4gICAgICB2YXIgYXJpYSA9IGluc3RhbmNlLnByb3BzLmFyaWE7XG5cbiAgICAgIGlmICghYXJpYS5jb250ZW50KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGF0dHIgPSBcImFyaWEtXCIgKyBhcmlhLmNvbnRlbnQ7XG4gICAgICB2YXIgaWQgPSBwb3BwZXIuaWQ7XG4gICAgICB2YXIgbm9kZXMgPSBub3JtYWxpemVUb0FycmF5KGluc3RhbmNlLnByb3BzLnRyaWdnZXJUYXJnZXQgfHwgcmVmZXJlbmNlKTtcbiAgICAgIG5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRWYWx1ZSA9IG5vZGUuZ2V0QXR0cmlidXRlKGF0dHIpO1xuXG4gICAgICAgIGlmIChpbnN0YW5jZS5zdGF0ZS5pc1Zpc2libGUpIHtcbiAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShhdHRyLCBjdXJyZW50VmFsdWUgPyBjdXJyZW50VmFsdWUgKyBcIiBcIiArIGlkIDogaWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBuZXh0VmFsdWUgPSBjdXJyZW50VmFsdWUgJiYgY3VycmVudFZhbHVlLnJlcGxhY2UoaWQsICcnKS50cmltKCk7XG5cbiAgICAgICAgICBpZiAobmV4dFZhbHVlKSB7XG4gICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShhdHRyLCBuZXh0VmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZUFyaWFFeHBhbmRlZEF0dHJpYnV0ZSgpIHtcbiAgICAgIGlmIChoYXNBcmlhRXhwYW5kZWQgfHwgIWluc3RhbmNlLnByb3BzLmFyaWEuZXhwYW5kZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgbm9kZXMgPSBub3JtYWxpemVUb0FycmF5KGluc3RhbmNlLnByb3BzLnRyaWdnZXJUYXJnZXQgfHwgcmVmZXJlbmNlKTtcbiAgICAgIG5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgaWYgKGluc3RhbmNlLnByb3BzLmludGVyYWN0aXZlKSB7XG4gICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBpbnN0YW5jZS5zdGF0ZS5pc1Zpc2libGUgJiYgbm9kZSA9PT0gZ2V0Q3VycmVudFRhcmdldCgpID8gJ3RydWUnIDogJ2ZhbHNlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYW51cEludGVyYWN0aXZlTW91c2VMaXN0ZW5lcnMoKSB7XG4gICAgICBnZXREb2N1bWVudCgpLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRlYm91bmNlZE9uTW91c2VNb3ZlKTtcbiAgICAgIG1vdXNlTW92ZUxpc3RlbmVycyA9IG1vdXNlTW92ZUxpc3RlbmVycy5maWx0ZXIoZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiBsaXN0ZW5lciAhPT0gZGVib3VuY2VkT25Nb3VzZU1vdmU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbkRvY3VtZW50UHJlc3MoZXZlbnQpIHtcbiAgICAgIC8vIE1vdmVkIGZpbmdlciB0byBzY3JvbGwgaW5zdGVhZCBvZiBhbiBpbnRlbnRpb25hbCB0YXAgb3V0c2lkZVxuICAgICAgaWYgKGN1cnJlbnRJbnB1dC5pc1RvdWNoKSB7XG4gICAgICAgIGlmIChkaWRUb3VjaE1vdmUgfHwgZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGFjdHVhbFRhcmdldCA9IGV2ZW50LmNvbXBvc2VkUGF0aCAmJiBldmVudC5jb21wb3NlZFBhdGgoKVswXSB8fCBldmVudC50YXJnZXQ7IC8vIENsaWNrZWQgb24gaW50ZXJhY3RpdmUgcG9wcGVyXG5cbiAgICAgIGlmIChpbnN0YW5jZS5wcm9wcy5pbnRlcmFjdGl2ZSAmJiBhY3R1YWxDb250YWlucyhwb3BwZXIsIGFjdHVhbFRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSAvLyBDbGlja2VkIG9uIHRoZSBldmVudCBsaXN0ZW5lcnMgdGFyZ2V0XG5cblxuICAgICAgaWYgKG5vcm1hbGl6ZVRvQXJyYXkoaW5zdGFuY2UucHJvcHMudHJpZ2dlclRhcmdldCB8fCByZWZlcmVuY2UpLnNvbWUoZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBhY3R1YWxDb250YWlucyhlbCwgYWN0dWFsVGFyZ2V0KTtcbiAgICAgIH0pKSB7XG4gICAgICAgIGlmIChjdXJyZW50SW5wdXQuaXNUb3VjaCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbnN0YW5jZS5zdGF0ZS5pc1Zpc2libGUgJiYgaW5zdGFuY2UucHJvcHMudHJpZ2dlci5pbmRleE9mKCdjbGljaycpID49IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGludm9rZUhvb2soJ29uQ2xpY2tPdXRzaWRlJywgW2luc3RhbmNlLCBldmVudF0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5zdGFuY2UucHJvcHMuaGlkZU9uQ2xpY2sgPT09IHRydWUpIHtcbiAgICAgICAgaW5zdGFuY2UuY2xlYXJEZWxheVRpbWVvdXRzKCk7XG4gICAgICAgIGluc3RhbmNlLmhpZGUoKTsgLy8gYG1vdXNlZG93bmAgZXZlbnQgaXMgZmlyZWQgcmlnaHQgYmVmb3JlIGBmb2N1c2AgaWYgcHJlc3NpbmcgdGhlXG4gICAgICAgIC8vIGN1cnJlbnRUYXJnZXQuIFRoaXMgbGV0cyBhIHRpcHB5IHdpdGggYGZvY3VzYCB0cmlnZ2VyIGtub3cgdGhhdCBpdFxuICAgICAgICAvLyBzaG91bGQgbm90IHNob3dcblxuICAgICAgICBkaWRIaWRlRHVlVG9Eb2N1bWVudE1vdXNlRG93biA9IHRydWU7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGRpZEhpZGVEdWVUb0RvY3VtZW50TW91c2VEb3duID0gZmFsc2U7XG4gICAgICAgIH0pOyAvLyBUaGUgbGlzdGVuZXIgZ2V0cyBhZGRlZCBpbiBgc2NoZWR1bGVTaG93KClgLCBidXQgdGhpcyBtYXkgYmUgaGlkaW5nIGl0XG4gICAgICAgIC8vIGJlZm9yZSBpdCBzaG93cywgYW5kIGhpZGUoKSdzIGVhcmx5IGJhaWwtb3V0IGJlaGF2aW9yIGNhbiBwcmV2ZW50IGl0XG4gICAgICAgIC8vIGZyb20gYmVpbmcgY2xlYW5lZCB1cFxuXG4gICAgICAgIGlmICghaW5zdGFuY2Uuc3RhdGUuaXNNb3VudGVkKSB7XG4gICAgICAgICAgcmVtb3ZlRG9jdW1lbnRQcmVzcygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Ub3VjaE1vdmUoKSB7XG4gICAgICBkaWRUb3VjaE1vdmUgPSB0cnVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uVG91Y2hTdGFydCgpIHtcbiAgICAgIGRpZFRvdWNoTW92ZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZERvY3VtZW50UHJlc3MoKSB7XG4gICAgICB2YXIgZG9jID0gZ2V0RG9jdW1lbnQoKTtcbiAgICAgIGRvYy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY3VtZW50UHJlc3MsIHRydWUpO1xuICAgICAgZG9jLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Eb2N1bWVudFByZXNzLCBUT1VDSF9PUFRJT05TKTtcbiAgICAgIGRvYy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25Ub3VjaFN0YXJ0LCBUT1VDSF9PUFRJT05TKTtcbiAgICAgIGRvYy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvblRvdWNoTW92ZSwgVE9VQ0hfT1BUSU9OUyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRG9jdW1lbnRQcmVzcygpIHtcbiAgICAgIHZhciBkb2MgPSBnZXREb2N1bWVudCgpO1xuICAgICAgZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jdW1lbnRQcmVzcywgdHJ1ZSk7XG4gICAgICBkb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvbkRvY3VtZW50UHJlc3MsIFRPVUNIX09QVElPTlMpO1xuICAgICAgZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBvblRvdWNoU3RhcnQsIFRPVUNIX09QVElPTlMpO1xuICAgICAgZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uVG91Y2hNb3ZlLCBUT1VDSF9PUFRJT05TKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvblRyYW5zaXRpb25lZE91dChkdXJhdGlvbiwgY2FsbGJhY2spIHtcbiAgICAgIG9uVHJhbnNpdGlvbkVuZChkdXJhdGlvbiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWluc3RhbmNlLnN0YXRlLmlzVmlzaWJsZSAmJiBwb3BwZXIucGFyZW50Tm9kZSAmJiBwb3BwZXIucGFyZW50Tm9kZS5jb250YWlucyhwb3BwZXIpKSB7XG4gICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25UcmFuc2l0aW9uZWRJbihkdXJhdGlvbiwgY2FsbGJhY2spIHtcbiAgICAgIG9uVHJhbnNpdGlvbkVuZChkdXJhdGlvbiwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uVHJhbnNpdGlvbkVuZChkdXJhdGlvbiwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBib3ggPSBnZXREZWZhdWx0VGVtcGxhdGVDaGlsZHJlbigpLmJveDtcblxuICAgICAgZnVuY3Rpb24gbGlzdGVuZXIoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gYm94KSB7XG4gICAgICAgICAgdXBkYXRlVHJhbnNpdGlvbkVuZExpc3RlbmVyKGJveCwgJ3JlbW92ZScsIGxpc3RlbmVyKTtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9IC8vIE1ha2UgY2FsbGJhY2sgc3luY2hyb25vdXMgaWYgZHVyYXRpb24gaXMgMFxuICAgICAgLy8gYHRyYW5zaXRpb25lbmRgIHdvbid0IGZpcmUgb3RoZXJ3aXNlXG5cblxuICAgICAgaWYgKGR1cmF0aW9uID09PSAwKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgfVxuXG4gICAgICB1cGRhdGVUcmFuc2l0aW9uRW5kTGlzdGVuZXIoYm94LCAncmVtb3ZlJywgY3VycmVudFRyYW5zaXRpb25FbmRMaXN0ZW5lcik7XG4gICAgICB1cGRhdGVUcmFuc2l0aW9uRW5kTGlzdGVuZXIoYm94LCAnYWRkJywgbGlzdGVuZXIpO1xuICAgICAgY3VycmVudFRyYW5zaXRpb25FbmRMaXN0ZW5lciA9IGxpc3RlbmVyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uKGV2ZW50VHlwZSwgaGFuZGxlciwgb3B0aW9ucykge1xuICAgICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgICAgICBvcHRpb25zID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciBub2RlcyA9IG5vcm1hbGl6ZVRvQXJyYXkoaW5zdGFuY2UucHJvcHMudHJpZ2dlclRhcmdldCB8fCByZWZlcmVuY2UpO1xuICAgICAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgICAgICAgbGlzdGVuZXJzLnB1c2goe1xuICAgICAgICAgIG5vZGU6IG5vZGUsXG4gICAgICAgICAgZXZlbnRUeXBlOiBldmVudFR5cGUsXG4gICAgICAgICAgaGFuZGxlcjogaGFuZGxlcixcbiAgICAgICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkTGlzdGVuZXJzKCkge1xuICAgICAgaWYgKGdldElzQ3VzdG9tVG91Y2hCZWhhdmlvcigpKSB7XG4gICAgICAgIG9uKCd0b3VjaHN0YXJ0Jywgb25UcmlnZ2VyLCB7XG4gICAgICAgICAgcGFzc2l2ZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgb24oJ3RvdWNoZW5kJywgb25Nb3VzZUxlYXZlLCB7XG4gICAgICAgICAgcGFzc2l2ZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgc3BsaXRCeVNwYWNlcyhpbnN0YW5jZS5wcm9wcy50cmlnZ2VyKS5mb3JFYWNoKGZ1bmN0aW9uIChldmVudFR5cGUpIHtcbiAgICAgICAgaWYgKGV2ZW50VHlwZSA9PT0gJ21hbnVhbCcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBvbihldmVudFR5cGUsIG9uVHJpZ2dlcik7XG5cbiAgICAgICAgc3dpdGNoIChldmVudFR5cGUpIHtcbiAgICAgICAgICBjYXNlICdtb3VzZWVudGVyJzpcbiAgICAgICAgICAgIG9uKCdtb3VzZWxlYXZlJywgb25Nb3VzZUxlYXZlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnZm9jdXMnOlxuICAgICAgICAgICAgb24oaXNJRTExID8gJ2ZvY3Vzb3V0JyA6ICdibHVyJywgb25CbHVyT3JGb2N1c091dCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJ2ZvY3VzaW4nOlxuICAgICAgICAgICAgb24oJ2ZvY3Vzb3V0Jywgb25CbHVyT3JGb2N1c091dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXJzKCkge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBfcmVmLm5vZGUsXG4gICAgICAgICAgICBldmVudFR5cGUgPSBfcmVmLmV2ZW50VHlwZSxcbiAgICAgICAgICAgIGhhbmRsZXIgPSBfcmVmLmhhbmRsZXIsXG4gICAgICAgICAgICBvcHRpb25zID0gX3JlZi5vcHRpb25zO1xuICAgICAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgICAgIH0pO1xuICAgICAgbGlzdGVuZXJzID0gW107XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25UcmlnZ2VyKGV2ZW50KSB7XG4gICAgICB2YXIgX2xhc3RUcmlnZ2VyRXZlbnQ7XG5cbiAgICAgIHZhciBzaG91bGRTY2hlZHVsZUNsaWNrSGlkZSA9IGZhbHNlO1xuXG4gICAgICBpZiAoIWluc3RhbmNlLnN0YXRlLmlzRW5hYmxlZCB8fCBpc0V2ZW50TGlzdGVuZXJTdG9wcGVkKGV2ZW50KSB8fCBkaWRIaWRlRHVlVG9Eb2N1bWVudE1vdXNlRG93bikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciB3YXNGb2N1c2VkID0gKChfbGFzdFRyaWdnZXJFdmVudCA9IGxhc3RUcmlnZ2VyRXZlbnQpID09IG51bGwgPyB2b2lkIDAgOiBfbGFzdFRyaWdnZXJFdmVudC50eXBlKSA9PT0gJ2ZvY3VzJztcbiAgICAgIGxhc3RUcmlnZ2VyRXZlbnQgPSBldmVudDtcbiAgICAgIGN1cnJlbnRUYXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgICAgaGFuZGxlQXJpYUV4cGFuZGVkQXR0cmlidXRlKCk7XG5cbiAgICAgIGlmICghaW5zdGFuY2Uuc3RhdGUuaXNWaXNpYmxlICYmIGlzTW91c2VFdmVudChldmVudCkpIHtcbiAgICAgICAgLy8gSWYgc2Nyb2xsaW5nLCBgbW91c2VlbnRlcmAgZXZlbnRzIGNhbiBiZSBmaXJlZCBpZiB0aGUgY3Vyc29yIGxhbmRzXG4gICAgICAgIC8vIG92ZXIgYSBuZXcgdGFyZ2V0LCBidXQgYG1vdXNlbW92ZWAgZXZlbnRzIGRvbid0IGdldCBmaXJlZC4gVGhpc1xuICAgICAgICAvLyBjYXVzZXMgaW50ZXJhY3RpdmUgdG9vbHRpcHMgdG8gZ2V0IHN0dWNrIG9wZW4gdW50aWwgdGhlIGN1cnNvciBpc1xuICAgICAgICAvLyBtb3ZlZFxuICAgICAgICBtb3VzZU1vdmVMaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgICByZXR1cm4gbGlzdGVuZXIoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICAgIH0gLy8gVG9nZ2xlIHNob3cvaGlkZSB3aGVuIGNsaWNraW5nIGNsaWNrLXRyaWdnZXJlZCB0b29sdGlwc1xuXG5cbiAgICAgIGlmIChldmVudC50eXBlID09PSAnY2xpY2snICYmIChpbnN0YW5jZS5wcm9wcy50cmlnZ2VyLmluZGV4T2YoJ21vdXNlZW50ZXInKSA8IDAgfHwgaXNWaXNpYmxlRnJvbUNsaWNrKSAmJiBpbnN0YW5jZS5wcm9wcy5oaWRlT25DbGljayAhPT0gZmFsc2UgJiYgaW5zdGFuY2Uuc3RhdGUuaXNWaXNpYmxlKSB7XG4gICAgICAgIHNob3VsZFNjaGVkdWxlQ2xpY2tIaWRlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNjaGVkdWxlU2hvdyhldmVudCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudC50eXBlID09PSAnY2xpY2snKSB7XG4gICAgICAgIGlzVmlzaWJsZUZyb21DbGljayA9ICFzaG91bGRTY2hlZHVsZUNsaWNrSGlkZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNob3VsZFNjaGVkdWxlQ2xpY2tIaWRlICYmICF3YXNGb2N1c2VkKSB7XG4gICAgICAgIHNjaGVkdWxlSGlkZShldmVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICB2YXIgaXNDdXJzb3JPdmVyUmVmZXJlbmNlT3JQb3BwZXIgPSBnZXRDdXJyZW50VGFyZ2V0KCkuY29udGFpbnModGFyZ2V0KSB8fCBwb3BwZXIuY29udGFpbnModGFyZ2V0KTtcblxuICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdtb3VzZW1vdmUnICYmIGlzQ3Vyc29yT3ZlclJlZmVyZW5jZU9yUG9wcGVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHBvcHBlclRyZWVEYXRhID0gZ2V0TmVzdGVkUG9wcGVyVHJlZSgpLmNvbmNhdChwb3BwZXIpLm1hcChmdW5jdGlvbiAocG9wcGVyKSB7XG4gICAgICAgIHZhciBfaW5zdGFuY2UkcG9wcGVySW5zdGE7XG5cbiAgICAgICAgdmFyIGluc3RhbmNlID0gcG9wcGVyLl90aXBweTtcbiAgICAgICAgdmFyIHN0YXRlID0gKF9pbnN0YW5jZSRwb3BwZXJJbnN0YSA9IGluc3RhbmNlLnBvcHBlckluc3RhbmNlKSA9PSBudWxsID8gdm9pZCAwIDogX2luc3RhbmNlJHBvcHBlckluc3RhLnN0YXRlO1xuXG4gICAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwb3BwZXJSZWN0OiBwb3BwZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgICBwb3BwZXJTdGF0ZTogc3RhdGUsXG4gICAgICAgICAgICBwcm9wczogcHJvcHNcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICAgIGlmIChpc0N1cnNvck91dHNpZGVJbnRlcmFjdGl2ZUJvcmRlcihwb3BwZXJUcmVlRGF0YSwgZXZlbnQpKSB7XG4gICAgICAgIGNsZWFudXBJbnRlcmFjdGl2ZU1vdXNlTGlzdGVuZXJzKCk7XG4gICAgICAgIHNjaGVkdWxlSGlkZShldmVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Nb3VzZUxlYXZlKGV2ZW50KSB7XG4gICAgICB2YXIgc2hvdWxkQmFpbCA9IGlzRXZlbnRMaXN0ZW5lclN0b3BwZWQoZXZlbnQpIHx8IGluc3RhbmNlLnByb3BzLnRyaWdnZXIuaW5kZXhPZignY2xpY2snKSA+PSAwICYmIGlzVmlzaWJsZUZyb21DbGljaztcblxuICAgICAgaWYgKHNob3VsZEJhaWwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5zdGFuY2UucHJvcHMuaW50ZXJhY3RpdmUpIHtcbiAgICAgICAgaW5zdGFuY2UuaGlkZVdpdGhJbnRlcmFjdGl2aXR5KGV2ZW50KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzY2hlZHVsZUhpZGUoZXZlbnQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uQmx1ck9yRm9jdXNPdXQoZXZlbnQpIHtcbiAgICAgIGlmIChpbnN0YW5jZS5wcm9wcy50cmlnZ2VyLmluZGV4T2YoJ2ZvY3VzaW4nKSA8IDAgJiYgZXZlbnQudGFyZ2V0ICE9PSBnZXRDdXJyZW50VGFyZ2V0KCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSAvLyBJZiBmb2N1cyB3YXMgbW92ZWQgdG8gd2l0aGluIHRoZSBwb3BwZXJcblxuXG4gICAgICBpZiAoaW5zdGFuY2UucHJvcHMuaW50ZXJhY3RpdmUgJiYgZXZlbnQucmVsYXRlZFRhcmdldCAmJiBwb3BwZXIuY29udGFpbnMoZXZlbnQucmVsYXRlZFRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzY2hlZHVsZUhpZGUoZXZlbnQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRXZlbnRMaXN0ZW5lclN0b3BwZWQoZXZlbnQpIHtcbiAgICAgIHJldHVybiBjdXJyZW50SW5wdXQuaXNUb3VjaCA/IGdldElzQ3VzdG9tVG91Y2hCZWhhdmlvcigpICE9PSBldmVudC50eXBlLmluZGV4T2YoJ3RvdWNoJykgPj0gMCA6IGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVBvcHBlckluc3RhbmNlKCkge1xuICAgICAgZGVzdHJveVBvcHBlckluc3RhbmNlKCk7XG4gICAgICB2YXIgX2luc3RhbmNlJHByb3BzMiA9IGluc3RhbmNlLnByb3BzLFxuICAgICAgICAgIHBvcHBlck9wdGlvbnMgPSBfaW5zdGFuY2UkcHJvcHMyLnBvcHBlck9wdGlvbnMsXG4gICAgICAgICAgcGxhY2VtZW50ID0gX2luc3RhbmNlJHByb3BzMi5wbGFjZW1lbnQsXG4gICAgICAgICAgb2Zmc2V0ID0gX2luc3RhbmNlJHByb3BzMi5vZmZzZXQsXG4gICAgICAgICAgZ2V0UmVmZXJlbmNlQ2xpZW50UmVjdCA9IF9pbnN0YW5jZSRwcm9wczIuZ2V0UmVmZXJlbmNlQ2xpZW50UmVjdCxcbiAgICAgICAgICBtb3ZlVHJhbnNpdGlvbiA9IF9pbnN0YW5jZSRwcm9wczIubW92ZVRyYW5zaXRpb247XG4gICAgICB2YXIgYXJyb3cgPSBnZXRJc0RlZmF1bHRSZW5kZXJGbigpID8gZ2V0Q2hpbGRyZW4ocG9wcGVyKS5hcnJvdyA6IG51bGw7XG4gICAgICB2YXIgY29tcHV0ZWRSZWZlcmVuY2UgPSBnZXRSZWZlcmVuY2VDbGllbnRSZWN0ID8ge1xuICAgICAgICBnZXRCb3VuZGluZ0NsaWVudFJlY3Q6IGdldFJlZmVyZW5jZUNsaWVudFJlY3QsXG4gICAgICAgIGNvbnRleHRFbGVtZW50OiBnZXRSZWZlcmVuY2VDbGllbnRSZWN0LmNvbnRleHRFbGVtZW50IHx8IGdldEN1cnJlbnRUYXJnZXQoKVxuICAgICAgfSA6IHJlZmVyZW5jZTtcbiAgICAgIHZhciB0aXBweU1vZGlmaWVyID0ge1xuICAgICAgICBuYW1lOiAnJCR0aXBweScsXG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIHBoYXNlOiAnYmVmb3JlV3JpdGUnLFxuICAgICAgICByZXF1aXJlczogWydjb21wdXRlU3R5bGVzJ10sXG4gICAgICAgIGZuOiBmdW5jdGlvbiBmbihfcmVmMikge1xuICAgICAgICAgIHZhciBzdGF0ZSA9IF9yZWYyLnN0YXRlO1xuXG4gICAgICAgICAgaWYgKGdldElzRGVmYXVsdFJlbmRlckZuKCkpIHtcbiAgICAgICAgICAgIHZhciBfZ2V0RGVmYXVsdFRlbXBsYXRlQ2ggPSBnZXREZWZhdWx0VGVtcGxhdGVDaGlsZHJlbigpLFxuICAgICAgICAgICAgICAgIGJveCA9IF9nZXREZWZhdWx0VGVtcGxhdGVDaC5ib3g7XG5cbiAgICAgICAgICAgIFsncGxhY2VtZW50JywgJ3JlZmVyZW5jZS1oaWRkZW4nLCAnZXNjYXBlZCddLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgICAgaWYgKGF0dHIgPT09ICdwbGFjZW1lbnQnKSB7XG4gICAgICAgICAgICAgICAgYm94LnNldEF0dHJpYnV0ZSgnZGF0YS1wbGFjZW1lbnQnLCBzdGF0ZS5wbGFjZW1lbnQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5hdHRyaWJ1dGVzLnBvcHBlcltcImRhdGEtcG9wcGVyLVwiICsgYXR0cl0pIHtcbiAgICAgICAgICAgICAgICAgIGJveC5zZXRBdHRyaWJ1dGUoXCJkYXRhLVwiICsgYXR0ciwgJycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBib3gucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1cIiArIGF0dHIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzdGF0ZS5hdHRyaWJ1dGVzLnBvcHBlciA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHZhciBtb2RpZmllcnMgPSBbe1xuICAgICAgICBuYW1lOiAnb2Zmc2V0JyxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIG9mZnNldDogb2Zmc2V0XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ3ByZXZlbnRPdmVyZmxvdycsXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICBwYWRkaW5nOiB7XG4gICAgICAgICAgICB0b3A6IDIsXG4gICAgICAgICAgICBib3R0b206IDIsXG4gICAgICAgICAgICBsZWZ0OiA1LFxuICAgICAgICAgICAgcmlnaHQ6IDVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ2ZsaXAnLFxuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgcGFkZGluZzogNVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdjb21wdXRlU3R5bGVzJyxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIGFkYXB0aXZlOiAhbW92ZVRyYW5zaXRpb25cbiAgICAgICAgfVxuICAgICAgfSwgdGlwcHlNb2RpZmllcl07XG5cbiAgICAgIGlmIChnZXRJc0RlZmF1bHRSZW5kZXJGbigpICYmIGFycm93KSB7XG4gICAgICAgIG1vZGlmaWVycy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiAnYXJyb3cnLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6IGFycm93LFxuICAgICAgICAgICAgcGFkZGluZzogM1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIG1vZGlmaWVycy5wdXNoLmFwcGx5KG1vZGlmaWVycywgKHBvcHBlck9wdGlvbnMgPT0gbnVsbCA/IHZvaWQgMCA6IHBvcHBlck9wdGlvbnMubW9kaWZpZXJzKSB8fCBbXSk7XG4gICAgICBpbnN0YW5jZS5wb3BwZXJJbnN0YW5jZSA9IGNvcmUuY3JlYXRlUG9wcGVyKGNvbXB1dGVkUmVmZXJlbmNlLCBwb3BwZXIsIE9iamVjdC5hc3NpZ24oe30sIHBvcHBlck9wdGlvbnMsIHtcbiAgICAgICAgcGxhY2VtZW50OiBwbGFjZW1lbnQsXG4gICAgICAgIG9uRmlyc3RVcGRhdGU6IG9uRmlyc3RVcGRhdGUsXG4gICAgICAgIG1vZGlmaWVyczogbW9kaWZpZXJzXG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzdHJveVBvcHBlckluc3RhbmNlKCkge1xuICAgICAgaWYgKGluc3RhbmNlLnBvcHBlckluc3RhbmNlKSB7XG4gICAgICAgIGluc3RhbmNlLnBvcHBlckluc3RhbmNlLmRlc3Ryb3koKTtcbiAgICAgICAgaW5zdGFuY2UucG9wcGVySW5zdGFuY2UgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgICAgdmFyIGFwcGVuZFRvID0gaW5zdGFuY2UucHJvcHMuYXBwZW5kVG87XG4gICAgICB2YXIgcGFyZW50Tm9kZTsgLy8gQnkgZGVmYXVsdCwgd2UnbGwgYXBwZW5kIHRoZSBwb3BwZXIgdG8gdGhlIHRyaWdnZXJUYXJnZXRzJ3MgcGFyZW50Tm9kZSBzb1xuICAgICAgLy8gaXQncyBkaXJlY3RseSBhZnRlciB0aGUgcmVmZXJlbmNlIGVsZW1lbnQgc28gdGhlIGVsZW1lbnRzIGluc2lkZSB0aGVcbiAgICAgIC8vIHRpcHB5IGNhbiBiZSB0YWJiZWQgdG9cbiAgICAgIC8vIElmIHRoZXJlIGFyZSBjbGlwcGluZyBpc3N1ZXMsIHRoZSB1c2VyIGNhbiBzcGVjaWZ5IGEgZGlmZmVyZW50IGFwcGVuZFRvXG4gICAgICAvLyBhbmQgZW5zdXJlIGZvY3VzIG1hbmFnZW1lbnQgaXMgaGFuZGxlZCBjb3JyZWN0bHkgbWFudWFsbHlcblxuICAgICAgdmFyIG5vZGUgPSBnZXRDdXJyZW50VGFyZ2V0KCk7XG5cbiAgICAgIGlmIChpbnN0YW5jZS5wcm9wcy5pbnRlcmFjdGl2ZSAmJiBhcHBlbmRUbyA9PT0gVElQUFlfREVGQVVMVF9BUFBFTkRfVE8gfHwgYXBwZW5kVG8gPT09ICdwYXJlbnQnKSB7XG4gICAgICAgIHBhcmVudE5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJlbnROb2RlID0gaW52b2tlV2l0aEFyZ3NPclJldHVybihhcHBlbmRUbywgW25vZGVdKTtcbiAgICAgIH0gLy8gVGhlIHBvcHBlciBlbGVtZW50IG5lZWRzIHRvIGV4aXN0IG9uIHRoZSBET00gYmVmb3JlIGl0cyBwb3NpdGlvbiBjYW4gYmVcbiAgICAgIC8vIHVwZGF0ZWQgYXMgUG9wcGVyIG5lZWRzIHRvIHJlYWQgaXRzIGRpbWVuc2lvbnNcblxuXG4gICAgICBpZiAoIXBhcmVudE5vZGUuY29udGFpbnMocG9wcGVyKSkge1xuICAgICAgICBwYXJlbnROb2RlLmFwcGVuZENoaWxkKHBvcHBlcik7XG4gICAgICB9XG5cbiAgICAgIGluc3RhbmNlLnN0YXRlLmlzTW91bnRlZCA9IHRydWU7XG4gICAgICBjcmVhdGVQb3BwZXJJbnN0YW5jZSgpO1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblxuICAgICAge1xuICAgICAgICAvLyBBY2Nlc3NpYmlsaXR5IGNoZWNrXG4gICAgICAgIHdhcm5XaGVuKGluc3RhbmNlLnByb3BzLmludGVyYWN0aXZlICYmIGFwcGVuZFRvID09PSBkZWZhdWx0UHJvcHMuYXBwZW5kVG8gJiYgbm9kZS5uZXh0RWxlbWVudFNpYmxpbmcgIT09IHBvcHBlciwgWydJbnRlcmFjdGl2ZSB0aXBweSBlbGVtZW50IG1heSBub3QgYmUgYWNjZXNzaWJsZSB2aWEga2V5Ym9hcmQnLCAnbmF2aWdhdGlvbiBiZWNhdXNlIGl0IGlzIG5vdCBkaXJlY3RseSBhZnRlciB0aGUgcmVmZXJlbmNlIGVsZW1lbnQnLCAnaW4gdGhlIERPTSBzb3VyY2Ugb3JkZXIuJywgJ1xcblxcbicsICdVc2luZyBhIHdyYXBwZXIgPGRpdj4gb3IgPHNwYW4+IHRhZyBhcm91bmQgdGhlIHJlZmVyZW5jZSBlbGVtZW50JywgJ3NvbHZlcyB0aGlzIGJ5IGNyZWF0aW5nIGEgbmV3IHBhcmVudE5vZGUgY29udGV4dC4nLCAnXFxuXFxuJywgJ1NwZWNpZnlpbmcgYGFwcGVuZFRvOiBkb2N1bWVudC5ib2R5YCBzaWxlbmNlcyB0aGlzIHdhcm5pbmcsIGJ1dCBpdCcsICdhc3N1bWVzIHlvdSBhcmUgdXNpbmcgYSBmb2N1cyBtYW5hZ2VtZW50IHNvbHV0aW9uIHRvIGhhbmRsZScsICdrZXlib2FyZCBuYXZpZ2F0aW9uLicsICdcXG5cXG4nLCAnU2VlOiBodHRwczovL2F0b21pa3MuZ2l0aHViLmlvL3RpcHB5anMvdjYvYWNjZXNzaWJpbGl0eS8jaW50ZXJhY3Rpdml0eSddLmpvaW4oJyAnKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TmVzdGVkUG9wcGVyVHJlZSgpIHtcbiAgICAgIHJldHVybiBhcnJheUZyb20ocG9wcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRpcHB5LXJvb3RdJykpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjaGVkdWxlU2hvdyhldmVudCkge1xuICAgICAgaW5zdGFuY2UuY2xlYXJEZWxheVRpbWVvdXRzKCk7XG5cbiAgICAgIGlmIChldmVudCkge1xuICAgICAgICBpbnZva2VIb29rKCdvblRyaWdnZXInLCBbaW5zdGFuY2UsIGV2ZW50XSk7XG4gICAgICB9XG5cbiAgICAgIGFkZERvY3VtZW50UHJlc3MoKTtcbiAgICAgIHZhciBkZWxheSA9IGdldERlbGF5KHRydWUpO1xuXG4gICAgICB2YXIgX2dldE5vcm1hbGl6ZWRUb3VjaFNlID0gZ2V0Tm9ybWFsaXplZFRvdWNoU2V0dGluZ3MoKSxcbiAgICAgICAgICB0b3VjaFZhbHVlID0gX2dldE5vcm1hbGl6ZWRUb3VjaFNlWzBdLFxuICAgICAgICAgIHRvdWNoRGVsYXkgPSBfZ2V0Tm9ybWFsaXplZFRvdWNoU2VbMV07XG5cbiAgICAgIGlmIChjdXJyZW50SW5wdXQuaXNUb3VjaCAmJiB0b3VjaFZhbHVlID09PSAnaG9sZCcgJiYgdG91Y2hEZWxheSkge1xuICAgICAgICBkZWxheSA9IHRvdWNoRGVsYXk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkZWxheSkge1xuICAgICAgICBzaG93VGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGluc3RhbmNlLnNob3coKTtcbiAgICAgICAgfSwgZGVsYXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5zdGFuY2Uuc2hvdygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjaGVkdWxlSGlkZShldmVudCkge1xuICAgICAgaW5zdGFuY2UuY2xlYXJEZWxheVRpbWVvdXRzKCk7XG4gICAgICBpbnZva2VIb29rKCdvblVudHJpZ2dlcicsIFtpbnN0YW5jZSwgZXZlbnRdKTtcblxuICAgICAgaWYgKCFpbnN0YW5jZS5zdGF0ZS5pc1Zpc2libGUpIHtcbiAgICAgICAgcmVtb3ZlRG9jdW1lbnRQcmVzcygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IC8vIEZvciBpbnRlcmFjdGl2ZSB0aXBwaWVzLCBzY2hlZHVsZUhpZGUgaXMgYWRkZWQgdG8gYSBkb2N1bWVudC5ib2R5IGhhbmRsZXJcbiAgICAgIC8vIGZyb20gb25Nb3VzZUxlYXZlIHNvIG11c3QgaW50ZXJjZXB0IHNjaGVkdWxlZCBoaWRlcyBmcm9tIG1vdXNlbW92ZS9sZWF2ZVxuICAgICAgLy8gZXZlbnRzIHdoZW4gdHJpZ2dlciBjb250YWlucyBtb3VzZWVudGVyIGFuZCBjbGljaywgYW5kIHRoZSB0aXAgaXNcbiAgICAgIC8vIGN1cnJlbnRseSBzaG93biBhcyBhIHJlc3VsdCBvZiBhIGNsaWNrLlxuXG5cbiAgICAgIGlmIChpbnN0YW5jZS5wcm9wcy50cmlnZ2VyLmluZGV4T2YoJ21vdXNlZW50ZXInKSA+PSAwICYmIGluc3RhbmNlLnByb3BzLnRyaWdnZXIuaW5kZXhPZignY2xpY2snKSA+PSAwICYmIFsnbW91c2VsZWF2ZScsICdtb3VzZW1vdmUnXS5pbmRleE9mKGV2ZW50LnR5cGUpID49IDAgJiYgaXNWaXNpYmxlRnJvbUNsaWNrKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGRlbGF5ID0gZ2V0RGVsYXkoZmFsc2UpO1xuXG4gICAgICBpZiAoZGVsYXkpIHtcbiAgICAgICAgaGlkZVRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoaW5zdGFuY2Uuc3RhdGUuaXNWaXNpYmxlKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS5oaWRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBkZWxheSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGaXhlcyBhIGB0cmFuc2l0aW9uZW5kYCBwcm9ibGVtIHdoZW4gaXQgZmlyZXMgMSBmcmFtZSB0b29cbiAgICAgICAgLy8gbGF0ZSBzb21ldGltZXMsIHdlIGRvbid0IHdhbnQgaGlkZSgpIHRvIGJlIGNhbGxlZC5cbiAgICAgICAgc2NoZWR1bGVIaWRlQW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGluc3RhbmNlLmhpZGUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyDwn5SRIFB1YmxpYyBtZXRob2RzXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblxuICAgIGZ1bmN0aW9uIGVuYWJsZSgpIHtcbiAgICAgIGluc3RhbmNlLnN0YXRlLmlzRW5hYmxlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlzYWJsZSgpIHtcbiAgICAgIC8vIERpc2FibGluZyB0aGUgaW5zdGFuY2Ugc2hvdWxkIGFsc28gaGlkZSBpdFxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2F0b21pa3MvdGlwcHkuanMtcmVhY3QvaXNzdWVzLzEwNlxuICAgICAgaW5zdGFuY2UuaGlkZSgpO1xuICAgICAgaW5zdGFuY2Uuc3RhdGUuaXNFbmFibGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJEZWxheVRpbWVvdXRzKCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHNob3dUaW1lb3V0KTtcbiAgICAgIGNsZWFyVGltZW91dChoaWRlVGltZW91dCk7XG4gICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShzY2hlZHVsZUhpZGVBbmltYXRpb25GcmFtZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0UHJvcHMocGFydGlhbFByb3BzKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAge1xuICAgICAgICB3YXJuV2hlbihpbnN0YW5jZS5zdGF0ZS5pc0Rlc3Ryb3llZCwgY3JlYXRlTWVtb3J5TGVha1dhcm5pbmcoJ3NldFByb3BzJykpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5zdGFuY2Uuc3RhdGUuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpbnZva2VIb29rKCdvbkJlZm9yZVVwZGF0ZScsIFtpbnN0YW5jZSwgcGFydGlhbFByb3BzXSk7XG4gICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgIHZhciBwcmV2UHJvcHMgPSBpbnN0YW5jZS5wcm9wcztcbiAgICAgIHZhciBuZXh0UHJvcHMgPSBldmFsdWF0ZVByb3BzKHJlZmVyZW5jZSwgT2JqZWN0LmFzc2lnbih7fSwgcHJldlByb3BzLCByZW1vdmVVbmRlZmluZWRQcm9wcyhwYXJ0aWFsUHJvcHMpLCB7XG4gICAgICAgIGlnbm9yZUF0dHJpYnV0ZXM6IHRydWVcbiAgICAgIH0pKTtcbiAgICAgIGluc3RhbmNlLnByb3BzID0gbmV4dFByb3BzO1xuICAgICAgYWRkTGlzdGVuZXJzKCk7XG5cbiAgICAgIGlmIChwcmV2UHJvcHMuaW50ZXJhY3RpdmVEZWJvdW5jZSAhPT0gbmV4dFByb3BzLmludGVyYWN0aXZlRGVib3VuY2UpIHtcbiAgICAgICAgY2xlYW51cEludGVyYWN0aXZlTW91c2VMaXN0ZW5lcnMoKTtcbiAgICAgICAgZGVib3VuY2VkT25Nb3VzZU1vdmUgPSBkZWJvdW5jZShvbk1vdXNlTW92ZSwgbmV4dFByb3BzLmludGVyYWN0aXZlRGVib3VuY2UpO1xuICAgICAgfSAvLyBFbnN1cmUgc3RhbGUgYXJpYS1leHBhbmRlZCBhdHRyaWJ1dGVzIGFyZSByZW1vdmVkXG5cblxuICAgICAgaWYgKHByZXZQcm9wcy50cmlnZ2VyVGFyZ2V0ICYmICFuZXh0UHJvcHMudHJpZ2dlclRhcmdldCkge1xuICAgICAgICBub3JtYWxpemVUb0FycmF5KHByZXZQcm9wcy50cmlnZ2VyVGFyZ2V0KS5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKG5leHRQcm9wcy50cmlnZ2VyVGFyZ2V0KSB7XG4gICAgICAgIHJlZmVyZW5jZS5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKTtcbiAgICAgIH1cblxuICAgICAgaGFuZGxlQXJpYUV4cGFuZGVkQXR0cmlidXRlKCk7XG4gICAgICBoYW5kbGVTdHlsZXMoKTtcblxuICAgICAgaWYgKG9uVXBkYXRlKSB7XG4gICAgICAgIG9uVXBkYXRlKHByZXZQcm9wcywgbmV4dFByb3BzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGluc3RhbmNlLnBvcHBlckluc3RhbmNlKSB7XG4gICAgICAgIGNyZWF0ZVBvcHBlckluc3RhbmNlKCk7IC8vIEZpeGVzIGFuIGlzc3VlIHdpdGggbmVzdGVkIHRpcHBpZXMgaWYgdGhleSBhcmUgYWxsIGdldHRpbmcgcmUtcmVuZGVyZWQsXG4gICAgICAgIC8vIGFuZCB0aGUgbmVzdGVkIG9uZXMgZ2V0IHJlLXJlbmRlcmVkIGZpcnN0LlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYXRvbWlrcy90aXBweWpzLXJlYWN0L2lzc3Vlcy8xNzdcbiAgICAgICAgLy8gVE9ETzogZmluZCBhIGNsZWFuZXIgLyBtb3JlIGVmZmljaWVudCBzb2x1dGlvbighKVxuXG4gICAgICAgIGdldE5lc3RlZFBvcHBlclRyZWUoKS5mb3JFYWNoKGZ1bmN0aW9uIChuZXN0ZWRQb3BwZXIpIHtcbiAgICAgICAgICAvLyBSZWFjdCAoYW5kIG90aGVyIFVJIGxpYnMgbGlrZWx5KSByZXF1aXJlcyBhIHJBRiB3cmFwcGVyIGFzIGl0IGZsdXNoZXNcbiAgICAgICAgICAvLyBpdHMgd29yayBpbiBvbmVcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobmVzdGVkUG9wcGVyLl90aXBweS5wb3BwZXJJbnN0YW5jZS5mb3JjZVVwZGF0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpbnZva2VIb29rKCdvbkFmdGVyVXBkYXRlJywgW2luc3RhbmNlLCBwYXJ0aWFsUHJvcHNdKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRDb250ZW50KGNvbnRlbnQpIHtcbiAgICAgIGluc3RhbmNlLnNldFByb3BzKHtcbiAgICAgICAgY29udGVudDogY29udGVudFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hvdygpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICB7XG4gICAgICAgIHdhcm5XaGVuKGluc3RhbmNlLnN0YXRlLmlzRGVzdHJveWVkLCBjcmVhdGVNZW1vcnlMZWFrV2FybmluZygnc2hvdycpKTtcbiAgICAgIH0gLy8gRWFybHkgYmFpbC1vdXRcblxuXG4gICAgICB2YXIgaXNBbHJlYWR5VmlzaWJsZSA9IGluc3RhbmNlLnN0YXRlLmlzVmlzaWJsZTtcbiAgICAgIHZhciBpc0Rlc3Ryb3llZCA9IGluc3RhbmNlLnN0YXRlLmlzRGVzdHJveWVkO1xuICAgICAgdmFyIGlzRGlzYWJsZWQgPSAhaW5zdGFuY2Uuc3RhdGUuaXNFbmFibGVkO1xuICAgICAgdmFyIGlzVG91Y2hBbmRUb3VjaERpc2FibGVkID0gY3VycmVudElucHV0LmlzVG91Y2ggJiYgIWluc3RhbmNlLnByb3BzLnRvdWNoO1xuICAgICAgdmFyIGR1cmF0aW9uID0gZ2V0VmFsdWVBdEluZGV4T3JSZXR1cm4oaW5zdGFuY2UucHJvcHMuZHVyYXRpb24sIDAsIGRlZmF1bHRQcm9wcy5kdXJhdGlvbik7XG5cbiAgICAgIGlmIChpc0FscmVhZHlWaXNpYmxlIHx8IGlzRGVzdHJveWVkIHx8IGlzRGlzYWJsZWQgfHwgaXNUb3VjaEFuZFRvdWNoRGlzYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSAvLyBOb3JtYWxpemUgYGRpc2FibGVkYCBiZWhhdmlvciBhY3Jvc3MgYnJvd3NlcnMuXG4gICAgICAvLyBGaXJlZm94IGFsbG93cyBldmVudHMgb24gZGlzYWJsZWQgZWxlbWVudHMsIGJ1dCBDaHJvbWUgZG9lc24ndC5cbiAgICAgIC8vIFVzaW5nIGEgd3JhcHBlciBlbGVtZW50IChpLmUuIDxzcGFuPikgaXMgcmVjb21tZW5kZWQuXG5cblxuICAgICAgaWYgKGdldEN1cnJlbnRUYXJnZXQoKS5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpbnZva2VIb29rKCdvblNob3cnLCBbaW5zdGFuY2VdLCBmYWxzZSk7XG5cbiAgICAgIGlmIChpbnN0YW5jZS5wcm9wcy5vblNob3coaW5zdGFuY2UpID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGluc3RhbmNlLnN0YXRlLmlzVmlzaWJsZSA9IHRydWU7XG5cbiAgICAgIGlmIChnZXRJc0RlZmF1bHRSZW5kZXJGbigpKSB7XG4gICAgICAgIHBvcHBlci5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgfVxuXG4gICAgICBoYW5kbGVTdHlsZXMoKTtcbiAgICAgIGFkZERvY3VtZW50UHJlc3MoKTtcblxuICAgICAgaWYgKCFpbnN0YW5jZS5zdGF0ZS5pc01vdW50ZWQpIHtcbiAgICAgICAgcG9wcGVyLnN0eWxlLnRyYW5zaXRpb24gPSAnbm9uZSc7XG4gICAgICB9IC8vIElmIGZsaXBwaW5nIHRvIHRoZSBvcHBvc2l0ZSBzaWRlIGFmdGVyIGhpZGluZyBhdCBsZWFzdCBvbmNlLCB0aGVcbiAgICAgIC8vIGFuaW1hdGlvbiB3aWxsIHVzZSB0aGUgd3JvbmcgcGxhY2VtZW50IHdpdGhvdXQgcmVzZXR0aW5nIHRoZSBkdXJhdGlvblxuXG5cbiAgICAgIGlmIChnZXRJc0RlZmF1bHRSZW5kZXJGbigpKSB7XG4gICAgICAgIHZhciBfZ2V0RGVmYXVsdFRlbXBsYXRlQ2gyID0gZ2V0RGVmYXVsdFRlbXBsYXRlQ2hpbGRyZW4oKSxcbiAgICAgICAgICAgIGJveCA9IF9nZXREZWZhdWx0VGVtcGxhdGVDaDIuYm94LFxuICAgICAgICAgICAgY29udGVudCA9IF9nZXREZWZhdWx0VGVtcGxhdGVDaDIuY29udGVudDtcblxuICAgICAgICBzZXRUcmFuc2l0aW9uRHVyYXRpb24oW2JveCwgY29udGVudF0sIDApO1xuICAgICAgfVxuXG4gICAgICBvbkZpcnN0VXBkYXRlID0gZnVuY3Rpb24gb25GaXJzdFVwZGF0ZSgpIHtcbiAgICAgICAgdmFyIF9pbnN0YW5jZSRwb3BwZXJJbnN0YTI7XG5cbiAgICAgICAgaWYgKCFpbnN0YW5jZS5zdGF0ZS5pc1Zpc2libGUgfHwgaWdub3JlT25GaXJzdFVwZGF0ZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlnbm9yZU9uRmlyc3RVcGRhdGUgPSB0cnVlOyAvLyByZWZsb3dcblxuICAgICAgICB2b2lkIHBvcHBlci5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIHBvcHBlci5zdHlsZS50cmFuc2l0aW9uID0gaW5zdGFuY2UucHJvcHMubW92ZVRyYW5zaXRpb247XG5cbiAgICAgICAgaWYgKGdldElzRGVmYXVsdFJlbmRlckZuKCkgJiYgaW5zdGFuY2UucHJvcHMuYW5pbWF0aW9uKSB7XG4gICAgICAgICAgdmFyIF9nZXREZWZhdWx0VGVtcGxhdGVDaDMgPSBnZXREZWZhdWx0VGVtcGxhdGVDaGlsZHJlbigpLFxuICAgICAgICAgICAgICBfYm94ID0gX2dldERlZmF1bHRUZW1wbGF0ZUNoMy5ib3gsXG4gICAgICAgICAgICAgIF9jb250ZW50ID0gX2dldERlZmF1bHRUZW1wbGF0ZUNoMy5jb250ZW50O1xuXG4gICAgICAgICAgc2V0VHJhbnNpdGlvbkR1cmF0aW9uKFtfYm94LCBfY29udGVudF0sIGR1cmF0aW9uKTtcbiAgICAgICAgICBzZXRWaXNpYmlsaXR5U3RhdGUoW19ib3gsIF9jb250ZW50XSwgJ3Zpc2libGUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhhbmRsZUFyaWFDb250ZW50QXR0cmlidXRlKCk7XG4gICAgICAgIGhhbmRsZUFyaWFFeHBhbmRlZEF0dHJpYnV0ZSgpO1xuICAgICAgICBwdXNoSWZVbmlxdWUobW91bnRlZEluc3RhbmNlcywgaW5zdGFuY2UpOyAvLyBjZXJ0YWluIG1vZGlmaWVycyAoZS5nLiBgbWF4U2l6ZWApIHJlcXVpcmUgYSBzZWNvbmQgdXBkYXRlIGFmdGVyIHRoZVxuICAgICAgICAvLyBwb3BwZXIgaGFzIGJlZW4gcG9zaXRpb25lZCBmb3IgdGhlIGZpcnN0IHRpbWVcblxuICAgICAgICAoX2luc3RhbmNlJHBvcHBlckluc3RhMiA9IGluc3RhbmNlLnBvcHBlckluc3RhbmNlKSA9PSBudWxsID8gdm9pZCAwIDogX2luc3RhbmNlJHBvcHBlckluc3RhMi5mb3JjZVVwZGF0ZSgpO1xuICAgICAgICBpbnZva2VIb29rKCdvbk1vdW50JywgW2luc3RhbmNlXSk7XG5cbiAgICAgICAgaWYgKGluc3RhbmNlLnByb3BzLmFuaW1hdGlvbiAmJiBnZXRJc0RlZmF1bHRSZW5kZXJGbigpKSB7XG4gICAgICAgICAgb25UcmFuc2l0aW9uZWRJbihkdXJhdGlvbiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaW5zdGFuY2Uuc3RhdGUuaXNTaG93biA9IHRydWU7XG4gICAgICAgICAgICBpbnZva2VIb29rKCdvblNob3duJywgW2luc3RhbmNlXSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIG1vdW50KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGlkZSgpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICB7XG4gICAgICAgIHdhcm5XaGVuKGluc3RhbmNlLnN0YXRlLmlzRGVzdHJveWVkLCBjcmVhdGVNZW1vcnlMZWFrV2FybmluZygnaGlkZScpKTtcbiAgICAgIH0gLy8gRWFybHkgYmFpbC1vdXRcblxuXG4gICAgICB2YXIgaXNBbHJlYWR5SGlkZGVuID0gIWluc3RhbmNlLnN0YXRlLmlzVmlzaWJsZTtcbiAgICAgIHZhciBpc0Rlc3Ryb3llZCA9IGluc3RhbmNlLnN0YXRlLmlzRGVzdHJveWVkO1xuICAgICAgdmFyIGlzRGlzYWJsZWQgPSAhaW5zdGFuY2Uuc3RhdGUuaXNFbmFibGVkO1xuICAgICAgdmFyIGR1cmF0aW9uID0gZ2V0VmFsdWVBdEluZGV4T3JSZXR1cm4oaW5zdGFuY2UucHJvcHMuZHVyYXRpb24sIDEsIGRlZmF1bHRQcm9wcy5kdXJhdGlvbik7XG5cbiAgICAgIGlmIChpc0FscmVhZHlIaWRkZW4gfHwgaXNEZXN0cm95ZWQgfHwgaXNEaXNhYmxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGludm9rZUhvb2soJ29uSGlkZScsIFtpbnN0YW5jZV0sIGZhbHNlKTtcblxuICAgICAgaWYgKGluc3RhbmNlLnByb3BzLm9uSGlkZShpbnN0YW5jZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaW5zdGFuY2Uuc3RhdGUuaXNWaXNpYmxlID0gZmFsc2U7XG4gICAgICBpbnN0YW5jZS5zdGF0ZS5pc1Nob3duID0gZmFsc2U7XG4gICAgICBpZ25vcmVPbkZpcnN0VXBkYXRlID0gZmFsc2U7XG4gICAgICBpc1Zpc2libGVGcm9tQ2xpY2sgPSBmYWxzZTtcblxuICAgICAgaWYgKGdldElzRGVmYXVsdFJlbmRlckZuKCkpIHtcbiAgICAgICAgcG9wcGVyLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgIH1cblxuICAgICAgY2xlYW51cEludGVyYWN0aXZlTW91c2VMaXN0ZW5lcnMoKTtcbiAgICAgIHJlbW92ZURvY3VtZW50UHJlc3MoKTtcbiAgICAgIGhhbmRsZVN0eWxlcyh0cnVlKTtcblxuICAgICAgaWYgKGdldElzRGVmYXVsdFJlbmRlckZuKCkpIHtcbiAgICAgICAgdmFyIF9nZXREZWZhdWx0VGVtcGxhdGVDaDQgPSBnZXREZWZhdWx0VGVtcGxhdGVDaGlsZHJlbigpLFxuICAgICAgICAgICAgYm94ID0gX2dldERlZmF1bHRUZW1wbGF0ZUNoNC5ib3gsXG4gICAgICAgICAgICBjb250ZW50ID0gX2dldERlZmF1bHRUZW1wbGF0ZUNoNC5jb250ZW50O1xuXG4gICAgICAgIGlmIChpbnN0YW5jZS5wcm9wcy5hbmltYXRpb24pIHtcbiAgICAgICAgICBzZXRUcmFuc2l0aW9uRHVyYXRpb24oW2JveCwgY29udGVudF0sIGR1cmF0aW9uKTtcbiAgICAgICAgICBzZXRWaXNpYmlsaXR5U3RhdGUoW2JveCwgY29udGVudF0sICdoaWRkZW4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBoYW5kbGVBcmlhQ29udGVudEF0dHJpYnV0ZSgpO1xuICAgICAgaGFuZGxlQXJpYUV4cGFuZGVkQXR0cmlidXRlKCk7XG5cbiAgICAgIGlmIChpbnN0YW5jZS5wcm9wcy5hbmltYXRpb24pIHtcbiAgICAgICAgaWYgKGdldElzRGVmYXVsdFJlbmRlckZuKCkpIHtcbiAgICAgICAgICBvblRyYW5zaXRpb25lZE91dChkdXJhdGlvbiwgaW5zdGFuY2UudW5tb3VudCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluc3RhbmNlLnVubW91bnQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoaWRlV2l0aEludGVyYWN0aXZpdHkoZXZlbnQpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICB7XG4gICAgICAgIHdhcm5XaGVuKGluc3RhbmNlLnN0YXRlLmlzRGVzdHJveWVkLCBjcmVhdGVNZW1vcnlMZWFrV2FybmluZygnaGlkZVdpdGhJbnRlcmFjdGl2aXR5JykpO1xuICAgICAgfVxuXG4gICAgICBnZXREb2N1bWVudCgpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRlYm91bmNlZE9uTW91c2VNb3ZlKTtcbiAgICAgIHB1c2hJZlVuaXF1ZShtb3VzZU1vdmVMaXN0ZW5lcnMsIGRlYm91bmNlZE9uTW91c2VNb3ZlKTtcbiAgICAgIGRlYm91bmNlZE9uTW91c2VNb3ZlKGV2ZW50KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1bm1vdW50KCkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIHtcbiAgICAgICAgd2FybldoZW4oaW5zdGFuY2Uuc3RhdGUuaXNEZXN0cm95ZWQsIGNyZWF0ZU1lbW9yeUxlYWtXYXJuaW5nKCd1bm1vdW50JykpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5zdGFuY2Uuc3RhdGUuaXNWaXNpYmxlKSB7XG4gICAgICAgIGluc3RhbmNlLmhpZGUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpbnN0YW5jZS5zdGF0ZS5pc01vdW50ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBkZXN0cm95UG9wcGVySW5zdGFuY2UoKTsgLy8gSWYgYSBwb3BwZXIgaXMgbm90IGludGVyYWN0aXZlLCBpdCB3aWxsIGJlIGFwcGVuZGVkIG91dHNpZGUgdGhlIHBvcHBlclxuICAgICAgLy8gdHJlZSBieSBkZWZhdWx0LiBUaGlzIHNlZW1zIG1haW5seSBmb3IgaW50ZXJhY3RpdmUgdGlwcGllcywgYnV0IHdlIHNob3VsZFxuICAgICAgLy8gZmluZCBhIHdvcmthcm91bmQgaWYgcG9zc2libGVcblxuICAgICAgZ2V0TmVzdGVkUG9wcGVyVHJlZSgpLmZvckVhY2goZnVuY3Rpb24gKG5lc3RlZFBvcHBlcikge1xuICAgICAgICBuZXN0ZWRQb3BwZXIuX3RpcHB5LnVubW91bnQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocG9wcGVyLnBhcmVudE5vZGUpIHtcbiAgICAgICAgcG9wcGVyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocG9wcGVyKTtcbiAgICAgIH1cblxuICAgICAgbW91bnRlZEluc3RhbmNlcyA9IG1vdW50ZWRJbnN0YW5jZXMuZmlsdGVyKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIHJldHVybiBpICE9PSBpbnN0YW5jZTtcbiAgICAgIH0pO1xuICAgICAgaW5zdGFuY2Uuc3RhdGUuaXNNb3VudGVkID0gZmFsc2U7XG4gICAgICBpbnZva2VIb29rKCdvbkhpZGRlbicsIFtpbnN0YW5jZV0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAge1xuICAgICAgICB3YXJuV2hlbihpbnN0YW5jZS5zdGF0ZS5pc0Rlc3Ryb3llZCwgY3JlYXRlTWVtb3J5TGVha1dhcm5pbmcoJ2Rlc3Ryb3knKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbnN0YW5jZS5zdGF0ZS5pc0Rlc3Ryb3llZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGluc3RhbmNlLmNsZWFyRGVsYXlUaW1lb3V0cygpO1xuICAgICAgaW5zdGFuY2UudW5tb3VudCgpO1xuICAgICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICBkZWxldGUgcmVmZXJlbmNlLl90aXBweTtcbiAgICAgIGluc3RhbmNlLnN0YXRlLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICAgIGludm9rZUhvb2soJ29uRGVzdHJveScsIFtpbnN0YW5jZV0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRpcHB5KHRhcmdldHMsIG9wdGlvbmFsUHJvcHMpIHtcbiAgICBpZiAob3B0aW9uYWxQcm9wcyA9PT0gdm9pZCAwKSB7XG4gICAgICBvcHRpb25hbFByb3BzID0ge307XG4gICAgfVxuXG4gICAgdmFyIHBsdWdpbnMgPSBkZWZhdWx0UHJvcHMucGx1Z2lucy5jb25jYXQob3B0aW9uYWxQcm9wcy5wbHVnaW5zIHx8IFtdKTtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXG4gICAge1xuICAgICAgdmFsaWRhdGVUYXJnZXRzKHRhcmdldHMpO1xuICAgICAgdmFsaWRhdGVQcm9wcyhvcHRpb25hbFByb3BzLCBwbHVnaW5zKTtcbiAgICB9XG5cbiAgICBiaW5kR2xvYmFsRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICB2YXIgcGFzc2VkUHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25hbFByb3BzLCB7XG4gICAgICBwbHVnaW5zOiBwbHVnaW5zXG4gICAgfSk7XG4gICAgdmFyIGVsZW1lbnRzID0gZ2V0QXJyYXlPZkVsZW1lbnRzKHRhcmdldHMpO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cbiAgICB7XG4gICAgICB2YXIgaXNTaW5nbGVDb250ZW50RWxlbWVudCA9IGlzRWxlbWVudChwYXNzZWRQcm9wcy5jb250ZW50KTtcbiAgICAgIHZhciBpc01vcmVUaGFuT25lUmVmZXJlbmNlRWxlbWVudCA9IGVsZW1lbnRzLmxlbmd0aCA+IDE7XG4gICAgICB3YXJuV2hlbihpc1NpbmdsZUNvbnRlbnRFbGVtZW50ICYmIGlzTW9yZVRoYW5PbmVSZWZlcmVuY2VFbGVtZW50LCBbJ3RpcHB5KCkgd2FzIHBhc3NlZCBhbiBFbGVtZW50IGFzIHRoZSBgY29udGVudGAgcHJvcCwgYnV0IG1vcmUgdGhhbicsICdvbmUgdGlwcHkgaW5zdGFuY2Ugd2FzIGNyZWF0ZWQgYnkgdGhpcyBpbnZvY2F0aW9uLiBUaGlzIG1lYW5zIHRoZScsICdjb250ZW50IGVsZW1lbnQgd2lsbCBvbmx5IGJlIGFwcGVuZGVkIHRvIHRoZSBsYXN0IHRpcHB5IGluc3RhbmNlLicsICdcXG5cXG4nLCAnSW5zdGVhZCwgcGFzcyB0aGUgLmlubmVySFRNTCBvZiB0aGUgZWxlbWVudCwgb3IgdXNlIGEgZnVuY3Rpb24gdGhhdCcsICdyZXR1cm5zIGEgY2xvbmVkIHZlcnNpb24gb2YgdGhlIGVsZW1lbnQgaW5zdGVhZC4nLCAnXFxuXFxuJywgJzEpIGNvbnRlbnQ6IGVsZW1lbnQuaW5uZXJIVE1MXFxuJywgJzIpIGNvbnRlbnQ6ICgpID0+IGVsZW1lbnQuY2xvbmVOb2RlKHRydWUpJ10uam9pbignICcpKTtcbiAgICB9XG5cbiAgICB2YXIgaW5zdGFuY2VzID0gZWxlbWVudHMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHJlZmVyZW5jZSkge1xuICAgICAgdmFyIGluc3RhbmNlID0gcmVmZXJlbmNlICYmIGNyZWF0ZVRpcHB5KHJlZmVyZW5jZSwgcGFzc2VkUHJvcHMpO1xuXG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgYWNjLnB1c2goaW5zdGFuY2UpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIFtdKTtcbiAgICByZXR1cm4gaXNFbGVtZW50KHRhcmdldHMpID8gaW5zdGFuY2VzWzBdIDogaW5zdGFuY2VzO1xuICB9XG5cbiAgdGlwcHkuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuICB0aXBweS5zZXREZWZhdWx0UHJvcHMgPSBzZXREZWZhdWx0UHJvcHM7XG4gIHRpcHB5LmN1cnJlbnRJbnB1dCA9IGN1cnJlbnRJbnB1dDtcbiAgdmFyIGhpZGVBbGwgPSBmdW5jdGlvbiBoaWRlQWxsKF90ZW1wKSB7XG4gICAgdmFyIF9yZWYgPSBfdGVtcCA9PT0gdm9pZCAwID8ge30gOiBfdGVtcCxcbiAgICAgICAgZXhjbHVkZWRSZWZlcmVuY2VPckluc3RhbmNlID0gX3JlZi5leGNsdWRlLFxuICAgICAgICBkdXJhdGlvbiA9IF9yZWYuZHVyYXRpb247XG5cbiAgICBtb3VudGVkSW5zdGFuY2VzLmZvckVhY2goZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICB2YXIgaXNFeGNsdWRlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoZXhjbHVkZWRSZWZlcmVuY2VPckluc3RhbmNlKSB7XG4gICAgICAgIGlzRXhjbHVkZWQgPSBpc1JlZmVyZW5jZUVsZW1lbnQoZXhjbHVkZWRSZWZlcmVuY2VPckluc3RhbmNlKSA/IGluc3RhbmNlLnJlZmVyZW5jZSA9PT0gZXhjbHVkZWRSZWZlcmVuY2VPckluc3RhbmNlIDogaW5zdGFuY2UucG9wcGVyID09PSBleGNsdWRlZFJlZmVyZW5jZU9ySW5zdGFuY2UucG9wcGVyO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzRXhjbHVkZWQpIHtcbiAgICAgICAgdmFyIG9yaWdpbmFsRHVyYXRpb24gPSBpbnN0YW5jZS5wcm9wcy5kdXJhdGlvbjtcbiAgICAgICAgaW5zdGFuY2Uuc2V0UHJvcHMoe1xuICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvblxuICAgICAgICB9KTtcbiAgICAgICAgaW5zdGFuY2UuaGlkZSgpO1xuXG4gICAgICAgIGlmICghaW5zdGFuY2Uuc3RhdGUuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICBpbnN0YW5jZS5zZXRQcm9wcyh7XG4gICAgICAgICAgICBkdXJhdGlvbjogb3JpZ2luYWxEdXJhdGlvblxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gZXZlcnkgdGltZSB0aGUgcG9wcGVyIGlzIGRlc3Ryb3llZCAoaS5lLiBhIG5ldyB0YXJnZXQpLCByZW1vdmluZyB0aGUgc3R5bGVzXG4gIC8vIGFuZCBjYXVzaW5nIHRyYW5zaXRpb25zIHRvIGJyZWFrIGZvciBzaW5nbGV0b25zIHdoZW4gdGhlIGNvbnNvbGUgaXMgb3BlbiwgYnV0XG4gIC8vIG1vc3Qgbm90YWJseSBmb3Igbm9uLXRyYW5zZm9ybSBzdHlsZXMgYmVpbmcgdXNlZCwgYGdwdUFjY2VsZXJhdGlvbjogZmFsc2VgLlxuXG4gIHZhciBhcHBseVN0eWxlc01vZGlmaWVyID0gT2JqZWN0LmFzc2lnbih7fSwgY29yZS5hcHBseVN0eWxlcywge1xuICAgIGVmZmVjdDogZnVuY3Rpb24gZWZmZWN0KF9yZWYpIHtcbiAgICAgIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGU7XG4gICAgICB2YXIgaW5pdGlhbFN0eWxlcyA9IHtcbiAgICAgICAgcG9wcGVyOiB7XG4gICAgICAgICAgcG9zaXRpb246IHN0YXRlLm9wdGlvbnMuc3RyYXRlZ3ksXG4gICAgICAgICAgbGVmdDogJzAnLFxuICAgICAgICAgIHRvcDogJzAnLFxuICAgICAgICAgIG1hcmdpbjogJzAnXG4gICAgICAgIH0sXG4gICAgICAgIGFycm93OiB7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICAgICAgfSxcbiAgICAgICAgcmVmZXJlbmNlOiB7fVxuICAgICAgfTtcbiAgICAgIE9iamVjdC5hc3NpZ24oc3RhdGUuZWxlbWVudHMucG9wcGVyLnN0eWxlLCBpbml0aWFsU3R5bGVzLnBvcHBlcik7XG4gICAgICBzdGF0ZS5zdHlsZXMgPSBpbml0aWFsU3R5bGVzO1xuXG4gICAgICBpZiAoc3RhdGUuZWxlbWVudHMuYXJyb3cpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihzdGF0ZS5lbGVtZW50cy5hcnJvdy5zdHlsZSwgaW5pdGlhbFN0eWxlcy5hcnJvdyk7XG4gICAgICB9IC8vIGludGVudGlvbmFsbHkgcmV0dXJuIG5vIGNsZWFudXAgZnVuY3Rpb25cbiAgICAgIC8vIHJldHVybiAoKSA9PiB7IC4uLiB9XG5cbiAgICB9XG4gIH0pO1xuXG4gIHZhciBjcmVhdGVTaW5nbGV0b24gPSBmdW5jdGlvbiBjcmVhdGVTaW5nbGV0b24odGlwcHlJbnN0YW5jZXMsIG9wdGlvbmFsUHJvcHMpIHtcbiAgICB2YXIgX29wdGlvbmFsUHJvcHMkcG9wcGVyO1xuXG4gICAgaWYgKG9wdGlvbmFsUHJvcHMgPT09IHZvaWQgMCkge1xuICAgICAgb3B0aW9uYWxQcm9wcyA9IHt9O1xuICAgIH1cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAge1xuICAgICAgZXJyb3JXaGVuKCFBcnJheS5pc0FycmF5KHRpcHB5SW5zdGFuY2VzKSwgWydUaGUgZmlyc3QgYXJndW1lbnQgcGFzc2VkIHRvIGNyZWF0ZVNpbmdsZXRvbigpIG11c3QgYmUgYW4gYXJyYXkgb2YnLCAndGlwcHkgaW5zdGFuY2VzLiBUaGUgcGFzc2VkIHZhbHVlIHdhcycsIFN0cmluZyh0aXBweUluc3RhbmNlcyldLmpvaW4oJyAnKSk7XG4gICAgfVxuXG4gICAgdmFyIGluZGl2aWR1YWxJbnN0YW5jZXMgPSB0aXBweUluc3RhbmNlcztcbiAgICB2YXIgcmVmZXJlbmNlcyA9IFtdO1xuICAgIHZhciB0cmlnZ2VyVGFyZ2V0cyA9IFtdO1xuICAgIHZhciBjdXJyZW50VGFyZ2V0O1xuICAgIHZhciBvdmVycmlkZXMgPSBvcHRpb25hbFByb3BzLm92ZXJyaWRlcztcbiAgICB2YXIgaW50ZXJjZXB0U2V0UHJvcHNDbGVhbnVwcyA9IFtdO1xuICAgIHZhciBzaG93bk9uQ3JlYXRlID0gZmFsc2U7XG5cbiAgICBmdW5jdGlvbiBzZXRUcmlnZ2VyVGFyZ2V0cygpIHtcbiAgICAgIHRyaWdnZXJUYXJnZXRzID0gaW5kaXZpZHVhbEluc3RhbmNlcy5tYXAoZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgIHJldHVybiBub3JtYWxpemVUb0FycmF5KGluc3RhbmNlLnByb3BzLnRyaWdnZXJUYXJnZXQgfHwgaW5zdGFuY2UucmVmZXJlbmNlKTtcbiAgICAgIH0pLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBpdGVtKSB7XG4gICAgICAgIHJldHVybiBhY2MuY29uY2F0KGl0ZW0pO1xuICAgICAgfSwgW10pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFJlZmVyZW5jZXMoKSB7XG4gICAgICByZWZlcmVuY2VzID0gaW5kaXZpZHVhbEluc3RhbmNlcy5tYXAoZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS5yZWZlcmVuY2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbmFibGVJbnN0YW5jZXMoaXNFbmFibGVkKSB7XG4gICAgICBpbmRpdmlkdWFsSW5zdGFuY2VzLmZvckVhY2goZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgIGlmIChpc0VuYWJsZWQpIHtcbiAgICAgICAgICBpbnN0YW5jZS5lbmFibGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbnN0YW5jZS5kaXNhYmxlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGludGVyY2VwdFNldFByb3BzKHNpbmdsZXRvbikge1xuICAgICAgcmV0dXJuIGluZGl2aWR1YWxJbnN0YW5jZXMubWFwKGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICB2YXIgb3JpZ2luYWxTZXRQcm9wcyA9IGluc3RhbmNlLnNldFByb3BzO1xuXG4gICAgICAgIGluc3RhbmNlLnNldFByb3BzID0gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgICAgICAgb3JpZ2luYWxTZXRQcm9wcyhwcm9wcyk7XG5cbiAgICAgICAgICBpZiAoaW5zdGFuY2UucmVmZXJlbmNlID09PSBjdXJyZW50VGFyZ2V0KSB7XG4gICAgICAgICAgICBzaW5nbGV0b24uc2V0UHJvcHMocHJvcHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGluc3RhbmNlLnNldFByb3BzID0gb3JpZ2luYWxTZXRQcm9wcztcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH0gLy8gaGF2ZSB0byBwYXNzIHNpbmdsZXRvbiwgYXMgaXQgbWF5YmUgdW5kZWZpbmVkIG9uIGZpcnN0IGNhbGxcblxuXG4gICAgZnVuY3Rpb24gcHJlcGFyZUluc3RhbmNlKHNpbmdsZXRvbiwgdGFyZ2V0KSB7XG4gICAgICB2YXIgaW5kZXggPSB0cmlnZ2VyVGFyZ2V0cy5pbmRleE9mKHRhcmdldCk7IC8vIGJhaWwtb3V0XG5cbiAgICAgIGlmICh0YXJnZXQgPT09IGN1cnJlbnRUYXJnZXQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjdXJyZW50VGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgdmFyIG92ZXJyaWRlUHJvcHMgPSAob3ZlcnJpZGVzIHx8IFtdKS5jb25jYXQoJ2NvbnRlbnQnKS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcHJvcCkge1xuICAgICAgICBhY2NbcHJvcF0gPSBpbmRpdmlkdWFsSW5zdGFuY2VzW2luZGV4XS5wcm9wc1twcm9wXTtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9KTtcbiAgICAgIHNpbmdsZXRvbi5zZXRQcm9wcyhPYmplY3QuYXNzaWduKHt9LCBvdmVycmlkZVByb3BzLCB7XG4gICAgICAgIGdldFJlZmVyZW5jZUNsaWVudFJlY3Q6IHR5cGVvZiBvdmVycmlkZVByb3BzLmdldFJlZmVyZW5jZUNsaWVudFJlY3QgPT09ICdmdW5jdGlvbicgPyBvdmVycmlkZVByb3BzLmdldFJlZmVyZW5jZUNsaWVudFJlY3QgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIF9yZWZlcmVuY2VzJGluZGV4O1xuXG4gICAgICAgICAgcmV0dXJuIChfcmVmZXJlbmNlcyRpbmRleCA9IHJlZmVyZW5jZXNbaW5kZXhdKSA9PSBudWxsID8gdm9pZCAwIDogX3JlZmVyZW5jZXMkaW5kZXguZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBlbmFibGVJbnN0YW5jZXMoZmFsc2UpO1xuICAgIHNldFJlZmVyZW5jZXMoKTtcbiAgICBzZXRUcmlnZ2VyVGFyZ2V0cygpO1xuICAgIHZhciBwbHVnaW4gPSB7XG4gICAgICBmbjogZnVuY3Rpb24gZm4oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgb25EZXN0cm95OiBmdW5jdGlvbiBvbkRlc3Ryb3koKSB7XG4gICAgICAgICAgICBlbmFibGVJbnN0YW5jZXModHJ1ZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBvbkhpZGRlbjogZnVuY3Rpb24gb25IaWRkZW4oKSB7XG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uQ2xpY2tPdXRzaWRlOiBmdW5jdGlvbiBvbkNsaWNrT3V0c2lkZShpbnN0YW5jZSkge1xuICAgICAgICAgICAgaWYgKGluc3RhbmNlLnByb3BzLnNob3dPbkNyZWF0ZSAmJiAhc2hvd25PbkNyZWF0ZSkge1xuICAgICAgICAgICAgICBzaG93bk9uQ3JlYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgY3VycmVudFRhcmdldCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBvblNob3c6IGZ1bmN0aW9uIG9uU2hvdyhpbnN0YW5jZSkge1xuICAgICAgICAgICAgaWYgKGluc3RhbmNlLnByb3BzLnNob3dPbkNyZWF0ZSAmJiAhc2hvd25PbkNyZWF0ZSkge1xuICAgICAgICAgICAgICBzaG93bk9uQ3JlYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgcHJlcGFyZUluc3RhbmNlKGluc3RhbmNlLCByZWZlcmVuY2VzWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uVHJpZ2dlcjogZnVuY3Rpb24gb25UcmlnZ2VyKGluc3RhbmNlLCBldmVudCkge1xuICAgICAgICAgICAgcHJlcGFyZUluc3RhbmNlKGluc3RhbmNlLCBldmVudC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgc2luZ2xldG9uID0gdGlwcHkoZGl2KCksIE9iamVjdC5hc3NpZ24oe30sIHJlbW92ZVByb3BlcnRpZXMob3B0aW9uYWxQcm9wcywgWydvdmVycmlkZXMnXSksIHtcbiAgICAgIHBsdWdpbnM6IFtwbHVnaW5dLmNvbmNhdChvcHRpb25hbFByb3BzLnBsdWdpbnMgfHwgW10pLFxuICAgICAgdHJpZ2dlclRhcmdldDogdHJpZ2dlclRhcmdldHMsXG4gICAgICBwb3BwZXJPcHRpb25zOiBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25hbFByb3BzLnBvcHBlck9wdGlvbnMsIHtcbiAgICAgICAgbW9kaWZpZXJzOiBbXS5jb25jYXQoKChfb3B0aW9uYWxQcm9wcyRwb3BwZXIgPSBvcHRpb25hbFByb3BzLnBvcHBlck9wdGlvbnMpID09IG51bGwgPyB2b2lkIDAgOiBfb3B0aW9uYWxQcm9wcyRwb3BwZXIubW9kaWZpZXJzKSB8fCBbXSwgW2FwcGx5U3R5bGVzTW9kaWZpZXJdKVxuICAgICAgfSlcbiAgICB9KSk7XG4gICAgdmFyIG9yaWdpbmFsU2hvdyA9IHNpbmdsZXRvbi5zaG93O1xuXG4gICAgc2luZ2xldG9uLnNob3cgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICBvcmlnaW5hbFNob3coKTsgLy8gZmlyc3QgdGltZSwgc2hvd09uQ3JlYXRlIG9yIHByb2dyYW1tYXRpYyBjYWxsIHdpdGggbm8gcGFyYW1zXG4gICAgICAvLyBkZWZhdWx0IHRvIHNob3dpbmcgZmlyc3QgaW5zdGFuY2VcblxuICAgICAgaWYgKCFjdXJyZW50VGFyZ2V0ICYmIHRhcmdldCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBwcmVwYXJlSW5zdGFuY2Uoc2luZ2xldG9uLCByZWZlcmVuY2VzWzBdKTtcbiAgICAgIH0gLy8gdHJpZ2dlcmVkIGZyb20gZXZlbnQgKGRvIG5vdGhpbmcgYXMgcHJlcGFyZUluc3RhbmNlIGFscmVhZHkgY2FsbGVkIGJ5IG9uVHJpZ2dlcilcbiAgICAgIC8vIHByb2dyYW1tYXRpYyBjYWxsIHdpdGggbm8gcGFyYW1zIHdoZW4gYWxyZWFkeSB2aXNpYmxlIChkbyBub3RoaW5nIGFnYWluKVxuXG5cbiAgICAgIGlmIChjdXJyZW50VGFyZ2V0ICYmIHRhcmdldCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gLy8gdGFyZ2V0IGlzIGluZGV4IG9mIGluc3RhbmNlXG5cblxuICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiByZWZlcmVuY2VzW3RhcmdldF0gJiYgcHJlcGFyZUluc3RhbmNlKHNpbmdsZXRvbiwgcmVmZXJlbmNlc1t0YXJnZXRdKTtcbiAgICAgIH0gLy8gdGFyZ2V0IGlzIGEgY2hpbGQgdGlwcHkgaW5zdGFuY2VcblxuXG4gICAgICBpZiAoaW5kaXZpZHVhbEluc3RhbmNlcy5pbmRleE9mKHRhcmdldCkgPj0gMCkge1xuICAgICAgICB2YXIgcmVmID0gdGFyZ2V0LnJlZmVyZW5jZTtcbiAgICAgICAgcmV0dXJuIHByZXBhcmVJbnN0YW5jZShzaW5nbGV0b24sIHJlZik7XG4gICAgICB9IC8vIHRhcmdldCBpcyBhIFJlZmVyZW5jZUVsZW1lbnRcblxuXG4gICAgICBpZiAocmVmZXJlbmNlcy5pbmRleE9mKHRhcmdldCkgPj0gMCkge1xuICAgICAgICByZXR1cm4gcHJlcGFyZUluc3RhbmNlKHNpbmdsZXRvbiwgdGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgc2luZ2xldG9uLnNob3dOZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGZpcnN0ID0gcmVmZXJlbmNlc1swXTtcblxuICAgICAgaWYgKCFjdXJyZW50VGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiBzaW5nbGV0b24uc2hvdygwKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGluZGV4ID0gcmVmZXJlbmNlcy5pbmRleE9mKGN1cnJlbnRUYXJnZXQpO1xuICAgICAgc2luZ2xldG9uLnNob3cocmVmZXJlbmNlc1tpbmRleCArIDFdIHx8IGZpcnN0KTtcbiAgICB9O1xuXG4gICAgc2luZ2xldG9uLnNob3dQcmV2aW91cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBsYXN0ID0gcmVmZXJlbmNlc1tyZWZlcmVuY2VzLmxlbmd0aCAtIDFdO1xuXG4gICAgICBpZiAoIWN1cnJlbnRUYXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIHNpbmdsZXRvbi5zaG93KGxhc3QpO1xuICAgICAgfVxuXG4gICAgICB2YXIgaW5kZXggPSByZWZlcmVuY2VzLmluZGV4T2YoY3VycmVudFRhcmdldCk7XG4gICAgICB2YXIgdGFyZ2V0ID0gcmVmZXJlbmNlc1tpbmRleCAtIDFdIHx8IGxhc3Q7XG4gICAgICBzaW5nbGV0b24uc2hvdyh0YXJnZXQpO1xuICAgIH07XG5cbiAgICB2YXIgb3JpZ2luYWxTZXRQcm9wcyA9IHNpbmdsZXRvbi5zZXRQcm9wcztcblxuICAgIHNpbmdsZXRvbi5zZXRQcm9wcyA9IGZ1bmN0aW9uIChwcm9wcykge1xuICAgICAgb3ZlcnJpZGVzID0gcHJvcHMub3ZlcnJpZGVzIHx8IG92ZXJyaWRlcztcbiAgICAgIG9yaWdpbmFsU2V0UHJvcHMocHJvcHMpO1xuICAgIH07XG5cbiAgICBzaW5nbGV0b24uc2V0SW5zdGFuY2VzID0gZnVuY3Rpb24gKG5leHRJbnN0YW5jZXMpIHtcbiAgICAgIGVuYWJsZUluc3RhbmNlcyh0cnVlKTtcbiAgICAgIGludGVyY2VwdFNldFByb3BzQ2xlYW51cHMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICB9KTtcbiAgICAgIGluZGl2aWR1YWxJbnN0YW5jZXMgPSBuZXh0SW5zdGFuY2VzO1xuICAgICAgZW5hYmxlSW5zdGFuY2VzKGZhbHNlKTtcbiAgICAgIHNldFJlZmVyZW5jZXMoKTtcbiAgICAgIHNldFRyaWdnZXJUYXJnZXRzKCk7XG4gICAgICBpbnRlcmNlcHRTZXRQcm9wc0NsZWFudXBzID0gaW50ZXJjZXB0U2V0UHJvcHMoc2luZ2xldG9uKTtcbiAgICAgIHNpbmdsZXRvbi5zZXRQcm9wcyh7XG4gICAgICAgIHRyaWdnZXJUYXJnZXQ6IHRyaWdnZXJUYXJnZXRzXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgaW50ZXJjZXB0U2V0UHJvcHNDbGVhbnVwcyA9IGludGVyY2VwdFNldFByb3BzKHNpbmdsZXRvbik7XG4gICAgcmV0dXJuIHNpbmdsZXRvbjtcbiAgfTtcblxuICB2YXIgQlVCQkxJTkdfRVZFTlRTX01BUCA9IHtcbiAgICBtb3VzZW92ZXI6ICdtb3VzZWVudGVyJyxcbiAgICBmb2N1c2luOiAnZm9jdXMnLFxuICAgIGNsaWNrOiAnY2xpY2snXG4gIH07XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZGVsZWdhdGUgaW5zdGFuY2UgdGhhdCBjb250cm9scyB0aGUgY3JlYXRpb24gb2YgdGlwcHkgaW5zdGFuY2VzXG4gICAqIGZvciBjaGlsZCBlbGVtZW50cyAoYHRhcmdldGAgQ1NTIHNlbGVjdG9yKS5cbiAgICovXG5cbiAgZnVuY3Rpb24gZGVsZWdhdGUodGFyZ2V0cywgcHJvcHMpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIHtcbiAgICAgIGVycm9yV2hlbighKHByb3BzICYmIHByb3BzLnRhcmdldCksIFsnWW91IG11c3Qgc3BlY2l0eSBhIGB0YXJnZXRgIHByb3AgaW5kaWNhdGluZyBhIENTUyBzZWxlY3RvciBzdHJpbmcgbWF0Y2hpbmcnLCAndGhlIHRhcmdldCBlbGVtZW50cyB0aGF0IHNob3VsZCByZWNlaXZlIGEgdGlwcHkuJ10uam9pbignICcpKTtcbiAgICB9XG5cbiAgICB2YXIgbGlzdGVuZXJzID0gW107XG4gICAgdmFyIGNoaWxkVGlwcHlJbnN0YW5jZXMgPSBbXTtcbiAgICB2YXIgZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB2YXIgdGFyZ2V0ID0gcHJvcHMudGFyZ2V0O1xuICAgIHZhciBuYXRpdmVQcm9wcyA9IHJlbW92ZVByb3BlcnRpZXMocHJvcHMsIFsndGFyZ2V0J10pO1xuICAgIHZhciBwYXJlbnRQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIG5hdGl2ZVByb3BzLCB7XG4gICAgICB0cmlnZ2VyOiAnbWFudWFsJyxcbiAgICAgIHRvdWNoOiBmYWxzZVxuICAgIH0pO1xuICAgIHZhciBjaGlsZFByb3BzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICB0b3VjaDogZGVmYXVsdFByb3BzLnRvdWNoXG4gICAgfSwgbmF0aXZlUHJvcHMsIHtcbiAgICAgIHNob3dPbkNyZWF0ZTogdHJ1ZVxuICAgIH0pO1xuICAgIHZhciByZXR1cm5WYWx1ZSA9IHRpcHB5KHRhcmdldHMsIHBhcmVudFByb3BzKTtcbiAgICB2YXIgbm9ybWFsaXplZFJldHVyblZhbHVlID0gbm9ybWFsaXplVG9BcnJheShyZXR1cm5WYWx1ZSk7XG5cbiAgICBmdW5jdGlvbiBvblRyaWdnZXIoZXZlbnQpIHtcbiAgICAgIGlmICghZXZlbnQudGFyZ2V0IHx8IGRpc2FibGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHRhcmdldE5vZGUgPSBldmVudC50YXJnZXQuY2xvc2VzdCh0YXJnZXQpO1xuXG4gICAgICBpZiAoIXRhcmdldE5vZGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSAvLyBHZXQgcmVsZXZhbnQgdHJpZ2dlciB3aXRoIGZhbGxiYWNrczpcbiAgICAgIC8vIDEuIENoZWNrIGBkYXRhLXRpcHB5LXRyaWdnZXJgIGF0dHJpYnV0ZSBvbiB0YXJnZXQgbm9kZVxuICAgICAgLy8gMi4gRmFsbGJhY2sgdG8gYHRyaWdnZXJgIHBhc3NlZCB0byBgZGVsZWdhdGUoKWBcbiAgICAgIC8vIDMuIEZhbGxiYWNrIHRvIGBkZWZhdWx0UHJvcHMudHJpZ2dlcmBcblxuXG4gICAgICB2YXIgdHJpZ2dlciA9IHRhcmdldE5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXRpcHB5LXRyaWdnZXInKSB8fCBwcm9wcy50cmlnZ2VyIHx8IGRlZmF1bHRQcm9wcy50cmlnZ2VyOyAvLyBAdHMtaWdub3JlXG5cbiAgICAgIGlmICh0YXJnZXROb2RlLl90aXBweSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudC50eXBlID09PSAndG91Y2hzdGFydCcgJiYgdHlwZW9mIGNoaWxkUHJvcHMudG91Y2ggPT09ICdib29sZWFuJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudC50eXBlICE9PSAndG91Y2hzdGFydCcgJiYgdHJpZ2dlci5pbmRleE9mKEJVQkJMSU5HX0VWRU5UU19NQVBbZXZlbnQudHlwZV0pIDwgMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBpbnN0YW5jZSA9IHRpcHB5KHRhcmdldE5vZGUsIGNoaWxkUHJvcHMpO1xuXG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgY2hpbGRUaXBweUluc3RhbmNlcyA9IGNoaWxkVGlwcHlJbnN0YW5jZXMuY29uY2F0KGluc3RhbmNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbihub2RlLCBldmVudFR5cGUsIGhhbmRsZXIsIG9wdGlvbnMpIHtcbiAgICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICAgICAgb3B0aW9ucyA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgICAgIGxpc3RlbmVycy5wdXNoKHtcbiAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgZXZlbnRUeXBlOiBldmVudFR5cGUsXG4gICAgICAgIGhhbmRsZXI6IGhhbmRsZXIsXG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJzKGluc3RhbmNlKSB7XG4gICAgICB2YXIgcmVmZXJlbmNlID0gaW5zdGFuY2UucmVmZXJlbmNlO1xuICAgICAgb24ocmVmZXJlbmNlLCAndG91Y2hzdGFydCcsIG9uVHJpZ2dlciwgVE9VQ0hfT1BUSU9OUyk7XG4gICAgICBvbihyZWZlcmVuY2UsICdtb3VzZW92ZXInLCBvblRyaWdnZXIpO1xuICAgICAgb24ocmVmZXJlbmNlLCAnZm9jdXNpbicsIG9uVHJpZ2dlcik7XG4gICAgICBvbihyZWZlcmVuY2UsICdjbGljaycsIG9uVHJpZ2dlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbiAoX3JlZikge1xuICAgICAgICB2YXIgbm9kZSA9IF9yZWYubm9kZSxcbiAgICAgICAgICAgIGV2ZW50VHlwZSA9IF9yZWYuZXZlbnRUeXBlLFxuICAgICAgICAgICAgaGFuZGxlciA9IF9yZWYuaGFuZGxlcixcbiAgICAgICAgICAgIG9wdGlvbnMgPSBfcmVmLm9wdGlvbnM7XG4gICAgICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGhhbmRsZXIsIG9wdGlvbnMpO1xuICAgICAgfSk7XG4gICAgICBsaXN0ZW5lcnMgPSBbXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcHBseU11dGF0aW9ucyhpbnN0YW5jZSkge1xuICAgICAgdmFyIG9yaWdpbmFsRGVzdHJveSA9IGluc3RhbmNlLmRlc3Ryb3k7XG4gICAgICB2YXIgb3JpZ2luYWxFbmFibGUgPSBpbnN0YW5jZS5lbmFibGU7XG4gICAgICB2YXIgb3JpZ2luYWxEaXNhYmxlID0gaW5zdGFuY2UuZGlzYWJsZTtcblxuICAgICAgaW5zdGFuY2UuZGVzdHJveSA9IGZ1bmN0aW9uIChzaG91bGREZXN0cm95Q2hpbGRJbnN0YW5jZXMpIHtcbiAgICAgICAgaWYgKHNob3VsZERlc3Ryb3lDaGlsZEluc3RhbmNlcyA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgc2hvdWxkRGVzdHJveUNoaWxkSW5zdGFuY2VzID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaG91bGREZXN0cm95Q2hpbGRJbnN0YW5jZXMpIHtcbiAgICAgICAgICBjaGlsZFRpcHB5SW5zdGFuY2VzLmZvckVhY2goZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS5kZXN0cm95KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjaGlsZFRpcHB5SW5zdGFuY2VzID0gW107XG4gICAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICAgIG9yaWdpbmFsRGVzdHJveSgpO1xuICAgICAgfTtcblxuICAgICAgaW5zdGFuY2UuZW5hYmxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBvcmlnaW5hbEVuYWJsZSgpO1xuICAgICAgICBjaGlsZFRpcHB5SW5zdGFuY2VzLmZvckVhY2goZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluc3RhbmNlLmVuYWJsZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIH07XG5cbiAgICAgIGluc3RhbmNlLmRpc2FibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9yaWdpbmFsRGlzYWJsZSgpO1xuICAgICAgICBjaGlsZFRpcHB5SW5zdGFuY2VzLmZvckVhY2goZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluc3RhbmNlLmRpc2FibGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH07XG5cbiAgICAgIGFkZEV2ZW50TGlzdGVuZXJzKGluc3RhbmNlKTtcbiAgICB9XG5cbiAgICBub3JtYWxpemVkUmV0dXJuVmFsdWUuZm9yRWFjaChhcHBseU11dGF0aW9ucyk7XG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgdmFyIGFuaW1hdGVGaWxsID0ge1xuICAgIG5hbWU6ICdhbmltYXRlRmlsbCcsXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICBmbjogZnVuY3Rpb24gZm4oaW5zdGFuY2UpIHtcbiAgICAgIHZhciBfaW5zdGFuY2UkcHJvcHMkcmVuZGU7XG5cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGlmICghKChfaW5zdGFuY2UkcHJvcHMkcmVuZGUgPSBpbnN0YW5jZS5wcm9wcy5yZW5kZXIpICE9IG51bGwgJiYgX2luc3RhbmNlJHByb3BzJHJlbmRlLiQkdGlwcHkpKSB7XG4gICAgICAgIHtcbiAgICAgICAgICBlcnJvcldoZW4oaW5zdGFuY2UucHJvcHMuYW5pbWF0ZUZpbGwsICdUaGUgYGFuaW1hdGVGaWxsYCBwbHVnaW4gcmVxdWlyZXMgdGhlIGRlZmF1bHQgcmVuZGVyIGZ1bmN0aW9uLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfVxuXG4gICAgICB2YXIgX2dldENoaWxkcmVuID0gZ2V0Q2hpbGRyZW4oaW5zdGFuY2UucG9wcGVyKSxcbiAgICAgICAgICBib3ggPSBfZ2V0Q2hpbGRyZW4uYm94LFxuICAgICAgICAgIGNvbnRlbnQgPSBfZ2V0Q2hpbGRyZW4uY29udGVudDtcblxuICAgICAgdmFyIGJhY2tkcm9wID0gaW5zdGFuY2UucHJvcHMuYW5pbWF0ZUZpbGwgPyBjcmVhdGVCYWNrZHJvcEVsZW1lbnQoKSA6IG51bGw7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBvbkNyZWF0ZTogZnVuY3Rpb24gb25DcmVhdGUoKSB7XG4gICAgICAgICAgaWYgKGJhY2tkcm9wKSB7XG4gICAgICAgICAgICBib3guaW5zZXJ0QmVmb3JlKGJhY2tkcm9wLCBib3guZmlyc3RFbGVtZW50Q2hpbGQpO1xuICAgICAgICAgICAgYm94LnNldEF0dHJpYnV0ZSgnZGF0YS1hbmltYXRlZmlsbCcsICcnKTtcbiAgICAgICAgICAgIGJveC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgaW5zdGFuY2Uuc2V0UHJvcHMoe1xuICAgICAgICAgICAgICBhcnJvdzogZmFsc2UsXG4gICAgICAgICAgICAgIGFuaW1hdGlvbjogJ3NoaWZ0LWF3YXknXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9uTW91bnQ6IGZ1bmN0aW9uIG9uTW91bnQoKSB7XG4gICAgICAgICAgaWYgKGJhY2tkcm9wKSB7XG4gICAgICAgICAgICB2YXIgdHJhbnNpdGlvbkR1cmF0aW9uID0gYm94LnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbjtcbiAgICAgICAgICAgIHZhciBkdXJhdGlvbiA9IE51bWJlcih0cmFuc2l0aW9uRHVyYXRpb24ucmVwbGFjZSgnbXMnLCAnJykpOyAvLyBUaGUgY29udGVudCBzaG91bGQgZmFkZSBpbiBhZnRlciB0aGUgYmFja2Ryb3AgaGFzIG1vc3RseSBmaWxsZWQgdGhlXG4gICAgICAgICAgICAvLyB0b29sdGlwIGVsZW1lbnQuIGBjbGlwLXBhdGhgIGlzIHRoZSBvdGhlciBhbHRlcm5hdGl2ZSBidXQgaXMgbm90XG4gICAgICAgICAgICAvLyB3ZWxsLXN1cHBvcnRlZCBhbmQgaXMgYnVnZ3kgb24gc29tZSBkZXZpY2VzLlxuXG4gICAgICAgICAgICBjb250ZW50LnN0eWxlLnRyYW5zaXRpb25EZWxheSA9IE1hdGgucm91bmQoZHVyYXRpb24gLyAxMCkgKyBcIm1zXCI7XG4gICAgICAgICAgICBiYWNrZHJvcC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSB0cmFuc2l0aW9uRHVyYXRpb247XG4gICAgICAgICAgICBzZXRWaXNpYmlsaXR5U3RhdGUoW2JhY2tkcm9wXSwgJ3Zpc2libGUnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9uU2hvdzogZnVuY3Rpb24gb25TaG93KCkge1xuICAgICAgICAgIGlmIChiYWNrZHJvcCkge1xuICAgICAgICAgICAgYmFja2Ryb3Auc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gJzBtcyc7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBvbkhpZGU6IGZ1bmN0aW9uIG9uSGlkZSgpIHtcbiAgICAgICAgICBpZiAoYmFja2Ryb3ApIHtcbiAgICAgICAgICAgIHNldFZpc2liaWxpdHlTdGF0ZShbYmFja2Ryb3BdLCAnaGlkZGVuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBjcmVhdGVCYWNrZHJvcEVsZW1lbnQoKSB7XG4gICAgdmFyIGJhY2tkcm9wID0gZGl2KCk7XG4gICAgYmFja2Ryb3AuY2xhc3NOYW1lID0gQkFDS0RST1BfQ0xBU1M7XG4gICAgc2V0VmlzaWJpbGl0eVN0YXRlKFtiYWNrZHJvcF0sICdoaWRkZW4nKTtcbiAgICByZXR1cm4gYmFja2Ryb3A7XG4gIH1cblxuICB2YXIgbW91c2VDb29yZHMgPSB7XG4gICAgY2xpZW50WDogMCxcbiAgICBjbGllbnRZOiAwXG4gIH07XG4gIHZhciBhY3RpdmVJbnN0YW5jZXMgPSBbXTtcblxuICBmdW5jdGlvbiBzdG9yZU1vdXNlQ29vcmRzKF9yZWYpIHtcbiAgICB2YXIgY2xpZW50WCA9IF9yZWYuY2xpZW50WCxcbiAgICAgICAgY2xpZW50WSA9IF9yZWYuY2xpZW50WTtcbiAgICBtb3VzZUNvb3JkcyA9IHtcbiAgICAgIGNsaWVudFg6IGNsaWVudFgsXG4gICAgICBjbGllbnRZOiBjbGllbnRZXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZE1vdXNlQ29vcmRzTGlzdGVuZXIoZG9jKSB7XG4gICAgZG9jLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHN0b3JlTW91c2VDb29yZHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlTW91c2VDb29yZHNMaXN0ZW5lcihkb2MpIHtcbiAgICBkb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgc3RvcmVNb3VzZUNvb3Jkcyk7XG4gIH1cblxuICB2YXIgZm9sbG93Q3Vyc29yID0ge1xuICAgIG5hbWU6ICdmb2xsb3dDdXJzb3InLFxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgZm46IGZ1bmN0aW9uIGZuKGluc3RhbmNlKSB7XG4gICAgICB2YXIgcmVmZXJlbmNlID0gaW5zdGFuY2UucmVmZXJlbmNlO1xuICAgICAgdmFyIGRvYyA9IGdldE93bmVyRG9jdW1lbnQoaW5zdGFuY2UucHJvcHMudHJpZ2dlclRhcmdldCB8fCByZWZlcmVuY2UpO1xuICAgICAgdmFyIGlzSW50ZXJuYWxVcGRhdGUgPSBmYWxzZTtcbiAgICAgIHZhciB3YXNGb2N1c0V2ZW50ID0gZmFsc2U7XG4gICAgICB2YXIgaXNVbm1vdW50ZWQgPSB0cnVlO1xuICAgICAgdmFyIHByZXZQcm9wcyA9IGluc3RhbmNlLnByb3BzO1xuXG4gICAgICBmdW5jdGlvbiBnZXRJc0luaXRpYWxCZWhhdmlvcigpIHtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLnByb3BzLmZvbGxvd0N1cnNvciA9PT0gJ2luaXRpYWwnICYmIGluc3RhbmNlLnN0YXRlLmlzVmlzaWJsZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYWRkTGlzdGVuZXIoKSB7XG4gICAgICAgIGRvYy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKCkge1xuICAgICAgICBkb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiB1bnNldEdldFJlZmVyZW5jZUNsaWVudFJlY3QoKSB7XG4gICAgICAgIGlzSW50ZXJuYWxVcGRhdGUgPSB0cnVlO1xuICAgICAgICBpbnN0YW5jZS5zZXRQcm9wcyh7XG4gICAgICAgICAgZ2V0UmVmZXJlbmNlQ2xpZW50UmVjdDogbnVsbFxuICAgICAgICB9KTtcbiAgICAgICAgaXNJbnRlcm5hbFVwZGF0ZSA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICAgICAgICAvLyBJZiB0aGUgaW5zdGFuY2UgaXMgaW50ZXJhY3RpdmUsIGF2b2lkIHVwZGF0aW5nIHRoZSBwb3NpdGlvbiB1bmxlc3MgaXQnc1xuICAgICAgICAvLyBvdmVyIHRoZSByZWZlcmVuY2UgZWxlbWVudFxuICAgICAgICB2YXIgaXNDdXJzb3JPdmVyUmVmZXJlbmNlID0gZXZlbnQudGFyZ2V0ID8gcmVmZXJlbmNlLmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgOiB0cnVlO1xuICAgICAgICB2YXIgZm9sbG93Q3Vyc29yID0gaW5zdGFuY2UucHJvcHMuZm9sbG93Q3Vyc29yO1xuICAgICAgICB2YXIgY2xpZW50WCA9IGV2ZW50LmNsaWVudFgsXG4gICAgICAgICAgICBjbGllbnRZID0gZXZlbnQuY2xpZW50WTtcbiAgICAgICAgdmFyIHJlY3QgPSByZWZlcmVuY2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciByZWxhdGl2ZVggPSBjbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgICAgICB2YXIgcmVsYXRpdmVZID0gY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gICAgICAgIGlmIChpc0N1cnNvck92ZXJSZWZlcmVuY2UgfHwgIWluc3RhbmNlLnByb3BzLmludGVyYWN0aXZlKSB7XG4gICAgICAgICAgaW5zdGFuY2Uuc2V0UHJvcHMoe1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSAtIHVubmVlZGVkIERPTVJlY3QgcHJvcGVydGllc1xuICAgICAgICAgICAgZ2V0UmVmZXJlbmNlQ2xpZW50UmVjdDogZnVuY3Rpb24gZ2V0UmVmZXJlbmNlQ2xpZW50UmVjdCgpIHtcbiAgICAgICAgICAgICAgdmFyIHJlY3QgPSByZWZlcmVuY2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgIHZhciB4ID0gY2xpZW50WDtcbiAgICAgICAgICAgICAgdmFyIHkgPSBjbGllbnRZO1xuXG4gICAgICAgICAgICAgIGlmIChmb2xsb3dDdXJzb3IgPT09ICdpbml0aWFsJykge1xuICAgICAgICAgICAgICAgIHggPSByZWN0LmxlZnQgKyByZWxhdGl2ZVg7XG4gICAgICAgICAgICAgICAgeSA9IHJlY3QudG9wICsgcmVsYXRpdmVZO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIHRvcCA9IGZvbGxvd0N1cnNvciA9PT0gJ2hvcml6b250YWwnID8gcmVjdC50b3AgOiB5O1xuICAgICAgICAgICAgICB2YXIgcmlnaHQgPSBmb2xsb3dDdXJzb3IgPT09ICd2ZXJ0aWNhbCcgPyByZWN0LnJpZ2h0IDogeDtcbiAgICAgICAgICAgICAgdmFyIGJvdHRvbSA9IGZvbGxvd0N1cnNvciA9PT0gJ2hvcml6b250YWwnID8gcmVjdC5ib3R0b20gOiB5O1xuICAgICAgICAgICAgICB2YXIgbGVmdCA9IGZvbGxvd0N1cnNvciA9PT0gJ3ZlcnRpY2FsJyA/IHJlY3QubGVmdCA6IHg7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHJpZ2h0IC0gbGVmdCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGJvdHRvbSAtIHRvcCxcbiAgICAgICAgICAgICAgICB0b3A6IHRvcCxcbiAgICAgICAgICAgICAgICByaWdodDogcmlnaHQsXG4gICAgICAgICAgICAgICAgYm90dG9tOiBib3R0b20sXG4gICAgICAgICAgICAgICAgbGVmdDogbGVmdFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZSgpIHtcbiAgICAgICAgaWYgKGluc3RhbmNlLnByb3BzLmZvbGxvd0N1cnNvcikge1xuICAgICAgICAgIGFjdGl2ZUluc3RhbmNlcy5wdXNoKHtcbiAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZSxcbiAgICAgICAgICAgIGRvYzogZG9jXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYWRkTW91c2VDb29yZHNMaXN0ZW5lcihkb2MpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgIGFjdGl2ZUluc3RhbmNlcyA9IGFjdGl2ZUluc3RhbmNlcy5maWx0ZXIoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZGF0YS5pbnN0YW5jZSAhPT0gaW5zdGFuY2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChhY3RpdmVJbnN0YW5jZXMuZmlsdGVyKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGEuZG9jID09PSBkb2M7XG4gICAgICAgIH0pLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJlbW92ZU1vdXNlQ29vcmRzTGlzdGVuZXIoZG9jKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBvbkNyZWF0ZTogY3JlYXRlLFxuICAgICAgICBvbkRlc3Ryb3k6IGRlc3Ryb3ksXG4gICAgICAgIG9uQmVmb3JlVXBkYXRlOiBmdW5jdGlvbiBvbkJlZm9yZVVwZGF0ZSgpIHtcbiAgICAgICAgICBwcmV2UHJvcHMgPSBpbnN0YW5jZS5wcm9wcztcbiAgICAgICAgfSxcbiAgICAgICAgb25BZnRlclVwZGF0ZTogZnVuY3Rpb24gb25BZnRlclVwZGF0ZShfLCBfcmVmMikge1xuICAgICAgICAgIHZhciBmb2xsb3dDdXJzb3IgPSBfcmVmMi5mb2xsb3dDdXJzb3I7XG5cbiAgICAgICAgICBpZiAoaXNJbnRlcm5hbFVwZGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChmb2xsb3dDdXJzb3IgIT09IHVuZGVmaW5lZCAmJiBwcmV2UHJvcHMuZm9sbG93Q3Vyc29yICE9PSBmb2xsb3dDdXJzb3IpIHtcbiAgICAgICAgICAgIGRlc3Ryb3koKTtcblxuICAgICAgICAgICAgaWYgKGZvbGxvd0N1cnNvcikge1xuICAgICAgICAgICAgICBjcmVhdGUoKTtcblxuICAgICAgICAgICAgICBpZiAoaW5zdGFuY2Uuc3RhdGUuaXNNb3VudGVkICYmICF3YXNGb2N1c0V2ZW50ICYmICFnZXRJc0luaXRpYWxCZWhhdmlvcigpKSB7XG4gICAgICAgICAgICAgICAgYWRkTGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgdW5zZXRHZXRSZWZlcmVuY2VDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBvbk1vdW50OiBmdW5jdGlvbiBvbk1vdW50KCkge1xuICAgICAgICAgIGlmIChpbnN0YW5jZS5wcm9wcy5mb2xsb3dDdXJzb3IgJiYgIXdhc0ZvY3VzRXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChpc1VubW91bnRlZCkge1xuICAgICAgICAgICAgICBvbk1vdXNlTW92ZShtb3VzZUNvb3Jkcyk7XG4gICAgICAgICAgICAgIGlzVW5tb3VudGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghZ2V0SXNJbml0aWFsQmVoYXZpb3IoKSkge1xuICAgICAgICAgICAgICBhZGRMaXN0ZW5lcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25UcmlnZ2VyOiBmdW5jdGlvbiBvblRyaWdnZXIoXywgZXZlbnQpIHtcbiAgICAgICAgICBpZiAoaXNNb3VzZUV2ZW50KGV2ZW50KSkge1xuICAgICAgICAgICAgbW91c2VDb29yZHMgPSB7XG4gICAgICAgICAgICAgIGNsaWVudFg6IGV2ZW50LmNsaWVudFgsXG4gICAgICAgICAgICAgIGNsaWVudFk6IGV2ZW50LmNsaWVudFlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgd2FzRm9jdXNFdmVudCA9IGV2ZW50LnR5cGUgPT09ICdmb2N1cyc7XG4gICAgICAgIH0sXG4gICAgICAgIG9uSGlkZGVuOiBmdW5jdGlvbiBvbkhpZGRlbigpIHtcbiAgICAgICAgICBpZiAoaW5zdGFuY2UucHJvcHMuZm9sbG93Q3Vyc29yKSB7XG4gICAgICAgICAgICB1bnNldEdldFJlZmVyZW5jZUNsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICBpc1VubW91bnRlZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBnZXRQcm9wcyhwcm9wcywgbW9kaWZpZXIpIHtcbiAgICB2YXIgX3Byb3BzJHBvcHBlck9wdGlvbnM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgcG9wcGVyT3B0aW9uczogT2JqZWN0LmFzc2lnbih7fSwgcHJvcHMucG9wcGVyT3B0aW9ucywge1xuICAgICAgICBtb2RpZmllcnM6IFtdLmNvbmNhdCgoKChfcHJvcHMkcG9wcGVyT3B0aW9ucyA9IHByb3BzLnBvcHBlck9wdGlvbnMpID09IG51bGwgPyB2b2lkIDAgOiBfcHJvcHMkcG9wcGVyT3B0aW9ucy5tb2RpZmllcnMpIHx8IFtdKS5maWx0ZXIoZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgICAgICB2YXIgbmFtZSA9IF9yZWYubmFtZTtcbiAgICAgICAgICByZXR1cm4gbmFtZSAhPT0gbW9kaWZpZXIubmFtZTtcbiAgICAgICAgfSksIFttb2RpZmllcl0pXG4gICAgICB9KVxuICAgIH07XG4gIH1cblxuICB2YXIgaW5saW5lUG9zaXRpb25pbmcgPSB7XG4gICAgbmFtZTogJ2lubGluZVBvc2l0aW9uaW5nJyxcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIGZuOiBmdW5jdGlvbiBmbihpbnN0YW5jZSkge1xuICAgICAgdmFyIHJlZmVyZW5jZSA9IGluc3RhbmNlLnJlZmVyZW5jZTtcblxuICAgICAgZnVuY3Rpb24gaXNFbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gISFpbnN0YW5jZS5wcm9wcy5pbmxpbmVQb3NpdGlvbmluZztcbiAgICAgIH1cblxuICAgICAgdmFyIHBsYWNlbWVudDtcbiAgICAgIHZhciBjdXJzb3JSZWN0SW5kZXggPSAtMTtcbiAgICAgIHZhciBpc0ludGVybmFsVXBkYXRlID0gZmFsc2U7XG4gICAgICB2YXIgdHJpZWRQbGFjZW1lbnRzID0gW107XG4gICAgICB2YXIgbW9kaWZpZXIgPSB7XG4gICAgICAgIG5hbWU6ICd0aXBweUlubGluZVBvc2l0aW9uaW5nJyxcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgcGhhc2U6ICdhZnRlcldyaXRlJyxcbiAgICAgICAgZm46IGZ1bmN0aW9uIGZuKF9yZWYyKSB7XG4gICAgICAgICAgdmFyIHN0YXRlID0gX3JlZjIuc3RhdGU7XG5cbiAgICAgICAgICBpZiAoaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIGlmICh0cmllZFBsYWNlbWVudHMuaW5kZXhPZihzdGF0ZS5wbGFjZW1lbnQpICE9PSAtMSkge1xuICAgICAgICAgICAgICB0cmllZFBsYWNlbWVudHMgPSBbXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBsYWNlbWVudCAhPT0gc3RhdGUucGxhY2VtZW50ICYmIHRyaWVkUGxhY2VtZW50cy5pbmRleE9mKHN0YXRlLnBsYWNlbWVudCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgIHRyaWVkUGxhY2VtZW50cy5wdXNoKHN0YXRlLnBsYWNlbWVudCk7XG4gICAgICAgICAgICAgIGluc3RhbmNlLnNldFByb3BzKHtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlIC0gdW5uZWVkZWQgRE9NUmVjdCBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgZ2V0UmVmZXJlbmNlQ2xpZW50UmVjdDogZnVuY3Rpb24gZ2V0UmVmZXJlbmNlQ2xpZW50UmVjdCgpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBfZ2V0UmVmZXJlbmNlQ2xpZW50UmVjdChzdGF0ZS5wbGFjZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBsYWNlbWVudCA9IHN0YXRlLnBsYWNlbWVudDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGZ1bmN0aW9uIF9nZXRSZWZlcmVuY2VDbGllbnRSZWN0KHBsYWNlbWVudCkge1xuICAgICAgICByZXR1cm4gZ2V0SW5saW5lQm91bmRpbmdDbGllbnRSZWN0KGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KSwgcmVmZXJlbmNlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBhcnJheUZyb20ocmVmZXJlbmNlLmdldENsaWVudFJlY3RzKCkpLCBjdXJzb3JSZWN0SW5kZXgpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRJbnRlcm5hbFByb3BzKHBhcnRpYWxQcm9wcykge1xuICAgICAgICBpc0ludGVybmFsVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgaW5zdGFuY2Uuc2V0UHJvcHMocGFydGlhbFByb3BzKTtcbiAgICAgICAgaXNJbnRlcm5hbFVwZGF0ZSA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhZGRNb2RpZmllcigpIHtcbiAgICAgICAgaWYgKCFpc0ludGVybmFsVXBkYXRlKSB7XG4gICAgICAgICAgc2V0SW50ZXJuYWxQcm9wcyhnZXRQcm9wcyhpbnN0YW5jZS5wcm9wcywgbW9kaWZpZXIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBvbkNyZWF0ZTogYWRkTW9kaWZpZXIsXG4gICAgICAgIG9uQWZ0ZXJVcGRhdGU6IGFkZE1vZGlmaWVyLFxuICAgICAgICBvblRyaWdnZXI6IGZ1bmN0aW9uIG9uVHJpZ2dlcihfLCBldmVudCkge1xuICAgICAgICAgIGlmIChpc01vdXNlRXZlbnQoZXZlbnQpKSB7XG4gICAgICAgICAgICB2YXIgcmVjdHMgPSBhcnJheUZyb20oaW5zdGFuY2UucmVmZXJlbmNlLmdldENsaWVudFJlY3RzKCkpO1xuICAgICAgICAgICAgdmFyIGN1cnNvclJlY3QgPSByZWN0cy5maW5kKGZ1bmN0aW9uIChyZWN0KSB7XG4gICAgICAgICAgICAgIHJldHVybiByZWN0LmxlZnQgLSAyIDw9IGV2ZW50LmNsaWVudFggJiYgcmVjdC5yaWdodCArIDIgPj0gZXZlbnQuY2xpZW50WCAmJiByZWN0LnRvcCAtIDIgPD0gZXZlbnQuY2xpZW50WSAmJiByZWN0LmJvdHRvbSArIDIgPj0gZXZlbnQuY2xpZW50WTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gcmVjdHMuaW5kZXhPZihjdXJzb3JSZWN0KTtcbiAgICAgICAgICAgIGN1cnNvclJlY3RJbmRleCA9IGluZGV4ID4gLTEgPyBpbmRleCA6IGN1cnNvclJlY3RJbmRleDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9uSGlkZGVuOiBmdW5jdGlvbiBvbkhpZGRlbigpIHtcbiAgICAgICAgICBjdXJzb3JSZWN0SW5kZXggPSAtMTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG4gIGZ1bmN0aW9uIGdldElubGluZUJvdW5kaW5nQ2xpZW50UmVjdChjdXJyZW50QmFzZVBsYWNlbWVudCwgYm91bmRpbmdSZWN0LCBjbGllbnRSZWN0cywgY3Vyc29yUmVjdEluZGV4KSB7XG4gICAgLy8gTm90IGFuIGlubGluZSBlbGVtZW50LCBvciBwbGFjZW1lbnQgaXMgbm90IHlldCBrbm93blxuICAgIGlmIChjbGllbnRSZWN0cy5sZW5ndGggPCAyIHx8IGN1cnJlbnRCYXNlUGxhY2VtZW50ID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gYm91bmRpbmdSZWN0O1xuICAgIH0gLy8gVGhlcmUgYXJlIHR3byByZWN0cyBhbmQgdGhleSBhcmUgZGlzam9pbmVkXG5cblxuICAgIGlmIChjbGllbnRSZWN0cy5sZW5ndGggPT09IDIgJiYgY3Vyc29yUmVjdEluZGV4ID49IDAgJiYgY2xpZW50UmVjdHNbMF0ubGVmdCA+IGNsaWVudFJlY3RzWzFdLnJpZ2h0KSB7XG4gICAgICByZXR1cm4gY2xpZW50UmVjdHNbY3Vyc29yUmVjdEluZGV4XSB8fCBib3VuZGluZ1JlY3Q7XG4gICAgfVxuXG4gICAgc3dpdGNoIChjdXJyZW50QmFzZVBsYWNlbWVudCkge1xuICAgICAgY2FzZSAndG9wJzpcbiAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgZmlyc3RSZWN0ID0gY2xpZW50UmVjdHNbMF07XG4gICAgICAgICAgdmFyIGxhc3RSZWN0ID0gY2xpZW50UmVjdHNbY2xpZW50UmVjdHMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgdmFyIGlzVG9wID0gY3VycmVudEJhc2VQbGFjZW1lbnQgPT09ICd0b3AnO1xuICAgICAgICAgIHZhciB0b3AgPSBmaXJzdFJlY3QudG9wO1xuICAgICAgICAgIHZhciBib3R0b20gPSBsYXN0UmVjdC5ib3R0b207XG4gICAgICAgICAgdmFyIGxlZnQgPSBpc1RvcCA/IGZpcnN0UmVjdC5sZWZ0IDogbGFzdFJlY3QubGVmdDtcbiAgICAgICAgICB2YXIgcmlnaHQgPSBpc1RvcCA/IGZpcnN0UmVjdC5yaWdodCA6IGxhc3RSZWN0LnJpZ2h0O1xuICAgICAgICAgIHZhciB3aWR0aCA9IHJpZ2h0IC0gbGVmdDtcbiAgICAgICAgICB2YXIgaGVpZ2h0ID0gYm90dG9tIC0gdG9wO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IHRvcCxcbiAgICAgICAgICAgIGJvdHRvbTogYm90dG9tLFxuICAgICAgICAgICAgbGVmdDogbGVmdCxcbiAgICAgICAgICAgIHJpZ2h0OiByaWdodCxcbiAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICBjYXNlICdsZWZ0JzpcbiAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAge1xuICAgICAgICAgIHZhciBtaW5MZWZ0ID0gTWF0aC5taW4uYXBwbHkoTWF0aCwgY2xpZW50UmVjdHMubWFwKGZ1bmN0aW9uIChyZWN0cykge1xuICAgICAgICAgICAgcmV0dXJuIHJlY3RzLmxlZnQ7XG4gICAgICAgICAgfSkpO1xuICAgICAgICAgIHZhciBtYXhSaWdodCA9IE1hdGgubWF4LmFwcGx5KE1hdGgsIGNsaWVudFJlY3RzLm1hcChmdW5jdGlvbiAocmVjdHMpIHtcbiAgICAgICAgICAgIHJldHVybiByZWN0cy5yaWdodDtcbiAgICAgICAgICB9KSk7XG4gICAgICAgICAgdmFyIG1lYXN1cmVSZWN0cyA9IGNsaWVudFJlY3RzLmZpbHRlcihmdW5jdGlvbiAocmVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRCYXNlUGxhY2VtZW50ID09PSAnbGVmdCcgPyByZWN0LmxlZnQgPT09IG1pbkxlZnQgOiByZWN0LnJpZ2h0ID09PSBtYXhSaWdodDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB2YXIgX3RvcCA9IG1lYXN1cmVSZWN0c1swXS50b3A7XG4gICAgICAgICAgdmFyIF9ib3R0b20gPSBtZWFzdXJlUmVjdHNbbWVhc3VyZVJlY3RzLmxlbmd0aCAtIDFdLmJvdHRvbTtcbiAgICAgICAgICB2YXIgX2xlZnQgPSBtaW5MZWZ0O1xuICAgICAgICAgIHZhciBfcmlnaHQgPSBtYXhSaWdodDtcblxuICAgICAgICAgIHZhciBfd2lkdGggPSBfcmlnaHQgLSBfbGVmdDtcblxuICAgICAgICAgIHZhciBfaGVpZ2h0ID0gX2JvdHRvbSAtIF90b3A7XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiBfdG9wLFxuICAgICAgICAgICAgYm90dG9tOiBfYm90dG9tLFxuICAgICAgICAgICAgbGVmdDogX2xlZnQsXG4gICAgICAgICAgICByaWdodDogX3JpZ2h0LFxuICAgICAgICAgICAgd2lkdGg6IF93aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogX2hlaWdodFxuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAge1xuICAgICAgICAgIHJldHVybiBib3VuZGluZ1JlY3Q7XG4gICAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YXIgc3RpY2t5ID0ge1xuICAgIG5hbWU6ICdzdGlja3knLFxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgZm46IGZ1bmN0aW9uIGZuKGluc3RhbmNlKSB7XG4gICAgICB2YXIgcmVmZXJlbmNlID0gaW5zdGFuY2UucmVmZXJlbmNlLFxuICAgICAgICAgIHBvcHBlciA9IGluc3RhbmNlLnBvcHBlcjtcblxuICAgICAgZnVuY3Rpb24gZ2V0UmVmZXJlbmNlKCkge1xuICAgICAgICByZXR1cm4gaW5zdGFuY2UucG9wcGVySW5zdGFuY2UgPyBpbnN0YW5jZS5wb3BwZXJJbnN0YW5jZS5zdGF0ZS5lbGVtZW50cy5yZWZlcmVuY2UgOiByZWZlcmVuY2U7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3VsZENoZWNrKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS5wcm9wcy5zdGlja3kgPT09IHRydWUgfHwgaW5zdGFuY2UucHJvcHMuc3RpY2t5ID09PSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHByZXZSZWZSZWN0ID0gbnVsbDtcbiAgICAgIHZhciBwcmV2UG9wUmVjdCA9IG51bGw7XG5cbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZVBvc2l0aW9uKCkge1xuICAgICAgICB2YXIgY3VycmVudFJlZlJlY3QgPSBzaG91bGRDaGVjaygncmVmZXJlbmNlJykgPyBnZXRSZWZlcmVuY2UoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSA6IG51bGw7XG4gICAgICAgIHZhciBjdXJyZW50UG9wUmVjdCA9IHNob3VsZENoZWNrKCdwb3BwZXInKSA/IHBvcHBlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSA6IG51bGw7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRSZWZSZWN0ICYmIGFyZVJlY3RzRGlmZmVyZW50KHByZXZSZWZSZWN0LCBjdXJyZW50UmVmUmVjdCkgfHwgY3VycmVudFBvcFJlY3QgJiYgYXJlUmVjdHNEaWZmZXJlbnQocHJldlBvcFJlY3QsIGN1cnJlbnRQb3BSZWN0KSkge1xuICAgICAgICAgIGlmIChpbnN0YW5jZS5wb3BwZXJJbnN0YW5jZSkge1xuICAgICAgICAgICAgaW5zdGFuY2UucG9wcGVySW5zdGFuY2UudXBkYXRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJldlJlZlJlY3QgPSBjdXJyZW50UmVmUmVjdDtcbiAgICAgICAgcHJldlBvcFJlY3QgPSBjdXJyZW50UG9wUmVjdDtcblxuICAgICAgICBpZiAoaW5zdGFuY2Uuc3RhdGUuaXNNb3VudGVkKSB7XG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZVBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBvbk1vdW50OiBmdW5jdGlvbiBvbk1vdW50KCkge1xuICAgICAgICAgIGlmIChpbnN0YW5jZS5wcm9wcy5zdGlja3kpIHtcbiAgICAgICAgICAgIHVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBhcmVSZWN0c0RpZmZlcmVudChyZWN0QSwgcmVjdEIpIHtcbiAgICBpZiAocmVjdEEgJiYgcmVjdEIpIHtcbiAgICAgIHJldHVybiByZWN0QS50b3AgIT09IHJlY3RCLnRvcCB8fCByZWN0QS5yaWdodCAhPT0gcmVjdEIucmlnaHQgfHwgcmVjdEEuYm90dG9tICE9PSByZWN0Qi5ib3R0b20gfHwgcmVjdEEubGVmdCAhPT0gcmVjdEIubGVmdDtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChpc0Jyb3dzZXIpIHtcbiAgICBpbmplY3RDU1MoY3NzKTtcbiAgfVxuXG4gIHRpcHB5LnNldERlZmF1bHRQcm9wcyh7XG4gICAgcGx1Z2luczogW2FuaW1hdGVGaWxsLCBmb2xsb3dDdXJzb3IsIGlubGluZVBvc2l0aW9uaW5nLCBzdGlja3ldLFxuICAgIHJlbmRlcjogcmVuZGVyXG4gIH0pO1xuICB0aXBweS5jcmVhdGVTaW5nbGV0b24gPSBjcmVhdGVTaW5nbGV0b247XG4gIHRpcHB5LmRlbGVnYXRlID0gZGVsZWdhdGU7XG4gIHRpcHB5LmhpZGVBbGwgPSBoaWRlQWxsO1xuICB0aXBweS5yb3VuZEFycm93ID0gUk9VTkRfQVJST1c7XG5cbiAgcmV0dXJuIHRpcHB5O1xuXG59KSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGlwcHktYnVuZGxlLnVtZC5qcy5tYXBcbiJdLCJmaWxlIjoidGlwcHktYnVuZGxlLnVtZC5qcyJ9
