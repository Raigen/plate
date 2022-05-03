import * as React from 'react';
import React__default, { useRef, useCallback, useEffect, useState } from 'react';
import { withPlateEventProvider, useEventPlateId, usePlateEditorState, usePlateEditorRef, getPluginType, getAbove } from '@udecode/plate-core';
import { ToolbarButton } from '@udecode/plate-ui-toolbar';
import _styled, { css } from 'styled-components';
import ReactDOM from 'react-dom';
import { generateThreadLink, doesContactMatchString, upsertThreadAtSelection, findThreadNodeEntries, deleteThreadAtSelection, isFirstComment, deleteThread, ELEMENT_THREAD } from '@udecode/plate-comments';
import { Transforms } from 'slate';
import { MDCMenu, DefaultFocusState, Corner } from '@material/menu';
import { createStyles, getRootProps } from '@udecode/plate-styled-components';
import { MDCDialog } from '@material/dialog';
import { MDCRipple } from '@material/ripple';
import { MDCSnackbar } from '@material/snackbar';
import { ReactEditor } from 'slate-react';

function _extends$2() {
  _extends$2 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$2.apply(this, arguments);
}

const AddThreadToolbarButton = withPlateEventProvider(({
  id,
  onAddThread,
  ...props
}) => {
  id = useEventPlateId(id);
  const editor = usePlateEditorState(id);
  return /*#__PURE__*/React__default.createElement(ToolbarButton, _extends$2({
    onMouseDown: event => {
      if (!editor) {
        return;
      }

      event.preventDefault();
      onAddThread();
    }
  }, props));
});

function determineAbsolutePosition(element) {
  let left = 0;
  let top = 0;
  let currentElement = element;

  do {
    left += currentElement.offsetLeft || 0;
    top += currentElement.offsetTop || 0;
    currentElement = currentElement.offsetParent;
  } while (currentElement);

  return {
    left,
    top
  };
}

class Contacts extends React__default.Component {
  constructor(props) {
    super(props);
    this.contactsRef = /*#__PURE__*/React__default.createRef();
    this.onMenuSelected = this.onMenuSelected.bind(this);
  }

  componentDidMount() {
    this.contactsMenu = new MDCMenu(this.contactsRef.current);
    this.contactsMenu.setDefaultFocusState(DefaultFocusState.NONE);
    this.contactsMenu.setAnchorCorner(Corner.BOTTOM_START);
    const {
      onClosed
    } = this.props;
    this.contactsMenu.listen('MDCMenu:selected', this.onMenuSelected);
    this.contactsMenu.listen('MDCMenuSurface:closed', onClosed);
    this.contactsMenu.open = true;
  }

  componentWillUnmount() {
    this.contactsMenu.unlisten('MDCMenu:selected', this.onMenuSelected);
    const {
      onClosed
    } = this.props;
    this.contactsMenu.unlisten('MDCMenuSurface:closed', onClosed);
    this.contactsMenu.destroy();
  }

  onMenuSelected(event) {
    const {
      contacts
    } = this.props;
    const selectedContactIndex = event.detail.index;
    const selectedContact = contacts[selectedContactIndex];
    const {
      onSelected
    } = this.props;
    onSelected(selectedContact);
  }

  render() {
    const {
      contacts,
      selectedIndex
    } = this.props;
    return /*#__PURE__*/React__default.createElement("div", {
      ref: this.contactsRef,
      className: "mdc-menu mdc-menu-surface"
    }, /*#__PURE__*/React__default.createElement("ul", {
      className: "mdc-list mdc-menu__selection-group",
      role: "menu",
      "aria-hidden": "true",
      "aria-orientation": "vertical",
      tabIndex: -1
    }, contacts.map(({
      name,
      email,
      avatarUrl
    }, index) => /*#__PURE__*/React__default.createElement("li", {
      key: email,
      className: `mdc-list-item mdc-list-item--with-two-lines mdc-list-item--with-leading-avatar${index === selectedIndex ? ' mdc-list-item--selected' : ''}`,
      tabIndex: index === selectedIndex ? 0 : -1
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "mdc-list-item__ripple"
    }), /*#__PURE__*/React__default.createElement("span", {
      className: "mdc-list-item__start"
    }, /*#__PURE__*/React__default.createElement("img", {
      src: avatarUrl,
      alt: "Avatar",
      width: 40,
      height: 40
    })), /*#__PURE__*/React__default.createElement("span", {
      className: "mdc-list-item__content"
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "mdc-list-item__primary-text"
    }, name), /*#__PURE__*/React__default.createElement("span", {
      className: "mdc-list-item__secondary-text"
    }, email))))));
  }

}

