import Breadcrumb from '@/Components/Breadcrumb';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import NavLink from '@/Components/NavLink';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CategoriesCreateEdit({ datas }) {
    const { data, setData, post, patch, errors, reset, processing, recentlySuccessful } =
        useForm({
            name: datas.name ? datas.name : '',
            view_order: datas.view_order ? datas.view_order : '',
        });

    const submit = (e) => {
        e.preventDefault();
        if (!datas.id) {
            post(route('categories.store'), {preserveState: true}, {
                onFinish: () => {
                    reset();
                },
            });
        } else {
            patch(route('categories.update', datas.id), {
                onFinish: () => {
                    reset();
                },
            });
        }
    };

    const headWeb = 'Category Create'
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];
    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />} >
            <Head title={headWeb} />
            <section className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-outline card-info">
                            <div className="card-header">
                                <h3 className="card-title">
                                    Register Data Management
                                </h3>
                            </div>
                            <form onSubmit={submit}>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label className='text-uppercase' htmlFor="title"><span className='text-danger'>*</span>Title</label>
                                        <input
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            type="text"
                                            name="title"
                                            className={`form-control ${errors.name && 'is-invalid'}`}
                                            id="title"
                                        />
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>
                                    <div className="form-group">
                                        <label className='text-uppercase' htmlFor="view_order"><span className='text-danger'>*</span>Order</label>
                                        <input
                                            value={data.view_order}
                                            onChange={(e) => setData('view_order', e.target.value)}
                                            type="number"
                                            name="view_order"
                                            className={`form-control ${errors.view_order && 'is-invalid'}`}
                                            id="view_order"
                                        />
                                        <InputError className="mt-2" message={errors.view_order} />
                                    </div>
                                </div>
                                <div className="card-footer clearfix">
                                    <button disabled={processing} type="submit" className="btn btn-primary">
                                        {processing ? datas?.id ? "Updating..." : "Saving..." : datas?.id ? "Update" : "Save"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}