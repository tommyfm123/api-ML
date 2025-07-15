import { promises as fs } from 'fs';
import path from 'path';

const dataFile = path.resolve(process.cwd(), 'src/data/products.json');

interface Store {
    edits: Record<string, Partial<Product>>;
    deletes: string[];
}

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    available_quantity: number;
}

async function readStore(): Promise<Store> {
    try {
        const content = await fs.readFile(dataFile, 'utf8');
        return JSON.parse(content);
    } catch {
        return { edits: {}, deletes: [] };
    }
}

async function writeStore(store: Store) {
    await fs.writeFile(dataFile, JSON.stringify(store, null, 2));
}

export async function getStore() {
    return readStore();
}

export async function saveEdit(id: string, data: Partial<Product>) {
    const store = await readStore();
    store.edits[id] = { ...(store.edits[id] || {}), ...data };
    await writeStore(store);
}

export async function saveDelete(id: string) {
    const store = await readStore();
    if (!store.deletes.includes(id)) {
        store.deletes.push(id);
    }
    await writeStore(store);
}

export async function applyLocalChanges(products: Product[]): Promise<Product[]> {
    const store = await readStore();
    return products
        .filter(p => !store.deletes.includes(p.id))
        .map(p => ({ ...p, ...(store.edits[p.id] || {}) }));
}