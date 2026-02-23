(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value2) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
  var __spreadValues = (a3, b2) => {
    for (var prop in b2 || (b2 = {}))
      if (__hasOwnProp.call(b2, prop))
        __defNormalProp(a3, prop, b2[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b2)) {
        if (__propIsEnum.call(b2, prop))
          __defNormalProp(a3, prop, b2[prop]);
      }
    return a3;
  };
  var __spreadProps = (a3, b2) => __defProps(a3, __getOwnPropDescs(b2));
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __esm = (fn2, res) => function __init() {
    return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/preact/dist/preact.module.js
  function w(n2, l3) {
    for (var u3 in l3) n2[u3] = l3[u3];
    return n2;
  }
  function g(n2) {
    n2 && n2.parentNode && n2.parentNode.removeChild(n2);
  }
  function _(l3, u3, t3) {
    var i3, o3, r3, e3 = {};
    for (r3 in u3) "key" == r3 ? i3 = u3[r3] : "ref" == r3 ? o3 = u3[r3] : e3[r3] = u3[r3];
    if (arguments.length > 2 && (e3.children = arguments.length > 3 ? n.call(arguments, 2) : t3), "function" == typeof l3 && null != l3.defaultProps) for (r3 in l3.defaultProps) void 0 === e3[r3] && (e3[r3] = l3.defaultProps[r3]);
    return m(l3, e3, i3, o3, null);
  }
  function m(n2, t3, i3, o3, r3) {
    var e3 = { type: n2, props: t3, key: i3, ref: o3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == r3 ? ++u : r3, __i: -1, __u: 0 };
    return null == r3 && null != l.vnode && l.vnode(e3), e3;
  }
  function k(n2) {
    return n2.children;
  }
  function x(n2, l3) {
    this.props = n2, this.context = l3;
  }
  function S(n2, l3) {
    if (null == l3) return n2.__ ? S(n2.__, n2.__i + 1) : null;
    for (var u3; l3 < n2.__k.length; l3++) if (null != (u3 = n2.__k[l3]) && null != u3.__e) return u3.__e;
    return "function" == typeof n2.type ? S(n2) : null;
  }
  function C(n2) {
    var l3, u3;
    if (null != (n2 = n2.__) && null != n2.__c) {
      for (n2.__e = n2.__c.base = null, l3 = 0; l3 < n2.__k.length; l3++) if (null != (u3 = n2.__k[l3]) && null != u3.__e) {
        n2.__e = n2.__c.base = u3.__e;
        break;
      }
      return C(n2);
    }
  }
  function M(n2) {
    (!n2.__d && (n2.__d = true) && i.push(n2) && !$.__r++ || o != l.debounceRendering) && ((o = l.debounceRendering) || r)($);
  }
  function $() {
    for (var n2, u3, t3, o3, r3, f3, c3, s3 = 1; i.length; ) i.length > s3 && i.sort(e), n2 = i.shift(), s3 = i.length, n2.__d && (t3 = void 0, o3 = void 0, r3 = (o3 = (u3 = n2).__v).__e, f3 = [], c3 = [], u3.__P && ((t3 = w({}, o3)).__v = o3.__v + 1, l.vnode && l.vnode(t3), O(u3.__P, t3, o3, u3.__n, u3.__P.namespaceURI, 32 & o3.__u ? [r3] : null, f3, null == r3 ? S(o3) : r3, !!(32 & o3.__u), c3), t3.__v = o3.__v, t3.__.__k[t3.__i] = t3, N(f3, t3, c3), o3.__e = o3.__ = null, t3.__e != r3 && C(t3)));
    $.__r = 0;
  }
  function I(n2, l3, u3, t3, i3, o3, r3, e3, f3, c3, s3) {
    var a3, h3, y3, d3, w3, g4, _3, m3 = t3 && t3.__k || v, b2 = l3.length;
    for (f3 = P(u3, l3, m3, f3, b2), a3 = 0; a3 < b2; a3++) null != (y3 = u3.__k[a3]) && (h3 = -1 == y3.__i ? p : m3[y3.__i] || p, y3.__i = a3, g4 = O(n2, y3, h3, i3, o3, r3, e3, f3, c3, s3), d3 = y3.__e, y3.ref && h3.ref != y3.ref && (h3.ref && B(h3.ref, null, y3), s3.push(y3.ref, y3.__c || d3, y3)), null == w3 && null != d3 && (w3 = d3), (_3 = !!(4 & y3.__u)) || h3.__k === y3.__k ? f3 = A(y3, f3, n2, _3) : "function" == typeof y3.type && void 0 !== g4 ? f3 = g4 : d3 && (f3 = d3.nextSibling), y3.__u &= -7);
    return u3.__e = w3, f3;
  }
  function P(n2, l3, u3, t3, i3) {
    var o3, r3, e3, f3, c3, s3 = u3.length, a3 = s3, h3 = 0;
    for (n2.__k = new Array(i3), o3 = 0; o3 < i3; o3++) null != (r3 = l3[o3]) && "boolean" != typeof r3 && "function" != typeof r3 ? ("string" == typeof r3 || "number" == typeof r3 || "bigint" == typeof r3 || r3.constructor == String ? r3 = n2.__k[o3] = m(null, r3, null, null, null) : d(r3) ? r3 = n2.__k[o3] = m(k, { children: r3 }, null, null, null) : void 0 === r3.constructor && r3.__b > 0 ? r3 = n2.__k[o3] = m(r3.type, r3.props, r3.key, r3.ref ? r3.ref : null, r3.__v) : n2.__k[o3] = r3, f3 = o3 + h3, r3.__ = n2, r3.__b = n2.__b + 1, e3 = null, -1 != (c3 = r3.__i = L(r3, u3, f3, a3)) && (a3--, (e3 = u3[c3]) && (e3.__u |= 2)), null == e3 || null == e3.__v ? (-1 == c3 && (i3 > s3 ? h3-- : i3 < s3 && h3++), "function" != typeof r3.type && (r3.__u |= 4)) : c3 != f3 && (c3 == f3 - 1 ? h3-- : c3 == f3 + 1 ? h3++ : (c3 > f3 ? h3-- : h3++, r3.__u |= 4))) : n2.__k[o3] = null;
    if (a3) for (o3 = 0; o3 < s3; o3++) null != (e3 = u3[o3]) && 0 == (2 & e3.__u) && (e3.__e == t3 && (t3 = S(e3)), D(e3, e3));
    return t3;
  }
  function A(n2, l3, u3, t3) {
    var i3, o3;
    if ("function" == typeof n2.type) {
      for (i3 = n2.__k, o3 = 0; i3 && o3 < i3.length; o3++) i3[o3] && (i3[o3].__ = n2, l3 = A(i3[o3], l3, u3, t3));
      return l3;
    }
    n2.__e != l3 && (t3 && (l3 && n2.type && !l3.parentNode && (l3 = S(n2)), u3.insertBefore(n2.__e, l3 || null)), l3 = n2.__e);
    do {
      l3 = l3 && l3.nextSibling;
    } while (null != l3 && 8 == l3.nodeType);
    return l3;
  }
  function H(n2, l3) {
    return l3 = l3 || [], null == n2 || "boolean" == typeof n2 || (d(n2) ? n2.some(function(n3) {
      H(n3, l3);
    }) : l3.push(n2)), l3;
  }
  function L(n2, l3, u3, t3) {
    var i3, o3, r3, e3 = n2.key, f3 = n2.type, c3 = l3[u3], s3 = null != c3 && 0 == (2 & c3.__u);
    if (null === c3 && null == e3 || s3 && e3 == c3.key && f3 == c3.type) return u3;
    if (t3 > (s3 ? 1 : 0)) {
      for (i3 = u3 - 1, o3 = u3 + 1; i3 >= 0 || o3 < l3.length; ) if (null != (c3 = l3[r3 = i3 >= 0 ? i3-- : o3++]) && 0 == (2 & c3.__u) && e3 == c3.key && f3 == c3.type) return r3;
    }
    return -1;
  }
  function T(n2, l3, u3) {
    "-" == l3[0] ? n2.setProperty(l3, null == u3 ? "" : u3) : n2[l3] = null == u3 ? "" : "number" != typeof u3 || y.test(l3) ? u3 : u3 + "px";
  }
  function j(n2, l3, u3, t3, i3) {
    var o3, r3;
    n: if ("style" == l3) if ("string" == typeof u3) n2.style.cssText = u3;
    else {
      if ("string" == typeof t3 && (n2.style.cssText = t3 = ""), t3) for (l3 in t3) u3 && l3 in u3 || T(n2.style, l3, "");
      if (u3) for (l3 in u3) t3 && u3[l3] == t3[l3] || T(n2.style, l3, u3[l3]);
    }
    else if ("o" == l3[0] && "n" == l3[1]) o3 = l3 != (l3 = l3.replace(f, "$1")), r3 = l3.toLowerCase(), l3 = r3 in n2 || "onFocusOut" == l3 || "onFocusIn" == l3 ? r3.slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + o3] = u3, u3 ? t3 ? u3.u = t3.u : (u3.u = c, n2.addEventListener(l3, o3 ? a : s, o3)) : n2.removeEventListener(l3, o3 ? a : s, o3);
    else {
      if ("http://www.w3.org/2000/svg" == i3) l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" != l3 && "height" != l3 && "href" != l3 && "list" != l3 && "form" != l3 && "tabIndex" != l3 && "download" != l3 && "rowSpan" != l3 && "colSpan" != l3 && "role" != l3 && "popover" != l3 && l3 in n2) try {
        n2[l3] = null == u3 ? "" : u3;
        break n;
      } catch (n3) {
      }
      "function" == typeof u3 || (null == u3 || false === u3 && "-" != l3[4] ? n2.removeAttribute(l3) : n2.setAttribute(l3, "popover" == l3 && 1 == u3 ? "" : u3));
    }
  }
  function F(n2) {
    return function(u3) {
      if (this.l) {
        var t3 = this.l[u3.type + n2];
        if (null == u3.t) u3.t = c++;
        else if (u3.t < t3.u) return;
        return t3(l.event ? l.event(u3) : u3);
      }
    };
  }
  function O(n2, u3, t3, i3, o3, r3, e3, f3, c3, s3) {
    var a3, h3, p3, v3, y3, _3, m3, b2, S2, C3, M2, $3, P4, A4, H3, L2, T4, j4 = u3.type;
    if (void 0 !== u3.constructor) return null;
    128 & t3.__u && (c3 = !!(32 & t3.__u), r3 = [f3 = u3.__e = t3.__e]), (a3 = l.__b) && a3(u3);
    n: if ("function" == typeof j4) try {
      if (b2 = u3.props, S2 = "prototype" in j4 && j4.prototype.render, C3 = (a3 = j4.contextType) && i3[a3.__c], M2 = a3 ? C3 ? C3.props.value : a3.__ : i3, t3.__c ? m3 = (h3 = u3.__c = t3.__c).__ = h3.__E : (S2 ? u3.__c = h3 = new j4(b2, M2) : (u3.__c = h3 = new x(b2, M2), h3.constructor = j4, h3.render = E), C3 && C3.sub(h3), h3.state || (h3.state = {}), h3.__n = i3, p3 = h3.__d = true, h3.__h = [], h3._sb = []), S2 && null == h3.__s && (h3.__s = h3.state), S2 && null != j4.getDerivedStateFromProps && (h3.__s == h3.state && (h3.__s = w({}, h3.__s)), w(h3.__s, j4.getDerivedStateFromProps(b2, h3.__s))), v3 = h3.props, y3 = h3.state, h3.__v = u3, p3) S2 && null == j4.getDerivedStateFromProps && null != h3.componentWillMount && h3.componentWillMount(), S2 && null != h3.componentDidMount && h3.__h.push(h3.componentDidMount);
      else {
        if (S2 && null == j4.getDerivedStateFromProps && b2 !== v3 && null != h3.componentWillReceiveProps && h3.componentWillReceiveProps(b2, M2), u3.__v == t3.__v || !h3.__e && null != h3.shouldComponentUpdate && false === h3.shouldComponentUpdate(b2, h3.__s, M2)) {
          for (u3.__v != t3.__v && (h3.props = b2, h3.state = h3.__s, h3.__d = false), u3.__e = t3.__e, u3.__k = t3.__k, u3.__k.some(function(n3) {
            n3 && (n3.__ = u3);
          }), $3 = 0; $3 < h3._sb.length; $3++) h3.__h.push(h3._sb[$3]);
          h3._sb = [], h3.__h.length && e3.push(h3);
          break n;
        }
        null != h3.componentWillUpdate && h3.componentWillUpdate(b2, h3.__s, M2), S2 && null != h3.componentDidUpdate && h3.__h.push(function() {
          h3.componentDidUpdate(v3, y3, _3);
        });
      }
      if (h3.context = M2, h3.props = b2, h3.__P = n2, h3.__e = false, P4 = l.__r, A4 = 0, S2) {
        for (h3.state = h3.__s, h3.__d = false, P4 && P4(u3), a3 = h3.render(h3.props, h3.state, h3.context), H3 = 0; H3 < h3._sb.length; H3++) h3.__h.push(h3._sb[H3]);
        h3._sb = [];
      } else do {
        h3.__d = false, P4 && P4(u3), a3 = h3.render(h3.props, h3.state, h3.context), h3.state = h3.__s;
      } while (h3.__d && ++A4 < 25);
      h3.state = h3.__s, null != h3.getChildContext && (i3 = w(w({}, i3), h3.getChildContext())), S2 && !p3 && null != h3.getSnapshotBeforeUpdate && (_3 = h3.getSnapshotBeforeUpdate(v3, y3)), L2 = a3, null != a3 && a3.type === k && null == a3.key && (L2 = V(a3.props.children)), f3 = I(n2, d(L2) ? L2 : [L2], u3, t3, i3, o3, r3, e3, f3, c3, s3), h3.base = u3.__e, u3.__u &= -161, h3.__h.length && e3.push(h3), m3 && (h3.__E = h3.__ = null);
    } catch (n3) {
      if (u3.__v = null, c3 || null != r3) if (n3.then) {
        for (u3.__u |= c3 ? 160 : 128; f3 && 8 == f3.nodeType && f3.nextSibling; ) f3 = f3.nextSibling;
        r3[r3.indexOf(f3)] = null, u3.__e = f3;
      } else {
        for (T4 = r3.length; T4--; ) g(r3[T4]);
        z(u3);
      }
      else u3.__e = t3.__e, u3.__k = t3.__k, n3.then || z(u3);
      l.__e(n3, u3, t3);
    }
    else null == r3 && u3.__v == t3.__v ? (u3.__k = t3.__k, u3.__e = t3.__e) : f3 = u3.__e = q(t3.__e, u3, t3, i3, o3, r3, e3, c3, s3);
    return (a3 = l.diffed) && a3(u3), 128 & u3.__u ? void 0 : f3;
  }
  function z(n2) {
    n2 && n2.__c && (n2.__c.__e = true), n2 && n2.__k && n2.__k.forEach(z);
  }
  function N(n2, u3, t3) {
    for (var i3 = 0; i3 < t3.length; i3++) B(t3[i3], t3[++i3], t3[++i3]);
    l.__c && l.__c(u3, n2), n2.some(function(u4) {
      try {
        n2 = u4.__h, u4.__h = [], n2.some(function(n3) {
          n3.call(u4);
        });
      } catch (n3) {
        l.__e(n3, u4.__v);
      }
    });
  }
  function V(n2) {
    return "object" != typeof n2 || null == n2 || n2.__b && n2.__b > 0 ? n2 : d(n2) ? n2.map(V) : w({}, n2);
  }
  function q(u3, t3, i3, o3, r3, e3, f3, c3, s3) {
    var a3, h3, v3, y3, w3, _3, m3, b2 = i3.props || p, k3 = t3.props, x3 = t3.type;
    if ("svg" == x3 ? r3 = "http://www.w3.org/2000/svg" : "math" == x3 ? r3 = "http://www.w3.org/1998/Math/MathML" : r3 || (r3 = "http://www.w3.org/1999/xhtml"), null != e3) {
      for (a3 = 0; a3 < e3.length; a3++) if ((w3 = e3[a3]) && "setAttribute" in w3 == !!x3 && (x3 ? w3.localName == x3 : 3 == w3.nodeType)) {
        u3 = w3, e3[a3] = null;
        break;
      }
    }
    if (null == u3) {
      if (null == x3) return document.createTextNode(k3);
      u3 = document.createElementNS(r3, x3, k3.is && k3), c3 && (l.__m && l.__m(t3, e3), c3 = false), e3 = null;
    }
    if (null == x3) b2 === k3 || c3 && u3.data == k3 || (u3.data = k3);
    else {
      if (e3 = e3 && n.call(u3.childNodes), !c3 && null != e3) for (b2 = {}, a3 = 0; a3 < u3.attributes.length; a3++) b2[(w3 = u3.attributes[a3]).name] = w3.value;
      for (a3 in b2) if (w3 = b2[a3], "children" == a3) ;
      else if ("dangerouslySetInnerHTML" == a3) v3 = w3;
      else if (!(a3 in k3)) {
        if ("value" == a3 && "defaultValue" in k3 || "checked" == a3 && "defaultChecked" in k3) continue;
        j(u3, a3, null, w3, r3);
      }
      for (a3 in k3) w3 = k3[a3], "children" == a3 ? y3 = w3 : "dangerouslySetInnerHTML" == a3 ? h3 = w3 : "value" == a3 ? _3 = w3 : "checked" == a3 ? m3 = w3 : c3 && "function" != typeof w3 || b2[a3] === w3 || j(u3, a3, w3, b2[a3], r3);
      if (h3) c3 || v3 && (h3.__html == v3.__html || h3.__html == u3.innerHTML) || (u3.innerHTML = h3.__html), t3.__k = [];
      else if (v3 && (u3.innerHTML = ""), I("template" == t3.type ? u3.content : u3, d(y3) ? y3 : [y3], t3, i3, o3, "foreignObject" == x3 ? "http://www.w3.org/1999/xhtml" : r3, e3, f3, e3 ? e3[0] : i3.__k && S(i3, 0), c3, s3), null != e3) for (a3 = e3.length; a3--; ) g(e3[a3]);
      c3 || (a3 = "value", "progress" == x3 && null == _3 ? u3.removeAttribute("value") : null != _3 && (_3 !== u3[a3] || "progress" == x3 && !_3 || "option" == x3 && _3 != b2[a3]) && j(u3, a3, _3, b2[a3], r3), a3 = "checked", null != m3 && m3 != u3[a3] && j(u3, a3, m3, b2[a3], r3));
    }
    return u3;
  }
  function B(n2, u3, t3) {
    try {
      if ("function" == typeof n2) {
        var i3 = "function" == typeof n2.__u;
        i3 && n2.__u(), i3 && null == u3 || (n2.__u = n2(u3));
      } else n2.current = u3;
    } catch (n3) {
      l.__e(n3, t3);
    }
  }
  function D(n2, u3, t3) {
    var i3, o3;
    if (l.unmount && l.unmount(n2), (i3 = n2.ref) && (i3.current && i3.current != n2.__e || B(i3, null, u3)), null != (i3 = n2.__c)) {
      if (i3.componentWillUnmount) try {
        i3.componentWillUnmount();
      } catch (n3) {
        l.__e(n3, u3);
      }
      i3.base = i3.__P = null;
    }
    if (i3 = n2.__k) for (o3 = 0; o3 < i3.length; o3++) i3[o3] && D(i3[o3], u3, t3 || "function" != typeof n2.type);
    t3 || g(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
  }
  function E(n2, l3, u3) {
    return this.constructor(n2, u3);
  }
  function G(u3, t3, i3) {
    var o3, r3, e3, f3;
    t3 == document && (t3 = document.documentElement), l.__ && l.__(u3, t3), r3 = (o3 = "function" == typeof i3) ? null : i3 && i3.__k || t3.__k, e3 = [], f3 = [], O(t3, u3 = (!o3 && i3 || t3).__k = _(k, null, [u3]), r3 || p, p, t3.namespaceURI, !o3 && i3 ? [i3] : r3 ? null : t3.firstChild ? n.call(t3.childNodes) : null, e3, !o3 && i3 ? i3 : r3 ? r3.__e : t3.firstChild, o3, f3), N(e3, u3, f3);
  }
  var n, l, u, t, i, o, r, e, f, c, s, a, h, p, v, y, d;
  var init_preact_module = __esm({
    "node_modules/preact/dist/preact.module.js"() {
      p = {};
      v = [];
      y = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
      d = Array.isArray;
      n = v.slice, l = { __e: function(n2, l3, u3, t3) {
        for (var i3, o3, r3; l3 = l3.__; ) if ((i3 = l3.__c) && !i3.__) try {
          if ((o3 = i3.constructor) && null != o3.getDerivedStateFromError && (i3.setState(o3.getDerivedStateFromError(n2)), r3 = i3.__d), null != i3.componentDidCatch && (i3.componentDidCatch(n2, t3 || {}), r3 = i3.__d), r3) return i3.__E = i3;
        } catch (l4) {
          n2 = l4;
        }
        throw n2;
      } }, u = 0, t = function(n2) {
        return null != n2 && void 0 === n2.constructor;
      }, x.prototype.setState = function(n2, l3) {
        var u3;
        u3 = null != this.__s && this.__s != this.state ? this.__s : this.__s = w({}, this.state), "function" == typeof n2 && (n2 = n2(w({}, u3), this.props)), n2 && w(u3, n2), null != n2 && this.__v && (l3 && this._sb.push(l3), M(this));
      }, x.prototype.forceUpdate = function(n2) {
        this.__v && (this.__e = true, n2 && this.__h.push(n2), M(this));
      }, x.prototype.render = k, i = [], r = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n2, l3) {
        return n2.__v.__b - l3.__v.__b;
      }, $.__r = 0, f = /(PointerCapture)$|Capture$/i, c = 0, s = F(false), a = F(true), h = 0;
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/utilities/create-class-name.js
  function createClassName(classNames) {
    return classNames.filter(function(className) {
      return className !== null;
    }).join(" ");
  }
  var init_create_class_name = __esm({
    "node_modules/@create-figma-plugin/ui/lib/utilities/create-class-name.js"() {
    }
  });

  // node_modules/preact/hooks/dist/hooks.module.js
  function p2(n2, t3) {
    c2.__h && c2.__h(r2, n2, o2 || t3), o2 = 0;
    var u3 = r2.__H || (r2.__H = { __: [], __h: [] });
    return n2 >= u3.__.length && u3.__.push({}), u3.__[n2];
  }
  function d2(n2) {
    return o2 = 1, h2(D2, n2);
  }
  function h2(n2, u3, i3) {
    var o3 = p2(t2++, 2);
    if (o3.t = n2, !o3.__c && (o3.__ = [i3 ? i3(u3) : D2(void 0, u3), function(n3) {
      var t3 = o3.__N ? o3.__N[0] : o3.__[0], r3 = o3.t(t3, n3);
      t3 !== r3 && (o3.__N = [r3, o3.__[1]], o3.__c.setState({}));
    }], o3.__c = r2, !r2.__f)) {
      var f3 = function(n3, t3, r3) {
        if (!o3.__c.__H) return true;
        var u4 = o3.__c.__H.__.filter(function(n4) {
          return !!n4.__c;
        });
        if (u4.every(function(n4) {
          return !n4.__N;
        })) return !c3 || c3.call(this, n3, t3, r3);
        var i4 = o3.__c.props !== n3;
        return u4.forEach(function(n4) {
          if (n4.__N) {
            var t4 = n4.__[0];
            n4.__ = n4.__N, n4.__N = void 0, t4 !== n4.__[0] && (i4 = true);
          }
        }), c3 && c3.call(this, n3, t3, r3) || i4;
      };
      r2.__f = true;
      var c3 = r2.shouldComponentUpdate, e3 = r2.componentWillUpdate;
      r2.componentWillUpdate = function(n3, t3, r3) {
        if (this.__e) {
          var u4 = c3;
          c3 = void 0, f3(n3, t3, r3), c3 = u4;
        }
        e3 && e3.call(this, n3, t3, r3);
      }, r2.shouldComponentUpdate = f3;
    }
    return o3.__N || o3.__;
  }
  function y2(n2, u3) {
    var i3 = p2(t2++, 3);
    !c2.__s && C2(i3.__H, u3) && (i3.__ = n2, i3.u = u3, r2.__H.__h.push(i3));
  }
  function A2(n2) {
    return o2 = 5, T2(function() {
      return { current: n2 };
    }, []);
  }
  function T2(n2, r3) {
    var u3 = p2(t2++, 7);
    return C2(u3.__H, r3) && (u3.__ = n2(), u3.__H = r3, u3.__h = n2), u3.__;
  }
  function q2(n2, t3) {
    return o2 = 8, T2(function() {
      return n2;
    }, t3);
  }
  function j2() {
    for (var n2; n2 = f2.shift(); ) if (n2.__P && n2.__H) try {
      n2.__H.__h.forEach(z2), n2.__H.__h.forEach(B2), n2.__H.__h = [];
    } catch (t3) {
      n2.__H.__h = [], c2.__e(t3, n2.__v);
    }
  }
  function w2(n2) {
    var t3, r3 = function() {
      clearTimeout(u3), k2 && cancelAnimationFrame(t3), setTimeout(n2);
    }, u3 = setTimeout(r3, 35);
    k2 && (t3 = requestAnimationFrame(r3));
  }
  function z2(n2) {
    var t3 = r2, u3 = n2.__c;
    "function" == typeof u3 && (n2.__c = void 0, u3()), r2 = t3;
  }
  function B2(n2) {
    var t3 = r2;
    n2.__c = n2.__(), r2 = t3;
  }
  function C2(n2, t3) {
    return !n2 || n2.length !== t3.length || t3.some(function(t4, r3) {
      return t4 !== n2[r3];
    });
  }
  function D2(n2, t3) {
    return "function" == typeof t3 ? t3(n2) : t3;
  }
  var t2, r2, u2, i2, o2, f2, c2, e2, a2, v2, l2, m2, s2, k2;
  var init_hooks_module = __esm({
    "node_modules/preact/hooks/dist/hooks.module.js"() {
      init_preact_module();
      o2 = 0;
      f2 = [];
      c2 = l;
      e2 = c2.__b;
      a2 = c2.__r;
      v2 = c2.diffed;
      l2 = c2.__c;
      m2 = c2.unmount;
      s2 = c2.__;
      c2.__b = function(n2) {
        r2 = null, e2 && e2(n2);
      }, c2.__ = function(n2, t3) {
        n2 && t3.__k && t3.__k.__m && (n2.__m = t3.__k.__m), s2 && s2(n2, t3);
      }, c2.__r = function(n2) {
        a2 && a2(n2), t2 = 0;
        var i3 = (r2 = n2.__c).__H;
        i3 && (u2 === r2 ? (i3.__h = [], r2.__h = [], i3.__.forEach(function(n3) {
          n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
        })) : (i3.__h.forEach(z2), i3.__h.forEach(B2), i3.__h = [], t2 = 0)), u2 = r2;
      }, c2.diffed = function(n2) {
        v2 && v2(n2);
        var t3 = n2.__c;
        t3 && t3.__H && (t3.__H.__h.length && (1 !== f2.push(t3) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t3.__H.__.forEach(function(n3) {
          n3.u && (n3.__H = n3.u), n3.u = void 0;
        })), u2 = r2 = null;
      }, c2.__c = function(n2, t3) {
        t3.some(function(n3) {
          try {
            n3.__h.forEach(z2), n3.__h = n3.__h.filter(function(n4) {
              return !n4.__ || B2(n4);
            });
          } catch (r3) {
            t3.some(function(n4) {
              n4.__h && (n4.__h = []);
            }), t3 = [], c2.__e(r3, n3.__v);
          }
        }), l2 && l2(n2, t3);
      }, c2.unmount = function(n2) {
        m2 && m2(n2);
        var t3, r3 = n2.__c;
        r3 && r3.__H && (r3.__H.__.forEach(function(n3) {
          try {
            z2(n3);
          } catch (n4) {
            t3 = n4;
          }
        }), r3.__H = void 0, t3 && c2.__e(t3, r3.__v));
      };
      k2 = "function" == typeof requestAnimationFrame;
    }
  });

  // node_modules/preact/compat/dist/compat.module.js
  function g3(n2, t3) {
    for (var e3 in t3) n2[e3] = t3[e3];
    return n2;
  }
  function E2(n2, t3) {
    for (var e3 in n2) if ("__source" !== e3 && !(e3 in t3)) return true;
    for (var r3 in t3) if ("__source" !== r3 && n2[r3] !== t3[r3]) return true;
    return false;
  }
  function N2(n2, t3) {
    this.props = n2, this.context = t3;
  }
  function D3(n2) {
    function t3(t4) {
      var e3 = g3({}, t4);
      return delete e3.ref, n2(e3, t4.ref || null);
    }
    return t3.$$typeof = A3, t3.render = n2, t3.prototype.isReactComponent = t3.__f = true, t3.displayName = "ForwardRef(" + (n2.displayName || n2.name) + ")", t3;
  }
  function V2(n2, t3, e3) {
    return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
      "function" == typeof n3.__c && n3.__c();
    }), n2.__c.__H = null), null != (n2 = g3({}, n2)).__c && (n2.__c.__P === e3 && (n2.__c.__P = t3), n2.__c.__e = true, n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
      return V2(n3, t3, e3);
    })), n2;
  }
  function W(n2, t3, e3) {
    return n2 && e3 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
      return W(n3, t3, e3);
    }), n2.__c && n2.__c.__P === t3 && (n2.__e && e3.appendChild(n2.__e), n2.__c.__e = true, n2.__c.__P = e3)), n2;
  }
  function P3() {
    this.__u = 0, this.o = null, this.__b = null;
  }
  function j3(n2) {
    var t3 = n2.__.__c;
    return t3 && t3.__a && t3.__a(n2);
  }
  function B3() {
    this.i = null, this.l = null;
  }
  function Z(n2) {
    return this.getChildContext = function() {
      return n2.context;
    }, n2.children;
  }
  function Y(n2) {
    var e3 = this, r3 = n2.h;
    if (e3.componentWillUnmount = function() {
      G(null, e3.v), e3.v = null, e3.h = null;
    }, e3.h && e3.h !== r3 && e3.componentWillUnmount(), !e3.v) {
      for (var u3 = e3.__v; null !== u3 && !u3.__m && null !== u3.__; ) u3 = u3.__;
      e3.h = r3, e3.v = { nodeType: 1, parentNode: r3, childNodes: [], __k: { __m: u3.__m }, contains: function() {
        return true;
      }, insertBefore: function(n3, t3) {
        this.childNodes.push(n3), e3.h.insertBefore(n3, t3);
      }, removeChild: function(n3) {
        this.childNodes.splice(this.childNodes.indexOf(n3) >>> 1, 1), e3.h.removeChild(n3);
      } };
    }
    G(_(Z, { context: e3.context }, n2.__v), e3.v);
  }
  function $2(n2, e3) {
    var r3 = _(Y, { __v: n2, h: e3 });
    return r3.containerInfo = e3, r3;
  }
  function rn() {
  }
  function un() {
    return this.cancelBubble;
  }
  function on() {
    return this.defaultPrevented;
  }
  var T3, A3, F3, U, H2, q3, G2, J2, K2, Q2, X, en, ln, cn, fn, an, sn;
  var init_compat_module = __esm({
    "node_modules/preact/compat/dist/compat.module.js"() {
      init_preact_module();
      init_preact_module();
      init_hooks_module();
      init_hooks_module();
      (N2.prototype = new x()).isPureReactComponent = true, N2.prototype.shouldComponentUpdate = function(n2, t3) {
        return E2(this.props, n2) || E2(this.state, t3);
      };
      T3 = l.__b;
      l.__b = function(n2) {
        n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), T3 && T3(n2);
      };
      A3 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
      F3 = l.__e;
      l.__e = function(n2, t3, e3, r3) {
        if (n2.then) {
          for (var u3, o3 = t3; o3 = o3.__; ) if ((u3 = o3.__c) && u3.__c) return null == t3.__e && (t3.__e = e3.__e, t3.__k = e3.__k), u3.__c(n2, t3);
        }
        F3(n2, t3, e3, r3);
      };
      U = l.unmount;
      l.unmount = function(n2) {
        var t3 = n2.__c;
        t3 && t3.__R && t3.__R(), t3 && 32 & n2.__u && (n2.type = null), U && U(n2);
      }, (P3.prototype = new x()).__c = function(n2, t3) {
        var e3 = t3.__c, r3 = this;
        null == r3.o && (r3.o = []), r3.o.push(e3);
        var u3 = j3(r3.__v), o3 = false, i3 = function() {
          o3 || (o3 = true, e3.__R = null, u3 ? u3(l3) : l3());
        };
        e3.__R = i3;
        var l3 = function() {
          if (!--r3.__u) {
            if (r3.state.__a) {
              var n3 = r3.state.__a;
              r3.__v.__k[0] = W(n3, n3.__c.__P, n3.__c.__O);
            }
            var t4;
            for (r3.setState({ __a: r3.__b = null }); t4 = r3.o.pop(); ) t4.forceUpdate();
          }
        };
        r3.__u++ || 32 & t3.__u || r3.setState({ __a: r3.__b = r3.__v.__k[0] }), n2.then(i3, i3);
      }, P3.prototype.componentWillUnmount = function() {
        this.o = [];
      }, P3.prototype.render = function(n2, e3) {
        if (this.__b) {
          if (this.__v.__k) {
            var r3 = document.createElement("div"), o3 = this.__v.__k[0].__c;
            this.__v.__k[0] = V2(this.__b, r3, o3.__O = o3.__P);
          }
          this.__b = null;
        }
        var i3 = e3.__a && _(k, null, n2.fallback);
        return i3 && (i3.__u &= -33), [_(k, null, e3.__a ? null : n2.children), i3];
      };
      H2 = function(n2, t3, e3) {
        if (++e3[1] === e3[0] && n2.l.delete(t3), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.l.size)) for (e3 = n2.i; e3; ) {
          for (; e3.length > 3; ) e3.pop()();
          if (e3[1] < e3[0]) break;
          n2.i = e3 = e3[2];
        }
      };
      (B3.prototype = new x()).__a = function(n2) {
        var t3 = this, e3 = j3(t3.__v), r3 = t3.l.get(n2);
        return r3[0]++, function(u3) {
          var o3 = function() {
            t3.props.revealOrder ? (r3.push(u3), H2(t3, n2, r3)) : u3();
          };
          e3 ? e3(o3) : o3();
        };
      }, B3.prototype.render = function(n2) {
        this.i = null, this.l = /* @__PURE__ */ new Map();
        var t3 = H(n2.children);
        n2.revealOrder && "b" === n2.revealOrder[0] && t3.reverse();
        for (var e3 = t3.length; e3--; ) this.l.set(t3[e3], this.i = [1, 0, this.i]);
        return n2.children;
      }, B3.prototype.componentDidUpdate = B3.prototype.componentDidMount = function() {
        var n2 = this;
        this.l.forEach(function(t3, e3) {
          H2(n2, e3, t3);
        });
      };
      q3 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;
      G2 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
      J2 = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
      K2 = /[A-Z0-9]/g;
      Q2 = "undefined" != typeof document;
      X = function(n2) {
        return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n2);
      };
      x.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t3) {
        Object.defineProperty(x.prototype, t3, { configurable: true, get: function() {
          return this["UNSAFE_" + t3];
        }, set: function(n2) {
          Object.defineProperty(this, t3, { configurable: true, writable: true, value: n2 });
        } });
      });
      en = l.event;
      l.event = function(n2) {
        return en && (n2 = en(n2)), n2.persist = rn, n2.isPropagationStopped = un, n2.isDefaultPrevented = on, n2.nativeEvent = n2;
      };
      cn = { enumerable: false, configurable: true, get: function() {
        return this.class;
      } };
      fn = l.vnode;
      l.vnode = function(n2) {
        "string" == typeof n2.type && function(n3) {
          var t3 = n3.props, e3 = n3.type, u3 = {}, o3 = -1 === e3.indexOf("-");
          for (var i3 in t3) {
            var l3 = t3[i3];
            if (!("value" === i3 && "defaultValue" in t3 && null == l3 || Q2 && "children" === i3 && "noscript" === e3 || "class" === i3 || "className" === i3)) {
              var c3 = i3.toLowerCase();
              "defaultValue" === i3 && "value" in t3 && null == t3.value ? i3 = "value" : "download" === i3 && true === l3 ? l3 = "" : "translate" === c3 && "no" === l3 ? l3 = false : "o" === c3[0] && "n" === c3[1] ? "ondoubleclick" === c3 ? i3 = "ondblclick" : "onchange" !== c3 || "input" !== e3 && "textarea" !== e3 || X(t3.type) ? "onfocus" === c3 ? i3 = "onfocusin" : "onblur" === c3 ? i3 = "onfocusout" : J2.test(i3) && (i3 = c3) : c3 = i3 = "oninput" : o3 && G2.test(i3) ? i3 = i3.replace(K2, "-$&").toLowerCase() : null === l3 && (l3 = void 0), "oninput" === c3 && u3[i3 = c3] && (i3 = "oninputCapture"), u3[i3] = l3;
            }
          }
          "select" == e3 && u3.multiple && Array.isArray(u3.value) && (u3.value = H(t3.children).forEach(function(n4) {
            n4.props.selected = -1 != u3.value.indexOf(n4.props.value);
          })), "select" == e3 && null != u3.defaultValue && (u3.value = H(t3.children).forEach(function(n4) {
            n4.props.selected = u3.multiple ? -1 != u3.defaultValue.indexOf(n4.props.value) : u3.defaultValue == n4.props.value;
          })), t3.class && !t3.className ? (u3.class = t3.class, Object.defineProperty(u3, "className", cn)) : (t3.className && !t3.class || t3.class && t3.className) && (u3.class = u3.className = t3.className), n3.props = u3;
        }(n2), n2.$$typeof = q3, fn && fn(n2);
      };
      an = l.__r;
      l.__r = function(n2) {
        an && an(n2), ln = n2.__c;
      };
      sn = l.diffed;
      l.diffed = function(n2) {
        sn && sn(n2);
        var t3 = n2.props, e3 = n2.__e;
        null != e3 && "textarea" === n2.type && "value" in t3 && t3.value !== e3.value && (e3.value = null == t3.value ? "" : t3.value), ln = null;
      };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/utilities/create-component.js
  function createComponent(fn2) {
    return D3(fn2);
  }
  var init_create_component = __esm({
    "node_modules/@create-figma-plugin/ui/lib/utilities/create-component.js"() {
      init_compat_module();
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/utilities/no-op.js
  function noop() {
  }
  var init_no_op = __esm({
    "node_modules/@create-figma-plugin/ui/lib/utilities/no-op.js"() {
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/e28f67eb-aaa9-4af3-9617-163996f85fac/loading-indicator.module.js
  var loading_indicator_module_default;
  var init_loading_indicator_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/e28f67eb-aaa9-4af3-9617-163996f85fac/loading-indicator.module.js"() {
      if (document.getElementById("3fe0db8eb7") === null) {
        const element = document.createElement("style");
        element.id = "3fe0db8eb7";
        element.textContent = `._loadingIndicator_18hv6_1 {
  position: relative;
  width: var(--space-16);
  height: var(--space-16);
  margin: auto;
}

._svg_18hv6_8 {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--space-16);
  height: var(--space-16);
  animation: _rotating_18hv6_1 0.5s linear infinite;
  fill: currentColor;
}

@keyframes _rotating_18hv6_1 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9sb2FkaW5nLWluZGljYXRvci9sb2FkaW5nLWluZGljYXRvci5tb2R1bGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usa0JBQWtCO0VBQ2xCLHNCQUFzQjtFQUN0Qix1QkFBdUI7RUFDdkIsWUFBWTtBQUNkOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLE1BQU07RUFDTixPQUFPO0VBQ1Asc0JBQXNCO0VBQ3RCLHVCQUF1QjtFQUN2QixpREFBd0M7RUFDeEMsa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0U7SUFDRSx1QkFBdUI7RUFDekI7RUFDQTtJQUNFLHlCQUF5QjtFQUMzQjtBQUNGIiwiZmlsZSI6Im5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9sb2FkaW5nLWluZGljYXRvci9sb2FkaW5nLWluZGljYXRvci5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmxvYWRpbmdJbmRpY2F0b3Ige1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHdpZHRoOiB2YXIoLS1zcGFjZS0xNik7XG4gIGhlaWdodDogdmFyKC0tc3BhY2UtMTYpO1xuICBtYXJnaW46IGF1dG87XG59XG5cbi5zdmcge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgd2lkdGg6IHZhcigtLXNwYWNlLTE2KTtcbiAgaGVpZ2h0OiB2YXIoLS1zcGFjZS0xNik7XG4gIGFuaW1hdGlvbjogcm90YXRpbmcgMC41cyBsaW5lYXIgaW5maW5pdGU7XG4gIGZpbGw6IGN1cnJlbnRDb2xvcjtcbn1cblxuQGtleWZyYW1lcyByb3RhdGluZyB7XG4gIGZyb20ge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpO1xuICB9XG4gIHRvIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICB9XG59XG4iXX0= */`;
        document.head.append(element);
      }
      loading_indicator_module_default = { "loadingIndicator": "_loadingIndicator_18hv6_1", "svg": "_svg_18hv6_8", "rotating": "_rotating_18hv6_1" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/loading-indicator/loading-indicator.js
  var LoadingIndicator;
  var init_loading_indicator = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/loading-indicator/loading-indicator.js"() {
      init_preact_module();
      init_create_component();
      init_loading_indicator_module();
      LoadingIndicator = createComponent(function(_a, ref) {
        var _b = _a, { color } = _b, rest = __objRest(_b, ["color"]);
        return _(
          "div",
          __spreadProps(__spreadValues({}, rest), { ref, class: loading_indicator_module_default.loadingIndicator }),
          _(
            "svg",
            { class: loading_indicator_module_default.svg, style: typeof color === "undefined" ? void 0 : {
              fill: `var(--figma-color-icon-${color})`
            } },
            _("path", { d: "M11.333 3.011a6 6 0 0 0-2.834-.99A.534.534 0 0 1 8 1.5c.001-.276.225-.502.5-.482A7 7 0 1 1 1.019 8.5.473.473 0 0 1 1.5 8c.276 0 .498.224.52.5a6 6 0 1 0 9.313-5.489Z" })
          )
        );
      });
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/5e7d1524-8588-449f-bc91-cfc1eb0f8825/button.module.js
  var button_module_default;
  var init_button_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/5e7d1524-8588-449f-bc91-cfc1eb0f8825/button.module.js"() {
      if (document.getElementById("1dddd0e4df") === null) {
        const element = document.createElement("style");
        element.id = "1dddd0e4df";
        element.textContent = `._button_avmy7_1 {
  position: relative;
  z-index: var(--z-index-1);
  display: inline-block;
}

._fullWidth_avmy7_7 {
  display: block;
}

._disabled_avmy7_11,
._disabled_avmy7_11 * {
  cursor: not-allowed;
}

._button_avmy7_1 button {
  position: relative;
  display: inline-block;
  height: var(--space-24);
  padding: var(--space-0) var(--space-8);
  border: var(--border-width-1) solid transparent;
  border-radius: var(--border-radius-6);
}

._fullWidth_avmy7_7 button {
  display: block;
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}

._default_avmy7_33 button {
  border-color: transparent;
  background-color: var(--figma-color-bg-brand);
  color: var(--figma-color-text-onbrand);
}

._default_avmy7_33:not(._disabled_avmy7_11) button:focus {
  border-color: var(--figma-color-border-onbrand);
}
._default_avmy7_33:not(._disabled_avmy7_11) button:focus-visible {
  box-shadow: 0 0 0 var(--border-width-1) var(--figma-color-bg) inset;
}
._default_avmy7_33:not(._disabled_avmy7_11) button:active {
  background-color: var(--figma-color-bg-brand-pressed);
}
._default_avmy7_33._disabled_avmy7_11 button {
  background-color: var(--figma-color-bg-disabled);
  color: var(--figma-color-text-ondisabled);
}

._default_avmy7_33._danger_avmy7_53 button {
  background-color: var(--figma-color-bg-danger);
  color: var(--figma-color-text-ondanger);
}
._default_avmy7_33._danger_avmy7_53:not(._disabled_avmy7_11) button:focus {
  border-color: var(--figma-color-border-danger-strong);
}
._default_avmy7_33._danger_avmy7_53:not(._disabled_avmy7_11) button:active {
  background-color: var(--figma-color-bg-danger-pressed);
}
._default_avmy7_33._danger_avmy7_53._disabled_avmy7_11 button {
  background-color: var(--figma-color-bg-disabled);
  color: var(--figma-color-text-ondisabled);
}

._secondary_avmy7_68 button {
  border-color: var(--figma-color-border);
  background-color: transparent;
  color: var(--figma-color-text);
}
._secondary_avmy7_68:not(._disabled_avmy7_11) button:focus {
  border-color: var(--figma-color-border-selected);
}
._secondary_avmy7_68:not(._disabled_avmy7_11) button:active {
  background-color: var(--figma-color-bg-pressed);
}
._secondary_avmy7_68._disabled_avmy7_11 button {
  border-color: var(--figma-color-border-disabled);
  color: var(--figma-color-text-disabled);
}

._secondary_avmy7_68._danger_avmy7_53 button {
  border-color: var(--figma-color-border-danger);
  color: var(--figma-color-text-danger);
}
._secondary_avmy7_68._danger_avmy7_53:not(._disabled_avmy7_11) button:focus {
  border-color: var(--figma-color-border-danger-strong);
}
._secondary_avmy7_68._danger_avmy7_53._disabled_avmy7_11 button {
  border-color: var(--figma-color-border-disabled-strong);
  color: var(--figma-color-text-disabled);
}

._loadingIndicator_avmy7_96 {
  position: absolute;
  top: 50%;
  left: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
}

._default_avmy7_33 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-icon-onbrand);
}
._default_avmy7_33._disabled_avmy7_11 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-icon-ondisabled);
}

._default_avmy7_33._danger_avmy7_53 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-icon-ondanger);
}
._default_avmy7_33._danger_avmy7_53._disabled_avmy7_11 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-icon-ondisabled);
}

._secondary_avmy7_68 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-text);
}
._secondary_avmy7_68._disabled_avmy7_11 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-text-disabled);
}

._secondary_avmy7_68._danger_avmy7_53 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-text-danger);
}
._secondary_avmy7_68._danger_avmy7_53._disabled_avmy7_11 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-text-disabled);
}

._children_avmy7_132 {
  display: inline;
  pointer-events: none;
}
._loading_avmy7_96 ._children_avmy7_132 {
  visibility: hidden;
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9idXR0b24vYnV0dG9uLm1vZHVsZS5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxrQkFBa0I7RUFDbEIseUJBQXlCO0VBQ3pCLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7O0VBRUUsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLHFCQUFxQjtFQUNyQix1QkFBdUI7RUFDdkIsc0NBQXNDO0VBQ3RDLCtDQUErQztFQUMvQyxxQ0FBcUM7QUFDdkM7O0FBRUE7RUFDRSxjQUFjO0VBQ2QsZ0JBQWdCO0VBQ2hCLFdBQVc7RUFDWCx1QkFBdUI7RUFDdkIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UseUJBQXlCO0VBQ3pCLDZDQUE2QztFQUM3QyxzQ0FBc0M7QUFDeEM7O0FBRUE7RUFDRSwrQ0FBK0M7QUFDakQ7QUFDQTtFQUNFLG1FQUFtRTtBQUNyRTtBQUNBO0VBQ0UscURBQXFEO0FBQ3ZEO0FBQ0E7RUFDRSxnREFBZ0Q7RUFDaEQseUNBQXlDO0FBQzNDOztBQUVBO0VBQ0UsOENBQThDO0VBQzlDLHVDQUF1QztBQUN6QztBQUNBO0VBQ0UscURBQXFEO0FBQ3ZEO0FBQ0E7RUFDRSxzREFBc0Q7QUFDeEQ7QUFDQTtFQUNFLGdEQUFnRDtFQUNoRCx5Q0FBeUM7QUFDM0M7O0FBRUE7RUFDRSx1Q0FBdUM7RUFDdkMsNkJBQTZCO0VBQzdCLDhCQUE4QjtBQUNoQztBQUNBO0VBQ0UsZ0RBQWdEO0FBQ2xEO0FBQ0E7RUFDRSwrQ0FBK0M7QUFDakQ7QUFDQTtFQUNFLGdEQUFnRDtFQUNoRCx1Q0FBdUM7QUFDekM7O0FBRUE7RUFDRSw4Q0FBOEM7RUFDOUMscUNBQXFDO0FBQ3ZDO0FBQ0E7RUFDRSxxREFBcUQ7QUFDdkQ7QUFDQTtFQUNFLHVEQUF1RDtFQUN2RCx1Q0FBdUM7QUFDekM7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsUUFBUTtFQUNSLFNBQVM7RUFDVCxvQkFBb0I7RUFDcEIsZ0NBQWdDO0FBQ2xDOztBQUVBO0VBQ0Usc0NBQXNDO0FBQ3hDO0FBQ0E7RUFDRSx5Q0FBeUM7QUFDM0M7O0FBRUE7RUFDRSx1Q0FBdUM7QUFDekM7QUFDQTtFQUNFLHlDQUF5QztBQUMzQzs7QUFFQTtFQUNFLDhCQUE4QjtBQUNoQztBQUNBO0VBQ0UsdUNBQXVDO0FBQ3pDOztBQUVBO0VBQ0UscUNBQXFDO0FBQ3ZDO0FBQ0E7RUFDRSx1Q0FBdUM7QUFDekM7O0FBRUE7RUFDRSxlQUFlO0VBQ2Ysb0JBQW9CO0FBQ3RCO0FBQ0E7RUFDRSxrQkFBa0I7QUFDcEIiLCJmaWxlIjoibm9kZV9tb2R1bGVzL0BjcmVhdGUtZmlnbWEtcGx1Z2luL3VpL2xpYi9jb21wb25lbnRzL2J1dHRvbi9idXR0b24ubW9kdWxlLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5idXR0b24ge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHotaW5kZXg6IHZhcigtLXotaW5kZXgtMSk7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cblxuLmZ1bGxXaWR0aCB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4uZGlzYWJsZWQsXG4uZGlzYWJsZWQgKiB7XG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XG59XG5cbi5idXR0b24gYnV0dG9uIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGhlaWdodDogdmFyKC0tc3BhY2UtMjQpO1xuICBwYWRkaW5nOiB2YXIoLS1zcGFjZS0wKSB2YXIoLS1zcGFjZS04KTtcbiAgYm9yZGVyOiB2YXIoLS1ib3JkZXItd2lkdGgtMSkgc29saWQgdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci1yYWRpdXM6IHZhcigtLWJvcmRlci1yYWRpdXMtNik7XG59XG5cbi5mdWxsV2lkdGggYnV0dG9uIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHdpZHRoOiAxMDAlO1xuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbn1cblxuLmRlZmF1bHQgYnV0dG9uIHtcbiAgYm9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctYnJhbmQpO1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dC1vbmJyYW5kKTtcbn1cblxuLmRlZmF1bHQ6bm90KC5kaXNhYmxlZCkgYnV0dG9uOmZvY3VzIHtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXItb25icmFuZCk7XG59XG4uZGVmYXVsdDpub3QoLmRpc2FibGVkKSBidXR0b246Zm9jdXMtdmlzaWJsZSB7XG4gIGJveC1zaGFkb3c6IDAgMCAwIHZhcigtLWJvcmRlci13aWR0aC0xKSB2YXIoLS1maWdtYS1jb2xvci1iZykgaW5zZXQ7XG59XG4uZGVmYXVsdDpub3QoLmRpc2FibGVkKSBidXR0b246YWN0aXZlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctYnJhbmQtcHJlc3NlZCk7XG59XG4uZGVmYXVsdC5kaXNhYmxlZCBidXR0b24ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1iZy1kaXNhYmxlZCk7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LW9uZGlzYWJsZWQpO1xufVxuXG4uZGVmYXVsdC5kYW5nZXIgYnV0dG9uIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctZGFuZ2VyKTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQtb25kYW5nZXIpO1xufVxuLmRlZmF1bHQuZGFuZ2VyOm5vdCguZGlzYWJsZWQpIGJ1dHRvbjpmb2N1cyB7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYm9yZGVyLWRhbmdlci1zdHJvbmcpO1xufVxuLmRlZmF1bHQuZGFuZ2VyOm5vdCguZGlzYWJsZWQpIGJ1dHRvbjphY3RpdmUge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1iZy1kYW5nZXItcHJlc3NlZCk7XG59XG4uZGVmYXVsdC5kYW5nZXIuZGlzYWJsZWQgYnV0dG9uIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctZGlzYWJsZWQpO1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dC1vbmRpc2FibGVkKTtcbn1cblxuLnNlY29uZGFyeSBidXR0b24ge1xuICBib3JkZXItY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJvcmRlcik7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dCk7XG59XG4uc2Vjb25kYXJ5Om5vdCguZGlzYWJsZWQpIGJ1dHRvbjpmb2N1cyB7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYm9yZGVyLXNlbGVjdGVkKTtcbn1cbi5zZWNvbmRhcnk6bm90KC5kaXNhYmxlZCkgYnV0dG9uOmFjdGl2ZSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJnLXByZXNzZWQpO1xufVxuLnNlY29uZGFyeS5kaXNhYmxlZCBidXR0b24ge1xuICBib3JkZXItY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJvcmRlci1kaXNhYmxlZCk7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LWRpc2FibGVkKTtcbn1cblxuLnNlY29uZGFyeS5kYW5nZXIgYnV0dG9uIHtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXItZGFuZ2VyKTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQtZGFuZ2VyKTtcbn1cbi5zZWNvbmRhcnkuZGFuZ2VyOm5vdCguZGlzYWJsZWQpIGJ1dHRvbjpmb2N1cyB7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYm9yZGVyLWRhbmdlci1zdHJvbmcpO1xufVxuLnNlY29uZGFyeS5kYW5nZXIuZGlzYWJsZWQgYnV0dG9uIHtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXItZGlzYWJsZWQtc3Ryb25nKTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQtZGlzYWJsZWQpO1xufVxuXG4ubG9hZGluZ0luZGljYXRvciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiA1MCU7XG4gIGxlZnQ6IDUwJTtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xufVxuXG4uZGVmYXVsdCAubG9hZGluZ0luZGljYXRvciB7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1pY29uLW9uYnJhbmQpO1xufVxuLmRlZmF1bHQuZGlzYWJsZWQgLmxvYWRpbmdJbmRpY2F0b3Ige1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItaWNvbi1vbmRpc2FibGVkKTtcbn1cblxuLmRlZmF1bHQuZGFuZ2VyIC5sb2FkaW5nSW5kaWNhdG9yIHtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWljb24tb25kYW5nZXIpO1xufVxuLmRlZmF1bHQuZGFuZ2VyLmRpc2FibGVkIC5sb2FkaW5nSW5kaWNhdG9yIHtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWljb24tb25kaXNhYmxlZCk7XG59XG5cbi5zZWNvbmRhcnkgLmxvYWRpbmdJbmRpY2F0b3Ige1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dCk7XG59XG4uc2Vjb25kYXJ5LmRpc2FibGVkIC5sb2FkaW5nSW5kaWNhdG9yIHtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQtZGlzYWJsZWQpO1xufVxuXG4uc2Vjb25kYXJ5LmRhbmdlciAubG9hZGluZ0luZGljYXRvciB7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LWRhbmdlcik7XG59XG4uc2Vjb25kYXJ5LmRhbmdlci5kaXNhYmxlZCAubG9hZGluZ0luZGljYXRvciB7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LWRpc2FibGVkKTtcbn1cblxuLmNoaWxkcmVuIHtcbiAgZGlzcGxheTogaW5saW5lO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbn1cbi5sb2FkaW5nIC5jaGlsZHJlbiB7XG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcbn1cbiJdfQ== */`;
        document.head.append(element);
      }
      button_module_default = { "button": "_button_avmy7_1", "fullWidth": "_fullWidth_avmy7_7", "disabled": "_disabled_avmy7_11", "default": "_default_avmy7_33", "danger": "_danger_avmy7_53", "secondary": "_secondary_avmy7_68", "loadingIndicator": "_loadingIndicator_avmy7_96", "children": "_children_avmy7_132", "loading": "_loading_avmy7_96" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/button/button.js
  var Button;
  var init_button = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/button/button.js"() {
      init_preact_module();
      init_hooks_module();
      init_create_class_name();
      init_create_component();
      init_no_op();
      init_loading_indicator();
      init_button_module();
      Button = createComponent(function(_a, ref) {
        var _b = _a, { children, danger = false, disabled = false, fullWidth = false, loading = false, onClick = noop, onKeyDown = noop, propagateEscapeKeyDown = true, secondary = false } = _b, rest = __objRest(_b, ["children", "danger", "disabled", "fullWidth", "loading", "onClick", "onKeyDown", "propagateEscapeKeyDown", "secondary"]);
        const handleKeyDown = q2(function(event) {
          onKeyDown(event);
          if (event.key === "Escape") {
            if (propagateEscapeKeyDown === false) {
              event.stopPropagation();
            }
            event.currentTarget.blur();
          }
        }, [onKeyDown, propagateEscapeKeyDown]);
        return _(
          "div",
          { class: createClassName([
            button_module_default.button,
            secondary === true ? button_module_default.secondary : button_module_default.default,
            danger === true ? button_module_default.danger : null,
            fullWidth === true ? button_module_default.fullWidth : null,
            disabled === true ? button_module_default.disabled : null,
            loading === true ? button_module_default.loading : null
          ]) },
          _(
            "button",
            __spreadProps(__spreadValues({}, rest), { ref, disabled: disabled === true, onClick: loading === true ? void 0 : onClick, onKeyDown: handleKeyDown, tabIndex: 0 }),
            _("div", { class: button_module_default.children }, children)
          ),
          loading === true ? _(
            "div",
            { class: button_module_default.loadingIndicator },
            _(LoadingIndicator, null)
          ) : null
        );
      });
    }
  });

  // node_modules/hex-rgb/index.js
  function hexRgb(hex, options = {}) {
    if (typeof hex !== "string" || nonHexChars.test(hex) || !validHexSize.test(hex)) {
      throw new TypeError("Expected a valid hex string");
    }
    hex = hex.replace(/^#/, "");
    let alphaFromHex = 1;
    if (hex.length === 8) {
      alphaFromHex = Number.parseInt(hex.slice(6, 8), 16) / 255;
      hex = hex.slice(0, 6);
    }
    if (hex.length === 4) {
      alphaFromHex = Number.parseInt(hex.slice(3, 4).repeat(2), 16) / 255;
      hex = hex.slice(0, 3);
    }
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const number = Number.parseInt(hex, 16);
    const red = number >> 16;
    const green = number >> 8 & 255;
    const blue = number & 255;
    const alpha = typeof options.alpha === "number" ? options.alpha : alphaFromHex;
    if (options.format === "array") {
      return [red, green, blue, alpha];
    }
    if (options.format === "css") {
      const alphaString = alpha === 1 ? "" : ` / ${Number((alpha * 100).toFixed(2))}%`;
      return `rgb(${red} ${green} ${blue}${alphaString})`;
    }
    return { red, green, blue, alpha };
  }
  var hexCharacters, match3or4Hex, match6or8Hex, nonHexChars, validHexSize;
  var init_hex_rgb = __esm({
    "node_modules/hex-rgb/index.js"() {
      hexCharacters = "a-f\\d";
      match3or4Hex = `#?[${hexCharacters}]{3}[${hexCharacters}]?`;
      match6or8Hex = `#?[${hexCharacters}]{6}([${hexCharacters}]{2})?`;
      nonHexChars = new RegExp(`[^#${hexCharacters}]`, "gi");
      validHexSize = new RegExp(`^${match3or4Hex}$|^${match6or8Hex}$`, "i");
    }
  });

  // node_modules/@create-figma-plugin/utilities/lib/color/convert-hex-color-to-rgb-color.js
  function convertHexColorToRgbColor(hexColor) {
    if (hexColor.length !== 3 && hexColor.length !== 6) {
      return null;
    }
    try {
      const { red, green, blue } = hexRgb(hexColor);
      return {
        b: blue / 255,
        g: green / 255,
        r: red / 255
      };
    } catch (e3) {
      return null;
    }
  }
  var init_convert_hex_color_to_rgb_color = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/color/convert-hex-color-to-rgb-color.js"() {
      init_hex_rgb();
    }
  });

  // node_modules/@create-figma-plugin/utilities/lib/color/private/named-colors.js
  var NAMED_COLORS;
  var init_named_colors = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/color/private/named-colors.js"() {
      NAMED_COLORS = {
        aliceblue: "F0F8FF",
        antiquewhite: "FAEBD7",
        aqua: "00FFFF",
        aquamarine: "7FFFD4",
        azure: "F0FFFF",
        beige: "F5F5DC",
        bisque: "FFE4C4",
        black: "000000",
        blanchedalmond: "FFEBCD",
        blue: "0000FF",
        blueviolet: "8A2BE2",
        brown: "A52A2A",
        burlywood: "DEB887",
        cadetblue: "5F9EA0",
        chartreuse: "7FFF00",
        chocolate: "D2691E",
        coral: "FF7F50",
        cornflowerblue: "6495ED",
        cornsilk: "FFF8DC",
        crimson: "DC143C",
        cyan: "00FFFF",
        darkblue: "00008B",
        darkcyan: "008B8B",
        darkgoldenrod: "B8860B",
        darkgray: "A9A9A9",
        darkgreen: "006400",
        darkgrey: "A9A9A9",
        darkkhaki: "BDB76B",
        darkmagenta: "8B008B",
        darkolivegreen: "556B2F",
        darkorange: "FF8C00",
        darkorchid: "9932CC",
        darkred: "8B0000",
        darksalmon: "E9967A",
        darkseagreen: "8FBC8F",
        darkslateblue: "483D8B",
        darkslategray: "2F4F4F",
        darkslategrey: "2F4F4F",
        darkturquoise: "00CED1",
        darkviolet: "9400D3",
        deeppink: "FF1493",
        deepskyblue: "00BFFF",
        dimgray: "696969",
        dimgrey: "696969",
        dodgerblue: "1E90FF",
        firebrick: "B22222",
        floralwhite: "FFFAF0",
        forestgreen: "228B22",
        fuchsia: "FF00FF",
        gainsboro: "DCDCDC",
        ghostwhite: "F8F8FF",
        gold: "FFD700",
        goldenrod: "DAA520",
        gray: "808080",
        green: "008000",
        greenyellow: "ADFF2F",
        grey: "808080",
        honeydew: "F0FFF0",
        hotpink: "FF69B4",
        indianred: "CD5C5C",
        indigo: "4B0082",
        ivory: "FFFFF0",
        khaki: "F0E68C",
        lavender: "E6E6FA",
        lavenderblush: "FFF0F5",
        lawngreen: "7CFC00",
        lemonchiffon: "FFFACD",
        lightblue: "ADD8E6",
        lightcoral: "F08080",
        lightcyan: "E0FFFF",
        lightgoldenrodyellow: "FAFAD2",
        lightgray: "D3D3D3",
        lightgreen: "90EE90",
        lightgrey: "D3D3D3",
        lightpink: "FFB6C1",
        lightsalmon: "FFA07A",
        lightseagreen: "20B2AA",
        lightskyblue: "87CEFA",
        lightslategray: "778899",
        lightslategrey: "778899",
        lightsteelblue: "B0C4DE",
        lightyellow: "FFFFE0",
        lime: "00FF00",
        limegreen: "32CD32",
        linen: "FAF0E6",
        magenta: "FF00FF",
        maroon: "800000",
        mediumaquamarine: "66CDAA",
        mediumblue: "0000CD",
        mediumorchid: "BA55D3",
        mediumpurple: "9370DB",
        mediumseagreen: "3CB371",
        mediumslateblue: "7B68EE",
        mediumspringgreen: "00FA9A",
        mediumturquoise: "48D1CC",
        mediumvioletred: "C71585",
        midnightblue: "191970",
        mintcream: "F5FFFA",
        mistyrose: "FFE4E1",
        moccasin: "FFE4B5",
        navajowhite: "FFDEAD",
        navy: "000080",
        oldlace: "FDF5E6",
        olive: "808000",
        olivedrab: "6B8E23",
        orange: "FFA500",
        orangered: "FF4500",
        orchid: "DA70D6",
        palegoldenrod: "EEE8AA",
        palegreen: "98FB98",
        paleturquoise: "AFEEEE",
        palevioletred: "DB7093",
        papayawhip: "FFEFD5",
        peachpuff: "FFDAB9",
        peru: "CD853F",
        pink: "FFC0CB",
        plum: "DDA0DD",
        powderblue: "B0E0E6",
        purple: "800080",
        rebeccapurple: "663399",
        red: "FF0000",
        rosybrown: "BC8F8F",
        royalblue: "4169E1",
        saddlebrown: "8B4513",
        salmon: "FA8072",
        sandybrown: "F4A460",
        seagreen: "2E8B57",
        seashell: "FFF5EE",
        sienna: "A0522D",
        silver: "C0C0C0",
        skyblue: "87CEEB",
        slateblue: "6A5ACD",
        slategray: "708090",
        slategrey: "708090",
        snow: "FFFAFA",
        springgreen: "00FF7F",
        steelblue: "4682B4",
        tan: "D2B48C",
        teal: "008080",
        thistle: "D8BFD8",
        tomato: "FF6347",
        turquoise: "40E0D0",
        violet: "EE82EE",
        wheat: "F5DEB3",
        white: "FFFFFF",
        whitesmoke: "F5F5F5",
        yellow: "FFFF00",
        yellowgreen: "9ACD32"
      };
    }
  });

  // node_modules/@create-figma-plugin/utilities/lib/color/convert-named-color-to-hex-color.js
  function convertNamedColorToHexColor(namedColor) {
    const hexColor = NAMED_COLORS[namedColor.toLowerCase()];
    if (typeof hexColor === "undefined") {
      return null;
    }
    return hexColor;
  }
  var init_convert_named_color_to_hex_color = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/color/convert-named-color-to-hex-color.js"() {
      init_named_colors();
    }
  });

  // node_modules/rgb-hex/index.js
  function rgbHex(red, green, blue, alpha) {
    let isPercent = (red + (alpha || "")).toString().includes("%");
    if (typeof red === "string" && !green) {
      const parsed = parseCssRgbString(red);
      if (!parsed) {
        throw new TypeError("Invalid or unsupported color format.");
      }
      isPercent = false;
      [red, green, blue, alpha] = parsed;
    } else if (alpha !== void 0) {
      alpha = Number.parseFloat(alpha);
    }
    if (typeof red !== "number" || typeof green !== "number" || typeof blue !== "number" || red > 255 || green > 255 || blue > 255) {
      throw new TypeError("Expected three numbers below 256");
    }
    if (typeof alpha === "number") {
      if (!isPercent && alpha >= 0 && alpha <= 1) {
        alpha = Math.round(255 * alpha);
      } else if (isPercent && alpha >= 0 && alpha <= 100) {
        alpha = Math.round(255 * alpha / 100);
      } else {
        throw new TypeError(`Expected alpha value (${alpha}) as a fraction or percentage`);
      }
      alpha = (alpha | 1 << 8).toString(16).slice(1);
    } else {
      alpha = "";
    }
    return toHex(red, green, blue, alpha);
  }
  var toHex, parseCssRgbString;
  var init_rgb_hex = __esm({
    "node_modules/rgb-hex/index.js"() {
      toHex = (red, green, blue, alpha) => (blue | green << 8 | red << 16 | 1 << 24).toString(16).slice(1) + alpha;
      parseCssRgbString = (input) => {
        const parts = input.replace(/rgba?\(([^)]+)\)/, "$1").split(/[,\s/]+/).filter(Boolean);
        if (parts.length < 3) {
          return;
        }
        const parseValue = (value2, max) => {
          value2 = value2.trim();
          if (value2.endsWith("%")) {
            return Math.min(Number.parseFloat(value2) * max / 100, max);
          }
          return Math.min(Number.parseFloat(value2), max);
        };
        const red = parseValue(parts[0], 255);
        const green = parseValue(parts[1], 255);
        const blue = parseValue(parts[2], 255);
        let alpha;
        if (parts.length === 4) {
          alpha = parseValue(parts[3], 1);
        }
        return [red, green, blue, alpha];
      };
    }
  });

  // node_modules/@create-figma-plugin/utilities/lib/color/convert-rgb-color-to-hex-color.js
  function convertRgbColorToHexColor(rgbColor) {
    const { r: r3, g: g4, b: b2 } = rgbColor;
    if (r3 < 0 || r3 > 1 || g4 < 0 || g4 > 1 || b2 < 0 || b2 > 1) {
      return null;
    }
    try {
      return rgbHex(Math.round(r3 * 255), Math.round(g4 * 255), Math.round(b2 * 255)).toUpperCase();
    } catch (e3) {
      return null;
    }
  }
  var init_convert_rgb_color_to_hex_color = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/color/convert-rgb-color-to-hex-color.js"() {
      init_rgb_hex();
    }
  });

  // node_modules/@create-figma-plugin/utilities/lib/color/is-valid-hex-color.js
  function isValidHexColor(hexColor) {
    return convertHexColorToRgbColor(hexColor) !== null;
  }
  var init_is_valid_hex_color = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/color/is-valid-hex-color.js"() {
      init_convert_hex_color_to_rgb_color();
    }
  });

  // node_modules/@create-figma-plugin/utilities/lib/mixed-values.js
  var MIXED_BOOLEAN, MIXED_NUMBER, MIXED_STRING;
  var init_mixed_values = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/mixed-values.js"() {
      MIXED_BOOLEAN = null;
      MIXED_NUMBER = 999999999999999;
      MIXED_STRING = "999999999999999";
    }
  });

  // node_modules/@create-figma-plugin/utilities/lib/number/private/regex.js
  var floatOperandRegex, integerOperandRegex, operatorRegex, operatorSuffixRegex, numbersRegex, invalidCharactersRegex;
  var init_regex = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/number/private/regex.js"() {
      floatOperandRegex = /^-?\d*(?:\.\d*)?$/;
      integerOperandRegex = /^-?\d*$/;
      operatorRegex = /[+\-*/]/;
      operatorSuffixRegex = /[+\-*/]$/;
      numbersRegex = /\d/;
      invalidCharactersRegex = /[^\d.+\-*/]/;
    }
  });

  // node_modules/@create-figma-plugin/utilities/lib/number/evaluate-numeric-expression.js
  function evaluateNumericExpression(value) {
    if (value === "" || numbersRegex.test(value) === false || invalidCharactersRegex.test(value) === true) {
      return null;
    }
    if (operatorRegex.test(value) === true) {
      if (operatorSuffixRegex.test(value) === true) {
        return eval(value.substring(0, value.length - 1));
      }
      return eval(value);
    }
    return parseFloat(value);
  }
  var init_evaluate_numeric_expression = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/number/evaluate-numeric-expression.js"() {
      init_regex();
    }
  });

  // node_modules/@create-figma-plugin/utilities/lib/number/is-valid-numeric-input.js
  function isValidNumericInput(value2, options = { integersOnly: false }) {
    const split = (value2[0] === "-" ? value2.substring(1) : value2).split(operatorRegex);
    let i3 = -1;
    while (++i3 < split.length) {
      const operand = split[i3];
      if (operand === "" && i3 !== split.length - 1 || (options.integersOnly === true ? integerOperandRegex : floatOperandRegex).test(operand) === false) {
        return false;
      }
    }
    return true;
  }
  var init_is_valid_numeric_input = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/number/is-valid-numeric-input.js"() {
      init_regex();
    }
  });

  // node_modules/@create-figma-plugin/utilities/lib/index.js
  var init_lib = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/index.js"() {
      init_convert_hex_color_to_rgb_color();
      init_convert_named_color_to_hex_color();
      init_convert_rgb_color_to_hex_color();
      init_is_valid_hex_color();
      init_mixed_values();
      init_evaluate_numeric_expression();
      init_is_valid_numeric_input();
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/create-icon.js
  function createIcon(svg) {
    return createComponent(function(_a) {
      var _b = _a, { color } = _b, rest = __objRest(_b, ["color"]);
      return _("div", __spreadProps(__spreadValues({}, rest), { style: {
        color: typeof color === "undefined" ? "currentColor" : `var(--figma-color-icon-${color})`
      } }), svg);
    });
  }
  var init_create_icon = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/create-icon.js"() {
      init_preact_module();
      init_create_component();
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-check-16.js
  var IconCheck16;
  var init_icon_check_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-check-16.js"() {
      init_preact_module();
      init_create_icon();
      IconCheck16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M11.7773 4.084c.2298.15317.2919.46361.1387.69337L7.91603 10.7774a.5002.5002 0 0 1-.36676.2202.5003.5003 0 0 1-.40282-.144l-3-3.00002c-.19527-.19527-.19527-.51185 0-.70711.19526-.19526.51184-.19526.7071 0L7.42229 9.7152 11.084 4.22267c.1532-.22976.4636-.29185.6933-.13867", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-mixed-16.js
  var IconMixed16;
  var init_icon_mixed_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-mixed-16.js"() {
      init_preact_module();
      init_create_icon();
      IconMixed16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { d: "M4 8c0-.27614.22386-.5.5-.5h7c.2761 0 .5.22386.5.5s-.2239.5-.5.5h-7c-.27614 0-.5-.22386-.5-.5", fill: "currentColor" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/utilities/get-current-from-ref.js
  function getCurrentFromRef(ref) {
    if (ref.current === null) {
      throw new Error("`ref.current` is `undefined`");
    }
    return ref.current;
  }
  var init_get_current_from_ref = __esm({
    "node_modules/@create-figma-plugin/ui/lib/utilities/get-current-from-ref.js"() {
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/31449225-41c7-4dd3-9fa8-71f4ee9fbb1e/checkbox.module.js
  var checkbox_module_default;
  var init_checkbox_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/31449225-41c7-4dd3-9fa8-71f4ee9fbb1e/checkbox.module.js"() {
      if (document.getElementById("f38d076240") === null) {
        const element = document.createElement("style");
        element.id = "f38d076240";
        element.textContent = `._checkbox_9p65z_1 {
  position: relative;
  z-index: var(--z-index-1);
  display: flex;
  gap: var(--space-8);
}

._disabled_9p65z_8,
._disabled_9p65z_8 * {
  cursor: not-allowed;
}

._input_9p65z_13 {
  position: absolute;
  z-index: var(
    --z-index-1
  ); /* stack \`.input\` over all other elements within \`.checkbox\` */
  top: calc(-1 * var(--space-8));
  right: calc(-1 * var(--space-8));
  bottom: calc(-1 * var(--space-8));
  left: calc(-1 * var(--space-8));
  display: block;
}

._box_9p65z_25 {
  position: relative;
  width: var(--space-16);
  height: var(--space-16);
  border: var(--border-width-1) solid var(--figma-color-border);
  border-radius: var(--border-radius-4);
  background-color: var(--figma-color-bg-secondary);
}
._checkbox_9p65z_1:not(._disabled_9p65z_8) ._input_9p65z_13:focus-visible ~ ._box_9p65z_25 {
  box-shadow: 0 0 0 var(--border-width-1) var(--figma-color-bg) inset;
}
._checkbox_9p65z_1:not(._disabled_9p65z_8) ._input_9p65z_13:focus ~ ._box_9p65z_25 {
  border-color: var(--figma-color-border-selected);
}
._checkbox_9p65z_1:not(._disabled_9p65z_8) ._input_9p65z_13:checked ~ ._box_9p65z_25,
._checkbox_9p65z_1:not(._disabled_9p65z_8) ._input_9p65z_13:indeterminate ~ ._box_9p65z_25 {
  border-color: var(--figma-color-border-brand-strong);
  background-color: var(--figma-color-bg-brand);
}

._disabled_9p65z_8 ._input_9p65z_13 ~ ._box_9p65z_25 {
  background-color: transparent;
}
._disabled_9p65z_8 ._input_9p65z_13:checked ~ ._box_9p65z_25,
._disabled_9p65z_8 ._input_9p65z_13:indeterminate ~ ._box_9p65z_25 {
  border-color: transparent;
  background-color: var(--figma-color-bg-disabled);
}

._icon_9p65z_54 {
  position: absolute;
  top: calc(-1 * var(--border-width-1));
  left: calc(-1 * var(--border-width-1));
  color: var(--figma-color-icon-onbrand);
}

._children_9p65z_61 {
  flex: 1;
  padding-top: var(--space-4);
  color: var(--figma-color-text);
}
._disabled_9p65z_8 ._children_9p65z_61 {
  opacity: var(--opacity-30);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9jaGVja2JveC9jaGVja2JveC5tb2R1bGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usa0JBQWtCO0VBQ2xCLHlCQUF5QjtFQUN6QixhQUFhO0VBQ2IsbUJBQW1CO0FBQ3JCOztBQUVBOztFQUVFLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQjs7R0FFQyxFQUFFLDhEQUE4RDtFQUNqRSw4QkFBOEI7RUFDOUIsZ0NBQWdDO0VBQ2hDLGlDQUFpQztFQUNqQywrQkFBK0I7RUFDL0IsY0FBYztBQUNoQjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixzQkFBc0I7RUFDdEIsdUJBQXVCO0VBQ3ZCLDZEQUE2RDtFQUM3RCxxQ0FBcUM7RUFDckMsaURBQWlEO0FBQ25EO0FBQ0E7RUFDRSxtRUFBbUU7QUFDckU7QUFDQTtFQUNFLGdEQUFnRDtBQUNsRDtBQUNBOztFQUVFLG9EQUFvRDtFQUNwRCw2Q0FBNkM7QUFDL0M7O0FBRUE7RUFDRSw2QkFBNkI7QUFDL0I7QUFDQTs7RUFFRSx5QkFBeUI7RUFDekIsZ0RBQWdEO0FBQ2xEOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLHFDQUFxQztFQUNyQyxzQ0FBc0M7RUFDdEMsc0NBQXNDO0FBQ3hDOztBQUVBO0VBQ0UsT0FBTztFQUNQLDJCQUEyQjtFQUMzQiw4QkFBOEI7QUFDaEM7QUFDQTtFQUNFLDBCQUEwQjtBQUM1QiIsImZpbGUiOiJub2RlX21vZHVsZXMvQGNyZWF0ZS1maWdtYS1wbHVnaW4vdWkvbGliL2NvbXBvbmVudHMvY2hlY2tib3gvY2hlY2tib3gubW9kdWxlLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jaGVja2JveCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgei1pbmRleDogdmFyKC0tei1pbmRleC0xKTtcbiAgZGlzcGxheTogZmxleDtcbiAgZ2FwOiB2YXIoLS1zcGFjZS04KTtcbn1cblxuLmRpc2FibGVkLFxuLmRpc2FibGVkICoge1xuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xufVxuXG4uaW5wdXQge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IHZhcihcbiAgICAtLXotaW5kZXgtMVxuICApOyAvKiBzdGFjayBgLmlucHV0YCBvdmVyIGFsbCBvdGhlciBlbGVtZW50cyB3aXRoaW4gYC5jaGVja2JveGAgKi9cbiAgdG9wOiBjYWxjKC0xICogdmFyKC0tc3BhY2UtOCkpO1xuICByaWdodDogY2FsYygtMSAqIHZhcigtLXNwYWNlLTgpKTtcbiAgYm90dG9tOiBjYWxjKC0xICogdmFyKC0tc3BhY2UtOCkpO1xuICBsZWZ0OiBjYWxjKC0xICogdmFyKC0tc3BhY2UtOCkpO1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuLmJveCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgd2lkdGg6IHZhcigtLXNwYWNlLTE2KTtcbiAgaGVpZ2h0OiB2YXIoLS1zcGFjZS0xNik7XG4gIGJvcmRlcjogdmFyKC0tYm9yZGVyLXdpZHRoLTEpIHNvbGlkIHZhcigtLWZpZ21hLWNvbG9yLWJvcmRlcik7XG4gIGJvcmRlci1yYWRpdXM6IHZhcigtLWJvcmRlci1yYWRpdXMtNCk7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJnLXNlY29uZGFyeSk7XG59XG4uY2hlY2tib3g6bm90KC5kaXNhYmxlZCkgLmlucHV0OmZvY3VzLXZpc2libGUgfiAuYm94IHtcbiAgYm94LXNoYWRvdzogMCAwIDAgdmFyKC0tYm9yZGVyLXdpZHRoLTEpIHZhcigtLWZpZ21hLWNvbG9yLWJnKSBpbnNldDtcbn1cbi5jaGVja2JveDpub3QoLmRpc2FibGVkKSAuaW5wdXQ6Zm9jdXMgfiAuYm94IHtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXItc2VsZWN0ZWQpO1xufVxuLmNoZWNrYm94Om5vdCguZGlzYWJsZWQpIC5pbnB1dDpjaGVja2VkIH4gLmJveCxcbi5jaGVja2JveDpub3QoLmRpc2FibGVkKSAuaW5wdXQ6aW5kZXRlcm1pbmF0ZSB+IC5ib3gge1xuICBib3JkZXItY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJvcmRlci1icmFuZC1zdHJvbmcpO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1iZy1icmFuZCk7XG59XG5cbi5kaXNhYmxlZCAuaW5wdXQgfiAuYm94IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG59XG4uZGlzYWJsZWQgLmlucHV0OmNoZWNrZWQgfiAuYm94LFxuLmRpc2FibGVkIC5pbnB1dDppbmRldGVybWluYXRlIH4gLmJveCB7XG4gIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJnLWRpc2FibGVkKTtcbn1cblxuLmljb24ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogY2FsYygtMSAqIHZhcigtLWJvcmRlci13aWR0aC0xKSk7XG4gIGxlZnQ6IGNhbGMoLTEgKiB2YXIoLS1ib3JkZXItd2lkdGgtMSkpO1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItaWNvbi1vbmJyYW5kKTtcbn1cblxuLmNoaWxkcmVuIHtcbiAgZmxleDogMTtcbiAgcGFkZGluZy10b3A6IHZhcigtLXNwYWNlLTQpO1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dCk7XG59XG4uZGlzYWJsZWQgLmNoaWxkcmVuIHtcbiAgb3BhY2l0eTogdmFyKC0tb3BhY2l0eS0zMCk7XG59XG4iXX0= */`;
        document.head.append(element);
      }
      checkbox_module_default = { "checkbox": "_checkbox_9p65z_1", "disabled": "_disabled_9p65z_8", "input": "_input_9p65z_13", "box": "_box_9p65z_25", "icon": "_icon_9p65z_54", "children": "_children_9p65z_61" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/checkbox/checkbox.js
  var Checkbox;
  var init_checkbox = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/checkbox/checkbox.js"() {
      init_lib();
      init_preact_module();
      init_hooks_module();
      init_icon_check_16();
      init_icon_mixed_16();
      init_create_class_name();
      init_create_component();
      init_get_current_from_ref();
      init_no_op();
      init_checkbox_module();
      Checkbox = createComponent(function(_a, ref) {
        var _b = _a, { children, disabled = false, onChange = noop, onKeyDown = noop, onValueChange = noop, propagateEscapeKeyDown = true, value: value2 } = _b, rest = __objRest(_b, ["children", "disabled", "onChange", "onKeyDown", "onValueChange", "propagateEscapeKeyDown", "value"]);
        const inputElementRef = A2(null);
        const handleChange = q2(function(event) {
          onChange(event);
          const newValue = event.currentTarget.checked === true;
          onValueChange(newValue);
        }, [onChange, onValueChange]);
        const handleKeyDown = q2(function(event) {
          onKeyDown(event);
          if (event.key === "Escape") {
            if (propagateEscapeKeyDown === false) {
              event.stopPropagation();
            }
            event.currentTarget.blur();
          }
        }, [onKeyDown, propagateEscapeKeyDown]);
        y2(function() {
          const inputElement = getCurrentFromRef(inputElementRef);
          inputElement.indeterminate = value2 === MIXED_BOOLEAN ? true : false;
        }, [value2]);
        const refCallback = q2(function(inputElement) {
          inputElementRef.current = inputElement;
          if (ref === null) {
            return;
          }
          if (typeof ref === "function") {
            ref(inputElement);
            return;
          }
          ref.current = inputElement;
        }, [ref]);
        return _(
          "label",
          { class: createClassName([
            checkbox_module_default.checkbox,
            disabled === true ? checkbox_module_default.disabled : null,
            value2 === MIXED_BOOLEAN ? checkbox_module_default.mixed : null
          ]) },
          _("input", __spreadProps(__spreadValues({}, rest), { ref: refCallback, checked: value2 === true, class: checkbox_module_default.input, disabled: disabled === true, onChange: handleChange, onKeyDown: handleKeyDown, tabIndex: 0, type: "checkbox" })),
          _("div", { class: checkbox_module_default.box }, value2 === MIXED_BOOLEAN ? _(
            "div",
            { class: checkbox_module_default.icon },
            _(IconMixed16, null)
          ) : value2 === true ? _(
            "div",
            { class: checkbox_module_default.icon },
            _(IconCheck16, null)
          ) : null),
          _("div", { class: checkbox_module_default.children }, children)
        );
      });
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-chevron-right-16.js
  var IconChevronRight16;
  var init_icon_chevron_right_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-chevron-right-16.js"() {
      init_preact_module();
      init_create_icon();
      IconChevronRight16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M6.76754 5.52511c.19526-.19526.51184-.19526.70711 0l2.12131 2.12132.35356.35356-.35356.35355-2.12131 2.12136c-.19527.1952-.51185.1952-.70711 0-.19526-.1953-.19526-.51188 0-.70715l1.76777-1.76776-1.76777-1.76777c-.19526-.19527-.19526-.51185 0-.70711", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/66400808-2ec5-4d14-b079-d642e21e4c24/disclosure.module.js
  var disclosure_module_default;
  var init_disclosure_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/66400808-2ec5-4d14-b079-d642e21e4c24/disclosure.module.js"() {
      if (document.getElementById("4712e1cb0c") === null) {
        const element = document.createElement("style");
        element.id = "4712e1cb0c";
        element.textContent = `._label_1x6ey_1 {
  position: relative;
  z-index: var(--z-index-1);
}

._input_1x6ey_6 {
  position: absolute;
  z-index: var(
    --z-index-1
  ); /* stack \`.input\` over all other elements within \`.label\` */
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

._title_1x6ey_17,
._children_1x6ey_18 {
  padding: var(--space-8) var(--space-12) var(--space-8) var(--space-16);
}

._title_1x6ey_17 {
  position: relative;
  border-radius: var(--border-radius-4);
  color: var(--figma-color-text);
  font-weight: var(--font-weight-bold);
}
._input_1x6ey_6:focus-visible ~ ._title_1x6ey_17 {
  box-shadow: 0 0 0 var(--border-width-1) var(--figma-color-border-selected)
    inset;
}

._title_1x6ey_17 ._icon_1x6ey_33 {
  position: absolute;
  left: var(--space-0);
  color: var(--figma-color-icon);
}
._input_1x6ey_6:checked ~ ._title_1x6ey_17 ._icon_1x6ey_33 {
  transform: rotate(90deg);
}

._children_1x6ey_18 {
  color: var(--figma-color-text);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9kaXNjbG9zdXJlL2Rpc2Nsb3N1cmUubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGtCQUFrQjtFQUNsQix5QkFBeUI7QUFDM0I7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEI7O0dBRUMsRUFBRSwyREFBMkQ7RUFDOUQsTUFBTTtFQUNOLFFBQVE7RUFDUixTQUFTO0VBQ1QsT0FBTztBQUNUOztBQUVBOztFQUVFLHNFQUFzRTtBQUN4RTs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixxQ0FBcUM7RUFDckMsOEJBQThCO0VBQzlCLG9DQUFvQztBQUN0QztBQUNBO0VBQ0U7U0FDTztBQUNUOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLG9CQUFvQjtFQUNwQiw4QkFBOEI7QUFDaEM7QUFDQTtFQUNFLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFLDhCQUE4QjtBQUNoQyIsImZpbGUiOiJub2RlX21vZHVsZXMvQGNyZWF0ZS1maWdtYS1wbHVnaW4vdWkvbGliL2NvbXBvbmVudHMvZGlzY2xvc3VyZS9kaXNjbG9zdXJlLm1vZHVsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubGFiZWwge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHotaW5kZXg6IHZhcigtLXotaW5kZXgtMSk7XG59XG5cbi5pbnB1dCB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgei1pbmRleDogdmFyKFxuICAgIC0tei1pbmRleC0xXG4gICk7IC8qIHN0YWNrIGAuaW5wdXRgIG92ZXIgYWxsIG90aGVyIGVsZW1lbnRzIHdpdGhpbiBgLmxhYmVsYCAqL1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3R0b206IDA7XG4gIGxlZnQ6IDA7XG59XG5cbi50aXRsZSxcbi5jaGlsZHJlbiB7XG4gIHBhZGRpbmc6IHZhcigtLXNwYWNlLTgpIHZhcigtLXNwYWNlLTEyKSB2YXIoLS1zcGFjZS04KSB2YXIoLS1zcGFjZS0xNik7XG59XG5cbi50aXRsZSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgYm9yZGVyLXJhZGl1czogdmFyKC0tYm9yZGVyLXJhZGl1cy00KTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQpO1xuICBmb250LXdlaWdodDogdmFyKC0tZm9udC13ZWlnaHQtYm9sZCk7XG59XG4uaW5wdXQ6Zm9jdXMtdmlzaWJsZSB+IC50aXRsZSB7XG4gIGJveC1zaGFkb3c6IDAgMCAwIHZhcigtLWJvcmRlci13aWR0aC0xKSB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXItc2VsZWN0ZWQpXG4gICAgaW5zZXQ7XG59XG5cbi50aXRsZSAuaWNvbiB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogdmFyKC0tc3BhY2UtMCk7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1pY29uKTtcbn1cbi5pbnB1dDpjaGVja2VkIH4gLnRpdGxlIC5pY29uIHtcbiAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpO1xufVxuXG4uY2hpbGRyZW4ge1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dCk7XG59XG4iXX0= */`;
        document.head.append(element);
      }
      disclosure_module_default = { "label": "_label_1x6ey_1", "input": "_input_1x6ey_6", "title": "_title_1x6ey_17", "children": "_children_1x6ey_18", "icon": "_icon_1x6ey_33" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/disclosure/disclosure.js
  var Disclosure;
  var init_disclosure = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/disclosure/disclosure.js"() {
      init_preact_module();
      init_hooks_module();
      init_icon_chevron_right_16();
      init_create_component();
      init_no_op();
      init_disclosure_module();
      Disclosure = createComponent(function(_a, ref) {
        var _b = _a, { children, onClick = noop, onKeyDown = noop, open, propagateEscapeKeyDown = true, title } = _b, rest = __objRest(_b, ["children", "onClick", "onKeyDown", "open", "propagateEscapeKeyDown", "title"]);
        const handleKeyDown = q2(function(event) {
          onKeyDown(event);
          if (event.key === "Escape") {
            if (propagateEscapeKeyDown === false) {
              event.stopPropagation();
            }
            event.currentTarget.blur();
          }
        }, [onKeyDown, propagateEscapeKeyDown]);
        return _(
          k,
          null,
          _(
            "label",
            { class: disclosure_module_default.label },
            _("input", __spreadProps(__spreadValues({}, rest), { ref, checked: open === true, class: disclosure_module_default.input, onClick, onKeyDown: handleKeyDown, tabIndex: 0, type: "checkbox" })),
            _(
              "div",
              { class: disclosure_module_default.title },
              _(
                "div",
                { class: disclosure_module_default.icon },
                _(IconChevronRight16, null)
              ),
              title
            )
          ),
          open === true ? _("div", { class: disclosure_module_default.children }, children) : null
        );
      });
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/1d3d88e7-8363-47ed-aab4-dc913f016a69/divider.module.js
  var divider_module_default;
  var init_divider_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/1d3d88e7-8363-47ed-aab4-dc913f016a69/divider.module.js"() {
      if (document.getElementById("4bf06403b9") === null) {
        const element = document.createElement("style");
        element.id = "4bf06403b9";
        element.textContent = `._divider_m18ta_1 {
  width: 100%;
  height: 1px;
  background-color: var(--figma-color-border);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9kaXZpZGVyL2RpdmlkZXIubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLFdBQVc7RUFDWCxXQUFXO0VBQ1gsMkNBQTJDO0FBQzdDIiwiZmlsZSI6Im5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9kaXZpZGVyL2RpdmlkZXIubW9kdWxlLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5kaXZpZGVyIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMXB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXIpO1xufVxuIl19 */`;
        document.head.append(element);
      }
      divider_module_default = { "divider": "_divider_m18ta_1" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/divider/divider.js
  var Divider;
  var init_divider = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/divider/divider.js"() {
      init_preact_module();
      init_create_component();
      init_divider_module();
      Divider = createComponent(function(rest, ref) {
        return _("hr", __spreadProps(__spreadValues({}, rest), { ref, class: divider_module_default.divider }));
      });
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/64082ba4-fbd3-4318-870d-6f4e8e2af9ff/menu.module.js
  var menu_module_default;
  var init_menu_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/64082ba4-fbd3-4318-870d-6f4e8e2af9ff/menu.module.js"() {
      if (document.getElementById("29044db304") === null) {
        const element = document.createElement("style");
        element.id = "29044db304";
        element.textContent = `._menu_1f0pn_1 {
  position: absolute;
  z-index: var(--z-index-2);
  left: 0;
  min-width: 100%;
  padding: var(--space-8);
  border-radius: var(--border-radius-12);
  background-color: var(--color-bg-menu);
  box-shadow: var(--box-shadow-menu);
  color: var(--figma-color-text-onbrand);
  font-size: var(--font-size-12);
  overflow-y: auto;
}
._menu_1f0pn_1::-webkit-scrollbar {
  display: none;
}
._menu_1f0pn_1:empty {
  display: none;
}

._hidden_1f0pn_21 {
  position: fixed;
  pointer-events: none;
  visibility: hidden;
}

@media screen and (-webkit-min-device-pixel-ratio: 1.5),
  screen and (min-resolution: 1.5dppx) {
  ._menu_1f0pn_1 {
    -webkit-font-smoothing: antialiased;
  }
}

._optionHeader_1f0pn_34,
._optionValue_1f0pn_35 {
  overflow: hidden;
  padding: var(--space-4) var(--space-12) var(--space-4) var(--space-28);
  text-overflow: ellipsis;
  white-space: nowrap;
}

._optionHeader_1f0pn_34 {
  color: rgba(255, 255, 255, 0.7); /* FIXME */
  font-size: var(--font-size-12);
}

._optionValue_1f0pn_35 {
  position: relative;
  border-radius: var(--border-radius-4);
}
._optionValueSelected_1f0pn_51 {
  background-color: var(--figma-color-bg-brand);
}
._optionValueDisabled_1f0pn_54 {
  color: rgba(255, 255, 255, 0.4); /* FIXME */
}

._optionSeparator_1f0pn_58 {
  width: 100%;
  height: 1px;
  margin: var(--space-extra-small) 0;
  background-color: #444444; /* FIXME */
}

._input_1f0pn_65 {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
}

._checkIcon_1f0pn_76 {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY3NzL21lbnUubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGtCQUFrQjtFQUNsQix5QkFBeUI7RUFDekIsT0FBTztFQUNQLGVBQWU7RUFDZix1QkFBdUI7RUFDdkIsc0NBQXNDO0VBQ3RDLHNDQUFzQztFQUN0QyxrQ0FBa0M7RUFDbEMsc0NBQXNDO0VBQ3RDLDhCQUE4QjtFQUM5QixnQkFBZ0I7QUFDbEI7QUFDQTtFQUNFLGFBQWE7QUFDZjtBQUNBO0VBQ0UsYUFBYTtBQUNmOztBQUVBO0VBQ0UsZUFBZTtFQUNmLG9CQUFvQjtFQUNwQixrQkFBa0I7QUFDcEI7O0FBRUE7O0VBRUU7SUFDRSxtQ0FBbUM7RUFDckM7QUFDRjs7QUFFQTs7RUFFRSxnQkFBZ0I7RUFDaEIsc0VBQXNFO0VBQ3RFLHVCQUF1QjtFQUN2QixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSwrQkFBK0IsRUFBRSxVQUFVO0VBQzNDLDhCQUE4QjtBQUNoQzs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixxQ0FBcUM7QUFDdkM7QUFDQTtFQUNFLDZDQUE2QztBQUMvQztBQUNBO0VBQ0UsK0JBQStCLEVBQUUsVUFBVTtBQUM3Qzs7QUFFQTtFQUNFLFdBQVc7RUFDWCxXQUFXO0VBQ1gsa0NBQWtDO0VBQ2xDLHlCQUF5QixFQUFFLFVBQVU7QUFDdkM7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsTUFBTTtFQUNOLFFBQVE7RUFDUixTQUFTO0VBQ1QsT0FBTztFQUNQLGNBQWM7RUFDZCxXQUFXO0VBQ1gsWUFBWTtBQUNkOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLG1CQUFtQjtFQUNuQixvQkFBb0I7QUFDdEIiLCJmaWxlIjoibm9kZV9tb2R1bGVzL0BjcmVhdGUtZmlnbWEtcGx1Z2luL3VpL2xpYi9jc3MvbWVudS5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLm1lbnUge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IHZhcigtLXotaW5kZXgtMik7XG4gIGxlZnQ6IDA7XG4gIG1pbi13aWR0aDogMTAwJTtcbiAgcGFkZGluZzogdmFyKC0tc3BhY2UtOCk7XG4gIGJvcmRlci1yYWRpdXM6IHZhcigtLWJvcmRlci1yYWRpdXMtMTIpO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvci1iZy1tZW51KTtcbiAgYm94LXNoYWRvdzogdmFyKC0tYm94LXNoYWRvdy1tZW51KTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQtb25icmFuZCk7XG4gIGZvbnQtc2l6ZTogdmFyKC0tZm9udC1zaXplLTEyKTtcbiAgb3ZlcmZsb3cteTogYXV0bztcbn1cbi5tZW51Ojotd2Via2l0LXNjcm9sbGJhciB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG4ubWVudTplbXB0eSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbi5oaWRkZW4ge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB2aXNpYmlsaXR5OiBoaWRkZW47XG59XG5cbkBtZWRpYSBzY3JlZW4gYW5kICgtd2Via2l0LW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDEuNSksXG4gIHNjcmVlbiBhbmQgKG1pbi1yZXNvbHV0aW9uOiAxLjVkcHB4KSB7XG4gIC5tZW51IHtcbiAgICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcbiAgfVxufVxuXG4ub3B0aW9uSGVhZGVyLFxuLm9wdGlvblZhbHVlIHtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgcGFkZGluZzogdmFyKC0tc3BhY2UtNCkgdmFyKC0tc3BhY2UtMTIpIHZhcigtLXNwYWNlLTQpIHZhcigtLXNwYWNlLTI4KTtcbiAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG59XG5cbi5vcHRpb25IZWFkZXIge1xuICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjcpOyAvKiBGSVhNRSAqL1xuICBmb250LXNpemU6IHZhcigtLWZvbnQtc2l6ZS0xMik7XG59XG5cbi5vcHRpb25WYWx1ZSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgYm9yZGVyLXJhZGl1czogdmFyKC0tYm9yZGVyLXJhZGl1cy00KTtcbn1cbi5vcHRpb25WYWx1ZVNlbGVjdGVkIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctYnJhbmQpO1xufVxuLm9wdGlvblZhbHVlRGlzYWJsZWQge1xuICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjQpOyAvKiBGSVhNRSAqL1xufVxuXG4ub3B0aW9uU2VwYXJhdG9yIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMXB4O1xuICBtYXJnaW46IHZhcigtLXNwYWNlLWV4dHJhLXNtYWxsKSAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNDQ0NDQ0OyAvKiBGSVhNRSAqL1xufVxuXG4uaW5wdXQge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgcmlnaHQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgbGVmdDogMDtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbi5jaGVja0ljb24ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogdmFyKC0tc3BhY2UtNCk7XG4gIGxlZnQ6IHZhcigtLXNwYWNlLTQpO1xufVxuIl19 */`;
        document.head.append(element);
      }
      menu_module_default = { "menu": "_menu_1f0pn_1", "hidden": "_hidden_1f0pn_21", "optionHeader": "_optionHeader_1f0pn_34", "optionValue": "_optionValue_1f0pn_35", "optionValueSelected": "_optionValueSelected_1f0pn_51", "optionValueDisabled": "_optionValueDisabled_1f0pn_54", "optionSeparator": "_optionSeparator_1f0pn_58", "input": "_input_1f0pn_65", "checkIcon": "_checkIcon_1f0pn_76" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/hooks/use-mouse-down-outside.js
  function useMouseDownOutside(options) {
    const { ref, onMouseDownOutside } = options;
    y2(function() {
      function handleBlur() {
        onMouseDownOutside();
      }
      function handleMouseDown(event) {
        const element = getCurrentFromRef(ref);
        if (element === event.target || element.contains(event.target)) {
          return;
        }
        onMouseDownOutside();
      }
      window.addEventListener("blur", handleBlur);
      window.addEventListener("mousedown", handleMouseDown);
      return function() {
        window.removeEventListener("blur", handleBlur);
        window.removeEventListener("mousedown", handleMouseDown);
      };
    }, [ref, onMouseDownOutside]);
  }
  var init_use_mouse_down_outside = __esm({
    "node_modules/@create-figma-plugin/ui/lib/hooks/use-mouse-down-outside.js"() {
      init_hooks_module();
      init_get_current_from_ref();
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/hooks/use-scrollable-menu.js
  function useScrollableMenu(options) {
    const { itemIdDataAttributeName, menuElementRef, selectedId, setSelectedId } = options;
    const getItemElements = q2(function() {
      return Array.from(getCurrentFromRef(menuElementRef).querySelectorAll(`[${itemIdDataAttributeName}]`)).filter(function(element) {
        return element.hasAttribute("disabled") === false;
      });
    }, [itemIdDataAttributeName, menuElementRef]);
    const findIndexByItemId = q2(function(id) {
      if (id === null) {
        return -1;
      }
      const index = getItemElements().findIndex(function(element) {
        return element.getAttribute(itemIdDataAttributeName) === id;
      });
      if (index === -1) {
        throw new Error("`index` is `-1`");
      }
      return index;
    }, [getItemElements, itemIdDataAttributeName]);
    const updateScrollPosition = q2(function(id) {
      const itemElements = getItemElements();
      const index = findIndexByItemId(id);
      const selectedElement = itemElements[index];
      const selectedElementOffsetTop = selectedElement.getBoundingClientRect().top;
      const menuElement = getCurrentFromRef(menuElementRef);
      const menuElementOffsetTop = menuElement.getBoundingClientRect().top;
      if (selectedElementOffsetTop < menuElementOffsetTop) {
        selectedElement.scrollIntoView();
        return;
      }
      const offsetBottom = selectedElementOffsetTop + selectedElement.offsetHeight;
      if (offsetBottom > menuElementOffsetTop + menuElement.offsetHeight) {
        selectedElement.scrollIntoView();
      }
    }, [findIndexByItemId, getItemElements, menuElementRef]);
    const handleScrollableMenuKeyDown = q2(function(event) {
      const key = event.key;
      if (key === "ArrowDown" || key === "ArrowUp") {
        const itemElements = getItemElements();
        const index = findIndexByItemId(selectedId);
        let newIndex;
        if (key === "ArrowDown") {
          newIndex = index === -1 || index === itemElements.length - 1 ? 0 : index + 1;
        } else {
          newIndex = index === -1 || index === 0 ? itemElements.length - 1 : index - 1;
        }
        const selectedElement = itemElements[newIndex];
        const newSelectedId = selectedElement.getAttribute(itemIdDataAttributeName);
        setSelectedId(newSelectedId);
        updateScrollPosition(newSelectedId);
      }
    }, [
      getItemElements,
      findIndexByItemId,
      itemIdDataAttributeName,
      setSelectedId,
      selectedId,
      updateScrollPosition
    ]);
    const handleScrollableMenuItemMouseMove = q2(function(event) {
      const id = event.currentTarget.getAttribute(itemIdDataAttributeName);
      if (id !== selectedId) {
        setSelectedId(id);
      }
    }, [itemIdDataAttributeName, selectedId, setSelectedId]);
    return {
      handleScrollableMenuItemMouseMove,
      handleScrollableMenuKeyDown
    };
  }
  var init_use_scrollable_menu = __esm({
    "node_modules/@create-figma-plugin/ui/lib/hooks/use-scrollable-menu.js"() {
      init_hooks_module();
      init_get_current_from_ref();
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-chevron-down-16.js
  var IconChevronDown16;
  var init_icon_chevron_down_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-chevron-down-16.js"() {
      init_preact_module();
      init_create_icon();
      IconChevronDown16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M10.4751 7.47486c.1953-.19526.1953-.51184 0-.70711-.1953-.19526-.51184-.19526-.7071 0L8.00023 8.53552 6.23246 6.76775c-.19526-.19526-.51184-.19526-.70711 0-.19526.19527-.19526.51185 0 .70711l2.12133 2.12132.35355.35355.35355-.35355z", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/utilities/private/constants.js
  var INVALID_ID, VIEWPORT_MARGIN, ITEM_ID_DATA_ATTRIBUTE_NAME;
  var init_constants = __esm({
    "node_modules/@create-figma-plugin/ui/lib/utilities/private/constants.js"() {
      INVALID_ID = null;
      VIEWPORT_MARGIN = 12;
      ITEM_ID_DATA_ATTRIBUTE_NAME = "data-item-id";
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/3b74eec1-ef5f-4860-81a5-f330066d87f3/dropdown.module.js
  var dropdown_module_default;
  var init_dropdown_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/3b74eec1-ef5f-4860-81a5-f330066d87f3/dropdown.module.js"() {
      if (document.getElementById("5a226eb00e") === null) {
        const element = document.createElement("style");
        element.id = "5a226eb00e";
        element.textContent = `._dropdown_i81qm_1 {
  position: relative;
  z-index: var(--z-index-1);
  display: flex;
  width: 100%;
  min-width: 0; /* See https://css-tricks.com/flexbox-truncated-text/ */
  height: var(--space-24);
  align-items: center;
  border: var(--border-width-1) solid var(--figma-color-border);
  border-radius: var(--border-radius-4);
  color: var(--figma-color-text);
}

._dropdown_i81qm_1:not(._disabled_i81qm_14):focus-visible {
  border-color: var(--figma-color-border-selected);
}
._dropdown_i81qm_1:not(._disabled_i81qm_14):focus-within {
  z-index: var(--z-index-2); /* stack \`.dropdown\` over its sibling elements */
  outline: 0;
}

._disabled_i81qm_14,
._disabled_i81qm_14 * {
  cursor: not-allowed;
}

._menu_i81qm_27 {
  position: fixed;
}

._icon_i81qm_31 {
  position: absolute;
  top: 50%;
  left: var(--space-12);
  color: var(--figma-color-icon-secondary);
  pointer-events: none;
  text-align: center;
  transform: translate(-50%, -50%);
}
._disabled_i81qm_14 ._icon_i81qm_31 {
  color: var(--figma-color-icon-disabled);
}

._empty_i81qm_44,
._placeholder_i81qm_45,
._value_i81qm_46 {
  flex-grow: 1;
}

._value_i81qm_46,
._placeholder_i81qm_45 {
  overflow: hidden;
  padding-left: calc(var(--space-8) - var(--border-width-1));
  text-overflow: ellipsis;
  white-space: nowrap;
}
._hasIcon_i81qm_57 ._value_i81qm_46,
._hasIcon_i81qm_57 ._placeholder_i81qm_45 {
  padding-left: calc(var(--space-24) - var(--border-width-1));
}
._placeholder_i81qm_45 {
  color: var(--figma-color-text-tertiary);
}

._disabled_i81qm_14 ._value_i81qm_46 {
  color: var(--figma-color-text-disabled);
}

._chevronIcon_i81qm_69 {
  padding-right: var(--space-4);
  color: var(--figma-color-icon);
}
._disabled_i81qm_14 ._chevronIcon_i81qm_69 {
  color: var(--figma-color-icon-disabled);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9kcm9wZG93bi9kcm9wZG93bi5tb2R1bGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usa0JBQWtCO0VBQ2xCLHlCQUF5QjtFQUN6QixhQUFhO0VBQ2IsV0FBVztFQUNYLFlBQVksRUFBRSx1REFBdUQ7RUFDckUsdUJBQXVCO0VBQ3ZCLG1CQUFtQjtFQUNuQiw2REFBNkQ7RUFDN0QscUNBQXFDO0VBQ3JDLDhCQUE4QjtBQUNoQzs7QUFFQTtFQUNFLGdEQUFnRDtBQUNsRDtBQUNBO0VBQ0UseUJBQXlCLEVBQUUsZ0RBQWdEO0VBQzNFLFVBQVU7QUFDWjs7QUFFQTs7RUFFRSxtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLFFBQVE7RUFDUixxQkFBcUI7RUFDckIsd0NBQXdDO0VBQ3hDLG9CQUFvQjtFQUNwQixrQkFBa0I7RUFDbEIsZ0NBQWdDO0FBQ2xDO0FBQ0E7RUFDRSx1Q0FBdUM7QUFDekM7O0FBRUE7OztFQUdFLFlBQVk7QUFDZDs7QUFFQTs7RUFFRSxnQkFBZ0I7RUFDaEIsMERBQTBEO0VBQzFELHVCQUF1QjtFQUN2QixtQkFBbUI7QUFDckI7QUFDQTs7RUFFRSwyREFBMkQ7QUFDN0Q7QUFDQTtFQUNFLHVDQUF1QztBQUN6Qzs7QUFFQTtFQUNFLHVDQUF1QztBQUN6Qzs7QUFFQTtFQUNFLDZCQUE2QjtFQUM3Qiw4QkFBOEI7QUFDaEM7QUFDQTtFQUNFLHVDQUF1QztBQUN6QyIsImZpbGUiOiJub2RlX21vZHVsZXMvQGNyZWF0ZS1maWdtYS1wbHVnaW4vdWkvbGliL2NvbXBvbmVudHMvZHJvcGRvd24vZHJvcGRvd24ubW9kdWxlLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5kcm9wZG93biB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgei1pbmRleDogdmFyKC0tei1pbmRleC0xKTtcbiAgZGlzcGxheTogZmxleDtcbiAgd2lkdGg6IDEwMCU7XG4gIG1pbi13aWR0aDogMDsgLyogU2VlIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZmxleGJveC10cnVuY2F0ZWQtdGV4dC8gKi9cbiAgaGVpZ2h0OiB2YXIoLS1zcGFjZS0yNCk7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJvcmRlcjogdmFyKC0tYm9yZGVyLXdpZHRoLTEpIHNvbGlkIHZhcigtLWZpZ21hLWNvbG9yLWJvcmRlcik7XG4gIGJvcmRlci1yYWRpdXM6IHZhcigtLWJvcmRlci1yYWRpdXMtNCk7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0KTtcbn1cblxuLmRyb3Bkb3duOm5vdCguZGlzYWJsZWQpOmZvY3VzLXZpc2libGUge1xuICBib3JkZXItY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJvcmRlci1zZWxlY3RlZCk7XG59XG4uZHJvcGRvd246bm90KC5kaXNhYmxlZCk6Zm9jdXMtd2l0aGluIHtcbiAgei1pbmRleDogdmFyKC0tei1pbmRleC0yKTsgLyogc3RhY2sgYC5kcm9wZG93bmAgb3ZlciBpdHMgc2libGluZyBlbGVtZW50cyAqL1xuICBvdXRsaW5lOiAwO1xufVxuXG4uZGlzYWJsZWQsXG4uZGlzYWJsZWQgKiB7XG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XG59XG5cbi5tZW51IHtcbiAgcG9zaXRpb246IGZpeGVkO1xufVxuXG4uaWNvbiB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiA1MCU7XG4gIGxlZnQ6IHZhcigtLXNwYWNlLTEyKTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWljb24tc2Vjb25kYXJ5KTtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG59XG4uZGlzYWJsZWQgLmljb24ge1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItaWNvbi1kaXNhYmxlZCk7XG59XG5cbi5lbXB0eSxcbi5wbGFjZWhvbGRlcixcbi52YWx1ZSB7XG4gIGZsZXgtZ3JvdzogMTtcbn1cblxuLnZhbHVlLFxuLnBsYWNlaG9sZGVyIHtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgcGFkZGluZy1sZWZ0OiBjYWxjKHZhcigtLXNwYWNlLTgpIC0gdmFyKC0tYm9yZGVyLXdpZHRoLTEpKTtcbiAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG59XG4uaGFzSWNvbiAudmFsdWUsXG4uaGFzSWNvbiAucGxhY2Vob2xkZXIge1xuICBwYWRkaW5nLWxlZnQ6IGNhbGModmFyKC0tc3BhY2UtMjQpIC0gdmFyKC0tYm9yZGVyLXdpZHRoLTEpKTtcbn1cbi5wbGFjZWhvbGRlciB7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LXRlcnRpYXJ5KTtcbn1cblxuLmRpc2FibGVkIC52YWx1ZSB7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LWRpc2FibGVkKTtcbn1cblxuLmNoZXZyb25JY29uIHtcbiAgcGFkZGluZy1yaWdodDogdmFyKC0tc3BhY2UtNCk7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1pY29uKTtcbn1cbi5kaXNhYmxlZCAuY2hldnJvbkljb24ge1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItaWNvbi1kaXNhYmxlZCk7XG59XG4iXX0= */`;
        document.head.append(element);
      }
      dropdown_module_default = { "dropdown": "_dropdown_i81qm_1", "disabled": "_disabled_i81qm_14", "menu": "_menu_i81qm_27", "icon": "_icon_i81qm_31", "empty": "_empty_i81qm_44", "placeholder": "_placeholder_i81qm_45", "value": "_value_i81qm_46", "hasIcon": "_hasIcon_i81qm_57", "chevronIcon": "_chevronIcon_i81qm_69" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/dropdown/private/update-menu-element-layout.js
  function updateMenuElementLayout(rootElement, menuElement, selectedId) {
    const rootElementBoundingClientRect = rootElement.getBoundingClientRect();
    const rootWidth = rootElement.offsetWidth;
    const rootHeight = rootElement.offsetHeight;
    const rootLeft = rootElementBoundingClientRect.left;
    const rootTop = rootElementBoundingClientRect.top;
    menuElement.style.minWidth = `${rootWidth}px`;
    const menuElementMaxWidth = window.innerWidth - 2 * VIEWPORT_MARGIN;
    menuElement.style.maxWidth = `${menuElementMaxWidth}px`;
    const menuElementMaxHeight = window.innerHeight - 2 * VIEWPORT_MARGIN;
    menuElement.style.maxHeight = `${menuElementMaxHeight}px`;
    const menuWidth = menuElement.offsetWidth;
    const menuHeight = menuElement.offsetHeight;
    const menuScrollHeight = menuElement.scrollHeight;
    const menuPaddingTop = parseInt(window.getComputedStyle(menuElement).paddingTop, 10);
    const labelElement = getSelectedLabelElement(menuElement, selectedId);
    const left = computeLeft({
      menuWidth,
      rootLeft
    });
    menuElement.style.left = `${left}px`;
    const top = computeTop({
      menuHeight,
      rootTop,
      selectedTop: labelElement.offsetTop
    });
    menuElement.style.top = `${top}px`;
    const isScrollable = menuScrollHeight > menuHeight;
    if (isScrollable === false) {
      return;
    }
    menuElement.scrollTop = computeScrollTop({
      menuHeight,
      menuPaddingTop,
      menuScrollHeight,
      rootHeight,
      rootTop,
      selectedTop: labelElement.offsetTop
    });
  }
  function getSelectedLabelElement(menuElement, selectedId) {
    const inputElement = menuElement.querySelector(selectedId === INVALID_ID ? `[${ITEM_ID_DATA_ATTRIBUTE_NAME}]` : `[${ITEM_ID_DATA_ATTRIBUTE_NAME}='${selectedId}']`);
    if (inputElement === null) {
      throw new Error("`inputElement` is `null`");
    }
    const labelElement = inputElement.parentElement;
    if (labelElement === null) {
      throw new Error("`labelElement` is `null`");
    }
    return labelElement;
  }
  function computeLeft(options) {
    const { menuWidth, rootLeft } = options;
    if (rootLeft <= VIEWPORT_MARGIN) {
      return VIEWPORT_MARGIN;
    }
    const viewportWidth = window.innerWidth;
    if (rootLeft + menuWidth > viewportWidth - VIEWPORT_MARGIN) {
      return viewportWidth - VIEWPORT_MARGIN - menuWidth;
    }
    return rootLeft;
  }
  function computeTop(options) {
    const { menuHeight, rootTop, selectedTop } = options;
    const viewportHeight = window.innerHeight;
    if (rootTop <= VIEWPORT_MARGIN || menuHeight === viewportHeight - 2 * VIEWPORT_MARGIN) {
      return VIEWPORT_MARGIN;
    }
    const top = rootTop - selectedTop;
    const minimumTop = VIEWPORT_MARGIN;
    const maximumTop = viewportHeight - VIEWPORT_MARGIN - menuHeight;
    return restrictToRange(top, minimumTop, maximumTop);
  }
  function computeScrollTop(options) {
    const { menuHeight, menuPaddingTop, menuScrollHeight, rootHeight, rootTop, selectedTop } = options;
    const restrictedRootTop = restrictToRange(rootTop, VIEWPORT_MARGIN, window.innerHeight - VIEWPORT_MARGIN - rootHeight + menuPaddingTop / 2);
    const scrollTop = selectedTop - (restrictedRootTop - VIEWPORT_MARGIN);
    const minimumScrollTop = 0;
    const maximumScrollTop = menuScrollHeight - menuHeight;
    return restrictToRange(scrollTop, minimumScrollTop, maximumScrollTop);
  }
  function restrictToRange(number, minimum, maximum) {
    return Math.min(Math.max(number, minimum), maximum);
  }
  var init_update_menu_element_layout = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/dropdown/private/update-menu-element-layout.js"() {
      init_constants();
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/dropdown/dropdown.js
  function getDropdownOptionValue(option) {
    if (typeof option !== "string") {
      if ("text" in option) {
        return option.text;
      }
      if ("value" in option) {
        return option.value;
      }
    }
    throw new Error("Invariant violation");
  }
  function findOptionIndexByValue(options, value2) {
    if (value2 === null) {
      return -1;
    }
    let index = 0;
    for (const option of options) {
      if (typeof option !== "string" && "value" in option && option.value === value2) {
        return index;
      }
      index += 1;
    }
    return -1;
  }
  var Dropdown;
  var init_dropdown = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/dropdown/dropdown.js"() {
      init_preact_module();
      init_compat_module();
      init_hooks_module();
      init_menu_module();
      init_use_mouse_down_outside();
      init_use_scrollable_menu();
      init_icon_check_16();
      init_icon_chevron_down_16();
      init_create_class_name();
      init_create_component();
      init_get_current_from_ref();
      init_no_op();
      init_constants();
      init_dropdown_module();
      init_update_menu_element_layout();
      Dropdown = createComponent(function(_a, ref) {
        var _b = _a, { disabled = false, icon, onChange = noop, onKeyDown = noop, onMouseDown = noop, onValueChange = noop, options, placeholder, propagateEscapeKeyDown = true, value: value2 } = _b, rest = __objRest(_b, ["disabled", "icon", "onChange", "onKeyDown", "onMouseDown", "onValueChange", "options", "placeholder", "propagateEscapeKeyDown", "value"]);
        if (typeof icon === "string" && icon.length !== 1) {
          throw new Error(`String \`icon\` must be a single character: "${icon}"`);
        }
        const rootElementRef = A2(null);
        const menuElementRef = A2(null);
        const [isMenuVisible, setIsMenuVisible] = d2(false);
        const index = findOptionIndexByValue(options, value2);
        if (value2 !== null && index === -1) {
          throw new Error(`Invalid \`value\`: ${value2}`);
        }
        const [selectedId, setSelectedId] = d2(index === -1 ? INVALID_ID : `${index}`);
        const children = typeof options[index] === "undefined" ? "" : getDropdownOptionValue(options[index]);
        const { handleScrollableMenuKeyDown, handleScrollableMenuItemMouseMove } = useScrollableMenu({
          itemIdDataAttributeName: ITEM_ID_DATA_ATTRIBUTE_NAME,
          menuElementRef,
          selectedId,
          setSelectedId
        });
        const triggerRootBlur = q2(function() {
          getCurrentFromRef(rootElementRef).blur();
        }, []);
        const triggerRootFocus = q2(function() {
          getCurrentFromRef(rootElementRef).focus();
        }, []);
        const triggerMenuUpdateLayout = q2(function(selectedId2) {
          const rootElement = getCurrentFromRef(rootElementRef);
          const menuElement = getCurrentFromRef(menuElementRef);
          updateMenuElementLayout(rootElement, menuElement, selectedId2);
        }, []);
        const triggerMenuHide = q2(function() {
          setIsMenuVisible(false);
          setSelectedId(INVALID_ID);
        }, []);
        const triggerMenuShow = q2(function() {
          if (isMenuVisible === true) {
            return;
          }
          setIsMenuVisible(true);
          if (value2 === null) {
            triggerMenuUpdateLayout(selectedId);
            return;
          }
          const index2 = findOptionIndexByValue(options, value2);
          if (index2 === -1) {
            throw new Error(`Invalid \`value\`: ${value2}`);
          }
          const newSelectedId = `${index2}`;
          setSelectedId(newSelectedId);
          triggerMenuUpdateLayout(newSelectedId);
        }, [isMenuVisible, options, selectedId, triggerMenuUpdateLayout, value2]);
        const handleRootKeyDown = q2(function(event) {
          onKeyDown(event);
          const key = event.key;
          if (key === "ArrowUp" || key === "ArrowDown") {
            event.preventDefault();
            if (isMenuVisible === false) {
              triggerMenuShow();
              return;
            }
            handleScrollableMenuKeyDown(event);
            return;
          }
          if (key === "Escape") {
            event.preventDefault();
            if (propagateEscapeKeyDown === false) {
              event.stopPropagation();
            }
            if (isMenuVisible === true) {
              triggerMenuHide();
              return;
            }
            triggerRootBlur();
            return;
          }
          if (key === "Enter") {
            event.preventDefault();
            if (isMenuVisible === false) {
              triggerMenuShow();
              return;
            }
            if (selectedId !== INVALID_ID) {
              const selectedElement = getCurrentFromRef(menuElementRef).querySelector(`[${ITEM_ID_DATA_ATTRIBUTE_NAME}='${selectedId}']`);
              if (selectedElement === null) {
                throw new Error("`selectedElement` is `null`");
              }
              selectedElement.checked = true;
              const changeEvent = new window.Event("change", {
                bubbles: true,
                cancelable: true
              });
              selectedElement.dispatchEvent(changeEvent);
            }
            triggerMenuHide();
            return;
          }
          if (key === "Tab") {
            triggerMenuHide();
            return;
          }
        }, [
          handleScrollableMenuKeyDown,
          isMenuVisible,
          onKeyDown,
          propagateEscapeKeyDown,
          selectedId,
          triggerMenuHide,
          triggerMenuShow,
          triggerRootBlur
        ]);
        const handleRootMouseDown = q2(function(event) {
          onMouseDown(event);
          if (isMenuVisible === false) {
            triggerMenuShow();
          }
        }, [isMenuVisible, onMouseDown, triggerMenuShow]);
        const handleMenuMouseDown = q2(function(event) {
          event.stopPropagation();
        }, []);
        const handleOptionChange = q2(function(event) {
          onChange(event);
          const id = event.currentTarget.getAttribute(ITEM_ID_DATA_ATTRIBUTE_NAME);
          if (id === null) {
            throw new Error("`id` is `null`");
          }
          const optionValue = options[parseInt(id, 10)];
          const newValue = optionValue.value;
          onValueChange(newValue);
          triggerRootFocus();
          triggerMenuHide();
        }, [onChange, onValueChange, options, triggerMenuHide, triggerRootFocus]);
        const handleSelectedOptionClick = q2(function() {
          triggerRootFocus();
          triggerMenuHide();
        }, [triggerMenuHide, triggerRootFocus]);
        const handleMouseDownOutside = q2(function() {
          if (isMenuVisible === false) {
            return;
          }
          triggerMenuHide();
          triggerRootBlur();
        }, [isMenuVisible, triggerRootBlur, triggerMenuHide]);
        useMouseDownOutside({
          onMouseDownOutside: handleMouseDownOutside,
          ref: rootElementRef
        });
        y2(function() {
          function handleWindowScroll() {
            if (isMenuVisible === false) {
              return;
            }
            triggerRootFocus();
            triggerMenuHide();
          }
          window.addEventListener("scroll", handleWindowScroll);
          return function() {
            window.removeEventListener("scroll", handleWindowScroll);
          };
        }, [isMenuVisible, triggerMenuHide, triggerRootFocus]);
        const refCallback = q2(function(rootElement) {
          rootElementRef.current = rootElement;
          if (ref === null) {
            return;
          }
          if (typeof ref === "function") {
            ref(rootElement);
            return;
          }
          ref.current = rootElement;
        }, [ref, rootElementRef]);
        return _(
          "div",
          __spreadProps(__spreadValues({}, rest), { ref: refCallback, class: createClassName([
            dropdown_module_default.dropdown,
            typeof icon !== "undefined" ? dropdown_module_default.hasIcon : null,
            disabled === true ? dropdown_module_default.disabled : null
          ]), onKeyDown: disabled === true ? void 0 : handleRootKeyDown, onMouseDown: handleRootMouseDown, tabIndex: 0 }),
          typeof icon === "undefined" ? null : _("div", { class: dropdown_module_default.icon }, icon),
          value2 === null ? _("div", { class: createClassName([
            dropdown_module_default.value,
            dropdown_module_default.placeholder
          ]) }, placeholder) : _("div", { class: dropdown_module_default.value }, children),
          _(
            "div",
            { class: dropdown_module_default.chevronIcon },
            _(IconChevronDown16, null)
          ),
          $2(_("div", { ref: menuElementRef, class: createClassName([
            menu_module_default.menu,
            dropdown_module_default.menu,
            disabled === true || isMenuVisible === false ? menu_module_default.hidden : null
          ]), onMouseDown: handleMenuMouseDown }, options.map(function(option, index2) {
            if (typeof option === "string") {
              return _("hr", { key: index2, class: menu_module_default.optionSeparator });
            }
            if ("header" in option) {
              return _("h1", { key: index2, class: menu_module_default.optionHeader }, option.header);
            }
            return _(
              "label",
              { key: index2, class: createClassName([
                menu_module_default.optionValue,
                option.disabled === true ? menu_module_default.optionValueDisabled : null,
                option.disabled !== true && `${index2}` === selectedId ? menu_module_default.optionValueSelected : null
              ]) },
              _("input", { checked: value2 === option.value, class: menu_module_default.input, disabled: option.disabled === true, onChange: value2 === option.value ? void 0 : handleOptionChange, onClick: value2 === option.value ? handleSelectedOptionClick : void 0, onMouseMove: handleScrollableMenuItemMouseMove, tabIndex: -1, type: "radio", value: `${option.value}`, [ITEM_ID_DATA_ATTRIBUTE_NAME]: `${index2}` }),
              option.value === value2 ? _(
                "div",
                { class: menu_module_default.checkIcon },
                _(IconCheck16, null)
              ) : null,
              typeof option.text === "undefined" ? option.value : option.text
            );
          })), document.body)
        );
      });
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/2aa8a7c7-c400-42d1-8e4b-41de0f94aee9/button.module.js
  var button_module_default2;
  var init_button_module2 = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/2aa8a7c7-c400-42d1-8e4b-41de0f94aee9/button.module.js"() {
      if (document.getElementById("1dddd0e4df") === null) {
        const element = document.createElement("style");
        element.id = "1dddd0e4df";
        element.textContent = `._button_avmy7_1 {
  position: relative;
  z-index: var(--z-index-1);
  display: inline-block;
}

._fullWidth_avmy7_7 {
  display: block;
}

._disabled_avmy7_11,
._disabled_avmy7_11 * {
  cursor: not-allowed;
}

._button_avmy7_1 button {
  position: relative;
  display: inline-block;
  height: var(--space-24);
  padding: var(--space-0) var(--space-8);
  border: var(--border-width-1) solid transparent;
  border-radius: var(--border-radius-6);
}

._fullWidth_avmy7_7 button {
  display: block;
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}

._default_avmy7_33 button {
  border-color: transparent;
  background-color: var(--figma-color-bg-brand);
  color: var(--figma-color-text-onbrand);
}

._default_avmy7_33:not(._disabled_avmy7_11) button:focus {
  border-color: var(--figma-color-border-onbrand);
}
._default_avmy7_33:not(._disabled_avmy7_11) button:focus-visible {
  box-shadow: 0 0 0 var(--border-width-1) var(--figma-color-bg) inset;
}
._default_avmy7_33:not(._disabled_avmy7_11) button:active {
  background-color: var(--figma-color-bg-brand-pressed);
}
._default_avmy7_33._disabled_avmy7_11 button {
  background-color: var(--figma-color-bg-disabled);
  color: var(--figma-color-text-ondisabled);
}

._default_avmy7_33._danger_avmy7_53 button {
  background-color: var(--figma-color-bg-danger);
  color: var(--figma-color-text-ondanger);
}
._default_avmy7_33._danger_avmy7_53:not(._disabled_avmy7_11) button:focus {
  border-color: var(--figma-color-border-danger-strong);
}
._default_avmy7_33._danger_avmy7_53:not(._disabled_avmy7_11) button:active {
  background-color: var(--figma-color-bg-danger-pressed);
}
._default_avmy7_33._danger_avmy7_53._disabled_avmy7_11 button {
  background-color: var(--figma-color-bg-disabled);
  color: var(--figma-color-text-ondisabled);
}

._secondary_avmy7_68 button {
  border-color: var(--figma-color-border);
  background-color: transparent;
  color: var(--figma-color-text);
}
._secondary_avmy7_68:not(._disabled_avmy7_11) button:focus {
  border-color: var(--figma-color-border-selected);
}
._secondary_avmy7_68:not(._disabled_avmy7_11) button:active {
  background-color: var(--figma-color-bg-pressed);
}
._secondary_avmy7_68._disabled_avmy7_11 button {
  border-color: var(--figma-color-border-disabled);
  color: var(--figma-color-text-disabled);
}

._secondary_avmy7_68._danger_avmy7_53 button {
  border-color: var(--figma-color-border-danger);
  color: var(--figma-color-text-danger);
}
._secondary_avmy7_68._danger_avmy7_53:not(._disabled_avmy7_11) button:focus {
  border-color: var(--figma-color-border-danger-strong);
}
._secondary_avmy7_68._danger_avmy7_53._disabled_avmy7_11 button {
  border-color: var(--figma-color-border-disabled-strong);
  color: var(--figma-color-text-disabled);
}

._loadingIndicator_avmy7_96 {
  position: absolute;
  top: 50%;
  left: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
}

._default_avmy7_33 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-icon-onbrand);
}
._default_avmy7_33._disabled_avmy7_11 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-icon-ondisabled);
}

._default_avmy7_33._danger_avmy7_53 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-icon-ondanger);
}
._default_avmy7_33._danger_avmy7_53._disabled_avmy7_11 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-icon-ondisabled);
}

._secondary_avmy7_68 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-text);
}
._secondary_avmy7_68._disabled_avmy7_11 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-text-disabled);
}

._secondary_avmy7_68._danger_avmy7_53 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-text-danger);
}
._secondary_avmy7_68._danger_avmy7_53._disabled_avmy7_11 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-text-disabled);
}

._children_avmy7_132 {
  display: inline;
  pointer-events: none;
}
._loading_avmy7_96 ._children_avmy7_132 {
  visibility: hidden;
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9idXR0b24vYnV0dG9uLm1vZHVsZS5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxrQkFBa0I7RUFDbEIseUJBQXlCO0VBQ3pCLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7O0VBRUUsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLHFCQUFxQjtFQUNyQix1QkFBdUI7RUFDdkIsc0NBQXNDO0VBQ3RDLCtDQUErQztFQUMvQyxxQ0FBcUM7QUFDdkM7O0FBRUE7RUFDRSxjQUFjO0VBQ2QsZ0JBQWdCO0VBQ2hCLFdBQVc7RUFDWCx1QkFBdUI7RUFDdkIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UseUJBQXlCO0VBQ3pCLDZDQUE2QztFQUM3QyxzQ0FBc0M7QUFDeEM7O0FBRUE7RUFDRSwrQ0FBK0M7QUFDakQ7QUFDQTtFQUNFLG1FQUFtRTtBQUNyRTtBQUNBO0VBQ0UscURBQXFEO0FBQ3ZEO0FBQ0E7RUFDRSxnREFBZ0Q7RUFDaEQseUNBQXlDO0FBQzNDOztBQUVBO0VBQ0UsOENBQThDO0VBQzlDLHVDQUF1QztBQUN6QztBQUNBO0VBQ0UscURBQXFEO0FBQ3ZEO0FBQ0E7RUFDRSxzREFBc0Q7QUFDeEQ7QUFDQTtFQUNFLGdEQUFnRDtFQUNoRCx5Q0FBeUM7QUFDM0M7O0FBRUE7RUFDRSx1Q0FBdUM7RUFDdkMsNkJBQTZCO0VBQzdCLDhCQUE4QjtBQUNoQztBQUNBO0VBQ0UsZ0RBQWdEO0FBQ2xEO0FBQ0E7RUFDRSwrQ0FBK0M7QUFDakQ7QUFDQTtFQUNFLGdEQUFnRDtFQUNoRCx1Q0FBdUM7QUFDekM7O0FBRUE7RUFDRSw4Q0FBOEM7RUFDOUMscUNBQXFDO0FBQ3ZDO0FBQ0E7RUFDRSxxREFBcUQ7QUFDdkQ7QUFDQTtFQUNFLHVEQUF1RDtFQUN2RCx1Q0FBdUM7QUFDekM7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsUUFBUTtFQUNSLFNBQVM7RUFDVCxvQkFBb0I7RUFDcEIsZ0NBQWdDO0FBQ2xDOztBQUVBO0VBQ0Usc0NBQXNDO0FBQ3hDO0FBQ0E7RUFDRSx5Q0FBeUM7QUFDM0M7O0FBRUE7RUFDRSx1Q0FBdUM7QUFDekM7QUFDQTtFQUNFLHlDQUF5QztBQUMzQzs7QUFFQTtFQUNFLDhCQUE4QjtBQUNoQztBQUNBO0VBQ0UsdUNBQXVDO0FBQ3pDOztBQUVBO0VBQ0UscUNBQXFDO0FBQ3ZDO0FBQ0E7RUFDRSx1Q0FBdUM7QUFDekM7O0FBRUE7RUFDRSxlQUFlO0VBQ2Ysb0JBQW9CO0FBQ3RCO0FBQ0E7RUFDRSxrQkFBa0I7QUFDcEIiLCJmaWxlIjoibm9kZV9tb2R1bGVzL0BjcmVhdGUtZmlnbWEtcGx1Z2luL3VpL2xpYi9jb21wb25lbnRzL2J1dHRvbi9idXR0b24ubW9kdWxlLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5idXR0b24ge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHotaW5kZXg6IHZhcigtLXotaW5kZXgtMSk7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cblxuLmZ1bGxXaWR0aCB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4uZGlzYWJsZWQsXG4uZGlzYWJsZWQgKiB7XG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XG59XG5cbi5idXR0b24gYnV0dG9uIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGhlaWdodDogdmFyKC0tc3BhY2UtMjQpO1xuICBwYWRkaW5nOiB2YXIoLS1zcGFjZS0wKSB2YXIoLS1zcGFjZS04KTtcbiAgYm9yZGVyOiB2YXIoLS1ib3JkZXItd2lkdGgtMSkgc29saWQgdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci1yYWRpdXM6IHZhcigtLWJvcmRlci1yYWRpdXMtNik7XG59XG5cbi5mdWxsV2lkdGggYnV0dG9uIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHdpZHRoOiAxMDAlO1xuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbn1cblxuLmRlZmF1bHQgYnV0dG9uIHtcbiAgYm9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctYnJhbmQpO1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dC1vbmJyYW5kKTtcbn1cblxuLmRlZmF1bHQ6bm90KC5kaXNhYmxlZCkgYnV0dG9uOmZvY3VzIHtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXItb25icmFuZCk7XG59XG4uZGVmYXVsdDpub3QoLmRpc2FibGVkKSBidXR0b246Zm9jdXMtdmlzaWJsZSB7XG4gIGJveC1zaGFkb3c6IDAgMCAwIHZhcigtLWJvcmRlci13aWR0aC0xKSB2YXIoLS1maWdtYS1jb2xvci1iZykgaW5zZXQ7XG59XG4uZGVmYXVsdDpub3QoLmRpc2FibGVkKSBidXR0b246YWN0aXZlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctYnJhbmQtcHJlc3NlZCk7XG59XG4uZGVmYXVsdC5kaXNhYmxlZCBidXR0b24ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1iZy1kaXNhYmxlZCk7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LW9uZGlzYWJsZWQpO1xufVxuXG4uZGVmYXVsdC5kYW5nZXIgYnV0dG9uIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctZGFuZ2VyKTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQtb25kYW5nZXIpO1xufVxuLmRlZmF1bHQuZGFuZ2VyOm5vdCguZGlzYWJsZWQpIGJ1dHRvbjpmb2N1cyB7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYm9yZGVyLWRhbmdlci1zdHJvbmcpO1xufVxuLmRlZmF1bHQuZGFuZ2VyOm5vdCguZGlzYWJsZWQpIGJ1dHRvbjphY3RpdmUge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1iZy1kYW5nZXItcHJlc3NlZCk7XG59XG4uZGVmYXVsdC5kYW5nZXIuZGlzYWJsZWQgYnV0dG9uIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctZGlzYWJsZWQpO1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dC1vbmRpc2FibGVkKTtcbn1cblxuLnNlY29uZGFyeSBidXR0b24ge1xuICBib3JkZXItY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJvcmRlcik7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dCk7XG59XG4uc2Vjb25kYXJ5Om5vdCguZGlzYWJsZWQpIGJ1dHRvbjpmb2N1cyB7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYm9yZGVyLXNlbGVjdGVkKTtcbn1cbi5zZWNvbmRhcnk6bm90KC5kaXNhYmxlZCkgYnV0dG9uOmFjdGl2ZSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJnLXByZXNzZWQpO1xufVxuLnNlY29uZGFyeS5kaXNhYmxlZCBidXR0b24ge1xuICBib3JkZXItY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJvcmRlci1kaXNhYmxlZCk7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LWRpc2FibGVkKTtcbn1cblxuLnNlY29uZGFyeS5kYW5nZXIgYnV0dG9uIHtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXItZGFuZ2VyKTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQtZGFuZ2VyKTtcbn1cbi5zZWNvbmRhcnkuZGFuZ2VyOm5vdCguZGlzYWJsZWQpIGJ1dHRvbjpmb2N1cyB7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYm9yZGVyLWRhbmdlci1zdHJvbmcpO1xufVxuLnNlY29uZGFyeS5kYW5nZXIuZGlzYWJsZWQgYnV0dG9uIHtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXItZGlzYWJsZWQtc3Ryb25nKTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQtZGlzYWJsZWQpO1xufVxuXG4ubG9hZGluZ0luZGljYXRvciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiA1MCU7XG4gIGxlZnQ6IDUwJTtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xufVxuXG4uZGVmYXVsdCAubG9hZGluZ0luZGljYXRvciB7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1pY29uLW9uYnJhbmQpO1xufVxuLmRlZmF1bHQuZGlzYWJsZWQgLmxvYWRpbmdJbmRpY2F0b3Ige1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItaWNvbi1vbmRpc2FibGVkKTtcbn1cblxuLmRlZmF1bHQuZGFuZ2VyIC5sb2FkaW5nSW5kaWNhdG9yIHtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWljb24tb25kYW5nZXIpO1xufVxuLmRlZmF1bHQuZGFuZ2VyLmRpc2FibGVkIC5sb2FkaW5nSW5kaWNhdG9yIHtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWljb24tb25kaXNhYmxlZCk7XG59XG5cbi5zZWNvbmRhcnkgLmxvYWRpbmdJbmRpY2F0b3Ige1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dCk7XG59XG4uc2Vjb25kYXJ5LmRpc2FibGVkIC5sb2FkaW5nSW5kaWNhdG9yIHtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQtZGlzYWJsZWQpO1xufVxuXG4uc2Vjb25kYXJ5LmRhbmdlciAubG9hZGluZ0luZGljYXRvciB7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LWRhbmdlcik7XG59XG4uc2Vjb25kYXJ5LmRhbmdlci5kaXNhYmxlZCAubG9hZGluZ0luZGljYXRvciB7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LWRpc2FibGVkKTtcbn1cblxuLmNoaWxkcmVuIHtcbiAgZGlzcGxheTogaW5saW5lO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbn1cbi5sb2FkaW5nIC5jaGlsZHJlbiB7XG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcbn1cbiJdfQ== */`;
        document.head.append(element);
      }
      button_module_default2 = { "button": "_button_avmy7_1", "fullWidth": "_fullWidth_avmy7_7", "disabled": "_disabled_avmy7_11", "default": "_default_avmy7_33", "danger": "_danger_avmy7_53", "secondary": "_secondary_avmy7_68", "loadingIndicator": "_loadingIndicator_avmy7_96", "children": "_children_avmy7_132", "loading": "_loading_avmy7_96" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/file-upload/private/file-comparator.js
  function fileComparator(a3, b2) {
    const aName = a3.name.toLowerCase();
    const bName = b2.name.toLowerCase();
    if (aName !== bName) {
      return aName.localeCompare(bName);
    }
    return a3.lastModified - b2.lastModified;
  }
  var init_file_comparator = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/file-upload/private/file-comparator.js"() {
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/202af8a6-e7f4-4c71-88bc-23c40a699fa8/file-upload-button.module.js
  var file_upload_button_module_default;
  var init_file_upload_button_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/202af8a6-e7f4-4c71-88bc-23c40a699fa8/file-upload-button.module.js"() {
      if (document.getElementById("f115bb30c8") === null) {
        const element = document.createElement("style");
        element.id = "f115bb30c8";
        element.textContent = `._input_jvo9b_1 {
  position: absolute;
  z-index: var(--z-index-1);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  text-indent: -9999em;
}

/* Rules below are copied from \`button.module.css\` */

._default_jvo9b_13:not(._disabled_jvo9b_13) input:focus ~ button {
  border-color: var(--figma-color-border-onbrand);
}
._default_jvo9b_13:not(._disabled_jvo9b_13) input:focus-visible ~ button {
  box-shadow: 0 0 0 var(--border-width-1) var(--figma-color-bg) inset;
}
._default_jvo9b_13:not(._disabled_jvo9b_13) input:active ~ button {
  background-color: var(--figma-color-bg-brand-pressed);
}

._secondary_jvo9b_23:not(._disabled_jvo9b_13) input:focus ~ button {
  border-color: var(--figma-color-border-selected);
}
._secondary_jvo9b_23:not(._disabled_jvo9b_13) input:active ~ button {
  background-color: var(--figma-color-bg-pressed);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9maWxlLXVwbG9hZC9maWxlLXVwbG9hZC1idXR0b24vZmlsZS11cGxvYWQtYnV0dG9uLm1vZHVsZS5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxrQkFBa0I7RUFDbEIseUJBQXlCO0VBQ3pCLE1BQU07RUFDTixRQUFRO0VBQ1IsU0FBUztFQUNULE9BQU87RUFDUCxvQkFBb0I7QUFDdEI7O0FBRUEsb0RBQW9EOztBQUVwRDtFQUNFLCtDQUErQztBQUNqRDtBQUNBO0VBQ0UsbUVBQW1FO0FBQ3JFO0FBQ0E7RUFDRSxxREFBcUQ7QUFDdkQ7O0FBRUE7RUFDRSxnREFBZ0Q7QUFDbEQ7QUFDQTtFQUNFLCtDQUErQztBQUNqRCIsImZpbGUiOiJub2RlX21vZHVsZXMvQGNyZWF0ZS1maWdtYS1wbHVnaW4vdWkvbGliL2NvbXBvbmVudHMvZmlsZS11cGxvYWQvZmlsZS11cGxvYWQtYnV0dG9uL2ZpbGUtdXBsb2FkLWJ1dHRvbi5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmlucHV0IHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiB2YXIoLS16LWluZGV4LTEpO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3R0b206IDA7XG4gIGxlZnQ6IDA7XG4gIHRleHQtaW5kZW50OiAtOTk5OWVtO1xufVxuXG4vKiBSdWxlcyBiZWxvdyBhcmUgY29waWVkIGZyb20gYGJ1dHRvbi5tb2R1bGUuY3NzYCAqL1xuXG4uZGVmYXVsdDpub3QoLmRpc2FibGVkKSBpbnB1dDpmb2N1cyB+IGJ1dHRvbiB7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYm9yZGVyLW9uYnJhbmQpO1xufVxuLmRlZmF1bHQ6bm90KC5kaXNhYmxlZCkgaW5wdXQ6Zm9jdXMtdmlzaWJsZSB+IGJ1dHRvbiB7XG4gIGJveC1zaGFkb3c6IDAgMCAwIHZhcigtLWJvcmRlci13aWR0aC0xKSB2YXIoLS1maWdtYS1jb2xvci1iZykgaW5zZXQ7XG59XG4uZGVmYXVsdDpub3QoLmRpc2FibGVkKSBpbnB1dDphY3RpdmUgfiBidXR0b24ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1iZy1icmFuZC1wcmVzc2VkKTtcbn1cblxuLnNlY29uZGFyeTpub3QoLmRpc2FibGVkKSBpbnB1dDpmb2N1cyB+IGJ1dHRvbiB7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYm9yZGVyLXNlbGVjdGVkKTtcbn1cbi5zZWNvbmRhcnk6bm90KC5kaXNhYmxlZCkgaW5wdXQ6YWN0aXZlIH4gYnV0dG9uIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctcHJlc3NlZCk7XG59XG4iXX0= */`;
        document.head.append(element);
      }
      file_upload_button_module_default = { "input": "_input_jvo9b_1", "default": "_default_jvo9b_13", "disabled": "_disabled_jvo9b_13", "secondary": "_secondary_jvo9b_23" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/file-upload/file-upload-button/file-upload-button.js
  function parseFileList(fileList) {
    return Array.prototype.slice.call(fileList).sort(fileComparator);
  }
  var FileUploadButton;
  var init_file_upload_button = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/file-upload/file-upload-button/file-upload-button.js"() {
      init_preact_module();
      init_hooks_module();
      init_create_class_name();
      init_create_component();
      init_no_op();
      init_button_module2();
      init_loading_indicator();
      init_file_comparator();
      init_file_upload_button_module();
      FileUploadButton = createComponent(function(_a, ref) {
        var _b = _a, { acceptedFileTypes = [], children, disabled = false, fullWidth = false, loading = false, multiple = false, onChange = noop, onClick = noop, onKeyDown = noop, onMouseDown = noop, onSelectedFiles = noop, propagateEscapeKeyDown = true, secondary = false } = _b, rest = __objRest(_b, ["acceptedFileTypes", "children", "disabled", "fullWidth", "loading", "multiple", "onChange", "onClick", "onKeyDown", "onMouseDown", "onSelectedFiles", "propagateEscapeKeyDown", "secondary"]);
        const handleChange = q2(function(event) {
          onChange(event);
          const fileList = event.currentTarget.files;
          if (fileList === null) {
            throw new Error("`event.currentTarget.files` is `null`");
          }
          const files = parseFileList(fileList);
          if (files.length > 0) {
            onSelectedFiles(files);
          }
        }, [onChange, onSelectedFiles]);
        const handleClick = q2(function(event) {
          onClick(event);
          if (loading === true) {
            event.preventDefault();
          }
        }, [onClick, loading]);
        const handleMouseDown = q2(function(event) {
          onMouseDown(event);
          event.currentTarget.focus();
        }, [onMouseDown]);
        const handleKeyDown = q2(function(event) {
          onKeyDown(event);
          if (event.key === "Escape") {
            if (propagateEscapeKeyDown === false) {
              event.stopPropagation();
            }
            event.currentTarget.blur();
          }
        }, [onKeyDown, propagateEscapeKeyDown]);
        return _(
          "div",
          { class: createClassName([
            button_module_default2.button,
            secondary === true ? button_module_default2.secondary : button_module_default2.default,
            secondary === true ? file_upload_button_module_default.secondary : file_upload_button_module_default.default,
            fullWidth === true ? button_module_default2.fullWidth : null,
            disabled === true ? button_module_default2.disabled : null,
            disabled === true ? file_upload_button_module_default.disabled : null,
            loading === true ? button_module_default2.loading : null
          ]) },
          _("input", __spreadProps(__spreadValues({}, rest), { ref, accept: acceptedFileTypes.length === 0 ? void 0 : acceptedFileTypes.join(","), class: file_upload_button_module_default.input, disabled: disabled === true, multiple, onChange: handleChange, onClick: handleClick, onKeyDown: handleKeyDown, onMouseDown: handleMouseDown, tabIndex: 0, title: "", type: "file" })),
          _(
            "button",
            { disabled: disabled === true, tabIndex: -1 },
            _("div", { class: button_module_default2.children }, children)
          ),
          loading === true ? _(
            "div",
            { class: button_module_default2.loadingIndicator },
            _(LoadingIndicator, null)
          ) : null
        );
      });
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/2c4e1cf6-0499-4895-a44a-7bbebcc951e1/icon-button.module.js
  var icon_button_module_default;
  var init_icon_button_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/2c4e1cf6-0499-4895-a44a-7bbebcc951e1/icon-button.module.js"() {
      if (document.getElementById("c8b08e6568") === null) {
        const element = document.createElement("style");
        element.id = "c8b08e6568";
        element.textContent = `._iconButton_5h86m_1 {
  position: relative;
  width: var(--space-24);
  height: var(--space-24);
  border: var(--border-width-1) solid transparent;
  border-radius: var(--border-radius-4);
}

._iconButton_5h86m_1:not(._disabled_5h86m_9) {
  color: var(--figma-color-icon);
}
._iconButton_5h86m_1:not(._disabled_5h86m_9):hover,
._iconButton_5h86m_1:not(._disabled_5h86m_9):active {
  background-color: var(--figma-color-bg-hover);
}
._iconButton_5h86m_1:not(._disabled_5h86m_9):focus-visible {
  border-color: var(--figma-color-border-selected);
}

._disabled_5h86m_9,
._disabled_5h86m_9 * {
  cursor: not-allowed;
}

._icon_5h86m_1 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
._disabled_5h86m_9 ._icon_5h86m_1 {
  color: var(--figma-color-icon-disabled);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9pY29uLWJ1dHRvbi9pY29uLWJ1dHRvbi5tb2R1bGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usa0JBQWtCO0VBQ2xCLHNCQUFzQjtFQUN0Qix1QkFBdUI7RUFDdkIsK0NBQStDO0VBQy9DLHFDQUFxQztBQUN2Qzs7QUFFQTtFQUNFLDhCQUE4QjtBQUNoQztBQUNBOztFQUVFLDZDQUE2QztBQUMvQztBQUNBO0VBQ0UsZ0RBQWdEO0FBQ2xEOztBQUVBOztFQUVFLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixRQUFRO0VBQ1IsU0FBUztFQUNULGdDQUFnQztBQUNsQztBQUNBO0VBQ0UsdUNBQXVDO0FBQ3pDIiwiZmlsZSI6Im5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9pY29uLWJ1dHRvbi9pY29uLWJ1dHRvbi5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmljb25CdXR0b24ge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHdpZHRoOiB2YXIoLS1zcGFjZS0yNCk7XG4gIGhlaWdodDogdmFyKC0tc3BhY2UtMjQpO1xuICBib3JkZXI6IHZhcigtLWJvcmRlci13aWR0aC0xKSBzb2xpZCB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLXJhZGl1czogdmFyKC0tYm9yZGVyLXJhZGl1cy00KTtcbn1cblxuLmljb25CdXR0b246bm90KC5kaXNhYmxlZCkge1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItaWNvbik7XG59XG4uaWNvbkJ1dHRvbjpub3QoLmRpc2FibGVkKTpob3Zlcixcbi5pY29uQnV0dG9uOm5vdCguZGlzYWJsZWQpOmFjdGl2ZSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJnLWhvdmVyKTtcbn1cbi5pY29uQnV0dG9uOm5vdCguZGlzYWJsZWQpOmZvY3VzLXZpc2libGUge1xuICBib3JkZXItY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJvcmRlci1zZWxlY3RlZCk7XG59XG5cbi5kaXNhYmxlZCxcbi5kaXNhYmxlZCAqIHtcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbn1cblxuLmljb24ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogNTAlO1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xufVxuLmRpc2FibGVkIC5pY29uIHtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWljb24tZGlzYWJsZWQpO1xufVxuIl19 */`;
        document.head.append(element);
      }
      icon_button_module_default = { "iconButton": "_iconButton_5h86m_1", "disabled": "_disabled_5h86m_9", "icon": "_icon_5h86m_1" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/icon-button/icon-button.js
  var IconButton;
  var init_icon_button = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/icon-button/icon-button.js"() {
      init_preact_module();
      init_hooks_module();
      init_create_class_name();
      init_create_component();
      init_no_op();
      init_icon_button_module();
      IconButton = createComponent(function(_a, ref) {
        var _b = _a, { children, disabled = false, onClick, onKeyDown = noop, propagateEscapeKeyDown = true } = _b, rest = __objRest(_b, ["children", "disabled", "onClick", "onKeyDown", "propagateEscapeKeyDown"]);
        const handleKeyDown = q2(function(event) {
          onKeyDown(event);
          if (event.key === "Escape") {
            if (propagateEscapeKeyDown === false) {
              event.stopPropagation();
            }
            event.currentTarget.blur();
          }
        }, [onKeyDown, propagateEscapeKeyDown]);
        return _(
          "button",
          __spreadProps(__spreadValues({}, rest), { ref, class: createClassName([
            icon_button_module_default.iconButton,
            disabled === true ? icon_button_module_default.disabled : null
          ]), disabled: disabled === true, onClick, onKeyDown: handleKeyDown, tabIndex: 0 }),
          _("div", { class: icon_button_module_default.icon }, children)
        );
      });
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/ad874a93-de5c-4cbe-abe8-1f5ba7e06096/text.module.js
  var text_module_default;
  var init_text_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/ad874a93-de5c-4cbe-abe8-1f5ba7e06096/text.module.js"() {
      if (document.getElementById("1278016d5c") === null) {
        const element = document.createElement("style");
        element.id = "1278016d5c";
        element.textContent = `._text_mh6mm_1 {
  padding-top: 1px;
  color: var(--figma-color-text);
  pointer-events: none;
  transform: translateY(4px);
}
._text_mh6mm_1:before {
  display: block;
  height: 0;
  margin-top: -9px;
  content: '';
  pointer-events: none;
}

._numeric_mh6mm_15 {
  font-variant-numeric: tabular-nums;
}

._left_mh6mm_19 {
  text-align: left;
}
._center_mh6mm_22 {
  text-align: center;
}
._right_mh6mm_25 {
  text-align: right;
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy90ZXh0L3RleHQubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGdCQUFnQjtFQUNoQiw4QkFBOEI7RUFDOUIsb0JBQW9CO0VBQ3BCLDBCQUEwQjtBQUM1QjtBQUNBO0VBQ0UsY0FBYztFQUNkLFNBQVM7RUFDVCxnQkFBZ0I7RUFDaEIsV0FBVztFQUNYLG9CQUFvQjtBQUN0Qjs7QUFFQTtFQUNFLGtDQUFrQztBQUNwQzs7QUFFQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUNBO0VBQ0Usa0JBQWtCO0FBQ3BCO0FBQ0E7RUFDRSxpQkFBaUI7QUFDbkIiLCJmaWxlIjoibm9kZV9tb2R1bGVzL0BjcmVhdGUtZmlnbWEtcGx1Z2luL3VpL2xpYi9jb21wb25lbnRzL3RleHQvdGV4dC5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnRleHQge1xuICBwYWRkaW5nLXRvcDogMXB4O1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dCk7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoNHB4KTtcbn1cbi50ZXh0OmJlZm9yZSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBoZWlnaHQ6IDA7XG4gIG1hcmdpbi10b3A6IC05cHg7XG4gIGNvbnRlbnQ6ICcnO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbn1cblxuLm51bWVyaWMge1xuICBmb250LXZhcmlhbnQtbnVtZXJpYzogdGFidWxhci1udW1zO1xufVxuXG4ubGVmdCB7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG59XG4uY2VudGVyIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuLnJpZ2h0IHtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59XG4iXX0= */`;
        document.head.append(element);
      }
      text_module_default = { "text": "_text_mh6mm_1", "numeric": "_numeric_mh6mm_15", "left": "_left_mh6mm_19", "center": "_center_mh6mm_22", "right": "_right_mh6mm_25" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/text/text.js
  var Text;
  var init_text = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/text/text.js"() {
      init_preact_module();
      init_create_class_name();
      init_create_component();
      init_text_module();
      Text = createComponent(function(_a) {
        var _b = _a, { align = "left", children, numeric = false } = _b, rest = __objRest(_b, ["align", "children", "numeric"]);
        return _("div", __spreadProps(__spreadValues({}, rest), { class: createClassName([
          text_module_default.text,
          text_module_default[align],
          numeric === true ? text_module_default.numeric : null
        ]) }), children);
      });
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/cd13917f-f469-4939-a5fc-daa44dba7c3d/inline.module.js
  var inline_module_default;
  var init_inline_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/cd13917f-f469-4939-a5fc-daa44dba7c3d/inline.module.js"() {
      if (document.getElementById("3e1b2856fc") === null) {
        const element = document.createElement("style");
        element.id = "3e1b2856fc";
        element.textContent = `._extraSmall_1u924_1 {
  margin-left: calc(-1 * var(--space-extra-small));
}
._medium_1u924_4 {
  margin-left: calc(-1 * var(--space-medium));
}
._large_1u924_7 {
  margin-left: calc(-1 * var(--space-large));
}
._small_1u924_10 {
  margin-left: calc(-1 * var(--space-small));
}
._extraLarge_1u924_13 {
  margin-left: calc(-1 * var(--space-extra-large));
}

._child_1u924_17 {
  display: inline-flex;
}
._extraSmall_1u924_1 > ._child_1u924_17 {
  margin-left: var(--space-extra-small);
}
._small_1u924_10 > ._child_1u924_17 {
  margin-left: var(--space-small);
}
._medium_1u924_4 > ._child_1u924_17 {
  margin-left: var(--space-medium);
}
._large_1u924_7 > ._child_1u924_17 {
  margin-left: var(--space-large);
}
._extraLarge_1u924_13 > ._child_1u924_17 {
  margin-left: var(--space-extra-large);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvbGF5b3V0L2lubGluZS9pbmxpbmUubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGdEQUFnRDtBQUNsRDtBQUNBO0VBQ0UsMkNBQTJDO0FBQzdDO0FBQ0E7RUFDRSwwQ0FBMEM7QUFDNUM7QUFDQTtFQUNFLDBDQUEwQztBQUM1QztBQUNBO0VBQ0UsZ0RBQWdEO0FBQ2xEOztBQUVBO0VBQ0Usb0JBQW9CO0FBQ3RCO0FBQ0E7RUFDRSxxQ0FBcUM7QUFDdkM7QUFDQTtFQUNFLCtCQUErQjtBQUNqQztBQUNBO0VBQ0UsZ0NBQWdDO0FBQ2xDO0FBQ0E7RUFDRSwrQkFBK0I7QUFDakM7QUFDQTtFQUNFLHFDQUFxQztBQUN2QyIsImZpbGUiOiJub2RlX21vZHVsZXMvQGNyZWF0ZS1maWdtYS1wbHVnaW4vdWkvbGliL2xheW91dC9pbmxpbmUvaW5saW5lLm1vZHVsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuZXh0cmFTbWFsbCB7XG4gIG1hcmdpbi1sZWZ0OiBjYWxjKC0xICogdmFyKC0tc3BhY2UtZXh0cmEtc21hbGwpKTtcbn1cbi5tZWRpdW0ge1xuICBtYXJnaW4tbGVmdDogY2FsYygtMSAqIHZhcigtLXNwYWNlLW1lZGl1bSkpO1xufVxuLmxhcmdlIHtcbiAgbWFyZ2luLWxlZnQ6IGNhbGMoLTEgKiB2YXIoLS1zcGFjZS1sYXJnZSkpO1xufVxuLnNtYWxsIHtcbiAgbWFyZ2luLWxlZnQ6IGNhbGMoLTEgKiB2YXIoLS1zcGFjZS1zbWFsbCkpO1xufVxuLmV4dHJhTGFyZ2Uge1xuICBtYXJnaW4tbGVmdDogY2FsYygtMSAqIHZhcigtLXNwYWNlLWV4dHJhLWxhcmdlKSk7XG59XG5cbi5jaGlsZCB7XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xufVxuLmV4dHJhU21hbGwgPiAuY2hpbGQge1xuICBtYXJnaW4tbGVmdDogdmFyKC0tc3BhY2UtZXh0cmEtc21hbGwpO1xufVxuLnNtYWxsID4gLmNoaWxkIHtcbiAgbWFyZ2luLWxlZnQ6IHZhcigtLXNwYWNlLXNtYWxsKTtcbn1cbi5tZWRpdW0gPiAuY2hpbGQge1xuICBtYXJnaW4tbGVmdDogdmFyKC0tc3BhY2UtbWVkaXVtKTtcbn1cbi5sYXJnZSA+IC5jaGlsZCB7XG4gIG1hcmdpbi1sZWZ0OiB2YXIoLS1zcGFjZS1sYXJnZSk7XG59XG4uZXh0cmFMYXJnZSA+IC5jaGlsZCB7XG4gIG1hcmdpbi1sZWZ0OiB2YXIoLS1zcGFjZS1leHRyYS1sYXJnZSk7XG59XG4iXX0= */`;
        document.head.append(element);
      }
      inline_module_default = { "extraSmall": "_extraSmall_1u924_1", "medium": "_medium_1u924_4", "large": "_large_1u924_7", "small": "_small_1u924_10", "extraLarge": "_extraLarge_1u924_13", "child": "_child_1u924_17" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/layout/inline/inline.js
  var Inline;
  var init_inline = __esm({
    "node_modules/@create-figma-plugin/ui/lib/layout/inline/inline.js"() {
      init_preact_module();
      init_create_component();
      init_inline_module();
      Inline = createComponent(function(_a, ref) {
        var _b = _a, { children, space } = _b, rest = __objRest(_b, ["children", "space"]);
        return _("div", __spreadProps(__spreadValues({}, rest), { ref, class: typeof space === "undefined" ? void 0 : inline_module_default[space] }), H(children).map(function(child, index) {
          return _("div", { key: index, class: inline_module_default.child }, child);
        }));
      });
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/3a7b659f-f174-4b92-ab7a-2a2c073e247c/stack.module.js
  var stack_module_default;
  var init_stack_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/3a7b659f-f174-4b92-ab7a-2a2c073e247c/stack.module.js"() {
      if (document.getElementById("317515cc3f") === null) {
        const element = document.createElement("style");
        element.id = "317515cc3f";
        element.textContent = `._extraSmall_dpsd3_1 > ._child_dpsd3_1:not(:first-child) {
  margin-top: var(--space-extra-small);
}
._small_dpsd3_4 > ._child_dpsd3_1:not(:first-child) {
  margin-top: var(--space-small);
}
._medium_dpsd3_7 > ._child_dpsd3_1:not(:first-child) {
  margin-top: var(--space-medium);
}
._large_dpsd3_10 > ._child_dpsd3_1:not(:first-child) {
  margin-top: var(--space-large);
}
._extraLarge_dpsd3_13 > ._child_dpsd3_1:not(:first-child) {
  margin-top: var(--space-extra-large);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvbGF5b3V0L3N0YWNrL3N0YWNrLm1vZHVsZS5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxvQ0FBb0M7QUFDdEM7QUFDQTtFQUNFLDhCQUE4QjtBQUNoQztBQUNBO0VBQ0UsK0JBQStCO0FBQ2pDO0FBQ0E7RUFDRSw4QkFBOEI7QUFDaEM7QUFDQTtFQUNFLG9DQUFvQztBQUN0QyIsImZpbGUiOiJub2RlX21vZHVsZXMvQGNyZWF0ZS1maWdtYS1wbHVnaW4vdWkvbGliL2xheW91dC9zdGFjay9zdGFjay5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmV4dHJhU21hbGwgPiAuY2hpbGQ6bm90KDpmaXJzdC1jaGlsZCkge1xuICBtYXJnaW4tdG9wOiB2YXIoLS1zcGFjZS1leHRyYS1zbWFsbCk7XG59XG4uc21hbGwgPiAuY2hpbGQ6bm90KDpmaXJzdC1jaGlsZCkge1xuICBtYXJnaW4tdG9wOiB2YXIoLS1zcGFjZS1zbWFsbCk7XG59XG4ubWVkaXVtID4gLmNoaWxkOm5vdCg6Zmlyc3QtY2hpbGQpIHtcbiAgbWFyZ2luLXRvcDogdmFyKC0tc3BhY2UtbWVkaXVtKTtcbn1cbi5sYXJnZSA+IC5jaGlsZDpub3QoOmZpcnN0LWNoaWxkKSB7XG4gIG1hcmdpbi10b3A6IHZhcigtLXNwYWNlLWxhcmdlKTtcbn1cbi5leHRyYUxhcmdlID4gLmNoaWxkOm5vdCg6Zmlyc3QtY2hpbGQpIHtcbiAgbWFyZ2luLXRvcDogdmFyKC0tc3BhY2UtZXh0cmEtbGFyZ2UpO1xufVxuIl19 */`;
        document.head.append(element);
      }
      stack_module_default = { "extraSmall": "_extraSmall_dpsd3_1", "child": "_child_dpsd3_1", "small": "_small_dpsd3_4", "medium": "_medium_dpsd3_7", "large": "_large_dpsd3_10", "extraLarge": "_extraLarge_dpsd3_13" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/layout/stack/stack.js
  var Stack;
  var init_stack = __esm({
    "node_modules/@create-figma-plugin/ui/lib/layout/stack/stack.js"() {
      init_preact_module();
      init_create_component();
      init_stack_module();
      Stack = createComponent(function(_a, ref) {
        var _b = _a, { children, space } = _b, rest = __objRest(_b, ["children", "space"]);
        return _("div", __spreadProps(__spreadValues({}, rest), { ref, class: stack_module_default[space] }), H(children).map(function(element, index) {
          return _("div", { key: index, class: stack_module_default.child }, element);
        }));
      });
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/1fdb00b7-56ef-4702-9539-1eb3040115cd/radio-buttons.module.js
  var radio_buttons_module_default;
  var init_radio_buttons_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/1fdb00b7-56ef-4702-9539-1eb3040115cd/radio-buttons.module.js"() {
      if (document.getElementById("a066c67891") === null) {
        const element = document.createElement("style");
        element.id = "a066c67891";
        element.textContent = `._radioButtons_y69qy_1 {
  position: relative;
  z-index: var(--z-index-1);
}

._disabled_y69qy_6,
._disabled_y69qy_6 * {
  cursor: not-allowed;
}

._radioButton_y69qy_1 {
  position: relative;
  display: flex;
  gap: var(--space-6);
}

._input_y69qy_17 {
  position: absolute;
  z-index: var(--z-index-1); /* stack \`.input\` on top of everything else */
  top: calc(-1 * var(--space-8));
  right: calc(-1 * var(--space-8));
  bottom: calc(-1 * var(--space-8));
  left: calc(-1 * var(--space-8));
  display: block;
}

._box_y69qy_27 {
  width: 14px;
  height: 14px;
  border: 1px solid var(--figma-color-border-strong);
  border-radius: 7px;
  background-color: var(--figma-color-bg);
  box-shadow: 0 0 0 2.5px var(--figma-color-bg) inset;
}
._radioButton_y69qy_1:not(._disabled_y69qy_6) ._input_y69qy_17:checked ~ ._box_y69qy_27 {
  background-color: var(--figma-color-bg-inverse);
}
._radioButton_y69qy_1:not(._disabled_y69qy_6) ._input_y69qy_17:focus ~ ._box_y69qy_27 {
  border-color: var(--figma-color-border-brand-strong);
}
._disabled_y69qy_6 ._input_y69qy_17 ~ ._box_y69qy_27 {
  border-color: var(--figma-color-border-disabled);
}
._disabled_y69qy_6 ._input_y69qy_17:checked ~ ._box_y69qy_27 {
  background-color: var(--figma-color-bg-disabled);
}

._children_y69qy_48 {
  flex: 1;
  padding-top: 3px;
}
._disabled_y69qy_6 ._children_y69qy_48 {
  opacity: var(--opacity-30);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9yYWRpby1idXR0b25zL3JhZGlvLWJ1dHRvbnMubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGtCQUFrQjtFQUNsQix5QkFBeUI7QUFDM0I7O0FBRUE7O0VBRUUsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLGFBQWE7RUFDYixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIseUJBQXlCLEVBQUUsNkNBQTZDO0VBQ3hFLDhCQUE4QjtFQUM5QixnQ0FBZ0M7RUFDaEMsaUNBQWlDO0VBQ2pDLCtCQUErQjtFQUMvQixjQUFjO0FBQ2hCOztBQUVBO0VBQ0UsV0FBVztFQUNYLFlBQVk7RUFDWixrREFBa0Q7RUFDbEQsa0JBQWtCO0VBQ2xCLHVDQUF1QztFQUN2QyxtREFBbUQ7QUFDckQ7QUFDQTtFQUNFLCtDQUErQztBQUNqRDtBQUNBO0VBQ0Usb0RBQW9EO0FBQ3REO0FBQ0E7RUFDRSxnREFBZ0Q7QUFDbEQ7QUFDQTtFQUNFLGdEQUFnRDtBQUNsRDs7QUFFQTtFQUNFLE9BQU87RUFDUCxnQkFBZ0I7QUFDbEI7QUFDQTtFQUNFLDBCQUEwQjtBQUM1QiIsImZpbGUiOiJub2RlX21vZHVsZXMvQGNyZWF0ZS1maWdtYS1wbHVnaW4vdWkvbGliL2NvbXBvbmVudHMvcmFkaW8tYnV0dG9ucy9yYWRpby1idXR0b25zLm1vZHVsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIucmFkaW9CdXR0b25zIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB6LWluZGV4OiB2YXIoLS16LWluZGV4LTEpO1xufVxuXG4uZGlzYWJsZWQsXG4uZGlzYWJsZWQgKiB7XG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XG59XG5cbi5yYWRpb0J1dHRvbiB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogZmxleDtcbiAgZ2FwOiB2YXIoLS1zcGFjZS02KTtcbn1cblxuLmlucHV0IHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiB2YXIoLS16LWluZGV4LTEpOyAvKiBzdGFjayBgLmlucHV0YCBvbiB0b3Agb2YgZXZlcnl0aGluZyBlbHNlICovXG4gIHRvcDogY2FsYygtMSAqIHZhcigtLXNwYWNlLTgpKTtcbiAgcmlnaHQ6IGNhbGMoLTEgKiB2YXIoLS1zcGFjZS04KSk7XG4gIGJvdHRvbTogY2FsYygtMSAqIHZhcigtLXNwYWNlLTgpKTtcbiAgbGVmdDogY2FsYygtMSAqIHZhcigtLXNwYWNlLTgpKTtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi5ib3gge1xuICB3aWR0aDogMTRweDtcbiAgaGVpZ2h0OiAxNHB4O1xuICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXItc3Ryb25nKTtcbiAgYm9yZGVyLXJhZGl1czogN3B4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1iZyk7XG4gIGJveC1zaGFkb3c6IDAgMCAwIDIuNXB4IHZhcigtLWZpZ21hLWNvbG9yLWJnKSBpbnNldDtcbn1cbi5yYWRpb0J1dHRvbjpub3QoLmRpc2FibGVkKSAuaW5wdXQ6Y2hlY2tlZCB+IC5ib3gge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1iZy1pbnZlcnNlKTtcbn1cbi5yYWRpb0J1dHRvbjpub3QoLmRpc2FibGVkKSAuaW5wdXQ6Zm9jdXMgfiAuYm94IHtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXItYnJhbmQtc3Ryb25nKTtcbn1cbi5kaXNhYmxlZCAuaW5wdXQgfiAuYm94IHtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXItZGlzYWJsZWQpO1xufVxuLmRpc2FibGVkIC5pbnB1dDpjaGVja2VkIH4gLmJveCB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJnLWRpc2FibGVkKTtcbn1cblxuLmNoaWxkcmVuIHtcbiAgZmxleDogMTtcbiAgcGFkZGluZy10b3A6IDNweDtcbn1cbi5kaXNhYmxlZCAuY2hpbGRyZW4ge1xuICBvcGFjaXR5OiB2YXIoLS1vcGFjaXR5LTMwKTtcbn1cbiJdfQ== */`;
        document.head.append(element);
      }
      radio_buttons_module_default = { "radioButtons": "_radioButtons_y69qy_1", "disabled": "_disabled_y69qy_6", "radioButton": "_radioButton_y69qy_1", "input": "_input_y69qy_17", "box": "_box_y69qy_27", "children": "_children_y69qy_48" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/radio-buttons/radio-buttons.js
  var RadioButtons;
  var init_radio_buttons = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/radio-buttons/radio-buttons.js"() {
      init_preact_module();
      init_hooks_module();
      init_inline();
      init_stack();
      init_create_class_name();
      init_create_component();
      init_no_op();
      init_constants();
      init_radio_buttons_module();
      RadioButtons = createComponent(function(_a, ref) {
        var _b = _a, { disabled = false, direction = "vertical", onChange = noop, onCommand, onKeyDown = noop, onValueChange = noop, options, propagateEscapeKeyDown = true, space, value: value2 } = _b, rest = __objRest(_b, ["disabled", "direction", "onChange", "onCommand", "onKeyDown", "onValueChange", "options", "propagateEscapeKeyDown", "space", "value"]);
        const handleChange = q2(function(event) {
          onChange(event);
          const id = event.currentTarget.getAttribute(ITEM_ID_DATA_ATTRIBUTE_NAME);
          if (id === null) {
            throw new Error("`id` is `null`");
          }
          const newValue = options[parseInt(id, 10)].value;
          onValueChange(newValue);
        }, [onChange, onValueChange, options]);
        const handleKeyDown = q2(function(event) {
          onKeyDown(event);
          if (event.key === "Escape") {
            if (propagateEscapeKeyDown === false) {
              event.stopPropagation();
            }
            event.currentTarget.blur();
          }
        }, [onKeyDown, propagateEscapeKeyDown]);
        const body = options.map(function(option, index) {
          const children = typeof option.children === "undefined" ? `${option.value}` : option.children;
          const isOptionDisabled = disabled === true || option.disabled === true;
          const checked = value2 === option.value;
          return _(
            "label",
            { key: index, class: createClassName([
              radio_buttons_module_default.radioButton,
              isOptionDisabled === true ? radio_buttons_module_default.disabled : null
            ]) },
            _("input", __spreadProps(__spreadValues({}, rest), { checked: checked === true, class: radio_buttons_module_default.input, disabled: isOptionDisabled === true, onChange: handleChange, onKeyDown: handleKeyDown, tabIndex: 0, type: "radio", value: `${option.value}`, [ITEM_ID_DATA_ATTRIBUTE_NAME]: `${index}` })),
            _("div", { class: radio_buttons_module_default.box }),
            _("div", { class: radio_buttons_module_default.children }, children)
          );
        });
        return _("div", { ref, class: radio_buttons_module_default.radioButtons }, direction === "vertical" ? _(Stack, { space: typeof space === "undefined" ? "small" : space }, body) : _(Inline, { space: typeof space === "undefined" ? "medium" : space }, body));
      });
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/3e7efc33-be2a-4fa2-a1b6-300eafb483e0/segmented-control.module.js
  var segmented_control_module_default;
  var init_segmented_control_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/3e7efc33-be2a-4fa2-a1b6-300eafb483e0/segmented-control.module.js"() {
      if (document.getElementById("bc6858a1b5") === null) {
        const element = document.createElement("style");
        element.id = "bc6858a1b5";
        element.textContent = `._segmentedControl_d5gb0_1 {
  position: relative;
  z-index: var(--z-index-1);
  display: flex;
  overflow: hidden;
  border-radius: var(--border-radius-4);
  background-color: var(--figma-color-bg-secondary);
}

._input_d5gb0_10 {
  display: block;
  width: 0;
  height: 0;
}

._box_d5gb0_16 {
  display: flex;
  min-width: var(--space-24);
  height: var(--space-24);
  align-items: center;
  justify-content: center;
  border: var(--border-width-1) solid transparent;
  border-radius: var(--border-radius-4);
  color: var(--figma-color-text-secondary);
}
._input_d5gb0_10:checked ~ ._box_d5gb0_16 {
  border-color: var(--figma-color-border);
  background-color: var(--figma-color-bg);
  color: var(--figma-color-text);
}
._input_d5gb0_10:focus-visible ~ ._box_d5gb0_16 {
  border-color: var(--figma-color-border-selected);
  color: var(--figma-color-text);
}
._input_d5gb0_10:disabled ~ ._box_d5gb0_16 {
  color: var(--figma-color-text-disabled);
}

._text_d5gb0_39 {
  padding: var(--space-4) var(--space-8);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9zZWdtZW50ZWQtY29udHJvbC9zZWdtZW50ZWQtY29udHJvbC5tb2R1bGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usa0JBQWtCO0VBQ2xCLHlCQUF5QjtFQUN6QixhQUFhO0VBQ2IsZ0JBQWdCO0VBQ2hCLHFDQUFxQztFQUNyQyxpREFBaUQ7QUFDbkQ7O0FBRUE7RUFDRSxjQUFjO0VBQ2QsUUFBUTtFQUNSLFNBQVM7QUFDWDs7QUFFQTtFQUNFLGFBQWE7RUFDYiwwQkFBMEI7RUFDMUIsdUJBQXVCO0VBQ3ZCLG1CQUFtQjtFQUNuQix1QkFBdUI7RUFDdkIsK0NBQStDO0VBQy9DLHFDQUFxQztFQUNyQyx3Q0FBd0M7QUFDMUM7QUFDQTtFQUNFLHVDQUF1QztFQUN2Qyx1Q0FBdUM7RUFDdkMsOEJBQThCO0FBQ2hDO0FBQ0E7RUFDRSxnREFBZ0Q7RUFDaEQsOEJBQThCO0FBQ2hDO0FBQ0E7RUFDRSx1Q0FBdUM7QUFDekM7O0FBRUE7RUFDRSxzQ0FBc0M7QUFDeEMiLCJmaWxlIjoibm9kZV9tb2R1bGVzL0BjcmVhdGUtZmlnbWEtcGx1Z2luL3VpL2xpYi9jb21wb25lbnRzL3NlZ21lbnRlZC1jb250cm9sL3NlZ21lbnRlZC1jb250cm9sLm1vZHVsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuc2VnbWVudGVkQ29udHJvbCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgei1pbmRleDogdmFyKC0tei1pbmRleC0xKTtcbiAgZGlzcGxheTogZmxleDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgYm9yZGVyLXJhZGl1czogdmFyKC0tYm9yZGVyLXJhZGl1cy00KTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctc2Vjb25kYXJ5KTtcbn1cblxuLmlucHV0IHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAwO1xuICBoZWlnaHQ6IDA7XG59XG5cbi5ib3gge1xuICBkaXNwbGF5OiBmbGV4O1xuICBtaW4td2lkdGg6IHZhcigtLXNwYWNlLTI0KTtcbiAgaGVpZ2h0OiB2YXIoLS1zcGFjZS0yNCk7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBib3JkZXI6IHZhcigtLWJvcmRlci13aWR0aC0xKSBzb2xpZCB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLXJhZGl1czogdmFyKC0tYm9yZGVyLXJhZGl1cy00KTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQtc2Vjb25kYXJ5KTtcbn1cbi5pbnB1dDpjaGVja2VkIH4gLmJveCB7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYm9yZGVyKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmcpO1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dCk7XG59XG4uaW5wdXQ6Zm9jdXMtdmlzaWJsZSB+IC5ib3gge1xuICBib3JkZXItY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJvcmRlci1zZWxlY3RlZCk7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0KTtcbn1cbi5pbnB1dDpkaXNhYmxlZCB+IC5ib3gge1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dC1kaXNhYmxlZCk7XG59XG5cbi50ZXh0IHtcbiAgcGFkZGluZzogdmFyKC0tc3BhY2UtNCkgdmFyKC0tc3BhY2UtOCk7XG59XG4iXX0= */`;
        document.head.append(element);
      }
      segmented_control_module_default = { "segmentedControl": "_segmentedControl_d5gb0_1", "input": "_input_d5gb0_10", "box": "_box_d5gb0_16", "text": "_text_d5gb0_39" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/segmented-control/segmented-control.js
  var SegmentedControl;
  var init_segmented_control = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/segmented-control/segmented-control.js"() {
      init_preact_module();
      init_hooks_module();
      init_create_class_name();
      init_create_component();
      init_no_op();
      init_constants();
      init_segmented_control_module();
      SegmentedControl = createComponent(function(_a) {
        var _b = _a, { disabled = false, onChange = noop, onKeyDown = noop, onValueChange = noop, options, propagateEscapeKeyDown = true, value: value2 } = _b, rest = __objRest(_b, ["disabled", "onChange", "onKeyDown", "onValueChange", "options", "propagateEscapeKeyDown", "value"]);
        const handleChange = q2(function(event) {
          onChange(event);
          const id = event.currentTarget.getAttribute(ITEM_ID_DATA_ATTRIBUTE_NAME);
          if (id === null) {
            throw new Error("`id` is `null`");
          }
          const newValue = options[parseInt(id, 10)].value;
          onValueChange(newValue);
        }, [onChange, onValueChange, options]);
        const handleKeyDown = q2(function(event) {
          onKeyDown(event);
          if (event.key === "Escape") {
            if (propagateEscapeKeyDown === false) {
              event.stopPropagation();
            }
            event.currentTarget.blur();
          }
        }, [onKeyDown, propagateEscapeKeyDown]);
        return _("div", { class: createClassName([
          segmented_control_module_default.segmentedControl,
          disabled === true ? segmented_control_module_default.disabled : null
        ]) }, options.map(function(option, index) {
          const children = typeof option.children === "undefined" ? `${option.value}` : option.children;
          const isOptionDisabled = disabled === true || option.disabled === true;
          return _(
            "label",
            { key: index },
            _("input", __spreadProps(__spreadValues({}, rest), { checked: value2 === option.value, class: segmented_control_module_default.input, disabled: isOptionDisabled === true, onChange: handleChange, onKeyDown: handleKeyDown, tabIndex: 0, type: "radio", value: `${option.value}`, [ITEM_ID_DATA_ATTRIBUTE_NAME]: `${index}` })),
            _("div", { class: segmented_control_module_default.box }, typeof children === "string" ? _("div", { class: segmented_control_module_default.text }, children) : children)
          );
        }));
      });
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/db0a4769-28cb-48c4-8a37-546ed8177acd/tabs.module.js
  var tabs_module_default;
  var init_tabs_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/db0a4769-28cb-48c4-8a37-546ed8177acd/tabs.module.js"() {
      if (document.getElementById("b2487bb7e6") === null) {
        const element = document.createElement("style");
        element.id = "b2487bb7e6";
        element.textContent = `._tabs_14pnx_1 {
  position: relative;
  z-index: var(--z-index-1);
  display: flex;
  border-bottom: var(--border-width-1) solid var(--figma-color-border);
}

._tab_14pnx_1 {
  padding: var(--space-8) var(--space-4);
  color: var(--figma-color-text-secondary);
}
._tab_14pnx_1:first-child {
  padding-left: var(--space-8);
}
._tab_14pnx_1:last-child {
  padding-right: var(--space-8);
}
._tab_14pnx_1:hover {
  color: var(--figma-color-text);
}

._input_14pnx_22 {
  display: block;
  width: 0;
  height: 0;
}

._value_14pnx_28 {
  height: var(--space-24);
  padding: var(--space-4) var(--space-8);
  border-radius: var(--border-radius-4);
}
label:hover ._input_14pnx_22 ~ ._value_14pnx_28 {
  background-color: var(--figma-color-bg-secondary);
}
label ._input_14pnx_22:checked ~ ._value_14pnx_28 {
  background-color: var(--figma-color-bg-secondary);
  color: var(--figma-color-text);
  font-weight: var(--font-weight-bold);
}

._children_14pnx_42 {
  color: var(--figma-color-text);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy90YWJzL3RhYnMubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGtCQUFrQjtFQUNsQix5QkFBeUI7RUFDekIsYUFBYTtFQUNiLG9FQUFvRTtBQUN0RTs7QUFFQTtFQUNFLHNDQUFzQztFQUN0Qyx3Q0FBd0M7QUFDMUM7QUFDQTtFQUNFLDRCQUE0QjtBQUM5QjtBQUNBO0VBQ0UsNkJBQTZCO0FBQy9CO0FBQ0E7RUFDRSw4QkFBOEI7QUFDaEM7O0FBRUE7RUFDRSxjQUFjO0VBQ2QsUUFBUTtFQUNSLFNBQVM7QUFDWDs7QUFFQTtFQUNFLHVCQUF1QjtFQUN2QixzQ0FBc0M7RUFDdEMscUNBQXFDO0FBQ3ZDO0FBQ0E7RUFDRSxpREFBaUQ7QUFDbkQ7QUFDQTtFQUNFLGlEQUFpRDtFQUNqRCw4QkFBOEI7RUFDOUIsb0NBQW9DO0FBQ3RDOztBQUVBO0VBQ0UsOEJBQThCO0FBQ2hDIiwiZmlsZSI6Im5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy90YWJzL3RhYnMubW9kdWxlLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi50YWJzIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB6LWluZGV4OiB2YXIoLS16LWluZGV4LTEpO1xuICBkaXNwbGF5OiBmbGV4O1xuICBib3JkZXItYm90dG9tOiB2YXIoLS1ib3JkZXItd2lkdGgtMSkgc29saWQgdmFyKC0tZmlnbWEtY29sb3ItYm9yZGVyKTtcbn1cblxuLnRhYiB7XG4gIHBhZGRpbmc6IHZhcigtLXNwYWNlLTgpIHZhcigtLXNwYWNlLTQpO1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dC1zZWNvbmRhcnkpO1xufVxuLnRhYjpmaXJzdC1jaGlsZCB7XG4gIHBhZGRpbmctbGVmdDogdmFyKC0tc3BhY2UtOCk7XG59XG4udGFiOmxhc3QtY2hpbGQge1xuICBwYWRkaW5nLXJpZ2h0OiB2YXIoLS1zcGFjZS04KTtcbn1cbi50YWI6aG92ZXIge1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dCk7XG59XG5cbi5pbnB1dCB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogMDtcbiAgaGVpZ2h0OiAwO1xufVxuXG4udmFsdWUge1xuICBoZWlnaHQ6IHZhcigtLXNwYWNlLTI0KTtcbiAgcGFkZGluZzogdmFyKC0tc3BhY2UtNCkgdmFyKC0tc3BhY2UtOCk7XG4gIGJvcmRlci1yYWRpdXM6IHZhcigtLWJvcmRlci1yYWRpdXMtNCk7XG59XG5sYWJlbDpob3ZlciAuaW5wdXQgfiAudmFsdWUge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1iZy1zZWNvbmRhcnkpO1xufVxubGFiZWwgLmlucHV0OmNoZWNrZWQgfiAudmFsdWUge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1iZy1zZWNvbmRhcnkpO1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dCk7XG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mb250LXdlaWdodC1ib2xkKTtcbn1cblxuLmNoaWxkcmVuIHtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQpO1xufVxuIl19 */`;
        document.head.append(element);
      }
      tabs_module_default = { "tabs": "_tabs_14pnx_1", "tab": "_tab_14pnx_1", "input": "_input_14pnx_22", "value": "_value_14pnx_28", "children": "_children_14pnx_42" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/tabs/tabs.js
  var Tabs;
  var init_tabs = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/tabs/tabs.js"() {
      init_preact_module();
      init_hooks_module();
      init_create_component();
      init_no_op();
      init_constants();
      init_tabs_module();
      Tabs = createComponent(function(_a, ref) {
        var _b = _a, { onChange = noop, onCommand, onKeyDown = noop, onValueChange = noop, options, propagateEscapeKeyDown = true, value: value2 } = _b, rest = __objRest(_b, ["onChange", "onCommand", "onKeyDown", "onValueChange", "options", "propagateEscapeKeyDown", "value"]);
        const handleChange = q2(function(event) {
          onChange(event);
          const id = event.currentTarget.getAttribute(ITEM_ID_DATA_ATTRIBUTE_NAME);
          if (id === null) {
            throw new Error("`id` is `null`");
          }
          const newValue = options[parseInt(id, 10)].value;
          onValueChange(newValue);
        }, [onChange, onValueChange, options]);
        const handleKeyDown = q2(function(event) {
          onKeyDown(event);
          if (event.key === "Escape") {
            if (propagateEscapeKeyDown === false) {
              event.stopPropagation();
            }
            event.currentTarget.blur();
          }
        }, [onKeyDown, propagateEscapeKeyDown]);
        const activeOption = options.find(function(option) {
          return option.value === value2;
        });
        return _(
          k,
          null,
          _("div", { ref, class: tabs_module_default.tabs }, options.map(function(option, index) {
            return _(
              "label",
              { key: index, class: tabs_module_default.tab },
              _("input", __spreadProps(__spreadValues({}, rest), { checked: value2 === option.value, class: tabs_module_default.input, onChange: handleChange, onKeyDown: handleKeyDown, tabIndex: 0, type: "radio", value: option.value, [ITEM_ID_DATA_ATTRIBUTE_NAME]: `${index}` })),
              _("div", { class: tabs_module_default.value }, option.value)
            );
          })),
          typeof activeOption === "undefined" ? null : _("div", { class: tabs_module_default.children }, activeOption.children)
        );
      });
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/textbox/private/is-keycode-character-generating.js
  function isKeyCodeCharacterGenerating(keyCode) {
    return keyCode === 32 || keyCode >= 48 && keyCode <= 57 || keyCode >= 65 && keyCode <= 90 || keyCode >= 96 && keyCode <= 105 || keyCode >= 186 && keyCode <= 192 || keyCode >= 219 && keyCode <= 222;
  }
  var init_is_keycode_character_generating = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/textbox/private/is-keycode-character-generating.js"() {
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox/private/raw-textbox.js
  var EMPTY_STRING, RawTextbox;
  var init_raw_textbox = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox/private/raw-textbox.js"() {
      init_lib();
      init_preact_module();
      init_hooks_module();
      init_create_component();
      init_get_current_from_ref();
      init_no_op();
      init_is_keycode_character_generating();
      EMPTY_STRING = "";
      RawTextbox = createComponent(function(_a, ref) {
        var _b = _a, { disabled = false, onBlur = noop, onFocus = noop, onInput = noop, onKeyDown = noop, onMouseDown = noop, onValueInput = noop, password = false, placeholder, propagateEscapeKeyDown = true, revertOnEscapeKeyDown = false, spellCheck = false, validateOnBlur, value: value2 } = _b, rest = __objRest(_b, ["disabled", "onBlur", "onFocus", "onInput", "onKeyDown", "onMouseDown", "onValueInput", "password", "placeholder", "propagateEscapeKeyDown", "revertOnEscapeKeyDown", "spellCheck", "validateOnBlur", "value"]);
        const inputElementRef = A2(null);
        const [originalValue, setOriginalValue] = d2(EMPTY_STRING);
        const setTextboxValue = q2(function(value3) {
          const inputElement = getCurrentFromRef(inputElementRef);
          inputElement.value = value3;
          const inputEvent = new window.Event("input", {
            bubbles: true,
            cancelable: true
          });
          inputElement.dispatchEvent(inputEvent);
        }, []);
        const handleBlur = q2(function(event) {
          onBlur(event);
          if (typeof validateOnBlur !== "undefined") {
            const result = validateOnBlur(value2);
            if (typeof result === "string") {
              setTextboxValue(result);
              setOriginalValue(EMPTY_STRING);
              return;
            }
            if (result === false) {
              if (value2 !== originalValue) {
                setTextboxValue(originalValue);
              }
              setOriginalValue(EMPTY_STRING);
              return;
            }
          }
          setOriginalValue(EMPTY_STRING);
        }, [onBlur, originalValue, setTextboxValue, validateOnBlur, value2]);
        const handleFocus = q2(function(event) {
          onFocus(event);
          setOriginalValue(value2);
          event.currentTarget.select();
        }, [onFocus, value2]);
        const handleInput = q2(function(event) {
          onInput(event);
          const newValue = event.currentTarget.value;
          onValueInput(newValue);
        }, [onInput, onValueInput]);
        const handleKeyDown = q2(function(event) {
          onKeyDown(event);
          if (event.key === "Escape") {
            if (revertOnEscapeKeyDown === true) {
              setTextboxValue(originalValue);
              setOriginalValue(EMPTY_STRING);
            }
            if (propagateEscapeKeyDown === false) {
              event.stopPropagation();
            }
            event.currentTarget.blur();
            return;
          }
          if (value2 === MIXED_STRING && isKeyCodeCharacterGenerating(event.keyCode) === false) {
            event.preventDefault();
            event.currentTarget.select();
          }
        }, [
          onKeyDown,
          originalValue,
          propagateEscapeKeyDown,
          revertOnEscapeKeyDown,
          setTextboxValue,
          value2
        ]);
        const handleMouseDown = q2(function(event) {
          onMouseDown(event);
          if (value2 === MIXED_STRING) {
            event.preventDefault();
            event.currentTarget.select();
          }
        }, [onMouseDown, value2]);
        const refCallback = q2(function(inputElement) {
          inputElementRef.current = inputElement;
          if (ref === null) {
            return;
          }
          if (typeof ref === "function") {
            ref(inputElement);
            return;
          }
          ref.current = inputElement;
        }, [ref]);
        return _("input", __spreadProps(__spreadValues({}, rest), { ref: refCallback, disabled: disabled === true, onBlur: handleBlur, onFocus: handleFocus, onInput: handleInput, onKeyDown: handleKeyDown, onMouseDown: handleMouseDown, placeholder, spellcheck: spellCheck, tabIndex: 0, type: password === true ? "password" : "text", value: value2 === MIXED_STRING ? "Mixed" : value2 }));
      });
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/735d9e19-c780-4fc4-b201-911982f60123/textbox.module.js
  var textbox_module_default;
  var init_textbox_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/735d9e19-c780-4fc4-b201-911982f60123/textbox.module.js"() {
      if (document.getElementById("5c1c5c2d3d") === null) {
        const element = document.createElement("style");
        element.id = "5c1c5c2d3d";
        element.textContent = `._textbox_1m1e8_1 {
  position: relative;
  z-index: var(--z-index-1);
}

._textbox_1m1e8_1:focus-within {
  z-index: var(--z-index-2); /* Stack \`.textbox\` over its sibling elements */
}

._disabled_1m1e8_10,
._disabled_1m1e8_10 * {
  cursor: not-allowed;
}

._input_1m1e8_15 {
  display: block;
  width: 100%;
  height: var(--space-24);
  padding: var(--space-0) calc(var(--space-8) - var(--border-width-1));
  border: var(--border-width-1) solid transparent;
  border-radius: var(--border-radius-4);
  background-color: var(--figma-color-bg-secondary);
  color: var(--figma-color-text);
}
._input_1m1e8_15:hover {
  border-color: var(--figma-color-border);
}
._input_1m1e8_15:focus {
  border-color: var(--figma-color-border-selected);
}
._disabled_1m1e8_10 ._input_1m1e8_15 {
  border-color: var(--figma-color-border-disabled);
  background-color: transparent;
  color: var(--figma-color-text-disabled);
}
._hasIcon_1m1e8_36 ._input_1m1e8_15 {
  padding-left: calc(var(--space-24) - var(--border-width-1));
}

._input_1m1e8_15::placeholder {
  color: var(--figma-color-text-tertiary);
}

._icon_1m1e8_44 {
  position: absolute;
  top: 50%;
  left: var(--space-12);
  color: var(--figma-color-icon-secondary);
  pointer-events: none;
  text-align: center;
  transform: translate(-50%, -50%);
}
._disabled_1m1e8_10 ._icon_1m1e8_44 {
  color: var(--figma-color-icon-disabled);
}

._icon_1m1e8_44 svg {
  fill: currentColor;
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy90ZXh0Ym94L3RleHRib3gvdGV4dGJveC5tb2R1bGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usa0JBQWtCO0VBQ2xCLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLHlCQUF5QixFQUFFLCtDQUErQztBQUM1RTs7QUFFQTs7RUFFRSxtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxjQUFjO0VBQ2QsV0FBVztFQUNYLHVCQUF1QjtFQUN2QixvRUFBb0U7RUFDcEUsK0NBQStDO0VBQy9DLHFDQUFxQztFQUNyQyxpREFBaUQ7RUFDakQsOEJBQThCO0FBQ2hDO0FBQ0E7RUFDRSx1Q0FBdUM7QUFDekM7QUFDQTtFQUNFLGdEQUFnRDtBQUNsRDtBQUNBO0VBQ0UsZ0RBQWdEO0VBQ2hELDZCQUE2QjtFQUM3Qix1Q0FBdUM7QUFDekM7QUFDQTtFQUNFLDJEQUEyRDtBQUM3RDs7QUFFQTtFQUNFLHVDQUF1QztBQUN6Qzs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixRQUFRO0VBQ1IscUJBQXFCO0VBQ3JCLHdDQUF3QztFQUN4QyxvQkFBb0I7RUFDcEIsa0JBQWtCO0VBQ2xCLGdDQUFnQztBQUNsQztBQUNBO0VBQ0UsdUNBQXVDO0FBQ3pDOztBQUVBO0VBQ0Usa0JBQWtCO0FBQ3BCIiwiZmlsZSI6Im5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy90ZXh0Ym94L3RleHRib3gvdGV4dGJveC5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnRleHRib3gge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHotaW5kZXg6IHZhcigtLXotaW5kZXgtMSk7XG59XG5cbi50ZXh0Ym94OmZvY3VzLXdpdGhpbiB7XG4gIHotaW5kZXg6IHZhcigtLXotaW5kZXgtMik7IC8qIFN0YWNrIGAudGV4dGJveGAgb3ZlciBpdHMgc2libGluZyBlbGVtZW50cyAqL1xufVxuXG4uZGlzYWJsZWQsXG4uZGlzYWJsZWQgKiB7XG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XG59XG5cbi5pbnB1dCB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiB2YXIoLS1zcGFjZS0yNCk7XG4gIHBhZGRpbmc6IHZhcigtLXNwYWNlLTApIGNhbGModmFyKC0tc3BhY2UtOCkgLSB2YXIoLS1ib3JkZXItd2lkdGgtMSkpO1xuICBib3JkZXI6IHZhcigtLWJvcmRlci13aWR0aC0xKSBzb2xpZCB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLXJhZGl1czogdmFyKC0tYm9yZGVyLXJhZGl1cy00KTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctc2Vjb25kYXJ5KTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQpO1xufVxuLmlucHV0OmhvdmVyIHtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXIpO1xufVxuLmlucHV0OmZvY3VzIHtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXItc2VsZWN0ZWQpO1xufVxuLmRpc2FibGVkIC5pbnB1dCB7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYm9yZGVyLWRpc2FibGVkKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LWRpc2FibGVkKTtcbn1cbi5oYXNJY29uIC5pbnB1dCB7XG4gIHBhZGRpbmctbGVmdDogY2FsYyh2YXIoLS1zcGFjZS0yNCkgLSB2YXIoLS1ib3JkZXItd2lkdGgtMSkpO1xufVxuXG4uaW5wdXQ6OnBsYWNlaG9sZGVyIHtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQtdGVydGlhcnkpO1xufVxuXG4uaWNvbiB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiA1MCU7XG4gIGxlZnQ6IHZhcigtLXNwYWNlLTEyKTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWljb24tc2Vjb25kYXJ5KTtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG59XG4uZGlzYWJsZWQgLmljb24ge1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItaWNvbi1kaXNhYmxlZCk7XG59XG5cbi5pY29uIHN2ZyB7XG4gIGZpbGw6IGN1cnJlbnRDb2xvcjtcbn1cbiJdfQ== */`;
        document.head.append(element);
      }
      textbox_module_default = { "textbox": "_textbox_1m1e8_1", "disabled": "_disabled_1m1e8_10", "input": "_input_1m1e8_15", "hasIcon": "_hasIcon_1m1e8_36", "icon": "_icon_1m1e8_44" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox/textbox.js
  var Textbox;
  var init_textbox = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox/textbox.js"() {
      init_preact_module();
      init_create_class_name();
      init_create_component();
      init_raw_textbox();
      init_textbox_module();
      Textbox = createComponent(function(_a, ref) {
        var _b = _a, { icon } = _b, rest = __objRest(_b, ["icon"]);
        if (typeof icon === "string" && icon.length !== 1) {
          throw new Error(`String \`icon\` must be a single character: ${icon}`);
        }
        return _(
          "div",
          { class: createClassName([
            textbox_module_default.textbox,
            typeof icon === "undefined" ? null : textbox_module_default.hasIcon,
            rest.disabled === true ? textbox_module_default.disabled : null
          ]) },
          _(RawTextbox, __spreadProps(__spreadValues({}, rest), { ref, class: textbox_module_default.input })),
          typeof icon === "undefined" ? null : _("div", { class: textbox_module_default.icon }, icon)
        );
      });
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/textbox/private/compute-next-value.js
  function computeNextValue(inputElement, insertedString) {
    const value2 = inputElement.value;
    const selectionStart = inputElement.selectionStart;
    const selectionEnd = inputElement.selectionEnd;
    return `${value2.substring(0, selectionStart === null ? 0 : selectionStart)}${insertedString}${value2.substring(selectionEnd === null ? 0 : selectionEnd)}`;
  }
  var init_compute_next_value = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/textbox/private/compute-next-value.js"() {
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox-numeric/private/format-evaluated-value.js
  function formatEvaluatedValue(evaluatedValue, value2, suffix) {
    if (evaluatedValue === null) {
      return EMPTY_STRING2;
    }
    const significantFiguresCount = countSignificantFigures(nonDigitRegex.test(value2) === true ? `${evaluatedValue}` : value2);
    return appendSuffix(formatSignificantFigures(evaluatedValue, significantFiguresCount), suffix);
  }
  function countSignificantFigures(value2) {
    const result = fractionalPartRegex.exec(value2);
    if (result === null) {
      return 0;
    }
    return result[1].length;
  }
  function formatSignificantFigures(value2, significantFiguresCount) {
    if (significantFiguresCount === 0) {
      return `${value2}`;
    }
    const result = fractionalPartRegex.exec(`${value2}`);
    if (result === null) {
      return `${value2}.${"0".repeat(significantFiguresCount)}`;
    }
    const fractionalPart = result[1];
    const count = significantFiguresCount - fractionalPart.length;
    return `${value2}${"0".repeat(count)}`;
  }
  function appendSuffix(string, suffix) {
    if (typeof suffix === "undefined") {
      return string;
    }
    if (string === EMPTY_STRING2) {
      return EMPTY_STRING2;
    }
    return `${string}${suffix}`;
  }
  var EMPTY_STRING2, fractionalPartRegex, nonDigitRegex;
  var init_format_evaluated_value = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox-numeric/private/format-evaluated-value.js"() {
      EMPTY_STRING2 = "";
      fractionalPartRegex = /\.([^.]+)/;
      nonDigitRegex = /[^\d.]/;
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox-numeric/private/raw-textbox-numeric.js
  function restrictValue(value2, minimum, maximum) {
    if (typeof minimum !== "undefined") {
      if (typeof maximum !== "undefined") {
        return Math.min(Math.max(value2, minimum), maximum);
      }
      return Math.max(value2, minimum);
    }
    if (typeof maximum !== "undefined") {
      return Math.min(value2, maximum);
    }
    return value2;
  }
  function evaluateValue(value2, suffix) {
    if (value2 === MIXED_STRING) {
      return MIXED_NUMBER;
    }
    if (value2 === EMPTY_STRING3) {
      return null;
    }
    return evaluateNumericExpression(trimSuffix(value2, suffix));
  }
  function evaluateValueWithDelta(value2, delta) {
    return parseFloat((value2 + delta).toFixed(FRACTION_DIGITS));
  }
  function trimSuffix(string, suffix) {
    if (typeof suffix === "undefined") {
      return string;
    }
    return string.replace(new RegExp(`${suffix}$`), EMPTY_STRING3);
  }
  var FRACTION_DIGITS, EMPTY_STRING3, RawTextboxNumeric;
  var init_raw_textbox_numeric = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox-numeric/private/raw-textbox-numeric.js"() {
      init_lib();
      init_preact_module();
      init_hooks_module();
      init_create_component();
      init_get_current_from_ref();
      init_no_op();
      init_compute_next_value();
      init_is_keycode_character_generating();
      init_format_evaluated_value();
      FRACTION_DIGITS = 3;
      EMPTY_STRING3 = "";
      RawTextboxNumeric = createComponent(function(_a, ref) {
        var _b = _a, { disabled = false, incrementBig = 10, incrementSmall = 1, integer = false, maximum, minimum, onBlur = noop, onFocus = noop, onInput = noop, onMouseDown = noop, onKeyDown = noop, onNumericValueInput = noop, onValueInput = noop, placeholder, propagateEscapeKeyDown = true, revertOnEscapeKeyDown = false, suffix, validateOnBlur, value: value2 } = _b, rest = __objRest(_b, ["disabled", "incrementBig", "incrementSmall", "integer", "maximum", "minimum", "onBlur", "onFocus", "onInput", "onMouseDown", "onKeyDown", "onNumericValueInput", "onValueInput", "placeholder", "propagateEscapeKeyDown", "revertOnEscapeKeyDown", "suffix", "validateOnBlur", "value"]);
        if (typeof minimum !== "undefined" && typeof maximum !== "undefined" && minimum >= maximum) {
          throw new Error("`minimum` must be less than `maximum`");
        }
        const inputElementRef = A2(null);
        const revertOnEscapeKeyDownRef = A2(false);
        const [originalValue, setOriginalValue] = d2(EMPTY_STRING3);
        const setInputElementValue = q2(function(value3) {
          const inputElement = getCurrentFromRef(inputElementRef);
          inputElement.value = value3;
          const inputEvent = new window.Event("input", {
            bubbles: true,
            cancelable: true
          });
          inputElement.dispatchEvent(inputEvent);
        }, []);
        const handleBlur = q2(function(event) {
          onBlur(event);
          if (revertOnEscapeKeyDownRef.current === true) {
            revertOnEscapeKeyDownRef.current = false;
            return;
          }
          if (typeof validateOnBlur !== "undefined") {
            const evaluatedValue = evaluateValue(value2, suffix);
            const result = validateOnBlur(evaluatedValue);
            if (typeof result === "number") {
              setInputElementValue(formatEvaluatedValue(result, value2, suffix));
              setOriginalValue(EMPTY_STRING3);
              return;
            }
            if (result === null) {
              setInputElementValue(EMPTY_STRING3);
              setOriginalValue(EMPTY_STRING3);
              return;
            }
            if (result === false) {
              if (value2 !== originalValue) {
                setInputElementValue(originalValue);
              }
              setOriginalValue(EMPTY_STRING3);
              return;
            }
          }
          if (typeof suffix !== "undefined" && value2 === suffix) {
            setInputElementValue(EMPTY_STRING3);
            setOriginalValue(EMPTY_STRING3);
            return;
          }
          if (value2 !== EMPTY_STRING3 && value2 !== MIXED_STRING) {
            const evaluatedValue = evaluateValue(value2, suffix);
            const formattedValue = formatEvaluatedValue(evaluatedValue, value2, suffix);
            if (value2 !== formattedValue) {
              setInputElementValue(formattedValue);
            }
          }
          setOriginalValue(EMPTY_STRING3);
        }, [onBlur, originalValue, setInputElementValue, suffix, validateOnBlur, value2]);
        const handleFocus = q2(function(event) {
          onFocus(event);
          setOriginalValue(value2);
          event.currentTarget.select();
        }, [onFocus, value2]);
        const handleInput = q2(function(event) {
          onInput(event);
          const newValue = event.currentTarget.value;
          onValueInput(newValue);
          const evaluatedValue = evaluateValue(newValue, suffix);
          onNumericValueInput(evaluatedValue);
        }, [onInput, onNumericValueInput, onValueInput, suffix]);
        const handleKeyDown = q2(function(event) {
          onKeyDown(event);
          const key = event.key;
          if (key === "Escape") {
            if (revertOnEscapeKeyDown === true) {
              revertOnEscapeKeyDownRef.current = true;
              setInputElementValue(originalValue);
              setOriginalValue(EMPTY_STRING3);
            }
            if (propagateEscapeKeyDown === false) {
              event.stopPropagation();
            }
            event.currentTarget.blur();
            return;
          }
          const inputElement = event.currentTarget;
          if (key === "ArrowDown" || key === "ArrowUp") {
            const delta = event.shiftKey === true ? incrementBig : incrementSmall;
            event.preventDefault();
            if (value2 === EMPTY_STRING3 || value2 === MIXED_STRING) {
              const startingValue = function() {
                if (typeof minimum !== "undefined" && minimum > 0) {
                  return minimum;
                }
                if (typeof maximum !== "undefined" && maximum < 0) {
                  return maximum;
                }
                return 0;
              }();
              const evaluatedValue2 = evaluateValueWithDelta(startingValue, key === "ArrowDown" ? -1 * delta : delta);
              const newValue2 = restrictValue(evaluatedValue2, minimum, maximum);
              const formattedValue2 = formatEvaluatedValue(newValue2, value2, suffix);
              inputElement.value = formattedValue2;
              inputElement.select();
              const inputEvent2 = new window.Event("input", {
                bubbles: true,
                cancelable: true
              });
              inputElement.dispatchEvent(inputEvent2);
              return;
            }
            const number = evaluateValue(value2, suffix);
            if (number === null) {
              throw new Error("`number` is `null`");
            }
            const evaluatedValue = evaluateValueWithDelta(number, key === "ArrowDown" ? -1 * delta : delta);
            const newValue = restrictValue(evaluatedValue, minimum, maximum);
            const formattedValue = formatEvaluatedValue(newValue, value2, suffix);
            if (formattedValue === value2) {
              return;
            }
            inputElement.value = formattedValue;
            inputElement.select();
            const inputEvent = new window.Event("input", {
              bubbles: true,
              cancelable: true
            });
            inputElement.dispatchEvent(inputEvent);
            return;
          }
          if (event.ctrlKey === true || event.metaKey === true) {
            return;
          }
          if (isKeyCodeCharacterGenerating(event.keyCode) === true) {
            const newValue = trimSuffix(value2 === MIXED_STRING ? event.key : computeNextValue(inputElement, event.key), suffix);
            if (isValidNumericInput(newValue, { integersOnly: integer }) === false) {
              event.preventDefault();
              return;
            }
            if (typeof minimum === "undefined" && typeof maximum === "undefined") {
              return;
            }
            const evaluatedValue = evaluateNumericExpression(newValue);
            if (evaluatedValue === null) {
              return;
            }
            if (typeof minimum !== "undefined" && evaluatedValue < minimum || typeof maximum !== "undefined" && evaluatedValue > maximum) {
              event.preventDefault();
            }
          }
        }, [
          incrementBig,
          incrementSmall,
          integer,
          maximum,
          minimum,
          onKeyDown,
          originalValue,
          propagateEscapeKeyDown,
          revertOnEscapeKeyDown,
          setInputElementValue,
          suffix,
          value2
        ]);
        const handleMouseDown = q2(function(event) {
          onMouseDown(event);
          if (value2 === MIXED_STRING) {
            event.preventDefault();
            event.currentTarget.select();
          }
        }, [onMouseDown, value2]);
        const handlePaste = q2(function(event) {
          if (event.clipboardData === null) {
            throw new Error("`event.clipboardData` is `null`");
          }
          const nextValue = trimSuffix(computeNextValue(event.currentTarget, event.clipboardData.getData("Text")), suffix);
          if (isValidNumericInput(nextValue, {
            integersOnly: integer
          }) === false) {
            event.preventDefault();
          }
        }, [integer, suffix]);
        const refCallback = q2(function(inputElement) {
          inputElementRef.current = inputElement;
          if (ref === null) {
            return;
          }
          if (typeof ref === "function") {
            ref(inputElement);
            return;
          }
          ref.current = inputElement;
        }, [ref]);
        return _("input", __spreadProps(__spreadValues({}, rest), { ref: refCallback, disabled: disabled === true, onBlur: handleBlur, onFocus: handleFocus, onInput: handleInput, onKeyDown: handleKeyDown, onMouseDown: handleMouseDown, onPaste: handlePaste, placeholder, spellcheck: false, tabIndex: 0, type: "text", value: value2 === MIXED_STRING ? "Mixed" : value2 }));
      });
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox-color/private/create-rgba-color.js
  function createRgbaColor(hexColor, opacity) {
    if (hexColor === "" || hexColor === MIXED_STRING || opacity === "" || opacity === MIXED_STRING) {
      return null;
    }
    const rgb = convertHexColorToRgbColor(hexColor);
    if (rgb === null) {
      return null;
    }
    return __spreadProps(__spreadValues({}, rgb), {
      a: parseInt(opacity, 10) / 100
    });
  }
  var init_create_rgba_color = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox-color/private/create-rgba-color.js"() {
      init_lib();
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox-color/private/normalize-hex-color.js
  function normalizeUserInputColor(string) {
    const parsedNamedColor = convertNamedColorToHexColor(string);
    if (parsedNamedColor !== null) {
      return parsedNamedColor;
    }
    const hexColor = createHexColor(string).toUpperCase();
    if (isValidHexColor(hexColor) === false) {
      return null;
    }
    return hexColor;
  }
  function createHexColor(string) {
    switch (string.length) {
      case 0: {
        return "";
      }
      case 1: {
        return Array(6).fill(string).join("");
      }
      case 2: {
        return Array(3).fill(string).join("");
      }
      case 3:
      case 4:
      case 5: {
        return `${string[0]}${string[0]}${string[1]}${string[1]}${string[2]}${string[2]}`;
      }
      case 6: {
        return string;
      }
      default: {
        return string.slice(0, 6);
      }
    }
  }
  var init_normalize_hex_color = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox-color/private/normalize-hex-color.js"() {
      init_lib();
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox-color/private/update-hex-color.js
  function updateHexColor(hexColor, delta) {
    const rgbColor = convertHexColorToRgbColor(hexColor);
    if (rgbColor === null) {
      throw new Error("Invalid `hexColor`");
    }
    const { r: r3, g: g4, b: b2 } = rgbColor;
    const result = convertRgbColorToHexColor({
      b: updateValue(b2, delta),
      g: updateValue(g4, delta),
      r: updateValue(r3, delta)
    });
    if (result === null) {
      throw new Error("Invalid `rgbColor`");
    }
    return result;
  }
  function updateValue(value2, delta) {
    const newValue = value2 * 255 + delta;
    return Math.min(Math.max(newValue, 0), 255) / 255;
  }
  var init_update_hex_color = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox-color/private/update-hex-color.js"() {
      init_lib();
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/43e7399d-f322-4930-959d-c36c4f9c0276/textbox-color.module.js
  var textbox_color_module_default;
  var init_textbox_color_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/43e7399d-f322-4930-959d-c36c4f9c0276/textbox-color.module.js"() {
      if (document.getElementById("77000fee0f") === null) {
        const element = document.createElement("style");
        element.id = "77000fee0f";
        element.textContent = `._textboxColor_1yyub_1 {
  position: relative;
  z-index: var(--z-index-1);
  display: flex;
  width: 156px;
  align-items: center;
  border-radius: var(--border-radius-4);
  background-color: var(--figma-color-bg-secondary);
}
._textboxColor_1yyub_1:focus-within {
  z-index: var(
    --z-index-2
  ); /* Stack \`.textboxColor\` over its sibling elements */
}

._disabled_1yyub_16,
._disabled_1yyub_16 * {
  cursor: not-allowed;
}

._fullWidth_1yyub_21 {
  width: 100%;
}

._chit_1yyub_25 {
  display: flex;
  overflow: hidden;
  height: 14px;
  flex: 0 0 14px;
  border-radius: var(--border-radius-2);
  margin-left: calc(var(--space-6) - var(--border-width-1));
  background-image: url('data:image/svg+xml;utf8,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200H3V3H0V0Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M3%200H6V3H3V0Z%22%20fill%3D%22white%22/%3E%3Cpath%20d%3D%22M3%203H6V6H3V3Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M0%203H3V6H0V3Z%22%20fill%3D%22white%22/%3E%3C/svg%3E%0A');
}
._disabled_1yyub_16 ._chit_1yyub_25 {
  opacity: var(--opacity-30);
}

._color_1yyub_38 {
  flex: 1;
  background: none;
}

._hexColorSelector_1yyub_43 {
  position: absolute;
  top: 50%;
  left: 0;
  width: var(--space-24);
  height: var(--space-32);
  opacity: 0;
  transform: translate(0, -50%);
}

._input_1yyub_53 {
  display: block;
  width: 100%;
  height: var(--space-24);
  background-color: transparent;
  color: var(--figma-color-text);
}

._input_1yyub_53::placeholder {
  color: var(--figma-color-text-tertiary);
}

._input_1yyub_53::-webkit-inner-spin-button,
._input_1yyub_53::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

._hexColorInput_1yyub_70 {
  flex: 1 67px;
  padding-left: var(--space-6);
  border-right: var(--border-width-1) solid var(--figma-color-bg);
}

._opacityInputWrapper_1yyub_76 {
  position: relative;
  flex: 0 0 54px;
}
._opacityInput_1yyub_76 {
  padding-left: var(--space-8);
}

._percentage_1yyub_84 {
  position: absolute;
  top: 50%;
  right: var(--space-6);
  color: var(--figma-color-text-secondary);
  pointer-events: none;
  text-align: right;
  transform: translate(0, -50%);
}
._disabled_1yyub_16 ._percentage_1yyub_84 {
  color: var(--figma-color-text-disabled);
}

._border_1yyub_97 {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: var(--border-width-1) solid transparent;
  border-radius: var(--border-radius-4);
  pointer-events: none;
}
._textboxColor_1yyub_1:not(._disabled_1yyub_16):hover ._border_1yyub_97 {
  border-color: var(--figma-color-border);
}
._textboxColor_1yyub_1:not(._disabled_1yyub_16):focus-within ._border_1yyub_97 {
  border-color: var(--figma-color-border-selected);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy90ZXh0Ym94L3RleHRib3gtY29sb3IvdGV4dGJveC1jb2xvci5tb2R1bGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usa0JBQWtCO0VBQ2xCLHlCQUF5QjtFQUN6QixhQUFhO0VBQ2IsWUFBWTtFQUNaLG1CQUFtQjtFQUNuQixxQ0FBcUM7RUFDckMsaURBQWlEO0FBQ25EO0FBQ0E7RUFDRTs7R0FFQyxFQUFFLG9EQUFvRDtBQUN6RDs7QUFFQTs7RUFFRSxtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxXQUFXO0FBQ2I7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsZ0JBQWdCO0VBQ2hCLFlBQVk7RUFDWixjQUFjO0VBQ2QscUNBQXFDO0VBQ3JDLHlEQUF5RDtFQUN6RCxxY0FBcWM7QUFDdmM7QUFDQTtFQUNFLDBCQUEwQjtBQUM1Qjs7QUFFQTtFQUNFLE9BQU87RUFDUCxnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsUUFBUTtFQUNSLE9BQU87RUFDUCxzQkFBc0I7RUFDdEIsdUJBQXVCO0VBQ3ZCLFVBQVU7RUFDViw2QkFBNkI7QUFDL0I7O0FBRUE7RUFDRSxjQUFjO0VBQ2QsV0FBVztFQUNYLHVCQUF1QjtFQUN2Qiw2QkFBNkI7RUFDN0IsOEJBQThCO0FBQ2hDOztBQUVBO0VBQ0UsdUNBQXVDO0FBQ3pDOztBQUVBOztFQUVFLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFLFlBQVk7RUFDWiw0QkFBNEI7RUFDNUIsK0RBQStEO0FBQ2pFOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLGNBQWM7QUFDaEI7QUFDQTtFQUNFLDRCQUE0QjtBQUM5Qjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixRQUFRO0VBQ1IscUJBQXFCO0VBQ3JCLHdDQUF3QztFQUN4QyxvQkFBb0I7RUFDcEIsaUJBQWlCO0VBQ2pCLDZCQUE2QjtBQUMvQjtBQUNBO0VBQ0UsdUNBQXVDO0FBQ3pDOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLE1BQU07RUFDTixRQUFRO0VBQ1IsU0FBUztFQUNULE9BQU87RUFDUCwrQ0FBK0M7RUFDL0MscUNBQXFDO0VBQ3JDLG9CQUFvQjtBQUN0QjtBQUNBO0VBQ0UsdUNBQXVDO0FBQ3pDO0FBQ0E7RUFDRSxnREFBZ0Q7QUFDbEQiLCJmaWxlIjoibm9kZV9tb2R1bGVzL0BjcmVhdGUtZmlnbWEtcGx1Z2luL3VpL2xpYi9jb21wb25lbnRzL3RleHRib3gvdGV4dGJveC1jb2xvci90ZXh0Ym94LWNvbG9yLm1vZHVsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIudGV4dGJveENvbG9yIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB6LWluZGV4OiB2YXIoLS16LWluZGV4LTEpO1xuICBkaXNwbGF5OiBmbGV4O1xuICB3aWR0aDogMTU2cHg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJvcmRlci1yYWRpdXM6IHZhcigtLWJvcmRlci1yYWRpdXMtNCk7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJnLXNlY29uZGFyeSk7XG59XG4udGV4dGJveENvbG9yOmZvY3VzLXdpdGhpbiB7XG4gIHotaW5kZXg6IHZhcihcbiAgICAtLXotaW5kZXgtMlxuICApOyAvKiBTdGFjayBgLnRleHRib3hDb2xvcmAgb3ZlciBpdHMgc2libGluZyBlbGVtZW50cyAqL1xufVxuXG4uZGlzYWJsZWQsXG4uZGlzYWJsZWQgKiB7XG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XG59XG5cbi5mdWxsV2lkdGgge1xuICB3aWR0aDogMTAwJTtcbn1cblxuLmNoaXQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBoZWlnaHQ6IDE0cHg7XG4gIGZsZXg6IDAgMCAxNHB4O1xuICBib3JkZXItcmFkaXVzOiB2YXIoLS1ib3JkZXItcmFkaXVzLTIpO1xuICBtYXJnaW4tbGVmdDogY2FsYyh2YXIoLS1zcGFjZS02KSAtIHZhcigtLWJvcmRlci13aWR0aC0xKSk7XG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsJTNDc3ZnJTIwd2lkdGglM0QlMjI2JTIyJTIwaGVpZ2h0JTNEJTIyNiUyMiUyMHZpZXdCb3glM0QlMjIwJTIwMCUyMDYlMjA2JTIyJTIwZmlsbCUzRCUyMm5vbmUlMjIlMjB4bWxucyUzRCUyMmh0dHAlM0EvL3d3dy53My5vcmcvMjAwMC9zdmclMjIlM0UlM0NwYXRoJTIwZCUzRCUyMk0wJTIwMEgzVjNIMFYwWiUyMiUyMGZpbGwlM0QlMjIlMjNFMUUxRTElMjIvJTNFJTNDcGF0aCUyMGQlM0QlMjJNMyUyMDBINlYzSDNWMFolMjIlMjBmaWxsJTNEJTIyd2hpdGUlMjIvJTNFJTNDcGF0aCUyMGQlM0QlMjJNMyUyMDNINlY2SDNWM1olMjIlMjBmaWxsJTNEJTIyJTIzRTFFMUUxJTIyLyUzRSUzQ3BhdGglMjBkJTNEJTIyTTAlMjAzSDNWNkgwVjNaJTIyJTIwZmlsbCUzRCUyMndoaXRlJTIyLyUzRSUzQy9zdmclM0UlMEEnKTtcbn1cbi5kaXNhYmxlZCAuY2hpdCB7XG4gIG9wYWNpdHk6IHZhcigtLW9wYWNpdHktMzApO1xufVxuXG4uY29sb3Ige1xuICBmbGV4OiAxO1xuICBiYWNrZ3JvdW5kOiBub25lO1xufVxuXG4uaGV4Q29sb3JTZWxlY3RvciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiA1MCU7XG4gIGxlZnQ6IDA7XG4gIHdpZHRoOiB2YXIoLS1zcGFjZS0yNCk7XG4gIGhlaWdodDogdmFyKC0tc3BhY2UtMzIpO1xuICBvcGFjaXR5OiAwO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAtNTAlKTtcbn1cblxuLmlucHV0IHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IHZhcigtLXNwYWNlLTI0KTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0KTtcbn1cblxuLmlucHV0OjpwbGFjZWhvbGRlciB7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LXRlcnRpYXJ5KTtcbn1cblxuLmlucHV0Ojotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuLmlucHV0Ojotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xufVxuXG4uaGV4Q29sb3JJbnB1dCB7XG4gIGZsZXg6IDEgNjdweDtcbiAgcGFkZGluZy1sZWZ0OiB2YXIoLS1zcGFjZS02KTtcbiAgYm9yZGVyLXJpZ2h0OiB2YXIoLS1ib3JkZXItd2lkdGgtMSkgc29saWQgdmFyKC0tZmlnbWEtY29sb3ItYmcpO1xufVxuXG4ub3BhY2l0eUlucHV0V3JhcHBlciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZmxleDogMCAwIDU0cHg7XG59XG4ub3BhY2l0eUlucHV0IHtcbiAgcGFkZGluZy1sZWZ0OiB2YXIoLS1zcGFjZS04KTtcbn1cblxuLnBlcmNlbnRhZ2Uge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogNTAlO1xuICByaWdodDogdmFyKC0tc3BhY2UtNik7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LXNlY29uZGFyeSk7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB0ZXh0LWFsaWduOiByaWdodDtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwgLTUwJSk7XG59XG4uZGlzYWJsZWQgLnBlcmNlbnRhZ2Uge1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dC1kaXNhYmxlZCk7XG59XG5cbi5ib3JkZXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgcmlnaHQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgbGVmdDogMDtcbiAgYm9yZGVyOiB2YXIoLS1ib3JkZXItd2lkdGgtMSkgc29saWQgdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci1yYWRpdXM6IHZhcigtLWJvcmRlci1yYWRpdXMtNCk7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xufVxuLnRleHRib3hDb2xvcjpub3QoLmRpc2FibGVkKTpob3ZlciAuYm9yZGVyIHtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXIpO1xufVxuLnRleHRib3hDb2xvcjpub3QoLmRpc2FibGVkKTpmb2N1cy13aXRoaW4gLmJvcmRlciB7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYm9yZGVyLXNlbGVjdGVkKTtcbn1cbiJdfQ== */`;
        document.head.append(element);
      }
      textbox_color_module_default = { "textboxColor": "_textboxColor_1yyub_1", "disabled": "_disabled_1yyub_16", "fullWidth": "_fullWidth_1yyub_21", "chit": "_chit_1yyub_25", "color": "_color_1yyub_38", "hexColorSelector": "_hexColorSelector_1yyub_43", "input": "_input_1yyub_53", "hexColorInput": "_hexColorInput_1yyub_70", "opacityInputWrapper": "_opacityInputWrapper_1yyub_76", "opacityInput": "_opacityInput_1yyub_76", "percentage": "_percentage_1yyub_84", "border": "_border_1yyub_97" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox-color/textbox-color.js
  function parseOpacity(opacity) {
    if (opacity === MIXED_STRING || opacity === EMPTY_STRING4) {
      return 1;
    }
    return parseInt(opacity, 10) / 100;
  }
  var EMPTY_STRING4, TextboxColor;
  var init_textbox_color = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox-color/textbox-color.js"() {
      init_lib();
      init_preact_module();
      init_hooks_module();
      init_create_class_name();
      init_create_component();
      init_get_current_from_ref();
      init_no_op();
      init_raw_textbox_numeric();
      init_create_rgba_color();
      init_normalize_hex_color();
      init_update_hex_color();
      init_textbox_color_module();
      EMPTY_STRING4 = "";
      TextboxColor = createComponent(function(_a, ref) {
        var _b = _a, { disabled = false, fullWidth = false, hexColor, hexColorPlaceholder, onCommand, onHexColorInput = noop, onHexColorKeyDown = noop, onHexColorValueInput = noop, onOpacityInput = noop, onOpacityKeyDown = noop, onOpacityNumericValueInput = noop, onOpacityValueInput = noop, onRgbaColorValueInput = noop, opacity, propagateEscapeKeyDown = true, revertOnEscapeKeyDown = false } = _b, rest = __objRest(_b, ["disabled", "fullWidth", "hexColor", "hexColorPlaceholder", "onCommand", "onHexColorInput", "onHexColorKeyDown", "onHexColorValueInput", "onOpacityInput", "onOpacityKeyDown", "onOpacityNumericValueInput", "onOpacityValueInput", "onRgbaColorValueInput", "opacity", "propagateEscapeKeyDown", "revertOnEscapeKeyDown"]);
        const hexColorInputElementRef = A2(null);
        const opacityInputElementRef = A2(null);
        const revertOnEscapeKeyDownRef = A2(false);
        const [originalHexColor, setOriginalHexColor] = d2(EMPTY_STRING4);
        const setHexColorInputElementValue = q2(function(value2) {
          const inputElement = getCurrentFromRef(hexColorInputElementRef);
          inputElement.value = value2;
          const inputEvent = new window.Event("input", {
            bubbles: true,
            cancelable: true
          });
          inputElement.dispatchEvent(inputEvent);
        }, []);
        const handleHexColorSelectorFocus = q2(function(event) {
          const hexColor2 = event.currentTarget.value.slice(1).toUpperCase();
          setOriginalHexColor(hexColor2);
        }, []);
        const handleHexColorSelectorInput = q2(function(event) {
          const hexColor2 = event.currentTarget.value.slice(1).toUpperCase();
          setHexColorInputElementValue(hexColor2);
        }, [setHexColorInputElementValue]);
        const handleHexColorSelectorKeyDown = q2(function(event) {
          if (event.key !== "Escape") {
            return;
          }
          if (revertOnEscapeKeyDown === true) {
            revertOnEscapeKeyDownRef.current = true;
            setHexColorInputElementValue(originalHexColor);
            setOriginalHexColor(EMPTY_STRING4);
          }
          if (propagateEscapeKeyDown === false) {
            event.stopPropagation();
          }
          event.currentTarget.blur();
        }, [
          originalHexColor,
          propagateEscapeKeyDown,
          revertOnEscapeKeyDown,
          setHexColorInputElementValue
        ]);
        const handleHexColorBlur = q2(function() {
          if (revertOnEscapeKeyDownRef.current === true) {
            revertOnEscapeKeyDownRef.current = false;
            return;
          }
          if (hexColor === EMPTY_STRING4) {
            if (originalHexColor !== EMPTY_STRING4) {
              setHexColorInputElementValue(originalHexColor);
            }
            setOriginalHexColor(EMPTY_STRING4);
            return;
          }
          if (hexColor !== MIXED_STRING) {
            const normalizedHexColor2 = normalizeUserInputColor(hexColor);
            const newHexColor = normalizedHexColor2 === null ? originalHexColor : normalizedHexColor2;
            if (newHexColor !== hexColor) {
              setHexColorInputElementValue(newHexColor);
            }
          }
          setOriginalHexColor(EMPTY_STRING4);
        }, [hexColor, originalHexColor, setHexColorInputElementValue]);
        const handleHexColorFocus = q2(function(event) {
          setOriginalHexColor(hexColor);
          event.currentTarget.select();
        }, [hexColor]);
        const handleHexColorInput = q2(function(event) {
          onHexColorInput(event);
          const newHexColor = event.currentTarget.value;
          onHexColorValueInput(newHexColor);
          if (newHexColor === EMPTY_STRING4) {
            onRgbaColorValueInput(null);
            return;
          }
          const normalizedHexColor2 = normalizeUserInputColor(newHexColor);
          if (normalizedHexColor2 === null) {
            onRgbaColorValueInput(null);
            return;
          }
          const rgba = createRgbaColor(normalizedHexColor2, opacity);
          onRgbaColorValueInput(rgba);
        }, [onHexColorInput, onHexColorValueInput, onRgbaColorValueInput, opacity]);
        const handleHexColorKeyDown = q2(function(event) {
          onHexColorKeyDown(event);
          const key = event.key;
          if (key === "Escape") {
            if (revertOnEscapeKeyDown === true) {
              revertOnEscapeKeyDownRef.current = true;
              setHexColorInputElementValue(originalHexColor);
              setOriginalHexColor(EMPTY_STRING4);
            }
            if (propagateEscapeKeyDown === false) {
              event.stopPropagation();
            }
            event.currentTarget.blur();
            return;
          }
          const element = event.currentTarget;
          if (key === "ArrowDown" || key === "ArrowUp") {
            event.preventDefault();
            const delta = event.shiftKey === true ? 10 : 1;
            const startingHexColor = hexColor === EMPTY_STRING4 || hexColor === MIXED_STRING ? key === "ArrowDown" ? "FFFFFF" : "000000" : hexColor;
            const newHexColor = updateHexColor(startingHexColor, key === "ArrowDown" ? -1 * delta : delta);
            setHexColorInputElementValue(newHexColor);
            element.select();
            return;
          }
          if (event.ctrlKey === true || event.metaKey === true) {
            return;
          }
        }, [
          hexColor,
          onHexColorKeyDown,
          originalHexColor,
          propagateEscapeKeyDown,
          revertOnEscapeKeyDown,
          setHexColorInputElementValue
        ]);
        const handleHexColorMouseUp = q2(function(event) {
          if (hexColor !== MIXED_STRING) {
            return;
          }
          event.preventDefault();
        }, [hexColor]);
        const handleOpacityInput = q2(function(event) {
          onOpacityInput(event);
          const newOpacity = event.currentTarget.value;
          const rgba = createRgbaColor(hexColor, newOpacity);
          onRgbaColorValueInput(rgba);
        }, [hexColor, onOpacityInput, onRgbaColorValueInput]);
        const handleOpacityNumericValueInput = q2(function(opacity2) {
          onOpacityNumericValueInput(opacity2 === null || opacity2 === MIXED_NUMBER ? opacity2 : opacity2 / 100);
        }, [onOpacityNumericValueInput]);
        const validateOpacityOnBlur = q2(function(opacity2) {
          return opacity2 !== null;
        }, []);
        const parsedOpacity = parseOpacity(opacity);
        const isHexColorValid = hexColor !== EMPTY_STRING4 && hexColor !== MIXED_STRING;
        const normalizedHexColor = isHexColorValid === true ? normalizeUserInputColor(hexColor) : "FFFFFF";
        const renderedHexColor = normalizedHexColor === null ? originalHexColor : normalizedHexColor;
        return _(
          "div",
          { ref, class: createClassName([
            textbox_color_module_default.textboxColor,
            disabled === true ? textbox_color_module_default.disabled : null,
            fullWidth === true ? textbox_color_module_default.fullWidth : null
          ]) },
          _(
            "div",
            { class: textbox_color_module_default.chit },
            _("div", { class: textbox_color_module_default.color, style: isHexColorValid === true ? { backgroundColor: `#${renderedHexColor}` } : {} }),
            parsedOpacity === 1 ? null : _("div", { class: textbox_color_module_default.color, style: isHexColorValid === true ? {
              backgroundColor: `#${renderedHexColor}`,
              opacity: parsedOpacity
            } : {} })
          ),
          _("input", { class: textbox_color_module_default.hexColorSelector, disabled: disabled === true, onFocus: handleHexColorSelectorFocus, onInput: handleHexColorSelectorInput, onKeyDown: handleHexColorSelectorKeyDown, tabIndex: -1, type: "color", value: `#${renderedHexColor}` }),
          _("input", __spreadProps(__spreadValues({}, rest), { ref: hexColorInputElementRef, class: createClassName([textbox_color_module_default.input, textbox_color_module_default.hexColorInput]), disabled: disabled === true, onBlur: handleHexColorBlur, onFocus: handleHexColorFocus, onInput: handleHexColorInput, onKeyDown: handleHexColorKeyDown, onMouseUp: handleHexColorMouseUp, placeholder: hexColorPlaceholder, spellcheck: false, tabIndex: 0, type: "text", value: hexColor === MIXED_STRING ? "Mixed" : hexColor })),
          _(
            "div",
            { class: textbox_color_module_default.opacityInputWrapper },
            _(RawTextboxNumeric, { ref: opacityInputElementRef, class: createClassName([textbox_color_module_default.input, textbox_color_module_default.opacityInput]), disabled: disabled === true, maximum: 100, minimum: 0, onInput: handleOpacityInput, onKeyDown: onOpacityKeyDown, onNumericValueInput: handleOpacityNumericValueInput, onValueInput: onOpacityValueInput, propagateEscapeKeyDown, revertOnEscapeKeyDown, validateOnBlur: validateOpacityOnBlur, value: opacity }),
            opacity === MIXED_STRING ? null : _("div", { class: textbox_color_module_default.percentage }, "%")
          ),
          _("div", { class: textbox_color_module_default.border })
        );
      });
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/d4329459-58de-416f-80ab-72cbd4e3d428/textbox.module.js
  var textbox_module_default2;
  var init_textbox_module2 = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/d4329459-58de-416f-80ab-72cbd4e3d428/textbox.module.js"() {
      if (document.getElementById("5c1c5c2d3d") === null) {
        const element = document.createElement("style");
        element.id = "5c1c5c2d3d";
        element.textContent = `._textbox_1m1e8_1 {
  position: relative;
  z-index: var(--z-index-1);
}

._textbox_1m1e8_1:focus-within {
  z-index: var(--z-index-2); /* Stack \`.textbox\` over its sibling elements */
}

._disabled_1m1e8_10,
._disabled_1m1e8_10 * {
  cursor: not-allowed;
}

._input_1m1e8_15 {
  display: block;
  width: 100%;
  height: var(--space-24);
  padding: var(--space-0) calc(var(--space-8) - var(--border-width-1));
  border: var(--border-width-1) solid transparent;
  border-radius: var(--border-radius-4);
  background-color: var(--figma-color-bg-secondary);
  color: var(--figma-color-text);
}
._input_1m1e8_15:hover {
  border-color: var(--figma-color-border);
}
._input_1m1e8_15:focus {
  border-color: var(--figma-color-border-selected);
}
._disabled_1m1e8_10 ._input_1m1e8_15 {
  border-color: var(--figma-color-border-disabled);
  background-color: transparent;
  color: var(--figma-color-text-disabled);
}
._hasIcon_1m1e8_36 ._input_1m1e8_15 {
  padding-left: calc(var(--space-24) - var(--border-width-1));
}

._input_1m1e8_15::placeholder {
  color: var(--figma-color-text-tertiary);
}

._icon_1m1e8_44 {
  position: absolute;
  top: 50%;
  left: var(--space-12);
  color: var(--figma-color-icon-secondary);
  pointer-events: none;
  text-align: center;
  transform: translate(-50%, -50%);
}
._disabled_1m1e8_10 ._icon_1m1e8_44 {
  color: var(--figma-color-icon-disabled);
}

._icon_1m1e8_44 svg {
  fill: currentColor;
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy90ZXh0Ym94L3RleHRib3gvdGV4dGJveC5tb2R1bGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usa0JBQWtCO0VBQ2xCLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLHlCQUF5QixFQUFFLCtDQUErQztBQUM1RTs7QUFFQTs7RUFFRSxtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxjQUFjO0VBQ2QsV0FBVztFQUNYLHVCQUF1QjtFQUN2QixvRUFBb0U7RUFDcEUsK0NBQStDO0VBQy9DLHFDQUFxQztFQUNyQyxpREFBaUQ7RUFDakQsOEJBQThCO0FBQ2hDO0FBQ0E7RUFDRSx1Q0FBdUM7QUFDekM7QUFDQTtFQUNFLGdEQUFnRDtBQUNsRDtBQUNBO0VBQ0UsZ0RBQWdEO0VBQ2hELDZCQUE2QjtFQUM3Qix1Q0FBdUM7QUFDekM7QUFDQTtFQUNFLDJEQUEyRDtBQUM3RDs7QUFFQTtFQUNFLHVDQUF1QztBQUN6Qzs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixRQUFRO0VBQ1IscUJBQXFCO0VBQ3JCLHdDQUF3QztFQUN4QyxvQkFBb0I7RUFDcEIsa0JBQWtCO0VBQ2xCLGdDQUFnQztBQUNsQztBQUNBO0VBQ0UsdUNBQXVDO0FBQ3pDOztBQUVBO0VBQ0Usa0JBQWtCO0FBQ3BCIiwiZmlsZSI6Im5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy90ZXh0Ym94L3RleHRib3gvdGV4dGJveC5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnRleHRib3gge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHotaW5kZXg6IHZhcigtLXotaW5kZXgtMSk7XG59XG5cbi50ZXh0Ym94OmZvY3VzLXdpdGhpbiB7XG4gIHotaW5kZXg6IHZhcigtLXotaW5kZXgtMik7IC8qIFN0YWNrIGAudGV4dGJveGAgb3ZlciBpdHMgc2libGluZyBlbGVtZW50cyAqL1xufVxuXG4uZGlzYWJsZWQsXG4uZGlzYWJsZWQgKiB7XG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XG59XG5cbi5pbnB1dCB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiB2YXIoLS1zcGFjZS0yNCk7XG4gIHBhZGRpbmc6IHZhcigtLXNwYWNlLTApIGNhbGModmFyKC0tc3BhY2UtOCkgLSB2YXIoLS1ib3JkZXItd2lkdGgtMSkpO1xuICBib3JkZXI6IHZhcigtLWJvcmRlci13aWR0aC0xKSBzb2xpZCB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLXJhZGl1czogdmFyKC0tYm9yZGVyLXJhZGl1cy00KTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctc2Vjb25kYXJ5KTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQpO1xufVxuLmlucHV0OmhvdmVyIHtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXIpO1xufVxuLmlucHV0OmZvY3VzIHtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXItc2VsZWN0ZWQpO1xufVxuLmRpc2FibGVkIC5pbnB1dCB7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYm9yZGVyLWRpc2FibGVkKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LWRpc2FibGVkKTtcbn1cbi5oYXNJY29uIC5pbnB1dCB7XG4gIHBhZGRpbmctbGVmdDogY2FsYyh2YXIoLS1zcGFjZS0yNCkgLSB2YXIoLS1ib3JkZXItd2lkdGgtMSkpO1xufVxuXG4uaW5wdXQ6OnBsYWNlaG9sZGVyIHtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQtdGVydGlhcnkpO1xufVxuXG4uaWNvbiB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiA1MCU7XG4gIGxlZnQ6IHZhcigtLXNwYWNlLTEyKTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWljb24tc2Vjb25kYXJ5KTtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG59XG4uZGlzYWJsZWQgLmljb24ge1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItaWNvbi1kaXNhYmxlZCk7XG59XG5cbi5pY29uIHN2ZyB7XG4gIGZpbGw6IGN1cnJlbnRDb2xvcjtcbn1cbiJdfQ== */`;
        document.head.append(element);
      }
      textbox_module_default2 = { "textbox": "_textbox_1m1e8_1", "disabled": "_disabled_1m1e8_10", "input": "_input_1m1e8_15", "hasIcon": "_hasIcon_1m1e8_36", "icon": "_icon_1m1e8_44" };
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/ecf9ea75-e277-4830-8598-3a931c9f83b3/textbox-numeric.module.js
  var textbox_numeric_module_default;
  var init_textbox_numeric_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/ecf9ea75-e277-4830-8598-3a931c9f83b3/textbox-numeric.module.js"() {
      if (document.getElementById("b6dab244a8") === null) {
        const element = document.createElement("style");
        element.id = "b6dab244a8";
        element.textContent = `._input_1byj7_1::-webkit-inner-spin-button,
._input_1byj7_1::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy90ZXh0Ym94L3RleHRib3gtbnVtZXJpYy90ZXh0Ym94LW51bWVyaWMubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7RUFFRSx3QkFBd0I7QUFDMUIiLCJmaWxlIjoibm9kZV9tb2R1bGVzL0BjcmVhdGUtZmlnbWEtcGx1Z2luL3VpL2xpYi9jb21wb25lbnRzL3RleHRib3gvdGV4dGJveC1udW1lcmljL3RleHRib3gtbnVtZXJpYy5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmlucHV0Ojotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuLmlucHV0Ojotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xufVxuIl19 */`;
        document.head.append(element);
      }
      textbox_numeric_module_default = { "input": "_input_1byj7_1" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox-numeric/textbox-numeric.js
  var TextboxNumeric;
  var init_textbox_numeric = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox-numeric/textbox-numeric.js"() {
      init_preact_module();
      init_create_class_name();
      init_create_component();
      init_textbox_module2();
      init_raw_textbox_numeric();
      init_textbox_numeric_module();
      TextboxNumeric = createComponent(function(_a, ref) {
        var _b = _a, { icon } = _b, rest = __objRest(_b, ["icon"]);
        if (typeof icon === "string" && icon.length !== 1) {
          throw new Error(`String \`icon\` must be a single character: ${icon}`);
        }
        return _(
          "div",
          { class: createClassName([
            textbox_module_default2.textbox,
            typeof icon === "undefined" ? null : textbox_module_default2.hasIcon,
            rest.disabled === true ? textbox_module_default2.disabled : null
          ]) },
          _(RawTextboxNumeric, __spreadProps(__spreadValues({}, rest), { ref, class: createClassName([
            textbox_module_default2.input,
            textbox_numeric_module_default.input
          ]) })),
          typeof icon === "undefined" ? null : _("div", { class: textbox_module_default2.icon }, icon)
        );
      });
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-adjust-16.js
  var IconAdjust16;
  var init_icon_adjust_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-adjust-16.js"() {
      init_preact_module();
      init_create_icon();
      IconAdjust16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M5 3.5c0-.27614.22386-.5.5-.5s.5.22386.5.5v4.58535c.5826.20592 1 .76154 1 1.41465s-.4174 1.2087-1 1.4146V12.5c0 .2761-.22386.5-.5.5s-.5-.2239-.5-.5v-1.5854c-.5826-.2059-1-.7615-1-1.4146s.4174-1.20873 1-1.41465zm0 6c0-.27614.22386-.5.5-.5s.5.22386.5.5-.22386.5-.5.5-.5-.22386-.5-.5m5 3c0 .2761.2239.5.5.5s.5-.2239.5-.5V7.91465c.5826-.20592 1-.76154 1-1.41465s-.4174-1.20873-1-1.41465V3.5c0-.27614-.2239-.5-.5-.5s-.5.22386-.5.5v1.58535C9.4174 5.29127 9 5.84689 9 6.5s.4174 1.20873 1 1.41465zm0-6c0 .27614.2239.5.5.5s.5-.22386.5-.5-.2239-.5-.5-.5-.5.22386-.5.5", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-close-16.js
  var IconClose16;
  var init_icon_close_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-close-16.js"() {
      init_preact_module();
      init_create_icon();
      IconClose16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M4.14645 4.14645c.19526-.19527.51184-.19527.7071 0L8 7.29289l3.1464-3.14644c.1953-.19527.5119-.19527.7072 0 .1952.19526.1952.51184 0 .7071L8.70711 8l3.14649 3.1464c.1952.1953.1952.5119 0 .7072-.1953.1952-.5119.1952-.7072 0L8 8.70711 4.85355 11.8536c-.19526.1952-.51184.1952-.7071 0-.19527-.1953-.19527-.5119 0-.7072L7.29289 8 4.14645 4.85355c-.19527-.19526-.19527-.51184 0-.7071", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-folder-16.js
  var IconFolder16;
  var init_icon_folder_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-folder-16.js"() {
      init_preact_module();
      init_create_icon();
      IconFolder16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M4 4h3v1H4zM3 5V4c0-.55229.44771-1 1-1h3c.55229 0 1 .44771 1 1v1h4c.5523 0 1 .44771 1 1v5c0 .5523-.4477 1-1 1H4c-.55229 0-1-.4477-1-1V5m5 1H4v5h8V6z", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-home-16.js
  var IconHome16;
  var init_icon_home_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-home-16.js"() {
      init_preact_module();
      init_create_icon();
      IconHome16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { d: "m7.66782 2.79524-.33218-.3737zm.66436 0 .33218-.3737zM3.66782 6.3508 4 6.7245zm8.66438 0 .3322-.37371zM8 3.16895l.66436-.74741c-.37888-.33679-.94984-.33679-1.32872 0zM4 6.7245l4-3.55555-.66436-.74741-4 3.55555zm0 0-.66436-.74741A1 1 0 0 0 3 6.7245zM4 12V6.7245H3V12zm0 0H3c0 .5523.44772 1 1 1zm2 0H4v1h2zm1 0V8.99997H6V12zm0-3.00003v-1c-.55228 0-1 .44772-1 1zm0 0h2v-1H7zm2 0h1c0-.55228-.44772-1-1-1zm0 0V12h1V8.99997zM12 12h-2v1h2zm0 0v1c.5523 0 1-.4477 1-1zm0-5.2755V12h1V6.7245zm0 0h1a1 1 0 0 0-.3356-.74741zM8 3.16895l4 3.55555.6644-.74741-4.00004-3.55555zM9 12c0 .5523.44771 1 1 1v-1zm-3 1c.55228 0 1-.4477 1-1H6z", fill: "currentColor" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-library-16.js
  var IconLibrary16;
  var init_icon_library_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-library-16.js"() {
      init_preact_module();
      init_create_icon();
      IconLibrary16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M7.41091 5.14527c-.94722-.84197-2.3746-.84197-3.32182 0L4 5.22446v5.75774c1.08026-.6245 2.41974-.6245 3.5 0V5.22446zM8.5 5.22446v5.75774c1.08026-.6245 2.4197-.6245 3.5 0V5.22446l-.0891-.07919c-.9472-.84197-2.37459-.84197-3.32181 0zM8 4.33282c-1.32551-1.1133-3.27403-1.09162-4.57527.06504l-.25691.22836A.5.5 0 0 0 3 4.99993v6.99997c0 .1969.11556.3755.29517.4561a.4999.4999 0 0 0 .53701-.0824l.25691-.2283c.94722-.842 2.3746-.842 3.32182 0l.25691.2283c.18944.1684.47492.1684.66436 0l.25691-.2283c.94722-.842 2.37461-.842 3.32181 0l.2569.2283c.1472.1308.3574.1631.537.0824A.5.5 0 0 0 13 11.9999V4.99993a.5002.5002 0 0 0-.1678-.37371l-.2569-.22836C11.274 3.2412 9.32551 3.21952 8 4.33282", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-link-16.js
  var IconLink16;
  var init_icon_link_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-link-16.js"() {
      init_preact_module();
      init_create_icon();
      IconLink16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M10.4746 8.35362c-.1952.19526-.1952.51185 0 .70711.1953.19526.5119.19526.7072 0l1.0606-1.06066c1.1716-1.17157 1.1716-3.07107 0-4.24264s-3.07105-1.17157-4.24263 0L6.93911 4.81809c-.19526.19526-.19526.51184 0 .70711.19527.19526.51185.19526.70711 0l1.06066-1.06066c.78105-.78105 2.04742-.78105 2.82842 0 .7811.78104.7811 2.04737 0 2.82842zm-.70691-2.12133c.19526.19526.19526.51184 0 .7071L6.93926 9.76782c-.19526.19526-.51184.19526-.7071 0s-.19527-.51185 0-.70711l2.82842-2.82842c.19527-.19527.51185-.19527.70711 0m-4.24267.70703c.19526.19526.19526.51184 0 .7071L4.46436 8.70708c-.78105.78105-.78105 2.04742 0 2.82842.78104.7811 2.04737.7811 2.82842 0l1.06066-1.0607c.19527-.1952.51185-.1952.70711 0 .19526.1953.19526.5119 0 .7072l-1.06066 1.0606c-1.17157 1.1716-3.07107 1.1716-4.24264 0s-1.17157-3.07105 0-4.24262l1.06066-1.06066c.19526-.19527.51184-.19527.70711 0", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-plus-16.js
  var IconPlus16;
  var init_icon_plus_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-plus-16.js"() {
      init_preact_module();
      init_create_icon();
      IconPlus16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M8.5 2.5c0-.27614-.22386-.5-.5-.5s-.5.22386-.5.5v5h-5c-.27614 0-.5.22386-.5.5s.22386.5.5.5h5v5c0 .2761.22386.5.5.5s.5-.2239.5-.5v-5h5c.2761 0 .5-.22386.5-.5s-.2239-.5-.5-.5h-5z", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-prototype-16.js
  var IconPrototype16;
  var init_icon_prototype_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-prototype-16.js"() {
      init_preact_module();
      init_create_icon();
      IconPrototype16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M12.257 9.31185 6.49892 12.7667C5.39915 13.4266 4 12.6344 4 11.3519V4.64791c0-1.28254 1.39915-2.07472 2.49892-1.41486L12.257 6.68792c.9905.59426.9905 2.02967 0 2.62393m-.5145-.85749c.3431-.20586.3431-.70309 0-.90895L5.98442 4.09054C5.55118 3.83059 5 4.14267 5 4.64791v6.70399c0 .5052.55118.8173.98442.5573z", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-shape-text-16.js
  var IconShapeText16;
  var init_icon_shape_text_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-shape-text-16.js"() {
      init_preact_module();
      init_create_icon();
      IconShapeText16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M4.5 4h7c.2761 0 .5.22386.5.5v7c0 .2761-.2239.5-.5.5h-7c-.27614 0-.5-.2239-.5-.5v-7c0-.27614.22386-.5.5-.5M3 4.5C3 3.67157 3.67157 3 4.5 3h7c.8284 0 1.5.67157 1.5 1.5v7c0 .8284-.6716 1.5-1.5 1.5h-7c-.82843 0-1.5-.6716-1.5-1.5zm3 1c-.27614 0-.5.22386-.5.5v.5c0 .27614.22386.5.5.5s.5-.22386.5-.5h1v3c-.27614 0-.5.22386-.5.5 0 .2761.22386.5.5.5h1c.27614 0 .5-.2239.5-.5 0-.27614-.22386-.5-.5-.5v-3h1c0 .27614.22386.5.5.5.2761 0 .5-.22386.5-.5V6c0-.27614-.2239-.5-.5-.5H6", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-text-16.js
  var IconText16;
  var init_icon_text_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-text-16.js"() {
      init_preact_module();
      init_create_icon();
      IconText16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M3 3.5c0-.27614.22386-.5.5-.5h9c.2761 0 .5.22386.5.5V5c0 .27614-.2239.5-.5.5S12 5.27614 12 5V4H8.5v8h1c.27614 0 .5.2239.5.5s-.22386.5-.5.5h-3c-.27614 0-.5-.2239-.5-.5s.22386-.5.5-.5h1V4H4v1c0 .27614-.22386.5-.5.5S3 5.27614 3 5z", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-variable-16.js
  var IconVariable16;
  var init_icon_variable_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-variable-16.js"() {
      init_preact_module();
      init_create_icon();
      IconVariable16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M12.5 4.2534 9 2.23267c-.6188-.35726-1.3812-.35726-2 0L3.5 4.2534c-.6188.35726-1 1.01752-1 1.73205v4.04145c0 .7145.3812 1.3748 1 1.732L7 13.7797c.6188.3572 1.3812.3572 2 0l3.5-2.0208c.6188-.3572 1-1.0175 1-1.732V5.98545c0-.71453-.3812-1.37479-1-1.73205m-5-1.1547a1 1 0 0 1 1 0L12 5.11942a1 1 0 0 1 .5.86603v4.04145c0 .3573-.1906.6874-.5.866l-3.5 2.0207a.9997.9997 0 0 1-1 0L4 10.8929a.9999.9999 0 0 1-.5-.866V5.98545a1 1 0 0 1 .5-.86603zM9 7.00002H7v2h2z", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-variable-color-16.js
  var IconVariableColor16;
  var init_icon_variable_color_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-variable-color-16.js"() {
      init_preact_module();
      init_create_icon();
      IconVariableColor16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M8 2c3.3137 0 6 2.68629 6 6 0 1.26533-1.1052 2-2.1067 2H10.5c-.2761 0-.5.2239-.5.5v1.3933C10 12.8948 9.26533 14 8 14c-3.31371 0-6-2.6863-6-6 0-3.31371 2.68629-6 6-6m5 6c0 .58572-.521 1-1.1067 1H10.5C9.67157 9 9 9.67157 9 10.5v1.3933C9 12.479 8.58572 13 8 13c-2.76142 0-5-2.2386-5-5 0-2.76142 2.23858-5 5-5 2.7614 0 5 2.23858 5 5M9 5c0 .55228-.44772 1-1 1s-1-.44772-1-1 .44772-1 1-1 1 .44772 1 1m.73205 2c.27615.47829.88775.64217 1.36605.36603.4783-.27615.6421-.88774.366-1.36603s-.8877-.64217-1.366-.36603c-.47832.27615-.64219.88774-.36605 1.36603m-3.73188 3.3662c-.4783.2761-1.08989.1123-1.36603-.366-.27614-.47833-.11227-1.08992.36603-1.36606.47829-.27614 1.08988-.11227 1.36602.36603.27614.47829.11227 1.08983-.36602 1.36603m-.50011-2.86626c.55228 0 1-.44771 1-1s-.44772-1-1-1-1 .44772-1 1 .44771 1 1 1", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-24/icon-interaction-click-small-24.js
  var IconInteractionClickSmall24;
  var init_icon_interaction_click_small_24 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-24/icon-interaction-click-small-24.js"() {
      init_preact_module();
      init_create_icon();
      IconInteractionClickSmall24 = createIcon(_(
        "svg",
        { fill: "none", height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M9.32133 5.53282c.25512-.10568.54761.01548.65328.2706l.77649 1.87472c.1018.24576-.0389.52436-.2846.62643-.2457.10208-.53736.0022-.63918-.24362L9.05073 6.1861c-.10567-.25512.01548-.5476.2706-.65328M8.06105 9.82721l-1.87487-.77659c-.25512-.10568-.54761.01547-.65328.2706-.10568.25512.01547.5476.2706.65328l1.87473.7765c.24577.1018.52437-.0389.62643-.2846.10209-.2457.00221-.53736-.24361-.63919M7.67821 13.249l-1.87479.7765c-.25512.1057-.37628.3982-.2706.6533s.39816.3763.65328.2706l1.87493-.7766c.24582-.1018.34569-.3935.24361-.6392-.10206-.2457-.38066-.3864-.62643-.2846m2.14898 2.6901-.77658 1.8748c-.10568.2551.01547.5476.2706.6533.25512.1057.5476-.0155.65328-.2706l.77651-1.8747c.1018-.2458-.0389-.5244-.2846-.6264-.2457-.1021-.53738-.0023-.63921.2436M16.322 10.751l1.8745-.77647c.2552-.10567.3763-.39816.2706-.65328-.1056-.25512-.3981-.37627-.6532-.2706l-1.8747.77652c-.2458.10182-.3457.39353-.2436.63923.102.2456.3806.3864.6264.2846m-2.1492-2.69009.7766-1.87476c.1056-.25512-.0155-.5476-.2706-.65328-.2552-.10567-.5476.01548-.6533.2706l-.7765 1.87462c-.1018.24577.0389.52438.2846.62644s.5374.00219.6392-.24362m-1.8215 3.00279c-.3672-.1377-.7809-.048-1.0582.2293-.2773.2772-.3669.691-.2292 1.0582l2.25 6c.1537.4099.5561.6721.9932.6472.437-.0248.8071-.3311.9132-.7558l.6045-2.4179 2.4179-.6045c.4247-.1062.731-.4762.7559-.9133.0249-.437-.2374-.8395-.6473-.9932zm3.9401 3.6136-1.2912.3228-.3228 1.2912-.4272 1.7088-.6185-1.6493-1.1655-3.108-.466-1.2427 1.2428.466 3.1079 1.1655 1.6493.6185z", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-24/icon-time-small-24.js
  var IconTimeSmall24;
  var init_icon_time_small_24 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-24/icon-time-small-24.js"() {
      init_preact_module();
      init_create_icon();
      IconTimeSmall24 = createIcon(_(
        "svg",
        { fill: "none", height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M18 12c0 3.3137-2.6863 6-6 6-3.31371 0-6-2.6863-6-6 0-3.31371 2.68629-6 6-6 3.3137 0 6 2.68629 6 6m1 0c0 3.866-3.134 7-7 7s-7-3.134-7-7 3.134-7 7-7 7 3.134 7 7m-6.5-3.5c0-.27614-.2239-.5-.5-.5s-.5.22386-.5.5V12c0 .1326.0527.2598.1465.3535l2 2c.1952.1953.5118.1953.707 0 .1953-.1952.1953-.5118 0-.707L12.5 11.7929z", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/697a4a5b-8bc8-4891-8d14-d59af75c5310/container.module.js
  var container_module_default;
  var init_container_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/697a4a5b-8bc8-4891-8d14-d59af75c5310/container.module.js"() {
      if (document.getElementById("b49e1406f9") === null) {
        const element = document.createElement("style");
        element.id = "b49e1406f9";
        element.textContent = `._extraSmall_1oe77_1 {
  padding: 0 var(--space-extra-small);
}
._small_1oe77_4 {
  padding: 0 var(--space-small);
}
._medium_1oe77_7 {
  padding: 0 var(--space-medium);
}
._large_1oe77_10 {
  padding: 0 var(--space-large);
}
._extraLarge_1oe77_13 {
  padding: 0 var(--space-extra-large);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvbGF5b3V0L2NvbnRhaW5lci9jb250YWluZXIubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLG1DQUFtQztBQUNyQztBQUNBO0VBQ0UsNkJBQTZCO0FBQy9CO0FBQ0E7RUFDRSw4QkFBOEI7QUFDaEM7QUFDQTtFQUNFLDZCQUE2QjtBQUMvQjtBQUNBO0VBQ0UsbUNBQW1DO0FBQ3JDIiwiZmlsZSI6Im5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvbGF5b3V0L2NvbnRhaW5lci9jb250YWluZXIubW9kdWxlLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5leHRyYVNtYWxsIHtcbiAgcGFkZGluZzogMCB2YXIoLS1zcGFjZS1leHRyYS1zbWFsbCk7XG59XG4uc21hbGwge1xuICBwYWRkaW5nOiAwIHZhcigtLXNwYWNlLXNtYWxsKTtcbn1cbi5tZWRpdW0ge1xuICBwYWRkaW5nOiAwIHZhcigtLXNwYWNlLW1lZGl1bSk7XG59XG4ubGFyZ2Uge1xuICBwYWRkaW5nOiAwIHZhcigtLXNwYWNlLWxhcmdlKTtcbn1cbi5leHRyYUxhcmdlIHtcbiAgcGFkZGluZzogMCB2YXIoLS1zcGFjZS1leHRyYS1sYXJnZSk7XG59XG4iXX0= */`;
        document.head.append(element);
      }
      container_module_default = { "extraSmall": "_extraSmall_1oe77_1", "small": "_small_1oe77_4", "medium": "_medium_1oe77_7", "large": "_large_1oe77_10", "extraLarge": "_extraLarge_1oe77_13" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/layout/container/container.js
  var Container;
  var init_container = __esm({
    "node_modules/@create-figma-plugin/ui/lib/layout/container/container.js"() {
      init_preact_module();
      init_create_component();
      init_container_module();
      Container = createComponent(function(_a, ref) {
        var _b = _a, { space } = _b, rest = __objRest(_b, ["space"]);
        return _("div", __spreadProps(__spreadValues({}, rest), { ref, class: container_module_default[space] }));
      });
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/c5811da1-1ce2-4fd9-a004-39230847fe9d/vertical-space.module.js
  var vertical_space_module_default;
  var init_vertical_space_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/c5811da1-1ce2-4fd9-a004-39230847fe9d/vertical-space.module.js"() {
      if (document.getElementById("ba0eea5114") === null) {
        const element = document.createElement("style");
        element.id = "ba0eea5114";
        element.textContent = `._extraSmall_zc4n0_1 {
  height: var(--space-extra-small);
}
._small_zc4n0_4 {
  height: var(--space-small);
}
._medium_zc4n0_7 {
  height: var(--space-medium);
}
._large_zc4n0_10 {
  height: var(--space-large);
}
._extraLarge_zc4n0_13 {
  height: var(--space-extra-large);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvbGF5b3V0L3ZlcnRpY2FsLXNwYWNlL3ZlcnRpY2FsLXNwYWNlLm1vZHVsZS5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxnQ0FBZ0M7QUFDbEM7QUFDQTtFQUNFLDBCQUEwQjtBQUM1QjtBQUNBO0VBQ0UsMkJBQTJCO0FBQzdCO0FBQ0E7RUFDRSwwQkFBMEI7QUFDNUI7QUFDQTtFQUNFLGdDQUFnQztBQUNsQyIsImZpbGUiOiJub2RlX21vZHVsZXMvQGNyZWF0ZS1maWdtYS1wbHVnaW4vdWkvbGliL2xheW91dC92ZXJ0aWNhbC1zcGFjZS92ZXJ0aWNhbC1zcGFjZS5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmV4dHJhU21hbGwge1xuICBoZWlnaHQ6IHZhcigtLXNwYWNlLWV4dHJhLXNtYWxsKTtcbn1cbi5zbWFsbCB7XG4gIGhlaWdodDogdmFyKC0tc3BhY2Utc21hbGwpO1xufVxuLm1lZGl1bSB7XG4gIGhlaWdodDogdmFyKC0tc3BhY2UtbWVkaXVtKTtcbn1cbi5sYXJnZSB7XG4gIGhlaWdodDogdmFyKC0tc3BhY2UtbGFyZ2UpO1xufVxuLmV4dHJhTGFyZ2Uge1xuICBoZWlnaHQ6IHZhcigtLXNwYWNlLWV4dHJhLWxhcmdlKTtcbn1cbiJdfQ== */`;
        document.head.append(element);
      }
      vertical_space_module_default = { "extraSmall": "_extraSmall_zc4n0_1", "small": "_small_zc4n0_4", "medium": "_medium_zc4n0_7", "large": "_large_zc4n0_10", "extraLarge": "_extraLarge_zc4n0_13" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/layout/vertical-space/vertical-space.js
  var VerticalSpace;
  var init_vertical_space = __esm({
    "node_modules/@create-figma-plugin/ui/lib/layout/vertical-space/vertical-space.js"() {
      init_preact_module();
      init_create_component();
      init_vertical_space_module();
      VerticalSpace = createComponent(function(_a, ref) {
        var _b = _a, { space } = _b, rest = __objRest(_b, ["space"]);
        return _("div", __spreadProps(__spreadValues({}, rest), { ref, class: vertical_space_module_default[space] }));
      });
    }
  });

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/cf2ff079-14e6-4855-ab39-fc91eab79c91/base.js
  var init_base = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/cf2ff079-14e6-4855-ab39-fc91eab79c91/base.js"() {
      if (document.getElementById("0597dd81e7") === null) {
        const element = document.createElement("style");
        element.id = "0597dd81e7";
        element.textContent = `:root {
  --border-width-1: 1px;
  --border-width-4: 4px;
  --border-radius-2: 2px;
  --border-radius-4: 4px;
  --border-radius-6: 6px;
  --border-radius-12: 12px;
  --box-shadow: var(--box-shadow-menu);
  --box-shadow-menu:
    0 5px 17px rgba(0, 0, 0, 0.2), 0 2px 7px rgba(0, 0, 0, 0.15),
    inset 0 0 0 0.5px #000000, 0 0 0 0.5px rgba(0, 0, 0, 0.1);
  --box-shadow-modal:
    0 2px 14px rgba(0, 0, 0, 0.15), 0 0 0 0.5px rgba(0, 0, 0, 0.2);
  --box-shadow-range-slider:
    0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 3px 8px 0 rgba(0, 0, 0, 0.1),
    0 0 0.5px 0 rgba(0, 0, 0, 0.18), inset 0 0 0 0.5px rgba(0, 0, 0, 0.1);
  --color-bg-menu: #1e1e1e;
  --color-bg-overlay: rgba(0, 0, 0, 0.5);
  --font-family: 'Inter', 'Helvetica', sans-serif;
  --font-family-code:
    SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  --font-size-11: 11px;
  --font-size-12: 12px;
  --font-weight-regular: 400;
  --font-weight-bold: 600;
  --line-height-16: 16px;
  --opacity-30: 0.3;
  --space-extra-small: 8px;
  --space-small: 12px;
  --space-medium: 16px;
  --space-large: 20px;
  --space-extra-large: 24px;
  --space-0: 0;
  --space-4: 4px;
  --space-6: 6px;
  --space-8: 8px;
  --space-12: 12px;
  --space-16: 16px;
  --space-20: 20px;
  --space-24: 24px;
  --space-28: 28px;
  --space-32: 32px;
  --transition-duration-100: 0.1s;
  --transition-duration-300: 0.3s;
  --z-index-1: 1;
  --z-index-2: 2;
}

.figma-dark {
  color-scheme: dark;
}

* {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: currentColor;
}

body {
  margin: 0;
  background-color: var(--figma-color-bg);
  color: var(--figma-color-text);
  font-family: var(--font-family);
  font-size: var(--font-size-11);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-16);
}

div,
span {
  cursor: default;
  user-select: none;
}

h1,
h2,
h3 {
  margin: 0;
  font-weight: inherit;
}

button {
  padding: 0;
  border: 0;
  -webkit-appearance: none;
  background-color: transparent;
  font: inherit;
  outline: 0;
}

hr {
  border: 0;
  margin: 0;
}

label {
  display: block;
}

input,
textarea {
  padding: 0;
  border: 0;
  margin: 0;
  -webkit-appearance: none;
  cursor: default;
  font: inherit;
  outline: 0;
}

svg {
  display: block;
}

::selection {
  background-color: var(--figma-color-bg-onselected);
}
`;
        document.head.prepend(element);
      }
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/utilities/render.js
  function render(Plugin) {
    return function(rootNode2, props) {
      G(_(Plugin, __spreadValues({}, props)), rootNode2);
    };
  }
  var init_render = __esm({
    "node_modules/@create-figma-plugin/ui/lib/utilities/render.js"() {
      init_base();
      init_preact_module();
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/index.js
  var init_lib2 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/index.js"() {
      init_button();
      init_checkbox();
      init_disclosure();
      init_divider();
      init_dropdown();
      init_file_upload_button();
      init_icon_button();
      init_loading_indicator();
      init_radio_buttons();
      init_segmented_control();
      init_tabs();
      init_text();
      init_textbox();
      init_textbox_color();
      init_textbox_numeric();
      init_icon_adjust_16();
      init_icon_check_16();
      init_icon_chevron_down_16();
      init_icon_chevron_right_16();
      init_icon_close_16();
      init_icon_folder_16();
      init_icon_home_16();
      init_icon_library_16();
      init_icon_link_16();
      init_icon_plus_16();
      init_icon_prototype_16();
      init_icon_shape_text_16();
      init_icon_text_16();
      init_icon_variable_16();
      init_icon_variable_color_16();
      init_icon_interaction_click_small_24();
      init_icon_time_small_24();
      init_container();
      init_inline();
      init_stack();
      init_vertical_space();
      init_render();
    }
  });

  // src/app/messages.ts
  var UI_TO_MAIN, MAIN_TO_UI;
  var init_messages = __esm({
    "src/app/messages.ts"() {
      "use strict";
      UI_TO_MAIN = {
        BOOT: "BOOT",
        SET_ACTIVE_TOOL: "SET_ACTIVE_TOOL",
        INSPECT_SELECTION_FOR_VARIABLE_CHAINS: "INSPECT_SELECTION_FOR_VARIABLE_CHAINS",
        COLOR_CHAIN_REPLACE_MAIN_COLOR: "COLOR_CHAIN_REPLACE_MAIN_COLOR",
        COLOR_CHAIN_NOTIFY: "COLOR_CHAIN_NOTIFY",
        PRINT_COLOR_USAGES_LOAD_SETTINGS: "PRINT_COLOR_USAGES_LOAD_SETTINGS",
        PRINT_COLOR_USAGES_SAVE_SETTINGS: "PRINT_COLOR_USAGES_SAVE_SETTINGS",
        PRINT_COLOR_USAGES_PRINT: "PRINT_COLOR_USAGES_PRINT",
        PRINT_COLOR_USAGES_PREVIEW_UPDATE: "PRINT_COLOR_USAGES_PREVIEW_UPDATE",
        PRINT_COLOR_USAGES_UPDATE: "PRINT_COLOR_USAGES_UPDATE",
        PRINT_COLOR_USAGES_FOCUS_NODE: "PRINT_COLOR_USAGES_FOCUS_NODE",
        PRINT_COLOR_USAGES_RESET_LAYER_NAMES: "PRINT_COLOR_USAGES_RESET_LAYER_NAMES",
        MOCKUP_MARKUP_LOAD_STATE: "MOCKUP_MARKUP_LOAD_STATE",
        MOCKUP_MARKUP_APPLY: "MOCKUP_MARKUP_APPLY",
        MOCKUP_MARKUP_CREATE_TEXT: "MOCKUP_MARKUP_CREATE_TEXT",
        MOCKUP_MARKUP_GET_COLOR_PREVIEWS: "MOCKUP_MARKUP_GET_COLOR_PREVIEWS",
        // Variables Batch Rename
        BATCH_RENAME_EXPORT_NAME_SET: "BATCH_RENAME_EXPORT_NAME_SET",
        BATCH_RENAME_PREVIEW_IMPORT: "BATCH_RENAME_PREVIEW_IMPORT",
        BATCH_RENAME_APPLY_IMPORT: "BATCH_RENAME_APPLY_IMPORT",
        // Variables Export Import
        EXPORT_IMPORT_EXPORT_SNAPSHOT: "EXPORT_IMPORT_EXPORT_SNAPSHOT",
        EXPORT_IMPORT_PREVIEW_SNAPSHOT: "EXPORT_IMPORT_PREVIEW_SNAPSHOT",
        EXPORT_IMPORT_APPLY_SNAPSHOT: "EXPORT_IMPORT_APPLY_SNAPSHOT",
        // Variables Create Linked Colors
        LINKED_COLORS_CREATE: "LINKED_COLORS_CREATE",
        LINKED_COLORS_APPLY_EXISTING: "LINKED_COLORS_APPLY_EXISTING",
        LINKED_COLORS_RENAME: "LINKED_COLORS_RENAME",
        // Variables Replace Usages
        REPLACE_USAGES_PREVIEW: "REPLACE_USAGES_PREVIEW",
        REPLACE_USAGES_APPLY: "REPLACE_USAGES_APPLY",
        // Library Swap
        LIBRARY_SWAP_ANALYZE: "LIBRARY_SWAP_ANALYZE",
        LIBRARY_SWAP_PREVIEW: "LIBRARY_SWAP_PREVIEW",
        LIBRARY_SWAP_APPLY: "LIBRARY_SWAP_APPLY",
        LIBRARY_SWAP_CLEAR_PREVIEWS: "LIBRARY_SWAP_CLEAR_PREVIEWS",
        LIBRARY_SWAP_SET_CUSTOM_MAPPING: "LIBRARY_SWAP_SET_CUSTOM_MAPPING",
        LIBRARY_SWAP_FOCUS_NODE: "LIBRARY_SWAP_FOCUS_NODE",
        LIBRARY_SWAP_CAPTURE_OLD: "LIBRARY_SWAP_CAPTURE_OLD",
        LIBRARY_SWAP_CAPTURE_NEW: "LIBRARY_SWAP_CAPTURE_NEW",
        LIBRARY_SWAP_REMOVE_PAIR: "LIBRARY_SWAP_REMOVE_PAIR",
        LIBRARY_SWAP_SCAN_LEGACY_RESET: "LIBRARY_SWAP_SCAN_LEGACY_RESET",
        // Find Color Match
        FIND_COLOR_MATCH_SCAN: "FIND_COLOR_MATCH_SCAN",
        FIND_COLOR_MATCH_SET_COLLECTION: "FIND_COLOR_MATCH_SET_COLLECTION",
        FIND_COLOR_MATCH_SET_MODE: "FIND_COLOR_MATCH_SET_MODE",
        FIND_COLOR_MATCH_APPLY: "FIND_COLOR_MATCH_APPLY",
        FIND_COLOR_MATCH_FOCUS_NODE: "FIND_COLOR_MATCH_FOCUS_NODE",
        FIND_COLOR_MATCH_HEX_LOOKUP: "FIND_COLOR_MATCH_HEX_LOOKUP",
        FIND_COLOR_MATCH_SET_GROUP: "FIND_COLOR_MATCH_SET_GROUP",
        // Automations
        AUTOMATIONS_LOAD: "AUTOMATIONS_LOAD",
        AUTOMATIONS_GET: "AUTOMATIONS_GET",
        AUTOMATIONS_SAVE: "AUTOMATIONS_SAVE",
        AUTOMATIONS_DELETE: "AUTOMATIONS_DELETE",
        AUTOMATIONS_RUN: "AUTOMATIONS_RUN",
        AUTOMATIONS_STOP: "AUTOMATIONS_STOP"
      };
      MAIN_TO_UI = {
        BOOTSTRAPPED: "BOOTSTRAPPED",
        VARIABLE_CHAINS_RESULT: "VARIABLE_CHAINS_RESULT",
        VARIABLE_CHAINS_RESULT_V2: "VARIABLE_CHAINS_RESULT_V2",
        SELECTION_EMPTY: "SELECTION_EMPTY",
        PRINT_COLOR_USAGES_SETTINGS: "PRINT_COLOR_USAGES_SETTINGS",
        PRINT_COLOR_USAGES_SELECTION: "PRINT_COLOR_USAGES_SELECTION",
        PRINT_COLOR_USAGES_STATUS: "PRINT_COLOR_USAGES_STATUS",
        PRINT_COLOR_USAGES_UPDATE_PREVIEW: "PRINT_COLOR_USAGES_UPDATE_PREVIEW",
        PRINT_COLOR_USAGES_PRINT_PREVIEW: "PRINT_COLOR_USAGES_PRINT_PREVIEW",
        MOCKUP_MARKUP_STATE: "MOCKUP_MARKUP_STATE",
        MOCKUP_MARKUP_STATUS: "MOCKUP_MARKUP_STATUS",
        MOCKUP_MARKUP_COLOR_PREVIEWS: "MOCKUP_MARKUP_COLOR_PREVIEWS",
        ERROR: "ERROR",
        // Variables Batch Rename
        BATCH_RENAME_COLLECTIONS_LIST: "BATCH_RENAME_COLLECTIONS_LIST",
        BATCH_RENAME_NAME_SET_READY: "BATCH_RENAME_NAME_SET_READY",
        BATCH_RENAME_IMPORT_PREVIEW: "BATCH_RENAME_IMPORT_PREVIEW",
        BATCH_RENAME_APPLY_PROGRESS: "BATCH_RENAME_APPLY_PROGRESS",
        BATCH_RENAME_APPLY_RESULT: "BATCH_RENAME_APPLY_RESULT",
        // Variables Export Import
        EXPORT_IMPORT_COLLECTIONS_LIST: "EXPORT_IMPORT_COLLECTIONS_LIST",
        EXPORT_IMPORT_SNAPSHOT_READY: "EXPORT_IMPORT_SNAPSHOT_READY",
        EXPORT_IMPORT_PREVIEW: "EXPORT_IMPORT_PREVIEW",
        EXPORT_IMPORT_APPLY_RESULT: "EXPORT_IMPORT_APPLY_RESULT",
        // Variables Create Linked Colors
        LINKED_COLORS_SELECTION: "LINKED_COLORS_SELECTION",
        LINKED_COLORS_CREATE_SUCCESS: "LINKED_COLORS_CREATE_SUCCESS",
        LINKED_COLORS_APPLY_SUCCESS: "LINKED_COLORS_APPLY_SUCCESS",
        LINKED_COLORS_RENAME_SUCCESS: "LINKED_COLORS_RENAME_SUCCESS",
        LINKED_COLORS_COLLECTIONS_LIST: "LINKED_COLORS_COLLECTIONS_LIST",
        // Variables Replace Usages
        REPLACE_USAGES_SELECTION: "REPLACE_USAGES_SELECTION",
        REPLACE_USAGES_PREVIEW: "REPLACE_USAGES_PREVIEW",
        REPLACE_USAGES_APPLY_PROGRESS: "REPLACE_USAGES_APPLY_PROGRESS",
        REPLACE_USAGES_APPLY_RESULT: "REPLACE_USAGES_APPLY_RESULT",
        // Library Swap
        LIBRARY_SWAP_SELECTION: "LIBRARY_SWAP_SELECTION",
        LIBRARY_SWAP_ANALYZE_RESULT: "LIBRARY_SWAP_ANALYZE_RESULT",
        LIBRARY_SWAP_PROGRESS: "LIBRARY_SWAP_PROGRESS",
        LIBRARY_SWAP_APPLY_RESULT: "LIBRARY_SWAP_APPLY_RESULT",
        LIBRARY_SWAP_PREVIEW_RESULT: "LIBRARY_SWAP_PREVIEW_RESULT",
        LIBRARY_SWAP_CAPTURE_RESULT: "LIBRARY_SWAP_CAPTURE_RESULT",
        LIBRARY_SWAP_PAIRS_UPDATED: "LIBRARY_SWAP_PAIRS_UPDATED",
        LIBRARY_SWAP_SCAN_LEGACY_RESULT: "LIBRARY_SWAP_SCAN_LEGACY_RESULT",
        LIBRARY_SWAP_SCAN_LEGACY_RESET_RESULT: "LIBRARY_SWAP_SCAN_LEGACY_RESET_RESULT",
        // Find Color Match
        FIND_COLOR_MATCH_COLLECTIONS: "FIND_COLOR_MATCH_COLLECTIONS",
        FIND_COLOR_MATCH_RESULT: "FIND_COLOR_MATCH_RESULT",
        FIND_COLOR_MATCH_PROGRESS: "FIND_COLOR_MATCH_PROGRESS",
        FIND_COLOR_MATCH_APPLY_RESULT: "FIND_COLOR_MATCH_APPLY_RESULT",
        FIND_COLOR_MATCH_HEX_RESULT: "FIND_COLOR_MATCH_HEX_RESULT",
        FIND_COLOR_MATCH_GROUPS: "FIND_COLOR_MATCH_GROUPS",
        // Library cache
        LIBRARY_CACHE_STATUS: "LIBRARY_CACHE_STATUS",
        // Automations
        AUTOMATIONS_LIST: "AUTOMATIONS_LIST",
        AUTOMATIONS_FULL: "AUTOMATIONS_FULL",
        AUTOMATIONS_SAVED: "AUTOMATIONS_SAVED",
        AUTOMATIONS_RUN_PROGRESS: "AUTOMATIONS_RUN_PROGRESS",
        AUTOMATIONS_RUN_RESULT: "AUTOMATIONS_RUN_RESULT"
      };
    }
  });

  // src/app/components/Page.tsx
  function Page(props) {
    return /* @__PURE__ */ _(
      "div",
      {
        style: {
          // In some builds the iframe/body may not set an explicit height,
          // so `height: 100%` can collapse to 0 and render an "empty" UI.
          // `100vh` is stable inside the plugin iframe.
          height: "100vh",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column"
        }
      },
      props.children
    );
  }
  var init_Page = __esm({
    "src/app/components/Page.tsx"() {
      "use strict";
      init_preact_module();
    }
  });

  // custom-icons/generated.tsx
  function IconChevronRight162(props) {
    var _a, _b;
    const color = (_a = props.color) != null ? _a : "currentColor";
    return /* @__PURE__ */ _("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-label": props.title }, /* @__PURE__ */ _("path", { d: "M6.76776 6.23269C6.5725 6.03743 6.5725 5.71994 6.76776 5.52468C6.96296 5.32976 7.2796 5.32976 7.47479 5.52468L9.9494 8.00027L7.47479 10.4749C7.27953 10.6701 6.96302 10.6701 6.76776 10.4749C6.5725 10.2796 6.5725 9.96311 6.76776 9.76785L8.53534 8.00027L6.76776 6.23269Z", fill: color, fillOpacity: (_b = props.opacity) != null ? _b : 0.9 }));
  }
  function IconTarget16(props) {
    var _a, _b;
    const color = (_a = props.color) != null ? _a : "currentColor";
    return /* @__PURE__ */ _("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-label": props.title }, /* @__PURE__ */ _("path", { d: "M8 14.5C7.72386 14.5 7.5 14.2761 7.5 14V12.9756C5.13777 12.7411 3.25894 10.8622 3.02441 8.5H2C1.72386 8.5 1.5 8.27614 1.5 8C1.5 7.72386 1.72386 7.5 2 7.5H3.02441C3.25893 5.1378 5.13782 3.25996 7.5 3.02539V2C7.5 1.72386 7.72386 1.5 8 1.5C8.27614 1.5 8.5 1.72386 8.5 2V3.02539C10.8622 3.25996 12.7411 5.1378 12.9756 7.5H14C14.2761 7.5 14.5 7.72386 14.5 8C14.5 8.27614 14.2761 8.5 14 8.5H12.9756C12.7411 10.8622 10.8622 12.7411 8.5 12.9756V14C8.5 14.2761 8.27614 14.5 8 14.5ZM7.5 11C7.5 10.7239 7.72386 10.5 8 10.5C8.27614 10.5 8.5 10.7239 8.5 11V11.9688C10.3093 11.7431 11.7421 10.3093 11.9678 8.5H11C10.7239 8.5 10.5 8.27614 10.5 8C10.5 7.72386 10.7239 7.5 11 7.5H11.9678C11.7421 5.69077 10.3092 4.25791 8.5 4.03223V5C8.5 5.27614 8.27614 5.5 8 5.5C7.72386 5.5 7.5 5.27614 7.5 5V4.03223C5.69077 4.25791 4.25791 5.69077 4.03223 7.5H5C5.27614 7.5 5.5 7.72386 5.5 8C5.5 8.27614 5.27614 8.5 5 8.5H4.03223C4.25791 10.3093 5.69071 11.7431 7.5 11.9688V11Z", fill: color, fillOpacity: (_b = props.opacity) != null ? _b : 0.9 }));
  }
  var init_generated = __esm({
    "custom-icons/generated.tsx"() {
      "use strict";
      init_preact_module();
    }
  });

  // src/app/components/AppIcons.tsx
  var init_AppIcons = __esm({
    "src/app/components/AppIcons.tsx"() {
      "use strict";
      init_generated();
    }
  });

  // src/app/components/ToolCard.tsx
  function ToolCard(props) {
    const [hovered, setHovered] = d2(false);
    const [focused, setFocused] = d2(false);
    return /* @__PURE__ */ _(
      "button",
      {
        type: "button",
        onClick: props.onClick,
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
        style: {
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 8px 4px 4px",
          borderRadius: 6,
          background: hovered ? "var(--figma-color-bg-hover)" : "var(--figma-color-bg)",
          cursor: "pointer",
          textAlign: "left",
          outline: focused ? "2px solid var(--figma-color-border-selected)" : "none",
          outlineOffset: 1
        }
      },
      /* @__PURE__ */ _(
        "div",
        {
          style: {
            width: 32,
            height: 32,
            borderRadius: 6,
            background: "color-mix(in srgb, var(--figma-color-bg-tertiary) 80%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: hovered ? "var(--figma-color-icon-hover)" : "var(--figma-color-icon)",
            flex: "0 0 auto"
          }
        },
        /* @__PURE__ */ _("div", { style: { width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" } }, props.icon)
      ),
      /* @__PURE__ */ _("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ _(
        "div",
        {
          style: {
            fontSize: 11,
            color: "var(--figma-color-text)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }
        },
        props.title
      ), /* @__PURE__ */ _(
        "div",
        {
          style: {
            marginTop: 1,
            fontSize: 10,
            color: "var(--figma-color-text-secondary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }
        },
        props.description
      )),
      /* @__PURE__ */ _(
        "div",
        {
          style: {
            width: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: hovered ? "var(--figma-color-icon-tertiary-hover)" : "var(--figma-color-icon-tertiary)",
            flex: "0 0 auto"
          },
          "aria-hidden": "true"
        },
        /* @__PURE__ */ _(IconChevronRight162, null)
      )
    );
  }
  var init_ToolCard = __esm({
    "src/app/components/ToolCard.tsx"() {
      "use strict";
      init_AppIcons();
      init_preact_module();
      init_hooks_module();
    }
  });

  // src/app/views/home/HomeView.tsx
  function HomeView(props) {
    return /* @__PURE__ */ _(Page, null, /* @__PURE__ */ _(Container, { space: "small" }, /* @__PURE__ */ _(VerticalSpace, { space: "large" }), /* @__PURE__ */ _(Text, { style: sectionTitleStyle }, "General"), /* @__PURE__ */ _(VerticalSpace, { space: "small" }), /* @__PURE__ */ _(Stack, { space: "extraSmall" }, /* @__PURE__ */ _(
      ToolCard,
      {
        title: "Mockup Markup Quick Apply",
        description: "Apply text styles and colors",
        icon: /* @__PURE__ */ _(IconShapeText16, null),
        onClick: () => props.goTo("mockup-markup-tool")
      }
    ), /* @__PURE__ */ _(
      ToolCard,
      {
        title: "View Colors Chain",
        description: "Inspect selection to see full variable alias chains",
        icon: /* @__PURE__ */ _(IconVariableColor16, null),
        onClick: () => props.goTo("color-chain-tool")
      }
    ), /* @__PURE__ */ _(
      ToolCard,
      {
        title: "Find Color Match in Islands",
        description: "Find the closest variable for unbound colors",
        icon: /* @__PURE__ */ _(IconTarget16, null),
        onClick: () => props.goTo("find-color-match-tool")
      }
    ), /* @__PURE__ */ _(
      ToolCard,
      {
        title: "Library Swap",
        description: "Swap component instances from old libraries to new ones",
        icon: /* @__PURE__ */ _(IconLibrary16, null),
        onClick: () => props.goTo("library-swap-tool")
      }
    ), /* @__PURE__ */ _(
      ToolCard,
      {
        title: "Automations",
        description: "Create and run sequential automation workflows",
        icon: /* @__PURE__ */ _(IconPrototype16, null),
        onClick: () => props.goTo("automations-tool")
      }
    )), /* @__PURE__ */ _(VerticalSpace, { space: "large" }), /* @__PURE__ */ _(Text, { style: sectionTitleStyle }, "Variables Management"), /* @__PURE__ */ _(VerticalSpace, { space: "small" }), /* @__PURE__ */ _(Stack, { space: "extraSmall" }, /* @__PURE__ */ _(
      ToolCard,
      {
        title: "Print Color Usages",
        description: "Print unique colors as text labels near selection",
        icon: /* @__PURE__ */ _(IconText16, null),
        onClick: () => props.goTo("print-color-usages-tool")
      }
    ), /* @__PURE__ */ _(
      ToolCard,
      {
        title: "Export / Import",
        description: "Export variable collections to JSON, import from backup",
        icon: /* @__PURE__ */ _(IconFolder16, null),
        onClick: () => props.goTo("variables-export-import-tool")
      }
    ), /* @__PURE__ */ _(
      ToolCard,
      {
        title: "Rename via JSON",
        description: "Rename multiple variables using a JSON file",
        icon: /* @__PURE__ */ _(IconVariable16, null),
        onClick: () => props.goTo("variables-batch-rename-tool")
      }
    ), /* @__PURE__ */ _(
      ToolCard,
      {
        title: "Create Linked Colors",
        description: "Create new color variables or rename existing ones",
        icon: /* @__PURE__ */ _(IconLink16, null),
        onClick: () => props.goTo("variables-create-linked-colors-tool")
      }
    ), /* @__PURE__ */ _(
      ToolCard,
      {
        title: "Replace Usages",
        description: "Replace variable bindings in selection with different variables",
        icon: /* @__PURE__ */ _(IconAdjust16, null),
        onClick: () => props.goTo("variables-replace-usages-tool")
      }
    )), /* @__PURE__ */ _(VerticalSpace, { space: "small" })));
  }
  var sectionTitleStyle;
  var init_HomeView = __esm({
    "src/app/views/home/HomeView.tsx"() {
      "use strict";
      init_lib2();
      init_preact_module();
      init_Page();
      init_ToolCard();
      init_generated();
      sectionTitleStyle = { fontWeight: 600 };
    }
  });

  // src/app/components/ColorSwatch.tsx
  function clamp01(n2) {
    return Math.max(0, Math.min(1, n2));
  }
  function isValidHex6(color) {
    if (typeof color !== "string") return false;
    return /^#[0-9A-F]{6}$/i.test(color.trim());
  }
  function formatHexWithOpacity(hex, opacityPercent) {
    if (opacityPercent == null) return hex;
    if (opacityPercent >= 100) return hex;
    return `${hex} ${opacityPercent}%`;
  }
  function ColorSwatch(props) {
    const size = typeof props.size === "number" ? props.size : 14;
    const borderRadius = typeof props.borderRadius === "number" ? props.borderRadius : 3;
    const opacityPercent = typeof props.opacityPercent === "number" ? props.opacityPercent : null;
    const alpha = opacityPercent == null ? 1 : clamp01(opacityPercent / 100);
    const showTransparency = alpha < 1;
    const hex = T2(() => isValidHex6(props.hex) ? props.hex.trim() : null, [props.hex]);
    const title = hex ? formatHexWithOpacity(hex, opacityPercent) : "N/A";
    return /* @__PURE__ */ _(
      "div",
      {
        title,
        style: {
          position: "relative",
          width: size,
          height: size,
          borderRadius,
          overflow: "hidden",
          display: "flex",
          backgroundImage: CHECKERBOARD_BG_IMAGE
        }
      },
      hex ? /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("div", { style: { flex: 1, backgroundColor: hex } }), showTransparency ? /* @__PURE__ */ _("div", { style: { flex: 1, backgroundColor: hex, opacity: alpha } }) : null) : null,
      /* @__PURE__ */ _(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            borderRadius,
            boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--figma-color-border-strong) 10%, transparent)",
            pointerEvents: "none"
          }
        }
      )
    );
  }
  var CHECKERBOARD_BG_IMAGE;
  var init_ColorSwatch = __esm({
    "src/app/components/ColorSwatch.tsx"() {
      "use strict";
      init_preact_module();
      init_hooks_module();
      CHECKERBOARD_BG_IMAGE = // Copied from `textbox-color.module.css` `.chit` background-image.
      "url('data:image/svg+xml;utf8,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200H3V3H0V0Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M3%200H6V3H3V0Z%22%20fill%3D%22white%22/%3E%3Cpath%20d%3D%22M3%203H6V6H3V3Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M0%203H3V6H0V3Z%22%20fill%3D%22white%22/%3E%3C/svg%3E%0A')";
    }
  });

  // src/app/components/ToolBody.tsx
  function ToolBody(props) {
    var _a;
    const resolvedScroll = typeof props.mode !== "undefined" ? props.mode === "content" : (_a = props.scroll) != null ? _a : true;
    return /* @__PURE__ */ _(
      "div",
      {
        style: {
          flex: 1,
          minHeight: 0,
          overflowY: resolvedScroll ? "auto" : "hidden",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column"
        }
      },
      /* @__PURE__ */ _(
        Container,
        {
          space: "medium",
          style: resolvedScroll ? void 0 : {
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column"
          }
        },
        /* @__PURE__ */ _(VerticalSpace, { space: "medium" }),
        props.children,
        /* @__PURE__ */ _(VerticalSpace, { space: "medium" })
      )
    );
  }
  var init_ToolBody = __esm({
    "src/app/components/ToolBody.tsx"() {
      "use strict";
      init_lib2();
      init_preact_module();
    }
  });

  // src/app/components/ToolHeader.tsx
  function ToolHeader(props) {
    return /* @__PURE__ */ _("div", null, /* @__PURE__ */ _(Container, { space: "small" }, /* @__PURE__ */ _(VerticalSpace, { space: "extraSmall" }), /* @__PURE__ */ _("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, props.left ? /* @__PURE__ */ _("div", { style: { display: "flex", alignItems: "center" } }, props.left) : null, /* @__PURE__ */ _(Text, { style: { fontWeight: 600 } }, props.title)), /* @__PURE__ */ _(VerticalSpace, { space: "extraSmall" })), /* @__PURE__ */ _(Divider, null));
  }
  var init_ToolHeader = __esm({
    "src/app/components/ToolHeader.tsx"() {
      "use strict";
      init_lib2();
      init_preact_module();
    }
  });

  // src/app/tools/mockup-markup-library/constants.ts
  var MARKUP_COLOR_VARIABLE_RAW_IDS, MARKUP_TEXT_STYLE_IDS;
  var init_constants2 = __esm({
    "src/app/tools/mockup-markup-library/constants.ts"() {
      "use strict";
      MARKUP_COLOR_VARIABLE_RAW_IDS = {
        text: "VariableID:35e0b230bbdc8fa1906c60a25117319e726f2bd7/1116:1",
        textSecondary: "VariableID:84f084bc9e1c3ed3add7febfe9326d633010f8a2/1260:12",
        purple: "VariableID:cefb32503d23428db2c20bac7615cff7b5feab07/1210:6"
      };
      MARKUP_TEXT_STYLE_IDS = {
        h1: "S:3e9bacca6574fd3bb647bc3f3fec124903d58931,1190:2",
        h2: "S:d8f137455e6ade1a64398ac113cf0a49c2991ff6,1190:1",
        h3: "S:a7abb8bbbf3b902fa8801548a013157907e75bc2,1260:33",
        description: "S:d8195a8211b3819b1a888e4d1edf6218ff5d2fd5,1282:7",
        paragraph: "S:a6d1706e317719d0750eae3655a3b4360ad2b9ef,1260:39"
      };
    }
  });

  // src/app/tools/mockup-markup-quick-apply-tool/presets.ts
  function getColorPresetLabel(preset) {
    switch (preset) {
      case "text":
        return "Default";
      case "text-secondary":
        return "Secondary";
      case "purple":
        return "Purple";
    }
  }
  var TEXT_STYLE_ID_BY_PRESET, COLOR_VARIABLE_ID_RAW_BY_PRESET;
  var init_presets = __esm({
    "src/app/tools/mockup-markup-quick-apply-tool/presets.ts"() {
      "use strict";
      init_constants2();
      TEXT_STYLE_ID_BY_PRESET = {
        h1: MARKUP_TEXT_STYLE_IDS.h1,
        h2: MARKUP_TEXT_STYLE_IDS.h2,
        h3: MARKUP_TEXT_STYLE_IDS.h3,
        description: MARKUP_TEXT_STYLE_IDS.description,
        paragraph: MARKUP_TEXT_STYLE_IDS.paragraph
      };
      COLOR_VARIABLE_ID_RAW_BY_PRESET = {
        text: MARKUP_COLOR_VARIABLE_RAW_IDS.text,
        "text-secondary": MARKUP_COLOR_VARIABLE_RAW_IDS.textSecondary,
        purple: MARKUP_COLOR_VARIABLE_RAW_IDS.purple
      };
    }
  });

  // src/app/views/mockup-markup-tool/MockupMarkupToolView.tsx
  function TextStylePresetGrid(props) {
    const Option = (p3) => {
      const selected = props.value === p3.value;
      return /* @__PURE__ */ _(
        "button",
        {
          type: "button",
          onClick: () => props.onChange(p3.value),
          style: {
            width: "100%",
            padding: "8px 8px",
            borderRadius: 8,
            border: selected ? "1px solid var(--figma-color-border-selected)" : "1px solid var(--figma-color-border)",
            background: selected ? "var(--figma-color-bg-selected)" : "var(--figma-color-bg)",
            cursor: "pointer",
            textAlign: "left"
          }
        },
        /* @__PURE__ */ _(Text, null, p3.label)
      );
    };
    return /* @__PURE__ */ _("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, /* @__PURE__ */ _("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 } }, /* @__PURE__ */ _(Option, { value: "paragraph", label: "Paragraph" }), /* @__PURE__ */ _(Option, { value: "description", label: "Description" })), /* @__PURE__ */ _("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 } }, /* @__PURE__ */ _(Option, { value: "h1", label: "H1" }), /* @__PURE__ */ _(Option, { value: "h2", label: "H2" }), /* @__PURE__ */ _(Option, { value: "h3", label: "H3" })));
  }
  function ColorPresetGrid(props) {
    const Option = (p3) => {
      const selected = props.value === p3.value;
      return /* @__PURE__ */ _(
        "button",
        {
          type: "button",
          onClick: () => props.onChange(p3.value),
          style: {
            width: "100%",
            padding: "8px 8px",
            borderRadius: 8,
            border: selected ? "1px solid var(--figma-color-border-selected)" : "1px solid var(--figma-color-border)",
            background: selected ? "var(--figma-color-bg-selected)" : "var(--figma-color-bg)",
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: 8
          }
        },
        /* @__PURE__ */ _(ColorSwatch, { hex: p3.swatch.hex, opacityPercent: p3.swatch.opacityPercent }),
        /* @__PURE__ */ _(Text, null, p3.label)
      );
    };
    return /* @__PURE__ */ _("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 } }, /* @__PURE__ */ _(Option, { value: "text", label: getColorPresetLabel("text"), swatch: props.previews.text }), /* @__PURE__ */ _(Option, { value: "text-secondary", label: getColorPresetLabel("text-secondary"), swatch: props.previews.textSecondary }), /* @__PURE__ */ _(Option, { value: "purple", label: getColorPresetLabel("purple"), swatch: props.previews.purple }));
  }
  function ModeSegmented(props) {
    const Item = (p3) => {
      const selected = props.value === p3.value;
      return /* @__PURE__ */ _(
        "button",
        {
          type: "button",
          onClick: () => props.onChange(p3.value),
          style: {
            flex: 1,
            height: 24,
            borderRadius: 6,
            border: selected ? "1px solid var(--figma-color-border)" : "1px solid transparent",
            background: selected ? "var(--figma-color-bg)" : "transparent",
            color: selected ? "var(--figma-color-text)" : "var(--figma-color-text-secondary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 8px"
          }
        },
        /* @__PURE__ */ _(Text, null, p3.label)
      );
    };
    return /* @__PURE__ */ _(
      "div",
      {
        style: {
          display: "flex",
          padding: 2,
          gap: 2,
          borderRadius: 8,
          background: "var(--figma-color-bg-secondary)"
        }
      },
      /* @__PURE__ */ _(Item, { value: "dark", label: "Dark" }),
      /* @__PURE__ */ _(Item, { value: "light", label: "Light" })
    );
  }
  function MockupMarkupToolView(props) {
    const [request, setRequest] = d2(DEFAULT_REQUEST);
    const [state, setState] = d2({ selectionSize: 0, textNodeCount: 0, hasSourceTextNode: false });
    const [status, setStatus] = d2({ status: "idle" });
    const [colorPreviews, setColorPreviews] = d2({
      text: { hex: null, opacityPercent: null },
      textSecondary: { hex: null, opacityPercent: null },
      purple: { hex: null, opacityPercent: null }
    });
    y2(() => {
      const handleMessage = (event) => {
        var _a;
        const msg = (_a = event.data) == null ? void 0 : _a.pluginMessage;
        if (!msg) return;
        if (msg.type === MAIN_TO_UI.MOCKUP_MARKUP_STATE) {
          setState(msg.state);
          return;
        }
        if (msg.type === MAIN_TO_UI.MOCKUP_MARKUP_STATUS) {
          setStatus(msg.status);
          return;
        }
        if (msg.type === MAIN_TO_UI.MOCKUP_MARKUP_COLOR_PREVIEWS) {
          setColorPreviews(msg.previews);
          return;
        }
      };
      window.addEventListener("message", handleMessage);
      parent.postMessage({ pluginMessage: { type: UI_TO_MAIN.MOCKUP_MARKUP_LOAD_STATE } }, "*");
      return () => window.removeEventListener("message", handleMessage);
    }, []);
    y2(() => {
      parent.postMessage(
        { pluginMessage: { type: UI_TO_MAIN.MOCKUP_MARKUP_GET_COLOR_PREVIEWS, forceModeName: request.forceModeName } },
        "*"
      );
    }, [request.forceModeName]);
    const isWorking = status.status === "working";
    const primaryAction = T2(() => {
      if (state.textNodeCount > 0) {
        return { label: "Apply to selection", disabled: isWorking, messageType: UI_TO_MAIN.MOCKUP_MARKUP_APPLY };
      }
      return { label: "Create text", disabled: isWorking, messageType: UI_TO_MAIN.MOCKUP_MARKUP_CREATE_TEXT };
    }, [isWorking, state.textNodeCount]);
    return /* @__PURE__ */ _(Page, null, /* @__PURE__ */ _(
      ToolHeader,
      {
        title: "Mockup Markup Quick Apply",
        left: /* @__PURE__ */ _(IconButton, { onClick: props.onBack, title: "Home" }, /* @__PURE__ */ _(IconHome16, null))
      }
    ), /* @__PURE__ */ _("div", { style: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column" } }, /* @__PURE__ */ _(ToolBody, { mode: "content" }, /* @__PURE__ */ _("div", { style: { display: "flex", flexDirection: "column", minHeight: "100%" } }, /* @__PURE__ */ _(VerticalSpace, { space: "medium" }), /* @__PURE__ */ _(Text, null, "Color"), /* @__PURE__ */ _(VerticalSpace, { space: "extraSmall" }), /* @__PURE__ */ _(
      ColorPresetGrid,
      {
        value: request.presetColor,
        previews: colorPreviews,
        onChange: (value2) => setRequest((r3) => __spreadProps(__spreadValues({}, r3), { presetColor: value2 }))
      }
    ), /* @__PURE__ */ _(VerticalSpace, { space: "large" }), /* @__PURE__ */ _(Text, null, "Text style"), /* @__PURE__ */ _(VerticalSpace, { space: "extraSmall" }), /* @__PURE__ */ _(
      TextStylePresetGrid,
      {
        value: request.presetTypography,
        onChange: (value2) => setRequest((r3) => __spreadProps(__spreadValues({}, r3), { presetTypography: value2 }))
      }
    ), /* @__PURE__ */ _(VerticalSpace, { space: "large" }), /* @__PURE__ */ _(
      Checkbox,
      {
        value: request.width400,
        onValueChange: (value2) => setRequest((r3) => __spreadProps(__spreadValues({}, r3), { width400: value2 }))
      },
      /* @__PURE__ */ _(Text, null, "Width 400px")
    ), /* @__PURE__ */ _("div", { style: { flex: 1 } }), /* @__PURE__ */ _(VerticalSpace, { space: "large" }), /* @__PURE__ */ _(
      ModeSegmented,
      {
        value: request.forceModeName,
        onChange: (value2) => setRequest((r3) => __spreadProps(__spreadValues({}, r3), { forceModeName: value2 }))
      }
    ), /* @__PURE__ */ _(VerticalSpace, { space: "medium" }))), /* @__PURE__ */ _(Divider, null), /* @__PURE__ */ _(Container, { space: "small" }, /* @__PURE__ */ _(VerticalSpace, { space: "small" }), /* @__PURE__ */ _(
      Button,
      {
        fullWidth: true,
        loading: isWorking,
        disabled: primaryAction.disabled || primaryAction.messageType === UI_TO_MAIN.MOCKUP_MARKUP_APPLY && state.textNodeCount === 0,
        onClick: () => parent.postMessage(
          {
            pluginMessage: {
              type: primaryAction.messageType,
              request
            }
          },
          "*"
        )
      },
      primaryAction.label
    ), /* @__PURE__ */ _(VerticalSpace, { space: "small" }))));
  }
  var DEFAULT_REQUEST;
  var init_MockupMarkupToolView = __esm({
    "src/app/views/mockup-markup-tool/MockupMarkupToolView.tsx"() {
      "use strict";
      init_lib2();
      init_preact_module();
      init_hooks_module();
      init_messages();
      init_Page();
      init_ColorSwatch();
      init_ToolBody();
      init_ToolHeader();
      init_presets();
      DEFAULT_REQUEST = {
        presetColor: "text",
        presetTypography: "paragraph",
        forceModeName: "dark",
        width400: false
      };
    }
  });

  // src/app/components/ColorRow.tsx
  function ColorRow(props) {
    var _a;
    const [hovered, setHovered] = d2(false);
    const actions = Array.isArray(props.actions) ? props.actions : [];
    const hasActions = actions.length > 0;
    return /* @__PURE__ */ _(
      "div",
      {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: 28,
          paddingLeft: 4,
          paddingRight: 4,
          userSelect: "none",
          borderRadius: 4,
          backgroundColor: hovered ? "color-mix(in srgb, var(--figma-color-bg-hover) 50%, transparent)" : "transparent",
          transition: "background-color 120ms ease"
        }
      },
      /* @__PURE__ */ _("div", { style: { width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" } }, (_a = props.icon) != null ? _a : null),
      /* @__PURE__ */ _("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ _(
        "div",
        {
          style: {
            fontSize: 11,
            color: "var(--figma-color-text)",
            fontWeight: props.titleStrong ? 600 : 400,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }
        },
        props.title
      )),
      props.description ? /* @__PURE__ */ _(
        "div",
        {
          style: {
            fontSize: 10,
            color: "var(--figma-color-text-secondary)",
            maxWidth: 140,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }
        },
        props.description
      ) : null,
      hasActions ? /* @__PURE__ */ _(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 6,
            flexShrink: 0,
            opacity: hovered ? 1 : 0,
            pointerEvents: hovered ? "auto" : "none",
            transition: "opacity 120ms ease"
          },
          onClick: (e3) => {
            e3.preventDefault();
            e3.stopPropagation();
          },
          onMouseDown: (e3) => {
            e3.preventDefault();
            e3.stopPropagation();
          }
        },
        actions.map(
          (action) => {
            var _a2;
            return action.kind === "custom" ? /* @__PURE__ */ _("span", { key: action.id }, action.component) : action.kind === "button" ? /* @__PURE__ */ _(
              "button",
              {
                key: action.id,
                type: "button",
                disabled: action.disabled === true,
                onClick: (e3) => {
                  var _a3;
                  e3.preventDefault();
                  e3.stopPropagation();
                  if (action.disabled) return;
                  void ((_a3 = action.onClick) == null ? void 0 : _a3.call(action));
                },
                onMouseDown: (e3) => {
                  e3.preventDefault();
                  e3.stopPropagation();
                },
                title: action.label,
                style: {
                  height: 20,
                  padding: "0 6px",
                  whiteSpace: "nowrap",
                  border: "1px solid var(--figma-color-border)",
                  background: "var(--figma-color-bg)",
                  color: "var(--figma-color-text)",
                  borderRadius: 4,
                  fontSize: 10,
                  lineHeight: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: action.disabled ? "not-allowed" : "pointer",
                  opacity: action.disabled ? 0.5 : 1
                }
              },
              action.label
            ) : /* @__PURE__ */ _(
              IconButton,
              {
                key: action.id,
                disabled: action.disabled === true,
                title: action.label,
                onClick: (e3) => {
                  var _a3;
                  e3.preventDefault();
                  e3.stopPropagation();
                  if (action.disabled) return;
                  void ((_a3 = action.onClick) == null ? void 0 : _a3.call(action));
                }
              },
              (_a2 = action.icon) != null ? _a2 : action.label
            );
          }
        )
      ) : null
    );
  }
  var init_ColorRow = __esm({
    "src/app/components/ColorRow.tsx"() {
      "use strict";
      init_preact_module();
      init_hooks_module();
      init_lib2();
    }
  });

  // src/app/utils/clipboard.ts
  async function copyTextToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e3) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
        return true;
      } catch (e4) {
        return false;
      }
    }
  }
  var init_clipboard = __esm({
    "src/app/utils/clipboard.ts"() {
      "use strict";
    }
  });

  // src/app/components/CopyIconButton.tsx
  function CopyIconButton(props) {
    const [copied, setCopied] = d2(false);
    const timerRef = A2(null);
    const handleCopy = q2(
      (e3) => {
        e3.preventDefault();
        e3.stopPropagation();
        void copyTextToClipboard(props.text).then((ok) => {
          var _a;
          if (!ok) return;
          setCopied(true);
          (_a = props.onCopied) == null ? void 0 : _a.call(props, props.text);
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            setCopied(false);
            timerRef.current = null;
          }, 1500);
        });
      },
      [props.text]
    );
    return /* @__PURE__ */ _(IconButton, { title: copied ? "Copied!" : `${props.text}`, onClick: handleCopy }, copied ? /* @__PURE__ */ _(IconCheck16, null) : /* @__PURE__ */ _("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none" }, /* @__PURE__ */ _(
      "path",
      {
        d: "M5.5 3.5H4.5C3.94772 3.5 3.5 3.94772 3.5 4.5V12.5C3.5 13.0523 3.94772 13.5 4.5 13.5H10.5C11.0523 13.5 11.5 13.0523 11.5 12.5V11.5",
        stroke: "currentColor",
        "stroke-linecap": "round"
      }
    ), /* @__PURE__ */ _("rect", { x: "5.5", y: "2.5", width: "7", height: "9", rx: "1", stroke: "currentColor" })));
  }
  var init_CopyIconButton = __esm({
    "src/app/components/CopyIconButton.tsx"() {
      "use strict";
      init_preact_module();
      init_hooks_module();
      init_lib2();
      init_clipboard();
    }
  });

  // src/app/components/State.tsx
  function State(props) {
    var _a;
    const tone = (_a = props.tone) != null ? _a : "muted";
    const textColor = tone === "default" ? "var(--figma-color-text)" : "var(--figma-color-text-secondary)";
    return /* @__PURE__ */ _(
      Container,
      {
        space: "small",
        style: {
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: textColor,
          padding: "24px 12px",
          boxSizing: "border-box"
        }
      },
      props.icon ? /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(
        "div",
        {
          style: {
            color: textColor,
            transform: "scale(2)",
            transformOrigin: "50% 50%",
            lineHeight: 0
          }
        },
        props.icon
      ), /* @__PURE__ */ _(VerticalSpace, { space: "medium" })) : null,
      /* @__PURE__ */ _(Text, { style: { color: textColor } }, props.title),
      props.description ? /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(VerticalSpace, { space: "extraSmall" }), /* @__PURE__ */ _(Text, { style: { color: textColor } }, props.description)) : null
    );
  }
  var init_State = __esm({
    "src/app/components/State.tsx"() {
      "use strict";
      init_lib2();
      init_preact_module();
    }
  });

  // src/app/views/color-chain-tool/ColorChainToolView.tsx
  function formatHexWithOpacity2(hex, opacityPercent) {
    if (opacityPercent == null) return hex;
    if (opacityPercent >= 100) return hex;
    return `${hex} ${opacityPercent}%`;
  }
  function coerceResultsToV2(results) {
    return results.map((layer) => ({
      layerId: layer.layerId,
      layerName: layer.layerName,
      layerType: layer.layerType,
      colors: layer.colors.map((c3) => {
        var _a, _b;
        const applied = c3.appliedMode;
        let chainToRender = null;
        if (applied.status === "single") {
          chainToRender = (_a = c3.chains.find((ch) => ch.modeId === applied.modeId)) != null ? _a : null;
        }
        chainToRender = (_b = chainToRender != null ? chainToRender : c3.chains[0]) != null ? _b : null;
        return {
          variableId: c3.variableId,
          variableName: c3.variableName,
          collectionName: c3.collectionName,
          appliedMode: c3.appliedMode,
          chainToRender,
          hasOtherModes: c3.chains.length > 1
        };
      })
    }));
  }
  function ColorChainToolView(props) {
    const [loading, setLoading] = d2(true);
    const [results, setResults] = d2([]);
    const [error, setError] = d2(null);
    const [selectionEmpty, setSelectionEmpty] = d2(props.initialSelectionEmpty);
    const [replaceBusyRowId, setReplaceBusyRowId] = d2(null);
    const notify = (message) => {
      parent.postMessage(
        {
          pluginMessage: {
            type: UI_TO_MAIN.COLOR_CHAIN_NOTIFY,
            message
          }
        },
        "*"
      );
    };
    y2(() => {
      const handleMessage = (event) => {
        var _a;
        const msg = (_a = event.data) == null ? void 0 : _a.pluginMessage;
        if (!msg) return;
        if (msg.type === MAIN_TO_UI.ERROR) {
          setLoading(false);
          setReplaceBusyRowId(null);
          setError(msg.message);
          return;
        }
        if (msg.type === MAIN_TO_UI.SELECTION_EMPTY) {
          setLoading(false);
          setReplaceBusyRowId(null);
          setResults([]);
          setSelectionEmpty(true);
          setError(null);
          return;
        }
        if (msg.type === MAIN_TO_UI.VARIABLE_CHAINS_RESULT) {
          setLoading(false);
          setReplaceBusyRowId(null);
          setResults(coerceResultsToV2(msg.results));
          setSelectionEmpty(false);
          setError(null);
          return;
        }
        if (msg.type === MAIN_TO_UI.VARIABLE_CHAINS_RESULT_V2) {
          setLoading(false);
          setReplaceBusyRowId(null);
          setResults(msg.results);
          setSelectionEmpty(false);
          setError(null);
          return;
        }
      };
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }, []);
    y2(() => {
      setLoading(true);
      parent.postMessage(
        {
          pluginMessage: { type: UI_TO_MAIN.INSPECT_SELECTION_FOR_VARIABLE_CHAINS }
        },
        "*"
      );
    }, []);
    const totalColors = T2(() => {
      return results.reduce((sum, layer) => {
        var _a, _b;
        return sum + ((_b = (_a = layer.colors) == null ? void 0 : _a.length) != null ? _b : 0);
      }, 0);
    }, [results]);
    const viewState = (() => {
      if (error) return "error";
      if (selectionEmpty) return "selectionEmpty";
      if (loading && results.length === 0) return "inspecting";
      if (results.length > 0 && totalColors === 0) return "nothingFound";
      return "content";
    })();
    return /* @__PURE__ */ _(Page, null, /* @__PURE__ */ _(
      ToolHeader,
      {
        title: "View Colors Chain",
        left: /* @__PURE__ */ _(IconButton, { onClick: props.onBack, title: "Home" }, /* @__PURE__ */ _(IconHome16, null))
      }
    ), viewState === "error" ? /* @__PURE__ */ _(ToolBody, { mode: "state" }, /* @__PURE__ */ _(State, { title: error != null ? error : "Unknown error", tone: "default" })) : viewState === "inspecting" ? /* @__PURE__ */ _(ToolBody, { mode: "state" }, /* @__PURE__ */ _(State, { icon: /* @__PURE__ */ _(IconTimeSmall24, null), title: "Inspecting selection\u2026" })) : viewState === "selectionEmpty" ? /* @__PURE__ */ _(ToolBody, { mode: "state" }, /* @__PURE__ */ _(
      State,
      {
        icon: /* @__PURE__ */ _(IconInteractionClickSmall24, null),
        title: "Select a layer to see variables color chain."
      }
    )) : viewState === "nothingFound" ? /* @__PURE__ */ _(ToolBody, { mode: "state" }, /* @__PURE__ */ _(State, { title: "No variable colors found in selection" })) : /* @__PURE__ */ _(ToolBody, { mode: "content" }, results.length > 0 ? /* @__PURE__ */ _(k, null, (() => {
      var _a, _b, _c, _d, _e, _f;
      const rows = [];
      const groupSpacing = 16;
      for (const layer of results) {
        const colors = layer.colors.slice();
        for (const c3 of colors) {
          const chainToRender = c3.chainToRender;
          const swatchHex = (_a = chainToRender == null ? void 0 : chainToRender.finalHex) != null ? _a : null;
          const swatchOpacityPercent = (_b = chainToRender == null ? void 0 : chainToRender.finalOpacityPercent) != null ? _b : null;
          const chainSteps = (chainToRender == null ? void 0 : chainToRender.chain) ? chainToRender.chain.slice(1) : [];
          const chainStepIds = (_d = (_c = chainToRender == null ? void 0 : chainToRender.chainVariableIds) == null ? void 0 : _c.slice(1)) != null ? _d : [];
          const rowId = `${layer.layerId}:${c3.variableId}`;
          const mainRowActions = [
            {
              id: `${rowId}:copy`,
              label: "Copy name",
              kind: "custom",
              component: /* @__PURE__ */ _(
                CopyIconButton,
                {
                  text: c3.variableName,
                  onCopied: (text) => notify(`Copied ${text}`)
                }
              )
            }
          ];
          rows.push(
            /* @__PURE__ */ _(
              ColorRow,
              {
                key: rowId,
                title: c3.variableName,
                icon: /* @__PURE__ */ _(ColorSwatch, { hex: swatchHex, opacityPercent: swatchOpacityPercent }),
                titleStrong: true,
                actions: mainRowActions
              }
            )
          );
          for (let idx = 0; idx < chainSteps.length; idx++) {
            const step = chainSteps[idx];
            const stepVariableId = (_e = chainStepIds[idx]) != null ? _e : null;
            const stepRowId = `${layer.layerId}:${c3.variableId}:step:${idx}`;
            const stepActions = [
              {
                id: `${stepRowId}:replace`,
                label: "Apply Color",
                kind: "button",
                disabled: replaceBusyRowId != null || stepVariableId == null || stepVariableId === c3.variableId,
                onClick: () => {
                  if (stepVariableId == null || stepVariableId === c3.variableId) return;
                  setReplaceBusyRowId(stepRowId);
                  parent.postMessage(
                    {
                      pluginMessage: {
                        type: UI_TO_MAIN.COLOR_CHAIN_REPLACE_MAIN_COLOR,
                        request: {
                          sourceVariableId: c3.variableId,
                          targetVariableId: stepVariableId
                        }
                      }
                    },
                    "*"
                  );
                }
              },
              {
                id: `${stepRowId}:copy`,
                label: "Copy name",
                kind: "custom",
                component: /* @__PURE__ */ _(
                  CopyIconButton,
                  {
                    text: step,
                    onCopied: (text) => notify(`Copied ${text}`)
                  }
                )
              }
            ];
            rows.push(/* @__PURE__ */ _(ColorRow, { key: stepRowId, title: step, actions: stepActions }));
          }
          const hexRowId = `${layer.layerId}:${c3.variableId}:hex`;
          const hexActions = (chainToRender == null ? void 0 : chainToRender.finalHex) ? [
            {
              id: `${hexRowId}:copy`,
              label: "Copy HEX",
              kind: "custom",
              component: /* @__PURE__ */ _(
                CopyIconButton,
                {
                  text: chainToRender.finalHex,
                  onCopied: (text) => notify(`Copied ${text}`)
                }
              )
            }
          ] : [];
          rows.push(
            /* @__PURE__ */ _(
              ColorRow,
              {
                key: hexRowId,
                title: (chainToRender == null ? void 0 : chainToRender.finalHex) && typeof chainToRender.finalOpacityPercent === "number" ? formatHexWithOpacity2(chainToRender.finalHex, chainToRender.finalOpacityPercent) : (_f = chainToRender == null ? void 0 : chainToRender.finalHex) != null ? _f : "N/A",
                actions: hexActions
              }
            )
          );
          rows.push(/* @__PURE__ */ _("div", { key: `${rowId}:spacer`, style: { height: groupSpacing } }));
        }
      }
      if (rows.length > 0) {
        rows.pop();
      }
      return rows;
    })()) : null));
  }
  var init_ColorChainToolView = __esm({
    "src/app/views/color-chain-tool/ColorChainToolView.tsx"() {
      "use strict";
      init_lib2();
      init_preact_module();
      init_hooks_module();
      init_messages();
      init_ColorSwatch();
      init_ColorRow();
      init_CopyIconButton();
      init_State();
      init_ToolHeader();
      init_Page();
      init_ToolBody();
    }
  });

  // src/app/components/DataTable.tsx
  function DataTable(props) {
    return /* @__PURE__ */ _("div", null, props.header ? /* @__PURE__ */ _(
      Text,
      {
        style: {
          color: "var(--figma-color-text-secondary)",
          fontSize: 11,
          lineHeight: "16px",
          marginBottom: 6
        }
      },
      props.header
    ) : null, props.summary ? /* @__PURE__ */ _("div", { style: { marginBottom: 6 } }, typeof props.summary === "string" ? /* @__PURE__ */ _(
      Text,
      {
        style: {
          color: "var(--figma-color-text-tertiary)",
          fontSize: 11,
          lineHeight: "16px"
        }
      },
      props.summary
    ) : props.summary) : null, /* @__PURE__ */ _(
      "div",
      {
        style: {
          border: "1px solid var(--figma-color-border)",
          borderRadius: 6,
          overflow: "hidden"
        }
      },
      /* @__PURE__ */ _(
        "table",
        {
          style: {
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 12,
            tableLayout: "fixed"
          }
        },
        /* @__PURE__ */ _("thead", null, /* @__PURE__ */ _("tr", null, props.columns.map((col, i3) => {
          var _a;
          return /* @__PURE__ */ _(
            "th",
            {
              key: i3,
              style: __spreadValues({
                borderBottom: "1px solid var(--figma-color-border)",
                textAlign: (_a = col.align) != null ? _a : "left",
                padding: "6px 8px",
                position: "sticky",
                top: 0,
                background: "var(--figma-color-bg-secondary)",
                fontWeight: 500,
                fontSize: 11,
                color: "var(--figma-color-text-secondary)"
              }, col.width != null ? { width: col.width } : {})
            },
            col.label
          );
        }))),
        /* @__PURE__ */ _("tbody", null, props.children)
      )
    ));
  }
  var init_DataTable = __esm({
    "src/app/components/DataTable.tsx"() {
      "use strict";
      init_preact_module();
      init_lib2();
    }
  });

  // src/app/components/NodeTypeIcon.tsx
  function NodeTypeIcon(props) {
    var _a, _b;
    const size = (_a = props.size) != null ? _a : 12;
    const color = (_b = props.color) != null ? _b : "var(--figma-color-text-secondary)";
    if (props.type === "colorStyleFill") {
      return /* @__PURE__ */ _(
        "svg",
        {
          width: size,
          height: size,
          viewBox: "0 0 12 12",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        },
        /* @__PURE__ */ _("circle", { cx: "6", cy: "6", r: "5", fill: color })
      );
    }
    if (props.type === "colorStyleStroke") {
      return /* @__PURE__ */ _(
        "svg",
        {
          width: size,
          height: size,
          viewBox: "0 0 12 12",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        },
        /* @__PURE__ */ _("circle", { cx: "6", cy: "6", r: "4.25", stroke: color, "stroke-width": "3" })
      );
    }
    return null;
  }
  var init_NodeTypeIcon = __esm({
    "src/app/components/NodeTypeIcon.tsx"() {
      "use strict";
      init_preact_module();
    }
  });

  // src/app/components/ScopeControl.tsx
  function useScope(initialSelectionEmpty) {
    const [selectionSize, setSelectionSize] = d2(initialSelectionEmpty ? 0 : 1);
    const [scope, setScope] = d2(
      initialSelectionEmpty ? "page" : "selection"
    );
    const updateSelectionSize = q2((newSize) => {
      setSelectionSize(newSize);
      setScope(newSize > 0 ? "selection" : "page");
    }, []);
    return {
      scope,
      setScope,
      selectionSize,
      hasSelection: selectionSize > 0,
      updateSelectionSize
    };
  }
  function ScopeControl({
    value: value2,
    hasSelection,
    onValueChange,
    disabled = false
  }) {
    return /* @__PURE__ */ _("div", { class: "scope-control-stretch" }, /* @__PURE__ */ _("style", null, `.scope-control-stretch > div { width: 100%; } .scope-control-stretch > div > label { flex: 1; text-align: center; }`), /* @__PURE__ */ _(
      SegmentedControl,
      {
        value: value2,
        disabled,
        onValueChange: (next) => {
          if (!onValueChange) return;
          const nextScope = next;
          if (nextScope === "selection" && !hasSelection) return;
          onValueChange(nextScope);
        },
        options: [
          {
            value: "selection",
            disabled: disabled || !hasSelection,
            children: "Selection"
          },
          {
            value: "page",
            disabled,
            children: "Current page"
          },
          {
            value: "all_pages",
            disabled,
            children: "All pages"
          }
        ]
      }
    ));
  }
  var init_ScopeControl = __esm({
    "src/app/components/ScopeControl.tsx"() {
      "use strict";
      init_lib2();
      init_preact_module();
      init_hooks_module();
    }
  });

  // src/app/components/ToolFooter.tsx
  function ToolFooter(props) {
    return /* @__PURE__ */ _(
      "div",
      {
        style: {
          borderTop: "1px solid var(--figma-color-border)",
          padding: "8px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          flexShrink: 0
        }
      },
      H(props.children).map((child, i3) => /* @__PURE__ */ _("div", { key: i3, style: { display: "flex", width: "100%" } }, /* @__PURE__ */ _("div", { style: { flex: 1, minWidth: 0 } }, child)))
    );
  }
  var init_ToolFooter = __esm({
    "src/app/components/ToolFooter.tsx"() {
      "use strict";
      init_preact_module();
    }
  });

  // src/app/views/library-swap-tool/LibrarySwapToolView.tsx
  function LibrarySwapToolView({ onBack, initialSelectionEmpty }) {
    const { scope, setScope, selectionSize, hasSelection, updateSelectionSize } = useScope(initialSelectionEmpty);
    const [useBuiltInIcons, setUseBuiltInIcons] = d2(true);
    const [useBuiltInUikit, setUseBuiltInUikit] = d2(true);
    const [customFilename, setCustomFilename] = d2(null);
    const [customJsonText, setCustomJsonText] = d2(null);
    const [isBusy, setIsBusy] = d2(false);
    const [stage, setStage] = d2("idle");
    const [progress, setProgress] = d2(null);
    const [errorMessage, setErrorMessage] = d2(null);
    const [successMessage, setSuccessMessage] = d2(null);
    const [analyzeResult, setAnalyzeResult] = d2(null);
    const [applyResult, setApplyResult] = d2(null);
    const [scanLegacyResult, setScanLegacyResult] = d2(null);
    const [capturedOldName, setCapturedOldName] = d2(null);
    const [capturedNewName, setCapturedNewName] = d2(null);
    const [manualPairs, setManualPairs] = d2([]);
    const hasMapping = useBuiltInIcons || useBuiltInUikit || !!customJsonText || manualPairs.length > 0;
    const canAct = hasMapping && !isBusy;
    y2(() => {
      const handleMessage = (event) => {
        var _a;
        const msg = (_a = event.data) == null ? void 0 : _a.pluginMessage;
        if (!msg) return;
        if (msg.type === MAIN_TO_UI.LIBRARY_SWAP_SELECTION) {
          updateSelectionSize(msg.selectionSize);
        }
        if (msg.type === MAIN_TO_UI.LIBRARY_SWAP_ANALYZE_RESULT) {
          setErrorMessage(null);
          setAnalyzeResult(msg.payload);
        }
        if (msg.type === MAIN_TO_UI.LIBRARY_SWAP_PROGRESS) {
          setProgress(msg.progress);
        }
        if (msg.type === MAIN_TO_UI.LIBRARY_SWAP_APPLY_RESULT) {
          setIsBusy(false);
          setStage("idle");
          setProgress(null);
          setErrorMessage(null);
          setApplyResult(msg.payload);
          setAnalyzeResult(null);
          setScanLegacyResult(null);
          setSuccessMessage(`${msg.payload.swapped} swapped, ${msg.payload.skipped} skipped`);
        }
        if (msg.type === MAIN_TO_UI.LIBRARY_SWAP_PREVIEW_RESULT) {
          setIsBusy(false);
          setStage("idle");
          setProgress(null);
          setErrorMessage(null);
          setSuccessMessage(`Preview created with ${msg.previewed} samples`);
        }
        if (msg.type === MAIN_TO_UI.ERROR) {
          setErrorMessage(msg.message);
          setIsBusy(false);
          setStage("idle");
          setProgress(null);
        }
        if (msg.type === MAIN_TO_UI.LIBRARY_SWAP_CAPTURE_RESULT) {
          if (msg.side === "old") setCapturedOldName(msg.name);
          if (msg.side === "new") setCapturedNewName(msg.name);
        }
        if (msg.type === MAIN_TO_UI.LIBRARY_SWAP_PAIRS_UPDATED) {
          setManualPairs(msg.pairs);
        }
        if (msg.type === MAIN_TO_UI.LIBRARY_SWAP_SCAN_LEGACY_RESULT) {
          setIsBusy(false);
          setStage("idle");
          setProgress(null);
          setErrorMessage(null);
          setSuccessMessage(null);
          setScanLegacyResult(msg.payload);
        }
        if (msg.type === MAIN_TO_UI.LIBRARY_SWAP_SCAN_LEGACY_RESET_RESULT) {
          if (msg.ok && scanLegacyResult) {
            setScanLegacyResult(__spreadProps(__spreadValues({}, scanLegacyResult), {
              styles: scanLegacyResult.styles.filter((s3) => s3.nodeId !== msg.nodeId)
            }));
          }
        }
      };
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }, []);
    function buildRequest() {
      return {
        scope,
        useBuiltInIcons,
        useBuiltInUikit,
        customMappingJsonText: customJsonText != null ? customJsonText : void 0
      };
    }
    function handleAnalyze() {
      setIsBusy(true);
      setStage("analyze");
      setErrorMessage(null);
      setSuccessMessage(null);
      setApplyResult(null);
      setScanLegacyResult(null);
      parent.postMessage(
        { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_ANALYZE, request: buildRequest() } },
        "*"
      );
    }
    function handlePreview() {
      setIsBusy(true);
      setStage("preview");
      setErrorMessage(null);
      setSuccessMessage(null);
      parent.postMessage(
        { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_PREVIEW, request: __spreadProps(__spreadValues({}, buildRequest()), { sampleSize: 60 }) } },
        "*"
      );
    }
    function handleApply() {
      setIsBusy(true);
      setStage("apply");
      setErrorMessage(null);
      setSuccessMessage(null);
      parent.postMessage(
        { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_APPLY, request: buildRequest() } },
        "*"
      );
    }
    function handleResetOverride(nodeId, property) {
      parent.postMessage(
        { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_SCAN_LEGACY_RESET, nodeId, property } },
        "*"
      );
    }
    function handleClearPreviews() {
      parent.postMessage(
        { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_CLEAR_PREVIEWS } },
        "*"
      );
    }
    function handleFocusNode(nodeId) {
      parent.postMessage(
        { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_FOCUS_NODE, nodeId } },
        "*"
      );
    }
    function handleCaptureOld() {
      parent.postMessage(
        { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_CAPTURE_OLD } },
        "*"
      );
    }
    function handleCaptureNew() {
      parent.postMessage(
        { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_CAPTURE_NEW } },
        "*"
      );
    }
    function handleRemovePair(oldKey) {
      parent.postMessage(
        { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_REMOVE_PAIR, oldKey } },
        "*"
      );
    }
    function handleExportMapping() {
      if (manualPairs.length === 0) return;
      const matches = {};
      const matchMeta = {};
      for (const p3 of manualPairs) {
        matches[p3.oldKey] = p3.newKey;
        matchMeta[p3.oldKey] = { oldFullName: p3.oldName, newFullName: p3.newName };
      }
      const exported = {
        schemaVersion: 2,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        meta: { note: "Manual pairs exported from Library Swap" },
        matches,
        matchMeta
      };
      const blob = new Blob([JSON.stringify(exported, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a3 = document.createElement("a");
      a3.href = url;
      a3.download = "manual-mapping-export.json";
      a3.click();
      URL.revokeObjectURL(url);
    }
    async function handleLoadFile(files) {
      const file = files[0];
      if (!file) return;
      const text = await file.text();
      setCustomFilename(file.name);
      setCustomJsonText(text);
      setAnalyzeResult(null);
      setApplyResult(null);
      setErrorMessage(null);
      setSuccessMessage(`Loaded: ${file.name}`);
      parent.postMessage(
        { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_SET_CUSTOM_MAPPING, jsonText: text } },
        "*"
      );
    }
    const swapColumns = [
      { label: "Layer name", width: "30%" },
      { label: "Old component", width: "35%" },
      { label: "New component", width: "35%" }
    ];
    const legacyStyleColumns = [
      { label: "", width: 24 },
      { label: "Layer", width: "25%" },
      { label: "Style", width: "40%" },
      { label: "", width: "35%" }
    ];
    const pairsColumns = [
      { label: "Old component", width: "42%" },
      { label: "New component", width: "42%" },
      { label: "", width: "16%" }
    ];
    const cellStyle = {
      padding: "6px 8px",
      fontSize: 11,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    };
    const iconCellStyle = {
      padding: "6px 4px",
      textAlign: "center",
      verticalAlign: "middle"
    };
    if (!hasMapping) {
      return /* @__PURE__ */ _(Page, null, /* @__PURE__ */ _(
        ToolHeader,
        {
          title: "Library Swap",
          left: /* @__PURE__ */ _(IconButton, { onClick: onBack, title: "Home" }, /* @__PURE__ */ _(IconHome16, null))
        }
      ), /* @__PURE__ */ _(ToolBody, { mode: "state" }, /* @__PURE__ */ _(
        State,
        {
          title: "No mapping loaded",
          description: "Enable the built-in mapping or import a custom one"
        }
      )));
    }
    const analyzeLabel = isBusy && stage === "analyze" ? "Analyzing..." : "Analyze";
    const applyLabel = (() => {
      if (isBusy && stage === "apply") return "Applying...";
      if (analyzeResult) return `Apply swap (${analyzeResult.mappableInstances})`;
      return "Apply swap";
    })();
    return /* @__PURE__ */ _(Page, null, /* @__PURE__ */ _(
      ToolHeader,
      {
        title: "Library Swap",
        left: /* @__PURE__ */ _(IconButton, { onClick: onBack, title: "Home" }, /* @__PURE__ */ _(IconHome16, null))
      }
    ), /* @__PURE__ */ _(ToolBody, { mode: "content" }, /* @__PURE__ */ _(Stack, { space: "medium" }, /* @__PURE__ */ _(Stack, { space: "small" }, /* @__PURE__ */ _(Text, { style: { fontWeight: 600 } }, "Scope"), /* @__PURE__ */ _(
      ScopeControl,
      {
        value: scope,
        hasSelection,
        onValueChange: setScope,
        disabled: isBusy
      }
    )), analyzeResult && !isBusy && /* @__PURE__ */ _(Inline, { space: "extraSmall" }, /* @__PURE__ */ _(
      Button,
      {
        onClick: handlePreview,
        disabled: !canAct,
        secondary: true
      },
      isBusy && stage === "preview" ? "Previewing..." : "Preview"
    ), /* @__PURE__ */ _(
      Button,
      {
        onClick: handleClearPreviews,
        disabled: isBusy,
        secondary: true
      },
      "Clear previews"
    )), errorMessage && /* @__PURE__ */ _("div", { style: { padding: 8, background: "#fff1f2", borderRadius: 4 } }, /* @__PURE__ */ _(Text, { style: { color: "#9f1239" } }, errorMessage)), successMessage && !errorMessage && /* @__PURE__ */ _("div", { style: { padding: 8, background: "#ecfdf3", borderRadius: 4 } }, /* @__PURE__ */ _(Text, { style: { color: "#067647" } }, successMessage)), analyzeResult && !isBusy && (analyzeResult.mappableInstances > 0 ? /* @__PURE__ */ _(
      DataTable,
      {
        header: "Instances to swap",
        summary: `${analyzeResult.mappableInstances} mappable of ${analyzeResult.totalInstances} total (${analyzeResult.uniqueOldKeys} unique components)${analyzeResult.items.length < analyzeResult.mappableInstances ? ` \u2014 showing first ${analyzeResult.items.length}` : ""}`,
        columns: swapColumns
      },
      analyzeResult.items.map((item) => /* @__PURE__ */ _(
        "tr",
        {
          key: item.nodeId,
          style: { cursor: "pointer" },
          onClick: () => handleFocusNode(item.nodeId),
          title: "Click to focus on canvas"
        },
        /* @__PURE__ */ _("td", { style: cellStyle }, item.instanceName),
        /* @__PURE__ */ _("td", { style: cellStyle }, item.oldComponentName),
        /* @__PURE__ */ _("td", { style: cellStyle }, item.newComponentName)
      ))
    ) : /* @__PURE__ */ _("div", { style: { padding: 8, background: "var(--figma-color-bg-secondary)", borderRadius: 4 } }, /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)", fontSize: 11 } }, "No mappable instances found (", analyzeResult.totalInstances, " total scanned)"))), applyResult && !isBusy && /* @__PURE__ */ _(
      DataTable,
      {
        header: "Swapped instances",
        summary: `${applyResult.swapped} swapped, ${applyResult.skipped} skipped`,
        columns: swapColumns
      },
      applyResult.swappedItems.map((item) => /* @__PURE__ */ _(
        "tr",
        {
          key: item.nodeId,
          style: { cursor: "pointer" },
          onClick: () => handleFocusNode(item.nodeId),
          title: "Click to focus on canvas"
        },
        /* @__PURE__ */ _("td", { style: cellStyle }, item.name),
        /* @__PURE__ */ _("td", { style: cellStyle }, item.oldComponentName),
        /* @__PURE__ */ _("td", { style: cellStyle }, item.newComponentName)
      ))
    ), scanLegacyResult && !isBusy && /* @__PURE__ */ _(k, null, scanLegacyResult.components.length > 0 && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(VerticalSpace, { space: "small" }), /* @__PURE__ */ _(
      DataTable,
      {
        header: "Legacy components",
        summary: `${scanLegacyResult.components.length} component usage${scanLegacyResult.components.length !== 1 ? "s" : ""} found`,
        columns: [
          { label: "Layer", width: "25%" },
          { label: "Old component", width: "25%" },
          { label: "Status", width: "50%" }
        ]
      },
      scanLegacyResult.components.map((item, idx) => /* @__PURE__ */ _(
        "tr",
        {
          key: `${item.nodeId}-${idx}`,
          style: { cursor: "pointer" },
          onClick: () => handleFocusNode(item.nodeId),
          title: `${item.pageName} \u2014 click to focus`
        },
        /* @__PURE__ */ _("td", { style: cellStyle }, item.nodeName),
        /* @__PURE__ */ _("td", { style: cellStyle }, item.oldComponentName),
        /* @__PURE__ */ _("td", { style: cellStyle }, item.category === "mapped" && /* @__PURE__ */ _(Text, { style: { fontSize: 11, color: "#067647" } }, "\u2192 ", item.newComponentName), item.category === "text_only" && /* @__PURE__ */ _(Text, { style: { fontSize: 11, color: "#b45309" } }, item.description), item.category === "unmapped" && /* @__PURE__ */ _(Text, { style: { fontSize: 11, color: "#9f1239" } }, "No replacement"))
      ))
    )), scanLegacyResult.styles.length > 0 && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(VerticalSpace, { space: "small" }), /* @__PURE__ */ _(
      DataTable,
      {
        header: "Legacy color styles",
        summary: `${scanLegacyResult.styles.length} style usage${scanLegacyResult.styles.length !== 1 ? "s" : ""} found`,
        columns: legacyStyleColumns
      },
      scanLegacyResult.styles.map((item, idx) => {
        var _a;
        return /* @__PURE__ */ _(
          "tr",
          {
            key: `${item.nodeId}-${item.property}-${idx}`,
            style: { cursor: "pointer" },
            onClick: () => handleFocusNode(item.nodeId),
            title: `${item.pageName} \u2014 click to focus`
          },
          /* @__PURE__ */ _("td", { style: iconCellStyle }, /* @__PURE__ */ _(
            NodeTypeIcon,
            {
              type: item.property === "fill" ? "colorStyleFill" : "colorStyleStroke",
              color: (_a = item.colorHex) != null ? _a : void 0
            }
          )),
          /* @__PURE__ */ _("td", { style: cellStyle }, item.nodeName),
          /* @__PURE__ */ _("td", { style: cellStyle }, item.styleName),
          /* @__PURE__ */ _("td", { style: __spreadProps(__spreadValues({}, cellStyle), { textAlign: "center" }) }, item.isOverride && /* @__PURE__ */ _(
            Button,
            {
              secondary: true,
              onClick: (e3) => {
                e3.stopPropagation();
                handleResetOverride(item.nodeId, item.property);
              },
              style: { fontSize: 10, padding: "2px 6px" }
            },
            "Reset override"
          ))
        );
      })
    )), scanLegacyResult.styles.length === 0 && scanLegacyResult.components.length === 0 && /* @__PURE__ */ _("div", { style: { padding: 8, background: "#ecfdf3", borderRadius: 4 } }, /* @__PURE__ */ _(Text, { style: { color: "#067647" } }, "No legacy items found \u2014 clean!"))), /* @__PURE__ */ _(Divider, null), /* @__PURE__ */ _(Stack, { space: "small" }, /* @__PURE__ */ _(Text, { style: { fontWeight: 600 } }, "Mappings"), /* @__PURE__ */ _(
      Checkbox,
      {
        value: useBuiltInIcons,
        onValueChange: setUseBuiltInIcons
      },
      /* @__PURE__ */ _(Text, null, "Int UI Icons")
    ), /* @__PURE__ */ _(
      Checkbox,
      {
        value: useBuiltInUikit,
        onValueChange: setUseBuiltInUikit
      },
      /* @__PURE__ */ _(Text, null, "Int UI Kit Islands")
    )), /* @__PURE__ */ _(Divider, null), /* @__PURE__ */ _(Stack, { space: "small" }, /* @__PURE__ */ _(Text, { style: { fontWeight: 600 } }, "Manual pairs"), /* @__PURE__ */ _("div", { style: { display: "flex", gap: 12, fontSize: 11 } }, /* @__PURE__ */ _(Text, { style: { fontSize: 11, color: capturedOldName ? "var(--figma-color-text)" : "var(--figma-color-text-tertiary)" } }, "Old: ", capturedOldName != null ? capturedOldName : "\u2014"), /* @__PURE__ */ _(Text, { style: { fontSize: 11, color: capturedNewName ? "var(--figma-color-text)" : "var(--figma-color-text-tertiary)" } }, "New: ", capturedNewName != null ? capturedNewName : "\u2014")), /* @__PURE__ */ _(Inline, { space: "extraSmall" }, /* @__PURE__ */ _(
      Button,
      {
        secondary: true,
        onClick: handleCaptureOld,
        disabled: selectionSize === 0 || isBusy
      },
      "Capture Old"
    ), /* @__PURE__ */ _(
      Button,
      {
        secondary: true,
        onClick: handleCaptureNew,
        disabled: selectionSize === 0 || isBusy
      },
      "Capture New"
    )), manualPairs.length > 0 ? /* @__PURE__ */ _(
      DataTable,
      {
        header: "Recorded pairs",
        summary: `${manualPairs.length} pair${manualPairs.length !== 1 ? "s" : ""}`,
        columns: pairsColumns
      },
      manualPairs.map((pair) => /* @__PURE__ */ _("tr", { key: pair.oldKey }, /* @__PURE__ */ _("td", { style: cellStyle }, pair.oldName), /* @__PURE__ */ _("td", { style: cellStyle }, pair.newName), /* @__PURE__ */ _("td", { style: __spreadProps(__spreadValues({}, cellStyle), { textAlign: "center" }) }, /* @__PURE__ */ _(IconButton, { onClick: () => handleRemovePair(pair.oldKey), title: "Remove pair" }, /* @__PURE__ */ _(IconClose16, null)))))
    ) : /* @__PURE__ */ _(Text, { style: { fontSize: 11, color: "var(--figma-color-text-tertiary)" } }, "No pairs recorded yet"), /* @__PURE__ */ _(
      Button,
      {
        secondary: true,
        onClick: handleExportMapping,
        disabled: manualPairs.length === 0
      },
      "Export mapping"
    )))), /* @__PURE__ */ _(ToolFooter, null, isBusy && /* @__PURE__ */ _(Inline, { space: "extraSmall" }, /* @__PURE__ */ _(LoadingIndicator, null), /* @__PURE__ */ _(Text, null, progress ? progress.message : stage === "analyze" ? "Analyzing..." : stage === "preview" ? "Creating preview..." : "Swapping...")), /* @__PURE__ */ _("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ _("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ _(
      Button,
      {
        onClick: handleAnalyze,
        disabled: !canAct,
        fullWidth: true,
        secondary: true
      },
      analyzeLabel
    )), /* @__PURE__ */ _("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ _(
      Button,
      {
        onClick: handleApply,
        disabled: !canAct,
        fullWidth: true
      },
      applyLabel
    )))));
  }
  var init_LibrarySwapToolView = __esm({
    "src/app/views/library-swap-tool/LibrarySwapToolView.tsx"() {
      "use strict";
      init_lib2();
      init_preact_module();
      init_hooks_module();
      init_messages();
      init_DataTable();
      init_NodeTypeIcon();
      init_Page();
      init_ScopeControl();
      init_State();
      init_ToolBody();
      init_ToolFooter();
      init_ToolHeader();
    }
  });

  // src/app/components/DataList.tsx
  function DataList(props) {
    var _a;
    const children = H(props.children).filter(Boolean);
    const isEmpty = children.length === 0;
    return /* @__PURE__ */ _("div", null, props.header ? /* @__PURE__ */ _(
      Text,
      {
        style: {
          color: "var(--figma-color-text-secondary)",
          fontSize: 11,
          lineHeight: "16px",
          marginBottom: 6
        }
      },
      props.header
    ) : null, props.summary ? /* @__PURE__ */ _("div", { style: { marginBottom: 6 } }, typeof props.summary === "string" ? /* @__PURE__ */ _(
      Text,
      {
        style: {
          color: "var(--figma-color-text-tertiary)",
          fontSize: 11,
          lineHeight: "16px"
        }
      },
      props.summary
    ) : props.summary) : null, /* @__PURE__ */ _(
      "div",
      {
        style: {
          border: "1px solid var(--figma-color-border)",
          borderRadius: 6,
          overflow: "hidden"
        }
      },
      isEmpty ? /* @__PURE__ */ _("div", { style: { padding: 10 } }, /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-tertiary)" } }, (_a = props.emptyText) != null ? _a : "No items")) : children.map((child, index) => /* @__PURE__ */ _(
        "div",
        {
          key: index,
          style: {
            borderTop: index === 0 ? "none" : "1px solid var(--figma-color-border-secondary)"
          }
        },
        child
      ))
    ));
  }
  var init_DataList = __esm({
    "src/app/components/DataList.tsx"() {
      "use strict";
      init_preact_module();
      init_lib2();
    }
  });

  // src/app/components/DataRow.tsx
  function DataRow(props) {
    const [hovered, setHovered] = d2(false);
    const hasActions = props.actions && props.actions.length > 0;
    const hasSecondary = props.secondary != null;
    const hasTertiary = props.tertiary != null;
    const content = /* @__PURE__ */ _("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 } }, typeof props.primary === "string" ? /* @__PURE__ */ _(
      "div",
      {
        style: {
          color: "var(--figma-color-text)",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
          lineHeight: "20px"
        }
      },
      props.primary
    ) : props.primary, hasSecondary ? typeof props.secondary === "string" ? /* @__PURE__ */ _(
      "div",
      {
        style: {
          color: "var(--figma-color-text-secondary)",
          fontSize: 11,
          lineHeight: "16px",
          wordBreak: "break-all"
        }
      },
      props.secondary
    ) : props.secondary : null, hasTertiary ? typeof props.tertiary === "string" ? /* @__PURE__ */ _(
      "div",
      {
        style: {
          color: "var(--figma-color-text-tertiary)",
          fontSize: 11,
          lineHeight: "16px",
          wordBreak: "break-word"
        }
      },
      props.tertiary
    ) : props.tertiary : null, props.alert != null ? /* @__PURE__ */ _(
      "div",
      {
        style: {
          padding: "6px 8px",
          borderRadius: 4,
          background: "var(--figma-color-bg-warning-tertiary, #fff8e1)",
          border: "1px solid var(--figma-color-border-warning, #ffd54f)"
        }
      },
      typeof props.alert === "string" ? /* @__PURE__ */ _(
        "div",
        {
          style: {
            color: "var(--figma-color-text-warning)",
            fontSize: 11,
            lineHeight: "16px",
            wordBreak: "break-word"
          }
        },
        props.alert
      ) : props.alert
    ) : null);
    return (
      /* Wrapper div for the entire row*/
      /* @__PURE__ */ _(
        "div",
        {
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false),
          onClick: props.onClick,
          style: {
            padding: "4px 8px",
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            cursor: props.onClick ? "pointer" : "default",
            background: hovered ? "color-mix(in srgb, var(--figma-color-bg-hover) 50%, transparent)" : "transparent",
            transition: "background-color 120ms ease"
          }
        },
        props.checkbox ? /* @__PURE__ */ _("div", { style: { flexShrink: 0, paddingTop: 2 } }, /* @__PURE__ */ _(
          Checkbox,
          {
            value: props.checkbox.checked,
            onValueChange: props.checkbox.onChange
          },
          /* @__PURE__ */ _("span", null)
        )) : null,
        content,
        hasActions ? /* @__PURE__ */ _(
          "div",
          {
            style: {
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 4,
              opacity: hovered ? 1 : 0,
              pointerEvents: hovered ? "auto" : "none",
              transition: "opacity 120ms ease"
            }
          },
          props.actions.map((action, i3) => /* @__PURE__ */ _(
            IconButton,
            {
              key: i3,
              title: action.title,
              onClick: (e3) => {
                e3.preventDefault();
                e3.stopPropagation();
                action.onClick();
              }
            },
            action.icon
          ))
        ) : null,
        props.trailing != null ? /* @__PURE__ */ _("div", { style: { flexShrink: 0, paddingTop: 2 } }, props.trailing) : null
      )
    );
  }
  var init_DataRow = __esm({
    "src/app/components/DataRow.tsx"() {
      "use strict";
      init_preact_module();
      init_hooks_module();
      init_lib2();
    }
  });

  // src/app/components/InlineTextDiff.tsx
  function splitDiff(before, after) {
    const a3 = String(before != null ? before : "");
    const b2 = String(after != null ? after : "");
    const min = Math.min(a3.length, b2.length);
    let start = 0;
    while (start < min && a3[start] === b2[start]) start += 1;
    let endA = a3.length - 1;
    let endB = b2.length - 1;
    while (endA >= start && endB >= start && a3[endA] === b2[endB]) {
      endA -= 1;
      endB -= 1;
    }
    return {
      prefix: a3.slice(0, start),
      beforeMid: a3.slice(start, endA + 1),
      afterMid: b2.slice(start, endB + 1),
      suffix: a3.slice(endA + 1)
    };
  }
  function renderInlineDiff(before, after) {
    const { prefix, beforeMid, afterMid, suffix } = splitDiff(before, after);
    return {
      beforeNode: /* @__PURE__ */ _("span", null, prefix ? /* @__PURE__ */ _("span", null, prefix) : null, beforeMid ? /* @__PURE__ */ _("span", { style: removedStyle }, beforeMid) : null, suffix ? /* @__PURE__ */ _("span", null, suffix) : null),
      afterNode: /* @__PURE__ */ _("span", null, prefix ? /* @__PURE__ */ _("span", null, prefix) : null, afterMid ? /* @__PURE__ */ _("span", { style: addedStyle }, afterMid) : null, suffix ? /* @__PURE__ */ _("span", null, suffix) : null)
    };
  }
  var removedStyle, addedStyle;
  var init_InlineTextDiff = __esm({
    "src/app/components/InlineTextDiff.tsx"() {
      "use strict";
      init_preact_module();
      removedStyle = {
        background: "#fff1f2",
        border: "1px solid #fecdd3",
        color: "#9f1239",
        borderRadius: 4,
        padding: "0 2px",
        fontWeight: 700
      };
      addedStyle = {
        background: "#ecfdf3",
        border: "1px solid #b7f0c9",
        color: "#067647",
        borderRadius: 4,
        padding: "0 2px",
        fontWeight: 700
      };
    }
  });

  // src/app/components/ToolTabs.tsx
  function ToolTabs({ value: value2, onValueChange, options }) {
    return /* @__PURE__ */ _("div", { style: { paddingLeft: 4 }, "data-tool-tabs": true }, /* @__PURE__ */ _(Tabs, { value: value2, onValueChange, options }), /* @__PURE__ */ _("style", null, `[data-tool-tabs] > div:first-child { border-bottom: none; }`));
  }
  var init_ToolTabs = __esm({
    "src/app/components/ToolTabs.tsx"() {
      "use strict";
      init_lib2();
      init_preact_module();
    }
  });

  // src/app/views/print-color-usages-tool/PrintColorUsagesToolView.tsx
  function PrintColorUsagesToolView(props) {
    const [settings, setSettings] = d2(DEFAULT_SETTINGS);
    const [activeTab, setActiveTab] = d2("Print");
    const [loaded, setLoaded] = d2(false);
    const [status, setStatus] = d2({ status: "idle" });
    const [selectionSize, setSelectionSize] = d2(0);
    const [scope, setScope] = d2("page");
    const [preview, setPreview] = d2(null);
    const [selectedPreviewNodeIds, setSelectedPreviewNodeIds] = d2([]);
    const [printPreview, setPrintPreview] = d2(null);
    const [settingsOpen, setSettingsOpen] = d2(false);
    y2(() => {
      const handleMessage = (event) => {
        var _a;
        const msg = (_a = event.data) == null ? void 0 : _a.pluginMessage;
        if (!msg) return;
        if (msg.type === MAIN_TO_UI.BOOTSTRAPPED) {
          setSelectionSize(msg.selectionSize);
          return;
        }
        if (msg.type === MAIN_TO_UI.PRINT_COLOR_USAGES_SETTINGS) {
          setSettings(__spreadProps(__spreadValues({}, msg.settings), { textTheme: "dark" }));
          setLoaded(true);
          return;
        }
        if (msg.type === MAIN_TO_UI.PRINT_COLOR_USAGES_SELECTION) {
          setSelectionSize(msg.selectionSize);
          return;
        }
        if (msg.type === MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS) {
          setStatus(msg.status);
          return;
        }
        if (msg.type === MAIN_TO_UI.PRINT_COLOR_USAGES_UPDATE_PREVIEW) {
          setPreview(msg.payload);
          setSelectedPreviewNodeIds(msg.payload.entries.map((entry) => entry.nodeId));
          return;
        }
        if (msg.type === MAIN_TO_UI.PRINT_COLOR_USAGES_PRINT_PREVIEW) {
          setPrintPreview(msg.payload);
          return;
        }
      };
      window.addEventListener("message", handleMessage);
      parent.postMessage({ pluginMessage: { type: UI_TO_MAIN.PRINT_COLOR_USAGES_LOAD_SETTINGS } }, "*");
      return () => window.removeEventListener("message", handleMessage);
    }, []);
    y2(() => {
      if (!loaded) return;
      setPreview(null);
      setSelectedPreviewNodeIds([]);
      setPrintPreview(null);
      parent.postMessage(
        { pluginMessage: { type: UI_TO_MAIN.PRINT_COLOR_USAGES_SAVE_SETTINGS, settings } },
        "*"
      );
    }, [loaded, settings]);
    const isWorking = status.status === "working";
    const selectedPreviewNodeIdSet = T2(() => new Set(selectedPreviewNodeIds), [selectedPreviewNodeIds]);
    const selectedPreviewCount = selectedPreviewNodeIds.length;
    const hasPreviewChanges = selectedPreviewCount > 0;
    const hasSelection = selectionSize > 0;
    y2(() => {
      if (hasSelection) {
        setScope("selection");
      } else if (scope === "selection") {
        setScope("page");
      }
    }, [hasSelection]);
    const applyLabel = T2(() => {
      var _a;
      const s3 = (_a = preview == null ? void 0 : preview.scope) != null ? _a : scope;
      if (s3 === "selection") return "Apply in Selection";
      if (s3 === "all_pages") return "Apply on All Pages";
      return "Apply on Page";
    }, [scope, preview]);
    return /* @__PURE__ */ _(Page, null, /* @__PURE__ */ _(
      ToolHeader,
      {
        title: "Print Color Usages",
        left: /* @__PURE__ */ _(IconButton, { onClick: props.onBack, title: "Home" }, /* @__PURE__ */ _(IconHome16, null))
      }
    ), /* @__PURE__ */ _("div", { style: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column" } }, /* @__PURE__ */ _(
      ToolTabs,
      {
        value: activeTab,
        onValueChange: (value2) => setActiveTab(value2 === "Update" ? "Update" : "Print"),
        options: [
          { value: "Print", children: null },
          { value: "Update", children: null }
        ]
      }
    ), /* @__PURE__ */ _(ToolBody, { mode: "content" }, /* @__PURE__ */ _(Stack, { space: "small" }, activeTab === "Print" ? /* @__PURE__ */ _(Stack, { space: "small" }, /* @__PURE__ */ _(
      Disclosure,
      {
        open: settingsOpen,
        onClick: () => setSettingsOpen(!settingsOpen),
        title: "Settings"
      },
      /* @__PURE__ */ _("div", null, /* @__PURE__ */ _(Stack, { space: "small" }, /* @__PURE__ */ _(Stack, { space: "extraSmall" }, /* @__PURE__ */ _(Text, null, "Printed text position"), /* @__PURE__ */ _(
        RadioButtons,
        {
          direction: "horizontal",
          value: settings.textPosition,
          onValueChange: (value2) => setSettings((s3) => __spreadProps(__spreadValues({}, s3), {
            textPosition: value2 === "left" || value2 === "right" ? value2 : "right"
          })),
          options: [
            { value: "left", children: /* @__PURE__ */ _(Text, null, "Left") },
            { value: "right", children: /* @__PURE__ */ _(Text, null, "Right") }
          ]
        }
      )), /* @__PURE__ */ _(Stack, { space: "extraSmall" }, /* @__PURE__ */ _(Text, null, "Distance"), /* @__PURE__ */ _(
        TextboxNumeric,
        {
          value: String(settings.printDistance),
          onNumericValueInput: (value2) => setSettings((s3) => __spreadProps(__spreadValues({}, s3), { printDistance: value2 != null ? value2 : 16 })),
          minimum: 0,
          integer: true,
          suffix: " px"
        }
      )), /* @__PURE__ */ _(Stack, { space: "extraSmall" }, /* @__PURE__ */ _(
        Checkbox,
        {
          value: settings.showLinkedColors,
          onValueChange: (value2) => setSettings((s3) => __spreadProps(__spreadValues({}, s3), { showLinkedColors: value2 }))
        },
        /* @__PURE__ */ _(Text, null, "Show linked colors")
      ), /* @__PURE__ */ _(
        Checkbox,
        {
          value: settings.hideFolderNames,
          onValueChange: (value2) => setSettings((s3) => __spreadProps(__spreadValues({}, s3), { hideFolderNames: value2 }))
        },
        /* @__PURE__ */ _(Text, null, "Hide folder prefixes (after ", "\u201C", "/", "\u201D", ")")
      ), /* @__PURE__ */ _(
        Checkbox,
        {
          value: settings.checkNested,
          onValueChange: (value2) => setSettings((s3) => __spreadProps(__spreadValues({}, s3), { checkNested: value2 }))
        },
        /* @__PURE__ */ _(Text, null, "Check colors of nested items")
      )), /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)" } }, "Text color is from Mockup markup")))
    ), printPreview && printPreview.entries.length > 0 ? /* @__PURE__ */ _(DataList, { header: "Will be printed" }, printPreview.entries.map((entry, index) => /* @__PURE__ */ _(
      DataRow,
      {
        key: `${entry.layerName}-${index}`,
        primary: entry.label,
        secondary: entry.layerName,
        trailing: /* @__PURE__ */ _(CopyIconButton, { text: entry.layerName, title: "Copy layer name" })
      }
    ))) : null, !printPreview && selectionSize > 0 ? /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-tertiary)" } }, "Loading", "\u2026") : null, printPreview && printPreview.entries.length === 0 && selectionSize > 0 ? /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-tertiary)" } }, "No colors found in selection.") : null) : null, activeTab === "Update" ? /* @__PURE__ */ _(Stack, { space: "small" }, /* @__PURE__ */ _(
      Checkbox,
      {
        value: settings.checkByContent,
        onValueChange: (value2) => setSettings((s3) => __spreadProps(__spreadValues({}, s3), { checkByContent: value2 }))
      },
      /* @__PURE__ */ _(Text, null, "Check by content")
    ), /* @__PURE__ */ _(
      ScopeControl,
      {
        value: scope,
        hasSelection,
        onValueChange: setScope
      }
    ), /* @__PURE__ */ _(
      Button,
      {
        secondary: true,
        loading: isWorking,
        onClick: () => {
          setStatus({ status: "working", message: "Checking changes\u2026" });
          parent.postMessage(
            {
              pluginMessage: {
                type: UI_TO_MAIN.PRINT_COLOR_USAGES_PREVIEW_UPDATE,
                settings,
                scope
              }
            },
            "*"
          );
        }
      },
      "Check changes"
    ), isWorking && status.status === "working" && status.message ? /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)" } }, status.message) : null, preview ? preview.entries.length === 0 ? /* @__PURE__ */ _(
      DataList,
      {
        header: "Changes found",
        summary: `Candidates: ${preview.totals.candidates} | Changes: ${preview.totals.changed} | Unchanged: ${preview.totals.unchanged} | Skipped: ${preview.totals.skipped}`,
        emptyText: "No text changes found."
      },
      null
    ) : /* @__PURE__ */ _(Stack, { space: "extraSmall" }, /* @__PURE__ */ _("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)" } }, "Selected: ", selectedPreviewCount, " / ", preview.entries.length), /* @__PURE__ */ _("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ _(
      Button,
      {
        secondary: true,
        onClick: () => setSelectedPreviewNodeIds(preview.entries.map((entry) => entry.nodeId))
      },
      "Select all"
    ), /* @__PURE__ */ _(Button, { secondary: true, onClick: () => setSelectedPreviewNodeIds([]) }, "Clear"), /* @__PURE__ */ _(
      Button,
      {
        secondary: true,
        disabled: selectedPreviewCount === 0,
        onClick: () => {
          const idsToReset = [...selectedPreviewNodeIds];
          parent.postMessage(
            {
              pluginMessage: {
                type: UI_TO_MAIN.PRINT_COLOR_USAGES_RESET_LAYER_NAMES,
                nodeIds: idsToReset
              }
            },
            "*"
          );
          const resetSet = new Set(idsToReset);
          setPreview(
            (prev) => prev ? __spreadProps(__spreadValues({}, prev), {
              entries: prev.entries.filter((e3) => !resetSet.has(e3.nodeId))
            }) : prev
          );
          setSelectedPreviewNodeIds(
            (prev) => prev.filter((id) => !resetSet.has(id))
          );
        }
      },
      "Reset names"
    ))), /* @__PURE__ */ _(
      DataList,
      {
        header: "Changes found",
        summary: `Candidates: ${preview.totals.candidates} | Changes: ${preview.totals.changed} | Unchanged: ${preview.totals.unchanged} | Skipped: ${preview.totals.skipped}`
      },
      preview.entries.map((entry) => {
        var _a, _b;
        const isChecked = selectedPreviewNodeIdSet.has(entry.nodeId);
        const textDiff = renderInlineDiff((_a = entry.oldText) != null ? _a : "", (_b = entry.newText) != null ? _b : "");
        return /* @__PURE__ */ _(
          "div",
          {
            key: entry.nodeId,
            style: {
              padding: 10,
              background: isChecked ? "var(--figma-color-bg-secondary)" : "var(--figma-color-bg)"
            }
          },
          /* @__PURE__ */ _(
            Checkbox,
            {
              value: isChecked,
              onValueChange: (value2) => setSelectedPreviewNodeIds(
                (prev) => value2 ? prev.includes(entry.nodeId) ? prev : [...prev, entry.nodeId] : prev.filter((id) => id !== entry.nodeId)
              )
            },
            /* @__PURE__ */ _(Text, null, entry.nodeName)
          ),
          /* @__PURE__ */ _(
            "button",
            {
              type: "button",
              onClick: () => parent.postMessage(
                {
                  pluginMessage: {
                    type: UI_TO_MAIN.PRINT_COLOR_USAGES_FOCUS_NODE,
                    nodeId: entry.nodeId
                  }
                },
                "*"
              ),
              style: {
                marginTop: 4,
                width: "100%",
                display: "block",
                border: "none",
                background: "transparent",
                textAlign: "left",
                padding: "0 0 0 24px",
                cursor: "pointer"
              }
            },
            /* @__PURE__ */ _(
              Text,
              {
                style: {
                  color: "var(--figma-color-text-secondary)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  lineHeight: "20px"
                }
              },
              "Old: ",
              textDiff.beforeNode
            ),
            /* @__PURE__ */ _(
              Text,
              {
                style: {
                  color: "var(--figma-color-text)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  lineHeight: "20px"
                }
              },
              "New: ",
              textDiff.afterNode
            ),
            entry.layerNameChanged ? /* @__PURE__ */ _(
              Text,
              {
                style: {
                  color: "var(--figma-color-text-secondary)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  lineHeight: "18px"
                }
              },
              "Layer: ",
              entry.oldLayerName || "(empty)",
              " ",
              "->",
              "  ",
              entry.newLayerName || "(empty)"
            ) : null
          ),
          entry.contentMismatch ? /* @__PURE__ */ _(
            "div",
            {
              style: {
                marginTop: 4,
                marginLeft: 24,
                padding: "6px 8px",
                borderRadius: 4,
                background: "var(--figma-color-bg-warning-tertiary, #fff8e1)",
                border: "1px solid var(--figma-color-border-warning, #ffd54f)"
              }
            },
            /* @__PURE__ */ _(
              Text,
              {
                style: {
                  color: "var(--figma-color-text-warning)",
                  fontSize: 11,
                  lineHeight: "16px",
                  wordBreak: "break-word"
                }
              },
              'Layer name points to "',
              entry.contentMismatch.layerVariableName,
              '" but text content matches "',
              entry.contentMismatch.contentVariableName,
              '"'
            )
          ) : null,
          /* @__PURE__ */ _("div", { style: { paddingLeft: 24, marginTop: 2 } }, /* @__PURE__ */ _(
            Text,
            {
              style: {
                color: "var(--figma-color-text-tertiary)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: "16px",
                fontSize: 11
              }
            },
            "Resolved by:",
            " ",
            entry.resolvedBy === "layer_variable_id" ? "layer VariableID" : entry.resolvedBy === "layer_name" ? "layer name" : "text content fallback"
          ))
        );
      })
    )) : null) : null)), /* @__PURE__ */ _(Divider, null), /* @__PURE__ */ _(Container, { space: "small" }, /* @__PURE__ */ _(VerticalSpace, { space: "small" }), activeTab === "Print" ? /* @__PURE__ */ _(
      Button,
      {
        fullWidth: true,
        loading: isWorking,
        onClick: () => parent.postMessage({ pluginMessage: { type: UI_TO_MAIN.PRINT_COLOR_USAGES_PRINT, settings } }, "*")
      },
      "Print"
    ) : /* @__PURE__ */ _(
      Button,
      {
        fullWidth: true,
        loading: isWorking,
        disabled: !hasPreviewChanges,
        onClick: () => parent.postMessage(
          {
            pluginMessage: {
              type: UI_TO_MAIN.PRINT_COLOR_USAGES_UPDATE,
              settings,
              targetNodeIds: selectedPreviewNodeIds
            }
          },
          "*"
        )
      },
      applyLabel
    ), /* @__PURE__ */ _(VerticalSpace, { space: "small" }))));
  }
  var DEFAULT_SETTINGS;
  var init_PrintColorUsagesToolView = __esm({
    "src/app/views/print-color-usages-tool/PrintColorUsagesToolView.tsx"() {
      "use strict";
      init_lib2();
      init_preact_module();
      init_hooks_module();
      init_messages();
      init_CopyIconButton();
      init_DataList();
      init_DataRow();
      init_InlineTextDiff();
      init_Page();
      init_ScopeControl();
      init_ToolBody();
      init_ToolHeader();
      init_ToolTabs();
      DEFAULT_SETTINGS = {
        textPosition: "right",
        showLinkedColors: true,
        hideFolderNames: true,
        textTheme: "dark",
        checkByContent: false,
        checkNested: true,
        printDistance: 16
      };
    }
  });

  // src/app/views/variables-export-import-tool/VariablesExportImportToolView.tsx
  function downloadTextFile(filename, text) {
    const blob = new Blob([text], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a3 = document.createElement("a");
    a3.href = url;
    a3.download = filename;
    document.body.appendChild(a3);
    a3.click();
    a3.remove();
    URL.revokeObjectURL(url);
  }
  function getStatusPillStyle(status) {
    if (status === "conflict" || status === "missing_collection" || status === "invalid") {
      return { background: "#fff1f2", borderColor: "#fecdd3", color: "#9f1239" };
    }
    if (status === "create" || status === "update" || status === "rename") {
      return { background: "#ecfdf3", borderColor: "#b7f0c9", color: "#067647" };
    }
    return { background: "#fff7ed", borderColor: "#fed7aa", color: "#9a3412" };
  }
  function VariablesExportImportToolView({ onBack }) {
    const [collections, setCollections] = d2([]);
    const [errorMessage, setErrorMessage] = d2(null);
    const [successMessage, setSuccessMessage] = d2(null);
    const [exportSelectedCollectionIds, setExportSelectedCollectionIds] = d2([]);
    const [didInitExportSelection, setDidInitExportSelection] = d2(false);
    const [snapshotFiles, setSnapshotFiles] = d2([]);
    const [snapshotStatus, setSnapshotStatus] = d2(null);
    const [exportBusy, setExportBusy] = d2(false);
    const [importFilename, setImportFilename] = d2(null);
    const [importFile, setImportFile] = d2(null);
    const [importJsonText, setImportJsonText] = d2("");
    const [importPreview, setImportPreview] = d2(null);
    const [importBusy, setImportBusy] = d2(false);
    const [importResult, setImportResult] = d2(null);
    y2(() => {
      const handleMessage = (event) => {
        var _a;
        const msg = (_a = event.data) == null ? void 0 : _a.pluginMessage;
        if (!msg) return;
        if (msg.type === MAIN_TO_UI.EXPORT_IMPORT_COLLECTIONS_LIST) {
          setCollections(msg.collections);
          if (!didInitExportSelection) {
            setExportSelectedCollectionIds(msg.collections.map((collection) => collection.id));
            setDidInitExportSelection(true);
          }
        }
        if (msg.type === MAIN_TO_UI.EXPORT_IMPORT_SNAPSHOT_READY) {
          const files = Array.isArray(msg.payload.files) ? msg.payload.files : [];
          setSnapshotFiles(files);
          setExportBusy(false);
          if (files.length === 0) {
            setSnapshotStatus("No collections to export.");
            setSuccessMessage("Snapshot export: nothing to export");
            return;
          }
          if (files.length === 1) {
            downloadTextFile(files[0].filename, files[0].jsonText);
            setSnapshotStatus(`Exported: ${files[0].filename}`);
            setSuccessMessage(`Snapshot exported "${files[0].filename}"`);
            return;
          }
          setSnapshotStatus(
            `Snapshot ready: ${files.length} file(s). Use Download buttons below.`
          );
          setSuccessMessage(`Snapshot ready (${files.length} files)`);
        }
        if (msg.type === MAIN_TO_UI.EXPORT_IMPORT_PREVIEW) {
          setImportPreview(msg.payload);
          setImportBusy(false);
          setImportResult(null);
          setErrorMessage(null);
          setSuccessMessage(
            `Snapshot preview: create ${msg.payload.totals.create}, update ${msg.payload.totals.update}, rename ${msg.payload.totals.rename}, conflicts ${msg.payload.totals.conflicts}`
          );
        }
        if (msg.type === MAIN_TO_UI.EXPORT_IMPORT_APPLY_RESULT) {
          setImportBusy(false);
          setImportResult(msg.payload);
          setSuccessMessage(
            `Snapshot imported: created ${msg.payload.totals.created}, updated ${msg.payload.totals.updated}, renamed ${msg.payload.totals.renamed}, failed ${msg.payload.totals.failed}`
          );
        }
        if (msg.type === MAIN_TO_UI.ERROR) {
          setErrorMessage(msg.message);
          setExportBusy(false);
          setImportBusy(false);
        }
      };
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }, [didInitExportSelection]);
    y2(() => {
      if (!successMessage) return;
      const t3 = window.setTimeout(() => setSuccessMessage(null), 4500);
      return () => window.clearTimeout(t3);
    }, [successMessage]);
    const exportCollectionsOptions = T2(
      () => collections,
      [collections]
    );
    const allCollectionIds = T2(
      () => exportCollectionsOptions.map((c3) => c3.id),
      [exportCollectionsOptions]
    );
    const selectedCollectionIdsInOptions = T2(
      () => exportSelectedCollectionIds.filter((id) => allCollectionIds.includes(id)),
      [allCollectionIds, exportSelectedCollectionIds]
    );
    const areAllCollectionsSelected = exportCollectionsOptions.length > 0 && selectedCollectionIdsInOptions.length === exportCollectionsOptions.length;
    const hasSomeCollectionsSelected = selectedCollectionIdsInOptions.length > 0 && !areAllCollectionsSelected;
    const exportSelectedFilesCount = selectedCollectionIdsInOptions.length;
    const exportButtonLabel = `Export ${exportSelectedFilesCount} file${exportSelectedFilesCount === 1 ? "" : "s"}`;
    const importRows = T2(() => {
      var _a;
      const entries = (_a = importPreview == null ? void 0 : importPreview.entries) != null ? _a : [];
      const order = (status) => {
        switch (status) {
          case "conflict":
            return 0;
          case "missing_collection":
            return 1;
          case "invalid":
            return 2;
          case "create":
            return 3;
          case "rename":
            return 4;
          case "update":
            return 5;
          default:
            return 10;
        }
      };
      return entries.slice().sort(
        (a3, b2) => order(a3.status) - order(b2.status) || a3.collectionName.localeCompare(b2.collectionName) || a3.variableName.localeCompare(b2.variableName)
      );
    }, [importPreview]);
    const canApplyImport = importPreview !== null && (importPreview.totals.create > 0 || importPreview.totals.update > 0 || importPreview.totals.rename > 0) && importPreview.totals.conflicts === 0;
    const handleExport = () => {
      if (selectedCollectionIdsInOptions.length === 0) {
        setSnapshotStatus("Select at least one collection to export.");
        return;
      }
      setSnapshotStatus(null);
      setSuccessMessage(null);
      setSnapshotFiles([]);
      setExportBusy(true);
      parent.postMessage(
        {
          pluginMessage: {
            type: UI_TO_MAIN.EXPORT_IMPORT_EXPORT_SNAPSHOT,
            request: {
              collectionIds: selectedCollectionIdsInOptions
            }
          }
        },
        "*"
      );
    };
    const handleImportFile = async (files) => {
      const file = files[0];
      if (!file) return;
      setImportBusy(true);
      setSuccessMessage(null);
      setImportFilename(file.name);
      setImportFile(file);
      const text = await file.text();
      setImportJsonText(text);
      parent.postMessage(
        {
          pluginMessage: {
            type: UI_TO_MAIN.EXPORT_IMPORT_PREVIEW_SNAPSHOT,
            request: { jsonText: text }
          }
        },
        "*"
      );
    };
    const handlePreviewAgain = async () => {
      const cached = importJsonText.trim();
      if (!importFile && !cached) return;
      setImportBusy(true);
      setSuccessMessage(null);
      if (importFile) {
        const text = await importFile.text();
        setImportJsonText(text);
        parent.postMessage(
          {
            pluginMessage: {
              type: UI_TO_MAIN.EXPORT_IMPORT_PREVIEW_SNAPSHOT,
              request: { jsonText: text }
            }
          },
          "*"
        );
        return;
      }
      parent.postMessage(
        {
          pluginMessage: {
            type: UI_TO_MAIN.EXPORT_IMPORT_PREVIEW_SNAPSHOT,
            request: { jsonText: importJsonText }
          }
        },
        "*"
      );
    };
    const handleApplyImport = () => {
      if (!importJsonText.trim()) return;
      setImportBusy(true);
      setSuccessMessage(null);
      parent.postMessage(
        {
          pluginMessage: {
            type: UI_TO_MAIN.EXPORT_IMPORT_APPLY_SNAPSHOT,
            request: { jsonText: importJsonText }
          }
        },
        "*"
      );
    };
    return /* @__PURE__ */ _(Page, null, /* @__PURE__ */ _(
      ToolHeader,
      {
        title: "Variables Export/Import",
        left: /* @__PURE__ */ _(IconButton, { onClick: onBack, title: "Home" }, /* @__PURE__ */ _(IconHome16, null))
      }
    ), /* @__PURE__ */ _(ToolBody, { mode: "content" }, /* @__PURE__ */ _(Stack, { space: "medium" }, errorMessage && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("div", { style: { padding: 8, background: "#fff1f2", borderRadius: 4 } }, /* @__PURE__ */ _(Text, { style: { color: "#9f1239" } }, errorMessage))), successMessage && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("div", { style: { padding: 8, background: "#ecfdf3", borderRadius: 4 } }, /* @__PURE__ */ _(Text, { style: { color: "#067647" } }, successMessage))), /* @__PURE__ */ _(Stack, { space: "extraSmall" }, /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)" } }, "Export variables as separate JSON files")), /* @__PURE__ */ _(Stack, { space: "small" }, /* @__PURE__ */ _(Text, null, "Collections"), /* @__PURE__ */ _("div", null, exportCollectionsOptions.length === 0 ? /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)" } }, "No collections loaded yet.") : null, exportCollectionsOptions.length > 0 ? /* @__PURE__ */ _(
      Checkbox,
      {
        value: hasSomeCollectionsSelected ? MIXED_BOOLEAN : areAllCollectionsSelected,
        disabled: exportBusy,
        onValueChange: (next) => setExportSelectedCollectionIds(next ? allCollectionIds : [])
      },
      /* @__PURE__ */ _(Text, null, "Collections")
    ) : null, /* @__PURE__ */ _(VerticalSpace, { space: "extraSmall" }), /* @__PURE__ */ _(Stack, { space: "extraSmall", style: { marginLeft: 20 } }, exportCollectionsOptions.map((c3) => {
      const checked = exportSelectedCollectionIds.includes(c3.id);
      return /* @__PURE__ */ _(
        Checkbox,
        {
          key: c3.id,
          value: checked,
          disabled: exportBusy,
          onValueChange: (next) => {
            setExportSelectedCollectionIds((prev) => {
              if (next) {
                return prev.includes(c3.id) ? prev : [...prev, c3.id];
              }
              return prev.filter((id) => id !== c3.id);
            });
          }
        },
        /* @__PURE__ */ _(Text, null, c3.name, " (", c3.variableCount, " vars, ", c3.modeCount, " modes)")
      );
    })))), /* @__PURE__ */ _(Button, { onClick: handleExport, disabled: exportBusy || exportSelectedFilesCount === 0 }, exportBusy ? "Exporting..." : exportButtonLabel), exportBusy && /* @__PURE__ */ _(Inline, { space: "extraSmall" }, /* @__PURE__ */ _(LoadingIndicator, null), /* @__PURE__ */ _(Text, null, "Generating snapshot files...")), snapshotStatus && /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)" } }, snapshotStatus), snapshotFiles.length > 1 && /* @__PURE__ */ _(Stack, { space: "small" }, /* @__PURE__ */ _(Text, null, "Download individual files:"), /* @__PURE__ */ _("div", null, snapshotFiles.map((f3, i3) => /* @__PURE__ */ _("div", { key: i3, style: { marginBottom: 4 } }, /* @__PURE__ */ _(
      Button,
      {
        secondary: true,
        onClick: () => downloadTextFile(f3.filename, f3.jsonText)
      },
      f3.filename
    )))))), /* @__PURE__ */ _(VerticalSpace, { space: "large" }), /* @__PURE__ */ _(Divider, null), /* @__PURE__ */ _(VerticalSpace, { space: "large" }), /* @__PURE__ */ _(Stack, { space: "medium" }, /* @__PURE__ */ _(Stack, { space: "extraSmall" }, /* @__PURE__ */ _(Text, { style: { fontWeight: 600 } }, "Import Variables Snapshot"), /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)" } }, "Import a snapshot JSON file. Variables will be created, updated, or renamed based on the snapshot content.")), /* @__PURE__ */ _(Inline, { space: "extraSmall" }, /* @__PURE__ */ _(
      FileUploadButton,
      {
        acceptedFileTypes: [".json", "application/json"],
        onSelectedFiles: handleImportFile
      },
      "Choose JSON file\u2026"
    ), /* @__PURE__ */ _(
      Button,
      {
        secondary: true,
        disabled: !importFile && !importJsonText.trim() || importBusy,
        onClick: handlePreviewAgain
      },
      "Preview again"
    )), importBusy && /* @__PURE__ */ _(Inline, { space: "extraSmall" }, /* @__PURE__ */ _(LoadingIndicator, null), /* @__PURE__ */ _(Text, null, "Processing import...")), importPreview && /* @__PURE__ */ _(Stack, { space: "small" }, importFilename && /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)" } }, "Loaded file: ", importFilename), /* @__PURE__ */ _(Text, null, "Rows: ", importPreview.totals.considered, " \xB7 create ", importPreview.totals.create, " \xB7 update ", importPreview.totals.update, " \xB7 rename ", importPreview.totals.rename, " \xB7 conflicts ", importPreview.totals.conflicts, " \xB7 missing collections", " ", importPreview.totals.missingCollections, " \xB7 invalid ", importPreview.totals.invalid), /* @__PURE__ */ _(
      Button,
      {
        loading: importBusy,
        disabled: importBusy || !canApplyImport,
        onClick: handleApplyImport
      },
      "Apply Import"
    ), !canApplyImport && importPreview.totals.conflicts > 0 && /* @__PURE__ */ _(Text, { style: { color: "#9f1239" } }, "Resolve conflicts before applying."), importResult && /* @__PURE__ */ _(Text, { style: { color: "#067647" } }, "Created: ", importResult.totals.created, ", Updated: ", importResult.totals.updated, ", Renamed: ", importResult.totals.renamed, ", Skipped: ", importResult.totals.skipped, ", Failed: ", importResult.totals.failed), /* @__PURE__ */ _(Divider, null), /* @__PURE__ */ _(DataTable, { columns: importPreviewColumns }, importRows.map((entry, i3) => {
      const pillStyle = getStatusPillStyle(entry.status);
      return /* @__PURE__ */ _("tr", { key: i3 }, /* @__PURE__ */ _("td", { style: { padding: "4px 8px", verticalAlign: "top" } }, /* @__PURE__ */ _(
        "span",
        {
          style: {
            display: "inline-block",
            padding: "2px 6px",
            borderRadius: 4,
            fontSize: 10,
            fontWeight: 600,
            background: pillStyle.background,
            border: `1px solid ${pillStyle.borderColor}`,
            color: pillStyle.color
          }
        },
        entry.status
      )), /* @__PURE__ */ _("td", { style: { padding: "4px 8px", verticalAlign: "top", wordBreak: "break-word" } }, entry.collectionName), /* @__PURE__ */ _("td", { style: { padding: "4px 8px", verticalAlign: "top", wordBreak: "break-word" } }, entry.variableName), /* @__PURE__ */ _(
        "td",
        {
          style: {
            padding: "4px 8px",
            verticalAlign: "top",
            color: "var(--figma-color-text-tertiary)",
            wordBreak: "break-word"
          }
        },
        entry.reason || ""
      ));
    }))))));
  }
  var importPreviewColumns;
  var init_VariablesExportImportToolView = __esm({
    "src/app/views/variables-export-import-tool/VariablesExportImportToolView.tsx"() {
      "use strict";
      init_lib2();
      init_lib();
      init_preact_module();
      init_hooks_module();
      init_messages();
      init_DataTable();
      init_Page();
      init_ToolBody();
      init_ToolHeader();
      importPreviewColumns = [
        { label: "Status" },
        { label: "Collection" },
        { label: "Variable" },
        { label: "Note" }
      ];
    }
  });

  // src/app/views/variables-batch-rename-tool/VariablesBatchRenameToolView.tsx
  function downloadTextFile2(filename, text) {
    const blob = new Blob([text], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a3 = document.createElement("a");
    a3.href = url;
    a3.download = filename;
    document.body.appendChild(a3);
    a3.click();
    a3.remove();
    URL.revokeObjectURL(url);
  }
  async function copyTextToClipboard2(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e3) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
        return true;
      } catch (e4) {
        return false;
      }
    }
  }
  function getStatusPillStyle2(status) {
    if (status === "conflict") {
      return { background: "#fff1f2", borderColor: "#fecdd3", color: "#9f1239" };
    }
    if (status === "rename" || status === "unchanged") {
      return { background: "#ecfdf3", borderColor: "#b7f0c9", color: "#067647" };
    }
    return { background: "#fff7ed", borderColor: "#fed7aa", color: "#9a3412" };
  }
  function VariablesBatchRenameToolView({ onBack }) {
    const [collections, setCollections] = d2([]);
    const [errorMessage, setErrorMessage] = d2(null);
    const [successMessage, setSuccessMessage] = d2(null);
    const [exportIncludeCurrentName, setExportIncludeCurrentName] = d2(true);
    const [exportSelectedCollectionIds, setExportSelectedCollectionIds] = d2([]);
    const [didInitExportSelection, setDidInitExportSelection] = d2(false);
    const [exportStatus, setExportStatus] = d2(null);
    const [lastExport, setLastExport] = d2(null);
    const [importFilename, setImportFilename] = d2(null);
    const [importFile, setImportFile] = d2(null);
    const [importJsonText, setImportJsonText] = d2("");
    const [importPreview, setImportPreview] = d2(null);
    const [importBusy, setImportBusy] = d2(false);
    const [importStage, setImportStage] = d2("idle");
    const [importApplyProgress, setImportApplyProgress] = d2(null);
    const [importResult, setImportResult] = d2(null);
    y2(() => {
      const handleMessage = (event) => {
        var _a;
        const msg = (_a = event.data) == null ? void 0 : _a.pluginMessage;
        if (!msg) return;
        if (msg.type === MAIN_TO_UI.BATCH_RENAME_COLLECTIONS_LIST) {
          setCollections(msg.collections);
          if (!didInitExportSelection) {
            setExportSelectedCollectionIds(msg.collections.map((collection) => collection.id));
            setDidInitExportSelection(true);
          }
        }
        if (msg.type === MAIN_TO_UI.BATCH_RENAME_NAME_SET_READY) {
          downloadTextFile2(msg.payload.filename, msg.payload.jsonText);
          setExportStatus(`Exported: ${msg.payload.filename}`);
          setSuccessMessage(`Exported "${msg.payload.filename}"`);
          setLastExport({ filename: msg.payload.filename, jsonText: msg.payload.jsonText });
        }
        if (msg.type === MAIN_TO_UI.BATCH_RENAME_IMPORT_PREVIEW) {
          setImportPreview(msg.payload);
          setImportBusy(false);
          setImportStage("idle");
          setImportResult(null);
          setErrorMessage(null);
          setSuccessMessage(
            `Import preview ready: rename ${msg.payload.totals.renames}, conflicts ${msg.payload.totals.conflicts}, missing ${msg.payload.totals.missing}`
          );
        }
        if (msg.type === MAIN_TO_UI.BATCH_RENAME_APPLY_PROGRESS) {
          setImportApplyProgress(msg.progress);
        }
        if (msg.type === MAIN_TO_UI.BATCH_RENAME_APPLY_RESULT) {
          setImportBusy(false);
          setImportStage("idle");
          setImportApplyProgress(null);
          setImportResult(msg.payload);
          setSuccessMessage(
            `Applied: renamed ${msg.payload.totals.renamed}, unchanged ${msg.payload.totals.unchanged}, skipped ${msg.payload.totals.skipped}, failed ${msg.payload.totals.failed}`
          );
        }
        if (msg.type === MAIN_TO_UI.ERROR) {
          setErrorMessage(msg.message);
          setImportBusy(false);
          setImportStage("idle");
        }
      };
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }, [didInitExportSelection]);
    y2(() => {
      if (!successMessage) return;
      const t3 = window.setTimeout(() => setSuccessMessage(null), 4500);
      return () => window.clearTimeout(t3);
    }, [successMessage]);
    const exportCollectionsOptions = T2(
      () => collections,
      [collections]
    );
    const allCollectionIds = T2(
      () => exportCollectionsOptions.map((c3) => c3.id),
      [exportCollectionsOptions]
    );
    const selectedCollectionIdsInOptions = T2(
      () => exportSelectedCollectionIds.filter((id) => allCollectionIds.includes(id)),
      [allCollectionIds, exportSelectedCollectionIds]
    );
    const areAllCollectionsSelected = exportCollectionsOptions.length > 0 && selectedCollectionIdsInOptions.length === exportCollectionsOptions.length;
    const hasSomeCollectionsSelected = selectedCollectionIdsInOptions.length > 0 && !areAllCollectionsSelected;
    const importRows = T2(() => {
      var _a;
      const entries = (_a = importPreview == null ? void 0 : importPreview.entries) != null ? _a : [];
      const order = (status) => {
        switch (status) {
          case "conflict":
            return 0;
          case "missing":
            return 1;
          case "invalid":
            return 2;
          case "out_of_scope":
            return 3;
          case "stale":
            return 4;
          case "rename":
            return 5;
          case "unchanged":
            return 6;
          default:
            return 10;
        }
      };
      return entries.slice().sort(
        (a3, b2) => {
          var _a2, _b;
          return order(a3.status) - order(b2.status) || ((_a2 = a3.currentName) != null ? _a2 : "").localeCompare((_b = b2.currentName) != null ? _b : "");
        }
      );
    }, [importPreview]);
    const canApplyImportedRenames = importPreview !== null && importPreview.totals.renames > 0 && importPreview.totals.conflicts === 0;
    const handleExport = () => {
      if (selectedCollectionIdsInOptions.length === 0) {
        setErrorMessage("Select at least one collection to export.");
        return;
      }
      setExportStatus(null);
      setSuccessMessage(null);
      parent.postMessage(
        {
          pluginMessage: {
            type: UI_TO_MAIN.BATCH_RENAME_EXPORT_NAME_SET,
            request: {
              setName: "",
              description: "",
              collectionIds: selectedCollectionIdsInOptions,
              types: [],
              includeCurrentName: exportIncludeCurrentName
            }
          }
        },
        "*"
      );
    };
    const handleImportFile = async (files) => {
      const file = files[0];
      if (!file) return;
      setImportBusy(true);
      setImportStage("preview");
      setImportApplyProgress(null);
      setSuccessMessage(null);
      setImportFilename(file.name);
      setImportFile(file);
      const text = await file.text();
      setImportJsonText(text);
      parent.postMessage(
        {
          pluginMessage: {
            type: UI_TO_MAIN.BATCH_RENAME_PREVIEW_IMPORT,
            request: { jsonText: text }
          }
        },
        "*"
      );
    };
    const handlePreviewAgain = async () => {
      const cached = importJsonText.trim();
      if (!importFile && !cached) return;
      setImportBusy(true);
      setImportStage("preview");
      setImportApplyProgress(null);
      setSuccessMessage(null);
      if (importFile) {
        const text = await importFile.text();
        setImportJsonText(text);
        parent.postMessage(
          {
            pluginMessage: {
              type: UI_TO_MAIN.BATCH_RENAME_PREVIEW_IMPORT,
              request: { jsonText: text }
            }
          },
          "*"
        );
        return;
      }
      parent.postMessage(
        {
          pluginMessage: {
            type: UI_TO_MAIN.BATCH_RENAME_PREVIEW_IMPORT,
            request: { jsonText: importJsonText }
          }
        },
        "*"
      );
    };
    const handleApplyRenames = () => {
      if (!importPreview) return;
      setImportBusy(true);
      setImportStage("apply");
      setSuccessMessage(null);
      const entries = importPreview.entries.filter((e3) => e3.status === "rename" && e3.newName).map((e3) => ({
        variableId: e3.variableId,
        expectedOldName: e3.expectedOldName,
        newName: e3.newName
      }));
      setImportApplyProgress({ current: 0, total: entries.length, message: "Starting..." });
      parent.postMessage(
        {
          pluginMessage: {
            type: UI_TO_MAIN.BATCH_RENAME_APPLY_IMPORT,
            request: { entries }
          }
        },
        "*"
      );
    };
    return /* @__PURE__ */ _(Page, null, /* @__PURE__ */ _(
      ToolHeader,
      {
        title: "Rename Variables via JSON",
        left: /* @__PURE__ */ _(IconButton, { onClick: onBack, title: "Home" }, /* @__PURE__ */ _(IconHome16, null))
      }
    ), /* @__PURE__ */ _(ToolBody, { mode: "content" }, /* @__PURE__ */ _(Stack, { space: "medium" }, errorMessage && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("div", { style: { padding: 8, background: "#fff1f2", borderRadius: 4 } }, /* @__PURE__ */ _(Text, { style: { color: "#9f1239" } }, errorMessage))), successMessage && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("div", { style: { padding: 8, background: "#ecfdf3", borderRadius: 4 } }, /* @__PURE__ */ _(Text, { style: { color: "#067647" } }, successMessage))), /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)", whiteSpace: "pre-line" } }, "1. Export variables\n2. Edit names in Code Editor\n3. Import JSON with new names"), /* @__PURE__ */ _("div", null, exportCollectionsOptions.length === 0 ? /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)" } }, "No collections loaded yet.") : null, exportCollectionsOptions.length > 0 ? /* @__PURE__ */ _(
      Checkbox,
      {
        value: hasSomeCollectionsSelected ? MIXED_BOOLEAN : areAllCollectionsSelected,
        onValueChange: (next) => setExportSelectedCollectionIds(next ? allCollectionIds : [])
      },
      /* @__PURE__ */ _(Text, null, "Collections")
    ) : null, /* @__PURE__ */ _(VerticalSpace, { space: "extraSmall" }), /* @__PURE__ */ _(Stack, { space: "extraSmall", style: { marginLeft: 20 } }, exportCollectionsOptions.map((c3) => {
      const checked = exportSelectedCollectionIds.includes(c3.id);
      return /* @__PURE__ */ _(
        Checkbox,
        {
          key: c3.id,
          value: checked,
          onValueChange: (next) => {
            setExportSelectedCollectionIds((prev) => {
              if (next) {
                return prev.includes(c3.id) ? prev : [...prev, c3.id];
              }
              return prev.filter((id) => id !== c3.id);
            });
          }
        },
        /* @__PURE__ */ _(Text, null, c3.name)
      );
    }))), /* @__PURE__ */ _(Divider, null), /* @__PURE__ */ _(
      Checkbox,
      {
        value: exportIncludeCurrentName,
        onValueChange: setExportIncludeCurrentName
      },
      /* @__PURE__ */ _(Text, null, "Include currentName (for review/editing)")
    ), /* @__PURE__ */ _(Inline, { space: "extraSmall" }, /* @__PURE__ */ _(Button, { disabled: selectedCollectionIdsInOptions.length === 0, onClick: handleExport }, "Export name set"), /* @__PURE__ */ _(
      Button,
      {
        secondary: true,
        disabled: !lastExport,
        onClick: async () => {
          if (!lastExport) return;
          const ok = await copyTextToClipboard2(lastExport.jsonText);
          setSuccessMessage(ok ? `Copied "${lastExport.filename}" JSON` : "Copy failed");
        }
      },
      "Copy last export"
    )), exportStatus && /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)" } }, exportStatus)), /* @__PURE__ */ _(VerticalSpace, { space: "large" }), /* @__PURE__ */ _(Divider, null), /* @__PURE__ */ _(VerticalSpace, { space: "large" }), /* @__PURE__ */ _(Stack, { space: "medium" }, /* @__PURE__ */ _(Stack, { space: "extraSmall" }, /* @__PURE__ */ _(Text, { style: { fontWeight: 600 } }, "Import name set (JSON) \u2192 Preview \u2192 Apply"), /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)" } }, "Renames are applied by variable ID. If currentName doesn't match, you'll see a warning but it can still apply safely.")), /* @__PURE__ */ _(Inline, { space: "extraSmall" }, /* @__PURE__ */ _(
      FileUploadButton,
      {
        acceptedFileTypes: [".json", "application/json"],
        onSelectedFiles: handleImportFile
      },
      "Choose JSON file\u2026"
    ), /* @__PURE__ */ _(
      Button,
      {
        secondary: true,
        disabled: !importFile && !importJsonText.trim() || importBusy,
        onClick: handlePreviewAgain
      },
      "Preview again"
    )), importBusy && /* @__PURE__ */ _(Inline, { space: "extraSmall" }, /* @__PURE__ */ _(LoadingIndicator, null), /* @__PURE__ */ _(Text, null, importStage === "apply" ? `Applying renames\u2026 ${importApplyProgress ? `${importApplyProgress.current} / ${importApplyProgress.total}` : ""}` : "Building import preview\u2026")), importPreview && /* @__PURE__ */ _(Stack, { space: "small" }, importPreview.meta.description && /* @__PURE__ */ _(Text, null, importPreview.meta.description), importFilename && /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)" } }, "Loaded file: ", importFilename), /* @__PURE__ */ _(Text, null, "Rows: ", importPreview.totals.considered, " \xB7 rename ", importPreview.totals.renames, " \xB7 unchanged ", importPreview.totals.unchanged, " \xB7 conflicts", " ", importPreview.totals.conflicts, " \xB7 missing ", importPreview.totals.missing, " \xB7 invalid", " ", importPreview.totals.invalid, " \xB7 out_of_scope ", importPreview.totals.outOfScope), /* @__PURE__ */ _(
      Button,
      {
        loading: importBusy,
        disabled: importBusy || !canApplyImportedRenames,
        onClick: handleApplyRenames
      },
      "Apply renames"
    ), !canApplyImportedRenames && importPreview.totals.conflicts > 0 && /* @__PURE__ */ _(Text, { style: { color: "#9f1239" } }, "Resolve conflicts in the JSON (duplicate newName) before applying."), importResult && /* @__PURE__ */ _(Text, { style: { color: "#067647" } }, "Renamed: ", importResult.totals.renamed, ", Unchanged: ", importResult.totals.unchanged, ", Skipped: ", importResult.totals.skipped, ", Failed: ", importResult.totals.failed), /* @__PURE__ */ _(Divider, null), /* @__PURE__ */ _(DataTable, { columns: previewColumns }, importRows.map((entry) => {
      var _a, _b, _c, _d;
      const pillStyle = getStatusPillStyle2(entry.status);
      const { beforeNode, afterNode } = renderInlineDiff(
        (_a = entry.currentName) != null ? _a : "",
        (_b = entry.newName) != null ? _b : ""
      );
      return /* @__PURE__ */ _("tr", { key: entry.variableId }, /* @__PURE__ */ _("td", { style: { padding: "4px 8px", verticalAlign: "top" } }, /* @__PURE__ */ _(
        "span",
        {
          style: {
            display: "inline-block",
            padding: "2px 6px",
            borderRadius: 4,
            fontSize: 10,
            fontWeight: 600,
            background: pillStyle.background,
            border: `1px solid ${pillStyle.borderColor}`,
            color: pillStyle.color
          }
        },
        entry.status
      )), /* @__PURE__ */ _("td", { style: { padding: "4px 8px", verticalAlign: "top", wordBreak: "break-word" } }, entry.status === "rename" ? beforeNode : (_c = entry.currentName) != null ? _c : "\u2014"), /* @__PURE__ */ _("td", { style: { padding: "4px 8px", verticalAlign: "top", wordBreak: "break-word" } }, entry.status === "rename" ? afterNode : (_d = entry.newName) != null ? _d : "\u2014"), /* @__PURE__ */ _(
        "td",
        {
          style: {
            padding: "4px 8px",
            verticalAlign: "top",
            color: "var(--figma-color-text-tertiary)",
            wordBreak: "break-word"
          }
        },
        entry.reason || entry.warning || ""
      ));
    }))))));
  }
  var previewColumns;
  var init_VariablesBatchRenameToolView = __esm({
    "src/app/views/variables-batch-rename-tool/VariablesBatchRenameToolView.tsx"() {
      "use strict";
      init_lib2();
      init_lib();
      init_preact_module();
      init_hooks_module();
      init_messages();
      init_DataTable();
      init_InlineTextDiff();
      init_Page();
      init_ToolBody();
      init_ToolHeader();
      previewColumns = [
        { label: "Status", width: 72 },
        { label: "Current" },
        { label: "New" },
        { label: "Note" }
      ];
    }
  });

  // src/app/views/variables-create-linked-colors-tool/VariablesCreateLinkedColorsToolView.tsx
  function computeNameForGroupRestriction(currentName, groupFilterValue) {
    const raw = String(currentName || "").trim();
    if (!raw) return "";
    const targetGroup = String(groupFilterValue || "").trim();
    if (!targetGroup) return raw;
    const parts = raw.split("/").map((p3) => p3.trim()).filter(Boolean);
    if (!parts.length) return "";
    const oldGroup = parts.length >= 2 ? parts[0] : "";
    const lastIndex = parts.length - 1;
    const last = parts[lastIndex] || "";
    let nextLast = last;
    if (oldGroup && last.startsWith(oldGroup + "-")) {
      if (targetGroup === "Ungrouped") {
        nextLast = last.slice((oldGroup + "-").length);
      } else {
        nextLast = `${targetGroup}-${last.slice((oldGroup + "-").length)}`;
      }
    }
    if (targetGroup === "Ungrouped") {
      const rest = parts.length >= 2 ? parts.slice(1) : parts;
      const adjustedLastIndex = lastIndex - (parts.length >= 2 ? 1 : 0);
      rest[adjustedLastIndex] = nextLast;
      return rest.join("/");
    }
    if (parts.length >= 2) {
      parts[0] = targetGroup;
      parts[lastIndex] = nextLast;
      return parts.join("/");
    }
    return nextLast;
  }
  function VariablesCreateLinkedColorsToolView({ onBack }) {
    const [collections, setCollections] = d2([]);
    const [selection, setSelection] = d2(null);
    const [errorMessage, setErrorMessage] = d2(null);
    const [successMessage, setSuccessMessage] = d2(null);
    const [isWorking, setIsWorking] = d2(false);
    const [selectedVariableId, setSelectedVariableId] = d2(null);
    const [restrictGroup, setRestrictGroup] = d2(null);
    const [createName, setCreateName] = d2("");
    const [createNameTouched, setCreateNameTouched] = d2(false);
    const [applyTargetVariableId, setApplyTargetVariableId] = d2(null);
    const [replaceSearch, setReplaceSearch] = d2("");
    y2(() => {
      const handleMessage = (event) => {
        var _a;
        const msg = (_a = event.data) == null ? void 0 : _a.pluginMessage;
        if (!msg) return;
        if (msg.type === MAIN_TO_UI.LINKED_COLORS_COLLECTIONS_LIST) {
          setCollections(msg.collections);
        }
        if (msg.type === MAIN_TO_UI.LINKED_COLORS_SELECTION) {
          setSelection(msg.payload);
          setErrorMessage(null);
          setSelectedVariableId((prev) => {
            if (!msg.payload.variables.length) return null;
            if (prev && msg.payload.variables.some((v3) => v3.id === prev)) return prev;
            return msg.payload.variables[0].id;
          });
        }
        if (msg.type === MAIN_TO_UI.LINKED_COLORS_CREATE_SUCCESS) {
          setIsWorking(false);
          if (msg.result.success) {
            setSuccessMessage(msg.result.message);
            setCreateName("");
            setCreateNameTouched(false);
          } else {
            setErrorMessage(msg.result.message);
          }
        }
        if (msg.type === MAIN_TO_UI.LINKED_COLORS_APPLY_SUCCESS) {
          setIsWorking(false);
          if (msg.result.success) {
            setSuccessMessage(msg.result.message);
            setApplyTargetVariableId(null);
          } else {
            setErrorMessage(msg.result.message);
          }
        }
        if (msg.type === MAIN_TO_UI.LINKED_COLORS_RENAME_SUCCESS) {
          setIsWorking(false);
          if (msg.result.success) {
            setSuccessMessage(msg.result.message);
          } else {
            setErrorMessage(msg.result.message);
          }
        }
        if (msg.type === MAIN_TO_UI.ERROR) {
          setErrorMessage(msg.message);
          setIsWorking(false);
        }
      };
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }, []);
    y2(() => {
      if (!successMessage) return;
      const t3 = window.setTimeout(() => setSuccessMessage(null), 4500);
      return () => window.clearTimeout(t3);
    }, [successMessage]);
    const selectedUsage = T2(() => {
      var _a;
      if (!selection || !selectedVariableId) return null;
      return (_a = selection.variables.find((v3) => v3.id === selectedVariableId)) != null ? _a : null;
    }, [selection, selectedVariableId]);
    const variableOptions = T2(() => {
      if (!selectedUsage) return [];
      const opts = selectedUsage.options.slice();
      if (restrictGroup && restrictGroup !== "All") {
        return opts.filter((v3) => v3.name.startsWith(restrictGroup + "/") || v3.name === restrictGroup).sort((a3, b2) => a3.name.localeCompare(b2.name)).map((v3) => ({ value: v3.id, text: `${v3.collectionName} \u2014 ${v3.name}` }));
      }
      return opts.sort((a3, b2) => a3.name.localeCompare(b2.name)).map((v3) => ({ value: v3.id, text: `${v3.collectionName} \u2014 ${v3.name}` }));
    }, [selectedUsage, restrictGroup]);
    const filteredOptions = T2(() => {
      if (!replaceSearch.trim()) return variableOptions;
      const search = replaceSearch.toLowerCase();
      return variableOptions.filter((opt) => opt.text.toLowerCase().includes(search));
    }, [variableOptions, replaceSearch]);
    const variableGroups = T2(() => {
      if (!selectedUsage) return [];
      return [
        { value: "All", text: "All groups" },
        ...selectedUsage.groups.map((g4) => ({ value: g4 || "Ungrouped", text: g4 || "Ungrouped" }))
      ];
    }, [selectedUsage]);
    const selectedVariableOptions = T2(() => {
      var _a;
      const vars = (_a = selection == null ? void 0 : selection.variables) != null ? _a : [];
      return vars.map((v3) => ({ value: v3.id, text: `${v3.collectionName} \u2014 ${v3.name}` }));
    }, [selection]);
    y2(() => {
      if (!selectedUsage) {
        setRestrictGroup(null);
        setApplyTargetVariableId(null);
        setCreateNameTouched(false);
        setCreateName("");
        return;
      }
      if (!createNameTouched) {
        const suggested = restrictGroup && restrictGroup !== "All" ? computeNameForGroupRestriction(selectedUsage.name, restrictGroup) : selectedUsage.name;
        setCreateName(suggested);
      }
    }, [selectedUsage, restrictGroup, createNameTouched]);
    y2(() => {
      setApplyTargetVariableId(null);
      setReplaceSearch("");
    }, [selectedVariableId]);
    const handleCreateLinkedVariable = () => {
      if (!selectedVariableId || !createName.trim()) return;
      setIsWorking(true);
      setSuccessMessage(null);
      setErrorMessage(null);
      parent.postMessage(
        {
          pluginMessage: {
            type: UI_TO_MAIN.LINKED_COLORS_CREATE,
            request: {
              variableId: selectedVariableId,
              targetVariableId: createName.trim()
              // This is actually the new name
            }
          }
        },
        "*"
      );
    };
    const handleApplyExisting = () => {
      if (!selectedVariableId || !applyTargetVariableId) return;
      setIsWorking(true);
      setSuccessMessage(null);
      setErrorMessage(null);
      parent.postMessage(
        {
          pluginMessage: {
            type: UI_TO_MAIN.LINKED_COLORS_APPLY_EXISTING,
            request: {
              variableId: selectedVariableId,
              targetVariableId: applyTargetVariableId
            }
          }
        },
        "*"
      );
    };
    const handleRename = (newName) => {
      if (!selectedVariableId || !newName.trim()) return;
      setIsWorking(true);
      setSuccessMessage(null);
      setErrorMessage(null);
      parent.postMessage(
        {
          pluginMessage: {
            type: UI_TO_MAIN.LINKED_COLORS_RENAME,
            request: {
              variableId: selectedVariableId,
              newName: newName.trim()
            }
          }
        },
        "*"
      );
    };
    const isSelectionEmpty = (selection == null ? void 0 : selection.selectionSize) === 0;
    return /* @__PURE__ */ _(Page, null, /* @__PURE__ */ _(
      ToolHeader,
      {
        title: "Create Linked Colors",
        left: /* @__PURE__ */ _(IconButton, { onClick: onBack, title: "Home" }, /* @__PURE__ */ _(IconHome16, null))
      }
    ), isSelectionEmpty ? /* @__PURE__ */ _(ToolBody, { mode: "state" }, /* @__PURE__ */ _(
      State,
      {
        icon: /* @__PURE__ */ _(IconInteractionClickSmall24, null),
        title: "Select layers with color variables to manage them."
      }
    )) : /* @__PURE__ */ _(ToolBody, { mode: "content" }, /* @__PURE__ */ _(Container, { space: "medium" }, /* @__PURE__ */ _(VerticalSpace, { space: "medium" }), errorMessage && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("div", { style: { padding: 8, background: "#fff1f2", borderRadius: 4, marginBottom: 12 } }, /* @__PURE__ */ _(Text, { style: { color: "#9f1239" } }, errorMessage))), successMessage && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("div", { style: { padding: 8, background: "#ecfdf3", borderRadius: 4, marginBottom: 12 } }, /* @__PURE__ */ _(Text, { style: { color: "#067647" } }, successMessage))), /* @__PURE__ */ _(Stack, { space: "small" }, /* @__PURE__ */ _(Text, { style: { fontWeight: 600 } }, "Selection"), selection ? /* @__PURE__ */ _(Text, null, selection.selectionSize, " nodes, ", selection.variables.length, " color variables") : /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)" } }, "Loading...")), selection && selection.variables.length > 0 && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(VerticalSpace, { space: "medium" }), /* @__PURE__ */ _(Stack, { space: "small" }, /* @__PURE__ */ _(Text, { style: { fontWeight: 600 } }, "Select Variable to Manage"), /* @__PURE__ */ _(
      Dropdown,
      {
        options: selectedVariableOptions,
        value: selectedVariableId,
        onChange: (e3) => setSelectedVariableId(e3.currentTarget.value || null),
        disabled: isWorking
      }
    )), selectedUsage && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(VerticalSpace, { space: "medium" }), /* @__PURE__ */ _(
      "div",
      {
        style: {
          padding: 8,
          background: "var(--figma-color-bg-secondary)",
          borderRadius: 4
        }
      },
      /* @__PURE__ */ _(Text, { style: { fontSize: 11 } }, /* @__PURE__ */ _("strong", null, selectedUsage.name), /* @__PURE__ */ _("br", null), "Collection: ", selectedUsage.collectionName, /* @__PURE__ */ _("br", null), "Used in: ", selectedUsage.nodes.length, " nodes", /* @__PURE__ */ _("br", null), "Properties: ", selectedUsage.properties.join(", "))
    ), /* @__PURE__ */ _(VerticalSpace, { space: "large" }), /* @__PURE__ */ _(Divider, null), /* @__PURE__ */ _(VerticalSpace, { space: "medium" }), selectedUsage.groups.length > 0 && /* @__PURE__ */ _(Stack, { space: "small" }, /* @__PURE__ */ _(Text, { style: { fontWeight: 600 } }, "Filter by Group"), /* @__PURE__ */ _(
      Dropdown,
      {
        options: variableGroups,
        value: restrictGroup != null ? restrictGroup : "All",
        onChange: (e3) => setRestrictGroup(e3.currentTarget.value || null),
        disabled: isWorking
      }
    )), /* @__PURE__ */ _(VerticalSpace, { space: "medium" }), /* @__PURE__ */ _(Stack, { space: "small" }, /* @__PURE__ */ _(Text, { style: { fontWeight: 600 } }, "Replace with Existing Variable"), /* @__PURE__ */ _(Text, { style: { fontSize: 11, color: "var(--figma-color-text-secondary)" } }, "Select a variable to replace the current binding in selected layers."), /* @__PURE__ */ _(
      Textbox,
      {
        placeholder: "Search variables...",
        value: replaceSearch,
        onValueInput: setReplaceSearch,
        disabled: isWorking
      }
    ), /* @__PURE__ */ _("div", null, filteredOptions.length === 0 ? /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)", padding: 8 } }, "No matching variables found") : filteredOptions.slice(0, 50).map((opt) => /* @__PURE__ */ _(
      "div",
      {
        key: opt.value,
        onClick: () => !isWorking && setApplyTargetVariableId(opt.value),
        style: {
          padding: "6px 8px",
          cursor: isWorking ? "default" : "pointer",
          background: applyTargetVariableId === opt.value ? "var(--figma-color-bg-brand)" : "transparent",
          color: applyTargetVariableId === opt.value ? "var(--figma-color-text-onbrand)" : "inherit",
          borderRadius: 4,
          fontSize: 12
        }
      },
      opt.text
    ))), /* @__PURE__ */ _(
      Button,
      {
        onClick: handleApplyExisting,
        disabled: !applyTargetVariableId || isWorking
      },
      "Apply Selected Variable"
    )), /* @__PURE__ */ _(VerticalSpace, { space: "large" }), /* @__PURE__ */ _(Divider, null), /* @__PURE__ */ _(VerticalSpace, { space: "medium" }), /* @__PURE__ */ _(Stack, { space: "small" }, /* @__PURE__ */ _(Text, { style: { fontWeight: 600 } }, "Create Linked Variable (Alias)"), /* @__PURE__ */ _(Text, { style: { fontSize: 11, color: "var(--figma-color-text-secondary)" } }, "Create a new variable that aliases the selected variable, and rebind layers to use the new variable."), /* @__PURE__ */ _(
      Textbox,
      {
        placeholder: "New variable name",
        value: createName,
        onValueInput: (v3) => {
          setCreateName(v3);
          setCreateNameTouched(true);
        },
        disabled: isWorking
      }
    ), /* @__PURE__ */ _(Button, { onClick: handleCreateLinkedVariable, disabled: !createName.trim() || isWorking }, "Create & Apply")), /* @__PURE__ */ _(VerticalSpace, { space: "large" }), /* @__PURE__ */ _(Divider, null), /* @__PURE__ */ _(VerticalSpace, { space: "medium" }), /* @__PURE__ */ _(Stack, { space: "small" }, /* @__PURE__ */ _(Text, { style: { fontWeight: 600 } }, "Rename Variable"), /* @__PURE__ */ _(Text, { style: { fontSize: 11, color: "var(--figma-color-text-secondary)" } }, "Rename the selected variable. Current name: ", selectedUsage.name), /* @__PURE__ */ _(
      Textbox,
      {
        placeholder: "New name",
        value: createName,
        onValueInput: (v3) => {
          setCreateName(v3);
          setCreateNameTouched(true);
        },
        disabled: isWorking
      }
    ), /* @__PURE__ */ _(
      Button,
      {
        onClick: () => handleRename(createName),
        disabled: !createName.trim() || createName === selectedUsage.name || isWorking,
        secondary: true
      },
      "Rename Variable"
    )))), /* @__PURE__ */ _(VerticalSpace, { space: "large" }))));
  }
  var init_VariablesCreateLinkedColorsToolView = __esm({
    "src/app/views/variables-create-linked-colors-tool/VariablesCreateLinkedColorsToolView.tsx"() {
      "use strict";
      init_lib2();
      init_preact_module();
      init_hooks_module();
      init_messages();
      init_Page();
      init_State();
      init_ToolBody();
      init_ToolHeader();
    }
  });

  // src/app/views/variables-replace-usages-tool/VariablesReplaceUsagesToolView.tsx
  function downloadTextFile3(filename, text) {
    const blob = new Blob([text], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a3 = document.createElement("a");
    a3.href = url;
    a3.download = filename;
    document.body.appendChild(a3);
    a3.click();
    a3.remove();
    URL.revokeObjectURL(url);
  }
  function getExampleMappingJsonText() {
    const example = {
      version: 1,
      collectionName: "Semantic colors",
      replacements: [
        { from: "control/control-text", to: "text/text-default" },
        { from: "control/control-text-secondary", to: "text/text-secondary" },
        { from: "control/control-text-disabled", to: "text/text-disabled" },
        { from: "control/control-text-muted", to: "text/text-muted" },
        { from: "control/control-text-over-accent", to: "text/text-over-accent" },
        { from: "toolbar/toolbar-text", to: "text/text-default" },
        { from: "toolbar/toolbar-text-secondary", to: "text/text-secondary" },
        { from: "toolbar/toolbar-text-disabled", to: "text/text-disabled" },
        { from: "feedback/feedback-text", to: "text/text-default" },
        { from: "feedback/feedback-text-bright", to: "text/text-bright" }
      ]
    };
    return JSON.stringify(example, null, 2);
  }
  function getStatusPillStyle3(status) {
    if (status === "ok") {
      return { background: "#ecfdf3", borderColor: "#b7f0c9", color: "#067647" };
    }
    return { background: "#fff1f2", borderColor: "#fecdd3", color: "#9f1239" };
  }
  function VariablesReplaceUsagesToolView({ onBack, initialSelectionEmpty }) {
    const [errorMessage, setErrorMessage] = d2(null);
    const [successMessage, setSuccessMessage] = d2(null);
    const { scope, setScope, selectionSize, hasSelection, updateSelectionSize } = useScope(initialSelectionEmpty);
    const [renamePrints, setRenamePrints] = d2(false);
    const [includeHidden, setIncludeHidden] = d2(false);
    const [mappingFilename, setMappingFilename] = d2(null);
    const [mappingFile, setMappingFile] = d2(null);
    const [mappingJsonText, setMappingJsonText] = d2("");
    const [preview, setPreview] = d2(null);
    const [isBusy, setIsBusy] = d2(false);
    const [stage, setStage] = d2("idle");
    const [applyProgress, setApplyProgress] = d2(null);
    const [applyResult, setApplyResult] = d2(null);
    y2(() => {
      const handleMessage = (event) => {
        var _a;
        const msg = (_a = event.data) == null ? void 0 : _a.pluginMessage;
        if (!msg) return;
        if (msg.type === MAIN_TO_UI.REPLACE_USAGES_PREVIEW) {
          setPreview(msg.payload);
          setIsBusy(false);
          setStage("idle");
          setApplyResult(null);
          setErrorMessage(null);
          const t3 = msg.payload.totals;
          setSuccessMessage(
            `Preview ready: ${t3.mappings} valid mappings, ${t3.bindingsWithChanges} bindings to change in ${t3.nodesWithChanges} nodes`
          );
        }
        if (msg.type === MAIN_TO_UI.REPLACE_USAGES_APPLY_PROGRESS) {
          setApplyProgress(msg.progress);
        }
        if (msg.type === MAIN_TO_UI.REPLACE_USAGES_SELECTION) {
          updateSelectionSize(msg.payload.selectionSize);
        }
        if (msg.type === MAIN_TO_UI.REPLACE_USAGES_APPLY_RESULT) {
          setIsBusy(false);
          setStage("idle");
          setApplyProgress(null);
          setApplyResult(msg.payload);
          const t3 = msg.payload.totals;
          setSuccessMessage(
            `Applied: ${t3.bindingsChanged} bindings changed in ${t3.nodesChanged} nodes, ${t3.printsRenamed} prints renamed`
          );
        }
        if (msg.type === MAIN_TO_UI.ERROR) {
          setErrorMessage(msg.message);
          setIsBusy(false);
          setStage("idle");
        }
      };
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }, []);
    y2(() => {
      if (!successMessage) return;
      const t3 = window.setTimeout(() => setSuccessMessage(null), 5e3);
      return () => window.clearTimeout(t3);
    }, [successMessage]);
    const sortedMappings = T2(() => {
      if (!preview) return [];
      return preview.mappings.slice().sort((a3, b2) => b2.bindingsTotal - a3.bindingsTotal || a3.sourceName.localeCompare(b2.sourceName));
    }, [preview]);
    const sortedInvalidRows = T2(() => {
      if (!preview) return [];
      return preview.invalidMappingRows.slice().filter((r3) => r3.status !== "ok").sort((a3, b2) => a3.from.localeCompare(b2.from));
    }, [preview]);
    const canApply = preview !== null && preview.totals.mappings > 0 && preview.totals.bindingsWithChanges > 0;
    const handleLoadMappingFile = async (files) => {
      const file = files[0];
      if (!file) return;
      setMappingFilename(file.name);
      setMappingFile(file);
      const text = await file.text();
      setMappingJsonText(text);
      setPreview(null);
      setApplyResult(null);
      setSuccessMessage(`Loaded mapping file: ${file.name}`);
    };
    const handlePreview = async () => {
      const json = mappingFile ? await mappingFile.text() : mappingJsonText.trim();
      if (!json) {
        setErrorMessage("Please load a mapping JSON file first.");
        return;
      }
      setIsBusy(true);
      setStage("preview");
      setSuccessMessage(null);
      setMappingJsonText(json);
      parent.postMessage(
        {
          pluginMessage: {
            type: UI_TO_MAIN.REPLACE_USAGES_PREVIEW,
            request: {
              scope,
              renamePrints,
              includeHidden,
              mappingJsonText: json
            }
          }
        },
        "*"
      );
    };
    const handleApply = () => {
      var _a;
      if (!canApply || !mappingJsonText.trim()) return;
      setIsBusy(true);
      setStage("apply");
      setSuccessMessage(null);
      setApplyProgress({ current: 0, total: (_a = preview == null ? void 0 : preview.totals.nodesWithChanges) != null ? _a : 0, message: "Starting..." });
      parent.postMessage(
        {
          pluginMessage: {
            type: UI_TO_MAIN.REPLACE_USAGES_APPLY,
            request: {
              scope,
              renamePrints,
              includeHidden,
              mappingJsonText
            }
          }
        },
        "*"
      );
    };
    return /* @__PURE__ */ _(Page, null, /* @__PURE__ */ _(
      ToolHeader,
      {
        title: "Replace Variable Usages",
        left: /* @__PURE__ */ _(IconButton, { onClick: onBack, title: "Home" }, /* @__PURE__ */ _(IconHome16, null))
      }
    ), /* @__PURE__ */ _(ToolBody, { mode: "content" }, /* @__PURE__ */ _(Stack, { space: "medium" }, errorMessage && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("div", { style: { padding: 8, background: "#fff1f2", borderRadius: 4 } }, /* @__PURE__ */ _(Text, { style: { color: "#9f1239" } }, errorMessage))), successMessage && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("div", { style: { padding: 8, background: "#ecfdf3", borderRadius: 4 } }, /* @__PURE__ */ _(Text, { style: { color: "#067647" } }, successMessage))), /* @__PURE__ */ _(Stack, { space: "extraSmall" }, /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)" } }, 'Load a JSON mapping file to replace variable bindings in layers. The mapping file should specify "from \u2192 to" variable names within a collection.')), /* @__PURE__ */ _(Stack, { space: "small" }, /* @__PURE__ */ _(Text, { style: { fontWeight: 600 } }, "Scope"), /* @__PURE__ */ _(
      ScopeControl,
      {
        value: scope,
        hasSelection,
        onValueChange: setScope
      }
    )), /* @__PURE__ */ _(Stack, { space: "small" }, /* @__PURE__ */ _(Text, { style: { fontWeight: 600 } }, "Options"), /* @__PURE__ */ _(Stack, { space: "extraSmall" }, /* @__PURE__ */ _(Checkbox, { value: renamePrints, onValueChange: setRenamePrints }, /* @__PURE__ */ _(Text, null, 'Rename "Prints" layers (layers prefixed with VariableID:...)')), /* @__PURE__ */ _(Checkbox, { value: includeHidden, onValueChange: setIncludeHidden }, /* @__PURE__ */ _(Text, null, "Include hidden layers")))), /* @__PURE__ */ _(Divider, null), /* @__PURE__ */ _(Stack, { space: "small" }, /* @__PURE__ */ _(Text, { style: { fontWeight: 600 } }, "Mapping File"), /* @__PURE__ */ _(Text, { style: { fontSize: 11, color: "var(--figma-color-text-secondary)" } }, "JSON format: ", "{", ' version: 1, collectionName: "...", replacements: [', "{", ' from: "OldName", to: "NewName" ', "}", "] ", "}"), /* @__PURE__ */ _(
      FileUploadButton,
      {
        acceptedFileTypes: [".json", "application/json"],
        onSelectedFiles: handleLoadMappingFile
      },
      mappingFilename ? `Loaded: ${mappingFilename}` : "Choose mapping JSON file\u2026"
    ), /* @__PURE__ */ _(
      Button,
      {
        secondary: true,
        onClick: () => {
          downloadTextFile3("usages-mapping-example.json", getExampleMappingJsonText());
          setSuccessMessage("Downloaded example mapping JSON.");
        }
      },
      "Get example JSON file"
    )), /* @__PURE__ */ _(Inline, { space: "extraSmall" }, /* @__PURE__ */ _(Button, { onClick: handlePreview, disabled: !mappingJsonText.trim() || isBusy }, isBusy && stage === "preview" ? "Previewing..." : "Preview"), /* @__PURE__ */ _(Button, { onClick: handleApply, disabled: !canApply || isBusy }, isBusy && stage === "apply" ? "Applying..." : "Apply Replacements")), isBusy && /* @__PURE__ */ _(Inline, { space: "extraSmall" }, /* @__PURE__ */ _(LoadingIndicator, null), /* @__PURE__ */ _(Text, null, stage === "apply" ? `Applying... ${applyProgress ? `${applyProgress.current} / ${applyProgress.total}` : ""}` : "Building preview..."))), /* @__PURE__ */ _(VerticalSpace, { space: "large" }), /* @__PURE__ */ _(Divider, null), /* @__PURE__ */ _(VerticalSpace, { space: "medium" }), preview && /* @__PURE__ */ _(Stack, { space: "medium" }, /* @__PURE__ */ _(Text, { style: { fontWeight: 600 } }, "Preview Results"), /* @__PURE__ */ _(
      "div",
      {
        style: {
          padding: 8,
          background: "var(--figma-color-bg-secondary)",
          borderRadius: 4
        }
      },
      /* @__PURE__ */ _(Text, { style: { fontSize: 11 } }, /* @__PURE__ */ _("strong", null, "Scope:"), " ", preview.scope, /* @__PURE__ */ _("br", null), /* @__PURE__ */ _("strong", null, "Mappings:"), " ", preview.totals.mappings, " valid,", " ", sortedInvalidRows.length, " invalid", /* @__PURE__ */ _("br", null), /* @__PURE__ */ _("strong", null, "Bindings to change:"), " ", preview.totals.bindingsWithChanges, /* @__PURE__ */ _("br", null), /* @__PURE__ */ _("strong", null, "Nodes affected:"), " ", preview.totals.nodesWithChanges, /* @__PURE__ */ _("br", null), renamePrints && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("strong", null, "Prints rename candidates:"), " ", preview.totals.printsRenameCandidates))
    ), /* @__PURE__ */ _(
      "div",
      {
        style: {
          padding: 8,
          background: "var(--figma-color-bg-secondary)",
          borderRadius: 4
        }
      },
      /* @__PURE__ */ _(Text, { style: { fontSize: 11, fontWeight: 600, marginBottom: 4 } }, "Bindings by Phase"),
      /* @__PURE__ */ _(Text, { style: { fontSize: 10 } }, "Component: ", preview.totals.bindingsWithChangesByPhase.component, " bindings (", preview.totals.nodesWithChangesByPhase.component, " nodes)", /* @__PURE__ */ _("br", null), "Instance in Component:", " ", preview.totals.bindingsWithChangesByPhase.instance_in_component, " bindings (", preview.totals.nodesWithChangesByPhase.instance_in_component, " nodes)", /* @__PURE__ */ _("br", null), "Other: ", preview.totals.bindingsWithChangesByPhase.other, " bindings (", preview.totals.nodesWithChangesByPhase.other, " nodes)")
    ), sortedMappings.length > 0 && /* @__PURE__ */ _(
      DataTable,
      {
        header: "Mappings with Changes",
        columns: mappingsColumns
      },
      sortedMappings.map((row) => /* @__PURE__ */ _("tr", { key: row.sourceId }, /* @__PURE__ */ _("td", { style: { padding: "4px 8px", verticalAlign: "top", wordBreak: "break-word" } }, row.sourceName), /* @__PURE__ */ _("td", { style: { padding: "4px 8px", verticalAlign: "top", wordBreak: "break-word" } }, row.targetName), /* @__PURE__ */ _("td", { style: { padding: "4px 8px", verticalAlign: "top", textAlign: "right" } }, row.bindingsTotal), /* @__PURE__ */ _("td", { style: { padding: "4px 8px", verticalAlign: "top", textAlign: "right" } }, row.nodesTotal)))
    ), sortedInvalidRows.length > 0 && /* @__PURE__ */ _(
      DataTable,
      {
        header: `Invalid Mapping Rows (${sortedInvalidRows.length})`,
        columns: invalidColumns
      },
      sortedInvalidRows.map((row, i3) => {
        const pillStyle = getStatusPillStyle3(row.status);
        return /* @__PURE__ */ _("tr", { key: i3 }, /* @__PURE__ */ _("td", { style: { padding: "4px 8px", verticalAlign: "top" } }, /* @__PURE__ */ _(
          "span",
          {
            style: {
              display: "inline-block",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 9,
              fontWeight: 600,
              background: pillStyle.background,
              border: `1px solid ${pillStyle.borderColor}`,
              color: pillStyle.color
            }
          },
          row.status
        )), /* @__PURE__ */ _("td", { style: { padding: "4px 8px", verticalAlign: "top", wordBreak: "break-word" } }, row.from || "\u2014"), /* @__PURE__ */ _("td", { style: { padding: "4px 8px", verticalAlign: "top", wordBreak: "break-word" } }, row.to || "\u2014"), /* @__PURE__ */ _(
          "td",
          {
            style: {
              padding: "4px 8px",
              verticalAlign: "top",
              color: "var(--figma-color-text-tertiary)",
              wordBreak: "break-word"
            }
          },
          row.reason || ""
        ));
      })
    ), applyResult && /* @__PURE__ */ _(
      "div",
      {
        style: {
          padding: 8,
          background: "#ecfdf3",
          borderRadius: 4
        }
      },
      /* @__PURE__ */ _(Text, { style: { color: "#067647", fontWeight: 600 } }, "Apply Result"),
      /* @__PURE__ */ _(Text, { style: { fontSize: 11, marginTop: 4 } }, "Nodes visited: ", applyResult.totals.nodesVisited, /* @__PURE__ */ _("br", null), "Nodes changed: ", applyResult.totals.nodesChanged, /* @__PURE__ */ _("br", null), "Bindings changed: ", applyResult.totals.bindingsChanged, /* @__PURE__ */ _("br", null), "Nodes skipped (locked): ", applyResult.totals.nodesSkippedLocked, /* @__PURE__ */ _("br", null), "Bindings skipped (unsupported): ", applyResult.totals.bindingsSkippedUnsupported, /* @__PURE__ */ _("br", null), "Bindings failed: ", applyResult.totals.bindingsFailed, /* @__PURE__ */ _("br", null), "Prints renamed: ", applyResult.totals.printsRenamed)
    ))));
  }
  var mappingsColumns, invalidColumns;
  var init_VariablesReplaceUsagesToolView = __esm({
    "src/app/views/variables-replace-usages-tool/VariablesReplaceUsagesToolView.tsx"() {
      "use strict";
      init_lib2();
      init_preact_module();
      init_hooks_module();
      init_messages();
      init_DataTable();
      init_Page();
      init_ScopeControl();
      init_ToolBody();
      init_ToolHeader();
      mappingsColumns = [
        { label: "From" },
        { label: "To" },
        { label: "Bindings", align: "right" },
        { label: "Nodes", align: "right" }
      ];
      invalidColumns = [
        { label: "Status" },
        { label: "From" },
        { label: "To" },
        { label: "Reason" }
      ];
    }
  });

  // src/app/components/LibraryCacheStatusBar.tsx
  function LibraryCacheStatusBar({ status }) {
    if (!status || status.state === "idle" || status.state === "ready") return null;
    const message = status.state === "checking" ? "Checking library for updates\u2026" : status.message || "Updating library\u2026";
    return /* @__PURE__ */ _(
      "div",
      {
        style: {
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "6px 12px",
          background: "var(--figma-color-bg)",
          borderTop: "1px solid var(--figma-color-border)",
          zIndex: 100
        }
      },
      /* @__PURE__ */ _("div", { style: { flexShrink: 0, width: 16, height: 16 } }, /* @__PURE__ */ _(LoadingIndicator, { style: { margin: 0 } })),
      /* @__PURE__ */ _(Text, { style: { fontSize: 11, color: "var(--figma-color-text-secondary)" } }, message)
    );
  }
  var init_LibraryCacheStatusBar = __esm({
    "src/app/components/LibraryCacheStatusBar.tsx"() {
      "use strict";
      init_lib2();
      init_preact_module();
    }
  });

  // src/app/views/find-color-match-tool/FindColorMatchToolView.tsx
  function FindColorMatchToolView({ onBack, initialSelectionEmpty }) {
    var _a;
    const [collections, setCollections] = d2([]);
    const [selectedCollectionKey, setSelectedCollectionKey] = d2(null);
    const [selectedModeId, setSelectedModeId] = d2(null);
    const [entries, setEntries] = d2([]);
    const [cacheStatus, setCacheStatus] = d2(null);
    const [isLoading, setIsLoading] = d2(true);
    const [appliedKeys, setAppliedKeys] = d2(/* @__PURE__ */ new Set());
    const [overrides, setOverrides] = d2({});
    const [selectionEmpty, setSelectionEmpty] = d2(initialSelectionEmpty != null ? initialSelectionEmpty : true);
    const [groupsByCollection, setGroupsByCollection] = d2({});
    const [selectedGroup, setSelectedGroup] = d2(null);
    const [hexInput, setHexInput] = d2("");
    const [hexOpacity, setHexOpacity] = d2("100");
    const [hexMatches, setHexMatches] = d2([]);
    const [hexResultFor, setHexResultFor] = d2(null);
    const [hexSelectedIdx, setHexSelectedIdx] = d2(0);
    const [copiedName, setCopiedName] = d2(null);
    y2(() => {
      const handler = (event) => {
        var _a2;
        const msg = (_a2 = event.data) == null ? void 0 : _a2.pluginMessage;
        if (!msg) return;
        if (msg.type === MAIN_TO_UI.FIND_COLOR_MATCH_COLLECTIONS) {
          setCollections(msg.payload.collections);
          if (msg.payload.defaultCollectionKey) {
            setSelectedCollectionKey(msg.payload.defaultCollectionKey);
            const col = msg.payload.collections.find((c3) => c3.key === msg.payload.defaultCollectionKey);
            if (col && col.modes.length > 0) {
              setSelectedModeId(col.modes[0].modeId);
            }
          }
        }
        if (msg.type === MAIN_TO_UI.FIND_COLOR_MATCH_RESULT) {
          const hasEntries = msg.payload.entries.length > 0;
          setEntries(msg.payload.entries);
          setIsLoading(false);
          setSelectionEmpty(!hasEntries);
          setAppliedKeys(/* @__PURE__ */ new Set());
          setOverrides({});
        }
        if (msg.type === MAIN_TO_UI.LIBRARY_CACHE_STATUS) {
          setCacheStatus(msg.status);
        }
        if (msg.type === MAIN_TO_UI.FIND_COLOR_MATCH_APPLY_RESULT) {
          if (msg.result.ok) {
            setEntries((prev) => {
              const matched = prev.find((e3) => e3.found.nodeId === msg.result.nodeId);
              if (matched) {
                const key = `${matched.found.nodeId}:${matched.found.colorType}:${matched.found.paintIndex}`;
                setAppliedKeys((prevKeys) => {
                  const next = new Set(Array.from(prevKeys));
                  next.add(key);
                  return next;
                });
              }
              return prev;
            });
          }
        }
        if (msg.type === MAIN_TO_UI.FIND_COLOR_MATCH_HEX_RESULT) {
          setHexMatches(msg.payload.allMatches);
          setHexResultFor(msg.payload.hex);
          setHexSelectedIdx(0);
        }
        if (msg.type === MAIN_TO_UI.FIND_COLOR_MATCH_GROUPS) {
          setGroupsByCollection(msg.groupsByCollection);
        }
        if (msg.type === MAIN_TO_UI.SELECTION_EMPTY) {
          setSelectionEmpty(true);
          setEntries([]);
          setIsLoading(false);
        }
      };
      window.addEventListener("message", handler);
      return () => window.removeEventListener("message", handler);
    }, []);
    const entryKey = q2(
      (entry) => `${entry.found.nodeId}:${entry.found.colorType}:${entry.found.paintIndex}`,
      []
    );
    const selectedCollection = T2(
      () => {
        var _a2;
        return (_a2 = collections.find((c3) => c3.key === selectedCollectionKey)) != null ? _a2 : null;
      },
      [collections, selectedCollectionKey]
    );
    const modeOptions = T2(() => {
      if (!selectedCollection || selectedCollection.modes.length === 0) return [];
      return selectedCollection.modes.map((m3) => ({
        value: m3.modeId,
        text: m3.modeName
      }));
    }, [selectedCollection]);
    const combinedCollectionValue = T2(() => {
      const colKey = selectedCollectionKey != null ? selectedCollectionKey : "";
      return selectedGroup ? `${colKey}::${selectedGroup}` : `${colKey}::__all__`;
    }, [selectedCollectionKey, selectedGroup]);
    const combinedCollectionOptions = T2(() => {
      var _a2;
      const opts = [];
      for (let ci = 0; ci < collections.length; ci++) {
        const col = collections[ci];
        if (ci > 0) opts.push("-");
        opts.push({ value: `${col.key}::__all__`, text: col.name });
        const colGroups = (_a2 = groupsByCollection[col.key]) != null ? _a2 : [];
        for (const g4 of colGroups) {
          opts.push({ value: `${col.key}::${g4}`, text: g4 });
        }
      }
      return opts;
    }, [collections, groupsByCollection]);
    const handleCombinedCollectionChange = (value2) => {
      var _a2, _b;
      const sepIdx = value2.indexOf("::");
      if (sepIdx < 0) return;
      const colKey = value2.substring(0, sepIdx);
      const groupPart = value2.substring(sepIdx + 2);
      const newGroup = groupPart === "__all__" ? null : groupPart;
      const collectionChanged = colKey !== selectedCollectionKey;
      if (collectionChanged) {
        setSelectedCollectionKey(colKey);
        setSelectedGroup(null);
        setEntries([]);
        setAppliedKeys(/* @__PURE__ */ new Set());
        setOverrides({});
        setIsLoading(true);
        setHexMatches([]);
        setHexResultFor(null);
        const col = collections.find((c3) => c3.key === colKey);
        const firstModeId = (_b = (_a2 = col == null ? void 0 : col.modes[0]) == null ? void 0 : _a2.modeId) != null ? _b : null;
        setSelectedModeId(firstModeId);
        parent.postMessage(
          { pluginMessage: { type: UI_TO_MAIN.FIND_COLOR_MATCH_SET_COLLECTION, collectionKey: colKey } },
          "*"
        );
      } else if (newGroup !== selectedGroup) {
        setSelectedGroup(newGroup);
        setEntries([]);
        setAppliedKeys(/* @__PURE__ */ new Set());
        setOverrides({});
        setIsLoading(true);
        setHexMatches([]);
        setHexResultFor(null);
        parent.postMessage(
          { pluginMessage: { type: UI_TO_MAIN.FIND_COLOR_MATCH_SET_GROUP, group: newGroup } },
          "*"
        );
      }
    };
    const handleModeChange = (value2) => {
      setSelectedModeId(value2);
      setSelectedGroup(null);
      setEntries([]);
      setAppliedKeys(/* @__PURE__ */ new Set());
      setOverrides({});
      setIsLoading(true);
      setHexMatches([]);
      setHexResultFor(null);
      parent.postMessage(
        { pluginMessage: { type: UI_TO_MAIN.FIND_COLOR_MATCH_SET_MODE, modeId: value2 } },
        "*"
      );
    };
    const handleHexInput = (value2) => {
      setHexInput(value2);
      const clean = value2.replace(/^#/, "");
      if (/^[0-9a-fA-F]{6}$/.test(clean)) {
        parent.postMessage(
          { pluginMessage: { type: UI_TO_MAIN.FIND_COLOR_MATCH_HEX_LOOKUP, hex: `#${clean}` } },
          "*"
        );
      } else {
        setHexMatches([]);
        setHexResultFor(null);
        setHexSelectedIdx(0);
      }
    };
    const handleCopyName = (name) => {
      navigator.clipboard.writeText(name).then(() => {
        setCopiedName(name);
        setTimeout(() => setCopiedName(null), 1500);
      });
    };
    const handleApply = (entry) => {
      var _a2;
      const key = entryKey(entry);
      const overrideVarId = overrides[key];
      const variableId = overrideVarId != null ? overrideVarId : (_a2 = entry.bestMatch) == null ? void 0 : _a2.variableId;
      if (!variableId) return;
      parent.postMessage(
        {
          pluginMessage: {
            type: UI_TO_MAIN.FIND_COLOR_MATCH_APPLY,
            request: {
              nodeId: entry.found.nodeId,
              variableId,
              colorType: entry.found.colorType,
              paintIndex: entry.found.paintIndex
            }
          }
        },
        "*"
      );
    };
    const handleFocusNode = (nodeId) => {
      parent.postMessage(
        { pluginMessage: { type: UI_TO_MAIN.FIND_COLOR_MATCH_FOCUS_NODE, nodeId } },
        "*"
      );
    };
    const handleOverrideVariable = (entryKeyStr, variableId) => {
      setOverrides((prev) => __spreadProps(__spreadValues({}, prev), { [entryKeyStr]: variableId }));
    };
    const visibleEntries = T2(
      () => entries.filter((e3) => !appliedKeys.has(entryKey(e3))),
      [entries, appliedKeys, entryKey]
    );
    const showEmptySelection = !isLoading && selectionEmpty && entries.length === 0;
    const showNoUnbound = !isLoading && !selectionEmpty && entries.length === 0 && visibleEntries.length === 0;
    const hexSelectedMatch = hexMatches.length > 0 ? (_a = hexMatches[hexSelectedIdx]) != null ? _a : hexMatches[0] : null;
    const hexTop2 = hexMatches.slice(0, 2);
    return /* @__PURE__ */ _(Page, null, /* @__PURE__ */ _(
      ToolHeader,
      {
        title: "Find Color Match in Islands",
        left: /* @__PURE__ */ _(IconButton, { onClick: onBack }, /* @__PURE__ */ _(IconHome16, null))
      }
    ), /* @__PURE__ */ _("div", null, /* @__PURE__ */ _(Container, { space: "small" }, /* @__PURE__ */ _(VerticalSpace, { space: "small" }), /* @__PURE__ */ _("div", { style: { display: "flex", gap: 6, alignItems: "stretch" } }, combinedCollectionOptions.length > 0 && /* @__PURE__ */ _("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ _(
      Dropdown,
      {
        options: combinedCollectionOptions,
        value: combinedCollectionValue,
        onChange: (e3) => handleCombinedCollectionChange(e3.currentTarget.value)
      }
    )), modeOptions.length > 0 && /* @__PURE__ */ _("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ _(
      Dropdown,
      {
        options: modeOptions,
        value: selectedModeId != null ? selectedModeId : null,
        onChange: (e3) => handleModeChange(e3.currentTarget.value)
      }
    ))), /* @__PURE__ */ _(VerticalSpace, { space: "small" }), /* @__PURE__ */ _("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ _(
      TextboxColor,
      {
        hexColor: hexInput,
        hexColorPlaceholder: "Paste hex",
        opacity: hexOpacity,
        onHexColorValueInput: handleHexInput,
        onOpacityValueInput: setHexOpacity
      }
    )), /* @__PURE__ */ _(VerticalSpace, { space: "small" })), /* @__PURE__ */ _(Divider, null)), hexSelectedMatch && hexResultFor && /* @__PURE__ */ _("div", null, /* @__PURE__ */ _(Container, { space: "small" }, /* @__PURE__ */ _(VerticalSpace, { space: "small" }), /* @__PURE__ */ _(
      "div",
      {
        style: {
          border: "1px solid var(--figma-color-border)",
          borderRadius: 6,
          padding: "8px 10px"
        }
      },
      /* @__PURE__ */ _("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ _(ColorSwatch, { hex: hexResultFor, opacityPercent: 100 }), /* @__PURE__ */ _("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ _("div", { style: { fontSize: 11, fontWeight: 600 } }, "Hex lookup"), /* @__PURE__ */ _("div", { style: { fontSize: 10, color: "var(--figma-color-text-secondary)" } }, hexResultFor))),
      /* @__PURE__ */ _("div", { style: { marginTop: 6 } }, hexTop2.map((m3, i3) => /* @__PURE__ */ _(
        "div",
        {
          key: m3.variableId,
          style: {
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 4,
            cursor: "pointer",
            padding: "2px 4px",
            borderRadius: 4,
            background: i3 === hexSelectedIdx ? "var(--figma-color-bg-hover)" : "transparent"
          },
          onClick: () => setHexSelectedIdx(i3)
        },
        /* @__PURE__ */ _(ColorSwatch, { hex: m3.hex, opacityPercent: m3.opacityPercent }),
        /* @__PURE__ */ _("div", { style: { flex: 1, minWidth: 0, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, m3.variableName),
        /* @__PURE__ */ _("div", { style: { fontSize: 10, color: "var(--figma-color-text-secondary)", flexShrink: 0 } }, m3.matchPercent, "%")
      )), hexMatches.length > 2 && /* @__PURE__ */ _(
        Dropdown,
        {
          options: hexMatches.slice(2).map((m3, i3) => ({
            value: String(i3 + 2),
            text: `${m3.variableName} (${m3.matchPercent}%)`
          })),
          value: hexSelectedIdx >= 2 ? String(hexSelectedIdx) : null,
          onChange: (e3) => setHexSelectedIdx(Number(e3.currentTarget.value)),
          placeholder: "More matches\u2026",
          style: { marginBottom: 4 }
        }
      ), /* @__PURE__ */ _(
        Button,
        {
          onClick: () => handleCopyName(hexSelectedMatch.variableName),
          secondary: true,
          style: { width: "100%" }
        },
        copiedName === hexSelectedMatch.variableName ? "Copied!" : "Copy name"
      ))
    ), /* @__PURE__ */ _(VerticalSpace, { space: "small" })), /* @__PURE__ */ _(Divider, null)), showEmptySelection && /* @__PURE__ */ _(ToolBody, { mode: "state" }, /* @__PURE__ */ _(
      State,
      {
        icon: /* @__PURE__ */ _(IconInteractionClickSmall24, null),
        title: "Select layers to find color matches"
      }
    )), showNoUnbound && /* @__PURE__ */ _(ToolBody, { mode: "state" }, /* @__PURE__ */ _(State, { title: "No unbound colors found in selection" })), visibleEntries.length > 0 && /* @__PURE__ */ _(ToolBody, { mode: "content" }, /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)" } }, visibleEntries.length, " unbound color", visibleEntries.length !== 1 ? "s" : "", " found"), /* @__PURE__ */ _(VerticalSpace, { space: "small" }), /* @__PURE__ */ _(Stack, { space: "extraSmall" }, visibleEntries.map((entry) => {
      var _a2, _b;
      const key = entryKey(entry);
      const overrideVarId = overrides[key];
      const top2 = entry.allMatches.slice(0, 2);
      const selectedVarId = (_b = overrideVarId != null ? overrideVarId : (_a2 = entry.bestMatch) == null ? void 0 : _a2.variableId) != null ? _b : "";
      return /* @__PURE__ */ _(
        "div",
        {
          key,
          style: {
            border: "1px solid var(--figma-color-border)",
            borderRadius: 6,
            padding: "8px 10px"
          }
        },
        /* @__PURE__ */ _("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ _(ColorSwatch, { hex: entry.found.hex, opacityPercent: entry.found.opacity }), /* @__PURE__ */ _("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ _(
          "div",
          {
            style: {
              fontSize: 11,
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "pointer"
            },
            onClick: () => handleFocusNode(entry.found.nodeId),
            title: `Click to focus: ${entry.found.nodeName}`
          },
          entry.found.nodeName
        ), /* @__PURE__ */ _("div", { style: { fontSize: 10, color: "var(--figma-color-text-secondary)" } }, entry.found.hex, " \xB7 ", entry.found.colorType.toLowerCase(), entry.found.opacity < 100 ? ` \xB7 ${entry.found.opacity}%` : ""))),
        top2.length > 0 && /* @__PURE__ */ _("div", { style: { marginTop: 6 } }, top2.map((m3) => /* @__PURE__ */ _(
          "div",
          {
            key: m3.variableId,
            style: {
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 4,
              cursor: "pointer",
              padding: "2px 4px",
              borderRadius: 4,
              background: m3.variableId === selectedVarId ? "var(--figma-color-bg-hover)" : "transparent"
            },
            onClick: () => handleOverrideVariable(key, m3.variableId)
          },
          /* @__PURE__ */ _(ColorSwatch, { hex: m3.hex, opacityPercent: m3.opacityPercent }),
          /* @__PURE__ */ _("div", { style: { flex: 1, minWidth: 0, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, m3.variableName),
          /* @__PURE__ */ _("div", { style: { fontSize: 10, color: "var(--figma-color-text-secondary)", flexShrink: 0 } }, m3.matchPercent, "%")
        )), entry.allMatches.length > 2 && /* @__PURE__ */ _(
          Dropdown,
          {
            options: entry.allMatches.slice(2).map((m3) => ({
              value: m3.variableId,
              text: `${m3.variableName} (${m3.matchPercent}%)`
            })),
            value: overrideVarId && !top2.find((m3) => m3.variableId === overrideVarId) ? overrideVarId : null,
            onChange: (e3) => handleOverrideVariable(key, e3.currentTarget.value),
            placeholder: "More matches\u2026",
            style: { marginBottom: 4 }
          }
        ), /* @__PURE__ */ _(Button, { onClick: () => handleApply(entry), secondary: true, style: { width: "100%" } }, "Apply")),
        top2.length === 0 && /* @__PURE__ */ _("div", { style: { marginTop: 6, fontSize: 11, color: "var(--figma-color-text-tertiary)" } }, "No matching variable found")
      );
    }))), /* @__PURE__ */ _(LibraryCacheStatusBar, { status: cacheStatus }));
  }
  var init_FindColorMatchToolView = __esm({
    "src/app/views/find-color-match-tool/FindColorMatchToolView.tsx"() {
      "use strict";
      init_lib2();
      init_preact_module();
      init_hooks_module();
      init_messages();
      init_Page();
      init_ToolHeader();
      init_ToolBody();
      init_State();
      init_ColorSwatch();
      init_LibraryCacheStatusBar();
    }
  });

  // src/app/tools/automations/types.ts
  function generateAutomationId() {
    return `auto_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
  var ACTION_DEFINITIONS, ALL_ACTION_TYPES, VALID_NODE_TYPES, MATCH_MODES;
  var init_types = __esm({
    "src/app/tools/automations/types.ts"() {
      "use strict";
      ACTION_DEFINITIONS = [
        {
          type: "selectByType",
          label: "Select by type",
          description: "Filter current selection to only nodes of a given type",
          defaultParams: { nodeType: "TEXT" }
        },
        {
          type: "selectByName",
          label: "Select by name",
          description: "Filter selection by name pattern",
          defaultParams: { pattern: "", matchMode: "contains" }
        },
        {
          type: "expandToChildren",
          label: "Expand to children",
          description: "Replace selection with all direct children",
          defaultParams: {}
        },
        {
          type: "renameLayers",
          label: "Rename layers",
          description: "Find/replace in selected layer names",
          defaultParams: { find: "", replace: "" }
        },
        {
          type: "setFillColor",
          label: "Set fill color",
          description: "Set fill to a specific hex color",
          defaultParams: { hex: "#000000" }
        },
        {
          type: "setFillVariable",
          label: "Set fill variable",
          description: "Bind fill to a variable by name",
          defaultParams: { variableName: "" }
        },
        {
          type: "setOpacity",
          label: "Set opacity",
          description: "Set opacity on selected nodes (0\u2013100)",
          defaultParams: { opacity: 100 }
        },
        {
          type: "notify",
          label: "Notify",
          description: "Show a Figma notification message",
          defaultParams: { message: "" }
        }
      ];
      ALL_ACTION_TYPES = ACTION_DEFINITIONS.map((d3) => d3.type);
      VALID_NODE_TYPES = [
        "TEXT",
        "FRAME",
        "GROUP",
        "COMPONENT",
        "COMPONENT_SET",
        "INSTANCE",
        "RECTANGLE",
        "ELLIPSE",
        "LINE",
        "POLYGON",
        "STAR",
        "VECTOR",
        "BOOLEAN_OPERATION",
        "SECTION"
      ];
      MATCH_MODES = ["contains", "startsWith", "regex"];
    }
  });

  // src/app/tools/automations/storage.ts
  function createNewAutomation(name) {
    const now = Date.now();
    return {
      id: generateAutomationId(),
      name: name != null ? name : "New automation",
      steps: [],
      createdAt: now,
      updatedAt: now
    };
  }
  function automationToExportJson(automation) {
    const exportData = {
      version: 1,
      automation: {
        name: automation.name,
        steps: automation.steps.map((s3) => ({
          actionType: s3.actionType,
          params: s3.params,
          enabled: s3.enabled
        }))
      }
    };
    return JSON.stringify(exportData, null, 2);
  }
  function parseImportJson(jsonText) {
    try {
      const data = JSON.parse(jsonText);
      if (!data || typeof data !== "object") return null;
      if (data.version !== 1) return null;
      if (!data.automation || typeof data.automation !== "object") return null;
      const { name, steps } = data.automation;
      if (typeof name !== "string" || !Array.isArray(steps)) return null;
      const now = Date.now();
      return {
        id: generateAutomationId(),
        name,
        steps: steps.filter(
          (s3) => s3 && typeof s3 === "object" && typeof s3.actionType === "string" && typeof s3.params === "object"
        ).map((s3, i3) => {
          var _a;
          return {
            id: `step_${now}_${i3}`,
            actionType: s3.actionType,
            params: (_a = s3.params) != null ? _a : {},
            enabled: s3.enabled !== false
          };
        }),
        createdAt: now,
        updatedAt: now
      };
    } catch (e3) {
      return null;
    }
  }
  var init_storage = __esm({
    "src/app/tools/automations/storage.ts"() {
      "use strict";
      init_types();
    }
  });

  // src/app/views/automations-tool/AutomationsToolView.tsx
  function postMessage(msg) {
    parent.postMessage({ pluginMessage: msg }, "*");
  }
  function downloadTextFile4(filename, text) {
    const blob = new Blob([text], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a3 = document.createElement("a");
    a3.href = url;
    a3.download = filename;
    document.body.appendChild(a3);
    a3.click();
    document.body.removeChild(a3);
    URL.revokeObjectURL(url);
  }
  function AutomationsToolView(props) {
    const [screen, setScreen] = d2("list");
    const [automations, setAutomations] = d2([]);
    const [editingAutomation, setEditingAutomation] = d2(null);
    const [runProgress, setRunProgress] = d2(null);
    const [runResult, setRunResult] = d2(null);
    y2(() => {
      const handleMessage = (event) => {
        var _a;
        const msg = (_a = event.data) == null ? void 0 : _a.pluginMessage;
        if (!msg) return;
        if (msg.type === MAIN_TO_UI.AUTOMATIONS_LIST) {
          setAutomations(msg.automations);
        }
        if (msg.type === MAIN_TO_UI.AUTOMATIONS_FULL) {
          if (msg.automation) {
            setEditingAutomation(msg.automation);
            setScreen("builder");
          }
        }
        if (msg.type === MAIN_TO_UI.AUTOMATIONS_SAVED) {
          setEditingAutomation(msg.automation);
          postMessage({ type: UI_TO_MAIN.AUTOMATIONS_LOAD });
        }
        if (msg.type === MAIN_TO_UI.AUTOMATIONS_RUN_PROGRESS) {
          setRunProgress(msg.progress);
        }
        if (msg.type === MAIN_TO_UI.AUTOMATIONS_RUN_RESULT) {
          setRunResult(msg.result);
          setRunProgress(null);
        }
      };
      window.addEventListener("message", handleMessage);
      postMessage({ type: UI_TO_MAIN.AUTOMATIONS_LOAD });
      return () => window.removeEventListener("message", handleMessage);
    }, []);
    const handleCreateNew = q2(() => {
      const auto = createNewAutomation();
      const payload = {
        id: auto.id,
        name: auto.name,
        steps: [],
        createdAt: auto.createdAt,
        updatedAt: auto.updatedAt
      };
      setEditingAutomation(payload);
      setScreen("builder");
    }, []);
    const handleEdit = q2((id) => {
      postMessage({ type: UI_TO_MAIN.AUTOMATIONS_GET, automationId: id });
    }, []);
    const handleRun = q2((id) => {
      setRunResult(null);
      setRunProgress(null);
      postMessage({ type: UI_TO_MAIN.AUTOMATIONS_RUN, automationId: id });
    }, []);
    const handleDelete = q2((id) => {
      postMessage({ type: UI_TO_MAIN.AUTOMATIONS_DELETE, automationId: id });
    }, []);
    const handleImport = q2((files) => {
      if (files.length === 0) return;
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        const automation = parseImportJson(text);
        if (!automation) {
          return;
        }
        const payload = {
          id: automation.id,
          name: automation.name,
          steps: automation.steps.map((s3) => ({
            id: s3.id,
            actionType: s3.actionType,
            params: s3.params,
            enabled: s3.enabled
          })),
          createdAt: automation.createdAt,
          updatedAt: automation.updatedAt
        };
        postMessage({ type: UI_TO_MAIN.AUTOMATIONS_SAVE, automation: payload });
      };
      reader.readAsText(files[0]);
    }, []);
    const handleSave = q2(() => {
      if (!editingAutomation) return;
      postMessage({
        type: UI_TO_MAIN.AUTOMATIONS_SAVE,
        automation: __spreadProps(__spreadValues({}, editingAutomation), { updatedAt: Date.now() })
      });
    }, [editingAutomation]);
    const handleBuilderExport = q2(() => {
      if (!editingAutomation) return;
      const automation = {
        id: editingAutomation.id,
        name: editingAutomation.name,
        steps: editingAutomation.steps.map((s3) => ({
          id: s3.id,
          actionType: s3.actionType,
          params: s3.params,
          enabled: s3.enabled
        })),
        createdAt: editingAutomation.createdAt,
        updatedAt: editingAutomation.updatedAt
      };
      const json = automationToExportJson(automation);
      const filename = `${editingAutomation.name.replace(/[^a-zA-Z0-9-_ ]/g, "").replace(/\s+/g, "-")}.json`;
      downloadTextFile4(filename, json);
    }, [editingAutomation]);
    if (screen === "builder" && editingAutomation) {
      return /* @__PURE__ */ _(
        BuilderScreen,
        {
          automation: editingAutomation,
          onBack: () => {
            setScreen("list");
            setEditingAutomation(null);
            postMessage({ type: UI_TO_MAIN.AUTOMATIONS_LOAD });
          },
          onChange: setEditingAutomation,
          onSave: handleSave,
          onExport: handleBuilderExport
        }
      );
    }
    return /* @__PURE__ */ _(
      ListScreen,
      {
        automations,
        runProgress,
        runResult,
        onBack: props.onBack,
        onCreateNew: handleCreateNew,
        onEdit: handleEdit,
        onRun: handleRun,
        onDelete: handleDelete,
        onImport: handleImport
      }
    );
  }
  function ListScreen(props) {
    return /* @__PURE__ */ _(Page, null, /* @__PURE__ */ _(
      ToolHeader,
      {
        title: "Automations",
        left: /* @__PURE__ */ _(IconButton, { onClick: props.onBack }, /* @__PURE__ */ _(IconHome16, null))
      }
    ), props.automations.length === 0 ? /* @__PURE__ */ _(ToolBody, { mode: "state" }, /* @__PURE__ */ _(
      State,
      {
        title: "No automations yet",
        description: "Create your first automation or import one from a JSON file"
      }
    )) : /* @__PURE__ */ _(ToolBody, { mode: "content" }, props.runProgress && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(
      "div",
      {
        style: {
          padding: "8px 0",
          fontSize: 11,
          color: "var(--figma-color-text-secondary)"
        }
      },
      'Running "',
      props.runProgress.automationName,
      '" \u2014 step ',
      props.runProgress.currentStep,
      "/",
      props.runProgress.totalSteps,
      ": ",
      props.runProgress.stepName
    ), /* @__PURE__ */ _(VerticalSpace, { space: "small" })), props.runResult && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(
      "div",
      {
        style: {
          padding: "8px 0",
          fontSize: 11,
          color: props.runResult.success ? "var(--figma-color-text-success)" : "var(--figma-color-text-danger)"
        }
      },
      props.runResult.message,
      props.runResult.errors.length > 0 && /* @__PURE__ */ _("div", { style: { marginTop: 4 } }, props.runResult.errors.map((e3, i3) => /* @__PURE__ */ _("div", { key: i3 }, e3)))
    ), /* @__PURE__ */ _(VerticalSpace, { space: "small" })), /* @__PURE__ */ _(DataList, { header: `${props.automations.length} automation(s)` }, props.automations.map((a3) => /* @__PURE__ */ _(
      AutomationRow,
      {
        key: a3.id,
        automation: a3,
        onEdit: () => props.onEdit(a3.id),
        onRun: () => props.onRun(a3.id),
        onDelete: () => props.onDelete(a3.id)
      }
    )))), /* @__PURE__ */ _(Divider, null), /* @__PURE__ */ _(Container, { space: "medium" }, /* @__PURE__ */ _(VerticalSpace, { space: "small" }), /* @__PURE__ */ _(Stack, { space: "extraSmall" }, /* @__PURE__ */ _(Button, { fullWidth: true, onClick: props.onCreateNew }, "New automation"), /* @__PURE__ */ _(
      FileUploadButton,
      {
        acceptedFileTypes: ["application/json", ".json"],
        fullWidth: true,
        onSelectedFiles: props.onImport,
        secondary: true
      },
      "Import from JSON"
    )), /* @__PURE__ */ _(VerticalSpace, { space: "small" })));
  }
  function AutomationRow(props) {
    const [hovered, setHovered] = d2(false);
    const a3 = props.automation;
    return /* @__PURE__ */ _(
      "div",
      {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        style: {
          display: "flex",
          alignItems: "center",
          padding: "6px 8px",
          gap: 8,
          background: hovered ? "var(--figma-color-bg-hover)" : "transparent",
          borderRadius: 4,
          cursor: "pointer"
        },
        onClick: props.onEdit
      },
      /* @__PURE__ */ _("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ _(
        "div",
        {
          style: {
            fontSize: 11,
            color: "var(--figma-color-text)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }
        },
        a3.name
      ), /* @__PURE__ */ _(
        "div",
        {
          style: {
            fontSize: 10,
            color: "var(--figma-color-text-secondary)",
            marginTop: 1
          }
        },
        a3.stepCount,
        " step(s)"
      )),
      hovered && /* @__PURE__ */ _("div", { style: { display: "flex", gap: 4, flexShrink: 0 }, onClick: (e3) => e3.stopPropagation() }, /* @__PURE__ */ _(
        Button,
        {
          onClick: props.onRun,
          style: { fontSize: 10, padding: "2px 8px", minHeight: 0 }
        },
        /* @__PURE__ */ _(Text, null, "Run")
      ), /* @__PURE__ */ _(
        Button,
        {
          onClick: props.onDelete,
          secondary: true,
          style: { fontSize: 10, padding: "2px 8px", minHeight: 0 }
        },
        /* @__PURE__ */ _(Text, null, "Delete")
      ))
    );
  }
  function BuilderScreen(props) {
    const { automation, onChange } = props;
    const [selectedStepIndex, setSelectedStepIndex] = d2(null);
    const [rightPanel, setRightPanel] = d2("empty");
    const selectedStep = selectedStepIndex !== null && automation.steps[selectedStepIndex] ? automation.steps[selectedStepIndex] : null;
    const addStep = (actionType) => {
      const def = ACTION_DEFINITIONS.find((d3) => d3.type === actionType);
      if (!def) return;
      const newStep = {
        id: `step_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        actionType,
        params: __spreadValues({}, def.defaultParams),
        enabled: true
      };
      const newSteps = [...automation.steps, newStep];
      onChange(__spreadProps(__spreadValues({}, automation), { steps: newSteps }));
      setSelectedStepIndex(newSteps.length - 1);
      setRightPanel("config");
    };
    const removeStep = (idx) => {
      const steps = [...automation.steps];
      steps.splice(idx, 1);
      onChange(__spreadProps(__spreadValues({}, automation), { steps }));
      if (selectedStepIndex === idx) {
        setSelectedStepIndex(null);
        setRightPanel("empty");
      } else if (selectedStepIndex !== null && selectedStepIndex > idx) {
        setSelectedStepIndex(selectedStepIndex - 1);
      }
    };
    const moveStep = (idx, direction) => {
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= automation.steps.length) return;
      const steps = [...automation.steps];
      const temp = steps[idx];
      steps[idx] = steps[newIdx];
      steps[newIdx] = temp;
      onChange(__spreadProps(__spreadValues({}, automation), { steps }));
      if (selectedStepIndex === idx) {
        setSelectedStepIndex(newIdx);
      } else if (selectedStepIndex === newIdx) {
        setSelectedStepIndex(idx);
      }
    };
    const toggleStep = (idx) => {
      const steps = [...automation.steps];
      steps[idx] = __spreadProps(__spreadValues({}, steps[idx]), { enabled: !steps[idx].enabled });
      onChange(__spreadProps(__spreadValues({}, automation), { steps }));
    };
    const selectStep = (idx) => {
      setSelectedStepIndex(idx);
      setRightPanel("config");
    };
    const showPicker = () => {
      setSelectedStepIndex(null);
      setRightPanel("picker");
    };
    const updateStepParam = (key, value2) => {
      if (selectedStepIndex === null || !selectedStep) return;
      const steps = [...automation.steps];
      steps[selectedStepIndex] = __spreadProps(__spreadValues({}, steps[selectedStepIndex]), {
        params: __spreadProps(__spreadValues({}, steps[selectedStepIndex].params), { [key]: value2 })
      });
      onChange(__spreadProps(__spreadValues({}, automation), { steps }));
    };
    return /* @__PURE__ */ _(Page, null, /* @__PURE__ */ _(
      ToolHeader,
      {
        title: "Edit Automation",
        left: /* @__PURE__ */ _(IconButton, { onClick: props.onBack }, /* @__PURE__ */ _(
          IconChevronRight16,
          {
            style: { transform: "rotate(180deg)" }
          }
        ))
      }
    ), /* @__PURE__ */ _("div", { style: { display: "flex", flex: 1, minHeight: 0 } }, /* @__PURE__ */ _(
      "div",
      {
        style: {
          flex: 1,
          minWidth: 0,
          borderRight: "1px solid var(--figma-color-border)",
          display: "flex",
          flexDirection: "column"
        }
      },
      /* @__PURE__ */ _("div", { style: { padding: "8px 12px 0 12px" } }, /* @__PURE__ */ _(
        Textbox,
        {
          value: automation.name,
          onValueInput: (value2) => onChange(__spreadProps(__spreadValues({}, automation), { name: value2 })),
          placeholder: "Automation name"
        }
      )),
      /* @__PURE__ */ _("div", { style: { flex: 1, minHeight: 0, overflowY: "auto", padding: "8px 8px" } }, automation.steps.length === 0 ? /* @__PURE__ */ _(
        "div",
        {
          style: {
            fontSize: 11,
            color: "var(--figma-color-text-secondary)",
            textAlign: "center",
            padding: "24px 8px"
          }
        },
        "No steps yet"
      ) : /* @__PURE__ */ _(Stack, { space: "extraSmall" }, automation.steps.map((step, idx) => /* @__PURE__ */ _(
        StepRow,
        {
          key: step.id,
          step,
          index: idx,
          total: automation.steps.length,
          selected: selectedStepIndex === idx,
          onSelect: () => selectStep(idx),
          onToggle: () => toggleStep(idx),
          onRemove: () => removeStep(idx),
          onMoveUp: () => moveStep(idx, -1),
          onMoveDown: () => moveStep(idx, 1)
        }
      )))),
      /* @__PURE__ */ _("div", { style: { padding: "4px 8px 8px 8px" } }, /* @__PURE__ */ _(Button, { fullWidth: true, secondary: true, onClick: showPicker }, /* @__PURE__ */ _("div", { style: { display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ _(IconPlus16, null), /* @__PURE__ */ _(Text, null, "Add step"))))
    ), /* @__PURE__ */ _(
      "div",
      {
        style: {
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto"
        }
      },
      rightPanel === "picker" && /* @__PURE__ */ _(ActionPickerPanel, { onSelect: addStep }),
      rightPanel === "config" && selectedStep && /* @__PURE__ */ _(StepConfigPanel, { step: selectedStep, onUpdateParam: updateStepParam }),
      rightPanel === "empty" && /* @__PURE__ */ _(
        "div",
        {
          style: {
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24
          }
        },
        /* @__PURE__ */ _(
          Text,
          {
            style: {
              fontSize: 11,
              color: "var(--figma-color-text-tertiary)",
              textAlign: "center"
            }
          },
          'Select a step to configure, or click "Add step" to browse available actions'
        )
      )
    )), /* @__PURE__ */ _(
      "div",
      {
        style: {
          borderTop: "1px solid var(--figma-color-border)",
          padding: "8px 12px",
          display: "flex",
          gap: 8
        }
      },
      /* @__PURE__ */ _(Button, { style: { flex: 1 }, onClick: props.onSave }, "Save"),
      /* @__PURE__ */ _(Button, { style: { flex: 1 }, secondary: true, onClick: props.onExport }, "Export JSON")
    ));
  }
  function StepRow(props) {
    var _a;
    const [hovered, setHovered] = d2(false);
    const def = ACTION_DEFINITIONS.find((d3) => d3.type === props.step.actionType);
    const label = (_a = def == null ? void 0 : def.label) != null ? _a : props.step.actionType;
    const paramSummary = getParamSummary(props.step);
    return /* @__PURE__ */ _(
      "div",
      {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        onClick: props.onSelect,
        style: {
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "4px 4px",
          borderRadius: 4,
          background: props.selected ? "var(--figma-color-bg-selected)" : hovered ? "var(--figma-color-bg-hover)" : "transparent",
          opacity: props.step.enabled ? 1 : 0.5,
          cursor: "pointer"
        }
      },
      /* @__PURE__ */ _("div", { onClick: (e3) => e3.stopPropagation() }, /* @__PURE__ */ _(
        Checkbox,
        {
          value: props.step.enabled,
          onValueChange: props.onToggle
        },
        /* @__PURE__ */ _(Text, null, " ")
      )),
      /* @__PURE__ */ _("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ _("div", { style: { fontSize: 11, color: "var(--figma-color-text)" } }, props.index + 1, ". ", label), paramSummary && /* @__PURE__ */ _(
        "div",
        {
          style: {
            fontSize: 10,
            color: "var(--figma-color-text-secondary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginTop: 1
          }
        },
        paramSummary
      )),
      hovered && /* @__PURE__ */ _(
        "div",
        {
          style: { display: "flex", gap: 2, flexShrink: 0 },
          onClick: (e3) => e3.stopPropagation()
        },
        props.index > 0 && /* @__PURE__ */ _(IconButton, { onClick: props.onMoveUp }, /* @__PURE__ */ _(IconChevronDown16, { style: { transform: "rotate(180deg)" } })),
        props.index < props.total - 1 && /* @__PURE__ */ _(IconButton, { onClick: props.onMoveDown }, /* @__PURE__ */ _(IconChevronDown16, null)),
        /* @__PURE__ */ _(IconButton, { onClick: props.onRemove }, /* @__PURE__ */ _(IconClose16, null))
      )
    );
  }
  function getParamSummary(step) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    const p3 = step.params;
    switch (step.actionType) {
      case "selectByType":
        return String((_a = p3.nodeType) != null ? _a : "");
      case "selectByName":
        return `${(_b = p3.matchMode) != null ? _b : "contains"}: "${(_c = p3.pattern) != null ? _c : ""}"`;
      case "expandToChildren":
        return "";
      case "renameLayers":
        return `"${(_d = p3.find) != null ? _d : ""}" \u2192 "${(_e = p3.replace) != null ? _e : ""}"`;
      case "setFillColor":
        return String((_f = p3.hex) != null ? _f : "");
      case "setFillVariable":
        return String((_g = p3.variableName) != null ? _g : "");
      case "setOpacity":
        return `${(_h = p3.opacity) != null ? _h : 100}%`;
      case "notify":
        return String((_i = p3.message) != null ? _i : "");
      default:
        return "";
    }
  }
  function ActionPickerPanel(props) {
    return /* @__PURE__ */ _("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ _(
      "div",
      {
        style: {
          padding: "8px 12px",
          borderBottom: "1px solid var(--figma-color-border)",
          background: "var(--figma-color-bg-secondary)"
        }
      },
      /* @__PURE__ */ _(Text, { style: { fontWeight: 600, fontSize: 11 } }, "Choose an action")
    ), /* @__PURE__ */ _("div", { style: { flex: 1, overflowY: "auto" } }, ACTION_DEFINITIONS.map((def) => /* @__PURE__ */ _(ActionPickerRow, { key: def.type, def, onSelect: () => props.onSelect(def.type) }))));
  }
  function ActionPickerRow(props) {
    const [hovered, setHovered] = d2(false);
    return /* @__PURE__ */ _(
      "div",
      {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        onClick: props.onSelect,
        style: {
          padding: "8px 12px",
          cursor: "pointer",
          background: hovered ? "var(--figma-color-bg-hover)" : "transparent",
          borderBottom: "1px solid var(--figma-color-border)"
        }
      },
      /* @__PURE__ */ _("div", { style: { fontSize: 11, color: "var(--figma-color-text)" } }, props.def.label),
      /* @__PURE__ */ _(
        "div",
        {
          style: {
            fontSize: 10,
            color: "var(--figma-color-text-secondary)",
            marginTop: 2
          }
        },
        props.def.description
      )
    );
  }
  function StepConfigPanel(props) {
    const { step, onUpdateParam } = props;
    const def = ACTION_DEFINITIONS.find((d3) => d3.type === step.actionType);
    return /* @__PURE__ */ _("div", { style: { padding: 12 } }, def && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(Text, { style: { fontWeight: 600, fontSize: 12 } }, def.label), /* @__PURE__ */ _(VerticalSpace, { space: "extraSmall" }), /* @__PURE__ */ _(Text, { style: { fontSize: 11, color: "var(--figma-color-text-secondary)" } }, def.description), /* @__PURE__ */ _(VerticalSpace, { space: "medium" })), renderStepParams(step, onUpdateParam));
  }
  function renderStepParams(step, updateParam) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    switch (step.actionType) {
      case "selectByType":
        return /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(Text, { style: { fontSize: 11 } }, "Node type"), /* @__PURE__ */ _(VerticalSpace, { space: "extraSmall" }), /* @__PURE__ */ _(
          Dropdown,
          {
            value: String((_a = step.params.nodeType) != null ? _a : "TEXT"),
            options: VALID_NODE_TYPES.map((t3) => ({ value: t3 })),
            onValueChange: (v3) => updateParam("nodeType", v3)
          }
        ));
      case "selectByName":
        return /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(Text, { style: { fontSize: 11 } }, "Match mode"), /* @__PURE__ */ _(VerticalSpace, { space: "extraSmall" }), /* @__PURE__ */ _(
          Dropdown,
          {
            value: String((_b = step.params.matchMode) != null ? _b : "contains"),
            options: MATCH_MODES.map((m3) => ({ value: m3 })),
            onValueChange: (v3) => updateParam("matchMode", v3)
          }
        ), /* @__PURE__ */ _(VerticalSpace, { space: "small" }), /* @__PURE__ */ _(Text, { style: { fontSize: 11 } }, "Pattern"), /* @__PURE__ */ _(VerticalSpace, { space: "extraSmall" }), /* @__PURE__ */ _(
          Textbox,
          {
            value: String((_c = step.params.pattern) != null ? _c : ""),
            onValueInput: (v3) => updateParam("pattern", v3),
            placeholder: "Enter pattern..."
          }
        ));
      case "expandToChildren":
        return /* @__PURE__ */ _(Text, { style: { fontSize: 11, color: "var(--figma-color-text-secondary)" } }, "No parameters needed. This action replaces the current selection with all direct children of the selected nodes.");
      case "renameLayers":
        return /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(Text, { style: { fontSize: 11 } }, "Find"), /* @__PURE__ */ _(VerticalSpace, { space: "extraSmall" }), /* @__PURE__ */ _(
          Textbox,
          {
            value: String((_d = step.params.find) != null ? _d : ""),
            onValueInput: (v3) => updateParam("find", v3),
            placeholder: "Text to find..."
          }
        ), /* @__PURE__ */ _(VerticalSpace, { space: "small" }), /* @__PURE__ */ _(Text, { style: { fontSize: 11 } }, "Replace with"), /* @__PURE__ */ _(VerticalSpace, { space: "extraSmall" }), /* @__PURE__ */ _(
          Textbox,
          {
            value: String((_e = step.params.replace) != null ? _e : ""),
            onValueInput: (v3) => updateParam("replace", v3),
            placeholder: "Replacement text..."
          }
        ));
      case "setFillColor":
        return /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(Text, { style: { fontSize: 11 } }, "Hex color"), /* @__PURE__ */ _(VerticalSpace, { space: "extraSmall" }), /* @__PURE__ */ _(
          Textbox,
          {
            value: String((_f = step.params.hex) != null ? _f : "#000000"),
            onValueInput: (v3) => updateParam("hex", v3),
            placeholder: "#000000"
          }
        ));
      case "setFillVariable":
        return /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(Text, { style: { fontSize: 11 } }, "Variable name"), /* @__PURE__ */ _(VerticalSpace, { space: "extraSmall" }), /* @__PURE__ */ _(
          Textbox,
          {
            value: String((_g = step.params.variableName) != null ? _g : ""),
            onValueInput: (v3) => updateParam("variableName", v3),
            placeholder: "e.g. control-border-raised"
          }
        ));
      case "setOpacity":
        return /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(Text, { style: { fontSize: 11 } }, "Opacity (%)"), /* @__PURE__ */ _(VerticalSpace, { space: "extraSmall" }), /* @__PURE__ */ _(
          Textbox,
          {
            value: String((_h = step.params.opacity) != null ? _h : 100),
            onValueInput: (v3) => {
              const n2 = parseInt(v3, 10);
              if (!isNaN(n2)) updateParam("opacity", Math.max(0, Math.min(100, n2)));
            },
            placeholder: "0\u2013100"
          }
        ));
      case "notify":
        return /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(Text, { style: { fontSize: 11 } }, "Message"), /* @__PURE__ */ _(VerticalSpace, { space: "extraSmall" }), /* @__PURE__ */ _(
          Textbox,
          {
            value: String((_i = step.params.message) != null ? _i : ""),
            onValueInput: (v3) => updateParam("message", v3),
            placeholder: "Notification message..."
          }
        ));
      default:
        return /* @__PURE__ */ _(Text, { style: { fontSize: 11, color: "var(--figma-color-text-secondary)" } }, "Unknown action type: ", step.actionType);
    }
  }
  var init_AutomationsToolView = __esm({
    "src/app/views/automations-tool/AutomationsToolView.tsx"() {
      "use strict";
      init_lib2();
      init_preact_module();
      init_hooks_module();
      init_Page();
      init_ToolHeader();
      init_ToolBody();
      init_State();
      init_DataList();
      init_messages();
      init_types();
      init_storage();
    }
  });

  // src/app/ui.tsx
  var ui_exports = {};
  __export(ui_exports, {
    App: () => App,
    default: () => ui_default
  });
  function App() {
    const [route, setRoute] = d2("home");
    const [selectionSize, setSelectionSize] = d2(0);
    y2(() => {
      const handleMessage = (event) => {
        var _a;
        const msg = (_a = event.data) == null ? void 0 : _a.pluginMessage;
        if (!msg) return;
        if (msg.type === MAIN_TO_UI.BOOTSTRAPPED) {
          setSelectionSize(msg.selectionSize);
          const validRoutes = [
            "mockup-markup-tool",
            "color-chain-tool",
            "library-swap-tool",
            "print-color-usages-tool",
            "variables-export-import-tool",
            "variables-batch-rename-tool",
            "variables-create-linked-colors-tool",
            "variables-replace-usages-tool",
            "find-color-match-tool",
            "automations-tool"
          ];
          setRoute(
            validRoutes.includes(msg.command) ? msg.command : "home"
          );
        }
      };
      window.addEventListener("message", handleMessage);
      parent.postMessage({ pluginMessage: { type: UI_TO_MAIN.BOOT } }, "*");
      return () => window.removeEventListener("message", handleMessage);
    }, []);
    y2(() => {
      parent.postMessage(
        {
          pluginMessage: {
            type: UI_TO_MAIN.SET_ACTIVE_TOOL,
            tool: route
          }
        },
        "*"
      );
    }, [route]);
    if (route === "home") {
      return /* @__PURE__ */ _(HomeView, { goTo: setRoute });
    }
    if (route === "mockup-markup-tool") {
      return /* @__PURE__ */ _(MockupMarkupToolView, { onBack: () => setRoute("home") });
    }
    if (route === "color-chain-tool") {
      return /* @__PURE__ */ _(ColorChainToolView, { onBack: () => setRoute("home"), initialSelectionEmpty: selectionSize === 0 });
    }
    if (route === "library-swap-tool") {
      return /* @__PURE__ */ _(
        LibrarySwapToolView,
        {
          onBack: () => setRoute("home"),
          initialSelectionEmpty: selectionSize === 0
        }
      );
    }
    if (route === "print-color-usages-tool") {
      return /* @__PURE__ */ _(PrintColorUsagesToolView, { onBack: () => setRoute("home") });
    }
    if (route === "variables-export-import-tool") {
      return /* @__PURE__ */ _(VariablesExportImportToolView, { onBack: () => setRoute("home") });
    }
    if (route === "variables-batch-rename-tool") {
      return /* @__PURE__ */ _(VariablesBatchRenameToolView, { onBack: () => setRoute("home") });
    }
    if (route === "variables-create-linked-colors-tool") {
      return /* @__PURE__ */ _(VariablesCreateLinkedColorsToolView, { onBack: () => setRoute("home") });
    }
    if (route === "variables-replace-usages-tool") {
      return /* @__PURE__ */ _(
        VariablesReplaceUsagesToolView,
        {
          onBack: () => setRoute("home"),
          initialSelectionEmpty: selectionSize === 0
        }
      );
    }
    if (route === "find-color-match-tool") {
      return /* @__PURE__ */ _(
        FindColorMatchToolView,
        {
          onBack: () => setRoute("home"),
          initialSelectionEmpty: selectionSize === 0
        }
      );
    }
    if (route === "automations-tool") {
      return /* @__PURE__ */ _(AutomationsToolView, { onBack: () => setRoute("home") });
    }
    return /* @__PURE__ */ _(HomeView, { goTo: setRoute });
  }
  var ui_default;
  var init_ui = __esm({
    "src/app/ui.tsx"() {
      "use strict";
      init_lib2();
      init_preact_module();
      init_hooks_module();
      init_messages();
      init_HomeView();
      init_MockupMarkupToolView();
      init_ColorChainToolView();
      init_LibrarySwapToolView();
      init_PrintColorUsagesToolView();
      init_VariablesExportImportToolView();
      init_VariablesBatchRenameToolView();
      init_VariablesCreateLinkedColorsToolView();
      init_VariablesReplaceUsagesToolView();
      init_FindColorMatchToolView();
      init_AutomationsToolView();
      ui_default = render(App);
    }
  });

  // <stdin>
  var rootNode = document.getElementById("create-figma-plugin");
  var modules = { "src/home/main.ts--default": (init_ui(), __toCommonJS(ui_exports))["default"], "src/mockup-markup-tool/main.ts--default": (init_ui(), __toCommonJS(ui_exports))["default"], "src/color-chain-tool/main.ts--default": (init_ui(), __toCommonJS(ui_exports))["default"], "src/library-swap-tool/main.ts--default": (init_ui(), __toCommonJS(ui_exports))["default"], "src/print-color-usages-tool/main.ts--default": (init_ui(), __toCommonJS(ui_exports))["default"], "src/variables-export-import-tool/main.ts--default": (init_ui(), __toCommonJS(ui_exports))["default"], "src/variables-batch-rename-tool/main.ts--default": (init_ui(), __toCommonJS(ui_exports))["default"], "src/variables-create-linked-colors-tool/main.ts--default": (init_ui(), __toCommonJS(ui_exports))["default"], "src/variables-replace-usages-tool/main.ts--default": (init_ui(), __toCommonJS(ui_exports))["default"], "src/find-color-match-tool/main.ts--default": (init_ui(), __toCommonJS(ui_exports))["default"], "src/automations-tool/main.ts--default": (init_ui(), __toCommonJS(ui_exports))["default"] };
  var commandId = __FIGMA_COMMAND__ === "" ? "src/home/main.ts--default" : __FIGMA_COMMAND__;
  if (typeof modules[commandId] === "undefined") {
    throw new Error(
      "No UI defined for command `" + commandId + "`"
    );
  }
  modules[commandId](rootNode, __SHOW_UI_DATA__);
})();
