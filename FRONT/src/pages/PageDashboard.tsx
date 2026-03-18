import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, FileText, Calendar, ArrowRight } from 'lucide-react'; // Si tu utilises lucide-react

const Dashboard = () => {
  // Données fictives pour le graphique (à remplacer par tes données Prisma)
  const dataChart = [
    { name: 'En cours', value: 3, color: '#3b82f6' },
    { name: 'Terminés', value: 5, color: '#10b981' },
    { name: 'En attente', value: 2, color: '#f59e0b' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de bord - ChantierFacile</h1>

      {/* 1. STATS RAPIDES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center">
            <Users className="text-blue-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500 uppercase font-semibold">Clients</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="text-green-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500 uppercase font-semibold">Devis</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
          <button className="text-green-600 hover:underline text-sm flex items-center">
            Gérer <ArrowRight size={16} />
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center">
            <Calendar className="text-purple-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500 uppercase font-semibold">Tâche du jour</p>
              <p className="text-md font-medium text-gray-800 italic">"Peinture salon - Villa Martin"</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. LE GRAPHIQUE */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-4">État des Chantiers</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataChart} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {dataChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-sm">
             {dataChart.map(item => (
               <span key={item.name}><span style={{color: item.color}}>●</span> {item.name}</span>
             ))}
          </div>
        </div>

        {/* 3. PROCHAINES ÉCHÉANCES */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-4">À faire cette semaine</h2>
          <ul className="space-y-4">
             <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Pose du carrelage - Client Durand</span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Mercredi</span>
             </li>
             {/* Map tes tâches ici */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;