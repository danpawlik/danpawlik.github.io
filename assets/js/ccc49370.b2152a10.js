"use strict";(self.webpackChunkmy_web_page=self.webpackChunkmy_web_page||[]).push([[103],{9088:function(e,t,a){var r=a(7294),l=a(3905),n=a(4295),m=a(9960),c=["January","February","March","April","May","June","July","August","September","October","November","December"],s=function(e){return Math.ceil(e)};t.Z=function(e){var t=e.children,a=e.frontMatter,i=e.metadata,o=e.truncated,u=e.isBlogPostPage,d=void 0!==u&&u,E=i.date,g=i.readingTime,p=i.tags,h=i.permalink,v=i.editUrl,f=a.author,N=a.title,b=a.author_url||a.authorURL,w=a.author_image_url||a.authorImageURL,y=E.substring(0,10).split("-"),k=y[0],x=c[parseInt(y[1],10)-1],_=parseInt(y[2],10);return r.createElement("article",{className:"card shadow"},r.createElement("div",{className:"row no-gutters rows-col-2 m-3"},r.createElement("div",{className:"col-xs mr-3"},w&&r.createElement("img",{style:{width:"50px"},src:w,alt:f})),r.createElement("div",{className:"col"},f&&r.createElement("h5",null,r.createElement("a",{href:b,rel:f},f)),r.createElement("time",{className:"card-subtitle mb-md-4 font-weight-light",dateTime:E},x," ",_,", ",k," ",d&&g&&r.createElement(r.Fragment,null," \xb7 ",s(g)," min read"))),r.createElement("div",{className:"col text-right"},d&&v&&r.createElement("span",null,r.createElement("a",{href:v,target:"_blank",rel:"noreferrer noopener"},r.createElement("svg",{fill:"currentColor",height:"1.2em",width:"1.2em",preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 40 40",style:{marginRight:"0.3em",verticalAlign:"sub"}},r.createElement("g",null,r.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"}))),"Edit this page")))),r.createElement("div",{className:"card-body"},r.createElement("h3",{className:"card-title text-primary mr-2"},N),r.createElement("section",null,r.createElement(l.Zo,{components:n.Z},t))),r.createElement("footer",{className:"row no-gutters m-3 justify-content-between"},r.createElement("div",{className:"col col-xs"},p.length>0&&r.createElement(r.Fragment,null,p.map((function(e){var t=e.label,a=e.permalink;return r.createElement(m.Z,{key:a,className:"m-1",to:a},r.createElement("span",{className:"badge badge-primary"},t))})))),r.createElement("div",{className:"col align-self-center text-right"},!d&&g&&r.createElement("small",{className:o?"mr-2":""},s(g)," min read"),o&&r.createElement(m.Z,{to:h,"aria-label":"Read more about "+N},r.createElement("span",{className:"stretched-link"},"Read more")))))}},5715:function(e,t,a){a.r(t),a.d(t,{default:function(){return s}});var r=a(7294),l=a(9306),n=a(9088),m=a(9960);var c=function(e){var t=e.nextItem,a=e.prevItem;return r.createElement("nav",{"aria-label":"Blog post page navigation",className:"my-5"},r.createElement("ul",{className:"pagination justify-content-between"},r.createElement("li",{className:"pagination__item"},a&&r.createElement(m.Z,{className:"page-link",to:a.permalink},"\xab ",a.title)),r.createElement("li",{className:"pagination__item"},t&&r.createElement(m.Z,{className:"page-link",to:t.permalink},t.title," \xbb"))))};var s=function(e){var t=e.content,a=t.frontMatter,m=t.metadata,s=m.title,i=m.description,o=m.nextItem,u=m.prevItem;return r.createElement(l.Z,{title:s,description:i},r.createElement("div",{className:"container-fluid my-5"},r.createElement("div",{className:"row row-cols-1 row-cols-sm-1"},r.createElement("div",{key:m.permalink,className:"col col-xl-4 offset-xl-4 col-xs-6 mb-5"},r.createElement(n.Z,{frontMatter:a,metadata:m,isBlogPostPage:!0},r.createElement(t,null)),(o||u)&&r.createElement(c,{nextItem:o,prevItem:u})))))}}}]);