const createThreadStyles = props => createStyles({
  prefixClassNames: 'Thread',
  ...props
}, {
  root: css(["border-radius:8px;box-shadow:0 2px 6px 2px rgb(60 64 67 / 15%);background-color:white;"])
});
const createCommentHeaderStyles = props => createStyles({
  prefixClassNames: 'ThreadCommentHeader',
  ...props
}, {
  root: css(["box-sizing:content-box;font-weight:normal;-webkit-tap-highlight-color:rgba(0,0,0,0);text-align:left;color:black;font-family:Roboto,RobotoDraft,Helvetica,Arial,sans-serif;font-size:14px;direction:ltr;cursor:default;-webkit-user-select:text;height:38px;white-space:nowrap;display:flex;margin:0;padding:12px;align-items:center;"])
});
const createAvatarHolderStyles = props => createStyles({
  prefixClassNames: 'ThreadAvatarHolder',
  ...props
}, {
  root: css(["font-weight:normal;-webkit-tap-highlight-color:rgba(0,0,0,0);text-align:left;color:black;font-family:Roboto,RobotoDraft,Helvetica,Arial,sans-serif;font-size:14px;direction:ltr;cursor:default;-webkit-user-select:text;white-space:nowrap;height:38px;margin-top:2px;max-width:36px;width:36px;"])
});
const createCommentProfileImageStyles = props => createStyles({
  prefixClassNames: 'ThreadCommentProfileImage',
  ...props
}, {
  root: css(["font-weight:normal;-webkit-tap-highlight-color:rgba(0,0,0,0);text-align:left;color:black;font-size:14px;direction:ltr;cursor:default;-webkit-user-select:text;white-space:nowrap;width:32px;aspect-ratio:auto 32 / 32;height:32px;object-fit:cover;left:0 !important;display:block;position:relative;border-radius:50%;margin-left:2px;margin-top:2px;"])
});
const createAuthorTimestampStyles = props => createStyles({
  prefixClassNames: 'ThreadAuthorTimestamp',
  ...props
}, {
  root: css(["font-weight:normal;-webkit-tap-highlight-color:rgba(0,0,0,0);text-align:left;color:black;font-family:Roboto,RobotoDraft,Helvetica,Arial,sans-serif;font-size:14px;cursor:pointer;direction:ltr;-webkit-user-select:text;padding-left:10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;-webkit-box-flex:1;flex-grow:1;display:flex;align-items:start;flex-direction:column;justify-content:center;"])
});
const createCommenterNameStyles = props => createStyles({
  prefixClassNames: 'ThreadCommenterName',
  ...props
}, {
  root: css(["-webkit-tap-highlight-color:rgba(0,0,0,0);text-align:left;direction:ltr;cursor:default;-webkit-user-select:text;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0;height:18px;align-self:stretch;color:#3c4043;font-family:Roboto,RobotoDraft,Helvetica,Arial,sans-serif;font-weight:500;font-size:14px;letter-spacing:0.25px;line-height:20px;margin-right:0.25rem;"])
});
const createTimestampStyles = props => createStyles({
  prefixClassNames: 'ThreadTimestamp',
  ...props
}, {
  root: css(["color:#3c4043;font-family:Roboto,RobotoDraft,Helvetica,Arial,sans-serif;font-size:12px;line-height:16px;letter-spacing:0.3px;"])
});
const createCommentInputStyles = props => createStyles({
  prefixClassNames: 'ThreadCommentInput',
  ...props
}, {
  root: css(["font-weight:normal;-webkit-tap-highlight-color:rgba(0,0,0,0);color:black;font-family:Roboto,RobotoDraft,Helvetica,Arial,sans-serif;white-space:normal;font-size:14px;cursor:default;-webkit-user-select:text;direction:ltr;unicode-bidi:isolate;position:relative;outline:none;zoom:1;border:none;background-color:#fff;padding:12px;display:block !important;padding-top:0;text-align:left;"]),
  commentInputReply: css(["border-top:1px solid rgb(218,220,224);padding-top:12px;margin-top:12px;"])
});
const createTextAreaStyles = props => createStyles({
  prefixClassNames: 'ThreadTextArea',
  ...props
}, {
  root: css(["color:#3c4043;line-height:20px;height:38px;border:1px solid #dadce0;border-radius:4px;box-sizing:border-box;font-size:14px;min-height:36px;padding:8px;display:block;margin:0;overflow-x:hidden;overflow-y:hidden;outline-width:0 !important;resize:none;width:100%;cursor:text;text-align:start;word-wrap:break-word;"])
});
const createButtonsStyles = props => createStyles({
  prefixClassNames: 'ThreadButtons',
  ...props
}, {
  root: css(["font-weight:normal;-webkit-tap-highlight-color:rgba(0,0,0,0);color:black;font-family:Roboto,RobotoDraft,Helvetica,Arial,sans-serif;white-space:normal;font-size:14px;cursor:pointer;direction:ltr;-webkit-user-select:text;zoom:1;text-align:left;padding-top:8px;display:block;"])
});
const createCommentButtonStyles = props => createStyles({
  prefixClassNames: 'ThreadCommentButton',
  ...props
}, {
  root: css(["-webkit-tap-highlight-color:rgba(0,0,0,0);direction:ltr;position:relative;display:inline-block;text-align:center;white-space:nowrap;outline:0px;margin:0 8px 0 0;min-width:24px;vertical-align:middle;border:1px solid transparent !important;border-radius:4px;box-shadow:none;box-sizing:border-box;font-family:Roboto,RobotoDraft,Helvetica,Arial,sans-serif;font-weight:500;font-size:14px;letter-spacing:0.25px;line-height:16px;height:24px;padding:3px 12px 5px;background-color:#1a73e8;color:#fff;user-select:none;cursor:pointer;&:hover{background-color:#2b7de9;box-shadow:0 1px 3px 1px rgb(66 133 244 / 15%);color:#fff;}&:active{background-color:#63a0ef;box-shadow:0 2px 6px 2px rgb(66 133 244 / 15%);color:#fff;}"])
});
const createCancelButtonStyles = props => createStyles({
  prefixClassNames: 'ThreadCommentButton',
  ...props
}, {
  root: css(["font-family:Roboto,RobotoDraft,Helvetica,Arial,sans-serif;-webkit-tap-highlight-color:rgba(0,0,0,0);direction:ltr;position:relative;display:inline-block;text-align:center;white-space:nowrap;outline:0px;margin:0 8px 0 0;min-width:24px;vertical-align:middle;border-radius:4px;box-shadow:none;box-sizing:border-box;font-weight:500;font-size:14px;letter-spacing:0.25px;line-height:16px;background:white;border:1px solid #dadce0 !important;height:24px;padding:3px 12px 5px;color:#1a73e8;user-select:none;cursor:pointer;&:hover{background-color:#f8fbff;border-color:#cce0fc !important;}&:active{background-color:#e1ecfe;color:#1a73e8;}&:hover:active{box-shadow:0 2px 6px 2px rgb(60 64 67 / 15%);}"])
});

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _extends_1$1 = createCommonjsModule(function (module) {
function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  module.exports["default"] = module.exports, module.exports.__esModule = true;
  return _extends.apply(this, arguments);
}

module.exports = _extends;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _extends$1 = unwrapExports(_extends_1$1);

var _extends_1 = createCommonjsModule(function (module) {
function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  module.exports["default"] = module.exports, module.exports.__esModule = true;
  return _extends.apply(this, arguments);
}

module.exports = _extends;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _extends = unwrapExports(_extends_1);

var defineProperty = createCommonjsModule(function (module) {
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _defineProperty = unwrapExports(defineProperty);

var objectWithoutPropertiesLoose = createCommonjsModule(function (module) {
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

module.exports = _objectWithoutPropertiesLoose;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(objectWithoutPropertiesLoose);

var objectWithoutProperties = createCommonjsModule(function (module) {
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

module.exports = _objectWithoutProperties;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _objectWithoutProperties = unwrapExports(objectWithoutProperties);

function memoize(fn) {
  var cache = {};
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|inert|itemProp|itemScope|itemType|itemID|itemRef|on|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

var index = memoize(function (prop) {
  return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111
  /* o */
  && prop.charCodeAt(1) === 110
  /* n */
  && prop.charCodeAt(2) < 91;
}
/* Z+1 */
);

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function isValidProp(key) {
  return index(key);
}

function filterSVGProps(props) {
  return Object.keys(props).reduce(function (p, k) {
    if (isValidProp(k)) {
      p[k] = props[k];
    }

    return p;
  }, {});
}

var StyledIconBaseBase = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var children = props.children,
      iconAttrs = props.iconAttrs;
      props.iconVerticalAlign;
      var iconViewBox = props.iconViewBox,
      size = props.size,
      title = props.title,
      otherProps = _objectWithoutProperties(props, ["children", "iconAttrs", "iconVerticalAlign", "iconViewBox", "size", "title"]);

  var iconProps = _objectSpread({
    viewBox: iconViewBox,
    height: props.height !== undefined ? props.height : size,
    width: props.width !== undefined ? props.width : size,
    'aria-hidden': title == null ? 'true' : undefined,
    focusable: 'false',
    role: title != null ? 'img' : undefined
  }, iconAttrs);

  var svgProps = filterSVGProps(otherProps);
  return /*#__PURE__*/React.createElement("svg", _extends({}, iconProps, svgProps, {
    ref: ref
  }), title && /*#__PURE__*/React.createElement("title", {
    key: "icon-title"
  }, title), children);
});
var StyledIconBase = /*#__PURE__*/_styled(StyledIconBaseBase).withConfig({
  displayName: "StyledIconBase",
  componentId: "ea9ulj-0"
})(["display:inline-block;vertical-align:", ";overflow:hidden;"], function (props) {
  return props.iconVerticalAlign;
});

var Check = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var attrs = {
    "fill": "currentColor",
    "xmlns": "http://www.w3.org/2000/svg"
  };
  return /*#__PURE__*/React.createElement(StyledIconBase, _extends$1({
    iconAttrs: attrs,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 24 24"
  }, props, {
    ref: ref
  }), /*#__PURE__*/React.createElement("path", {
    fill: "none",
    d: "M0 0h24v24H0z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
  }));
});
Check.displayName = 'Check';

var Unarchive = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var attrs = {
    "fill": "currentColor",
    "xmlns": "http://www.w3.org/2000/svg"
  };
  return /*#__PURE__*/React.createElement(StyledIconBase, _extends$1({
    iconAttrs: attrs,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 24 24"
  }, props, {
    ref: ref
  }), /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20.55 5.22l-1.39-1.68A1.51 1.51 0 0018 3H6c-.47 0-.88.21-1.15.55L3.46 5.22C3.17 5.57 3 6.01 3 6.5V19a2 2 0 002 2h14c1.1 0 2-.9 2-2V6.5c0-.49-.17-.93-.45-1.28zM12 9.5l5.5 5.5H14v2h-4v-2H6.5L12 9.5zM5.12 5l.82-1h12l.93 1H5.12z"
  }));
});
Unarchive.displayName = 'Unarchive';

var Close = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var attrs = {
    "fill": "currentColor",
    "xmlns": "http://www.w3.org/2000/svg"
  };
  return /*#__PURE__*/React.createElement(StyledIconBase, _extends$1({
    iconAttrs: attrs,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 24 24"
  }, props, {
    ref: ref
  }), /*#__PURE__*/React.createElement("path", {
    fill: "none",
    d: "M0 0h24v24H0z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
  }));
});
Close.displayName = 'Close';

