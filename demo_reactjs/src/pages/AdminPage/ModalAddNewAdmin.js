import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { postCreateUser } from '../../services/AdminUserService';
import { toast } from 'react-toastify';

// import WebcamDemo from './FaceDetection';;

const ModalAddNewAdmin = (props) => {
    const { show, handleClose, handleUpdateTable } = props;
    const [full_name, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [introduction, setIntroduction] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const handleSaveUser = async () => {
        try {
            let res = await postCreateUser(full_name, password, email, introduction);
            console.log(res)
            handleClose();
            setFullName('');
            setPassword('');
            setEmail('');
            setIntroduction('');
            toast.success("A user is created success!")
            handleUpdateTable()

        } catch (err) {
            //error
            console.log(err)
            toast.error("An error ")
        }
    }

    // const [showModal, setShowModal] = useState(false);
    // const [image, setImage] = useState(null);
    // const handleCapture = (img) => {
    //     setShowModal(false);
    //     setImage(img);
    // };
    // const handleShow = () => setShowModal(true);

    return <>
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Add new user: </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='body-add-new'>
                    <div className="mb-3">
                        <label className="form-label">Full name: </label>
                        <input type="text" className="form-control" value={full_name} onChange={(event) => setFullName(event.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password: </label>
                        <input type={showPassword ? "text" : "password"} className="form-control" value={password} onChange={(event) => setPassword(event.target.value)} />
                        <input type="checkbox" className="form-check-input" id="showPasswordCheckbox" onChange={() => setShowPassword(!showPassword)} />
                        <label className="form-check-label" htmlFor="showPasswordCheckbox">Show Password</label>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email: </label>
                        <input type="text" className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Introduction: </label>
                        <input type="text" className="form-control" value={introduction} onChange={(event) => setIntroduction(event.target.value)} />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => handleSaveUser()}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}

export default ModalAddNewAdmin;