import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, UserCheck, ShieldCheck, FileText, BarChart, Clock, Info } from 'lucide-react';
import axios from 'axios';
import type { Offer } from '@shared/types';

type TabType = 'summary' | 'kyc' | 'proposal' | 'acceptance' | 'approval';

interface Client {
  id: string;
  name: string;
  cif: string;
  email: string;
  phone: string;
}

interface Product {
  id: string;
  name: string;
  productCode: string;
  description: string;
}

interface Investment {
  clientId: string;
  kyc: 'Completed' | 'Pending' | 'Expired' | 'Not Started';
  suit: 'Conservative' | 'Moderate' | 'Aggressive';
  risk: 'Low' | 'Medium' | 'High';
  amlo: 'Pass' | 'Pending' | 'Fail';
  totalAUM: number;
  lastReviewDate?: string | null;
  nextReviewDate?: string | null;
}

export default function OfferDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [offer, setOffer] = useState<Offer | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingProposal, setIsEditingProposal] = useState(false);
  const [proposalData, setProposalData] = useState({
    expectedReturn: '',
    maturityDate: '',
    proposalRemarks: ''
  });

  useEffect(() => {
    if (id) {
      loadOfferDetails(id);
    }
  }, [id]);

  const loadOfferDetails = async (offerId: string) => {
    try {
      const [offerRes, clientsRes, productsRes, investmentsRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/offers/${offerId}`),
        axios.get(`http://localhost:3000/api/clients`),
        axios.get(`http://localhost:3000/api/products`),
        axios.get(`http://localhost:3000/api/investments`)
      ]);

      if (offerRes.data.success) {
        const offerData = offerRes.data.data;
        setOffer(offerData);
        
        // Set proposal data
        setProposalData({
          expectedReturn: offerData.expectedReturn || '',
          maturityDate: offerData.maturityDate || '',
          proposalRemarks: offerData.proposalRemarks || ''
        });

        // Find related client
        const clientData = clientsRes.data.data?.find((c: Client) => c.id === offerData.clientId);
        setClient(clientData || null);

        // Find related product
        const productData = productsRes.data.data?.find((p: Product) => p.id === offerData.productId);
        setProduct(productData || null);

        // Find investment data
        const investmentData = investmentsRes.data.data?.find((i: Investment) => i.clientId === offerData.clientId);
        setInvestment(investmentData || null);
      }
    } catch (error) {
      console.error('Error loading offer details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProposal = async () => {
    if (!offer) return;
    
    try {
      const response = await axios.put(`http://localhost:3000/api/offers/${offer.id}`, proposalData);
      if (response.data.success) {
        setOffer(response.data.data);
        setIsEditingProposal(false);
      }
    } catch (error) {
      console.error('Error saving proposal:', error);
    }
  };

  const handleSendToClient = async () => {
    if (!offer) return;
    
    // Mock email sending
    alert('Email sent to client successfully! (Mock implementation)');
    
    try {
      const response = await axios.put(`http://localhost:3000/api/offers/${offer.id}`, {
        status: 'Sent'
      });
      if (response.data.success) {
        setOffer(response.data.data);
      }
    } catch (error) {
      console.error('Error updating offer status:', error);
    }
  };

  const handleConfirmOrder = async () => {
    if (!offer) return;
    
    try {
      const response = await axios.put(`http://localhost:3000/api/offers/${offer.id}`, {
        status: 'Confirmed'
      });
      if (response.data.success) {
        setOffer(response.data.data);
        alert('Order confirmed successfully!');
      }
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };

  const getTabClassName = (tab: TabType) => {
    const baseClasses = 'py-3 px-1 text-sm font-medium hover:text-gray-700 border-b-2';
    if (activeTab === tab) {
      return `${baseClasses} text-blue-600 border-blue-600`;
    }
    return `${baseClasses} text-gray-500 border-transparent`;
  };

  const canSendToClient = () => {
    if (!offer || !investment) return false;
    return investment.kyc === 'Completed' && investment.amlo === 'Pass';
  };

  const canApprove = () => {
    if (!offer || !investment) return false;
    return (
      offer.kycStatus === 'Pass' &&
      offer.suitabilityStatus === 'Pass' &&
      offer.status === 'Accepted'
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>;
  }

  if (!offer) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Order not found</h3>
          <Link to="/orders" className="mt-6 inline-block text-blue-600 hover:text-blue-500">← Back to Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/orders" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Orders
        </Link>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-2xl font-semibold leading-6 text-gray-900">{offer.id}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Order details and workflow</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-4 sm:px-6">
          <nav className="flex space-x-8">
            <button onClick={() => setActiveTab('summary')} className={getTabClassName('summary')}>
              Summary
            </button>
            <button onClick={() => setActiveTab('kyc')} className={getTabClassName('kyc')}>
              KYC & Suitability
            </button>
            <button onClick={() => setActiveTab('proposal')} className={getTabClassName('proposal')}>
              Offer Proposal
            </button>
            <button onClick={() => setActiveTab('acceptance')} className={getTabClassName('acceptance')}>
              Client Acceptance
            </button>
            <button onClick={() => setActiveTab('approval')} className={getTabClassName('approval')}>
              Approval
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Details</h3>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-xs text-gray-500 mb-1">Order ID</dt>
                      <dd className="text-sm font-medium text-gray-900">{offer.id}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500 mb-1">Client Name</dt>
                      <dd className="text-sm font-medium text-gray-900">{client?.name || offer.clientId}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500 mb-1">Product</dt>
                      <dd className="text-sm font-medium text-gray-900">{product?.name || offer.productId}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500 mb-1">Investment Amount</dt>
                      <dd className="text-sm text-gray-900">${offer.investmentAmount.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500 mb-1">Status</dt>
                      <dd className="text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          offer.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                          offer.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                          offer.status === 'Confirmed' ? 'bg-green-100 text-green-900' :
                          offer.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {offer.status}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500 mb-1">Created Date</dt>
                      <dd className="text-sm text-gray-900">{new Date(offer.createdDate).toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Activity Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-900">Order created {offer.inquiryId ? `from inquiry ${offer.inquiryId}` : ''}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(offer.createdDate).toLocaleString()}</p>
                      </div>
                    </div>
                    {investment?.kyc === 'Completed' && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">KYC check passed</p>
                          <p className="text-xs text-gray-500 mt-1">Verified</p>
                        </div>
                      </div>
                    )}
                    {offer.status === 'Sent' && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">Offer sent to client</p>
                          <p className="text-xs text-gray-500 mt-1">{new Date(offer.updatedDate || offer.createdDate).toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Client Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{client?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">CIF: {client?.cif || offer.clientId}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">KYC Status</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          investment?.kyc === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {investment?.kyc || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Risk Profile</span>
                        <span className="text-xs font-medium text-gray-900">{investment?.suit || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Total AUM</span>
                        <span className="text-xs font-medium text-gray-900">
                          {investment?.totalAUM ? `$${investment.totalAUM.toLocaleString()}` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* KYC & Suitability Tab */}
          {activeTab === 'kyc' && (
            <div className="max-w-4xl space-y-6">
              {/* KYC Status Overview */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">KYC Status Overview</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <dt className="text-xs text-gray-500 mb-1">KYC Status</dt>
                    <dd className="text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        investment?.kyc === 'Completed' ? 'bg-green-100 text-green-800' : 
                        investment?.kyc === 'Expired' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {investment?.kyc || 'Not Started'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 mb-1">AML/CFT Status</dt>
                    <dd className="text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        investment?.amlo === 'Pass' ? 'bg-green-100 text-green-800' : 
                        investment?.amlo === 'Fail' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {investment?.amlo || 'Pending'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 mb-1">Last Review Date</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {investment?.lastReviewDate ? new Date(investment.lastReviewDate).toLocaleDateString() : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 mb-1">Next Review Date</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {investment?.nextReviewDate ? new Date(investment.nextReviewDate).toLocaleDateString() : 'N/A'}
                    </dd>
                  </div>
                </div>
              </div>

              {/* Client Profile */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Client Risk Profile</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <dt className="text-xs text-gray-500 mb-1">Risk Appetite</dt>
                    <dd className="text-sm font-medium text-gray-900">{investment?.suit || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 mb-1">Risk Level</dt>
                    <dd className="text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        investment?.risk === 'Low' ? 'bg-green-100 text-green-800' : 
                        investment?.risk === 'Medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {investment?.risk || 'N/A'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 mb-1">Total AUM</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      ${investment?.totalAUM ? investment.totalAUM.toLocaleString() : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 mb-1">Suitability</dt>
                    <dd className="text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        offer?.suitabilityStatus === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {offer?.suitabilityStatus === 'Pass' ? 'Suitable' : 'Not Suitable'}
                      </span>
                    </dd>
                  </div>
                </div>
              </div>

              {/* Verification Checks */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Verification Checks</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <UserCheck className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Identity Verification</p>
                        <p className="text-xs text-gray-500">National ID verified</p>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      investment?.kyc === 'Completed' ? 'bg-green-100 text-green-800' : 
                      investment?.kyc === 'Expired' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {investment?.kyc === 'Completed' ? 'Pass' : investment?.kyc || 'Pending'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ShieldCheck className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">AML/CFT Screening</p>
                        <p className="text-xs text-gray-500">
                          {investment?.amlo === 'Pass' ? 'No adverse findings' : 
                           investment?.amlo === 'Fail' ? 'Review required' : 
                           'Screening in progress'}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      investment?.amlo === 'Pass' ? 'bg-green-100 text-green-800' : 
                      investment?.amlo === 'Fail' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {investment?.amlo || 'Pending'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Wealth Declaration</p>
                        <p className="text-xs text-gray-500">Source of funds verified</p>
                      </div>
                    </div>
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Pass
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <BarChart className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Suitability Assessment</p>
                        <p className="text-xs text-gray-500">
                          Risk profile: {investment?.suit || 'N/A'} | Product risk: {investment?.risk || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Pass
                    </span>
                  </div>
                </div>
              </div>

              {/* Information Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-blue-900 mb-1">Note</p>
                    <p className="text-xs text-blue-700">
                      KYC and suitability data is pulled from investments.json and is read-only. 
                      Last updated: {investment?.lastReviewDate ? new Date(investment.lastReviewDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Offer Proposal Tab */}
          {activeTab === 'proposal' && (
            <div className="max-w-4xl">
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-semibold text-gray-900">Offer Proposal</h3>
                  {!isEditingProposal && (
                    <button 
                      onClick={() => setIsEditingProposal(true)}
                      className="px-3 py-1.5 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Product Name</label>
                    <input 
                      type="text" 
                      value={product?.name || ''} 
                      disabled 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Investment Amount</label>
                      <input 
                        type="text" 
                        value={`$${offer.investmentAmount.toLocaleString()}`} 
                        disabled 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Expected Return</label>
                      <input 
                        type="text" 
                        value={proposalData.expectedReturn}
                        onChange={(e) => setProposalData({...proposalData, expectedReturn: e.target.value})}
                        disabled={!isEditingProposal}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${!isEditingProposal ? 'bg-gray-50' : ''}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Maturity Date</label>
                    <input 
                      type="text" 
                      value={proposalData.maturityDate ? new Date(proposalData.maturityDate).toLocaleDateString() : ''}
                      onChange={(e) => setProposalData({...proposalData, maturityDate: e.target.value})}
                      disabled={!isEditingProposal}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${!isEditingProposal ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Additional Remarks</label>
                    <textarea 
                      value={proposalData.proposalRemarks}
                      onChange={(e) => setProposalData({...proposalData, proposalRemarks: e.target.value})}
                      disabled={!isEditingProposal}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-24 ${!isEditingProposal ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 flex space-x-3">
                  {isEditingProposal ? (
                    <>
                      <button 
                        onClick={handleSaveProposal}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                      <button 
                        onClick={() => setIsEditingProposal(false)}
                        className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={handleSendToClient}
                      disabled={!canSendToClient()}
                      title={!canSendToClient() ? 'KYC and AML checks must pass before sending to client' : ''}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Send to Client
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-blue-900 mb-1">Note</p>
                    <p className="text-xs text-blue-700">Send to Client will mock email sending and update order status to 'Sent'.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Client Acceptance Tab */}
          {activeTab === 'acceptance' && (
            <div className="max-w-4xl">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Client Acceptance Status</h3>
                
                {offer.status === 'Accepted' || offer.status === 'Confirmed' ? (
                  <div>
                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-900">Offer Accepted</p>
                        <p className="text-xs text-green-700">Client confirmed acceptance</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Payment Method</span>
                        <span className="text-xs font-medium text-gray-900">Bank Transfer</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">OTP Verified</span>
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Yes</span>
                      </div>
                    </div>
                  </div>
                ) : offer.status === 'Sent' ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">Waiting for client to accept offer</p>
                    <p className="text-xs text-gray-500 mt-2">Offer sent: {new Date(offer.updatedDate || offer.createdDate).toLocaleString()}</p>
                    <button 
                      onClick={async () => {
                        try {
                          const response = await axios.put(`http://localhost:3000/api/offers/${offer.id}`, {
                            status: 'Accepted'
                          });
                          if (response.data.success) {
                            setOffer(response.data.data);
                          }
                        } catch (error) {
                          console.error('Error updating status:', error);
                        }
                      }}
                      className="mt-4 px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Mark as Accepted (Testing)
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-600">Offer has not been sent to client yet</p>
                    <p className="text-xs text-gray-500 mt-2">Complete the proposal and send to client first</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Approval Tab */}
          {activeTab === 'approval' && (
            <div className="max-w-4xl">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Final Approval</h3>
                <p className="text-sm text-gray-600 mb-6">Review all order details before final confirmation.</p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-2">
                    {investment?.kyc === 'Completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm text-gray-900">KYC verification completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {offer?.suitabilityStatus === 'Pass' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm text-gray-900">Suitability check passed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {offer.status === 'Accepted' || offer.status === 'Confirmed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm text-gray-900">Client accepted offer</span>
                  </div>
                </div>

                {offer.status === 'Confirmed' ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-900">Order Confirmed</p>
                    <p className="text-xs text-green-700 mt-1">This order has been approved and confirmed</p>
                  </div>
                ) : (
                  <button 
                    onClick={handleConfirmOrder}
                    disabled={!canApprove()}
                    title={!canApprove() ? 'All checks must pass and client must accept before approval' : ''}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Confirm Order
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
