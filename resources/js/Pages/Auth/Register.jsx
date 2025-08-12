import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Head title="Register" />

            <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Left Section - Welcome Back */}
                <div className="w-1/2 bg-blue flex flex-col items-center justify-center p-8 text-white relative overflow-hidden rounded-l-lg">
                    {/* Background shapes - adjust as needed for precise match */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-white bg-opacity-10 rounded-full translate-x-1/2 translate-y-1/2"></div>
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white bg-opacity-10 rounded-md rotate-45"></div>

                    <h2 className="text-4xl font-bold mb-4 z-10">Welcome Back!</h2>
                    <p className="text-center mb-8 z-10">
                        To keep connected with us please login with your personal info
                    </p>
                    <Link href={route('login')} className="z-10">
                        <button className="px-10 py-3 border-2 border-white rounded-full hover:bg-blue-400 transition duration-300">
                            Log In
                        </button>
                    </Link>
                </div>

                {/* Right Section - Create Account Form */}
                <div className="w-1/2 p-8 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-2">
                            <Link href='/' className='w-full flex justify-center'>
                                <img src="/ACET.png" alt="" className='h-10' />
                            </Link>
                        </div>
                        {/* Red triangle top right */}
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-[80px] border-r-[80px] border-t-transparent border-r-red-400 rounded-tr-lg"></div>
                    </div>


                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                        Create Account
                    </h1>

                    {/* Social Login Buttons */}
                    <div className="flex justify-center space-x-4 mb-6">
                        <button className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-300">
                            <i className="fab fa-facebook-f"></i> {/* Font Awesome icon */}
                        </button>
                        <button className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-300">
                            <i className="fab fa-google-plus-g"></i> {/* Font Awesome icon */}
                        </button>
                        <button className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-300">
                            <i className="fab fa-linkedin-in"></i> {/* Font Awesome icon */}
                        </button>
                    </div>

                    <p className="text-center text-gray-500 text-sm mb-4">
                        or use your email for registration:
                    </p>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                autoComplete="name"
                                isFocused={true}
                                placeholder="Name"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                autoComplete="username"
                                placeholder="Email"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                autoComplete="new-password"
                                placeholder="Password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Confirm Password"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex justify-center mt-6">
                            <PrimaryButton
                                className="w-full text-center py-3 text-white rounded-full"
                                disabled={processing}
                            >
                                SIGN UP
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}