const createCloseButtonStyles = props => createStyles({
  prefixClassNames: 'ThreadLinkDialogCloseButton',
  ...props
}, {
  root: css(["width:32px;height:32px;padding:7px;svg{position:relative;top:-6px;width:18px;height:18px;}"])
});

class ThreadLinkDialog extends React__default.Component {
  constructor(props) {
    super(props);
    this.ref = /*#__PURE__*/React__default.createRef();
    this.inputRef = /*#__PURE__*/React__default.createRef();
    this.snackbarRef = /*#__PURE__*/React__default.createRef();
    this.doneButtonRef = /*#__PURE__*/React__default.createRef();
    this.copyLinkButtonRef = /*#__PURE__*/React__default.createRef();
    this.onCopyLink = this.onCopyLink.bind(this);
    const {
      root: closeButton
    } = createCloseButtonStyles(props);
    this.closeButton = closeButton;
  }

  componentDidMount() {
    this.dialog = new MDCDialog(this.ref.current);
    new MDCRipple(this.doneButtonRef.current);
    new MDCRipple(this.copyLinkButtonRef.current);
    this.inputRef.current.select();
    this.snackbar = new MDCSnackbar(this.snackbarRef.current);
  }

  async onCopyLink() {
    const {
      threadLink
    } = this.props;
    await navigator.clipboard.writeText(threadLink);
    this.snackbar.open();
    this.inputRef.current.select();
  }

  render() {
    const {
      threadLink,
      onClose
    } = this.props;
    return /*#__PURE__*/ReactDOM.createPortal( /*#__PURE__*/React__default.createElement("div", {
      ref: this.ref,
      className: "mdc-dialog mdc-dialog--open mdc-dialog--fullscreen"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "mdc-dialog__container"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "mdc-dialog__surface",
      role: "alertdialog",
      "aria-modal": "true",
      "aria-labelledby": "comment-link-dialog-title",
      "aria-describedby": "comment-link-dialog-content"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "mdc-dialog__header"
    }, /*#__PURE__*/React__default.createElement("h2", {
      className: "mdc-dialog__title",
      id: "comment-link-dialog-title"
    }, "Link to thread"), /*#__PURE__*/React__default.createElement(_StyledButton$4, {
      type: "button",
      className: `${this.closeButton.className} mdc-icon-button mdc-dialog__close`,
      "data-mdc-dialog-action": "close",
      onClick: onClose,
      $_css: this.closeButton.css
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "mdc-icon-button__ripple"
    }), /*#__PURE__*/React__default.createElement(Close, null))), /*#__PURE__*/React__default.createElement("div", {
      className: "mdc-dialog__content",
      id: "comment-link-dialog-content"
    }, /*#__PURE__*/React__default.createElement("label", {
      className: "mdc-text-field mdc-text-field--outlined mdc-text-field--no-label",
      style: {
        width: '100%'
      }
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "mdc-notched-outline"
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "mdc-notched-outline__leading"
    }), /*#__PURE__*/React__default.createElement("span", {
      className: "mdc-notched-outline__trailing"
    })), /*#__PURE__*/React__default.createElement("input", {
      ref: this.inputRef,
      className: "mdc-text-field__input",
      type: "text",
      "aria-label": "Comment link",
      defaultValue: threadLink,
      readOnly: true
    })), /*#__PURE__*/React__default.createElement("aside", {
      ref: this.snackbarRef,
      className: "mdc-snackbar",
      style: {
        bottom: '0.5rem'
      }
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "mdc-snackbar__surface",
      role: "status",
      "aria-relevant": "additions"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "mdc-snackbar__label",
      "aria-atomic": "false"
    }, "The link has been copied to the clipboard.")))), /*#__PURE__*/React__default.createElement("div", {
      className: "mdc-dialog__actions"
    }, /*#__PURE__*/React__default.createElement("button", {
      ref: this.doneButtonRef,
      type: "button",
      className: "mdc-button mdc-dialog__button",
      "data-mdc-dialog-action": "done",
      onClick: onClose
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "mdc-button__ripple"
    }), /*#__PURE__*/React__default.createElement("span", {
      className: "mdc-button__label"
    }, "Done")), /*#__PURE__*/React__default.createElement("button", {
      ref: this.copyLinkButtonRef,
      type: "button",
      className: "mdc-button mdc-dialog__button",
      "data-mdc-dialog-action": "copy-link",
      onClick: this.onCopyLink
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "mdc-button__ripple"
    }), /*#__PURE__*/React__default.createElement("span", {
      className: "mdc-button__label"
    }, "Copy link"))))), /*#__PURE__*/React__default.createElement("div", {
      className: "mdc-dialog__scrim"
    })), document.body);
  }

}

var _StyledButton$4 = _styled("button").withConfig({
  displayName: "ThreadLinkDialog___StyledButton",
  componentId: "sc-c3g33i-0"
})(["", ""], p => p.$_css);

var MoreVert = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var attrs = {
    "fill": "currentColor",
    "xmlns": "http://www.w3.org/2000/svg"
  };
  return /*#__PURE__*/React.createElement(StyledIconBase, _extends$1({
    iconAttrs: attrs,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 24 24"
  }, props, {
    ref: ref
  }), /*#__PURE__*/React.createElement("path", {
    fill: "none",
    d: "M0 0h24v24H0z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
  }));
});
MoreVert.displayName = 'MoreVert';

function createMoreButtonStyles(props) {
  return createStyles({
    prefixClassNames: 'ThreadMoreButton',
    ...props
  }, {
    root: css(["padding:3px;width:30px;height:30px;& .mdc-icon-button__ripple::before,& .mdc-icon-button__ripple::after{border-radius:initial;}svg{position:relative;top:-3px;}"])
  });
}

class MenuButton extends React__default.Component {
  constructor(props) {
    super(props);
    this.ref = /*#__PURE__*/React__default.createRef();
    this.onClick = this.onClick.bind(this);
    const {
      root: button
    } = createMoreButtonStyles(props);
    this.button = button;
  }

  componentDidMount() {
    this.menu = new MDCMenu(this.ref.current);
  }

  onClick() {
    this.menu.open = !this.menu.open;
  }

  render() {
    const {
      showLinkToThisComment,
      onEdit,
      onDelete,
      onLinkToThisComment
    } = this.props;
    return /*#__PURE__*/React__default.createElement("div", {
      className: "mdc-menu-surface--anchor"
    }, /*#__PURE__*/React__default.createElement(_StyledButton$3, {
      type: "button",
      className: `${this.button.className} mdc-icon-button`,
      onClick: this.onClick,
      $_css: this.button.css
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "mdc-icon-button__ripple"
    }), /*#__PURE__*/React__default.createElement(MoreVert, null)), /*#__PURE__*/React__default.createElement("div", {
      ref: this.ref,
      className: "mdc-menu mdc-menu-surface"
    }, /*#__PURE__*/React__default.createElement("ul", {
      className: "mdc-list",
      role: "menu",
      "aria-hidden": "true",
      "aria-orientation": "vertical",
      tabIndex: -1
    }, /*#__PURE__*/React__default.createElement("li", {
      className: "mdc-list-item",
      role: "menuitem",
      onClick: onEdit
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "mdc-list-item__ripple"
    }), /*#__PURE__*/React__default.createElement("span", {
      className: "mdc-list-item__text"
    }, "Edit")), /*#__PURE__*/React__default.createElement("li", {
      className: "mdc-list-item",
      role: "menuitem",
      onClick: onDelete
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "mdc-list-item__ripple"
    }), /*#__PURE__*/React__default.createElement("span", {
      className: "mdc-list-item__text"
    }, "Delete")), /*#__PURE__*/React__default.createElement("li", {
      className: "mdc-list-item",
      role: "menuitem",
      onClick: onLinkToThisComment,
      style: {
        display: showLinkToThisComment ? 'block' : 'none'
      }
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "mdc-list-item__ripple"
    }), /*#__PURE__*/React__default.createElement("span", {
      className: "mdc-list-item__text"
    }, "Link to this thread")))));
  }

}

