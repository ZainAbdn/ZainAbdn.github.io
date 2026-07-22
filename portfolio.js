/* ============================================================
   Selected Samples - fictional cyber security portfolio data
   ------------------------------------------------------------
   These are sample projects, not real client engagements. Each
   item links to a standalone static HTML sample under /samples.
   ============================================================ */

const CASE_STUDIES = [
  {
    id: "compliance-evidence-pack",
    title: "Compliance evidence pack",
    sampleType: "Sample project · GRC evidence",
    sampleUrl: "samples/compliance-evidence-pack.html",
    tags: ["ISO 27001", "SOC 2", "Evidence", "Controls", "Audit readiness"],
    scenario:
      "A growing software team needs a clear way to show which security controls are owned, evidenced, reviewed, and ready for an external audit.",
    approach:
      "The sample models a control register with owners, evidence links, review dates, exceptions, audit notes, and status flags that make weak points visible before the audit window.",
    whatItShows:
      "How I translate compliance frameworks into practical evidence workflows that technical and non-technical stakeholders can both understand.",
    statusRows: [
      ["A.5.15", "Access control", "Ready"],
      ["A.8.15", "Logging", "Reviewing"],
      ["CC6.1", "MFA enforcement", "Ready"]
    ]
  },
  {
    id: "cloud-security-review",
    title: "Cloud security review",
    sampleType: "Sample project · AWS / M365 hardening",
    sampleUrl: "samples/cloud-security-review.html",
    tags: ["AWS IAM", "Microsoft 365", "MFA", "Logging", "Least privilege"],
    scenario:
      "A cloud environment has grown quickly and needs a concise security review across identity, endpoints, logging, backups, and deployment controls.",
    approach:
      "The sample presents a security review format that ranks findings by severity, ties each issue to practical remediation, and separates quick wins from deeper governance work.",
    whatItShows:
      "How I assess cloud and identity risk in a way that helps teams prioritize security improvements without losing operational context.",
    statusRows: [
      ["IAM", "Least privilege", "High"],
      ["M365", "Conditional access", "Medium"],
      ["AWS", "CloudTrail coverage", "Low"]
    ]
  },
  {
    id: "security-metrics-dashboard",
    title: "Security metrics dashboard",
    sampleType: "Sample project · Security analytics",
    sampleUrl: "samples/security-metrics-dashboard.html",
    tags: ["Incidents", "SLA", "Vulnerabilities", "Exceptions", "Power BI thinking"],
    scenario:
      "Leadership needs one security view that explains incident trends, vulnerability aging, remediation performance, and policy exceptions without drowning in raw tickets.",
    approach:
      "The sample uses executive tiles, trend tables, and risk narratives to show how security telemetry can become a focused monthly operating report.",
    whatItShows:
      "How I design security analytics around decisions: what is improving, what is stuck, who owns the next action, and what risk remains.",
    statusRows: [
      ["Incidents", "31 days", "Down"],
      ["Critical vulns", "4 open", "Watch"],
      ["SLA", "92%", "On track"]
    ]
  }
];
