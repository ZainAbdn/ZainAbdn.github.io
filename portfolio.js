/* ============================================================
   Selected Samples - fictional portfolio data
   ------------------------------------------------------------
   These are generic sample projects, not real client engagements.
   Each item links to a standalone static HTML sample under /samples.
   ============================================================ */

const CASE_STUDIES = [
  {
    id: "compliance-evidence-pack",
    title: "Compliance evidence report",
    sampleType: "Generic sample · Cyber Security / GRC report",
    sampleUrl: "samples/compliance-evidence-pack.html",
    tags: ["ISO 27001", "SOC 2", "Evidence", "Controls", "Audit readiness", "Reporting"],
    scenario:
      "A fictional software business requires a leadership-ready view of control ownership, evidence quality, review cadence, and audit readiness before external assessment.",
    approach:
      "The sample report structures a control register with accountable owners, evidence health, review timelines, exceptions, and decision-focused audit commentary.",
    whatItShows:
      "My approach to translating ISO 27001, SOC 2, and NIST RMF expectations into practical governance workflows that teams can execute with confidence.",
    ctaLabel: "Open sample report",
    statusRows: [
      ["A.5.15", "Access control", "Ready"],
      ["A.8.15", "Logging", "Reviewing"],
      ["CC6.1", "MFA enforcement", "Ready"]
    ]
  },
  {
    id: "cloud-security-review",
    title: "Cloud and automation review",
    sampleType: "Generic sample · Cloud Security / automation review",
    sampleUrl: "samples/cloud-security-review.html",
    tags: ["AWS IAM", "Microsoft 365", "MFA", "Power Automate", "Logging", "Least privilege"],
    scenario:
      "A fictional operations function needs an executive review of cloud security posture, identity controls, logging assurance, and automation priorities across AWS and Microsoft 365.",
    approach:
      "The review pack risk-ranks findings, maps each issue to accountable remediation, and separates immediate automation wins from longer-term governance uplift.",
    whatItShows:
      "How I assess cloud and identity risk while designing controlled automation pathways that improve efficiency without weakening security.",
    ctaLabel: "Open review pack",
    statusRows: [
      ["IAM", "Least privilege", "High"],
      ["M365", "Conditional access", "Medium"],
      ["Flow", "Approval automation", "Ready"]
    ]
  },
  {
    id: "security-metrics-dashboard",
    title: "Security and operations dashboard",
    sampleType: "Generic sample · Data Automation / security dashboard",
    sampleUrl: "samples/security-metrics-dashboard.html",
    tags: ["Dashboards", "Incidents", "SLA", "Vulnerabilities", "Automation", "Power BI thinking"],
    scenario:
      "A fictional leadership team needs a concise operating dashboard that explains incident trends, vulnerability aging, remediation performance, automation impact, and policy exceptions.",
    approach:
      "The dashboard combines executive KPIs, trend views, and risk narratives to convert raw security and operations data into an actionable monthly operating picture.",
    whatItShows:
      "How I design analytics for decision support by clarifying what is improving, what requires escalation, where automation can scale, and which owners are accountable next.",
    ctaLabel: "Open sample dashboard",
    statusRows: [
      ["Incidents", "31 days", "Down"],
      ["Critical vulns", "4 open", "Watch"],
      ["SLA", "92%", "On track"]
    ]
  }
];