var _StyledButton$3 = _styled("button").withConfig({
  displayName: "MenuButton___StyledButton",
  componentId: "sc-rg6b9r-0"
})(["", ""], p => p.$_css);

function createThreadCommentStyled(props) {
  return createStyles({
    prefixClassNames: 'ThreadComment',
    ...props
  }, {
    root: css([""])
  });
}
function createResolveThreadButtonStyles(props) {
  return createStyles({
    prefixClassNames: 'ThreadResolveThreadButton',
    ...props
  }, {
    root: css(["padding:3px;width:30px;height:30px;& .mdc-icon-button__ripple::before,& .mdc-icon-button__ripple::after{border-radius:initial;}svg{position:relative;top:-3px;}"])
  });
}
function createReOpenThreadButtonStyles(props) {
  return createStyles({
    prefixClassNames: 'ThreadResolveThreadButton',
    ...props
  }, {
    root: css(["padding:3px;width:30px;height:30px;& .mdc-icon-button__ripple::before,& .mdc-icon-button__ripple::after{border-radius:initial;}svg{position:relative;top:-3px;}"])
  });
}
function createThreadCommentTextStyles(props) {
  return createStyles({
    prefixClassNames: 'ThreadCommentText',
    ...props
  }, {
    root: css(["padding-left:12px;padding-right:12px;font-family:Roboto,RobotoDraft,Helvetica,Arial,sans-serif;"])
  });
}

function ThreadCommentEditing({
  defaultText,
  onSave: onSaveCallback,
  onCancel,
  ...props
}) {
  const textAreaRef = useRef(null);
  const {
    root: commentInput
  } = createCommentInputStyles(props);
  const {
    root: textArea
  } = createTextAreaStyles(props);
  const {
    root: buttons
  } = createButtonsStyles(props);
  const {
    root: commentButton
  } = createCommentButtonStyles(props);
  const {
    root: cancelButton
  } = createCancelButtonStyles(props);
  const onSave = useCallback(function onSave() {
    onSaveCallback(textAreaRef.current.value);
  }, [onSaveCallback, textAreaRef]);
  useEffect(function focus() {
    textAreaRef.current.focus();
  }, [textAreaRef]);
  return /*#__PURE__*/React__default.createElement(_StyledDiv$4, {
    className: commentInput.className,
    $_css: commentInput.css
  }, /*#__PURE__*/React__default.createElement(_StyledTextarea$1, {
    ref: textAreaRef,
    rows: 1,
    className: textArea.className,
    defaultValue: defaultText,
    $_css2: textArea.css
  }), /*#__PURE__*/React__default.createElement(_StyledDiv2$3, {
    className: buttons.className,
    $_css3: buttons.css
  }, /*#__PURE__*/React__default.createElement(_StyledButton$2, {
    type: "button",
    className: commentButton.className,
    onClick: onSave,
    $_css4: commentButton.css
  }, "Save"), /*#__PURE__*/React__default.createElement(_StyledButton2$2, {
    type: "button",
    className: cancelButton.className,
    onClick: onCancel,
    $_css5: cancelButton.css
  }, "Cancel")));
}

var _StyledDiv$4 = _styled("div").withConfig({
  displayName: "ThreadCommentEditing___StyledDiv",
  componentId: "sc-1g46kk-0"
})(["", ""], p => p.$_css);

var _StyledTextarea$1 = _styled("textarea").withConfig({
  displayName: "ThreadCommentEditing___StyledTextarea",
  componentId: "sc-1g46kk-1"
})(["", ""], p => p.$_css2);

var _StyledDiv2$3 = _styled("div").withConfig({
  displayName: "ThreadCommentEditing___StyledDiv2",
  componentId: "sc-1g46kk-2"
})(["", ""], p => p.$_css3);

var _StyledButton$2 = _styled("button").withConfig({
  displayName: "ThreadCommentEditing___StyledButton",
  componentId: "sc-1g46kk-3"
})(["", ""], p => p.$_css4);

var _StyledButton2$2 = _styled("button").withConfig({
  displayName: "ThreadCommentEditing___StyledButton2",
  componentId: "sc-1g46kk-4"
})(["", ""], p => p.$_css5);

function ThreadComment(props) {
  const {
    comment,
    thread,
    showResolveThreadButton,
    showReOpenThreadButton,
    showMoreButton,
    showLinkToThisComment,
    onSaveComment,
    onResolveThread,
    onReOpenThread,
    onDelete: onDeleteCallback
  } = props;
  const [isEdited, setIsEdited] = useState(false);
  const {
    root
  } = createThreadCommentStyled(props);
  const {
    root: commentHeader
  } = createCommentHeaderStyles(props);
  const {
    root: avatarHolder
  } = createAvatarHolderStyles(props);
  const {
    root: commentProfileImage
  } = createCommentProfileImageStyles(props);
  const {
    root: authorTimestamp
  } = createAuthorTimestampStyles(props);
  const {
    root: commenterName
  } = createCommenterNameStyles(props);
  const {
    root: timestamp
  } = createTimestampStyles(props);
  const {
    root: resolveThreadButton
  } = createResolveThreadButtonStyles(props);
  const {
    root: reOpenThreadButton
  } = createReOpenThreadButtonStyles(props);
  const {
    root: threadCommentText
  } = createThreadCommentTextStyles(props);
  const [threadLink, setThreadLink] = useState(null);
  const onEdit = useCallback(function onEdit() {
    setIsEdited(true);
  }, []);
  const onDelete = useCallback(function onDelete() {
    onDeleteCallback(comment);
  }, [comment, onDeleteCallback]);
  const onLinkToThisComment = useCallback(function onLinkToThisComment() {
    setThreadLink(generateThreadLink(thread));
  }, [thread]);
  const onCloseCommentLinkDialog = useCallback(function onCloseCommentLinkDialog() {
    setThreadLink(null);
  }, []);
  const onSave = useCallback(function onSave(text) {
    setIsEdited(false);
    onSaveComment({ ...comment,
      text
    });
  }, [comment, onSaveComment]);
  const onCancel = useCallback(function onCancel() {
    setIsEdited(false);
  }, []);
  return /*#__PURE__*/React__default.createElement(_StyledDiv$3, {
    className: root.className,
    $_css: root.css
  }, /*#__PURE__*/React__default.createElement(_StyledDiv2$2, {
    className: commentHeader.className,
    $_css2: commentHeader.css
  }, /*#__PURE__*/React__default.createElement(_StyledDiv3$2, {
    className: avatarHolder.className,
    $_css3: avatarHolder.css
  }, /*#__PURE__*/React__default.createElement(_StyledImg$1, {
    src: "https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg",
    alt: "Profile",
    width: 32,
    height: 32,
    className: commentProfileImage.className,
    $_css4: commentProfileImage.css
  })), /*#__PURE__*/React__default.createElement(_StyledDiv4$1, {
    className: authorTimestamp.className,
    $_css5: authorTimestamp.css
  }, /*#__PURE__*/React__default.createElement(_StyledDiv5$1, {
    className: commenterName.className,
    $_css6: commenterName.css
  }, "Jon Doe"), /*#__PURE__*/React__default.createElement(_StyledDiv6$1, {
    className: timestamp.className,
    $_css7: timestamp.css
  }, new Date(comment.createdAt).toLocaleString())), showResolveThreadButton ? /*#__PURE__*/React__default.createElement(_StyledButton$1, {
    type: "button",
    className: `${resolveThreadButton.className} mdc-icon-button`,
    onClick: onResolveThread,
    $_css8: resolveThreadButton.css
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "mdc-icon-button__ripple"
  }), /*#__PURE__*/React__default.createElement(Check, {
    style: {
      color: '#2196f3'
    }
  })) : null, showReOpenThreadButton ? /*#__PURE__*/React__default.createElement(_StyledButton2$1, {
    type: "button",
    className: `${reOpenThreadButton.className} mdc-icon-button`,
    onClick: onReOpenThread,
    $_css9: reOpenThreadButton.css
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "mdc-icon-button__ripple"
  }), /*#__PURE__*/React__default.createElement(Unarchive, null)) : null, showMoreButton ? /*#__PURE__*/React__default.createElement(MenuButton, {
    showLinkToThisComment: showLinkToThisComment,
    onEdit: onEdit,
    onDelete: onDelete,
    onLinkToThisComment: onLinkToThisComment
  }) : null), isEdited ? /*#__PURE__*/React__default.createElement(ThreadCommentEditing, {
    defaultText: comment.text,
    onSave: onSave,
    onCancel: onCancel
  }) : /*#__PURE__*/React__default.createElement(_StyledDiv7$1, {
    className: threadCommentText.className,
    $_css10: threadCommentText.css
  }, comment.text), threadLink ? /*#__PURE__*/React__default.createElement(ThreadLinkDialog, {
    threadLink: threadLink,
    onClose: onCloseCommentLinkDialog
  }) : null);
}

