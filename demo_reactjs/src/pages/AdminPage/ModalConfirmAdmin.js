
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteUser } from '../../services/AdminUserService';
import { toast } from 'react-toastify';

const ModalConfirmAdmin = (props) => {
    const { show, handleClose, dataUserDelete, handleUpdateTable } = props;

    const handleDeleteUser = async () => {
        try {
            let res = await deleteUser(dataUserDelete._id);
            console.log(res);
            handleClose();
            toast.success("Deleted success!");
            handleUpdateTable()
        }
        catch (err) {
            console.log(err)
            toast.error("Deleted error")
        }
    }

    return (<>
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Delete User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    Are you sure to delete this user: <b>{dataUserDelete.full_name}</b>?

                    <br />
                    This action can't be undone!
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => handleDeleteUser()}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    </>)
}

export default ModalConfirmAdmin;
