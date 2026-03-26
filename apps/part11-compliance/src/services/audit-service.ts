import type { AuditEntry } from '../types/audit-entry';
import { AUDIT_ENTRIES } from '../data/mock-data';

const STORAGE_KEY = 'part11-audit-entries';
const ID_KEY = 'part11-audit-nextId';

function load(): AuditEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [...AUDIT_ENTRIES];
}

function save(entries: AuditEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function nextId(): number {
  const id = Number(localStorage.getItem(ID_KEY) || '100') + 1;
  localStorage.setItem(ID_KEY, String(id));
  return id;
}

export const AuditService = {
  async getAll(): Promise<AuditEntry[]> {
    return [...load()].sort(
      (a, b) => new Date(b.performedOn).getTime() - new Date(a.performedOn).getTime()
    );
  },

  async getByRecord(recordId: string): Promise<AuditEntry[]> {
    return load()
      .filter((e) => e.recordId === recordId)
      .sort((a, b) => new Date(a.performedOn).getTime() - new Date(b.performedOn).getTime());
  },

  async create(
    data: Omit<AuditEntry, 'id' | 'performedOn'>
  ): Promise<AuditEntry> {
    const entry: AuditEntry = {
      ...data,
      id: `a-${String(nextId()).padStart(3, '0')}`,
      performedOn: new Date().toISOString(),
    };
    const entries = load();
    entries.unshift(entry);
    save(entries);
    return entry;
  },
};