var _StyledDiv$3 = _styled("div").withConfig({
  displayName: "ThreadComment___StyledDiv",
  componentId: "sc-19i857g-0"
})(["", ""], p => p.$_css);

var _StyledDiv2$2 = _styled("div").withConfig({
  displayName: "ThreadComment___StyledDiv2",
  componentId: "sc-19i857g-1"
})(["", ""], p => p.$_css2);

var _StyledDiv3$2 = _styled("div").withConfig({
  displayName: "ThreadComment___StyledDiv3",
  componentId: "sc-19i857g-2"
})(["", ""], p => p.$_css3);

var _StyledImg$1 = _styled("img").withConfig({
  displayName: "ThreadComment___StyledImg",
  componentId: "sc-19i857g-3"
})(["", ""], p => p.$_css4);

var _StyledDiv4$1 = _styled("div").withConfig({
  displayName: "ThreadComment___StyledDiv4",
  componentId: "sc-19i857g-4"
})(["", ""], p => p.$_css5);

var _StyledDiv5$1 = _styled("div").withConfig({
  displayName: "ThreadComment___StyledDiv5",
  componentId: "sc-19i857g-5"
})(["", ""], p => p.$_css6);

var _StyledDiv6$1 = _styled("div").withConfig({
  displayName: "ThreadComment___StyledDiv6",
  componentId: "sc-19i857g-6"
})(["", ""], p => p.$_css7);

var _StyledButton$1 = _styled("button").withConfig({
  displayName: "ThreadComment___StyledButton",
  componentId: "sc-19i857g-7"
})(["", ""], p => p.$_css8);

var _StyledButton2$1 = _styled("button").withConfig({
  displayName: "ThreadComment___StyledButton2",
  componentId: "sc-19i857g-8"
})(["", ""], p => p.$_css9);

var _StyledDiv7$1 = _styled("div").withConfig({
  displayName: "ThreadComment___StyledDiv7",
  componentId: "sc-19i857g-9"
})(["", ""], p => p.$_css10);

