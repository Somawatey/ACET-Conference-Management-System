import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AssignPaperPage() {
    const headWeb = 'Assign Papers to Reviewers';
    const linksBreadcrumb = [
        { title: 'Home', url: '/' }, 
        { title: 'Papers', url: '/papers' }, 
        { title: headWeb, url: '' }
    ];

    // Mock data for papers
    const [papers] = useState([
        {
            id: 1,
            title: 'Machine Learning Applications in Healthcare: A Comprehensive Review',
            topic: 'Artificial Intelligence',
            author_name: 'Dr. Sarah Johnson',
            abstract: 'This paper presents a comprehensive review of machine learning applications in healthcare, covering diagnosis, treatment planning, and patient monitoring.',
            status: 'Pending Review',
            submission_date: '2024-01-15',
            word_count: 8500,
            file_size: '2.4 MB'
        },
        {
            id: 2,
            title: 'Quantum Computing: Breaking Classical Encryption Standards',
            topic: 'Quantum Computing',
            author_name: 'Prof. Michael Chen',
            abstract: 'This research explores the potential of quantum computing to break current encryption standards and proposes new quantum-resistant cryptographic methods.',
            status: 'Under Review',
            submission_date: '2024-01-10',
            word_count: 7200,
            file_size: '1.8 MB'
        },
        {
            id: 3,
            title: 'Sustainable Energy Solutions: Solar Panel Efficiency Optimization',
            topic: 'Renewable Energy',
            author_name: 'Dr. Emily Rodriguez',
            abstract: 'The study investigates novel approaches to improve solar panel efficiency through advanced materials and innovative design methodologies.',
            status: 'Pending Review',
            submission_date: '2024-01-20',
            word_count: 6800,
            file_size: '1.5 MB'
        },
        {
            id: 4,
            title: 'Blockchain Technology in Supply Chain Management',
            topic: 'Blockchain',
            author_name: 'Prof. David Kim',
            abstract: 'This paper analyzes the implementation of blockchain technology in supply chain management and its impact on transparency and efficiency.',
            status: 'Pending Review',
            submission_date: '2024-01-18',
            word_count: 9100,
            file_size: '2.1 MB'
        }
    ]);

    // Mock data for reviewers
    const [reviewers] = useState([
        { id: 1, name: 'Dr. Alice Thompson', expertise: ['AI', 'Machine Learning'], institution: 'MIT', rating: 4.8, papers_reviewed: 45 },
        { id: 2, name: 'Prof. Robert Wilson', expertise: ['Quantum Computing', 'Cryptography'], institution: 'Stanford University', rating: 4.9, papers_reviewed: 67 },
        { id: 3, name: 'Dr. Maria Garcia', expertise: ['Renewable Energy', 'Materials Science'], institution: 'UC Berkeley', rating: 4.7, papers_reviewed: 38 },
        { id: 4, name: 'Prof. James Lee', expertise: ['Blockchain', 'Distributed Systems'], institution: 'Harvard University', rating: 4.6, papers_reviewed: 52 },
        { id: 5, name: 'Dr. Lisa Anderson', expertise: ['AI', 'Healthcare'], institution: 'Johns Hopkins', rating: 4.8, papers_reviewed: 41 },
        { id: 6, name: 'Prof. Thomas Brown', expertise: ['Quantum Computing', 'Physics'], institution: 'Caltech', rating: 4.9, papers_reviewed: 58 },
        { id: 7, name: 'Dr. Jennifer White', expertise: ['Energy Systems', 'Optimization'], institution: 'Georgia Tech', rating: 4.7, papers_reviewed: 33 },
        { id: 8, name: 'Prof. Christopher Davis', expertise: ['Blockchain', 'Finance'], institution: 'NYU', rating: 4.5, papers_reviewed: 47 }
    ]);

    // State for assignments
    const [assignments, setAssignments] = useState({});
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Initialize assignments
    useEffect(() => {
        const initialAssignments = {};
        papers.forEach(paper => {
            initialAssignments[paper.id] = [];
        });
        setAssignments(initialAssignments);
    }, [papers]);

    // Filter papers based on search and status
    const filteredPapers = papers.filter(paper => {
        const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            paper.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            paper.topic.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || paper.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Handle reviewer assignment
    const assignReviewer = (paperId, reviewerId) => {
        const currentAssignments = assignments[paperId] || [];
        if (currentAssignments.length >= 4) {
            alert('Maximum 4 reviewers can be assigned to a paper');
            return;
        }
        if (currentAssignments.includes(reviewerId)) {
            alert('This reviewer is already assigned to this paper');
            return;
        }
        
        setAssignments(prev => ({
            ...prev,
            [paperId]: [...currentAssignments, reviewerId]
        }));
    };

    // Handle reviewer removal
    const removeReviewer = (paperId, reviewerId) => {
        setAssignments(prev => ({
            ...prev,
            [paperId]: prev[paperId].filter(id => id !== reviewerId)
        }));
    };

    // Get assigned reviewers for a paper
    const getAssignedReviewers = (paperId) => {
        return (assignments[paperId] || []).map(reviewerId => 
            reviewers.find(r => r.id === reviewerId)
        ).filter(Boolean);
    };

    // Check if reviewer is assigned to paper
    const isReviewerAssigned = (paperId, reviewerId) => {
        return (assignments[paperId] || []).includes(reviewerId);
    };

    // Get reviewer expertise tags
    const getExpertiseTags = (expertise) => {
        return expertise.map(exp => (
            <span key={exp} className="badge badge-info badge-sm mr-1">
                {exp}
            </span>
        ));
    };

    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />}>
            
            <div className="container-fluid">
                <Head title={headWeb} />    
                {/* Search and Filter Section */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search papers by title, author, or topic..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="input-group-append">
                                <span className="input-group-text">
                                    <i className="fas fa-search"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-control"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="Pending Review">Pending Review</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Review Complete">Review Complete</option>
                        </select>
                    </div>
                    <div className="col-md-3 text-right">
                        <button className="btn btn-primary" onClick={() => setShowAssignmentModal(true)}>
                            <i className="fas fa-plus mr-2"></i>
                            Bulk Assignment
                        </button>
                    </div>
                </div>

                {/* Papers Grid */}
                <div className="row">
                    {filteredPapers.map(paper => (
                        <div key={paper.id} className="col-12 col-md-6 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    <h6 className="card-title mb-0 text-truncate" title={paper.title}>
                                        {paper.title}
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <small className="text-muted">
                                            <strong>Author:</strong> {paper.author_name}
                                        </small>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted">
                                            <strong>Topic:</strong> {paper.topic}
                                        </small>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted">
                                            <strong>Abstract:</strong>
                                        </small>
                                        <p className="text-sm mt-1" style={{ fontSize: '0.875rem' }}>
                                            {paper.abstract.length > 150 
                                                ? `${paper.abstract.substring(0, 150)}...` 
                                                : paper.abstract
                                            }
                                        </p>
                                    </div>
                                    <div className="row text-center mb-3">
                                        <div className="col-4">
                                            <small className="text-muted d-block">Words</small>
                                            <span className="badge badge-secondary">{paper.word_count}</span>
                                        </div>
                                        <div className="col-4">
                                            <small className="text-muted d-block">File Size</small>
                                            <span className="badge badge-secondary">{paper.file_size}</span>
                                        </div>
                                        <div className="col-4">
                                            <small className="text-muted d-block">Status</small>
                                            <span className={`badge ${
                                                paper.status === 'Pending Review' ? 'badge-warning' :
                                                paper.status === 'Under Review' ? 'badge-info' :
                                                'badge-success'
                                            }`}>
                                                {paper.status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Assigned Reviewers */}
                                    <div className="mb-3">
                                        <h6 className="text-sm font-weight-bold mb-2">
                                            Assigned Reviewers ({getAssignedReviewers(paper.id).length}/4)
                                        </h6>
                                        <div className="assigned-reviewers">
                                            {getAssignedReviewers(paper.id).map(reviewer => (
                                                <div key={reviewer.id} className="d-flex align-items-center justify-content-between p-2 bg-light rounded mb-2">
                                                    <div>
                                                        <strong className="text-sm">{reviewer.name}</strong>
                                                        <br />
                                                        <small className="text-muted">{reviewer.institution}</small>
                                                    </div>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => removeReviewer(paper.id, reviewer.id)}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            ))}
                                            {getAssignedReviewers(paper.id).length === 0 && (
                                                <p className="text-muted text-sm">No reviewers assigned</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Assign Reviewers Button */}
                                    <button
                                        className="btn btn-outline-primary btn-sm w-100"
                                        onClick={() => setSelectedPaper(paper)}
                                        disabled={getAssignedReviewers(paper.id).length >= 4}
                                    >
                                        {getAssignedReviewers(paper.id).length >= 4 
                                            ? 'Maximum Reviewers Assigned' 
                                            : 'Assign Reviewers'
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Papers Message */}
                {filteredPapers.length === 0 && (
                    <div className="text-center py-5">
                        <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
                        <h5 className="text-muted">No papers found</h5>
                        <p className="text-muted">Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>

            {/* Assign Reviewers Modal */}
            {selectedPaper && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Assign Reviewers to Paper</h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={() => setSelectedPaper(null)}
                                >
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                <div className="mb-3">
                                    <h6 className="font-weight-bold">{selectedPaper.title}</h6>
                                    <p className="text-muted mb-0">Author: {selectedPaper.author_name}</p>
                                    <p className="text-muted">Topic: {selectedPaper.topic}</p>
                                </div>
                                
                                <div className="mb-3">
                                    <h6>Available Reviewers</h6>
                                    <div className="row">
                                        {reviewers.map(reviewer => (
                                            <div key={reviewer.id} className="col-md-6 mb-2">
                                                <div className={`card ${isReviewerAssigned(selectedPaper.id, reviewer.id) ? 'border-success' : ''}`}>
                                                    <div className="card-body p-3">
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <div className="flex-grow-1">
                                                                <h6 className="card-title mb-1">{reviewer.name}</h6>
                                                                <p className="text-muted text-sm mb-2">{reviewer.institution}</p>
                                                                <div className="mb-2">
                                                                    {getExpertiseTags(reviewer.expertise)}
                                                                </div>
                                                                <div className="d-flex justify-content-between">
                                                                    <small className="text-muted">
                                                                        Rating: <span className="text-warning">★</span> {reviewer.rating}
                                                                    </small>
                                                                    <small className="text-muted">
                                                                        Reviewed: {reviewer.papers_reviewed}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                            <div className="ml-2">
                                                                {isReviewerAssigned(selectedPaper.id, reviewer.id) ? (
                                                                    <button
                                                                        className="btn btn-sm btn-success"
                                                                        disabled
                                                                    >
                                                                        <i className="fas fa-check"></i> Assigned
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={() => assignReviewer(selectedPaper.id, reviewer.id)}
                                                                        disabled={getAssignedReviewers(selectedPaper.id).length >= 4}
                                                                    >
                                                                        <i className="fas fa-plus"></i> Assign
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedPaper(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Assignment Modal */}
            {showAssignmentModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Bulk Assignment</h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={() => setShowAssignmentModal(false)}
                                >
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="alert alert-info">
                                    <i className="fas fa-info-circle mr-2"></i>
                                    This feature allows you to assign multiple reviewers to multiple papers at once.
                                </div>
                                
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead className="thead-light">
                                            <tr>
                                                <th>Paper</th>
                                                <th>Current Reviewers</th>
                                                <th>Add Reviewers</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {papers.map(paper => (
                                                <tr key={paper.id}>
                                                    <td>
                                                        <strong>{paper.title}</strong><br />
                                                        <small className="text-muted">{paper.author_name}</small>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex flex-wrap gap-1">
                                                            {getAssignedReviewers(paper.id).map(reviewer => (
                                                                <span key={reviewer.id} className="badge badge-success">
                                                                    {reviewer.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <select
                                                            className="form-control form-control-sm"
                                                            multiple
                                                            onChange={(e) => {
                                                                const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                                                                setAssignments(prev => ({
                                                                    ...prev,
                                                                    [paper.id]: selectedOptions
                                                                }));
                                                            }}
                                                            value={assignments[paper.id] || []}
                                                        >
                                                            {reviewers.map(reviewer => (
                                                                <option key={reviewer.id} value={reviewer.id}>
                                                                    {reviewer.name} ({reviewer.institution})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowAssignmentModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        alert('Bulk assignment completed successfully!');
                                        setShowAssignmentModal(false);
                                    }}
                                >
                                    Apply Assignments
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Backdrop */}
            {(selectedPaper || showAssignmentModal) && (
                <div className="modal-backdrop fade show"></div>
            )}
        </AdminLayout>
    );
}
