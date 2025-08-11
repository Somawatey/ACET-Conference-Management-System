import Circle from '@/Components/Circle';
import { usePage } from '@inertiajs/react';
import img from '../../../../../public/images/avatar.png';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ProfileInfo() {
    const user = usePage().props.auth.user;

    return (
        <div className="max-w-sm mx-auto">
            <div className="flex justify-center mb-4">
                <Circle size={200} imgSrc={img} />
            </div>

            <div className="mt-4 text-center">
                <PrimaryButton>Upload Profile Image</PrimaryButton>
            </div>

            <div className="mt-6 text-center">
                <table className="w-full table-auto text-left">
                    <tbody>
                        <tr className="border-b border-gray-200">
                            <th className="py-2 pr-4 font-medium text-gray-700">Name:</th>
                            <td className="py-2 text-lg font-semibold text-gray-900">{user.name}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <th className="py-2 pr-4 font-medium text-gray-700">Email:</th>
                            <td className="py-2 text-gray-600">{user.email}</td>
                        </tr>
                        <tr>
                            <th className="py-2 pr-4 font-medium text-gray-700">Role:</th>
                            <td className="py-2">None</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
