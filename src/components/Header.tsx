import { Sun, Moon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from './ui/button';
import { SidebarTrigger } from './ui/sidebar';

const Header = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {user?.email}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative rounded-full"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Alternar tema</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
