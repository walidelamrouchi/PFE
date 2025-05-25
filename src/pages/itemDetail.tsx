import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import declarationService, { DeclarationListItem } from '@/services/declaration.service';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<DeclarationListItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const data = await declarationService.getDeclarationDetail(Number(id));
        setItem(data);
      } catch (error) {
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEdit = () => {
    if (item) {
      navigate(`/declare-item/${item.declaration_id}`);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8 text-center">Chargement...</div>;
  }
  if (!item) {
    return <div className="container mx-auto py-8 text-center text-red-500">Objet non trouvé.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4 text-sm text-muted-foreground">
        <Link to="/my-items" className="text-primary hover:underline">Mes objets</Link> {'>'} Fiche objet <b>{item.declaration_id}</b>
      </div>
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar>
            {item.image_url && <img src={item.image_url} alt={item.title} />}
          </Avatar>
          <div className="flex-1">
            <div className="mb-1">
              <span className="font-semibold capitalize">{item.type === 'lost' ? 'Perdu' : 'Trouvé'} - </span>
              <span className="font-bold">{item.title}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Date de déclaration {item.declaration_created_at}
            </div>
            <div className="text-xs text-muted-foreground">
              Ref: <b>{item.declaration_id}</b>
            </div>
            {item.returned === 1 && (
              <div className="mt-2">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                  ✅ Objet rendu
                </span>
              </div>
            )}
          </div>
          {item.returned !== 1 && (
            <Button variant="outline" onClick={handleEdit}>Modifier l'annonce</Button>
          )}
        </div>
        <hr className="my-4" />
        <div>
          <h3 className="text-lg font-semibold text-emerald-900 mb-4">Mon objet</h3>
          <div className="mb-2 flex flex-wrap items-center">
            <span className="font-semibold mr-2">Catégorie :</span>
            <Badge className="mr-2 mb-1">{item.category_name}</Badge>
          </div>
          <div className="mb-2"><span className="font-semibold">Description:</span> {item.description}</div>
          <div className="mb-2"><span className="font-semibold">Lieu:</span> {item.location}</div>
          <div className="mb-2"><span className="font-semibold">Date de perte/trouvaille:</span> {item.date_incident}</div>
        </div>
      </Card>
      {/* Historique ou autres infos ici */}
    </div>
  );
};

export default ItemDetail;
