import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import axios from 'axios';
import type { Inquiry } from '@shared/types';

interface Client {
  id: string;
  name: string;
  cifNumber?: string;
}

interface Product {
  productCode: string;
  name: string;
}

interface Investment {
  clientId: string;
  kyc: string;
  investment_group: string;
  risk: string;
  totalAUM: number;
}

export default function InquiryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadInquiry(id);
    }
  }, [id]);

  const loadInquiry = async (inquiryId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/inquiries/${inquiryId}`);
      if (response.data.success) {
        const inquiryData = response.data.data;
        setInquiry(inquiryData);
        
        // Load related data
        await Promise.all([
          loadClient(inquiryData.clientId),
          loadProduct(inquiryData.productId),
          loadInvestment(inquiryData.clientId)
        ]);
      }
    } catch (error) {
      console.error('Error loading inquiry:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClient = async (clientId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/clients`);
      const clients = response.data.data || response.data;
      const clientData = clients.find((c: any) => c.id === clientId);
      setClient(clientData || null);
    } catch (error) {
      console.error('Error loading client:', error);
    }
  };

  const loadProduct = async (productId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/products`);
      const products = response.data.data || response.data;
      const productData = products.find((p: any) => p.productCode === productId);
      setProduct(productData || null);
    } catch (error) {
      console.error('Error loading product:', error);
    }
  };

  const loadInvestment = async (clientId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/investments`);
      const investments = response.data.data || response.data;
      const investmentData = investments.find((i: any) => i.clientId === clientId);
      setInvestment(investmentData || null);
    } catch (error) {
      console.error('Error loading investment:', error);
    }
  };

  const handleConvertToOffer = async () => {
    if (!inquiry) return;
    
    if (!confirm('Convert this inquiry to an offer?')) return;

    try {
      const response = await axios.post(`http://localhost:3000/api/inquiries/${inquiry.id}/convert`);
      if (response.data.success) {
        alert('Inquiry converted to offer successfully!');
        navigate('/offers');
      }
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Failed to convert inquiry');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>;
  }

  if (!inquiry) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Inquiry not found</h3>
          <Link to="/inquiries" className="mt-6 inline-block text-blue-600 hover:text-blue-500">← Back to Inquiries</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button and Header */}
      <div className="mb-6">
        <Link to="/inquiries" className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1 mb-3">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Inquiries</span>
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Inquiry <span>{inquiry.id}</span>
          </h1>
          {inquiry.status === 'Pending' && (
            <button
              onClick={handleConvertToOffer}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              Convert to Order Proposal
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inquiry Details Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Inquiry Details</h3>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-gray-500 mb-1">Client Name</dt>
                <dd className="text-sm font-medium text-gray-900">{client?.name || inquiry.clientId}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-1">Product</dt>
                <dd className="text-sm font-medium text-gray-900">{product?.name || inquiry.productId}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-1">Source</dt>
                <dd className="text-sm text-gray-900">{inquiry.source}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-1">Date Received</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(inquiry.createdDate).toISOString().split('T')[0]} {new Date(inquiry.createdDate).toTimeString().split(' ')[0].substring(0, 5)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-1">Requested Amount</dt>
                <dd className="text-sm text-gray-900">${inquiry.requestedAmount.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-1">Status</dt>
                <dd>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    inquiry.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                    inquiry.status === 'Converted' ? 'bg-green-100 text-green-800' :
                    inquiry.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {inquiry.status}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Activity Timeline Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Inquiry received via {inquiry.source}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(inquiry.createdDate).toISOString().split('T')[0]} {new Date(inquiry.createdDate).toTimeString().split(' ')[0].substring(0, 5)}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Assigned to {inquiry.createdBy}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(inquiry.updatedDate).toISOString().split('T')[0]} {new Date(inquiry.updatedDate).toTimeString().split(' ')[0].substring(0, 5)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Client Summary Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Client Summary</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-600">
                  {client?.name?.charAt(0) || inquiry.clientId.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{client?.name || inquiry.clientId}</p>
                <p className="text-xs text-gray-500">CIF: {client?.cifNumber || inquiry.clientId}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">KYC Status</span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  investment?.kyc === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {investment?.kyc === 'Completed' ? 'Pass' : investment?.kyc || 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Investment Group</span>
                <span className="text-xs font-medium text-gray-900">{investment?.investment_group || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Risk Level</span>
                <span className="text-xs font-medium text-gray-900">{investment?.risk || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Total AUM</span>
                <span className="text-xs font-medium text-gray-900">
                  {investment?.totalAUM ? `$${(investment.totalAUM / 1000000).toFixed(1)}M` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Backend Annotation Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-900 mb-1">Backend Annotation</p>
                <p className="text-xs text-blue-700">
                  On Convert: Create Order record, link to inquiry_id, initialize status as 'Proposal', copy client and product data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
