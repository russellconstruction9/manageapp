import React, { useState } from 'react';
import { useData } from '../hooks/useDataContext';
import Modal from './Modal';

const CompanySwitcher: React.FC = () => {
  const { companies, currentCompany, setCurrentCompany, addCompany, loading } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');

  const handleAddCompany = async () => {
    if (newCompanyName.trim()) {
      await addCompany(newCompanyName.trim());
      setNewCompanyName('');
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return <div className="px-4 py-2 text-sm text-gray-600">Loading...</div>;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
        <span className="font-medium">
          {currentCompany?.name || 'No Company'}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Select Company">
        <div className="space-y-4">
          {/* Existing Companies */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Existing Companies</h3>
            {companies.length === 0 ? (
              <p className="text-sm text-gray-500">No companies yet. Create one below.</p>
            ) : (
              <div className="space-y-1">
                {companies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => {
                      setCurrentCompany(company);
                      setIsModalOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      currentCompany?.id === company.id
                        ? 'bg-blue-100 text-blue-900 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {company.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add New Company */}
          <div className="pt-4 border-t">
            <h3 className="font-semibold text-gray-900 mb-3">Create New Company</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCompany()}
                placeholder="Company name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddCompany}
                disabled={!newCompanyName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompanySwitcher;

