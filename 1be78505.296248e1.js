(window.webpackJsonp=window.webpackJsonp||[]).push([[6,35],{74:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(24),o=a(88),c=a(3),i=a(79),s=a(80),u=a(103),m=a(7),d=a(89),b=a(4),f=a(1),v=a.n(f),p=a(82),h=a.n(p),k=a(84),E={active:v.a.bool,"aria-label":v.a.string,block:v.a.bool,color:v.a.string,disabled:v.a.bool,outline:v.a.bool,tag:k.g,innerRef:v.a.oneOfType([v.a.object,v.a.func,v.a.string]),onClick:v.a.func,size:v.a.string,children:v.a.node,className:v.a.string,cssModule:v.a.object,close:v.a.bool},g=function(e){function t(t){var a;return(a=e.call(this,t)||this).onClick=a.onClick.bind(Object(d.a)(a)),a}Object(b.a)(t,e);var a=t.prototype;return a.onClick=function(e){if(!this.props.disabled)return this.props.onClick?this.props.onClick(e):void 0;e.preventDefault()},a.render=function(){var e=this.props,t=e.active,a=e["aria-label"],n=e.block,r=e.className,o=e.close,i=e.cssModule,s=e.color,u=e.outline,d=e.size,b=e.tag,f=e.innerRef,v=Object(m.a)(e,["active","aria-label","block","className","close","cssModule","color","outline","size","tag","innerRef"]);o&&void 0===v.children&&(v.children=l.a.createElement("span",{"aria-hidden":!0},"\xd7"));var p="btn"+(u?"-outline":"")+"-"+s,E=Object(k.d)(h()(r,{close:o},o||"btn",o||p,!!d&&"btn-"+d,!!n&&"btn-block",{active:t,disabled:this.props.disabled}),i);v.href&&"button"===b&&(b="a");var g=o?"Close":null;return l.a.createElement(b,Object(c.a)({type:"button"===b&&v.onClick?"button":void 0},v,{className:E,ref:f,onClick:this.onClick,"aria-label":a||g}))},t}(l.a.Component);g.propTypes=E,g.defaultProps={color:"secondary",tag:"button"};var w=g,y=a(104);var N=function(e){void 0===e&&(e=!0),Object(n.useEffect)((function(){return document.body.style.overflow=e?"hidden":"visible",window.scrollTo(0,0),function(){document.body.style.overflow="visible"}}),[e])},C=a(48),j=a.n(C),M=function e(t){var a=t.item,n=t.onItemClick;return"category"===a.type?a.items.length>0?l.a.createElement("div",null,l.a.createElement("h4",{className:"ml-2"},a.label),a.items.map((function(t){return l.a.createElement(e,{key:t.label,item:t,onItemClick:n})}))):l.a.createElement(l.a.Fragment,null):"link"===a.type?l.a.createElement(u.a,null,l.a.createElement(i.a,Object(c.a)({key:a.label,className:"sidebar-item m-4 text-white",to:a.href},Object(s.a)(a.href)?{isNavLink:!0,activeClassName:"active",exact:!0,onClick:n}:{target:"_blank",rel:"noreferrer noopener"}),a.label)):l.a.createElement(l.a.Fragment,null)},O=function(e){var t,a=e.sidebar,r=Object(n.useState)(!1),o=r[0],c=r[1],i=Object(n.useCallback)((function(){c(!o)}),[o,c]);return N(o),l.a.createElement("div",{className:h()("bg-info",j.a.sidebar)},l.a.createElement("div",{className:h()("text-white",(t={},t[j.a.isOpen]=o,t))},l.a.createElement("div",{className:"d-flex w-100 justify-content-end mr-5"},l.a.createElement(w,{color:"secondary",onClick:i,className:h()("mr-2",j.a.sidebarFAB)},l.a.createElement("svg",{"aria-label":"Menu",xmlns:"http://www.w3.org/2000/svg",height:24,width:24,viewBox:"0 0 32 32",role:"img",focusable:"false"},l.a.createElement("title",null,"Menu"),l.a.createElement("path",{stroke:"currentColor",strokeLinecap:"round",strokeMiterlimit:"10",strokeWidth:"2",d:"M4 7h22M4 15h22M4 23h22"})))),l.a.createElement("div",{className:h()(j.a.sideMenu)},l.a.createElement(y.a,{vertical:!0,className:"list-unstyled p-3 mr-auto"},a.map((function(e){return l.a.createElement(M,{key:e.label,item:e,onItemClick:function(e){e.currentTarget.blur(),c(!1)}})}))))))},x=a(86),R=a(83),D=a(78),F=a(9);function T(e){var t=e.currentDocRoute,a=e.versionMetadata,n=e.children,r=a.permalinkToSidebar,o=a.docsSidebars,c=r[t.path],i=o[c];return l.a.createElement(R.a,{title:"Doc page",description:"My Doc page"},l.a.createElement("div",{className:"d-flex vh-100"},i&&l.a.createElement("div",{role:"complementary"},l.a.createElement(O,{key:c,sidebar:i})),l.a.createElement("main",{className:"w-100 align-items-center overflow-auto p-5"},l.a.createElement(D.a,{components:x.a},n))))}t.default=function(e){var t=e.route.routes,a=e.versionMetadata,n=e.location,c=t.find((function(e){return Object(F.d)(n.pathname,e)}));return c?l.a.createElement(T,{currentDocRoute:c,versionMetadata:a},Object(r.a)(t)):l.a.createElement(o.default,e)}},88:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(83);t.default=function(){return l.a.createElement(r.a,{title:"Page Not Found"},l.a.createElement("div",{className:"container my-xl-3"},l.a.createElement("div",{className:"row"},l.a.createElement("div",{className:"col col-6 offset-3"},l.a.createElement("h1",null,"Page Not Found"),l.a.createElement("p",null,"We could not find what you were looking for."),l.a.createElement("p",null,"Please contact the owner of the site that linked you to the original URL and let them know their link is broken.")))))}}}]);