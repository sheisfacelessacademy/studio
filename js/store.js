/* Armazenamento local dos projetos (IndexedDB).
 * Ao contrário do localStorage, aguenta fotos grandes e muitos projetos.
 * Se o browser bloquear a IndexedDB, usa memória e avisa que nada fica guardado. */
const NAME = "sheis-studio2-db";
let dbp = null;
const mem = new Map();
export let persistent = true;

function open() {
  if (dbp) return dbp;
  dbp = new Promise((res) => {
    try {
      const rq = indexedDB.open(NAME, 1);
      rq.onupgradeneeded = () => rq.result.createObjectStore("projects", { keyPath: "id" });
      rq.onsuccess = () => res(rq.result);
      rq.onerror = rq.onblocked = () => { persistent = false; res(null); };
    } catch (e) { persistent = false; res(null); }
  });
  return dbp;
}
async function tx(mode, fn) {
  const db = await open();
  if (!db) return fn(null);
  return new Promise((res, rej) => {
    const t = db.transaction("projects", mode), s = t.objectStore("projects"), r = fn(s);
    t.oncomplete = () => res(r && r.result !== undefined ? r.result : undefined);
    t.onerror = t.onabort = () => rej(t.error);
  });
}
export const putProject = (p) => tx("readwrite", (s) => (s ? s.put(p) : mem.set(p.id, p)));
export const getProject = (id) => tx("readonly", (s) => (s ? s.get(id) : { result: mem.get(id) }));
export const delProject = (id) => tx("readwrite", (s) => (s ? s.delete(id) : mem.delete(id)));
export async function listProjects() {
  const all = await tx("readonly", (s) => (s ? s.getAll() : { result: [...mem.values()] }));
  return (all || []).sort((a, b) => b.updated - a.updated);
}