function Thread({
  thread,
  showResolveThreadButton,
  showReOpenThreadButton,
  showMoreButton,
  onSaveComment,
  onSubmitComment: onSubmitCommentCallback,
  onCancelCreateThread,
  fetchContacts,
  ...props
}) {
  const editor = usePlateEditorRef();
  const textAreaRef = useRef(null);
  const [areContactsShown, setAreContactsShown] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts2] = useState([]);
  const [haveContactsBeenClosed, setHaveContactsBeenClosed] = useState(false);
  const [selectedContactIndex, setSelectedContactIndex] = useState(0);
  const retrieveMentionStringAtCaretPosition = useCallback(function retrieveMentionStringAtCaretPosition() {
    const textArea = textAreaRef.current;

    function isMentionStringNextToCaret(indexOfLastCharacterOfMentionString) {
      return indexOfLastCharacterOfMentionString > textArea.selectionStart || textArea.selectionStart - indexOfLastCharacterOfMentionString === 1;
    }

    const {
      value
    } = textArea;
    const mentionStringStartIndex = value.substr(0, textArea.selectionStart).indexOf('@');

    if (mentionStringStartIndex !== -1) {
      const mentionRegExp = /@(?:\w+ ?\w* ?)?/;
      const match = mentionRegExp.exec(value);

      if (match) {
        const indexOfLastCharacterOfMentionString = mentionRegExp.lastIndex + match[0].length - 1;

        if (isMentionStringNextToCaret(indexOfLastCharacterOfMentionString)) {
          const mentionString = match[0].trim();
          const mentionStringEndIndex = mentionStringStartIndex + mentionString.length;
          return {
            string: mentionString,
            startIndex: mentionStringStartIndex,
            endIndex: mentionStringEndIndex
          };
        }
      }
    }

    return null;
  }, [textAreaRef]);
  const retrieveMentionStringAfterAtCharacter = useCallback(function retrieveMentionStringAfterAtCharacter() {
    const mentionString = retrieveMentionStringAtCaretPosition();
    return mentionString ? mentionString.string.substr(1) : null;
  }, [retrieveMentionStringAtCaretPosition]);
  const filterContacts = useCallback(function filterContacts(contacts2) {
    const mentionStringAfterAtCharacter = retrieveMentionStringAfterAtCharacter();
    let newFilteredContacts;

    if (mentionStringAfterAtCharacter) {
      newFilteredContacts = contacts2.filter(doesContactMatchString.bind(null, mentionStringAfterAtCharacter));
    } else {
      newFilteredContacts = contacts2;
    }

    return newFilteredContacts;
  }, [retrieveMentionStringAfterAtCharacter]);
  const setFilteredContacts = useCallback(function setFilteredContacts(filteredContacts2) {
    setFilteredContacts2(filteredContacts2);
    setSelectedContactIndex(Math.min(selectedContactIndex, filteredContacts2.length - 1));
  }, [selectedContactIndex]);
  const updateFilteredContacts = useCallback(function updateFilteredContacts() {
    setFilteredContacts(filterContacts(contacts));
  }, [contacts, filterContacts, setFilteredContacts]);
  const onSubmitComment = useCallback(function onSubmitComment() {
    const newComment = {
      id: Math.floor(Math.random() * 1000),
      // FIXME
      text: textAreaRef.current.value,
      createdAt: Date.now()
    };
    onSubmitCommentCallback(newComment);
  }, [onSubmitCommentCallback]);
  const hasComments = useCallback(function hasComments() {
    return thread.comments.length >= 1;
  }, [thread]);
  const clearTextArea = useCallback(function clearTextArea() {
    textAreaRef.current.value = '';
  }, [textAreaRef]);
  const onCancel = useCallback(function onCancel() {
    if (hasComments()) {
      clearTextArea();
    }

    onCancelCreateThread();
  }, [hasComments, onCancelCreateThread, clearTextArea]);
  const onResolveThread = useCallback(function onResolveThread() {
    const newThread = { ...thread,
      isResolved: true
    };
    upsertThreadAtSelection(editor, newThread);
  }, [editor, thread]);
  const onReOpenThread = useCallback(function onReOpenThread() {
    thread.isResolved = false;
    const threadNodeEntry = Array.from(findThreadNodeEntries(editor)).find(threadNodeEntry2 => threadNodeEntry2[0].thread === thread);

    if (threadNodeEntry) {
      Transforms.setNodes(editor, {
        thread: { ...thread
        }
      }, {
        at: threadNodeEntry[1]
      });
    }
  }, [editor, thread]);
  const deleteThread = useCallback(function deleteThread() {
    deleteThreadAtSelection(editor);
  }, [editor]);
  const deleteComment = useCallback(function deleteComment(comment) {
    thread.comments = thread.comments.filter(comment2 => comment2 !== comment);
    upsertThreadAtSelection(editor, thread);
  }, [editor, thread]);
  const onDelete = useCallback(function onDelete(comment) {
    if (isFirstComment(thread, comment)) {
      deleteThread();
    } else {
      deleteComment(comment);
    }
  }, [deleteComment, deleteThread, thread]);
  const showContacts = useCallback(function showContacts() {
    if (!haveContactsBeenClosed) {
      setAreContactsShown(true);
    }
  }, [haveContactsBeenClosed]);
  const hideContacts = useCallback(function hideContacts() {
    setAreContactsShown(false);
    setSelectedContactIndex(0);
  }, []);
  const insertMention = useCallback(function insertMention(mentionedContact) {
    const mentionString = retrieveMentionStringAtCaretPosition();

    if (mentionString) {
      const textArea = textAreaRef.current;
      const {
        value
      } = textArea;
      const mentionInsertString = `@${mentionedContact.email} `;
      textArea.value = `${value.substr(0, mentionString.startIndex)}${mentionInsertString}${value.substr(mentionString.endIndex + 1)}`;
      const selectionIndex = mentionString.startIndex + mentionInsertString.length;
      textArea.focus();
      textArea.setSelectionRange(selectionIndex, selectionIndex);
    }
  }, [retrieveMentionStringAtCaretPosition]);
  const onContactSelected = useCallback(function onContactSelected(selectedContact) {
    hideContacts();
    insertMention(selectedContact);
  }, [insertMention, hideContacts]);
  const onKeyDown = useCallback(function onKeyDown(event) {
    if (event.key === '@' && !areContactsShown) {
      showContacts();
    }

    if (event.code === 'ArrowUp') {
      event.preventDefault();
      setSelectedContactIndex(Math.max(0, selectedContactIndex - 1));
    } else if (event.code === 'ArrowDown') {
      setSelectedContactIndex(Math.min(selectedContactIndex + 1, filteredContacts.length - 1));
    } else if (event.code === 'Enter') {
      const selectedContact = filteredContacts[selectedContactIndex];
      onContactSelected(selectedContact);
      event.preventDefault();
    }
  }, [areContactsShown, showContacts, selectedContactIndex, filteredContacts, onContactSelected]);
  const onKeyUp = useCallback(function onKeyUp() {
    setHaveContactsBeenClosed(false);
    updateFilteredContacts();
    const mentionStringAfterAtCharacter = retrieveMentionStringAfterAtCharacter();

    if (mentionStringAfterAtCharacter !== null && (mentionStringAfterAtCharacter === '' || contacts.some(doesContactMatchString.bind(null, mentionStringAfterAtCharacter)))) {
      if (!areContactsShown) {
        showContacts();
      }
    } else {
      hideContacts();
    }
  }, [updateFilteredContacts, retrieveMentionStringAfterAtCharacter, contacts, areContactsShown, showContacts, hideContacts]);
  const onContactsClosed = useCallback(function onContactsClosed() {
    setHaveContactsBeenClosed(true);
  }, []);
  useEffect(function onShow() {
    const textArea = textAreaRef.current;
    textArea.value = '';

    if (thread.comments.length === 0) {
      textArea.focus();
    }
  }, [textAreaRef, thread]);
  useEffect(function loadContacts() {
    async function loadContacts2() {
      const contacts2 = await fetchContacts();
      setContacts(contacts2);
      setFilteredContacts(filterContacts(contacts2));
    }

    loadContacts2();
  }, [fetchContacts, filterContacts, setFilteredContacts]);
  const {
    root
  } = createThreadStyles(props);
  const {
    root: commentHeader
  } = createCommentHeaderStyles(props);
  const {
    root: avatarHolder
  } = createAvatarHolderStyles(props);
  const {
    root: commentProfileImage
  } = createCommentProfileImageStyles(props);
  const {
    root: authorTimestamp
  } = createAuthorTimestampStyles(props);
  const {
    root: commenterName
  } = createCommenterNameStyles(props);
  const {
    root: commentInput,
    commentInputReply
  } = createCommentInputStyles(props);
  const {
    root: textArea
  } = createTextAreaStyles(props);
  const {
    root: buttons
  } = createButtonsStyles(props);
  const {
    root: commentButton
  } = createCommentButtonStyles(props);
  const {
    root: cancelButton
  } = createCancelButtonStyles(props);
  let commentInputCss = [...commentInput.css];
  let commentInputClassName = commentInput.className;

  if (hasComments()) {
    commentInputCss = commentInputCss.concat(commentInputReply.css);
    commentInputClassName += ` ${commentInputReply.className}`;
  }

  return /*#__PURE__*/React__default.createElement(_StyledDiv$2, {
    className: root.className,
    $_css: root.css
  }, thread.comments.map((comment, index) => /*#__PURE__*/React__default.createElement(ThreadComment, {
    key: comment.id,
    comment: comment,
    thread: thread,
    showResolveThreadButton: showResolveThreadButton && index === 0,
    showReOpenThreadButton: showReOpenThreadButton,
    showMoreButton: showMoreButton,
    showLinkToThisComment: index === 0,
    onSaveComment: onSaveComment,
    onResolveThread: onResolveThread,
    onReOpenThread: onReOpenThread,
    onDelete: onDelete
  })), /*#__PURE__*/React__default.createElement("div", null, !hasComments() && /*#__PURE__*/React__default.createElement(_StyledDiv2$1, {
    className: commentHeader.className,
    $_css2: commentHeader.css
  }, /*#__PURE__*/React__default.createElement(_StyledDiv3$1, {
    className: avatarHolder.className,
    $_css3: avatarHolder.css
  }, /*#__PURE__*/React__default.createElement(_StyledImg, {
    src: "https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg",
    alt: "Profile",
    width: 32,
    height: 32,
    className: commentProfileImage.className,
    $_css4: commentProfileImage.css
  })), /*#__PURE__*/React__default.createElement(_StyledDiv4, {
    className: authorTimestamp.className,
    $_css5: authorTimestamp.css
  }, /*#__PURE__*/React__default.createElement(_StyledDiv5, {
    className: commenterName.className,
    $_css6: commenterName.css
  }, "Jon Doe"))), /*#__PURE__*/React__default.createElement(_StyledDiv6, {
    className: commentInputClassName,
    $_css7: commentInputCss
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "mdc-menu-surface--anchor"
  }, /*#__PURE__*/React__default.createElement(_StyledTextarea, {
    ref: textAreaRef,
    rows: 1,
    className: textArea.className,
    onKeyDown: onKeyDown,
    onKeyUp: onKeyUp,
    placeholder: `${hasComments() ? 'Reply' : 'Comment'} or add others with @`,
    $_css8: textArea.css
  }), areContactsShown && /*#__PURE__*/React__default.createElement(Contacts, {
    contacts: filteredContacts,
    onSelected: onContactSelected,
    onClosed: onContactsClosed,
    selectedIndex: selectedContactIndex
  })), /*#__PURE__*/React__default.createElement(_StyledDiv7, {
    className: buttons.className,
    $_css9: buttons.css
  }, /*#__PURE__*/React__default.createElement(_StyledButton, {
    type: "button",
    className: commentButton.className,
    onClick: onSubmitComment,
    $_css10: commentButton.css
  }, thread.comments.length === 0 ? 'Comment' : 'Reply'), /*#__PURE__*/React__default.createElement(_StyledButton2, {
    type: "button",
    className: cancelButton.className,
    onClick: onCancel,
    $_css11: cancelButton.css
  }, "Cancel")))));
}

