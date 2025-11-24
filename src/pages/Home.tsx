import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TrendingUp, Music, Plus } from 'lucide-react';
import { setPopularSongs, setLoading } from '@/store/slices/musicSlice';
import { RootState } from '@/store/store';
import { getPopularSongs } from '@/services/audioDbApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addMusicToPlaylist } from '@/store/slices/playlistSlice';
import { toast } from 'sonner';

const Home = () => {
  const dispatch = useDispatch();
  const { popularSongs, isLoading } = useSelector((state: RootState) => state.music);
  const playlists = useSelector((state: RootState) => state.playlists.playlists);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
  const [selectedMusicId, setSelectedMusicId] = useState<string>('');

  const userPlaylists = playlists.filter(p => p.usuarioId === userId);

  useEffect(() => {
    const fetchPopularSongs = async () => {
      dispatch(setLoading(true));
      const songs = await getPopularSongs();
      dispatch(setPopularSongs(songs));
      dispatch(setLoading(false));
    };

    if (popularSongs.length === 0) {
      fetchPopularSongs();
    }
  }, [dispatch]);

  const handleAddToPlaylist = (musicId: string) => {
    if (!selectedPlaylist) {
      toast.error('Selecione uma playlist');
      return;
    }

    const music = popularSongs.find(m => m.id === musicId);
    if (music) {
      dispatch(addMusicToPlaylist({ playlistId: selectedPlaylist, music }));
      toast.success('Música adicionada à playlist!');
      setSelectedPlaylist('');
      setSelectedMusicId('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gradient-primary p-3 rounded-lg">
            <TrendingUp className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Músicas Populares</h1>
            <p className="text-muted-foreground mt-1">Descubra as músicas mais tocadas</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <Card key={i} className="bg-card animate-pulse">
                <CardContent className="p-4">
                  <div className="aspect-square bg-muted rounded-md mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {popularSongs.map((song) => (
              <Card key={song.id} className="bg-card hover:bg-card/80 transition-colors group cursor-pointer">
                <CardContent className="p-4">
                  <div className="aspect-square bg-muted rounded-md mb-4 overflow-hidden relative">
                    {song.thumb ? (
                      <img 
                        src={song.thumb} 
                        alt={song.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                          onClick={() => setSelectedMusicId(song.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card">
                        <DialogHeader>
                          <DialogTitle>Adicionar à Playlist</DialogTitle>
                          <DialogDescription>
                            Escolha uma playlist para adicionar "{song.nome}"
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Select value={selectedPlaylist} onValueChange={setSelectedPlaylist}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma playlist" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover">
                              {userPlaylists.map((playlist) => (
                                <SelectItem key={playlist.id} value={playlist.id}>
                                  {playlist.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            className="w-full"
                            onClick={() => handleAddToPlaylist(song.id)}
                          >
                            Adicionar
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <h3 className="font-semibold text-base mb-1 truncate">{song.nome}</h3>
                  <p className="text-sm text-muted-foreground truncate">{song.artista}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">{song.genero}</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">{song.ano}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
