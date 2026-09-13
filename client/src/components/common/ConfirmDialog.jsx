import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Info } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  loading = false,
}) => {
  const Icon = variant === 'info' ? Info : AlertTriangle;
  
  const iconColors = {
    danger: 'text-red-500 bg-red-100 dark:bg-red-900/30',
    warning: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
    info: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center pt-2">
        <div className={`p-3 rounded-full mb-4 ${iconColors[variant]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {message}
        </p>
        <div className="flex gap-3 w-full">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            className="flex-1"
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
