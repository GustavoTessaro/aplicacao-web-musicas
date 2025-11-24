import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Music, Plus } from 'lucide-react';
import { RootState } from '@/store/store';
import { setSearchResults, setLoading } from '@/store/slices/musicSlice';
import { addMusicToPlaylist } from '@/store/slices/playlistSlice';
import { searchMusicByArtist, searchMusicByTrack } from '@/services/audioDbApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const Musicas = () => {
  const dispatch = useDispatch();
  const { searchResults, isLoading } = useSelector((state: RootState) => state.music);
  const playlists = useSelector((state: RootState) => state.playlists.playlists);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'artist' | 'track'>('artist');
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
  const [selectedMusicId, setSelectedMusicId] = useState<string>('');

  const userPlaylists = playlists.filter(p => p.usuarioId === userId);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Digite algo para buscar');
      return;
    }

    dispatch(setLoading(true));
    
    let results;
    if (searchType === 'artist') {
      results = await searchMusicByArtist(searchTerm);
    } else {
      results = await searchMusicByTrack(searchTerm);
    }

    dispatch(setSearchResults(results));
    dispatch(setLoading(false));

    if (results.length === 0) {
      toast.info('Nenhum resultado encontrado');
    }
  };

  const handleAddToPlaylist = (musicId: string) => {
    if (!selectedPlaylist) {
      toast.error('Selecione uma playlist');
      return;
    }

    const music = searchResults.find(m => m.id === musicId);
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
            <Search className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Buscar Músicas</h1>
            <p className="text-muted-foreground mt-1">Encontre suas músicas favoritas</p>
          </div>
        </div>

        <Card className="bg-card mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="artist">Por Artista</SelectItem>
                  <SelectItem value="track">Por Música</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex-1 flex gap-2">
                <Input
                  placeholder={searchType === 'artist' ? 'Digite o nome do artista...' : 'Digite o nome da música...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="bg-background"
                />
                <Button 
                  onClick={handleSearch}
                  className="gap-2"
                  disabled={isLoading}
                >
                  <Search className="h-4 w-4" />
                  Buscar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {searchResults.map((song) => (
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
        ) : (
          <Card className="bg-card">
            <CardContent className="py-12">
              <div className="text-center">
                <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Faça uma busca para encontrar músicas
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Musicas;
