export interface PlaylistItem {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  url: string;
}

export interface Folder {
  id: string;
  name: string;
  items: PlaylistItem[];
  createdAt: number;
}
