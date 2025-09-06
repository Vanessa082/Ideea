const BASE_URL = 'http://localhost:3004/canvas';

export interface CreateBoardBody { 
  roomId: string; 
  name: string; 
  creator: string; 
}

export interface SaveCanvasBody {
  elements: any[];
  name?: string;
}

// List all boards for the current user
export async function listBoards() {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const res = await fetch(`${BASE_URL}`, { 
    cache: 'no-store',
    headers 
  });
  if (!res.ok) throw new Error(`listBoards failed: ${res.status}`);
  return res.json();
}

// Get specific canvas by roomId
export async function getCanvas(roomId: string) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(roomId)}`, { 
    cache: 'no-store' 
  });
  if (!res.ok) throw new Error(`getCanvas failed: ${res.status}`);
  try {
    return await res.json();
  } catch (e) {
    console.warn('Failed to parse JSON in getCanvas:', e);
    return null;
  }
}

// Create new board
export async function createBoard(body: CreateBoardBody) {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const res = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`createBoard failed: ${res.status}`);
  return res.json();
}

// Save canvas (complete save of all elements)
export async function saveCanvas(roomId: string, saveData: SaveCanvasBody) {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(roomId)}/save`, {
    method: 'POST',
    headers,
    body: JSON.stringify(saveData),
  });
  if (!res.ok) throw new Error(`saveCanvas failed: ${res.status}`);
  return res.json();
}

// Update canvas with single element (for real-time drawing)
export async function updateCanvas(roomId: string, drawData: any) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(roomId)}/draw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(drawData),
  });
  if (!res.ok) throw new Error(`updateCanvas failed: ${res.status}`);
  return res.json();
}

// Delete board
export async function deleteBoard(roomId: string) {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(roomId)}`, { 
    method: 'DELETE',
    headers 
  });
  if (!res.ok) throw new Error(`deleteBoard failed: ${res.status}`);
  return res.json();
}

// Clear canvas
export async function clearCanvas(roomId: string) {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(roomId)}/clear`, { 
    method: 'DELETE',
    headers 
  });
  if (!res.ok) throw new Error(`clearCanvas failed: ${res.status}`);
  return res.json();
}

// Duplicate board
export async function duplicateBoard(roomId: string, newName: string) {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(roomId)}/duplicate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name: newName }),
  });
  if (!res.ok) throw new Error(`duplicateBoard failed: ${res.status}`);
  return res.json();
}