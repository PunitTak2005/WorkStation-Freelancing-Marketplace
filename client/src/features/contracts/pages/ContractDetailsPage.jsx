import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, AlertTriangle, CheckCircle, Shield, Clock, IndianRupee, Download } from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatDate } from '@/utils/formatters';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import Skeleton from '@/components/common/Skeleton';
import MilestoneTracker from '../components/MilestoneTracker';
import toast from 'react-hot-toast';
import { downloadContractPDF } from '@/utils/pdf';

export default function ContractDetailsPage() {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingContract, setDownloadingContract] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDownloadContract = async () => {
    try {
      setDownloadingContract(true);
      toast.loading('Generating print-ready Contract Agreement...', { id: 'ctr-pdf' });
      await downloadContractPDF(contract, user);
      toast.success('Contract Agreement downloaded!', { id: 'ctr-pdf', icon: '📄' });
    } catch (err) {
      console.error('Contract PDF error:', err);
      toast.error('Failed to generate contract PDF.', { id: 'ctr-pdf' });
    } finally {
      setDownloadingContract(false);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [id]);

  const fetchContract = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/contracts/${id}`);
      // The contract controller returns the contract directly in data (not nested under 'contract')
      const contractData = res.data.data?.contract || res.data.data;
      setContract(contractData);
    } catch (error) {
      toast.error('Failed to load contract details');
      navigate('/dashboard/contracts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Skeleton className="h-12 w-1/3 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!contract) return null;

  const isClient = user.role === 'client';
  const otherParty = isClient ? contract.freelancer : contract.client;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'info';
      case 'disputed': return 'error';
      default: return 'default';
    }
  };

  const getEscrowColor = (status) => {
    switch (status) {
      case 'funded': return 'info';
      case 'released': return 'success';
      case 'refunded': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {contract.job?.title || 'Untitled Project'}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getStatusColor(contract.status)} size="lg" className="capitalize">
              {contract.status}
            </Badge>
            <Badge variant={getEscrowColor(contract.escrowStatus)} size="lg" className="capitalize">
              Escrow: {contract.escrowStatus || 'Pending'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              isLoading={downloadingContract}
              onClick={handleDownloadContract}
              className="gap-1.5"
            >
              Download Agreement PDF
            </Button>
          </div>
        </div>
        <p className="text-slate-500">Contract ID: {contract._id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Milestones */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <CheckCircle className="text-indigo-500" />
              Milestone Tracker
            </h2>
            <MilestoneTracker 
              contract={contract} 
              onUpdate={fetchContract} 
            />
          </div>
        </div>

        {/* Right Column - Info */}
        <div className="space-y-6">
          {/* Other Party Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              {isClient ? 'Freelancer' : 'Client'}
            </h3>
            <div className="flex flex-col items-center text-center">
              <Avatar src={otherParty?.avatar?.url || otherParty?.avatar || otherParty?.profileImage} alt={otherParty?.name} size="xl" className="mb-4" />
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">{otherParty?.name}</h4>
              <p className="text-slate-500 mb-6">{otherParty?.location || 'Unknown Location'}</p>
              
              <Button 
                variant="outline" 
                className="w-full"
                icon={MessageSquare}
                onClick={() => navigate(`/dashboard/messages?user=${otherParty?._id}`)}
              >
                Message {isClient ? 'Freelancer' : 'Client'}
              </Button>
            </div>
          </div>

          {/* Contract Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Financial Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <IndianRupee size={16} /> Total Budget
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(contract.totalAmount)}
                </span>
              </div>
              
              {!isClient && (
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 text-sm">
                  <div className="text-slate-500">Platform Fee (10%)</div>
                  <span className="text-slate-900 dark:text-white">
                    -{formatCurrency(contract.totalAmount * 0.1)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Shield size={16} /> Amount in Escrow
                </div>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(contract.amountInEscrow || 0)}
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <CheckCircle size={16} /> Amount Released
                </div>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(contract.amountReleased || 0)}
                </span>
              </div>
              
              {!isClient && (
                <div className="flex justify-between items-center pt-2">
                  <div className="font-bold text-slate-900 dark:text-white">Net Earnings</div>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency((contract.totalAmount * 0.9) - (contract.amountInEscrow * 0.9))}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <AlertTriangle size={16} className="mr-2" />
              File a Dispute
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
