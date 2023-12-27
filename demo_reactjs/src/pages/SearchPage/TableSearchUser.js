import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { getFaceSearch } from '../../services/UserService';
import ReactPaginate from 'react-paginate';
import ModalFaceSearch from '../SearchPage/FaceSearch';


const TableSearchUsers = (props) => {

    const [listUsers, setListUsers] = useState([]);
    const [modal_type, setModalType] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isShowModalSearchFace, setIsShowModalSearchFace] = useState(false);
    
    const PER_PAGE = 4;

    useEffect(() => {
        getUsers();
    }, [])

    const handleClose = () => {
        setIsShowModalSearchFace(false);
    }

    const getUsers = async () => {
        let res = await getFaceSearch();

        if (res && res.data) {
            setListUsers(res.data)
        }
    }

    const handleUpdateTable = async () => {
        await getUsers()
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
                    <td>{item.user_info.introduction}</td>
                    <td>{new Date(item.searched_at + "Z").toLocaleTimeString()}</td>
                    <td><img src={item.face} style={{width: '80px' }} /></td>
                    {/* eslint-disable-next-line */}
                    <td><img src={item.user_info.image} style={{ width: '80px' }} /></td>
                    
                </tr>
            )
        });

    return (<>
        <button className="btn btn-success" onClick={() => {
            setModalType({ mode: "search", data: null })
            setIsShowModalSearchFace(true)
        }}>Face search</button>


        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Full name</th>
                    <th>Introduction</th>
                    <th>Time</th>
                    <th>Face Search</th>
                    <th>Face</th>
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


        <ModalFaceSearch
            data={modal_type}
            show={isShowModalSearchFace}
            handleClose={handleClose}
            handleUpdateTable={handleUpdateTable}
        />


            
    </>)
}

export default TableSearchUsers;


