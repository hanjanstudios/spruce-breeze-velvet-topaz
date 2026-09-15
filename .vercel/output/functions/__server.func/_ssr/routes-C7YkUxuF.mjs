import { o as __toESM } from "../_runtime.mjs";
import { i as LICENSE_LINE, t as AGENT } from "./brand-DfHBys0n.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { o as startConversation, t as createSsrRpc } from "./leads-C7tYUe_P.mjs";
import { t as Button } from "./button-D4t-NGjY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as AppointmentForm } from "./appointment-form-DpaBtJCD.mjs";
import { t as SiteShell } from "./site-shell-AGsnhVQb.mjs";
import { a as Calendar, i as Info, n as Shield, o as ArrowUp, r as MessageCircle, s as ArrowRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C7YkUxuF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
`${AGENT.name}${AGENT.designation}${AGENT.dreNumber}${AGENT.brokerage.licensedName}`;
var sendConciergeMessage = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("b6f4bf86f30975fcdcffa6c733e14dbc9831261fd6ebc4483add46159932956f"));
var conciergeGreeting = createServerFn({ method: "GET" }).handler(createSsrRpc("3cf3caabf0db25e4a558bed78278c609091da8750f9aa643997adf773ca8c2e9"));
var STARTERS = [
	"I want to sell my home",
	"We’re looking to buy",
	"I have a few questions first"
];
function ConciergeChat({ variant = "panel" }) {
	const [conversationId, setConversationId] = (0, import_react.useState)(null);
	const [leadId, setLeadId] = (0, import_react.useState)(null);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [showBooking, setShowBooking] = (0, import_react.useState)(false);
	const scroller = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			const convo = await startConversation();
			const greet = await conciergeGreeting();
			if (cancelled) return;
			setConversationId(convo.conversationId);
			setMessages([{
				id: "greet",
				role: "assistant",
				content: greet.text
			}]);
		})().catch(() => {
			toast.error("Could not start the concierge. Please refresh.");
		});
		return () => {
			cancelled = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		scroller.current?.scrollTo({
			top: scroller.current.scrollHeight,
			behavior: "smooth"
		});
	}, [messages, showBooking]);
	const send = useMutation({
		mutationFn: async (message) => {
			if (!conversationId) throw new Error("Still connecting…");
			return sendConciergeMessage({ data: {
				conversationId,
				message
			} });
		},
		onSuccess: (res, message) => {
			setMessages((prev) => [
				...prev,
				{
					id: crypto.randomUUID(),
					role: "user",
					content: message
				},
				{
					id: crypto.randomUUID(),
					role: "assistant",
					content: res.reply
				}
			]);
			if (res.leadId) setLeadId(res.leadId);
			if (res.proposeAppointment) setShowBooking(true);
		},
		onError: (err) => {
			toast.error(err instanceof Error ? err.message : "Message failed.");
		}
	});
	function submit(text) {
		const message = (text ?? draft).trim();
		if (!message || send.isPending) return;
		setDraft("");
		send.mutate(message);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "concierge",
		className: cn("flex min-h-96 flex-col overflow-hidden border border-line bg-paper shadow-soft", variant === "panel" ? "rounded-xl" : "rounded-lg"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-line bg-navy px-5 py-4 text-paper",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-widest text-paper/70",
						children: "Home concierge"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl",
						children: "Talk, then book a time"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-paper/75",
						children: [
							"AI assistant for ",
							AGENT.name,
							" · DRE ",
							AGENT.dreNumber,
							". Not a licensed agent."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: scroller,
				className: "flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5",
				children: [
					messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("w-fit max-w-prose rounded-md px-3.5 py-2.5 text-sm leading-relaxed", m.role === "assistant" ? "bg-paper-deep text-ink" : "ml-auto bg-navy text-paper"),
						children: m.content
					}, m.id)),
					send.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-fit rounded-md bg-paper-deep px-3.5 py-2.5 text-sm text-muted",
						children: "Hannah’s assistant is writing…"
					}),
					messages.length === 1 && !send.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2 pt-1",
						children: STARTERS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => submit(s),
							className: "h-10 rounded-sm border border-line bg-paper px-3 text-sm text-ink hover:border-navy/40",
							children: s
						}, s))
					}),
					showBooking && conversationId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-line bg-paper p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 font-medium text-ink",
							children: "Pick a time with Hannah"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentForm, {
							compact: true,
							conversationId,
							leadId
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "border-t border-line p-3",
				onSubmit: (e) => {
					e.preventDefault();
					submit();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "sr-only",
							htmlFor: "concierge-input",
							children: "Message"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "concierge-input",
							rows: 2,
							value: draft,
							onChange: (e) => setDraft(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									submit();
								}
							},
							placeholder: "Ask about buying, selling, or booking a consult…",
							className: "max-h-32 min-h-11 flex-1 resize-none rounded-md border border-line bg-paper px-3 py-2.5 text-base outline-none focus:border-navy/50 focus:ring-2 focus:ring-navy/15"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "sm",
							className: "size-11 shrink-0 px-0",
							disabled: send.isPending || !draft.trim(),
							"aria-label": "Send",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4" })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-3.5" }),
						"AI answers are informational. Licensed advice happens with Hannah.",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/book",
							className: "ml-auto text-navy underline-offset-2 hover:underline",
							children: "Skip to booking"
						})
					]
				})]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative isolate overflow-hidden bg-navy-deep text-paper",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/images/hero-home.jpg",
					alt: "A Southern California home at golden hour",
					className: "absolute inset-0 size-full object-cover opacity-55"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-navy-deep/75" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col justify-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium uppercase tracking-widest text-paper/75",
								children: [
									AGENT.designation,
									" · DRE ",
									AGENT.dreNumber
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-3 max-w-xl font-display text-4xl font-medium sm:text-5xl lg:text-6xl",
								children: [
									"Ask first.",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"Then sit down with Hannah."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-5 max-w-lg text-base text-paper/85 sm:text-lg",
								children: [
									"For homeowners and buyers in ",
									AGENT.serviceArea,
									". The concierge can take questions and book a consultation. Licensed advice comes from ",
									AGENT.name,
									" — ",
									AGENT.brokerage.licensedName,
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "paper",
									size: "lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#concierge",
										children: "Open the concierge"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "outline",
									size: "lg",
									className: "border-paper/40 text-paper hover:bg-paper/10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/book",
										children: "Book a time"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-sm text-paper/70",
								children: LICENSE_LINE
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConciergeChat, {})
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-3",
			children: [
				{
					icon: MessageCircle,
					title: "Ask without pressure",
					body: "The concierge is an AI assistant. It can collect details and set a meeting. It cannot value a home, negotiate, or represent you."
				},
				{
					icon: Calendar,
					title: "Book real time",
					body: "Choose a video, phone, or in-person consult. Hannah reviews every request and follows up personally."
				},
				{
					icon: Shield,
					title: "Licensed, disclosed",
					body: "Name, DRE number, and responsible broker appear on every page, as California first-point-of-contact rules require."
				}
			].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-lg border border-line bg-paper p-6 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5 text-sage" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 font-display text-2xl",
						children: item.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-ink-soft",
						children: item.body
					})
				]
			}, item.title))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-paper-deep",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl gap-0 px-4 py-16 sm:px-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "overflow-hidden rounded-t-xl border border-line bg-paper lg:rounded-l-xl lg:rounded-tr-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/images/neighborhood.jpg",
						alt: "A tree-lined Southern California residential street",
						className: "h-56 w-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-7",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-widest text-muted",
								children: "For buyers"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 font-display text-3xl",
								children: "Find the next place with a local advocate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-ink-soft",
								children: "Tell the concierge where you’re looking and your timeline. Hannah will meet you to talk neighborhoods, process, and representation — never through an automated price or a promise she can’t keep."
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "overflow-hidden rounded-b-xl border border-t-0 border-line bg-paper lg:rounded-r-xl lg:rounded-bl-none lg:border-l-0 lg:border-t",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/images/living-room.jpg",
						alt: "A sunlit living room in a California home",
						className: "h-56 w-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-7",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-widest text-muted",
								children: "For homeowners"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 font-display text-3xl",
								children: "A conversation before a listing"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-ink-soft",
								children: "If you’re considering a sale, book a consult. California agency disclosure comes before any listing agreement. This site does not take a listing or create agency by itself."
							})
						]
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.05fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-widest text-muted",
					children: "How it works"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-4xl",
					children: "Three quiet steps"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-6 space-y-5",
					children: [
						"Share what you’re exploring — buying, selling, or both.",
						"Leave a way to reach you, only if you want Hannah to follow up.",
						"Pick a time. Hannah confirms and takes it from there."
					].map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-9 shrink-0 items-center justify-center rounded-sm bg-navy font-display text-paper",
							children: i + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "pt-1.5 text-ink-soft",
							children: step
						})]
					}, step))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-8",
					size: "lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/book",
						children: ["Skip ahead to booking", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					})
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/images/kitchen.jpg",
				alt: "A bright California kitchen",
				className: "h-80 w-full rounded-xl object-cover shadow-soft sm:h-96"
			})]
		})
	] });
}
//#endregion
export { Home as component };
