import {  Home, Inbox,  Flame} from 'lucide-react';
import { WiggleText } from '@/components/WiggleText';
<Flame />
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,

  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';


const items = [
  { title: 'Home', url: '/#', icon: Home },
  { title: 'Shared Quizzes', url: '#', icon: Inbox },
  { title: 'Trending', url: '#', icon: Flame },
];

export function AppLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 border-r">
        <AppSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-4 py-2">
          <h1 className="text-xl font-bold">Header</h1>
        
        </header>

        {/* Content */}
        <main className="flex-1 p-4 overflow-auto">
          <p>Main content goes here.</p>
        </main>
      </div>
    </div>
  );
}

export function AppSidebar() {
  return (
    <Sidebar className="mt-16 bg-[#FFFFFF]">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-center mb-10">
            <WiggleText
              text="Zap!"
              className="text-center text-6xl mt-4 font-bold font-display fancy-wrap"
            />
          </div>
         
          <SidebarGroupContent>
            <SidebarMenu className='ml-4 w-4/5'>
              {items.map((item) => (
                <SidebarMenuItem className='text-black rounded-lg p-1  ' key={item.title}>
                  <SidebarMenuButton className='hover:bg-gray-100 ' asChild>
                    <a href={item.url} className="flex items-center gap-2 w-full">
                      <item.icon size={24}/>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
