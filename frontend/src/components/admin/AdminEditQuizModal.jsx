import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlusCircle,
    Trash2,
    MoveUp,
    MoveDown,
    Copy,
    X,
    Save,
} from 'lucide-react';
import apiClient from '../../utils/axiosConfig';
import toast from 'react-hot-toast';

export default function AdminEditQuizModal({
    isOpen,
    onClose,
    quizId,
    onSave,
}) {
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // Quiz form data
    const [quizForm, setQuizForm] = useState({
        title: '',
        description: '',
        category: '',
        difficulty: '',
        time: 30,
    });

    // Create a new blank question
    function createEmptyQuestion() {
        return {
            type: 'multiple-choice',
            question: '',
            options: ['', '', '', ''],
            correctAnswer: null,
        };
    }

    // Load quiz data when modal opens
    useEffect(() => {
        if (isOpen && quizId) {
            fetchQuizData();
            fetchCategories();
        }
    }, [isOpen, quizId]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setQuiz(null);
            setQuestions([]);
            setQuizForm({
                title: '',
                description: '',
                category: '',
                difficulty: '',
                time: 30,
            });
        }
    }, [isOpen]);

    const fetchQuizData = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/api/admin/quiz/${quizId}`);

            if (response.data.success) {
                const quizData = response.data.data;

                // Set quiz form data
                setQuizForm({
                    title: quizData.title || '',
                    description: quizData.description || '',
                    category: quizData.category || '',
                    difficulty: quizData.difficulty || '',
                    time: quizData.time || 30,
                });

                // Transform questions data - backend returns questions in quiz.questions format
                const transformedQuestions =
                    quizData.questions?.map((q) => {
                        const options = q.options?.map((opt) => opt.text) || [
                            '',
                            '',
                            '',
                            '',
                        ];
                        const correctAnswerIndex =
                            q.options?.findIndex((opt) => opt.isCorrect) ??
                            null;

                        return {
                            type: 'multiple-choice',
                            question: q.question || '',
                            options:
                                options.length >= 4
                                    ? options
                                    : [
                                          ...options,
                                          ...Array(4 - options.length).fill(''),
                                      ],
                            correctAnswer: correctAnswerIndex,
                        };
                    }) || [];

                setQuestions(
                    transformedQuestions.length > 0
                        ? transformedQuestions
                        : [createEmptyQuestion()]
                );
            } else {
                toast.error('Failed to load quiz data');
                onClose();
            }
        } catch (error) {
            console.error('Error loading quiz:', error);
            toast.error('Failed to load quiz data');
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
            const response = await apiClient.get('/api/admin/category');
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setCategoriesLoading(false);
        }
    };

    // Handles generic updates for a question field
    function handleChange(index, key, value) {
        const updated = [...questions];
        updated[index][key] = value;

        // If changing question type, reset options and correct answer
        if (key === 'type') {
            if (value === 'true-false') {
                updated[index].options = ['True', 'False'];
                updated[index].correctAnswer = null;
            } else if (value === 'multiple-choice') {
                updated[index].options = ['', '', '', ''];
                updated[index].correctAnswer = null;
            }
        }

        setQuestions(updated);
    }

    // Handles updates for a specific option in a question
    function handleOptionChange(questionIndex, optionIndex, value) {
        const updated = [...questions];
        updated[questionIndex].options[optionIndex] = value;
        setQuestions(updated);
    }

    // Sets the correct answer for a question
    function setCorrectAnswer(questionIndex, optionIndex) {
        const updated = [...questions];
        updated[questionIndex].correctAnswer = optionIndex;
        setQuestions(updated);
    }

    // Adds a new question
    function addQuestion() {
        setQuestions([...questions, createEmptyQuestion()]);
    }

    // Removes a question by index
    function removeQuestion(index) {
        if (questions.length > 1) {
            const updated = questions.filter((_, i) => i !== index);
            setQuestions(updated);
        }
    }

    // Duplicates a question
    function duplicateQuestion(index) {
        const duplicated = { ...questions[index] };
        const updated = [
            ...questions.slice(0, index + 1),
            duplicated,
            ...questions.slice(index + 1),
        ];
        setQuestions(updated);
    }

    // Move question up or down
    function moveQuestion(index, direction) {
        const updated = [...questions];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= updated.length) return;
        [updated[index], updated[targetIndex]] = [
            updated[targetIndex],
            updated[index],
        ];
        setQuestions(updated);
    }

    // Handle form input changes
    const handleFormChange = (field, value) => {
        setQuizForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Handle quiz update
    async function handleUpdateQuiz() {
        // Validation
        if (!quizForm.title.trim()) {
            toast.error('Quiz title is required');
            return;
        }

        if (!quizForm.category) {
            toast.error('Please select a category');
            return;
        }

        if (!quizForm.difficulty) {
            toast.error('Please select difficulty level');
            return;
        }

        // Validate questions
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question.trim()) {
                toast.error(`Question ${i + 1} is required`);
                return;
            }

            if (q.type === 'multiple-choice') {
                const filledOptions = q.options.filter((opt) => opt.trim());
                if (filledOptions.length < 2) {
                    toast.error(`Question ${i + 1} needs at least 2 options`);
                    return;
                }
                if (q.correctAnswer === null) {
                    toast.error(
                        `Please select correct answer for question ${i + 1}`
                    );
                    return;
                }
            } else if (q.type === 'true-false') {
                if (q.correctAnswer === null) {
                    toast.error(
                        `Please select correct answer for question ${i + 1}`
                    );
                    return;
                }
            }
        }

        const payload = {
            title: quizForm.title.trim(),
            description: quizForm.description.trim(),
            category: quizForm.category,
            difficulty: quizForm.difficulty,
            time: Number(quizForm.time),
            questions: questions.map((q) => {
                const options =
                    q.type === 'multiple-choice'
                        ? q.options.map((opt, i) => ({
                              text: opt,
                              isCorrect: q.correctAnswer === i,
                          }))
                        : ['True', 'False'].map((val, i) => ({
                              text: val,
                              isCorrect: q.correctAnswer === i,
                          }));
                return {
                    question: q.question,
                    type: q.type,
                    options,
                };
            }),
            questionsCount: questions.length,
        };

        try {
            setSaving(true);
            const response = await apiClient.put(
                `/api/admin/quiz/${quizId}`,
                payload
            );
            if (response.data.success) {
                toast.success('Quiz updated successfully');
                onSave(); // Refresh the quiz list
                onClose(); // Close the modal
            }
        } catch (error) {
            console.error('Quiz update error:', error);
            const errorMessage =
                error.response?.data?.message ||
                'Failed to update quiz. Please try again.';
            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
    }

    // Handle modal close
    const handleClose = () => {
        if (saving) return; // Prevent closing while saving
        onClose();
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-blue-950">
                            Edit Quiz
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleUpdateQuiz}
                                disabled={saving || loading}
                                className="flex items-center gap-2 bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Save size={18} />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={handleClose}
                                disabled={saving}
                                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div className="flex-1 overflow-auto p-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950 mx-auto mb-4"></div>
                                    <p className="text-gray-600">
                                        Loading quiz data...
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Quiz Details Form */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Quiz Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Quiz Title *
                                            </label>
                                            <input
                                                type="text"
                                                value={quizForm.title}
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        'title',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter quiz title"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Time Limit (minutes) *
                                            </label>
                                            <input
                                                type="number"
                                                value={quizForm.time}
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        'time',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="1"
                                                max="180"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Category *
                                            </label>
                                            <select
                                                value={quizForm.category}
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        'category',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                disabled={categoriesLoading}
                                            >
                                                <option value="">
                                                    Select category
                                                </option>
                                                {categories.map((category) => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Difficulty *
                                            </label>
                                            <select
                                                value={quizForm.difficulty}
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        'difficulty',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">
                                                    Select difficulty
                                                </option>
                                                <option value="Easy">
                                                    Easy
                                                </option>
                                                <option value="Medium">
                                                    Medium
                                                </option>
                                                <option value="Hard">
                                                    Hard
                                                </option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={quizForm.description}
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        'description',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows="3"
                                                placeholder="Enter quiz description"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Questions Section - This will be continued in the next part */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Questions
                                        </h3>
                                        <button
                                            onClick={addQuestion}
                                            className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
                                        >
                                            <PlusCircle size={18} />
                                            Add Question
                                        </button>
                                    </div>

                                    {questions.map((question, index) => (
                                        <div
                                            key={index}
                                            className="bg-white border border-gray-200 rounded-lg p-6"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-lg font-semibold text-gray-900">
                                                    Question {index + 1}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            moveQuestion(
                                                                index,
                                                                'up'
                                                            )
                                                        }
                                                        disabled={index === 0}
                                                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                                    >
                                                        <MoveUp size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            moveQuestion(
                                                                index,
                                                                'down'
                                                            )
                                                        }
                                                        disabled={
                                                            index ===
                                                            questions.length - 1
                                                        }
                                                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                                    >
                                                        <MoveDown size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            duplicateQuestion(
                                                                index
                                                            )
                                                        }
                                                        className="p-2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        <Copy size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            removeQuestion(
                                                                index
                                                            )
                                                        }
                                                        disabled={
                                                            questions.length ===
                                                            1
                                                        }
                                                        className="p-2 text-red-400 hover:text-red-600 disabled:opacity-50"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Question Type *
                                                    </label>
                                                    <select
                                                        value={question.type}
                                                        onChange={(e) =>
                                                            handleChange(
                                                                index,
                                                                'type',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="multiple-choice">
                                                            Multiple Choice
                                                        </option>
                                                        <option value="true-false">
                                                            True/False
                                                        </option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Question Text *
                                                    </label>
                                                    <textarea
                                                        value={
                                                            question.question
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                index,
                                                                'question',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        rows="2"
                                                        placeholder="Enter your question"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Answer Options *
                                                    </label>
                                                    <div className="space-y-2">
                                                        {question.type ===
                                                        'true-false'
                                                            ? // True/False options
                                                              question.options.map(
                                                                  (
                                                                      option,
                                                                      optionIndex
                                                                  ) => (
                                                                      <div
                                                                          key={
                                                                              optionIndex
                                                                          }
                                                                          className="flex items-center gap-3"
                                                                      >
                                                                          <input
                                                                              type="radio"
                                                                              name={`question-${index}`}
                                                                              checked={
                                                                                  question.correctAnswer ===
                                                                                  optionIndex
                                                                              }
                                                                              onChange={() =>
                                                                                  setCorrectAnswer(
                                                                                      index,
                                                                                      optionIndex
                                                                                  )
                                                                              }
                                                                              className="text-blue-600 focus:ring-blue-500"
                                                                          />
                                                                          <span className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                                                                              {
                                                                                  option
                                                                              }
                                                                          </span>
                                                                      </div>
                                                                  )
                                                              )
                                                            : // Multiple choice options
                                                              question.options.map(
                                                                  (
                                                                      option,
                                                                      optionIndex
                                                                  ) => (
                                                                      <div
                                                                          key={
                                                                              optionIndex
                                                                          }
                                                                          className="flex items-center gap-3"
                                                                      >
                                                                          <input
                                                                              type="radio"
                                                                              name={`question-${index}`}
                                                                              checked={
                                                                                  question.correctAnswer ===
                                                                                  optionIndex
                                                                              }
                                                                              onChange={() =>
                                                                                  setCorrectAnswer(
                                                                                      index,
                                                                                      optionIndex
                                                                                  )
                                                                              }
                                                                              className="text-blue-600 focus:ring-blue-500"
                                                                          />
                                                                          <input
                                                                              type="text"
                                                                              value={
                                                                                  option
                                                                              }
                                                                              onChange={(
                                                                                  e
                                                                              ) =>
                                                                                  handleOptionChange(
                                                                                      index,
                                                                                      optionIndex,
                                                                                      e
                                                                                          .target
                                                                                          .value
                                                                                  )
                                                                              }
                                                                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                              placeholder={`Option ${
                                                                                  optionIndex +
                                                                                  1
                                                                              }`}
                                                                          />
                                                                      </div>
                                                                  )
                                                              )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Select the radio button
                                                        next to the correct
                                                        answer
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
