/* ============================================================
   Selected Work — case-study data
   ------------------------------------------------------------
   To add a work sample to a case study:
     1. Drop the image (PNG/JPG/WebP) into  assets/work/
     2. Set  image: "assets/work/your-file.png"  on the item,
        with a short  imageAlt  and  caption.
   To add a whole new case study, copy an object below and fill
   in the fields — the page renders these in order.
   Items with  image: null  show a tasteful "coming soon" frame.
   ============================================================ */

const CASE_STUDIES = [
  {
    id: "executive-reporting",
    title: "Executive reporting, without the month-end scramble",
    client: "EFI Global",
    role: "M365 Data & Automation Consultant",
    period: "2024–2025",
    tags: ["Power BI", "Power Automate", "Microsoft Lists", "Row-level security"],
    challenge:
      "Management reporting was assembled by hand every month from email threads and scattered spreadsheets — more than 15 hours of collation before anyone saw a number.",
    approach:
      "Rebuilt the pipeline end to end: a Microsoft Lists and Teams intake replaced the email process, Power Automate moved the data, and Power BI dashboards became the single source of truth — with row-level security so each stakeholder sees exactly their slice.",
    outcome:
      "Reporting now runs itself. 15+ hours recovered every month, a further 7 hours a week saved on intake, and leadership reads live dashboards instead of waiting for documents.",
    image: null,
    imageAlt: "",
    caption: ""
  },
  {
    id: "compliance-reporting",
    title: "Compliance reports on demand, not on request",
    client: "Clearwater",
    role: "Data Consultant",
    period: "2023–2024",
    tags: ["ServiceNow REST API", "Power BI", "Excel", "Compliance"],
    challenge:
      "Executives needed incident and compliance reports filtered by client and date — but every report meant manual collation from ServiceNow, and every variation meant starting over.",
    approach:
      "Designed an end-to-end incident-tracking solution: ServiceNow REST APIs feeding Power BI and Excel models, with client and date filtering built into the report layer itself.",
    outcome:
      "Executives self-serve any client/date view in seconds. Compliance outputs that took days of back-and-forth are generated on demand.",
    image: null,
    imageAlt: "",
    caption: ""
  },
  {
    id: "cloud-cost-security",
    title: "A leaner, safer cloud estate",
    client: "Oppen Group LLC",
    role: "DevSecOps Engineer",
    period: "2024–present",
    tags: ["AWS", "CloudFormation", "IAM", "Microsoft 365", "Governance"],
    challenge:
      "A growing US consultancy was carrying untagged, oversized cloud resources and an unmanaged 100-user Microsoft 365 estate — cost and risk climbing together.",
    approach:
      "Introduced cost-aware tagging and rightsizing across AWS and M365, hardened identity with conditional access and device management, and built a zero-touch deployment pipeline with Git, CloudFormation, and IAM.",
    outcome:
      "Roughly $20,000 saved annually, 100+ users governed and access-controlled, and deployments running 80% faster with zero configuration drift.",
    image: null,
    imageAlt: "",
    caption: ""
  },
  {
    id: "asset-data-reliability",
    title: "Making 30,000 asset records agree with reality",
    client: "Unison Infrastructure",
    role: "Data Scientist",
    period: "2022–2023",
    tags: ["Python", "Fuzzy matching", "GeoPandas", "Excel Power Query"],
    challenge:
      "Core asset data was riddled with near-duplicate and inconsistent records — the same site under three names, coordinates that disagreed with addresses — making management reporting unreliable.",
    approach:
      "Applied fuzzy matching and geospatial analysis in Python to reconcile records against ground truth, then delivered interactive reporting through Excel Power Query and VBA so the cleaned data stayed usable day to day.",
    outcome:
      "Data inconsistency reduced by roughly 40%, and operational decisions made from reports the team could finally trust.",
    image: null,
    imageAlt: "",
    caption: ""
  }
];
