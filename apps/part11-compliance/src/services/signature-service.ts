import type { ElectronicSignature } from '../types/electronic-signature';
import { SIGNATURES } from '../data/mock-data';

const STORAGE_KEY = 'part11-signatures';
const ID_KEY = 'part11-sig-nextId';

function load(): ElectronicSignature[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [...SIGNATURES];
}

function save(sigs: ElectronicSignature[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sigs));
}

function nextId(): number {
  const id = Number(localStorage.getItem(ID_KEY) || '100') + 1;
  localStorage.setItem(ID_KEY, String(id));
  return id;
}

export const SignatureService = {
  async getByRecord(recordId: string): Promise<ElectronicSignature[]> {
    return load()
      .filter((s) => s.recordId === recordId)
      .sort((a, b) => new Date(a.signedOn).getTime() - new Date(b.signedOn).getTime());
  },

  async create(
    data: Omit<ElectronicSignature, 'id' | 'signedOn'>
  ): Promise<ElectronicSignature> {
    const sig: ElectronicSignature = {
      ...data,
      id: `s-${String(nextId()).padStart(3, '0')}`,
      signedOn: new Date().toISOString(),
    };
    const sigs = load();
    sigs.push(sig);
    save(sigs);
    return sig;
  },

  async getAll(): Promise<ElectronicSignature[]> {
    return [...load()].sort(
      (a, b) => new Date(b.signedOn).getTime() - new Date(a.signedOn).getTime()
    );
  },
};
