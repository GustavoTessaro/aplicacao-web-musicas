import { Music } from '@/store/slices/playlistSlice';

const API_BASE = 'https://www.theaudiodb.com/api/v1/json/2';

interface AudioDBTrack {
  idTrack: string;
  strTrack: string;
  strArtist: string;
  strGenre: string;
  intYearReleased: string;
  strTrackThumb: string;
}

interface AudioDBArtist {
  idArtist: string;
  strArtist: string;
  strGenre: string;
  strArtistThumb: string;
}

const convertToMusic = (track: AudioDBTrack): Music => ({
  id: track.idTrack,
  nome: track.strTrack,
  artista: track.strArtist,
  genero: track.strGenre || 'Unknown',
  ano: track.intYearReleased || 'Unknown',
  thumb: track.strTrackThumb,
});

export const searchMusicByArtist = async (artist: string): Promise<Music[]> => {
  try {
    const response = await fetch(`${API_BASE}/search.php?s=${encodeURIComponent(artist)}`);
    const data = await response.json();
    
    if (data.artists && data.artists.length > 0) {
      const artistData = data.artists[0];
      const tracksResponse = await fetch(`${API_BASE}/track.php?m=${artistData.idArtist}`);
      const tracksData = await tracksResponse.json();
      
      if (tracksData.track) {
        return tracksData.track.slice(0, 10).map(convertToMusic);
      }
    }
    return [];
  } catch (error) {
    console.error('Error searching music:', error);
    return [];
  }
};

export const searchMusicByTrack = async (trackName: string): Promise<Music[]> => {
  try {
    const response = await fetch(`${API_BASE}/searchtrack.php?s=${encodeURIComponent(trackName)}`);
    const data = await response.json();
    
    if (data.track) {
      return data.track.slice(0, 10).map(convertToMusic);
    }
    return [];
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
};

export const getPopularSongs = async (): Promise<Music[]> => {
  // Since TheAudioDB doesn't have a "popular" endpoint, we'll fetch trending artists
  const popularArtists = ['Coldplay', 'Queen', 'The Beatles'];
  
  try {
    const allTracks: Music[] = [];
    
    for (const artist of popularArtists) {
      const tracks = await searchMusicByArtist(artist);
      allTracks.push(...tracks.slice(0, 3));
    }
    
    return allTracks.slice(0, 10);
  } catch (error) {
    console.error('Error fetching popular songs:', error);
    return [];
  }
};
