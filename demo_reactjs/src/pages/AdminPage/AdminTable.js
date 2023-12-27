
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { fetchAllUser } from '../../services/AdminUserService';
import ReactPaginate from 'react-paginate';
import ModalAddNewAdmin from './ModalAddNewAdmin';
import ModalEditUser from './ModalEditAdminUser';
import ModalConfirm from './ModalConfirmAdmin';


const TableAdminUsers = (props) => {

    const [listUsers, setListUsers] = useState([]);
    const [isShowModalAddNewAdmin, setIsShowModalAddNewAdmin] = useState(false);
    const [isShowModalEditAdmin, setIsShowModalEditAdmin] = useState(false);
    const [modal_type, setModalType] = useState(null);
    const [dataUserEdit, setDataUserEdit] = useState({});
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataUserDelete, setDataUserDelete] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const PER_PAGE = 4;

    useEffect(() => {
        getUsers();
    }, [])

    const handleClose = () => {
        setIsShowModalAddNewAdmin(false);
        setIsShowModalEditAdmin(false);
        setIsShowModalDelete(false);
    }

    const getUsers = async () => {
        let res = await fetchAllUser();

        if (res && res.data) {
            setListUsers(res.data)
        }
    }

    const handleUpdateTable = async () => {
        await getUsers()
    }

    const handleDeleteUser = (user) => {
        setIsShowModalDelete(true);
        setDataUserDelete(user);
    }

    const handleEditUser = (user) => {
        setDataUserEdit(user);
        setIsShowModalEditAdmin(true);
        setModalType({ mode: "edit", data: user })
    }

    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };

    const offset = currentPage * PER_PAGE;
    const currentPageData = listUsers
        .slice(offset, offset + PER_PAGE)
        .map((item, index) => {
            const absoluteIndex = offset + index + 1;
            return (
                <tr key={`users-${index}`}>
                    <td>{absoluteIndex}</td>
                    <td>{item.full_name}</td>
                    <td>{item.password}</td>
                    <td>{item.email}</td>
                    <td>{item.introduction}</td>
                    {/* eslint-disable-next-line */}
                    <td><img src={item.image} style={{ width: '80px' }} /></td>
                    <td>
                        <button className='btn btn-warning mx-1'
                            onClick={() => handleEditUser(item)}
                        >Edit</button>
                        <button className='btn btn-danger'
                            onClick={() => handleDeleteUser(item)}
                        >Delete</button>
                    </td>
                </tr>
            )
        });

    return (<>
        <div className="my-3 add-new">
            <span><b>List Users:</b></span>
            <button className="btn btn-success" onClick={() => {
                setModalType({ mode: "create", data: null })
                setIsShowModalAddNewAdmin(true)
            }}>Add new Admin</button>
        </div>

        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Full name</th>
                    <th>Password</th>
                    <th>Email</th>
                    <th>Introduction</th>
                </tr>
            </thead>
            <tbody>
                {currentPageData}
            </tbody>
        </Table>

        <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={Math.ceil(listUsers.length / PER_PAGE)}
            previousLabel="< previous"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination justify-content-end"
            activeClassName="active"
        />

        <ModalAddNewAdmin
            show={isShowModalAddNewAdmin}
            data={modal_type}
            handleClose={handleClose}
            handleUpdateTable={handleUpdateTable}
        />

        <ModalEditUser
            show={isShowModalEditAdmin}
            dataUserEdit={dataUserEdit}
            handleClose={handleClose}
            handleUpdateTable={handleUpdateTable}
        />

        <ModalConfirm
            show={isShowModalDelete}
            handleClose={handleClose}
            dataUserDelete={dataUserDelete}
            handleUpdateTable={handleUpdateTable}
        />

    </>)
}

export default TableAdminUsers;


