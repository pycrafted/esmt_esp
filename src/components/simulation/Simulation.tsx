import { useCallback, useRef, useState } from 'react';
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';

// Nœuds initiaux
const initialNodes = [
  {
    id: 'server1',
    type: 'default',
    data: { label: 'Serveur Web' },
    position: { x: 250, y: 5 },
    className: 'bg-blue-50 border border-blue-400 text-blue-700 rounded p-2 shadow flex items-center justify-center w-24 h-12 text-sm font-medium',
  },
  {
    id: 'server2',
    type: 'default',
    data: { label: 'Serveur DB' },
    position: { x: 100, y: 100 },
    className: 'bg-green-50 border border-green-400 text-green-700 rounded p-2 shadow flex items-center justify-center w-24 h-12 text-sm font-medium',
  },
  {
    id: 'router',
    type: 'default',
    data: { label: 'Routeur' },
    position: { x: 400, y: 100 },
    className: 'bg-red-50 border border-red-400 text-red-700 rounded p-2 shadow flex items-center justify-center w-24 h-12 text-sm font-medium',
  },
];

// Liens initiaux
const initialEdges = [
  { id: 'e1-2', source: 'server1', target: 'server2', animated: true, style: { stroke: '#2563EB', strokeWidth: 2 } },
  { id: 'e1-3', source: 'server1', target: 'router', animated: true, style: { stroke: '#2563EB', strokeWidth: 2 } },
];

function Visualisation() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Gestion des connexions
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#2563EB', strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  // Gestion du drag-and-drop depuis la barre latérale
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!reactFlowInstance || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // Convertir les coordonnées de la souris en coordonnées du graphe
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type: 'default',
        position,
        data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)}` },
        className: `bg-${type === 'server' ? 'blue' : 'red'}-50 border border-${type === 'server' ? 'blue' : 'red'}-400 text-${type === 'server' ? 'blue' : 'red'}-700 rounded p-2 shadow flex items-center justify-center w-24 h-12 text-sm font-medium`,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Gestion du drag start pour les éléments de la barre latérale
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow space-y-4 my-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Visualisation du Réseau</h1>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded mb-4">
        <div className="font-semibold text-sm text-gray-700">
          Ce module permet de visualiser une topologie réseau en plaçant des équipements (serveurs, routeurs) et en créant des connexions, comme dans GNS3.
        </div>
      </div>
      <div className="flex space-x-4">
        {/* Barre latérale pour glisser les logos */}
        <div className="w-48 bg-white border rounded p-4 shadow">
          <h2 className="text-sm font-bold text-blue-700 mb-2">Équipements</h2>
          <div
            className="bg-blue-100 text-blue-800 text-sm p-2 rounded mb-2 cursor-pointer hover:bg-blue-200"
            onDragStart={(event) => onDragStart(event, 'server')}
            draggable
            title="Glisser pour ajouter un serveur"
          >
            Serveur
          </div>
          <div
            className="bg-red-100 text-red-800 text-sm p-2 rounded cursor-pointer hover:bg-red-200"
            onDragStart={(event) => onDragStart(event, 'router')}
            draggable
            title="Glisser pour ajouter un routeur"
          >
            Routeur
          </div>
        </div>
        {/* Zone du graphe avec hauteur augmentée */}
        <div className="flex-1 h-[600px]" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            className="bg-white border rounded shadow"
          >
            <MiniMap className="bg-gray-100 border rounded" />
            <Controls className="bg-white rounded shadow" />
            <Background color="#e5e7eb" gap={16} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default Visualisation;