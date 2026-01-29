(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
    var a3, h3, p3, v3, y3, _3, m3, b2, S2, C3, M2, $2, P4, A4, H3, L2, T4, j4 = u3.type;
    if (void 0 !== u3.constructor) return null;
    128 & t3.__u && (c3 = !!(32 & t3.__u), r3 = [f3 = u3.__e = t3.__e]), (a3 = l.__b) && a3(u3);
    n: if ("function" == typeof j4) try {
      if (b2 = u3.props, S2 = "prototype" in j4 && j4.prototype.render, C3 = (a3 = j4.contextType) && i3[a3.__c], M2 = a3 ? C3 ? C3.props.value : a3.__ : i3, t3.__c ? m3 = (h3 = u3.__c = t3.__c).__ = h3.__E : (S2 ? u3.__c = h3 = new j4(b2, M2) : (u3.__c = h3 = new x(b2, M2), h3.constructor = j4, h3.render = E), C3 && C3.sub(h3), h3.state || (h3.state = {}), h3.__n = i3, p3 = h3.__d = true, h3.__h = [], h3._sb = []), S2 && null == h3.__s && (h3.__s = h3.state), S2 && null != j4.getDerivedStateFromProps && (h3.__s == h3.state && (h3.__s = w({}, h3.__s)), w(h3.__s, j4.getDerivedStateFromProps(b2, h3.__s))), v3 = h3.props, y3 = h3.state, h3.__v = u3, p3) S2 && null == j4.getDerivedStateFromProps && null != h3.componentWillMount && h3.componentWillMount(), S2 && null != h3.componentDidMount && h3.__h.push(h3.componentDidMount);
      else {
        if (S2 && null == j4.getDerivedStateFromProps && b2 !== v3 && null != h3.componentWillReceiveProps && h3.componentWillReceiveProps(b2, M2), u3.__v == t3.__v || !h3.__e && null != h3.shouldComponentUpdate && false === h3.shouldComponentUpdate(b2, h3.__s, M2)) {
          for (u3.__v != t3.__v && (h3.props = b2, h3.state = h3.__s, h3.__d = false), u3.__e = t3.__e, u3.__k = t3.__k, u3.__k.some(function(n3) {
            n3 && (n3.__ = u3);
          }), $2 = 0; $2 < h3._sb.length; $2++) h3.__h.push(h3._sb[$2]);
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

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/8b6d9bdd-7c9d-4558-bfbd-6bb8e5bfca06/divider.module.js
  var divider_module_default;
  var init_divider_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/8b6d9bdd-7c9d-4558-bfbd-6bb8e5bfca06/divider.module.js"() {
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

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/51aab26c-832f-4d59-9e5a-0f55164ecd45/icon-button.module.js
  var icon_button_module_default;
  var init_icon_button_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/51aab26c-832f-4d59-9e5a-0f55164ecd45/icon-button.module.js"() {
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

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/088ba629-b896-47fe-8ea2-a0dcf968a2ce/text.module.js
  var text_module_default;
  var init_text_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/088ba629-b896-47fe-8ea2-a0dcf968a2ce/text.module.js"() {
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

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/da93a26b-e213-4322-88f9-34cb609e026a/container.module.js
  var container_module_default;
  var init_container_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/da93a26b-e213-4322-88f9-34cb609e026a/container.module.js"() {
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

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/8ebd6faf-3ba5-468c-a748-b6dc5ef8f2bf/vertical-space.module.js
  var vertical_space_module_default;
  var init_vertical_space_module = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/8ebd6faf-3ba5-468c-a748-b6dc5ef8f2bf/vertical-space.module.js"() {
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

  // ../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/6de878e4-d4c8-4490-9e29-350056674bee/base.js
  var init_base = __esm({
    "../../../../private/var/folders/2j/0wddr5mn7c76chg83p1p6n580000gp/T/6de878e4-d4c8-4490-9e29-350056674bee/base.js"() {
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
  var init_lib = __esm({
    "node_modules/@create-figma-plugin/ui/lib/index.js"() {
      init_divider();
      init_icon_button();
      init_text();
      init_icon_home_16();
      init_icon_link_16();
      init_icon_interaction_click_small_24();
      init_container();
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
        INSPECT_SELECTION_FOR_VARIABLE_CHAINS: "INSPECT_SELECTION_FOR_VARIABLE_CHAINS"
      };
      MAIN_TO_UI = {
        BOOTSTRAPPED: "BOOTSTRAPPED",
        VARIABLE_CHAINS_RESULT: "VARIABLE_CHAINS_RESULT",
        SELECTION_EMPTY: "SELECTION_EMPTY",
        ERROR: "ERROR"
      };
    }
  });

  // src/app/components/custom-icons/index.tsx
  function SvgIcon16(props) {
    var _a, _b;
    const color = (_a = props.color) != null ? _a : "currentColor";
    const opacity = (_b = props.opacity) != null ? _b : 0.9;
    return /* @__PURE__ */ _("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-label": props.title }, /* @__PURE__ */ _("path", { d: props.pathD, fill: color, fillOpacity: opacity }));
  }
  function IconArrowDown16(props) {
    return /* @__PURE__ */ _(
      SvgIcon16,
      __spreadProps(__spreadValues({}, props), {
        pathD: "M10.8523 10.8531C11.0475 10.6579 11.0476 10.3413 10.8523 10.1461C10.6571 9.95123 10.3404 9.95108 10.1453 10.1461L7.99978 12.2926L7.99978 2.49963C7.99958 2.22366 7.7758 1.99963 7.49978 1.99963C7.22386 1.99975 6.99998 2.22373 6.99978 2.49963L6.99978 12.2926L4.85232 10.1461C4.65706 9.95123 4.34044 9.95109 4.14529 10.1461C3.95019 10.3413 3.95038 10.6579 4.14529 10.8531L7.14627 13.8531C7.34154 14.0484 7.65807 14.0484 7.8533 13.8531L10.8523 10.8531Z"
      })
    );
  }
  function IconChevronDown16(props) {
    return /* @__PURE__ */ _(
      SvgIcon16,
      __spreadProps(__spreadValues({}, props), {
        pathD: "M9.76731 6.76777C9.96257 6.5725 10.2801 6.5725 10.4753 6.76777C10.6702 6.96296 10.6702 7.2796 10.4753 7.4748L7.99973 9.94941L5.52512 7.4748C5.32986 7.27953 5.32986 6.96303 5.52512 6.76777C5.72039 6.5725 6.03689 6.5725 6.23216 6.76777L7.99973 8.53534L9.76731 6.76777Z"
      })
    );
  }
  function IconChevronRight16(props) {
    return /* @__PURE__ */ _("span", { style: { display: "flex", lineHeight: 0, transform: "rotate(-90deg)" } }, /* @__PURE__ */ _(IconChevronDown16, __spreadValues({}, props)));
  }
  var init_custom_icons = __esm({
    "src/app/components/custom-icons/index.tsx"() {
      "use strict";
      init_preact_module();
    }
  });

  // src/app/components/AppIcons.tsx
  var init_AppIcons = __esm({
    "src/app/components/AppIcons.tsx"() {
      "use strict";
      init_custom_icons();
    }
  });

  // src/app/components/Tree.tsx
  function Caret(props) {
    if (!props.showCaret) {
      return null;
    }
    return /* @__PURE__ */ _(
      "div",
      {
        style: {
          width: 16,
          height: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--figma-color-icon)",
          // Use chevron-down rotated left when collapsed (like Disclosure)
          transform: props.open ? "rotate(0deg)" : "rotate(-90deg)",
          transformOrigin: "50% 50%"
        }
      },
      /* @__PURE__ */ _(IconChevronDown16, null)
    );
  }
  function TreeRow(props) {
    var _a;
    const { node } = props;
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    const isCollapsible = hasChildren && node.collapsible !== false;
    const paddingLeft = props.level * 16;
    const handleToggle = () => {
      if (!isCollapsible) return;
      props.onToggle();
    };
    return /* @__PURE__ */ _(
      "div",
      {
        role: isCollapsible ? "button" : void 0,
        tabIndex: isCollapsible ? 0 : -1,
        onClick: handleToggle,
        onKeyDown: (e3) => {
          if (!isCollapsible) return;
          if (e3.key === "Enter" || e3.key === " ") {
            e3.preventDefault();
            handleToggle();
          }
        },
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: 32,
          padding: "0 var(--space-small)",
          paddingLeft: `calc(var(--space-small) + ${paddingLeft}px)`,
          cursor: isCollapsible ? "pointer" : "default",
          userSelect: "none"
        },
        title: isCollapsible ? "Click to expand" : void 0
      },
      isCollapsible ? /* @__PURE__ */ _(Caret, { open: props.open, showCaret: true }) : null,
      /* @__PURE__ */ _("div", { style: { width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" } }, (_a = node.icon) != null ? _a : null),
      /* @__PURE__ */ _("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ _(
        "div",
        {
          style: {
            fontSize: 11,
            color: "var(--figma-color-text)",
            fontWeight: node.titleStrong ? 600 : 400,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }
        },
        node.title
      )),
      node.description ? /* @__PURE__ */ _(
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
        node.description
      ) : null
    );
  }
  function TreeNodeView(props) {
    var _a;
    if (props.node.kind === "spacer") {
      return /* @__PURE__ */ _("div", { style: { height: (_a = props.node.height) != null ? _a : 12 } });
    }
    const hasChildren = Array.isArray(props.node.children) && props.node.children.length > 0;
    const isCollapsible = hasChildren && props.node.collapsible !== false;
    const open = isCollapsible && typeof props.openById[props.node.id] === "boolean" ? props.openById[props.node.id] === true : true;
    return /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(TreeRow, { level: props.level, node: props.node, open, onToggle: () => props.onToggle(props.node.id) }), hasChildren && open ? props.node.children.map((child) => /* @__PURE__ */ _(
      TreeNodeView,
      {
        key: child.id,
        node: child,
        level: props.level + 1,
        openById: props.openById,
        onToggle: props.onToggle
      }
    )) : null);
  }
  function Tree(props) {
    return /* @__PURE__ */ _(k, null, props.nodes.map((node) => /* @__PURE__ */ _(TreeNodeView, { key: node.id, node, level: 0, openById: props.openById, onToggle: props.onToggle })));
  }
  var init_Tree = __esm({
    "src/app/components/Tree.tsx"() {
      "use strict";
      init_preact_module();
      init_AppIcons();
    }
  });

  // src/app/components/EmptyState.tsx
  function EmptyState(props) {
    return /* @__PURE__ */ _(
      Container,
      {
        space: "small",
        style: {
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "var(--figma-color-text-secondary)",
          padding: "24px 12px"
        }
      },
      /* @__PURE__ */ _(
        "div",
        {
          style: {
            color: "var(--figma-color-text-secondary)",
            transform: "scale(2)",
            transformOrigin: "50% 50%",
            lineHeight: 0
          }
        },
        props.icon
      ),
      /* @__PURE__ */ _(VerticalSpace, { space: "small" }),
      /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)" } }, props.title),
      props.description ? /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(VerticalSpace, { space: "extraSmall" }), /* @__PURE__ */ _(Text, { style: { color: "var(--figma-color-text-secondary)" } }, props.description)) : null
    );
  }
  var init_EmptyState = __esm({
    "src/app/components/EmptyState.tsx"() {
      "use strict";
      init_lib();
      init_preact_module();
    }
  });

  // src/app/components/UtilityHeader.tsx
  function UtilityHeader(props) {
    return /* @__PURE__ */ _("div", null, /* @__PURE__ */ _(Container, { space: "small" }, /* @__PURE__ */ _("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, props.left ? /* @__PURE__ */ _("div", { style: { display: "flex", alignItems: "center" } }, props.left) : null, /* @__PURE__ */ _(Text, { style: { fontWeight: 600 } }, props.title)), /* @__PURE__ */ _(VerticalSpace, { space: "small" })));
  }
  var init_UtilityHeader = __esm({
    "src/app/components/UtilityHeader.tsx"() {
      "use strict";
      init_lib();
      init_preact_module();
    }
  });

  // src/app/components/UtilityCard.tsx
  function UtilityCard(props) {
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
          gap: 12,
          padding: 12,
          border: hovered ? "1px solid var(--figma-color-border-strong)" : "1px solid var(--figma-color-border)",
          borderRadius: 8,
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
            borderRadius: 8,
            border: "1px solid var(--figma-color-border)",
            background: "var(--figma-color-bg-secondary)",
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
            fontWeight: 600,
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
            marginTop: 2,
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
        /* @__PURE__ */ _(IconChevronRight16, null)
      )
    );
  }
  var init_UtilityCard = __esm({
    "src/app/components/UtilityCard.tsx"() {
      "use strict";
      init_AppIcons();
      init_preact_module();
      init_hooks_module();
    }
  });

  // src/app/ui.tsx
  var ui_exports = {};
  __export(ui_exports, {
    App: () => App,
    default: () => ui_default
  });
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
          padding: 12,
          display: "flex",
          flexDirection: "column"
        }
      },
      props.children
    );
  }
  function HomeView(props) {
    return /* @__PURE__ */ _(Page, null, /* @__PURE__ */ _(Container, { space: "small" }, /* @__PURE__ */ _(Text, null, "This plugin bundles internal design utilities. Pick a tool below, or run it directly from the Figma Plugins menu."), /* @__PURE__ */ _(VerticalSpace, { space: "medium" }), /* @__PURE__ */ _(Divider, null), /* @__PURE__ */ _(VerticalSpace, { space: "medium" }), /* @__PURE__ */ _(Text, null, "Utilities"), /* @__PURE__ */ _(VerticalSpace, { space: "small" }), /* @__PURE__ */ _(
      UtilityCard,
      {
        title: "Variable Chain Inspector",
        description: "Inspect selection to see full variable alias chains.",
        icon: /* @__PURE__ */ _(IconLink16, null),
        onClick: () => props.goTo("chain-inspector")
      }
    )));
  }
  function ColorSwatch(props) {
    const hex = props.hex;
    const swatchSize = 16;
    return /* @__PURE__ */ _(
      "div",
      {
        style: {
          width: swatchSize,
          height: swatchSize,
          borderRadius: 4,
          border: "1px solid var(--figma-color-border)",
          backgroundColor: hex != null ? hex : "transparent",
          boxSizing: "border-box"
        },
        title: hex != null ? hex : "N/A"
      }
    );
  }
  function ChainInspectorView(props) {
    const [loading, setLoading] = d2(true);
    const [results, setResults] = d2([]);
    const [error, setError] = d2(null);
    const [openById, setOpenById] = d2({});
    const [selectionEmpty, setSelectionEmpty] = d2(props.initialSelectionEmpty);
    y2(() => {
      const handleMessage = (event) => {
        var _a;
        const msg = (_a = event.data) == null ? void 0 : _a.pluginMessage;
        if (!msg) return;
        if (msg.type === MAIN_TO_UI.ERROR) {
          setLoading(false);
          setError(msg.message);
          return;
        }
        if (msg.type === MAIN_TO_UI.SELECTION_EMPTY) {
          setLoading(false);
          setResults([]);
          setOpenById({});
          setSelectionEmpty(true);
          setError(null);
          return;
        }
        if (msg.type === MAIN_TO_UI.VARIABLE_CHAINS_RESULT) {
          setLoading(false);
          setResults(msg.results);
          setOpenById({});
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
    const sortedResults = T2(() => {
      return results.slice().sort((a3, b2) => a3.layerName.localeCompare(b2.layerName));
    }, [results]);
    const totalColors = T2(() => {
      return results.reduce((sum, layer) => {
        var _a, _b;
        return sum + ((_b = (_a = layer.colors) == null ? void 0 : _a.length) != null ? _b : 0);
      }, 0);
    }, [results]);
    return /* @__PURE__ */ _(Page, null, /* @__PURE__ */ _(
      UtilityHeader,
      {
        title: "Variable Chain Inspector",
        left: /* @__PURE__ */ _(IconButton, { onClick: props.onBack, title: "Home" }, /* @__PURE__ */ _(IconHome16, null))
      }
    ), /* @__PURE__ */ _("div", { style: { flex: 1, overflow: "auto" } }, /* @__PURE__ */ _(Container, { space: "small" }, error ? /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(Text, null, error), /* @__PURE__ */ _(VerticalSpace, { space: "small" })) : null, loading && !error && !selectionEmpty && sortedResults.length === 0 ? /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(Text, null, "Inspecting selection\u2026"), /* @__PURE__ */ _(VerticalSpace, { space: "small" })) : null, selectionEmpty && !error ? /* @__PURE__ */ _(
      EmptyState,
      {
        icon: /* @__PURE__ */ _(IconInteractionClickSmall24, null),
        title: "Select a layer to see variables color chain."
      }
    ) : null, !selectionEmpty && !error && sortedResults.length > 0 && totalColors === 0 ? /* @__PURE__ */ _(
      EmptyState,
      {
        icon: /* @__PURE__ */ _(IconInteractionClickSmall24, null),
        title: "No variable-bound colors found in selection."
      }
    ) : null, sortedResults.length > 0 ? /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(Divider, null), /* @__PURE__ */ _(VerticalSpace, { space: "small" }), /* @__PURE__ */ _(
      Tree,
      {
        nodes: (() => {
          var _a, _b, _c, _d;
          const nodes = [];
          const multiLayer = sortedResults.length > 1;
          const spaceHeight = 12;
          for (const layer of sortedResults) {
            const colors = layer.colors.slice().sort((a3, b2) => a3.variableName.localeCompare(b2.variableName));
            for (const c3 of colors) {
              const applied = c3.appliedMode;
              let currentModeChain = null;
              if (applied.status === "single") {
                currentModeChain = (_a = c3.chains.find((ch) => ch.modeId === applied.modeId)) != null ? _a : null;
              }
              const chainToRender = (_b = currentModeChain != null ? currentModeChain : c3.chains[0]) != null ? _b : null;
              const swatchHex = (_c = chainToRender == null ? void 0 : chainToRender.finalHex) != null ? _c : null;
              const chainSteps = (chainToRender == null ? void 0 : chainToRender.chain) ? chainToRender.chain.slice(1) : [];
              nodes.push({
                id: `${layer.layerId}:${c3.variableId}`,
                title: c3.variableName,
                description: multiLayer ? `${layer.layerName} \xB7 ${c3.collectionName}` : c3.collectionName,
                icon: /* @__PURE__ */ _(ColorSwatch, { hex: swatchHex }),
                titleStrong: true
              });
              for (let idx = 0; idx < chainSteps.length; idx++) {
                const step = chainSteps[idx];
                nodes.push({
                  id: `${layer.layerId}:${c3.variableId}:step:${idx}`,
                  title: step,
                  icon: /* @__PURE__ */ _(
                    "span",
                    {
                      style: {
                        color: "var(--figma-color-text-secondary)",
                        opacity: 0.8,
                        display: "inline-flex"
                      }
                    },
                    /* @__PURE__ */ _(IconArrowDown16, null)
                  )
                });
              }
              nodes.push({
                id: `${layer.layerId}:${c3.variableId}:hex`,
                title: (_d = chainToRender == null ? void 0 : chainToRender.finalHex) != null ? _d : "N/A"
              });
              nodes.push({
                kind: "spacer",
                id: `${layer.layerId}:${c3.variableId}:spacer`,
                height: spaceHeight
              });
            }
          }
          if (nodes.length > 0 && nodes[nodes.length - 1].kind === "spacer") {
            nodes.pop();
          }
          return nodes;
        })(),
        openById,
        onToggle: (id) => setOpenById((prev) => {
          const current = prev[id];
          const isOpen = typeof current === "boolean" ? current : true;
          return __spreadProps(__spreadValues({}, prev), { [id]: !isOpen });
        })
      }
    )) : null)));
  }
  function App() {
    const [route, setRoute] = d2("home");
    const [bootCommand, setBootCommand] = d2("home");
    const [selectionSize, setSelectionSize] = d2(0);
    y2(() => {
      const handleMessage = (event) => {
        var _a;
        const msg = (_a = event.data) == null ? void 0 : _a.pluginMessage;
        if (!msg) return;
        if (msg.type === MAIN_TO_UI.BOOTSTRAPPED) {
          setBootCommand(msg.command);
          setSelectionSize(msg.selectionSize);
          setRoute(msg.command === "chain-inspector" ? "chain-inspector" : "home");
        }
      };
      window.addEventListener("message", handleMessage);
      parent.postMessage({ pluginMessage: { type: UI_TO_MAIN.BOOT } }, "*");
      return () => window.removeEventListener("message", handleMessage);
    }, []);
    return route === "home" ? /* @__PURE__ */ _(HomeView, { goTo: setRoute }) : /* @__PURE__ */ _(
      ChainInspectorView,
      {
        onBack: () => setRoute("home"),
        initialSelectionEmpty: selectionSize === 0
      }
    );
  }
  var ui_default;
  var init_ui = __esm({
    "src/app/ui.tsx"() {
      "use strict";
      init_lib();
      init_preact_module();
      init_hooks_module();
      init_messages();
      init_Tree();
      init_EmptyState();
      init_UtilityHeader();
      init_UtilityCard();
      init_AppIcons();
      ui_default = render(App);
    }
  });

  // <stdin>
  var rootNode = document.getElementById("create-figma-plugin");
  var modules = { "src/home/main.ts--default": (init_ui(), __toCommonJS(ui_exports))["default"], "src/chain-inspector/main.ts--default": (init_ui(), __toCommonJS(ui_exports))["default"] };
  var commandId = __FIGMA_COMMAND__ === "" ? "src/home/main.ts--default" : __FIGMA_COMMAND__;
  if (typeof modules[commandId] === "undefined") {
    throw new Error(
      "No UI defined for command `" + commandId + "`"
    );
  }
  modules[commandId](rootNode, __SHOW_UI_DATA__);
})();
