(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{75:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(80),i=n(23),o=n(79);var l=function(e){const{previous:t,next:n}=e.metadata;return r.a.createElement("nav",{"aria-label":"Doc list page navigation",className:"my-5 p-0"},r.a.createElement("ul",{className:"pagination justify-content-between"},r.a.createElement("li",{className:"page-item mr-2"},t&&r.a.createElement(o.a,{className:"page-link",to:t.permalink},"\xab ",t.title)),r.a.createElement("li",{className:"page-item ml-2"},n&&r.a.createElement(o.a,{className:"page-link",to:n.permalink},n.title," \xbb"))))},s=n(20),u=n(81);t.default=function(e){const{siteConfig:t={}}=Object(s.a)(),{url:n,title:a,titleDelimiter:o=" | "}=t,{content:m}=e,{metadata:p}=m,{description:f,title:d,permalink:b}=p,{frontMatter:{image:v,keywords:g}}=m,w=d?`${d} ${o} ${a}`:a;let E=n+Object(u.a)(v);return Object(c.a)(v)||(E=v),r.a.createElement(r.a.Fragment,null,r.a.createElement(i.a,null,r.a.createElement("title",null,w),r.a.createElement("meta",{property:"og:title",content:w}),f&&r.a.createElement("meta",{name:"description",content:f}),f&&r.a.createElement("meta",{property:"og:description",content:f}),g&&g.length&&r.a.createElement("meta",{name:"keywords",content:g.join(",")}),v&&r.a.createElement("meta",{property:"og:image",content:E}),v&&r.a.createElement("meta",{property:"twitter:image",content:E}),v&&r.a.createElement("meta",{name:"twitter:image:alt",content:`Image for ${d}`}),b&&r.a.createElement("meta",{property:"og:url",content:n+b})),r.a.createElement("main",{className:"col col-md-8 p-0"},r.a.createElement(m,null),r.a.createElement(l,{metadata:p})))}},79:function(e,t,n){"use strict";var a=n(0),r=n.n(a),c=n(9),i=n(80),o=n(22);const l=Object(a.createContext)({collectLink:()=>{}});var s=n(81),u=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(a=Object.getOwnPropertySymbols(e);r<a.length;r++)t.indexOf(a[r])<0&&Object.prototype.propertyIsEnumerable.call(e,a[r])&&(n[a[r]]=e[a[r]])}return n};t.a=function(e){var t,{isNavLink:n,to:m,href:p,activeClassName:f,isActive:d,"data-noBrokenLinkCheck":b}=e,v=u(e,["isNavLink","to","href","activeClassName","isActive","data-noBrokenLinkCheck"]);const{withBaseUrl:g}=Object(s.b)(),w=Object(a.useContext)(l),E=m||p,O=Object(i.a)(E),h=null==E?void 0:E.replace("pathname://",""),k=void 0!==h?(e=>e.startsWith("/"))(j=h)?g(j):j:void 0;var j;const y=Object(a.useRef)(!1),N=n?c.c:c.b,C=o.a.canUseIntersectionObserver;let B;Object(a.useEffect)((()=>(!C&&O&&window.docusaurus.prefetch(k),()=>{C&&B&&B.disconnect()})),[k,C,O]);const L=null!==(t=null==k?void 0:k.startsWith("#"))&&void 0!==t&&t,U=!k||!O||L;return k&&O&&!L&&!b&&w.collectLink(k),U?r.a.createElement("a",Object.assign({href:k},E&&!O&&{target:"_blank",rel:"noopener noreferrer"},v)):r.a.createElement(N,Object.assign({},v,{onMouseEnter:()=>{y.current||(window.docusaurus.preload(k),y.current=!0)},innerRef:e=>{var t,n;C&&e&&O&&(t=e,n=()=>{window.docusaurus.prefetch(k)},B=new window.IntersectionObserver((e=>{e.forEach((e=>{t===e.target&&(e.isIntersecting||e.intersectionRatio>0)&&(B.unobserve(t),B.disconnect(),n())}))})),B.observe(t))},to:k||""},n&&{isActive:d,activeClassName:f}))}},80:function(e,t,n){"use strict";function a(e){return!0===/^(\w*:|\/\/)/.test(e)}function r(e){return void 0!==e&&!a(e)}n.d(t,"b",(function(){return a})),n.d(t,"a",(function(){return r}))},81:function(e,t,n){"use strict";n.d(t,"b",(function(){return c})),n.d(t,"a",(function(){return i}));var a=n(20),r=n(80);function c(){const{siteConfig:{baseUrl:e="/",url:t}={}}=Object(a.a)();return{withBaseUrl:(n,a)=>function(e,t,n,{forcePrependBaseUrl:a=!1,absolute:c=!1}={}){if(!n)return n;if(n.startsWith("#"))return n;if(Object(r.b)(n))return n;if(a)return t+n;const i=n.startsWith(t)?n:t+n.replace(/^\//,"");return c?e+i:i}(t,e,n,a)}}function i(e,t={}){const{withBaseUrl:n}=c();return n(e,t)}}}]);