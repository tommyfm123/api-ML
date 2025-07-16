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

const store: Store = { edits: {}, deletes: [] };

export async function getStore() {
    return store;
}

export async function saveEdit(id: string, data: Partial<Product>) {
    store.edits[id] = { ...(store.edits[id] || {}), ...data };
}

export async function saveDelete(id: string) {
    if (!store.deletes.includes(id)) {
        store.deletes.push(id);
    }
}

export async function applyLocalChanges(products: Product[]): Promise<Product[]> {
    return products
        .filter(p => !store.deletes.includes(p.id))
        .map(p => ({ ...p, ...(store.edits[p.id] || {}) }));
}