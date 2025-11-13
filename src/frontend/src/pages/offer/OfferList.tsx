import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import axios from 'axios';
import type { Offer, OfferStatus } from '@shared/types';

interface Client {
  id: string;
  name: string;
}

export default function OfferList() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OfferStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadOffers();
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/clients');
      if (response.data.success) {
        setClients(response.data.data);
      } else {
        setClients(response.data);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const loadOffers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/offers');
      if (response.data.success) {
        setOffers(response.data.data);
      }
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: OfferStatus) => {
    const colors = {
      Proposal: 'bg-blue-100 text-blue-800',
      Draft: 'bg-gray-100 text-gray-800',
      Wait: 'bg-amber-100 text-amber-800',
      Sent: 'bg-blue-100 text-blue-800',
      Accepted: 'bg-green-100 text-green-800',
      Confirmed: 'bg-green-100 text-green-900',
      Rejected: 'bg-red-100 text-red-800',
      Expired: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : clientId;
  };

  const filteredOffers = offers.filter(offer => {
    const matchesStatus = statusFilter === 'All' || offer.status === statusFilter;
    const clientName = getClientName(offer.clientId);
    const matchesSearch = !searchTerm || 
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>;
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all orders including their status and details.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            to="/inquiries"
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="inline-block w-4 h-4 mr-1" />
            Create from Inquiry
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 flex gap-4">
        <div className="flex-1">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Search by ID or Client ID..."
            />
          </div>
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OfferStatus | 'All')}
            className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
          >
            <option value="All">All Status</option>
            <option value="Proposal">Proposal</option>
            <option value="Draft">Draft</option>
            <option value="Wait">Wait</option>
            <option value="Sent">Sent</option>
            <option value="Accepted">Accepted</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Rejected">Rejected</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Client ID</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Product ID</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">KYC</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Suitability</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredOffers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-sm text-gray-500">
                      No offers found
                    </td>
                  </tr>
                ) : (
                  filteredOffers.map((offer) => (
                    <tr key={offer.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {offer.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{getClientName(offer.clientId)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{offer.productId}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${offer.investmentAmount.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          offer.kycStatus === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {offer.kycStatus}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          offer.suitabilityStatus === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {offer.suitabilityStatus}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(offer.status)}`}>
                          {offer.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(offer.createdDate).toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <Link to={`/orders/${offer.id}`} className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
