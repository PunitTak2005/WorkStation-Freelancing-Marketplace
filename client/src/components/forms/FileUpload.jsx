import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function FileUpload({
  onFilesSelected,
  maxFiles = 5,
  maxSizeMB = 10,
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    'application/pdf': ['.pdf'],
  },
  initialFiles = [],
  className = '',
}) {
  const [files, setFiles] = useState(initialFiles);
  const [error, setError] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles,
    maxSize: maxSizeMB * 1024 * 1024,
    accept,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles && rejectedFiles.length > 0) {
        setError(`File rejected: Must be under ${maxSizeMB}MB and of valid format.`);
        return;
      }
      setError(null);
      const updated = [...files, ...acceptedFiles].slice(0, maxFiles);
      setFiles(updated);
      if (onFilesSelected) onFilesSelected(updated);
    },
  });

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    if (onFilesSelected) onFilesSelected(updated);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Drop Area */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-900/40'
        )}
      >
        <input {...getInputProps()} />
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <Upload size={22} />
        </div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {isDragActive ? 'Drop the files here...' : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          PNG, JPG, PDF up to {maxSizeMB}MB (Max {maxFiles} files)
        </p>
      </div>

      {error && (
        <p className="flex items-center gap-1 text-xs text-rose-500 font-medium">
          <AlertCircle size={13} /> {error}
        </p>
      )}

      {/* Selected Files List with previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {files.map((file, i) => {
            const isImage = file.type?.startsWith('image/') || typeof file === 'string';
            const name = file.name || (typeof file === 'string' ? file.split('/').pop() : `File ${i + 1}`);
            const previewUrl = typeof file === 'string' ? file : (isImage ? URL.createObjectURL(file) : null);

            return (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={name}
                      className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                      <FileText size={18} />
                    </div>
                  )}
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                    {name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ml-2 flex-shrink-0"
                  title="Remove file"
                >
                  <X size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
