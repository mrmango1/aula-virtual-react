/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../../demo/service/ProductService';
import { Demo } from '../../../../types/types';
import { CursoService } from '../../../../demo/service/CursoService';
import { Dropdown } from 'primereact/dropdown';
import { ProfesorService } from '../../../../demo/service/ProfesorService';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Subject = () => {
    let emptyCurso: Demo.Curso = {
        id: '',
        nombreCurso: '',
    };

    let emptyProfesor: Demo.Profesor = {
        id: '',
        cedula: '',
        nombres: '',
        apellidos: '',
        email: '',
        password: ''
    }

    const [cursos, setCursos] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [curso, setCurso] = useState<Demo.Curso>(emptyCurso);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [profesor, setProfesor] = useState<Demo.Profesor>(emptyProfesor);
    const [profesores, setProfesores] = useState([]);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
      CursoService.getCursos().then((data) => setCursos(data as any));
      ProfesorService.getProfesores().then((data) => setProfesores(data as any));
    }, []);

    const openNew = () => {
        setCurso(emptyCurso);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = async () => {
        setSubmitted(true);

        if (curso.nombreCurso.trim()) {
            let _products = [...(cursos as any)];
            let _product = { ...curso };
            if (curso.id) {
                _product.profesor = profesor.id == '' ? undefined : profesor
                await CursoService.updateCurso(_product);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
                CursoService.getCursos().then((data) => setCursos(data as any));
                setProfesor(emptyProfesor)
            } else {
                _product.profesor = profesor.id == '' ? undefined : profesor
                await CursoService.createCurso(_product);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
                CursoService.getCursos().then((data) => setCursos(data as any));
                setProfesor(emptyProfesor)
            }

            setCursos(_products as any);
            setProductDialog(false);
            setCurso(emptyCurso);
        }
    };

    const editProduct = (product: Demo.Curso) => {
        setCurso({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product: Demo.Curso) => {
        setCurso(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = async () => {
        await CursoService.deleteCurso(curso)
        let _products = (cursos as any)?.filter((val: any) => val.id !== curso.id);
        setCursos(_products);
        setDeleteProductDialog(false);
        setCurso(emptyCurso);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000
        });
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = (cursos as any)?.filter((val: any) => !(selectedProducts as any)?.includes(val));
        setCursos(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000
        });
    };

    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _product = { ...curso };
        _product['category'] = e.value;
        setCurso(_product);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...curso };
        _product[`${name}`] = val;

        setCurso(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const nameBodyTemplate = (rowData: Demo.Curso) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.nombreCurso}
            </>
        );
    };

    const categoryBodyTemplate = (rowData: Demo.Curso) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.profesor?.nombres ?? ''}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Demo.Curso) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administrar Cursos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                    <DataTable
                        ref={dt}
                        value={cursos}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} cursos"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column field="name" header="Nombre de la Asignatura" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="professor" header="Profesor Asignado" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '360px' }} header="Detalles de la Asignatura" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nombre de la Asignatura</label>
                            <InputText
                                id="name"
                                value={curso.nombreCurso}
                                onChange={(e) => onInputChange(e, 'nombreCurso')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !curso.name
                                })}
                            />
                            {submitted && !curso.name && <small className="p-invalid">El nombre es requerido.</small>}
                        </div>

                    <span className="p-float-label">
                        <Dropdown id="dropdown" options={profesores} value={profesor} onChange={(e) => setProfesor(e.value)} optionLabel="nombres"></Dropdown>
                        <label htmlFor="dropdown">Profesores</label>
                    </span>

                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {curso && (
                                <span>
                                    Esta seguro que desea eliminar <b>{curso.nombreCurso}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {curso && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Subject;
