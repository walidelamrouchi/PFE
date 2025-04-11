import React, { useEffect, useState } from 'react';

function ObjectList() {
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    // Appel API pour récupérer les objets
    fetch('/api/objects.php?action=search&keyword=')
      .then(response => response.json())
      .then(data => setObjects(data));
  }, []);

  return (
    <div>
      <h2>Objets trouvés</h2>
      <ul>
        {objects.map((object) => (
          <li key={object.id}>{object.title} - {object.description}</li>
        ))}
      </ul>
    </div>
  );
}

export default ObjectList;