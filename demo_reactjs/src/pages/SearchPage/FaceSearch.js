import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import Video from '../UserPage/video';
import {faceSearch} from '../../services/UserService';

const FaceSearch = (props) => {
    const { show, handleClose, handleUpdateTable } = props;
    const handleSaveUser = async () => {
        try {
            let res = await faceSearch(face);
            console.log(res)
            handleClose();
            setFace('');
            toast.success("Search Face Success!")
            handleUpdateTable()

        } catch (err) {
            //error
            console.log(err)
            toast.error("Search Face Error ")
        }
    }

    const [showModal, setShowModal] = useState(false);
    const [face, setFace] = useState(null);
    const handleCapture = (img) => {
        setShowModal(false);
        setFace(img);
    };
    const handleShow = () => setShowModal(true);

    return <>
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Search Face: </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='body-add-new'>
                    <div className="mb-3">
                        <label className="form-label"></label>
                        <Button variant="primary" onClick={handleShow}>Take photo</Button>
                        {showModal && <Video show={showModal} onHide={handleCapture} />}
                        {/* <WebcamDemo /> */}
                        {face && (
                            <div>
                                <img src={face} alt="Captured" style={{ width: '100%' }} />
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
                    Search
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}

export default FaceSearch;