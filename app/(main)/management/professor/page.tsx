/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '../../../../types/types';
import { ProfesorService } from '../../../../demo/service/ProfesorService';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Professor = () => {
    let emptyProduct: Demo.Profesor = {
        id: '',
        cedula: '',
        nombres: '',
        apellidos: '',
        email: '',
        password: '',
    };

    const [profesores, setProfesores] = useState(null);
    const [profesorDialog, setProfesorDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [profesor, setProfesor] = useState<Demo.Profesor>(emptyProduct);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        ProfesorService.getProfesores().then((data) => setProfesores(data as any));
    }, []);

    const openNew = () => {
        setProfesor(emptyProduct);
        setSubmitted(false);
        setProfesorDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProfesorDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const saveProduct = async () => {
        setSubmitted(true);

        if (profesor.nombres.trim()) {
            let _products = [...(profesores as any)];
            let _product = { ...profesor };
            if (profesor.id) {
                await ProfesorService.updateProfesor(_product);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
                ProfesorService.getProfesores().then((data) => setProfesores(data as any));
            } else {
                await ProfesorService.createProfesor(_product);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
                ProfesorService.getProfesores().then((data) => setProfesores(data as any));
            }

            setProfesores(_products as any);
            setProfesorDialog(false);
            setProfesor(emptyProduct);
        }
    };

    const editProduct = (product: Demo.Profesor) => {
        setProfesor({ ...product });
        setProfesorDialog(true);
    };

    const confirmDeleteProduct = (product: Demo.Profesor) => {
        setProfesor(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = async () => {
        await ProfesorService.deleteProfesores(profesor)
        let _products = (profesores as any)?.filter((val: any) => val.id !== profesor.id);
        setProfesores(_products);
        setDeleteProductDialog(false);
        setProfesor(emptyProduct);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000
        });
    };

    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _product = { ...profesor };
        _product['category'] = e.value;
        setProfesor(_product);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...profesor };
        _product[`${name}`] = val;

        setProfesor(_product);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _product = { ...profesor };
        _product[`${name}`] = val;

        setProfesor(_product);
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
            <h5 className="m-0">Administrar Profesores</h5>
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
                        value={profesores}
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

                    <Dialog visible={profesorDialog} style={{ width: '450px' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nombres</label>
                            <InputText
                                id="name"
                                value={profesor.nombres}
                                onChange={(e) => onInputChange(e, 'nombres')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !profesor.name
                                })}
                            />
                            {submitted && !profesor.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="lastname">Apellidos</label>
                            <InputText
                                id="lastname"
                                value={profesor.apellidos}
                                onChange={(e) => onInputChange(e, 'apellidos')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !profesor.name
                                })}
                            />
                            {submitted && !profesor.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="cedula">Cedula</label>
                            <InputText
                                id="cedula"
                                value={profesor.cedula}
                                onChange={(e) => onInputChange(e, 'cedula')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !profesor.name
                                })}
                            />
                            {submitted && !profesor.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                value={profesor.email}
                                onChange={(e) => onInputChange(e, 'email')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !profesor.name
                                })}
                            />
                            {submitted && !profesor.name && <small className="p-invalid">Name is required.</small>}
                        </div>

                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {profesor && (
                                <span>
                                    Esta seguro que desea eliminar <b>{profesor.nombres}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default Professor;
