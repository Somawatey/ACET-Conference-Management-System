import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import Pagination from "@/Components/Pagination";
import PaperList from "./Partial/PaperList";

export default function ReviewsIndex({ reviews }) {
    // Extract papers from reviews/assignments data
    const papers = Array.isArray(reviews.data)
        ? reviews.data
            .map(review => review.paper)
            .filter(Boolean)
            .map(paper => ({
                ...paper,
                // Add assignment information to paper object
                assignment_status: paper.assignment_status,
                assignment_due_date: paper.assignment_due_date,
                assignment_notes: paper.assignment_notes,
                assigned_by_name: paper.assigned_by_name,
                // Use review_status for the main status display
                status: paper.review_status || 'Pending',
            }))
        : [];

    const [searchTerm, setSearchTerm] = useState("");

    console.log('Papers with assignments:', papers);

    // Filter papers based on search term
    const filteredPapers = papers.filter(paper => 
        paper?.paper_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper?.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper?.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper?.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const headWeb = 'My Assigned Papers';
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];

    return (
        <AdminLayout>
            <Head title="My Assigned Papers" />
            <Breadcrumb title={headWeb} links={linksBreadcrumb} />
            
            <div className="bg-white min-h-screen">
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-semibold text-blue-900 mb-2">
                                    Paper Review Assignments
                                </h1>
                                <p className="text-gray-700">
                                    Papers assigned to you for review
                                </p>
                            </div>
                            
                            {/* Assignment Stats */}
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{papers.length}</div>
                                    <div className="text-sm text-gray-600">Total Assigned</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {papers.filter(p => ['accept', 'accepted'].includes(p.status?.toLowerCase())).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Accepted</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {papers.filter(p => p.status?.toLowerCase() === 'pending').length}
                                    </div>
                                    <div className="text-sm text-gray-600">Pending</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-600">
                                        {papers.filter(p => ['reject', 'rejected'].includes(p.status?.toLowerCase())).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Rejected</div>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="bg-white shadow rounded-lg p-6 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search papers by title, author, or topic..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="text-sm text-gray-600">
                                    {filteredPapers.length} paper(s) found
                                </div>
                            </div>
                        </div>
                        
                        {/* Paper List Table */}
                        <PaperList papers={searchTerm ? filteredPapers : papers} />
                    </div>

                    {/* Pagination */}
                    {reviews.links && (
                        <div className="mt-8 flex justify-center">
                            <Pagination links={reviews.links} />
                        </div>
                    )}
                </main>
            </div>
        </AdminLayout>
    );
}
