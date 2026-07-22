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
    sampleType: "Generic sample · Cyber security / GRC report",
    sampleUrl: "samples/compliance-evidence-pack.html",
    tags: ["ISO 27001", "SOC 2", "Evidence", "Controls", "Audit readiness", "Reporting"],
    scenario:
      "A sample software team needs a clear report showing which security controls are owned, evidenced, reviewed, and ready for an external audit.",
    approach:
      "The HTML report models a control register with owners, evidence status, review dates, exceptions, audit notes, and a readiness summary for leadership.",
    whatItShows:
      "How I translate compliance frameworks into practical evidence workflows that technical and non-technical stakeholders can both understand.",
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
    sampleType: "Generic sample · Cloud security / automation review",
    sampleUrl: "samples/cloud-security-review.html",
    tags: ["AWS IAM", "Microsoft 365", "MFA", "Power Automate", "Logging", "Least privilege"],
    scenario:
      "A sample operations team needs a concise review of cloud security, identity controls, logging, and automation opportunities across AWS and Microsoft 365.",
    approach:
      "The HTML review ranks findings by severity, ties each issue to practical remediation, and separates quick automation wins from deeper governance work.",
    whatItShows:
      "How I assess cloud and identity risk while also spotting automation opportunities that reduce manual work safely.",
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
    sampleType: "Generic sample · Data science / security dashboard",
    sampleUrl: "samples/security-metrics-dashboard.html",
    tags: ["Dashboards", "Incidents", "SLA", "Vulnerabilities", "Automation", "Power BI thinking"],
    scenario:
      "A sample leadership team needs one dashboard that explains incident trends, vulnerability aging, remediation performance, automation impact, and policy exceptions without drowning in raw tickets.",
    approach:
      "The HTML dashboard uses executive tiles, trend tables, simple data storytelling, and risk narratives to turn raw security and operations metrics into a focused monthly view.",
    whatItShows:
      "How I design analytics around decisions: what is improving, what is stuck, what can be automated, who owns the next action, and what risk remains.",
    ctaLabel: "Open sample dashboard",
    statusRows: [
      ["Incidents", "31 days", "Down"],
      ["Critical vulns", "4 open", "Watch"],
      ["SLA", "92%", "On track"]
    ]
  }
];
