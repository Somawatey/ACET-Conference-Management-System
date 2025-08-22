import TextArea from "@/Components/TextArea";
import TextInput from '@/Components/TextInput';

export default function PaperInfo({ className = '', data = {}, errors = {}, onChange }) {
    return (
        <div className="mt-8">
            <h1 className="text-lg font-semibold mb-2">Review Paper</h1>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Comments
            </label>
            <TextArea
                className="mt-1 block w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Enter your review comments here..."
            />
            <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
                Review Rating (1-10)
            </label>
            <TextInput className="mt-1 block w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>

        </div>
    );
}