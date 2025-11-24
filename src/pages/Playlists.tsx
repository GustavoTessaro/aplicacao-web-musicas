import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Music2, Trash2, Edit, Music } from 'lucide-react';
import { RootState } from '@/store/store';
import { addPlaylist, updatePlaylist, deletePlaylist, removeMusicFromPlaylist } from '@/store/slices/playlistSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const Playlists = () => {
  const dispatch = useDispatch();
  const playlists = useSelector((state: RootState) => state.playlists.playlists);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [editingPlaylist, setEditingPlaylist] = useState<string | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  const userPlaylists = playlists.filter(p => p.usuarioId === userId);
  const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId);

  const handleCreatePlaylist = () => {
    if (!playlistName.trim()) {
      toast.error('Digite um nome para a playlist');
      return;
    }

    dispatch(addPlaylist({
      nome: playlistName,
      usuarioId: userId!,
      musicas: [],
    }));

    toast.success('Playlist criada com sucesso!');
    setPlaylistName('');
    setIsCreateOpen(false);
    sessionStorage.setItem('lastPlaylist', playlistName);
  };

  const handleUpdatePlaylist = () => {
    if (!playlistName.trim() || !editingPlaylist) {
      toast.error('Digite um nome para a playlist');
      return;
    }

    const playlist = playlists.find(p => p.id === editingPlaylist);
    if (playlist) {
      dispatch(updatePlaylist({
        ...playlist,
        nome: playlistName,
      }));

      toast.success('Playlist atualizada!');
      setPlaylistName('');
      setEditingPlaylist(null);
      setIsEditOpen(false);
    }
  };

  const handleDeletePlaylist = (playlistId: string) => {
    dispatch(deletePlaylist(playlistId));
    toast.success('Playlist excluída!');
    if (selectedPlaylistId === playlistId) {
      setSelectedPlaylistId(null);
    }
  };

  const handleRemoveMusic = (playlistId: string, musicId: string) => {
    dispatch(removeMusicFromPlaylist({ playlistId, musicId }));
    toast.success('Música removida da playlist!');
  };

  const openEditDialog = (playlistId: string, currentName: string) => {
    setEditingPlaylist(playlistId);
    setPlaylistName(currentName);
    setIsEditOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-primary p-3 rounded-lg">
              <Music2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Minhas Playlists</h1>
              <p className="text-muted-foreground mt-1">
                {userPlaylists.length} {userPlaylists.length === 1 ? 'playlist' : 'playlists'}
              </p>
            </div>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" size="lg">
                <Plus className="h-5 w-5" />
                Nova Playlist
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Criar Nova Playlist</DialogTitle>
                <DialogDescription>
                  Escolha um nome para sua nova playlist
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="playlist-name">Nome da Playlist</Label>
                  <Input
                    id="playlist-name"
                    placeholder="Minha Playlist"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleCreatePlaylist}
                >
                  Criar Playlist
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Suas Playlists</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {userPlaylists.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Você ainda não tem playlists
                  </p>
                ) : (
                  userPlaylists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className={`p-4 rounded-lg cursor-pointer transition-all group ${
                        selectedPlaylistId === playlist.id
                          ? 'bg-secondary'
                          : 'hover:bg-secondary/50'
                      }`}
                      onClick={() => setSelectedPlaylistId(playlist.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{playlist.nome}</h3>
                          <p className="text-sm text-muted-foreground">
                            {playlist.musicas.length} {playlist.musicas.length === 1 ? 'música' : 'músicas'}
                          </p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(playlist.id, playlist.nome);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-popover">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir Playlist</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir "{playlist.nome}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePlaylist(playlist.id)}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedPlaylist ? (
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-2xl">{selectedPlaylist.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPlaylist.musicas.length === 0 ? (
                    <div className="text-center py-12">
                      <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Nenhuma música nesta playlist ainda
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Adicione músicas a partir da página Buscar Músicas
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedPlaylist.musicas.map((music) => (
                        <div
                          key={music.id}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors group"
                        >
                          <div className="h-12 w-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                            {music.thumb ? (
                              <img src={music.thumb} alt={music.nome} className="h-full w-full object-cover rounded" />
                            ) : (
                              <Music className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">{music.nome}</h4>
                            <p className="text-sm text-muted-foreground truncate">{music.artista}</p>
                          </div>
                          
                          <div className="flex gap-2 items-center">
                            <span className="text-xs bg-muted px-2 py-1 rounded-full">{music.genero}</span>
                            <span className="text-xs bg-muted px-2 py-1 rounded-full">{music.ano}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveMusic(selectedPlaylist.id, music.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card">
                <CardContent className="py-12">
                  <div className="text-center">
                    <Music2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Selecione uma playlist para ver as músicas
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>Editar Playlist</DialogTitle>
              <DialogDescription>
                Altere o nome da playlist
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-playlist-name">Nome da Playlist</Label>
                <Input
                  id="edit-playlist-name"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleUpdatePlaylist}
              >
                Salvar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Playlists;
