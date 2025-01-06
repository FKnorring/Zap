import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { InputItem } from '@/components/ui/dynamic-input-list';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface ToolsContextType {
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
  currentItems: InputItem[];
  setCurrentItems: (items: InputItem[]) => void;
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

// Tools that share items between them
const SHARED_TOOLS = ['team-generator', 'spin-wheel'];

export function ToolsProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentItems, setCurrentItems] = useState<InputItem[]>([]);
  const [previousItems, setPreviousItems] = useState<InputItem[]>([]);
  const [showKeepItemsDialog, setShowKeepItemsDialog] = useState(false);
  const [previousPath, setPreviousPath] = useState<string>('');
  const location = useLocation();

  // Helper to extract tool name from path
  const getToolFromPath = (path: string) => {
    const match = path.match(/\/tools\/([^/]+)/);
    return match ? match[1] : '';
  };

  // Monitor location changes to handle tool switching
  useEffect(() => {
    if (previousPath && previousPath !== location.pathname) {
      const currentTool = getToolFromPath(location.pathname);
      const previousTool = getToolFromPath(previousPath);
      
      // Only show dialog if switching between shared tools
      const isSharedToolSwitch = SHARED_TOOLS.includes(currentTool) && SHARED_TOOLS.includes(previousTool);
      const hasValidItems = currentItems.length > 0 && currentItems.some(item => item.text !== '');

      if (isSharedToolSwitch && hasValidItems) {
        setPreviousItems([...currentItems]);
        setShowKeepItemsDialog(true);
        setCurrentItems([]);
      } else if (!isSharedToolSwitch) {
        // If switching to/from random number generator, just clear the items
        const emptyItem = { id: Date.now().toString(), text: '' };
        setCurrentItems([emptyItem]);
        setPreviousItems([]);
      }
    }
    setPreviousPath(location.pathname);
  }, [location.pathname, currentItems, previousPath]);

  const handleKeepItems = () => {
    setCurrentItems([...previousItems]);
    setPreviousItems([]);
    setShowKeepItemsDialog(false);
  };

  const handleDiscardItems = () => {
    const emptyItem = { id: Date.now().toString(), text: '' };
    setCurrentItems([emptyItem]);
    setPreviousItems([]);
    setShowKeepItemsDialog(false);
  };

  return (
    <ToolsContext.Provider
      value={{
        showAdvanced,
        setShowAdvanced,
        currentItems,
        setCurrentItems,
      }}
    >
      {children}
      <Dialog 
        open={showKeepItemsDialog} 
        onOpenChange={(open) => {
          if (!open) {
            handleDiscardItems();
          }
          setShowKeepItemsDialog(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('general:tools.keepItems')}</DialogTitle>
            <DialogDescription>
              {t('general:tools.keepItemsDescription')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDiscardItems}>
              {t('general:discard')}
            </Button>
            <Button onClick={handleKeepItems}>
              {t('general:keep')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ToolsContext.Provider>
  );
}

export function useTools() {
  const context = useContext(ToolsContext);
  if (context === undefined) {
    throw new Error('useTools must be used within a ToolsProvider');
  }
  return context;
} 