var _StyledDiv$2 = _styled("div").withConfig({
  displayName: "Thread___StyledDiv",
  componentId: "sc-73l5zt-0"
})(["", ""], p => p.$_css);

var _StyledDiv2$1 = _styled("div").withConfig({
  displayName: "Thread___StyledDiv2",
  componentId: "sc-73l5zt-1"
})(["", ""], p => p.$_css2);

var _StyledDiv3$1 = _styled("div").withConfig({
  displayName: "Thread___StyledDiv3",
  componentId: "sc-73l5zt-2"
})(["", ""], p => p.$_css3);

var _StyledImg = _styled("img").withConfig({
  displayName: "Thread___StyledImg",
  componentId: "sc-73l5zt-3"
})(["", ""], p => p.$_css4);

var _StyledDiv4 = _styled("div").withConfig({
  displayName: "Thread___StyledDiv4",
  componentId: "sc-73l5zt-4"
})(["", ""], p => p.$_css5);

var _StyledDiv5 = _styled("div").withConfig({
  displayName: "Thread___StyledDiv5",
  componentId: "sc-73l5zt-5"
})(["", ""], p => p.$_css6);

var _StyledDiv6 = _styled("div").withConfig({
  displayName: "Thread___StyledDiv6",
  componentId: "sc-73l5zt-6"
})(["", ""], p => p.$_css7);

var _StyledTextarea = _styled("textarea").withConfig({
  displayName: "Thread___StyledTextarea",
  componentId: "sc-73l5zt-7"
})(["", ""], p => p.$_css8);

var _StyledDiv7 = _styled("div").withConfig({
  displayName: "Thread___StyledDiv7",
  componentId: "sc-73l5zt-8"
})(["", ""], p => p.$_css9);

var _StyledButton = _styled("button").withConfig({
  displayName: "Thread___StyledButton",
  componentId: "sc-73l5zt-9"
})(["", ""], p => p.$_css10);

var _StyledButton2 = _styled("button").withConfig({
  displayName: "Thread___StyledButton2",
  componentId: "sc-73l5zt-10"
})(["", ""], p => p.$_css11);

const createThreadsStyles = props => createStyles({
  prefixClassNames: 'Threads',
  ...props
}, {
  root: css(["background-color:white;border-radius:8px;width:24rem;height:24rem;position:absolute;box-shadow:rgba(0,0,0,0.2) 0px 2px 4px 0px;display:flex;flex-direction:column;"])
});
const createHeaderStyles = props => createStyles({
  prefixClassNames: 'ThreadsHeader',
  ...props
}, {
  root: css(["border-bottom:1px solid rgb(218,220,224);padding:1rem;flex:0 0 auto;h2{font-family:Roboto,RobotoDraft,Helvetica,Arial,sans-serif;font-weight:500;font-size:1rem;margin-top:0;margin-bottom:0;}"])
});
const createBodyStyles = props => createStyles({
  prefixClassNames: 'ThreadsBody',
  ...props
}, {
  root: css(["flex:1 1 auto;padding:1rem;overflow-y:auto;& > *{margin-bottom:1rem;}& > *:last-child{margin-bottom:0;}"])
});

function wasClickOnTargetInsideThreads(event) {
  const closestThreadsParent = event.target && event.target.closest && event.target.closest('.threads');
  return Boolean(closestThreadsParent);
}

function Threads(props) {
  const editor = usePlateEditorRef();
  const {
    parent,
    onClose,
    fetchContacts
  } = props;
  const ref = useRef(null);
  const [position, setPosition] = useState(null);
  useEffect(function () {
    const parentElement = parent.current;
    const newPosition = determineAbsolutePosition(parentElement);
    newPosition.top += parentElement.clientHeight;
    newPosition.left = newPosition.left - 0.5 * ref.current.clientWidth + 0.5 * parentElement.clientWidth;
    setPosition(newPosition);
  }, [parent]);
  const {
    root
  } = createThreadsStyles(props);
  const {
    root: header
  } = createHeaderStyles(props);
  const {
    root: body
  } = createBodyStyles(props);
  const threadNodeEntries = Array.from(findThreadNodeEntries(editor));
  const threads = threadNodeEntries.map(threadNodeEntry => threadNodeEntry[0].thread);
  const resolvedThreads = threads.filter(thread => thread.isResolved);
  const onClick = useCallback(function onClick(event) {
    if (!wasClickOnTargetInsideThreads(event)) {
      onClose();
    }
  }, [onClose]);
  useEffect(function registerOnClick() {
    let isMounted = true;
    setTimeout(() => {
      if (isMounted) {
        document.body.addEventListener('click', onClick);
      }
    }, 400);
    return () => {
      document.body.removeEventListener('click', onClick);
      isMounted = false;
    };
  }, [onClick]);
  return /*#__PURE__*/ReactDOM.createPortal( /*#__PURE__*/React__default.createElement(_StyledDiv$1, {
    ref: ref,
    className: `${root.className} threads`,
    style: { ...position
    },
    $_css: root.css
  }, /*#__PURE__*/React__default.createElement(_StyledDiv2, {
    className: header.className,
    $_css2: header.css
  }, /*#__PURE__*/React__default.createElement("h2", null, "Resolved threads")), /*#__PURE__*/React__default.createElement(_StyledDiv3, {
    className: body.className,
    $_css3: body.css
  }, resolvedThreads.map(thread => {
    return /*#__PURE__*/React__default.createElement(Thread, {
      key: thread.id,
      thread: thread,
      onSaveComment: () => {},
      onSubmitComment: () => {},
      onCancelCreateThread: () => {},
      showResolveThreadButton: false,
      showReOpenThreadButton: true,
      showMoreButton: false,
      fetchContacts: fetchContacts
    });
  }))), document.body);
}

var _StyledDiv$1 = _styled("div").withConfig({
  displayName: "Threads___StyledDiv",
  componentId: "sc-1bdnddb-0"
})(["", ""], p => p.$_css);

var _StyledDiv2 = _styled("div").withConfig({
  displayName: "Threads___StyledDiv2",
  componentId: "sc-1bdnddb-1"
})(["", ""], p => p.$_css2);

var _StyledDiv3 = _styled("div").withConfig({
  displayName: "Threads___StyledDiv3",
  componentId: "sc-1bdnddb-2"
})(["", ""], p => p.$_css3);

const ToggleShowThreadsButton = withPlateEventProvider(({
  id,
  onAddThread,
  fetchContacts,
  ...props
}) => {
  id = useEventPlateId(id);
  const editor = usePlateEditorState(id);
  const ref = useRef(null);
  const [areThreadsShown, setAreThreadsShown] = useState(false);
  const toggleShowThreads = useCallback(function showThreads() {
    setAreThreadsShown(!areThreadsShown);
  }, [areThreadsShown]);
  const onCloseThreads = useCallback(function onCloseThreads() {
    setAreThreadsShown(false);
  }, []);
  return /*#__PURE__*/React__default.createElement("div", {
    ref: ref
  }, /*#__PURE__*/React__default.createElement(ToolbarButton, _extends$2({
    active: areThreadsShown,
    onMouseDown: event => {
      if (!editor) {
        return;
      }

      event.preventDefault();
      toggleShowThreads();
    }
  }, props)), areThreadsShown ? /*#__PURE__*/React__default.createElement(Threads, {
    parent: ref,
    onClose: onCloseThreads,
    fetchContacts: fetchContacts
  }) : null);
});

