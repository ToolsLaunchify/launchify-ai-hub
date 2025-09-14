import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, User, Rocket, LogOut, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import logo from '@/assets/tools-launchify-logo.png';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const isActivePath = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'AI Tools', href: '/category/ai-tools' },
    { label: 'Software', href: '/category/software' },
    { label: 'Free Tools', href: '/free-tools' },
    { label: 'Digital Products', href: '/category/digital-products' },
  ];

  const categories = [
    { name: 'AI Writing Tools', href: '/category/ai-writing' },
    { name: 'Design Tools', href: '/category/design' },
    { name: 'Productivity', href: '/category/productivity' },
    { name: 'Marketing', href: '/category/marketing' },
    { name: 'Developer Tools', href: '/category/developer' },
    { name: 'Analytics', href: '/category/analytics' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover-lift">
            <img src={logo} alt="Tools Launchify" className="h-8 w-8" />
            <span className="text-xl font-bold text-gradient-primary">Tools Launchify</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-primary">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {categories.map((category) => (
                        <NavigationMenuLink key={category.name} asChild>
                          <Link
                            to={category.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{category.name}</div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActivePath(item.href) ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>


          {/* Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {user ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/saved">
                    <Bookmark className="h-4 w-4 mr-1" />
                    Saved
                  </Link>
                </Button>
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                  >
                    <Link to="/admin">
                      Admin
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-1" />
                  {user.email?.split('@')[0]}
                </Button>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">
                    <User className="h-4 w-4 mr-1" />
                    Login
                  </Link>
                </Button>
                <Button 
                  size="sm"
                  className="bg-gradient-primary hover:opacity-90"
                  asChild
                >
                  <Link to="/auth">
                    <Rocket className="h-4 w-4 mr-1" />
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2 pb-4 border-b">
                  <img src={logo} alt="Tools Launchify" className="h-8 w-8" />
                  <span className="text-xl font-bold text-gradient-primary">Tools Launchify</span>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </form>

                {/* Mobile Navigation Links */}
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`block px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                      isActivePath(item.href) ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="pt-4 border-t space-y-2">
                  {user ? (
                    <>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/saved" onClick={() => setIsMobileMenuOpen(false)}>
                          <Bookmark className="h-4 w-4 mr-2" />
                          Saved Products
                        </Link>
                      </Button>
                      {isAdmin && (
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                            <User className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" className="w-full justify-start" onClick={signOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          <User className="h-4 w-4 mr-2" />
                          Login
                        </Link>
                      </Button>
                      <Button variant="hero" className="w-full" asChild>
                        <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                          <Rocket className="h-4 w-4 mr-2" />
                          Get Started
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;