import { o as __toESM } from "../_runtime.mjs";
import { s as STAGES, t as AGENT } from "./brand-DfHBys0n.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { c as updateAppointmentStatus, i as listWorkspace, l as updateLeadStage, n as listLeadMessages, s as unlockWorkspace } from "./leads-C7tYUe_P.mjs";
import { t as Button } from "./button-D4t-NGjY.mjs";
import { n as Label, r as Textarea, t as Input } from "./input-DaATb_Dj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as formatPacific } from "./time-CBApnNHP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workspace-Dsk9Ir7S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "muted", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium", {
			muted: "bg-paper-deep text-ink-soft",
			navy: "bg-navy/10 text-navy",
			sage: "bg-sage/12 text-sage",
			warm: "bg-paper text-ink-soft border border-line",
			danger: "bg-danger/10 text-danger"
		}[tone], className),
		...props
	});
}
var KEY_STORAGE = "hj-workspace-key";
function WorkspacePage() {
	const [key, setKey] = (0, import_react.useState)("");
	const [unlocked, setUnlocked] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const stored = sessionStorage.getItem(KEY_STORAGE) ?? "";
		if (stored) {
			setKey(stored);
			setUnlocked(true);
		}
		setReady(true);
	}, []);
	const unlock = useMutation({
		mutationFn: () => unlockWorkspace({ data: { key: draft } }),
		onSuccess: () => {
			sessionStorage.setItem(KEY_STORAGE, draft);
			setKey(draft);
			setUnlocked(true);
		},
		onError: (err) => {
			toast.error(err instanceof Error ? err.message : "Could not unlock.");
		}
	});
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { className: "min-h-dvh bg-paper" });
	if (!unlocked) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-widest text-muted",
				children: "Private"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: "Agent workspace"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-ink-soft",
				children: [
					"For ",
					AGENT.name,
					" only. This is where new conversations, contact details, and appointment requests land."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					unlock.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "ws-key",
						children: "Workspace key"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "ws-key",
						type: "password",
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						autoComplete: "current-password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: unlock.isPending,
						children: unlock.isPending ? "Checking…" : "Open pipeline"
					})
				]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pipeline, {
		keyValue: key,
		onLock: () => {
			sessionStorage.removeItem(KEY_STORAGE);
			setKey("");
			setUnlocked(false);
		}
	});
}
function Pipeline({ keyValue, onLock }) {
	const qc = useQueryClient();
	const [stageFilter, setStageFilter] = (0, import_react.useState)("all");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const data = useQuery({
		queryKey: ["workspace", keyValue],
		queryFn: () => listWorkspace({ data: { key: keyValue } })
	});
	const leads = data.data?.leads ?? [];
	const appointments = data.data?.appointments ?? [];
	const selectedLead = leads.find((l) => l.id === selected) ?? leads[0];
	const visible = (0, import_react.useMemo)(() => stageFilter === "all" ? leads : leads.filter((l) => l.stage === stageFilter), [leads, stageFilter]);
	const hot = leads.filter((l) => l.score >= 60 && l.stage !== "archived");
	const upcoming = appointments.filter((a) => a.status !== "cancelled" && a.status !== "completed" && new Date(a.starts_at).getTime() >= Date.now() - 36e5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-line bg-navy text-paper",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: "Lead pipeline"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-paper/70",
						children: [
							AGENT.name,
							" · DRE ",
							AGENT.dreNumber
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "paper",
						size: "sm",
						onClick: onLock,
						children: "Lock"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "New conversations",
						value: leads.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Need outreach",
						value: hot.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Upcoming meetings",
						value: upcoming.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "With phone or email",
						value: leads.filter((l) => l.email || l.phone).length
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_1.15fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-line bg-paper",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2 border-b border-line p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
							active: stageFilter === "all",
							onClick: () => setStageFilter("all"),
							children: "All"
						}), STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
							active: stageFilter === s.id,
							onClick: () => setStageFilter(s.id),
							children: s.label
						}, s.id))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "divide-y divide-line",
						children: [
							data.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "p-5 text-sm text-muted",
								children: "Loading pipeline…"
							}),
							!data.isLoading && visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "p-5 text-sm text-muted",
								children: "No leads in this view yet. When someone uses the concierge or booking page, they appear here."
							}),
							visible.map((lead) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setSelected(lead.id),
								className: cn("flex w-full items-start justify-between gap-3 px-4 py-3 text-left hover:bg-paper-deep", selectedLead?.id === lead.id && "bg-paper-deep"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-medium",
										children: lead.name || "Visitor"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-sm text-muted",
										children: [
											intentLabel(lead.intent),
											lead.location ? ` · ${lead.location}` : "",
											lead.timeline ? ` · ${timelineLabel(lead.timeline)}` : ""
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 flex-col items-end gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: scoreTone(lead.score),
										children: lead.score
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted",
										children: stageLabel(lead.stage)
									})]
								})]
							}) }, lead.id))
						]
					})]
				}), selectedLead ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadDetail, {
					lead: selectedLead,
					appointments: appointments.filter((a) => a.lead_id === selectedLead.id),
					workspaceKey: keyValue,
					onChanged: () => qc.invalidateQueries({ queryKey: ["workspace"] })
				}, selectedLead.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "rounded-lg border border-line p-8 text-sm text-muted",
					children: "Select a lead to see contact details, chat, and next steps."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-7xl px-4 pb-16 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Appointments"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 overflow-x-auto rounded-lg border border-line",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-3xl text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-paper-deep text-ink-soft",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "When"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Who"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2 font-medium" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [appointments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-4 text-muted",
							colSpan: 5,
							children: "No appointment requests yet."
						}) }), appointments.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentRowView, {
							appointment: a,
							workspaceKey: keyValue,
							onChanged: () => qc.invalidateQueries({ queryKey: ["workspace"] })
						}, a.id))] })]
					})
				})]
			})
		]
	});
}
function LeadDetail({ lead, appointments, workspaceKey, onChanged }) {
	const [notes, setNotes] = (0, import_react.useState)(lead.notes ?? "");
	const [stage, setStage] = (0, import_react.useState)(STAGES.some((s) => s.id === lead.stage) ? lead.stage : "new");
	const save = useMutation({
		mutationFn: () => updateLeadStage({ data: {
			key: workspaceKey,
			leadId: lead.id,
			stage,
			notes
		} }),
		onSuccess: () => {
			toast.success("Lead updated.");
			onChanged();
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Update failed.")
	});
	const thread = useQuery({
		queryKey: ["thread", lead.conversation_id],
		enabled: Boolean(lead.conversation_id),
		queryFn: () => listLeadMessages({ data: {
			key: workspaceKey,
			conversationId: lead.conversation_id
		} })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-line bg-paper p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: lead.name || "Visitor"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"Score ",
						lead.score,
						" · ",
						stageLabel(lead.stage),
						" ·",
						" ",
						lead.source === "booking" ? "Booking form" : "Concierge"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhyReach, { lead })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-5 grid gap-3 text-sm sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						value: lead.email,
						href: lead.email ? `mailto:${lead.email}` : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Phone",
						value: lead.phone,
						href: lead.phone ? `tel:${lead.phone}` : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Intent",
						value: intentLabel(lead.intent)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Timeline",
						value: timelineLabel(lead.timeline)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Area",
						value: lead.location
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Price range they mentioned",
						value: lead.price_range
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Pre-approved",
						value: lead.preapproved
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Contact permission",
						value: lead.consent_contact ? lead.consent_sms ? "Call, email, and text" : "Call and email" : "Not given"
					})
				]
			}),
			appointments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 rounded-md bg-paper-deep p-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "Meetings"
				}), appointments.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-ink-soft",
					children: [
						formatPacific(a.starts_at),
						" · ",
						a.meeting_type,
						" · ",
						a.status
					]
				}, a.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "stage",
						children: "Stage"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						id: "stage",
						className: "h-11 w-full rounded-md border border-line bg-paper px-3",
						value: stage,
						onChange: (e) => setStage(e.target.value),
						children: STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.id,
							children: s.label
						}, s.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					onClick: () => save.mutate(),
					disabled: save.isPending,
					children: "Save"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "notes",
					children: "Your notes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "notes",
					value: notes,
					onChange: (e) => setNotes(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-medium",
					children: "Conversation"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 max-h-80 space-y-2 overflow-y-auto rounded-md border border-line p-3",
					children: [!lead.conversation_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "No chat attached."
					}), thread.data?.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: cn("rounded-sm px-3 py-2 text-sm", m.role === "assistant" ? "bg-paper-deep" : "bg-navy/10"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium uppercase tracking-wide text-muted",
								children: m.role === "assistant" ? "Concierge" : "Visitor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							m.content
						]
					}, m.id))]
				})]
			})
		]
	});
}
function AppointmentRowView({ appointment, workspaceKey, onChanged }) {
	const mut = useMutation({
		mutationFn: (status) => updateAppointmentStatus({ data: {
			key: workspaceKey,
			appointmentId: appointment.id,
			status
		} }),
		onSuccess: onChanged
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "border-t border-line",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-3 py-3",
				children: formatPacific(appointment.starts_at)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "px-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: appointment.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: appointment.email
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-3 py-3 capitalize",
				children: appointment.meeting_type.replace("_", " ")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-3 py-3 capitalize",
				children: appointment.status
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-3 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-1",
					children: [appointment.status === "requested" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "sage",
						onClick: () => mut.mutate("confirmed"),
						children: "Confirm"
					}), appointment.status !== "cancelled" && appointment.status !== "completed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => mut.mutate("cancelled"),
						children: "Cancel"
					})]
				})
			})
		]
	});
}
function WhyReach({ lead }) {
	let reason = "Warm — nurture";
	if (!lead.email && !lead.phone) reason = "No contact yet — keep chatting";
	else if (lead.score >= 70) reason = "Hot — reach out today";
	else if (lead.intent === "sell" || lead.intent === "both") reason = "Seller-side interest";
	else if (lead.timeline === "now" || lead.timeline === "0-3") reason = "Near-term timeline";
	else if (lead.consent_contact) reason = "Gave permission to contact";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "max-w-xs rounded-sm bg-sage/12 px-3 py-2 text-sm text-sage",
		children: reason
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-line bg-paper px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-wide text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-3xl tabular-nums",
			children: value
		})]
	});
}
function FilterChip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-9 rounded-sm px-3 text-sm", active ? "bg-navy text-paper" : "bg-paper-deep text-ink-soft"),
		children
	});
}
function Field({ label, value, href }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs uppercase tracking-wide text-muted",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-0.5",
		children: href && value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			className: "underline-offset-2 hover:underline",
			href,
			children: value
		}) : value || "—"
	})] });
}
function stageLabel(id) {
	return STAGES.find((s) => s.id === id)?.label ?? id;
}
function intentLabel(id) {
	if (id === "buy") return "Buying";
	if (id === "sell") return "Selling";
	if (id === "both") return "Buying and selling";
	if (id === "other") return "Other";
	return "Intent unknown";
}
function timelineLabel(id) {
	if (id === "now") return "Ready now";
	if (id === "0-3") return "Next 3 months";
	if (id === "3-6") return "3–6 months";
	if (id === "6-12") return "6–12 months";
	if (id === "exploring") return "Exploring";
	return id ?? "";
}
function scoreTone(score) {
	if (score >= 70) return "sage";
	if (score >= 40) return "navy";
	return "muted";
}
//#endregion
export { WorkspacePage as component };
