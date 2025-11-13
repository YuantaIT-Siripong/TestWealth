import { useEffect, useState } from 'react';
import { Search, Plus, Edit } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { Inquiry, InquiryStatus } from '@shared/types';
import InquiryForm from '../../components/inquiry/InquiryForm';

interface Client {
  id: string;
  name: string;
}

export default function InquiryList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState<Inquiry | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    // Load orders for linking
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/offers');
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  useEffect(() => {
    loadInquiries();
    loadClients();
    // Check if we should open the modal (from dashboard)
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'create') {
      setShowCreateModal(true);
    }
  }, [location]);

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

  const loadInquiries = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/inquiries');
      if (response.data.success) {
        setInquiries(response.data.data);
      }
    } catch (error) {
      console.error('Error loading inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToOrder = async (inquiryId: string) => {
    if (!confirm('Are you sure you want to convert this inquiry to an order?')) {
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3000/api/inquiries/${inquiryId}/convert`);
      if (response.data.success) {
        alert('Inquiry converted to order successfully!');
        loadInquiries(); // Reload the list
      }
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Failed to convert inquiry to order');
    }
  };

  const handleEdit = (inquiry: Inquiry) => {
    setEditingInquiry(inquiry);
    setShowEditModal(true);
  };

  const getStatusColor = (status: InquiryStatus) => {
    const colors = {
      Draft: 'bg-gray-100 text-gray-800',
      Pending: 'bg-amber-100 text-amber-800',
      Converted: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
      Cancelled: 'bg-gray-100 text-gray-600'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : clientId;
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesStatus = statusFilter === 'All' || inquiry.status === statusFilter;
    const clientName = getClientName(inquiry.clientId);
    const matchesSearch = !searchTerm || 
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>;
  }

  return (
    <div>
      
      {/* Header with Search and Filters */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Order Inquiries</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Inquiry</span>
          </button>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search inquiries..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InquiryStatus | 'All')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="All">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Pending">Pending</option>
            <option value="Converted">Converted</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inquiry ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notional Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredInquiries.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
                  No inquiries found
                </td>
              </tr>
            ) : (
              filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/inquiries/${inquiry.id}`)}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{inquiry.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{getClientName(inquiry.clientId)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{inquiry.productId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    ${inquiry.requestedAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{inquiry.source}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(inquiry.createdDate).toISOString().split('T')[0]}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {(inquiry.status === 'Draft' || inquiry.status === 'Pending') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(inquiry);
                          }}
                          className="text-sm text-gray-600 hover:text-gray-900 font-medium inline-flex items-center"
                        >
                          <Edit className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </button>
                      )}
                      {inquiry.status === 'Pending' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConvertToOrder(inquiry.id);
                          }}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Convert to Order
                        </button>
                      )}
                      {inquiry.status === 'Converted' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Find the order with matching inquiryId
                            const order = orders.find(o => o.inquiryId === inquiry.id);
                            if (order) {
                              navigate(`/orders/${order.id}`);
                            } else {
                              alert('Related order not found.');
                            }
                          }}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View Order
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <InquiryForm 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadInquiries}
      />

      {/* Edit Modal */}
      <InquiryForm 
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingInquiry(null);
        }}
        onSuccess={loadInquiries}
        inquiry={editingInquiry}
        mode="edit"
      />
    </div>
  );
}
