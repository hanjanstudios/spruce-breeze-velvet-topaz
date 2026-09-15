//#region node_modules/.nitro/vite/services/ssr/assets/brand-DfHBys0n.js
/** First-point-of-contact identity for California DRE advertising rules. */
var AGENT = {
	name: "Hannah Janicke",
	designation: "REALTOR®",
	dreNumber: "2370979",
	licenseType: "Salesperson",
	brokerage: {
		licensedName: "First Team Real Estate - Orange County",
		dreNumber: "01008773"
	},
	serviceArea: "Orange County and nearby Southern California communities",
	tagline: "A calm place to ask, then meet.",
	siteName: "Hannah Janicke Homes",
	timezone: "America/Los_Angeles",
	appointmentMinutes: 45,
	/**
	* Private workspace key for the lead pipeline.
	* Change this with Hannah before sharing the site widely.
	*/
	workspaceKey: "HJ-2370979",
	phone: "",
	email: "",
	officeAddress: ""
};
var DRE_LOOKUP = "https://www2.dre.ca.gov/PublicASP/pplinfo.asp";
var LICENSE_LINE = `${AGENT.name}, ${AGENT.designation} · DRE ${AGENT.dreNumber} · ${AGENT.brokerage.licensedName}`;
var LICENSE_SHORT = `${AGENT.name} · DRE ${AGENT.dreNumber}`;
var MEETING_TYPES = [
	{
		id: "video",
		label: "Video call"
	},
	{
		id: "phone",
		label: "Phone"
	},
	{
		id: "in_person",
		label: "In person"
	}
];
var INTENTS = [
	{
		id: "buy",
		label: "Buying"
	},
	{
		id: "sell",
		label: "Selling"
	},
	{
		id: "both",
		label: "Buying and selling"
	},
	{
		id: "other",
		label: "Something else"
	}
];
var TIMELINES = [
	{
		id: "now",
		label: "Ready now"
	},
	{
		id: "0-3",
		label: "Next 3 months"
	},
	{
		id: "3-6",
		label: "3–6 months"
	},
	{
		id: "6-12",
		label: "6–12 months"
	},
	{
		id: "exploring",
		label: "Just exploring"
	}
];
var STAGES = [
	{
		id: "new",
		label: "New"
	},
	{
		id: "engaged",
		label: "In conversation"
	},
	{
		id: "qualified",
		label: "Qualified"
	},
	{
		id: "appointment",
		label: "Appointment"
	},
	{
		id: "nurture",
		label: "Follow up"
	},
	{
		id: "closed",
		label: "Working together"
	},
	{
		id: "archived",
		label: "Archived"
	}
];
//#endregion
export { LICENSE_SHORT as a, TIMELINES as c, LICENSE_LINE as i, DRE_LOOKUP as n, MEETING_TYPES as o, INTENTS as r, STAGES as s, AGENT as t };
