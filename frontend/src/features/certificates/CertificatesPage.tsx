import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Download, Eye, Search, Calendar,
  QrCode, Shield, ExternalLink, Sparkles,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { mockCertificates } from '@/lib/mock-data';

export function CertificatesPage() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = mockCertificates.filter(
    (c) => c.student_name.toLowerCase().includes(search.toLowerCase()) ||
           c.assessment_title.toLowerCase().includes(search.toLowerCase())
  );

  const cert = selectedCert ? mockCertificates.find(c => c.id === selectedCert) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-surface-900"
          >
            Certificates
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-surface-500 text-sm mt-1"
          >
            {mockCertificates.length} certificates issued
          </motion.p>
        </div>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search certificates..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-200/50 rounded-xl text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certificate List */}
        <div className="space-y-3">
          {filtered.map((certificate, i) => (
            <motion.div
              key={certificate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              whileHover={{ x: 4 }}
              onClick={() => setSelectedCert(certificate.id)}
              className={cn(
                'group p-5 rounded-2xl border cursor-pointer transition-all',
                selectedCert === certificate.id
                  ? 'bg-primary-500/5 border-primary-500/30'
                  : 'bg-surface-50 border-surface-200/50 hover:border-surface-300'
              )}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning-400 to-warning-600 flex items-center justify-center shadow-lg shadow-warning-500/20 shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-surface-900">{certificate.assessment_title}</h3>
                  <p className="text-xs text-surface-500 mt-0.5">{certificate.student_name}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-surface-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(certificate.issued_at)}
                    </span>
                    <span className="text-xs text-accent-400 font-medium">
                      {certificate.percentage}%
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg hover:bg-surface-200 text-surface-400 hover:text-surface-900 transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-surface-200 text-surface-400 hover:text-surface-900 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Award className="w-12 h-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500 font-medium">No certificates found</p>
              <p className="text-surface-400 text-sm mt-1">Certificates are issued upon passing assessments</p>
            </div>
          )}
        </div>

        {/* Certificate Preview */}
        <AnimatePresence mode="wait">
          {cert ? (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="sticky top-24"
            >
              <div className="rounded-2xl overflow-hidden border border-surface-200/50 shadow-xl">
                {/* Certificate Visual */}
                <div className="relative bg-gradient-to-br from-surface-0 via-surface-50 to-surface-0 p-12 text-center">
                  {/* Background decorations */}
                  <div className="absolute inset-0">
                    <div className="absolute top-4 left-4 w-20 h-20 border border-warning-500/10 rounded-full" />
                    <div className="absolute top-4 right-4 w-20 h-20 border border-warning-500/10 rounded-full" />
                    <div className="absolute bottom-4 left-4 w-20 h-20 border border-warning-500/10 rounded-full" />
                    <div className="absolute bottom-4 right-4 w-20 h-20 border border-warning-500/10 rounded-full" />
                    <div className="absolute inset-8 border border-warning-500/10 rounded-xl" />
                  </div>

                  <div className="relative">
                    {/* Logo */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-warning-400 to-warning-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-warning-500/20"
                    >
                      <Award className="w-8 h-8 text-white" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="text-xs font-semibold text-warning-400 uppercase tracking-[0.3em] mb-2">Certificate of Achievement</p>
                      <h2 className="text-xl font-bold text-surface-900 mb-1">QuizForge</h2>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="my-8"
                    >
                      <p className="text-xs text-surface-400 mb-2">This is to certify that</p>
                      <p className="text-2xl font-bold gradient-text mb-2">{cert.student_name}</p>
                      <p className="text-xs text-surface-400 mb-1">has successfully completed</p>
                      <p className="text-base font-semibold text-surface-900">{cert.assessment_title}</p>
                      <p className="text-xs text-surface-500 mt-2">with a score of <span className="text-accent-400 font-bold">{cert.percentage}%</span></p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-center justify-between pt-6 border-t border-surface-200/30"
                    >
                      <div className="text-left">
                        <p className="text-xs text-surface-400">Date</p>
                        <p className="text-xs font-medium text-surface-700">{formatDate(cert.issued_at)}</p>
                      </div>

                      {/* QR Code placeholder */}
                      <div className="w-14 h-14 bg-surface-100 rounded-lg flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-surface-400" />
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-surface-400">Verification</p>
                        <p className="text-xs font-mono font-medium text-surface-700">{cert.verification_code}</p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 p-4 border-t border-surface-200/50 bg-surface-50">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/20"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-surface-100 border border-surface-200/50 rounded-xl text-sm text-surface-700 hover:bg-surface-200 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Share
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-96 rounded-2xl bg-surface-50 border border-surface-200/50 border-dashed"
            >
              <div className="text-center">
                <Sparkles className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500 text-sm font-medium">Select a certificate to preview</p>
                <p className="text-surface-400 text-xs mt-1">Click on any certificate from the list</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
