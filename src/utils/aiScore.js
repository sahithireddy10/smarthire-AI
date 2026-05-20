// src/utils/aiScore.js

// Semantic skill clusters — skills in the same cluster are considered related
export const SKILL_CLUSTERS = {
  python_web: ["python", "django", "flask", "fastapi"],
  js_web:     ["javascript", "typescript", "react", "vue", "angular", "node.js", "nodejs", "next.js"],
  java_be:    ["java", "spring boot", "spring", "hibernate", "j2ee"],
  cpp:        ["c++", "c", "embedded c"],
  db:         ["sql", "mysql", "postgresql", "mongodb", "redis", "nosql", "sqlite"],
  cloud:      ["aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "k8s", "terraform"],
  ml:         ["machine learning", "ml", "deep learning", "tensorflow", "pytorch", "keras", "scikit-learn", "sklearn"],
  ds:         ["data science", "pandas", "numpy", "scipy", "r", "matlab", "statistics"],
  nlp:        ["nlp", "natural language processing", "bert", "gpt", "transformers", "spacy", "nltk"],
  algorithms: ["algorithms", "data structures", "dsa", "competitive programming", "leetcode"],
  devops:     ["docker", "kubernetes", "ci/cd", "jenkins", "github actions", "linux", "bash"],
  frontend:   ["html", "css", "tailwind", "bootstrap", "figma", "ui/ux", "responsive design"],
  data_viz:   ["power bi", "tableau", "excel", "matplotlib", "seaborn", "plotly"],
  mobile:     ["android", "ios", "swift", "kotlin", "react native", "flutter"],
  design:     ["system design", "lld", "hld", "microservices", "rest api", "graphql"],
};

// Find what cluster a skill belongs to
function findCluster(skill) {
  const s = skill.toLowerCase().trim();
  for (const [cluster, members] of Object.entries(SKILL_CLUSTERS)) {
    if (members.some(m => s.includes(m) || m.includes(s))) return cluster;
  }
  return null;
}

// Semantic skill match: returns ratio (0.0-1.0) and match details
export function semanticSkillMatch(studentSkills, requiredSkills) {
  if (!requiredSkills || requiredSkills.trim() === "") return { ratio: 1.0, details: [] };
  
  const req = requiredSkills.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  const stu = studentSkills.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  
  if (req.length === 0) return { ratio: 1.0, details: [] };

  let matched = 0;
  const matchDetails = [];

  for (const r of req) {
    // Exact / substring match
    const direct = stu.some(s => s.includes(r) || r.includes(s));
    if (direct) {
      matched++;
      matchDetails.push({ skill: r, match: "exact", score: 1.0 });
      continue;
    }
    // Semantic cluster match
    const rCluster = findCluster(r);
    if (rCluster) {
      const clusterMatch = stu.some(s => findCluster(s) === rCluster);
      if (clusterMatch) {
        matched += 0.6; // partial credit for related skill
        matchDetails.push({ skill: r, match: "semantic", score: 0.6 });
        continue;
      }
    }
    matchDetails.push({ skill: r, match: "none", score: 0 });
  }

  return { ratio: matched / req.length, details: matchDetails };
}

// Full AI match score: 0–100
export function aiMatchScore(student, drive) {
  let score = 0;
  const breakdown = {};

  // CGPA — 30 points
  const reqCgpa = drive.req_cgpa || 0;
  const stuCgpa = student.cgpa || 0;
  if (stuCgpa >= reqCgpa) {
    breakdown.cgpa = { earned: 30, max: 30, label: "Meets requirement" };
    score += 30;
  } else if (stuCgpa >= reqCgpa - 0.5) {
    breakdown.cgpa = { earned: 15, max: 30, label: "Slightly below" };
    score += 15;
  } else {
    breakdown.cgpa = { earned: 0, max: 30, label: "Below requirement" };
  }

  // Skills — 40 points (semantic)
  const skillResult = semanticSkillMatch(student.skills || "", drive.req_skills || "");
  const skillScore = Math.round(
    typeof skillResult === "object" ? skillResult.ratio * 40 : skillResult * 40
  );
  breakdown.skills = {
    earned: skillScore,
    max: 40,
    details: typeof skillResult === "object" ? skillResult.details : [],
    label: `${Math.round(
      typeof skillResult === "object" ? skillResult.ratio * 100 : skillResult * 100
    )}% skill overlap`
  };
  score += skillScore;

  // Degree — 20 points
  if (!drive.req_degree || drive.req_degree === "" || student.degree === drive.req_degree) {
    breakdown.degree = { earned: 20, max: 20, label: "Matches" };
    score += 20;
  } else {
    breakdown.degree = { earned: 5, max: 20, label: "Partial match" };
    score += 5;
  }

  // Year — 10 points
  if (!drive.req_year || drive.req_year === 0 || student.year >= drive.req_year) {
    breakdown.year = { earned: 10, max: 10, label: "Eligible year" };
    score += 10;
  } else {
    breakdown.year = { earned: 0, max: 10, label: "Not in required year" };
  }

  return { score: Math.min(100, Math.round(score)), breakdown };
}
