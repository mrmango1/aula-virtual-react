/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '../../../../types/types';
import { EstudianteService } from '../../../../demo/service/EstudianteService';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Student = () => {
    let emptyProduct: Demo.Profesor = {
        id: '',
        cedula: '',
        nombres: '',
        apellidos: '',
        email: '',
        password: '',
    };

    const [estudiantes, setEstudiantes] = useState(null);
    const [estudianteDialog, setEstudianteDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [estudiante, setEstudiante] = useState<Demo.Profesor>(emptyProduct);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        EstudianteService.getEstudiantes().then((data) => setEstudiantes(data as any));
    }, []);

    const openNew = () => {
        setEstudiante(emptyProduct);
        setSubmitted(false);
        setEstudianteDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setEstudianteDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const saveProduct = async () => {
        setSubmitted(true);

        if (estudiante.nombres.trim()) {
            let _products = [...(estudiantes as any)];
            let _product = { ...estudiante };
            if (estudiante.id) {
                await EstudianteService.updateEstudiante(_product);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
                EstudianteService.getEstudiantes().then((data) => setEstudiantes(data as any));
            } else {
                await EstudianteService.createEstudiante(_product);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
                EstudianteService.getEstudiantes().then((data) => setEstudiantes(data as any));
            }

            setEstudiantes(_products as any);
            setEstudianteDialog(false);
            setEstudiante(emptyProduct);
        }
    };

    const editProduct = (product: Demo.Profesor) => {
        setEstudiante({ ...product });
        setEstudianteDialog(true);
    };

    const confirmDeleteProduct = (product: Demo.Profesor) => {
        setEstudiante(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = async () => {
        await EstudianteService.deleteEstudiante(estudiante)
        let _products = (estudiantes as any)?.filter((val: any) => val.id !== estudiante.id);
        setEstudiantes(_products);
        setDeleteProductDialog(false);
        setEstudiante(emptyProduct);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000
        });
    };

    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _product = { ...estudiante };
        _product['category'] = e.value;
        setEstudiante(_product);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...estudiante };
        _product[`${name}`] = val;

        setEstudiante(_product);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _product = { ...estudiante };
        _product[`${name}`] = val;

        setEstudiante(_product);
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

    const nombresBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Nombres</span>
                {rowData.nombres}
            </>
        );
    };

    const apellidosBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Apellidos</span>
                {rowData.apellidos}
            </>
        );
    };

    const cedulaBodyTemplate = (rowData: Demo.Product) => {
      return (
          <>
              <span className="p-column-title">Cedula</span>
              {rowData.cedula}
          </>
      );
  };
  const emailBodyTemplate = (rowData: Demo.Product) => {
    return (
        <>
            <span className="p-column-title">Email</span>
            {rowData.email}
        </>
    );
};


    const actionBodyTemplate = (rowData: Demo.Profesor) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administrar Estudiantes</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
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

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                    <DataTable
                        ref={dt}
                        value={estudiantes}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} profesores"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column field="name" header="Nombres" sortable body={nombresBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="lastname" header="Apellidos" sortable body={apellidosBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="cedula" header="Cedula" sortable body={cedulaBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="email" header="Email" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={estudianteDialog} style={{ width: '450px' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nombres</label>
                            <InputText
                                id="name"
                                value={estudiante.nombres}
                                onChange={(e) => onInputChange(e, 'nombres')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !estudiante.name
                                })}
                            />
                            {submitted && !estudiante.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="lastname">Apellidos</label>
                            <InputText
                                id="lastname"
                                value={estudiante.apellidos}
                                onChange={(e) => onInputChange(e, 'apellidos')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !estudiante.name
                                })}
                            />
                            {submitted && !estudiante.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="cedula">Cedula</label>
                            <InputText
                                id="cedula"
                                value={estudiante.cedula}
                                onChange={(e) => onInputChange(e, 'cedula')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !estudiante.name
                                })}
                            />
                            {submitted && !estudiante.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                value={estudiante.email}
                                onChange={(e) => onInputChange(e, 'email')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !estudiante.name
                                })}
                            />
                            {submitted && !estudiante.name && <small className="p-invalid">Name is required.</small>}
                        </div>

                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {estudiante && (
                                <span>
                                    Esta seguro que desea eliminar <b>{estudiante.nombres}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default Student;
