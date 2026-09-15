import { n as DRE_LOOKUP, t as AGENT } from "./brand-DfHBys0n.mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as SiteShell } from "./site-shell-AGsnhVQb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/disclosures-DVIj-tgK.js
var import_jsx_runtime = require_jsx_runtime();
function DisclosuresPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-3xl px-4 py-12 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "Disclosures"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-ink-soft",
				children: [
					"This page is part of the first-point-of-contact material for",
					" ",
					AGENT.name,
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-display text-2xl",
				children: "License identification"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-ink-soft",
				children: [
					AGENT.name,
					", ",
					AGENT.designation,
					", California DRE ",
					AGENT.dreNumber,
					" (",
					AGENT.licenseType,
					"). Responsible broker:",
					" ",
					AGENT.brokerage.licensedName,
					", DRE ",
					AGENT.brokerage.dreNumber,
					". Confirm status on the",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "underline underline-offset-2",
						href: DRE_LOOKUP,
						target: "_blank",
						rel: "noreferrer",
						children: "DRE public license lookup"
					}),
					". Required by Bus. & Prof. Code §10140.6 and 10 CCR §2773. License numbers on this site are set no smaller than surrounding body text."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-display text-2xl",
				children: "AI concierge"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-ink-soft",
				children: [
					"The Home Concierge is an artificial-intelligence assistant. It is not a licensed real estate professional. Under California DRE guidance, using AI to perform licensed activity is treated like using an unlicensed assistant. The concierge may schedule appointments, collect contact details, and share general process information. It may not negotiate, give opinions of value, discuss terms of a specific property as advice, or represent you. ",
					AGENT.name,
					" supervises this tool and is responsible for the advertising on this site."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-display text-2xl",
				children: "Agency"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-ink-soft",
				children: "Using this website, chatting, or requesting an appointment does not create an agency relationship. California requires a statutory agency disclosure before a listing is taken or an offer is presented. That conversation happens with Hannah, not with the assistant."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-display text-2xl",
				children: "Advertising standards"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-ink-soft",
				children: "Nothing here is a guarantee of sale, price, or timing. No property images on this site are digitally altered listings. If a future listing image is altered, it will be disclosed as required by Bus. & Prof. Code §10140.8."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-display text-2xl",
				children: "Fair housing"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-ink-soft",
				children: "We do business in accordance with the Fair Housing Act and California fair housing law, including the Unruh Civil Rights Act. We do not discriminate based on race, color, religion, sex, gender, gender identity, gender expression, sexual orientation, marital status, national origin, ancestry, familial status, source of income, disability, veteran or military status, immigration status, primary language, citizenship, genetic information, or any other protected characteristic."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-display text-2xl",
				children: "REALTOR®"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-ink-soft",
				children: [
					"REALTOR® is a registered collective membership mark that may be used only by members of the National Association of REALTORS®. Use on this site refers to ",
					AGENT.name,
					" in that capacity."
				]
			})
		]
	}) });
}
//#endregion
export { DisclosuresPage as component };
