const BASE_URL = 'http://localhost:3004/canvas';

export interface CreateBoardBody { roomId: string; name: string; creator: string }

export async function listBoards() {
  const res = await fetch(`${BASE_URL}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`listBoards failed: ${res.status}`);
  return res.json();
}

export async function getCanvas(roomId: string) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(roomId)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`getCanvas failed: ${res.status}`);
  return res.json();
}

export async function createBoard(body: CreateBoardBody) {
  const res = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`createBoard failed: ${res.status}`);
  return res.json();
}

export async function updateCanvas(roomId: string, drawData: any) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(roomId)}/draw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(drawData),
  });
  if (!res.ok) throw new Error(`updateCanvas failed: ${res.status}`);
  return res.json();
}

export async function deleteBoard(roomId: string) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(roomId)}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`deleteBoard failed: ${res.status}`);
  return res.json();
}

export async function clearCanvas(roomId: string) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(roomId)}/clear`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`clearCanvas failed: ${res.status}`);
  return res.json();
}