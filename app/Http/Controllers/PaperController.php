<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Pagination\LengthAwarePaginator;

class PaperController extends Controller
{
    public function index(Request $request): Response
    {
        $items = collect([
            ['id' => 1, 'title' => 'AI for Healthcare', 'topic' => 'Artificial Intelligence', 'author_name' => 'Jane Doe', 'link' => 'https://example.com/papers/ai-healthcare.pdf', 'status' => 'Published'],
            ['id' => 2, 'title' => 'Quantum Computing Advances', 'topic' => 'Quantum Computing', 'author_name' => 'John Smith', 'link' => 'https://example.com/papers/quantum-advances.pdf', 'status' => 'Pending'],
            ['id' => 3, 'title' => 'NLP in Low-Resource Languages', 'topic' => 'Natural Language Processing', 'author_name' => 'Alice Johnson', 'link' => 'https://example.com/papers/nlp-low-resource.pdf', 'status' => 'Published'],
            ['id' => 4, 'title' => 'Ethics in AI', 'topic' => 'AI Ethics', 'author_name' => 'Bob Lee', 'link' => 'https://example.com/papers/ethics-ai.pdf', 'status' => 'Rejected'],
            ['id' => 5, 'title' => 'Computer Vision for Robotics', 'topic' => 'Computer Vision', 'author_name' => 'Sara Kim', 'link' => 'https://example.com/papers/cv-robotics.pdf', 'status' => 'Published'],
            ['id' => 6, 'title' => 'Graph Neural Networks', 'topic' => 'Deep Learning', 'author_name' => 'Tom Clark', 'link' => 'https://example.com/papers/gnn-foundations.pdf', 'status' => 'Pending'],
            ['id' => 7, 'title' => 'Federated Learning Systems', 'topic' => 'Machine Learning', 'author_name' => 'Linda Zhou', 'link' => 'https://example.com/papers/federated-learning.pdf', 'status' => 'Published'],
            ['id' => 8, 'title' => 'Edge Computing for IoT', 'topic' => 'IoT', 'author_name' => 'Mark Green', 'link' => 'https://example.com/papers/edge-iot.pdf', 'status' => 'Pending'],
            ['id' => 9, 'title' => 'Secure Multi-Party Computation', 'topic' => 'Security', 'author_name' => 'Nina Patel', 'link' => 'https://example.com/papers/smpc.pdf', 'status' => 'Published'],
            ['id' => 10, 'title' => 'Reinforcement Learning in Games', 'topic' => 'Reinforcement Learning', 'author_name' => 'Owen Gray', 'link' => 'https://example.com/papers/rl-games.pdf', 'status' => 'Rejected'],
            ['id' => 11, 'title' => 'Time Series Forecasting', 'topic' => 'Data Science', 'author_name' => 'Priya Singh', 'link' => 'https://example.com/papers/time-series.pdf', 'status' => 'Published'],
            ['id' => 12, 'title' => 'Explainable AI Methods', 'topic' => 'XAI', 'author_name' => 'Quinn Taylor', 'link' => 'https://example.com/papers/xai-methods.pdf', 'status' => 'Pending'],
            ['id' => 13, 'title' => 'Diffusion Models Overview', 'topic' => 'Generative Models', 'author_name' => 'Rita Gomez', 'link' => 'https://example.com/papers/diffusion-models.pdf', 'status' => 'Published'],
            ['id' => 14, 'title' => 'LLMs for Code', 'topic' => 'Large Language Models', 'author_name' => 'Sam Park', 'link' => 'https://example.com/papers/llms-code.pdf', 'status' => 'Published'],
            ['id' => 15, 'title' => 'Efficient Transformers', 'topic' => 'Deep Learning', 'author_name' => 'Tara Brooks', 'link' => 'https://example.com/papers/efficient-transformers.pdf', 'status' => 'Pending'],
        ]);

        $perPage = (int) $request->get('per_page', 10);
        $page = (int) ($request->get('page', 1));
        $paged = new LengthAwarePaginator(
            $items->forPage($page, $perPage)->values(),
            $items->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return Inertia::render('Paper/Index', [
            'papers' => $paged,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Paper/CreateEdit', ['datas' => null]);
    }

    public function store(Request $request) { return redirect()->route('papers.index'); }

    public function edit($id): Response
    {
        return Inertia::render('Paper/CreateEdit', ['datas' => ['id' => $id]]);
    }

    public function update(Request $request, $id) { return redirect()->route('papers.index'); }

    public function destroy($id) { return back()->with('message', 'Deleted successfully'); }
}