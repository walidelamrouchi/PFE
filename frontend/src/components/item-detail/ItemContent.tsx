
import React from 'react';
import { ItemType } from '@/services/itemsData';
import BackLink from './BackLink';
import ItemImage from './ItemImage';
import ItemInfo from './ItemInfo';

interface ItemContentProps {
  item: ItemType;
}

const ItemContent = ({ item }: ItemContentProps) => {
  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <BackLink status={item.status} />
      
      <div className="glass-panel p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ItemImage imageUrl={item.imageUrl} title={item.title} />
          <ItemInfo 
            title={item.title}
            description={item.description}
            category={item.category}
            location={item.location}
            date={item.date}
            status={item.status}
            contactMethod={item.contactMethod}
            contactEmail={item.contactEmail}
            contactPhone={item.contactPhone}
            userId={item.userId}
          />
        </div>
      </div>
    </div>
  );
};

export default ItemContent;
