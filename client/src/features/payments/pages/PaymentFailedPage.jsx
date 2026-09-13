import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

export default function PaymentFailedPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const errorReason = searchParams.get('reason') || 'Transaction was declined or cancelled by the user.';
  const contractId = searchParams.get('contract_id');

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <Card glass className="p-8 text-center relative overflow-hidden border-rose-500/20">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 to-orange-500" />
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 mx-auto rounded-full bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 flex items-center justify-center mb-6"
          >
            <XCircle size={48} className="stroke-[2.5]" />
          </motion.div>

          <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">
            Payment Failed
          </h1>
          <p className="text-navy-600 dark:text-slate-300 text-sm mb-6 max-w-sm mx-auto">
            We were unable to process your payment. No funds were debited from your bank account or card.
          </p>

          <div className="bg-slate-50 dark:bg-navy-900/60 rounded-xl p-4 mb-6 border border-slate-200 dark:border-navy-700 text-left space-y-2 text-sm">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 dark:text-slate-400">Reason</span>
              <span className="font-medium text-rose-600 dark:text-rose-400 text-right">{errorReason}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-slate-200 dark:border-navy-700">
              <span className="text-slate-500 dark:text-slate-400">Escrow Security</span>
              <span className="text-slate-700 dark:text-slate-300">Unfunded / Safe</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {contractId ? (
              <Button
                variant="primary"
                onClick={() => navigate(`/dashboard/contracts/${contractId}`)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                <span>Try Again</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => navigate(-1)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                <span>Go Back & Retry</span>
              </Button>
            )}
            <Link to="/dashboard/contracts" className="flex-1">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <ArrowLeft size={16} />
                <span>My Contracts</span>
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
