import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { getTimeSetting, updateTimeSetting } from '../services/TimeSettingService';

// import WebcamDemo from './FaceDetection';;

const ModalTimeSetting = (props) => {
    const { show, handleClose } = props;
    const [hour, setHour] = useState("");
    const [minute, setMinute] = useState("");

    useEffect(() => {
        // Call API get time setting
        getTimeSetting().then((res) => {
            setHour(res.data.hour)
            setMinute(res.data.minute)
        })
    }, [])
    const handleSubmit = async () => {
        try {
            await updateTimeSetting(hour, minute)
            // let res = await postCreateUser(full_name, password, email, introduction);
            // console.log(res)
            handleClose();
            setHour('');
            setMinute('');
            toast.success("Update timeseting success!")
            handleClose()

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
                <Modal.Title>Setting time: </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='body-add-new'>
                    <div className="mb-3">
                        <label className="form-label">Hour: </label>
                        <input type="text" className="form-control" value={hour} onChange={(event) => setHour(event.target.value)} />
                    </div>
                   
                    <div className="mb-3">
                        <label className="form-label">Minute: </label>
                        <input type="text" className="form-control" value={minute} onChange={(event) => setMinute(event.target.value)} />
                    </div>
                   
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => handleSubmit()}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}

export default ModalTimeSetting;