const createThreadElementStyles = props => createStyles({
  prefixClassNames: 'ThreadElement',
  ...props
}, {
  root: css(["background-color:#fee9ae;"]),
  selected: css(["background-color:#fcc934;"]),
  resolved: css(["background-color:initial !important;"])
});

function determineStyle(element, thread, props) {
  let style = null;
  const {
    root,
    selected,
    resolved
  } = createThreadElementStyles(props);

  if (thread.isResolved) {
    style = resolved;
  } else if (element.selected) {
    style = selected;
  } else {
    style = root;
  }

  return style;
}

const ThreadElement = props => {
  const {
    attributes,
    children,
    nodeProps,
    element
  } = props;
  const {
    thread
  } = element;
  const rootProps = getRootProps(props);
  const style = determineStyle(element, thread, props);
  return /*#__PURE__*/React__default.createElement(_StyledSpan, _extends$2({}, attributes, {
    className: style.className
  }, rootProps, nodeProps, {
    $_css: style.css
  }), children);
};

var _StyledSpan = _styled("span").withConfig({
  displayName: "ThreadElement___StyledSpan",
  componentId: "sc-1assa2q-0"
})(["", ""], p => p.$_css);

const createSideThreadStyles = props => createStyles({
  prefixClassNames: 'SideThread',
  ...props
}, {
  root: css(["position:absolute;z-index:6;width:418px;"])
});

function SideThread({
  position,
  ...props
}) {
  const {
    root
  } = createSideThreadStyles(props);
  return /*#__PURE__*/ReactDOM.createPortal( /*#__PURE__*/React__default.createElement(_StyledDiv, {
    className: root.className,
    style: {
      left: position.left,
      top: position.top
    },
    $_css: root.css
  }, /*#__PURE__*/React__default.createElement(Thread, _extends$2({}, props, {
    showResolveThreadButton: true,
    showReOpenThreadButton: false,
    showMoreButton: true
  }))), document.body);
}

var _StyledDiv = _styled("div").withConfig({
  displayName: "SideThread___StyledDiv",
  componentId: "sc-di7ox7-0"
})(["", ""], p => p.$_css);

function replaceElement(elements, newElement, doesMatch) {
  return elements.map(element => doesMatch(element, newElement) ? newElement : element);
}

function doBothElementsHaveTheSameId(elementA, elementB) {
  return elementA.id === elementB.id;
}

function replaceElementMatchingById(elements, newElement) {
  return replaceElement(elements, newElement, doBothElementsHaveTheSameId);
}

function replaceComment(comments, newComment) {
  return replaceElementMatchingById(comments, newComment);
}

function useComments() {
  const editor = usePlateEditorState();
  const [thread, setThread] = useState(null);
  const [threadPosition, setThreadPosition] = useState({
    left: 0,
    top: 0
  });
  const [newThreadThreadNodeEntry, setNewThreadThreadNodeEntry] = useState(null);
  const updateThreadPosition = useCallback(function updateThreadPosition(threadNodeEntry) {
    const selectionDOMNode = ReactEditor.toDOMNode(editor, threadNodeEntry[0]);
    const selectionDOMNodePosition = determineAbsolutePosition(selectionDOMNode);
    const editorDOMNode = ReactEditor.toDOMNode(editor, editor);
    const {
      x: editorX,
      width: editorWidth
    } = editorDOMNode.getBoundingClientRect();
    const newThreadPosition = {
      left: editorX + editorWidth + 16,
      top: selectionDOMNodePosition.top
    };
    setThreadPosition(newThreadPosition);
  }, [editor]);
  const showThread = useCallback(function showThread(threadNodeEntry) {
    const {
      thread: selectedThread
    } = threadNodeEntry[0];
    requestAnimationFrame(() => {
      updateThreadPosition(threadNodeEntry);
      setThread(selectedThread);
    });
  }, [updateThreadPosition]);
  const hideThread = useCallback(function hideThread() {
    setThread(null);
  }, []);
  const onCancelCreateThread = useCallback(function onCancelCreateThread() {
    if (newThreadThreadNodeEntry) {
      deleteThread(editor, newThreadThreadNodeEntry[1]);
      setNewThreadThreadNodeEntry(null);
    }
  }, [editor, newThreadThreadNodeEntry]);
  useEffect(function handleThreadIdInURL() {
    const url = new URL(window.location.href);
    const threadIdQueryParam = url.searchParams.get('thread');

    if (threadIdQueryParam) {
      const threadId = parseInt(threadIdQueryParam, 10);
      const threadNodeEntries = Array.from(findThreadNodeEntries(editor));
      const threadNodeEntry = threadNodeEntries.find(threadNodeEntry2 => threadNodeEntry2[0].thread.id === threadId);

      if (threadNodeEntry) {
        ReactEditor.focus(editor);
        Transforms.select(editor, threadNodeEntry[1]);
        Transforms.collapse(editor, {
          edge: 'start'
        });
        showThread(threadNodeEntry);
        const domNode = ReactEditor.toDOMNode(editor, threadNodeEntry[0]);
        domNode.scrollIntoView();
        window.addEventListener('load', () => {
          updateThreadPosition(threadNodeEntry);
        });
      }
    }
  }, [editor, showThread, updateThreadPosition]);
  useEffect(function onSelectionChange() {
    const type = getPluginType(editor, ELEMENT_THREAD); // FIXME: Show thread when putting caret before the first character of the text with which the thread is connected.

    const threadNodeEntry = getAbove(editor, {
      match: {
        type
      }
    });
    const isThreadNodeTheNewThreadNode = threadNodeEntry && newThreadThreadNodeEntry && threadNodeEntry[0].id === newThreadThreadNodeEntry[0].id;

    if (!isThreadNodeTheNewThreadNode) {
      onCancelCreateThread();
    }

    if (threadNodeEntry && !threadNodeEntry[0].thread.isResolved) {
      showThread(threadNodeEntry);
    } else {
      hideThread();
    }
  }, [showThread, hideThread, editor, editor.selection, newThreadThreadNodeEntry, onCancelCreateThread]);
  const onAddThread = useCallback(function onAddThread() {
    if (editor.selection) {
      const newThread = {
        id: Math.floor(Math.random() * 1000),
        // FIXME
        comments: [],
        isResolved: false
      };
      const newThreadThreadNodeEntry2 = upsertThreadAtSelection(editor, newThread);
      setNewThreadThreadNodeEntry(newThreadThreadNodeEntry2);
    }
  }, [editor]);
  const updateThread = useCallback(function updateThread(newThread) {
    upsertThreadAtSelection(editor, newThread);
    setNewThreadThreadNodeEntry(null);
    setThread(null);
  }, [editor]);
  const onSaveComment = useCallback(function onSaveComment(comment) {
    const newThread = { ...thread,
      comments: replaceComment(thread.comments, comment)
    };
    updateThread(newThread);
  }, [thread, updateThread]);
  const onSubmitComment = useCallback(function onSubmitComment(comment) {
    const newThread = { ...thread,
      comments: [...thread.comments, comment]
    };
    updateThread(newThread);
  }, [thread, updateThread]);
  return {
    thread,
    position: threadPosition,
    onAddThread,
    onSaveComment,
    onSubmitComment,
    onCancelCreateThread
  };
}

export { AddThreadToolbarButton, SideThread, ThreadElement, ToggleShowThreadsButton, createSideThreadStyles, createThreadElementStyles, determineAbsolutePosition, useComments };
//# sourceMappingURL=index.es.js.map