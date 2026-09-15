import "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-opacity duration-150 disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper", {
	variants: {
		variant: {
			primary: "bg-navy text-paper hover:opacity-90",
			sage: "bg-sage text-paper hover:opacity-90",
			outline: "border border-line-strong bg-transparent text-ink hover:bg-paper-deep",
			ghost: "text-ink hover:bg-paper-deep",
			paper: "bg-paper text-navy hover:bg-paper-deep"
		},
		size: {
			sm: "h-10 rounded-sm px-3.5 text-sm",
			md: "h-11 rounded-md px-5 text-sm",
			lg: "h-12 rounded-md px-6 text-base"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
export { Button as t };
