import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import declarationService, { DeclarationListItem } from '@/services/declaration.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { toast } from '../hooks/use-toast';
const MyItems = () => {
  const [myItems, setMyItems] = useState<DeclarationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<DeclarationListItem | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await declarationService.getMyDeclarations();
        setMyItems(data);
      } catch (error) {
        // Gérer l'erreur si besoin
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePreview = (item: DeclarationListItem) => {
    setSelectedItem(item);
    setShowDialog(true);
  };

  const handleCardClick = (e: React.MouseEvent, id: number) => {
    // Empêcher le clic sur les boutons d'ouvrir la page de détail
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/item/${id}`);
  };
  const handleMarkAsReturnedAndDelete = async (id: number) => {
    //if (!window.confirm('Voulez-vous vraiment marquer comme rendu et supprimer cette déclaration ?')) return;
    try {
      await declarationService.deleteDeclaration(id);
      setMyItems((prev) => prev.filter((item) => item.declaration_id !== id));
      // Affiche un toast si tu utilises un système de toast
      toast({ title: 'Succès', description: 'Déclaration supprimée.' });
    } catch (error) {
      toast({ title: 'Erreur', description: "Impossible de supprimer.", variant: 'destructive' });
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-muted/50">
      <Navbar />
      <main className="flex-grow container mx-auto py-8">
        <h2 className="text-xl font-semibold mb-6 text-emerald-900">Mes objets</h2>
        {loading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : myItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Aucun objet</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {myItems.map((item) => (
              <div
                key={item.declaration_id}
                className="bg-white rounded-lg shadow p-4 flex flex-col items-center cursor-pointer transition hover:shadow-lg"
                onClick={(e) => handleCardClick(e, item.declaration_id)}
                tabIndex={0}
                role="button"
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                  if (e.key === 'Enter' || e.key === ' ') handleCardClick(e as unknown as React.MouseEvent, item.declaration_id);
                }}
              >
                <div className="text-xs text-muted-foreground mb-1">Ref. {item.declaration_id}</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold">{item.title}</span>
                  {item.type === 'lost' ? (
                    <span className="rounded-full border border-red-400 text-red-500 px-2 text-xs font-bold">P</span>
                  ) : (
                    <span className="rounded-full border border-teal-400 text-teal-500 px-2 text-xs font-bold">T</span>
                  )}
                </div>
                <div className="font-semibold text-base mb-1">{item.date_incident}</div>
                <div className="text-sm text-muted-foreground mb-2">{item.location}</div>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-20 h-20 object-cover rounded-full mb-2" />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-muted rounded-full mb-2">
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#ccc" strokeWidth="2" /><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#888">?</text></svg>
                  </div>
                )}
                <div className="flex flex-col gap-2 w-full">
                  <Button variant="outline" className="w-full" onClick={(e) => { e.stopPropagation(); handlePreview(item); }}>
                    Aperçu rapide
                  </Button>
                  <Button
                        className="w-full"
                        variant="default"
                        onClick={() => handleMarkAsReturnedAndDelete(item.declaration_id)}
                  >
                    Objet rendu ?
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 text-right text-sm text-muted-foreground">
          1 - {myItems.length} sur {myItems.length}
        </div>
      </main>
      {/* Aperçu rapide (modale) */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedItem.title}</DialogTitle>
                <DialogDescription>Description</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 mt-2">
                {selectedItem.image_url && (
                  <img src={selectedItem.image_url} alt={selectedItem.title} className="w-24 h-24 object-cover rounded-full" />
                )}
                <div className="grid grid-cols-2 gap-2 w-full text-sm">
                  <div className="font-semibold">Type</div>
                  <div>{selectedItem.type === 'lost' ? 'Perdu' : 'Trouvé'}</div>
                  <div className="font-semibold">Ref</div>
                  <div>{selectedItem.declaration_id}</div>
                  <div className="font-semibold">Date de perte/trouvaille</div>
                  <div>{selectedItem.date_incident}</div>
                  <div className="font-semibold">Adresse</div>
                  <div>{selectedItem.location}</div>
                  <div className="font-semibold">Catégorie</div>
                  <div>{selectedItem.category_name}</div>
                  <div className="font-semibold">Description</div>
                  <div>{selectedItem.description}</div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <DialogClose asChild>
                  <Button variant="outline">Fermer</Button>
                </DialogClose>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyItems; 