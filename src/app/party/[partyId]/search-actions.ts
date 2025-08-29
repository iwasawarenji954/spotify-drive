"use server";

export type TrackMock = {
  id: string;
  title: string;
  artist: string;
  album: string;
  imageUrl: string;
};

export type SearchState = {
  query: string;
  results: TrackMock[];
};

function makeMockResults(query: string): TrackMock[] {
  const q = query || "Track";
  const base = q.toUpperCase().slice(0, 10) || "TRACK";
  const items: TrackMock[] = Array.from({ length: 5 }).map((_, i) => ({
    id: `${base}-${i + 1}`,
    title: `${q} Song ${i + 1}`,
    artist: `Artist ${String.fromCharCode(65 + (i % 26))}`,
    album: `Album ${i + 1}`,
    imageUrl: `/vercel.svg`,
  }));
  return items;
}

export async function searchTracksAction(
  _prev: SearchState,
  formData: FormData
): Promise<SearchState> {
  const query = String(formData.get("q") ?? "").trim();
  const results = makeMockResults(query);
  return { query, results };
}

