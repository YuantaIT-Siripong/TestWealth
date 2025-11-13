import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import type { Offer } from '@shared/types';

export default function OfferDetail() {
  const { id } = useParams<{ id: string }>();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOffer(id);
    }
  }, [id]);

  const loadOffer = async (offerId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/offers/${offerId}`);
      if (response.data.success) {
        setOffer(response.data.data);
      }
    } catch (error) {
      console.error('Error loading offer:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>;
  }

  if (!offer) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Offer not found</h3>
          <Link to="/offers" className="mt-6 inline-block text-blue-600 hover:text-blue-500">← Back to Offers</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/offers" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Offers
        </Link>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-2xl font-semibold leading-6 text-gray-900">{offer.id}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Offer details and information</p>
        </div>
        <div className="border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
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
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Client ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{offer.clientId}</dd>
            </div>
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Product ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{offer.productId}</dd>
            </div>
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Investment Amount</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                ${offer.investmentAmount.toLocaleString()}
              </dd>
            </div>
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Expected Return</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{offer.expectedReturn}</dd>
            </div>
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">KYC Status</dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  offer.kycStatus === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {offer.kycStatus === 'Pass' ? <CheckCircle className="w-3 h-3 mr-1 inline" /> : <XCircle className="w-3 h-3 mr-1 inline" />}
                  {offer.kycStatus}
                </span>
              </dd>
            </div>
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Suitability Status</dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  offer.suitabilityStatus === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {offer.suitabilityStatus === 'Pass' ? <CheckCircle className="w-3 h-3 mr-1 inline" /> : <XCircle className="w-3 h-3 mr-1 inline" />}
                  {offer.suitabilityStatus}
                </span>
              </dd>
            </div>
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Maturity Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {new Date(offer.maturityDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Expiry Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {new Date(offer.expiryDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created By</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{offer.createdBy}</dd>
            </div>
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {new Date(offer.createdDate).toLocaleString()}
              </dd>
            </div>
            {offer.inquiryId && (
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Source Inquiry</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <Link to={`/inquiries/${offer.inquiryId}`} className="text-blue-600 hover:text-blue-500">
                    {offer.inquiryId}
                  </Link>
                </dd>
              </div>
            )}
            {offer.proposalRemarks && (
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Proposal Remarks</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{offer.proposalRemarks}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
