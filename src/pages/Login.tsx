import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Music2, Sun, Moon } from 'lucide-react';
import { login } from '@/store/slices/authSlice';
import { RootState } from '@/store/store';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!validateEmail(email)) {
      toast.error('Email inválido', {
        description: 'Por favor, insira um email válido.',
      });
      return;
    }

    if (password.length < 6) {
      toast.error('Senha inválida', {
        description: 'A senha deve ter no mínimo 6 caracteres.',
      });
      return;
    }

    // Credenciais estáticas para teste
    const STATIC_EMAIL = 'usuario@teste.com';
    const STATIC_PASSWORD = 'senha123';

    if (email === STATIC_EMAIL && password === STATIC_PASSWORD) {
      const user = {
        id: '1',
        email: email,
      };
      
      dispatch(login(user));
      toast.success('Login realizado com sucesso!');
      navigate('/home');
    } else {
      toast.error('Credenciais inválidas', {
        description: 'Email ou senha incorretos.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4 relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="absolute top-4 right-4 rounded-full"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Alternar tema</span>
      </Button>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Music2 className="h-12 w-12 text-primary" />
          <span className="text-4xl font-bold">
            MyPlaylist
          </span>
        </div>

        <Card className="border border-border bg-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Bem-vindo</CardTitle>
            <CardDescription className="text-base">
              Entre com suas credenciais para acessar suas playlists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background"
                />
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full"
                >
                  Entrar
                </Button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
              <p className="text-xs text-muted-foreground text-center">
                Credenciais de teste:<br />
                <span className="font-mono text-foreground font-semibold">usuario@teste.com</span> / <span className="font-mono text-foreground font-semibold">senha123</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
