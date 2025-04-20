
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BackLinkProps {
  status?: 'lost' | 'found';
}

const BackLink = ({ status }: BackLinkProps) => {
  return (
    <Link to="/objects" className="flex items-center mb-6 text-primary hover:underline">
      <ArrowLeft size={18} className="mr-2" />
      Retour aux objets déclarés
    </Link>
  );
};

export default BackLink;
