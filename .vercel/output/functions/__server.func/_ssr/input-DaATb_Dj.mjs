import "../_runtime.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-md border border-line bg-paper px-3.5 text-base text-ink outline-none transition-colors placeholder:text-muted focus:border-navy/50 focus:ring-2 focus:ring-navy/15", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-28 w-full rounded-md border border-line bg-paper px-3.5 py-3 text-base text-ink outline-none transition-colors placeholder:text-muted focus:border-navy/50 focus:ring-2 focus:ring-navy/15", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("block text-sm font-medium text-ink-soft", className),
		...props
	});
}
//#endregion
export { Label as n, Textarea as r, Input as t };
