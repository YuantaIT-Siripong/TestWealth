import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import type { InquirySource, InquiryStatus, Inquiry } from '@shared/types';

interface InquiryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  inquiry?: Inquiry | null; // For edit mode
  mode?: 'create' | 'edit';
}

interface Client {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  minInvestment: number;
}

export default function InquiryForm({ isOpen, onClose, onSuccess, inquiry, mode = 'create' }: InquiryFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [minAmountError, setMinAmountError] = useState<string>('');
  const [formData, setFormData] = useState({
    source: 'Web' as InquirySource,
    clientId: '',
    productId: '',
    requestedAmount: '',
    additionalRemark: '',
    status: 'Draft' as InquiryStatus,
    createdBy: 'ADMIN001'
  });

  useEffect(() => {
    if (isOpen) {
      loadClients();
      loadProducts();
    }
  }, [isOpen]);

  // Separate effect for prefilling form data in edit mode
  useEffect(() => {
    if (isOpen && mode === 'edit' && inquiry && products.length > 0) {
      console.log('Prefilling form with inquiry:', inquiry);
      console.log('Available products:', products);
      setFormData({
        source: inquiry.source,
        clientId: inquiry.clientId,
        productId: inquiry.productId,
        requestedAmount: inquiry.requestedAmount.toString(),
        additionalRemark: inquiry.additionalRemark || '',
        status: inquiry.status,
        createdBy: inquiry.createdBy
      });
    } else if (isOpen && mode === 'create') {
      // Reset form for create mode
      setFormData({
        source: 'Web',
        clientId: '',
        productId: '',
        requestedAmount: '',
        additionalRemark: '',
        status: 'Draft',
        createdBy: 'ADMIN001'
      });
    }
  }, [isOpen, mode, inquiry, products]);

  const loadClients = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/clients');
      setClients(response.data.data || response.data);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(response.data.data || response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const validateAmount = (amount: string, productId: string) => {
    const selectedProduct = products.find(p => p.id === productId);
    const amountValue = parseFloat(amount);
    
    if (selectedProduct && amountValue < selectedProduct.minInvestment) {
      setMinAmountError(
        `Minimum investment for ${selectedProduct.name} is $${selectedProduct.minInvestment.toLocaleString()}`
      );
      return false;
    }
    setMinAmountError('');
    return true;
  };

  const handleAmountChange = (amount: string) => {
    setFormData({ ...formData, requestedAmount: amount });
    if (formData.productId && amount) {
      validateAmount(amount, formData.productId);
    }
  };

  const handleProductChange = (productId: string) => {
    setFormData({ ...formData, productId });
    if (formData.requestedAmount && productId) {
      validateAmount(formData.requestedAmount, productId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate amount before submitting
    if (!validateAmount(formData.requestedAmount, formData.productId)) {
      return;
    }
    
    setLoading(true);

    try {
      const payload = {
        ...formData,
        requestedAmount: parseFloat(formData.requestedAmount)
      };

      let response;
      if (mode === 'edit' && inquiry) {
        // Update existing inquiry
        response = await axios.put(`http://localhost:3000/api/inquiries/${inquiry.id}`, payload);
      } else {
        // Create new inquiry
        response = await axios.post('http://localhost:3000/api/inquiries', payload);
      }
      
      if (response.data.success) {
        setLoading(false);
        alert(mode === 'edit' ? 'Inquiry updated successfully!' : 'Inquiry created successfully!');
        onSuccess(); // Refresh the list first
        handleClose(); // Then close modal
      } else {
        setLoading(false);
        alert('Failed to save inquiry');
      }
    } catch (error: any) {
      setLoading(false);
      alert(error.response?.data?.error?.message || `Failed to ${mode === 'edit' ? 'update' : 'create'} inquiry`);
    }
  };

  const handleClose = () => {
    setFormData({
      source: 'Web',
      clientId: '',
      productId: '',
      requestedAmount: '',
      additionalRemark: '',
      status: 'Draft',
      createdBy: 'ADMIN001'
    });
    setMinAmountError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {mode === 'edit' ? 'Edit Inquiry' : 'Create New Inquiry'}
          </h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="space-y-4">
            {/* Source */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Source *</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value as InquirySource })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Web">Web</option>
                <option value="Mobile">Mobile</option>
                <option value="API">API</option>
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
                <option value="Walk-in">Walk-in</option>
              </select>
            </div>

            {/* Client */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Client *</label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Product *</label>
              <select
                value={formData.productId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {formData.productId && (
                <p className="mt-2 text-xs text-gray-600">
                  Minimum Notional Amount: <span className="font-semibold text-gray-900">
                    ${products.find(p => p.id === formData.productId)?.minInvestment.toLocaleString()}
                  </span>
                </p>
              )}
            </div>

            {/* Requested Amount */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Requested Amount *</label>
              <input
                type="number"
                value={formData.requestedAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  minAmountError ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter amount"
                min="1000"
                step="1000"
                required
              />
              {minAmountError && (
                <p className="mt-1 text-xs text-red-600">{minAmountError}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as InquiryStatus })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Draft">Draft</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Additional Remarks */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Additional Remarks</label>
              <textarea
                value={formData.additionalRemark}
                onChange={(e) => setFormData({ ...formData, additionalRemark: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enter any additional notes..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (mode === 'edit' ? 'Updating...' : 'Creating...') : (mode === 'edit' ? 'Update Inquiry' : 'Create Inquiry')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
