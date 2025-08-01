import { Link } from "@inertiajs/react";

export default function Breadcrumb(props) {
    return (
        <section className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                        <h1>{props?.header}</h1>
                    </div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            {props?.links && (
                                props?.links.map((item, k) => {
                                    return(
                                        item?.url ? 
                                            <li className="breadcrumb-item" key={k}>
                                                <Link href={route('dashboard')} key={k}>{item?.title}</Link>
                                            </li>
                                        : 
                                            <li className="breadcrumb-item active" key={k}>{item?.title}</li>
                                    )
                                })
                            )}
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    );
}