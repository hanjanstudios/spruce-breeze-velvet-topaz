import { o as __toESM } from "../_runtime.mjs";
import { c as TIMELINES, o as MEETING_TYPES, r as INTENTS, t as AGENT } from "./brand-DfHBys0n.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { a as requestAppointment, r as listOpenSlots } from "./leads-C7tYUe_P.mjs";
import { t as Button } from "./button-D4t-NGjY.mjs";
import { n as Label, r as Textarea, t as Input } from "./input-DaATb_Dj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/appointment-form-DpaBtJCD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppointmentForm({ conversationId, leadId, compact, onBooked }) {
	const slotsQuery = useQuery({
		queryKey: ["open-slots"],
		queryFn: () => listOpenSlots()
	});
	const [startsAt, setStartsAt] = (0, import_react.useState)("");
	const [meetingType, setMeetingType] = (0, import_react.useState)("video");
	const [intent, setIntent] = (0, import_react.useState)("");
	const [timeline, setTimeline] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [location, setLocation] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [consentContact, setConsentContact] = (0, import_react.useState)(false);
	const [consentSms, setConsentSms] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(null);
	const grouped = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const slot of slotsQuery.data ?? []) {
			const list = map.get(slot.dayLabel) ?? [];
			list.push(slot);
			map.set(slot.dayLabel, list);
		}
		return [...map.entries()];
	}, [slotsQuery.data]);
	const book = useMutation({
		mutationFn: () => requestAppointment({ data: {
			name,
			email,
			phone,
			startsAt,
			meetingType,
			intent: intent || void 0,
			timeline: timeline || void 0,
			location: location || void 0,
			notes: notes || void 0,
			consentContact,
			consentSms,
			conversationId,
			leadId: leadId ?? void 0
		} }),
		onSuccess: (res) => {
			setDone(res.whenLabel);
			toast.success("Request sent to Hannah.");
			onBooked?.();
		},
		onError: (err) => {
			toast.error(err instanceof Error ? err.message : "Could not book.");
		}
	});
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-line bg-paper p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl text-ink",
				children: "You’re on the calendar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-ink-soft",
				children: [
					done,
					" Pacific · ",
					AGENT.appointmentMinutes,
					" minutes. Hannah will confirm and follow up using the details you shared. This request does not create an agency relationship."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted",
				children: [
					AGENT.name,
					" · DRE ",
					AGENT.dreNumber,
					" · ",
					AGENT.brokerage.licensedName
				]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-5",
		onSubmit: (e) => {
			e.preventDefault();
			book.mutate();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
				className: "mb-2 text-sm font-medium text-ink-soft",
				children: "Available times (Pacific)"
			}), slotsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Loading times…"
			}) : grouped.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No open times in the next two weeks. Leave a message through the concierge and Hannah will reach out."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-64 space-y-3 overflow-y-auto pr-1",
				children: grouped.map(([day, slots]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1.5 text-xs font-medium uppercase tracking-wide text-muted",
					children: day
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: slots.map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setStartsAt(slot.startsAt),
						className: cn("h-10 rounded-sm border px-3 text-sm", startsAt === slot.startsAt ? "border-navy bg-navy text-paper" : "border-line bg-paper text-ink hover:border-navy/40"),
						children: slot.label
					}, slot.startsAt))
				})] }, day))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
				className: "mb-2 text-sm font-medium text-ink-soft",
				children: "How should you meet?"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: MEETING_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMeetingType(t.id),
					className: cn("h-10 rounded-sm border px-3 text-sm", meetingType === t.id ? "border-navy bg-navy text-paper" : "border-line bg-paper text-ink hover:border-navy/40"),
					children: t.label
				}, t.id))
			})] }),
			!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
				className: "mb-2 text-sm font-medium text-ink-soft",
				children: "I am"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: INTENTS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setIntent(t.id),
					className: cn("h-10 rounded-sm border px-3 text-sm", intent === t.id ? "border-sage bg-sage text-paper" : "border-line bg-paper text-ink hover:border-sage/40"),
					children: t.label
				}, t.id))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
				className: "mb-2 text-sm font-medium text-ink-soft",
				children: "Timeline"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: TIMELINES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTimeline(t.id),
					className: cn("h-10 rounded-sm border px-3 text-sm", timeline === t.id ? "border-sage bg-sage text-paper" : "border-line bg-paper text-ink hover:border-sage/40"),
					children: t.label
				}, t.id))
			})] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "bk-name",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "bk-name",
							required: true,
							autoComplete: "name",
							value: name,
							onChange: (e) => setName(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "bk-email",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "bk-email",
							type: "email",
							required: true,
							autoComplete: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "bk-phone",
							children: "Phone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "bk-phone",
							type: "tel",
							autoComplete: "tel",
							value: phone,
							onChange: (e) => setPhone(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "bk-loc",
							children: "City or area"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "bk-loc",
							value: location,
							onChange: (e) => setLocation(e.target.value),
							placeholder: "Irvine, Huntington Beach…"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "bk-notes",
					children: "Anything Hannah should know"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "bk-notes",
					value: notes,
					onChange: (e) => setNotes(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-start gap-3 text-sm text-ink-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					className: "mt-1 size-4 accent-navy",
					checked: consentContact,
					onChange: (e) => setConsentContact(e.target.checked),
					required: true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hannah may contact me by email or phone about this inquiry. I understand this does not create an agency relationship. TCPA: if I also check SMS below, I agree to receive texts; message/data rates may apply; I can opt out anytime." })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-start gap-3 text-sm text-ink-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					className: "mt-1 size-4 accent-navy",
					checked: consentSms,
					onChange: (e) => setConsentSms(e.target.checked)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "It’s okay to text me at the number I provided." })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "w-full sm:w-auto",
				disabled: !startsAt || book.isPending,
				children: book.isPending ? "Sending…" : "Request this time"
			})
		]
	});
}
//#endregion
export { AppointmentForm as t };
