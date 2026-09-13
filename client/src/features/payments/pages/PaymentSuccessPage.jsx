import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, FileText, LayoutDashboard } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id') || searchParams.get('razorpay_payment_id') || 'WS-PAY-' + Math.floor(100000 + Math.random() * 900000);
  const contractId = searchParams.get('contract_id');
  const amount = searchParams.get('amount');

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <Card glass className="p-8 text-center relative overflow-hidden border-emerald-500/20">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-400" />
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-6"
          >
            <CheckCircle size={48} className="stroke-[2.5]" />
          </motion.div>

          <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-navy-600 dark:text-slate-300 text-sm mb-6 max-w-sm mx-auto">
            Your funds have been deposited safely into the Workstation Escrow. The freelancer has been notified to proceed.
          </p>

          <div className="bg-slate-50 dark:bg-navy-900/60 rounded-xl p-4 mb-6 border border-slate-200 dark:border-navy-700 text-left space-y-2 text-sm">
            <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-navy-700">
              <span className="text-slate-500 dark:text-slate-400">Payment ID</span>
              <span className="font-mono font-semibold text-navy-900 dark:text-white">{paymentId}</span>
            </div>
            {amount && (
              <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-navy-700">
                <span className="text-slate-500 dark:text-slate-400">Amount Funded</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{amount}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 dark:text-slate-400">Escrow Status</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                Funded & Protected
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {contractId ? (
              <Link to={`/dashboard/contracts/${contractId}`} className="flex-1">
                <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                  <span>View Contract</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            ) : (
              <Link to="/dashboard/contracts" className="flex-1">
                <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                  <FileText size={16} />
                  <span>My Contracts</span>
                </Button>
              </Link>
            )}
            <Link to="/dashboard/client" className="flex-1">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
