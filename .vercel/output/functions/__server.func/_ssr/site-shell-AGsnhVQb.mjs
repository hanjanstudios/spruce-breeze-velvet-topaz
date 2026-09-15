import { a as LICENSE_SHORT, i as LICENSE_LINE, n as DRE_LOOKUP, t as AGENT } from "./brand-DfHBys0n.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-D4t-NGjY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-shell-AGsnhVQb.js
var import_jsx_runtime = require_jsx_runtime();
function SiteHeader() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b border-line bg-paper/92 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg font-medium tracking-tight text-ink sm:text-xl",
					children: AGENT.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-xs text-muted sm:text-sm",
					children: LICENSE_SHORT
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex items-center gap-1 sm:gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					hash: "concierge",
					className: "hidden h-11 items-center px-3 text-sm text-ink-soft hover:text-ink sm:inline-flex",
					children: "Ask"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/book",
						children: "Book a time"
					})
				})]
			})]
		})
	});
}
function EqualHousingMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 48 48",
		className: cn("size-9", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "48",
				height: "48",
				rx: "4",
				className: "fill-navy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M8 22.5 24 10l16 12.5V38H8V22.5Z",
				className: "fill-none stroke-paper",
				strokeWidth: "2.2",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 28h16M16 32.5h16",
				className: "stroke-paper",
				strokeWidth: "2.2",
				strokeLinecap: "round"
			})
		]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-line bg-navy text-paper",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl font-medium",
					children: AGENT.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 max-w-md text-sm text-paper/80",
					children: [
						AGENT.designation,
						" · DRE ",
						AGENT.dreNumber,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						AGENT.brokerage.licensedName,
						" · DRE ",
						AGENT.brokerage.dreNumber
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 max-w-lg text-sm text-paper/75",
					children: [
						"First-point-of-contact advertising on this site identifies the licensee and responsible broker as required by California Business and Professions Code §10140.6 and 10 CCR §2773. Verify a license at the",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "underline decoration-paper/40 underline-offset-2",
							href: DRE_LOOKUP,
							target: "_blank",
							rel: "noreferrer",
							children: "California DRE public lookup"
						}),
						"."
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EqualHousingMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-paper/80",
						children: "Equal Housing Opportunity. We do business in accordance with federal, state, and local fair housing laws."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex flex-wrap gap-x-4 gap-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/book",
							className: "underline-offset-2 hover:underline",
							children: "Book"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/disclosures",
							className: "underline-offset-2 hover:underline",
							children: "Disclosures"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/privacy",
							className: "underline-offset-2 hover:underline",
							children: "Privacy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/workspace",
							className: "underline-offset-2 hover:underline",
							children: "Agent workspace"
						})
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-paper/15",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mx-auto max-w-6xl px-4 py-4 text-sm text-paper/70 sm:px-6",
				children: [LICENSE_LINE, ". The concierge on this site is an AI assistant, not a licensed real estate professional, and cannot perform licensed activity. Chatting or booking does not create an agency relationship."]
			})
		})]
	});
}
function SiteShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { SiteShell as t };
