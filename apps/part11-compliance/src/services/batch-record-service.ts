import type { BatchRecord } from '../types/batch-record';
import { BATCH_RECORDS } from '../data/mock-data';

const STORAGE_KEY = 'part11-batch-records';
const ID_KEY = 'part11-batch-nextId';
const VERSION_KEY = 'part11-data-version';
const CURRENT_VERSION = '2';

function checkVersion() {
  if (localStorage.getItem(VERSION_KEY) !== CURRENT_VERSION) {
    localStorage.removeItem('part11-batch-records');
    localStorage.removeItem('part11-signatures');
    localStorage.removeItem('part11-audit-entries');
    localStorage.removeItem('part11-batch-nextId');
    localStorage.removeItem('part11-sig-nextId');
    localStorage.removeItem('part11-audit-nextId');
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  }
}

function load(): BatchRecord[] {
  checkVersion();
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [...BATCH_RECORDS];
}

function save(records: BatchRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function nextId(): number {
  const id = Number(localStorage.getItem(ID_KEY) || '100') + 1;
  localStorage.setItem(ID_KEY, String(id));
  return id;
}

export const BatchRecordService = {
  async getAll(): Promise<BatchRecord[]> {
    return [...load()].sort(
      (a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
    );
  },

  async get(id: string): Promise<BatchRecord | undefined> {
    return load().find((r) => r.id === id);
  },

  async create(data: Omit<BatchRecord, 'id' | 'createdOn' | 'modifiedOn' | 'modifiedBy' | 'status'>): Promise<BatchRecord> {
    const now = new Date().toISOString();
    const record: BatchRecord = {
      ...data,
      id: `br-${String(nextId()).padStart(3, '0')}`,
      status: 'Draft',
      modifiedBy: data.createdBy,
      createdOn: now,
      modifiedOn: now,
    };
    const records = load();
    records.unshift(record);
    save(records);
    return record;
  },

  async update(id: string, changes: Partial<BatchRecord>, modifiedBy: string): Promise<BatchRecord> {
    const records = load();
    const idx = records.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error(`Record ${id} not found`);
    records[idx] = {
      ...records[idx],
      ...changes,
      modifiedBy,
      modifiedOn: new Date().toISOString(),
    };
    save(records);
    return records[idx];
  },

  async delete(id: string): Promise<void> {
    save(load().filter((r) => r.id !== id));
  },
};
