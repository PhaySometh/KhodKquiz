import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, School, BookOpen, Users, FileText } from 'lucide-react';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';

const TeacherRegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    institution: '',
    institutionType: '',
    yearsExperience: '',
    subjectAreas: [],
    gradeLevel: '',
    bio: '',
    agreedToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjectOptions = [ /*... same array ...*/ ];

  const handleInputChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubjectToggle = (subject) =>
    setFormData(prev => ({
      ...prev,
      subjectAreas: prev.subjectAreas.includes(subject)
        ? prev.subjectAreas.filter(s => s !== subject)
        : [...prev.subjectAreas, subject]
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreedToTerms) return alert("Please agree to the terms.");
    if (formData.subjectAreas.length === 0) return alert("Select at least one subject.");

    setIsSubmitting(true);
    try {
      console.log(formData);
      await new Promise(r => setTimeout(r, 2000));
      alert("Submitted successfully!");
      setFormData({
        firstName: '', lastName: '', email: '', phone: '',
        institution: '', institutionType: '', yearsExperience: '',
        subjectAreas: [], gradeLevel: '', bio: '', agreedToTerms: false
      });
    } catch {
      alert("Submission failed.");
    }
    setIsSubmitting(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
    <Navbar />
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto p-6">
      {/* Card */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="text-center bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-t-lg p-6">
          <motion.div variants={itemVariants} className="flex justify-center mb-4">
            <div className="bg-white/10 p-4 rounded-full"><User className="w-8 h-8" /></div>
          </motion.div>
          <h2 className="text-3xl font-bold">Teacher Registration</h2>
          <p className="text-white/80 text-lg mt-2">Join KhodKquiz as an educator…</p>
        </div>

        <div className="p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Info */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" /> Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {['firstName','lastName','email','phone'].map((fld, i) => (
                  <div className="space-y-2" key={fld}>
                    <label htmlFor={fld} className="block capitalize">{fld.replace(/([A-Z])/g,' $1')}</label>
                    <input
                      id={fld}
                      type={fld === 'email' ? 'email' : fld === 'phone' ? 'tel' : 'text'}
                      value={formData[fld]}
                      onChange={e => handleInputChange(fld, e.target.value)}
                      required={fld !== 'phone'}
                      className="w-full border-2 rounded-md px-3 py-2 focus:border-orange-400"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Institution */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <School className="w-5 h-5" /> Institution Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="institution">Institution Name *</label>
                  <input
                    id="institution"
                    value={formData.institution}
                    onChange={e => handleInputChange('institution', e.target.value)}
                    required
                    placeholder="e.g., ABC University"
                    className="w-full border-2 rounded-md px-3 py-2 focus:border-orange-400"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="institutionType">Institution Type *</label>
                  <select
                    id="institutionType"
                    value={formData.institutionType}
                    onChange={e => handleInputChange('institutionType', e.target.value)}
                    required
                    className="w-full border-2 rounded-md px-3 py-2 focus:border-orange-400"
                  >
                    <option value="">Select type</option>
                    {['university','college','high-school','middle-school','vocational','online-platform','other'].map(v => (
                      <option key={v} value={v}>{v.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="yearsExperience">Years of Teaching Experience *</label>
                  <select
                    id="yearsExperience"
                    value={formData.yearsExperience}
                    onChange={e => handleInputChange('yearsExperience', e.target.value)}
                    required
                    className="w-full border-2 rounded-md px-3 py-2 focus:border-orange-400"
                  >
                    <option value="">Select experience</option>
                    {['0-1','2-5','6-10','11-15','15+'].map(v => (
                      <option key={v} value={v}>{v} years</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="gradeLevel">Grade Level/Student Level</label>
                  <input
                    id="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={e => handleInputChange('gradeLevel', e.target.value)}
                    placeholder="e.g., Grade 9-12"
                    className="w-full border-2 rounded-md px-3 py-2 focus:border-orange-400"
                  />
                </div>
              </div>
            </motion.div>

            {/* Subjects */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Teaching Specialization
              </h3>
              <div>
                <label className="font-medium">Subject Areas *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {subjectOptions.map(sub => (
                    <label key={sub} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.subjectAreas.includes(sub)}
                        onChange={() => handleSubjectToggle(sub)}
                        className="w-4 h-4 border-2"
                      />
                      <span>{sub}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" /> About You
              </h3>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={e => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about your teaching..."
                className="w-full border-2 rounded-md px-3 py-2 min-h-[120px] focus:border-orange-400"
              />
            </motion.div>

            {/* Terms & Submit */}
            <motion.div variants={itemVariants} className="space-y-6">
              <label className="flex items-start space-x-3 bg-gray-100 p-4 rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={e => handleInputChange('agreedToTerms', e.target.checked)}
                  className="mt-1 w-4 h-4"
                />
                <span className="text-sm">
                  I agree to the KhodKquiz Terms of Service and Privacy Policy… *
                </span>
              </label>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-md font-semibold transition-all duration-300"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Registration...
                  </div>
                ) : (
                  <><Users className="w-5 h-5 mr-2" /> Submit Teacher Registration</>
                )}
              </button>
            </motion.div>
          </form>
        </div>
      </div>
    </motion.div>
    <Footer />
    </>
  );
};

export default TeacherRegistrationForm;