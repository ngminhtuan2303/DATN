import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { postCreateUser } from '../../services/UserService';
import { toast } from 'react-toastify';
import Video from './video';
// import WebcamDemo from './FaceDetection';;

const ModalAddNew = (props) => {
    const { show, handleClose, handleUpdateTable } = props;
    const [full_name, setFullName] = useState("");
    const [birthday, setBirthday] = useState("");
    const [gender, setGender] = useState("male");
    const [phone_number, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [introduction, setIntroduction] = useState("");
    const handleSaveUser = async () => {
        try {
            let res = await postCreateUser(full_name, birthday, gender, phone_number, address, email, introduction, image);
            console.log(res)
            handleClose();
            setFullName('');
            setBirthday(new Date());
            setGender("male");
            setPhoneNumber('');
            setAddress('');
            setEmail('');
            setIntroduction('');
            setImage('');
            toast.success("A user is created success!")
            handleUpdateTable()

        } catch (err) {
            //error
            console.log(err)
            toast.error("An error ")
        }
    }

    const [showModal, setShowModal] = useState(false);
    const [image, setImage] = useState(null);
    const handleCapture = (img) => {
        setShowModal(false);
        setImage(img);
    };
    const handleShow = () => setShowModal(true);

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
                        {/* <WebcamDemo /> */}
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
                <Button variant="primary" onClick={() => handleSaveUser()}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}

export default ModalAddNew;