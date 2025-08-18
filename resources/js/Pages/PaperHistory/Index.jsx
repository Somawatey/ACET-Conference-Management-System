import React, { useEffect, useState } from "react";

export default function PaperHistory({ userId }) {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);

    return (
        <div className="container my-4">
            <h2 className="mb-4">📄 Paper Submission History</h2>

            {papers.length === 0 ? (
                <div className="alert alert-info">
                    No papers have been submitted yet.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>Paper Title</th>
                                <th>Submission Date</th>
                                <th>Status</th>
                                <th>Topic</th>
                                <th>Reviewers</th>
                                <th>Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {papers.map((paper) => (
                                <tr key={paper.id}>
                                    <td>{paper.title}</td>
                                    <td>{new Date(paper.submission_date).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge badge-${paper.status === "Accepted" ? "success" : paper.status === "Rejected" ? "danger" : "warning"}`}>
                                            {paper.status}
                                        </span>
                                    </td>
                                    <td>{paper.topic}</td>
                                    <td>
                                        {paper.reviewers && paper.reviewers.length > 0 ? (
                                            <ul className="mb-0 pl-3">
                                                {paper.reviewers.map((rev) => (
                                                    <li key={rev.id}>
                                                        {rev.name} ({rev.institution})
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="text-muted">No reviewers assigned</span>
                                        )}
                                    </td>
                                    <td>{new Date(paper.updated_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
