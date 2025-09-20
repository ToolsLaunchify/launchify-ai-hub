import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, User, Heart, Settings, LogOut, Home, Briefcase, Tag, Grid3X3, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { useAuth } from '@/hooks/useAuth';
import { useCategoryStats } from '@/hooks/useCategoryStats';
import logo from '@/assets/tools-launchify-logo.png';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();
  const { data: categories = [] } = useCategoryStats();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const productTypes = [
    { name: 'AI Tools', href: '/type/ai-tools', description: 'Artificial Intelligence powered tools' },
    { name: 'Software', href: '/type/software', description: 'Desktop and web applications' },
    { name: 'Free Tools', href: '/tools', description: 'Free online calculators and utilities' },
    { name: 'Paid Tools', href: '/type/paid-tools', description: 'Courses, templates, and digital assets' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2 mr-8">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <img src={logo} alt="Tools Launchify" className="h-8 w-8 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
            </div>
            <span className="hidden sm:block font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Tools Launchify
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="relative z-50">
          <NavigationMenu className="hidden md:flex mr-6">
            <NavigationMenuList className="space-x-2">
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-10 px-4 py-2 text-sm font-medium transition-all hover:bg-accent/50 text-muted-foreground hover:text-accent-foreground">
                <Briefcase className="w-4 h-4 mr-2" />
                Products
              </NavigationMenuTrigger>
              <NavigationMenuContent className="min-w-[400px] p-4">
                <div className="grid grid-cols-2 gap-3">
                  {productTypes.map((type) => (
                    <NavigationMenuLink asChild key={type.name}>
                      <Link
                        to={type.href}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">{type.name}</div>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                          {type.description}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-10 px-4 py-2 text-sm font-medium transition-all hover:bg-accent/50 text-muted-foreground hover:text-accent-foreground">
                <Tag className="w-4 h-4 mr-2" />
                Categories
              </NavigationMenuTrigger>
              <NavigationMenuContent className="min-w-[500px] p-4">
                <div className="grid grid-cols-3 gap-3">
                  {categories.slice(0, 9).map((category) => (
                    <NavigationMenuLink asChild key={category.id}>
                      <Link
                        to={`/category/${category.slug}`}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{category.icon}</span>
                            <div className="text-sm font-medium leading-none">{category.name}</div>
                          </div>
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                            {category.product_count}
                          </span>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/browse"
                      className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-center text-sm font-medium"
                    >
                      View All Categories
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/type/ai-tools"
                className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 ${
                  isActive('/type/ai-tools') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                }`}
              >
                AI Tools
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/type/software"
                className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 ${
                  isActive('/type/software') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                }`}
              >
                Software
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/tools"
                className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 ${
                  isActive('/tools') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                }`}
              >
                Free Tools
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/blog"
                className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 ${
                  isActive('/blog') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                }`}
              >
                Blog
              </Link>
            </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* User Menu */}
        <div className="flex items-center space-x-4 ml-4">
          {user ? (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild className="rounded-xl">
                <Link to="/saved">
                  <Heart className="h-4 w-4 mr-2" />
                  Saved
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback className="text-xs bg-gradient-to-r from-primary to-accent text-primary-foreground">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-20 truncate">{user.email?.split('@')[0]}</span>
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/saved" className="w-full">
                      <Heart className="mr-2 h-4 w-4" />
                      Saved Products
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="w-full">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild className="rounded-xl">
                <Link to="/auth">Login</Link>
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-xl" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-xl">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <img src={logo} alt="Tools Launchify" className="h-6 w-6" />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Tools Launchify
                  </span>
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Mobile Search */}
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </form>

                {/* Mobile Navigation */}
                <nav className="space-y-2">

                  <div className="space-y-2">
                    <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Product Types
                    </div>
                    {productTypes.map((type) => (
                      <Link
                        key={type.name}
                        to={type.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      >
                        <Briefcase className="h-4 w-4" />
                        <span>{type.name}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Categories
                    </div>
                    {categories.slice(0, 5).map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${category.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      >
                        <span className="text-base">{category.icon}</span>
                        <span>{category.name}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {category.product_count}
                        </Badge>
                      </Link>
                    ))}
                    <Link
                      to="/browse"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-primary hover:text-primary/80"
                    >
                      <Tag className="h-4 w-4" />
                      <span>View All Categories</span>
                    </Link>
                  </div>
                </nav>

                {/* Mobile User Menu */}
                <div className="border-t pt-4">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 px-3 py-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 truncate">
                          <p className="text-sm font-medium truncate">{user.email}</p>
                        </div>
                      </div>
                      
                      <Link
                        to="/saved"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      >
                        <Heart className="h-4 w-4" />
                        <span>Saved Products</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Button
                        onClick={() => {
                          signOut();
                          setIsOpen(false);
                        }}
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        onClick={() => setIsOpen(false)}
                        variant="ghost"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link to="/auth">
                          <User className="h-4 w-4 mr-3" />
                          Login
                        </Link>
                      </Button>
                      <Button
                        onClick={() => setIsOpen(false)}
                        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
                        asChild
                      >
                        <Link to="/auth">Get Started</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;