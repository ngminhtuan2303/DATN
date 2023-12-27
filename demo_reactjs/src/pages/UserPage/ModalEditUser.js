import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { putUpdateUser } from '../../services/UserService';
import { toast } from 'react-toastify';
import Video from './video';

const ModalEditUser = (props) => {
    const { show, handleClose, dataUserEdit, handleUpdateTable } = props;
    //const [_id, set_ID] = useState("");
    const [full_name, setFullName] = useState("");
    const [birthday, setBirthday] = useState("");
    const [gender, setGender] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [introduction, setIntroduction] = useState("");

    const handleEditUser = async () => {
        try {
            let res = await putUpdateUser(dataUserEdit._id, full_name, birthday, gender, phone_number, address, email, introduction, image)
            console.log(res)
            setFullName('');
            setBirthday('');
            setGender('');
            setPhoneNumber('');
            setAddress('');
            setEmail('');
            setIntroduction('');
            setImage('');
            handleUpdateTable()
            handleClose();
            toast.success("Edited success!");
        }
        catch (err) {
            console.log(err)
            toast.error("Edited error");
        }

    }

    useEffect(() => {
        if (show) {
            setFullName(dataUserEdit.full_name);
            setBirthday(dataUserEdit.birthday)
            setGender(dataUserEdit.gender)
            setPhoneNumber(dataUserEdit.phone_number)
            setAddress(dataUserEdit.address)
            setEmail(dataUserEdit.email)
            setIntroduction(dataUserEdit.introduction)
            setImage(dataUserEdit.image)
        }
        // eslint-disable-next-line
    }, [dataUserEdit])

    const [showModal, setShowModal] = useState(false);
    const [image, setImage] = useState(null);
    const handleCapture = (img) => {
        setShowModal(false);
        setImage(img);
    };
    const handleShow = () => setShowModal(true);

    return (<>
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Edit user</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='body-add-new'>
                    <div className="mb-3">
                        <label className="form-label">Full name: </label>
                        <input type="text" className="form-control" value={full_name} onChange={(event) => setFullName(event.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Birthday: </label>
                        <input type="datetime-local" className="form-control" value={birthday} onChange={(event) => setBirthday(event.target.value)} />
                    </div>
                    <div className="form-check">
                        <input className="form-check-input1" checked={gender === "male"} type="radio" name="flexRadioDefault" onChange={(event) => setGender("male")} />
                        <label className="form-check-label" value={gender} >
                            Male
                        </label>

                        <input className="form-check-input2" checked={gender === "female"} type="radio" name="flexRadioDefault" onChange={(event) => {
                            console.log("SET GENDER")
                            setGender("female")
                        }} />
                        <label className="form-check-label" value={gender}>
                            Female
                        </label>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Phone number: </label>
                        <input type="text" className="form-control" value={phone_number} onChange={(event) => setPhoneNumber(event.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Address: </label>
                        <input type="text" className="form-control" value={address} onChange={(event) => setAddress(event.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email: </label>
                        <input type="text" className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Introduction: </label>
                        <input type="text" className="form-control" value={introduction} onChange={(event) => setIntroduction(event.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Picture: </label>
                        <Button variant="primary" onClick={handleShow}>Take photo</Button>
                        {showModal && <Video show={showModal} onHide={handleCapture} />}
                        {image && (
                            <div>
                                <img src={image} alt="Captured" style={{ width: '100%' }} />
                            </div>
                        )}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => handleEditUser()}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    </>)
}

export default ModalEditUser;
