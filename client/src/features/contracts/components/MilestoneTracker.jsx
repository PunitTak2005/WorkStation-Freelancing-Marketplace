import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, AlertCircle, Upload, FileText, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatDate } from '@/utils/formatters';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Modal from '@/components/common/Modal';
import TextArea from '@/components/common/TextArea';
import { useDropzone } from 'react-dropzone';
import { openRazorpayCheckout } from '@/features/payments/components/RazorpayCheckout';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { downloadMilestoneReportPDF } from '@/utils/pdf';

export default function MilestoneTracker({ contract, onUpdate }) {
  const { user } = useAuth();
  const isClient = user.role === 'client';
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submissionDesc, setSubmissionDesc] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleDownloadReport = async (milestone) => {
    try {
      toast.loading('Generating Milestone Settlement Report...', { id: 'mls-pdf' });
      await downloadMilestoneReportPDF(contract, milestone, user);
      toast.success('Milestone report downloaded!', { id: 'mls-pdf', icon: '📄' });
    } catch (err) {
      console.error('Milestone report error:', err);
      toast.error('Failed to generate report PDF.', { id: 'mls-pdf' });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => setFiles(acceptedFiles),
    maxSize: 10485760, // 10MB
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400';
      case 'funded': return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'in_progress': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
      case 'submitted': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'approved': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'revision': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const handleFund = async (milestoneId) => {
    try {
      setSubmitting(true);
      const res = await api.post(`/contracts/${contract._id}/milestones/${milestoneId}/fund`);
      const { orderId, amount, currency } = res.data.data;

      openRazorpayCheckout({
        orderId,
        amount,
        currency,
        name: 'Workstation Escrow',
        description: `Funding milestone for ${contract.job?.title}`,
        onSuccess: async (response) => {
          await api.post(`/payments/verify`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            contractId: contract._id,
            milestoneId
          });
          toast.success('Milestone funded successfully!');
          onUpdate();
        },
        onFailure: () => toast.error('Payment failed or was cancelled')
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initiate funding');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitWork = async () => {
    if (!submissionDesc.trim()) return toast.error('Description is required');
    
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('description', submissionDesc);
      files.forEach(file => formData.append('attachments', file));

      await api.post(`/contracts/${contract._id}/milestones/${selectedMilestone._id}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Work submitted successfully');
      setIsSubmitModalOpen(false);
      setSubmissionDesc('');
      setFiles([]);
      onUpdate();
    } catch (error) {
      toast.error('Failed to submit work');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAction = async (milestoneId, action) => {
    try {
      setSubmitting(true);
      await api.post(`/contracts/${contract._id}/milestones/${milestoneId}/${action}`);
      toast.success(`Milestone ${action}ed successfully`);
      onUpdate();
    } catch (error) {
      toast.error(`Failed to ${action} milestone`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 space-y-8 pb-4">
      {contract.milestones?.map((milestone, index) => (
        <motion.div 
          key={milestone._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative pl-8"
        >
          {/* Timeline Dot */}
          <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center font-bold text-xs ${getStatusColor(milestone.status)}`}>
            {milestone.status === 'approved' ? <Check size={14} /> : index + 1}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{milestone.title}</h4>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Clock size={14} /> Due: {formatDate(milestone.dueDate)}</span>
                  <Badge variant={
                    milestone.status === 'approved' ? 'success' : 
                    milestone.status === 'funded' ? 'info' : 
                    milestone.status === 'submitted' ? 'warning' : 'default'
                  } className="capitalize">{milestone.status.replace('_', ' ')}</Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(milestone.amount)}
                </div>
              </div>
            </div>

            {milestone.description && (
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                {milestone.description}
              </p>
            )}

            {/* Submission Details */}
            {milestone.submission && (
              <div className="mt-4 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <h5 className="text-sm font-semibold mb-2">Submitted Work</h5>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{milestone.submission.description}</p>
                {milestone.submission.attachments?.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {milestone.submission.attachments.map((file, i) => (
                      <a key={i} href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md text-indigo-600 dark:text-indigo-400 hover:underline">
                        <FileText size={14} /> {file.name || `Attachment ${i+1}`}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-5 flex flex-wrap gap-3">
              {isClient && milestone.status === 'pending' && (
                <Button onClick={() => handleFund(milestone._id)} isLoading={submitting}>
                  Fund Escrow
                </Button>
              )}
              
              {!isClient && milestone.status === 'funded' && (
                <Button onClick={() => { setSelectedMilestone(milestone); setIsSubmitModalOpen(true); }}>
                  Submit Work
                </Button>
              )}

              {isClient && milestone.status === 'submitted' && (
                <>
                  <Button variant="primary" onClick={() => handleAction(milestone._id, 'approve')} isLoading={submitting}>
                    Approve & Release
                  </Button>
                  <Button variant="outline" onClick={() => handleAction(milestone._id, 'revision')} isLoading={submitting}>
                    Request Revision
                  </Button>
                </>
              )}
              
              {milestone.status === 'approved' && (
                <div className="flex items-center gap-2">
                  <div className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-xs font-semibold">
                    <Check size={14} /> Funds Released
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Download}
                    onClick={() => handleDownloadReport(milestone)}
                    className="text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-1 px-2 h-auto"
                  >
                    Report PDF
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Submit Work Modal */}
      <Modal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} title="Submit Work">
        <div className="space-y-4 pt-4">
          <TextArea 
            label="Description of work done" 
            value={submissionDesc}
            onChange={(e) => setSubmissionDesc(e.target.value)}
            placeholder="Describe what you have completed..."
            rows={4}
          />
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Attachments</label>
            <div {...getRootProps()} className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <input {...getInputProps()} />
              <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="text-sm text-slate-600 dark:text-slate-400">Drag & drop files here, or click to select files</p>
            </div>
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between text-sm p-2 bg-slate-50 dark:bg-slate-800 rounded">
                    <span className="truncate">{file.name}</span>
                    <span className="text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setIsSubmitModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitWork} isLoading={submitting}>Submit Milestone</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
