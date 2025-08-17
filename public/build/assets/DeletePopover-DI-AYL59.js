import{a as i,B as o,t as c}from"./useTranslation-DHlm1SLp.js";import{j as e,t as p,a as y,S as m}from"./app-BLZFXyKH.js";import{P as j,f,g as v}from"./popover-DZ2vIqHl.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],k=i("Eye",g);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]],D=i("Pen",P);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]],_=i("Trash2",N);function M({resource:s,rowModel:r,disabled:a=!1}){return e.jsx(p,{className:"m-0",href:route(s+".show",r.id),disabled:a,children:e.jsx(o,{variant:"ghost",disabled:a,children:e.jsx(k,{size:"20"})})})}function S({id:s,resource:r,disabled:a=!1}){const[l,n]=y.useState(null),d=l===s,h=()=>{l!==null&&(x(l),n(null))},x=t=>{if(t)try{m.delete(route(r+".destroy",t))}catch(u){console.error(`Failed to delete ${r}:`,u)}};return e.jsxs(j,{open:d,onOpenChange:t=>n(t?s:null),children:[e.jsx(f,{asChild:!0,children:e.jsx(o,{variant:"ghost",onClick:t=>{t.stopPropagation(),n(s)},disabled:a,children:e.jsx(_,{size:20,className:"text-red-500"})})}),e.jsxs(v,{className:"w-56 rounded-lg border border-gray-200 bg-white p-4 shadow-lg",children:[e.jsx("p",{className:"text-sm text-gray-700",children:c("messages.delete_alert")}),e.jsxs("div",{className:"mt-3 flex justify-end space-x-2",children:[e.jsx(o,{variant:"outline",size:"sm",onClick:()=>n(null),children:c("attributes.cancel")}),e.jsx(o,{variant:"destructive",size:"sm",onClick:h,children:c("attributes.delete")})]})]})]})}export{S as D,D as P,M as S};
