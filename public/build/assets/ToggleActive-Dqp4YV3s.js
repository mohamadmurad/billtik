import { a as d, j as n, S as I } from './app-BByt-vRR.js';
import { a as v, b as C } from './useTranslation-bnkdia7D.js';
import { a as A, c as M, u as E } from './index-DcpkmAXS.js';
import { u as z } from './index-Cz6UcpYs.js';
import { P as y } from './index-BeV8M8zn.js';

function U(e, o, { checkForDefaultPrevented: t = !0 } = {}) {
    return function (r) {
        if ((e == null || e(r), t === !1 || !r.defaultPrevented)) return o == null ? void 0 : o(r);
    };
}
var k = 'Switch',
    [q, Q] = M(k),
    [F, L] = q(k),
    P = d.forwardRef((e, o) => {
        const {
                __scopeSwitch: t,
                name: s,
                checked: r,
                defaultChecked: p,
                required: i,
                disabled: a,
                value: c = 'on',
                onCheckedChange: l,
                form: u,
                ...w
            } = e,
            [h, f] = d.useState(null),
            x = C(o, (b) => f(b)),
            S = d.useRef(!1),
            g = h ? u || !!h.closest('form') : !0,
            [m, T] = E({ prop: r, defaultProp: p ?? !1, onChange: l, caller: k });
        return n.jsxs(F, {
            scope: t,
            checked: m,
            disabled: a,
            children: [
                n.jsx(y.button, {
                    type: 'button',
                    role: 'switch',
                    'aria-checked': m,
                    'aria-required': i,
                    'data-state': _(m),
                    'data-disabled': a ? '' : void 0,
                    disabled: a,
                    value: c,
                    ...w,
                    ref: x,
                    onClick: U(e.onClick, (b) => {
                        (T((B) => !B), g && ((S.current = b.isPropagationStopped()), S.current || b.stopPropagation()));
                    }),
                }),
                g &&
                    n.jsx(N, {
                        control: h,
                        bubbles: !S.current,
                        name: s,
                        value: c,
                        checked: m,
                        required: i,
                        disabled: a,
                        form: u,
                        style: { transform: 'translateX(-100%)' },
                    }),
            ],
        });
    });
P.displayName = k;
var j = 'SwitchThumb',
    R = d.forwardRef((e, o) => {
        const { __scopeSwitch: t, ...s } = e,
            r = L(j, t);
        return n.jsx(y.span, { 'data-state': _(r.checked), 'data-disabled': r.disabled ? '' : void 0, ...s, ref: o });
    });
R.displayName = j;
var O = 'SwitchBubbleInput',
    N = d.forwardRef(({ __scopeSwitch: e, control: o, checked: t, bubbles: s = !0, ...r }, p) => {
        const i = d.useRef(null),
            a = C(i, p),
            c = z(t),
            l = A(o);
        return (
            d.useEffect(() => {
                const u = i.current;
                if (!u) return;
                const w = window.HTMLInputElement.prototype,
                    f = Object.getOwnPropertyDescriptor(w, 'checked').set;
                if (c !== t && f) {
                    const x = new Event('click', { bubbles: s });
                    (f.call(u, t), u.dispatchEvent(x));
                }
            }, [c, t, s]),
            n.jsx('input', {
                type: 'checkbox',
                'aria-hidden': !0,
                defaultChecked: t,
                ...r,
                tabIndex: -1,
                ref: a,
                style: { ...r.style, ...l, position: 'absolute', pointerEvents: 'none', opacity: 0, margin: 0 },
            })
        );
    });
N.displayName = O;
function _(e) {
    return e ? 'checked' : 'unchecked';
}
var D = P,
    W = R;
function V({ id: e, resource: o, is_active: t, className: s, thumbClassName: r, disabled: p = !1 }) {
    const i = () => {
            a(e);
        },
        a = (c) => {
            if (c)
                try {
                    I.post(route(o + '.toggle-active', c));
                } catch (l) {
                    console.error(`Failed to active ${o}:`, l);
                }
        };
    return n.jsx('div', {
        className: 'flex items-center space-x-2',
        children: n.jsx(D, {
            'data-slot': 'switch',
            className: v(
                'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
                s,
            ),
            checked: t,
            onCheckedChange: i,
            children: n.jsx(W, {
                'data-slot': 'switch-thumb',
                className: v(
                    'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
                    r,
                ),
            }),
        }),
    });
}
export { V as T };
