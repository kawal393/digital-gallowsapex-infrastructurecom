export interface Predicate {
  id: string;
  name: string;
  article: string;
  description: string;
  violationPatterns: string[];
}

export interface GallowsResult {
  status: 'APPROVED' | 'BLOCKED';
  verificationTimeMs: number;
  auditHash: string;
  predicateId: string;
  timestamp: string;
  actionSummary: string;
  violationFound?: string;
}

export const PREDICATES: Predicate[] = [
  {
    id: 'EU_ART_50',
    name: 'Transparency Obligations',
    article: 'Article 50',
    description: 'AI systems must provide transparent disclosure of AI-generated content, attribution, and synthetic media labeling.',
    violationPatterns: ['undisclosed ai', 'no attribution', 'hidden synthetic', 'deepfake without label', 'without disclosure'],
  },
  {
    id: 'EU_ART_14',
    name: 'Human Oversight',
    article: 'Article 14',
    description: 'High-risk AI systems must be designed to allow effective human oversight, including the ability to intervene or halt operations.',
    violationPatterns: ['autonomous decision', 'no human review', 'override human', 'bypass approval', 'without human'],
  },
  {
    id: 'EU_ART_15',
    name: 'Accuracy & Robustness',
    article: 'Article 15',
    description: 'AI systems must achieve appropriate levels of accuracy, robustness, and cybersecurity throughout their lifecycle.',
    violationPatterns: ['unverified data', 'no validation', 'untested model', 'fabricated', 'unvalidated'],
  },
  {
    id: 'EU_ART_52',
    name: 'AI Disclosure',
    article: 'Article 52',
    description: 'Users must be informed when they are interacting with an AI system, and AI-generated content must be labeled as such.',
    violationPatterns: ['impersonate human', 'pretend to be person', 'hide ai identity', 'no bot disclosure', 'pose as human'],
  },
];

export async function hashSHA256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function checkCompliance(actionText: string, predicateId: string): { compliant: boolean; violationFound?: string } {
  const predicate = PREDICATES.find(p => p.id === predicateId);
  if (!predicate) return { compliant: true };

  const lowerAction = actionText.toLowerCase();
  for (const pattern of predicate.violationPatterns) {
    if (lowerAction.includes(pattern)) {
      return { compliant: false, violationFound: pattern };
    }
  }
  return { compliant: true };
}

export async function runGallows(actionText: string, predicateId: string): Promise<GallowsResult> {
  const t0 = performance.now();
  const timestamp = new Date().toISOString();

  const { compliant, violationFound } = checkCompliance(actionText, predicateId);
  const status = compliant ? 'APPROVED' : 'BLOCKED';

  const hashInput = `${actionText}|${predicateId}|${timestamp}|${status}`;
  const auditHash = await hashSHA256(hashInput);

  const t1 = performance.now();

  return {
    status,
    verificationTimeMs: Math.round((t1 - t0) * 100) / 100,
    auditHash,
    predicateId,
    timestamp,
    actionSummary: actionText.length > 80 ? actionText.substring(0, 77) + '...' : actionText,
    violationFound,
  };
}
