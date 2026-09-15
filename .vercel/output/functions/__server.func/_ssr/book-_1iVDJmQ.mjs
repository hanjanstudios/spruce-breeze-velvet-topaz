import { i as LICENSE_LINE, t as AGENT } from "./brand-DfHBys0n.mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as AppointmentForm } from "./appointment-form-DpaBtJCD.mjs";
import { t as SiteShell } from "./site-shell-AGsnhVQb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book-_1iVDJmQ.js
var import_jsx_runtime = require_jsx_runtime();
function BookPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.14em] text-muted",
				children: "Consultation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl sm:text-5xl",
				children: "Sit down with Hannah"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-ink-soft",
				children: [
					AGENT.appointmentMinutes,
					"-minute intro — video, phone, or in person. ",
					AGENT.name,
					", ",
					AGENT.designation,
					", DRE ",
					AGENT.dreNumber,
					",",
					" ",
					AGENT.brokerage.licensedName,
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-6 space-y-3 text-sm text-ink-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "No listing is taken on this page." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "No agency relationship is created until you and Hannah agree in writing." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Times are Pacific. Hannah confirms every request." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-muted",
				children: LICENSE_LINE
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-line bg-paper p-5 shadow-soft sm:p-7",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentForm, {})
		})]
	}) });
}
//#endregion
export { BookPage as component };
