import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Gift, TrendingUp, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface DashboardStats {
  totalInquiries: number;
  pendingInquiries: number;
  totalOffers: number;
  sentOffers: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInquiries: 0,
    pendingInquiries: 0,
    totalOffers: 0,
    sentOffers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [inquiriesRes, offersRes] = await Promise.all([
        axios.get('http://localhost:3000/api/inquiries'),
        axios.get('http://localhost:3000/api/offers')
      ]);

      const inquiries = inquiriesRes.data.data || [];
      const offers = offersRes.data.data || [];

      setStats({
        totalInquiries: inquiries.length,
        pendingInquiries: inquiries.filter((i: any) => i.status === 'Pending').length,
        totalOffers: offers.length,
        sentOffers: offers.filter((o: any) => o.status === 'Sent').length
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Overview of your wealth management operations
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Inquiries */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Inquiries
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats.totalInquiries}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link to="/inquiries" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all →
            </Link>
          </div>
        </div>

        {/* Pending Inquiries */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-amber-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Inquiries
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats.pendingInquiries}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link to="/inquiries" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Review →
            </Link>
          </div>
        </div>

        {/* Total Offers */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Gift className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Offers
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats.totalOffers}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link to="/offers" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all →
            </Link>
          </div>
        </div>

        {/* Sent Offers */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Sent Offers
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats.sentOffers}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link to="/offers" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Manage →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            to="/inquiries?action=create"
            className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Create New Inquiry
            </span>
          </Link>
          <Link
            to="/offers"
            className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Gift className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Create New Offer
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
